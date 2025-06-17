"use client";
import { DataTypeFromLocaleFunction } from "@/types";
import React from "react";

import { useSession } from "next-auth/react";
import ListTeamMember from "./components/ListTeamMember";
import ListTeamJoin from "./components/ListTeamJoin";

export default function TeamManagementPage({
  dictionary,
}: {
  dictionary: DataTypeFromLocaleFunction;
}) {
  const session = useSession();
  const userId = session.data?.user.id;

  return (
    <div className="flex flex-col gap-6">
      <ListTeamMember adminId={userId} />
      <ListTeamJoin memberId={userId} />
    </div>
  );
}
