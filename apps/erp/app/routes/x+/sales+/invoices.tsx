import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getSalesInvoices } from "~/modules/invoicing";
import SalesInvoicesTable from "~/modules/invoicing/ui/SalesInvoice/SalesInvoicesTable";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Invoices`,
  to: path.to.salesInvoices
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "invoicing"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const customerId = searchParams.get("customerId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const salesInvoices = getSalesInvoices(client, companyId, {
    search,
    customerId,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    salesInvoices
  };
}

export default function SalesInvoicesSearchRoute() {
  const { salesInvoices } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={salesInvoices}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load sales invoices.</Trans>
            </div>
          }
        >
          {(salesInvoices) => (
            <SalesInvoicesTable
              data={salesInvoices.data ?? []}
              count={salesInvoices.count ?? 0}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
