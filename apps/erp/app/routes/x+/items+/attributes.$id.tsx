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
import { itemAttributeValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttribute,
  upsertItemAttribute
} from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw notFound("id not found");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.editItemAttribute({ id }));
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query ? `${path.to.itemAttributes}?${query}` : path.to.itemAttributes
    );
  }

  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const attribute = await getItemAttribute(client, id);
  if (!attribute.data) throw notFound("Attribute not found");
  if (attribute.data.companyId === null) {
    throw redirect(
      path.to.itemAttributes,
      await flash(
        request,
        error(new Error("Access denied"), "Cannot edit system attribute")
      )
    );
  }

  return { attribute: attribute.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });
  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const validation = await validator(itemAttributeValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const update = await upsertItemAttribute(client, {
    id,
    ...validation.data,
    updatedBy: userId
  });
  if (update.error) {
    if (isOverlay) {
      return data(
        { ok: false as const, error: "Failed to update attribute" },
        await flash(request, error(update.error, "Failed to update attribute"))
      );
    }
    throw redirect(
      path.to.itemAttributes,
      await flash(request, error(update.error, "Failed to update attribute"))
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Updated attribute"))
    );
  }

  throw redirect(
    path.to.itemAttributes,
    await flash(request, success("Updated attribute"))
  );
}

// Rendered as a registry overlay (see overlay.registry.tsx `editItemAttribute`).
export default function EditItemAttributeRoute() {
  return null;
}
