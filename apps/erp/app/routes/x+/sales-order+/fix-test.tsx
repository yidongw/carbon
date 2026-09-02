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
 * TEMPORARY repair for the PO-45xx test orders seeded earlier without a line
 * `locationId`. shipmentFromSalesOrder only ships lines whose locationId equals
 * the shipment location, so those orders produced empty shipments (Post
 * disabled). This backfills the line locationId to the user's default shipment
 * location and clears the empty draft shipments so re-shipping is clean.
 * Delete this route after running once.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {
    update: "sales"
  });

  const serviceRole = getCarbonServiceRole();

  const [defaults, firstLocation] = await Promise.all([
    getUserDefaults(serviceRole, userId, companyId),
    serviceRole
      .from("location")
      .select("id")
      .eq("companyId", companyId)
      .order("name")
      .limit(1)
      .maybeSingle()
  ]);
  const locationId =
    defaults.data?.locationId ?? firstLocation.data?.id ?? null;

  if (!locationId) {
    return {
      ok: false,
      message: "No location found for this company.",
      fixed: 0,
      cleared: 0
    };
  }

  const testOrders = await serviceRole
    .from("salesOrder")
    .select("id")
    .eq("companyId", companyId)
    .like("customerReference", "PO-45%");

  const orderIds = (testOrders.data ?? []).map((o) => o.id);
  if (orderIds.length === 0) {
    return {
      ok: false,
      message: "No PO-45xx test orders found.",
      fixed: 0,
      cleared: 0
    };
  }

  // 1. Backfill line locationId so the lines are shippable.
  const fixed = await serviceRole
    .from("salesOrderLine")
    .update({ locationId })
    .in("salesOrderId", orderIds)
    .is("locationId", null)
    .select("id");

  // Keep the shipping card consistent too.
  await serviceRole
    .from("salesOrderShipment")
    .update({ locationId })
    .in("id", orderIds);

  // 2. Clear the empty draft shipments already generated from these orders.
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

  return {
    ok: true,
    message: `Fixed ${fixed.data?.length ?? 0} order lines and cleared ${shipmentIds.length} empty draft shipment(s). Now re-select the orders and click "Generate draft shipments" again.`,
    fixed: fixed.data?.length ?? 0,
    cleared: shipmentIds.length
  };
}

export default function FixTestOrdersRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <VStack spacing={4} className="p-8 max-w-xl">
      <Heading size="h3">Fix test sales orders</Heading>
      <p className={data.ok ? "text-emerald-600" : "text-red-600"}>
        {data.message}
      </p>
    </VStack>
  );
}
