"use client";

import { useEffect, useState } from "react";

import PageContainer from "@/components/layout/page-container";

import {
  PredictionDetails,
  Forecast,
} from "@/types/prediction";

import { getPredictionDetails } from "@/services/prediction-details-service";

interface ResultsDashboardProps {
  predictionId: string;
}

const getRiskTextColor = (
  riskLevel: string
) => {
  switch (riskLevel) {
    case "LOW":
      return "text-green-500";

    case "MEDIUM":
      return "text-yellow-500";

    case "HIGH":
      return "text-red-500";

    default:
      return "text-gray-500";
  }
};

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

const ResultsDashboard = ({
  predictionId,
}: ResultsDashboardProps) => {
  const [predictionData, setPredictionData] =
    useState<PredictionDetails | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response =
          await getPredictionDetails(
            predictionId
          );

        setPredictionData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [predictionId]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 w-40 rounded bg-gray-200" />

            <div className="h-12 w-96 rounded bg-gray-200" />

            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 rounded-2xl border bg-gray-100"
              />
            ))}
          </div>

          <div className="h-96 rounded-2xl border bg-gray-100" />
        </div>
      </PageContainer>
    );
  }

  if (!predictionData) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-24">
          <p className="text-red-500">
            Failed to load prediction data
          </p>
        </div>
      </PageContainer>
    );
  }

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
            Prediction ID:{" "}
            {predictionData.predictionId}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">
              Forecast Months
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {
                predictionData.summary
                  .forecastMonths
              }
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">
              Highest Risk Score
            </p>

            <h2
              className={`mt-3 text-4xl font-bold ${getRiskTextColor(
                predictionData.summary
                  .overallRiskLevel
              )}`}
            >
              {
                predictionData.summary
                  .highestRiskScore
              }
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">
              Risk Level
            </p>

            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-2xl font-bold ${getRiskBadgeColor(
                  predictionData.summary
                    .overallRiskLevel
                )}`}
              >
                {
                  predictionData.summary
                    .overallRiskLevel
                }
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Monthly Forecast Breakdown
            </h2>

            <p className="mt-2 text-gray-600">
              Forecasted financial risk
              across future months.
            </p>
          </div>

          <div className="space-y-4">
            {predictionData.forecasts.map(
              (
                forecast: Forecast
              ) => (
                <div
                  key={
                    forecast.forecastMonth
                  }
                  className="flex items-center justify-between rounded-xl border p-5 transition hover:bg-gray-50"
                >
                  <div>
                    <p className="text-lg font-semibold">
                      {
                        forecast.forecastMonth
                      }
                    </p>

                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getRiskBadgeColor(
                          forecast.riskLevel
                        )}`}
                      >
                        {
                          forecast.riskLevel
                        }
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-3xl font-bold ${getRiskTextColor(
                        forecast.riskLevel
                      )}`}
                    >
                      {
                        forecast.riskScore
                      }
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Risk Score
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ResultsDashboard;