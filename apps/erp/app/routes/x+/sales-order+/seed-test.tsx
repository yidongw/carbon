import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { Button, Heading, VStack } from "@carbon/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useNavigation } from "react-router";
import { getNextSequence } from "~/modules/settings/settings.service";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: "Seed Test Orders",
  to: path.to.salesOrders
};

/**
 * TEMPORARY one-off seeding page for manual testing of the bulk "Generate draft
 * shipments" action on an already-seeded environment (e.g. a persistent preview
 * DB where seedDemoData won't re-run). Visit `/x/sales-order/seed-test` and click
 * the button to insert a backlog of ready-to-ship sales orders into the current
 * company. Safe to delete once testing is done.
 */

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, { view: "sales" });
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {
    create: "sales"
  });

  const serviceRole = getCarbonServiceRole();

  // Read the company's own reference data so we don't hardcode demo names.
  const [customers, items, location] = await Promise.all([
    serviceRole
      .from("customer")
      .select("id")
      .eq("companyId", companyId)
      .limit(5),
    serviceRole
      .from("item")
      .select("id, readableId, unitOfMeasureCode")
      .eq("companyId", companyId)
      .eq("type", "Part")
      .eq("active", true)
      .limit(5),
    serviceRole
      .from("location")
      .select("id")
      .eq("companyId", companyId)
      .order("name")
      .limit(1)
      .maybeSingle()
  ]);

  const customerIds = (customers.data ?? []).map((c) => c.id);
  const parts = items.data ?? [];
  const locationId = location.data?.id ?? null;

  if (customerIds.length === 0 || parts.length === 0) {
    return {
      ok: false,
      message:
        "Need at least one customer and one active Part item in this company first."
    };
  }

  const today = new Date();
  let created = 0;

  // 20 ready-to-ship + 2 draft (non-shippable) to exercise mixed selection.
  for (let i = 0; i < 22; i++) {
    const customerId = customerIds[i % customerIds.length]!;
    const part = parts[i % parts.length]!;
    const status = i < 20 ? "To Ship and Invoice" : "Draft";

    const seq = await getNextSequence(serviceRole, "salesOrder", companyId);
    if (seq.error || !seq.data) continue;
    const salesOrderId = seq.data as string;

    const orderDate = new Date(today);
    orderDate.setDate(orderDate.getDate() - (i % 30));

    const order = await serviceRole
      .from("salesOrder")
      .insert({
        salesOrderId,
        status: status as "To Ship and Invoice" | "Draft",
        currencyCode: "USD",
        customerId,
        customerReference: `PO-${4500 + i}`,
        orderDate: orderDate.toISOString().slice(0, 10),
        companyId,
        createdBy: userId
      })
      .select("id")
      .single();

    if (order.error || !order.data) continue;
    const orderId = order.data.id;

    await serviceRole.from("salesOrderLine").insert({
      salesOrderId: orderId,
      salesOrderLineType: "Part",
      itemId: part.id,
      description: part.readableId ?? "Test line",
      saleQuantity: 5 + ((i * 3) % 40),
      unitPrice: 100,
      unitOfMeasureCode: part.unitOfMeasureCode ?? "EA",
      companyId,
      createdBy: userId
    });

    await serviceRole
      .from("salesOrderShipment")
      .insert({ id: orderId, locationId, companyId });
    await serviceRole
      .from("salesOrderPayment")
      .insert({ id: orderId, companyId });

    created++;
  }

  return {
    ok: true,
    message: `Created ${created} sales orders (20 "To Ship and Invoice" + 2 "Draft").`
  };
}

export default function SeedTestOrdersRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <VStack spacing={4} className="p-8 max-w-xl">
      <Heading size="h3">Seed test sales orders</Heading>
      <p className="text-muted-foreground text-sm">
        Inserts 20 ready-to-ship (To Ship and Invoice) + 2 Draft sales orders
        into your current company so you can test the bulk “Generate draft
        shipments” action. Temporary testing helper.
      </p>
      <Form method="post">
        <Button
          type="submit"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          Create 22 test orders
        </Button>
      </Form>
      {actionData?.message && (
        <p className={actionData.ok ? "text-emerald-600" : "text-red-600"}>
          {actionData.message}
        </p>
      )}
    </VStack>
  );
}
