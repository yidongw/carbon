import { error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import {
  deleteItemAttributeValue,
  getItemAttributeValue
} from "~/modules/items/itemAttribute.service";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { view: "parts" });
  const { attributeId, id } = params;
  if (!attributeId || !id) throw notFound("id not found");

  const value = await getItemAttributeValue(client, id);
  if (value.error) {
    throw redirect(
      path.to.itemAttributeValues(attributeId),
      await flash(request, error(value.error, "Failed to get attribute value"))
    );
  }
  return { value: value.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, { delete: "parts" });
  const { attributeId, id } = params;
  if (!attributeId || !id) {
    throw redirect(
      path.to.itemAttributes,
      await flash(request, error(params, "Failed to get attribute value id"))
    );
  }

  const { error: deleteError } = await deleteItemAttributeValue(client, id);
  if (deleteError) {
    // 23503 = FK violation: the value is still referenced by a selection or a
    // variant SKU (both ON DELETE RESTRICT).
    const inUse = (deleteError as { code?: string }).code === "23503";
    throw redirect(
      `${path.to.itemAttributeValues(attributeId)}?${getParams(request)}`,
      await flash(
        request,
        error(
          deleteError,
          inUse
            ? "This value is in use by an item or variant SKU and can't be deleted"
            : "Failed to delete attribute value"
        )
      )
    );
  }

  throw redirect(
    `${path.to.itemAttributeValues(attributeId)}?${getParams(request)}`,
    await flash(request, success("Deleted attribute value"))
  );
}

export default function DeleteItemAttributeValueRoute() {
  const { t } = useLingui();
  const { attributeId, id } = useParams();
  const { value } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!value || !attributeId || !id) return null;

  return (
    <ConfirmDelete
      action={path.to.deleteItemAttributeValue(attributeId, id)}
      name={value.name}
      text={t`Are you sure you want to delete ${value.name}?`}
      onCancel={() => navigate(path.to.itemAttributeValues(attributeId))}
    />
  );
}
