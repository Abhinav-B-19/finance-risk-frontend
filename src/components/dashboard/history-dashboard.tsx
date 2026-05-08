"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import PageContainer from "@/components/layout/page-container";

import { PredictionHistoryItem } from "@/types/prediction";

import { getPredictionHistory } from "@/services/history-service";

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
  const router = useRouter();

  const [history, setHistory] =
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
          return;
        }

        const response =
          await getPredictionHistory(
            userKey
          );

        setHistory(response);
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
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 rounded-2xl border bg-gray-100"
            />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
            Prediction History
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Historical Risk Analytics
          </h1>

          <p className="mt-4 text-gray-600">
            Review previous financial risk predictions and analytics sessions.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">
              No prediction history found
            </h2>

            <p className="mt-3 text-gray-600">
              Generate your first financial prediction to see analytics history.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((item) => (
              <button
                key={item.predictionId}
                onClick={() =>
                  router.push(
                    `/results/${item.predictionId}`
                  )
                }
                className="rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Prediction ID
                      </p>

                      <h2 className="mt-1 text-2xl font-bold">
                        #{item.predictionId}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getRiskBadgeColor(
                          item.overallRiskLevel
                        )}`}
                      >
                        {
                          item.overallRiskLevel
                        }
                      </span>

                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                        {
                          item.forecastMonths
                        }{" "}
                        Months
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      Created on{" "}
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Income
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        ₹
                        {item.income.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Expenses
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        ₹
                        {item.expenses.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Debt
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        ₹
                        {item.debt.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Highest Risk
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {
                          item.highestRiskScore
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default HistoryDashboard;