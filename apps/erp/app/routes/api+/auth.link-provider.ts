import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@carbon/auth";
import { getAuthSession } from "@carbon/auth/session.server";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";

// Server-side proxy for GoTrue's /user/identities/authorize endpoint.
//
// carbonClient has persistSession: false, so client-side JS has no session
// and linkIdentity() sends the anon JWT (no sub claim) instead of the user
// token → GoTrue rejects with "invalid claim: missing sub claim".
//
// This loader reads the access token from the session cookie, calls GoTrue
// with skip_http_redirect=true (which makes GoTrue return the OAuth provider
// URL as JSON instead of doing a 302), then redirects the browser there.
export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await getAuthSession(request);
  if (!authSession) return redirect(path.to.login);

  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const redirectTo = url.searchParams.get("redirectTo") ?? path.to.profile;

  if (provider !== "google" && provider !== "azure") {
    return redirect(path.to.profile);
  }

  // Build the full callback URL so GoTrue redirects back here after OAuth.
  // The server sits behind a reverse proxy and sees an internal hostname, not
  // the real public URL, so we need the browser-facing origin. The client sends
  // it as callbackOrigin, but we must NOT trust that blindly: a crafted
  // callbackOrigin would steer the OAuth callback (with session tokens in the
  // hash) to an attacker's host if it happens to match GoTrue's allow list
  // (which includes broad wildcards like *.vercel.app). Only accept it when its
  // host matches the public host the proxy forwarded; otherwise derive the
  // origin from the forwarded headers.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const trustedOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : new URL(request.url).origin;

  let callbackOrigin = trustedOrigin;
  const callbackOriginParam = url.searchParams.get("callbackOrigin");
  if (callbackOriginParam) {
    try {
      const candidate = new URL(callbackOriginParam);
      if (
        !forwardedHost ||
        candidate.host.toLowerCase() === forwardedHost.toLowerCase()
      ) {
        callbackOrigin = candidate.origin;
      } else {
        console.warn(
          "[link-provider] rejecting callbackOrigin host mismatch",
          candidate.host,
          forwardedHost
        );
      }
    } catch {
      // Malformed callbackOrigin — fall back to the trusted origin.
    }
  }
  const callbackUrl = `${callbackOrigin}/callback?redirectTo=${encodeURIComponent(redirectTo)}`;

  const goTrueUrl = new URL(
    `${SUPABASE_URL}/auth/v1/user/identities/authorize`
  );
  goTrueUrl.searchParams.set("provider", provider);
  goTrueUrl.searchParams.set("redirect_to", callbackUrl);
  // skip_http_redirect=true makes GoTrue return JSON { url: "https://..." }
  // instead of a 302 redirect — this is how auth-js calls this endpoint.
  goTrueUrl.searchParams.set("skip_http_redirect", "true");

  const response = await fetch(goTrueUrl.toString(), {
    headers: {
      Authorization: `Bearer ${authSession.accessToken}`,
      apikey: SUPABASE_ANON_KEY!
    }
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "(unreadable)");
    console.error("[link-provider] GoTrue error", response.status, body);
    return redirect(
      `${path.to.profile}?error=${encodeURIComponent(`Failed to link account (${response.status})`)}`
    );
  }

  const { url: oauthUrl } = (await response.json()) as { url?: string };
  if (!oauthUrl) {
    return redirect(
      `${path.to.profile}?error=${encodeURIComponent("Failed to initiate OAuth link")}`
    );
  }

  return redirect(oauthUrl);
}
