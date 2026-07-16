import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { getBundleWorkOrdersList } from "~/modules/production";
import { BundleWorkOrdersTable } from "~/modules/production/ui/MasterWorkOrders";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Bundle Work Orders`,
  to: path.to.bundleWorkOrders,
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

  const bundleWorkOrders = await getBundleWorkOrdersList(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (bundleWorkOrders.error) {
    throw new Response(undefined, {
      status: 500,
      ...(await flash(
        request,
        error(bundleWorkOrders.error, "Failed to load bundle work orders")
      ))
    });
  }

  return {
    count: bundleWorkOrders.count ?? 0,
    bundleWorkOrders: bundleWorkOrders.data ?? []
  };
}

export default function BundleWorkOrdersRoute() {
  const { count, bundleWorkOrders } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <BundleWorkOrdersTable data={bundleWorkOrders} count={count} />
      <Outlet />
    </VStack>
  );
}
