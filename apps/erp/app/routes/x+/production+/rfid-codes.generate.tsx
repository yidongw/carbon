import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { generateGarmentRfidCodesForBundles } from "~/modules/production";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const formData = await request.formData();
  const bundleWorkOrderIds = formData
    .getAll("bundleWorkOrderId")
    .map((value) => value.toString())
    .filter(Boolean);

  if (bundleWorkOrderIds.length === 0) {
    return data(
      { ok: false as const, generated: 0 },
      await flash(request, error(null, "No bundle work orders selected"))
    );
  }

  const result = await generateGarmentRfidCodesForBundles(client, {
    bundleWorkOrderIds,
    companyId,
    createdBy: userId
  });

  if (result.error) {
    return data(
      { ok: false as const, generated: 0 },
      await flash(request, error(result.error, "Failed to generate RFID codes"))
    );
  }

  return data(
    { ok: true as const, generated: result.generated },
    await flash(
      request,
      success(
        result.generated > 0
          ? `Generated ${result.generated} RFID codes`
          : "All selected bundles already have RFID codes"
      )
    )
  );
}
