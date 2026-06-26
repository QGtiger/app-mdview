import { apiRequest } from "@lightfish/server/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import type { Share } from "@/types/share";

export default function SharePage() {
  const { slug } = useParams<{ slug: string }>();
  const [share, setShare] = useState<Share | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    apiRequest<Share>(`/shares/${slug}`)
      .then((res) => {
        if (res.success && res.data) {
          setShare(res.data);
        } else {
          setError(res.message ?? "分享不存在或已删除");
        }
      })
      .catch(() => setError("加载失败"))
      .finally(() => setLoading(false));
  }, [slug]);

  const copy = async (type: "link" | "markdown") => {
    if (!share) return;
    const text =
      type === "link"
        ? `${window.location.origin}/s/${share.slug}`
        : share.content;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error || !share) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-950">
        <h1 className="mb-2 text-2xl font-bold">分享不存在或已删除</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          该链接可能已过期，或被创建者删除。
        </p>
        <Link
          to="/"
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          创建新分享
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="text-lg font-bold">
            MdView
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => copy("link")}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {copied === "link" ? "已复制链接" : "复制链接"}
            </button>
            <button
              onClick={() => copy("markdown")}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {copied === "markdown" ? "已复制原文" : "复制 Markdown"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <article className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <MarkdownRenderer content={share.content} />
        </article>
        <div className="mt-6 text-center text-xs text-gray-400">
          创建于 {new Date(share.createdAt).toLocaleString()}
        </div>
      </main>
    </div>
  );
}
