import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { isPickingListLocked } from "~/services/models";
import { updatePickingListStatus } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 拣货单开始/完成,对齐网页 /x/picking/:id/status。锁定单(已完成/已取消)需在 ERP 重新开启。
export async function action({ request, params }: ActionFunctionArgs) {
  const { userId, companyId } = await requireMiniappUser(request);
  if (!companyId)
    return jsonResponse({ success: false, message: "未加入公司" });
  const id = params.id ?? "";
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const status = String(body.status ?? "");
  const valid = ["Draft", "In Progress", "Completed", "Cancelled"];
  if (!id || !valid.includes(status)) {
    return jsonResponse({ success: false, message: "参数错误" });
  }

  const serviceRole = getCarbonServiceRole();
  const cur = await serviceRole
    .from("pickingList")
    .select("status")
    .eq("id", id)
    .eq("companyId", companyId)
    .maybeSingle();
  if (
    cur.data &&
    isPickingListLocked(cur.data.status) &&
    !isPickingListLocked(status)
  ) {
    return jsonResponse({
      success: false,
      message: "该拣货单已锁定,请在 ERP 重新开启"
    });
  }

  const r = await updatePickingListStatus(
    serviceRole,
    id,
    status as any,
    userId,
    companyId
  );
  if (r.error) return jsonResponse({ success: false, message: "更新失败" });
  return jsonResponse({ success: true });
}
