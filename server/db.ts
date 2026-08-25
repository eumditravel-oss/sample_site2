import { desc, eq, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { consultationAttachments, consultationPosts, consultationReplies, InsertConsultationPost, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export type ConsultationCreateInput = Pick<InsertConsultationPost, "title" | "applicantName" | "phone" | "location" | "workType" | "schedule" | "message" | "passwordHash">;
export type ConsultationAttachmentInput = { fileName: string; mimeType: string; fileSize: number; fileKey: string; fileUrl: string };

function requireDatabase<T>(database: T | null): T {
  if (!database) throw new Error("상담 데이터베이스에 연결할 수 없습니다.");
  return database;
}

export async function createConsultationPost(input: ConsultationCreateInput, attachments: ConsultationAttachmentInput[] = []) {
  const db = requireDatabase(await getDb());
  return db.transaction(async (transaction) => {
    const result = await transaction.insert(consultationPosts).values(input);
    const postId = Number(result[0].insertId);
    if (attachments.length) await transaction.insert(consultationAttachments).values(attachments.map((attachment) => ({ postId, ...attachment })));
    return postId;
  });
}

export async function listConsultationPosts({ query, page, pageSize }: { query: string; page: number; pageSize: number }) {
  const db = requireDatabase(await getDb());
  const whereClause = query ? like(consultationPosts.title, `%${query}%`) : undefined;
  const selectItems = db
    .select({ id: consultationPosts.id, title: consultationPosts.title, status: consultationPosts.status, createdAt: consultationPosts.createdAt, views: consultationPosts.views })
    .from(consultationPosts)
    .where(whereClause)
    .orderBy(desc(consultationPosts.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  const selectCount = db.select({ total: sql<number>`count(*)` }).from(consultationPosts).where(whereClause);
  const [items, countRows] = await Promise.all([selectItems, selectCount]);
  return { items, total: Number(countRows[0]?.total ?? 0) };
}

export async function getConsultationPost(id: number) {
  const db = requireDatabase(await getDb());
  const result = await db.select().from(consultationPosts).where(eq(consultationPosts.id, id)).limit(1);
  return result[0];
}

export async function incrementConsultationPostViews(id: number) {
  const db = requireDatabase(await getDb());
  await db.update(consultationPosts).set({ views: sql`${consultationPosts.views} + 1` }).where(eq(consultationPosts.id, id));
}

export async function listConsultationAttachments(postId: number) {
  const db = requireDatabase(await getDb());
  return db.select({ id: consultationAttachments.id, fileName: consultationAttachments.fileName, mimeType: consultationAttachments.mimeType, fileSize: consultationAttachments.fileSize, fileUrl: consultationAttachments.fileUrl }).from(consultationAttachments).where(eq(consultationAttachments.postId, postId)).orderBy(desc(consultationAttachments.id));
}

export async function getConsultationReply(postId: number) {
  const db = requireDatabase(await getDb());
  const result = await db.select().from(consultationReplies).where(eq(consultationReplies.postId, postId)).limit(1);
  return result[0];
}

export async function upsertConsultationReply({ postId, body, adminUserId }: { postId: number; body: string; adminUserId: number }) {
  const db = requireDatabase(await getDb());
  await db.transaction(async (transaction) => {
    await transaction.insert(consultationReplies).values({ postId, body, adminUserId }).onDuplicateKeyUpdate({ set: { body, adminUserId, updatedAt: new Date() } });
    await transaction.update(consultationPosts).set({ status: "answered" }).where(eq(consultationPosts.id, postId));
  });
  return getConsultationReply(postId);
}
