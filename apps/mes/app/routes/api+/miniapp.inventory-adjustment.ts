import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { insertManualInventoryAdjustment } from "~/services/inventory.service";
import {
  getMiniappLocationId,
  requireMiniappUser
} from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/** 手动增减库存 — 对齐 MES POST /x/adjustment */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return jsonResponse(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) {
    return jsonResponse({ success: false, message: "缺少公司" });
  }

  const body = (await request.json().catch(() => ({}))) as {
    itemId?: string;
    quantity?: number;
    storageUnitId?: string | null;
    entryType?: "Positive Adjmt." | "Negative Adjmt.";
  };

  const itemId = body.itemId ?? "";
  const quantity = Number(body.quantity ?? 0);
  const entryType = body.entryType;
  if (!itemId) {
    return jsonResponse({ success: false, message: "请选择物料" });
  }
  if (
    !entryType ||
    !["Positive Adjmt.", "Negative Adjmt."].includes(entryType)
  ) {
    return jsonResponse({ success: false, message: "无效调整类型" });
  }
  if (!Number.isFinite(quantity) || quantity < 1) {
    return jsonResponse({ success: false, message: "数量须大于 0" });
  }

  const locationId = await getMiniappLocationId(client, userId, companyId);
  if (!locationId) {
    return jsonResponse({ success: false, message: "未配置库位" });
  }

  // Exclude Batch/Serial — same as MES AdjustInventory Combobox filter
  const serviceRole = getCarbonServiceRole();
  const item = await serviceRole
    .from("item")
    .select("id, itemTrackingType, companyId")
    .eq("id", itemId)
    .eq("companyId", companyId)
    .single();
  if (item.error || !item.data) {
    return jsonResponse({ success: false, message: "物料不存在" });
  }
  if (["Batch", "Serial"].includes(item.data.itemTrackingType ?? "")) {
    return jsonResponse({
      success: false,
      message: "批次/序列号物料请通过其他流程调整"
    });
  }

  const result = await insertManualInventoryAdjustment(serviceRole, {
    itemId,
    locationId,
    storageUnitId: body.storageUnitId || undefined,
    entryType,
    quantity,
    companyId,
    createdBy: userId
  });

  if (result.error) {
    const raw = result.error.message ?? "";
    const message =
      raw === "Insufficient quantity for negative adjustment"
        ? "库存不足，无法移除"
        : raw || "调整失败";
    return jsonResponse({ success: false, message });
  }

  return jsonResponse({ success: true });
}
