import { authOptions } from "@/lib/authOption";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getActivityByUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, message: "User not authenticated" };
  }
  const userId = session.user.id;
  try {
    const activities = await prisma.activity.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: { name: true },
        },
      },
    });
    return { success: true, data: activities };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return { success: false, message: "Failed to fetch activities" };
  }
}
