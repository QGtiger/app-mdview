import { apiRequest } from "@lightfish/server/api";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { CreateShareResponse } from "@/types/share";
import { addMyShare } from "@/utils/storage";

export default function CreateSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const share = location.state as CreateShareResponse | null;
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!share) {
      navigate("/");
      return;
    }
    addMyShare({
      slug: share.slug,
      secretToken: share.secretToken,
      createdAt: share.createdAt,
    });
  }, [share, navigate]);

  if (!share) return null;

  const shareUrl = `${window.location.origin}/s/${share.slug}`;

  const copy = async (type: "share" | "delete") => {
    const text = type === "share" ? shareUrl : `${window.location.origin}${share.deleteUrl}`;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这个分享吗？删除后无法恢复。")) return;
    setDeleting(true);
    const res = await apiRequest(`/shares/${share.slug}?delete=${share.secretToken}`, {
      method: "DELETE",
    });
    setDeleting(false);

    if (res.success) {
      alert("已删除");
      navigate("/");
    } else {
      alert(res.message ?? "删除失败");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">🎉</div>
          <h1 className="text-2xl font-bold">分享已创建</h1>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            分享链接
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <button
              onClick={() => copy("share")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              {copied === "share" ? "已复制" : "复制"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            删除链接（请妥善保存）
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={`${window.location.origin}${share.deleteUrl}`}
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <button
              onClick={() => copy("delete")}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              {copied === "delete" ? "已复制" : "复制"}
            </button>
          </div>
          <p className="mt-1 text-xs text-red-500">
            丢失删除链接后将无法删除该分享。
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to={`/s/${share.slug}`}
            className="rounded-lg bg-blue-600 py-2.5 text-center text-white hover:bg-blue-700"
          >
            查看分享页
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-300 py-2.5 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-950"
          >
            {deleting ? "删除中..." : "立即删除"}
          </button>
          <Link
            to="/"
            className="rounded-lg py-2.5 text-center text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
