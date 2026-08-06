import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { getStorageRulesDataForTarget } from "@carbon/ee/storage-rules.server";
import { validationError, validator } from "@carbon/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VStack
} from "@carbon/react";
import { pluckUnique } from "@carbon/utils";
import { Trans } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { useStorageUnits } from "~/components/Form/StorageUnit";
import { useRouteData } from "~/hooks";
import {
  getTrackedEntityExpirations,
  InventoryDetails
} from "~/modules/inventory";
import type { UnitOfMeasureListItem } from "~/modules/items";
import {
  getBomHasShelfLifeManagedInput,
  getItemQuantities,
  getItemShelfLife,
  getItemStorageUnitQuantities,
  getItemVariantQuantities,
  getPickMethod,
  pickMethodWithShelfLifeValidator,
  type shelfLifeModes,
  upsertPickMethod,
  upsertPickMethodWithShelfLife
} from "~/modules/items";
import { PickMethodForm } from "~/modules/items/ui/Item";
import { getLocationsList } from "~/modules/resources";
import RuleAssignmentsList from "~/modules/storageRules/ui/RuleAssignmentsList";
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
  let locationId = new URLSearchParams(url.search).get("location");

  if (!locationId) {
    const userDefaults = await getUserDefaults(client, userId, companyId);
    if (userDefaults.error) {
      throw redirect(
        path.to.style(itemId),
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
        path.to.style(itemId),
        await flash(
          request,
          error(locations.error, "Failed to load any locations")
        )
      );
    }
    locationId = locations.data[0].id;
  }

  let styleInventory = await getPickMethod(
    client,
    itemId,
    companyId,
    locationId
  );
  if (styleInventory.error || !styleInventory.data) {
    const insertPickMethod = await upsertPickMethod(client, {
      itemId,
      companyId,
      locationId,
      customFields: {},
      createdBy: userId
    });

    if (insertPickMethod.error) {
      throw redirect(
        path.to.style(itemId),
        await flash(
          request,
          error(insertPickMethod.error, "Failed to insert style inventory")
        )
      );
    }

    styleInventory = await getPickMethod(client, itemId, companyId, locationId);
    if (styleInventory.error || !styleInventory.data) {
      throw redirect(
        path.to.style(itemId),
        await flash(
          request,
          error(styleInventory.error, "Failed to load style inventory")
        )
      );
    }
  }

  const [
    quantities,
    itemStorageUnitQuantities,
    shelfLife,
    bomHasShelfLifeManagedInput,
    rulesData,
    variantQuantities
  ] = await Promise.all([
    getItemQuantities(client, itemId, companyId, locationId),
    getItemStorageUnitQuantities(client, itemId, companyId, locationId),
    getItemShelfLife(client, itemId),
    getBomHasShelfLifeManagedInput(client, itemId, companyId),
    getStorageRulesDataForTarget(client, {
      targetType: "item",
      targetId: itemId,
      companyId
    }),
    getItemVariantQuantities(client, itemId, companyId, locationId)
  ]);

  if (quantities.error) {
    throw redirect(
      path.to.items,
      await flash(request, error(quantities, "Failed to load style quantities"))
    );
  }

  if (itemStorageUnitQuantities.error || !itemStorageUnitQuantities.data) {
    throw redirect(
      path.to.items,
      await flash(
        request,
        error(itemStorageUnitQuantities, "Failed to load style quantities")
      )
    );
  }

  const trackedEntityIds = pluckUnique(
    itemStorageUnitQuantities.data,
    (row) => row.trackedEntityId
  );
  const trackedEntityExpirations = await getTrackedEntityExpirations(
    client,
    trackedEntityIds
  );

  return {
    styleInventory: styleInventory.data,
    itemStorageUnitQuantities: itemStorageUnitQuantities.data,
    quantities: quantities.data,
    variantQuantities: variantQuantities.data ?? [],
    shelfLife: shelfLife.data,
    bomHasShelfLifeManagedInput,
    trackedEntityExpirations,
    itemId,
    locationId,
    ruleAssignments: rulesData.assignments,
    ruleLibrary: rulesData.library
  };
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
      sortMethod: pickMethodFields.sortMethod,
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
      path.to.style(itemId),
      await flash(request, error(err, "Failed to update style inventory"))
    );
  }

  throw redirect(
    path.to.styleInventoryLocation(itemId, pickMethodFields.locationId),
    await flash(request, success("Updated style inventory"))
  );
}

