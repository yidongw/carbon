import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import {
  endMaintenanceEvent,
  startMaintenanceEvent,
  updateMaintenanceDispatchStatus
} from "~/services/maintenance.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 维护计时：对齐网页 `/x/maintenance-event`。
 * Body: { action: 'Start'|'End'|'Complete', workCenterId?, eventId? }
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

  const actionType = body.action as "Start" | "End" | "Complete";
  const workCenterId = String(body.workCenterId ?? "");
  const eventId = body.eventId ? String(body.eventId) : undefined;
  const currentTime = new Date().toISOString();
  const serviceRole = getCarbonServiceRole();

  if (actionType === "Start") {
    if (!workCenterId) {
      return jsonResponse(
        { success: false, message: "缺少工作中心" },
        { status: 400 }
      );
    }
    const startEvent = await startMaintenanceEvent(serviceRole, {
      maintenanceDispatchId: dispatchId,
      employeeId: userId,
      workCenterId,
      startTime: currentTime,
      companyId,
      createdBy: userId
    });
    if (startEvent.error) {
      return jsonResponse(
        { success: false, message: startEvent.error.message },
        { status: 500 }
      );
    }
    await updateMaintenanceDispatchStatus(serviceRole, {
      dispatchId,
      status: "In Progress",
      actualStartTime: currentTime,
      updatedBy: userId
    });
    return jsonResponse({
      success: true,
      message: "已开始维护",
      eventId: startEvent.data?.id
    });
  }

  if (actionType === "End") {
    if (!eventId) {
      return jsonResponse(
        { success: false, message: "缺少事件 ID" },
        { status: 400 }
      );
    }
    const endEvent = await endMaintenanceEvent(serviceRole, {
      eventId,
      endTime: currentTime,
      updatedBy: userId
    });
    if (endEvent.error) {
      return jsonResponse(
        { success: false, message: endEvent.error.message },
        { status: 500 }
      );
    }
    return jsonResponse({ success: true, message: "已暂停维护" });
  }

  if (actionType === "Complete") {
    if (eventId) {
      await endMaintenanceEvent(serviceRole, {
        eventId,
        endTime: currentTime,
        updatedBy: userId
      });
    }
    const updateStatus = await updateMaintenanceDispatchStatus(serviceRole, {
      dispatchId,
      status: "Completed",
      actualEndTime: currentTime,
      completedAt: currentTime,
      updatedBy: userId
    });
    if (updateStatus.error) {
      return jsonResponse(
        { success: false, message: updateStatus.error.message },
        { status: 500 }
      );
    }
    return jsonResponse({
      success: true,
      message: "维护已完成",
      completed: true
    });
  }

  return jsonResponse({ success: false, message: "未知操作" }, { status: 400 });
}
