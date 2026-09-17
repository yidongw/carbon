import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 物料列表/搜索 —— 对齐网页 IssueMaterialModal 的 item Combobox。
 * 无 q 时返回公司活跃物料列表;有 q 时按编码/名称筛选。
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const serviceRole = getCarbonServiceRole();

  let query = serviceRole
    .from("item")
    .select("id, readableId, name, readableIdWithRevision")
    .eq("companyId", companyId)
    .eq("active", true)
    .order("readableId", { ascending: true })
    .limit(100);

  if (q) {
    query = query.or(
      `readableId.ilike.%${q}%,name.ilike.%${q}%,readableIdWithRevision.ilike.%${q}%`
    );
  }

  const r = await query;
  if (r.error) {
    console.error("[miniapp.items]", r.error.message);
    return jsonResponse({ rows: [], message: r.error.message });
  }
  return jsonResponse({
    rows: ((r.data ?? []) as any[]).map((x) => ({
      id: x.id as string,
      name:
        (x.readableIdWithRevision as string) || (x.readableId as string) || "",
      desc: (x.name as string) || ""
    }))
  });
}
