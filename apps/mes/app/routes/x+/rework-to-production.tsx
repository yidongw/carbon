import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { type ActionFunctionArgs, data } from "react-router";
import { markReworkFixed } from "~/services/operations.service";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  // Manager-only: reclassifying rework as finished production.
  const { companyId, userId } = await requirePermissions(request, {
    update: "production"
  });
  const serviceRole = getCarbonServiceRole();

  const formData = await request.formData();
  const jobOperationId = String(formData.get("jobOperationId") ?? "");
  const quantity = Math.floor(Number(formData.get("quantity")));
  if (!jobOperationId) {
    return data(
      { success: false },
      await flash(request, error(null, "Missing operation"))
    );
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return data(
      { success: false },
      await flash(request, error(null, "Enter a quantity greater than zero"))
    );
  }

  const res = await markReworkFixed(serviceRole, {
    jobOperationId,
    companyId,
    userId,
    quantity
  });

  if (res.error) {
    return data(
      { success: false },
      await flash(request, error(res.error, "Failed to convert rework"))
    );
  }

  return data({ success: true });
}
