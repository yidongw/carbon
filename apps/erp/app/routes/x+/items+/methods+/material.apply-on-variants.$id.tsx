import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { updateMethodMaterialApplyOnVariants } from "~/modules/items";

// Inline per-row "Apply on Variants" update, driven by the BOM-line badge.
export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { id } = params;
  if (!id) {
    return data({}, await flash(request, error(null, "No material id")));
  }

  const raw = (await request.formData()).get("applyOnVariantValueIds") as
    | string
    | null;
  let applyOnVariantValueIds: string[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      applyOnVariantValueIds = parsed.filter(
        (v): v is string => typeof v === "string"
      );
    }
  } catch {
    applyOnVariantValueIds = [];
  }

  const update = await updateMethodMaterialApplyOnVariants(client, {
    id,
    applyOnVariantValueIds,
    updatedBy: userId
  });
  if (update.error) {
    return data(
      {},
      await flash(request, error(update.error, "Failed to update variant scope"))
    );
  }

  return data({ id, success: true });
}
