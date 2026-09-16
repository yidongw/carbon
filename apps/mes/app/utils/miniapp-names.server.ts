import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 批量把 userId 解析为姓名。列表视图里的 assignee 字段只存 userId,
 * 页面需要展示人名,故统一在这里一次查回。
 */
export async function resolveUserNames(
  client: SupabaseClient<Database>,
  ids: (string | null | undefined)[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(ids.filter(Boolean) as string[])];
  if (!unique.length) return map;
  const res = await client.from("user").select("id, fullName").in("id", unique);
  for (const u of (res.data ?? []) as any[]) map.set(u.id, u.fullName ?? "");
  return map;
}
