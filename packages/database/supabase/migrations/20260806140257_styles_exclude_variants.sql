-- Exclude variant SKU children from the styles list/view.
-- Variant items are type=Style (same as parent) but linked via itemVariant;
-- they must not appear as top-level Styles in the UI.

CREATE OR REPLACE VIEW "styles" WITH (SECURITY_INVOKER=true) AS
WITH latest_items AS (
  SELECT DISTINCT ON (i."readableId", i."companyId")
    i.*
  FROM "item" i
  WHERE i."type" = 'Style'
    AND NOT EXISTS (
      SELECT 1 FROM "itemVariant" iv WHERE iv."variantItemId" = i."id"
    )
  ORDER BY i."readableId", i."companyId",
    CASE WHEN i."revision" = '0' OR i."revision" = '' OR i."revision" IS NULL THEN 0 ELSE 1 END DESC,
    i."createdAt" DESC NULLS LAST
),
item_revisions AS (
  SELECT
    i."readableId",
    i."companyId",
    json_agg(
      json_build_object(
        'id', i.id,
        'revision', i."revision",
        'name', i."name",
        'description', i."description",
        'active', i."active",
        'createdAt', i."createdAt"
      ) ORDER BY
        CASE WHEN i."revision" = '0' OR i."revision" = '' OR i."revision" IS NULL THEN 0 ELSE 1 END,
        i."createdAt"
      ) AS "revisions"
  FROM "item" i
  WHERE i."type" = 'Style'
    AND NOT EXISTS (
      SELECT 1 FROM "itemVariant" iv WHERE iv."variantItemId" = i."id"
    )
  GROUP BY i."readableId", i."companyId"
)
SELECT
  li."active",
  li."assignee",
  li."defaultMethodType",
  li."sourcingType",
  li."description",
  li."itemTrackingType",
  li."name",
  li."replenishmentSystem",
  li."unitOfMeasureCode",
  li."notes",
  li."revision",
  li."readableId",
  li."readableIdWithRevision",
  li."id",
  li."companyId",
  li."thumbnailPath",
  (
    SELECT json_agg(json_build_object('id', sc."id", 'colorCode', sc."colorCode", 'colorName', sc."colorName") ORDER BY sc."colorCode")
    FROM "styleColorAssignment" sca
    JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
    WHERE sca."styleId" = s."id"
      AND sca."companyId" = s."companyId"
  ) AS colors,
  ir."revisions",
  s."customFields",
  s."tags",
  ic."itemPostingGroupId",
  li."createdBy",
  li."createdAt",
  li."updatedBy",
  li."updatedAt",
  (
    SELECT json_agg(json_build_object('id', ss."id", 'sizeCode', ss."sizeCode", 'sizeName', ss."sizeName") ORDER BY ss."sortOrder", ss."sizeCode")
    FROM "styleSizeAssignment" ssa
    JOIN "styleSize" ss ON ss."id" = ssa."styleSizeId"
    WHERE ssa."styleId" = s."id"
      AND ssa."companyId" = s."companyId"
  ) AS sizes,
  (
    SELECT string_agg(sc."colorCode", ' ' ORDER BY sc."colorCode")
    FROM "styleColorAssignment" sca
    JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
    WHERE sca."styleId" = s."id"
      AND sca."companyId" = s."companyId"
  ) AS "colorCodes",
  (
    SELECT string_agg(sc."colorName", ' ' ORDER BY sc."colorName")
    FROM "styleColorAssignment" sca
    JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
    WHERE sca."styleId" = s."id"
      AND sca."companyId" = s."companyId"
  ) AS "colorNames",
  (
    SELECT string_agg(ss."sizeCode", ' ' ORDER BY ss."sortOrder", ss."sizeCode")
    FROM "styleSizeAssignment" ssa
    JOIN "styleSize" ss ON ss."id" = ssa."styleSizeId"
    WHERE ssa."styleId" = s."id"
      AND ssa."companyId" = s."companyId"
  ) AS "sizeCodes"
FROM "style" s
INNER JOIN latest_items li ON li."readableId" = s."id" AND li."companyId" = s."companyId"
LEFT JOIN item_revisions ir ON ir."readableId" = li."readableId" AND ir."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

-- Drop orphan style extension rows created for variant SKUs by the Style insert interceptor
DELETE FROM "style" s
WHERE EXISTS (
  SELECT 1
  FROM "item" i
  JOIN "itemVariant" iv ON iv."variantItemId" = i."id"
  WHERE i."readableId" = s."id"
    AND i."companyId" = s."companyId"
    AND i."type" = 'Style'
);

NOTIFY pgrst, 'reload schema';
