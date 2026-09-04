import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  createApprovalRequest,
  getApprovalRulesForApprover,
  upsertApprovalRule
} from "~/modules/shared";

/**
 * TEMPORARY dev-only seed + diagnostic (RESOURCE route — no component, returns
 * raw JSON). Finds existing purchase orders that still have an unreceived item
 * line, puts a few into "Needs Approval" with a Pending approvalRequest whose
 * approver is the current user, so "Approve & Receive" can be tested on the
 * persistent preview DB (seedDemoData edits don't reach it). REMOVE before merge.
 */
const TOP_TIER_AMOUNT = 1_000_000_000; // grants upward authority over any amount
const TARGET_COUNT = 3;

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

  // Ensure the current user is a top-tier approver (once).
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

  // POs that still have an unreceived, item-backed line (receivable after
  // approval), regardless of current status. Dedupe the PO ids.
  const { data: lines } = await client
    .from("purchaseOrderLine")
    .select("purchaseOrderId")
    .eq("companyId", companyId)
    .not("itemId", "is", null)
    .or("receivedComplete.is.null,receivedComplete.eq.false")
    .limit(300);
  const candidatePoIds = Array.from(
    new Set((lines ?? []).map((l) => l.purchaseOrderId).filter(Boolean))
  );
  report.receivablePoCount = candidatePoIds.length;

  const decisions: Array<Record<string, unknown>> = [];
  const seeded: string[] = [];

  for (const poId of candidatePoIds) {
    if (seeded.length >= TARGET_COUNT) break;
    if (!poId) continue;

    const { data: po } = await client
      .from("purchaseOrders")
      .select("id, purchaseOrderId, status, orderTotal")
      .eq("id", poId)
      .single();
    if (!po) continue;

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
      : "Nothing seeded — see receivablePoCount / decisions above.";

  return Response.json(report);
}
