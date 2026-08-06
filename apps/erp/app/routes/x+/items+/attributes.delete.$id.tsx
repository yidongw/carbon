import { error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import {
  deleteItemAttribute,
  getItemAttribute
} from "~/modules/items/itemAttribute.service";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { view: "parts" });
  const { id } = params;
  if (!id) throw notFound("id not found");

  const attribute = await getItemAttribute(client, id);
  if (attribute.error) {
    throw redirect(
      path.to.itemAttributes,
      await flash(request, error(attribute.error, "Failed to get attribute"))
    );
  }
  return { attribute: attribute.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, { delete: "parts" });
  const { id } = params;
  if (!id) {
    throw redirect(
      path.to.itemAttributes,
      await flash(request, error(params, "Failed to get attribute id"))
    );
  }

  const { error: deleteError } = await deleteItemAttribute(client, id);
  if (deleteError) {
    throw redirect(
      `${path.to.itemAttributes}?${getParams(request)}`,
      await flash(request, error(deleteError, "Failed to delete attribute"))
    );
  }

  throw redirect(
    `${path.to.itemAttributes}?${getParams(request)}`,
    await flash(request, success("Deleted attribute"))
  );
}

export default function DeleteItemAttributeRoute() {
  const { t } = useLingui();
  const { id } = useParams();
  const { attribute } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!attribute || !id) return null;

  return (
    <ConfirmDelete
      action={path.to.deleteItemAttribute(id)}
      name={attribute.name}
      text={t`Are you sure you want to delete ${attribute.name}?`}
      onCancel={() => navigate(path.to.itemAttributes)}
    />
  );
}
