"use server";

import { apiRequest } from "@/lib/apiRequest";
import { ApiResponse } from "@/types";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOption";

export async function createDataset(name: string, description?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "User not authenticated" };
  }
  const userId = session.user.id;
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
    await prisma.activity.create({
      data: {
        userId: userId,
        action: "CREATED",
        targetType: name,
        targetName: "DATASET",
      },
    });
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
export async function deleteDataset(datasetId: string, datasetName: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "User not authenticated" };
  }
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }

  try {
    const response = await apiRequest<ApiResponse>(
      "DELETE",
      `api/v1/datasets`,
      user.apiKey,
      {
        ids: [datasetId],
      }
    );

    if (response.code !== 0) {
      throw new Error("Failed to delete dataset");
    }
    await prisma.bot.updateMany({
      where: {
        dataSetId: datasetId,
      },
      data: {
        dataSetId: undefined,
      },
    });
    await prisma.activity.create({
      data: {
        userId: userId,
        action: "DELETED",
        targetType: datasetName,
        targetName: "DATASET",
      },
    });
    return { success: true, message: "Dataset deleted successfully" };
  } catch (error) {
    console.error("Error deleting dataset:", error);
    return { success: false, message: "Failed to delete dataset" };
  }
}
export async function updateDataset(
  datasetId: string,
  name: string,
  description: string,
  permission: "team" | "me"
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "User not authenticated" };
  }
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || !user.apiKey) {
    return { success: false, message: "User not found or API key missing" };
  }
  try {
    const response = await apiRequest<ApiResponse>(
      "PUT",
      `api/v1/datasets/${datasetId}`,
      user.apiKey,
      {
        name: name,
        description: description,
        permission: permission,
      }
    );
    if (response.code !== 0) {
      return {
        success: false,
        message: response.message,
      };
    }
    return {
      success: true,
      message: "Dataset updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating dataset:", error);
    return { success: false, message: "Failed to update dataset" };
  }
}
export async function getDatasets() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "User not authenticated" };
  }
  const userId = session.user.id;
  // Tìm các admin đã mời user vào team
  const teamInvites = await prisma.inviteTeam.findMany({
    where: {
      memberId: userId,
      status: "ACCEPTED",
    },
    select: {
      adminId: true,
    },
  });
  const adminIds = teamInvites.map((item) => item.adminId);

  // Lấy API key tương ứng với userId và các adminIds
  const allUserIds = [userId, ...adminIds];
  //GET API RAGFLOW FOR TABLE USERS
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: allUserIds,
      },
    },
    select: {
      id: true,
      apiKey: true,
      name: true,
    },
  });
  const datasets = await Promise.allSettled(
    users.map(async ({ id, apiKey, name }) => {
      if (!apiKey) return null;

      try {
        const res = await apiRequest<ApiResponse>(
          "GET",
          "api/v1/datasets",
          apiKey
        );

        if (res.code !== 0) {
          throw new Error(`Failed with status ${res.code}`);
        }

        let data = res.data;

        // Nếu là user chính → lấy toàn bộ
        if (id === userId) {
          return data;
        }

        // Nếu là admin khác → lọc theo permission === 'team'
        const teamDatasets = data
          .filter((dataset: any) => dataset.permission === "team")
          .map((dataset: any) => ({
            ...dataset,
            createdBy: name,
            createdById: id,
          }));

        return teamDatasets;
      } catch (error) {
        console.error("Error fetching dataset for API key:", apiKey, error);
        return null;
      }
    })
  );

  const successfulDatasets = datasets
    .filter((res) => res.status === "fulfilled" && res.value)
    .map((res) => (res as PromiseFulfilledResult<any>).value)
    .flat();

  return {
    success: true,
    data: successfulDatasets,
  };
}
