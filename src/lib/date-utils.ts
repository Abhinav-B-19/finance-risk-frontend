export const formatDateTime = (
    date: string
  ) => {
    try {
      return new Intl.DateTimeFormat(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
  
          hour: "2-digit",
          minute: "2-digit",
  
          hour12: true,
        }
      ).format(new Date(date));
    } catch {
      return "Invalid date";
    }
  };