import { assertIsPost, error, success } from "@carbon/auth";
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
import { upsertItemAttribute } from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newItemAttribute());
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query ? `${path.to.itemAttributes}?${query}` : path.to.itemAttributes
    );
  }

  await requirePermissions(request, { create: "parts" });
  return {
    initialValues: {
      code: "",
      name: "",
      sortOrder: 100,
      values: [] as Array<{ id?: string; code: string; name: string }>
    }
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const validation = await validator(itemAttributeValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const { id: _id, ...rest } = validation.data;
  const insert = await upsertItemAttribute(client, {
    ...rest,
    companyId,
    createdBy: userId
  });
  if (insert.error) {
    if (isOverlay) {
      return data(
        { ok: false as const, error: "Failed to create attribute" },
        await flash(request, error(insert.error, "Failed to create attribute"))
      );
    }
    throw redirect(
      path.to.itemAttributes,
      await flash(request, error(insert.error, "Failed to create attribute"))
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Created attribute"))
    );
  }

  throw redirect(
    path.to.itemAttributes,
    await flash(request, success("Created attribute"))
  );
}

// Rendered as a registry overlay (see overlay.registry.tsx `newItemAttribute`).
export default function NewItemAttributeRoute() {
  return null;
}
