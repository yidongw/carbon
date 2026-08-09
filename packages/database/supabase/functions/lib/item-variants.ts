/**
 * Variant SKU helpers for edge functions (Deno).
 * Mirrors apps/erp/.../itemAttribute.service.ts expandVariantsQuantityTable.
 *
 * Matches by valuesKey (attribute value codes joined by `|` in set order) from
 * combo flat rows (valuesKey + Quantities). Fails loud if a config cell has no
 * matching variant SKU.
 */

type SupabaseLike = {
  from: (table: string) => any;
};

type VariantsQuantityRow = Record<string, unknown>;

type VariantMatch = { variantItemId: string; valuesKey: string };

async function loadVariantsByValuesKey(
  client: SupabaseLike,
  parentItemId: string,
  companyId: string
): Promise<Map<string, VariantMatch>> {
  const { data: variants, error: variantsError } = await client
    .from("itemVariant")
    .select("id, variantItemId, valuesKey")
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId);

  if (variantsError) throw variantsError;

  const map = new Map<string, VariantMatch>();
  for (const r of (variants ?? []) as Array<{
    variantItemId: string;
    valuesKey: string;
  }>) {
    if (!r.valuesKey) continue;
    map.set(r.valuesKey, {
      variantItemId: r.variantItemId,
      valuesKey: r.valuesKey
    });
  }
  return map;
}

export async function expandVariantsQuantityTable(
  client: SupabaseLike,
  args: {
    parentItemId: string;
    companyId: string;
    configuration: unknown;
  }
): Promise<
  Array<{ variantItemId: string; quantity: number; valuesKey: string }>
> {
  const raw = (args.configuration ?? {}) as Record<string, unknown>;
  const table = Array.isArray(raw.configTable)
    ? (raw.configTable as VariantsQuantityRow[])
    : [];

  const cells: Array<{ valuesKey: string; quantity: number }> = [];

  // Combo-only: expand { valuesKey, Quantities } rows. Legacy Color×Size matrix
  // configs are retired.
  for (const row of table) {
    const valuesKey = String(row.valuesKey ?? "").trim();
    if (!valuesKey) continue;
    const qty = Number(row.Quantities ?? 0);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    cells.push({ valuesKey, quantity: qty });
  }

  if (cells.length === 0) return [];

  const variantsByKey = await loadVariantsByValuesKey(
    client,
    args.parentItemId,
    args.companyId
  );

  const out: Array<{
    variantItemId: string;
    quantity: number;
    valuesKey: string;
  }> = [];
  const seen = new Set<string>();
  for (const cell of cells) {
    const match = variantsByKey.get(cell.valuesKey);
    if (!match) {
      throw new Error(
        `No variant SKU exists for ${cell.valuesKey}. Open the item and save its attribute selections to generate variants before shipping or receiving.`
      );
    }
    if (seen.has(match.variantItemId)) {
      throw new Error(
        "Configuration maps more than one cell to the same variant SKU."
      );
    }
    seen.add(match.variantItemId);
    out.push({
      variantItemId: match.variantItemId,
      quantity: cell.quantity,
      valuesKey: match.valuesKey
    });
  }

  return out;
}

export function hasVariantsQuantityTable(configuration: unknown): boolean {
  if (!configuration || typeof configuration !== "object") return false;
  const table = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(table) && table.length > 0;
}
