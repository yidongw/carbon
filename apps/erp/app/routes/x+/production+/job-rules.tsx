import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useLocation } from "react-router";
import { getJobAssignmentRules } from "~/modules/people";
import { JobRulesTable } from "~/modules/production/ui/JobRules";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Assignment Rules`,
  to: path.to.jobRules
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const rules = await getJobAssignmentRules(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    rules: rules.data ?? [],
    count: rules.count ?? 0
  };
}

export default function JobRulesRoute() {
  const { rules, count } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  if (pathname === path.to.jobRulesSimulate) {
    return <Outlet />;
  }

  return (
    <VStack spacing={0} className="h-full">
      <JobRulesTable data={rules as any} count={count} />
      <Outlet />
    </VStack>
  );
}
