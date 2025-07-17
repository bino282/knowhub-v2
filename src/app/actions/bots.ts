"use server";

import { apiRequest } from "@/lib/apiRequest";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ApiResponse } from "@/types";
import { authOptions } from "@/lib/authOption";

const BotSchema = z.object({
  name: z.string(),
  description: z.string(),
  avatarUrl: z.string().optional(), // camel-case
  userId: z.string(), // camel-case
  settings: z.record(z.any()).optional(),
  dataSetId: z.string(),
  chatId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isActive: z.boolean().optional().default(true), // camel-case
});
export async function createNewBot(data: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, error: "User not authenticated" };
  }
  const userId = data.created_by_id ? data.created_by_id : session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  const dataSetId = data.data_set_id;
  if (!dataSetId) {
    return { success: false, error: "Data set ID is required" };
  }
  const res = await apiRequest<ApiResponse>(
    "POST",
    "api/v1/chats",
    user.apiKey,
    {
      name: data.name,
      dataset_ids: [dataSetId],
      prompt: {
        prompt: `You are a knowledgeable and context-aware assistant named ${data.name}. Use the following knowledge base to answer the user's question. Your response should:
Summarize the relevant content from the knowledge base.
List the specific pieces of data from the knowledge base used in your answer.
Provide a detailed and accurate response based on the retrieved information.
Take the chat history into account when forming your answer.
If the knowledge base does not contain relevant information to answer the question, respond with:
"I cannot find information for this question in the knowledge base."
Here is the knowledge base:
{knowledge}
Here is question:`,
        top_n: 10,
        empty_response: "",
      },
    },
    true,
    { email: user.email!, nickname: user.name! }
  );

  if (res.code !== 0) {
    throw new Error("Failed to create chat for bot");
  }
  const chatId = res.data.id;
  const validated = BotSchema.parse({
    name: data.name,
    description: data.description,
    avatarUrl: data?.avatar_url,
    userId: data.user_id,
    settings: data.settings ?? {},
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    dataSetId: data.data_set_id,
    chatId: chatId,
    isActive: data.is_active ?? true, // default to true if not provided
  });
  try {
    const data = await prisma.bot.create({
      data: {
        ...validated,
        createdAt: new Date(),
      },
    });
    await prisma.activity.create({
      data: {
        userId: userId,
        action: "CREATED",
        targetType: validated.name,
        targetName: "CHAT BOT",
      },
    });
    revalidatePath("/bots");
    return { data: data, success: true, message: "Bot created successfully" };
  } catch (error) {
    return { success: false, error: "Failed to create bot" };
  }
}
export async function getAllBots(userId: string) {
  try {
    const botsWithUserMessageCount = await prisma.bot.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sessionChats: {
          include: {
            messages: {
              where: {
                role: "user",
              },
              select: {
                id: true, // just to count
              },
            },
          },
        },
      },
    });
    const inviteTeams = await prisma.inviteTeam.findMany({
      where: {
        adminId: userId,
        status: "ACCEPTED",
      },
    });
    // Tính tổng số message role 'user' cho từng bot
    const result = botsWithUserMessageCount.map((bot) => {
      const totalMessages = bot.sessionChats.reduce((sum, session) => {
        return sum + session.messages.length;
      }, 0);

      const totalMembers = inviteTeams.filter(
        (invite) => invite.adminId === bot.userId
      ).length;

      return {
        ...bot,
        totalMessages,
        totalMembers,
      };
    });

    return { data: result, success: true };
  } catch (error) {
    return { success: false, error: "Failed to fetch bots and messages" };
  }
}
export async function getBotById(id: string, createdById: string | undefined) {
  try {
    const bot = await prisma.bot.findUnique({
      where: { id },
    });
    if (!bot) {
      return { success: false, error: "Bot not found" };
    }
    // get chat info
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "User not authenticated" };
    }
    const userId = createdById ? createdById : session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.apiKey) {
      return { success: false, message: "User not found or API key missing" };
    }
    const res = await apiRequest<ApiResponse>(
      "GET",
      `api/v1/chats?id=${bot.chatId}`,
      user.apiKey,
      undefined,
      true,
      { email: user.email!, nickname: user.name! }
    );
    const chatInfo = res.data;
    const data = {
      ...bot,
      chatInfo: chatInfo,
    };
    return { data: data, success: true };
  } catch (error) {
    return { success: false, error: "Failed to fetch bot" };
  }
}
export async function updateChatBot(botId: string, data: any) {
  const res = await prisma.bot.update({
    where: { id: botId },
    data: {
      name: data.name,
      description: data.description,
      dataSetId: data.dataSetId,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/bots");
  if (!res) {
    return { success: false, error: "Failed to update bot" };
  }
  await prisma.activity.create({
    data: {
      userId: res.userId,
      action: "UPDATED",
      targetType: res.name,
      targetName: "CHAT BOT",
    },
  });
  return { data: res, success: true, message: "Bot updated successfully" };
}
export async function deleteChatBot(
  botId: string,
  createdById: string | undefined
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, error: "User not authenticated" };
  }
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
    select: { name: true, chatId: true },
  });
  await prisma.sessionChat.deleteMany({
    where: { botId: botId },
  });
  const userApiKeyId = createdById ? createdById : userId;
  const userApiKey = await prisma.user.findUnique({
    where: { id: userApiKeyId },
  });
  if (!userApiKey || !userApiKey.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  const res = await apiRequest<ApiResponse>(
    "DELETE",
    "api/v1/chats",
    userApiKey.apiKey,
    {
      ids: [bot?.chatId],
    },
    true,
    { email: user.email!, nickname: user.name! }
  );
  if (res.code !== 0) {
    return { success: false, error: "Failed to delete chat" };
  }
  await prisma.activity.create({
    data: {
      userId: userId,
      action: "DELETED",
      targetType: bot?.name || "",
      targetName: "CHAT BOT",
    },
  });
  await prisma.bot.delete({
    where: { id: botId },
  });

  return { success: true, message: "Bot deleted successfully" };
}
export async function activeBot(botId: string, active: boolean) {
  const res = await prisma.bot.update({
    where: { id: botId },
    data: {
      isActive: active,
    },
  });
  revalidatePath("/bots");
  if (!res) {
    return { success: false, error: "Failed to update bot status" };
  }
  return {
    data: res,
    success: true,
    message: "Bot status updated successfully",
  };
}
export async function settingPrompt(
  botId: string,
  prompt: {
    prompt: string;
    similarity_threshold: number;
    top_n: number;
    empty_response: string;
  },
  createdById: string | undefined
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, error: "User not authenticated" };
  }
  const userId = createdById ? createdById : session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
  });
  const res = await apiRequest<ApiResponse>(
    "PUT",
    `api/v1/chats/${bot?.chatId}`,
    user.apiKey,
    {
      prompt: prompt,
    },
    true,
    { email: user.email!, nickname: user.name! }
  );
  if (res.code !== 0) {
    return { success: false, error: "Failed to update bot prompt" };
  }
  await prisma.activity.create({
    data: {
      userId: userId,
      action: "UPDATED",
      targetType: bot?.name || "",
      targetName: "BOT PROMPT",
    },
  });
  return {
    data: res.data,
    success: true,
    message: "Bot prompt updated successfully",
  };
}
