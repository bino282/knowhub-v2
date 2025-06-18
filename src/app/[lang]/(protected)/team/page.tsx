import TeamManagementPage from "@/_modules/team";
import { getTeamJoined, getTeamMembers } from "@/app/actions/team";
import { getDictionary, Locale } from "@/i18n";
import { authOptions } from "@/lib/authOption";
import { TeamJoined, TeamMember } from "@/types/database.type";
import { getServerSession } from "next-auth";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return (
      <div className="text-center">
        You must be logged in to view this page.
      </div>
    );
  }
  const userId = session.user.id;
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const getMembers = await getTeamMembers(userId);
  const getTeam = await getTeamJoined(userId);
  const listMembers = getMembers.success
    ? (getMembers.data as TeamMember[])
    : [];
  const listTeam = getTeam.success ? (getTeam.data as TeamJoined[]) : [];
  return (
    <TeamManagementPage
      dictionary={dictionary}
      listMembers={listMembers}
      listTeams={listTeam}
    />
  );
}
