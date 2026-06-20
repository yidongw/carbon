import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { getAuthSession } from "@carbon/auth/session.server";
import { Button, Heading, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { getPublicInviteLinkByCode } from "~/modules/users/invite-links.server";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Request Submitted | Carbon" }];
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
    return { success: false as const, companyName: null };
  }

  return {
    success: true as const,
    companyName: invite.data.companyName
  };
}

export default function JoinSubmittedRoute() {
  const { t } = useLingui();
  const { success, companyName } = useLoaderData<typeof loader>();

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
      {success && companyName ? (
        <p className="text-muted-foreground">
          <Trans>
            Your request to join {companyName} has been submitted. An admin will
            review your application soon.
          </Trans>
        </p>
      ) : (
        <p className="text-muted-foreground">
          <Trans>Your request has been submitted.</Trans>
        </p>
      )}
      <Button asChild variant="secondary">
        <Link to={path.to.root}>
          <Trans>Return Home</Trans>
        </Link>
      </Button>
    </VStack>
  );
}
