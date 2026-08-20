import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getBomComponentVariants } from "~/modules/items/itemAttribute.service";

/**
 * Variant SKU children usable as BOM components.
 *
 * The default item pickers show variant PARENTS (users browse templates;
 * inventory/jobs resolve to children under the hood — see RealtimeDataProvider).
 * The BOM component picker is the exception: you consume a concrete SKU, not the
 * abstract parent, so it lists the leaf children plus a readable
 * "parent · attributes" combo. See `getBomComponentVariants`.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  // Any authenticated employee — no parts_view required (mirrors items.configurable).
  const { client, companyId } = await requirePermissions(request, {});
  return getBomComponentVariants(client, companyId);
}
