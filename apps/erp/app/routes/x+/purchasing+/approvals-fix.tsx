import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

/**
 * TEMPORARY maintenance: reconcile stuck purchase-order approval requests on the
 * (persistent) preview DB. The demo seed used to create a Pending PO
 * approvalRequest without putting the PO into "Needs Approval", so approve/reject
 * (which guard on that status) always rolled back and the request could never be
 * resolved. This route flips those POs to "Needs Approval" and backfills a null
 * amount from the order total, so they can be approved/rejected normally.
 *
 * Visit /x/purchasing/approvals-fix once, then use the approvals list as usual.
 * REMOVE before merge.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    update: "purchasing",
    bypassRls: true
  });

  const { data: pending } = await client
    .from("approvalRequest")
    .select("id, documentId, amount")
    .eq("companyId", companyId)
    .eq("documentType", "purchaseOrder")
    .eq("status", "Pending");

  const fixed: string[] = [];

  for (const req of pending ?? []) {
    const { data: po } = await client
      .from("purchaseOrders")
      .select("id, status, orderTotal")
      .eq("id", req.documentId)
      .single();
    if (!po) continue;

    if (po.status !== "Needs Approval") {
      await client
        .from("purchaseOrder")
        .update({ status: "Needs Approval" })
        .eq("id", req.documentId)
        .eq("companyId", companyId);
      fixed.push(req.documentId);
    }

    if (req.amount == null && po.orderTotal != null) {
      await client
        .from("approvalRequest")
        .update({ amount: po.orderTotal })
        .eq("id", req.id);
    }
  }

  throw redirect("/x/purchasing/approvals");
}

export default function ApprovalsFixRoute() {
  return null;
}
