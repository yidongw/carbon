import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { Heading, VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getUserDefaults } from "~/modules/users/users.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: "Fix Test Orders",
  to: path.to.salesOrders
};

/**
 * TEMPORARY repair + diagnostics for the PO-45xx test orders. Ensures each has
 * one shippable Part line at the default shipment location (creates it if
 * missing, backfills locationId if present) and clears any empty draft
 * shipments so re-shipping is clean. Delete this route after use.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {
    update: "sales"
  });

  const serviceRole = getCarbonServiceRole();

  const [defaults, firstLocation, partItem] = await Promise.all([
    getUserDefaults(serviceRole, userId, companyId),
    serviceRole
      .from("location")
      .select("id")
      .eq("companyId", companyId)
      .order("name")
      .limit(1)
      .maybeSingle(),
    serviceRole
      .from("item")
      .select("id, readableId, unitOfMeasureCode")
      .eq("companyId", companyId)
      .eq("type", "Part")
      .eq("active", true)
      .limit(1)
      .maybeSingle()
  ]);
  const locationId =
    defaults.data?.locationId ?? firstLocation.data?.id ?? null;

  const diag: string[] = [];

  const testOrders = await serviceRole
    .from("salesOrder")
    .select("id, salesOrderId, customerReference")
    .eq("companyId", companyId)
    .like("customerReference", "PO-45%");

  const orders = testOrders.data ?? [];
  diag.push(`orders found: ${orders.length}`);
  diag.push(`locationId: ${locationId ?? "NONE"}`);
  diag.push(
    `part item: ${partItem.data?.readableId ?? "NONE"} (uom ${partItem.data?.unitOfMeasureCode ?? "?"})`
  );

  if (orders.length === 0 || !locationId || !partItem.data) {
    return {
      ok: false,
      message: `Cannot repair. ${diag.join(" | ")}`
    };
  }
  const orderIds = orders.map((o) => o.id);

  const existingLines = await serviceRole
    .from("salesOrderLine")
    .select("id, salesOrderId, locationId")
    .in("salesOrderId", orderIds);
  const lines = existingLines.data ?? [];
  diag.push(`existing lines: ${lines.length}`);
  if (existingLines.error)
    diag.push(`lines query error: ${existingLines.error.message}`);

  const orderIdsWithLine = new Set(lines.map((l) => l.salesOrderId));

  let linesCreated = 0;
  let createError = "";
  for (const order of orders) {
    if (orderIdsWithLine.has(order.id)) continue;
    const insert = await serviceRole.from("salesOrderLine").insert({
      salesOrderId: order.id,
      salesOrderLineType: "Part",
      itemId: partItem.data.id,
      description: partItem.data.readableId ?? "Test line",
      saleQuantity: 10,
      unitPrice: 100,
      unitOfMeasureCode: partItem.data.unitOfMeasureCode ?? "EA",
      locationId,
      companyId,
      createdBy: userId
    });
    if (insert.error) {
      createError = insert.error.message;
      break;
    }
    linesCreated++;
  }
  if (createError) diag.push(`line insert error: ${createError}`);

  // Backfill locationId on any existing lines.
  const updated = await serviceRole
    .from("salesOrderLine")
    .update({ locationId })
    .in("salesOrderId", orderIds)
    .neq("locationId", locationId)
    .select("id");
  diag.push(
    `lines created: ${linesCreated}, lines re-located: ${updated.data?.length ?? 0}`
  );

  await serviceRole
    .from("salesOrderShipment")
    .update({ locationId })
    .in("id", orderIds);

  // Clear empty draft shipments already generated from these orders.
  const emptyShipments = await serviceRole
    .from("shipment")
    .select("id")
    .eq("companyId", companyId)
    .eq("status", "Draft")
    .eq("sourceDocument", "Sales Order")
    .in("sourceDocumentId", orderIds);
  const shipmentIds = (emptyShipments.data ?? []).map((s) => s.id);
  if (shipmentIds.length > 0) {
    await serviceRole
      .from("shipmentLine")
      .delete()
      .in("shipmentId", shipmentIds);
    await serviceRole.from("shipment").delete().in("id", shipmentIds);
  }
  diag.push(`draft shipments cleared: ${shipmentIds.length}`);

  return {
    ok: true,
    message: diag.join(" | ")
  };
}

export default function FixTestOrdersRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <VStack spacing={4} className="p-8 max-w-2xl">
      <Heading size="h3">Fix test sales orders</Heading>
      <p className={data.ok ? "text-emerald-600" : "text-red-600"}>
        {data.message}
      </p>
      <p className="text-muted-foreground text-sm">
        Then re-select the orders and click “Generate draft shipments” again.
      </p>
    </VStack>
  );
}
