"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { apiRequest } from "@/lib/apiRequest";
import { ApiResponse } from "@/types";

export async function createSessionId(botId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  const name = `session-${Date.now()}`;
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
  });
  const res = await apiRequest<ApiResponse>(
    "POST",
    `api/v1/chats/${bot?.chatId}/sessions`,
    user.apiKey,
    {
      name: name,
    }
  );
  console.log("createSessionId res", res);
  if (res.code !== 0) {
    throw new Error("Failed to create chat for bot");
  }
  const sessionId = res.data.id;
  await prisma.bot.update({
    where: { id: botId },
    data: { sessionId: sessionId },
  });
  return { success: true, sessionId: sessionId, name: name };
}
