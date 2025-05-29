"use server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/password";

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ message: string; error?: string; success: boolean }> {
  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return { message: "", error: "User already exists", success: false };
    }
    // Hash password
    const hashedPassword = hashPassword(password);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { message: "User registered successfully", success: true };
  } catch (error) {
    return {
      message: "",
      error: "An unexpected error occurred",
      success: false,
    };
  }
}
