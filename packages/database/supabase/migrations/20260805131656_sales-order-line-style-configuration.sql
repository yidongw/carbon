ALTER TYPE "salesOrderLineType" ADD VALUE IF NOT EXISTS 'Style';

-- Postgres will not let the rest of this migration reference newly-added enum
-- values until the current transaction commits.
COMMIT;
BEGIN;

ALTER TABLE "salesOrderLine" DROP CONSTRAINT IF EXISTS "salesOrderLineType_check";
ALTER TABLE "salesOrderLine"
ADD CONSTRAINT "salesOrderLineType_check"
CHECK (
  (
    "salesOrderLineType" = 'Comment' AND
    "itemId" IS NULL AND
    "accountId" IS NULL AND
    "assetId" IS NULL AND
    "description" IS NOT NULL
  )
  OR (
    (
      "salesOrderLineType" = 'Style' OR
      "salesOrderLineType" = 'Part' OR
      "salesOrderLineType" = 'Material' OR
      "salesOrderLineType" = 'Tool' OR
      "salesOrderLineType" = 'Consumable' OR
      "salesOrderLineType" = 'Fixture' OR
      "salesOrderLineType" = 'Service'
    ) AND
    "itemId" IS NOT NULL AND
    "accountId" IS NULL AND
    "assetId" IS NULL
  )
  OR (
    "salesOrderLineType" = 'Fixed Asset' AND
    "itemId" IS NULL AND
    "accountId" IS NULL AND
    "assetId" IS NOT NULL
  )
);

ALTER TABLE "salesOrderLine" ADD COLUMN IF NOT EXISTS "configuration" JSONB;

DROP VIEW IF EXISTS "salesOrderLines";
CREATE VIEW "salesOrderLines" WITH(SECURITY_INVOKER=true) AS (
  SELECT
    sl.*,
    i."readableIdWithRevision" as "itemReadableId",
    CASE
      WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
      WHEN i."thumbnailPath" IS NULL AND imu."thumbnailPath" IS NOT NULL THEN imu."thumbnailPath"
      ELSE i."thumbnailPath"
    END as "thumbnailPath",
    COALESCE(mu.id, imu.id) as "modelId",
    COALESCE(mu."autodeskUrn", imu."autodeskUrn") as "autodeskUrn",
    COALESCE(mu."modelPath", imu."modelPath") as "modelPath",
    COALESCE(mu."name", imu."name") as "modelName",
    COALESCE(mu."size", imu."size") as "modelSize",
    ic."unitCost" as "unitCost",
    cp."customerPartId",
    cp."customerPartRevision",
    so."orderDate",
    so."customerId",
    so."salesOrderId" as "salesOrderReadableId",
    fa."fixedAssetId" as "assetReadableId",
    fa."name" as "assetName"
  FROM "salesOrderLine" sl
  INNER JOIN "salesOrder" so ON so.id = sl."salesOrderId"
  LEFT JOIN "modelUpload" mu ON sl."modelUploadId" = mu."id"
  LEFT JOIN "item" i ON i.id = sl."itemId"
  LEFT JOIN "itemCost" ic ON ic."itemId" = i.id
  LEFT JOIN "modelUpload" imu ON imu.id = i."modelUploadId"
  LEFT JOIN "customerPartToItem" cp ON cp."customerId" = so."customerId" AND cp."itemId" = i.id
  LEFT JOIN "fixedAsset" fa ON fa.id = sl."assetId"
);

COMMIT;

-- PostgREST freezes its schema cache; without this, inserts that send
-- "configuration" fail with PGRST204 until something else reloads it.
NOTIFY pgrst, 'reload schema';
