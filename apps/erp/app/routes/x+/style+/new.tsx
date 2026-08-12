import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { trigger } from "@carbon/jobs";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { styleValidator } from "~/modules/items";
import { getAttributeSetFormOptionsForItemType } from "~/modules/items/itemAttribute.service";
import { parseAndValidateItemAttributesForCreate } from "~/modules/items/itemAttributes.actions.server";
import { applyTemplateToItem } from "~/modules/items/template.service";
import { newStyleInitialValues } from "~/modules/items/ui/Styles/newStyleDefaults";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Styles`,
  to: path.to.items,
  module: "items"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  // Bare URL: redirect to the styles list with the overlay open so create
  // never renders as a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newStyle());
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(query ? `${path.to.styles}?${query}` : path.to.styles);
  }

  const { client, companyId } = await requirePermissions(request, {
    create: "parts"
  });

  // Front-load attribute set options so StyleForm can render them immediately
  // instead of waiting on a second client round-trip after the chunk mounts.
  const attributeSets = await getAttributeSetFormOptionsForItemType(
    client,
    "Style",
    companyId
  );

  return {
    initialValues: newStyleInitialValues,
    attributeSets: attributeSets.data
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(styleValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { templateId, ...styleData } = validation.data;
  // Attribute-set-driven selection: the create form submits a Hidden
  // attributeSetId + av__<attributeId>[] arrays (parsed generically), replacing
  // the old hardcoded size/color fields. A Style that uses a set must arrive
  // complete (set chosen + a value per attribute); it's frozen right after
  // creation, so validate before inserting. upsertStyle runs the variant sync.
  const { attributeSetId, selections, attributeError } =
    await parseAndValidateItemAttributesForCreate(client, {
      formData,
      itemType: "Style",
      companyId
    });
  if (attributeError) {
    return validationError(
      { fieldErrors: { [attributeError.field]: attributeError.message } },
      validation.data
    );
  }

  const { upsertStyle } = await import("~/modules/items/style.server");

  const createStyle = await upsertStyle(client, {
    ...styleData,
    attributeSetId,
    selections,
    companyId,
    customFields: setCustomFields(formData),
    createdBy: userId
  });
  if (createStyle.error) {
    const message = `Failed to insert style: ${JSON.stringify(createStyle.error)}`;
    return isOverlay || modal
      ? data(
          isOverlay ? { ok: false as const } : createStyle,
          await flash(request, error(createStyle.error, message))
        )
      : redirect(
          path.to.styles,
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

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Style created"))
    );
  }

  return modal
    ? data(createStyle, { status: 201 })
    : redirect(path.to.style(itemId));
}

export default function StylesNewRoute() {
  return null;
}
