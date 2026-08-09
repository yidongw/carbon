import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { expandConfigTableToVariantQuantities } from "./itemAttribute.service";

type Db = SupabaseClient<Database>;

export type StyleVariantQuantity = {
  variantItemId: string;
  quantity: number;
  valuesKey: string;
};

/**
 * Expand Style configTable into variant SKU quantities, failing if multi-cell
 * configs still resolve to the parent (variants not synced yet).
 */
export async function expandStyleConfigToVariantLines(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    variantQuantities: unknown;
  }
): Promise<
  { ok: true; variants: StyleVariantQuantity[] } | { ok: false; error: string }
> {
  const expanded = await expandConfigTableToVariantQuantities(client, {
    parentItemId: args.parentItemId,
    companyId: args.companyId,
    configuration: args.variantQuantities
  });
  if (expanded.error) {
    return { ok: false, error: expanded.error.message };
  }
  if (expanded.data.length === 0) {
    return {
      ok: false,
      error: "Variant quantities have no quantities"
    };
  }

  const parentItemId = args.parentItemId;
  const ids = expanded.data.map((v) => v.variantItemId);
  const unique = new Set(ids);
  if (
    expanded.data.length > 1 &&
    (unique.size < expanded.data.length || unique.has(parentItemId))
  ) {
    return {
      ok: false,
      error:
        "Style variants are missing for one or more attribute combos. Open the style and save attribute selections first."
    };
  }

  return { ok: true, variants: expanded.data };
}

export function hasStyleConfigTable(variantQuantities: unknown): boolean {
  if (!variantQuantities || typeof variantQuantities !== "object") return false;
  const table = (variantQuantities as Record<string, unknown>).configTable;
  return Array.isArray(table) && table.length > 0;
}

/**
 * Attribute parents (Style/Consumable with variants or an attribute set) must
 * submit a variant-quantities grid — never a bare parent qty while stock lives
 * on child SKUs.
 */
export async function requireVariantQuantitiesIfAttributeParent(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    variantQuantities: unknown;
    quantity: number;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!args.parentItemId || !(args.quantity > 0)) {
    return { ok: true };
  }
  if (hasStyleConfigTable(args.variantQuantities)) {
    return { ok: true };
  }

  const [variants, selections] = await Promise.all([
    client
      .from("itemVariant")
      .select("id")
      .eq("parentItemId", args.parentItemId)
      .eq("companyId", args.companyId)
      .limit(1),
    client
      .from("itemAttributeSelection")
      .select("id")
      .eq("itemId", args.parentItemId)
      .eq("companyId", args.companyId)
      .limit(1)
  ]);

  if ((variants.data?.length ?? 0) > 0 || (selections.data?.length ?? 0) > 0) {
    return {
      ok: false,
      error: "Open the variant quantities grid to assign quantities"
    };
  }

  return { ok: true };
}
