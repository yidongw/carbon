/**
 * Style/Consumable combo qty wire shape. The only key is `variantTable`
 * (legacy `configTable` was migrated away in
 * 20260813150412_migrate-config-table-to-variant-table.sql).
 */

export const VARIANT_TABLE_KEY = "variantTable" as const;

export type VariantTableRow = Record<string, string | number | boolean>;

/** Read the combo qty rows from `variantTable`. */
export function readVariantTableRows(
  variantQuantities: unknown
): VariantTableRow[] {
  if (
    variantQuantities === null ||
    variantQuantities === undefined ||
    typeof variantQuantities !== "object" ||
    Array.isArray(variantQuantities)
  ) {
    return [];
  }

  const table = (variantQuantities as Record<string, unknown>)[
    VARIANT_TABLE_KEY
  ];
  if (!Array.isArray(table)) return [];
  return table as VariantTableRow[];
}

/**
 * Stamp the stable `variantItemId` onto each combo row from a
 * `valuesKey -> variantItemId` map, so saved cells match by the drift-proof id
 * (see itemAttribute.service `resolveVariantByValuesKey` / `expandVariantsQuantityTable`).
 * Idempotent (keeps an id already present) and lossless (rows whose `valuesKey`
 * has no mapped variant are returned unchanged, still matchable by `valuesKey`).
 */
export function stampVariantItemIds(
  rows: VariantTableRow[],
  variantItemIdByValuesKey?: Record<string, string> | null
): VariantTableRow[] {
  if (!variantItemIdByValuesKey) return rows;
  return rows.map((row) => {
    if (String(row.variantItemId ?? "").trim()) return row;
    const valuesKey = String(row.valuesKey ?? "").trim();
    const variantItemId = valuesKey
      ? variantItemIdByValuesKey[valuesKey]
      : undefined;
    return variantItemId ? { ...row, variantItemId } : row;
  });
}

/**
 * FormData: the validated `variantQuantities` value (or undefined). The first
 * param is kept for call-site compatibility; the legacy `configuration` fallback
 * was removed.
 */
export function readVariantQuantitiesFormRaw(
  _formData: FormData,
  fromValidator?: string | null
): string | undefined {
  return typeof fromValidator === "string" && fromValidator
    ? fromValidator
    : undefined;
}
