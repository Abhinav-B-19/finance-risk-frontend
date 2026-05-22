"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  getActiveUser,
  USER_SESSION_CHANGED_EVENT,
} from "@/lib/user-session";

import { getPredictionHistory } from "@/services/history-service";

import { getHistoryAnalytics } from "@/services/history-analytics-service";

import {
  ActiveUserSession,
  HistoryAnalytics,
  PredictionHistoryItem,
  HistoryTrendPoint,
  FutureRiskForecast,
} from "@/types/prediction";

import HistoryRiskTrendChart from "@/components/charts/history-risk-trend-chart";

import HistoryDtiTrendChart from "@/components/charts/history-dti-trend-chart";

import FutureRiskForecastChart from "@/components/charts/future-risk-forecast-chart";

type HistoryPeriod = "1M" | "3M" | "6M" | "ALL";

const historyPeriods: HistoryPeriod[] = [
  "1M",
  "3M",
  "6M",
  "ALL",
];

const HistoryPage = () => {
  const router = useRouter();

  const [activeUser, setActiveUser] =
    useState<ActiveUserSession | null>(
      null
    );

  const [history, setHistory] =
    useState<PredictionHistoryItem[]>(
      []
    );

  const [analytics, setAnalytics] =
    useState<HistoryAnalytics | null>(
      null
    );

  const [selectedPeriod, setSelectedPeriod] =
    useState<HistoryPeriod>("1M");

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadHistoryDashboard = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const currentUser = getActiveUser();

      setActiveUser(currentUser);

      if (!currentUser) {
        setHistory([]);
        setAnalytics(null);
        return;
      }

      const historyData =
        await getPredictionHistory(
          currentUser.userKey
        );

      setHistory(historyData);

      try {
        const analyticsData =
          await getHistoryAnalytics(
            currentUser.userKey
          );

        setAnalytics(analyticsData);
      } catch (analyticsError) {
        console.error(analyticsError);

        setAnalytics(null);

        setErrorMessage(
          "History loaded, but analytics data is not available yet."
        );
      }
    } catch (error) {
      console.error(error);

      setHistory([]);
      setAnalytics(null);

      setErrorMessage(
        "Unable to load history dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoryDashboard();

    const handleSessionChanged = () => {
      loadHistoryDashboard();
    };

    window.addEventListener(
      USER_SESSION_CHANGED_EVENT,
      handleSessionChanged
    );

    return () => {
      window.removeEventListener(
        USER_SESSION_CHANGED_EVENT,
        handleSessionChanged
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRiskLevel = (
    riskScore: number
  ) => {
    if (riskScore >= 70) {
      return "HIGH";
    }

    if (riskScore >= 40) {
      return "MEDIUM";
    }

    return "LOW";
  };

  const getRiskBadgeClass = (
    riskLevel: string
  ) => {
    const normalizedRisk =
      riskLevel?.toUpperCase();

    if (normalizedRisk === "HIGH") {
      return "bg-red-100 text-red-700";
    }

    if (normalizedRisk === "MEDIUM") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getRiskTextClass = (
    riskLevel: string
  ) => {
    const normalizedRisk =
      riskLevel?.toUpperCase();

    if (normalizedRisk === "HIGH") {
      return "text-red-600";
    }

    if (normalizedRisk === "MEDIUM") {
      return "text-yellow-600";
    }

    return "text-green-600";
  };

  const getPeriodMonths = (
    period: HistoryPeriod
  ) => {
    if (period === "1M") {
      return 1;
    }

    if (period === "3M") {
      return 3;
    }

    if (period === "6M") {
      return 6;
    }

    return null;
  };

  const filterHistoryByPeriod = (
    data: HistoryTrendPoint[],
    period: HistoryPeriod
  ) => {
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );

    if (period === "ALL") {
      return sortedData;
    }

    const months =
      getPeriodMonths(period);

    if (!months) {
      return sortedData;
    }

    const latestDate =
      sortedData.length > 0
        ? new Date(
            sortedData[
              sortedData.length - 1
            ].createdAt
          )
        : new Date();

    const cutoffDate = new Date(
      latestDate
    );

    cutoffDate.setMonth(
      cutoffDate.getMonth() - months
    );

    return sortedData.filter((item) => {
      const itemDate = new Date(
        item.createdAt
      );

      return itemDate >= cutoffDate;
    });
  };

  const generateFutureForecast = (
    data: HistoryTrendPoint[]
  ): FutureRiskForecast[] => {
    if (!data || data.length === 0) {
      return [];
    }

    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );

    const riskScores = sortedData.map(
      (item) =>
        Number(item.highestRiskScore ?? 0)
    );

    const latestRiskScore =
      riskScores[riskScores.length - 1];

    let averageChange = 0;

    if (riskScores.length >= 2) {
      const changes = [];

      for (
        let index = 1;
        index < riskScores.length;
        index++
      ) {
        changes.push(
          riskScores[index] -
            riskScores[index - 1]
        );
      }

      averageChange =
        changes.reduce(
          (sum, value) => sum + value,
          0
        ) / changes.length;
    }

    const latestHistoryDate = new Date(
      sortedData[
        sortedData.length - 1
      ].createdAt
    );

    return [1, 2, 3].map(
      (monthOffset) => {
        const forecastDate = new Date(
          latestHistoryDate
        );

        forecastDate.setMonth(
          forecastDate.getMonth() +
            monthOffset
        );

        const projectedRisk =
          latestRiskScore +
          averageChange * monthOffset;

        const boundedRiskScore =
          Math.min(
            100,
            Math.max(0, projectedRisk)
          );

        const predictedRiskScore =
          Number(
            boundedRiskScore.toFixed(2)
          );

        return {
          forecastMonth:
            forecastDate.toLocaleDateString(
              "en-IN",
              {
                month: "short",
                year: "numeric",
              }
            ),
          predictedRiskScore,
          predictedRiskLevel:
            getRiskLevel(
              predictedRiskScore
            ),
        };
      }
    );
  };

  const filteredHistoricalTrend =
    useMemo(() => {
      if (!analytics?.historicalTrend) {
        return [];
      }

      return filterHistoryByPeriod(
        analytics.historicalTrend,
        selectedPeriod
      );
    }, [analytics, selectedPeriod]);

  const periodBasedFutureForecast =
    useMemo(() => {
      return generateFutureForecast(
        filteredHistoricalTrend
      );
    }, [filteredHistoricalTrend]);

  const filteredKpis = useMemo(() => {
    if (
      !filteredHistoricalTrend ||
      filteredHistoricalTrend.length === 0
    ) {
      return {
        totalPredictions: 0,
        averageRiskScore: 0,
        highestRiskScore: 0,
        latestRiskLevel: "--",
      };
    }

    const totalPredictions =
      filteredHistoricalTrend.length;

    const averageRiskScore =
      filteredHistoricalTrend.reduce(
        (sum, item) =>
          sum +
          Number(
            item.highestRiskScore ?? 0
          ),
        0
      ) / totalPredictions;

    const highestRiskScore = Math.max(
      ...filteredHistoricalTrend.map(
        (item) =>
          Number(
            item.highestRiskScore ?? 0
          )
      )
    );

    const latestTrendPoint = [
      ...filteredHistoricalTrend,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )[0];

    return {
      totalPredictions,
      averageRiskScore:
        Number(
          averageRiskScore.toFixed(2)
        ),
      highestRiskScore:
        Number(
          highestRiskScore.toFixed(2)
        ),
      latestRiskLevel:
        latestTrendPoint
          ?.overallRiskLevel ??
        getRiskLevel(highestRiskScore),
    };
  }, [filteredHistoricalTrend]);

  const handleOpenPrediction = (
    predictionId: number
  ) => {
    router.push(
      `/results/${predictionId}`
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">
              Loading history dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!activeUser) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <section className="rounded-3xl border bg-white p-8 shadow-sm">
            <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
              Financial Analytics History
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              No active user found. Please
              create a prediction first to
              view history and analytics.
            </p>

            <button
              onClick={() =>
                router.push(
                  "/predict?mode=new-user"
                )
              }
              className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Create Prediction
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <section className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-6xl">
            Financial Analytics History
          </h1>

          <p className="mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
            Review previous prediction
            analytics, financial risk
            trends, and future forecasts.
          </p>
        </section>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            {errorMessage}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Current User
              </p>

              <h2 className="mt-1 text-3xl font-bold text-gray-950">
                {activeUser.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {activeUser.email}
              </p>

              <p className="mt-4 text-xs text-gray-500">
                To switch users, use the
                Switch option in the navbar.
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Predictions
                </p>

                <h3 className="mt-3 text-4xl font-bold text-gray-950">
                  {
                    filteredKpis.totalPredictions
                  }
                </h3>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Average Risk
                </p>

                <h3 className="mt-3 text-4xl font-bold text-gray-950">
                  {filteredKpis.averageRiskScore.toFixed(
                    2
                  )}
                </h3>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Highest Risk
                </p>

                <h3 className="mt-3 text-4xl font-bold text-gray-950">
                  {filteredKpis.highestRiskScore.toFixed(
                    2
                  )}
                </h3>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Latest Risk Level
                </p>

                <h3
                  className={`mt-3 text-4xl font-bold ${getRiskTextClass(
                    filteredKpis.latestRiskLevel
                  )}`}
                >
                  {
                    filteredKpis.latestRiskLevel
                  }
                </h3>
              </div>
            </section>

            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Historical Analysis
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-950">
                    Period Based Risk Review
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                    Historical charts, KPI
                    cards, DTI movement, and
                    future forecast are
                    recalculated using the
                    selected period.
                  </p>
                </div>

                <div className="flex w-full rounded-full border bg-gray-100 p-1 shadow-inner sm:w-auto">
                  {historyPeriods.map(
                    (period) => {
                      const isActive =
                        selectedPeriod ===
                        period;

                      return (
                        <button
                          key={period}
                          onClick={() =>
                            setSelectedPeriod(
                              period
                            )
                          }
                          className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold transition sm:flex-none ${
                            isActive
                              ? "bg-black text-white shadow-sm"
                              : "text-gray-500 hover:bg-white hover:text-black"
                          }`}
                        >
                          {period === "ALL"
                            ? "All"
                            : period}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-950">
                  Historical Risk Trend
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Highest risk score across
                  previous predictions for
                  the selected period.
                </p>
              </div>

              {filteredHistoricalTrend.length >
              0 ? (
                <HistoryRiskTrendChart
                  data={
                    filteredHistoricalTrend
                  }
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-500">
                  No risk trend data
                  available for this period.
                </div>
              )}
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-950">
                    DTI Trend
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Debt-to-income movement
                    from past inputs for the
                    selected period.
                  </p>
                </div>

                {filteredHistoricalTrend.length >
                0 ? (
                  <HistoryDtiTrendChart
                    data={
                      filteredHistoricalTrend
                    }
                  />
                ) : (
                  <div className="flex h-[280px] items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-500">
                    No DTI trend data
                    available for this
                    period.
                  </div>
                )}
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-950">
                    Future Risk Forecast
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Next 3-month risk
                    projection based on the
                    selected historical
                    period.
                  </p>
                </div>

                {periodBasedFutureForecast.length >
                0 ? (
                  <FutureRiskForecastChart
                    data={
                      periodBasedFutureForecast
                    }
                  />
                ) : (
                  <div className="flex h-[280px] items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-500">
                    No future forecast
                    available for this
                    period.
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-950">
                    Past Predictions
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Existing prediction
                    history cards.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  {history.length}
                </span>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="rounded-3xl border bg-white p-6 text-sm text-gray-500 shadow-sm">
                No prediction history found
                for this active user.
              </div>
            ) : (
              <div className="grid max-h-none grid-cols-1 gap-4 xl:max-h-[1180px] xl:overflow-y-auto xl:pr-2">
                {history.map((item) => (
                  <button
                    key={item.predictionId}
                    onClick={() =>
                      handleOpenPrediction(
                        item.predictionId
                      )
                    }
                    className="rounded-3xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Prediction ID
                        </p>

                        <h3 className="mt-2 text-4xl font-bold text-gray-950">
                          #{item.predictionId}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-4 py-1 text-xs font-bold ${getRiskBadgeClass(
                          item.overallRiskLevel
                        )}`}
                      >
                        {item.overallRiskLevel}
                      </span>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Highest Risk
                        </p>

                        <p className="font-semibold text-gray-950">
                          {Number(
                            item.highestRiskScore ??
                              0
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          DTI Ratio
                        </p>

                        <p className="font-semibold text-gray-950">
                          {Number(
                            item.dti ?? 0
                          ).toFixed(1)}
                          %
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Forecast Months
                        </p>

                        <p className="font-semibold text-gray-950">
                          {item.forecastMonths}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 border-t pt-5">
                      <p className="text-xs text-gray-500">
                        Generated on
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-950">
                        {new Date(
                          item.createdAt
                        ).toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
};

export default HistoryPage;