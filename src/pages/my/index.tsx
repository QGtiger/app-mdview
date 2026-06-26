import { apiRequest } from "@lightfish/server/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import type { LocalShare } from "@/types/share";
import { getMyShares, removeMyShare } from "@/utils/storage";

export default function MySharesPage() {
  const [shares, setShares] = useState<LocalShare[]>(() => getMyShares());

  const handleDelete = async (share: LocalShare) => {
    if (!confirm("确定删除这个分享吗？")) return;

    const res = await apiRequest(`/shares/${share.slug}?delete=${share.secretToken}`, {
      method: "DELETE",
    });

    if (res.success) {
      removeMyShare(share.slug);
      setShares(getMyShares());
    } else {
      alert(res.message ?? "删除失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">我的分享</h1>

        {shares.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              当前浏览器还没有创建过分享
            </p>
            <Link
              to="/"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              去创建
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
            {shares.map((share) => (
              <div
                key={share.slug}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <Link
                    to={`/s/${share.slug}`}
                    className="font-medium hover:text-blue-600"
                  >
                    /s/{share.slug}
                  </Link>
                  <div className="text-xs text-gray-500">
                    {new Date(share.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/s/${share.slug}`}
                    className="rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    查看
                  </Link>
                  <button
                    onClick={() => handleDelete(share)}
                    className="rounded-md bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
