export const getRiskTextColor = (
    riskLevel: string
  ) => {
    switch (riskLevel) {
      case "LOW":
        return "text-green-500";
  
      case "MEDIUM":
        return "text-yellow-500";
  
      case "HIGH":
        return "text-red-500";
  
      default:
        return "text-gray-500";
    }
  };
  
  export const getRiskBadgeColor = (
    riskLevel: string
  ) => {
    switch (riskLevel) {
      case "LOW":
        return "bg-green-100 text-green-700";
  
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
  
      case "HIGH":
        return "bg-red-100 text-red-700";
  
      default:
        return "bg-gray-100 text-gray-700";
    }
  };