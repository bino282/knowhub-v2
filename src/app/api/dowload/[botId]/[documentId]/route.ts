// app/api/download/[botId]/[documentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOption";

export async function GET(
  req: NextRequest,
  { params }: { params: { botId: string; documentId: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.apiKey) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  console.log("params", params);
  const bot = await prisma.bot.findUnique({
    where: { id: params.botId },
    select: { dataSetId: true },
  });

  if (!bot?.dataSetId) {
    return NextResponse.json(
      { success: false, message: "Bot dataset not found" },
      { status: 404 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.RAGFLOW_API_URL}/api/v1/datasets/${bot.dataSetId}/documents/${params.documentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch file" },
        { status: 500 }
      );
    }

    const blob = await response.blob();
    const fileBuffer = Buffer.from(await blob.arrayBuffer());

    const contentDisposition =
      response.headers.get("Content-Disposition") ??
      `attachment; filename="downloaded-file"`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/octet-stream",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { success: false, message: "Error downloading file" },
      { status: 500 }
    );
  }
}
