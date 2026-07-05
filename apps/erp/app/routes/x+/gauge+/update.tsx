import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs } from "react-router";

// Bulk / inline update for gauge list-table cells. gaugeStatus and the
// calibration fields are intentionally NOT inline-edited (they have their own
// activate/deactivate + calibration flows), but the action handles gaugeStatus.
export async function action({ request }: ActionFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    update: "quality"
  });

  const formData = await request.formData();
  const ids = formData.getAll("ids");
  const field = formData.get("field");
  const value = formData.get("value");

  if (
    typeof field !== "string" ||
    (typeof value !== "string" && value !== null)
  ) {
    return { error: { message: "Invalid form data" }, data: null };
  }

  const stamp = { updatedBy: userId, updatedAt: new Date().toISOString() };
  const run = (patch: Record<string, unknown>) =>
    client
      .from("gauge")
      .update({ ...patch, ...stamp })
      .in("id", ids as string[]);

  switch (field) {
    case "gaugeTypeId":
    case "gaugeRole":
    case "gaugeStatus":
      // required enums / FK — never clear.
      if (!value) {
        return { error: { message: "Value is required" }, data: null };
      }
      return await run({ [field]: value });
    case "locationId":
    case "supplierId":
    case "modelNumber":
    case "serialNumber":
    case "description":
    case "dateAcquired":
      return await run({ [field]: value ? value : null });
    case "calibrationIntervalInMonths":
      return await run({ [field]: value ? Number(value) : null });
    default:
      return { error: { message: "Invalid field" }, data: null };
  }
}
