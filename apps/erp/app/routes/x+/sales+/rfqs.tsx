import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getSalesRFQs } from "~/modules/sales";
import { SalesRFQsTable } from "~/modules/sales/ui/SalesRFQ";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`RFQs`,
  to: path.to.salesRfqs
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

  const rfqs = getSalesRFQs(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    rfqs
  };
}

export default function RFQsRoute() {
  const { rfqs } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={rfqs}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load RFQs.</Trans>
            </div>
          }
        >
          {(rfqs) => (
            <SalesRFQsTable data={rfqs.data ?? []} count={rfqs.count ?? 0} />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
