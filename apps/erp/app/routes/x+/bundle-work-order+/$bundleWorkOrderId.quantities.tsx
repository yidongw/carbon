import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import {
  getBundleWorkOrder,
  getJobOperationSupplierQuantities,
  getJobOperationsList,
  getProductionQuantities,
  getScrapReasons
} from "~/modules/production";
import { resolveQuantityCostVisibility } from "~/modules/production/quantityCostVisibility.server";
import { ProductionQuantitiesTable } from "~/modules/production/ui/Jobs";
import {
  mergeProductionQuantityListItems,
  partitionQuantityListFilters
} from "~/modules/production/ui/Jobs/unifiedQuantityFeeds";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
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

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const operations = await getJobOperationsList(client, jobId);
  if (operations.error) {
    throw redirect(
      path.to.bundleWorkOrderProcesses(bundleWorkOrderId),
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
      scrapReasons: [],
      jobId,
      canViewCosts: false
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

  const { canViewCosts, employee, supplier } =
    await resolveQuantityCostVisibility(
      userId,
      companyId,
      employeeQuantities.data ?? [],
      supplierQuantities.data ?? []
    );

  const merged = mergeProductionQuantityListItems(employee, supplier, sorts);

  return {
    count: (employeeQuantities.count ?? 0) + (supplierQuantities.count ?? 0),
    events: merged.slice(offset, offset + limit),
    operations: operations.data ?? [],
    scrapReasons: scrapReasons.data ?? [],
    jobId,
    canViewCosts
  };
}

export default function BundleWorkOrderQuantitiesRoute() {
  const { count, events, operations, scrapReasons, jobId, canViewCosts } =
    useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <ProductionQuantitiesTable
        data={events}
        count={count}
        operations={operations}
        scrapReasons={scrapReasons}
        jobId={jobId}
        canViewCosts={canViewCosts}
      />
    </VStack>
  );
}
