"use server";

import { authOptions } from "@/lib/authOption";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  try {
    const url = new URL(req.url);
    const datasetId = url.searchParams.get("dataset_id");
    const fileId = url.searchParams.get("file_id");
    console.log("datasetId:", datasetId);
    console.log("fileId:", fileId);
    if (!datasetId || !fileId) {
      return new Response(JSON.stringify({ error: "Missing key parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const urlDownload = `${process.env.NEXT_PUBLIC_URL_RAGFLOW}/api/v1/datasets/${datasetId}/documents/${fileId}`;
    const response = await fetch(urlDownload, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user?.apiKey}`,
      },
    });
    if (!response.ok || !response.body) {
      return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contentDisposition =
      response.headers.get("Content-Disposition") ??
      `attachment; filename="${fileId}"`;
    const contentType =
      response.headers.get("Content-Type") ?? "application/octet-stream";

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Disposition": contentDisposition,
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/download/file:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
