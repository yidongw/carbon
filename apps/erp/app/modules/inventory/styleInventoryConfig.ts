/**
 * Map Style ledger on-hand into a variants-quantity shape that
 * `buildVariantsQuantityEditorState` can use as inventory reference hints / caps.
 *
 * Style editors are identified by the stable `variantItemId` (+ `Quantities`)
 * after the attributes refactor.
 */

export type StyleOnHandEntry = {
  /** Stable variant item id (identity of the SKU). */
  variantItemId?: string | null;
  quantityOnHand: number;
};

export type VariantQuantitiesPayload = {
  variantTable: Record<string, unknown>[];
};

/** Empty tagged breakdown — every combo hint reads as 0. */
export const EMPTY_VARIANT_QUANTITIES: VariantQuantitiesPayload = {
  variantTable: []
};

function variantItemIdOf(entry: StyleOnHandEntry): string {
  return entry.variantItemId?.trim() ?? "";
}

/**
 * Aggregate on-hand into Style config rows (`variantItemId` + `Quantities`).
 * Returns null when nothing is tagged / no variant breakdown.
 */
export function breakdownToInventoryVariantsQuantity(
  entries: StyleOnHandEntry[]
): VariantQuantitiesPayload | null {
  const byKey = new Map<string, number>();

  for (const entry of entries) {
    const variantItemId = variantItemIdOf(entry);
    const qty = Number(entry.quantityOnHand) || 0;
    if (!variantItemId || qty <= 0) continue;
    byKey.set(variantItemId, (byKey.get(variantItemId) ?? 0) + qty);
  }

  if (byKey.size === 0) return null;

  const variantTable = Array.from(byKey.entries()).map(
    ([variantItemId, Quantities]) => ({
      variantItemId,
      Quantities
    })
  );

  return { variantTable };
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
    originalVariantTable: variantQuantities,
    otherLineVariantTables: otherLineVariantQuantities.filter((c) => c != null)
  };
}
