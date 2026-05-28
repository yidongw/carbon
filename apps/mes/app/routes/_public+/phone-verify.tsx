import { assertIsPost, error, phoneVerifyValidator, RATE_LIMIT, safeRedirect } from "@carbon/auth";
import { verifyPhoneOtp } from "@carbon/auth/auth.server";
import {
  flash,
  getAuthSession,
  setAuthSession
} from "@carbon/auth/session.server";
import { setCompanyId } from "@carbon/auth/company.server";
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
import { data, Link, redirect, useFetcher, useSearchParams } from "react-router";
import type { Result } from "@carbon/auth";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Verify Phone" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await getAuthSession(request);
  if (authSession) {
    throw redirect(path.to.authenticatedRoot);
  }

  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  if (!phone) {
    throw redirect(path.to.login);
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

  const authSession = await verifyPhoneOtp(phone, code);

  if (!authSession) {
    return data(
      error(null, "Invalid or expired verification code"),
      await flash(request, error(null, "Invalid or expired verification code"))
    );
  }

  const sessionCookie = await setAuthSession(request, { authSession });
  const companyIdCookie = setCompanyId(authSession.companyId);

  return redirect(safeRedirect(redirectTo, path.to.authenticatedRoot), {
    headers: [
      ["Set-Cookie", sessionCookie],
      ["Set-Cookie", companyIdCookie]
    ]
  });
}

export default function PhoneVerifyRoute() {
  const { t } = useLingui();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  const maskedPhone =
    phone.length > 4
      ? phone.slice(0, -4).replace(/\d/g, "*") + phone.slice(-4)
      : phone;

  const fetcher = useFetcher<Result>();

  return (
    <>
      <div className="flex justify-center mb-4">
        <img
          src="/carbon-logo-mark.svg"
          alt={t`Carbon Logo`}
          className="w-36"
        />
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
              <Trans>We've sent a 6-digit code to {maskedPhone}</Trans>
            </p>

            {fetcher.data?.success === false && fetcher.data?.message && (
              <Alert variant="destructive">
                <LuCircleAlert className="w-4 h-4" />
                <AlertTitle>
                  <Trans>Verification Error</Trans>
                </AlertTitle>
                <AlertDescription>{fetcher.data?.message}</AlertDescription>
              </Alert>
            )}

            <InputOTP name="code" label="" />

            <Button type="button" variant="link" size="sm" asChild>
              <Link to={redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login"}>
                <Trans>Back to login</Trans>
              </Link>
            </Button>
          </VStack>
        </ValidatedForm>
      </div>
    </>
  );
}
