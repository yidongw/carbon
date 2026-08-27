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
import type { CuttingStatus } from "~/modules/production/cuttingStatus";
import {
  cuttingStatuses,
  deriveCuttingStatus
} from "~/modules/production/cuttingStatus";
import { MasterWorkOrdersTable } from "~/modules/production/ui/MasterWorkOrders";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Master Work Orders`,
  to: path.to.masterWorkOrders,
  module: "production"
};

// Upper bound on masters scanned when the derived `cuttingStatus` filter is
// active (we must compute progress for each to know its status). Generous —
// real active-master counts sit well below this; a warning logs if it's hit.
const DERIVED_FILTER_SCAN_LIMIT = 1000;

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

  // `cuttingStatus` (Ready / Waiting / Cut) is derived in JS from cutting
  // progress — it is NOT a column on the masterWorkOrders view — so pull it out
  // of the DB filters and post-filter below. Everything else keeps filtering and
  // paginating server-side.
  const cuttingStatusFilter = (filters ?? []).find(
    (f) => f.column === "cuttingStatus"
  );
  const requestedCuttingStatuses = cuttingStatusFilter?.value
    ? cuttingStatusFilter.value
        .split(",")
        .filter((v): v is CuttingStatus =>
          (cuttingStatuses as readonly string[]).includes(v)
        )
    : [];
  const dbFilters = (filters ?? []).filter(
    (f) => f.column !== "cuttingStatus"
  );

  let rows: NonNullable<
    Awaited<ReturnType<typeof getMasterWorkOrders>>["data"]
  >;
  let count: number;
  let cuttingProgressByMasterId: Awaited<
    ReturnType<typeof getMasterCuttingProgress>
  >;

  if (requestedCuttingStatuses.length > 0) {
    // Derived filter active: scan the matching masters (server-filtered by the
    // remaining DB filters), compute cutting progress, keep only the requested
    // statuses, then paginate in JS. Bounded by DERIVED_FILTER_SCAN_LIMIT — the
    // heavier path only runs when this filter (e.g. a "Ready to cut" view) is on.
    const candidates = await getMasterWorkOrders(client, companyId, {
      search,
      sorts,
      filters: dbFilters,
      limit: DERIVED_FILTER_SCAN_LIMIT,
      offset: 0
    });
    if (candidates.error) {
      throw new Response(undefined, {
        status: 500,
        ...(await flash(
          request,
          error(candidates.error, "Failed to load master work orders")
        ))
      });
    }
    const candidateRows = candidates.data ?? [];
    if (candidateRows.length === DERIVED_FILTER_SCAN_LIMIT) {
      console.warn(
        `master-work-orders cuttingStatus filter scan hit the ${DERIVED_FILTER_SCAN_LIMIT}-row cap; some rows may be excluded`
      );
    }
    const progressAll = await getMasterCuttingProgress(
      client,
      candidateRows.map((r) => ({
        id: r.id,
        jobId: r.jobId,
        itemId: r.itemId,
        quantity: r.quantity
      })),
      companyId
    );
    const matched = candidateRows.filter((r) => {
      const status = deriveCuttingStatus(
        r.id ? progressAll[r.id] : undefined,
        r.quantity ?? 0
      );
      return status !== null && requestedCuttingStatuses.includes(status);
    });
    count = matched.length;
    rows = matched.slice(offset, offset + limit);
    cuttingProgressByMasterId = {};
    for (const r of rows) {
      const progress = r.id ? progressAll[r.id] : undefined;
      if (r.id && progress) cuttingProgressByMasterId[r.id] = progress;
    }
  } else {
    const masterWorkOrders = await getMasterWorkOrders(client, companyId, {
      search,
      limit,
      offset,
      sorts,
      filters: dbFilters
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

    rows = masterWorkOrders.data ?? [];
    count = masterWorkOrders.count ?? 0;
    cuttingProgressByMasterId = await getMasterCuttingProgress(
      client,
      rows.map((r) => ({
        id: r.id,
        jobId: r.jobId,
        itemId: r.itemId,
        quantity: r.quantity
      })),
      companyId
    );
  }
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

  return {
    count,
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
