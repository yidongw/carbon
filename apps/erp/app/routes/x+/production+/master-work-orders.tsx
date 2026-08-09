import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import {
  getItemIdsWithVariantQuantityGrid,
  getMasterCuttingProgress,
  getMasterWorkOrders
} from "~/modules/production";
import { MasterWorkOrdersTable } from "~/modules/production/ui/MasterWorkOrders";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Master Work Orders`,
  to: path.to.masterWorkOrders,
  module: "production"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const masterWorkOrders = await getMasterWorkOrders(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (masterWorkOrders.error) {
    throw new Response(undefined, {
      status: 500,
      ...(await flash(
        request,
        error(masterWorkOrders.error, "Failed to load master work orders")
      ))
    });
  }

  const rows = masterWorkOrders.data ?? [];
  const itemIds = [
    ...new Set(
      rows.map((r) => r.itemId).filter((id): id is string => Boolean(id))
    )
  ];
  const masterIds = rows
    .map((r) => r.id)
    .filter((id): id is string => Boolean(id));

  const [itemIdsWithConfigurationParameters, bundleRows] = await Promise.all([
    getItemIdsWithVariantQuantityGrid(client, companyId, itemIds),
    masterIds.length > 0
      ? client
          .from("bundleWorkOrders")
          .select("masterWorkOrderId, jobId")
          .eq("companyId", companyId)
          .in("masterWorkOrderId", masterIds)
      : Promise.resolve({
          data: [] as {
            masterWorkOrderId: string | null;
            jobId: string | null;
          }[]
        })
  ]);

  const bundleCountByMasterId: Record<string, number> = {};
  for (const { masterWorkOrderId } of bundleRows.data ?? []) {
    if (!masterWorkOrderId) continue;
    bundleCountByMasterId[masterWorkOrderId] =
      (bundleCountByMasterId[masterWorkOrderId] ?? 0) + 1;
  }

  // Total processes per master = distinct operation descriptions on the master
  // job's own operations (matches the master Processes tab breakdown, and shows
  // before the master is split into bundles).
  const masterIdByMasterJobId: Record<string, string> = {};
  const masterJobIds: string[] = [];
  for (const r of rows) {
    if (r.jobId && r.id) {
      masterIdByMasterJobId[r.jobId] = r.id;
      masterJobIds.push(r.jobId);
    }
  }
  const processDescByMasterId: Record<string, Set<string>> = {};
  if (masterJobIds.length > 0) {
    const ops = await client
      .from("jobOperation")
      .select("jobId, description")
      .in("jobId", masterJobIds)
      .eq("companyId", companyId);
    for (const op of ops.data ?? []) {
      const masterId = op.jobId ? masterIdByMasterJobId[op.jobId] : undefined;
      if (!masterId) continue;
      (processDescByMasterId[masterId] ??= new Set()).add(
        op.description ?? "—"
      );
    }
  }
  const processCountByMasterId: Record<string, number> = {};
  for (const [masterId, descriptions] of Object.entries(
    processDescByMasterId
  )) {
    processCountByMasterId[masterId] = descriptions.size;
  }

  const cuttingProgressByMasterId = await getMasterCuttingProgress(
    client,
    rows.map((r) => ({
      id: r.id,
      jobId: r.jobId,
      itemId: r.itemId,
      quantity: r.quantity
    })),
    companyId
  );

  return {
    count: masterWorkOrders.count ?? 0,
    masterWorkOrders: rows,
    itemIdsWithConfigurationParameters,
    bundleCountByMasterId,
    processCountByMasterId,
    cuttingProgressByMasterId
  };
}

export default function MasterWorkOrdersRoute() {
  const {
    count,
    masterWorkOrders,
    itemIdsWithConfigurationParameters,
    bundleCountByMasterId,
    processCountByMasterId,
    cuttingProgressByMasterId
  } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <MasterWorkOrdersTable
        data={masterWorkOrders}
        count={count}
        itemIdsWithConfigurationParameters={itemIdsWithConfigurationParameters}
        bundleCountByMasterId={bundleCountByMasterId}
        processCountByMasterId={processCountByMasterId}
        cuttingProgressByMasterId={cuttingProgressByMasterId}
      />
      <Outlet />
    </VStack>
  );
}
