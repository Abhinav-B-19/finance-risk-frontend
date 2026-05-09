import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="text-8xl">
          🔍
        </div>

        <h1 className="mt-8 text-5xl font-bold tracking-tight">
          Page Not Found
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/predict"
            className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Go to Predict
          </Link>

          <Link
            href="/history"
            className="rounded-xl border px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Open History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;