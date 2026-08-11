import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getStyleOnHandByColorSize } from "~/modules/inventory";
import { breakdownToInventoryVariantsQuantity } from "~/modules/inventory/styleInventoryConfig";

/**
 * Style on-hand by variants quantity for transfer/shipment variants-quantity hints + caps.
 * Query: itemId, locationId, optional storageUnitId.
 *
 * - omit `storageUnitId` → all bins (no filter)
 * - `storageUnitId=` (empty) → unassigned only (no storage unit)
 * - `storageUnitId=<id>` → that storage unit only
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory",
    bypassRls: true
  });

  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");
  const locationId = url.searchParams.get("locationId");
  const filterByStorageUnit = url.searchParams.has("storageUnitId");
  const storageUnitId = filterByStorageUnit
    ? url.searchParams.get("storageUnitId") || null
    : undefined;
  if (!itemId || !locationId) {
    return { breakdown: [], variantQuantities: null };
  }

  const breakdown = await getStyleOnHandByColorSize(
    client,
    itemId,
    companyId,
    locationId,
    storageUnitId
  );
  const variantQuantities = breakdownToInventoryVariantsQuantity(breakdown);

  return { breakdown, variantQuantities };
}
