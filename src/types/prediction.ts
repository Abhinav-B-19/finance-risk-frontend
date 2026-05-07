export interface PredictionRequest {
    name: string;
    email: string;
    income: number;
    expenses: number;
    debt: number;
  }
  
  export interface Forecast {
    risk_score: number;
    risk_level: string;
  }
  
  export interface PredictionResponse {
    status: string;
    userKey: string;
    predictions: Record<string, Forecast>;
  }