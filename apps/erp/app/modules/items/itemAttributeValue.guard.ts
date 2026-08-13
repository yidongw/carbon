/**
 * Once an attribute value's `code` is referenced — by a variant SKU
 * (`itemVariantAttribute`) or an item's attribute selection
 * (`itemAttributeSelection`) — that code is the value's stable identity inside
 * stored combos (`itemVariant.valuesKey`, order/inventory grid cells). Renaming
 * the code would leave those stored keys stale, so we block a CODE change while
 * the value is referenced. The display `name` and `sortOrder` stay freely
 * editable — only the identity code is frozen. Repurposing a code should mean
 * creating a new value, not renaming an in-use one.
 *
 * Pure decision helper so it can be unit-tested without a DB.
 */
export function isAttributeValueCodeChangeBlocked(args: {
  currentCode: string;
  nextCode: string;
  referenceCount: number;
}): boolean {
  return (
    args.referenceCount > 0 && args.nextCode.trim() !== args.currentCode.trim()
  );
}

export const ATTRIBUTE_VALUE_CODE_LOCKED_MESSAGE =
  "This value's code is in use by variant SKUs or item selections and can't be changed. Rename the display name instead, or create a new value.";
