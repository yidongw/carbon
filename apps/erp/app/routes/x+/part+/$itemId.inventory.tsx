import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { VStack } from "@carbon/react";
import { pluckUnique } from "@carbon/utils";
import { Suspense } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData } from "react-router";
import { useStorageUnits } from "~/components/Form/StorageUnit";
import { useRouteData } from "~/hooks";
import {
  getTrackedEntityExpirations,
  InventoryDetails
} from "~/modules/inventory";
import type { PartSummary, UnitOfMeasureListItem } from "~/modules/items";
import {
  getBomHasShelfLifeManagedInput,
  getItemQuantities,
  getItemShelfLife,
  getItemStorageUnitQuantities,
  getPickMethod,
  pickMethodWithShelfLifeValidator,
  type shelfLifeModes,
  upsertPickMethod,
  upsertPickMethodWithShelfLife
} from "~/modules/items";
import { getItemRulesDataForItem } from "~/modules/items/itemRules.server";
import { PickMethodForm } from "~/modules/items/ui/Item";
import ItemRuleAssignments from "~/modules/items/ui/ItemRules/ItemRuleAssignments";
import { getLocationsList } from "~/modules/resources";
import { getUserDefaults } from "~/modules/users/users.server";
import { getDatabaseClient } from "~/services/database.server";
import { useItems } from "~/stores";
import type { ListItem } from "~/types";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    view: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const inventoryData = (async () => {
    let locationId = searchParams.get("location");

    if (!locationId) {
      const userDefaults = await getUserDefaults(client, userId, companyId);
      if (userDefaults.error) return null;
      locationId = userDefaults.data?.locationId ?? null;
    }

    if (!locationId) {
      const locations = await getLocationsList(client, companyId);
      if (locations.error || !locations.data?.length) return null;
      locationId = locations.data[0].id as string;
    }

    let partInventory = await getPickMethod(
      client,
      itemId,
      companyId,
      locationId
    );

    if (partInventory.error || !partInventory.data) {
      const insertPickMethod = await upsertPickMethod(client, {
        itemId,
        companyId,
        locationId,
        customFields: {},
        createdBy: userId
      });
      if (insertPickMethod.error) return null;

      partInventory = await getPickMethod(client, itemId, companyId, locationId);
      if (partInventory.error || !partInventory.data) return null;
    }

    const [
      quantities,
      itemStorageUnitQuantities,
      shelfLife,
      bomHasShelfLifeManagedInput,
      rulesData
    ] = await Promise.all([
      getItemQuantities(client, itemId, companyId, locationId),
      getItemStorageUnitQuantities(client, itemId, companyId, locationId),
      getItemShelfLife(client, itemId),
      getBomHasShelfLifeManagedInput(client, itemId, companyId),
      getItemRulesDataForItem(client, itemId, companyId)
    ]);

    if (quantities.error || !itemStorageUnitQuantities.data) return null;

    const trackedEntityIds = pluckUnique(
      itemStorageUnitQuantities.data,
      (row) => row.trackedEntityId
    );
    const trackedEntityExpirations = await getTrackedEntityExpirations(
      client,
      trackedEntityIds
    );

    return {
      partInventory: partInventory.data,
      itemStorageUnitQuantities: itemStorageUnitQuantities.data,
      quantities: quantities.data,
      shelfLife: shelfLife.data,
      bomHasShelfLifeManagedInput,
      trackedEntityExpirations,
      itemId,
      locationId,
      ruleAssignments: rulesData.assignments,
      ruleLibrary: rulesData.library
    };
  })();

  return { inventoryData };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const validation = await validator(pickMethodWithShelfLifeValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    shelfLifeMode,
    shelfLifeDays,
    shelfLifeTriggerProcessId,
    shelfLifeTriggerTiming,
    shelfLifeCalculateFromBom,
    ...pickMethodFields
  } = validation.data;

  try {
    await upsertPickMethodWithShelfLife(getDatabaseClient(), {
      itemId,
      locationId: pickMethodFields.locationId,
      defaultStorageUnitId: pickMethodFields.defaultStorageUnitId,
      customFields: setCustomFields(formData),
      userId,
      shelfLife: {
        mode: shelfLifeMode,
        days: shelfLifeDays,
        triggerProcessId: shelfLifeTriggerProcessId,
        triggerTiming: shelfLifeTriggerTiming,
        calculateFromBom: shelfLifeCalculateFromBom
      }
    });
  } catch (err) {
    throw redirect(
      path.to.part(itemId),
      await flash(request, error(err, "Failed to update part inventory"))
    );
  }

  throw redirect(
    path.to.partInventoryLocation(itemId, pickMethodFields.locationId),
    await flash(request, success("Updated part inventory"))
  );
}

