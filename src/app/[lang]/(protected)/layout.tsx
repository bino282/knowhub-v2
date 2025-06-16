import React from "react";
import { BotsProvider } from "@/_modules/contexts/BotsContext";
import Layout from "@/_modules/layout/Layout";
import { getDictionary, Locale } from "@/i18n";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <BotsProvider>
      <Layout dictionary={dictionary}>{children}</Layout>
    </BotsProvider>
  );
}
