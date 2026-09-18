import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { assignBundleOperation } from "~/services/bundle.service";
import {
  endProductionEvent,
  endProductionEventsForJobOperation,
  finishJobOperation,
  insertScrapQuantity,
  markReworkFixed,
  startProductionEvent
} from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

const toInt = (v: unknown) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

// 工序动作:开始 / 暂停 / 完成 / 领取。逻辑对齐网页 /x/event、/x/finish、/x/pickup-operation。
// 状态流转(Todo/Ready→进行中→已暂停→已完成)由数据库触发器随生产事件/finish 自动完成。
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
  const act = String(body.action ?? "");
  if (!jobOperationId)
    return jsonResponse({ success: false, message: "缺少工序" });

  const opRes = await serviceRole
    .from("jobOperation")
    .select("id, jobId, assignee, workCenterId")
    .eq("id", jobOperationId)
    .eq("companyId", companyId)
    .maybeSingle();
  const op = opRes.data;
  if (!op) return jsonResponse({ success: false, message: "工序不存在" });

  // 结束当前用户在该工序上未结束的生产事件,并逐条过账到 GL(与网页 End 一致)。
  const endActiveEvents = async () => {
    const active = await serviceRole
      .from("productionEvent")
      .select("id")
      .eq("jobOperationId", jobOperationId)
      .eq("employeeId", userId)
      .is("endTime", null);
    for (const e of (active.data ?? []) as any[]) {
      await endProductionEvent(client, {
        id: e.id,
        endTime: new Date().toISOString(),
        employeeId: userId
      });
      await serviceRole.functions.invoke("post-production-event", {
        body: { productionEventId: e.id, userId, companyId }
      });
    }
  };

  if (act === "start") {
    // 开工:开一条 Labor 生产事件(触发器把工序置为「进行中」)。
    const started = await startProductionEvent(
      client,
      {
        jobOperationId,
        type: "Labor",
        workCenterId: op.workCenterId ?? undefined,
        startTime: new Date().toISOString(),
        employeeId: userId,
        companyId,
        createdBy: userId
      } as any,
      undefined
    );
    if (started.error)
      return jsonResponse({ success: false, message: "开工失败" });
    return jsonResponse({ success: true });
  }

  if (act === "pause") {
    await endActiveEvents();
    return jsonResponse({ success: true });
  }

  if (act === "finish") {
    await endActiveEvents();
    const fin = await finishJobOperation(serviceRole, {
      jobOperationId,
      userId,
      companyId
    });
    if (fin.error) return jsonResponse({ success: false, message: "完成失败" });
    return jsonResponse({ success: true });
  }

  if (act === "pickup") {
    // 领取 / 接手:若原属他人,先停掉他的计时,再把工序(及其工单)分配给自己。
    if (op.assignee && op.assignee !== userId) {
      await endProductionEventsForJobOperation(serviceRole, {
        jobOperationId,
        employeeId: op.assignee,
        companyId
      });
    }
    if (!op.jobId) return jsonResponse({ success: false, message: "缺少工单" });
    const assigned = await assignBundleOperation(serviceRole, {
      operationId: jobOperationId,
      jobId: op.jobId,
      userId,
      companyId
    });
    if (assigned.error)
      return jsonResponse({ success: false, message: "领取失败" });
    return jsonResponse({ success: true });
  }

  if (act === "scrap") {
    // 报废(选原因):记一条 Scrap 报工并自动扣料,逻辑对齐网页 /x/scrap。
    const quantity = toInt(body.quantity);
    if (quantity <= 0)
      return jsonResponse({ success: false, message: "请输入报废数量" });
    const scrapReasonId = String(body.scrapReasonId ?? "") || null;
    const notes = String(body.notes ?? "") || null;
    const ins = await insertScrapQuantity(client, {
      jobOperationId,
      quantity,
      scrapReasonId,
      notes,
      companyId,
      createdBy: userId,
      employeeId: userId
    });
    if (ins.error) return jsonResponse({ success: false, message: "报废失败" });
    await serviceRole.functions.invoke("issue", {
      body: {
        id: jobOperationId,
        type: "jobOperation",
        quantity,
        companyId,
        userId
      }
    });
    return jsonResponse({ success: true });
  }

  if (act === "rework") {
    // 返工(选目标工序):调用与网页 /x/trigger-rework 相同的边缘函数。
    if (!op.jobId) return jsonResponse({ success: false, message: "缺少工单" });
    const quantity = toInt(body.quantity);
    const targetJobOperationId = String(body.targetJobOperationId ?? "");
    const reason = String(body.reason ?? "").trim();
    if (quantity <= 0)
      return jsonResponse({ success: false, message: "请输入返工数量" });
    if (!targetJobOperationId)
      return jsonResponse({ success: false, message: "请选择目标工序" });
    if (!reason)
      return jsonResponse({ success: false, message: "请填写返工原因" });
    const inv = await serviceRole.functions.invoke("trigger-rework", {
      body: {
        jobId: op.jobId,
        triggeredAtJobOperationId: jobOperationId,
        targetJobOperationId,
        reason,
        quantity,
        companyId,
        userId
      }
    });
    if (inv.error) return jsonResponse({ success: false, message: "返工失败" });
    await serviceRole.functions.invoke("recalculate", {
      body: { type: "jobRequirements", id: op.jobId, companyId, userId }
    });
    return jsonResponse({ success: true });
  }

  if (act === "markFixed") {
    // 返工「标记已修」:把返工数量转回合格(经理),对齐网页 /x/rework-to-production。
    const quantity = toInt(body.quantity);
    if (quantity <= 0)
      return jsonResponse({ success: false, message: "请输入数量" });
    const r = await markReworkFixed(serviceRole, {
      jobOperationId,
      companyId,
      userId,
      quantity
    });
    if (r.error) return jsonResponse({ success: false, message: "标记失败" });
    return jsonResponse({ success: true });
  }

  if (act === "issue") {
    // 发放材料:把某材料按数量从库存领用到本工序,对齐网页 /x/issue(partToOperation)。
    const itemId = String(body.itemId ?? "");
    const materialId = String(body.materialId ?? "") || undefined;
    const quantity = Number(body.quantity);
    const adjustmentType = String(body.adjustmentType ?? "Negative Adjmt.");
    if (!itemId) return jsonResponse({ success: false, message: "缺少物料" });
    if (!Number.isFinite(quantity) || quantity <= 0)
      return jsonResponse({ success: false, message: "请输入数量" });
    const inv = await serviceRole.functions.invoke("issue", {
      body: {
        id: jobOperationId,
        type: "partToOperation",
        itemId,
        materialId,
        quantity,
        adjustmentType,
        companyId,
        userId
      }
    });
    if (inv.error)
      return jsonResponse({ success: false, message: "发放材料失败" });
    return jsonResponse({ success: true });
  }

  return jsonResponse({ success: false, message: "未知动作" });
}
