import { getCompanies } from "@carbon/auth";
import { getUserById } from "@carbon/auth/users.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getActiveJobOperationsByEmployee,
  getJobOperationsAssignedToEmployee,
  getRecentJobOperationsByEmployee
} from "~/services/operations.service";
import {
  getMyPendingCompletions,
  getMySalaryRecord
} from "~/services/people.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 工作台首页数据:当前登录员工的姓名/工作中心/进行中工序/今日报工与计件/本月已赚/待办。
// 全部取自现有 MES service + RPC,不含任何占位数据。
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);

  const userRes = await getUserById(userId);
  const u = userRes.data;
  const name =
    [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim() || "员工";
  const initial = (u?.firstName || name || "员").slice(0, 1);

  // 用户归属的所有公司(用于顶部「切换公司」)。company = 当前生效公司。
  const companiesRes = await getCompanies(client, userId);
  const companies = (companiesRes.data ?? [])
    .map((c: any) => ({
      id: c.companyId as string,
      name: (c.name as string) ?? ""
    }))
    .filter((c: { id: string }) => Boolean(c.id));
  const company =
    companies.find((c) => c.id === companyId) ?? companies[0] ?? null;

  if (!companyId) {
    return jsonResponse({
      hasCompany: false,
      worker: { name, initial, workCenter: null, onDuty: false },
      company,
      companies,
      todayPieces: 0,
      todayEarn: 0,
      monthEarn: 0,
      assignedCount: 0,
      activeCount: 0,
      current: null,
      todos: []
    });
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [activeRes, assignedRes, , salaryRes, pendingRes, todayRes] =
    await Promise.all([
      getActiveJobOperationsByEmployee(client, {
        employeeId: userId,
        companyId
      }),
      getJobOperationsAssignedToEmployee(client, userId, companyId),
      getRecentJobOperationsByEmployee(client, {
        employeeId: userId,
        companyId
      }),
      getMySalaryRecord(client, userId, companyId, year, month),
      getMyPendingCompletions(client, userId, companyId),
      client
        .from("productionQuantity")
        .select("quantity, jobOperation!inner(insideUnitCost)")
        .eq("employeeId", userId)
        .eq("companyId", companyId)
        .eq("type", "Production")
        .is("invalidatedAt", null)
        .gte("createdAt", todayStart.toISOString())
    ]);

  const active = (activeRes.data ?? []) as any[];
  const assigned = (assignedRes.data ?? []) as any[];
  const cur = active[0];

  let workCenter: string | null = null;
  if (cur?.workCenterId) {
    const wc = await client
      .from("workCenter")
      .select("name")
      .eq("id", cur.workCenterId)
      .maybeSingle();
    workCenter = wc.data?.name ?? null;
  }

  const todayRows = (todayRes.data ?? []) as any[];
  const todayPieces = todayRows.reduce((s, r) => s + (r.quantity ?? 0), 0);
  const todayEarn = todayRows.reduce(
    (s, r) => s + (r.quantity ?? 0) * (r.jobOperation?.insideUnitCost ?? 0),
    0
  );
  const monthEarn = salaryRes.data?.totalEarned ?? 0;

  const current = cur
    ? {
        jobReadableId: cur.jobReadableId ?? "",
        process: cur.description ?? "",
        done: cur.quantityComplete ?? 0,
        target: cur.targetQuantity ?? cur.operationQuantity ?? 0,
        status: cur.operationStatus ?? ""
      }
    : null;

  const todos: {
    key: string;
    icon: string;
    title: string;
    sub: string;
    badge: string;
    danger: boolean;
    status?: string;
  }[] = [];

  // 批量取待办工序的工作中心名(行里只有 workCenterId)。
  const todoWcIds = [
    ...new Set(assigned.map((o) => o.workCenterId).filter(Boolean))
  ];
  const todoWcMap = new Map<string, string>();
  if (todoWcIds.length) {
    const wcs = await client
      .from("workCenter")
      .select("id, name")
      .in("id", todoWcIds);
    for (const w of (wcs.data ?? []) as any[]) todoWcMap.set(w.id, w.name);
  }

  for (const op of assigned.slice(0, 6)) {
    if (cur && op.id === cur.id) continue;
    todos.push({
      key: op.id,
      icon: "📋",
      title: `${op.description ?? "工序"} · ${op.jobReadableId ?? ""}`.trim(),
      sub: todoWcMap.get(op.workCenterId) ?? "已分配",
      badge: "",
      danger: false,
      // 真实工序状态,前端据此本地化 + 上色。
      status: op.operationStatus ?? ""
    });
  }

  const pendingCount = pendingRes.data?.length ?? 0;
  if (pendingCount > 0) {
    todos.push({
      key: "pending",
      icon: "✅",
      title: "报工待审批",
      sub: "经理审批中",
      badge: String(pendingCount),
      danger: false
    });
  }

  return jsonResponse({
    hasCompany: true,
    worker: { name, initial, workCenter, onDuty: active.length > 0 },
    company,
    companies,
    todayPieces,
    todayEarn,
    monthEarn,
    assignedCount: assigned.length,
    activeCount: active.length,
    current,
    todos
  });
}
