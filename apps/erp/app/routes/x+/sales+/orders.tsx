import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getSalesOrders } from "~/modules/sales";
import { SalesOrdersTable } from "~/modules/sales/ui/SalesOrder";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Orders`,
  to: path.to.salesOrders
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "sales",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const customerId = searchParams.get("customerId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const salesOrders = getSalesOrders(client, companyId, {
    search,
    status,
    customerId,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    salesOrders
  };
}

export default function SalesOrdersSearchRoute() {
  const { salesOrders } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={salesOrders}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load sales orders.</Trans>
            </div>
          }
        >
          {(salesOrders) => (
            <SalesOrdersTable
              data={salesOrders.data ?? []}
              count={salesOrders.count ?? 0}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
