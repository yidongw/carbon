import type { BreakdownEntry } from "./types";

// Sort a Style breakdown by its human label, keeping untagged rows (no label)
// last.
export function sortBreakdown(breakdown: BreakdownEntry[]): BreakdownEntry[] {
  return [...breakdown].sort((a, b) => {
    const al = (a.label ?? "").trim();
    const bl = (b.label ?? "").trim();
    if (!al && bl) return 1;
    if (al && !bl) return -1;
    return al.localeCompare(bl);
  });
}

// Ensure a breakdown sums to `value`. If the tagged SKUs only account for part
// of the total, the remainder is shown as a single untagged catch-all row so
// the grid always reconciles to `value`.
export function padBreakdownToTotal(
  breakdown: BreakdownEntry[],
  value: number
): BreakdownEntry[] {
  if (value <= 0) return breakdown;
  const sum = breakdown.reduce((s, e) => s + (e.quantityOnHand ?? 0), 0);
  if (sum < value) {
    return [
      ...breakdown,
      { variantItemId: null, label: null, quantityOnHand: value - sum }
    ];
  }
  return breakdown;
}

export type StorageSkuRow = {
  storageUnitId: string | null;
  quantity: number;
  variantItemId?: string | null;
  skuLabel?: string | null;
};

export type AggregatedStorageUnit = {
  key: string;
  storageUnitId: string | null;
  quantity: number;
  breakdown: BreakdownEntry[];
};

// Collapse per-SKU storage rows (the same bin appears once per variant) into one
// row per storage unit, summing the quantity and keeping a per-SKU breakdown.
// Insertion order (first appearance of each storage unit) is preserved.
export function aggregateStorageUnitsBySku(
  rows: StorageSkuRow[]
): AggregatedStorageUnit[] {
  const byUnit = new Map<string, AggregatedStorageUnit>();
  for (const r of rows) {
    const key = r.storageUnitId ?? "";
    let agg = byUnit.get(key);
    if (!agg) {
      agg = {
        key,
        storageUnitId: r.storageUnitId,
        quantity: 0,
        breakdown: []
      };
      byUnit.set(key, agg);
    }
    agg.quantity += r.quantity;
    const vid = r.variantItemId ?? null;
    const entry = agg.breakdown.find((b) => (b.variantItemId ?? null) === vid);
    if (entry) entry.quantityOnHand += r.quantity;
    else
      agg.breakdown.push({
        variantItemId: vid,
        label: r.skuLabel ?? null,
        quantityOnHand: r.quantity
      });
  }
  return [...byUnit.values()];
}
