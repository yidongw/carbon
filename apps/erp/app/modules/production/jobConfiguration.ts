import type { Json } from "@carbon/database";

export type ConfigRow = Record<string, string | number | boolean>;

export type ConfigTableData = {
  configTable: ConfigRow[];
};

/**
 * The combo attribute model has exactly two columns: the attribute combo
 * (`valuesKey`, a row descriptor) and its quantity (`Quantities`). There is no
 * list of quantity columns to track — the total is always the `Quantities`
 * column. (The legacy Color×Size matrix — many quantity columns — is retired.)
 */
const QUANTITY_COLUMN = "Quantities";

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
function descriptorSignature(row: ConfigRow): string {
  const keys = Object.keys(row)
    .filter((key) => key !== QUANTITY_COLUMN)
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
  /** Signed sum of the adjustment's quantity column. */
  deltaTotal: number;
  /** True when the quantity would drop below zero after merging. */
  hasNegative: boolean;
};

/**
 * Merges a signed `adjustment` config table into the `current` config table, matching
 * rows by their descriptor (non-quantity) columns and summing the quantity column.
 * All-zero rows are dropped. Flags when the result would go negative for any cell.
 */
export function applyConfigAdjustment(
  current: Json | Record<string, unknown> | null | undefined,
  adjustment: Json | Record<string, unknown> | null | undefined
): ConfigAdjustmentResult {
  const rowsBySignature = new Map<string, ConfigRow>();
  const order: string[] = [];

  const upsert = (row: ConfigRow, add: boolean) => {
    const signature = descriptorSignature(row);
    const existing = rowsBySignature.get(signature);
    if (!existing) {
      const clone: ConfigRow = { ...row };
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

  for (const row of getConfigTable(current)) {
    upsert(row, true);
  }

  let deltaTotal = 0;
  for (const row of getConfigTable(adjustment)) {
    deltaTotal += Number(row[QUANTITY_COLUMN]) || 0;
    upsert(row, true);
  }

  let hasNegative = false;
  const mergedRows: ConfigRow[] = [];
  for (const signature of order) {
    const row = rowsBySignature.get(signature);
    if (!row) continue;
    const value = Number(row[QUANTITY_COLUMN]) || 0;
    row[QUANTITY_COLUMN] = value;
    if (value < 0) hasNegative = true;
    if (value !== 0) mergedRows.push(row);
  }

  const configuration: ConfigTableData = {
    configTable: mergedRows
  };

  return {
    configuration,
    total: computeJobConfigTableTotal(configuration),
    deltaTotal,
    hasNegative
  };
}

/**
 * Folds many config tables into one by descriptor, summing the quantity column.
 * Used to total reported production quantities per operation for display.
 */
export function sumConfigTables(
  configs: Array<Json | Record<string, unknown> | null | undefined>
): { configuration: ConfigTableData; total: number } {
  let configuration: ConfigTableData = {
    configTable: []
  };
  for (const config of configs) {
    configuration = applyConfigAdjustment(configuration, config).configuration;
  }
  return { configuration, total: computeJobConfigTableTotal(configuration) };
}

/**
 * The remaining config table: `planned - sum(reportedConfigs)` per cell, floored
 * at 0. Returns an empty table when there's no plan structure.
 */
export function computeConfigRemaining(
  planned: Json | Record<string, unknown> | null | undefined,
  reportedConfigs: Array<Json | Record<string, unknown> | null | undefined>
): ConfigTableData {
  if (getConfigTable(planned).length === 0) {
    return { configTable: [] };
  }

  const reported = sumConfigTables(reportedConfigs).configuration;
  const negated: ConfigTableData = {
    configTable: reported.configTable.map((row) => ({
      ...row,
      [QUANTITY_COLUMN]: -(Number(row[QUANTITY_COLUMN]) || 0)
    }))
  };
  const merged = applyConfigAdjustment(planned, negated).configuration;
  return {
    configTable: merged.configTable.map((row) => ({
      ...row,
      [QUANTITY_COLUMN]: Math.max(0, Number(row[QUANTITY_COLUMN]) || 0)
    }))
  };
}

/**
 * True when the summed `reportedConfigs` would exceed the `planned` config for
 * any cell — i.e. `planned - sum(reported)` goes negative. No-op (returns false)
 * when there's no plan structure or nothing reported, so non-config-param jobs
 * are unaffected.
 */
export function reportsExceedConfigPlan(
  planned: Json | Record<string, unknown> | null | undefined,
  reportedConfigs: Array<Json | Record<string, unknown> | null | undefined>
): boolean {
  if (getConfigTable(planned).length === 0) return false;

  const reported = sumConfigTables(reportedConfigs).configuration;
  if (reported.configTable.length === 0) return false;

  const negated: ConfigTableData = {
    configTable: reported.configTable.map((row) => ({
      ...row,
      [QUANTITY_COLUMN]: -(Number(row[QUANTITY_COLUMN]) || 0)
    }))
  };
  return applyConfigAdjustment(planned, negated).hasNegative;
}

/**
 * Sums the `Quantities` column across `configuration.configTable` (same rules as
 * the job sidebar).
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

  return table.reduce((sum: number, row: unknown) => {
    if (typeof row !== "object" || row === null) return sum;
    const r = row as Record<string, unknown>;
    return sum + (Number(r[QUANTITY_COLUMN]) || 0);
  }, 0);
}
