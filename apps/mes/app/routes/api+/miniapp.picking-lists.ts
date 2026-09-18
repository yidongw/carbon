import type { LoaderFunctionArgs } from "react-router";
import { getAssignedPickingLists } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 拣货单列表(分配给我、Draft/进行中),对齐网页 /x/picking。
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const r = await getAssignedPickingLists(client, userId);
  const rows = ((r.data ?? []) as any[]).map((p) => {
    const lineCount = p.lineCount ?? 0;
    const completedLineCount = p.completedLineCount ?? 0;
    return {
      id: p.id,
      pickingListId: p.pickingListId ?? "",
      status: p.status ?? "",
      locationName: p.locationName ?? "",
      dueDate: p.dueDate ?? null,
      lineCount,
      completedLineCount,
      progress:
        lineCount > 0 ? Math.round((completedLineCount / lineCount) * 100) : 0
    };
  });
  return jsonResponse({ rows });
}
