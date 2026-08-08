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
    configuration: unknown;
  }
): Promise<
  { ok: true; variants: StyleVariantQuantity[] } | { ok: false; error: string }
> {
  const expanded = await expandConfigTableToVariantQuantities(client, args);
  if (expanded.error) {
    return { ok: false, error: expanded.error.message };
  }
  if (expanded.data.length === 0) {
    return {
      ok: false,
      error: "Style quantity configuration has no quantities"
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
        "Style variants are missing for one or more color/size cells. Open the style and save color/size selections first."
    };
  }

  return { ok: true, variants: expanded.data };
}

export function hasStyleConfigTable(configuration: unknown): boolean {
  if (!configuration || typeof configuration !== "object") return false;
  const table = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(table) && table.length > 0;
}
