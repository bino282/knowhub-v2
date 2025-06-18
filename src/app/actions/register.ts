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
    // Register ragflow
    const res = await registerRagflowUser(email, name);
    if (res.success) {
      // Hash password
      const hashedPassword = hashPassword(password);
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          apiKey: res.data,
        },
      });
    }

    return { message: "User registered successfully", success: true };
  } catch (error) {
    return {
      message: "",
      error: "An unexpected error occurred",
      success: false,
    };
  }
}
export async function registerRagflowUser(
  email: string,
  nickname: string
): Promise<{
  message: string;
  error?: string;
  success: boolean;
  data?: string;
}> {
  const passwordRagflow = process.env.PASSWORD_RAGFLOW_ENCODE ?? "";

  try {
    // register ragflow
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_RAGFLOW}/v1/user/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          nickname,
          password: passwordRagflow,
        }),
      }
    );
    const data = await response.json();
    // tồn tại email thì cho login
    if (data.code === 103) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_RAGFLOW}/v1/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: passwordRagflow,
          }),
        }
      );
      if (response.status !== 200) {
        const errorData = await response.json();
        return { message: "", error: errorData.message, success: false };
      }
      const setCookie = response.headers.get("set-cookie");
      const authorization = response.headers.get("authorization");
      if (setCookie && authorization) {
        const apiKey = await createNewTokenRagflow(setCookie, authorization);
        return {
          message: "Ragflow user registered successfully",
          success: true,
          data: apiKey,
        };
      }
    }
    if (data.code !== 0) {
      return {
        message: "Ragflow user registered faild",
        success: true,
      };
    }
    const setCookie = response.headers.get("set-cookie");
    const authorization = response.headers.get("authorization");

    if (setCookie && authorization) {
      const apiKey = await createNewTokenRagflow(setCookie, authorization);
      return {
        message: "Ragflow user registered successfully",
        success: true,
        data: apiKey,
      };
    }

    return {
      message: "",
      error: "Missing authentication headers in Ragflow response",
      success: false,
    };
  } catch (error) {
    return {
      message: "",
      error: "An unexpected error occurred",
      success: false,
    };
  }
}
async function createNewTokenRagflow(setCookie: string, authorization: string) {
  const cookie = setCookie.split(";")[0];

  const apiKeyResponse = await fetch(
    `${process.env.NEXT_PUBLIC_URL_RAGFLOW}/v1/system/new_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
        Authorization: authorization,
      },
    }
  );
  if (apiKeyResponse.status !== 200) {
    const errorData = await apiKeyResponse.json();
    return { message: "", error: errorData.message, success: false };
  }

  const dataKey = await apiKeyResponse.json();
  return dataKey.data.token;
}
