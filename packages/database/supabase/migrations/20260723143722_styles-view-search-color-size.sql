-- The Styles list search filters on colorCode/colorName, but the "styles" view
-- only exposed colors/sizes as JSON aggregates. PostgREST validates every column
-- in an `or=` filter up-front, so referencing the non-existent columns made the
-- WHOLE search request fail with `column styles.colorCode does not exist` (400) --
-- the list showed "no data" for any search term. Expose flat, searchable text
-- aggregates (colorCodes/colorNames/sizeCodes) so styles can be searched by
-- color and size without breaking. New columns are appended at the end so
-- CREATE OR REPLACE VIEW keeps the existing column order.
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
  ) AS sizes,
  -- Flat, searchable text aggregates (appended for CREATE OR REPLACE compatibility)
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
INNER JOIN latest_items li ON li."id" = s."itemId"
LEFT JOIN item_revisions ir ON ir."readableId" = li."readableId" AND ir."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;
