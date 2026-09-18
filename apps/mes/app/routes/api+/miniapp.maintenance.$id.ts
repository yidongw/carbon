import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getActiveMaintenanceEventByEmployee,
  getMaintenanceDispatch,
  getMaintenanceDispatchEvents,
  getMaintenanceDispatchItems,
  getWorkCenterReplacementParts
} from "~/services/maintenance.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/** TipTap JSON → plain text for miniapp (no HTML renderer). */
function contentToText(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const walk = (node: any): string => {
    if (!node) return "";
    if (typeof node.text === "string") return node.text;
    if (Array.isArray(node.content)) {
      return node.content.map(walk).join(node.type === "paragraph" ? "\n" : "");
    }
    return "";
  };
  return walk(content).trim();
}

/**
 * 维护详情：对齐网页 `/x/dispatch/:id`。
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  const id = params.id ?? "";
  if (!companyId || !id) {
    return jsonResponse({ found: false });
  }

  const serviceRole = getCarbonServiceRole();
  const [dispatchRes, eventsRes, itemsRes, activeEventRes] = await Promise.all([
    getMaintenanceDispatch(serviceRole, id),
    getMaintenanceDispatchEvents(serviceRole, id),
    getMaintenanceDispatchItems(serviceRole, id),
    getActiveMaintenanceEventByEmployee(client, userId)
  ]);

  const dispatch = dispatchRes.data as any;
  if (!dispatch) {
    return jsonResponse({ found: false });
  }
  if (dispatch.companyId && dispatch.companyId !== companyId) {
    return jsonResponse({ found: false });
  }

  let replacementParts: {
    id: string;
    itemId: string;
    name: string;
    quantity: number;
    unitOfMeasureCode: string;
  }[] = [];
  if (dispatch.workCenterId) {
    const parts = await getWorkCenterReplacementParts(
      serviceRole,
      dispatch.workCenterId
    );
    replacementParts = ((parts.data ?? []) as any[]).map((p) => ({
      id: p.id as string,
      itemId: p.itemId as string,
      name: p.item?.name ?? p.itemId,
      quantity: Number(p.quantity ?? 1),
      unitOfMeasureCode: p.unitOfMeasureCode ?? "EA"
    }));
  }

  const events = ((eventsRes.data ?? []) as any[]).map((e) => ({
    id: e.id as string,
    employeeId: e.employeeId as string,
    startTime: e.startTime as string,
    endTime: (e.endTime as string) ?? null,
    duration: Number(e.duration ?? 0)
  }));

  const items = ((itemsRes.data ?? []) as any[]).map((it) => ({
    id: it.id as string,
    itemId: it.itemId as string,
    name: it.item?.name ?? "",
    quantity: Number(it.quantity ?? 0),
    unitOfMeasureCode: it.unitOfMeasureCode ?? "EA"
  }));

  const active = activeEventRes.data as any;
  const myActiveEventId =
    active && active.maintenanceDispatchId === id
      ? (active.id as string)
      : null;

  const totalDuration = events.reduce((s, e) => s + (e.duration || 0), 0);

  const procedure = dispatch.procedure as any;
  const procedureName = procedure?.name ?? "";
  const procedureText = procedure?.content
    ? contentToText(procedure.content)
    : "";

  return jsonResponse({
    found: true,
    id: dispatch.id,
    maintenanceDispatchId: dispatch.maintenanceDispatchId ?? "",
    status: dispatch.status ?? "Open",
    priority: dispatch.priority ?? "",
    severity: dispatch.severity ?? "",
    oeeImpact: dispatch.oeeImpact ?? "No Impact",
    workCenterId: dispatch.workCenterId ?? "",
    workCenterName: dispatch.workCenter?.name ?? "",
    description: contentToText(dispatch.content),
    procedureName,
    procedureText,
    myActiveEventId,
    totalDuration,
    events,
    items,
    replacementParts
  });
}
