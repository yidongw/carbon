import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { StyleVariantLineMeta } from "~/modules/shared/styleConfigDisplay";

const COLOR_ATTRIBUTE_ID = "iat_color";
const SIZE_ATTRIBUTE_ID = "iat_size";

/**
 * For order line itemIds that are variant SKUs (any parent item type — garment
 * Styles carry color + size, Fabric/Trim Consumables carry color only), return
 * the parent + attribute codes so the PO/SO summary can group the variant lines
 * under their master item with chips.
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

  const variantIds = variants.data.map((v) => v.id);
  const attrs = await client
    .from("itemVariantAttribute")
    .select(
      `itemVariantId, attributeId, attributeValue:itemAttributeValue!itemVariantAttribute_attributeValueId_fkey(code)`
    )
    .eq("companyId", companyId)
    .in("itemVariantId", variantIds);

  const colorSizeByVariantId = new Map<
    string,
    { colorCode: string; sizeCode: string }
  >();
  for (const row of attrs.data ?? []) {
    const code = (
      row.attributeValue as { code?: string | null } | null
    )?.code?.trim();
    if (!code) continue;
    const current = colorSizeByVariantId.get(row.itemVariantId) ?? {
      colorCode: "",
      sizeCode: ""
    };
    if (row.attributeId === COLOR_ATTRIBUTE_ID) current.colorCode = code;
    if (row.attributeId === SIZE_ATTRIBUTE_ID) current.sizeCode = code;
    colorSizeByVariantId.set(row.itemVariantId, current);
  }

  const result: Record<string, StyleVariantLineMeta> = {};
  for (const row of variants.data) {
    const parent = row.parent as {
      id: string;
      readableId: string;
      name: string | null;
      thumbnailPath: string | null;
    } | null;
    if (!parent?.readableId) continue;

    let colorCode = colorSizeByVariantId.get(row.id)?.colorCode ?? "";
    let sizeCode = colorSizeByVariantId.get(row.id)?.sizeCode ?? "";
    // Fallback: valuesKey is `COLOR|SIZE` for Style variants.
    if ((!colorCode || !sizeCode) && row.valuesKey) {
      const [c, s] = String(row.valuesKey).split("|");
      colorCode = colorCode || c || "";
      sizeCode = sizeCode || s || "";
    }

    result[row.variantItemId] = {
      variantItemId: row.variantItemId,
      parentItemId: row.parentItemId,
      parentReadableId: parent.readableId,
      parentName: parent.name,
      parentThumbnailPath: parent.thumbnailPath,
      colorCode,
      sizeCode
    };
  }

  return result;
}
