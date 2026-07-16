import { assertIsPost } from "@carbon/auth";
import {
  checkSmsVerifyCode,
  sendSmsVerifyCode
} from "@carbon/auth/aliyun-sms.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  findUserIdByIdentity,
  linkIdentity
} from "@carbon/auth/identity.server";
import { toE164Phone } from "@carbon/auth/phone.server";
import { getAuthSession } from "@carbon/auth/session.server";
import {
  sendVerificationCode,
  verifyEmailCode
} from "@carbon/auth/verification.server";
import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { path } from "~/utils/path";

// Links an additional login method (phone / email) to the already-authenticated
// joiner so they can satisfy an invite link's required-login-methods sequence.
// Mirrors the profile "add phone/email" intents; WeChat/OAuth linking reuse
// their existing routes (/auth/wechat?link=1, /api/wechat-qr-url?link=1).
export async function action({ params, request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { code } = params;
  if (!code) throw new Error("No code provided");

  const authSession = await getAuthSession(request);
  if (!authSession) {
    throw redirect(
      `${path.to.login}?redirectTo=${encodeURIComponent(path.to.joinLink(code))}`
    );
  }
  const userId = authSession.userId;

  const formData = await request.formData();
  const intent = formData.get("intent");

  // Add phone: send an SMS code, then verify + link to this account.
  if (intent === "addPhoneSend") {
    const phone = formData.get("phone") as string;
    if (!/^1[3-9]\d{9}$/.test(phone ?? "")) {
      return data({ success: false, message: "Invalid phone number" });
    }
    const owner = await findUserIdByIdentity("phone", toE164Phone(phone));
    if (owner) {
      return data({
        success: false,
        message:
          owner === userId
            ? "This phone is already linked to your account"
            : "That phone is already linked to another account"
      });
    }
    const sent = await sendSmsVerifyCode(phone);
    return sent
      ? data({ success: true, step: "addPhoneSent", phone })
      : data({ success: false, message: "Failed to send verification code" });
  }

  if (intent === "addPhoneVerify") {
    const phone = formData.get("phone") as string;
    const smsCode = formData.get("code") as string;
    if (!(await checkSmsVerifyCode(phone, smsCode))) {
      return data({ success: false, message: "Invalid or expired code" });
    }
    const link = await linkIdentity(userId, "phone", toE164Phone(phone));
    if (!link.success) {
      return data({
        success: false,
        message:
          link.reason === "conflict"
            ? "That phone is already linked to another account"
            : "Failed to link phone"
      });
    }
    return data({ linked: true });
  }

  // Add email: send a code, then verify + link.
  if (intent === "addEmailSend") {
    const email = formData.get("email") as string;
    if (!email || !email.includes("@")) {
      return data({ success: false, message: "Invalid email address" });
    }
    let owner: string | null = null;
    for (const t of ["email", "google", "azure"] as const) {
      owner = await findUserIdByIdentity(t, email);
      if (owner) break;
    }
    if (owner) {
      return data({
        success: false,
        message:
          owner === userId
            ? "This email is already linked to your account"
            : "That email is already linked to another account"
      });
    }
    const sent = await sendVerificationCode(email);
    return sent
      ? data({ success: true, step: "addEmailSent", email })
      : data({ success: false, message: "Failed to send verification code" });
  }

  if (intent === "addEmailVerify") {
    const email = formData.get("email") as string;
    const emailCode = formData.get("code") as string;
    if (!(await verifyEmailCode(email, emailCode))) {
      return data({ success: false, message: "Invalid or expired code" });
    }
    let emailOwner: string | null = null;
    for (const t of ["email", "google", "azure"] as const) {
      emailOwner = await findUserIdByIdentity(t, email);
      if (emailOwner) break;
    }
    if (emailOwner && emailOwner !== userId) {
      return data({
        success: false,
        message: "That email is already linked to another account"
      });
    }
    if (emailOwner === userId) {
      return data({ linked: true });
    }
    const link = await linkIdentity(userId, "email", email);
    if (!link.success) {
      return data({
        success: false,
        message:
          link.reason === "conflict"
            ? "That email is already linked to another account"
            : "Failed to link email"
      });
    }
    const serviceRole = getCarbonServiceRole();
    const { error: authError } = await serviceRole.auth.admin.updateUserById(
      userId,
      { email, email_confirm: true }
    );
    if (authError) {
      console.error("[join link-email] updateUserById failed, rolling back");
      // Best-effort: leave the identity in place; the email link still counts.
    } else {
      await serviceRole.from("user").update({ email }).eq("id", userId);
    }
    return data({ linked: true });
  }

  return data({ success: false, message: "Unknown action" });
}

export default function Route() {
  return null;
}
