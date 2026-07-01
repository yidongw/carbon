import { cn } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { Link } from "react-router";
import { path } from "~/utils/path";

function daysLeft(termEndsAt: string | null): number {
  if (!termEndsAt) return 0;
  return Math.ceil((new Date(termEndsAt).getTime() - Date.now()) / 86400000);
}

// Nudges owners of a one-time annual plan to renew. Shows only within the last
// 30 days of the term, or once it has expired. Links to Billing settings.
export function PlanRenewalBanner({
  annualPlan
}: {
  annualPlan: { termEndsAt: string | null; status: string } | null;
}) {
  const { t } = useLingui();
  if (!annualPlan) return null;

  const left = daysLeft(annualPlan.termEndsAt);
  const expired = annualPlan.status === "Inactive" || left <= 0;
  if (!expired && left > 30) return null;

  return (
    <Link
      to={path.to.billing}
      className={cn(
        "block px-4 py-1.5 text-center text-sm font-medium hover:underline",
        expired
          ? "bg-destructive text-destructive-foreground"
          : "bg-yellow-400 text-yellow-950"
      )}
    >
      {expired
        ? t`Your annual license has expired. Renew now to restore access.`
        : t`Your annual license expires in ${left} days. Renew now.`}
    </Link>
  );
}
