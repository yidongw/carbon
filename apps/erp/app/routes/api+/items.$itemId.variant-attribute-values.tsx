import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getVariantAttributeValueOptionsForItem } from "~/modules/items/itemAttribute.service";

// Labeled "Apply on Variants" options for a make-method's parent item. Fetched
// client-side by the BOM/BOP line editor; returns [] for items with no variant
// attributes so the selector simply doesn't render.
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});
  const { itemId } = params;
  if (!itemId) return { data: [], error: null };
  return await getVariantAttributeValueOptionsForItem(client, {
    itemId,
    companyId
  });
}
