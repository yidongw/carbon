import type { Database } from "@carbon/database";
import type {
  getJobOperationSupplierQuantities,
  JobOperationSupplierQuantityReportWithLines
} from "~/modules/production/jobOperationSupplierQuantityReport.service";
import type { getProductionQuantities } from "~/modules/production/production.service";
import type { ProductionQuantityReportWithLines } from "~/modules/production/productionQuantityReport.service";
import type { Filter, Sort } from "~/utils/query";

/** Actor column filters by employee id; supplier lines use user id in createdBy. */
export function partitionQuantityListFilters(
  filters: Filter[] | undefined,
  actor: "employee" | "supplier"
) {
  const list = filters ?? [];
  if (actor === "supplier") {
    return list.filter((filter) => filter.column !== "createdBy");
  }
  return list;
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1; // nulls last
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

/**
 * Multi-column client-side sort. Used after merging employee + supplier
 * results so the user's column sort is honored across both sources.
 */
function applySorts<T extends Record<string, unknown>>(
  items: T[],
  sorts: Sort[] | undefined
): T[] {
  if (!sorts || sorts.length === 0) {
    return [...items].sort(
      (a, b) =>
        new Date(b.createdAt as string).getTime() -
        new Date(a.createdAt as string).getTime()
    );
  }

  return [...items].sort((a, b) => {
    for (const { sortBy, sortAsc } of sorts) {
      const cmp = compareValues(a[sortBy], b[sortBy]);
      if (cmp !== 0) return sortAsc ? cmp : -cmp;
    }
    return 0;
  });
}

type EmployeePickup =
  Database["public"]["Tables"]["jobOperationPickup"]["Row"] & {
    employee?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      avatarUrl: string | null;
    } | null;
  };

type SupplierPickup =
  Database["public"]["Tables"]["jobOperationSupplierPickup"]["Row"] & {
    supplierProcess?: {
      id: string;
      supplierId: string;
      processId: string;
    } | null;
  };

export type UnifiedQuantityReportItem =
  | {
      actorKind: "employee";
      id: string;
      createdAt: string;
      report: ProductionQuantityReportWithLines;
    }
  | {
      actorKind: "supplier";
      id: string;
      createdAt: string;
      report: JobOperationSupplierQuantityReportWithLines;
    };

type EmployeeProductionQuantity = NonNullable<
  Awaited<ReturnType<typeof getProductionQuantities>>["data"]
>[number];

type SupplierProductionQuantity = NonNullable<
  Awaited<ReturnType<typeof getJobOperationSupplierQuantities>>["data"]
>[number];

export type UnifiedProductionQuantityListItem =
  | (EmployeeProductionQuantity & { actorKind: "employee" })
  | (SupplierProductionQuantity & { actorKind: "supplier" });

export function mergeProductionQuantityListItems(
  employee: EmployeeProductionQuantity[],
  supplier: SupplierProductionQuantity[],
  sorts?: Sort[]
): UnifiedProductionQuantityListItem[] {
  const items: UnifiedProductionQuantityListItem[] = [
    ...employee.map((row) => ({ ...row, actorKind: "employee" as const })),
    ...supplier.map((row) => ({ ...row, actorKind: "supplier" as const }))
  ];

  return applySorts(items, sorts);
}

export function mergeQuantityReports(
  employee: ProductionQuantityReportWithLines[],
  supplier: JobOperationSupplierQuantityReportWithLines[]
): UnifiedQuantityReportItem[] {
  const items: UnifiedQuantityReportItem[] = [
    ...employee.map((report) => ({
      actorKind: "employee" as const,
      id: report.id,
      createdAt: report.createdAt,
      report
    })),
    ...supplier.map((report) => ({
      actorKind: "supplier" as const,
      id: report.id,
      createdAt: report.createdAt,
      report
    }))
  ];

  return items.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export type UnifiedPickupItem =
  | {
      kind: "employee";
      id: string;
      createdAt: string;
      pickup: EmployeePickup;
    }
  | {
      kind: "supplier";
      id: string;
      createdAt: string;
      pickup: SupplierPickup;
    };

export function mergePickups(
  employee: EmployeePickup[],
  supplier: SupplierPickup[]
): UnifiedPickupItem[] {
  const items: UnifiedPickupItem[] = [
    ...employee.map((pickup) => ({
      kind: "employee" as const,
      id: pickup.id,
      createdAt: pickup.createdAt,
      pickup
    })),
    ...supplier.map((pickup) => ({
      kind: "supplier" as const,
      id: pickup.id,
      createdAt: pickup.createdAt,
      pickup
    }))
  ];

  return items.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
