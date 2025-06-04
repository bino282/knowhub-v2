"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/password";

export async function updateUserProfile(
  userId: string,
  { profileData }: { profileData: { password?: string } }
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    console.log(
      "Updating user profile for userId:",
      userId,
      "with data:",
      profileData
    );
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const updateData: { name?: string; password?: string } = {};

    if (profileData.password) {
      updateData.password = hashPassword(profileData.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
