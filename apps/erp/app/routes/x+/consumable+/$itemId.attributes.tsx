import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  parseAttributeValueSelectionsFromFormData,
  syncItemVariantsFromSelections
} from "~/modules/items/itemAttribute.service";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const attributeSetId = String(formData.get("attributeSetId") ?? "").trim();
  if (!attributeSetId) {
    // Driven by an inline fetcher; return data (not a redirect) so the caller's
    // query state is preserved instead of being navigated away.
    return data(
      { success: false },
      await flash(request, error(null, "Attribute set is required"))
    );
  }

  const selections = parseAttributeValueSelectionsFromFormData(formData);
  const sync = await syncItemVariantsFromSelections(client, {
    itemId,
    companyId,
    userId,
    attributeSetId,
    selections
  });

  if (sync.error) {
    return data(
      { success: false },
      await flash(
        request,
        error(sync.error, "Failed to update consumable attributes")
      )
    );
  }

  // Inline autosave: return data so the fetcher stays inline (a redirect would
  // navigate to the bare consumable URL and drop query params). The parent
  // loader revalidates automatically, refreshing the selection badges.
  return data(
    { success: true },
    await flash(request, success("Updated consumable attributes"))
  );
}

export default function ConsumableAttributesRoute() {
  return null;
}
