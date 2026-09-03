import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { getBundleWorkOrder, getGarmentRfidCodes } from "~/modules/production";
import RfidCodesTable from "~/modules/production/ui/MasterWorkOrders/RfidCodesTable";
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

  const rfidCodes = await getGarmentRfidCodes(
    client,
    bundleWorkOrderId,
    companyId
  );

  return {
    rfidCodes: rfidCodes.data ?? [],
    count: rfidCodes.count ?? 0
  };
}

export default function BundleWorkOrderRfidCodesRoute() {
  const { rfidCodes, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <RfidCodesTable data={rfidCodes} count={count} />
    </VStack>
  );
}
