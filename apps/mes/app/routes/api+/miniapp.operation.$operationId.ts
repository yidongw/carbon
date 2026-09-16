import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import type { LoaderFunctionArgs } from "react-router";
import {
  getJobOperationById,
  getProductionEventsForJobOperation,
  getProductionQuantitiesForJobOperation,
  getWorkCenter
} from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { resolveUserNames } from "~/utils/miniapp-names.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 工序执行详情:对齐网页 /x/operation/:operationId 的字段。
// 统计数字用「未作废报工记录实时求和」,与网页 sumLiveQuantity 口径一致。
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  const operationId = params.operationId ?? "";
  if (!companyId || !operationId) {
    return jsonResponse({ found: false });
  }

  const opRes = await getJobOperationById(client, operationId);
  const op = (opRes.data ?? [])[0] as any;
  if (!op) return jsonResponse({ found: false });

  // 实时求和(未作废)。
  const qRes = await getProductionQuantitiesForJobOperation(
    client,
    operationId
  );
  const quantities = (qRes.data ?? []) as any[];
  const sum = (type: string, pred?: (q: any) => boolean) =>
    quantities
      .filter((q) => q.type === type && (!pred || pred(q)))
      .reduce((s, q) => s + (q.quantity ?? 0), 0);
  const completed = sum("Production");
  const rework = sum("Rework");
  const scrap = sum("Scrap");
  const pending = sum("Production", (q) => q.paymentYear == null);

  // 是否有进行中的生产事件(未结束)。
  const eRes = await getProductionEventsForJobOperation(client, {
    operationId,
    userId
  });
  const active = ((eRes.data ?? []) as any[]).some((e) => !e.endTime);

  // 工作中心名。
  let workCenter = "";
  if (op.workCenterId) {
    try {
      const wc = await getWorkCenter(client, op.workCenterId);
      workCenter = wc.data?.name ?? "";
    } catch {
      /* 忽略 */
    }
  }

  // 分包变体(款-色-码)。
  let variant = "";
  if (op.jobId) {
    const b = await client
      .from("bundleWorkOrders")
      .select("attributeLabel")
      .eq("jobId", op.jobId)
      .eq("companyId", companyId)
      .maybeSingle();
    variant = localizeVariantAttributeLabel(b.data?.attributeLabel, "zh");
  }

  const names = await resolveUserNames(client, [op.assignee]);
  const target =
    op.targetQuantity && op.targetQuantity > 0
      ? op.targetQuantity
      : (op.operationQuantity ?? 0);

  return jsonResponse({
    found: true,
    id: op.id,
    readableId: op.jobReadableId ?? "",
    description: op.description ?? "",
    itemReadableId: op.itemReadableId ?? "",
    itemDescription: op.itemDescription ?? "",
    variant,
    unitOfMeasure: op.itemUnitOfMeasure ?? "",
    status: op.operationStatus ?? "",
    assignee: names.get(op.assignee) ?? "",
    assigneeId: op.assignee ?? "",
    isMine: op.assignee === userId,
    completed,
    target,
    rework,
    scrap,
    pending,
    deadlineType: op.jobDeadlineType ?? null,
    dueDate: op.operationDueDate ?? op.jobDueDate ?? null,
    workCenter,
    active
  });
}
