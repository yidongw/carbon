import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData, useNavigate } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import { deleteTag } from "~/modules/shared";
import { path } from "~/utils/path";

function getTagParams(request: Request) {
  const url = new URL(request.url);
  return {
    table: url.searchParams.get("table"),
    name: url.searchParams.get("name")
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {});

  const { table, name } = getTagParams(request);
  if (!table || !name) throw notFound("Tag not found");

  return { table, name };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  // The tag DELETE RLS policy requires the settings-update permission — keep the
  // app check in sync so a user without it gets a clear 403 instead of a silent
  // no-op that RLS rejects while the action still reports success.
  const { client, companyId } = await requirePermissions(request, {
    update: "settings"
  });

  const { table, name } = getTagParams(request);
  if (!table || !name) {
    throw redirect(
      path.to.tags,
      await flash(request, error(null, "Failed to get tag"))
    );
  }

  const remove = await deleteTag(client, companyId, table, name);
  if (remove.error) {
    throw redirect(
      path.to.tags,
      await flash(request, error(remove.error, "Failed to delete tag"))
    );
  }

  throw redirect(
    path.to.tags,
    await flash(request, success("Successfully deleted tag"))
  );
}

export default function DeleteTagRoute() {
  const { table, name } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { t } = useLingui();

  return (
    <ConfirmDelete
      action={path.to.deleteTag(table, name)}
      name={name}
      text={t`Are you sure you want to delete the tag: ${name}? This cannot be undone.`}
      onCancel={() => navigate(-1)}
    />
  );
}
