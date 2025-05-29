import React from "react";
import { BotsProvider } from "@/_modules/contexts/BotsContext";
import Layout from "@/_modules/layout/Layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BotsProvider>
      <Layout>{children}</Layout>
    </BotsProvider>
  );
}
