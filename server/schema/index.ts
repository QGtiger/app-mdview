import {
  pgSchema,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

const appSchema = pgSchema("app-mdview");

/**
 * 用户表（预留，v2 用户系统使用）
 */
export const usersTable = appSchema.table("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  displayName: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 50 }),
  remark: varchar({ length: 500 }),
  active: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

/**
 * 分享表
 */
export const sharesTable = appSchema.table("shares", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 16 }).notNull().unique(),
  content: text().notNull(),
  isPublic: boolean().notNull().default(false),
  secretToken: varchar({ length: 64 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp(),
});
