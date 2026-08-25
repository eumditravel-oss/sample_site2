import { int, mysqlEnum, mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Private consultation posts submitted from the public contractor inquiry form. */
export const consultationPosts = mysqlTable("consultationPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  applicantName: varchar("applicantName", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  workType: varchar("workType", { length: 80 }).notNull(),
  schedule: varchar("schedule", { length: 80 }).notNull(),
  message: text("message").notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "answered"]).default("pending").notNull(),
  views: int("views").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConsultationPost = typeof consultationPosts.$inferSelect;
export type InsertConsultationPost = typeof consultationPosts.$inferInsert;

/** Metadata for files placed in S3; file bytes are never stored in the database. */
export const consultationAttachments = mysqlTable("consultationAttachments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  fileSize: int("fileSize").notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 512 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const consultationReplies = mysqlTable("consultationReplies", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  body: text("body").notNull(),
  adminUserId: int("adminUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [unique("consultationReplies_postId_unique").on(table.postId)]);

export type ConsultationAttachment = typeof consultationAttachments.$inferSelect;
export type ConsultationReply = typeof consultationReplies.$inferSelect;
