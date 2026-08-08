import type { BreakdownEntry } from "./types";

// Sort a Style breakdown by SKU identity (valuesKey = "color|size"), keeping
// untagged rows (no valuesKey) last.
export function sortBreakdown(breakdown: BreakdownEntry[]): BreakdownEntry[] {
  return [...breakdown].sort((a, b) => {
    const ak = a.valuesKey ?? "";
    const bk = b.valuesKey ?? "";
    if (!ak && bk) return 1;
    if (ak && !bk) return -1;
    return ak.localeCompare(bk);
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
      { valuesKey: null, label: null, quantityOnHand: value - sum }
    ];
  }
  return breakdown;
}

export type StorageSkuRow = {
  storageUnitId: string | null;
  quantity: number;
  valuesKey?: string | null;
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
    const vk = r.valuesKey ?? null;
    const entry = agg.breakdown.find((b) => (b.valuesKey ?? null) === vk);
    if (entry) entry.quantityOnHand += r.quantity;
    else
      agg.breakdown.push({
        valuesKey: vk,
        label: r.skuLabel ?? null,
        quantityOnHand: r.quantity
      });
  }
  return [...byUnit.values()];
}
