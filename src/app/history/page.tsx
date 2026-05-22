"use client";

import {
  useEffect,
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
} from "@/types/prediction";

import HistoryRiskTrendChart from "@/components/charts/history-risk-trend-chart";

import HistoryDtiTrendChart from "@/components/charts/history-dti-trend-chart";

import FutureRiskForecastChart from "@/components/charts/future-risk-forecast-chart";

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

  const handleOpenPrediction = (
    predictionId: number
  ) => {
    router.push(
      `/results/${predictionId}`
    );
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <p className="text-sm text-gray-500">
            Loading history dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!activeUser) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <section className="rounded-3xl border bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-5xl">
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
              className="mt-6 rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
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
        {/* Page Heading */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
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
          {/* LEFT / TOP ANALYTICS */}
          <div className="space-y-6">
            {/* Current User Details */}
            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm text-gray-500">
                  Current User
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-gray-950">
                  {activeUser.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {activeUser.email}
                </p>

                <p className="mt-3 text-xs text-gray-500">
                  To switch users, use the
                  Switch option in the
                  navbar.
                </p>
              </div>
            </section>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Predictions
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-950">
                  {analytics?.totalPredictions ??
                    history.length}
                </h3>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Average Risk
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-950">
                  {analytics
                    ? Number(
                        analytics.averageRiskScore
                      ).toFixed(2)
                    : "--"}
                </h3>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Highest Risk
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-950">
                  {analytics
                    ? Number(
                        analytics.highestRiskScore
                      ).toFixed(2)
                    : "--"}
                </h3>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Latest Risk Level
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-950">
                  {analytics?.latestRiskLevel ??
                    "--"}
                </h3>
              </div>
            </section>

            {/* Risk Trend */}
            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-gray-950">
                  Historical Risk Trend
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Highest risk score across
                  previous predictions.
                </p>
              </div>

              <HistoryRiskTrendChart
                data={
                  analytics?.historicalTrend ??
                  []
                }
              />
            </section>

            {/* DTI + Future Forecast */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-gray-950">
                    DTI Trend
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Debt-to-income movement
                    from past inputs.
                  </p>
                </div>

                <HistoryDtiTrendChart
                  data={
                    analytics?.historicalTrend ??
                    []
                  }
                />
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-gray-950">
                    Future Risk Forecast
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Trend-based forecast from
                    stored prediction history.
                  </p>
                </div>

                <FutureRiskForecastChart
                  data={
                    analytics?.futureTrendForecast ??
                    []
                  }
                />
              </div>
            </section>
          </div>

          {/* RIGHT / BOTTOM HISTORY CARDS */}
          <aside className="space-y-4">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-950">
                    Past Predictions
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Existing prediction
                    history cards.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
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
              <div className="grid max-h-none grid-cols-1 gap-4 xl:max-h-[980px] xl:overflow-y-auto xl:pr-2">
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

                        <h3 className="mt-2 text-3xl font-bold text-gray-950">
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