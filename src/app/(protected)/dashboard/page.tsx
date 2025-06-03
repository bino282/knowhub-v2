import DashboardPage from "@/_modules/dashboard/DashboardPage";
import { fetchMessageDashboardData } from "@/app/actions/dashboard";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import React from "react";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const listMessageUser = await fetchMessageDashboardData(userId as string);
  return <DashboardPage listMessage={listMessageUser.data || []} />;
}
