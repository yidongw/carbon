import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { setPickingListLineQuantity } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/** 非追溯物料拣货/缺货/撤销 — 对齐 MES line/quantity */
export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return jsonResponse(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }
  const { userId, companyId } = await requireMiniappUser(request);
  if (!companyId || !params.id) {
    return jsonResponse({ success: false, message: "缺少参数" });
  }

  const body = (await request.json().catch(() => ({}))) as {
    pickingListLineId?: string;
    quantity?: number;
    markShort?: boolean;
  };
  const pickingListLineId = body.pickingListLineId ?? "";
  const quantity = Number(body.quantity ?? 0);
  if (!pickingListLineId) {
    return jsonResponse({ success: false, message: "缺少行 ID" });
  }

  const serviceRole = getCarbonServiceRole();
  const result = await setPickingListLineQuantity(serviceRole, {
    pickingListLineId,
    quantity,
    markShort: !!body.markShort,
    userId,
    companyId
  });

  if (result.error) {
    const message =
      typeof result.error === "string"
        ? result.error
        : ((result.error as { message?: string }).message ?? "拣货失败");
    return jsonResponse({ success: false, message });
  }
  return jsonResponse({ success: true });
}
