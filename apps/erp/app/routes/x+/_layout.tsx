import {
  CarbonProvider,
  CONTROLLED_ENVIRONMENT,
  getCarbon,
  getMESUrl
} from "@carbon/auth";
import { getCompanyId, setCompanyId } from "@carbon/auth/company.server";
import {
  destroyAuthSession,
  requireAuthSession,
  updateCompanySession
} from "@carbon/auth/session.server";
import { isAuditLogEnabled } from "@carbon/database/audit";
import type { PrintingSettings } from "@carbon/printing";
import { getPrinterRoutes } from "@carbon/printing";
import { PrintingProvider } from "@carbon/printing/ui";
import {
  ItarPopup,
  TooltipProvider,
  useKeyboardWedge,
  useMount
} from "@carbon/react";
import { getStripeCustomerByCompanyId } from "@carbon/stripe/stripe.server";
import { formatPersonName } from "@carbon/utils";
import posthog from "posthog-js";
import { Suspense } from "react";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction
} from "react-router";
import {
  Await,
  data,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate
} from "react-router";
import { RealtimeDataProvider } from "~/components";
import { FloatingChat } from "~/components/Chat";
import { DemoBanner } from "~/components/DemoBanner";
import { DemoSeedTrigger } from "~/components/DemoSeedTrigger";
import { PrimaryNavigation, Topbar, TopbarProvider } from "~/components/Layout";
import { OverlayHost, OverlayProvider } from "~/components/Overlay";
import { PlanRenewalBanner } from "~/components/PlanRenewalBanner";
import { TimeCardWarning } from "~/components/TimeCardWarning";
import TrainingPanel from "~/components/TrainingPanel";
import { useTrainingPanel } from "~/hooks/useTrainingPanel";
import { getOpenClockEntry } from "~/modules/people";
import {
  getCompanies,
  getCompanyIntegrations,
  getCompanySettings,
  getEmployeeCompanies
} from "~/modules/settings";
import { getCustomFieldsSchemas } from "~/modules/shared/shared.server";
import {
  getSavedViews,
  isApprovalRequired
} from "~/modules/shared/shared.service";
import {
  getModulePreferences,
  getUser,
  getUserClaims,
  getUserDefaults,
  getUserGroups,
  isMesOnlyEmployee
} from "~/modules/users/users.server";
import { ERP_URL, MES_URL, path } from "~/utils/path";

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  formAction,
  defaultShouldRevalidate
}) => {
  // After a magic-link login the callback action redirects here via useFetcher.
  // React Router would otherwise revalidate all loaders a second time even though
  // the session was just established — skip it.
  if (formAction?.startsWith("/callback")) {
    return false;
  }

  if (
    currentUrl.pathname.startsWith("/x/settings") ||
    currentUrl.pathname.startsWith("/refresh-session") ||
    currentUrl.pathname.startsWith("/x/acknowledge") ||
    currentUrl.pathname.startsWith("/x/shared/views")
  ) {
    return true;
  }

  return defaultShouldRevalidate;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await requireAuthSession(request);
  const { accessToken, companyId, expiresAt, expiresIn, userId } = authSession;

  // Block ERP access when console mode is active on this terminal.
  // Console terminals should only access the MES app.
  if (authSession.console) {
    throw redirect(getMESUrl());
  }

  // const { computeRegion, proxyRegion } = parseVercelId(
  //   request.headers.get("x-vercel-id")
  // );

  // console.log({
  //   computeRegion,
  //   proxyRegion,
  // });

  const client = getCarbon(accessToken);

  // Parallelize all requests
  const [
    companies,
    employeeCompaniesResult,
    stripeCustomer,
    customFields,
    integrations,
    companySettings,
    savedViews,
    user,
    claims,
    groups,
    defaults,
    auditLogEnabled,
    modulePreferences,
    printerRoutes,
    supplierApprovalRequired,
    mesOnly
  ] = await Promise.all([
    getCompanies(client, userId),
    getEmployeeCompanies(client, userId),
    getStripeCustomerByCompanyId(companyId, userId),
    getCustomFieldsSchemas(client, { companyId }),
    getCompanyIntegrations(client, companyId),
    getCompanySettings(client, companyId),
    getSavedViews(client, userId, companyId),
    getUser(client, userId),
    getUserClaims(userId, companyId),
    getUserGroups(client, userId),
    getUserDefaults(client, userId, companyId),
    isAuditLogEnabled(client, companyId),
    getModulePreferences(client, userId, companyId),
    getPrinterRoutes(client, companyId),
    isApprovalRequired(client, "supplier", companyId),
    isMesOnlyEmployee(userId, companyId)
  ]);

  // Block ERP access for MES-only workers (shop-floor employee types). They can
  // use the MES but not the office app, and are not billed as a seat.
  if (mesOnly) {
    throw redirect(getMESUrl());
  }

  if (!claims || user.error || !user.data || !groups.data) {
    throw await destroyAuthSession(request);
  }

  const employeeCompanies = employeeCompaniesResult.data ?? [];
  const hasMultipleCompanies = employeeCompanies.length > 1;

  // Send multi-company users to the picker, preserving where they were headed.
  const redirectToPicker = () => {
    const url = new URL(request.url);
    const dest = `${url.pathname}${url.search}`;
    return redirect(
      `${path.to.selectCompany}?redirectTo=${encodeURIComponent(dest)}`
    );
  };

  // Multi-company users must actively choose a company. The companyId cookie is
  // the "has chosen this session" marker — set only by the picker / company
  // switch and cleared on logout. Until it's present, force the picker so we
  // never silently serve the alphabetically-first company.
  if (hasMultipleCompanies && !getCompanyId(request)) {
    throw redirectToPicker();
  }

  let company = companies.data?.find((c) => c.companyId === companyId);

  if (!company && companies.data?.length) {
    // Session company is no longer valid (e.g. access revoked). Multi-company
    // users re-pick; single-company users auto-enter their only company.
    if (hasMultipleCompanies) {
      throw redirectToPicker();
    }
    company = employeeCompanies[0] ?? companies.data[0];
    const sessionCookie = await updateCompanySession(
      request,
      company.id!,
      company.companyGroupId ?? ""
    );
    const companyIdCookie = setCompanyId(company.id!);
    throw redirect(path.to.authenticatedRoot, {
      headers: [
        ["Set-Cookie", sessionCookie],
        ["Set-Cookie", companyIdCookie]
      ]
    });
  }

  // Onboarding no longer requires a paid plan — cloud companies enter on the
  // free tier and can purchase later in Billing settings. Only a company name
  // (basic setup) is required.
  const requiresOnboarding = !company?.name;
  if (requiresOnboarding) {
    throw redirect(path.to.onboarding.root);
  }

  // Demo-company state for the banner: whether this user has a demo company, when it expires,
  // and whether it's the one they're currently in. Demo metadata lives in `demoCompany`
  // (one row per demo; RLS limits it to the user's companies).
  const userCompanyIds = (companies.data ?? [])
    .map((c) => c.id)
    .filter((id): id is string => Boolean(id));

  let demo: {
    id: string;
    expiresAt: string | null;
    isCurrent: boolean;
    seedStatus: string | null;
    needsSeed: boolean;
    extensionRequested: boolean;
  } | null = null;
  let realCompanyId: string | null = companyId;
  if (userCompanyIds.length) {
    const { data: demoRow } = await client
      .from("demoCompany")
      .select("id, expiresAt, seedStatus, extensionTokenExpiresAt")
      .in("id", userCompanyIds)
      .maybeSingle();
    if (demoRow) {
      const isCurrent = demoRow.id === companyId;
      // Decide "needs seeding" by DATA PRESENCE, not just the flag: a demo we're in
      // that has no items yet (and isn't already mid-seed) gets seeded. This self-heals
      // demos that were never seeded or whose flag drifted, instead of trusting a flag.
      let needsSeed = false;
      if (isCurrent && demoRow.seedStatus !== "seeding") {
        const { count } = await client
          .from("item")
          .select("id", { count: "exact", head: true })
          .eq("companyId", demoRow.id);
        needsSeed = (count ?? 0) === 0;
      }
      // A request was made < 24 h ago if the token (7-day TTL) expires more than 6 days from now.
      const extensionRequested = demoRow.extensionTokenExpiresAt
        ? new Date(demoRow.extensionTokenExpiresAt).getTime() >
          Date.now() + 6 * 24 * 60 * 60 * 1000
        : false;
      demo = {
        id: demoRow.id,
        expiresAt: demoRow.expiresAt,
        isCurrent,
        seedStatus: demoRow.seedStatus,
        needsSeed,
        extensionRequested
      };
      realCompanyId = userCompanyIds.find((id) => id !== demoRow.id) ?? null;
    }
  }

  // One-time annual plan renewal banner data (rendered only near/after expiry).
  let annualPlan: { termEndsAt: string | null; status: string } | null = null;
  {
    const { data: cp } = await client
      .from("companyPlan")
      .select("paymentMode, termEndsAt, stripeSubscriptionStatus")
      .eq("id", companyId)
      .maybeSingle();
    if (cp?.paymentMode === "one_time") {
      annualPlan = {
        termEndsAt: cp.termEndsAt,
        status: cp.stripeSubscriptionStatus
      };
    }
  }

  return data({
    demo,
    realCompanyId,
    annualPlan,
    session: {
      accessToken,
      expiresIn,
      expiresAt
    },
    auditLogEnabled,
    company,
    companies: companies.data ?? [],
    companySettings: companySettings.data ?? null,
    customFields: customFields.data ?? [],
    defaults: defaults.data,
    integrations: integrations.data ?? [],
    groups: groups.data,
    permissions: claims?.permissions,
    plan: stripeCustomer?.planId,
    role: claims?.role,
    user: user.data,
    modulePreferences: modulePreferences.data ?? [],
    savedViews: savedViews.data ?? [],
    printerRoutes: printerRoutes.data ?? [],
    supplierApprovalRequired,
    openClockEntry: companySettings.data?.timeCardEnabled
      ? getOpenClockEntry(client, userId, companyId)
      : null
  });
}

