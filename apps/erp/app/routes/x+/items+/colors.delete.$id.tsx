import { error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import { deleteStyleColor, getStyleColor } from "~/modules/items";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts"
  });
  const { id } = params;
  if (!id) throw notFound("id not found");

  const styleColor = await getStyleColor(client, id);
  if (styleColor.error) {
    throw redirect(
      path.to.styleColors,
      await flash(
        request,
        error(styleColor.error, "Failed to get style color")
      )
    );
  }

  return { styleColor: styleColor.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "parts"
  });

  const { id } = params;
  if (!id) {
    throw redirect(
      path.to.styleColors,
      await flash(request, error(params, "Failed to get a style color id"))
    );
  }

  const { error: deleteError } = await deleteStyleColor(client, id);
  if (deleteError) {
    throw redirect(
      `${path.to.styleColors}?${getParams(request)}`,
      await flash(request, error(deleteError, "Failed to delete style color"))
    );
  }

  throw redirect(
    path.to.styleColors,
    await flash(request, success("Successfully deleted style color"))
  );
}

export default function DeleteStyleColorRoute() {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { styleColor } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { t } = useLingui();

  if (!styleColor) return null;

  const onCancel = () => navigate(-1);

  return (
    <ConfirmDelete
      action={path.to.deleteStyleColor(id)}
      name={`${styleColor.colorCode} – ${styleColor.colorName}`}
      text={t`Are you sure you want to delete the style color ${styleColor.colorCode}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
