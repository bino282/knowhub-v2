"use server";
import { apiRequest } from "@/lib/apiRequest";
import { ApiResponse } from "@/types";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOption";

export async function createFileDataset(
  datasetId: string,
  fileType: string | null,
  formData: FormData,
  datasetName?: string
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
    const type = fileType ? fileType.toLowerCase() : null;
    const data = await result.data;
    await prisma.file.create({
      data: {
        id: data[0].id,
        type: type,
        datasetId: data[0].dataset_id,
      },
    });
    await parseFileDocumentWithDataset(data[0].dataset_id, [data[0].id]);
    await prisma.activity.create({
      data: {
        userId: userId,
        action: "UPLOADED",
        targetType: data[0].name,
        targetName: datasetName || "",
      },
    });

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
  type,
}: {
  datasetId: string;
  type?: string;
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
    let fileIdsByType: string[] = [];
    if (type) {
      const files = await prisma.file.findMany({
        where: { type },
        select: { id: true },
      });
      fileIdsByType = files.map((file) => file.id);
    }
    const response = await apiRequest<ApiResponse>(
      "GET",
      `api/v1/datasets/${datasetId}/documents`,
      user.apiKey,
      {
        desc: "desc",
      }
    );

    if (response.code !== 0) {
      console.error("Failed to fetch file datasets:");
      throw new Error("Failed to fetch file datasets");
    }
    const data = await response.data;

    const filteredData = type
      ? {
          docs: data.docs.filter((item: any) =>
            fileIdsByType.includes(item.id)
          ),
          count: data.docs.filter((item: any) =>
            fileIdsByType.includes(item.id)
          ).length,
        }
      : data;

    return { data: filteredData, success: true };
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
  const res = await apiRequest<ApiResponse>(
    "POST",
    `api/v1/datasets/${datasetId}/chunks`,
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
export async function stopParseFileDocument(
  botId: string,
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
  const botDatasetId = await prisma.bot.findUnique({
    where: { id: botId },
    select: { dataSetId: true },
  });
  if (!botDatasetId || !botDatasetId.dataSetId) {
    return { success: false, message: "Bot dataset ID not found" };
  }
  const res = await apiRequest<ApiResponse>(
    "DELETE",
    `api/v1/datasets/${botDatasetId?.dataSetId}/chunks`,
    user.apiKey,
    {
      document_ids: documentIds,
    }
  );
  if (res.code !== 0) {
    console.error("Failed to stop parse file document");
    return { success: false, message: "Failed to stop parse file document" };
  }
  return { success: true, message: "File document stop parsed successfully" };
}
export async function deteleFileDataset(
  datasetId: string,
  documentIds: string[],
  datasetName?: string
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
      "DELETE",
      `api/v1/datasets/${datasetId}/documents`,
      user.apiKey,
      {
        ids: documentIds,
      }
    );
    if (response.code !== 0) {
      console.error("Failed to delete file dataset:");
      throw new Error("Failed to delete file dataset");
    }
    await prisma.file.delete({
      where: {
        id: documentIds[0],
        datasetId: datasetId,
      },
    });
    await prisma.activity.create({
      data: {
        userId: userId,
        action: "DELETED",
        targetType: "FILE",
        targetName: datasetName || "",
      },
    });
    return { success: true, message: "File dataset deleted successfully" };
  } catch (error) {
    console.error("Error deleting file dataset:", error);
    return { success: false, message: "Failed to delete file dataset" };
  }
}
// export async function dowloadFileDataset(botId: string, documentId: string) {
//   const session = await getServerSession(authOptions);
//   const userId = session?.user?.id;
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });
//   if (!user || !user.apiKey) {
//     return { success: false, message: "User not found or API key missing" };
//   }
//   const botDatasetId = await prisma.bot.findUnique({
//     where: { id: botId },
//     select: { dataSetId: true },
//   });
//   if (!botDatasetId || !botDatasetId.dataSetId) {
//     return { success: false, message: "Bot dataset ID not found" };
//   }
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_URL_RAGFLOW}/api/v1/datasets/${botDatasetId.dataSetId}/documents/${documentId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${user.apiKey}`,
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Error downloading file dataset:", error);
//     return { success: false, message: "Failed to download file dataset" };
//   }
// }
export async function updateFileDataset(
  datasetId: string,
  documentId: string,
  data: {
    chunk_method: string;
    parser_config: {
      chunk_token_count: number;
      delimiter: string;
    };
  }
) {
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
      "PUT",
      `api/v1/datasets/${datasetId}/documents/${documentId}`,
      user.apiKey,
      data
    );
    if (response.code !== 0) {
      console.error("Failed to update file dataset:");
      throw new Error("Failed to update file dataset");
    }
    return { success: true, message: "File dataset updated successfully" };
  } catch (error) {
    console.error("Error updating file dataset:", error);
    return { success: false, message: "Failed to update file dataset" };
  }
}
export async function getTypeFile() {
  // get all type from table file
  const types = await prisma.file.findMany({
    where: {
      type: {
        not: null,
      },
    },
    select: {
      type: true,
    },
    distinct: ["type"],
  });
  if (!types) {
    return { success: false, message: "No file types found" };
  }
  return {
    success: true,
    data: types.map((item) => item.type),
  };
}
export async function getFileTypeCounts(datasetId: string) {
  try {
    // Step 1: lấy tất cả các type hiện có
    const allTypes = await prisma.file.findMany({
      where: {
        type: {
          not: null,
        },
      },
      distinct: ["type"],
      select: {
        type: true,
      },
    });

    // Step 2: đếm số lượng theo datasetId được truyền vào
    const counts = await prisma.file.groupBy({
      by: ["type"],
      where: { datasetId, type: { not: null } },
      _count: { type: true },
    });

    // Step 3: gộp lại, đảm bảo type nào không có count thì set 0
    const result = allTypes.map((typeObj) => {
      const matched = counts.find((c) => c.type === typeObj.type);
      return {
        name: typeObj.type,
        count: matched?._count.type || 0,
      };
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error counting file types for datasetId:", error);
    return { success: false, message: "Failed to count file types" };
  }
}
