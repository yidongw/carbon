export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

export {
  formatDateTime,
  getEarned,
  getItemName,
  getItemReadableIdWithRevision,
  getJobOperationDescription,
  getJobReadableId,
  getProcessName,
  getUnitCost,
  type ProductionQuantityJobOperationRow
} from "~/modules/production/productionQuantityDisplay.utils";

export type { ProductionQuantityJobOperationRow as SalaryCompletionRow } from "~/modules/production/productionQuantityDisplay.utils";

type EmployeeNameParts = {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

/** Builds a display name from name parts, returning a fallback when empty. */
export function getEmployeeName(
  parts: EmployeeNameParts | null | undefined,
  fallback = "—"
) {
  if (!parts) return fallback;
  const full = parts.fullName?.trim();
  if (full) return full;
  const combined = `${parts.firstName ?? ""} ${parts.lastName ?? ""}`.trim();
  return combined || fallback;
}

export type SalaryPaymentStatus = "Unpaid" | "Partially Paid" | "Paid";

/** Payment status derived from totals (ignores legacy Draft/Approved values). */
export function getSalaryPaymentStatus(
  totalEarned: number | null | undefined,
  totalPaid: number | null | undefined
): SalaryPaymentStatus {
  const earned = totalEarned ?? 0;
  const paid = totalPaid ?? 0;

  if (paid > 0 && earned > 0 && paid >= earned) return "Paid";
  if (paid > 0) return "Partially Paid";
  return "Unpaid";
}

export function statusVariant(status: string | null | undefined) {
  switch (status) {
    case "Paid":
      return "green";
    case "Partially Paid":
      return "yellow";
    case "Unpaid":
    default:
      return "secondary";
  }
}
