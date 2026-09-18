import type { LoaderFunctionArgs } from "react-router";
import {
  getActiveMaintenanceDispatchesByLocation,
  getMaintenanceDispatchesAssignedTo
} from "~/services/maintenance.service";
import {
  getMiniappLocationId,
  requireMiniappUser
} from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

function mapRow(d: any) {
  return {
    id: d.id as string,
    maintenanceDispatchId: d.maintenanceDispatchId ?? "",
    workCenterName: d.workCenterName ?? "",
    severity: d.severity ?? "",
    status: d.status ?? "",
    priority: d.priority ?? "",
    oeeImpact: d.oeeImpact ?? "No Impact",
    assignee: d.assignee ?? null,
    plannedStartTime: d.plannedStartTime ?? null
  };
}

/** 维护列表：对齐网页 `/x/maintenance`（全部 + 已分配给我）。 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) {
    return jsonResponse({ rows: [], assigned: [] });
  }

  const locationId = await getMiniappLocationId(client, userId, companyId);
  if (!locationId) {
    return jsonResponse({ rows: [], assigned: [] });
  }

  const [all, assigned] = await Promise.all([
    getActiveMaintenanceDispatchesByLocation(client, locationId),
    getMaintenanceDispatchesAssignedTo(client, userId)
  ]);

  return jsonResponse({
    rows: ((all.data ?? []) as any[]).map(mapRow),
    assigned: ((assigned.data ?? []) as any[]).map(mapRow)
  });
}
