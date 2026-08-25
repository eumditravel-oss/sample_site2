/**
 * Integration coverage for the public consultation workflow.
 * Every created row has a unique test prefix and is removed in afterAll, so no test inquiry remains visible to visitors.
 */
import { afterAll, describe, expect, it } from "vitest";
import { inArray, like } from "drizzle-orm";
import { consultationAttachments, consultationPosts, consultationReplies } from "../drizzle/schema";
import { getDb } from "./db";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const testPrefix = `__consultation_test_${Date.now()}__`;
const testContext = { user: null } as TrpcContext;
const adminTestContext = { user: { id: 999_999, role: "admin" } } as TrpcContext;
const userTestContext = { user: { id: 999_998, role: "user" } } as TrpcContext;
const tinyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9mQAAAABJRU5ErkJggg==";

afterAll(async () => {
  const db = await getDb();
  if (!db) return;
  const posts = await db.select({ id: consultationPosts.id }).from(consultationPosts).where(like(consultationPosts.title, `${testPrefix}%`));
  const ids = posts.map((post) => post.id);
  if (!ids.length) return;
  await db.delete(consultationReplies).where(inArray(consultationReplies.postId, ids));
  await db.delete(consultationAttachments).where(inArray(consultationAttachments.postId, ids));
  await db.delete(consultationPosts).where(inArray(consultationPosts.id, ids));
});

describe("consultation public workflow", () => {
  it("creates attachments, searches, paginates, password-protects, and lets an admin reply", async () => {
    const caller = appRouter.createCaller(testContext);
    const password = "test-password-1234";

    for (let index = 1; index <= 11; index += 1) {
      await caller.consultation.create({
        title: `${testPrefix} ${index}`,
        applicantName: "통합테스트",
        phone: "010-0000-0000",
        location: "서울시 테스트구",
        workType: "보행로·블록 정비",
        schedule: "1주 이내",
        message: "테스트 후 자동으로 정리되는 상담 게시글입니다.",
        password,
        attachments: index === 11 ? [{ fileName: "field-photo.png", mimeType: "image/png", contentBase64: tinyPngBase64 }] : [],
      });
    }

    const firstPage = await caller.consultation.list({ page: 1, query: testPrefix });
    expect(firstPage.items).toHaveLength(10);
    expect(firstPage.total).toBe(11);
    expect(firstPage.totalPages).toBe(2);
    expect(firstPage.items.every((item) => item.status === "pending")).toBe(true);

    const secondPage = await caller.consultation.list({ page: 2, query: testPrefix });
    expect(secondPage.items).toHaveLength(1);

    const searchResult = await caller.consultation.list({ page: 1, query: `${testPrefix} 11` });
    expect(searchResult.items).toHaveLength(1);
    const postId = searchResult.items[0]?.id;
    expect(postId).toBeTypeOf("number");

    await expect(caller.consultation.verifyDetail({ id: postId!, password: "wrong-password" })).rejects.toThrow("비밀번호가 일치하지 않습니다.");
    const detail = await caller.consultation.verifyDetail({ id: postId!, password });
    expect(detail.title).toBe(`${testPrefix} 11`);
    expect(detail.message).toContain("자동으로 정리");
    expect(detail.views).toBe(1);
    expect(detail.attachments).toHaveLength(1);
    expect(detail.attachments[0]?.fileName).toBe("field-photo.png");
    expect(detail.reply).toBeNull();

    const userCaller = appRouter.createCaller(userTestContext);
    await expect(userCaller.consultation.upsertReply({ postId: postId!, body: "권한이 없는 답변입니다." })).rejects.toThrow("You do not have required permission");

    const adminCaller = appRouter.createCaller(adminTestContext);
    const replyResult = await adminCaller.consultation.upsertReply({ postId: postId!, body: "현장 조건을 검토한 뒤 연락드리겠습니다." });
    expect(replyResult.status).toBe("answered");

    const answeredDetail = await caller.consultation.verifyDetail({ id: postId!, password });
    expect(answeredDetail.status).toBe("answered");
    expect(answeredDetail.reply?.body).toContain("검토한 뒤");
  });
});
