import { assertIsPost, RATE_LIMIT } from "@carbon/auth";
import { sendSmsVerifyCode } from "@carbon/auth/aliyun-sms.server";
import { getUserByEmail } from "@carbon/auth/users.server";
import { sendVerificationCode } from "@carbon/auth/verification.server";
import { Ratelimit, redis } from "@carbon/kv";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";

// 小程序登录:发送验证码。手机号走阿里云短信,邮箱走邮件 6 位码(与 MES 网页登录同源)。
// 手机号可自助登录(首次验证后按邀请入职);邮箱仅限已有账号。
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
    return data({ message: "请求过于频繁,请稍后再试" }, { status: 429 });
  }

  let phone = "";
  let email = "";
  try {
    const body = (await request.json()) as { phone?: string; email?: string };
    phone = (body.phone ?? "").trim();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return data({ message: "请求体不是合法 JSON" }, { status: 400 });
  }

  if (phone) {
    const sent = await sendSmsVerifyCode(phone);
    if (!sent)
      return data({ message: "验证码发送失败,请稍后重试" }, { status: 502 });
    return data({ ok: true, channel: "phone" });
  }

  if (email) {
    // 邮箱登录仅限系统中已存在且激活的账号(与网页登录一致)。
    const user = await getUserByEmail(email);
    if (!user.data || !user.data.active) {
      return data({ message: "该邮箱未注册或未激活" }, { status: 404 });
    }
    const sent = await sendVerificationCode(email);
    if (!sent)
      return data({ message: "验证码发送失败,请稍后重试" }, { status: 502 });
    return data({ ok: true, channel: "email" });
  }

  return data({ message: "请提供手机号或邮箱" }, { status: 400 });
}
