import { AUTH_PROVIDERS } from "@carbon/auth";
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
  const providers = AUTH_PROVIDERS.split(",");
  if (!providers.includes("wechat")) {
    return data({ url: null, scene: null }, { status: 404 });
  }

  const scene = crypto.randomUUID().replace(/-/g, "");
  const qr = await createWeChatQrTicket(scene, SCENE_TTL);
  if (!qr) {
    return data({ url: null, scene: null }, { status: 502 });
  }

  await redis.set(
    `${SCENE_PREFIX}${scene}`,
    JSON.stringify({ status: "pending" }),
    "EX",
    SCENE_TTL
  );

  return data({ url: qr.url, scene });
}
