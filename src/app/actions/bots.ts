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
});
export async function createNewBot(data: any) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
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
    }
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
  });
  try {
    const data = await prisma.bot.create({
      data: {
        ...validated,
        createdAt: new Date(),
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
    const bots = await prisma.bot.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId: userId },
    });
    return { data: bots, success: true };
  } catch (error) {
    return { success: false, error: "Failed to fetch bots" };
  }
}
export async function getBotById(id: string) {
  try {
    const bot = await prisma.bot.findUnique({
      where: { id },
    });
    if (!bot) {
      return { success: false, error: "Bot not found" };
    }
    return { data: bot, success: true };
  } catch (error) {
    return { success: false, error: "Failed to fetch bot" };
  }
}
