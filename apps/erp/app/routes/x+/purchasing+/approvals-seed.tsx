import { requirePermissions } from "@carbon/auth/auth.server";
import { getPurchaseOrderStatus } from "@carbon/utils";
import type { LoaderFunctionArgs } from "react-router";
import {
  createApprovalRequest,
  getApprovalRulesForApprover,
  upsertApprovalRule
} from "~/modules/shared";

/**
 * TEMPORARY dev-only seed + repair (RESOURCE route — returns raw JSON).
 *
 * 1. Repairs POs left stuck in "Needs Approval" without a pending request
 *    (recomputes their natural status from lines).
 * 2. Seeds a few receivable POs into "Needs Approval" with a Pending
 *    approvalRequest whose approver is the current user, using a VALID user id
 *    as the requester (approvalRequest.requestedBy FKs the user table, not
 *    employee), creating the request BEFORE flipping status so a failure never
 *    leaves an orphaned "Needs Approval" PO. REMOVE before merge.
 */
const TOP_TIER_AMOUNT = 1_000_000_000; // grants upward authority over any amount
const TARGET_COUNT = 3;

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing",
    bypassRls: true
  });

  const report: Record<string, unknown> = { companyId, userId };

  // ── 1) Repair orphaned "Needs Approval" POs (no pending request) ──
  const { data: naPos } = await client
    .from("purchaseOrders")
    .select("id")
    .eq("companyId", companyId)
    .eq("status", "Needs Approval")
    .limit(500);
  const naIds = (naPos ?? []).map((p) => p.id).filter(Boolean) as string[];
  let repaired = 0;
  if (naIds.length) {
    const { data: pendReqs } = await client
      .from("approvalRequest")
      .select("documentId")
      .eq("companyId", companyId)
      .eq("documentType", "purchaseOrder")
      .eq("status", "Pending")
      .in("documentId", naIds);
    const hasPending = new Set((pendReqs ?? []).map((r) => r.documentId));
    const orphaned = naIds.filter((id) => !hasPending.has(id));

    if (orphaned.length) {
      const { data: allLines } = await client
        .from("purchaseOrderLine")
        .select(
          "purchaseOrderId, purchaseOrderLineType, invoicedComplete, receivedComplete"
        )
        .in("purchaseOrderId", orphaned);
      const linesByPo = new Map<string, typeof allLines>();
      for (const l of allLines ?? []) {
        const key = l.purchaseOrderId as string;
        const arr = linesByPo.get(key) ?? [];
        arr!.push(l);
        linesByPo.set(key, arr);
      }
      for (const id of orphaned) {
        const { status } = getPurchaseOrderStatus(linesByPo.get(id) ?? []);
        await client
          .from("purchaseOrder")
          .update({ status })
          .eq("id", id)
          .eq("companyId", companyId);
        repaired++;
      }
    }
  }
  report.repaired = repaired;

  // ── 2) Requester: a real user (FK target), not the viewer ──
  const { data: otherUsers } = await client
    .from("user")
    .select("id")
    .neq("id", userId)
    .eq("active", true)
    .limit(1);
  const requesterId = otherUsers?.[0]?.id ?? userId;
  report.requesterId = requesterId;
  report.requesterIsSelf = requesterId === userId;

  // ── 3) Ensure the current user is a top-tier approver (once) ──
  const existingRules = await getApprovalRulesForApprover(
    client,
    "purchaseOrder",
    companyId
  );
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
    report.ruleError = ruleResult.error?.message ?? null;
  }

  // ── 4) Seed: POs with an unreceived item line; request FIRST, then status ──
  const { data: lines } = await client
    .from("purchaseOrderLine")
    .select("purchaseOrderId")
    .eq("companyId", companyId)
    .not("itemId", "is", null)
    .or("receivedComplete.is.null,receivedComplete.eq.false")
    .limit(300);
  const candidatePoIds = Array.from(
    new Set((lines ?? []).map((l) => l.purchaseOrderId).filter(Boolean))
  ) as string[];
  report.receivablePoCount = candidatePoIds.length;

  const decisions: Array<Record<string, unknown>> = [];
  const seeded: string[] = [];

  for (const poId of candidatePoIds) {
    if (seeded.length >= TARGET_COUNT) break;

    const { data: po } = await client
      .from("purchaseOrders")
      .select("id, purchaseOrderId, orderTotal")
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

    await client
      .from("purchaseOrder")
      .update({ status: "Needs Approval" })
      .eq("id", poId)
      .eq("companyId", companyId);

    decisions.push({ po: po.purchaseOrderId, seeded: true });
    seeded.push(po.purchaseOrderId ?? poId);
  }

  report.decisions = decisions;
  report.seeded = seeded;
  report.hint =
    seeded.length > 0
      ? `Seeded ${seeded.length}. Repaired ${repaired}. Open /x/purchasing/approvals.`
      : `Nothing seeded (repaired ${repaired}) — see decisions/requesterIsSelf.`;

  return Response.json(report);
}
