import type { SupabaseClient } from "@supabase/supabase-js";

export type SoftDeleteContext = {
  includeDeleted?: boolean;
  hardDelete?: boolean;
  deletedBy?: string | null;
};

export interface SoftDeleteStorage {
  getStore(): SoftDeleteContext | undefined;
  run<R>(store: SoftDeleteContext, fn: () => R): R;
}

// Default no-op storage. Server code calls `setSoftDeleteStorage` from
// `./soft-delete.server` to install a real AsyncLocalStorage-backed impl.
// Keeping `node:async_hooks` out of this module lets it ship in the browser
// bundle (pulled in via the universal Supabase client) without breaking Vite.
let storageImpl: SoftDeleteStorage = {
  getStore: () => undefined,
  run: (_store, fn) => fn()
};

export function setSoftDeleteStorage(impl: SoftDeleteStorage): void {
  storageImpl = impl;
}

export const softDeleteStorage: SoftDeleteStorage = {
  getStore: () => storageImpl.getStore(),
  run: (store, fn) => storageImpl.run(store, fn)
};

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

export function isSoftDeletableTable(table: string): boolean {
  if (HARD_DELETE_TABLES.has(table)) return false;
  const base = resolveSoftDeleteBaseTable(table);
  return SOFT_DELETE_TABLES.has(base);
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
        !shouldIncludeDeleted(ctx)
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
