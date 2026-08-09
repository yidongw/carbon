import { computeVariantTableTotal } from "./variantTable";

export type ParsedVariantsQuantityValue = {
  rows: Record<string, string | number | boolean>[] | null;
  total: number;
};

/** Parse a saved Style/job variant-table JSON into rows and total (combo-only). */
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
  variantTable: Record<string, string | number | boolean>[];
  // Flat cut breakdown (report split editor) — stripped server-side before the
  // table is stored; persisted to masterWorkOrderSplitRow for cutting reports.
  splitRows?: {
    valuesKey?: string | null;
    attributeLabel?: string | null;
    quantity: number;
  }[];
  total: number;
};

export function isVariantsQuantityOverlaySuccess(
  data: unknown
): data is VariantsQuantityOverlaySuccess {
  if (
    typeof data !== "object" ||
    data === null ||
    !("ok" in data) ||
    data.ok !== true ||
    !("total" in data)
  ) {
    return false;
  }
  // Current shape: { ok, variantTable, total, splitRows? }
  if ("variantTable" in data && Array.isArray(data.variantTable)) {
    return true;
  }
  // Legacy nested shape: { ok, configuration: { variantTable }, total }
  if (
    "configuration" in data &&
    typeof data.configuration === "object" &&
    data.configuration !== null &&
    "variantTable" in data.configuration &&
    Array.isArray(
      (data.configuration as { variantTable?: unknown }).variantTable
    )
  ) {
    return true;
  }
  return false;
}

/** Normalize success payloads (current + legacy nested) to the flat shape. */
export function getOverlaySuccessVariantTable(
  data: VariantsQuantityOverlaySuccess
): Record<string, string | number | boolean>[] {
  if (Array.isArray(data.variantTable)) return data.variantTable;
  const nested = (
    data as unknown as {
      configuration?: {
        variantTable?: Record<string, string | number | boolean>[];
      };
    }
  ).configuration?.variantTable;
  return Array.isArray(nested) ? nested : [];
}

export function buildVariantsQuantityActionResponse(
  payload: Record<string, unknown>
): VariantsQuantityOverlaySuccess {
  const variantTable = Array.isArray(payload.variantTable)
    ? (payload.variantTable as Record<string, string | number | boolean>[])
    : Array.isArray(payload.configTable)
      ? (payload.configTable as Record<string, string | number | boolean>[])
      : [];
  const splitRows = Array.isArray(payload.splitRows)
    ? (payload.splitRows as VariantsQuantityOverlaySuccess["splitRows"])
    : undefined;
  return {
    ok: true,
    variantTable,
    ...(splitRows ? { splitRows } : {}),
    total: computeVariantTableTotal(payload)
  };
}
