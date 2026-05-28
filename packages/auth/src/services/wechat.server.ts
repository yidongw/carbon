import {
  WECHAT_MP_APP_ID,
  WECHAT_MP_APP_SECRET,
  WECHAT_OPEN_APP_ID,
  WECHAT_OPEN_APP_SECRET,
  WECHAT_REDIRECT_URL
} from "@carbon/env";
import { getCarbonServiceRole } from "../lib/supabase/client.server";

export function buildWeChatMpAuthUrl(state: string): string {
  const params = new URLSearchParams({
    appid: WECHAT_MP_APP_ID ?? "",
    redirect_uri: WECHAT_REDIRECT_URL ?? "",
    response_type: "code",
    scope: "snsapi_userinfo",
    state
  });
  return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
}

export function buildWeChatOpenAuthUrl(state: string): string {
  const params = new URLSearchParams({
    appid: WECHAT_OPEN_APP_ID ?? "",
    redirect_uri: WECHAT_REDIRECT_URL ?? "",
    response_type: "code",
    scope: "snsapi_login",
    state
  });
  // No #wechat_redirect fragment — that's only required for the in-app browser (MP) flow
  return `https://open.weixin.qq.com/connect/qrconnect?${params.toString()}`;
}

export async function exchangeWeChatCode(
  code: string,
  type: "mp" | "open"
): Promise<{ openid: string; unionid: string; access_token: string } | null> {
  const appId = type === "mp" ? WECHAT_MP_APP_ID : WECHAT_OPEN_APP_ID;
  const appSecret =
    type === "mp" ? WECHAT_MP_APP_SECRET : WECHAT_OPEN_APP_SECRET;

  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
  const resp = await fetch(url);
  const data = (await resp.json()) as {
    access_token?: string;
    openid?: string;
    unionid?: string;
    errcode?: number;
  };

  if (data.errcode || !data.access_token || !data.openid) return null;

  return {
    access_token: data.access_token,
    openid: data.openid,
    unionid: data.unionid ?? data.openid
  };
}

export async function getWeChatUserInfo(
  accessToken: string,
  openid: string
): Promise<{ unionid: string; nickname: string; headimgurl: string } | null> {
  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`;
  const resp = await fetch(url);
  const data = (await resp.json()) as {
    unionid?: string;
    nickname?: string;
    headimgurl?: string;
    errcode?: number;
  };

  if (data.errcode || !data.unionid) return null;

  return {
    unionid: data.unionid,
    nickname: data.nickname ?? "",
    headimgurl: data.headimgurl ?? ""
  };
}

export async function findOrCreateWeChatUser(
  unionid: string,
  nickname: string,
  avatarUrl: string
) {
  const serviceRole = getCarbonServiceRole();

  const existing = await serviceRole
    .from("user")
    .select("*")
    .eq("wechat_unionid", unionid)
    .maybeSingle();

  if (existing.data) return existing.data;

  // Assign a stable synthetic email so that generateLink (magic-link flow) can
  // locate this auth user later. Without an email, generateLink would create a
  // *new* auth user instead of signing in the existing one.
  const syntheticEmail = `wechat+${unionid}@carbon.internal`;

  const { data: authUser, error: authError } =
    await serviceRole.auth.admin.createUser({
      email: syntheticEmail,
      email_confirm: true,
      user_metadata: {
        wechat_unionid: unionid,
        name: nickname,
        avatar_url: avatarUrl
      }
    });

  if (authError || !authUser.user) return null;

  // The create_public_user trigger fires synchronously and inserts a bare row.
  // Update it with WeChat-specific fields rather than inserting again (which
  // would conflict on the primary key).
  const nameParts = nickname.trim().split(/\s+/);
  const { data: updatedUser } = await serviceRole
    .from("user")
    .update({
      wechat_unionid: unionid,
      firstName: nameParts[0] ?? nickname,
      lastName: nameParts.slice(1).join(" "),
      avatarUrl: avatarUrl || null,
    })
    .eq("id", authUser.user.id)
    .select("*")
    .single();

  return updatedUser;
}
