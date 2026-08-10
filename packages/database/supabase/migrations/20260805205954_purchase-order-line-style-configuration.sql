-- Persist Style color×size quantity grids on purchase order lines (same shape
-- as salesOrderLine.configuration / job production quantity config tables).

-- `pl.*` is expanded at CREATE time, so rebuild the view to expose the new column.
DROP VIEW IF EXISTS "purchaseOrderLines";
CREATE OR REPLACE VIEW "purchaseOrderLines" WITH(SECURITY_INVOKER=true) AS (
  SELECT DISTINCT ON (pl.id)
    pl.*,
    sp."supplierPartId" as "supplierPartIdFromSupplier",
    CASE
      WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
      WHEN i."thumbnailPath" IS NULL AND imu."thumbnailPath" IS NOT NULL THEN imu."thumbnailPath"
      ELSE i."thumbnailPath"
    END as "thumbnailPath",
    i.name as "itemName",
    i."readableIdWithRevision" as "itemReadableId",
    i.description as "itemDescription",
    COALESCE(mu.id, imu.id) as "modelId",
    COALESCE(mu."autodeskUrn", imu."autodeskUrn") as "autodeskUrn",
    COALESCE(mu."modelPath", imu."modelPath") as "modelPath",
    COALESCE(mu."name", imu."name") as "modelName",
    COALESCE(mu."size", imu."size") as "modelSize",
    ic."unitCost" as "unitCost",
    jo."description" as "jobOperationDescription",
    a."name" as "accountName",
    fa."fixedAssetId" as "assetReadableId",
    fa."name" as "assetName"
  FROM "purchaseOrderLine" pl
  INNER JOIN "purchaseOrder" so ON so.id = pl."purchaseOrderId"
  LEFT JOIN "modelUpload" mu ON pl."modelUploadId" = mu."id"
  LEFT JOIN "item" i ON i.id = pl."itemId"
  LEFT JOIN "itemCost" ic ON ic."itemId" = i.id
  LEFT JOIN "modelUpload" imu ON imu.id = i."modelUploadId"
  LEFT JOIN "jobOperation" jo ON jo."id" = pl."jobOperationId"
  LEFT JOIN "account" a ON a.id = pl."accountId"
  LEFT JOIN "fixedAsset" fa ON fa.id = pl."assetId"
  LEFT JOIN "supplierPart" sp ON sp."supplierId" = so."supplierId" AND sp."itemId" = i.id
);
