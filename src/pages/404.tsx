import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-950">
      <h1 className="mb-2 text-6xl font-bold text-gray-300 dark:text-gray-700">
        404
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
        页面不存在
      </p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        回到首页
      </Link>
    </div>
  );
}
