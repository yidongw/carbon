import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  parseAttributeValueSelectionsFromFormData,
  syncItemVariantsFromSelections
} from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

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
    throw redirect(
      path.to.style(itemId),
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
        error(sync.error, "Failed to update style attributes")
      )
    );
  }

  throw redirect(
    path.to.style(itemId),
    await flash(request, success("Updated style attributes"))
  );
}

export default function StyleAttributesRoute() {
  return null;
}
