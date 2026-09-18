import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { setPickingListLineQuantity } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

function friendlyError(error: unknown): string {
  const raw =
    typeof error === "string"
      ? error
      : ((error as { message?: string })?.message ?? "");
  if (!raw) return "拣货失败";
  if (raw.includes("Cannot coerce")) {
    return "公司不匹配，请切换到拣货单所属公司后再试";
  }
  if (raw.includes("No lineside destination")) {
    return "此行未设置线边仓位，无法拣货。请在 ERP 为该行指定线边仓。";
  }
  if (raw.includes("closed") || raw.includes("Reopen")) {
    return "拣货单已关闭，请在 ERP 重新打开";
  }
  if (raw.includes("Tracked items")) {
    return "批次/序列号物料请用扫描拣货";
  }
  return raw;
}

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

  // Prefer the line's own company (avoids coerce errors when the miniapp
  // company header drifted). Still require the line to belong to this list.
  const lineCheck = await serviceRole
    .from("pickingListLine")
    .select("id, companyId, pickingListId")
    .eq("id", pickingListLineId)
    .eq("pickingListId", params.id)
    .maybeSingle();
  if (!lineCheck.data) {
    return jsonResponse({ success: false, message: "拣货行不存在" });
  }
  const lineCompanyId = (lineCheck.data.companyId as string) || companyId;

  const result = await setPickingListLineQuantity(serviceRole, {
    pickingListLineId,
    quantity,
    markShort: !!body.markShort,
    userId,
    companyId: lineCompanyId
  });

  if (result.error) {
    return jsonResponse({
      success: false,
      message: friendlyError(result.error)
    });
  }
  return jsonResponse({ success: true });
}
