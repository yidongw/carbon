import {
  assertIsPost,
  CarbonEdition,
  CLOUDFLARE_TURNSTILE_SITE_KEY,
  CLOUDFLARE_TURNSTILE_SECRET_KEY,
  error,
  phoneLoginValidator,
  RATE_LIMIT
} from "@carbon/auth";
import { sendSmsVerifyCode } from "@carbon/auth/aliyun-sms.server";
import { validator } from "@carbon/form";
import { Ratelimit, redis } from "@carbon/kv";
import { Edition } from "@carbon/utils";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";

// Sends an Aliyun SMS verification code, then the client navigates to /verify-phone
// to enter it. Aliyun owns the code (generation, expiry, resend throttle); we add a
// coarse per-IP limit and the same Turnstile bot check the email login uses.
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT, "1 h"),
    analytics: true
  });
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return error(null, "Rate limit exceeded");
  }

  const formData = await request.formData();

  // Same bot check as the email /login action (no-op until Turnstile is enabled).
  if (
    CarbonEdition === Edition.Cloud &&
    CLOUDFLARE_TURNSTILE_SITE_KEY !== "1x00000000000000000000AA"
  ) {
    const turnstileToken = formData.get("turnstileToken") as string | null;
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: CLOUDFLARE_TURNSTILE_SECRET_KEY ?? "",
          response: turnstileToken ?? "",
          remoteip: ip
        })
      }
    );
    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      return error(null, "Bot verification failed. Please try again.");
    }
  }

  const validation = await validator(phoneLoginValidator).validate(formData);
  if (validation.error) {
    return error(validation.error, "Invalid phone number");
  }

  const { phone } = validation.data;
  const sent = await sendSmsVerifyCode(phone);
  if (!sent) {
    return error(null, "Failed to send verification code");
  }

  return data({ success: true, phone });
}
