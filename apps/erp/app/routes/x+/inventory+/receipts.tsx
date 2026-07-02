import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getReceipts, ReceiptsTable } from "~/modules/inventory";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Receipts`,
  to: path.to.receipts
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

  // Defer the heavy receipts query: the page navigates instantly and renders a
  // table skeleton while the rows stream in.
  const receipts = getReceipts(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    receipts
  };
}

export default function ReceiptsRoute() {
  const { receipts } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={receipts}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load receipts.</Trans>
            </div>
          }
        >
          {(receipts) => (
            <ReceiptsTable
              data={receipts.data ?? []}
              count={receipts.count ?? 0}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
