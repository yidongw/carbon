import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { type ActionFunctionArgs, data } from "react-router";
import { assignBundleOperation } from "~/services/bundle.service";
import { endProductionEventsForJobOperation } from "~/services/operations.service";

/**
 * Confirm-pickup for a scanned bundle: assign the operation (and its job) to the
 * current worker. If it was someone else's, take over — stop their running clock
 * first (don't auto-start ours). Returns JSON so the modal closes and the
 * operation page revalidates in place.
 */
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId, userId } = await requirePermissions(request, {});
  const serviceRole = getCarbonServiceRole();

  const formData = await request.formData();
  const jobOperationId = String(formData.get("jobOperationId") ?? "");
  if (!jobOperationId) {
    return data(
      { success: false },
      await flash(request, error(null, "Missing operation"))
    );
  }

  const op = await serviceRole
    .from("jobOperation")
    .select("id, jobId, assignee")
    .eq("id", jobOperationId)
    .eq("companyId", companyId)
    .maybeSingle();
  if (op.error || !op.data?.jobId) {
    return data(
      { success: false },
      await flash(request, error(op.error, "Operation not found"))
    );
  }

  if (op.data.assignee && op.data.assignee !== userId) {
    await endProductionEventsForJobOperation(serviceRole, {
      jobOperationId,
      employeeId: op.data.assignee,
      companyId
    });
  }

  const assigned = await assignBundleOperation(serviceRole, {
    operationId: jobOperationId,
    jobId: op.data.jobId,
    userId,
    companyId
  });
  if (assigned.error) {
    return data(
      { success: false },
      await flash(request, error(assigned.error, "Failed to pick up"))
    );
  }

  return data({ success: true });
}
