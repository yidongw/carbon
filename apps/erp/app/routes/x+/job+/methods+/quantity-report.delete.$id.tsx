import { assertIsPost, error, success } from "@carbon/auth";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { deleteProductionQuantityReport } from "~/modules/production";
import { path, requestReferrer } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId } = await requirePermissions(request, {
    delete: "production"
  });

  const { id } = params;
  if (!id) throw new Error("Could not find id");

  // productionQuantityReport has no DELETE RLS policy, so use the service role.
  const serviceRole = getCarbonServiceRole();

  const deletion = await deleteProductionQuantityReport(serviceRole, {
    reportId: id,
    companyId
  });

  if (deletion.error) {
    throw redirect(
      requestReferrer(request) ?? path.to.jobs,
      await flash(
        request,
        error(deletion.error, "Failed to delete quantity report")
      )
    );
  }

  throw redirect(
    requestReferrer(request) ?? path.to.jobs,
    await flash(request, success("Successfully deleted quantity report"))
  );
}
