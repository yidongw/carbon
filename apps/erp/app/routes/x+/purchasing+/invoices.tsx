import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import {
  getPurchaseInvoices,
  PurchaseInvoicesTable
} from "~/modules/invoicing";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Invoices`,
  to: path.to.purchaseInvoices
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "invoicing"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const purchaseInvoices = getPurchaseInvoices(client, companyId, {
    search,
    supplierId,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    purchaseInvoices
  };
}

export default function PurchaseInvoicesSearchRoute() {
  const { purchaseInvoices } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={purchaseInvoices}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load purchase invoices.</Trans>
            </div>
          }
        >
          {(purchaseInvoices) => (
            <PurchaseInvoicesTable
              data={purchaseInvoices.data ?? []}
              count={purchaseInvoices.count ?? 0}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
