import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import { itemAttributeSetAssignmentValidator } from "~/modules/items/itemAttribute.models";
import {
  getItemAttributeSetAssignment,
  getItemAttributeSets,
  upsertItemAttributeSetAssignment
} from "~/modules/items/itemAttribute.service";
import ItemAttributeSetAssignmentForm from "~/modules/items/ui/ItemAttributeSetAssignments/ItemAttributeSetAssignmentForm";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });
  const { id } = params;
  if (!id) throw notFound("id not found");

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

  const existing = await getItemAttributeSetAssignment(client, id);
  if (existing.error || !existing.data) {
    return data(
      {},
      await flash(request, error(existing.error, "Set assignment not found"))
    );
  }
  if (existing.data.companyId === null) {
    return data(
      {},
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
    return data(
      {},
      await flash(
        request,
        error(result.error, "Failed to update set assignment")
      )
    );
  }

  throw redirect(
    `${path.to.itemAttributeSetAssignments}?${getParams(request)}`,
    await flash(request, success("Updated set assignment"))
  );
}

export default function EditItemAttributeSetAssignmentRoute() {
  const { assignment, attributeSetOptions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <ItemAttributeSetAssignmentForm
      initialValues={{
        id: assignment.id,
        itemType: assignment.itemType,
        attributeSetId: assignment.attributeSetId
      }}
      attributeSetOptions={attributeSetOptions}
      onClose={() => navigate(path.to.itemAttributeSetAssignments)}
    />
  );
}
