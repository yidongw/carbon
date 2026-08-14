import type { Json } from "@carbon/database";
import { readVariantTableRows } from "./variantTableWire";

export type VariantsQuantityRow = Record<string, string | number | boolean>;

export type VariantsQuantityData = {
  variantTable: VariantsQuantityRow[];
};

/**
 * The combo attribute model has exactly two columns: the variant descriptor
 * (`variantItemId`) and its quantity (`Quantities`). There is no
 * list of quantity columns to track — the total is always the `Quantities`
 * column. (The legacy Color×Size matrix — many quantity columns — is retired.)
 */
const QUANTITY_COLUMN = "Quantities";

function getVariantsQuantityTable(
  variantQuantities: Json | Record<string, unknown> | null | undefined
): VariantsQuantityRow[] {
  return readVariantTableRows(variantQuantities) as VariantsQuantityRow[];
}

/** Signature for matching rows by their non-quantity (descriptor) columns. */
function descriptorSignature(row: VariantsQuantityRow): string {
  const keys = Object.keys(row)
    .filter((key) => key !== QUANTITY_COLUMN)
    .sort();
  return JSON.stringify(
    keys.map((key) => [key, String(row[key] ?? "").trim()])
  );
}

export type VariantTableAdjustmentResult = {
  /** Merged variant quantities to persist as the job's new current plan. */
  variantQuantities: VariantsQuantityData;
  /** Grand total of the merged variant quantities. */
  total: number;
  /** Signed sum of the adjustment's quantity column. */
  deltaTotal: number;
  /** True when the quantity would drop below zero after merging. */
  hasNegative: boolean;
};

/**
 * Merges a signed `adjustment` variant quantities table into the `current` variant quantities table, matching
 * rows by their descriptor (non-quantity) columns and summing the quantity column.
 * All-zero rows are dropped. Flags when the result would go negative for any cell.
 */
export function applyVariantTableAdjustment(
  current: Json | Record<string, unknown> | null | undefined,
  adjustment: Json | Record<string, unknown> | null | undefined
): VariantTableAdjustmentResult {
  const rowsBySignature = new Map<string, VariantsQuantityRow>();
  const order: string[] = [];

  const upsert = (row: VariantsQuantityRow, add: boolean) => {
    const signature = descriptorSignature(row);
    const existing = rowsBySignature.get(signature);
    if (!existing) {
      const clone: VariantsQuantityRow = { ...row };
      clone[QUANTITY_COLUMN] = Number(row[QUANTITY_COLUMN]) || 0;
      rowsBySignature.set(signature, clone);
      order.push(signature);
      return;
    }
    if (add) {
      existing[QUANTITY_COLUMN] =
        (Number(existing[QUANTITY_COLUMN]) || 0) +
        (Number(row[QUANTITY_COLUMN]) || 0);
    }
  };

  for (const row of getVariantsQuantityTable(current)) {
    upsert(row, true);
  }

  let deltaTotal = 0;
  for (const row of getVariantsQuantityTable(adjustment)) {
    deltaTotal += Number(row[QUANTITY_COLUMN]) || 0;
    upsert(row, true);
  }

  let hasNegative = false;
  const mergedRows: VariantsQuantityRow[] = [];
  for (const signature of order) {
    const row = rowsBySignature.get(signature);
    if (!row) continue;
    const value = Number(row[QUANTITY_COLUMN]) || 0;
    row[QUANTITY_COLUMN] = value;
    if (value < 0) hasNegative = true;
    if (value !== 0) mergedRows.push(row);
  }

  const variantQuantities: VariantsQuantityData = {
    variantTable: mergedRows
  };

  return {
    variantQuantities,
    total: computeVariantTableTotal(variantQuantities),
    deltaTotal,
    hasNegative
  };
}

/**
 * Folds many variant quantity tables into one by descriptor, summing the quantity column.
 * Used to total reported production quantities per operation for display.
 */
export function sumVariantTables(
  variantQuantityTables: Array<
    Json | Record<string, unknown> | null | undefined
  >
): { variantQuantities: VariantsQuantityData; total: number } {
  let variantQuantities: VariantsQuantityData = {
    variantTable: []
  };
  for (const table of variantQuantityTables) {
    variantQuantities = applyVariantTableAdjustment(
      variantQuantities,
      table
    ).variantQuantities;
  }
  return {
    variantQuantities,
    total: computeVariantTableTotal(variantQuantities)
  };
}

/**
 * The remaining variant quantities table: `planned - sum(reportedVariantQuantities)` per cell, floored
 * at 0. Returns an empty table when there's no plan structure.
 */
export function computeVariantTableRemaining(
  planned: Json | Record<string, unknown> | null | undefined,
  reportedVariantQuantities: Array<
    Json | Record<string, unknown> | null | undefined
  >
): VariantsQuantityData {
  if (getVariantsQuantityTable(planned).length === 0) {
    return { variantTable: [] };
  }

  const reported = sumVariantTables(
    reportedVariantQuantities
  ).variantQuantities;
  const negated: VariantsQuantityData = {
    variantTable: reported.variantTable.map((row) => ({
      ...row,
      [QUANTITY_COLUMN]: -(Number(row[QUANTITY_COLUMN]) || 0)
    }))
  };
  const merged = applyVariantTableAdjustment(
    planned,
    negated
  ).variantQuantities;
  return {
    variantTable: merged.variantTable.map((row) => ({
      ...row,
      [QUANTITY_COLUMN]: Math.max(0, Number(row[QUANTITY_COLUMN]) || 0)
    }))
  };
}

/**
 * True when the summed `reportedVariantQuantities` would exceed the `planned` config for
 * any cell — i.e. `planned - sum(reported)` goes negative. No-op (returns false)
 * when there's no plan structure or nothing reported, so non-config-param jobs
 * are unaffected.
 */
export function reportsExceedVariantQuantitiesPlan(
  planned: Json | Record<string, unknown> | null | undefined,
  reportedVariantQuantities: Array<
    Json | Record<string, unknown> | null | undefined
  >
): boolean {
  if (getVariantsQuantityTable(planned).length === 0) return false;

  const reported = sumVariantTables(
    reportedVariantQuantities
  ).variantQuantities;
  if (reported.variantTable.length === 0) return false;

  const negated: VariantsQuantityData = {
    variantTable: reported.variantTable.map((row) => ({
      ...row,
      [QUANTITY_COLUMN]: -(Number(row[QUANTITY_COLUMN]) || 0)
    }))
  };
  return applyVariantTableAdjustment(planned, negated).hasNegative;
}

/**
 * Sums the `Quantities` column across `variantQuantities.variantTable`.
 */
export function computeVariantTableTotal(
  variantQuantities: Json | Record<string, unknown> | null | undefined
): number {
  const table = getVariantsQuantityTable(variantQuantities);
  if (table.length === 0) return 0;

  return table.reduce((sum, row) => {
    return sum + (Number(row[QUANTITY_COLUMN]) || 0);
  }, 0);
}
