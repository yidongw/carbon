import { getUserById } from "@carbon/auth/users.server";
import type { LoaderFunctionArgs } from "react-router";
import { getActiveJobOperationsByEmployee } from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 「我的」页身份信息:当前登录员工的真实姓名 / 公司 / 工作中心(取自档案与进行中工序)。
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);

  const userRes = await getUserById(userId);
  const u = userRes.data;
  const name =
    [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim() || "员工";
  const initial = (u?.firstName || name || "员").slice(0, 1);
  const avatarUrl = (u as any)?.avatarUrl ?? null;

  let companyName: string | null = null;
  let workCenter: string | null = null;

  if (companyId) {
    const [coRes, activeRes] = await Promise.all([
      client.from("company").select("name").eq("id", companyId).maybeSingle(),
      getActiveJobOperationsByEmployee(client, {
        employeeId: userId,
        companyId
      })
    ]);
    companyName = (coRes.data as any)?.name ?? null;

    const cur = (activeRes.data ?? [])[0] as any;
    if (cur?.workCenterId) {
      const wc = await client
        .from("workCenter")
        .select("name")
        .eq("id", cur.workCenterId)
        .maybeSingle();
      workCenter = (wc.data as any)?.name ?? null;
    }
  }

  return jsonResponse({ name, initial, avatarUrl, companyName, workCenter });
}
