import {
  WECHAT_MP_APP_ID,
  WECHAT_MP_APP_SECRET,
  WECHAT_WEBHOOK_TOKEN
} from "@carbon/env";
import { redis } from "@carbon/kv";
import { createHash } from "node:crypto";
import { getCarbonServiceRole } from "../lib/supabase/client.server";

// OAuth callback for the in-app flow. The host varies per environment (and per
// tunnel restart), so the caller passes the current request origin and we build
// the full redirect_uri here — no WECHAT_REDIRECT_URL env var to keep in sync.
// (The resulting domain must still be registered under the account's 网页授权域名.)
const WECHAT_CALLBACK_PATH = "/auth/wechat-callback";

export function buildWeChatMpAuthUrl(state: string, origin: string): string {
  const params = new URLSearchParams({
    appid: WECHAT_MP_APP_ID ?? "",
    redirect_uri: `${origin}${WECHAT_CALLBACK_PATH}`,
    response_type: "code",
    scope: "snsapi_userinfo",
    state
  });
  return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
}

export async function exchangeWeChatCode(
  code: string
): Promise<{ openid: string; unionid: string; access_token: string } | null> {
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_MP_APP_ID}&secret=${WECHAT_MP_APP_SECRET}&code=${code}&grant_type=authorization_code`;
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
    openid?: string;
    unionid?: string;
    nickname?: string;
    headimgurl?: string;
    errcode?: number;
  };

  console.log("[wechat userinfo] response", JSON.stringify(data));
  if (data.errcode) return null;

  return {
    unionid: data.unionid ?? data.openid ?? "",
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
  console.log("[wechat findOrCreate] existing lookup", existing.error ? `ERROR: ${JSON.stringify(existing.error)}` : existing.data ? "found" : "not found");

  if (existing.data) {
    // Returning user: refresh the avatar from WeChat if it changed or was missing
    // (an earlier login may have captured none). Leave their name untouched.
    if (avatarUrl && avatarUrl !== existing.data.avatarUrl) {
      const { data: refreshed } = await serviceRole
        .from("user")
        .update({ avatarUrl })
        .eq("id", existing.data.id)
        .select("*")
        .single();
      return refreshed ?? existing.data;
    }
    return existing.data;
  }

  // The synthetic email lives ONLY on the auth user: generateLink (our magic-link
  // sign-in) is email-based and needs it to locate this user later. The public
  // user.email is nulled below so a fake address is never surfaced. Lowercased to
  // match GoTrue's storage and the value we re-derive at sign-in.
  const syntheticEmail = `wechat+${unionid.toLowerCase()}@carbon.internal`;

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
  console.log("[wechat findOrCreate] createUser", authError ? `ERROR: ${JSON.stringify(authError)}` : authUser.user?.id);

  if (authError || !authUser.user) return null;

  // The create_public_user trigger fires synchronously and inserts a bare row.
  // Update it with WeChat-specific fields rather than inserting again (which
  // would conflict on the primary key).
  const nameParts = nickname.trim().split(/\s+/);
  const { data: updatedUser } = await serviceRole
    .from("user")
    .update({
      email: null,
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

// ── 公众号 (MP) parametric-QR scan login ──────────────────────────────────────
// Desktop "scan to sign in" using only the MP (test) account: mint a scene-tagged
// QR, the user scans it, WeChat pushes a SCAN/subscribe event to our webhook.

const WECHAT_API = "https://api.weixin.qq.com";

/** Global access_token for cgi-bin APIs, cached in Redis (token lives ~7200s). */
export async function getWeChatAccessToken(): Promise<string | null> {
  const cached = await redis.get("wechat:mp:access_token");
  if (cached) return cached as string;

  const resp = await fetch(
    `${WECHAT_API}/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_MP_APP_ID}&secret=${WECHAT_MP_APP_SECRET}`
  );
  const data = (await resp.json()) as {
    access_token?: string;
    expires_in?: number;
    errcode?: number;
    errmsg?: string;
  };

  if (!data.access_token) {
    console.error("[wechat token] failed", JSON.stringify(data));
    return null;
  }

  // Refresh a little early to avoid edge expiry.
  await redis.set(
    "wechat:mp:access_token",
    data.access_token,
    "EX",
    Math.max((data.expires_in ?? 7200) - 200, 60)
  );
  return data.access_token;
}

/**
 * Create a temporary parametric QR tied to `scene`. Returns the URL the QR
 * encodes (render it client-side). Scanning it makes WeChat push a SCAN/subscribe
 * event carrying `scene` + the user's openid to our webhook.
 */
export async function createWeChatQrTicket(
  scene: string,
  expireSeconds = 600
): Promise<{ url: string; ticket: string } | null> {
  const token = await getWeChatAccessToken();
  if (!token) return null;

  const resp = await fetch(
    `${WECHAT_API}/cgi-bin/qrcode/create?access_token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expire_seconds: expireSeconds,
        action_name: "QR_STR_SCENE",
        action_info: { scene: { scene_str: scene } }
      })
    }
  );
  const data = (await resp.json()) as {
    ticket?: string;
    url?: string;
    errcode?: number;
    errmsg?: string;
  };

  if (!data.ticket || !data.url) {
    console.error("[wechat qrcode] failed", JSON.stringify(data));
    return null;
  }
  return { url: data.url, ticket: data.ticket };
}

/** Follower profile (nickname/avatar) for a given openid; null if not retrievable. */
export async function getWeChatMpUserInfo(
  openid: string
): Promise<{ nickname: string; headimgurl: string } | null> {
  const token = await getWeChatAccessToken();
  if (!token) return null;

  const resp = await fetch(
    `${WECHAT_API}/cgi-bin/user/info?access_token=${token}&openid=${openid}&lang=zh_CN`
  );
  const data = (await resp.json()) as {
    nickname?: string;
    headimgurl?: string;
    errcode?: number;
  };
  if (data.errcode) return null;
  return { nickname: data.nickname ?? "", headimgurl: data.headimgurl ?? "" };
}

/** Verify the signature WeChat attaches to webhook GET (verify) and POST (events). */
export function verifyWeChatSignature(params: {
  signature: string;
  timestamp: string;
  nonce: string;
}): boolean {
  const { signature, timestamp, nonce } = params;
  if (!signature || !timestamp || !nonce || !WECHAT_WEBHOOK_TOKEN) return false;
  const hash = createHash("sha1")
    .update([WECHAT_WEBHOOK_TOKEN, timestamp, nonce].sort().join(""))
    .digest("hex");
  return hash === signature;
}

/**
 * Build a passive-reply text message. Returned as the webhook response body so
 * WeChat delivers `content` to the user as a chat message from the account.
 * `toUser` is the recipient openid (the event's FromUserName); `fromUser` is the
 * account's gh id (the event's ToUserName).
 */
export function buildWeChatTextReply(
  toUser: string,
  fromUser: string,
  content: string
): string {
  const now = Math.floor(Date.now() / 1000);
  return `<xml><ToUserName><![CDATA[${toUser}]]></ToUserName><FromUserName><![CDATA[${fromUser}]]></FromUserName><CreateTime>${now}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${content}]]></Content></xml>`;
}

/** Minimal extractor for WeChat's flat event XML (values may be CDATA-wrapped). */
export function parseWeChatEventXml(xml: string): Record<string, string> {
  const out: Record<string, string> = {};
  // Drop the outer <xml>…</xml> wrapper so it isn't captured as a single field.
  const inner = xml.replace(/<\/?xml>/g, "");
  const re = /<(\w+)>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner))) {
    out[m[1]] = (m[2] ?? m[3] ?? "").trim();
  }
  return out;
}
