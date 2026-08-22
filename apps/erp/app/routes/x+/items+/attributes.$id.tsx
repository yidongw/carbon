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

  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const attribute = await getItemAttribute(client, id);
  if (!attribute.data) throw notFound("Attribute not found");

  // Prefer company-scoped values when the same code also exists as a system row.
  const byCode = new Map<
    string,
    {
      id: string;
      code: string;
      name: string;
      sortOrder: number;
      companyId: string | null;
      color: string | null;
    }
  >();
  for (const row of (attribute.data.itemAttributeValue ?? []) as Array<{
    id: string;
    code: string;
    name: string;
    sortOrder: number;
    companyId: string | null;
    color: string | null;
  }>) {
    // Only include system + this company's values
    if (row.companyId !== null && row.companyId !== companyId) continue;
    const existing = byCode.get(row.code);
    if (!existing || (row.companyId && !existing.companyId)) {
      byCode.set(row.code, row);
    }
  }
  const values = [...byCode.values()].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.code.localeCompare(b.code);
  });

  return {
    attribute: attribute.data,
    values
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "parts"
  });
  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const existing = await getItemAttribute(client, id);
  if (existing.error || !existing.data) {
    return data(
      { ok: false as const, error: "Attribute not found" },
      await flash(request, error(existing.error, "Attribute not found"))
    );
  }

  const validation = await validator(itemAttributeValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const attributeCompanyId = (existing.data.companyId ?? null) as string | null;

  const update = await upsertItemAttribute(client, {
    id,
    code: validation.data.code,
    name: validation.data.name,
    sortOrder: validation.data.sortOrder,
    values: validation.data.values,
    companyId: attributeCompanyId,
    tenantCompanyId: companyId,
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
