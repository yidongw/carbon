import { CONTROLLED_ENVIRONMENT, SUPABASE_URL } from "@carbon/auth";
import { Button, Heading, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useNavigate, useSearchParams } from "react-router";

function resolveCallbackUrl(
  requestUrl: URL,
  redirectTo: string | null,
  encodedCallback: string | null
): string | null {
  if (encodedCallback) {
    try {
      return decodeURIComponent(encodedCallback);
    } catch {
      return null;
    }
  }

  if (redirectTo?.includes("/callback")) {
    return redirectTo;
  }

  if (redirectTo?.startsWith("/")) {
    return `${requestUrl.origin}/callback?redirectTo=${encodeURIComponent(redirectTo)}`;
  }

  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    throw redirect("/");
  }

  const callbackUrl = resolveCallbackUrl(
    url,
    url.searchParams.get("redirectTo"),
    url.searchParams.get("callback")
  );

  if (callbackUrl) {
    try {
      const targetHost = new URL(callbackUrl).host;
      if (url.host !== targetHost) {
        const targetOrigin = new URL(callbackUrl).origin;
        throw redirect(`${targetOrigin}/magic-link?${url.searchParams.toString()}`);
      }
    } catch (error) {
      if (error instanceof Response) throw error;
    }
  }

  return null;
}

export default function ConfirmMagicLink() {
  const { t } = useLingui();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  // {{ .RedirectTo }} from the email template is the full callback URL built by
  // sendMagicLink (e.g. https://app/callback?redirectTo=%2Fjoin%2Fcode%2Fapply).
  const redirectTo = params.get("redirectTo");
  const encodedCallback = params.get("callback");
  if (!token) {
    navigate("/");
    return null;
  }

  const getCallbackUrl = () => {
    return (
      resolveCallbackUrl(
        new URL(window.location.href),
        redirectTo,
        encodedCallback
      ) ?? `${window.location.origin}/callback`
    );
  };

  const getConfirmationURL = (token: string) => {
    const callbackUrl = getCallbackUrl();
    return `${SUPABASE_URL}/auth/v1/verify?token=${token}&type=magiclink&redirect_to=${encodeURIComponent(callbackUrl)}`;
  };

  return (
    <>
      <div className="flex justify-center mb-8">
        <img
          src={CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-mark-light.svg"}
          className="w-24 dark:hidden"
          alt={t`Carbon Logo`}
        />
        <img
          src={CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-mark-dark.svg"}
          className="w-24 hidden dark:block"
          alt={t`Carbon Logo`}
        />
      </div>
      <div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 w-[380px]">
        <VStack spacing={4} className="items-center justify-center">
          <Heading size="h3">
            <Trans>Let's build something</Trans> 🚀
          </Heading>
          <Button
            size="lg"
            onClick={() => {
              window.location.href = getConfirmationURL(token);
            }}
          >
            <Trans>Log In</Trans>
          </Button>
        </VStack>
      </div>
    </>
  );
}
