"use server";
import { apiRequest } from "@/lib/apiRequest";
import { ApiResponse } from "@/types";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOption";

export async function createFileDataset(datasetId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  try {
    const result = await apiRequest<ApiResponse>(
      "POST",
      `api/v1/datasets/${datasetId}/documents`,
      user.apiKey,
      formData
    );
    if (result.code !== 0) {
      console.error("Failed to create file dataset:");
      throw new Error("Failed to create file dataset");
    }

    const data = await result.data;
    await parseFileDocumentWithDataset(data[0].dataset_id, [data[0].id]);

    return {
      data,
      success: true,
      message: "File dataset created successfully",
    };
  } catch (error) {
    console.error("Error creating file dataset:", error);
    return { success: false, message: "Failed to create file dataset" };
  }
}
export async function getAllFileDatasets({
  datasetId,
  page = 1,
  name = "",
}: {
  datasetId: string;
  page?: number;
  name?: string;
}) {
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
      `api/v1/datasets/${datasetId}/documents`,
      user.apiKey,
      {
        page: page,
        name: name,
        desc: "desc",
      }
    );

    if (response.code !== 0) {
      console.error("Failed to fetch file datasets:");
      throw new Error("Failed to fetch file datasets");
    }
    const data = await response.data;
    return { data, success: true };
  } catch (error) {
    console.error("Error fetching file datasets:", error);
    return { success: false, message: "Failed to fetch file datasets" };
  }
}
export async function parseFileDocument(botId: string, documentIds: string[]) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  const botDatasetId = await prisma.bot.findUnique({
    where: { id: botId },
    select: { dataSetId: true },
  });
  if (!botDatasetId || !botDatasetId.dataSetId) {
    return { success: false, message: "Bot dataset ID not found" };
  }
  console.log("Dataset ID:", botDatasetId?.dataSetId);
  console.log("Document IDs:", documentIds);
  const res = await apiRequest<ApiResponse>(
    "POST",
    `api/v1/datasets/${botDatasetId?.dataSetId}/chunks`,
    user.apiKey,
    {
      document_ids: documentIds,
    }
  );
  if (res.code !== 0) {
    console.error("Failed to parse file document");
    return { success: false, message: "Failed to parse file document" };
  }
  return { success: true, message: "File document parsed successfully" };
}

export async function parseFileDocumentWithDataset(
  datasetId: string,
  documentIds: string[]
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  console.log("Dataset ID:", datasetId);
  const res = await apiRequest<ApiResponse>(
    "POST",
    `api/v1/datasets/${datasetId}/chunks`,
    user.apiKey,
    {
      document_ids: documentIds,
    }
  );
  console.log("res", res);
  if (res.code !== 0) {
    console.error("Failed to parse file document");
    return { success: false, message: "Failed to parse file document" };
  }
  return { success: true, message: "File document parsed successfully" };
}
