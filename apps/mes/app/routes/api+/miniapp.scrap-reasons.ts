import type { LoaderFunctionArgs } from "react-router";
import { getScrapReasonsList } from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 报废原因下拉数据(对齐网页 path.to.scrapReasons)。
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, client } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });
  const r = await getScrapReasonsList(client, companyId);
  return jsonResponse({
    rows: ((r.data ?? []) as any[]).map((x) => ({ id: x.id, name: x.name }))
  });
}
