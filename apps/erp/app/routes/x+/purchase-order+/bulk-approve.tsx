import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { trigger } from "@carbon/jobs";
import { NotificationEvent } from "@carbon/notifications";
import type { ActionFunctionArgs } from "react-router";
import {
  approveRequest,
  canApproveRequest,
  rejectRequest
} from "~/modules/shared";
import { getDatabaseClient } from "~/services/database.server";

/**
 * Bulk approve / reject purchase-order approval requests from the "awaiting my
 * approval" list page. Never trusts the client id list: each request is
 * re-loaded and re-checked with `canApproveRequest` server-side before the
 * decision is applied. Requests are processed independently — one failure does
 * not stop the rest — and the outcome is reported back per id.
 */
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId, userId } = await requirePermissions(request, {
    update: "purchasing"
  });

  const serviceRole = getCarbonServiceRole();
  const formData = await request.formData();
  const decision = String(formData.get("decision") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const ids = formData.getAll("ids").map(String).filter(Boolean);

  if (decision !== "Approved" && decision !== "Rejected") {
    return { error: { message: "Invalid decision" } };
  }
  if (ids.length === 0) {
    return { error: { message: "No approval requests selected" } };
  }

  // Load the selected requests (amount/type/document) so we can re-verify
  // authority before acting. Scoped to this company and still pending.
  const { data: requests, error: requestsError } = await serviceRole
    .from("approvalRequest")
    .select("id, documentType, documentId, amount, requestedBy, status")
    .in("id", ids)
    .eq("companyId", companyId)
    .eq("documentType", "purchaseOrder");

  if (requestsError || !requests) {
    return { error: { message: "Failed to load approval requests" } };
  }

  const db = getDatabaseClient();
  let approved = 0;
  const failed: { id: string; reason: string }[] = [];

  for (const req of requests) {
    if (req.status !== "Pending") {
      failed.push({ id: req.id, reason: "Not pending" });
      continue;
    }

    const canApprove = await canApproveRequest(
      serviceRole,
      {
        amount: req.amount,
        documentType: req.documentType,
        companyId
      },
      userId
    );
    if (!canApprove) {
      failed.push({ id: req.id, reason: "Not authorized" });
      continue;
    }

    const result =
      decision === "Approved"
        ? await approveRequest(db, req.id, userId, notes || undefined)
        : await rejectRequest(db, req.id, userId, notes || undefined);

    if (result.error) {
      failed.push({
        id: req.id,
        reason: result.error.message ?? "Failed to process"
      });
      continue;
    }

    approved += 1;

    // Notify the requester of the decision (best-effort; mirrors $orderId.tsx).
    if (req.requestedBy && req.requestedBy !== userId) {
      try {
        await trigger("notify", {
          event:
            decision === "Approved"
              ? NotificationEvent.ApprovalApproved
              : NotificationEvent.ApprovalRejected,
          companyId,
          documentId: req.documentId,
          documentType: "purchaseOrder",
          recipient: { type: "user", userId: req.requestedBy },
          from: userId
        });
      } catch (e) {
        console.error("Failed to trigger approval decision notification", e);
      }
    }
  }

  return { decision, approved, failed };
}
