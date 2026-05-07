import apiClient from "./api-client";

import {
  PredictionRequest,
  PredictionResponse,
} from "@/types/prediction";

export const createPrediction = async (
  payload: PredictionRequest
): Promise<PredictionResponse> => {
  const response = await apiClient.post(
    "/predict",
    payload
  );

  return response.data;
};