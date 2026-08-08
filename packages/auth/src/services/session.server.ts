import { redis } from "@carbon/kv";
import { Edition } from "@carbon/utils";
import {
  createCookie,
  createCookieSessionStorage,
  type MiddlewareFunction,
  redirect
} from "react-router";

import {
  BYPASS_SESSION_MAX_AGE,
  CarbonEdition,
  DOMAIN,
  REFRESH_ACCESS_TOKEN_THRESHOLD,
  SESSION_KEY,
  SESSION_MAX_AGE,
  SESSION_SECRET,
  VERCEL_ENV
} from "../config/env";
import type { AuthSession, Result } from "../types";
import { isBypassSession } from "../utils/bypass-email";
import {
  expireStaleCookieScopeHeaders,
  getCookieDomain
} from "../utils/cookie";
import { getCurrentPath, isGet, makeRedirectToFromHere } from "../utils/http";
import { path } from "../utils/path";
import { refreshAccessToken, verifyAuthSession } from "./auth.server";
import { setCompanyId } from "./company.server";
import { getPermissionCacheKey } from "./users";

async function assertAuthSession(
  request: Request,
  { onFailRedirectTo }: { onFailRedirectTo?: string } = {}
) {
  const authSession = await getAuthSession(request);

  if (!authSession?.accessToken || !authSession?.refreshToken) {
    throw redirect(
      `${onFailRedirectTo || path.to.login}?${makeRedirectToFromHere(request)}`
    );
  }

  return authSession;
}

export const isTestEdition = CarbonEdition === Edition.Test;

const cookieDomain = isTestEdition ? undefined : getCookieDomain(DOMAIN);

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "carbon",
    httpOnly: true,
    path: "/",
    sameSite: isTestEdition ? "none" : "lax",
    secrets: [SESSION_SECRET!],
    secure: !!cookieDomain,
    domain: cookieDomain
  }
});

export async function setAuthSession(
  request: Request,
  {
    authSession
  }: {
    authSession?: AuthSession | null;
  } = {}
) {
  const session = await getSession(request);

  if (authSession !== undefined) {
    session.set(SESSION_KEY, authSession);
  }

  return sessionStorage.commitSession(session, {
    maxAge: isBypassSession(authSession ?? {})
      ? BYPASS_SESSION_MAX_AGE
      : SESSION_MAX_AGE
  });
}

export async function clearAuthCookies(request: Request) {
  const session = await getSession(request);
  const sessionCookie = await sessionStorage.destroySession(session);
  const companyIdCookie = setCompanyId(null);
  return [
    ["Set-Cookie", sessionCookie] as [string, string],
    ["Set-Cookie", companyIdCookie] as [string, string]
  ];
}

export async function destroyAuthSession(request: Request) {
  const headers = await clearAuthCookies(request);
  return redirect(path.to.login, {
    headers
  });
}

/**
 * Keep the session cookie single-valued across a DOMAIN change.
 *
 * When DOMAIN changes, new sessions get a cookie scoped to the new cookieDomain
 * while browsers may still hold the cookie under an earlier scope — host-only
 * (DOMAIN was unset) or a narrower subdomain (a prior, more specific DOMAIN).
 * All variants are sent together and the browser orders the older ones first, so
 * the server reads a stale value and the user bounces to /login — repeatedly,
 * which surfaces as ERR_TOO_MANY_REDIRECTS.
 *
 * Fix: whenever the browser sends more than one session cookie (stale variants
 * present) OR a response sets/clears the domain-scoped cookie (login/logout),
 * expire every variant that is NOT the current cookieDomain scope — the
 * host-only cookie and each subdomain level between the request host and
 * cookieDomain. Only the cookieDomain-scoped cookie survives, so the browser
 * stops shadowing it. Self-limiting (once deduped there's a single cookie) and a
 * no-op when DOMAIN is unset or there's nothing to reconcile.
 */
