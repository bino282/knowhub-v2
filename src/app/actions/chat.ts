"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { apiRequest } from "@/lib/apiRequest";
import { ApiResponse } from "@/types";
import { authOptions } from "@/lib/authOption";
interface MessageInput {
  role: string;
  content: string;
  reference?: Record<string, any> | null;
}

export async function createSessionId(botId: string, nameSession: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  const name = nameSession;
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
  if (res.code !== 0) {
    throw new Error("Failed to create chat for bot");
  }
  const data = res.data;
  return { success: true, data: data, name: name };
}
export async function getListChat(botId: string) {
  const listChat = await prisma.sessionChat.findMany({
    where: {
      botId: botId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    success: true,
    data: listChat,
  };
}
export async function createSessionMessage(
  sessionId: string,
  name: string,
  botId: string
) {
  const session = await prisma.sessionChat.findUnique({
    where: { id: sessionId },
  });
  if (!session) {
    const data = await prisma.sessionChat.create({
      data: {
        id: sessionId,
        name: name,
        botId: botId,
      },
    });
    console.log("createSessionMessage data", data);
    return { success: true, data: data };
  }
}
export async function getListMessages(sessionId: string) {
  const listMessages = await prisma.message.findMany({
    where: {
      sessionChatId: sessionId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      role: true,
      content: true,
      reference: true,
    },
  });

  const contents = listMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
    reference: msg.reference,
  }));

  return { success: true, data: contents };
}

export async function createMessages(
  sessionId: string,
  messages: MessageInput[]
) {
  await prisma.message.createMany({
    data: messages.map((msg) => ({
      sessionChatId: sessionId,
      role: msg.role,
      content: msg.content,
      reference: msg.reference ? JSON.stringify(msg.reference) : {},
    })),
  });

  return { success: true };
}
export async function deleteChatHistory(sessionId: string) {
  const session = await prisma.sessionChat.findUnique({
    where: { id: sessionId },
  });
  if (!session) {
    return { success: false, message: "Session not found" };
  }
  await prisma.sessionChat.delete({
    where: { id: sessionId },
  });
  await prisma.message.deleteMany({
    where: { sessionChatId: sessionId },
  });
  return { success: true, message: "Chat history deleted successfully" };
}
export async function createSessionIdWithBotID(
  botId: string,
  nameSession: string
) {
  const userBot = await prisma.bot.findUnique({
    where: { id: botId },
    select: { userId: true, chatId: true },
  });
  const user = await prisma.user.findUnique({
    where: { id: userBot?.userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  const res = await apiRequest<ApiResponse>(
    "POST",
    `api/v1/chats/${userBot?.chatId}/sessions`,
    user.apiKey,
    {
      name: nameSession,
    }
  );
  if (res.code !== 0) {
    throw new Error("Failed to create chat for bot");
  }
  const data = res.data;
  return { success: true, data: data };
}
