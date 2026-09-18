import type { LoaderFunctionArgs } from "react-router";
import { getOpenJobs } from "~/services/operations.service";
import {
  getMiniappLocationId,
  requireMiniappUser
} from "~/utils/miniapp-auth.server";
import { resolveUserNames } from "~/utils/miniapp-names.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 工单(在制):对齐网页 /x/jobs,读 `jobs` 视图,状态 Ready/In Progress/Paused。
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const locationId = await getMiniappLocationId(client, userId, companyId);
  if (!locationId) return jsonResponse({ rows: [] });

  const jobs = await getOpenJobs(client, { companyId, locationId });
  const rows = (jobs.data ?? []) as any[];

  const names = await resolveUserNames(
    client,
    rows.map((j) => j.assignee)
  );

  return jsonResponse({
    rows: rows.map((j) => ({
      id: j.id,
      jobId: j.jobId,
      item: j.itemReadableIdWithRevision ?? "",
      name: j.name ?? "",
      quantity: j.quantity ?? 0,
      quantityComplete: j.quantityComplete ?? 0,
      dueDate: j.dueDate ?? null,
      assignee: names.get(j.assignee) ?? "",
      status: j.status ?? ""
    }))
  });
}
