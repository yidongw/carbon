import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { getAuthSession } from "@carbon/auth/session.server";
import {
  Button as _Button,
  Heading as _Heading,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { AnimatePresence, motion } from "framer-motion";
import { LuCheck, LuLock, LuMail, LuPhone } from "react-icons/lu";
import { SiGoogle, SiWechat } from "react-icons/si";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Form, Link, useLoaderData } from "react-router";
import { LoginMethodsForm } from "~/modules/account/ui/Profile";
import { getPublicInviteLinkByCode } from "~/modules/users/invite-links.server";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Join Company | Carbon" }];
};

const METHOD_META: Record<string, { label: string; icon: React.ReactElement }> =
  {
    wechat: {
      label: "WeChat",
      icon: <SiWechat className="size-4" style={{ color: "#07C160" }} />
    },
    phone: { label: "Phone", icon: <LuPhone className="size-4" /> },
    email: { label: "Email", icon: <LuMail className="size-4" /> },
    google: { label: "Google", icon: <SiGoogle className="size-4" /> },
    azure: { label: "Outlook", icon: <LuMail className="size-4" /> }
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
    return {
      success: false as const,
      data: null,
      isAuthenticated: !!authSession
    };
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

// The ordered checklist of required login methods, with each step's status.
function MethodChecklist({
  methods,
  satisfied,
  nextMethod
}: {
  methods: string[];
  satisfied: Set<string>;
  nextMethod: string | null;
}) {
  return (
    <VStack spacing={2} className="w-full">
      {methods.map((method, index) => {
        const meta = METHOD_META[method];
        if (!meta) return null;
        const done = satisfied.has(method);
        const current = method === nextMethod;
        return (
          <div
            key={method}
            className={`flex w-full items-center justify-between rounded-lg border p-3 ${
              current ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <HStack spacing={2}>
              <span className="text-xs font-semibold text-muted-foreground">
                {index + 1}
              </span>
              {meta.icon}
              <span className="text-sm font-medium">{meta.label}</span>
            </HStack>
            {done ? (
              <LuCheck className="size-4 text-emerald-500" />
            ) : current ? null : (
              <LuLock className="size-4 text-muted-foreground/50" />
            )}
          </div>
        );
      })}
    </VStack>
  );
}

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
          <Trans>This invite link is no longer accepting new requests.</Trans>
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

  const requiredMethods = data.loginMethods;
  const satisfied = new Set(data.satisfiedMethods);
  const nextMethod = requiredMethods.find((m) => !satisfied.has(m)) ?? null;
  const allSatisfied = nextMethod === null;

  // First required method the joiner still needs (used for the sign-in CTA when
  // they aren't authenticated yet).
  const firstMethod = requiredMethods[0];
  const loginUrl = `${path.to.login}?redirectTo=${encodeURIComponent(
    path.to.joinLink(data.code)
  )}${firstMethod ? `&only=${encodeURIComponent(firstMethod)}` : ""}`;

  // Fake identity rows (types only) so LoginMethodsForm can compute
  // email-family blocking; the connect widget only renders the unlinked method.
  const identityStubs = data.satisfiedMethods.map((type) => ({
    id: type,
    type,
    value: "",
    verifiedAt: null,
    createdAt: ""
  }));

  // Precomputed labels keep the lingui <Trans> children simple (no expressions).
  const firstMethodLabel = firstMethod
    ? (METHOD_META[firstMethod]?.label ?? firstMethod)
    : "";
  const nextMethodLabel = nextMethod
    ? (METHOD_META[nextMethod]?.label ?? nextMethod)
    : "";
  const nextMethodList = (nextMethod ? [nextMethod] : []) as (
    | "email"
    | "google"
    | "azure"
    | "phone"
    | "wechat"
  )[];

  const requestToJoin = (
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
  );

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

        {requiredMethods.length === 0 ? (
          // No method requirement: sign in (any method) then request to join.
          isAuthenticated ? (
            requestToJoin
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
          )
        ) : (
          // Required-method sequence: complete each method, in order.
          <VStack spacing={4} className="w-full max-w-sm">
            <MethodChecklist
              methods={requiredMethods}
              satisfied={satisfied}
              nextMethod={nextMethod}
            />

            {allSatisfied ? (
              requestToJoin
            ) : !isAuthenticated ? (
              <Button size="lg" asChild>
                <Link to={loginUrl}>
                  <Trans>Sign in with {firstMethodLabel}</Trans>
                </Link>
              </Button>
            ) : (
              <VStack spacing={2} className="w-full">
                <p className="text-sm text-muted-foreground">
                  <Trans>Connect your {nextMethodLabel} to continue.</Trans>
                </p>
                <LoginMethodsForm
                  identities={identityStubs}
                  enabledMethods={nextMethodList}
                  action={path.to.joinLinkLink(data.code)}
                  returnTo={path.to.joinLink(data.code)}
                  bare
                />
              </VStack>
            )}
          </VStack>
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
