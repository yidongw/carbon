import type { LoaderFunctionArgs } from "react-router";
import { getUpstreamOperations } from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 返工目标工序列表(可返回到的上游工序,对齐网页 path.to.reworkTargets)。
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { companyId, client } = await requireMiniappUser(request);
  const operationId = params.operationId ?? "";
  if (!companyId || !operationId) return jsonResponse({ rows: [] });
  const r = await getUpstreamOperations(client, operationId);
  const rows = ((r.data ?? []) as any[]).map((o) => ({
    id: o.id,
    description: o.description ?? "",
    item: o.jobMakeMethod?.item?.name ?? "",
    status: o.status ?? ""
  }));
  return jsonResponse({ rows });
}
