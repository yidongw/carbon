import {
  assertIsPost,
  CONTROLLED_ENVIRONMENT,
  callbackValidator,
  carbonClient,
  error,
  safeRedirect
} from "@carbon/auth";
import { exchangePkceCode, makeAuthSessionFromTokens } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { findUserIdByIdentity, linkIdentity } from "@carbon/auth/identity.server";
import { getCompanyId, setCompanyId } from "@carbon/auth/company.server";
import {
  destroyAuthSession,
  destroyPkceCookie,
  flash,
  getPkceCookie,
  getAuthSession,
  setAuthSession
} from "@carbon/auth/session.server";
import { validator } from "@carbon/form";
import { Alert, AlertDescription, AlertTitle, cn, VStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  data,
  redirect,
  useFetcher,
  useLoaderData,
  useLocation,
  useSearchParams
} from "react-router";
import { path } from "~/utils/path";
import { useFormatValidationError } from "~/utils/formatValidationError";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // PKCE magic-link flow: Supabase delivers a ?code= query param instead of
  // hash tokens. Exchange it entirely server-side with the code verifier that
  // was stored in the short-lived cookie during the /login action.
  if (code) {
    const pkceEntry = await getPkceCookie(request);

    if (!pkceEntry) {
      return data({
        error:
          "Please open this link in the same browser where you requested sign-in."
      });
    }

    const cookieCompanyId = getCompanyId(request);
    const authSession = await exchangePkceCode(code, pkceEntry, cookieCompanyId);

    if (!authSession) {
      return data({
        error: "Magic link expired or already used. Please request a new one."
      });
    }

    const redirectTo =
      url.searchParams.get("redirectTo") ?? pkceEntry.redirectTo ?? undefined;
    const sessionCookie = await setAuthSession(request, { authSession });
    const companyIdCookie = setCompanyId(authSession.companyId);
    const pkceCookie = await destroyPkceCookie();

    return redirect(safeRedirect(redirectTo, path.to.authenticatedRoot), {
      headers: [
        ["Set-Cookie", sessionCookie],
        ["Set-Cookie", companyIdCookie],
        ["Set-Cookie", pkceCookie]
      ]
    });
  }

  // GoTrue error redirect: errors appear in both the query string and hash
  // fragment (since GoTrue v2.x). Handle server-side so we can preserve the
  // session and redirect the user back to where they came from cleanly.
  const errorCode = url.searchParams.get("error_code");
  const errorDescription = url.searchParams.get("error_description");
  if (errorCode || errorDescription) {
    const msg = (errorDescription ?? errorCode ?? "Authentication error").replace(/\+/g, " ");
    const redirectTo = url.searchParams.get("redirectTo") ?? path.to.authenticatedRoot;
    const sep = redirectTo.includes("?") ? "&" : "?";
    return redirect(`${redirectTo}${sep}linkError=${encodeURIComponent(msg)}`);
  }

  // OAuth (Google/Azure) implicit flow — tokens arrive in the URL hash, which
  // the server never sees. The client component handles those below.
  const authSession = await getAuthSession(request);
  if (authSession) await destroyAuthSession(request);

  return data({ error: null });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);

  const validation = await validator(callbackValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return data(error(validation.error, "Invalid callback form"), {
      status: 400
    });
  }

  const { accessToken, refreshToken, userId, redirectTo } = validation.data;
  const serviceRole = getCarbonServiceRole();

  const [companies, { data: userData, error: userError }] =
    await Promise.all([
      serviceRole
        .from("userToCompany")
        .select("companyId, ...company(companyGroupId)")
        .eq("userId", userId)
        .limit(50),
      serviceRole.auth.getUser(accessToken)
    ]);

  if (!userData?.user || userError) {
    return redirect(
      path.to.root,
      await flash(request, error(userError, "Invalid access token"))
    );
  }

  if (userData.user.id !== userId) {
    return redirect(
      path.to.root,
      await flash(request, error(null, "Session mismatch"))
    );
  }

  if (companies.error) {
    return redirect(
      path.to.root,
      await flash(request, error(companies.error, "Failed to load company"))
    );
  }

  // Auto-link on OAuth login/link: filling the email links the email identity,
  // and each connected provider (Google/Azure) links itself. We iterate
  // user.identities (not just app_metadata.provider) so linking a second
  // provider is captured too. Idempotent; a no-op if a credential is already on
  // another account.
  //
  // phone-only users have a synthetic freed-*@carbon.internal primary email;
  // skip the email identity for those, and use each OAuth identity's own email
  // (from identity_data) rather than the user's primary email.
  const userEmail = userData.user.email;
  const isSyntheticEmail = userEmail?.endsWith("@carbon.internal") ?? false;

  if (userEmail && !isSyntheticEmail) {
    await linkIdentity(userId, "email", userEmail);
  }
  for (const identity of userData.user.identities ?? []) {
    if (identity.provider === "google" || identity.provider === "azure") {
      const identityEmail =
        (identity.identity_data as Record<string, unknown>)?.email as
          | string
          | undefined;
      const emailToUse = identityEmail ?? (!isSyntheticEmail ? userEmail : undefined);
      if (emailToUse) {
        // Block linking if this OAuth email is already someone else's OTP
        // email identity in Carbon. Same-type conflicts are caught inside
        // linkIdentity; this catches the cross-type case (email vs google).
        const emailOwner = await findUserIdByIdentity("email", emailToUse);
        if (emailOwner && emailOwner !== userId) {
          if (redirectTo?.startsWith("/x/")) {
            // Link flow: user was already logged in — redirect back with error.
            const sep = redirectTo.includes("?") ? "&" : "?";
            return redirect(
              `${redirectTo}${sep}linkError=${encodeURIComponent(
                `${emailToUse} is already registered as a login method on another account`
              )}`
            );
          }
          // Login flow: skip this identity link but still allow login.
          continue;
        }
        await linkIdentity(userId, identity.provider, emailToUse);
      }
    }
  }

  const cookieCompanyId = getCompanyId(request);
  const match = (companies.data?.find((c) => c.companyId === cookieCompanyId) ??
    companies.data?.[0]) as
    | { companyId: string; companyGroupId: string | null }
    | undefined;

  const authSession = makeAuthSessionFromTokens(
    accessToken,
    refreshToken,
    userData.user,
    match?.companyId ?? "",
    match?.companyGroupId ?? ""
  );

  const sessionCookie = await setAuthSession(request, {
    authSession
  });
  const companyIdCookie = setCompanyId(authSession.companyId);
  return redirect(safeRedirect(redirectTo, path.to.authenticatedRoot), {
    headers: [
      ["Set-Cookie", sessionCookie],
      ["Set-Cookie", companyIdCookie]
    ]
  });
}

