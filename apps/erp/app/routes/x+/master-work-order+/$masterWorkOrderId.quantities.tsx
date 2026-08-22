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

  // A garment master work order used to carry only its cutting operation, but it
  // can now also run fabric-prep operations (e.g. an outside dyeing op that must
  // finish before cutting). Surface EVERY master operation so the user can pick
  // which process to report a completion against — not just cutting.
  const cuttingOperationId = await getMasterCuttingOperationId(
    client,
    jobId,
    companyId
  );

  const masterOps = await client
    .from("jobOperation")
    .select("id, description")
    .eq("jobId", jobId)
    .eq("companyId", companyId)
    .order("order", { ascending: true });
  // Mark the cutting op so the table shows the translated "Cutting" label.
  const operations = (masterOps.data ?? []).map((op) => ({
    id: op.id,
    description: op.description,
    isCutting: op.id === cuttingOperationId
  }));
  if (operations.length === 0) {
    return { count: 0, events: [], operations: [], scrapReasons: [], jobId };
  }

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);
  const listQueryArgs = { search, sorts, filters };
  const operationIds = operations.map((op) => op.id);

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
