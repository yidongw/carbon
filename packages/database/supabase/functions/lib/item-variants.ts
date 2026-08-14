/**
 * Variant SKU helpers for edge functions (Deno).
 * Mirrors apps/erp/.../itemAttribute.service.ts expandVariantsQuantityTable.
 *
 * Each cell is `{ variantItemId, Quantities }`; matches by the stable
 * variantItemId (validated against the parent's variants). Fails loud if a cell
 * has no matching variant SKU.
 */

type SupabaseLike = {
  from: (table: string) => any;
};

type VariantsQuantityRow = Record<string, unknown>;

async function loadParentVariantIds(
  client: SupabaseLike,
  parentItemId: string,
  companyId: string
): Promise<Set<string>> {
  const { data: variants, error: variantsError } = await client
    .from("itemVariant")
    .select("variantItemId")
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId);

  if (variantsError) throw variantsError;

  const ids = new Set<string>();
  for (const r of (variants ?? []) as Array<{ variantItemId: string }>) {
    if (r.variantItemId) ids.add(r.variantItemId);
  }
  return ids;
}

export async function expandVariantsQuantityTable(
  client: SupabaseLike,
  args: {
    parentItemId: string;
    companyId: string;
    variantQuantities: unknown;
  }
): Promise<Array<{ variantItemId: string; quantity: number }>> {
  const raw = (args.variantQuantities ?? {}) as Record<string, unknown>;
  const table = Array.isArray(raw.variantTable)
    ? (raw.variantTable as VariantsQuantityRow[])
    : [];

  const cells: Array<{ variantItemId: string; quantity: number }> = [];
  for (const row of table) {
    const variantItemId = String(row.variantItemId ?? "").trim();
    if (!variantItemId) continue;
    const qty = Number(row.Quantities ?? 0);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    cells.push({ variantItemId, quantity: qty });
  }

  if (cells.length === 0) return [];

  const validIds = await loadParentVariantIds(
    client,
    args.parentItemId,
    args.companyId
  );

  const out: Array<{ variantItemId: string; quantity: number }> = [];
  const seen = new Set<string>();
  for (const cell of cells) {
    if (!validIds.has(cell.variantItemId)) {
      throw new Error(
        `No variant SKU exists for ${cell.variantItemId}. Open the item and save its attribute selections to generate variants before shipping or receiving.`
      );
    }
    if (seen.has(cell.variantItemId)) {
      throw new Error(
        "Configuration maps more than one cell to the same variant SKU."
      );
    }
    seen.add(cell.variantItemId);
    out.push({ variantItemId: cell.variantItemId, quantity: cell.quantity });
  }

  return out;
}

export function hasVariantsQuantityTable(variantQuantities: unknown): boolean {
  if (!variantQuantities || typeof variantQuantities !== "object") return false;
  const cfg = variantQuantities as { variantTable?: unknown };
  return Array.isArray(cfg.variantTable);
}
