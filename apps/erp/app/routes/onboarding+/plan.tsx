import { CarbonEdition, getUser } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  IconButton,
  Label,
  NumberField,
  NumberInput,
  Tabs,
  TabsList,
  TabsTrigger,
  VStack
} from "@carbon/react";
import { getCheckoutUrl } from "@carbon/stripe/stripe.server";
import { Edition } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { useMemo, useState } from "react";
import { LuGraduationCap, LuMoveLeft, LuPhoneCall } from "react-icons/lu";
import type { ActionFunctionArgs } from "react-router";
import { Form, redirect, useFetcher, useLoaderData } from "react-router";
import { getCompany, getPlans } from "~/modules/settings";
import { path } from "~/utils/path";

function usePlans() {
  const { t } = useLingui();
  return {
    STARTER: {
      price: 40,
      userMinimum: 0,
      talkToSales: false,
      description: t`Perfect for low-cost evaluation`,
      features: [
        t`ERP, MES, QMS`,
        t`Cloud-Hosted`,
        t`Self-Onboarding with Carbon Academy`
      ]
    },
    BUSINESS: {
      price: 100,
      userMinimum: 5,
      talkToSales: true,
      description: t`For growing businesses that need support`,
      features: [
        t`5 User Minimum`,
        t`Everything from Starter`,
        t`API and Webhooks`,
        t`Implementation Support`,
        t`Unlimited Functional Support`
      ]
    },
    GOVCLOUD: {
      price: 100,
      userMinimum: 5,
      talkToSales: true,
      description: t`For US companies handling ITAR data`,
      features: [
        t`5 User Minimum`,
        t`ERP, MES, QMS`,
        t`Cloud-Hosted`,
        t`API and Webhooks`,
        t`Implementation Support`,
        t`Unlimited Functional Support`
      ]
    }
  };
}

export async function loader({ request }: ActionFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});
  if (CarbonEdition !== Edition.Cloud) {
    throw redirect(path.to.authenticatedRoot);
  }

  const plans = await getPlans(client);

  if (!companyId) {
    throw redirect(path.to.onboarding.company);
  }

  if (plans.error || !plans.data) {
    throw new Error("Failed to load plans");
  }

  return { plans: plans.data?.filter((p) => p.public), companyId };
}

export async function action({ request }: ActionFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {});
  const formData = await request.formData();
  const planId = String(formData.get("planId"));
  const mode =
    String(formData.get("mode") ?? "subscription") === "one_time"
      ? "one_time"
      : "subscription";
  const quantity = Math.max(
    1,
    parseInt(String(formData.get("quantity") ?? "1"), 10) || 1
  );

  if (!planId) {
    throw new Error("Plan ID is required");
  }

  const validPlanIds = ["STARTER", "BUSINESS", "GOVCLOUD"];
  if (!validPlanIds.includes(planId) || planId.startsWith("PARTNER")) {
    throw new Error("Invalid plan ID");
  }

  const [user, company] = await Promise.all([
    getUser(client, userId),
    getCompany(client, companyId)
  ]);

  if (!user.data) {
    throw new Error("User not found");
  }

  if (!company.data) {
    throw new Error("Company not found");
  }

  const url = await getCheckoutUrl({
    planId,
    userId,
    companyId,
    name: company.data?.name,
    email: user.data?.email ?? "",
    mode,
    quantity
  });

  throw redirect(url);
}

type BillingMode = "one_time" | "subscription";

