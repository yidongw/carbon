import type { LoaderFunctionArgs } from "react-router";
import { getMasterWorkOrdersList } from "~/services/bundle.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { resolveUserNames } from "~/utils/miniapp-names.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 主工单:对齐网页 /x/master-work-orders,读 `masterWorkOrders` 视图,
// 并聚合各主工单下分包工单的数量(bundleCount / processCount / 已报数)。
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, client } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const masters = await getMasterWorkOrdersList(client, companyId);
  const masterRows = (masters.data ?? []) as any[];

  const masterIds = masterRows.map((m) => m.id).filter(Boolean) as string[];

  const bundleStats =
    masterIds.length > 0
      ? await client
          .from("bundleWorkOrders")
          .select("masterWorkOrderId, quantityComplete, processCount, quantity")
          .in("masterWorkOrderId", masterIds)
          .eq("companyId", companyId)
      : { data: [] as any[] };

  const statsMap: Record<
    string,
    { bundleCount: number; processCount: number; reportedQuantity: number }
  > = {};
  for (const b of (bundleStats.data ?? []) as any[]) {
    if (!b.masterWorkOrderId) continue;
    const s = statsMap[b.masterWorkOrderId] ?? {
      bundleCount: 0,
      processCount: 0,
      reportedQuantity: 0
    };
    s.bundleCount += 1;
    s.processCount = b.processCount ?? s.processCount;
    s.reportedQuantity += b.quantityComplete ?? 0;
    statsMap[b.masterWorkOrderId] = s;
  }

  const names = await resolveUserNames(
    client,
    masterRows.map((m) => m.assignee)
  );

  return jsonResponse({
    rows: masterRows.map((m) => {
      const s = statsMap[m.id] ?? {
        bundleCount: 0,
        processCount: 0,
        reportedQuantity: 0
      };
      const quantity = m.quantity ?? 0;
      const reported = s.reportedQuantity;
      return {
        id: m.id,
        wo: m.jobReadableId ?? "",
        style: m.readableIdWithRevision ?? "",
        itemName: m.itemName ?? "",
        quantity,
        reported,
        remaining: Math.max(0, quantity - reported),
        bundleCount: s.bundleCount,
        processCount: s.processCount,
        assignee: names.get(m.assignee) ?? "",
        dueDate: m.dueDate ?? null,
        status: m.status ?? ""
      };
    })
  });
}
