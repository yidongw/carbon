import { error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import {
  deleteItemAttributeSet,
  getItemAttributeSet
} from "~/modules/items/itemAttribute.service";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { view: "parts" });
  const { id } = params;
  if (!id) throw notFound("id not found");

  const set = await getItemAttributeSet(client, id);
  if (set.error) {
    throw redirect(
      path.to.itemAttributeSets,
      await flash(request, error(set.error, "Failed to get attribute set"))
    );
  }
  return { set: set.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, { delete: "parts" });
  const { id } = params;
  if (!id) {
    throw redirect(
      path.to.itemAttributeSets,
      await flash(request, error(params, "Failed to get attribute set id"))
    );
  }

  const { error: deleteError } = await deleteItemAttributeSet(client, id);
  if (deleteError) {
    throw redirect(
      `${path.to.itemAttributeSets}?${getParams(request)}`,
      await flash(request, error(deleteError, "Failed to delete attribute set"))
    );
  }

  throw redirect(
    `${path.to.itemAttributeSets}?${getParams(request)}`,
    await flash(request, success("Deleted attribute set"))
  );
}

export default function DeleteItemAttributeSetRoute() {
  const { t } = useLingui();
  const { id } = useParams();
  const { set } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!set || !id) return null;

  return (
    <ConfirmDelete
      action={path.to.deleteItemAttributeSet(id)}
      name={set.name}
      text={t`Are you sure you want to delete ${set.name}?`}
      onCancel={() => navigate(path.to.itemAttributeSets)}
    />
  );
}
