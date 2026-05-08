export interface PredictionRequest {
  name: string;
  email: string;
  income: number;
  expenses: number;
  debt: number;
}

export interface PredictionResponse {
  status: string;
  userKey: string;
  predictionId: number;
  predictions: Record<
    string,
    {
      risk_score: number;
      risk_level: string;
    }
  >;
}

export interface PredictionHistoryItem {
  predictionId: number;
  userKey: string;
  createdAt: string;
  income: number;
  expenses: number;
  debt: number;
  dti: number;
  forecastMonths: number;
  highestRiskScore: number;
  overallRiskLevel: string;
}

export interface Forecast {
  forecastMonth: string;
  riskScore: number;
  riskLevel: string;
}

export interface PredictionDetails {
  predictionId: number;
  userKey: string;
  createdAt: string;
  income: number;
  expenses: number;
  debt: number;
  dti: number;

  summary: {
    forecastMonths: number;
    highestRiskScore: number;
    overallRiskLevel: string;
  };

  forecasts: Forecast[];
}