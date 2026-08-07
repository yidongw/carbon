-- Expose attributeSetId + attributes JSON on consumables (mirror styles).

DROP VIEW IF EXISTS "consumables";

-- Exclude variant child SKUs from the consumables list/view (same pattern as styles).
-- Variant items are type=Consumable but linked via itemVariant; they must not appear
-- as top-level Consumables even if a consumable interceptor row exists.

CREATE VIEW "consumables" WITH (SECURITY_INVOKER=true) AS
WITH latest_items AS (
  SELECT DISTINCT ON (i."readableId", i."companyId")
    i.*,
    mu."modelPath",
    mu."thumbnailPath" as "modelThumbnailPath",
    mu."name" as "modelName",
    mu."size" as "modelSize"
  FROM "item" i
  LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
  WHERE i."type" = 'Consumable'
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
        'methodType', i."defaultMethodType",
        'type', i."type"
      ) ORDER BY
        CASE WHEN i."revision" = '0' OR i."revision" = '' OR i."revision" IS NULL THEN 0 ELSE 1 END,
        i."createdAt"
      ) as "revisions"
  FROM "item" i
  WHERE i."type" = 'Consumable'
    AND NOT EXISTS (
      SELECT 1 FROM "itemVariant" iv WHERE iv."variantItemId" = i."id"
    )
  GROUP BY i."readableId", i."companyId"
)
SELECT
  li."active",
  li."assignee",
  li."defaultMethodType",
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
  CASE
    WHEN li."thumbnailPath" IS NULL AND li."modelThumbnailPath" IS NOT NULL THEN li."modelThumbnailPath"
    ELSE li."thumbnailPath"
  END as "thumbnailPath",
  li."modelUploadId",
  li."modelPath",
  li."modelName",
  li."modelSize",
  li."attributeSetId",
  (
    SELECT COALESCE(json_agg(attr_row.obj ORDER BY attr_row."sortOrder"), '[]'::json)
    FROM (
      SELECT
        COALESCE(isa."sortOrder", 100) AS "sortOrder",
        json_build_object(
          'attributeId', ia."id",
          'code', ia."code",
          'name', ia."name",
          'values', COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', iav."id",
                'code', iav."code",
                'name', COALESCE(iav."name", iav."code")
              ) ORDER BY iav."sortOrder", iav."code"
            )
            FROM "itemAttributeSelection" ias
            JOIN "itemAttributeValue" iav ON iav."id" = ias."attributeValueId"
            WHERE ias."itemId" = li."id"
              AND ias."companyId" = li."companyId"
              AND ias."attributeId" = ia."id"
          ), '[]'::json)
        ) AS obj
      FROM "itemAttribute" ia
      LEFT JOIN "itemAttributeSetAttribute" isa
        ON isa."attributeId" = ia."id"
       AND isa."attributeSetId" = li."attributeSetId"
      WHERE EXISTS (
        SELECT 1
        FROM "itemAttributeSelection" ias
        WHERE ias."itemId" = li."id"
          AND ias."companyId" = li."companyId"
          AND ias."attributeId" = ia."id"
      )
    ) attr_row
  ) AS attributes,
  ps."supplierIds",
  uom.name as "unitOfMeasure",
  ir."revisions",
  c."customFields",
  c."tags",
  ic."itemPostingGroupId",
  (
    SELECT COALESCE(
      jsonb_object_agg(
        eim."integration",
        CASE
          WHEN eim."metadata" IS NOT NULL THEN eim."metadata"
          ELSE to_jsonb(eim."externalId")
        END
      ) FILTER (WHERE eim."externalId" IS NOT NULL OR eim."metadata" IS NOT NULL),
      '{}'::jsonb
    )
    FROM "externalIntegrationMapping" eim
    WHERE eim."entityType" = 'item' AND eim."entityId" = li.id
  ) AS "externalId",
  li."createdBy",
  li."createdAt",
  li."updatedBy",
  li."updatedAt"
FROM "consumable" c
  INNER JOIN latest_items li ON li."readableId" = c."id" AND li."companyId" = c."companyId"
LEFT JOIN item_revisions ir ON ir."readableId" = c."id" AND ir."companyId" = li."companyId"
LEFT JOIN (
  SELECT
    "itemId",
    "companyId",
    string_agg(ps."supplierPartId", ',') AS "supplierIds"
  FROM "supplierPart" ps
  GROUP BY "itemId", "companyId"
) ps ON ps."itemId" = li."id" AND ps."companyId" = li."companyId"
LEFT JOIN "unitOfMeasure" uom ON uom.code = li."unitOfMeasureCode" AND uom."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

NOTIFY pgrst, 'reload schema';
