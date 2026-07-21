import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";

// Bulk / inline update for the Employees (permissions) list table. The editable
// fields live on three tables, all keyed by the user id: firstName/lastName on
// `user` (global identity; fullName is a generated column), employeeTypeId on
// `employee`, and locationId on `employeeJob` — the last two scoped by company.
export async function action({ request }: ActionFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "users"
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

  switch (field) {
    case "firstName":
    case "lastName":
      if (!value) {
        return { error: { message: "Value is required" }, data: null };
      }
      return await client
        .from("user")
        .update({ [field]: value })
        .in("id", ids as string[]);
    case "employeeTypeId":
      if (!value) {
        return { error: { message: "Employee type is required" }, data: null };
      }
      return await client
        .from("employee")
        .update({ employeeTypeId: value })
        .in("id", ids as string[])
        .eq("companyId", companyId);
    case "locationId": {
      // Upsert (not update) so employees missing an `employeeJob` row — e.g.
      // phone-invited or legacy users — still get their location set instead of
      // the update silently affecting 0 rows. Validate the ids belong to this
      // company's employees first (RLS-scoped), then upsert via service role
      // since inserting an employeeJob needs the people_create policy.
      const employees = await client
        .from("employee")
        .select("id")
        .in("id", ids as string[])
        .eq("companyId", companyId);
      if (employees.error) {
        return { error: employees.error, data: null };
      }
      const validIds = employees.data.map((e) => e.id);
      if (validIds.length === 0) {
        return { data: null, error: null };
      }
      const now = new Date().toISOString();
      return await getCarbonServiceRole()
        .from("employeeJob")
        .upsert(
          validIds.map((id) => ({
            id,
            companyId,
            locationId: value ? value : null,
            updatedBy: userId,
            updatedAt: now
          })),
          { onConflict: "id,companyId" }
        );
    }
    default:
      return { error: { message: "Invalid field" }, data: null };
  }
}

// Action-only route (posted to via fetcher); render nothing.
export default function EmployeesUpdateRoute() {
  return null;
}
