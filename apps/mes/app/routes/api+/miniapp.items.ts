import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 物料搜索 —— 对齐网页 IssueMaterialModal 的 item combobox。
 * BOM 为空时小程序仍可选手动物料发放。
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const serviceRole = getCarbonServiceRole();

  let query = serviceRole
    .from("item")
    .select("id, readableId, name")
    .eq("companyId", companyId)
    .eq("active", true)
    .order("readableId", { ascending: true })
    .limit(40);

  if (q) {
    query = query.or(
      `readableId.ilike.%${q}%,name.ilike.%${q}%,readableIdWithRevision.ilike.%${q}%`
    );
  }

  const r = await query;
  return jsonResponse({
    rows: ((r.data ?? []) as any[]).map((x) => ({
      id: x.id as string,
      name: (x.readableId as string) || "",
      desc: (x.name as string) || ""
    }))
  });
}
