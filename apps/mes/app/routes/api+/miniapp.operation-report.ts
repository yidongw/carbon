import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import {
  finishJobOperation,
  insertProductionQuantity,
  insertReworkQuantity,
  insertScrapQuantity
} from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

function toCount(value: unknown): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// 记录数量报工:完成 / 返工 / 报废 一次提交,逻辑与网页 /x/report-quantity 完全一致。
// 小程序是车间工人端 —— 报工一律进「待审批」(不自动通过),由经理在报工审批处审核。
export async function action({ request }: ActionFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId)
    return jsonResponse({ success: false, message: "未加入公司" });

  const serviceRole = getCarbonServiceRole();
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  const jobOperationId = String(body.jobOperationId ?? "");
  const employeeId = String(body.employeeId ?? "").trim() || userId;
  const finished = toCount(body.finished);
  const rework = toCount(body.rework);
  const scrap = toCount(body.scrap);

  if (!jobOperationId) {
    return jsonResponse({ success: false, message: "缺少工序" });
  }
  if (finished + rework + scrap <= 0) {
    return jsonResponse({ success: false, message: "请输入大于 0 的数量" });
  }

  // 完成一道工序入库时,触发器用 jobOperation.updatedBy 作为台账 createdBy;
  // 未被触碰过的工序(Todo/未分配)updatedBy 为空会导致插入失败,先盖章。
  await serviceRole
    .from("jobOperation")
    .update({ updatedBy: userId })
    .eq("id", jobOperationId)
    .eq("companyId", companyId);

  let reportId: string | null = null;

  if (finished > 0) {
    const insert = await insertProductionQuantity(client, {
      jobOperationId,
      quantity: finished,
      employeeId,
      companyId,
      createdBy: userId,
      // 工人端:不自动通过,留待审批。
      paymentYear: null,
      paymentMonth: null
    });
    if (insert.error) {
      return jsonResponse({ success: false, message: "报工失败" });
    }
    reportId = insert.data?.[0]?.reportId ?? null;
    // 完成数量自动扣料(与 /x/complete 一致)。
    await serviceRole.functions.invoke("issue", {
      body: {
        id: jobOperationId,
        type: "jobOperation",
        quantity: finished,
        companyId,
        userId
      }
    });
  }

  if (rework > 0) {
    const insert = await insertReworkQuantity(client, {
      jobOperationId,
      quantity: rework,
      employeeId,
      companyId,
      createdBy: userId,
      reportId
    });
    if (insert.error) {
      return jsonResponse({ success: false, message: "返工上报失败" });
    }
    reportId = reportId ?? insert.data?.[0]?.reportId ?? null;
  }

  if (scrap > 0) {
    const insert = await insertScrapQuantity(client, {
      jobOperationId,
      quantity: scrap,
      employeeId,
      companyId,
      createdBy: userId,
      reportId
    });
    if (insert.error) {
      return jsonResponse({ success: false, message: "报废上报失败" });
    }
  }

  // 触发器已更新工序总数;若已达目标则完成工序(仅合格 + 报废计入终态,返工不算)。
  const op = await serviceRole
    .from("jobOperation")
    .select(
      "quantityComplete, quantityScrapped, targetQuantity, operationQuantity"
    )
    .eq("id", jobOperationId)
    .maybeSingle();
  if (op.data) {
    const target =
      op.data.targetQuantity && op.data.targetQuantity > 0
        ? op.data.targetQuantity
        : (op.data.operationQuantity ?? 0);
    const accounted =
      (op.data.quantityComplete ?? 0) + (op.data.quantityScrapped ?? 0);
    if (target > 0 && accounted >= target) {
      await finishJobOperation(serviceRole, {
        jobOperationId,
        userId,
        companyId
      });
    }
  }

  return jsonResponse({ success: true });
}
