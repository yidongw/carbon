import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getStyleOnHandByColorSize } from "~/modules/inventory";
import { breakdownToInventoryVariantsQuantity } from "~/modules/inventory/styleInventoryConfig";

/**
 * Style on-hand by variants quantity for transfer/shipment variants-quantity hints + caps.
 * Query: itemId, locationId, optional storageUnitId.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory",
    bypassRls: true
  });

  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");
  const locationId = url.searchParams.get("locationId");
  const storageUnitId = url.searchParams.get("storageUnitId");
  if (!itemId || !locationId) {
    return { breakdown: [], variantQuantities: null };
  }

  const breakdown = await getStyleOnHandByVariant(
    client,
    itemId,
    companyId,
    locationId,
    storageUnitId || null
  );
  const variantQuantities = breakdownToInventoryVariantsQuantity(breakdown);

  return { breakdown, variantQuantities };
}
