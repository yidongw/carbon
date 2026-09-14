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
import { data } from "react-router";

// 微信小程序登录 —— resolve-or-bind(不再新建孤儿 user)。
//
//   wx.login() code → jscode2session → unionid
//     ├─ 已有 wechat 身份 → 直接登录该员工 user(老用户,不需手机号)
//     └─ 首次 → 需要 getPhoneNumber 的 phoneCode:
//          手机号 → findOrCreatePhoneUser(以手机为准的员工 user)
//                 → linkIdentity 挂上 wechat 身份
//                 → 若管理员已按此手机号邀请 → acceptInviteForUser 授予公司成员
//
// 微信、手机、邮箱都是同一 user 的 userIdentity,天然互通。会话用
// signInWithUserIdViaAdmin 铸造(内部解析 auth 邮箱、选公司),以 JSON 返回 token。
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
    return data({ message: "请求体不是合法 JSON" }, { status: 400 });
  }

  if (!code) return data({ message: "缺少 code" }, { status: 400 });

  const wx = await exchangeMiniProgramCode(code);
  if (!wx) {
    return data(
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
      // 前端据此弹出「授权手机号」按钮,再带 phoneCode 重试。
      return data(
        { needPhone: true, message: "首次登录需授权手机号以关联员工" },
        { status: 409 }
      );
    }

    const phone = await getMiniProgramPhoneNumber(phoneCode);
    if (!phone) return data({ message: "获取微信手机号失败" }, { status: 400 });

    const phoneUser = await findOrCreatePhoneUser(phone);
    if (!phoneUser) return data({ message: "关联员工失败" }, { status: 500 });
    userId = phoneUser.id;

    // 把微信身份挂到这个(手机号)员工 user 上,以后微信登录直接命中。
    await linkIdentity(userId, "wechat", wx.unionid);

    // 管理员若已按此手机号发出邀请 → 接受,授予公司成员资格 + 权限。
    const pending = await getPendingInvitesForUser(serviceRole, userId);
    const firstInvite = pending.data?.[0];
    if (firstInvite) {
      await acceptInviteForUser(serviceRole, userId, firstInvite.id);
    }
  }

  const authSession = await signInWithUserIdViaAdmin(userId);
  if (!authSession) return data({ message: "创建会话失败" }, { status: 500 });

  return data({
    token: authSession.accessToken,
    refreshToken: authSession.refreshToken,
    userId: authSession.userId,
    companyId: authSession.companyId,
    expiresAt: authSession.expiresAt,
    // 无公司归属 → 登录成功但没有可读数据,前端提示"待管理员邀请"。
    hasCompany: Boolean(authSession.companyId)
  });
}
