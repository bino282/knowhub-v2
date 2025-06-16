import type { Locale } from "./i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
export const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ja: () => import("./dictionaries/ja.json").then((module) => module.default),
  kr: () => import("./dictionaries/kr.json").then((module) => module.default),
  vi: () => import("./dictionaries/vi.json").then((module) => module.default),
} as const;

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.ja();
