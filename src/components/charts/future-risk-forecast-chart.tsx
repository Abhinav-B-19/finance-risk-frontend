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

import { FutureRiskForecast } from "@/types/prediction";

interface FutureRiskForecastChartProps {
  data: FutureRiskForecast[];
}

const FutureRiskForecastChart = ({
  data,
}: FutureRiskForecastChartProps) => {
  const chartData = data.map((item) => ({
    month: item.forecastMonth,
    predictedRiskScore: Number(
      item.predictedRiskScore.toFixed(2)
    ),
  }));

  if (!chartData.length) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-2xl border bg-white text-sm text-gray-500">
        No future forecast data available
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="predictedRiskScore"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Predicted Risk Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FutureRiskForecastChart;