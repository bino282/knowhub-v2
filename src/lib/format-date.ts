import { parse, format } from "date-fns";

export const toGmtDateString = (date: Date): string => {
  return format(date, "EEE, dd MMM yyyy HH:mm:ss 'GMT'");
};
export const formatGmtDate = (dateString: string): string => {
  try {
    const parsedDate = parse(
      dateString,
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
      new Date()
    );
    return format(parsedDate, "dd/MM/yyyy HH:mm:ss");
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
};
