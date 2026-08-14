import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadVariantCombos } from "~/modules/items/itemAttribute.service";
import type { StyleVariantLineMeta } from "~/modules/shared/variantDisplay";

/**
 * For order line itemIds that are variant SKUs, return the parent + attribute
 * value labels (from the itemVariantAttribute join) so PO/SO summaries can group
 * variant lines under their master with chips. No Color/Size hardcoding.
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
      `id, variantItemId, parentItemId,
       parent:item!itemVariant_parentItemId_fkey(id, readableId, name, thumbnailPath)`
    )
    .eq("companyId", companyId)
    .in("variantItemId", unique);

  if (variants.error || !variants.data?.length) return {};

  const comboByVariant = await loadVariantCombos(client, unique, companyId);

  const result: Record<string, StyleVariantLineMeta> = {};
  for (const row of variants.data) {
    const parent = row.parent as {
      id: string;
      readableId: string;
      name: string | null;
      thumbnailPath: string | null;
    } | null;
    if (!parent?.readableId) continue;

    const attributeLabels = (comboByVariant.get(row.variantItemId) ?? "")
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);

    result[row.variantItemId] = {
      variantItemId: row.variantItemId,
      parentItemId: row.parentItemId,
      parentReadableId: parent.readableId,
      parentName: parent.name,
      parentThumbnailPath: parent.thumbnailPath,
      attributeLabels
    };
  }

  return result;
}
