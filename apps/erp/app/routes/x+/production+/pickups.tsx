import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getJobOperationPickups } from "~/modules/production";
import { PickupsTable } from "~/modules/production/ui/Pickups";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Pickups`,
  to: path.to.pickups
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const pickups = await getJobOperationPickups(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (pickups.error) {
    redirect(
      path.to.productionDashboard,
      await flash(
        request,
        error(pickups.error, "Failed to fetch production pickups")
      )
    );
  }

  return {
    count: pickups.count ?? 0,
    pickups: pickups.data ?? []
  };
}

export default function PickupsRoute() {
  const { count, pickups } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <PickupsTable data={pickups} count={count} />
      <Outlet />
    </VStack>
  );
}
