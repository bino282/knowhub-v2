import { dictionaries } from "@/i18n";

export interface IResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface IQueryParam {
  page: number;
  name?: string;
}

type DataTypeFromFunction<F extends (...args: any[]) => Promise<any>> =
  F extends (...args: any[]) => Promise<infer T> ? T : never;

export type DataTypeFromLocaleFunction = DataTypeFromFunction<
  typeof dictionaries.en
>;

export type ChatbotResponse = {
  success: boolean;
  data?: any; // Thay `any` bằng kiểu dữ liệu cụ thể nếu biết
  message?: string;
};
type TagStyle = {
  border: string;
  bg: string;
  text: string;
};

export const tagStyles: Record<string, TagStyle> = {
  Trained: {
    border: "#ABEFC6",
    bg: "#ECFDF3",
    text: "#10B981",
  },
  Training: {
    border: "#B2DDFF",
    bg: "#EFF8FF",
    text: "#175CD3",
  },
  Queued: {
    border: "#FEDF89",
    bg: "#FFFAEB",
    text: "#B54708",
  },
  Error: {
    border: "#FECDCA",
    bg: "#FEF3F2",
    text: "#B42318",
  },
  Contributor: {
    border: "#ABEFC6",
    bg: "#ECFDF3",
    text: "#10B981",
  },
  Admin: {
    border: "#B2DDFF",
    bg: "#EFF8FF",
    text: "#175CD3",
  },
  Viewer: {
    border: "#EAECF0",
    bg: "#FFFFFF",
    text: "#344054",
  },
  Success: {
    border: "#ABEFC6",
    bg: "#ECFDF3",
    text: "#10B981",
  },
  Canceled: {
    border: "#FECDCA",
    bg: "#FEF3F2",
    text: "#B42318",
  },
  Processing: {
    border: "#B2DDFF",
    bg: "#EFF8FF",
    text: "#175CD3",
  },
};
export type ApiResponse = {
  code: number;
  data: any;
  message: string;
};
