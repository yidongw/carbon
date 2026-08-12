/**
 * Client helpers for line/material quantity when an item parent uses the
 * per-variant quantity grid (has itemAttributeSelection rows) vs a plain SKU.
 *
 * Style is not special — any parent with attribute selections uses the grid.
 */

export function defaultLineQuantity(
  hasVariantAttributes: boolean,
  fallback = 1
): number {
  return hasVariantAttributes ? 0 : fallback;
}

/** Show grid UI on parent add/edit (hide on expanded variant SKU lines). */
export function shouldShowVariantQuantityGrid(args: {
  hasVariantAttributes: boolean;
  itemId: string | null | undefined;
  isEditing: boolean;
  variantQuantities: unknown;
}): boolean {
  return (
    args.hasVariantAttributes &&
    Boolean(args.itemId) &&
    !(args.isEditing && !args.variantQuantities)
  );
}

export function isMissingVariantQuantity(
  hasVariantsQuantity: boolean,
  quantity: number
): boolean {
  return hasVariantsQuantity && !(quantity > 0);
}
