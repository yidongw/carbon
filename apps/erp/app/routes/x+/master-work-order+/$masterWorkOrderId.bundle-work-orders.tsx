import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useParams } from "react-router";
import { useRouteData } from "~/hooks";
import { getBundleWorkOrdersList } from "~/modules/production";
import { BundleWorkOrdersTable } from "~/modules/production/ui/MasterWorkOrders";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) throw new Error("Could not find masterWorkOrderId");

  const searchParams = new URLSearchParams(new URL(request.url).search);
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const bundleWorkOrders = await getBundleWorkOrdersList(client, companyId, {
    search: searchParams.get("search"),
    masterWorkOrderId,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    count: bundleWorkOrders.count ?? 0,
    bundleWorkOrders: bundleWorkOrders.data ?? []
  };
}

export default function MasterWorkOrderBundleWorkOrdersRoute() {
  const { count, bundleWorkOrders } = useLoaderData<typeof loader>();
  const { masterWorkOrderId } = useParams();
  const layout = useRouteData<{
    jobId: string;
    cuttingOperationId: string | null;
  }>(path.to.masterWorkOrder(masterWorkOrderId ?? ""));

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <BundleWorkOrdersTable
        data={bundleWorkOrders}
        count={count}
        masterJobId={layout?.jobId}
        masterWorkOrderId={masterWorkOrderId}
        cuttingOperationId={layout?.cuttingOperationId ?? null}
      />
    </VStack>
  );
}
