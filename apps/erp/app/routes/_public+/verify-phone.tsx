import {
  assertIsPost,
  CarbonEdition,
  error,
  phoneVerifyValidator,
  RATE_LIMIT,
  safeRedirect
} from "@carbon/auth";
import { signInWithPhoneViaAdmin } from "@carbon/auth/auth.server";
import { checkSmsVerifyCode } from "@carbon/auth/aliyun-sms.server";
import { setCompanyId } from "@carbon/auth/company.server";
import { findOrCreatePhoneUser, findPhoneUser } from "@carbon/auth/phone.server";
import { Edition } from "@carbon/utils";
import {
  flash,
  getAuthSession,
  setAuthSession
} from "@carbon/auth/session.server";
import { Hidden, InputOTP, ValidatedForm, validator } from "@carbon/form";
import { Ratelimit, redis } from "@carbon/kv";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Heading,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { LuCircleAlert } from "react-icons/lu";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "react-router";
import {
  data,
  Link,
  redirect,
  useFetcher,
  useSearchParams
} from "react-router";

import type { Result } from "~/types";
import { useFormatValidationError } from "~/utils/formatValidationError";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Verify Phone" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo");
  const authSession = await getAuthSession(request);
  if (authSession) {
    throw redirect(safeRedirect(redirectTo, path.to.authenticatedRoot));
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT, "1 h"),
    analytics: true
  });
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return data(
      error(null, "Rate limit exceeded"),
      await flash(request, error(null, "Rate limit exceeded"))
    );
  }

  const validation = await validator(phoneVerifyValidator).validate(
    await request.formData()
  );
  if (validation.error) {
    return error(validation.error, "Invalid verification code");
  }

  const { phone, code, redirectTo } = validation.data;

  // Aliyun owns the code; trust only a "PASS" result.
  const isCodeValid = await checkSmsVerifyCode(phone, code);
  if (!isCodeValid) {
    return data(
      error(null, "Invalid or expired verification code"),
      await flash(request, error(null, "Invalid or expired verification code"))
    );
  }

  // Enterprise deployments require provisioned accounts (no self-signup); other
  // editions may self-create on first verified login. Mirrors the email flow.
  const user =
    CarbonEdition === Edition.Enterprise
      ? await findPhoneUser(phone)
      : await findOrCreatePhoneUser(phone);
  if (!user) {
    const message =
      CarbonEdition === Edition.Enterprise
        ? "User record not found"
        : "Failed to create user account";
    return data(
      error(null, message),
      await flash(request, error(null, message))
    );
  }

  // A valid SMS code shouldn't let a deactivated account back in (mirrors the
  // email verify path, which only signs in active users).
  if (!user.active) {
    return data(
      error(null, "Your account is not active"),
      await flash(request, error(null, "Your account is not active"))
    );
  }

  const authSession = await signInWithPhoneViaAdmin(phone);
  if (!authSession) {
    return data(
      error(null, "Failed to sign in user"),
      await flash(request, error(null, "Failed to sign in user"))
    );
  }

  const sessionCookie = await setAuthSession(request, { authSession });
  const companyIdCookie = setCompanyId(authSession.companyId);

  // Users with no company yet go through onboarding (mirrors the email signup
  // path) rather than landing on an empty authenticated screen.
  const destination = authSession.companyId
    ? safeRedirect(redirectTo, path.to.authenticatedRoot)
    : path.to.onboarding.root;

  return redirect(destination, {
    headers: [
      ["Set-Cookie", sessionCookie],
      ["Set-Cookie", companyIdCookie]
    ]
  });
}

export default function VerifyPhoneRoute() {
  const { t } = useLingui();
  const formatError = useFormatValidationError();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  const fetcher = useFetcher<Result>();

  return (
    <>
      <div className="flex justify-center mb-4">
        <img src="/carbon-logo-mark.svg" alt={t`Carbon Logo`} className="w-36" />
      </div>
      <div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 w-[380px]">
        <ValidatedForm
          fetcher={fetcher}
          validator={phoneVerifyValidator}
          defaultValues={{ phone, redirectTo }}
          method="post"
        >
          <Hidden name="phone" value={phone} />
          <Hidden name="redirectTo" value={redirectTo} />
          <VStack spacing={4} className="items-center">
            <Heading size="h3">
              <Trans>Verify your phone</Trans>
            </Heading>
            <p className="text-muted-foreground tracking-tight text-sm text-center">
              <Trans>We've sent a verification code to {phone}</Trans>
            </p>

            {fetcher.data?.success === false && fetcher.data?.message && (
              <Alert variant="destructive">
                <LuCircleAlert className="w-4 h-4" />
                <AlertTitle>
                  <Trans>Verification Error</Trans>
                </AlertTitle>
                <AlertDescription>
                  {fetcher.data?.message && formatError(fetcher.data.message)}
                </AlertDescription>
              </Alert>
            )}

            <InputOTP name="code" label="" />

            <Button type="button" variant="link" size="sm" asChild>
              <Link to="/login">
                <Trans>Use a different phone number</Trans>
              </Link>
            </Button>
          </VStack>
        </ValidatedForm>
      </div>
    </>
  );
}
