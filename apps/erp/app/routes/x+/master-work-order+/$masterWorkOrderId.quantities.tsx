import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import {
  getJobOperationSupplierQuantities,
  getMasterCuttingOperationId,
  getMasterWorkOrder,
  getProductionQuantities,
  getScrapReasons
} from "~/modules/production";
import { ProductionQuantitiesTable } from "~/modules/production/ui/Jobs";
import {
  mergeProductionQuantityListItems,
  partitionQuantityListFilters
} from "~/modules/production/ui/Jobs/unifiedQuantityFeeds";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) throw new Error("Could not find masterWorkOrderId");

  const master = await getMasterWorkOrder(client, masterWorkOrderId, companyId);
  if (master.error || !master.data?.jobId) {
    throw redirect(path.to.masterWorkOrders);
  }
  const jobId = master.data.jobId;

  const cuttingOperationId = await getMasterCuttingOperationId(
    client,
    jobId,
    companyId
  );
  if (!cuttingOperationId) {
    return { count: 0, events: [], operations: [], scrapReasons: [], jobId };
  }

  const cuttingOp = await client
    .from("jobOperation")
    .select("id, description")
    .eq("id", cuttingOperationId)
    .eq("companyId", companyId)
    .single();
  // A master work order reports only its cutting operation, so mark it as such
  // (the table shows a translated "Cutting" label instead of the raw name).
  const operations = cuttingOp.data
    ? [
        {
          id: cuttingOp.data.id,
          description: cuttingOp.data.description,
          isCutting: true
        }
      ]
    : [];

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);
  const listQueryArgs = { search, sorts, filters };
  const operationIds = [cuttingOperationId];

  const [employeeQuantities, supplierQuantities, scrapReasons] =
    await Promise.all([
      getProductionQuantities(client, operationIds, {
        ...listQueryArgs,
        filters: partitionQuantityListFilters(filters, "employee")
      }),
      getJobOperationSupplierQuantities(client, operationIds, companyId, {
        ...listQueryArgs,
        filters: partitionQuantityListFilters(filters, "supplier")
      }),
      getScrapReasons(client, companyId)
    ]);

  if (employeeQuantities.error) {
    throw redirect(
      path.to.masterWorkOrderProcesses(masterWorkOrderId),
      await flash(
        request,
        error(employeeQuantities.error, "Failed to fetch cutting completions")
      )
    );
  }
  if (supplierQuantities.error) {
    throw redirect(
      path.to.masterWorkOrderProcesses(masterWorkOrderId),
      await flash(
        request,
        error(supplierQuantities.error, "Failed to fetch supplier quantities")
      )
    );
  }

  const merged = mergeProductionQuantityListItems(
    employeeQuantities.data ?? [],
    supplierQuantities.data ?? [],
    sorts
  );

  return {
    count: (employeeQuantities.count ?? 0) + (supplierQuantities.count ?? 0),
    events: merged.slice(offset, offset + limit),
    operations,
    scrapReasons: scrapReasons.data ?? [],
    jobId
  };
}

export default function MasterWorkOrderQuantitiesRoute() {
  const { count, events, operations, scrapReasons, jobId } =
    useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <ProductionQuantitiesTable
        data={events}
        count={count}
        operations={operations}
        scrapReasons={scrapReasons}
        jobId={jobId}
      />
    </VStack>
  );
}
