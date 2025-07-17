import { registerRagflowUser } from "@/app/actions/register";
import { prisma } from "./prisma";

export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  apiKey: string,
  data?: unknown,
  retry = true,
  userInfo?: { email: string; nickname: string },
  customHeaders?: HeadersInit
): Promise<T> {
  const API_URL = process.env.NEXT_PUBLIC_URL_RAGFLOW;
  const API_KEY = apiKey;

  if (!API_KEY) {
    throw new Error(
      "API key is missing. Set RAGFLOW_API_KEY in your environment."
    );
  }

  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  const hasBody = method !== "GET" && data !== undefined;
  let fullUrl = `${API_URL}/${url}`;
  if (method === "GET" && data && typeof data === "object") {
    const queryParams = new URLSearchParams(
      data as Record<string, string>
    ).toString();
    fullUrl += `?${queryParams}`;
  }
  // Use a plain object to build headers
  const headers: Record<string, string> = {
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
  };

  // Merge customHeaders safely if provided
  if (customHeaders instanceof Headers) {
    customHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(customHeaders)) {
    for (const [key, value] of customHeaders) {
      headers[key] = value;
    }
  } else if (typeof customHeaders === "object" && customHeaders !== null) {
    Object.assign(headers, customHeaders);
  }

  if (hasBody && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(fullUrl, {
    method,
    headers,
    ...(hasBody && {
      body: isFormData ? (data as FormData) : JSON.stringify(data),
    }),
    next: { revalidate: 0 },
  });
  const json = response.status === 204 ? null : await response.json();

  if (json?.code === 109 && retry && userInfo) {
    const newApiKey = await registerRagflowUser(
      userInfo.email,
      userInfo.nickname
    );
    if (newApiKey.data && newApiKey.data.apiKey) {
      await prisma.user.update({
        where: { email: userInfo.email },
        data: { apiKey: newApiKey.data.apiKey },
      });
      return await apiRequest<T>(
        method,
        url,
        newApiKey.data.apiKey,
        data,
        false,
        userInfo,
        customHeaders
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      `${method} ${url} → ${response.status}: ${JSON.stringify(json)}`
    );
  }

  return json;
}
