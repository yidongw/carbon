import {
  redactEmployeeQuantityCosts,
  redactSupplierQuantityCosts
} from "~/modules/production/ui/Jobs/unifiedQuantityFeeds";
import { getUserClaims } from "~/modules/users/users.server";

type EmployeeRows = Parameters<typeof redactEmployeeQuantityCosts>[0];
type SupplierRows = Parameters<typeof redactSupplierQuantityCosts>[0];

/**
 * Completion-line unit costs (wage rate + subcontract rate) are financial data:
 * only users with accounting:view may see the money they imply. Returns the
 * rows untouched for authorized users, otherwise with unit costs redacted, plus
 * a flag the route hands to the table so it also hides the Amount column.
 */
export async function resolveQuantityCostVisibility(
  userId: string,
  companyId: string,
  employee: EmployeeRows,
  supplier: SupplierRows
): Promise<{
  canViewCosts: boolean;
  employee: EmployeeRows;
  supplier: SupplierRows;
}> {
  const claims = await getUserClaims(userId, companyId);
  const canViewCosts = Boolean(
    // biome-ignore lint/complexity/useLiteralKeys: permission map is index-signature typed
    claims.permissions["accounting"]?.view?.includes(companyId)
  );

  if (canViewCosts) return { canViewCosts, employee, supplier };

  return {
    canViewCosts,
    employee: redactEmployeeQuantityCosts(employee),
    supplier: redactSupplierQuantityCosts(supplier)
  };
}
