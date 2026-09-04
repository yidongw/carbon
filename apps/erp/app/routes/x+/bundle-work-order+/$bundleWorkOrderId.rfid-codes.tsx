import { requirePermissions } from "@carbon/auth/auth.server";
import { Button, VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { LuPrinter } from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useParams } from "react-router";
import { getBundleWorkOrder, getGarmentRfidCodes } from "~/modules/production";
import PrintCareLabelsModal from "~/modules/production/ui/MasterWorkOrders/PrintCareLabelsModal";
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
  const { t } = useLingui();
  const { rfidCodes, count } = useLoaderData<typeof loader>();
  const { bundleWorkOrderId } = useParams();
  const [isPrinting, setIsPrinting] = useState(false);

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <RfidCodesTable
        data={rfidCodes}
        count={count}
        primaryAction={
          <Button
            leftIcon={<LuPrinter />}
            variant="secondary"
            onClick={() => setIsPrinting(true)}
            isDisabled={count === 0}
          >
            {t`Print Care Labels`}
          </Button>
        }
      />
      {isPrinting && bundleWorkOrderId ? (
        <PrintCareLabelsModal
          bundleWorkOrderId={bundleWorkOrderId}
          onClose={() => setIsPrinting(false)}
        />
      ) : null}
    </VStack>
  );
}
