import { prisma } from "@/lib/prisma";

export async function fetchMessageDashboardData(userId: string) {
  const messages = await prisma.message.findMany({
    where: {
      sessionChat: {
        bot: {
          userId: userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    success: true,
    data: messages,
  };
}
