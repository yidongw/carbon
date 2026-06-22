import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { getCompanyJobOperationPickups, getItemIdsWithConfigurationParameters } from "~/modules/production";
import { getItemInternalId } from "~/modules/production/productionQuantityDisplay.utils";
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

  const pickups = await getCompanyJobOperationPickups(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (pickups.error) {
    throw error(pickups.error, "Failed to fetch production pickups");
  }

  const pickupRows = pickups.data ?? [];
  const itemIds = [
    ...new Set(
      pickupRows
        .map((pickup) => getItemInternalId(pickup))
        .filter((id): id is string => Boolean(id))
    )
  ];
  const configurableItemIds = await getItemIdsWithConfigurationParameters(
    client,
    companyId,
    itemIds
  );

  return {
    count: pickups.count ?? 0,
    pickups: pickupRows,
    configurableItemIds
  };
}

export default function PickupsRoute() {
  const { count, pickups, configurableItemIds } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <PickupsTable
        data={pickups}
        count={count}
        configurableItemIds={configurableItemIds}
      />
      <Outlet />
    </VStack>
  );
}
