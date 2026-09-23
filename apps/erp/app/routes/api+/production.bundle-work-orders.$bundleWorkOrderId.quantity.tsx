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

  try {
    const { client, companyId, userId } = await requirePermissions(request, {
      update: "production"
    });

    const { bundleWorkOrderId } = params;
    if (!bundleWorkOrderId) {
      return data({ ok: false as const, reason: "not_found" as const });
    }

    const formData = await request.formData();
    const raw = formData.get("quantity");
    const quantity = Number(raw);
    if (!Number.isFinite(quantity)) {
      return data({
        ok: false as const,
        reason: "save" as const,
        message: `Invalid quantity: ${String(raw)}`
      });
    }

    // Prefer service role for the write; fall back to the user client if the
    // service role isn't available in this environment.
    let writeClient = client;
    try {
      writeClient = await getCarbonServiceRole();
    } catch (error) {
      console.error(
        "[bundle-qty] service role unavailable, using user client",
        error
      );
    }

    const result = await updateBundleQuantity(
      client,
      {
        bundleWorkOrderId,
        quantity,
        companyId,
        updatedBy: userId
      },
      writeClient
    );

    return data(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    console.error("[bundle-qty] action failed", error);
    return data({
      ok: false as const,
      reason: "save" as const,
      message
    });
  }
}
