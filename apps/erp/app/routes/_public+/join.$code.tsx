import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { getAuthSession } from "@carbon/auth/session.server";
import { Button as _Button, Heading as _Heading, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { AnimatePresence, motion } from "framer-motion";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Form, Link, useLoaderData } from "react-router";
import { getPublicInviteLinkByCode } from "~/modules/users/invite-links.server";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Join Company | Carbon" }];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { code } = params;
  if (!code) throw new Error("No code provided");

  const authSession = await getAuthSession(request);
  const serviceRole = getCarbonServiceRole();
  const invite = await getPublicInviteLinkByCode(
    serviceRole,
    code,
    authSession?.userId
  );

  if (!invite.success) {
    return { success: false as const, data: null, isAuthenticated: !!authSession };
  }

  return {
    success: true as const,
    data: invite.data,
    isAuthenticated: !!authSession
  };
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

const Heading = motion.create(_Heading);
const Button = motion.create(_Button);

export default function JoinRoute() {
  const { t } = useLingui();
  const { success, data, isAuthenticated } = useLoaderData<typeof loader>();

  if (!success || !data) {
    return (
      <VStack spacing={4} className="max-w-lg items-center text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/carbon-logo-mark.svg"
            alt={t`Carbon Logo`}
            className="w-36"
          />
        </div>
        <VStack spacing={2} className="text-center w-full">
          <Heading className="w-full text-center">
            <Trans>Invalid Invite Link</Trans>
          </Heading>
          <p>
            <Trans>
              This invite link is invalid or has expired. Please contact the
              person who shared it with you.
            </Trans>
          </p>
        </VStack>
        <Button asChild>
          <Link to="/">
            <Trans>Return Home</Trans>
          </Link>
        </Button>
      </VStack>
    );
  }

  if (data.expired) {
    return (
      <VStack spacing={4} className="max-w-lg items-center text-center">
        <img
          src="/carbon-logo-mark.svg"
          alt={t`Carbon Logo`}
          className="w-24 mb-3"
        />
        <Heading size="h1" className="m-0">
          <Trans>Invite Link Expired</Trans>
        </Heading>
        <p className="text-muted-foreground">
          <Trans>
            This invite link is no longer accepting new requests.
          </Trans>
        </p>
        <Button asChild>
          <Link to="/">
            <Trans>Return Home</Trans>
          </Link>
        </Button>
      </VStack>
    );
  }

  if (data.alreadyMember) {
    return (
      <VStack spacing={4} className="max-w-lg items-center text-center">
        <img
          src="/carbon-logo-mark.svg"
          alt={t`Carbon Logo`}
          className="w-24 mb-3"
        />
        <Heading size="h1" className="m-0">
          <Trans>Already a Member</Trans>
        </Heading>
        <p className="text-muted-foreground">
          <Trans>You already have access to {data.companyName}.</Trans>
        </p>
        <Button asChild>
          <Link to={path.to.authenticatedRoot}>
            <Trans>Go to App</Trans>
          </Link>
        </Button>
      </VStack>
    );
  }

  if (data.alreadyApplied) {
    return (
      <VStack spacing={4} className="max-w-lg items-center text-center">
        <img
          src="/carbon-logo-mark.svg"
          alt={t`Carbon Logo`}
          className="w-24 mb-3"
        />
        <Heading size="h1" className="m-0">
          <Trans>Request Submitted</Trans>
        </Heading>
        <p className="text-muted-foreground">
          <Trans>
            Your request to join {data.companyName} has already been submitted
            and is pending review.
          </Trans>
        </p>
      </VStack>
    );
  }

  const loginUrl = `${path.to.login}?redirectTo=${encodeURIComponent(
    path.to.joinLinkApply(data.code)
  )}`;

  return (
    <AnimatePresence>
      <VStack spacing={4} className="max-w-lg items-center text-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          src="/carbon-logo-mark.svg"
          alt={t`Carbon Logo`}
          className="w-24 mb-3"
        />

        <Heading
          {...fade}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
          size="h1"
          className="m-0"
        >
          <Trans>Join {data.companyName}</Trans>
        </Heading>

        <p
          className="text-muted-foreground"
          {...fade}
          style={{ animationDelay: "0.8s" }}
        >
          <Trans>
            {data.inviterName} invited you to join as {data.roleName}.
          </Trans>
        </p>

        {isAuthenticated ? (
          <Form method="post" action={path.to.joinLinkApply(data.code)}>
            <Button
              {...fade}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 1 }}
              size="lg"
              type="submit"
            >
              <Trans>Request to Join</Trans>
            </Button>
          </Form>
        ) : (
          <Button
            {...fade}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 1 }}
            size="lg"
            asChild
          >
            <Link to={loginUrl}>
              <Trans>Sign In to Request Access</Trans>
            </Link>
          </Button>
        )}
      </VStack>

      <p className="text-xs text-muted-foreground text-center mt-6">
        <Trans>
          By requesting access, you agree to the{" "}
          <Link to="https://carbon.ms/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="https://carbon.ms/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </Trans>
      </p>
    </AnimatePresence>
  );
}
