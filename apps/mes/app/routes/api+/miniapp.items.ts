import type { LoaderFunctionArgs } from "react-router";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 物料搜索(发放材料手动选料,对齐网页 IssueMaterialModal 的物料下拉)。
// 返回启用的库存(非序列/批次)物料,可按编号/名称模糊搜索。
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, client } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();

  let query = client
    .from("item")
    .select("id, readableIdWithRevision, name")
    .eq("companyId", companyId)
    .eq("active", true)
    .eq("itemTrackingType", "Inventory");

  if (q) {
    query = query.or(
      `readableId.ilike.%${q}%,name.ilike.%${q}%,readableIdWithRevision.ilike.%${q}%`
    );
  }

  const r = await query.order("readableId", { ascending: true }).limit(50);
  const rows = ((r.data ?? []) as any[]).map((it) => ({
    id: it.id,
    name: it.readableIdWithRevision ?? "",
    desc: it.name ?? ""
  }));
  return jsonResponse({ rows });
}
