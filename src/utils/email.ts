import nodemailer from "nodemailer";
import crypto from "crypto";

// Configure email transporter
const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const transporter = nodemailer.createTransport({
  host: host,
  port: 2525,
  auth: {
    user: user,
    pass: pass,
  },
});

// Generate a verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Verify Email
        </a>
        <p>If you didn't sign up for this service, you can ignore this email.</p>
        <p>This verification link will expire in 24 hours.</p>
      </div>
    `,
  });
}

// Check if verification token is valid and not expired
export function isTokenValid(tokenExp: Date | null): boolean {
  if (!tokenExp) return false;
  return new Date() < new Date(tokenExp);
}
