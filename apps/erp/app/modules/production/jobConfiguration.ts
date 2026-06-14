import type { Json } from "@carbon/database";

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
      primaryKeys.reduce(
        (rowSum, key) => rowSum + (Number(r[key]) || 0),
        0
      )
    );
  }, 0);
}
