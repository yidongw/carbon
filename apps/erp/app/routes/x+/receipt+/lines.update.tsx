import { requirePermissions } from "@carbon/auth/auth.server";
import type { Json } from "@carbon/database";
import type { ActionFunctionArgs } from "react-router";
import { jobConfigurationUpdateFields } from "~/modules/production/configTableOverlay.server";

export async function action({ request }: ActionFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "inventory"
  });

  const formData = await request.formData();
  const ids = formData.getAll("ids") as string[];
  const field = formData.get("field");
  const value = formData.get("value");
  const variantQuantitiesRaw = formData.get("variantQuantities");

  if (
    typeof field !== "string" ||
    (typeof value !== "string" && value !== null)
  ) {
    return { error: { message: "Invalid form data" }, data: null };
  }

  if (field !== "storageUnitId" && field !== "receivedQuantity") {
    return { error: { message: `Invalid field: ${field}` }, data: null };
  }

  let variantQuantities: Json | null | undefined;
  let nextValue: string | number | null = value ? value : null;
  if (typeof variantQuantitiesRaw === "string" && variantQuantitiesRaw) {
    try {
      const parsed = JSON.parse(variantQuantitiesRaw) as Record<
        string,
        unknown
      >;
      const fields = jobConfigurationUpdateFields(parsed);
      variantQuantities = fields.configuration;
      if (field === "receivedQuantity") {
        nextValue = fields.quantity;
      }
    } catch {
      // keep typed value
    }
  } else if (variantQuantitiesRaw === "") {
    variantQuantities = null;
  }

  // Item Rule evaluation runs at post time only (`$receiptId.post.tsx`).
  // Per-line saves go straight through.
  const update = await client
    .from("receiptLine")
    .update({
      [field]: nextValue,
      ...(variantQuantities !== undefined ? { variantQuantities } : {}),
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    })
    .in("id", ids)
    .eq("companyId", companyId);

  return update;
}
