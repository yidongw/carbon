import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { consumableValidator, upsertConsumable } from "~/modules/items";
import { getAttributeSetsForItemType } from "~/modules/items/itemAttribute.service";
import {
  parseAndValidateItemAttributesForCreate,
  syncItemAttributesOnCreate
} from "~/modules/items/itemAttributes.actions.server";
import { ConsumableForm } from "~/modules/items/ui/Consumables";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Consumables`,
  to: path.to.consumables,
  module: "items"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    create: "parts"
  });
  const sets = await getAttributeSetsForItemType(
    client,
    "Consumable",
    companyId
  );
  return {
    attributeSetOptions: (sets.data ?? []).map(
      (s: { id: string; code: string; name: string }) => ({
        label: `${s.code} — ${s.name}`,
        value: s.id
      })
    )
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(consumableValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  // Backstop for the client-side gate: never persist a consumable that uses an
  // attribute set without a value for every one of its attributes (the set +
  // values freeze on create, so it could never be completed later). Validate
  // before inserting so nothing partial is written.
  const { attributeSetId, selections, attributeError } =
    await parseAndValidateItemAttributesForCreate(client, {
      formData,
      itemType: "Consumable",
      companyId
    });
  if (attributeError) {
    return validationError(
      { fieldErrors: { [attributeError.field]: attributeError.message } },
      validation.data
    );
  }

  const createConsumable = await upsertConsumable(client, {
    ...validation.data,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });
  if (createConsumable.error) {
    return modal
      ? data(
          createConsumable,
          await flash(
            request,
            error(createConsumable.error, "Failed to insert consumable")
          )
        )
      : redirect(
          path.to.consumables,
          await flash(
            request,
            error(createConsumable.error, "Failed to insert consumable")
          )
        );
  }

  const itemId = createConsumable.data?.id;
  if (!itemId) throw new Error("Consumable ID not found");

  // Selections were already validated as complete above. If the sync still fails
  // (e.g. a downstream variant write), the item is rolled back so it never
  // persists with an incomplete set of attribute values.
  const { error: attributeSyncError } = await syncItemAttributesOnCreate(
    client,
    {
      itemId,
      companyId,
      userId,
      attributeSetId,
      selections
    }
  );
  if (attributeSyncError) {
    return modal
      ? data(
          { data: null, error: attributeSyncError },
          await flash(
            request,
            error(attributeSyncError, "Failed to sync consumable variants")
          )
        )
      : redirect(
          path.to.consumables,
          await flash(
            request,
            error(attributeSyncError, "Failed to sync consumable variants")
          )
        );
  }

  // The thumbnail is uploaded to a staging path before the item exists. Now
  // that we have the item's id, re-key the object under the item's own folder
  // to match the convention used everywhere else. If the move fails we keep the
  // staging path, which still resolves.
  const stagingThumbnailPath = validation.data.thumbnailPath;
  if (stagingThumbnailPath?.includes("/thumbnails/staging/")) {
    const fileName = stagingThumbnailPath.split("/").pop();
    const finalThumbnailPath = `${companyId}/thumbnails/${itemId}/${fileName}`;
    const move = await client.storage
      .from("private")
      .move(stagingThumbnailPath, finalThumbnailPath);
    if (!move.error) {
      await client
        .from("item")
        .update({ thumbnailPath: finalThumbnailPath })
        .eq("id", itemId);
    }
  }

  return modal
    ? data(createConsumable, { status: 201 })
    : redirect(path.to.consumable(itemId));
}

export default function ConsumablesNewRoute() {
  const { attributeSetOptions } = useLoaderData<typeof loader>();
  const initialValues = {
    id: "",
    name: "",
    description: "",
    itemTrackingType: "Non-Inventory" as "Non-Inventory",
    replenishmentSystem: "Buy" as const,
    defaultMethodType: "Purchase to Order" as const,
    unitOfMeasureCode: "EA",
    unitCost: 0,
    active: true,
    shelfLifeCalculateFromBom: false,
    attributeSetId:
      attributeSetOptions.length === 1
        ? attributeSetOptions[0].value
        : undefined,
    tags: []
  };

  return (
    <div className="max-w-4xl w-full p-2 sm:p-0 mx-auto mt-0 md:mt-8">
      <ConsumableForm
        initialValues={initialValues}
        attributeSetOptions={attributeSetOptions}
      />
    </div>
  );
}
