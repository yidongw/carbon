import type { SupabaseClient } from "@supabase/supabase-js";
import { AsyncLocalStorage } from "node:async_hooks";

export type SoftDeleteContext = {
  includeDeleted?: boolean;
  hardDelete?: boolean;
  deletedBy?: string | null;
};

export const softDeleteStorage = new AsyncLocalStorage<SoftDeleteContext>();

/** Tables that keep hard DELETE (auth tokens, user purge, etc.). */
export const HARD_DELETE_TABLES = new Set<string>([
  "oauthCode",
  "user",
  "employee"
]);

/**
 * Base tables that support soft delete (`deletedAt` / `deletedBy` columns).
 * Keep in sync with migration `*_soft-delete.sql`.
 */
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

/** List / mutation views mapped to their base table for soft delete. */
export const SOFT_DELETE_VIEW_BASE: Record<string, string> = {
  consumables: "item",
  gauges: "gauge",
  jobs: "job",
  materials: "item",
  parts: "item",
  services: "item",
  tools: "item"
};

export function resolveSoftDeleteBaseTable(table: string): string {
  return SOFT_DELETE_VIEW_BASE[table] ?? table;
}

export function isSoftDeleteView(table: string): boolean {
  return table in SOFT_DELETE_VIEW_BASE;
}

export function isSoftDeletableTable(table: string): boolean {
  if (HARD_DELETE_TABLES.has(table)) return false;
  const base = resolveSoftDeleteBaseTable(table);
  return SOFT_DELETE_TABLES.has(base);
}

export function withIncludeDeleted<T>(fn: () => Promise<T>): Promise<T> {
  const parent = softDeleteStorage.getStore();
  return softDeleteStorage.run(
    { ...parent, includeDeleted: true },
    fn
  );
}

/** Alias for reads of historical records that may reference soft-deleted rows. */
export const withHistoricalReads = withIncludeDeleted;

/** Internal bulk cleanup (method rebuild, edge-function sync) keeps hard DELETE. */
export function withHardDelete<T>(fn: () => Promise<T>): Promise<T> {
  const parent = softDeleteStorage.getStore();
  return softDeleteStorage.run({ ...parent, hardDelete: true }, fn);
}

type WrapSoftDeleteOptions = {
  deletedBy?: string | null;
};

function getContext(options?: WrapSoftDeleteOptions): SoftDeleteContext {
  return {
    ...softDeleteStorage.getStore(),
    deletedBy: options?.deletedBy ?? softDeleteStorage.getStore()?.deletedBy ?? null
  };
}

function shouldIncludeDeleted(ctx: SoftDeleteContext): boolean {
  return ctx.includeDeleted === true;
}

function shouldHardDelete(ctx: SoftDeleteContext): boolean {
  return ctx.hardDelete === true;
}

function softDeletePayload(ctx: SoftDeleteContext): Record<string, string | null> {
  const deletedAt = new Date().toISOString();
  const deletedBy = ctx.deletedBy ?? null;
  return deletedBy
    ? { deletedAt, deletedBy }
    : { deletedAt, deletedBy: null };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapBuilder(
  builder: any,
  table: string,
  from: (name: string) => any,
  options?: WrapSoftDeleteOptions
) {
  const wrap = (next: unknown) => {
    if (!next || typeof next !== "object") return next;
    return wrapBuilder(next, table, from, options);
  };

  return new Proxy(builder, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      const ctx = getContext(options);

      if (prop === "delete" && typeof value === "function") {
        return (...args: unknown[]) => {
          if (shouldHardDelete(ctx)) {
            return wrap(value.apply(target, args));
          }

          const baseTable = resolveSoftDeleteBaseTable(table);
          const mutationTarget =
            baseTable !== table ? from(baseTable) : target;
          const update = mutationTarget.update(softDeletePayload(ctx));
          return wrap(update.is("deletedAt", null));
        };
      }

      if (
        prop === "select" &&
        typeof value === "function" &&
        !shouldIncludeDeleted(ctx) &&
        !isSoftDeleteView(table)
      ) {
        return (...args: unknown[]) => {
          const selected = value.apply(target, args);
          if (!selected?.is) return selected;
          return wrap(selected.is("deletedAt", null));
        };
      }

      if (typeof value === "function") {
        return (...args: unknown[]) => wrap(value.apply(target, args));
      }

      return value;
    }
  });
}

export function wrapSoftDeleteClient<C extends SupabaseClient>(
  client: C,
  options?: WrapSoftDeleteOptions
): C {
  const originalFrom = client.from.bind(client);

  // @ts-expect-error — patching client.from
  client.from = (table: string) => {
    const builder = originalFrom(table);
    if (!isSoftDeletableTable(table)) {
      return builder;
    }
    return wrapBuilder(builder, table, originalFrom, options);
  };

  return client;
}
