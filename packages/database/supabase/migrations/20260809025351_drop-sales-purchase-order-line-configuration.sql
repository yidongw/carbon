-- Style variant qty grids on SO/PO are FormData-only → expand to child SKU
-- lines. The JSONB column is unused on the happy path; drop it.

DROP VIEW IF EXISTS "salesOrderLines";
DROP VIEW IF EXISTS "purchaseOrderLines";

ALTER TABLE "salesOrderLine" DROP COLUMN IF EXISTS "configuration";
ALTER TABLE "purchaseOrderLine" DROP COLUMN IF EXISTS "configuration";

CREATE VIEW "purchaseOrderLines" WITH (security_invoker=true) AS
 SELECT DISTINCT ON (pl.id) pl.id,
    pl."purchaseOrderId",
    pl."purchaseOrderLineType",
    pl."itemId",
    pl."assetId",
    pl.description,
    pl."purchaseQuantity",
    pl."quantityReceived",
    pl."quantityInvoiced",
    pl."supplierUnitPrice",
    pl."inventoryUnitOfMeasureCode",
    pl."purchaseUnitOfMeasureCode",
    pl."locationId",
    pl."storageUnitId",
    pl."setupPrice",
    pl."receivedComplete",
    pl."invoicedComplete",
    pl."requiresInspection",
    pl."companyId",
    pl."createdAt",
    pl."createdBy",
    pl."updatedAt",
    pl."updatedBy",
    pl."customFields",
    pl."conversionFactor",
    pl.tags,
    pl."internalNotes",
    pl."externalNotes",
    pl."exchangeRate",
    pl."supplierShippingCost",
    pl."modelUploadId",
    pl."supplierTaxAmount",
    pl."quantityToReceive",
    pl."quantityToInvoice",
    pl."supplierExtendedPrice",
    pl."taxPercent",
    pl."jobId",
    pl."jobOperationId",
    pl."quantityShipped",
    pl."promisedDate",
    pl."unitPrice",
    pl."extendedPrice",
    pl."shippingCost",
    pl."taxAmount",
    pl."accountId",
    pl."requiredDate",
    pl."receivedDate",
    pl."costCenterId",
    pl."ownerId",
    pl."jobOperationSupplierQuantityReportId",
    pl."supplierPartId",
    pl."sortOrder",
    sp."supplierPartId" AS "supplierPartIdFromSupplier",
        CASE
            WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
            WHEN i."thumbnailPath" IS NULL AND imu."thumbnailPath" IS NOT NULL THEN imu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i.name AS "itemName",
    i."readableIdWithRevision" AS "itemReadableId",
    i.description AS "itemDescription",
    COALESCE(mu.id, imu.id) AS "modelId",
    COALESCE(mu."autodeskUrn", imu."autodeskUrn") AS "autodeskUrn",
    COALESCE(mu."modelPath", imu."modelPath") AS "modelPath",
    COALESCE(mu.name, imu.name) AS "modelName",
    COALESCE(mu.size, imu.size) AS "modelSize",
    ic."unitCost",
    jo.description AS "jobOperationDescription",
    a.name AS "accountName",
    fa."fixedAssetId" AS "assetReadableId",
    fa.name AS "assetName"
   FROM "purchaseOrderLine" pl
     JOIN "purchaseOrder" so ON so.id = pl."purchaseOrderId"
     LEFT JOIN "modelUpload" mu ON pl."modelUploadId" = mu.id
     LEFT JOIN item i ON i.id = pl."itemId"
     LEFT JOIN "itemCost" ic ON ic."itemId" = i.id
     LEFT JOIN "modelUpload" imu ON imu.id = i."modelUploadId"
     LEFT JOIN "jobOperation" jo ON jo.id = pl."jobOperationId"
     LEFT JOIN account a ON a.id = pl."accountId"
     LEFT JOIN "fixedAsset" fa ON fa.id = pl."assetId"
     LEFT JOIN "supplierPart" sp ON sp."supplierId" = so."supplierId" AND sp."itemId" = i.id;

CREATE VIEW "salesOrderLines" WITH (security_invoker=true) AS
 SELECT sl.id,
    sl."salesOrderId",
    sl."salesOrderLineType",
    sl."itemId",
    sl."assetId",
    sl.description,
    sl."saleQuantity",
    sl."quantitySent",
    sl."quantityInvoiced",
    sl."unitPrice",
    sl."unitOfMeasureCode",
    sl."locationId",
    sl."storageUnitId",
    sl."setupPrice",
    sl."sentComplete",
    sl."invoicedComplete",
    sl."requiresInspection",
    sl."companyId",
    sl."createdAt",
    sl."createdBy",
    sl."updatedAt",
    sl."updatedBy",
    sl."customFields",
    sl.status,
    sl."modelUploadId",
    sl."promisedDate",
    sl."addOnCost",
    sl."methodType",
    sl."exchangeRate",
    sl."shippingCost",
    sl."taxPercent",
    sl."internalNotes",
    sl."externalNotes",
    sl."quantityToSend",
    sl."quantityToInvoice",
    sl."convertedAddOnCost",
    sl."convertedShippingCost",
    sl."convertedUnitPrice",
    sl."sentDate",
    sl."accountId",
    sl."nonTaxableAddOnCost",
    sl."convertedNonTaxableAddOnCost",
    sl."pricingRuleId",
    sl."priceTrace",
    sl."deletedAt",
    sl."deletedBy",
    sl."sortOrder",
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
            WHEN i."thumbnailPath" IS NULL AND imu."thumbnailPath" IS NOT NULL THEN imu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    COALESCE(mu.id, imu.id) AS "modelId",
    COALESCE(mu."autodeskUrn", imu."autodeskUrn") AS "autodeskUrn",
    COALESCE(mu."modelPath", imu."modelPath") AS "modelPath",
    COALESCE(mu.name, imu.name) AS "modelName",
    COALESCE(mu.size, imu.size) AS "modelSize",
    ic."unitCost",
    cp."customerPartId",
    cp."customerPartRevision",
    so."orderDate",
    so."customerId",
    so."salesOrderId" AS "salesOrderReadableId",
    fa."fixedAssetId" AS "assetReadableId",
    fa.name AS "assetName"
   FROM "salesOrderLine" sl
     JOIN "salesOrder" so ON so.id = sl."salesOrderId"
     LEFT JOIN "modelUpload" mu ON sl."modelUploadId" = mu.id
     LEFT JOIN item i ON i.id = sl."itemId"
     LEFT JOIN "itemCost" ic ON ic."itemId" = i.id
     LEFT JOIN "modelUpload" imu ON imu.id = i."modelUploadId"
     LEFT JOIN "customerPartToItem" cp ON cp."customerId" = so."customerId" AND cp."itemId" = i.id
     LEFT JOIN "fixedAsset" fa ON fa.id = sl."assetId";

NOTIFY pgrst, 'reload schema';
