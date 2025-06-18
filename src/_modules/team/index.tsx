"use client";
import { DataTypeFromLocaleFunction } from "@/types";
import React from "react";

import { useSession } from "next-auth/react";
import ListTeamMember from "./components/ListTeamMember";
import ListTeamJoin from "./components/ListTeamJoin";
import { TeamJoined, TeamMember } from "@/types/database.type";

export default function TeamManagementPage({
  listMembers,
  listTeams,
  dictionary,
}: {
  dictionary: DataTypeFromLocaleFunction;
  listMembers: TeamMember[];
  listTeams: TeamJoined[];
}) {
  const session = useSession();
  const userId = session.data?.user.id;

  return (
    <div className="flex flex-col gap-6">
      <ListTeamMember
        listMembers={listMembers}
        adminId={userId}
        dictionary={dictionary}
      />
      <ListTeamJoin
        listTeams={listTeams}
        memberId={userId}
        dictionary={dictionary}
      />
    </div>
  );
}
