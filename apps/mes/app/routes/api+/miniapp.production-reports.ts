import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  approveProductionQuantity,
  getPendingProductionReports,
  insertReworkQuantity,
  insertScrapQuantity,
  invalidateProductionQuantity,
  setReportQuantity
} from "~/services/operations.service";
import { isMesOnlyEmployee } from "~/services/people.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { resolveUserNames } from "~/utils/miniapp-names.server";
import { jsonResponse } from "~/utils/miniapp-response";

const toCount = (v: unknown) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

// 报工审批:列出待审批报工 + 审批/驳回。对齐网页 /x/production-reports。
// 权限:非「仅 MES 车间工」账号可审批(与网页 canApproveProductionReports 的 !isMesOnly 一致)。
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [], canApprove: false });

  const serviceRole = getCarbonServiceRole();
  const canApprove = !(await isMesOnlyEmployee(serviceRole, userId, companyId));
  const res = await getPendingProductionReports(serviceRole, companyId);
  const reports = (res.data ?? []) as any[];
  const names = await resolveUserNames(
    serviceRole,
    reports.map((r) => r.employeeId)
  );

  const rows = reports.map((r) => ({
    id: r.id,
    reportId: r.reportId ?? "",
    jobOperationId: r.jobOperationId,
    quantity: r.quantity ?? 0,
    rework: r.rework ?? 0,
    scrap: r.scrap ?? 0,
    employee: names.get(r.employeeId) ?? "",
    employeeId: r.employeeId ?? "",
    process: r.jobOperation?.process?.name ?? r.jobOperation?.description ?? "",
    job: r.jobOperation?.job?.jobId ?? "",
    item: r.jobOperation?.job?.item?.readableIdWithRevision ?? "",
    date: r.createdAt
  }));

  return jsonResponse({ rows, canApprove });
}

export async function action({ request }: ActionFunctionArgs) {
  const { userId, companyId } = await requireMiniappUser(request);
  if (!companyId)
    return jsonResponse({ success: false, message: "未加入公司" });

  const serviceRole = getCarbonServiceRole();
  if (await isMesOnlyEmployee(serviceRole, userId, companyId)) {
    return jsonResponse({ success: false, message: "无审批权限" });
  }

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const intent = String(body.intent ?? "");
  const id = String(body.id ?? "");
  if (!id) return jsonResponse({ success: false, message: "缺少记录" });
  const now = new Date();

  if (intent === "approve") {
    const q = toCount(body.quantity);
    const r = await approveProductionQuantity(serviceRole, {
      id,
      companyId,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      userId,
      quantity: q > 0 ? q : undefined
    });
    if (r.error) return jsonResponse({ success: false, message: "审批失败" });
    return jsonResponse({ success: true });
  }

  if (intent === "disapprove") {
    const completed = toCount(body.completed);
    const rework = toCount(body.rework);
    const scrap = toCount(body.scrap);
    const jobOperationId = String(body.jobOperationId ?? "");
    const reportId = String(body.reportId ?? "") || null;
    const employeeId = String(body.employeeId ?? "").trim() || userId;

    if (completed > 0) {
      const r = await approveProductionQuantity(serviceRole, {
        id,
        companyId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        userId,
        quantity: completed
      });
      if (r.error) return jsonResponse({ success: false, message: "操作失败" });
    } else {
      const r = await invalidateProductionQuantity(serviceRole, {
        id,
        companyId,
        userId,
        quantity: 0
      });
      if (r.error) return jsonResponse({ success: false, message: "操作失败" });
    }

    if (jobOperationId && reportId) {
      await setReportQuantity(serviceRole, {
        companyId,
        reportId,
        jobOperationId,
        employeeId,
        createdBy: userId,
        type: "Rework",
        quantity: rework
      });
      await setReportQuantity(serviceRole, {
        companyId,
        reportId,
        jobOperationId,
        employeeId,
        createdBy: userId,
        type: "Scrap",
        quantity: scrap
      });
    } else if (jobOperationId) {
      if (rework > 0)
        await insertReworkQuantity(serviceRole, {
          jobOperationId,
          quantity: rework,
          employeeId,
          companyId,
          createdBy: userId
        });
      if (scrap > 0)
        await insertScrapQuantity(serviceRole, {
          jobOperationId,
          quantity: scrap,
          employeeId,
          companyId,
          createdBy: userId
        });
    }
    return jsonResponse({ success: true });
  }

  return jsonResponse({ success: false, message: "未知操作" });
}
