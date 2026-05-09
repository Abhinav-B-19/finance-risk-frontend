"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import PageContainer from "@/components/layout/page-container";

import {
  PredictionDetails,
} from "@/types/prediction";

import { getPredictionDetails } from "@/services/prediction-details-service";

import RiskTrendChart from "@/components/charts/risk-trend-chart";

import { toast } from "sonner";

import {
  getRiskBadgeColor,
  getRiskTextColor,
} from "@/lib/risk-utils";

import { formatDateTime } from "@/lib/date-utils";

interface ResultsDashboardProps {
  predictionId: string;
}

const ResultsDashboard = ({
  predictionId,
}: ResultsDashboardProps) => {
  const [predictionData, setPredictionData] =
    useState<PredictionDetails | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPrediction =
      async () => {
        try {
          const response =
            await getPredictionDetails(
              predictionId
            );

          setPredictionData(
            response
          );
        } catch (error) {
          toast.error(
            "Failed to load prediction analytics"
          );

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

          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-40 rounded-2xl border bg-gray-100"
                />
              )
            )}
          </div>

          <div className="h-[500px] rounded-2xl border bg-gray-100" />
        </div>
      </PageContainer>
    );
  }

  if (!predictionData) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">
              📉
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Prediction Not Found
            </h2>

            <p className="mt-3 text-gray-500">
              The requested prediction analytics could not be loaded.
            </p>

            <a
              href="/predict"
              className="mt-8 inline-flex rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
            >
              Generate New Prediction
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }

  const chartData =
    predictionData.forecasts.map(
      (forecast) => ({
        forecastMonth:
          forecast.forecastMonth,

        riskScore:
          forecast.riskScore,
      })
    );

  return (
    <PageContainer>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="space-y-6 lg:space-y-8"
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
            Prediction Results
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Financial Risk Forecast Dashboard
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <p>
              Prediction ID:
              <span className="ml-1 font-semibold text-gray-900">
                {
                  predictionData.predictionId
                }
              </span>
            </p>

            <span>
              •
            </span>

            <p>
              Generated on:
              <span className="ml-1 font-semibold text-gray-900">
                {formatDateTime(
                  predictionData.createdAt
                )}
              </span>
            </p>
          </div>

          <div className="mt-6">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-lg font-bold ${getRiskBadgeColor(
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

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Forecast Months
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              {
                predictionData.summary
                  .forecastMonths
              }
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Highest Risk Score
            </p>

            <h2
              className={`mt-4 text-4xl font-bold ${getRiskTextColor(
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

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Risk Level
            </p>

            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-xl font-bold ${getRiskBadgeColor(
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

        <div className="grid gap-6 xl:grid-cols-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5 lg:p-6 xl:col-span-3">
            <h2 className="text-3xl font-bold">
              Risk Trend Analysis
            </h2>

            <p className="mt-2 text-gray-500">
              Forecasted financial risk progression across future months.
            </p>

            <div className="mt-4 h-[280px] sm:h-[340px] md:h-[400px] lg:h-[450px]">
              <RiskTrendChart
                data={chartData}
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold leading-tight">
              Monthly Forecast Breakdown
            </h2>

            <p className="mt-2 text-gray-500">
              Forecasted financial risk across future months.
            </p>

            <div className="mt-8 space-y-4">
              {predictionData.forecasts.map(
                (forecast) => (
                  <div
                    key={
                      forecast.forecastMonth
                    }
                    className="rounded-2xl border p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold whitespace-nowrap">
                          {
                            forecast.forecastMonth
                          }
                        </h3>

                        <div className="mt-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getRiskBadgeColor(
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
                        <h3
                          className={`text-4xl font-bold ${getRiskTextColor(
                            forecast.riskLevel
                          )}`}
                        >
                          {
                            forecast.riskScore
                          }
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Risk Score
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <h2 className="text-3xl font-bold">
            Risk Insights
          </h2>

          <p className="mt-2 text-gray-500">
            Automated interpretation of financial risk forecasts.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-5">
              <h3 className="text-lg font-semibold">
                Overall Risk Level
              </h3>

              <p className="mt-3 text-gray-600">
                Financial profile currently indicates a{" "}
                <span
                  className={`font-semibold ${getRiskTextColor(
                    predictionData.summary
                      .overallRiskLevel
                  )}`}
                >
                  {
                    predictionData.summary
                      .overallRiskLevel
                  }
                </span>{" "}
                risk pattern.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <h3 className="text-lg font-semibold">
                Forecast Analysis
              </h3>

              <p className="mt-3 text-gray-600">
                Highest projected financial risk score is{" "}
                <span className="font-semibold text-black">
                  {
                    predictionData.summary
                      .highestRiskScore
                  }
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <h3 className="text-lg font-semibold">
                Debt-to-Income Analysis
              </h3>

              <p className="mt-3 text-gray-600">
                Current DTI ratio is{" "}
                <span className="font-semibold text-black">
                {(
                  predictionData.dti * 100
                ).toFixed(1)}
                %
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default ResultsDashboard;