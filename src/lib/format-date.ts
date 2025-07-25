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
export function formatDateTime(dateInput: Date | string): string {
  const date = new Date(dateInput);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // tháng bắt đầu từ 0
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
export function formatDSN(data: string) {
  const date = new Date(data);

  // Hàm pad để luôn có 2 chữ số
  const pad = (n: number) => String(n).padStart(2, "0");

  // Trích xuất giờ, phút, giây
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const time = `${hours}:${minutes}:${seconds}`;
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${time}`;
}
