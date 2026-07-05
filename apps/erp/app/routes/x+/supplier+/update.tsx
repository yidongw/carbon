import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs } from "react-router";

// Bulk / inline update for supplier list-table cells. Uniform field + value + ids
// contract, mirroring the customer update action.
export async function action({ request }: ActionFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    update: "purchasing"
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
    case "name":
      // name is NOT NULL; never clear it.
      if (!value) {
        return { error: { message: "Name is required" }, data: null };
      }
      return await client
        .from("supplier")
        .update({
          name: value,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        })
        .in("id", ids as string[]);
    case "phone":
    case "fax":
    case "website":
    case "currencyCode":
    case "supplierTypeId":
    case "supplierStatus":
    case "accountManagerId":
    case "purchasingContactId":
      return await client
        .from("supplier")
        .update({
          [field]: value ? value : null,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        })
        .in("id", ids as string[]);
    default:
      return { error: { message: "Invalid field" }, data: null };
  }
}
