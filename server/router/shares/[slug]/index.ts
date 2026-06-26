import type { ContextWithDb } from "@lightfish/server";
import { ServerError } from "@lightfish/server/shared";
import { and, eq } from "drizzle-orm";
import { sharesTable } from "../../../schema/index.ts";

export const method = ["GET", "DELETE"];

export default async function shareBySlug(c: ContextWithDb) {
  const db = c.get("db");
  if (!db) throw new ServerError("Database not configured", 503);

  const { slug } = c.get("params");
  if (!slug) throw new ServerError("slug 不能为空");

  if (c.req.method === "DELETE") {
    const query = c.req.query();
    const token = query.delete ?? query.token;
    if (!token) throw new ServerError("缺少删除令牌", 401);

    const [deleted] = await db
      .delete(sharesTable)
      .where(and(eq(sharesTable.slug, slug), eq(sharesTable.secretToken, token)))
      .returning({ slug: sharesTable.slug });

    if (!deleted) throw new ServerError("分享不存在或删除令牌无效", 404);
    return { deleted: true };
  }

  const [share] = await db
    .select({
      slug: sharesTable.slug,
      content: sharesTable.content,
      isPublic: sharesTable.isPublic,
      createdAt: sharesTable.createdAt,
    })
    .from(sharesTable)
    .where(eq(sharesTable.slug, slug))
    .limit(1);

  if (!share) throw new ServerError("分享不存在或已删除", 404);

  return share;
}
