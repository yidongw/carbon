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
      !("variantTable" in parsed)
    ) {
      return { rows: null, total: 0 };
    }
    const parsedVariantTable = parsed as {
      variantTable?: Record<string, string | number | boolean>[];
    };
    const rows = Array.isArray(parsedVariantTable.variantTable)
      ? parsedVariantTable.variantTable
      : null;
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
    variantItemId?: string | null;
    attributeLabel?: string | null;
    quantity: number;
  }[];
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
    "total" in data &&
    "variantTable" in data &&
    Array.isArray(data.variantTable)
  );
}

export function getOverlaySuccessVariantTable(
  data: VariantsQuantityOverlaySuccess
): Record<string, string | number | boolean>[] {
  return Array.isArray(data.variantTable) ? data.variantTable : [];
}

export function buildVariantsQuantityActionResponse(
  payload: Record<string, unknown>
): VariantsQuantityOverlaySuccess {
  const variantTable = Array.isArray(payload.variantTable)
    ? (payload.variantTable as Record<string, string | number | boolean>[])
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
