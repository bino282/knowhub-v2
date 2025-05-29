"use server";
import { apiRequest } from "@/lib/apiRequest";
import { ApiResponse } from "@/types";

export async function createFileDataset(datasetId: string, formData: FormData) {
  try {
    const result = await apiRequest<ApiResponse>(
      "POST",
      `api/v1/datasets/${datasetId}/documents`,
      formData
    );

    if (result.code !== 0) {
      console.error("Failed to create file dataset:");
      throw new Error("Failed to create file dataset");
    }

    const data = await result.data;
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
  try {
    const response = await apiRequest<ApiResponse>(
      "GET",
      `api/v1/datasets/${datasetId}/documents`,
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
