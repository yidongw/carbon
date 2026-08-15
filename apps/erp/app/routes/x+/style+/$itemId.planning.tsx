import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { VStack } from "@carbon/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { useRouteData } from "~/hooks";
import {
  itemPlanningSaveErrorMessage,
  itemPlanningValidator
} from "~/modules/items";
import {
  getItemPlanningWithMix,
  upsertItemPlanningWithMix
} from "~/modules/items/itemPlanning.server";
import { ItemPlanningForm } from "~/modules/items/ui/Item";
import { ItemPlanningChart } from "~/modules/items/ui/Item/ItemPlanningChart";
import { getLocationsList } from "~/modules/resources";
import { getUserDefaults } from "~/modules/users/users.server";
import { getDatabaseClient } from "~/services/database.server";
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

  const stylePlanning = await getItemPlanningWithMix(
    client,
    itemId,
    companyId,
    locationId
  );
  if (stylePlanning.error || !stylePlanning.data) {
    throw redirect(
      path.to.style(itemId),
      await flash(
        request,
        error(stylePlanning.error, "Failed to load style planning")
      )
    );
  }

  return {
    stylePlanning: stylePlanning.data,
    locationId
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const validation = await validator(itemPlanningValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const updateStylePlanning = await upsertItemPlanningWithMix(
    client,
    {
      ...validation.data,
      itemId,
      updatedBy: userId,
      customFields: setCustomFields(formData)
    },
    { db: getDatabaseClient(), companyId }
  );
  if (updateStylePlanning.error) {
    throw redirect(
      path.to.style(itemId),
      await flash(
        request,
        error(
          updateStylePlanning.error,
          itemPlanningSaveErrorMessage(
            updateStylePlanning.error,
            "Failed to update style planning"
          )
        )
      )
    );
  }

  throw redirect(
    path.to.stylePlanningLocation(itemId, validation.data.locationId),
    await flash(request, success("Updated style planning"))
  );
}

export default function StylePlanningRoute() {
  const sharedStylesData = useRouteData<{
    locations: ListItem[];
  }>(path.to.styleRoot);

  const { stylePlanning, locationId } = useLoaderData<typeof loader>();

  if (!sharedStylesData) throw new Error("Could not load shared styles data");

  return (
    <VStack spacing={2} className="p-2">
      <ItemPlanningForm
        key={stylePlanning.itemId}
        initialValues={{
          ...stylePlanning,
          ...getCustomFields(stylePlanning.customFields)
        }}
        locations={sharedStylesData.locations ?? []}
        type="Style"
      />
      <ItemPlanningChart
        itemId={stylePlanning.itemId}
        locationId={locationId}
      />
    </VStack>
  );
}
