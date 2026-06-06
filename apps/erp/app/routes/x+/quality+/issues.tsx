import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getIssues, getIssueTypesList } from "~/modules/quality";
import IssuesTable from "~/modules/quality/ui/Issue/IssuesTable";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Issues`,
  to: path.to.issues
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "quality",
    role: "employee"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const nonConformanceTypes = await getIssueTypesList(client, companyId);

  const issues = getIssues(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    issues,
    types: nonConformanceTypes.data ?? []
  };
}

export default function IssuesRoute() {
  const { issues, types } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={issues}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load issues.</Trans>
            </div>
          }
        >
          {(issues) => (
            <IssuesTable
              data={issues.data ?? []}
              count={issues.count ?? 0}
              types={types}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
