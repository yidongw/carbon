export type VariantMixLine = {
  variantItemId: string;
  quantity: number;
};

/**
 * Read Style/attribute mix rows from quote/RFQ line `configuration.variantTable`.
 * Parent quantity stays on the line; this is the per-SKU breakdown for customer docs.
 */
export function readVariantTableMix(configuration: unknown): VariantMixLine[] {
  if (!configuration || typeof configuration !== "object") return [];
  const table = (configuration as { variantTable?: unknown }).variantTable;
  if (!Array.isArray(table)) return [];

  const lines: VariantMixLine[] = [];
  for (const row of table) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const variantItemId = String(record.variantItemId ?? "").trim();
    const quantity = Number(record.Quantities ?? record.quantity ?? 0);
    if (!variantItemId || !(quantity > 0)) continue;
    lines.push({ variantItemId, quantity });
  }
  return lines;
}

export function collectVariantMixItemIds(configurations: unknown[]): string[] {
  const ids = new Set<string>();
  for (const configuration of configurations) {
    for (const line of readVariantTableMix(configuration)) {
      ids.add(line.variantItemId);
    }
  }
  return Array.from(ids);
}

/** Customer-facing mix rows, e.g. `444-S × 60`. */
export function formatVariantTableMix(
  configuration: unknown,
  labelsByItemId?: Record<string, string>
): string[] {
  return readVariantTableMix(configuration).map(
    ({ variantItemId, quantity }) => {
      const label = labelsByItemId?.[variantItemId] || variantItemId;
      return `${label} × ${quantity}`;
    }
  );
}
