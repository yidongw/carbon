import { getAuthAccountByAccessToken } from "@carbon/auth/auth.server";
import {
  getCarbonServiceRole,
  getUserScopedClient
} from "@carbon/auth/client.server";
import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { jsonResponse } from "./miniapp-response";

/**
 * 解析小程序请求的登录态:读取 `Authorization: Bearer <token>`(即登录接口返回的
 * Supabase access token)→ 得到 userId → 派生 companyId → 返回一个"以该用户身份"
 * 运行的 Supabase 客户端(RLS/SECURITY INVOKER 生效)。校验失败抛 401 Response。
 */
export async function requireMiniappUser(request: Request): Promise<{
  userId: string;
  companyId: string;
  client: SupabaseClient<Database>;
}> {
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) throw jsonResponse({ message: "未登录" }, { status: 401 });

  const account = await getAuthAccountByAccessToken(token);
  if (!account) {
    throw jsonResponse({ message: "登录已过期,请重新登录" }, { status: 401 });
  }

  const serviceRole = getCarbonServiceRole();
  const utc = await serviceRole
    .from("userToCompany")
    .select("companyId")
    .eq("userId", account.id)
    .limit(1)
    .maybeSingle();

  const client = await getUserScopedClient(account.id);

  return {
    userId: account.id,
    companyId: (utc.data?.companyId as string | undefined) ?? "",
    client
  };
}
