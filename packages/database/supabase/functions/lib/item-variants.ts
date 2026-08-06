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

const COLOR_ATTRIBUTE_ID = "iat_color";
const SIZE_ATTRIBUTE_ID = "iat_size";

function firstCode(...vals: unknown[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

// Normalized, order-independent key for a (color, size) combination.
function comboKey(colorCode: string | null, sizeCode: string | null): string {
  return `c=${colorCode ?? ""};s=${sizeCode ?? ""}`;
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

  const colorByVariant = new Map<string, string | null>();
  const sizeByVariant = new Map<string, string | null>();
  for (const a of (attrs ?? []) as Array<{
    itemVariantId: string;
    attributeId: string;
    itemAttributeValue?: { code?: string | null } | null;
  }>) {
    const code = a.itemAttributeValue?.code ?? null;
    if (a.attributeId === COLOR_ATTRIBUTE_ID) {
      colorByVariant.set(a.itemVariantId, code);
    } else if (a.attributeId === SIZE_ATTRIBUTE_ID) {
      sizeByVariant.set(a.itemVariantId, code);
    }
  }

  for (const r of rows) {
    const key = comboKey(
      colorByVariant.get(r.id) ?? null,
      sizeByVariant.get(r.id) ?? null
    );
    map.set(key, { variantItemId: r.variantItemId, valuesKey: r.valuesKey });
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

  // Collect the requested (color, size, quantity) cells.
  const cells: Array<{
    colorCode: string | null;
    sizeCode: string | null;
    quantity: number;
  }> = [];
  for (const row of table) {
    const color = firstCode(row.color, row.Color, row.colorCode);
    for (const size of primaryKeys) {
      const qty = Number(row[size] ?? 0);
      if (!Number.isFinite(qty) || qty <= 0) continue;
      cells.push({ colorCode: color, sizeCode: size || null, quantity: qty });
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
    const key = comboKey(cell.colorCode, cell.sizeCode);
    const match = variantsByCombo.get(key);
    if (!match) {
      const label =
        [cell.colorCode, cell.sizeCode].filter(Boolean).join(" / ") || "(base)";
      throw new Error(
        `No variant SKU exists for ${label}. Open the style and save its color/size selections to generate variants before shipping or receiving.`
      );
    }
    if (seen.has(match.variantItemId)) {
      // Two config cells resolved to the same SKU — the config is ambiguous.
      throw new Error(
        `Style configuration maps more than one color/size cell to the same variant SKU.`
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
