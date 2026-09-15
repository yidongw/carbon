import type { LoaderFunctionArgs } from "react-router";
import {
  getActiveJobOperationsByEmployee,
  getJobOperationsAssignedToEmployee,
  getRecentJobOperationsByEmployee
} from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 我的任务:已分配 / 进行中 / 最近,取自现有 MES RPC(分配给当前员工的工序)。
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) {
    return jsonResponse({ assigned: [], active: [], recent: [] });
  }

  const [assignedRes, activeRes, recentRes] = await Promise.all([
    getJobOperationsAssignedToEmployee(client, userId, companyId),
    getActiveJobOperationsByEmployee(client, { employeeId: userId, companyId }),
    getRecentJobOperationsByEmployee(client, { employeeId: userId, companyId })
  ]);

  const assigned = (assignedRes.data ?? []) as any[];
  const active = (activeRes.data ?? []) as any[];
  const recent = (recentRes.data ?? []) as any[];

  // 批量取工作中心名称(行里只有 workCenterId)。
  const wcIds = [
    ...new Set(
      [...assigned, ...active, ...recent]
        .map((o) => o.workCenterId)
        .filter(Boolean)
    )
  ];
  const wcMap = new Map<string, string>();
  if (wcIds.length) {
    const wc = await client
      .from("workCenter")
      .select("id, name")
      .in("id", wcIds);
    for (const w of (wc.data ?? []) as any[]) wcMap.set(w.id, w.name);
  }

  const title = (o: any) =>
    `${o.description ?? "工序"} · ${o.jobReadableId ?? ""}`.trim();
  const wc = (o: any) => wcMap.get(o.workCenterId) ?? "";

  return jsonResponse({
    assigned: assigned.map((o) => ({
      id: o.id,
      title: title(o),
      sub: [wc(o), "待开工"].filter(Boolean).join(" · "),
      tag: "待开工"
    })),
    active: active.map((o) => ({
      id: o.id,
      title: title(o),
      sub: `目标 ${o.targetQuantity ?? o.operationQuantity ?? 0} / 已报 ${o.quantityComplete ?? 0}`,
      tag: "进行中"
    })),
    recent: recent.map((o) => ({
      id: o.id,
      title: title(o),
      sub: [wc(o), "已完成"].filter(Boolean).join(" · "),
      tag: "已完成"
    }))
  });
}
