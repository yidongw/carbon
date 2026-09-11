import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import {
  getBundleInventoryMovements,
  getBundleWorkOrder
} from "~/modules/production";
import BundleInventoryMovementsTable from "~/modules/production/ui/MasterWorkOrders/BundleInventoryMovementsTable";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { bundleWorkOrderId } = params;
  if (!bundleWorkOrderId) throw new Error("Could not find bundleWorkOrderId");

  const bundleWorkOrder = await getBundleWorkOrder(
    client,
    bundleWorkOrderId,
    companyId
  );
  if (bundleWorkOrder.error || !bundleWorkOrder.data?.id) {
    throw redirect(path.to.bundleWorkOrders);
  }

  const movements = await getBundleInventoryMovements(
    client,
    bundleWorkOrderId,
    companyId
  );

  return {
    movements: movements.data ?? [],
    count: movements.count ?? 0
  };
}

export default function BundleWorkOrderInventoryRoute() {
  const { movements, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <BundleInventoryMovementsTable data={movements} count={count} />
    </VStack>
  );
}
