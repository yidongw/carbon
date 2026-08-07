/**
 * Variant SKU helpers for edge functions (Deno).
 * Mirrors apps/erp/.../itemAttribute.service.ts + styleOrderLines.server.ts.
 *
 * Resolution is order-independent (matches a variant by its frozen color/size
 * attribute values, not by a positional `color|size` string) and FAILS LOUD:
 * if a config cell has no matching variant SKU we throw rather than silently
 * posting the quantity onto the parent item. Every caller runs inside a
 * try/catch that returns the error to the client, so a missing variant surfaces
 * as a clear error instead of mis-posted inventory.
 */

type SupabaseLike = {
  from: (table: string) => any;
};

type ConfigRow = Record<string, unknown>;

// Order-independent key for the SET of attribute value codes identifying a
// variant ({color, size} for a garment Style, {color} for a Fabric/Trim
// Consumable, …). Matching by an unordered code set — not by fixed color/size
// positions — lets one expander handle size×color, color-only, or any future
// single-attribute grid without hardcoding the roles.
function codeSetKey(codes: Array<string | null | undefined>): string {
  return codes
    .map((c) => (c ?? "").trim())
    .filter(Boolean)
    .sort()
    .join("|");
}

type VariantMatch = { variantItemId: string; valuesKey: string };

/**
 * Load every variant SKU of a parent item, keyed by its frozen color/size
 * attribute value codes.
 */
async function loadVariantsByCombo(
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
  const rows = (variants ?? []) as Array<{
    id: string;
    variantItemId: string;
    valuesKey: string;
  }>;
  if (rows.length === 0) return map;

  const { data: attrs, error: attrsError } = await client
    .from("itemVariantAttribute")
    .select("itemVariantId, attributeId, itemAttributeValue(code)")
    .eq("companyId", companyId)
    .in(
      "itemVariantId",
      rows.map((r) => r.id)
    );

  if (attrsError) throw attrsError;

  // Collect every attribute value code per variant (color, size, …) so the key
  // reflects whatever attributes the variant actually carries.
  const codesByVariant = new Map<string, string[]>();
  for (const a of (attrs ?? []) as Array<{
    itemVariantId: string;
    attributeId: string;
    itemAttributeValue?: { code?: string | null } | null;
  }>) {
    const code = a.itemAttributeValue?.code ?? null;
    if (!code) continue;
    const list = codesByVariant.get(a.itemVariantId) ?? [];
    list.push(code);
    codesByVariant.set(a.itemVariantId, list);
  }

  for (const r of rows) {
    map.set(codeSetKey(codesByVariant.get(r.id) ?? []), {
      variantItemId: r.variantItemId,
      valuesKey: r.valuesKey
    });
  }

  return map;
}

export async function expandConfigTableToVariantQuantities(
  client: SupabaseLike,
  args: {
    parentItemId: string;
    companyId: string;
    configuration: unknown;
  }
): Promise<Array<{ variantItemId: string; quantity: number; valuesKey: string }>> {
  const raw = (args.configuration ?? {}) as Record<string, unknown>;
  const table = Array.isArray(raw.configTable)
    ? (raw.configTable as ConfigRow[])
    : [];
  const primaryKeys = Array.isArray(raw.configTablePrimaryKeys)
    ? (raw.configTablePrimaryKeys as string[])
    : [];

  // Collect the requested cells as { attribute codes, quantity }. Descriptor
  // columns (any non-primary cell carrying an attribute code, e.g. the Color
  // column of a size×color grid) combine with the primary column key; a
  // color-only grid has no descriptor column so its color codes ARE the keys.
  const cells: Array<{ codes: string[]; quantity: number }> = [];
  for (const row of table) {
    const descriptorCodes = Object.entries(row)
      .filter(
        ([key, value]) =>
          !primaryKeys.includes(key) &&
          typeof value === "string" &&
          value.trim() !== ""
      )
      .map(([, value]) => String(value).trim());
    for (const primaryKey of primaryKeys) {
      const qty = Number(row[primaryKey] ?? 0);
      if (!Number.isFinite(qty) || qty <= 0) continue;
      cells.push({ codes: [...descriptorCodes, primaryKey], quantity: qty });
    }
  }

  if (cells.length === 0) return [];

  const variantsByCombo = await loadVariantsByCombo(
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
    const key = codeSetKey(cell.codes);
    const match = variantsByCombo.get(key);
    if (!match) {
      const label = cell.codes.filter(Boolean).join(" / ") || "(base)";
      throw new Error(
        `No variant SKU exists for ${label}. Open the item and save its attribute selections to generate variants before shipping or receiving.`
      );
    }
    if (seen.has(match.variantItemId)) {
      // Two config cells resolved to the same SKU — the config is ambiguous.
      throw new Error(
        `The quantity configuration maps more than one cell to the same variant SKU.`
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

export function hasConfigTable(configuration: unknown): boolean {
  if (!configuration || typeof configuration !== "object") return false;
  const table = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(table) && table.length > 0;
}
