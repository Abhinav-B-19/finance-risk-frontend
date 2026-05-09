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
    <div className="h-[280px] w-full sm:h-[380px] lg:h-[430px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="forecastMonth"
            tick={{
              fontSize: 10,
              fontWeight: 700,
              fill: "#111827",
            }}
            tickMargin={12}
          />

          <YAxis
            tick={{
              fontSize: 10,
              fontWeight: 700,
              fill: "#111827",
            }}
            tickMargin={10}
            width={35}
          />

          <Tooltip
            wrapperStyle={{
              outline: "none",
            }}
            contentStyle={{
              borderRadius: "12px",
              border:
                "1px solid #e5e7eb",
              fontSize: "12px",
              fontWeight: "600",
              padding: "10px",
            }}
          />

          <Line
            type="monotone"
            dataKey="riskScore"
            stroke="#000000"
            strokeWidth={3}
            dot={{
              r: 5,
              strokeWidth: 3,
              fill: "#ffffff",
            }}
            activeDot={{
              r: 7,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskTrendChart;