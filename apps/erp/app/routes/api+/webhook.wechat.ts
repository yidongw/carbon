import {
  buildWeChatTextReply,
  findOrCreateWeChatUser,
  getWeChatMpUserInfo,
  parseWeChatEventXml,
  verifyWeChatSignature
} from "@carbon/auth/wechat.server";
import { redis } from "@carbon/kv";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

const SCENE_PREFIX = "wechat-qr:";

/**
 * GET — WeChat 接口配置信息 verification handshake: echo back `echostr` when the
 * signature checks out so WeChat accepts this URL as the message/event receiver.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  console.log("[wechat webhook] GET verify", url.search);
  const ok = verifyWeChatSignature({
    signature: url.searchParams.get("signature") ?? "",
    timestamp: url.searchParams.get("timestamp") ?? "",
    nonce: url.searchParams.get("nonce") ?? ""
  });

  if (ok) {
    return new Response(url.searchParams.get("echostr") ?? "", {
      headers: { "Content-Type": "text/plain" }
    });
  }
  return new Response("invalid signature", { status: 401 });
}

/**
 * POST — scan/subscribe event push. When a user scans a scene-tagged QR, mark the
 * matching scene as authenticated (resolving openid → user) so the browser's poll
 * can complete the login.
 */
export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const ok = verifyWeChatSignature({
    signature: url.searchParams.get("signature") ?? "",
    timestamp: url.searchParams.get("timestamp") ?? "",
    nonce: url.searchParams.get("nonce") ?? ""
  });
  if (!ok) return new Response("invalid signature", { status: 401 });

  const msg = parseWeChatEventXml(await request.text());
  console.log("[wechat webhook] POST event", JSON.stringify(msg));

  const isScan =
    msg.MsgType === "event" &&
    (msg.Event === "SCAN" || msg.Event === "subscribe");

  if (isScan) {
    // subscribe events prefix the scene with "qrscene_"; SCAN events do not.
    const scene = (msg.EventKey ?? "").replace(/^qrscene_/, "");
    const openid = msg.FromUserName ?? "";
    const key = `${SCENE_PREFIX}${scene}`;
    const pending = scene ? await redis.get(key) : null;

    if (pending && openid) {
      const profile = await getWeChatMpUserInfo(openid);
      const user = await findOrCreateWeChatUser(
        openid,
        profile?.nickname ?? "",
        profile?.headimgurl ?? ""
      );
      if (user) {
        await redis.set(
          key,
          JSON.stringify({ status: "authed", userId: user.id }),
          "EX",
          120
        );
        // Passive reply: confirm the sign-in in the user's WeChat chat.
        return new Response(
          buildWeChatTextReply(openid, msg.ToUserName ?? "", "✅ 已登录"),
          { headers: { "Content-Type": "text/xml; charset=utf-8" } }
        );
      }
    }
  }

  // WeChat retries unless it receives "success" (or an empty body).
  return new Response("success", { headers: { "Content-Type": "text/plain" } });
}
