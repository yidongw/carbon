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
  const appOrigin = new URL(request.url).origin;
  const callbackUrl = `${appOrigin}/callback?redirectTo=${encodeURIComponent(redirectTo)}`;

  const goTrueUrl = new URL(`${SUPABASE_URL}/auth/v1/user/identities/authorize`);
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
