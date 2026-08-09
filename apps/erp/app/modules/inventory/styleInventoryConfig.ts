/**
 * Map Style ledger on-hand into a variants-quantity shape that
 * `buildVariantsQuantityEditorState` can use as inventory reference hints / caps.
 *
 * Style editors are combo-shaped (`valuesKey` + `Quantities`) after the
 * attributes refactor; legacy variants quantity matrix shape is still accepted as input
 * and converted to combo keys (`BK|M`).
 */

export type StyleOnHandEntry = {
  /** Canonical combo key (e.g. `BK|M`). */
  valuesKey?: string | null;
  quantityOnHand: number;
};

export type VariantQuantitiesPayload = {
  configTable: Record<string, unknown>[];
};

/** Empty tagged breakdown — every combo hint reads as 0. */
export const EMPTY_VARIANT_QUANTITIES: VariantQuantitiesPayload = {
  configTable: []
};

function valuesKeyOf(entry: StyleOnHandEntry): string {
  return entry.valuesKey?.trim() ?? "";
}

/**
 * Aggregate on-hand into Style combo config rows (`valuesKey` + `Quantities`).
 * Returns null when nothing is tagged / no variant breakdown.
 */
export function breakdownToInventoryVariantsQuantity(
  entries: StyleOnHandEntry[]
): VariantQuantitiesPayload | null {
  const byKey = new Map<string, number>();

  for (const entry of entries) {
    const valuesKey = valuesKeyOf(entry);
    const qty = Number(entry.quantityOnHand) || 0;
    if (!valuesKey || qty <= 0) continue;
    byKey.set(valuesKey, (byKey.get(valuesKey) ?? 0) + qty);
  }

  if (byKey.size === 0) return null;

  const configTable = Array.from(byKey.entries()).map(
    ([valuesKey, Quantities]) => ({
      valuesKey,
      Quantities
    })
  );

  return { configTable };
}

/** Build remaining-mode reference context from inventory config + sibling lines. */
export function buildInventoryVariantsQuantityReferenceContext({
  variantQuantities,
  otherLineVariantQuantities = []
}: {
  variantQuantities: VariantQuantitiesPayload | null | undefined;
  otherLineVariantQuantities?: unknown[];
}) {
  if (!variantQuantities) return undefined;
  return {
    mode: "remaining" as const,
    originalConfiguration: variantQuantities,
    otherLineConfigurations: otherLineVariantQuantities.filter((c) => c != null)
  };
}
