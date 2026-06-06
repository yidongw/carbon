import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getWarehouseTransfers } from "~/modules/inventory";
import WarehouseTransfersTable from "~/modules/inventory/ui/WarehouseTransfers/WarehouseTransfersTable";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Warehouse Transfers`,
  to: path.to.warehouseTransfers
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  // Defer the heavy warehouse transfers query: the page navigates instantly
  // and renders a table skeleton while the rows stream in.
  const warehouseTransfers = getWarehouseTransfers(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    warehouseTransfers
  };
}

export default function WarehouseTransfersRoute() {
  const { warehouseTransfers } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={warehouseTransfers}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load warehouse transfers.</Trans>
            </div>
          }
        >
          {(warehouseTransfers) => (
            <WarehouseTransfersTable
              data={warehouseTransfers.data ?? []}
              count={warehouseTransfers.count ?? 0}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
