import BotsPage from "@/_modules/bots";
import { getDictionary, Locale } from "@/i18n";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <BotsPage dictionary={dictionary} />;
}
