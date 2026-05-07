"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import PageContainer from "@/components/layout/page-container";

import { PredictionResponse } from "@/types/prediction";

const ResultsDashboard = () => {
  const searchParams = useSearchParams();

  const userKey = searchParams.get("userKey");

  const [predictionData, setPredictionData] =
    useState<PredictionResponse | null>(null);

  useEffect(() => {
    const storedData =
      localStorage.getItem("predictionResult");

    if (storedData) {
      setPredictionData(JSON.parse(storedData));
    }
  }, []);

  if (!predictionData) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-500">
            Loading prediction results...
          </p>
        </div>
      </PageContainer>
    );
  }

  const forecastMonths = Object.keys(
    predictionData.predictions
  ).length;

  const highestRiskScore = Math.max(
    ...Object.values(
      predictionData.predictions
    ).map((item) => item.risk_score)
  );

  const riskLevel = Object.values(
    predictionData.predictions
  )[0]?.risk_level;

  return (
    <PageContainer>
      <div className="space-y-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
            Prediction Results
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Financial Risk Forecast Dashboard
          </h1>

          <p className="mt-4 text-gray-600">
            User Key: {userKey}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">
              Forecast Months
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {forecastMonths}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">
              Highest Risk Score
            </p>

            <h2 className="mt-3 text-4xl font-bold text-red-500">
              {highestRiskScore}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">
              Risk Level
            </p>

            <h2 className="mt-3 text-4xl font-bold text-red-500">
              {riskLevel}
            </h2>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Monthly Forecast Breakdown
            </h2>

            <p className="mt-2 text-gray-600">
              Forecasted financial risk across future months.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(
              predictionData.predictions
            ).map(([month, forecast]) => (
              <div
                key={month}
                className="flex items-center justify-between rounded-xl border p-5 transition hover:bg-gray-50"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {month}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Risk Level:{" "}
                    <span className="font-medium text-red-500">
                      {forecast.risk_level}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-red-500">
                    {forecast.risk_score}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Risk Score
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ResultsDashboard;