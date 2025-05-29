export const getVariant = (
  status: string
): "success" | "info" | "error" | "info" | "warning" | null => {
  switch (status) {
    case "DONE":
      return "success";
    case "PROCESSING":
      return "info";
    case "FAILED":
      return "error";
    case "UNSTART":
      return "info";
    case "CANCEL":
      return "warning";
    default:
      return null;
  }
};
