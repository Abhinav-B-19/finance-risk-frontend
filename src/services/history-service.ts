import apiClient from "./api-client";

import { PredictionHistoryItem } from "@/types/prediction";

export const getPredictionHistory = async (
  userKey: string
): Promise<PredictionHistoryItem[]> => {
  const response =
    await apiClient.get<PredictionHistoryItem[]>(
      `/history/${userKey}`
    );

  return response.data;
};