import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { StyleVariantLineMeta } from "~/modules/shared/styleConfigDisplay";

/**
 * For order line itemIds that are variant SKUs, return the parent + attribute
 * codes (from valuesKey) so PO/SO summaries can group variant lines under
 * their master with chips. No Color/Size hardcoding.
 */
export async function getStyleVariantLineMetaByItemIds(
  client: SupabaseClient<Database>,
  itemIds: string[],
  companyId: string
): Promise<Record<string, StyleVariantLineMeta>> {
  const unique = [...new Set(itemIds.filter(Boolean))];
  if (unique.length === 0) return {};

  const variants = await client
    .from("itemVariant")
    .select(
      `id, variantItemId, parentItemId, valuesKey,
       parent:item!itemVariant_parentItemId_fkey(id, readableId, name, thumbnailPath)`
    )
    .eq("companyId", companyId)
    .in("variantItemId", unique);

  if (variants.error || !variants.data?.length) return {};

  const result: Record<string, StyleVariantLineMeta> = {};
  for (const row of variants.data) {
    const parent = row.parent as {
      id: string;
      readableId: string;
      name: string | null;
      thumbnailPath: string | null;
    } | null;
    if (!parent?.readableId) continue;

    const attributeCodes = String(row.valuesKey ?? "")
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);

    result[row.variantItemId] = {
      variantItemId: row.variantItemId,
      parentItemId: row.parentItemId,
      parentReadableId: parent.readableId,
      parentName: parent.name,
      parentThumbnailPath: parent.thumbnailPath,
      attributeCodes
    };
  }

  return result;
}
