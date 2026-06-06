import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { setCompanyId } from "@carbon/auth/company.server";
import { refreshAccessToken } from "@carbon/auth/auth.server";
import { setAuthSession } from "@carbon/auth/session.server";

/**
 * Turn a resolved WeChat user into a logged-in session and return the cookie
 * headers to set on the response. Mirrors the magic-link → verifyOtp →
 * refreshAccessToken sequence used by the WeChat OAuth callback so both the
 * redirect (callback) and poll (QR scan) entry points sign users in identically.
 */
export async function createWeChatAuthSession(
  request: Request,
  user: { id: string; wechat_unionid: string }
): Promise<[string, string][] | null> {
  const serviceRole = getCarbonServiceRole();

  const companies = await serviceRole
    .from("userToCompany")
    .select("companyId, ...company(companyGroupId)")
    .eq("userId", user.id);

  const firstCompany = companies.data?.[0] as
    | { companyId: string; companyGroupId: string | null }
    | undefined;

  const { data: linkData, error: linkError } =
    await serviceRole.auth.admin.generateLink({
      type: "magiclink",
      // Re-derive the auth user's synthetic email (public user.email is null).
      email: `wechat+${user.wechat_unionid.toLowerCase()}@carbon.internal`
    });
  console.log(
    "[wechat session] generateLink",
    linkData?.properties?.hashed_token ? "ok" : `FAILED: ${JSON.stringify(linkError)}`
  );
  if (!linkData?.properties?.hashed_token) return null;

  const { data: sessionData, error: otpError } = await serviceRole.auth.verifyOtp(
    {
      token_hash: linkData.properties.hashed_token,
      type: "magiclink"
    }
  );
  console.log(
    "[wechat session] verifyOtp",
    sessionData?.session ? "ok" : `FAILED: ${JSON.stringify(otpError)}`
  );
  if (!sessionData?.session) return null;

  const authSession = await refreshAccessToken(
    sessionData.session.refresh_token,
    firstCompany?.companyId ?? "",
    firstCompany?.companyGroupId ?? ""
  );
  console.log(
    "[wechat session] refreshAccessToken",
    authSession ? `ok company=${firstCompany?.companyId ?? "(none)"}` : "FAILED"
  );
  if (!authSession) return null;

  const sessionCookie = await setAuthSession(request, { authSession });
  const companyIdCookie = setCompanyId(authSession.companyId);

  return [
    ["Set-Cookie", sessionCookie],
    ["Set-Cookie", companyIdCookie]
  ];
}
