import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { deleteTemplate } from "~/modules/items";
import { path } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId } = await requirePermissions(request, {
    delete: "parts"
  });

  const { templateId } = params;
  if (!templateId) throw notFound("templateId not found");

  const remove = await deleteTemplate(client, templateId, companyId);

  if (remove.error) {
    throw redirect(
      path.to.templates,
      await flash(request, error(remove.error, "Failed to delete template"))
    );
  }

  throw redirect(
    path.to.templates,
    await flash(request, success("Successfully deleted template"))
  );
}
