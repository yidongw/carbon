import { computeJobVariantsQuantityTotal } from "./jobConfiguration";

export type ParsedVariantsQuantityValue = {
  rows: Record<string, string | number | boolean>[] | null;
  total: number;
};

/** Parse a saved Style/job `configuration` JSON into rows and total (combo-only). */
export function parseInitialVariantsQuantity(
  raw: unknown
): ParsedVariantsQuantityValue {
  if (!raw) return { rows: null, total: 0 };
  try {
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (!("variantTable" in parsed) && !("configTable" in parsed))
    ) {
      return { rows: null, total: 0 };
    }
    const config = parsed as {
      variantTable?: Record<string, string | number | boolean>[];
      configTable?: Record<string, string | number | boolean>[];
    };
    const rows = Array.isArray(config.variantTable)
      ? config.variantTable
      : Array.isArray(config.configTable)
        ? config.configTable
        : null;
    // Combo-only: each row carries a single `Quantities` value.
    let total = 0;
    if (rows) {
      for (const row of rows) {
        total += Number(row.Quantities) || 0;
      }
    }
    return { rows, total };
  } catch {
    return { rows: null, total: 0 };
  }
}

export type VariantsQuantityOverlaySuccess = {
  ok: true;
  configuration: {
    variantTable: Record<string, string | number | boolean>[];
    // Flat cut breakdown (report split editor) — stripped server-side before the
    // config is stored; persisted to masterWorkOrderSplitRow for cutting reports.
    splitRows?: {
      valuesKey?: string | null;
      attributeLabel?: string | null;
      quantity: number;
    }[];
  };
  total: number;
};

export function isVariantsQuantityOverlaySuccess(
  data: unknown
): data is VariantsQuantityOverlaySuccess {
  return (
    typeof data === "object" &&
    data !== null &&
    "ok" in data &&
    data.ok === true &&
    "configuration" in data &&
    "total" in data
  );
}

export function buildVariantsQuantityActionResponse(
  configuration: Record<string, unknown>
): VariantsQuantityOverlaySuccess {
  return {
    ok: true,
    configuration:
      configuration as VariantsQuantityOverlaySuccess["configuration"],
    total: computeJobVariantsQuantityTotal(configuration)
  };
}
