import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { getMasterWorkOrders } from "~/modules/production";
import { MasterWorkOrdersTable } from "~/modules/production/ui/MasterWorkOrders";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Master Work Orders`,
  to: path.to.masterWorkOrders,
  module: "production"
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

  const masterWorkOrders = await getMasterWorkOrders(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (masterWorkOrders.error) {
    throw new Response(undefined, {
      status: 500,
      ...(await flash(
        request,
        error(masterWorkOrders.error, "Failed to load master work orders")
      ))
    });
  }

  return {
    count: masterWorkOrders.count ?? 0,
    masterWorkOrders: masterWorkOrders.data ?? []
  };
}

export default function MasterWorkOrdersRoute() {
  const { count, masterWorkOrders } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <MasterWorkOrdersTable data={masterWorkOrders} count={count} />
      <Outlet />
    </VStack>
  );
}
