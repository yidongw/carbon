import { AUTH_PROVIDERS } from "@carbon/auth";
import { getAuthSession } from "@carbon/auth/session.server";
import { createWeChatQrTicket } from "@carbon/auth/wechat.server";
import { redis } from "@carbon/kv";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";

const SCENE_PREFIX = "wechat-qr:";
const SCENE_TTL = 600; // seconds

/**
 * Mint a 公众号 parametric QR for desktop scan-login. Returns the URL the QR
 * encodes (rendered client-side) plus the `scene` the browser polls on. The
 * matching scan event arrives at /api/webhook/wechat.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const providers = AUTH_PROVIDERS.split(",");
  // Return 200 with a null url (not an error status) so the login page's
  // fetcher reads it as data and falls back to email, rather than tripping the
  // route error boundary on a 4xx/5xx response.
  if (!providers.includes("wechat")) {
    return data({ url: null, scene: null });
  }

  // link=1: a signed-in user is connecting WeChat. Stash their id in the scene so
  // the webhook links the scanned account to them instead of signing them in.
  let linkUserId: string | undefined;
  if (url.searchParams.get("link") === "1") {
    const authSession = await getAuthSession(request);
    if (!authSession?.userId) {
      return data({ url: null, scene: null });
    }
    linkUserId = authSession.userId;
  }

  const scene = crypto.randomUUID().replace(/-/g, "");
  const qr = await createWeChatQrTicket(scene, SCENE_TTL);
  if (!qr) {
    return data({ url: null, scene: null });
  }

  await redis.set(
    `${SCENE_PREFIX}${scene}`,
    JSON.stringify(
      linkUserId ? { status: "pending", linkUserId } : { status: "pending" }
    ),
    "EX",
    SCENE_TTL
  );

  return data({ url: qr.url, scene });
}
