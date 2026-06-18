import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { ApplicationsTable } from "~/modules/users";
import { getMembershipApplications } from "~/modules/users/invite-links.service";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Applications`,
  to: path.to.peopleApplications
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "users",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status") ?? "pending";
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const applications = await getMembershipApplications(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters,
    status
  });

  if (applications.error) {
    throw redirect(
      path.to.people,
      await flash(
        request,
        error(applications.error, "Failed to load applications")
      )
    );
  }

  return {
    applications: applications.data ?? [],
    count: applications.count ?? 0
  };
}

export default function Route() {
  const { applications, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <ApplicationsTable data={applications} count={count} />
      <Outlet />
    </VStack>
  );
}