export const cookieDomainMigrationMiddleware: MiddlewareFunction<
  Response
> = async ({ request }, next) => {
  const response = await next();
  if (!cookieDomain) return response;

  const rawCookie = request.headers.get("Cookie") ?? "";
  const hasStaleSessionVariants =
    (rawCookie.match(/(?:^|;\s*)carbon=/g)?.length ?? 0) > 1;
  // Same dual-scope trap as `carbon`: a host-only `locale` shadows the
  // Domain-scoped one `/api/locale` writes, so language switch looks like a no-op.
  const hasStaleLocaleVariants =
    (rawCookie.match(/(?:^|;\s*)locale=/g)?.length ?? 0) > 1;

  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];
  const touchesSessionCookie = setCookies.some(
    (c) => c.startsWith("carbon=") && /;\s*Domain=/i.test(c)
  );
  const touchesLocaleCookie = setCookies.some(
    (c) => c.startsWith("locale=") && /;\s*Domain=/i.test(c)
  );

  if (
    !hasStaleSessionVariants &&
    !touchesSessionCookie &&
    !hasStaleLocaleVariants &&
    !touchesLocaleCookie
  ) {
    return response;
  }

  const requestHost = request.headers.get("host") ?? undefined;

  if (hasStaleSessionVariants || touchesSessionCookie) {
    for (const header of expireStaleCookieScopeHeaders(
      "carbon",
      cookieDomain,
      requestHost,
      { httpOnly: true, sameSite: "Lax" }
    )) {
      response.headers.append("Set-Cookie", header);
    }
  }

  if (hasStaleLocaleVariants || touchesLocaleCookie) {
    for (const header of expireStaleCookieScopeHeaders(
      "locale",
      cookieDomain,
      requestHost
    )) {
      response.headers.append("Set-Cookie", header);
    }
  }

  return response;
};

export async function flash(request: Request, result: Result) {
  const session = await getSession(request);
  if (typeof result.success === "boolean") {
    session.flash("success", result.success);
    session.flash("message", result.message);
    if (result.flash) {
      session.flash("flash", result.flash);
    }
  }

  return {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) }
  };
}

export async function getAuthSession(
  request: Request
): Promise<AuthSession | null> {
  const session = await getSession(request);
  return session.get(SESSION_KEY);
}

export async function getOrRefreshAuthSession(
  request: Request
): Promise<AuthSession | null> {
  const session = await getAuthSession(request);
  if (!session) return null;

  if (isExpiringSoon(session.expiresAt)) {
    return refreshAuthSession(request);
  }

  return session;
}

export async function getSessionFlash(request: Request) {
  const session = await getSession(request);

  const result: Result = {
    success: session.get("success") === true,
    message: session.get("message"),
    flash: session.get("flash") as "success" | "error" | undefined
  };

  if (!result.message) return null;

  const headers = { "Set-Cookie": await sessionStorage.commitSession(session) };

  return { result, headers };
}

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

function isExpiringSoon(expiresAt: number) {
  return (expiresAt - REFRESH_ACCESS_TOKEN_THRESHOLD) * 1000 < Date.now();
}

export async function requireAuthSession(
  request: Request,
  {
    onFailRedirectTo,
    verify
  }: {
    onFailRedirectTo?: string;
    verify: boolean;
  } = { verify: false }
): Promise<AuthSession> {
  const authSession = await assertAuthSession(request, {
    onFailRedirectTo
  });

  const isValidSession = verify ? await verifyAuthSession(authSession) : true;

  if (!isValidSession || isExpiringSoon(authSession.expiresAt)) {
    return refreshAuthSession(request);
  }

  return authSession;
}

