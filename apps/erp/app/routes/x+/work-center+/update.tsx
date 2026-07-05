import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs } from "react-router";

// Bulk / inline update for work-center list-table cells. Note: `active` is
// intentionally NOT inline-editable in the UI (it goes through the guarded
// activate/deactivate flow that checks for active operations), but the action
// still handles it for completeness.
export async function action({ request }: ActionFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    update: "resources"
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
      .from("workCenter")
      .update({ ...patch, ...stamp })
      .in("id", ids as string[]);

  switch (field) {
    case "name":
      if (!value) {
        return { error: { message: "Name is required" }, data: null };
      }
      return await run({ name: value });
    case "description":
    case "departmentId":
    case "locationId":
    case "requiredAbilityId":
    case "defaultStandardFactor":
      return await run({ [field]: value ? value : null });
    case "laborRate":
    case "machineRate":
    case "overheadRate":
      return await run({ [field]: value ? Number(value) : 0 });
    case "active":
      return await run({ active: value === "on" || value === "true" });
    default:
      return { error: { message: "Invalid field" }, data: null };
  }
}
