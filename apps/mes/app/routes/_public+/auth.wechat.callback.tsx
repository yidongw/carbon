import { error, safeRedirect } from "@carbon/auth";
import { refreshAccessToken } from "@carbon/auth/auth.server";
import { flash, setAuthSession } from "@carbon/auth/session.server";
import { setCompanyId } from "@carbon/auth/company.server";
import {
  exchangeWeChatCode,
  findOrCreateWeChatUser,
  getWeChatUserInfo
} from "@carbon/auth/wechat.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { wechatStateStorage } from "~/services/wechat-state.server";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Missing code or state from WeChat"))
    );
  }

  const stateSession = await wechatStateStorage.getSession(
    request.headers.get("Cookie")
  );
  const savedState = stateSession.get("state");
  const redirectTo = stateSession.get("redirectTo") ?? "";
  const type = (stateSession.get("type") as "mp" | "open") ?? "open";

  if (!savedState || savedState !== state) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Invalid state parameter"))
    );
  }

  const tokens = await exchangeWeChatCode(code, type);
  if (!tokens) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to exchange WeChat code"))
    );
  }

  const userInfo = await getWeChatUserInfo(tokens.access_token, tokens.openid);
  if (!userInfo) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to get WeChat user info"))
    );
  }

  const user = await findOrCreateWeChatUser(
    userInfo.unionid,
    userInfo.nickname,
    userInfo.headimgurl
  );

  if (!user) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to create user from WeChat"))
    );
  }

  const serviceRole = getCarbonServiceRole();
  const companies = await serviceRole
    .from("userToCompany")
    .select("companyId, ...company(companyGroupId)")
    .eq("userId", user.id);

  const firstCompany = companies.data?.[0] as
    | { companyId: string; companyGroupId: string | null }
    | undefined;

  const { data: linkData } = await serviceRole.auth.admin.generateLink({
    type: "magiclink",
    email: user.email ?? `wechat+${userInfo.unionid}@carbon.internal`
  });

  if (!linkData?.properties?.hashed_token) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to create WeChat session"))
    );
  }

  const { data: sessionData } = await serviceRole.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "magiclink"
  });

  if (!sessionData?.session) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to verify WeChat session"))
    );
  }

  const authSession = await refreshAccessToken(
    sessionData.session.refresh_token,
    firstCompany?.companyId ?? "",
    firstCompany?.companyGroupId ?? ""
  );

  if (!authSession) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Failed to create auth session"))
    );
  }

  const sessionCookie = await setAuthSession(request, { authSession });
  const companyIdCookie = setCompanyId(authSession.companyId);
  const clearStateCookie = await wechatStateStorage.destroySession(stateSession);

  return redirect(safeRedirect(redirectTo, path.to.authenticatedRoot), {
    headers: [
      ["Set-Cookie", sessionCookie],
      ["Set-Cookie", companyIdCookie],
      ["Set-Cookie", clearStateCookie]
    ]
  });
}

export default function WeChatCallbackRoute() {
  return null;
}
