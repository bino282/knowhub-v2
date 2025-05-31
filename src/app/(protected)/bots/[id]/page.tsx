import PageBotDetail from "@/_modules/bot-detail";
import { getBotById } from "@/app/actions/bots";
import { Database } from "@/types/database.type";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataBot = await getBotById(id);
  if (!dataBot.success) {
    return;
  }
  return (
    <PageBotDetail
      bot={dataBot.data as Database["public"]["Tables"]["bots"]["Row"]}
    />
  );
}
