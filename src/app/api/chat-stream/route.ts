import { prisma } from "@/lib/prisma";

interface Data extends Record<string, unknown> {
  message: string;
  stream: boolean;
  bot_id: string;
  session_id: string;
}
export async function POST(req: Request) {
  const data: Partial<Data> = (await req.json()) || {};
  const bot = await prisma.bot.findUnique({
    where: { id: data.bot_id as string },
  });
  const user = await prisma.user.findUnique({
    where: { id: bot?.userId },
  });
  if (!user || !user.apiKey) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "User not found or API key missing",
      }),
      { status: 400 }
    );
  }
  if (!bot || !bot.chatId) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Bot not found or chat ID missing",
      }),
      { status: 404 }
    );
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_RAGFLOW}/api/v1/chats/${bot.chatId}/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: data.message,
        stream: data.stream,
        session_id: data.session_id,
      }),
    }
  );
  return response;
}
