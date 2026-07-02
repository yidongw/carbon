import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  Label,
  NumberField,
  NumberInput,
  Tabs,
  TabsList,
  TabsTrigger,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { useMemo, useState } from "react";
import { useFetcher } from "react-router";

export type PlanItem = {
  id: string;
  name: string;
  stripeTrialPeriodDays: number;
  stripeAnnualPriceId: string | null;
};

export type BillingMode = "one_time" | "subscription";
type Currency = "usd" | "cny";

// Per-seat prices per user per month. Recurring (monthly) and one-time annual
// differ; annual is the discounted, prepaid rate. Annual total = monthly x 12.
// USD is shown everywhere except China (see currency selection below).
function usePlans() {
  const { t } = useLingui();
  return {
    STARTER: {
      monthly: { usd: 40, cny: 288 },
      annualMonthly: { usd: 30, cny: 200 },
      userMinimum: 0,
      description: t`Perfect for low-cost evaluation`,
      features: [
        t`ERP, MES, QMS`,
        t`Cloud-Hosted`,
        t`Self-Onboarding with Carbon Academy`
      ]
    },
    BUSINESS: {
      monthly: { usd: 100, cny: 720 },
      annualMonthly: { usd: 75, cny: 500 },
      userMinimum: 5,
      description: t`For growing businesses that need support`,
      features: [
        t`5 User Minimum`,
        t`Everything from Starter`,
        t`API and Webhooks`,
        t`Implementation Support`,
        t`Unlimited Functional Support`
      ]
    }
  };
}

type PlanDetails = ReturnType<typeof usePlans>[keyof ReturnType<
  typeof usePlans
>];

// Region-aware plan picker with one-time (annual) / recurring (monthly) tabs.
// Rendered both in onboarding and in Billing settings; the enclosing route's
// action handles the POST (planId / mode / quantity, plus intent when provided).
export function PlanSelector({
  plans,
  ipCountry,
  intent
}: {
  plans: PlanItem[];
  ipCountry: string | null;
  // Optional hidden intent forwarded to the host action (e.g. "choose-plan"
  // for the Billing route). Onboarding's action ignores it.
  intent?: string;
}) {
  const { t } = useLingui();
  const PLANS = usePlans();
  const { locale } = useLocale();

  // Either signal — Chinese language OR a China IP — shows CNY; otherwise USD.
  const currency: Currency =
    locale.toLowerCase().startsWith("zh") || ipCountry === "CN" ? "cny" : "usd";

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
    [locale, currency]
  );

  // One-time annual is the default (WeChat Pay / Alipay only work one-time).
  const [billingMode, setBillingMode] = useState<BillingMode>("one_time");

  const sortedPlans = useMemo(
    () =>
      [...plans].sort((a, b) => {
        const priceA = PLANS[a.id as keyof typeof PLANS]?.monthly.usd || 0;
        const priceB = PLANS[b.id as keyof typeof PLANS]?.monthly.usd || 0;
        return priceA - priceB;
      }),
    [plans, PLANS]
  );

  return (
    <div className="w-full">
      <CardDescription className="mb-3">
        {billingMode === "one_time"
          ? t`Pay for one year up front with WeChat Pay, Alipay, or card. Renew before it expires.`
          : t`Pay monthly by card, charged immediately. Switch or cancel anytime.`}
      </CardDescription>
      <Tabs
        value={billingMode}
        onValueChange={(value) => setBillingMode(value as BillingMode)}
      >
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="one_time">
            <Trans>One-time (annual)</Trans>
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <Trans>Recurring (monthly)</Trans>
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
            currency={currency}
            billingMode={billingMode}
            intent={intent}
          />
        ))}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  planDetails,
  formatter,
  currency,
  billingMode,
  intent
}: {
  plan: PlanItem;
  planDetails?: PlanDetails;
  formatter: Intl.NumberFormat;
  currency: Currency;
  billingMode: BillingMode;
  intent?: string;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher();
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
              <div className="flex items-baseline">
                <span className="text-5xl font-bold tracking-tighter">
                  {formatter.format(planDetails?.annualMonthly[currency] ?? 0)}
                </span>
                <span className="ml-1 text-sm text-muted-foreground tracking-tighter">
                  <Trans>/user/mo</Trans>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t`Billed annually · ${formatter.format(
                  (planDetails?.annualMonthly[currency] ?? 0) * 12
                )}/user/yr`}
              </p>
            </div>
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
              <Trans>Total shown at checkout.</Trans>
            </p>
          </VStack>
        ) : (
          <div className="flex items-baseline">
            <span className="text-5xl font-bold tracking-tighter">
              {formatter.format(planDetails?.monthly[currency] ?? 0)}
            </span>
            <span className="ml-1 text-sm text-muted-foreground tracking-tighter">
              <Trans>/month/user</Trans>
            </span>
          </div>
        )}
        <ul className="mt-6 space-y-3">
          {planDetails?.features.map((feature, index) => (
            <li key={index} className="flex items-center justify-start gap-2">
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <VStack className="w-full">
          <fetcher.Form method="post" className="w-full">
            {intent && <input type="hidden" name="intent" value={intent} />}
            <input type="hidden" name="planId" value={plan.id} />
            <input
              type="hidden"
              name="mode"
              value={isOneTime ? "one_time" : "subscription"}
            />
            {isOneTime && <input type="hidden" name="quantity" value={seats} />}
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
                : t`Start Now`}
            </Button>
          </fetcher.Form>
        </VStack>
      </CardFooter>
    </Card>
  );
}
