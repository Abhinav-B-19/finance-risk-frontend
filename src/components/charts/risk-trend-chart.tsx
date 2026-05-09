"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RiskTrendChartProps {
  data: {
    forecastMonth: string;
    riskScore: number;
  }[];
}

const RiskTrendChart = ({
  data,
}: RiskTrendChartProps) => {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Risk Trend Analysis
        </h2>

        <p className="mt-2 text-gray-500">
          Forecasted financial risk progression across future months.
        </p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="forecastMonth" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="riskScore"
              stroke="#000000"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskTrendChart;