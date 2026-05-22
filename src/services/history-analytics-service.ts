import apiClient from "./api-client";

import { HistoryAnalytics } from "@/types/prediction";

export const getHistoryAnalytics = async (
  userKey: string
): Promise<HistoryAnalytics> => {
  const response = await apiClient.get(
    `/analytics/history/${userKey}`
  );

  return response.data;
};