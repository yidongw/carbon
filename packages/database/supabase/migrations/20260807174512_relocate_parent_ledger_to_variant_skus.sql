-- Relocate legacy parent-booked Style/Consumable stock onto its variant SKUs.
--
-- Before variant SKUs existed, garment/consumable stock was booked on the
-- PARENT item's itemLedger with colorCode/sizeCode. Now variants are the
-- stockable identities, so move each parent ledger row onto the variant child
-- whose frozen color/size attribute values match its colorCode/sizeCode.
--
-- Matching is exact on (parentItemId, colorCode, sizeCode); the unique
-- (parentItemId, valuesKey, companyId) constraint guarantees at most one variant
-- per combination, so there is no fan-out. Parent rows that have no matching
-- variant (e.g. a color/size combo that was never selected, or rows with no
-- color/size) are left on the parent and still surface via the additive rollup
-- in get_inventory_quantities.
--
-- trackedEntity has no itemId column — its item association is through the
-- itemLedger row (itemLedger.trackedEntityId) — so serial/batch entities follow
-- automatically once the ledger row is relocated. colorCode/sizeCode are left in
-- place (harmless: the variant breakdown reads the SKU's attributes, and the
-- parent-legacy breakdown only matches rows still booked on the parent).

UPDATE "itemLedger" il
SET "itemId" = m."variantItemId"
FROM (
  SELECT
    iv."variantItemId",
    iv."parentItemId",
    iv."companyId",
    cav."code" AS "colorCode",
    sav."code" AS "sizeCode"
  FROM "itemVariant" iv
  LEFT JOIN "itemVariantAttribute" cva
    ON cva."itemVariantId" = iv."id"
   AND cva."companyId" = iv."companyId"
   AND cva."attributeId" = 'iat_color'
  LEFT JOIN "itemAttributeValue" cav ON cav."id" = cva."attributeValueId"
  LEFT JOIN "itemVariantAttribute" sva
    ON sva."itemVariantId" = iv."id"
   AND sva."companyId" = iv."companyId"
   AND sva."attributeId" = 'iat_size'
  LEFT JOIN "itemAttributeValue" sav ON sav."id" = sva."attributeValueId"
) m
WHERE il."itemId" = m."parentItemId"
  AND il."companyId" = m."companyId"
  AND COALESCE(il."colorCode", '') = COALESCE(m."colorCode", '')
  AND COALESCE(il."sizeCode", '') = COALESCE(m."sizeCode", '')
  -- Only relocate rows that actually carry a color or size (real Style stock);
  -- never move a plain parent row onto a variant.
  AND (il."colorCode" IS NOT NULL OR il."sizeCode" IS NOT NULL);

NOTIFY pgrst, 'reload schema';
