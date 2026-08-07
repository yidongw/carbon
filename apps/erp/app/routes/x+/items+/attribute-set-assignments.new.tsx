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
import { itemAttributeSetAssignmentValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttributeSets,
  upsertItemAttributeSetAssignment
} from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newItemAttributeSetAssignment());
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query
        ? `${path.to.itemAttributeSetAssignments}?${query}`
        : path.to.itemAttributeSetAssignments
    );
  }

  const { client, companyId } = await requirePermissions(request, {
    create: "parts"
  });
  const sets = await getItemAttributeSets(client, companyId);
  return {
    attributeSetOptions: (sets.data ?? []).map(
      (s: { id: string; name: string; code: string }) => ({
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

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const validation = await validator(
    itemAttributeSetAssignmentValidator
  ).validate(await request.formData());
  if (validation.error) return validationError(validation.error);

  const { id: _id, ...rest } = validation.data;
  const insert = await upsertItemAttributeSetAssignment(client, {
    ...rest,
    companyId,
    createdBy: userId
  });
  if (insert.error) {
    if (isOverlay) {
      return data(
        { ok: false as const, error: "Failed to create set assignment" },
        await flash(
          request,
          error(insert.error, "Failed to create set assignment")
        )
      );
    }
    throw redirect(
      path.to.itemAttributeSetAssignments,
      await flash(
        request,
        error(insert.error, "Failed to create set assignment")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Created set assignment"))
    );
  }

  throw redirect(
    path.to.itemAttributeSetAssignments,
    await flash(request, success("Created set assignment"))
  );
}

// Rendered as a registry overlay (see overlay.registry.tsx `newItemAttributeSetAssignment`).
export default function NewItemAttributeSetAssignmentRoute() {
  return null;
}
