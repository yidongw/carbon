import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs } from "react-router";

// Bulk / inline update for process list-table cells. `active` goes through the
// guarded activate/deactivate flow in the UI, but is handled here too.
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
      .from("process")
      .update({ ...patch, ...stamp })
      .in("id", ids as string[]);

  switch (field) {
    case "name":
      if (!value) {
        return { error: { message: "Name is required" }, data: null };
      }
      return await run({ name: value });
    case "processType":
    case "defaultStandardFactor":
      return await run({ [field]: value ? value : null });
    case "active":
    case "completeAllOnScan":
      return await run({ [field]: value === "on" || value === "true" });
    default:
      return { error: { message: "Invalid field" }, data: null };
  }
}
