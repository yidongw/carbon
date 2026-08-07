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
import { itemAttributeSetAssignmentValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttributeSetAssignment,
  getItemAttributeSets,
  upsertItemAttributeSetAssignment
} from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw notFound("id not found");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open, so the form always renders as an overlay rather than a full page.
  if (!isOverlay) {
    const token = overlayToken(
      overlay.to.editItemAttributeSetAssignment({ id })
    );
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
    view: "parts",
    role: "employee"
  });

  const [assignment, sets] = await Promise.all([
    getItemAttributeSetAssignment(client, id),
    getItemAttributeSets(client, companyId)
  ]);

  if (assignment.error || !assignment.data) {
    throw redirect(
      path.to.itemAttributeSetAssignments,
      await flash(request, error(assignment.error, "Set assignment not found"))
    );
  }
  if (assignment.data.companyId === null) {
    throw redirect(
      path.to.itemAttributeSetAssignments,
      await flash(
        request,
        error(
          new Error("Access denied"),
          "Cannot edit a system attribute set assignment"
        )
      )
    );
  }

  return {
    assignment: assignment.data,
    attributeSetOptions: (sets.data ?? []).map(
      (s: { id: string; name: string; code: string }) => ({
        label: `${s.code} — ${s.name}`,
        value: s.id
      })
    )
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId: _userId } = await requirePermissions(request, {
    update: "parts"
  });
  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const existing = await getItemAttributeSetAssignment(client, id);
  if (existing.error || !existing.data) {
    return data(
      { ok: false as const, error: "Set assignment not found" },
      await flash(request, error(existing.error, "Set assignment not found"))
    );
  }
  if (existing.data.companyId === null) {
    return data(
      {
        ok: false as const,
        error: "Cannot edit a system attribute set assignment"
      },
      await flash(
        request,
        error(
          new Error("Access denied"),
          "Cannot edit a system attribute set assignment"
        )
      )
    );
  }

  const validation = await validator(
    itemAttributeSetAssignmentValidator
  ).validate(await request.formData());
  if (validation.error) return validationError(validation.error);

  const result = await upsertItemAttributeSetAssignment(client, {
    id,
    itemType: validation.data.itemType,
    attributeSetId: validation.data.attributeSetId,
    companyId: (existing.data.companyId ?? null) as string | null
  });

  if (result.error) {
    if (isOverlay) {
      return data(
        { ok: false as const, error: "Failed to update set assignment" },
        await flash(
          request,
          error(result.error, "Failed to update set assignment")
        )
      );
    }
    throw redirect(
      path.to.itemAttributeSetAssignments,
      await flash(
        request,
        error(result.error, "Failed to update set assignment")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Updated set assignment"))
    );
  }

  throw redirect(
    path.to.itemAttributeSetAssignments,
    await flash(request, success("Updated set assignment"))
  );
}

// Rendered as a registry overlay (see overlay.registry.tsx `editItemAttributeSetAssignment`).
export default function EditItemAttributeSetAssignmentRoute() {
  return null;
}
