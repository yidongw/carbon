/**
 * Combine per-SKU planning rows so a Style parent chart can show family totals.
 * Rows that share the same group keys have their quantity field summed.
 */
export function sumQuantityByGroup<T extends Record<string, unknown>>(
  rows: T[],
  quantityKey: keyof T,
  groupKeys: (keyof T)[]
): T[] {
  const grouped = new Map<string, T>();
  for (const row of rows) {
    const key = groupKeys.map((field) => String(row[field] ?? "")).join("|");
    const quantity = Number(row[quantityKey]) || 0;
    const existing = grouped.get(key);
    if (!existing) {
      grouped.set(key, { ...row, [quantityKey]: quantity });
      continue;
    }
    grouped.set(key, {
      ...existing,
      [quantityKey]: (Number(existing[quantityKey]) || 0) + quantity
    });
  }
  return [...grouped.values()];
}
