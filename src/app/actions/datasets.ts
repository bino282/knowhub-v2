"use server";

import { apiRequest } from "@/lib/apiRequest";
import { ApiResponse } from "@/types";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOption";

export async function createDataset(name: string, description?: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  try {
    const response = await apiRequest<ApiResponse>(
      "POST",
      "api/v1/datasets",
      user.apiKey,
      {
        name,
        description,
      }
    );

    if (response.code !== 0) {
      throw new Error("Failed to create dataset");
    }

    const data = await response.data;
    return { data, success: true, message: "Dataset created successfully" };
  } catch (error) {
    console.error("Error creating dataset:", error);
    return { success: false, message: "Failed to create dataset" };
  }
}
export async function getAllDatasets() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }

  try {
    const response = await apiRequest<ApiResponse>(
      "GET",
      "api/v1/datasets",
      user.apiKey
    );

    if (response.code !== 0) {
      throw new Error("Failed to fetch datasets");
    }

    const data = await response.data;
    return { data, success: true };
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return { success: false, message: "Failed to fetch datasets" };
  }
}