export default function AuthenticatedRoute() {
  const {
    session,
    user,
    companySettings,
    openClockEntry,
    printerRoutes,
    demo,
    realCompanyId,
    annualPlan
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { training, dismiss } = useTrainingPanel();

  useKeyboardWedge({
    test: (input) => input.startsWith(MES_URL) || input.startsWith(ERP_URL),
    callback: (input) => {
      try {
        const url = new URL(input);
        navigate(url.pathname + url.search);
      } catch {
        navigate(input);
      }
    }
  });

  useMount(() => {
    if (!user) return;

    posthog.identify(user.id, {
      email: user.email,
      name: formatPersonName(
        {
          firstName: user.firstName,
          lastName: user.lastName
        },
        companySettings?.lastNameFirst ?? false
      )
    });
  });

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      {user?.acknowledgedITAR === false && CONTROLLED_ENVIRONMENT ? (
        <ItarPopup
          acknowledgeAction={path.to.acknowledge}
          logoutAction={path.to.logout}
        />
      ) : (
        <CarbonProvider session={session}>
          <PrintingProvider
            value={{
              printing:
                (companySettings?.printing as PrintingSettings | null) ?? null,
              printerRoutes,
              useMetric: Boolean(companySettings?.useMetric),
              printPath: path.to.manualPrint,
              settingsPath: path.to.printingSettings
            }}
          >
            <RealtimeDataProvider>
              <TopbarProvider>
                <OverlayProvider>
                  <TooltipProvider>
                    <div
                      className="flex flex-col h-full min-h-0"
                      style={{
                        paddingLeft: "var(--chat-panel-left, 0px)",
                        paddingRight: "var(--chat-panel-right, 0px)",
                        transition:
                          "padding-left 0.35s ease-out, padding-right 0.35s ease-out"
                      }}
                    >
                      <DemoBanner demo={demo} realCompanyId={realCompanyId} />
                      <PlanRenewalBanner annualPlan={annualPlan} />
                      {demo?.isCurrent && (
                        <DemoSeedTrigger
                          needsSeed={demo.needsSeed}
                          status={demo.seedStatus}
                        />
                      )}
                      <Topbar />
                      <div className="flex flex-1 min-h-0 relative">
                        <PrimaryNavigation />
                        <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-hide bg-muted sm:rounded-tl-2xl relative z-10">
                          <Outlet />
                        </main>
                      </div>
                    </div>
                    <TrainingPanel
                      training={training}
                      isOpen={false}
                      onDismiss={dismiss}
                    />
                    {companySettings?.timeCardEnabled && (
                      <Suspense fallback={null}>
                        <Await resolve={openClockEntry}>
                          {(resolved) => (
                            <TimeCardWarning
                              openClockEntry={
                                resolved?.data
                                  ? {
                                      id: resolved.data.id,
                                      clockIn: resolved.data.clockIn
                                    }
                                  : null
                              }
                            />
                          )}
                        </Await>
                      </Suspense>
                    )}
                    <OverlayHost />
                    <FloatingChat />
                  </TooltipProvider>
                </OverlayProvider>
              </TopbarProvider>
            </RealtimeDataProvider>
          </PrintingProvider>
        </CarbonProvider>
      )}
    </div>
  );
}
