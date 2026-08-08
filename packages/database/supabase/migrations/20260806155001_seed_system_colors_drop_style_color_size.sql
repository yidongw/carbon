-- 1) System Color catalog so Style pickers work before per-company seed.
-- 2) Recreate views that joined styleColor/styleSize to use itemAttributeValue.
-- 3) Drop legacy styleColor / styleSize tables.

INSERT INTO "itemAttributeValue" ("id", "attributeId", "code", "name", "sortOrder", "companyId", "createdBy")
VALUES
  ('iav_color_bk',  'iat_color', 'BK',  'Black',      100, NULL, 'system'),
  ('iav_color_wh',  'iat_color', 'WH',  'White',      100, NULL, 'system'),
  ('iav_color_gy',  'iat_color', 'GY',  'Gray',       100, NULL, 'system'),
  ('iav_color_lgy', 'iat_color', 'LGY', 'Light Gray', 100, NULL, 'system'),
  ('iav_color_ch',  'iat_color', 'CH',  'Charcoal',   100, NULL, 'system'),
  ('iav_color_nv',  'iat_color', 'NV',  'Navy',       100, NULL, 'system'),
  ('iav_color_bl',  'iat_color', 'BL',  'Blue',       100, NULL, 'system'),
  ('iav_color_lbl', 'iat_color', 'LBL', 'Light Blue', 100, NULL, 'system'),
  ('iav_color_rd',  'iat_color', 'RD',  'Red',        100, NULL, 'system'),
  ('iav_color_pk',  'iat_color', 'PK',  'Pink',       100, NULL, 'system'),
  ('iav_color_wn',  'iat_color', 'WN',  'Wine',       100, NULL, 'system'),
  ('iav_color_pp',  'iat_color', 'PP',  'Purple',     100, NULL, 'system'),
  ('iav_color_or',  'iat_color', 'OR',  'Orange',     100, NULL, 'system'),
  ('iav_color_yl',  'iat_color', 'YL',  'Yellow',     100, NULL, 'system'),
  ('iav_color_gr',  'iat_color', 'GR',  'Green',      100, NULL, 'system'),
  ('iav_color_ol',  'iat_color', 'OL',  'Olive',      100, NULL, 'system'),
  ('iav_color_bg',  'iat_color', 'BG',  'Beige',      100, NULL, 'system'),
  ('iav_color_cr',  'iat_color', 'CR',  'Cream',      100, NULL, 'system'),
  ('iav_color_kh',  'iat_color', 'KH',  'Khaki',      100, NULL, 'system'),
  ('iav_color_bn',  'iat_color', 'BN',  'Brown',      100, NULL, 'system')
ON CONFLICT ("id") DO NOTHING;

-- Final safety copy from legacy catalogs before drop.
INSERT INTO "itemAttributeValue" (
  "attributeId", "code", "name", "sortOrder", "companyId", "createdBy", "createdAt"
)
SELECT
  'iat_color',
  sc."colorCode",
  sc."colorName",
  100,
  sc."companyId",
  sc."createdBy",
  sc."createdAt"
FROM "styleColor" sc
WHERE sc."companyId" IS NOT NULL
ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING;

INSERT INTO "itemAttributeValue" (
  "attributeId", "code", "name", "sortOrder", "companyId", "createdBy", "createdAt"
)
SELECT
  'iat_size',
  ss."sizeCode",
  ss."sizeName",
  ss."sortOrder",
  ss."companyId",
  ss."createdBy",
  ss."createdAt"
FROM "styleSize" ss
WHERE ss."companyId" IS NOT NULL
ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING;

-- Prefer company-scoped attribute value name, else system catalog.
CREATE OR REPLACE VIEW "bundleWorkOrders" WITH (SECURITY_INVOKER=true) AS
SELECT
  bwo."id",
  bwo."masterWorkOrderId",
  bwo."jobId",
  bwo."companyId",
  bwo."sequence",
  bwo."colorCode",
  bwo."sizeCode",
  bwo."createdAt",
  bwo."createdBy",
  bwo."updatedAt",
  bwo."updatedBy",
  bwo."tags",
  j."jobId" AS "jobReadableId",
  j."status",
  j."quantity",
  j."dueDate",
  j."itemId",
  i."readableIdWithRevision",
  i."name" AS "itemName",
  j."assignee",
  j."quantityComplete",
  bwo."reportedQuantity",
  bwo."lastReportedAt",
  j."assignedAt",
  (
    SELECT count(*)
    FROM "jobOperation" jo
    WHERE jo."jobId" = bwo."jobId"
  )::integer AS "processCount",
  j."scrapQuantity",
  j."storageUnitId",
  j."locationId",
  j."salesOrderId",
  j."salesOrderLineId",
  sc."colorName"
FROM "bundleWorkOrder" bwo
JOIN "job" j ON j."id" = bwo."jobId"
LEFT JOIN "item" i
  ON i."id" = j."itemId" AND i."companyId" = j."companyId"
LEFT JOIN LATERAL (
  SELECT iav."name" AS "colorName"
  FROM "itemAttributeValue" iav
  WHERE iav."attributeId" = 'iat_color'
    AND iav."code" = bwo."colorCode"
    AND (iav."companyId" = bwo."companyId" OR iav."companyId" IS NULL)
  ORDER BY iav."companyId" NULLS LAST
  LIMIT 1
) sc ON true;

