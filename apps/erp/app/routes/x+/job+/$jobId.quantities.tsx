import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useMount, VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { usePanels } from "~/components/Layout";
import {
  getJobOperationSupplierQuantities,
  getJobOperationsList,
  getProductionQuantities,
  getScrapReasons
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

  if (operations.data?.length === 0) {
    return {
      count: 0,
      events: [],
      operations: [],
      scrapReasons: []
    };
  }

  const operationIds = operations.data?.map((o) => o.id) ?? [];
  const listQueryArgs = { search, sorts, filters };

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
    operations: operations.data ?? [],
    scrapReasons: scrapReasons.data ?? []
  };
}

export default function ProductionQuantitiesRoute() {
  const { count, events, operations, scrapReasons } =
    useLoaderData<typeof loader>();

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
        />
      </VStack>
      <Outlet />
    </>
  );
}
