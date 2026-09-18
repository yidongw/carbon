import type { LoaderFunctionArgs } from "react-router";
import { getJobOperationsAssignedToEmployee } from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 我的任务：已分配工序列表。
 * 小程序端按状态分 Tab：进行中 / 就绪 / 待处理 / 已分配（不再返回「最近」）。
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) {
    return jsonResponse({ assigned: [] });
  }

  const assignedRes = await getJobOperationsAssignedToEmployee(
    client,
    userId,
    companyId
  );
  const assigned = (assignedRes.data ?? []) as any[];

  const wcIds = [
    ...new Set(assigned.map((o) => o.workCenterId).filter(Boolean))
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

  return jsonResponse({
    assigned: assigned.map((o) => ({
      id: o.id,
      title: title(o),
      sub: wcMap.get(o.workCenterId) || "已分配",
      status: o.operationStatus ?? ""
    }))
  });
}
