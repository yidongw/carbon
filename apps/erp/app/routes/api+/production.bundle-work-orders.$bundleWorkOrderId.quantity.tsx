import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { updateBundleQuantity } from "~/modules/production";

export type BundleQuantityUpdateResult = Awaited<
  ReturnType<typeof updateBundleQuantity>
>;

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { bundleWorkOrderId } = params;
  if (!bundleWorkOrderId) {
    return data({ ok: false as const, reason: "not_found" as const });
  }

  const formData = await request.formData();
  const quantity = Number(formData.get("quantity"));
  // Permission already checked above; write with service role so RLS can't
  // silently no-op the job.quantity update (same pattern as job recalc).
  const serviceRole = await getCarbonServiceRole();

  const result = await updateBundleQuantity(
    client,
    {
      bundleWorkOrderId,
      quantity,
      companyId,
      updatedBy: userId
    },
    serviceRole
  );

  return data(result);
}
