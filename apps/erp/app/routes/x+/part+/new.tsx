import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { trigger } from "@carbon/jobs";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  copyThumbnailToItemFiles,
  partValidator,
  upsertPart
} from "~/modules/items";
import {
  parseAndValidateItemAttributesForCreate,
  syncItemAttributesOnCreate
} from "~/modules/items/itemAttributes.actions.server";
import { applyTemplateToItem } from "~/modules/items/template.service";
import { PartForm } from "~/modules/items/ui/Parts";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Parts`,
  to: path.to.parts,
  module: "items"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(partValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { templateId, ...partData } = validation.data;

  // The attribute set is optional, but if one is chosen every attribute of it
  // needs a value. Validate before inserting so nothing partial persists.
  const { attributeSetId, selections, attributeError } =
    await parseAndValidateItemAttributesForCreate(client, {
      formData,
      itemType: "Part",
      companyId
    });
  if (attributeError) {
    return validationError(
      { fieldErrors: { [attributeError.field]: attributeError.message } },
      validation.data
    );
  }

  const createPart = await upsertPart(client, {
    ...partData,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });
  if (createPart.error) {
    return modal
      ? data(
          createPart,
          await flash(request, error(createPart.error, "Failed to insert part"))
        )
      : redirect(
          path.to.parts,
          await flash(request, error(createPart.error, "Failed to insert part"))
        );
  }

  if (validation.data.modelUploadId) {
    await trigger("model-thumbnail", {
      companyId,
      modelId: validation.data.modelUploadId
    });
  }

  const itemId = createPart.data?.id;
  if (!itemId) throw new Error("Part ID not found");

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
            error(attributeSyncError, "Failed to sync part variants")
          )
        )
      : redirect(
          path.to.parts,
          await flash(
            request,
            error(attributeSyncError, "Failed to sync part variants")
          )
        );
  }

  // The thumbnail is uploaded before the item exists, so it lands in a
  // staging path. Now that we have the item's id, re-key the object under the
  // item's own folder to match the convention used everywhere else
  // (thumbnails/<itemId>/...). If the move fails we keep the staging path,
  // which still resolves fine.
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
    // Also drop a copy of the thumbnail into the item's Files (independent copy).
    await copyThumbnailToItemFiles(client, {
      companyId,
      itemId,
      userId,
      thumbnailPath: move.error ? stagingThumbnailPath : finalThumbnailPath,
      originalPath: (formData.get("thumbnailFilePath") as string) || undefined,
      fileName: (formData.get("thumbnailName") as string) || fileName || "thumbnail",
      type: "Part"
    });
  }

  if (templateId) {
    await applyTemplateToItem(client, {
      templateId,
      itemId,
      companyId,
      userId
    });
  }

  return modal
    ? data(createPart, { status: 201 })
    : redirect(path.to.part(itemId));
}

export default function PartsNewRoute() {
  const initialValues = {
    id: "",
    revision: "0",
    name: "",
    description: "",
    itemTrackingType: "Inventory" as "Inventory",
    replenishmentSystem: "Buy" as "Buy",
    defaultMethodType: "Pull from Inventory" as "Pull from Inventory",
    unitOfMeasureCode: "EA",
    unitCost: 0,
    lotSize: 0,
    active: true,
    shelfLifeCalculateFromBom: false
  };

  return (
    <div className="max-w-4xl w-full p-2 sm:p-0 mx-auto mt-0 md:mt-8">
      <PartForm initialValues={initialValues} />
    </div>
  );
}
