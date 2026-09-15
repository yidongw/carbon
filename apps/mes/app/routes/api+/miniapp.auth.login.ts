import { assertIsPost } from "@carbon/auth";
import { signInWithUserIdViaAdmin } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  findUserIdByIdentity,
  linkIdentity
} from "@carbon/auth/identity.server";
import { findOrCreatePhoneUser } from "@carbon/auth/phone.server";
import {
  acceptInviteForUser,
  getPendingInvitesForUser
} from "@carbon/auth/users.server";
import {
  exchangeMiniProgramCode,
  getMiniProgramPhoneNumber
} from "@carbon/auth/wechat.server";
import type { ActionFunctionArgs } from "react-router";
import { jsonResponse } from "~/utils/miniapp-response";

// 微信小程序一键登录(getPhoneNumber 绑定)—— 备用入口,当前登录页走手机号/邮箱验证码。
// 用 jsonResponse(定长 body),微信 wx.request 才能正常收到响应。
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);

  let code = "";
  let phoneCode = "";
  try {
    const body = (await request.json()) as {
      code?: string;
      phoneCode?: string;
    };
    code = body.code ?? "";
    phoneCode = body.phoneCode ?? "";
  } catch {
    return jsonResponse({ message: "请求体不是合法 JSON" }, { status: 400 });
  }

  if (!code) return jsonResponse({ message: "缺少 code" }, { status: 400 });

  const wx = await exchangeMiniProgramCode(code);
  if (!wx) {
    return jsonResponse(
      { message: "微信登录失败(code 无效或已过期)" },
      { status: 401 }
    );
  }

  const serviceRole = getCarbonServiceRole();

  // 1) 已绑定过微信身份 → 直接命中该 user。
  let userId = await findUserIdByIdentity("wechat", wx.unionid);

  // 2) 首次登录 → 用微信授权的手机号 resolve-or-bind。
  if (!userId) {
    if (!phoneCode) {
      return jsonResponse(
        { needPhone: true, message: "首次登录需授权手机号以关联员工" },
        { status: 409 }
      );
    }

    const phone = await getMiniProgramPhoneNumber(phoneCode);
    if (!phone) {
      return jsonResponse({ message: "获取微信手机号失败" }, { status: 400 });
    }

    const phoneUser = await findOrCreatePhoneUser(phone);
    if (!phoneUser) {
      return jsonResponse({ message: "关联员工失败" }, { status: 500 });
    }
    userId = phoneUser.id;

    await linkIdentity(userId, "wechat", wx.unionid);

    const pending = await getPendingInvitesForUser(serviceRole, userId);
    const firstInvite = pending.data?.[0];
    if (firstInvite) {
      await acceptInviteForUser(serviceRole, userId, firstInvite.id);
    }
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
