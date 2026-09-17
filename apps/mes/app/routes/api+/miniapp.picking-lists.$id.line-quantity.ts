import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { setPickingListLineQuantity } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 拣货明细:拣满 / 短拣 / 撤销,对齐网页 /x/picking/:id/line/quantity。
// quantity = 目标已拣数(0 = 撤销);markShort = 记为短拣。
export async function action({ request }: ActionFunctionArgs) {
  const { userId, companyId } = await requireMiniappUser(request);
  if (!companyId)
    return jsonResponse({ success: false, message: "未加入公司" });

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const pickingListLineId = String(body.pickingListLineId ?? "");
  const quantity = Number(body.quantity);
  const markShort = body.markShort === true;
  if (!pickingListLineId || !Number.isFinite(quantity) || quantity < 0) {
    return jsonResponse({ success: false, message: "参数错误" });
  }

  const serviceRole = getCarbonServiceRole();
  const r = await setPickingListLineQuantity(serviceRole, {
    pickingListLineId,
    quantity,
    markShort,
    userId,
    companyId
  });
  if (r.error) {
    const msg =
      typeof r.error === "string"
        ? r.error
        : ((r.error as any)?.message ?? "操作失败");
    return jsonResponse({ success: false, message: msg });
  }
  return jsonResponse({ success: true });
}
