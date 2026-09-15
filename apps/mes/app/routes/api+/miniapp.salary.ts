import type { LoaderFunctionArgs } from "react-router";
import {
  getMyCompletions,
  getMyPendingCompletions,
  getMySalaryRecord
} from "~/services/people.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

const earnedOf = (r: any) =>
  (r.quantity ?? 0) * (r.jobOperation?.insideUnitCost ?? 0);

const normalize = (r: any) => {
  const jo = r.jobOperation ?? {};
  return {
    id: r.id,
    process: jo.process?.name ?? jo.description ?? "工序",
    job: jo.job?.jobId ?? "",
    quantity: r.quantity ?? 0,
    unitCost: jo.insideUnitCost ?? 0,
    earned: earnedOf(r)
  };
};

// 我的工资:本月 已获得 / 已支付 / 欠款 / 待批准 四项 + 本月已核准计件明细。
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const label = `${year}年${month}月`;

  if (!companyId) {
    return jsonResponse({
      month: label,
      totalEarned: 0,
      totalPaid: 0,
      amountOwed: 0,
      pendingAmount: 0,
      approvedCount: 0,
      pendingCount: 0,
      status: null,
      completions: []
    });
  }

  const [recRes, compRes, pendingRes] = await Promise.all([
    getMySalaryRecord(client, userId, companyId, year, month),
    getMyCompletions(client, userId, companyId, year, month),
    getMyPendingCompletions(client, userId, companyId)
  ]);

  const completions = ((compRes.data ?? []) as any[]).map(normalize);
  const pending = (pendingRes.data ?? []) as any[];
  const pendingAmount = pending.reduce((s, r) => s + earnedOf(r), 0);

  const s = recRes.data as any;
  const earnedFromRows = completions.reduce((sum, c) => sum + c.earned, 0);
  const totalEarned = s?.totalEarned ?? earnedFromRows;
  const totalPaid = s?.totalPaid ?? 0;

  return jsonResponse({
    month: label,
    totalEarned,
    totalPaid,
    amountOwed: s?.amountOwed ?? totalEarned - totalPaid,
    pendingAmount,
    approvedCount: completions.length,
    pendingCount: pending.length,
    status: s?.status ?? null,
    completions
  });
}
