import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { getTrackedEntities } from "~/modules/inventory";
import TrackedEntitiesTable from "~/modules/inventory/ui/Traceability/TrackedEntitiesTable";
import { getCompanySettings } from "~/modules/settings";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Tracked Entities`,
  to: path.to.trackedEntities
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory",
    role: "employee"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [trackedEntities, companySettings] = await Promise.all([
    getTrackedEntities(client, companyId, {
      search,
      limit,
      offset,
      sorts,
      filters
    }),
    getCompanySettings(client, companyId)
  ]);

  if (trackedEntities.error) {
    throw redirect(
      path.to.inventoryQuantities,
      await flash(request, error(null, "Error loading tracked entities"))
    );
  }

  const inventoryShelfLife = companySettings.data?.inventoryShelfLife as {
    nearExpiryWarningDays?: number | null;
  } | null;

  // Derive each tracked entity's current warehouse/location from the item
  // ledger. `trackedEntity` has no spatial column — on-hand balance lives in
  // `itemLedger` as movement deltas. Summing quantity per
  // (entity, location, storageUnit) and keeping the bin with the highest
  // positive on-hand gives the representative location, mirroring the
  // convention in get_available_tracked_entities. Keyed by entity id.
  const entityIds = Array.from(
    new Set((trackedEntities.data ?? []).map((te) => te.id))
  );
  const entityLocations: Record<
    string,
    {
      locationName: string | null;
      warehouseName: string | null;
      storageUnitName: string | null;
    }
  > = {};
  if (entityIds.length > 0) {
    const ledger = await client
      .from("itemLedger")
      .select(
        "trackedEntityId, locationId, storageUnitId, quantity, location(name), storageUnit(name, warehouse(name))"
      )
      .eq("companyId", companyId)
      .in("trackedEntityId", entityIds);

    // Accumulate on-hand per (entity, location, storageUnit) bin.
    const bins = new Map<
      string,
      {
        entityId: string;
        onHand: number;
        locationName: string | null;
        warehouseName: string | null;
        storageUnitName: string | null;
      }
    >();
    for (const row of ledger.data ?? []) {
      const entityId = row.trackedEntityId;
      if (!entityId) continue;
      const key = `${entityId}|${row.locationId ?? ""}|${
        row.storageUnitId ?? ""
      }`;
      const existing = bins.get(key);
      const qty = row.quantity ?? 0;
      if (existing) {
        existing.onHand += qty;
      } else {
        const location = row.location as { name?: string | null } | null;
        const storageUnit = row.storageUnit as {
          name?: string | null;
          warehouse?: { name?: string | null } | null;
        } | null;
        bins.set(key, {
          entityId,
          onHand: qty,
          locationName: location?.name ?? null,
          warehouseName: storageUnit?.warehouse?.name ?? null,
          storageUnitName: storageUnit?.name ?? null
        });
      }
    }

    // Pick the bin with the most positive on-hand as the entity's location.
    const chosenOnHand: Record<string, number> = {};
    for (const bin of bins.values()) {
      if (bin.onHand <= 0) continue;
      const prev = chosenOnHand[bin.entityId];
      if (prev === undefined || bin.onHand > prev) {
        chosenOnHand[bin.entityId] = bin.onHand;
        entityLocations[bin.entityId] = {
          locationName: bin.locationName,
          warehouseName: bin.warehouseName,
          storageUnitName: bin.storageUnitName
        };
      }
    }
  }

  // Pull the shelf-life policy for every item that shows up in the table so
  // the Expiry trace popover can render the Policy step without an extra
  // round-trip per row. Keyed by itemId.
  const itemIds = Array.from(
    new Set(
      (trackedEntities.data ?? [])
        .map((te) => te.itemId)
        .filter((id): id is string => !!id)
    )
  );
  const shelfLifeRows =
    itemIds.length > 0
      ? await client
          .from("itemShelfLife")
          .select("itemId, mode, days, calculateFromBom")
          .in("itemId", itemIds)
      : {
          data: [] as {
            itemId: string;
            mode: string;
            days: number | null;
            calculateFromBom: boolean | null;
          }[]
        };
  const shelfLifePolicies: Record<
    string,
    {
      mode: string;
      days: number | null;
      calculateFromBom: boolean | null;
    }
  > = {};
  for (const row of shelfLifeRows.data ?? []) {
    if (row.itemId) {
      shelfLifePolicies[row.itemId] = {
        mode: row.mode,
        days: row.days ?? null,
        calculateFromBom: row.calculateFromBom ?? false
      };
    }
  }

  return {
    trackedEntities: trackedEntities.data ?? [],
    count: trackedEntities.count ?? 0,
    nearExpiryWarningDays: inventoryShelfLife?.nearExpiryWarningDays ?? null,
    shelfLifePolicies,
    entityLocations
  };
}

export default function TraceabilityRoute() {
  const {
    trackedEntities,
    count,
    nearExpiryWarningDays,
    shelfLifePolicies,
    entityLocations
  } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <TrackedEntitiesTable
        data={trackedEntities ?? []}
        count={count ?? 0}
        nearExpiryWarningDays={nearExpiryWarningDays ?? null}
        shelfLifePolicies={shelfLifePolicies ?? {}}
        entityLocations={entityLocations ?? {}}
      />
    </VStack>
  );
}
