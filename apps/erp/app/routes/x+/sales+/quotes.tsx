import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getQuotes } from "~/modules/sales";
import { QuotesTable } from "~/modules/sales/ui/Quotes";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Quotes`,
  to: path.to.quotes
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

  const quotes = getQuotes(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    quotes
  };
}

export default function QuotesRoute() {
  const { quotes } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={quotes}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load quotes.</Trans>
            </div>
          }
        >
          {(quotes) => (
            <QuotesTable data={quotes.data ?? []} count={quotes.count ?? 0} />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
