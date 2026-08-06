import { error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import {
  deleteItemAttributeSetAssignment,
  getItemAttributeSetAssignment
} from "~/modules/items/itemAttribute.service";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { view: "parts" });
  const { id } = params;
  if (!id) throw notFound("id not found");

  const assignment = await getItemAttributeSetAssignment(client, id);
  if (assignment.error) {
    throw redirect(
      path.to.itemAttributeSetAssignments,
      await flash(
        request,
        error(assignment.error, "Failed to get set assignment")
      )
    );
  }
  return { assignment: assignment.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, { delete: "parts" });
  const { id } = params;
  if (!id) {
    throw redirect(
      path.to.itemAttributeSetAssignments,
      await flash(request, error(params, "Failed to get assignment id"))
    );
  }

  const { error: deleteError } = await deleteItemAttributeSetAssignment(
    client,
    id
  );
  if (deleteError) {
    throw redirect(
      `${path.to.itemAttributeSetAssignments}?${getParams(request)}`,
      await flash(
        request,
        error(deleteError, "Failed to delete set assignment")
      )
    );
  }

  throw redirect(
    `${path.to.itemAttributeSetAssignments}?${getParams(request)}`,
    await flash(request, success("Deleted set assignment"))
  );
}

export default function DeleteItemAttributeSetAssignmentRoute() {
  const { t } = useLingui();
  const { id } = useParams();
  const { assignment } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!assignment || !id) return null;

  const setLabel =
    assignment.itemAttributeSet?.name ?? assignment.attributeSetId;
  const name = `${assignment.itemType} → ${setLabel}`;

  return (
    <ConfirmDelete
      action={path.to.deleteItemAttributeSetAssignment(id)}
      name={name}
      text={t`Are you sure you want to delete the assignment ${name}?`}
      onCancel={() => navigate(path.to.itemAttributeSetAssignments)}
    />
  );
}
