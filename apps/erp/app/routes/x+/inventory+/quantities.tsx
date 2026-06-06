import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { ResizablePanel, ResizablePanelGroup, VStack } from "@carbon/react";
import { pluckUnique } from "@carbon/utils";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, redirect, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import type { InventoryItem } from "~/modules/inventory";
import { getInventoryItems, getStorageTypesList } from "~/modules/inventory";
import InventoryTable from "~/modules/inventory/ui/Inventory/InventoryTable";
import {
  getMaterialFormsList,
  getMaterialSubstancesList
} from "~/modules/items";
import { getLocationsList } from "~/modules/resources";
import { getTagsList } from "~/modules/shared";
import { getUserDefaults } from "~/modules/users/users.server";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    view: "inventory",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  let locationId = searchParams.get("location");

  if (!locationId) {
    const userDefaults = await getUserDefaults(client, userId, companyId);
    if (userDefaults.error) {
      throw redirect(
        path.to.inventoryQuantities,
        await flash(
          request,
          error(userDefaults.error, "Failed to load default location")
        )
      );
    }

    locationId = userDefaults.data?.locationId ?? null;
  }

  if (!locationId) {
    const locations = await getLocationsList(client, companyId);
    if (locations.error || !locations.data?.length) {
      throw redirect(
        path.to.inventoryQuantities,
        await flash(
          request,
          error(locations.error, "Failed to load any locations")
        )
      );
    }
    locationId = locations.data?.[0].id as string;
  }

  // Cheap filter lookups feed the toolbar — keep them blocking.
  const [forms, substances, tags, storageTypes] = await Promise.all([
    getMaterialFormsList(client, companyId),
    getMaterialSubstancesList(client, companyId),
    getTagsList(client, companyId),
    getStorageTypesList(client, companyId)
  ]);

  const uniqueTags = pluckUnique(tags.data, (t) => t.name);

  // Defer the heavy inventory query: the page renders instantly and rows stream
  // into the skeleton. (The location is resolved above, so the query is scoped.)
  const inventoryItems = getInventoryItems(client, locationId, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    inventoryItems,
    locationId,
    forms: forms.data ?? [],
    substances: substances.data ?? [],
    tags: uniqueTags,
    storageTypes: storageTypes.data ?? []
  };
}

export default function QuantitiesRoute() {
  const { inventoryItems, locationId, forms, substances, tags, storageTypes } =
    useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full ">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={50}
          maxSize={70}
          minSize={25}
          className="bg-background"
        >
          <Suspense fallback={<TableSkeleton />}>
            <Await
              resolve={inventoryItems}
              errorElement={
                <div className="p-4 text-sm text-red-500">
                  <Trans>Failed to load inventory.</Trans>
                </div>
              }
            >
              {(inventoryItems) => (
                <InventoryTable
                  data={(inventoryItems.data ?? []) as InventoryItem[]}
                  count={inventoryItems.count ?? 0}
                  locationId={locationId}
                  forms={forms}
                  substances={substances}
                  tags={tags}
                  storageTypes={storageTypes}
                />
              )}
            </Await>
          </Suspense>
        </ResizablePanel>
        <Outlet />
      </ResizablePanelGroup>
    </VStack>
  );
}
