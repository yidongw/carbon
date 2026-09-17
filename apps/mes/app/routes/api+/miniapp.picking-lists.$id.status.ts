import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { isPickingListLocked, pickingListStatus } from "~/services/models";
import { updatePickingListStatus } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

type PickingListStatus = (typeof pickingListStatus)[number];

/** 开始/完成拣货单 — 对齐 MES /x/picking/:id/status */
export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return jsonResponse(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }
  const { userId, companyId } = await requireMiniappUser(request);
  const pickingListId = params.id ?? "";
  if (!companyId || !pickingListId) {
    return jsonResponse({ success: false, message: "缺少参数" });
  }

  const body = (await request.json().catch(() => ({}))) as { status?: string };
  const status = body.status ?? "";
  if (!pickingListStatus.includes(status as PickingListStatus)) {
    return jsonResponse({ success: false, message: "无效状态" });
  }

  const serviceRole = getCarbonServiceRole();
  const current = await serviceRole
    .from("pickingList")
    .select("status")
    .eq("id", pickingListId)
    .eq("companyId", companyId)
    .single();

  if (
    isPickingListLocked(current.data?.status) &&
    !isPickingListLocked(status)
  ) {
    return jsonResponse({
      success: false,
      message: "请在 ERP 重新打开此拣货单"
    });
  }

  const result = await updatePickingListStatus(
    serviceRole,
    pickingListId,
    status as PickingListStatus,
    userId,
    companyId
  );
  if (result.error) {
    return jsonResponse({ success: false, message: "更新状态失败" });
  }
  return jsonResponse({ success: true });
}
