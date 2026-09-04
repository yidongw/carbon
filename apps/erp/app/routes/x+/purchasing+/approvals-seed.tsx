import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  createApprovalRequest,
  getApprovalRulesForApprover,
  upsertApprovalRule
} from "~/modules/shared";

/**
 * TEMPORARY dev-only seed + diagnostic. Puts a few EXISTING receivable purchase
 * orders into "Needs Approval" with a Pending approvalRequest whose approver is
 * the current user, so "Approve & Receive" can be tested on the persistent
 * preview DB. Returns a JSON report of exactly what it found/did (no redirect),
 * so failures are debuggable. Visit /x/purchasing/approvals-seed, then go to the
 * approvals list. REMOVE before merge.
 */
const TOP_TIER_AMOUNT = 1_000_000_000; // grants upward authority over any amount
const TARGET_COUNT = 3;
const RECEIVABLE_STATUSES: (
  | "Draft"
  | "Planned"
  | "To Receive"
  | "To Receive and Invoice"
)[] = ["Draft", "Planned", "To Receive", "To Receive and Invoice"];

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing",
    bypassRls: true
  });

  const report: Record<string, unknown> = { companyId, userId };

  // Requester (must differ from viewer — the list hides your own requests).
  const { data: otherEmployees } = await client
    .from("employee")
    .select("id")
    .eq("companyId", companyId)
    .neq("id", userId)
    .limit(1);
  const requesterId = otherEmployees?.[0]?.id ?? userId;
  report.requesterId = requesterId;
  report.requesterIsSelf = requesterId === userId;

  // Ensure the current user is a top-tier approver.
  const existingRules = await getApprovalRulesForApprover(
    client,
    "purchaseOrder",
    companyId
  );
  report.enabledPoRuleCount = existingRules.data?.length ?? 0;
  const alreadyTopApprover = (existingRules.data ?? []).some(
    (r) =>
      r.defaultApproverId === userId &&
      (r.lowerBoundAmount ?? 0) >= TOP_TIER_AMOUNT
  );
  report.alreadyTopApprover = alreadyTopApprover;
  if (!alreadyTopApprover) {
    const ruleResult = await upsertApprovalRule(client, {
      documentType: "purchaseOrder",
      approverGroupIds: [],
      defaultApproverId: userId,
      lowerBoundAmount: TOP_TIER_AMOUNT,
      enabled: true,
      companyId,
      createdBy: userId
    });
    report.ruleCreated = !ruleResult.error;
    report.ruleError = ruleResult.error?.message ?? null;
  }

  // Overall PO status breakdown (helps see why there may be no candidates).
  const { data: allPos } = await client
    .from("purchaseOrders")
    .select("id, status")
    .eq("companyId", companyId)
    .limit(500);
  const statusCounts: Record<string, number> = {};
  for (const p of allPos ?? []) {
    const s = (p.status as string) ?? "null";
    statusCounts[s] = (statusCounts[s] ?? 0) + 1;
  }
  report.totalPoCount = allPos?.length ?? 0;
  report.statusCounts = statusCounts;

  // Candidates: receivable status.
  const { data: candidates } = await client
    .from("purchaseOrders")
    .select("id, purchaseOrderId, status, orderTotal")
    .eq("companyId", companyId)
    .in("status", RECEIVABLE_STATUSES)
    .limit(30);
  report.candidateCount = candidates?.length ?? 0;

  const decisions: Array<Record<string, unknown>> = [];
  const seeded: string[] = [];

  for (const po of candidates ?? []) {
    if (seeded.length >= TARGET_COUNT) break;
    const poId = po.id;
    if (!poId) continue;

    const { data: line } = await client
      .from("purchaseOrderLine")
      .select("id")
      .eq("purchaseOrderId", poId)
      .neq("purchaseOrderLineType", "Comment")
      .limit(1)
      .maybeSingle();
    if (!line) {
      decisions.push({ po: po.purchaseOrderId, skip: "no receivable line" });
      continue;
    }

    const { data: pending } = await client
      .from("approvalRequest")
      .select("id")
      .eq("documentId", poId)
      .eq("status", "Pending")
      .limit(1)
      .maybeSingle();
    if (pending) {
      decisions.push({ po: po.purchaseOrderId, skip: "already pending" });
      continue;
    }

    await client
      .from("purchaseOrder")
      .update({ status: "Needs Approval" })
      .eq("id", poId)
      .eq("companyId", companyId);

    const req = await createApprovalRequest(client, {
      documentType: "purchaseOrder",
      documentId: poId,
      requestedBy: requesterId,
      amount: po.orderTotal ?? 0,
      companyId,
      createdBy: requesterId
    });
    if (req.error) {
      decisions.push({ po: po.purchaseOrderId, error: req.error.message });
      continue;
    }

    decisions.push({ po: po.purchaseOrderId, seeded: true });
    seeded.push(po.purchaseOrderId ?? poId);
  }

  report.decisions = decisions;
  report.seeded = seeded;
  report.hint =
    seeded.length > 0
      ? "Seeded. Open /x/purchasing/approvals to see them."
      : "Nothing seeded — see statusCounts/candidateCount/decisions above.";

  return Response.json(report);
}

export default function ApprovalsSeedRoute() {
  return null;
}
