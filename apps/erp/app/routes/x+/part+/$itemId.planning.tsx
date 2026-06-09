import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { VStack } from "@carbon/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import {
  getItemPlanning,
  itemPlanningValidator,
  upsertItemPlanning
} from "~/modules/items";
import { ItemPlanningForm } from "~/modules/items/ui/Item";
import { ItemPlanningChart } from "~/modules/items/ui/Item/ItemPlanningChart";
import { getLocationsList } from "~/modules/resources";
import { getUserDefaults } from "~/modules/users/users.server";
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
  let locationId = searchParams.get("location");

  const [userDefaults, locationsResult] = await Promise.all([
    locationId ? Promise.resolve(null) : getUserDefaults(client, userId, companyId),
    getLocationsList(client, companyId)
  ]);

  if (!locationId) {
    if (userDefaults?.error) {
      throw redirect(
        path.to.part(itemId),
        await flash(
          request,
          error(userDefaults.error, "Failed to load default location")
        )
      );
    }
    locationId = userDefaults?.data?.locationId ?? null;
  }

  if (!locationId) {
    if (locationsResult.error || !locationsResult.data?.length) {
      throw redirect(
        path.to.part(itemId),
        await flash(
          request,
          error(locationsResult.error, "Failed to load any locations")
        )
      );
    }
    locationId = locationsResult.data[0].id as string;
  }

  let partPlanning = await getItemPlanning(
    client,
    itemId,
    companyId,
    locationId
  );

  if (partPlanning.error || !partPlanning.data) {
    throw redirect(
      path.to.part(itemId),
      await flash(
        request,
        error(partPlanning.error, "Failed to load part planning")
      )
    );
  }

  return {
    partPlanning: partPlanning.data,
    locationId,
    locations: locationsResult.data ?? []
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const validation = await validator(itemPlanningValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePartPlanning = await upsertItemPlanning(client, {
    ...validation.data,
    itemId,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });
  if (updatePartPlanning.error) {
    throw redirect(
      path.to.part(itemId),
      await flash(
        request,
        error(updatePartPlanning.error, "Failed to update part planning")
      )
    );
  }

  throw redirect(
    path.to.partPlanningLocation(itemId, validation.data.locationId),
    await flash(request, success("Updated part planning"))
  );
}

export default function PartPlanningRoute() {
  const { partPlanning, locationId, locations } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={2} className="p-2">
      <ItemPlanningForm
        key={partPlanning.itemId}
        initialValues={{
          ...partPlanning,
          ...getCustomFields(partPlanning.customFields)
        }}
        locations={locations}
        type="Part"
      />
      <ItemPlanningChart
        itemId={partPlanning.itemId}
        locationId={locationId}
        safetyStock={
          partPlanning.reorderingPolicy === "Demand-Based Reorder"
            ? (partPlanning.demandAccumulationSafetyStock ?? 0)
            : undefined
        }
      />
    </VStack>
  );
}