export default function AuthCallback() {
  const { error: loaderError } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{}>();
  const isAuthenticating = useRef(false);
  const [error, setError] = useState<string | null>(loaderError ?? null);
  const formatError = useFormatValidationError();

  const { hash } = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  useEffect(() => {
    const hashParams = new URLSearchParams(hash.slice(1));
    const errorDescription = hashParams.get("error_description");
    if (errorDescription) {
      const decoded = decodeURIComponent(errorDescription.replace(/\+/g, " "));
      // When this callback was initiated from a link flow (redirectTo is set),
      // send the user back to that page with the error rather than leaving
      // them stranded here.
      if (redirectTo) {
        const sep = redirectTo.includes("?") ? "&" : "?";
        window.location.replace(`${redirectTo}${sep}linkError=${encodeURIComponent(decoded)}`);
      } else {
        setError(decoded);
      }
    }
  }, [hash, redirectTo]);

  // Handle OAuth (Google/Azure) tokens delivered in the hash via implicit flow.
  useEffect(() => {
    const {
      data: { subscription }
    } = carbonClient.auth.onAuthStateChange((event, session) => {
      if (
        ["SIGNED_IN", "INITIAL_SESSION"].includes(event) &&
        !isAuthenticating.current
      ) {
        isAuthenticating.current = true;

        const accessToken = session?.access_token;
        const refreshToken = session?.refresh_token;
        const userId = session?.user.id;

        if (!accessToken || !refreshToken || !userId) return;

        const formData = new FormData();
        formData.append("accessToken", accessToken);
        formData.append("refreshToken", refreshToken);
        formData.append("userId", userId);
        if (redirectTo) formData.append("redirectTo", redirectTo);

        fetcher.submit(formData, { method: "post" });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetcher, redirectTo]);

  return (
    <div className="flex flex-col items-center justify-center">
      {error ? (
        <div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 mt-8 w-[380px]">
          <VStack spacing={4}>
            <Alert variant="destructive">
              <LuTriangleAlert className="h-4 w-4" />
              <AlertTitle>
                <Trans>Error</Trans>
              </AlertTitle>
              <AlertDescription>{formatError(error)}</AlertDescription>
            </Alert>
            {error.includes("expired") && (
              <>
                <p className="text-sm text-muted-foreground">
                  <Trans>Something went wrong. Please try again.</Trans>
                </p>
              </>
            )}
          </VStack>
        </div>
      ) : (
        <div
          className={cn(
            "hexagon-loader-container",
            CONTROLLED_ENVIRONMENT && "grayscale"
          )}
        >
          <div className="hexagon-loader">
            <div className="hexagon" />
            <div className="hexagon" />
            <div className="hexagon" />
          </div>
        </div>
      )}
    </div>
  );
}
