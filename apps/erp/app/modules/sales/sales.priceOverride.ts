import type { PriceOverrideBreak } from "./types";

/**
 * Item ids to search for a price override: the line SKU first, then its
 * Style/attribute parent. Quantity breaks on the parent apply to the family.
 */
export function priceOverrideLookupItemIds(
  itemId: string,
  parentItemId: string | null | undefined
): string[] {
  if (!parentItemId || parentItemId === itemId) return [itemId];
  return [itemId, parentItemId];
}

/**
 * Break matching uses the family total when the caller knows sibling SKU
 * quantities (sum of children). Otherwise the line quantity.
 */
export function variantFamilyBreakQuantity(
  lineQuantity: number,
  familyQuantity?: number
): number {
  return familyQuantity ?? lineQuantity;
}

/** Sum of sibling SKU quantities for Style family price breaks. */
export function familyQuantityFromVariantRows(
  variants: Array<{ quantity: number }>
): number {
  return variants.reduce((sum, v) => sum + Number(v.quantity || 0), 0);
}

/** Sum sibling lines on a document, replacing the current line with the typed qty. */
export function familyQuantityFromSiblingLines(args: {
  lineQuantity: number;
  currentLineId?: string;
  siblingLines: Array<{ id: string; saleQuantity: number | null | undefined }>;
}): number {
  const others = args.siblingLines
    .filter((line) => line.id !== args.currentLineId)
    .reduce((sum, line) => sum + Number(line.saleQuantity ?? 0), 0);
  return others + args.lineQuantity;
}

/**
 * Picks MAX(quantity) <= input. A break at quantity N only applies once the
 * requested quantity reaches N; below the smallest rung, no override applies.
 */
export function pickBestBreak(
  breaks: PriceOverrideBreak[],
  quantity: number
): PriceOverrideBreak | null {
  let best: PriceOverrideBreak | null = null;
  for (const b of breaks) {
    if (b.quantity > quantity) continue;
    if (!best || b.quantity > best.quantity) best = b;
  }
  return best;
}