export async function refreshAuthSession(
  request: Request
): Promise<AuthSession> {
  const authSession = await getAuthSession(request);

  let refreshedAuthSession = await refreshAccessToken(
    authSession?.refreshToken,
    authSession?.companyId,
    authSession?.companyGroupId
  );

  if (
    !refreshedAuthSession &&
    authSession &&
    isBypassSession(authSession) &&
    authSession.email
  ) {
    const { signInWithBypassEmail } = await import("./auth.server");
    refreshedAuthSession = await signInWithBypassEmail(authSession.email);
  }

  // Preserve console mode and bypass flag across token refresh
  if (refreshedAuthSession && authSession) {
    if (authSession.console) {
      refreshedAuthSession.console = authSession.console;
    }
    if (authSession.bypass || isBypassSession(authSession)) {
      refreshedAuthSession.bypass = true;
    }
  }

  if (!refreshedAuthSession) {
    const redirectUrl = `${path.to.login}?${makeRedirectToFromHere(request)}`;

    const sessionCookie = await setAuthSession(request, {
      authSession: null
    });
    const companyIdCookie = setCompanyId(null);

    throw redirect(redirectUrl, {
      headers: [
        ["Set-Cookie", sessionCookie],
        ["Set-Cookie", companyIdCookie]
      ]
    });
  }

  if (isGet(request)) {
    const sessionCookie = await setAuthSession(request, {
      authSession: refreshedAuthSession
    });
    const companyIdCookie = setCompanyId(refreshedAuthSession.companyId);

    throw redirect(getCurrentPath(request), {
      headers: [
        ["Set-Cookie", sessionCookie],
        ["Set-Cookie", companyIdCookie]
      ]
    });
  }

  return refreshedAuthSession;
}

export async function updateSessionConsole(
  request: Request,
  consoleCompanyId: string | undefined
) {
  const session = await getSession(request);
  const authSession = await getAuthSession(request);

  if (authSession) {
    session.set(SESSION_KEY, {
      ...authSession,
      console: consoleCompanyId
    });
  }

  return sessionStorage.commitSession(session, {
    maxAge: isBypassSession(authSession ?? {})
      ? BYPASS_SESSION_MAX_AGE
      : SESSION_MAX_AGE
  });
}

export async function updateCompanySession(
  request: Request,
  companyId: string,
  companyGroupId: string
) {
  const session = await getSession(request);
  const authSession = await getAuthSession(request);

  if (authSession !== undefined) {
    await redis.del(getPermissionCacheKey(authSession?.userId!));
    session.set(SESSION_KEY, {
      ...authSession,
      companyId,
      companyGroupId
    });
  }

  return sessionStorage.commitSession(session, {
    maxAge: isBypassSession(authSession ?? {})
      ? BYPASS_SESSION_MAX_AGE
      : SESSION_MAX_AGE
  });
}

// Short-lived cookie that carries the PKCE code verifier from the login action
// to the /callback loader. Only sent on requests to /callback.
const pkceVerifierCookie = createCookie("sb-pkce-cv", {
  path: "/callback",
  maxAge: 15 * 60, // 15 minutes — long enough to receive and click the email
  httpOnly: true,
  sameSite: "lax",
  secure: VERCEL_ENV === "production"
});

export type PkceEntry = { k: string; v: string; redirectTo?: string };

export async function setPkceCookie(pkceEntry: PkceEntry): Promise<string> {
  return pkceVerifierCookie.serialize(JSON.stringify(pkceEntry));
}

export async function destroyPkceCookie(): Promise<string> {
  return pkceVerifierCookie.serialize("", { maxAge: 0 });
}

export async function getPkceCookie(
  request: Request
): Promise<PkceEntry | null> {
  const raw = await pkceVerifierCookie.parse(request.headers.get("cookie"));
  if (typeof raw !== "string" || !raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.k === "string" && typeof parsed?.v === "string") {
      return {
        k: parsed.k,
        v: parsed.v,
        redirectTo:
          typeof parsed.redirectTo === "string" ? parsed.redirectTo : undefined
      };
    }
  } catch {}
  return null;
}
