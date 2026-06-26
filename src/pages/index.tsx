import { apiRequest } from "@lightfish/server/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import type { CreateShareResponse, Share } from "@/types/share";

const MAX_CONTENT_SIZE = 100 * 1024;

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1].trim() ?? "未命名分享";
}

function extractExcerpt(content: string): string {
  const plain = content
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*`>|-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.slice(0, 150) + (plain.length > 150 ? "..." : "");
}

export default function HomePage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publicShares, setPublicShares] = useState<Share[]>([]);
  const [loadingShares, setLoadingShares] = useState(true);

  useEffect(() => {
    apiRequest<{ list: Share[] }>("/shares/public/list")
      .then((res) => {
        if (res.success && res.data) {
          setPublicShares(res.data.list);
        }
      })
      .finally(() => setLoadingShares(false));
  }, []);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CONTENT_SIZE) {
      alert("内容超过 100KB 限制");
      return;
    }

    setSubmitting(true);
    const res = await apiRequest<CreateShareResponse>("/shares", {
      method: "POST",
      data: { content: trimmed, isPublic },
    });
    setSubmitting(false);

    if (res.success && res.data) {
      navigate("/create/success", { state: res.data });
    } else {
      alert(res.message ?? "创建失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="mb-2 text-2xl font-bold">分享 AI 回复</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            粘贴 Markdown 内容，生成一个可公开访问的渲染链接。
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在这里粘贴 Markdown..."
                className="min-h-[360px] w-full resize-none rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950"
              />
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  公开到广场
                </label>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !content.trim()}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "生成中..." : "生成分享链接"}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                实时预览
              </div>
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <div className="text-sm text-gray-400 dark:text-gray-600">
                  左侧输入内容后，这里会显示渲染效果
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">公开广场</h2>
          {loadingShares ? (
            <div className="text-sm text-gray-500">加载中...</div>
          ) : publicShares.length === 0 ? (
            <div className="text-sm text-gray-500">还没有公开分享</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {publicShares.map((share) => (
                <Link
                  key={share.slug}
                  to={`/s/${share.slug}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <h3 className="mb-2 font-semibold line-clamp-1">
                    {extractTitle(share.content)}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600 line-clamp-3 dark:text-gray-400">
                    {extractExcerpt(share.content)}
                  </p>
                  <time className="text-xs text-gray-400 dark:text-gray-600">
                    {new Date(share.createdAt).toLocaleString()}
                  </time>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
