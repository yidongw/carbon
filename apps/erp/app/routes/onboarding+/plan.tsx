import { CarbonEdition, getUser } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { CardHeader, CardTitle, IconButton } from "@carbon/react";
import { getCheckoutUrl } from "@carbon/stripe/stripe.server";
import { Edition } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { LuMoveLeft } from "react-icons/lu";
import type { ActionFunctionArgs } from "react-router";
import { Form, redirect, useLoaderData } from "react-router";
import { PlanSelector } from "~/components/PlanSelector";
import { getCompany, getPlans } from "~/modules/settings";
import { path } from "~/utils/path";

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

  // We only sell Starter and Business — never surface partner/dev/other rows
  // that may exist in the DB.
  const SELLABLE_PLAN_IDS = ["STARTER", "BUSINESS"];

  // Visitor country (Vercel or Cloudflare geo header) drives the display currency
  // together with the browser/account language — either signal for China ⇒ CNY.
  const ipCountry =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null;

  return {
    plans: (plans.data ?? []).filter(
      (p) => p.public && SELLABLE_PLAN_IDS.includes(p.id)
    ),
    companyId,
    ipCountry
  };
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

  const validPlanIds = ["STARTER", "BUSINESS"];
  if (!validPlanIds.includes(planId)) {
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

export default function OnboardingPlan() {
  const { t } = useLingui();
  const { plans, ipCountry } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-col max-w-2xl w-full min-h-screen md:min-h-0">
        <div className="sticky top-0 bg-background z-10 mb-4 rounded-2xl">
          <CardHeader>
            <CardTitle>
              <Trans>Select a plan</Trans>
            </CardTitle>
          </CardHeader>
        </div>
        <div className="flex-1 px-6">
          <PlanSelector plans={plans} ipCountry={ipCountry} />
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
