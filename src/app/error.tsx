"use client";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

const ErrorPage = ({
  error,
  reset,
}: ErrorPageProps) => {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-lg rounded-2xl border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
          ⚠️
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-4 text-gray-600">
          An unexpected error occurred while loading the application.
        </p>

        <button
          onClick={reset}
          className="mt-8 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;