export default function OnboardingPlan() {
  const { t } = useLingui();
  const PLANS = usePlans();
  const { plans } = useLoaderData<typeof loader>();
  const { locale } = useLocale();
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
    [locale]
  );

  // One-time annual is the default (WeChat Pay / Alipay only work one-time).
  const [billingMode, setBillingMode] = useState<BillingMode>("one_time");

  const sortedPlans = useMemo(
    () =>
      [...plans].sort((a, b) => {
        const priceA = PLANS[a.id as keyof typeof PLANS]?.price || 0;
        const priceB = PLANS[b.id as keyof typeof PLANS]?.price || 0;
        return priceA - priceB;
      }),
    [plans, PLANS]
  );

  return (
    <>
      <div className="flex flex-col max-w-2xl w-full min-h-screen md:min-h-0">
        <div className="sticky top-0 bg-background z-10 pb-4">
          <CardHeader>
            <CardTitle>
              <Trans>Select a plan</Trans>
            </CardTitle>
            <CardDescription>
              {billingMode === "one_time"
                ? t`Pay for one year up front with WeChat Pay, Alipay, or card. Renew before it expires.`
                : t`Pay monthly by card. You won't be charged for the first ${plans[0].stripeTrialPeriodDays} days. Switch or cancel anytime.`}
            </CardDescription>
          </CardHeader>
          <div className="px-6">
            <Tabs
              value={billingMode}
              onValueChange={(value) => setBillingMode(value as BillingMode)}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="one_time">
                  <Trans>One-time (annual)</Trans>
                </TabsTrigger>
                <TabsTrigger value="subscription">
                  <Trans>Recurring (monthly)</Trans>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="flex-1">
          <div
            className={cn(
              "grid gap-6",
              plans.length === 1
                ? "grid-cols-1 justify-center"
                : "grid-cols-1 md:grid-cols-2"
            )}
          >
            {sortedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                planDetails={PLANS[plan.id as keyof typeof PLANS]}
                formatter={formatter}
                billingMode={billingMode}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="fixed top-0 left-2 z-10">
        <Form method="post" action={path.to.logout}>
          <IconButton
            size="lg"
            type="submit"
            variant="ghost"
            icon={<LuMoveLeft />}
            aria-label={t`Back`}
          />
        </Form>
      </div>
    </>
  );
}

type PlanDetails = ReturnType<typeof usePlans>[keyof ReturnType<
  typeof usePlans
>];

function PlanCard({
  plan,
  planDetails,
  formatter,
  billingMode
}: {
  plan: {
    id: string;
    name: string;
    stripeTrialPeriodDays: number;
    stripeAnnualPriceId: string | null;
  };
  planDetails?: PlanDetails;
  formatter: Intl.NumberFormat;
  billingMode: BillingMode;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.state !== "idle";
  const isOneTime = billingMode === "one_time";

  const minSeats = Math.max(1, planDetails?.userMinimum ?? 1);
  const [seats, setSeats] = useState(minSeats);
  const oneTimeAvailable = Boolean(plan.stripeAnnualPriceId);

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{planDetails?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isOneTime ? (
          <VStack spacing={4} className="w-full">
            <div className="w-full">
              <Label htmlFor={`seats-${plan.id}`}>
                <Trans>Seats</Trans>
              </Label>
              <NumberField
                value={seats}
                minValue={minSeats}
                onChange={(value) => {
                  if (Number.isFinite(value)) setSeats(value);
                }}
              >
                <NumberInput id={`seats-${plan.id}`} className="w-full" />
              </NumberField>
              {minSeats > 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t`${minSeats} user minimum`}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              <Trans>
                Billed for 12 months up front. Total shown at checkout.
              </Trans>
            </p>
          </VStack>
        ) : (
          <div className="flex items-baseline">
            <span className="text-5xl font-bold tracking-tighter">
              {formatter.format(planDetails?.price ?? 0)}
            </span>
            <span className="ml-1 text-sm text-muted-foreground tracking-tighter">
              <Trans>/month/user</Trans>
            </span>
          </div>
        )}
        <ul className="mt-6 space-y-3">
          {planDetails?.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center justify-start gap-2"
            >
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <VStack className="w-full">
          <fetcher.Form method="post" className="w-full">
            <input type="hidden" name="planId" value={plan.id} />
            <input
              type="hidden"
              name="mode"
              value={isOneTime ? "one_time" : "subscription"}
            />
            {isOneTime && (
              <input type="hidden" name="quantity" value={seats} />
            )}
            <Button
              className="w-full"
              variant="primary"
              type="submit"
              isDisabled={isSubmitting || (isOneTime && !oneTimeAvailable)}
              isLoading={isSubmitting}
            >
              {isOneTime
                ? oneTimeAvailable
                  ? t`Pay 1 Year`
                  : t`Not available`
                : plan.stripeTrialPeriodDays > 0
                  ? t`Start ${plan.stripeTrialPeriodDays} Day Free Trial`
                  : t`Start Now`}
            </Button>
          </fetcher.Form>

          {planDetails?.talkToSales ? (
            <Button
              leftIcon={<LuPhoneCall />}
              className="w-full"
              variant="secondary"
              asChild
            >
              <a
                href="https://carbon.ms/sales"
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Talk to Sales</Trans>
              </a>
            </Button>
          ) : (
            <Button
              leftIcon={<LuGraduationCap />}
              className="w-full"
              variant="secondary"
              asChild
            >
              <a
                href="https://learn.carbon.ms"
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Start Learning</Trans>
              </a>
            </Button>
          )}
        </VStack>
      </CardFooter>
    </Card>
  );
}
