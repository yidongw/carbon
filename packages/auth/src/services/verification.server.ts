import { VerificationEmail } from "@carbon/documents/email";
import { redis } from "@carbon/kv";
import { sendEmail } from "@carbon/lib/resend.server";
import { render } from "@react-email/components";
import { RESEND_DOMAIN } from "../config/env";

/**
 * Generate a 6-digit code and store it in Redis (10-minute TTL), returning it.
 * Throws if Redis is unreachable — the caller must surface that, since a login
 * can't proceed without a persisted code.
 */
export async function storeVerificationCode(email: string): Promise<string> {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await redis.set(
    `verification:${email.toLowerCase()}`,
    verificationCode,
    "EX",
    600
  );

  return verificationCode;
}

/**
 * Render and send the verification email. Safe to run in the background
 * (e.g. via `waitUntil`): the code is already persisted by
 * `storeVerificationCode`, so a slow or failed send never blocks the login
 * response. Returns false on failure (logged), true on success.
 */
export async function sendVerificationEmail(
  email: string,
  verificationCode: string
): Promise<boolean> {
  try {
    const html = await render(
      VerificationEmail({
        email,
        verificationCode
      })
    );

    const result = await sendEmail({
      from: `Carbon <no-reply@${RESEND_DOMAIN}>`,
      to: email,
      subject: "Verify your email address",
      html
    });

    return !result.error;
  } catch (error) {
    console.error("Failed to send verification code:", error);
    return false;
  }
}

/**
 * Store the code and send the email, awaiting both. Retained for callers that
 * want the original blocking behavior (e.g. MES).
 */
export async function sendVerificationCode(email: string): Promise<boolean> {
  try {
    const verificationCode = await storeVerificationCode(email);
    return await sendVerificationEmail(email, verificationCode);
  } catch (error) {
    console.error("Failed to send verification code:", error);
    return false;
  }
}

export async function verifyEmailCode(email: string, code: string) {
  try {
    const storedCode = await redis.get(`verification:${email.toLowerCase()}`);

    if (!storedCode || String(storedCode).trim() !== String(code).trim()) {
      return false;
    }

    // Delete the code after successful verification
    await redis.del(`verification:${email.toLowerCase()}`);

    return true;
  } catch (error) {
    console.error("Failed to verify email code:", error);
    return false;
  }
}
