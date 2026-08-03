import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getSerialNumbersForItem } from "~/modules/inventory/inventory.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});

  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");
  if (!itemId) {
    return {
      data: [],
      error: null
    };
  }

  const isReadOnly = url.searchParams.get("isReadOnly") === "true";
  const locationId = url.searchParams.get("locationId");

  return await getSerialNumbersForItem(client, {
    itemId,
    companyId,
    // Restrict to serials on-hand at the source location when actively editing.
    // In read-only mode, keep the location-blind list so already-assigned
    // (possibly consumed / relocated) serials still resolve for display.
    locationId: isReadOnly ? undefined : (locationId ?? undefined)
  });
}
