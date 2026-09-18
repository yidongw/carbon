import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { addMaintenanceDispatchItem } from "~/services/maintenance.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 备件增删：对齐网页 `/x/dispatch/:id/item`。
 * Body: { action: 'add'|'delete', itemId, quantity?, unitOfMeasureCode? }
 * delete 的 itemId = maintenanceDispatchItem.id
 * add 的 itemId = catalog item id
 */
export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed" }, { status: 405 });
  }

  const { userId, companyId } = await requireMiniappUser(request);
  const dispatchId = params.id ?? "";
  if (!companyId || !dispatchId) {
    return jsonResponse(
      { success: false, message: "参数错误" },
      { status: 400 }
    );
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { success: false, message: "无效请求" },
      { status: 400 }
    );
  }

  const actionType = body.action as "add" | "delete";
  const serviceRole = getCarbonServiceRole();

  if (actionType === "add") {
    const itemId = String(body.itemId ?? "");
    const quantity = Number(body.quantity ?? 0);
    const unitOfMeasureCode = String(body.unitOfMeasureCode || "EA");
    if (!itemId) {
      return jsonResponse(
        { success: false, message: "请选择备件" },
        { status: 400 }
      );
    }
    if (!quantity || quantity <= 0) {
      return jsonResponse(
        { success: false, message: "数量无效" },
        { status: 400 }
      );
    }
    const result = await addMaintenanceDispatchItem(serviceRole, {
      maintenanceDispatchId: dispatchId,
      itemId,
      quantity,
      unitOfMeasureCode,
      companyId,
      createdBy: userId
    });
    if (result.error) {
      return jsonResponse(
        { success: false, message: result.error.message },
        { status: 500 }
      );
    }
    return jsonResponse({
      success: true,
      message: "已添加备件",
      id: result.data?.id
    });
  }

  if (actionType === "delete") {
    const itemId = String(body.itemId ?? "");
    if (!itemId) {
      return jsonResponse(
        { success: false, message: "缺少备件行" },
        { status: 400 }
      );
    }
    const result = await serviceRole.functions.invoke("issue", {
      body: {
        type: "maintenanceDispatchUnissue",
        maintenanceDispatchItemId: itemId,
        companyId,
        userId
      }
    });
    if (result.error) {
      return jsonResponse(
        { success: false, message: "移除失败" },
        { status: 500 }
      );
    }
    return jsonResponse({ success: true, message: "已移除备件" });
  }

  return jsonResponse({ success: false, message: "未知操作" }, { status: 400 });
}
