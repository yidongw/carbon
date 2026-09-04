import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import {
  createApprovalRequest,
  getApprovalRulesForApprover,
  upsertApprovalRule
} from "~/modules/shared";

/**
 * TEMPORARY dev-only seed: put a few EXISTING, receivable purchase orders into
 * "Needs Approval" with a Pending approvalRequest whose approver is the current
 * user, so the approvals list has realistic data to test "Approve & Receive"
 * against (the demo/preview DB is persistent — seedDemoData edits don't apply).
 *
 * We reuse existing POs that already have receivable lines so that after
 * approval the PO lands on "To Receive" and a receipt can actually be created —
 * unlike fabricated line-less POs, which resolve to "Completed" and can't be
 * received. Visit /x/purchasing/approvals-seed, then use the approvals list.
 * REMOVE before merge.
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

  // A requester other than the viewer (the list hides your own requests).
  const { data: otherEmployees } = await client
    .from("employee")
    .select("id")
    .eq("companyId", companyId)
    .neq("id", userId)
    .limit(1);
  const requesterId = otherEmployees?.[0]?.id ?? userId;

  // Make the current user an approver for any amount (top tier), once.
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
  if (!alreadyTopApprover) {
    await upsertApprovalRule(client, {
      documentType: "purchaseOrder",
      approverGroupIds: [],
      defaultApproverId: userId,
      lowerBoundAmount: TOP_TIER_AMOUNT,
      enabled: true,
      companyId,
      createdBy: userId
    });
  }

  // Candidate POs: receivable status + has a non-comment line + no pending request.
  const { data: candidates } = await client
    .from("purchaseOrders")
    .select("id, purchaseOrderId, status, orderTotal")
    .eq("companyId", companyId)
    .in("status", RECEIVABLE_STATUSES)
    .limit(30);

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
    if (!line) continue;

    const { data: pending } = await client
      .from("approvalRequest")
      .select("id")
      .eq("documentId", poId)
      .eq("status", "Pending")
      .limit(1)
      .maybeSingle();
    if (pending) continue;

    await client
      .from("purchaseOrder")
      .update({ status: "Needs Approval" })
      .eq("id", poId)
      .eq("companyId", companyId);

    await createApprovalRequest(client, {
      documentType: "purchaseOrder",
      documentId: poId,
      requestedBy: requesterId,
      amount: po.orderTotal ?? 0,
      companyId,
      createdBy: requesterId
    });

    seeded.push(po.purchaseOrderId ?? poId);
  }

  if (seeded.length === 0) {
    return Response.json(
      {
        error:
          "No eligible purchase orders to seed (need existing POs with lines in Draft/Planned/To Receive). Create a PO with at least one item line first."
      },
      { status: 400 }
    );
  }

  throw redirect("/x/purchasing/approvals");
}

export default function ApprovalsSeedRoute() {
  return null;
}
