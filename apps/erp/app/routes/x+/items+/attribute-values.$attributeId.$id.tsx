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
import {
  getItemAttributeValue,
  upsertItemAttributeValue
} from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { attributeId, id } = params;
  if (!attributeId || !id) throw notFound("id not found");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(
      overlay.to.editItemAttributeValue({ attributeId, id })
    );
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    const base = path.to.itemAttributeValues(attributeId);
    throw redirect(query ? `${base}?${query}` : base);
  }

  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const value = await getItemAttributeValue(client, id);
  if (value.data?.companyId === null) {
    throw redirect(
      path.to.itemAttributeValues(attributeId),
      await flash(
        request,
        error(new Error("Access denied"), "Cannot edit system attribute value")
      )
    );
  }

  return { attributeId, value: value.data ?? null };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });
  const { attributeId, id } = params;
  if (!attributeId || !id) throw notFound("id not found");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const validation = await validator(itemAttributeValueValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const update = await upsertItemAttributeValue(client, {
    id,
    ...validation.data,
    attributeId,
    updatedBy: userId
  });
  if (update.error) {
    if (isOverlay) {
      return data(
        { ok: false as const, error: "Failed to update attribute value" },
        await flash(
          request,
          error(update.error, "Failed to update attribute value")
        )
      );
    }
    throw redirect(
      path.to.itemAttributeValues(attributeId),
      await flash(
        request,
        error(update.error, "Failed to update attribute value")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Updated attribute value"))
    );
  }

  throw redirect(
    path.to.itemAttributeValues(attributeId),
    await flash(request, success("Updated attribute value"))
  );
}

// Rendered as a registry overlay (see overlay.registry.tsx `editItemAttributeValue`).
export default function EditItemAttributeValueRoute() {
  return null;
}
