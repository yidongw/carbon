import { computeJobConfigTableTotal } from "./jobConfiguration";

export type ParsedConfigTableValue = {
  rows: Record<string, string | number | boolean>[] | null;
  primaryKeys: string[];
  total: number;
};

/** Parse a saved Style/job `configuration` JSON into rows, keys, and total. */
export function parseInitialConfigTable(raw: unknown): ParsedConfigTableValue {
  if (!raw) return { rows: null, primaryKeys: [], total: 0 };
  try {
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("configTable" in parsed)
    ) {
      return { rows: null, primaryKeys: [], total: 0 };
    }
    const config = parsed as {
      configTable?: Record<string, string | number | boolean>[];
      configTablePrimaryKeys?: string[];
    };
    const rows = Array.isArray(config.configTable) ? config.configTable : null;
    const primaryKeys = Array.isArray(config.configTablePrimaryKeys)
      ? config.configTablePrimaryKeys.filter(
          (k): k is string => typeof k === "string"
        )
      : [];
    let total = 0;
    if (rows) {
      const hasComboRows = rows.some(
        (row) => String(row.valuesKey ?? "").trim().length > 0
      );
      if (
        hasComboRows ||
        (primaryKeys.length === 1 && primaryKeys[0] === "Quantities")
      ) {
        for (const row of rows) {
          total += Number(row.Quantities) || 0;
        }
      } else {
        for (const row of rows) {
          for (const key of primaryKeys) {
            total += Number(row[key]) || 0;
          }
        }
      }
    }
    return { rows, primaryKeys, total };
  } catch {
    return { rows: null, primaryKeys: [], total: 0 };
  }
}

export type ConfigTableOverlaySuccess = {
  ok: true;
  configuration: {
    configTable: Record<string, string | number | boolean>[];
    configTablePrimaryKeys: string[];
    // Flat cut breakdown (report split editor) — stripped server-side before the
    // config is stored; persisted to masterWorkOrderSplitRow for cutting reports.
    splitRows?: {
      valuesKey?: string | null;
      attributeLabel?: string | null;
      colorCode: string | null;
      sizeCode: string | null;
      quantity: number;
    }[];
  };
  total: number;
  primaryKeys: string[];
};

export function isConfigTableOverlaySuccess(
  data: unknown
): data is ConfigTableOverlaySuccess {
  return (
    typeof data === "object" &&
    data !== null &&
    "ok" in data &&
    data.ok === true &&
    "configuration" in data &&
    "total" in data &&
    "primaryKeys" in data
  );
}

export function buildConfigTableActionResponse(
  configuration: Record<string, unknown>
): ConfigTableOverlaySuccess {
  const primaryKeysRaw = configuration.configTablePrimaryKeys;
  const primaryKeys = Array.isArray(primaryKeysRaw)
    ? primaryKeysRaw.filter((k): k is string => typeof k === "string")
    : ["Quantities"];

  return {
    ok: true,
    configuration: configuration as ConfigTableOverlaySuccess["configuration"],
    total: computeJobConfigTableTotal(configuration),
    primaryKeys
  };
}