export default function StyleInventoryRoute() {
  const sharedStylesData = useRouteData<{
    locations: ListItem[];
    unitOfMeasures: UnitOfMeasureListItem[];
  }>(path.to.styleRoot);

  const {
    styleInventory,
    itemStorageUnitQuantities,
    quantities,
    variantQuantities,
    shelfLife,
    bomHasShelfLifeManagedInput,
    trackedEntityExpirations,
    itemId,
    ruleAssignments,
    ruleLibrary
  } = useLoaderData<typeof loader>();

  const styleData = useRouteData<{
    styleSummary: {
      unitOfMeasureCode: string | null;
    };
  }>(path.to.style(itemId));
  if (!styleData) throw new Error("Could not find style data");

  const initialValues = {
    ...styleInventory,
    defaultStorageUnitId: styleInventory.defaultStorageUnitId ?? undefined,
    shelfLifeMode: shelfLife?.mode as
      | (typeof shelfLifeModes)[number]
      | undefined,
    shelfLifeDays: shelfLife?.days ?? undefined,
    shelfLifeTriggerProcessId: shelfLife?.triggerProcessId ?? undefined,
    shelfLifeTriggerTiming: shelfLife?.triggerTiming ?? undefined,
    shelfLifeCalculateFromBom: shelfLife?.calculateFromBom ?? false,
    ...getCustomFields(styleInventory.customFields ?? {})
  };

  const [items] = useItems();
  const item = items.find((currentItem) => currentItem.id === itemId);
  const itemTrackingType = item?.itemTrackingType;
  const replenishmentSystem = item?.replenishmentSystem ?? null;
  const storageUnits = useStorageUnits(styleInventory.locationId);

  return (
    <VStack spacing={2} className="p-2">
      <PickMethodForm
        key={`${initialValues.itemId}-${itemTrackingType ?? "Inventory"}`}
        initialValues={initialValues}
        locations={sharedStylesData?.locations ?? []}
        storageUnits={storageUnits.options}
        type="Style"
        itemTrackingType={itemTrackingType ?? "Inventory"}
        replenishmentSystem={replenishmentSystem}
        bomHasShelfLifeManagedInput={bomHasShelfLifeManagedInput}
      />
      <InventoryDetails
        itemStorageUnitQuantities={itemStorageUnitQuantities}
        itemUnitOfMeasureCode={styleData.styleSummary.unitOfMeasureCode ?? "EA"}
        itemTrackingType={itemTrackingType ?? "Inventory"}
        itemShelfLife={shelfLife ?? null}
        trackedEntityExpirations={trackedEntityExpirations}
        pickMethod={initialValues}
        quantities={quantities}
        storageUnits={storageUnits.options}
      />
      {variantQuantities.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>SKU quantities</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">
                      <Trans>SKU</Trans>
                    </th>
                    <th className="py-2 pr-4">
                      <Trans>On hand</Trans>
                    </th>
                    <th className="py-2">
                      <Trans>Available</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variantQuantities.map(
                    (row: {
                      variantItemId: string;
                      readableId: string;
                      active?: boolean;
                      quantities: {
                        quantityOnHand?: number;
                        quantityAvailable?: number;
                      } | null;
                    }) => (
                      <tr
                        key={row.variantItemId}
                        className={
                          row.active === false
                            ? "border-b text-muted-foreground"
                            : "border-b"
                        }
                      >
                        <td className="py-2 pr-4 font-mono">
                          {row.readableId}
                          {row.active === false ? (
                            <span className="ml-2 text-xs">
                              <Trans>Inactive</Trans>
                            </span>
                          ) : null}
                        </td>
                        <td className="py-2 pr-4">
                          {Number(row.quantities?.quantityOnHand ?? 0)}
                        </td>
                        <td className="py-2">
                          {Number(row.quantities?.quantityAvailable ?? 0)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
      <RuleAssignmentsList
        targetType="item"
        targetId={itemId}
        assignments={ruleAssignments as never}
        library={ruleLibrary as never}
      />
    </VStack>
  );
}
