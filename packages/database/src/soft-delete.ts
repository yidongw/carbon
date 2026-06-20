import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Simple soft-delete helpers - NO client wrapping.
 *
 * Philosophy:
 * - Filter at query layer (.is("deletedAt", null))
 * - Block at route layer (check deletedAt in loaders)
 * - Delete with audit trail (softDelete helper)
 *
 * This avoids AsyncLocalStorage overhead and keeps relationships simple.
 */

/** Tables that support soft delete (deletedAt/deletedBy columns) */
export const SOFT_DELETE_TABLES = new Set<string>([
  "ability",
  "account",
  "address",
  "apiKey",
  "batchProperty",
  "company",
  "configurationParameter",
  "configurationParameterGroup",
  "contractor",
  "costCenter",
  "customField",
  "customer",
  "customerStatus",
  "customerType",
  "department",
  "document",
  "externalLink",
  "gauge",
  "gaugeType",
  "group",
  "holiday",
  "item",
  "itemPostingGroup",
  "itemRule",
  "itemShelfLife",
  "job",
  "jobAssignmentRule",
  "jobMaterial",
  "jobOperation",
  "jobOperationParameter",
  "jobOperationPickup",
  "jobOperationStep",
  "jobOperationTool",
  "journal",
  "journalLine",
  "kanban",
  "location",
  "maintenanceDispatch",
  "maintenanceDispatchComment",
  "maintenanceDispatchEvent",
  "maintenanceDispatchItem",
  "maintenanceFailureMode",
  "maintenanceSchedule",
  "maintenanceScheduleItem",
  "materialDimension",
  "materialFinish",
  "materialForm",
  "materialGrade",
  "materialSubstance",
  "materialType",
  "methodMaterial",
  "methodOperation",
  "methodOperationParameter",
  "methodOperationStep",
  "methodOperationTool",
  "noQuoteReason",
  "nonConformance",
  "partner",
  "pricingRule",
  "procedure",
  "process",
  "productionEvent",
  "purchaseInvoice",
  "purchaseOrder",
  "purchasingRfq",
  "qualityDocument",
  "quote",
  "quoteLine",
  "quoteLinePrice",
  "quoteMakeMethod",
  "quoteMaterial",
  "quoteOperation",
  "quoteOperationParameter",
  "quoteOperationStep",
  "quoteOperationTool",
  "receipt",
  "receiptLine",
  "riskRegister",
  "salesInvoice",
  "salesInvoiceLine",
  "salesOrder",
  "salesOrderLine",
  "salesRfq",
  "salesRfqLine",
  "scrapReason",
  "shipment",
  "shipmentLine",
  "stockTransfer",
  "storageType",
  "storageUnit",
  "suggestion",
  "supplier",
  "supplierQuote",
  "supplierQuoteLine",
  "supplierType",
  "tableView",
  "templateConfigurationParameter",
  "templateMethodMaterial",
  "templateMethodOperation",
  "templateMethodOperationParameter",
  "templateMethodOperationStep",
  "templateMethodOperationTool",
  "timeCardEntry",
  "training",
  "trainingAssignment",
  "unitOfMeasure",
  "warehouseTransfer",
  "warehouseTransferLine",
  "webhook"
]);

/**
 * Soft delete records by setting deletedAt/deletedBy.
 *
 * @example
 * await softDelete(client, "item", { id: itemId }, userId);
 */
export async function softDelete<T = any>(
  client: SupabaseClient,
  table: string,
  filter: Record<string, any>,
  deletedBy?: string | null
) {
  if (!SOFT_DELETE_TABLES.has(table)) {
    throw new Error(`Table ${table} does not support soft delete`);
  }

  const deletedAt = new Date().toISOString();
  const payload = deletedBy
    ? { deletedAt, deletedBy }
    : { deletedAt, deletedBy: null };

  return client.from(table).update(payload).match(filter);
}

/**
 * Check if a record is soft-deleted.
 *
 * @example
 * if (isDeleted(item)) {
 *   throw redirect("/x/deleted");
 * }
 */
export function isDeleted(record: { deletedAt?: string | null } | null): boolean {
  return record?.deletedAt != null;
}

/**
 * Add soft-delete filter to a query builder.
 * Use this in list queries to exclude deleted records.
 *
 * @example
 * const query = filterDeleted(client.from("item").select("*"));
 */
export function filterDeleted<T>(queryBuilder: T): T {
  // TypeScript doesn't know about .is() but it exists on QueryBuilder
  return (queryBuilder as any).is("deletedAt", null);
}

/**
 * Wrap client.from() to automatically filter deleted records.
 * Only filters tables that support soft delete.
 *
 * @example
 * const client = getCarbon(request);
 * const activeFrom = fromActive(client);
 *
 * // Automatically filtered
 * const items = await activeFrom("item").select("*");
 *
 * // Not filtered (doesn't have deletedAt)
 * const users = await activeFrom("user").select("*");
 *
 * // Need deleted records? Use base client
 * const allItems = await client.from("item").select("*");
 */
export function fromActive(client: SupabaseClient) {
  return (table: string) => {
    const builder = client.from(table);
    return SOFT_DELETE_TABLES.has(table)
      ? filterDeleted(builder)
      : builder;
  };
}

/**
 * Wrap a Supabase client to automatically filter deleted records.
 * The wrapped client's .from() method will filter WHERE deletedAt IS NULL
 * for all tables that support soft delete.
 *
 * @param includeDeleted - If true, don't filter deleted records (default: false)
 *
 * @example
 * // Default: auto-filter deleted records
 * const client = wrapClient(supabaseClient);
 * const items = await client.from("item").select("*");  // Filtered!
 *
 * // Include deleted records
 * const client = wrapClient(supabaseClient, { includeDeleted: true });
 * const allItems = await client.from("item").select("*");  // Not filtered
 */
export function wrapClient(
  client: SupabaseClient,
  options?: { includeDeleted?: boolean }
): SupabaseClient {
  if (options?.includeDeleted) {
    return client;
  }

  const originalFrom = client.from.bind(client);

  // Override the from method
  client.from = ((table: string) => {
    const builder = originalFrom(table);
    return SOFT_DELETE_TABLES.has(table)
      ? filterDeleted(builder)
      : builder;
  }) as any;

  return client;
}

/**
 * Require a record to not be deleted, or throw redirect to /x/deleted.
 * Use this in detail page loaders.
 *
 * @example
 * const item = await client.from("item").select("*").eq("id", id).single();
 * requireNotDeleted(item.data);
 * return item.data;
 */
export function requireNotDeleted(
  record: { deletedAt?: string | null } | null,
  redirectFn?: (url: string) => never
): asserts record is NonNullable<typeof record> {
  if (isDeleted(record)) {
    if (redirectFn) {
      redirectFn("/x/deleted");
    }
    throw new Error("Record is deleted");
  }
}
