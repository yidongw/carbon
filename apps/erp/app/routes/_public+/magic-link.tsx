import { CONTROLLED_ENVIRONMENT, SUPABASE_URL } from "@carbon/auth";
import { Button, Heading, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useNavigate, useSearchParams } from "react-router";

export default function ConfirmMagicLink() {
  const { t } = useLingui();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  // redirectTo is the full callback URL embedded by sendMagicLink via {{ .RedirectTo }}
  // in the email template. It carries the correct origin (preview or production)
  // so Supabase redirects back to wherever the user actually requested sign-in from.
  const redirectTo = params.get("redirectTo");
  if (!token) {
    navigate("/");
    return null;
  }

  const getConfirmationURL = (token: string) => {
    const callbackUrl = redirectTo ?? `${window?.location.origin}/callback`;
    return `${SUPABASE_URL}/auth/v1/verify?token=${token}&type=magiclink&redirect_to=${callbackUrl}`;
  };

  return (
    <>
      <div className="flex justify-center mb-4">
        <img
          src={CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-logo-mark.svg"}
          alt={t`Carbon Logo`}
          className="w-36"
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
