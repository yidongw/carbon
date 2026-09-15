import type { LoaderFunctionArgs } from "react-router";
import { getMyCompletions, getMySalaryRecord } from "~/services/people.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 我的工资:本月薪资汇总(已赚/已发/待发)+ 本月已核准的计件明细。取自现有 people.service。
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
      status: null,
      completions: []
    });
  }

  const [recRes, compRes] = await Promise.all([
    getMySalaryRecord(client, userId, companyId, year, month),
    getMyCompletions(client, userId, companyId, year, month)
  ]);

  const completions = ((compRes.data ?? []) as any[]).map((r) => {
    const jo = r.jobOperation ?? {};
    const process = jo.process?.name ?? jo.description ?? "工序";
    const job = jo.job?.jobId ?? "";
    const unitCost = jo.insideUnitCost ?? 0;
    const quantity = r.quantity ?? 0;
    return {
      id: r.id,
      process,
      job,
      quantity,
      unitCost,
      earned: quantity * unitCost
    };
  });

  const s = recRes.data as any;
  const earnedFromRows = completions.reduce((sum, c) => sum + c.earned, 0);

  return jsonResponse({
    month: label,
    totalEarned: s?.totalEarned ?? earnedFromRows,
    totalPaid: s?.totalPaid ?? 0,
    amountOwed: s?.amountOwed ?? s?.totalEarned ?? earnedFromRows,
    status: s?.status ?? null,
    completions
  });
}
