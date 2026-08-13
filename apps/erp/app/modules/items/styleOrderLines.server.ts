import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { readVariantTableRows } from "../production/variantTableWire";
import { expandVariantsQuantityTable } from "./itemAttribute.service";

type Db = SupabaseClient<Database>;

export type StyleVariantQuantity = {
  variantItemId: string;
  quantity: number;
  valuesKey: string;
};

/**
 * Expand Style variantTable into variant SKU quantities, failing if multi-cell
 * configs still resolve to the parent (variants not synced yet).
 */
export async function expandVariantTableToLines(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    variantQuantities: unknown;
  }
): Promise<
  { ok: true; variants: StyleVariantQuantity[] } | { ok: false; error: string }
> {
  const expanded = await expandVariantsQuantityTable(client, {
    parentItemId: args.parentItemId,
    companyId: args.companyId,
    variantQuantities: args.variantQuantities
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

export function hasStyleVariantsQuantity(variantQuantities: unknown): boolean {
  return readVariantTableRows(variantQuantities).length > 0;
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
  if (hasStyleVariantsQuantity(args.variantQuantities)) {
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

/**
 * Map expanded variant SKUs onto material-row payloads (BOM / job / quote).
 * Keeps shared fields from `base` and overrides `itemId` + `quantity` per SKU.
 */
export function buildMaterialRowsFromVariants<
  T extends { itemId?: string | null; quantity: number }
>(
  base: T,
  variants: StyleVariantQuantity[]
): Array<T & { itemId: string; quantity: number }> {
  return variants.map((variant) => ({
    ...base,
    itemId: variant.variantItemId,
    quantity: variant.quantity
  }));
}

/**
 * Resolve FormData variant quantities for a material line: expand to SKU rows,
 * fall back to a single row, or reject bare attribute-parent quantities.
 */
export async function resolveMaterialVariantQuantities(
  client: Db,
  args: {
    companyId: string;
    itemId: string | undefined | null;
    quantity: number;
    variantQuantities: unknown;
  }
): Promise<
  | { ok: true; mode: "single"; quantity: number }
  | { ok: true; mode: "expand"; variants: StyleVariantQuantity[] }
  | { ok: false; error: string }
> {
  const { itemId, companyId, quantity, variantQuantities } = args;

  if (itemId && hasStyleVariantsQuantity(variantQuantities)) {
    const expanded = await expandVariantTableToLines(client, {
      parentItemId: itemId,
      companyId,
      variantQuantities
    });
    if (!expanded.ok) return expanded;

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === itemId;
    if (onlyParent) {
      return {
        ok: true,
        mode: "single",
        quantity: expanded.variants[0].quantity
      };
    }

    return { ok: true, mode: "expand", variants: expanded.variants };
  }

  if (itemId) {
    const guard = await requireVariantQuantitiesIfAttributeParent(client, {
      parentItemId: itemId,
      companyId,
      variantQuantities,
      quantity
    });
    if (!guard.ok) return guard;
  }

  return { ok: true, mode: "single", quantity };
}
