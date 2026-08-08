-- styles.colors / styles.sizes ids are now itemAttributeValue ids (not
-- styleColor / styleSize catalog ids). Style pickers and Add Color/Size submit
-- attribute value ids; sync writes selections directly.

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
    SELECT json_agg(
      json_build_object(
        'id', iav."id",
        'colorCode', iav."code",
        'colorName', COALESCE(iav."name", iav."code")
      ) ORDER BY iav."sortOrder", iav."code"
    )
    FROM "itemAttributeSelection" ias
    JOIN "itemAttributeValue" iav ON iav."id" = ias."attributeValueId"
    WHERE ias."itemId" = li."id"
      AND ias."companyId" = li."companyId"
      AND ias."attributeId" = 'iat_color'
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
    SELECT json_agg(
      json_build_object(
        'id', iav."id",
        'sizeCode', iav."code",
        'sizeName', COALESCE(iav."name", iav."code")
      ) ORDER BY iav."sortOrder", iav."code"
    )
    FROM "itemAttributeSelection" ias
    JOIN "itemAttributeValue" iav ON iav."id" = ias."attributeValueId"
    WHERE ias."itemId" = li."id"
      AND ias."companyId" = li."companyId"
      AND ias."attributeId" = 'iat_size'
  ) AS sizes,
  (
    SELECT string_agg(iav."code", ' ' ORDER BY iav."sortOrder", iav."code")
    FROM "itemAttributeSelection" ias
    JOIN "itemAttributeValue" iav ON iav."id" = ias."attributeValueId"
    WHERE ias."itemId" = li."id"
      AND ias."companyId" = li."companyId"
      AND ias."attributeId" = 'iat_color'
  ) AS "colorCodes",
  (
    SELECT string_agg(COALESCE(iav."name", iav."code"), ' ' ORDER BY iav."sortOrder", iav."code")
    FROM "itemAttributeSelection" ias
    JOIN "itemAttributeValue" iav ON iav."id" = ias."attributeValueId"
    WHERE ias."itemId" = li."id"
      AND ias."companyId" = li."companyId"
      AND ias."attributeId" = 'iat_color'
  ) AS "colorNames",
  (
    SELECT string_agg(iav."code", ' ' ORDER BY iav."sortOrder", iav."code")
    FROM "itemAttributeSelection" ias
    JOIN "itemAttributeValue" iav ON iav."id" = ias."attributeValueId"
    WHERE ias."itemId" = li."id"
      AND ias."companyId" = li."companyId"
      AND ias."attributeId" = 'iat_size'
  ) AS "sizeCodes"
FROM "style" s
INNER JOIN latest_items li ON li."readableId" = s."id" AND li."companyId" = s."companyId"
LEFT JOIN item_revisions ir ON ir."readableId" = li."readableId" AND ir."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

NOTIFY pgrst, 'reload schema';
