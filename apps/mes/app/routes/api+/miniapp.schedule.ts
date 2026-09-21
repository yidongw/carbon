import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getActiveJobOperationsByLocation,
  getCustomers,
  getWorkCentersByLocation
} from "~/services/operations.service";
import { makeDurations } from "~/utils/durations";
import {
  getMiniappLocationId,
  requireMiniappUser
} from "~/utils/miniapp-auth.server";
import { resolveUserNames } from "~/utils/miniapp-names.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 排程：对齐网页 `/x/operations`（工作中心看板数据）。
 * Query: `?workCenterId=`（可选，逗号分隔）`&search=`
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) {
    return jsonResponse({ columns: [], items: [] });
  }

  const locationId = await getMiniappLocationId(client, userId, companyId);
  if (!locationId) {
    return jsonResponse({ columns: [], items: [] });
  }

  const url = new URL(request.url);
  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
  const wcParam = url.searchParams.get("workCenterId") ?? "";
  const selectedWorkCenterIds = wcParam
    ? wcParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const serviceRole = getCarbonServiceRole();
  const [workCenters, operations] = await Promise.all([
    getWorkCentersByLocation(serviceRole, locationId),
    getActiveJobOperationsByLocation(
      serviceRole,
      locationId,
      selectedWorkCenterIds
    )
  ]);

  if (operations.error) {
    console.error(operations.error);
  }

  const activeWorkCenters = new Set<string>();
  for (const op of operations.data ?? []) {
    if (op.operationStatus === "In Progress" && op.workCenterId) {
      activeWorkCenters.add(op.workCenterId);
    }
  }

  let filteredOperations = selectedWorkCenterIds.length
    ? (operations.data?.filter((op) =>
        selectedWorkCenterIds.includes(op.workCenterId)
      ) ?? [])
    : (operations.data ?? []);

  if (search) {
    filteredOperations = filteredOperations.filter(
      (op) =>
        op.jobReadableId?.toLowerCase().includes(search) ||
        op.itemReadableId?.toLowerCase().includes(search) ||
        op.description?.toLowerCase().includes(search)
    );
  }

  const filteredWorkCenters =
    workCenters.data?.filter((wc: any) => {
      if (selectedWorkCenterIds.length) {
        return selectedWorkCenterIds.includes(wc.id!);
      }
      return true;
    }) ?? [];

  // Hide empty work centers on mobile unless filtering by WC (match common shop floor use)
  const wcWithOps = new Set(
    filteredOperations.map((op) => op.workCenterId).filter(Boolean)
  );

  const columns = filteredWorkCenters
    .filter((wc: any) => selectedWorkCenterIds.length || wcWithOps.has(wc.id))
    .map((wc: any) => ({
      id: wc.id as string,
      title: (wc.name as string) ?? "",
      active: activeWorkCenters.has(wc.id),
      isBlocked: !!(wc.isBlocked ?? false),
      blockingDispatchId: (wc.blockingDispatchId as string) ?? null,
      blockingDispatchReadableId:
        (wc.blockingDispatchReadableId as string) ?? null
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const customerIds = filteredOperations.map((op) => op.jobCustomerId);
  const customers = await getCustomers(serviceRole, companyId, customerIds);
  const customerMap = new Map(
    (customers.data ?? []).map((c: any) => [c.id as string, c.name as string])
  );

  const names = await resolveUserNames(
    client,
    filteredOperations.map((op) => op.assignee)
  );

  const items = filteredOperations.map((op) => {
    const operation = makeDurations(op as any);
    const durationMs =
      operation.setupDuration +
      Math.max(operation.laborDuration, operation.machineDuration);
    return {
      id: op.id as string,
      workCenterId: op.workCenterId as string,
      status: (op.operationStatus as string) ?? "",
      priority: (op.priority as string) ?? "",
      jobReadableId: op.jobReadableId ?? "",
      itemReadableId: op.itemReadableId ?? "",
      itemDescription: op.itemDescription ?? "",
      description: op.description ?? "",
      targetQuantity: Number(op.targetQuantity ?? op.operationQuantity ?? 0),
      quantityCompleted: Number(op.quantityComplete ?? 0),
      quantityScrapped: Number(op.quantityScrapped ?? 0),
      quantityReworked: Number(op.quantityReworked ?? 0),
      dueDate: (op.operationDueDate as string) ?? null,
      deadlineType: (op.jobDeadlineType as string) ?? null,
      customerName: customerMap.get(op.jobCustomerId) ?? "",
      salesOrderReadableId: (op.salesOrderReadableId as string) ?? "",
      assignee: names.get(op.assignee) ?? "",
      tags: (op.tags as string[]) ?? [],
      reworkId: (op.reworkId as string) ?? null,
      durationMs
    };
  });

  return jsonResponse({
    columns,
    items,
    workCenters: (workCenters.data ?? []).map((wc: any) => ({
      id: wc.id as string,
      name: (wc.name as string) ?? ""
    }))
  });
}
