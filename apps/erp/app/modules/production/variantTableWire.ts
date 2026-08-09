/**
 * Style/Consumable combo qty wire shape.
 *
 * Current key: `variantTable`. Transitional dual-read of legacy `configTable`
 * so stale tabs / external posters still expand correctly for one release.
 */

export const VARIANT_TABLE_KEY = "variantTable" as const;
export const LEGACY_VARIANT_TABLE_KEY = "configTable" as const;

export type VariantTableRow = Record<string, string | number | boolean>;

/** Prefer `variantTable`, fall back to legacy `configTable`. */
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

  const cfg = variantQuantities as Record<string, unknown>;
  const table = cfg[VARIANT_TABLE_KEY] ?? cfg[LEGACY_VARIANT_TABLE_KEY];
  if (!Array.isArray(table)) return [];
  return table as VariantTableRow[];
}

/**
 * Rewrite legacy `configTable` onto `variantTable` so downstream writers always
 * persist the current key.
 */
export function normalizeVariantQuantitiesPayload(
  parsed: Record<string, unknown>
): Record<string, unknown> {
  const current = parsed[VARIANT_TABLE_KEY];
  const legacy = parsed[LEGACY_VARIANT_TABLE_KEY];
  if (Array.isArray(current) || !Array.isArray(legacy)) {
    return parsed;
  }
  const { [LEGACY_VARIANT_TABLE_KEY]: _legacy, ...rest } = parsed;
  return { ...rest, [VARIANT_TABLE_KEY]: legacy };
}

/** FormData: prefer `variantQuantities`, fall back to legacy `configuration`. */
export function readVariantQuantitiesFormRaw(
  formData: FormData,
  fromValidator?: string | null
): string | undefined {
  if (typeof fromValidator === "string" && fromValidator) {
    return fromValidator;
  }
  const legacy = formData.get("configuration");
  return typeof legacy === "string" && legacy ? legacy : undefined;
}
