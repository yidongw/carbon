import {
  assertIsPost,
  error,
  phoneLoginValidator,
  RATE_LIMIT
} from "@carbon/auth";
import { sendSmsVerifyCode } from "@carbon/auth/aliyun-sms.server";
import { validator } from "@carbon/form";
import { Ratelimit, redis } from "@carbon/kv";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";

// Sends an Aliyun SMS verification code, then the client navigates to /verify-phone
// to enter it. Aliyun owns the code (generation, expiry, resend throttle); we only
// add a coarse per-IP limit on top.
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

  const validation = await validator(phoneLoginValidator).validate(
    await request.formData()
  );
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
