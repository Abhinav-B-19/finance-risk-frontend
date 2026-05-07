import PageContainer from "@/components/layout/page-container";
import Link from "next/link";

export default function Home() {
  return (
    <section className="py-24">
      <PageContainer>
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            AI-Powered Financial Intelligence
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Forecast Financial Risk Before It Happens
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Predict future financial distress using AI-driven forecasting,
            risk analysis, and intelligent financial insights.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/predict"
              className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
            >
              Start Prediction
            </Link>

            <Link
              href="/history"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 transition hover:bg-gray-100"
            >
              View History
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}