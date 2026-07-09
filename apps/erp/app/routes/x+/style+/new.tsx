import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { trigger } from "@carbon/jobs";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { styleValidator } from "~/modules/items";
import { applyTemplateToItem } from "~/modules/items/template.service";
import { StyleForm } from "~/modules/items/ui/Styles";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Styles`,
  to: path.to.items,
  module: "items"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(styleValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { templateId, ...styleData } = validation.data;
  const styleColorIds = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("styleColorIds["))
    .map(([, value]) => value as string)
    .filter(Boolean);
  const { upsertStyle } = await import("~/modules/items/style.server");

  const createStyle = await upsertStyle(client, {
    ...styleData,
    styleColorIds,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });
  if (createStyle.error) {
    const diagnostics =
      createStyle.error && typeof createStyle.error === "object"
        ? JSON.stringify({
            type:
              createStyle.error.constructor?.name ?? typeof createStyle.error,
            keys: Object.keys(createStyle.error),
            message:
              "message" in createStyle.error
                ? createStyle.error.message
                : undefined,
            detail:
              "detail" in createStyle.error
                ? createStyle.error.detail
                : undefined
          })
        : String(createStyle.error);
    const message = `Failed to insert style: ${diagnostics}`;
    return modal
      ? data(
          createStyle,
          await flash(request, error(createStyle.error, message))
        )
      : redirect(
          path.to.items,
          await flash(request, error(createStyle.error, message))
        );
  }

  if (validation.data.modelUploadId) {
    await trigger("model-thumbnail", {
      companyId,
      modelId: validation.data.modelUploadId
    });
  }

  const itemId = createStyle.data?.id;
  if (!itemId) throw new Error("Style ID not found");

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

  if (templateId) {
    await applyTemplateToItem(client, {
      templateId,
      itemId,
      companyId,
      userId
    });
  }

  return modal
    ? data(createStyle, { status: 201 })
    : redirect(path.to.style(itemId));
}

export default function StylesNewRoute() {
  const initialValues = {
    id: "",
    revision: "0",
    name: "",
    description: "",
    itemTrackingType: "Inventory" as const,
    replenishmentSystem: "Make" as const,
    defaultMethodType: "Make to Order" as const,
    unitOfMeasureCode: "EA",
    unitCost: 0,
    lotSize: 0,
    active: true,
    shelfLifeCalculateFromBom: false
  };

  return (
    <div className="max-w-4xl w-full p-2 sm:p-0 mx-auto mt-0 md:mt-8">
      <StyleForm initialValues={initialValues} />
    </div>
  );
}
