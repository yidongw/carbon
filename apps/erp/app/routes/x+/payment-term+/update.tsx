import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs } from "react-router";

// Bulk / inline update for payment-term list-table cells.
export async function action({ request }: ActionFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    update: "accounting"
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
      .from("paymentTerm")
      .update({ ...patch, ...stamp })
      .in("id", ids as string[]);

  switch (field) {
    case "name":
      if (!value) {
        return { error: { message: "Name is required" }, data: null };
      }
      return await run({ name: value });
    case "calculationMethod":
      if (!value) {
        return { error: { message: "Value is required" }, data: null };
      }
      return await run({ calculationMethod: value });
    case "daysDue":
    case "daysDiscount":
    case "discountPercentage":
      return await run({ [field]: value ? Number(value) : 0 });
    case "active":
      return await run({ active: value === "on" || value === "true" });
    default:
      return { error: { message: "Invalid field" }, data: null };
  }
}
