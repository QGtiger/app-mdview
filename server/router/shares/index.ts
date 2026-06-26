import type { ContextWithDb } from "@lightfish/server";
import { ServerError } from "@lightfish/server/shared";

import { nanoid } from "nanoid";
import { sharesTable } from "../../schema/index.ts";

export const method = "POST";

const MAX_CONTENT_SIZE = 100 * 1024;

export default async function createShare(c: ContextWithDb) {
  const db = c.get("db");
  if (!db) throw new ServerError("Database not configured", 503);

  const body = await c.req.json<{ content?: string; isPublic?: boolean }>();
  const content = body.content?.trim() ?? "";

  if (!content) throw new ServerError("内容不能为空");
  if (content.length > MAX_CONTENT_SIZE) throw new ServerError("内容超过 100KB 限制");

  const slug = nanoid(8);
  const secretToken = nanoid(32);

  const [share] = await db
    .insert(sharesTable)
    .values({
      slug,
      content,
      isPublic: body.isPublic ?? false,
      secretToken,
    })
    .returning({
      slug: sharesTable.slug,
      content: sharesTable.content,
      isPublic: sharesTable.isPublic,
      createdAt: sharesTable.createdAt,
    });

  return {
    ...share,
    secretToken,
    shareUrl: `/s/${share.slug}`,
    deleteUrl: `/s/${share.slug}?delete=${secretToken}`,
  };
}
