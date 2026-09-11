import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { bindGarmentRfidExternalCodes } from "~/modules/production";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const formData = await request.formData();
  const bundleWorkOrderId = formData.get("bundleWorkOrderId")?.toString();
  const rawExternalCodes = formData
    .getAll("externalCode")
    .map((value) => value.toString())
    .filter(Boolean);

  if (!bundleWorkOrderId) {
    return data(
      { ok: false as const, bound: 0 },
      await flash(request, error(null, "Missing bundle work order"))
    );
  }

  const result = await bindGarmentRfidExternalCodes(client, {
    bundleWorkOrderId,
    companyId,
    userId,
    rawExternalCodes
  });

  if (result.error) {
    return data(
      {
        ok: false as const,
        bound: 0,
        reason: result.reason,
        uniqueCount: result.uniqueCount,
        expectedCount: result.expectedCount
      },
      await flash(request, error(result.error, result.error.message))
    );
  }

  return data(
    { ok: true as const, bound: result.bound },
    await flash(request, success(`已绑定 ${result.bound} 件水洗唛芯片`))
  );
}