CREATE OR REPLACE VIEW "styleSamples" WITH (SECURITY_INVOKER=true) AS
SELECT
  s.*,
  ss."itemId" AS "sampleItemId",
  COALESCE(te."sampleCount", 0) AS "sampleCount",
  COALESCE(te."sampledColorCount", 0) AS "sampledColorCount",
  COALESCE(te."samples", '[]'::json) AS "samples"
FROM "styles" s
LEFT JOIN "styleSample" ss
  ON ss."styleId" = s."readableId" AND ss."companyId" = s."companyId"
LEFT JOIN LATERAL (
  SELECT
    sum(g."qty") AS "sampleCount",
    count(DISTINCT g."colorCode") AS "sampledColorCount",
    json_agg(
      json_build_object(
        'colorCode', g."colorCode",
        'colorName', g."colorName",
        'size', g."size",
        'quantity', g."qty"
      ) ORDER BY g."colorCode", g."size"
    ) AS "samples"
  FROM (
    SELECT
      t."attributes"->>'Color' AS "colorCode",
      COALESCE(sc."colorName", t."attributes"->>'Color') AS "colorName",
      t."attributes"->>'Size' AS "size",
      count(*)::int AS "qty"
    FROM "trackedEntity" t
    LEFT JOIN LATERAL (
      SELECT iav."name" AS "colorName"
      FROM "itemAttributeValue" iav
      WHERE iav."attributeId" = 'iat_color'
        AND iav."code" = t."attributes"->>'Color'
        AND (iav."companyId" = t."companyId" OR iav."companyId" IS NULL)
      ORDER BY iav."companyId" NULLS LAST
      LIMIT 1
    ) sc ON true
    WHERE t."sourceDocument" = 'Item'
      AND t."sourceDocumentId" = ss."itemId"
      AND t."companyId" = s."companyId"
      AND COALESCE(t."attributes"->>'Color', '') <> ''
      AND COALESCE(t."attributes"->>'Size', '') <> ''
    GROUP BY 1, 2, 3
  ) g
) te ON true;

-- salesOrderLines may join styleColor/styleSize on some DBs (colorName/sizeName).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_depend d
    JOIN pg_rewrite r ON r.oid = d.objid
    JOIN pg_class c ON c.oid = r.ev_class
    JOIN pg_class t ON t.oid = d.refobjid
    WHERE t.relname IN ('styleColor', 'styleSize')
      AND c.relname = 'salesOrderLines'
  ) THEN
    EXECUTE $view$
      CREATE OR REPLACE VIEW "salesOrderLines" WITH (SECURITY_INVOKER=true) AS
      SELECT
        sl.*,
        i."readableIdWithRevision" AS "itemReadableId",
        CASE
          WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
          WHEN i."thumbnailPath" IS NULL AND imu."thumbnailPath" IS NOT NULL THEN imu."thumbnailPath"
          ELSE i."thumbnailPath"
        END AS "thumbnailPath",
        COALESCE(mu.id, imu.id) AS "modelId",
        COALESCE(mu."autodeskUrn", imu."autodeskUrn") AS "autodeskUrn",
        COALESCE(mu."modelPath", imu."modelPath") AS "modelPath",
        COALESCE(mu."name", imu."name") AS "modelName",
        COALESCE(mu."size", imu."size") AS "modelSize",
        ic."unitCost",
        cp."customerPartId",
        cp."customerPartRevision",
        so."orderDate",
        so."customerId",
        so."salesOrderId" AS "salesOrderReadableId",
        NULL::text AS "assetReadableId",
        NULL::text AS "assetName",
        sc."colorName",
        ss."sizeName"
      FROM "salesOrderLine" sl
      JOIN "salesOrder" so ON so.id = sl."salesOrderId"
      LEFT JOIN "modelUpload" mu ON sl."modelUploadId" = mu.id
      LEFT JOIN item i ON i.id = sl."itemId"
      LEFT JOIN "itemCost" ic ON ic."itemId" = i.id
      LEFT JOIN "modelUpload" imu ON imu.id = i."modelUploadId"
      LEFT JOIN "customerPartToItem" cp
        ON cp."customerId" = so."customerId" AND cp."itemId" = i.id
      LEFT JOIN LATERAL (
        SELECT iav."name" AS "colorName"
        FROM "itemAttributeValue" iav
        WHERE iav."attributeId" = 'iat_color'
          AND iav."code" = sl."colorCode"
          AND (iav."companyId" = sl."companyId" OR iav."companyId" IS NULL)
        ORDER BY iav."companyId" NULLS LAST
        LIMIT 1
      ) sc ON true
      LEFT JOIN LATERAL (
        SELECT iav."name" AS "sizeName"
        FROM "itemAttributeValue" iav
        WHERE iav."attributeId" = 'iat_size'
          AND iav."code" = sl."sizeCode"
          AND (iav."companyId" = sl."companyId" OR iav."companyId" IS NULL)
        ORDER BY iav."companyId" NULLS LAST
        LIMIT 1
      ) ss ON true
    $view$;
  END IF;
END $$;

DROP TABLE IF EXISTS "styleColor";
DROP TABLE IF EXISTS "styleSize";

NOTIFY pgrst, 'reload schema';
