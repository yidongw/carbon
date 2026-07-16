import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useParams } from "react-router";
import { getBundleWorkOrder, getJobOperations } from "~/modules/production";
import { JobOperationsTable } from "~/modules/production/ui/Jobs";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

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
  if (bundleWorkOrder.error || !bundleWorkOrder.data?.jobId) {
    throw redirect(path.to.bundleWorkOrders);
  }
  const jobId = bundleWorkOrder.data.jobId;

  const searchParams = new URLSearchParams(new URL(request.url).search);
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const operations = await getJobOperations(client, jobId, {
    search: searchParams.get("search"),
    limit,
    offset,
    sorts,
    filters
  });

  return {
    operations: operations.data ?? [],
    count: operations.count ?? 0,
    jobId,
    jobStatus: bundleWorkOrder.data.status ?? ""
  };
}

export default function BundleWorkOrderProcessesRoute() {
  const { operations, count, jobId, jobStatus } =
    useLoaderData<typeof loader>();
  const { bundleWorkOrderId } = useParams();
  const { t } = useLingui();

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <JobOperationsTable
        data={operations}
        count={count}
        jobId={jobId}
        isPaused={jobStatus === "Paused"}
        title={t`Processes`}
        disableNavigation
        disableInlineEditing
        hideMes
        showAssignee
        quantitiesPath={
          bundleWorkOrderId
            ? path.to.bundleWorkOrderQuantities(bundleWorkOrderId)
            : undefined
        }
      />
    </VStack>
  );
}
