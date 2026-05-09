"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import PageContainer from "@/components/layout/page-container";

import { getPredictionHistory } from "@/services/history-service";

import { PredictionHistoryItem } from "@/types/prediction";

const getRiskBadgeColor = (
  riskLevel: string
) => {
  switch (riskLevel) {
    case "LOW":
      return "bg-green-100 text-green-700";

    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";

    case "HIGH":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const HistoryDashboard = () => {
  const [historyData, setHistoryData] =
    useState<
      PredictionHistoryItem[]
    >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userKey =
          localStorage.getItem(
            "userKey"
          );

        if (!userKey) {
          setHistoryData([]);
          return;
        }

        const response =
          await getPredictionHistory(
            userKey
          );

        setHistoryData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 w-40 rounded bg-gray-200" />

            <div className="h-12 w-80 rounded bg-gray-200" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 rounded-2xl border bg-gray-100"
              />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (historyData.length === 0) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">
              📊
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No Prediction History
            </h2>

            <p className="mt-3 text-gray-500">
              Generate your first financial prediction to start building analytics history.
            </p>

            <a
              href="/predict"
              className="mt-8 inline-flex rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
            >
              Create Prediction
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
            Prediction History
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Financial Analytics History
          </h1>

          <p className="mt-4 text-gray-600">
            Review previous prediction analytics and financial risk forecasts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {historyData.map(
            (prediction) => (
              <Link
                key={
                  prediction.predictionId
                }
                href={`/results/${prediction.predictionId}`}
              >
                <div className="h-full rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Prediction ID
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">
                        #
                        {
                          prediction.predictionId
                        }
                      </h2>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRiskBadgeColor(
                        prediction.overallRiskLevel
                      )}`}
                    >
                      {
                        prediction.overallRiskLevel
                      }
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Highest Risk
                      </p>

                      <p className="font-semibold">
                        {
                          prediction.highestRiskScore
                        }
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        DTI Ratio
                      </p>

                      <p className="font-semibold">
                        {prediction.dti}%
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Forecast Months
                      </p>

                      <p className="font-semibold">
                        {
                          prediction.forecastMonths
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <p className="text-xs text-gray-500">
                      Generated on
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {new Date(
                        prediction.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default HistoryDashboard;