// lib/email-token.ts
import crypto from "crypto";

/**
 * Generate a random email verification token and its hashed version
 * @returns { token: string, hashedToken: string, expiresAt: Date }
 */
export function generateEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex"); // raw token gửi cho người dùng
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex"); // lưu hashed vào DB
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 giờ hết hạn

  return { token, hashedToken, expiresAt };
}
