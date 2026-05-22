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

export interface ActiveUserSession {
  userKey: string;
  name: string;
  email: string;
}

export interface HistoryTrendPoint {
  predictionId: number;
  createdAt: string;
  income: number;
  expenses: number;
  debt: number;
  dti: number;
  highestRiskScore: number;
  overallRiskLevel: string;
}

export interface FutureRiskForecast {
  forecastMonth: string;
  predictedRiskScore: number;
  predictedRiskLevel: string;
}

export interface HistoryAnalytics {
  userKey: string;
  totalPredictions: number;
  averageRiskScore: number;
  highestRiskScore: number;
  latestRiskLevel: string;
  historicalTrend: HistoryTrendPoint[];
  futureTrendForecast: FutureRiskForecast[];
}