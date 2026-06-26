import type { ContextWithDb } from "@lightfish/server";
import { ServerError } from "@lightfish/server/shared";
import { desc, eq } from "drizzle-orm";
import { sharesTable } from "../../../../schema/index.ts";

export const method = "GET";

const PAGE_SIZE = 20;

export default async function listPublicShares(c: ContextWithDb) {
  const db = c.get("db");
  if (!db) throw new ServerError("Database not configured", 503);

  const query = c.req.query();
  const page = Math.max(1, Number(query.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const list = await db
    .select({
      slug: sharesTable.slug,
      content: sharesTable.content,
      createdAt: sharesTable.createdAt,
    })
    .from(sharesTable)
    .where(eq(sharesTable.isPublic, true))
    .orderBy(desc(sharesTable.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset);

  return {
    list,
    page,
    pageSize: PAGE_SIZE,
  };
}
