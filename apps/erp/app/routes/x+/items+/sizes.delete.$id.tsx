import { error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import { deleteStyleSize, getStyleSize } from "~/modules/items";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts"
  });
  const { id } = params;
  if (!id) throw notFound("id not found");

  const styleSize = await getStyleSize(client, id);
  if (styleSize.error) {
    throw redirect(
      path.to.styleSizes,
      await flash(request, error(styleSize.error, "Failed to get style size"))
    );
  }

  return { styleSize: styleSize.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "parts"
  });

  const { id } = params;
  if (!id) {
    throw redirect(
      path.to.styleSizes,
      await flash(request, error(params, "Failed to get a style size id"))
    );
  }

  const { error: deleteError } = await deleteStyleSize(client, id);
  if (deleteError) {
    throw redirect(
      `${path.to.styleSizes}?${getParams(request)}`,
      await flash(request, error(deleteError, "Failed to delete style size"))
    );
  }

  throw redirect(
    path.to.styleSizes,
    await flash(request, success("Successfully deleted style size"))
  );
}

export default function DeleteStyleSizeRoute() {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { styleSize } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { t } = useLingui();

  if (!styleSize) return null;

  const onCancel = () => navigate(-1);

  return (
    <ConfirmDelete
      action={path.to.deleteStyleSize(id)}
      name={`${styleSize.sizeCode} – ${styleSize.sizeName}`}
      text={t`Are you sure you want to delete the style size ${styleSize.sizeCode}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
