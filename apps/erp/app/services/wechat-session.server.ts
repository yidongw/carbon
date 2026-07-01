import { signInWithUserIdViaAdmin } from "@carbon/auth/auth.server";
import { setCompanyId } from "@carbon/auth/company.server";
import { setAuthSession } from "@carbon/auth/session.server";

/**
 * Turn a resolved WeChat user into a logged-in session and return the cookie
 * headers to set on the response. Mints via the auth user's canonical email so
 * both entry points (OAuth callback + QR-scan poll) sign in identically and keep
 * working after the user links a real email over the synthetic one.
 */
export async function createWeChatAuthSession(
  request: Request,
  user: { id: string }
): Promise<[string, string][] | null> {
  const authSession = await signInWithUserIdViaAdmin(user.id);
  if (!authSession) return null;

  const sessionCookie = await setAuthSession(request, { authSession });
  const companyIdCookie = setCompanyId(authSession.companyId);

  return [
    ["Set-Cookie", sessionCookie],
    ["Set-Cookie", companyIdCookie]
  ];
}
