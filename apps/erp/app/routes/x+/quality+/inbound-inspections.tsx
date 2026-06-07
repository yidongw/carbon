import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getInboundInspections } from "~/modules/quality";
import InboundInspectionsTable from "~/modules/quality/ui/InboundInspections/InboundInspectionsTable";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Inbound Inspections`,
  to: path.to.inboundInspections
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "quality",
    role: "employee"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const inspections = getInboundInspections(client, companyId, {
    search,
    status,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    inspections
  };
}

export default function InboundInspectionsRoute() {
  const { inspections } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={inspections}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load inspections.</Trans>
            </div>
          }
        >
          {(inspections) => (
            <InboundInspectionsTable
              data={inspections.data ?? []}
              count={inspections.count ?? 0}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
