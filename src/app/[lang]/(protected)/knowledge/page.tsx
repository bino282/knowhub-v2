import PageKnowledges from "@/_modules/knowledge";
import { getDictionary, Locale } from "@/i18n";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <PageKnowledges dictionary={dictionary} />;
}
