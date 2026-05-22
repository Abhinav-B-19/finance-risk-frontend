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

interface HistoryDtiTrendChartProps {
  data: HistoryTrendPoint[];
}

const formatDate = (value: string) => {
  const date = new Date(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const HistoryDtiTrendChart = ({
  data,
}: HistoryDtiTrendChartProps) => {
  const chartData = data.map((item) => ({
    date: formatDate(item.createdAt),
    dti: Number(item.dti.toFixed(2)),
  }));

  if (!chartData.length) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-2xl border bg-white text-sm text-gray-500">
        No DTI trend data available
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
            dataKey="date"
            tick={{ fontSize: 12 }}
          />

          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="dti"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="DTI Ratio"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryDtiTrendChart;