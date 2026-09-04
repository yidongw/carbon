import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  dedupeViolations,
  evaluateLinesForSurface
} from "@carbon/ee/storage-rules.server";
import type { ActionFunctionArgs } from "react-router";
import { finalizePurchaseOrder } from "~/modules/purchasing";
import { isApprovalRequired } from "~/modules/shared";
import { getUserDefaults } from "~/modules/users/users.server";

// Statuses a purchase order can be finalized from.
const FINALIZABLE_STATUSES = ["Draft", "Planned"];

type IneligibleReason = "approval" | "status" | "supplier";
type OrderSummary = {
  id: string;
  purchaseOrderId: string;
  orderTotal: number;
};
type Ineligible = OrderSummary & { reason: IneligibleReason };

/**
 * Bulk "Confirm & Receive" for purchase orders (Plan B). For every selected
 * order whose amount falls within the no-approval range, run the full pipeline
 * — finalize -> auto-create a receipt (full outstanding qty) -> post it — so the
 * order advances all the way to "To Invoice". Orders that need approval (over
 * the threshold), aren't in a finalizable status, or have an unapproved
 * supplier are excluded and reported back so the UI can list them.
 *
 * `mode=preview` returns the eligible / ineligible partition (for the confirm
 * dialog). `mode=commit` re-partitions server-side (never trusts the client's
 * id list) and runs the pipeline on the eligible orders only.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing",
    update: "inventory"
  });

  const serviceRole = getCarbonServiceRole();
  const formData = await request.formData();
  const mode = String(formData.get("mode") ?? "preview");
  const ids = formData.getAll("ids").map(String).filter(Boolean);

  if (ids.length === 0) {
    return { error: { message: "No purchase orders selected" } };
  }

  // The `purchaseOrders` view exposes the computed orderTotal + status.
  const { data: orders, error: ordersError } = await serviceRole
    .from("purchaseOrders")
    .select("id, purchaseOrderId, status, supplierId, orderTotal")
    .in("id", ids)
    .eq("companyId", companyId);

  if (ordersError || !orders) {
    return { error: { message: "Failed to load purchase orders" } };
  }

  // Supplier approval only gates finalization when a supplier approvalRule is
  // enabled; skip the supplier status lookup entirely otherwise.
  const supplierApprovalRequired = await isApprovalRequired(
    serviceRole,
    "supplier",
    companyId
  );
  const supplierStatusById = new Map<string, string>();
  if (supplierApprovalRequired) {
    const supplierIds = Array.from(
      new Set(
        orders.map((o) => o.supplierId).filter((s): s is string => Boolean(s))
      )
    );
    if (supplierIds.length > 0) {
      const { data: suppliers } = await serviceRole
        .from("suppliers")
        .select("id, status")
        .in("id", supplierIds);
      for (const s of suppliers ?? []) {
        supplierStatusById.set(s.id as string, (s.status as string) ?? "");
      }
    }
  }

  const eligible: OrderSummary[] = [];
  const ineligible: Ineligible[] = [];

  for (const o of orders) {
    const summary: OrderSummary = {
      id: o.id as string,
      purchaseOrderId: (o.purchaseOrderId as string) ?? (o.id as string),
      orderTotal: o.orderTotal ?? 0
    };

    if (!FINALIZABLE_STATUSES.includes(o.status ?? "")) {
      ineligible.push({ ...summary, reason: "status" });
      continue;
    }
    if (
      supplierApprovalRequired &&
      o.supplierId &&
      supplierStatusById.get(o.supplierId) !== "Active"
    ) {
      ineligible.push({ ...summary, reason: "supplier" });
      continue;
    }
    const approvalRequired = await isApprovalRequired(
      serviceRole,
      "purchaseOrder",
      companyId,
      summary.orderTotal
    );
    if (approvalRequired) {
      ineligible.push({ ...summary, reason: "approval" });
      continue;
    }
    eligible.push(summary);
  }

  if (mode === "preview") {
    return { mode: "preview" as const, eligible, ineligible };
  }

  // Commit — run the pipeline on the (re-partitioned) eligible orders.
  const defaults = await getUserDefaults(client, userId, companyId);
  const locationId = defaults.data?.locationId ?? undefined;

  let confirmed = 0;
  const failed: { purchaseOrderId: string; reason: string }[] = [];

  for (const o of eligible) {
    const result = await confirmAndReceive(serviceRole, {
      orderId: o.id,
      companyId,
      userId,
      locationId
    });
    if (result.ok) {
      confirmed += 1;
    } else {
      failed.push({
        purchaseOrderId: o.purchaseOrderId,
        reason: result.reason
      });
    }
  }

  return {
    mode: "commit" as const,
    confirmed,
    failed,
    skipped: ineligible.length
  };
}

type PipelineResult = { ok: true } | { ok: false; reason: string };

async function confirmAndReceive(
  serviceRole: ReturnType<typeof getCarbonServiceRole>,
  {
    orderId,
    companyId,
    userId,
    locationId
  }: {
    orderId: string;
    companyId: string;
    userId: string;
    locationId?: string;
  }
): Promise<PipelineResult> {
  // 1. Finalize — advances Draft/Planned to its post-finalize status.
  const finalize = await finalizePurchaseOrder(serviceRole, orderId, userId);
  if (finalize.error) return { ok: false, reason: "Failed to finalize" };

  // Some orders have nothing to receive (e.g. service-only lines) and finalize
  // lands them straight on To Invoice / Completed — that's already success.
  const { data: afterFinalize } = await serviceRole
    .from("purchaseOrder")
    .select("status")
    .eq("id", orderId)
    .single();
  const status = afterFinalize?.status ?? "";
  if (status === "To Invoice" || status === "Completed") return { ok: true };
  if (status !== "To Receive" && status !== "To Receive and Invoice") {
    return { ok: false, reason: `Unexpected status after finalize: ${status}` };
  }

  // 2. Create a receipt from the PO. Lines default to the full outstanding qty.
  const created = await serviceRole.functions.invoke<{ id: string }>("create", {
    body: {
      type: "receiptFromPurchaseOrder",
      companyId,
      locationId,
      purchaseOrderId: orderId,
      receiptId: undefined,
      userId
    }
  });
  const receiptId = created.data?.id;
  if (created.error || !receiptId) {
    return { ok: false, reason: "Failed to create receipt" };
  }

  // 3. Post the receipt. Mirrors receipt+/$receiptId.post.tsx: evaluate item /
  // storage rules (error-severity blocks; warn is advisory and passes through),
  // then invoke post-receipt which writes ledgers and advances the PO.
  const { data: lines } = await serviceRole
    .from("receiptLine")
    .select("id, itemId, storageUnitId, receivedQuantity, locationId")
    .eq("receiptId", receiptId)
    .eq("companyId", companyId);

  const evalLines = (lines ?? []).map((l) => ({
    lineId: l.id as string,
    itemId: l.itemId as string | null,
    storageUnitId: l.storageUnitId as string | null,
    quantity: Number(l.receivedQuantity ?? 0),
    locationId: l.locationId as string | null
  }));

  const ruleResults = await Promise.all(
    (["receipt", "place"] as const).map((surface) =>
      evaluateLinesForSurface({
        client: serviceRole,
        companyId,
        userId,
        targetType: "item",
        surface,
        lines: evalLines
      })
    )
  );
  const blockingErrors = dedupeViolations(
    ruleResults.flatMap((r) => r.violations)
  ).filter((v) => v.severity === "error");
  if (blockingErrors.length > 0) {
    return {
      ok: false,
      reason: `Receiving blocked by rule: ${blockingErrors[0]!.message}`
    };
  }

  const pending = await serviceRole
    .from("receipt")
    .update({ status: "Pending" })
    .eq("id", receiptId);
  if (pending.error) return { ok: false, reason: "Failed to post receipt" };

  const posted = await serviceRole.functions.invoke("post-receipt", {
    body: { receiptId, userId, companyId }
  });
  if (posted.error) {
    await serviceRole
      .from("receipt")
      .update({ status: "Draft" })
      .eq("id", receiptId);
    return { ok: false, reason: "Failed to post receipt" };
  }

  return { ok: true };
}
