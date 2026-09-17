import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Master work orders for the read-only MES list page (filter / sort / print).
 * Reads the enriched `masterWorkOrders` view.
 */
export async function getMasterWorkOrdersList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("masterWorkOrders")
    .select(
      "id, jobId, jobReadableId, readableIdWithRevision, itemName, quantity, status, assignee, assignedAt, dueDate, deadlineType, salesOrderReadableId, locationName"
    )
    .eq("companyId", companyId)
    .order("createdAt", { ascending: false });
}

/**
 * Bundle work orders for the read-only MES list page (filter / sort / print
 * tickets). Reads the enriched `bundleWorkOrders` view. Pass a masterWorkOrderId
 * to scope the list to one master (the drill-down from the master list).
 */
export async function getBundleWorkOrdersList(
  client: SupabaseClient<Database>,
  companyId: string,
  masterWorkOrderId?: string
) {
  let query = client
    .from("bundleWorkOrders")
    .select(
      "id, jobId, jobReadableId, readableIdWithRevision, styleReadableId, itemName, attributeLabel, attributeValues, sequence, quantity, status, assignee, assignedAt, masterWorkOrderId, processCount"
    )
    .eq("companyId", companyId);

  if (masterWorkOrderId) {
    query = query.eq("masterWorkOrderId", masterWorkOrderId);
  }

  return query
    .order("jobReadableId", { ascending: true })
    .order("sequence", { ascending: true });
}

/**
 * Released bundle work orders that nobody has picked up yet (job assignee is
 * null — pickup mirrors the assignee onto the job). Powers the pickup page's
 * "find an unclaimed bundle by style" table.
 */
export async function getUnassignedBundleWorkOrders(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return (
    client
      .from("bundleWorkOrders")
      .select(
        "id, jobId, jobReadableId, readableIdWithRevision, styleReadableId, itemName, attributeLabel, attributeValues, quantity, status, assignedAt, processCount"
      )
      .eq("companyId", companyId)
      .in("status", ["Ready", "In Progress", "Paused"])
      .is("assignee", null)
      // Only bundles that actually have an operation to pick up (a fresh bundle
      // with no operation graph yet would dead-end on the job DAG).
      .gt("processCount", 0)
      .order("jobReadableId", { ascending: true })
  );
}

/** A single bundle work order (via the read view) for the scan-landing page. */
export async function getBundleForScan(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("bundleWorkOrders")
    .select(
      "id, jobId, jobReadableId, status, quantity, attributeLabel, attributeValues, itemName, readableIdWithRevision, assignee"
    )
    .eq("id", id)
    .eq("companyId", companyId)
    .maybeSingle();
}

/** A bundle's backing-job operations, in execution order. */
export async function getBundleOperations(
  client: SupabaseClient<Database>,
  jobId: string
) {
  return client
    .from("jobOperation")
    .select(
      "id, order, status, assignee, workCenterId, description, quantityComplete, quantityReworked, quantityScrapped, targetQuantity, operationQuantity"
    )
    .eq("jobId", jobId)
    .order("order", { ascending: true });
}

export type BundleOperation = NonNullable<
  Awaited<ReturnType<typeof getBundleOperations>>["data"]
>[number];

/** The current operation = first one not yet Done/Canceled, by order. */
export function findCurrentOperation(
  operations: BundleOperation[]
): BundleOperation | null {
  return (
    operations.find((op) => op.status !== "Done" && op.status !== "Canceled") ??
    null
  );
}

/** Remaining quantity to report on an operation (target − already complete). */
export function operationRemaining(op: BundleOperation): number {
  const target =
    (op.targetQuantity && op.targetQuantity > 0
      ? op.targetQuantity
      : op.operationQuantity) ?? 0;
  // Reportable = total minus everything already accounted for (produced,
  // sent to rework, or scrapped).
  const accounted =
    (op.quantityComplete ?? 0) +
    (op.quantityReworked ?? 0) +
    (op.quantityScrapped ?? 0);
  const remaining = target - accounted;
  return remaining > 0 ? remaining : 0;
}

/**
 * Assign an operation to a worker and mirror the assignee onto the backing job
 * (matching the ERP `/api/assign` bundle-mirror behavior), so the bundle list
 * shows who picked it up.
 */
export async function assignBundleOperation(
  client: SupabaseClient<Database>,
  args: {
    operationId: string;
    jobId: string;
    userId: string;
    companyId: string;
  }
) {
  const nowIso = new Date().toISOString();
  const op = await client
    .from("jobOperation")
    .update({
      assignee: args.userId,
      assignedAt: nowIso,
      updatedBy: args.userId
    })
    .eq("id", args.operationId)
    .eq("companyId", args.companyId);
  if (op.error) return op;

  return client
    .from("job")
    .update({
      assignee: args.userId,
      assignedAt: nowIso,
      updatedBy: args.userId
    })
    .eq("id", args.jobId)
    .eq("companyId", args.companyId);
}