type InventoryResolved = NonNullable<
  Awaited<ReturnType<typeof loader>>["inventoryData"]
>;

function InventoryContent({
  resolved,
  locations
}: {
  resolved: InventoryResolved;
  locations: ListItem[];
}) {
  const {
    partInventory,
    itemStorageUnitQuantities,
    quantities,
    shelfLife,
    bomHasShelfLifeManagedInput,
    trackedEntityExpirations,
    itemId,
    ruleAssignments,
    ruleLibrary
  } = resolved;

  const partData = useRouteData<{ partSummary: PartSummary }>(
    path.to.part(itemId)
  );
  const itemUnitOfMeasureCode = partData?.partSummary?.unitOfMeasureCode;

  const [items] = useItems();
  const item = items.find((i) => i.id === itemId);
  const itemTrackingType = item?.itemTrackingType;
  const replenishmentSystem = item?.replenishmentSystem ?? null;

  const storageUnits = useStorageUnits(partInventory?.locationId);

  const initialValues = {
    ...partInventory,
    defaultStorageUnitId: partInventory.defaultStorageUnitId ?? undefined,
    shelfLifeMode: shelfLife?.mode as
      | (typeof shelfLifeModes)[number]
      | undefined,
    shelfLifeDays: shelfLife?.days ?? undefined,
    shelfLifeTriggerProcessId: shelfLife?.triggerProcessId ?? undefined,
    shelfLifeTriggerTiming: shelfLife?.triggerTiming ?? undefined,
    shelfLifeCalculateFromBom: shelfLife?.calculateFromBom ?? false,
    ...getCustomFields(partInventory.customFields ?? {})
  };

  return (
    <>
      <PickMethodForm
        key={`${initialValues.itemId}-${itemTrackingType ?? "Inventory"}`}
        initialValues={initialValues}
        locations={locations}
        storageUnits={storageUnits.options}
        type="Part"
        itemTrackingType={itemTrackingType ?? "Inventory"}
        replenishmentSystem={replenishmentSystem}
        bomHasShelfLifeManagedInput={bomHasShelfLifeManagedInput}
      />
      <InventoryDetails
        itemStorageUnitQuantities={itemStorageUnitQuantities}
        itemUnitOfMeasureCode={itemUnitOfMeasureCode ?? "EA"}
        itemTrackingType={itemTrackingType ?? "Inventory"}
        itemShelfLife={shelfLife ?? null}
        trackedEntityExpirations={trackedEntityExpirations}
        pickMethod={initialValues}
        quantities={quantities}
        storageUnits={storageUnits.options}
      />
      <ItemRuleAssignments
        itemId={itemId}
        assignments={ruleAssignments as never}
        library={ruleLibrary as never}
      />
    </>
  );
}

export default function PartInventoryRoute() {
  const sharedPartsData = useRouteData<{
    locations: ListItem[];
    unitOfMeasures: UnitOfMeasureListItem[];
  }>(path.to.partRoot);

  const { inventoryData } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={2} className="p-2">
      <Suspense
        fallback={
          <div className="space-y-3 animate-pulse">
            <div className="h-64 bg-muted rounded-md" />
            <div className="h-48 bg-muted rounded-md" />
          </div>
        }
      >
        <Await resolve={inventoryData}>
          {(resolved) =>
            resolved ? (
              <InventoryContent
                resolved={resolved}
                locations={sharedPartsData?.locations ?? []}
              />
            ) : null
          }
        </Await>
      </Suspense>
    </VStack>
  );
}
