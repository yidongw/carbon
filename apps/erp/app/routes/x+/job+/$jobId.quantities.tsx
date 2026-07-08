import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useMount, VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { usePanels } from "~/components/Layout";
import {
  filterOperationsByIds,
  getJobOperationSupplierQuantities,
  getJobOperationsList,
  getProductionQuantities,
  getScrapReasons,
  getVisibleJobOperationIds
} from "~/modules/production";
import { ProductionQuantitiesTable } from "~/modules/production/ui/Jobs";
import {
  mergeProductionQuantityListItems,
  partitionQuantityListFilters
} from "~/modules/production/ui/Jobs/unifiedQuantityFeeds";
import { path, requestReferrer } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const { jobId } = params;
  if (!jobId) throw new Error("Could not find jobId");

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const operations = await getJobOperationsList(client, jobId);
  if (operations.error) {
    throw redirect(
      requestReferrer(request) ?? path.to.job(jobId),
      await flash(
        request,
        error(operations.error, "Failed to fetch job operations")
      )
    );
  }

  const visibleOperationIds = await getVisibleJobOperationIds(client, {
    companyId,
    jobId
  });
  if (visibleOperationIds.error) {
    throw redirect(
      requestReferrer(request) ?? path.to.job(jobId),
      await flash(
        request,
        error(visibleOperationIds.error, "Failed to fetch visible operations")
      )
    );
  }

  const filteredOperations = filterOperationsByIds(
    operations.data ?? [],
    visibleOperationIds.data
  );

  if (filteredOperations.length === 0) {
    return {
      count: 0,
      events: [],
      operations: [],
      scrapReasons: []
    };
  }

  const operationIds = filteredOperations.map((o) => o.id!);
  const listQueryArgs = { search, sorts, filters };

  const [{ getPendingSplitGroupsForJob }, { getStyleBundleExecutionState }] =
    await Promise.all([
      import("~/modules/production/splitBatch.service.server"),
      import("~/modules/production/styleBundleExecution.service.server")
    ]);

  const [
    employeeQuantities,
    supplierQuantities,
    scrapReasons,
    pendingGroups,
    styleBundleExecution
  ] = await Promise.all([
    getProductionQuantities(client, operationIds, {
      ...listQueryArgs,
      filters: partitionQuantityListFilters(filters, "employee")
    }),
    getJobOperationSupplierQuantities(client, operationIds, companyId, {
      ...listQueryArgs,
      filters: partitionQuantityListFilters(filters, "supplier")
    }),
    getScrapReasons(client, companyId),
    getPendingSplitGroupsForJob(client, { companyId, jobId }),
    getStyleBundleExecutionState(client, { companyId, jobId })
  ]);

  if (employeeQuantities.error) {
    throw redirect(
      path.to.productionDashboard,
      await flash(
        request,
        error(employeeQuantities.error, "Failed to fetch job events")
      )
    );
  }

  if (supplierQuantities.error) {
    throw redirect(
      path.to.productionDashboard,
      await flash(
        request,
        error(supplierQuantities.error, "Failed to fetch supplier quantities")
      )
    );
  }

  if (pendingGroups.error) {
    throw redirect(
      path.to.productionDashboard,
      await flash(
        request,
        error(pendingGroups.error, "Failed to fetch pending split groups")
      )
    );
  }

  if (styleBundleExecution.error) {
    throw redirect(
      path.to.productionDashboard,
      await flash(
        request,
        error(
          styleBundleExecution.error,
          "Failed to fetch bundle execution state"
        )
      )
    );
  }

  // Pagination is applied client-side after merging both sources: each query
  // returns all matching rows so the merged order is stable across pages.
  // OK at typical job-sized event counts (low hundreds); revisit if jobs
  // routinely exceed a few thousand quantity rows.
  const merged = mergeProductionQuantityListItems(
    employeeQuantities.data ?? [],
    supplierQuantities.data ?? [],
    sorts
  );

  return {
    count: (employeeQuantities.count ?? 0) + (supplierQuantities.count ?? 0),
    events: merged.slice(offset, offset + limit),
    operations: filteredOperations,
    scrapReasons: scrapReasons.data ?? [],
    showSplitAction: (pendingGroups.data?.length ?? 0) > 0,
    canCreateQuantities: true,
    bundleJobs: styleBundleExecution.data?.bundleJobs ?? [],
    styleSplitLocked:
      styleBundleExecution.data?.restrictParentToCuttingReporting ?? false
  };
}

export default function ProductionQuantitiesRoute() {
  const {
    count,
    events,
    operations,
    scrapReasons,
    showSplitAction,
    canCreateQuantities,
    bundleJobs,
    styleSplitLocked
  } = useLoaderData<typeof loader>();

  const { setIsExplorerCollapsed } = usePanels();

  useMount(() => {
    setIsExplorerCollapsed(true);
  });

  return (
    <>
      <VStack spacing={0} className="h-[calc(100dvh-99px)]">
        <ProductionQuantitiesTable
          data={events}
          count={count}
          operations={operations}
          scrapReasons={scrapReasons}
          showSplitAction={showSplitAction}
          canCreateQuantities={canCreateQuantities}
          bundleJobs={bundleJobs}
          styleSplitLocked={styleSplitLocked}
        />
      </VStack>
    </>
  );
}
