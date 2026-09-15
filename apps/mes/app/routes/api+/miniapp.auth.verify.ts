import { assertIsPost, RATE_LIMIT } from "@carbon/auth";
import { checkSmsVerifyCode } from "@carbon/auth/aliyun-sms.server";
import { signInWithUserIdViaAdmin } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { findOrCreatePhoneUser } from "@carbon/auth/phone.server";
import {
  acceptInviteForUser,
  getPendingInvitesForUser,
  getUserByEmail
} from "@carbon/auth/users.server";
import { verifyEmailCode } from "@carbon/auth/verification.server";
import { Ratelimit, redis } from "@carbon/kv";
import type { ActionFunctionArgs } from "react-router";
import { jsonResponse } from "~/utils/miniapp-response";

// 小程序登录:校验验证码 → 解析/建立员工 user → 接受待处理邀请(入职)→ 签发 token。
// 手机号:验证码通过则 findOrCreatePhoneUser;邮箱:仅认已有账号。都汇到
// signInWithUserIdViaAdmin(内部解析 auth 邮箱、选公司)。与 MES 网页登录同源。
//
// 用 jsonResponse(定长 body + Content-Length),微信 wx.request 才能正常收到响应。
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
    return jsonResponse(
      { message: "请求过于频繁,请稍后再试" },
      { status: 429 }
    );
  }

  let phone = "";
  let email = "";
  let code = "";
  try {
    const body = (await request.json()) as {
      phone?: string;
      email?: string;
      code?: string;
    };
    phone = (body.phone ?? "").trim();
    email = (body.email ?? "").trim().toLowerCase();
    code = (body.code ?? "").trim();
  } catch {
    return jsonResponse({ message: "请求体不是合法 JSON" }, { status: 400 });
  }

  if (!code) return jsonResponse({ message: "请输入验证码" }, { status: 400 });

  let userId = "";

  if (phone) {
    const valid = await checkSmsVerifyCode(phone, code);
    if (!valid) {
      return jsonResponse({ message: "验证码错误或已过期" }, { status: 401 });
    }

    const user = await findOrCreatePhoneUser(phone);
    if (!user)
      return jsonResponse({ message: "关联员工失败" }, { status: 500 });
    if (!user.active) {
      return jsonResponse(
        { message: "账号未激活,请联系管理员" },
        { status: 403 }
      );
    }
    userId = user.id;
  } else if (email) {
    const valid = await verifyEmailCode(email, code);
    if (!valid) {
      return jsonResponse({ message: "验证码错误或已过期" }, { status: 401 });
    }

    const user = await getUserByEmail(email);
    if (!user.data || !user.data.active) {
      return jsonResponse({ message: "该邮箱未注册或未激活" }, { status: 403 });
    }
    userId = user.data.id;
  } else {
    return jsonResponse({ message: "请提供手机号或邮箱" }, { status: 400 });
  }

  const serviceRole = getCarbonServiceRole();

  // 管理员若已按此手机号/邮箱发出邀请 → 接受,授予公司成员资格 + 权限。
  const pending = await getPendingInvitesForUser(serviceRole, userId);
  const firstInvite = pending.data?.[0];
  if (firstInvite) {
    await acceptInviteForUser(serviceRole, userId, firstInvite.id);
  }

  const authSession = await signInWithUserIdViaAdmin(userId);
  if (!authSession) {
    return jsonResponse({ message: "创建会话失败" }, { status: 500 });
  }

  return jsonResponse({
    token: authSession.accessToken,
    refreshToken: authSession.refreshToken,
    userId: authSession.userId,
    companyId: authSession.companyId,
    expiresAt: authSession.expiresAt,
    hasCompany: Boolean(authSession.companyId)
  });
}
