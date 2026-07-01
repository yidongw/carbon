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
// This loader reads the access token from the server-side session cookie,
// calls GoTrue with proper authentication, and redirects the browser to
// the OAuth provider URL. GoTrue eventually redirects back to our /callback.
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

  const response = await fetch(goTrueUrl.toString(), {
    headers: {
      Authorization: `Bearer ${authSession.accessToken}`,
      apikey: SUPABASE_ANON_KEY!
    },
    redirect: "manual"
  });

  // Log what GoTrue actually returned so we can debug failures
  const location = response.headers.get("Location") ?? response.headers.get("location");
  console.log("[link-provider] GoTrue response", {
    status: response.status,
    type: response.type,
    location,
    headers: Object.fromEntries(response.headers.entries())
  });

  if (!location) {
    const body = await response.text().catch(() => "(unreadable)");
    console.log("[link-provider] GoTrue body:", body);
    return redirect(
      `${path.to.profile}?error=${encodeURIComponent(`GoTrue ${response.status}: ${body.slice(0, 100)}`)}`
    );
  }

  return redirect(location);
}
