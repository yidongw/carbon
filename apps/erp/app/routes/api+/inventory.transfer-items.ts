import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getInventoryItems } from "~/modules/inventory";

// On-hand items at a location for the New Transfer picker. Uses
// get_inventory_quantities (via getInventoryItems), which — unlike the shared
// item store — includes hidden types like samples.
export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory",
    bypassRls: true
  });

  const url = new URL(request.url);
  const locationId = url.searchParams.get("locationId");
  if (!locationId) return { items: [] };

  const result = await getInventoryItems(client, locationId, companyId, {
    search: url.searchParams.get("search"),
    limit: 200,
    offset: 0,
    sorts: [],
    filters: []
  });

  const items = (result.data ?? [])
    .filter((i: { quantityOnHand?: number }) => (i.quantityOnHand ?? 0) > 0)
    .map(
      (i: {
        id: string;
        readableIdWithRevision?: string;
        name?: string;
        type?: string;
        itemTrackingType?: string;
        unitOfMeasureCode?: string;
        quantityOnHand?: number;
      }) => ({
        id: i.id,
        readableId: i.readableIdWithRevision ?? i.id,
        name: i.name ?? "",
        type: i.type,
        itemTrackingType: i.itemTrackingType,
        unitOfMeasureCode: i.unitOfMeasureCode ?? "EA",
        quantityOnHand: Number(i.quantityOnHand ?? 0)
      })
    );

  return { items };
}
