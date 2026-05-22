"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { HistoryTrendPoint } from "@/types/prediction";

interface HistoryRiskTrendChartProps {
  data: HistoryTrendPoint[];
}

const formatAxisDate = (
  createdAt: string
) => {
  return new Date(
    createdAt
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatTooltipDate = (
  createdAt: string
) => {
  return new Date(
    createdAt
  ).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HistoryRiskTrendChart = ({
  data,
}: HistoryRiskTrendChartProps) => {
  const chartData = [...data]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    )
    .map((item, index) => ({
      chartLabel: formatAxisDate(
        item.createdAt
      ),
      tooltipDate: formatTooltipDate(
        item.createdAt
      ),
      riskScore: Number(
        item.highestRiskScore ?? 0
      ),
      predictionId:
        item.predictionId,
      uniqueKey: `${formatAxisDate(
        item.createdAt
      )}-${item.predictionId}-${index}`,
    }));

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 24,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="chartLabel"
            interval="preserveStartEnd"
            minTickGap={24}
            tick={{
              fontSize: 12,
              fill: "#6b7280",
            }}
            tickLine={false}
            axisLine={{
              stroke: "#d1d5db",
            }}
          />

          <YAxis
            domain={[0, 100]}
            tick={{
              fontSize: 12,
              fill: "#6b7280",
            }}
            tickLine={false}
            axisLine={{
              stroke: "#d1d5db",
            }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.08)",
            }}
            formatter={(value) => [
              Number(value).toFixed(2),
              "Risk Score",
            ]}
            labelFormatter={(
              _label,
              payload
            ) => {
              const item =
                payload?.[0]?.payload;

              if (!item) {
                return "";
              }

              return `${item.tooltipDate} • Prediction #${item.predictionId}`;
            }}
          />

          <Line
            type="monotone"
            dataKey="riskScore"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: "#ffffff",
              stroke: "#2563eb",
            }}
            activeDot={{
              r: 7,
              strokeWidth: 2,
              fill: "#2563eb",
              stroke: "#ffffff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryRiskTrendChart;