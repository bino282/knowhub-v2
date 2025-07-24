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
export const OPENAI_MODELS = [
  { label: "gpt-3.5-turbo", value: "gpt-3.5-turbo@OpenAI" },
  { label: "gpt-3.5-turbo-16k-0613", value: "gpt-3.5-turbo-16k-0613@OpenAI" },
  { label: "gpt-4", value: "gpt-4@OpenAI" },
  { label: "gpt-4-32k", value: "gpt-4-32k@OpenAI" },
  { label: "gpt-4-turbo", value: "gpt-4-turbo@OpenAI" },
  { label: "gpt-4.1", value: "gpt-4.1@OpenAI" },
  { label: "gpt-4.1-mini", value: "gpt-4.1-mini@OpenAI" },
  { label: "gpt-4.1-nano", value: "gpt-4.1-nano@OpenAI" },
  { label: "gpt-4.5-preview", value: "gpt-4.5-preview@OpenAI" },
  { label: "gpt-4o", value: "gpt-4o@OpenAI" },
  { label: "gpt-4o-mini", value: "gpt-4o-mini@OpenAI" },
  { label: "o3", value: "o3@OpenAI" },
  { label: "o4-mini", value: "o4-mini@OpenAI" },
  { label: "o4-mini-high", value: "o4-mini-high@OpenAI" },
] as const;

export type ApiResponse = {
  code: number;
  data: any;
  message: string;
};
