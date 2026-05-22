"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FutureRiskForecast } from "@/types/prediction";

interface FutureRiskForecastChartProps {
  data: FutureRiskForecast[];
}

const FORECAST_BLUE = "#2563eb";

const getRiskLevel = (riskScore: number) => {
  if (riskScore >= 70) {
    return "HIGH";
  }

  if (riskScore >= 40) {
    return "MEDIUM";
  }

  return "LOW";
};

const getRiskBadgeClass = (riskLevel: string) => {
  const normalizedRiskLevel =
    riskLevel?.toUpperCase();

  if (normalizedRiskLevel === "HIGH") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (normalizedRiskLevel === "MEDIUM") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  return "border-green-200 bg-green-50 text-green-700";
};

const getRiskTextClass = (riskLevel: string) => {
  const normalizedRiskLevel =
    riskLevel?.toUpperCase();

  if (normalizedRiskLevel === "HIGH") {
    return "text-red-600";
  }

  if (normalizedRiskLevel === "MEDIUM") {
    return "text-yellow-600";
  }

  return "text-green-600";
};

const getRiskCardClass = (riskLevel: string) => {
  const normalizedRiskLevel =
    riskLevel?.toUpperCase();

  if (normalizedRiskLevel === "HIGH") {
    return "border-red-200 bg-red-50";
  }

  if (normalizedRiskLevel === "MEDIUM") {
    return "border-yellow-200 bg-yellow-50";
  }

  return "border-green-200 bg-green-50";
};

const FutureRiskForecastChart = ({
  data,
}: FutureRiskForecastChartProps) => {
  const chartData = data.map((item) => {
    const riskScore =
      item.predictedRiskScore ??
      item.riskScore ??
      0;

    const riskLevel =
      item.predictedRiskLevel ??
      item.riskLevel ??
      getRiskLevel(riskScore);

    return {
      label: item.forecastMonth,
      riskScore: Number(
        riskScore.toFixed(2)
      ),
      riskLevel,
    };
  });

  const peakForecast =
    chartData.length > 0
      ? chartData.reduce((peak, item) =>
          item.riskScore > peak.riskScore
            ? item
            : peak
        )
      : null;

  return (
    <div className="space-y-4">
      {peakForecast && (
        <div
          className={`rounded-2xl border px-5 py-4 shadow-sm ${getRiskCardClass(
            peakForecast.riskLevel
          )}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black">
                Peak Forecast
              </p>

              <div className="mt-2 flex items-end gap-3">
                <h3
                  className={`text-3xl font-bold leading-none ${getRiskTextClass(
                    peakForecast.riskLevel
                  )}`}
                >
                  {peakForecast.riskScore.toFixed(
                    2
                  )}
                </h3>

                <p className="text-sm font-medium text-black">
                  {peakForecast.label}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${getRiskBadgeClass(
                peakForecast.riskLevel
              )}`}
            >
              {peakForecast.riskLevel}
            </span>
          </div>
        </div>
      )}

      <div className="rounded-2xl border bg-white px-3 py-4 shadow-sm">
        <div className="h-[180px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={chartData}
              margin={{
                top: 8,
                right: 12,
                left: -24,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="futureRiskBlueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={FORECAST_BLUE}
                    stopOpacity={0.28}
                  />

                  <stop
                    offset="95%"
                    stopColor={FORECAST_BLUE}
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 11,
                  fill: "#111827",
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 11,
                  fill: "#111827",
                }}
                tickLine={false}
                axisLine={false}
                width={34}
              />

              <Tooltip
                cursor={{
                  stroke: FORECAST_BLUE,
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid #dbeafe",
                  boxShadow:
                    "0 10px 24px rgba(37,99,235,0.12)",
                }}
                formatter={(
                  value,
                  _name,
                  props
                ) => {
                  const riskLevel =
                    props?.payload
                      ?.riskLevel ?? "";

                  return [
                    `${Number(value).toFixed(
                      2
                    )} (${riskLevel})`,
                    "Risk Score",
                  ];
                }}
                labelFormatter={(label) =>
                  `Forecast Month: ${label}`
                }
              />

              <Area
                type="monotone"
                dataKey="riskScore"
                stroke={FORECAST_BLUE}
                strokeWidth={3}
                fill="url(#futureRiskBlueGradient)"
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  stroke: FORECAST_BLUE,
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: FORECAST_BLUE,
                  stroke: "#ffffff",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {chartData.map((item) => (
          <div
            key={item.label}
            className={`min-w-0 rounded-2xl border p-3 ${getRiskCardClass(
              item.riskLevel
            )}`}
          >
            <p className="truncate text-xs font-medium text-black">
              {item.label}
            </p>

            <h4
              className={`mt-2 text-xl font-bold leading-none ${getRiskTextClass(
                item.riskLevel
              )}`}
            >
              {item.riskScore.toFixed(1)}
            </h4>

            <span
              className={`mt-3 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${getRiskBadgeClass(
                item.riskLevel
              )}`}
            >
              {item.riskLevel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutureRiskForecastChart;