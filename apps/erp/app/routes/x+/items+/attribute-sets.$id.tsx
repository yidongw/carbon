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
import { itemAttributeSetValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttributeSet,
  getItemAttributes,
  upsertItemAttributeSet
} from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw notFound("id not found");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.editItemAttributeSet({ id }));
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query
        ? `${path.to.itemAttributeSets}?${query}`
        : path.to.itemAttributeSets
    );
  }

  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const [set, attributes] = await Promise.all([
    getItemAttributeSet(client, id),
    getItemAttributes(client, companyId)
  ]);

  if (set.error || !set.data) {
    throw redirect(
      path.to.itemAttributeSets,
      await flash(request, error(set.error, "Attribute set not found"))
    );
  }

  return {
    set: set.data,
    attributeOptions: (attributes.data ?? []).map(
      (a: { id: string; name: string; code: string }) => ({
        label: `${a.code} — ${a.name}`,
        value: a.id
      })
    )
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });
  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const existing = await getItemAttributeSet(client, id);
  if (existing.error || !existing.data) {
    return data(
      { ok: false as const, error: "Attribute set not found" },
      await flash(request, error(existing.error, "Attribute set not found"))
    );
  }
  // System (shared) sets are read-only for tenants; editing them would attempt
  // a cross-tenant write that RLS now blocks anyway.
  if (existing.data.companyId === null) {
    return data(
      { ok: false as const, error: "Cannot edit a system attribute set" },
      await flash(
        request,
        error(new Error("Access denied"), "Cannot edit a system attribute set")
      )
    );
  }

  const validation = await validator(itemAttributeSetValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const setCompanyId = (existing.data.companyId ?? null) as string | null;

  const result = await upsertItemAttributeSet(client, {
    id,
    code: validation.data.code,
    name: validation.data.name,
    attributeIds: validation.data.attributeIds,
    companyId: setCompanyId,
    updatedBy: userId
  });

  if (result.error) {
    if (isOverlay) {
      return data(
        { ok: false as const, error: "Failed to update attribute set" },
        await flash(
          request,
          error(result.error, "Failed to update attribute set")
        )
      );
    }
    throw redirect(
      path.to.itemAttributeSets,
      await flash(
        request,
        error(result.error, "Failed to update attribute set")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Updated attribute set"))
    );
  }

  throw redirect(
    path.to.itemAttributeSets,
    await flash(request, success("Updated attribute set"))
  );
}

// Rendered as a registry overlay (see overlay.registry.tsx `editItemAttributeSet`).
export default function EditItemAttributeSetRoute() {
  return null;
}
