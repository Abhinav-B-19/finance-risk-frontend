import { HistoryTrendPoint } from "@/types/prediction";

export type HistoryPeriod = "1M" | "3M" | "6M" | "ALL";

export const historyPeriods: HistoryPeriod[] = [
  "1M",
  "3M",
  "6M",
  "ALL",
];

export const getPeriodLabel = (
  period: HistoryPeriod
) => {
  if (period === "ALL") {
    return "All";
  }

  return period;
};

export const filterHistoryByPeriod = (
  data: HistoryTrendPoint[],
  period: HistoryPeriod
) => {
  if (period === "ALL") {
    return data;
  }

  const months =
    period === "1M"
      ? 1
      : period === "3M"
        ? 3
        : 6;

  const cutoffDate = new Date();

  cutoffDate.setMonth(
    cutoffDate.getMonth() - months
  );

  return data.filter((item) => {
    const createdAt = new Date(item.createdAt);

    return createdAt >= cutoffDate;
  });
};

export const formatDateTime = (
  value: string
) => {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (
  value: number
) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const getRiskLevel = (
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