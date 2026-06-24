import type { Json } from "@carbon/database";

export type ConfigRow = Record<string, string | number | boolean>;

export type ConfigTableData = {
  configTable: ConfigRow[];
  configTablePrimaryKeys: string[];
};

function getPrimaryKeys(
  configuration: Json | Record<string, unknown> | null | undefined
): string[] {
  const cfg =
    typeof configuration === "object" &&
    configuration !== null &&
    !Array.isArray(configuration)
      ? (configuration as Record<string, unknown>)
      : null;
  const raw = cfg?.configTablePrimaryKeys;
  const keys = Array.isArray(raw)
    ? raw.filter((k): k is string => typeof k === "string")
    : [];
  return keys;
}

function getConfigTable(
  configuration: Json | Record<string, unknown> | null | undefined
): ConfigRow[] {
  const cfg =
    typeof configuration === "object" &&
    configuration !== null &&
    !Array.isArray(configuration)
      ? (configuration as Record<string, unknown>)
      : null;
  const table = cfg?.configTable;
  return Array.isArray(table) ? (table as ConfigRow[]) : [];
}

/** Signature for matching rows by their non-quantity (descriptor) columns. */
function descriptorSignature(row: ConfigRow, primaryKeys: string[]): string {
  const keys = Object.keys(row)
    .filter((key) => !primaryKeys.includes(key))
    .sort();
  return JSON.stringify(
    keys.map((key) => [key, String(row[key] ?? "").trim()])
  );
}

export type ConfigAdjustmentResult = {
  /** Merged configuration to persist as the job's new current config. */
  configuration: ConfigTableData;
  /** Grand total of the merged configuration. */
  total: number;
  /** Signed sum of the adjustment's quantity columns. */
  deltaTotal: number;
  /** True when any quantity column would drop below zero after merging. */
  hasNegative: boolean;
};

/**
 * Merges a signed `adjustment` config table into the `current` config table, matching
 * rows by their descriptor (non-quantity) columns and summing quantity columns.
 * All-zero rows are dropped. Flags when the result would go negative for any cell.
 */
export function applyConfigAdjustment(
  current: Json | Record<string, unknown> | null | undefined,
  adjustment: Json | Record<string, unknown> | null | undefined
): ConfigAdjustmentResult {
  const adjustmentKeys = getPrimaryKeys(adjustment);
  const currentKeys = getPrimaryKeys(current);
  const primaryKeys =
    adjustmentKeys.length > 0
      ? adjustmentKeys
      : currentKeys.length > 0
        ? currentKeys
        : ["Quantities"];

  const rowsBySignature = new Map<string, ConfigRow>();
  const order: string[] = [];

  const upsert = (row: ConfigRow, add: boolean) => {
    const signature = descriptorSignature(row, primaryKeys);
    const existing = rowsBySignature.get(signature);
    if (!existing) {
      const clone: ConfigRow = { ...row };
      for (const key of primaryKeys) {
        clone[key] = Number(row[key]) || 0;
      }
      rowsBySignature.set(signature, clone);
      order.push(signature);
      return;
    }
    if (add) {
      for (const key of primaryKeys) {
        existing[key] = (Number(existing[key]) || 0) + (Number(row[key]) || 0);
      }
    }
  };

  for (const row of getConfigTable(current)) {
    upsert(row, true);
  }

  let deltaTotal = 0;
  for (const row of getConfigTable(adjustment)) {
    for (const key of primaryKeys) {
      deltaTotal += Number(row[key]) || 0;
    }
    upsert(row, true);
  }

  let hasNegative = false;
  const mergedRows: ConfigRow[] = [];
  for (const signature of order) {
    const row = rowsBySignature.get(signature);
    if (!row) continue;
    let allZero = true;
    for (const key of primaryKeys) {
      const value = Number(row[key]) || 0;
      row[key] = value;
      if (value < 0) hasNegative = true;
      if (value !== 0) allZero = false;
    }
    if (!allZero) mergedRows.push(row);
  }

  const configuration: ConfigTableData = {
    configTable: mergedRows,
    configTablePrimaryKeys: primaryKeys
  };

  return {
    configuration,
    total: computeJobConfigTableTotal(configuration),
    deltaTotal,
    hasNegative
  };
}

/**
 * Folds many config tables into one by descriptor, summing quantity columns.
 * Used to total reported production quantities per operation for display.
 */
export function sumConfigTables(
  configs: Array<Json | Record<string, unknown> | null | undefined>,
  primaryKeys: string[]
): { configuration: ConfigTableData; total: number } {
  let configuration: ConfigTableData = {
    configTable: [],
    configTablePrimaryKeys: primaryKeys
  };
  for (const config of configs) {
    configuration = applyConfigAdjustment(configuration, config).configuration;
  }
  return { configuration, total: computeJobConfigTableTotal(configuration) };
}

/**
 * Sums quantity columns across `configuration.configTable` (same rules as the job sidebar).
 * Uses `configTablePrimaryKeys` when set; otherwise counts the single default `Quantities` column.
 */
export function computeJobConfigTableTotal(
  configuration: Json | Record<string, unknown> | null | undefined
): number {
  if (configuration === null || configuration === undefined) return 0;
  const cfg =
    typeof configuration === "object" && !Array.isArray(configuration)
      ? (configuration as Record<string, unknown>)
      : null;
  if (!cfg) return 0;

  const table = cfg.configTable;
  if (!Array.isArray(table) || table.length === 0) return 0;

  const primaryKeysRaw = cfg.configTablePrimaryKeys;
  const primaryKeys: string[] = Array.isArray(primaryKeysRaw)
    ? primaryKeysRaw.filter((k): k is string => typeof k === "string")
    : ["Quantities"];

  return table.reduce((sum: number, row: unknown) => {
    if (typeof row !== "object" || row === null) return sum;
    const r = row as Record<string, unknown>;
    return (
      sum +
      primaryKeys.reduce((rowSum, key) => rowSum + (Number(r[key]) || 0), 0)
    );
  }, 0);
}
