import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createConsultationPost, getConsultationPost, getConsultationReply, incrementConsultationPostViews, listConsultationAttachments, listConsultationPosts, upsertConsultationReply } from "./db";
import { hashConsultationPassword, verifyConsultationPassword } from "./consultationSecurity";
import { storagePut } from "./storage";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

const MAX_ATTACHMENT_COUNT = 3;
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] as const;
const consultationAttachmentInput = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.enum(ALLOWED_ATTACHMENT_TYPES),
  contentBase64: z.string().min(1).max(Math.ceil(MAX_ATTACHMENT_BYTES * 1.38)),
});

function safeAttachmentName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_").slice(-120) || "attachment";
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  consultation: router({
    create: publicProcedure.input(z.object({
      title: z.string().trim().min(2, "상담 제목을 2자 이상 입력해 주세요.").max(160),
      applicantName: z.string().trim().min(2, "성함을 2자 이상 입력해 주세요.").max(80),
      phone: z.string().trim().min(9, "연락처를 확인해 주세요.").max(32),
      location: z.string().trim().min(2, "현장 위치를 입력해 주세요.").max(255),
      workType: z.string().trim().min(1, "공정 유형을 선택해 주세요.").max(80),
      schedule: z.string().trim().min(1, "희망 시기를 선택해 주세요.").max(80),
      message: z.string().trim().min(5, "문의 내용을 5자 이상 입력해 주세요.").max(5000),
      password: z.string().min(4, "비밀번호를 4자 이상 입력해 주세요.").max(64),
      attachments: z.array(consultationAttachmentInput).max(MAX_ATTACHMENT_COUNT, `첨부파일은 최대 ${MAX_ATTACHMENT_COUNT}개까지 등록할 수 있습니다.`).default([]),
    })).mutation(async ({ input }) => {
      const uploadedAttachments = await Promise.all(input.attachments.map(async (attachment) => {
        const data = Buffer.from(attachment.contentBase64, "base64");
        if (!data.length || data.length > MAX_ATTACHMENT_BYTES) throw new TRPCError({ code: "BAD_REQUEST", message: "첨부파일은 개당 2MB 이하로 등록해 주세요." });
        const stored = await storagePut(`consultations/${Date.now()}/${safeAttachmentName(attachment.fileName)}`, data, attachment.mimeType);
        return { fileName: attachment.fileName, mimeType: attachment.mimeType, fileSize: data.length, fileKey: stored.key, fileUrl: stored.url };
      }));
      const id = await createConsultationPost({ title: input.title, applicantName: input.applicantName, phone: input.phone, location: input.location, workType: input.workType, schedule: input.schedule, message: input.message, passwordHash: hashConsultationPassword(input.password) }, uploadedAttachments);
      return { id };
    }),
    list: publicProcedure.input(z.object({ page: z.number().int().min(1).default(1), query: z.string().trim().max(80).default("") })).query(async ({ input }) => {
      const pageSize = 10;
      const result = await listConsultationPosts({ query: input.query, page: input.page, pageSize });
      return { ...result, page: input.page, pageSize, totalPages: Math.max(1, Math.ceil(result.total / pageSize)) };
    }),
    verifyDetail: publicProcedure.input(z.object({ id: z.number().int().positive(), password: z.string().min(1) })).mutation(async ({ input }) => {
      const post = await getConsultationPost(input.id);
      if (!post || !verifyConsultationPassword(input.password, post.passwordHash)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "비밀번호가 일치하지 않습니다." });
      }
      const [attachments, reply] = await Promise.all([listConsultationAttachments(post.id), getConsultationReply(post.id)]);
      await incrementConsultationPostViews(post.id);
      return {
        id: post.id,
        title: post.title,
        applicantName: post.applicantName,
        phone: post.phone,
        location: post.location,
        workType: post.workType,
        schedule: post.schedule,
        message: post.message,
        status: post.status,
        attachments,
        reply: reply ? { body: reply.body, createdAt: reply.createdAt, updatedAt: reply.updatedAt } : null,
        createdAt: post.createdAt,
        views: post.views + 1,
      };
    }),
    upsertReply: adminProcedure.input(z.object({ postId: z.number().int().positive(), body: z.string().trim().min(2, "답변을 2자 이상 입력해 주세요.").max(5000) })).mutation(async ({ ctx, input }) => {
      const post = await getConsultationPost(input.postId);
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "상담 게시글을 찾을 수 없습니다." });
      const reply = await upsertConsultationReply({ postId: input.postId, body: input.body, adminUserId: ctx.user.id });
      return { status: "answered" as const, reply: reply ? { body: reply.body, createdAt: reply.createdAt, updatedAt: reply.updatedAt } : null };
    }),
  }),
});

export type AppRouter = typeof appRouter;
