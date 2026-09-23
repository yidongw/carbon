import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { getUserDefaults } from "~/modules/users/users.server";

// Statuses from which a sales order can be shipped (mirrors SalesOrderHeader "New Shipment").
const SHIPPABLE_STATUSES = ["To Ship", "To Ship and Invoice", "To Invoice"];

export async function action({ request }: ActionFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const formData = await request.formData();
  const ids = formData.getAll("ids") as string[];

  if (ids.length === 0) {
    return { error: { message: "No sales orders selected" }, data: null };
  }

  const serviceRole = getCarbonServiceRole();
  const defaults = await getUserDefaults(serviceRole, userId, companyId);

  // Only ship orders that are actually in a shippable status.
  const salesOrders = await serviceRole
    .from("salesOrder")
    .select("id, status")
    .in("id", ids);

  const shippableIds = (salesOrders.data ?? [])
    .filter((o) => SHIPPABLE_STATUSES.includes(o.status ?? ""))
    .map((o) => o.id);

  const skippedCount = ids.length - shippableIds.length;

  let createdCount = 0;
  const failedIds: string[] = [];

  // One draft shipment per shippable sales order.
  for (const salesOrderId of shippableIds) {
    const shipment = await serviceRole.functions.invoke<{ id: string }>(
      "create",
      {
        body: {
          type: "shipmentFromSalesOrder",
          companyId,
          locationId: defaults.data?.locationId,
          salesOrderId,
          shipmentId: undefined,
          userId
        }
      }
    );

    if (!shipment.data || shipment.error) {
      console.error(shipment.error);
      failedIds.push(salesOrderId);
      continue;
    }

    createdCount++;
  }

  if (createdCount === 0 && failedIds.length > 0) {
    return {
      error: { message: "Failed to create shipments" },
      data: null
    };
  }

  return {
    error: null,
    data: {
      createdCount,
      skippedCount,
      failedCount: failedIds.length
    }
  };
}
