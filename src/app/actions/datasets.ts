"use server";

import { apiRequest } from "@/lib/apiRequest";
import { ApiResponse } from "@/types";

export async function createDataset(name: string) {
  try {
    const response = await apiRequest<ApiResponse>("POST", "api/v1/datasets", {
      name,
    });

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
  try {
    const response = await apiRequest<ApiResponse>("GET", "api/v1/datasets");

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
