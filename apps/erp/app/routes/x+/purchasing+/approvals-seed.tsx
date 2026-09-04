import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { insertPurchaseOrder } from "~/modules/purchasing";
import {
  createApprovalRequest,
  getApprovalRulesForApprover,
  upsertApprovalRule
} from "~/modules/shared";
import { path } from "~/utils/path";

/**
 * TEMPORARY dev-only seed: creates a few purchase orders in "Needs Approval"
 * with pending approvalRequests whose approver is the current user, so the
 * "awaiting my approval" list has data to show on the preview (whose DB is
 * persistent — seedDemoData edits don't apply). Visit /x/purchasing/approvals-seed
 * while logged in; it seeds and redirects to the approvals list.
 *
 * REMOVE before merge.
 */
const TOP_TIER_AMOUNT = 1_000_000_000; // grants upward authority over any amount
const TEST_AMOUNTS = [1250, 3800.5, 8600, 15400];

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, companyGroupId, userId } =
    await requirePermissions(request, {
      create: "purchasing",
      bypassRls: true
    });

  // A supplier for the orders.
  const { data: suppliers } = await client
    .from("supplier")
    .select("id, name")
    .eq("companyId", companyId)
    .limit(5);
  if (!suppliers || suppliers.length === 0) {
    return Response.json(
      { error: "No suppliers in this company — cannot seed." },
      { status: 400 }
    );
  }

  // The requester must be someone OTHER than the current user, since the
  // "awaiting my approval" list excludes the viewer's own submissions.
  const { data: otherEmployees } = await client
    .from("employee")
    .select("id")
    .eq("companyId", companyId)
    .neq("id", userId)
    .limit(1);
  const requesterId = otherEmployees?.[0]?.id;
  if (!requesterId) {
    return Response.json(
      {
        error:
          "No other employee to act as requester (the list hides your own requests). Add a second employee first."
      },
      { status: 400 }
    );
  }

  // Make the current user an approver for any amount: a top-tier rule grants
  // upward authority. Only add it once.
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
    const ruleResult = await upsertApprovalRule(client, {
      documentType: "purchaseOrder",
      approverGroupIds: [],
      defaultApproverId: userId,
      lowerBoundAmount: TOP_TIER_AMOUNT,
      enabled: true,
      companyId,
      createdBy: userId
    });
    if (ruleResult.error) {
      return Response.json(
        {
          error: `Failed to create approval rule: ${ruleResult.error.message}`
        },
        { status: 500 }
      );
    }
  }

  const created: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < TEST_AMOUNTS.length; i++) {
    const supplier = suppliers[i % suppliers.length];
    const amount = TEST_AMOUNTS[i];

    const po = await insertPurchaseOrder(client, {
      supplierId: supplier.id,
      companyId,
      companyGroupId,
      createdBy: requesterId,
      status: "Needs Approval"
    });
    if (po.error || !po.data) {
      failed.push(`PO ${i + 1}: ${po.error?.message ?? "insert failed"}`);
      continue;
    }

    const req = await createApprovalRequest(client, {
      documentType: "purchaseOrder",
      documentId: po.data.id,
      requestedBy: requesterId,
      amount,
      companyId,
      createdBy: requesterId
    });
    if (req.error) {
      failed.push(
        `Request for ${po.data.purchaseOrderId}: ${req.error.message}`
      );
      continue;
    }

    created.push(po.data.purchaseOrderId);
  }

  if (created.length === 0) {
    return Response.json(
      { error: "Nothing was created", failed },
      { status: 500 }
    );
  }

  throw redirect(path.to.purchasingApprovals);
}

export default function ApprovalsSeedRoute() {
  return null;
}
