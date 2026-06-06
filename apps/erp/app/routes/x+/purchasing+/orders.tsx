import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getPurchaseOrders } from "~/modules/purchasing";
import { PurchaseOrdersTable } from "~/modules/purchasing/ui/PurchaseOrder";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Orders`,
  to: path.to.purchaseOrders
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "purchasing",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const purchasOrders = getPurchaseOrders(client, companyId, {
    search,
    status,
    supplierId,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    purchasOrders
  };
}

export default function PurchaseOrdersSearchRoute() {
  const { purchasOrders } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={purchasOrders}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load purchase orders.</Trans>
            </div>
          }
        >
          {(purchasOrders) => (
            <PurchaseOrdersTable
              data={purchasOrders.data ?? []}
              count={purchasOrders.count ?? 0}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
