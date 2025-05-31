"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BotSchema = z.object({
  name: z.string(),
  description: z.string(),
  avatarUrl: z.string().optional(), // camel-case
  userId: z.string(), // camel-case
  settings: z.record(z.any()).optional(),
  dataSetId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export async function createNewBot(data: any) {
  const validated = BotSchema.parse({
    name: data.name,
    description: data.description,
    avatarUrl: data?.avatar_url,
    userId: data.user_id,
    settings: data.settings ?? {},
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    dataSetId: data.data_set_id,
  });
  try {
    const data = await prisma.bot.create({
      data: {
        ...validated,
        chatId: "",
        createdAt: new Date(),
      },
    });

    revalidatePath("/bots");
    return { data: data, success: true, message: "Bot created successfully" };
  } catch (error) {
    return { success: false, error: "Failed to create bot" };
  }
}
export async function getAllBots() {
  try {
    const bots = await prisma.bot.findMany({
      orderBy: { createdAt: "desc" },
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
