"use server";

import { apiRequest } from "@/lib/apiRequest";
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
  chatId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export async function createNewBot(data: any) {
  const res = await apiRequest("POST", "api/v1/datasets", {
    name: data.name,
  });

  const validated = BotSchema.parse({
    name: data.name,
    description: data.description,
    avatarUrl: data?.avatar_url,
    userId: data.user_id,
    settings: data.settings ?? {},
    createdAt: data.created_at,
    updatedAt: data.updated_at,
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
