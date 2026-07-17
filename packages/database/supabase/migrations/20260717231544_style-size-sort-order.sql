-- Style sizes were displayed alphabetically by "sizeCode" (2XL, 3XL, L, M, S,
-- XL, XS, OS), which is meaningless for apparel. Add an explicit "sortOrder" so
-- sizes render smallest→largest with "OS" (one size) last, matching the
-- canonical order in packages/database/src/styleReference.ts. New/custom sizes
-- default to 100 so they append after the standard set.

ALTER TABLE "styleSize" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 100;

-- Backfill the standard seeded sizes to their canonical apparel order.
UPDATE "styleSize" SET "sortOrder" = CASE "sizeCode"
  WHEN 'XS'  THEN 0
  WHEN 'S'   THEN 1
  WHEN 'M'   THEN 2
  WHEN 'L'   THEN 3
  WHEN 'XL'  THEN 4
  WHEN '2XL' THEN 5
  WHEN '3XL' THEN 6
  WHEN 'OS'  THEN 7
  ELSE "sortOrder"
END
WHERE "sizeCode" IN ('XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'OS');

-- Recreate the styles view so its "sizes" aggregate orders by "sortOrder"
-- instead of alphabetically by "sizeCode". Everything else is unchanged.
CREATE OR REPLACE VIEW "styles" WITH (SECURITY_INVOKER=true) AS
WITH latest_items AS (
  SELECT DISTINCT ON (i."readableId", i."companyId")
    i.*
  FROM "item" i
  WHERE i."type" = 'Style'
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
  ) AS sizes
FROM "style" s
INNER JOIN latest_items li ON li."id" = s."itemId"
LEFT JOIN item_revisions ir ON ir."readableId" = li."readableId" AND ir."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

NOTIFY pgrst, 'reload schema';
