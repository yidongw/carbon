import { error, safeRedirect, success } from "@carbon/auth";
import { flash, getAuthSession } from "@carbon/auth/session.server";
import { linkIdentity } from "@carbon/auth/identity.server";
import {
  exchangeWeChatCode,
  findOrCreateWeChatUser,
  getWeChatUserInfo
} from "@carbon/auth/wechat.server";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { createWeChatAuthSession } from "~/services/wechat-session.server";
import { wechatStateStorage } from "~/services/wechat-state.server";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  console.log("[wechat callback] hit", { code: code?.slice(0, 8), state: state?.slice(0, 8) });

  if (!code || !state) {
    console.error("[wechat callback] missing code or state");
    return redirect(
      path.to.root,
      await flash(request, error(null, "Missing code or state from WeChat"))
    );
  }

  // Verify CSRF state
  const stateSession = await wechatStateStorage.getSession(
    request.headers.get("Cookie")
  );
  const savedState = stateSession.get("state");
  const redirectTo = stateSession.get("redirectTo") ?? "";
  console.log("[wechat callback] state check", { savedState: savedState?.slice(0, 8), match: savedState === state });

  if (!savedState || savedState !== state) {
    console.error("[wechat callback] state mismatch");
    return redirect(
      path.to.root,
      await flash(request, error(null, "Invalid state parameter"))
    );
  }

  // Exchange code for tokens
  const tokens = await exchangeWeChatCode(code);
  console.log("[wechat callback] tokens", tokens ? "ok" : "FAILED");
  if (!tokens) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to exchange WeChat code"))
    );
  }

  // Get user info
  const userInfo = await getWeChatUserInfo(tokens.access_token, tokens.openid);
  console.log("[wechat callback] userInfo", userInfo ? { unionid: userInfo.unionid?.slice(0, 8), nickname: userInfo.nickname } : "FAILED");
  if (!userInfo) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to get WeChat user info"))
    );
  }

  // Link mode: a logged-in user is connecting WeChat to their account — attach
  // the identity instead of signing in / creating a separate WeChat user.
  if (stateSession.get("link") === "1") {
    const authSession = await getAuthSession(request);
    if (!authSession?.userId) {
      return redirect(
        path.to.login,
        await flash(request, error(null, "Please sign in before linking WeChat"))
      );
    }
    const result = await linkIdentity(
      authSession.userId,
      "wechat",
      userInfo.unionid
    );
    const clearStateCookie = await wechatStateStorage.destroySession(stateSession);
    const flashResult = await flash(
      request,
      result.success
        ? success("Linked WeChat")
        : error(
            null,
            result.reason === "conflict"
              ? "That WeChat is already linked to another account"
              : "Failed to link WeChat"
          )
    );
    return redirect(safeRedirect(redirectTo, path.to.profile), {
      headers: [
        ["Set-Cookie", flashResult.headers["Set-Cookie"]],
        ["Set-Cookie", clearStateCookie]
      ]
    });
  }

  // Find or create user
  const user = await findOrCreateWeChatUser(
    userInfo.unionid,
    userInfo.nickname,
    userInfo.headimgurl
  );
  console.log("[wechat callback] user", user ? { id: user.id, email: user.email } : "FAILED");

  if (!user) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to create user from WeChat"))
    );
  }

  // Mint the session (resolves the user's canonical auth email under the hood).
  const headers = await createWeChatAuthSession(request, { id: user.id });
  if (!headers) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to create auth session"))
    );
  }

  const clearStateCookie = await wechatStateStorage.destroySession(stateSession);

  return redirect(safeRedirect(redirectTo, path.to.authenticatedRoot), {
    headers: [...headers, ["Set-Cookie", clearStateCookie]]
  });
}

export default function WeChatCallbackRoute() {
  return null;
}
