import apiClient from "./api-client";

import { PredictionDetails } from "@/types/prediction";

export const getPredictionDetails =
  async (
    predictionId: string
  ): Promise<PredictionDetails> => {
    const response = await apiClient.get(
      `/prediction/${predictionId}`
    );

    return response.data;
  };