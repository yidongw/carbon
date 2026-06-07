import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getCustomerStatuses, getCustomers } from "~/modules/sales";
import { CustomersTable } from "~/modules/sales/ui/Customers";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Customers`,
  to: path.to.customers
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "sales",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  // Statuses and tags are small/cheap — keep them blocking so filters render
  // immediately.
  const [customerStatuses, tags] = await Promise.all([
    getCustomerStatuses(client, companyId),
    getTagsList(client, companyId, "customer")
  ]);

  // Defer the heavy customers query: the page navigates instantly and renders a
  // table skeleton while the rows stream in.
  const customers = getCustomers(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    customers,
    customerStatuses: customerStatuses.data ?? [],
    tags: tags.data ?? []
  };
}

export default function SalesCustomersRoute() {
  const { customers, customerStatuses, tags } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={customers}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load customers.</Trans>
            </div>
          }
        >
          {(customers) => (
            <CustomersTable
              data={customers.data ?? []}
              count={customers.count ?? 0}
              customerStatuses={customerStatuses}
              tags={tags}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
