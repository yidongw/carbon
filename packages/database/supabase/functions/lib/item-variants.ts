/**
 * Variant SKU helpers for edge functions (Deno).
 * Mirrors apps/erp/.../itemAttribute.service.ts expandConfigTableToVariantQuantities.
 *
 * Matches by valuesKey (attribute value codes joined by `|` in set order).
 * Dual-reads combo flat rows (valuesKey + Quantities) and legacy matrices.
 * Fails loud if a config cell has no matching variant SKU.
 */

type SupabaseLike = {
  from: (table: string) => any;
};

type ConfigRow = Record<string, unknown>;

function firstCode(...vals: unknown[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

function rowValueForAttrKey(row: ConfigRow, attrCode: string): string | null {
  const lower = attrCode.toLowerCase();
  return firstCode(
    row[attrCode],
    row[lower],
    row[`${lower}Code`],
    lower === "color" ? row.colorCode : null
  );
}

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

async function getParentSetAttributeCodes(
  client: SupabaseLike,
  parentItemId: string,
  companyId: string
): Promise<string[]> {
  const { data: item, error: itemErr } = await client
    .from("item")
    .select("attributeSetId")
    .eq("id", parentItemId)
    .eq("companyId", companyId)
    .maybeSingle();
  if (itemErr) throw itemErr;
  if (!item?.attributeSetId) return [];

  const { data: setAttrs, error: setAttrErr } = await client
    .from("itemAttributeSetAttribute")
    .select("sortOrder, itemAttribute:attributeId(code)")
    .eq("attributeSetId", item.attributeSetId)
    .order("sortOrder", { ascending: true });
  if (setAttrErr) throw setAttrErr;

  return (
    (setAttrs ?? []) as Array<{ itemAttribute: { code: string } | null }>
  )
    .map((r) => r.itemAttribute?.code)
    .filter((c): c is string => !!c);
}

export async function expandConfigTableToVariantQuantities(
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
    ? (raw.configTable as ConfigRow[])
    : [];
  const primaryKeys = Array.isArray(raw.configTablePrimaryKeys)
    ? (raw.configTablePrimaryKeys as string[])
    : [];

  const cells: Array<{ valuesKey: string; quantity: number }> = [];

  const isComboFlat =
    primaryKeys.length === 1 &&
    primaryKeys[0] === "Quantities" &&
    table.some(
      (row) =>
        typeof row.valuesKey === "string" &&
        String(row.valuesKey).trim().length > 0
    );

  if (isComboFlat) {
    for (const row of table) {
      const valuesKey = String(row.valuesKey ?? "").trim();
      if (!valuesKey) continue;
      const qty = Number(row.Quantities ?? 0);
      if (!Number.isFinite(qty) || qty <= 0) continue;
      cells.push({ valuesKey, quantity: qty });
    }
  } else {
    const attrCodes = await getParentSetAttributeCodes(
      client,
      args.parentItemId,
      args.companyId
    );
    const codes =
      attrCodes.length > 0 ? attrCodes : (["Color", "Size"] as string[]);
    const descriptorCodes = codes.slice(0, -1);

    for (const row of table) {
      for (const primaryValue of primaryKeys) {
        const qty = Number(row[primaryValue] ?? 0);
        if (!Number.isFinite(qty) || qty <= 0) continue;

        const parts: string[] = [];
        for (const code of descriptorCodes) {
          const v = rowValueForAttrKey(row, code);
          if (!v) {
            throw new Error(
              `Configuration row is missing ${code} for quantity column ${primaryValue}.`
            );
          }
          parts.push(v);
        }
        parts.push(primaryValue);
        cells.push({ valuesKey: parts.join("|"), quantity: qty });
      }
    }
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

export function hasConfigTable(configuration: unknown): boolean {
  if (!configuration || typeof configuration !== "object") return false;
  const table = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(table) && table.length > 0;
}
