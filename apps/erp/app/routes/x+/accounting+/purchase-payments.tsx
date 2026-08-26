import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { getPurchasePayments } from "~/modules/accounting";
import { SupplierPaymentsTable } from "~/modules/accounting/ui/SupplierPayments";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Supplier Payments`,
  to: path.to.purchasePayments,
  module: "accounting"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "invoicing"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  return await getPurchasePayments(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });
}

export default function SupplierPaymentsRoute() {
  const { data, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <SupplierPaymentsTable data={data ?? []} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
