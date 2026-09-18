import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import { getAssignedPickingLists } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/** 已分配给我的拣货单 — 对齐 MES /x/picking */
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const serviceRole = getCarbonServiceRole();
  const r = await getAssignedPickingLists(serviceRole, userId);
  const rows = ((r.data ?? []) as any[]).filter(
    (pl) => !pl.companyId || pl.companyId === companyId
  );

  return jsonResponse({
    rows: rows.map((pl) => {
      const lineCount = Number(pl.lineCount ?? 0);
      const completedLineCount = Number(pl.completedLineCount ?? 0);
      return {
        id: pl.id as string,
        pickingListId: (pl.pickingListId as string) || "",
        status: (pl.status as string) || "",
        locationName: (pl.locationName as string) || "",
        dueDate: (pl.dueDate as string) || null,
        lineCount,
        completedLineCount,
        progress:
          lineCount > 0 ? Math.round((completedLineCount / lineCount) * 100) : 0
      };
    })
  });
}
