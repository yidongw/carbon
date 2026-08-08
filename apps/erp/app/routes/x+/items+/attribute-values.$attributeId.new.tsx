import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { itemAttributeValueValidator } from "~/modules/items/itemAttribute.models";
import { upsertItemAttributeValue } from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { attributeId } = params;
  if (!attributeId) throw notFound("attributeId not found");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(
      overlay.to.newItemAttributeValue({ attributeId })
    );
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    const base = path.to.itemAttributeValues(attributeId);
    throw redirect(query ? `${base}?${query}` : base);
  }

  await requirePermissions(request, { create: "parts" });
  return { attributeId };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });
  const { attributeId } = params;
  if (!attributeId) throw notFound("attributeId not found");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const validation = await validator(itemAttributeValueValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const { id: _id, ...rest } = validation.data;
  const insert = await upsertItemAttributeValue(client, {
    ...rest,
    attributeId,
    companyId,
    createdBy: userId
  });
  if (insert.error) {
    if (isOverlay) {
      return data(
        { ok: false as const, error: "Failed to create attribute value" },
        await flash(
          request,
          error(insert.error, "Failed to create attribute value")
        )
      );
    }
    throw redirect(
      path.to.itemAttributeValues(attributeId),
      await flash(
        request,
        error(insert.error, "Failed to create attribute value")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Created attribute value"))
    );
  }

  throw redirect(
    path.to.itemAttributeValues(attributeId),
    await flash(request, success("Created attribute value"))
  );
}

// Rendered as a registry overlay (see overlay.registry.tsx `newItemAttributeValue`).
export default function NewItemAttributeValueRoute() {
  return null;
}
