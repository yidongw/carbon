/**
 * Variant SKU helpers for edge functions (Deno).
 * Mirrors apps/erp/.../itemAttribute.service.ts expandVariantsQuantityTable.
 *
 * Matches by the stable `variantItemId` when present, falling back to the legacy
 * `valuesKey` (attribute value codes joined by `|` in set order) from combo flat
 * rows (variantItemId? + valuesKey? + Quantities). Fails loud if a config cell
 * has no matching variant SKU.
 */

type SupabaseLike = {
  from: (table: string) => any;
};

type VariantsQuantityRow = Record<string, unknown>;

type VariantMatch = { variantItemId: string; valuesKey: string };

async function loadParentVariants(
  client: SupabaseLike,
  parentItemId: string,
  companyId: string
): Promise<{
  byId: Map<string, VariantMatch>;
  byKey: Map<string, VariantMatch>;
}> {
  const { data: variants, error: variantsError } = await client
    .from("itemVariant")
    .select("id, variantItemId, valuesKey")
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId);

  if (variantsError) throw variantsError;

  const byId = new Map<string, VariantMatch>();
  const byKey = new Map<string, VariantMatch>();
  for (const r of (variants ?? []) as Array<{
    variantItemId: string;
    valuesKey: string;
  }>) {
    if (!r.variantItemId) continue;
    const match: VariantMatch = {
      variantItemId: r.variantItemId,
      valuesKey: r.valuesKey
    };
    byId.set(r.variantItemId, match);
    if (r.valuesKey) byKey.set(r.valuesKey, match);
  }
  return { byId, byKey };
}

export async function expandVariantsQuantityTable(
  client: SupabaseLike,
  args: {
    parentItemId: string;
    companyId: string;
    variantQuantities: unknown;
  }
): Promise<
  Array<{ variantItemId: string; quantity: number; valuesKey: string }>
> {
  const raw = (args.variantQuantities ?? {}) as Record<string, unknown>;
  const table = Array.isArray(raw.variantTable)
    ? (raw.variantTable as VariantsQuantityRow[])
    : [];

  const cells: Array<{
    variantItemId: string;
    valuesKey: string;
    quantity: number;
  }> = [];

  // Combo-only: expand { variantItemId?, valuesKey?, Quantities } rows. Legacy
  // Color×Size matrix configs are retired.
  for (const row of table) {
    const variantItemId = String(row.variantItemId ?? "").trim();
    const valuesKey = String(row.valuesKey ?? "").trim();
    if (!variantItemId && !valuesKey) continue;
    const qty = Number(row.Quantities ?? 0);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    cells.push({ variantItemId, valuesKey, quantity: qty });
  }

  if (cells.length === 0) return [];

  const { byId, byKey } = await loadParentVariants(
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
    // Prefer the stable variantItemId; fall back to the legacy valuesKey.
    const match =
      (cell.variantItemId ? byId.get(cell.variantItemId) : undefined) ??
      (cell.valuesKey ? byKey.get(cell.valuesKey) : undefined);
    if (!match) {
      const descriptor = cell.variantItemId || cell.valuesKey;
      throw new Error(
        `No variant SKU exists for ${descriptor}. Open the item and save its attribute selections to generate variants before shipping or receiving.`
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

export function hasVariantsQuantityTable(variantQuantities: unknown): boolean {
  if (!variantQuantities || typeof variantQuantities !== "object") return false;
  const cfg = variantQuantities as { variantTable?: unknown };
  return Array.isArray(cfg.variantTable);
}
