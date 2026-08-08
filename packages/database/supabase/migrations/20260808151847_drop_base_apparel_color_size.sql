-- Retire the base-apparel colorCode/sizeCode columns. The generic attribute
-- model (itemVariant.valuesKey + per-variant itemLedger) fully replaces them.
-- get_inventory_quantities is recreated from its latest (dev) definition minus
-- the legacy itemLedger colorCode/sizeCode UNION branch (style_breakdown was the
-- only reader). Then drop the columns and recreate the two dependent views
-- (salesOrderLines, purchaseOrderLines) without color/size. Old rows carrying
-- these columns are being purged; no app code reads them.

DROP FUNCTION IF EXISTS get_inventory_quantities(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.get_inventory_quantities(company_id text, location_id text)
 RETURNS TABLE(id text, "readableId" text, "readableIdWithRevision" text, name text, active boolean, type "itemType", "itemTrackingType" "itemTrackingType", "replenishmentSystem" "itemReplenishmentSystem", "materialSubstanceId" text, "materialFormId" text, "dimensionId" text, dimension text, "finishId" text, finish text, "gradeId" text, grade text, "materialType" text, "materialTypeId" text, "thumbnailPath" text, "unitOfMeasureCode" text, "leadTime" integer, "lotSize" integer, "reorderingPolicy" "itemReorderingPolicy", "demandAccumulationPeriod" integer, "demandAccumulationSafetyStock" numeric, "reorderPoint" integer, "reorderQuantity" integer, "minimumOrderQuantity" integer, "maximumOrderQuantity" integer, "maximumInventoryQuantity" numeric, "orderMultiple" integer, "quantityOnHand" numeric, "quantityOnHold" numeric, "quantityRejected" numeric, "quantityOnSalesOrder" numeric, "quantityOnPurchaseOrder" numeric, "quantityOnProductionOrder" numeric, "quantityOnProductionDemand" numeric, "demandForecast" numeric, "usageLast30Days" numeric, "usageLast90Days" numeric, "daysRemaining" numeric, "storageTypeIds" text[], "storageUnitIds" text[], breakdown jsonb, "jobBreakdown" jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  BEGIN
    RETURN QUERY

WITH
  open_purchase_orders AS (
    SELECT
      pol."itemId",
      SUM(pol."quantityToReceive" * pol."conversionFactor") AS "quantityOnPurchaseOrder"
    FROM
      "purchaseOrder" po
      INNER JOIN "purchaseOrderLine" pol
        ON pol."purchaseOrderId" = po."id"
    WHERE
      po."status" IN (
        'Planned',
        'To Receive',
        'To Receive and Invoice'
      )
      AND po."companyId" = company_id
      AND pol."locationId" = location_id
    GROUP BY pol."itemId"
  ),
  open_sales_orders AS (
    SELECT
      sol."itemId",
      SUM(sol."quantityToSend") AS "quantityOnSalesOrder"
    FROM
      "salesOrder" so
      INNER JOIN "salesOrderLine" sol
        ON sol."salesOrderId" = so."id"
    WHERE
      so."status" IN (
        'Confirmed',
        'To Ship and Invoice',
        'To Ship',
        'To Invoice',
        'In Progress'
      )
      AND so."companyId" = company_id
      AND sol."locationId" = location_id
    GROUP BY sol."itemId"
  ),
  open_job_requirements AS (
    SELECT
      jm."itemId",
      SUM(jm."quantityToIssue") AS "quantityOnProductionDemand"
    FROM "jobMaterial" jm
    INNER JOIN "job" j ON jm."jobId" = j."id"
    WHERE j."status" IN (
        'Planned',
        'Ready',
        'In Progress',
        'Paused'
      )
    AND jm."methodType" != 'Make to Order'
    AND j."companyId" = company_id
    AND j."locationId" = location_id
    GROUP BY jm."itemId"
  ),
  -- Open jobs. A garment master WO is split into per-variant bundle jobs whose
  -- remaining drops as they receive to inventory, while the master's own
  -- remaining does not move until it is closed. So we count the open BUNDLE
  -- jobs (which reflect true WIP) and drop any master WO that HAS bundle jobs
  -- (it is represented by its bundles) -- otherwise a received bundle would
  -- still be counted under the un-closed master. Plain jobs and masters
  -- without bundles are counted as-is.
  open_jobs AS (
    SELECT
      j."itemId",
      SUM(j."productionQuantity" + j."scrapQuantity" - j."quantityReceivedToInventory" - j."quantityShipped") AS "quantityOnProductionOrder"
    FROM job j
    WHERE j."status" IN (
      'Planned',
      'Ready',
      'In Progress',
      'Paused'
    )
    AND j."companyId" = company_id
    AND j."locationId" = location_id
    AND j."id" NOT IN (
      SELECT mwo."jobId"
      FROM "masterWorkOrder" mwo
      WHERE mwo."companyId" = company_id
        AND EXISTS (
          SELECT 1 FROM "bundleWorkOrder" bwo
          WHERE bwo."masterWorkOrderId" = mwo."id"
        )
    )
    GROUP BY j."itemId"
  ),
  item_ledgers AS (
    SELECT
      "itemId",
      SUM("quantity") FILTER (
        WHERE "trackedEntityStatus" IS NULL
           OR "trackedEntityStatus" != 'Rejected'
      ) AS "quantityOnHand",
      SUM("quantity") FILTER (WHERE "trackedEntityStatus" = 'On Hold')
        AS "quantityOnHold",
      SUM("quantity") FILTER (WHERE "trackedEntityStatus" = 'Rejected')
        AS "quantityRejected",
      SUM(CASE
        WHEN "entryType" IN ('Negative Adjmt.', 'Sale', 'Consumption', 'Assembly Consumption')
        AND "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
        THEN -"quantity"
        ELSE 0
      END) / 30 AS "usageLast30Days",
      SUM(CASE
        WHEN "entryType" IN ('Negative Adjmt.', 'Sale', 'Consumption', 'Assembly Consumption')
        AND "createdAt" >= CURRENT_DATE - INTERVAL '90 days'
        THEN -"quantity"
        ELSE 0
      END) / 90 AS "usageLast90Days"
    FROM "itemLedger"
    WHERE "companyId" = company_id
      AND "locationId" = location_id
    GROUP BY "itemId"
  ),
  -- Per-variant on-hand for Style/Consumable parents (no iat_color/iat_size).
  style_breakdown AS (
    SELECT
      grp."itemId",
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'variantItemId', grp."variantItemId",
          'valuesKey', grp."valuesKey",
          'label', grp."label",
          'quantityOnHand', grp."qty"
        )
        ORDER BY grp."label" NULLS LAST, grp."valuesKey" NULLS LAST
      ) AS "breakdown"
    FROM (
      SELECT
        iv."parentItemId" AS "itemId",
        iv."variantItemId",
        iv."valuesKey",
        COALESCE(NULLIF(replace(iv."valuesKey", '|', ' · '), ''), vi."readableIdWithRevision", iv."valuesKey") AS "label",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 1), '') AS "colorCode",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 1), '') AS "colorName",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 2), '') AS "sizeCode",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 2), '') AS "sizeName",
        NULL::INTEGER AS "sizeSort",
        SUM(il."quantity") FILTER (
          WHERE il."trackedEntityStatus" IS NULL
             OR il."trackedEntityStatus" != 'Rejected'
        ) AS "qty"
      FROM "itemVariant" iv
      INNER JOIN "itemLedger" il
        ON il."itemId" = iv."variantItemId"
       AND il."companyId" = company_id
       AND il."locationId" = location_id
      LEFT JOIN "item" vi ON vi."id" = iv."variantItemId"
      WHERE iv."companyId" = company_id
      GROUP BY iv."parentItemId", iv."variantItemId", iv."valuesKey", vi."readableIdWithRevision"

    ) grp
    WHERE grp."qty" IS NOT NULL AND grp."qty" <> 0
    GROUP BY grp."itemId"
  ),
  -- Per-variant open job qty via bundle child job.itemId (not bwo color/size).
  job_breakdown AS (
    SELECT
      grp."itemId",
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'variantItemId', grp."variantItemId",
          'valuesKey', grp."valuesKey",
          'label', grp."label",
          'quantityOnHand', grp."qty"
        )
        ORDER BY grp."label" NULLS LAST, grp."valuesKey" NULLS LAST
      ) AS "breakdown"
    FROM (
      SELECT
        mj."itemId",
        bj."itemId" AS "variantItemId",
        iv."valuesKey",
        COALESCE(NULLIF(replace(iv."valuesKey", '|', ' · '), ''), vi."readableIdWithRevision", iv."valuesKey", bj."itemId") AS "label",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 1), '') AS "colorCode",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 1), '') AS "colorName",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 2), '') AS "sizeCode",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 2), '') AS "sizeName",
        NULL::INTEGER AS "sizeSort",
        SUM(bj."productionQuantity" + bj."scrapQuantity" - bj."quantityReceivedToInventory" - bj."quantityShipped") AS "qty"
      FROM "masterWorkOrder" mwo
      INNER JOIN "job" mj ON mj."id" = mwo."jobId"
      INNER JOIN "bundleWorkOrder" bwo ON bwo."masterWorkOrderId" = mwo."id"
      INNER JOIN "job" bj ON bj."id" = bwo."jobId"
      LEFT JOIN "itemVariant" iv
        ON iv."variantItemId" = bj."itemId"
       AND iv."companyId" = mj."companyId"
      LEFT JOIN "item" vi ON vi."id" = bj."itemId"
      WHERE mwo."companyId" = company_id
        AND bj."companyId" = company_id
        AND bj."locationId" = location_id
        AND bj."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
      GROUP BY mj."itemId", bj."itemId", iv."valuesKey", vi."readableIdWithRevision"

      UNION ALL

      SELECT
        j."itemId",
        jvq."variantItemId",
        iv."valuesKey",
        COALESCE(NULLIF(replace(iv."valuesKey", '|', ' · '), ''), vi."readableIdWithRevision", iv."valuesKey") AS "label",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 1), '') AS "colorCode",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 1), '') AS "colorName",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 2), '') AS "sizeCode",
        NULLIF(split_part(COALESCE(iv."valuesKey", ''), '|', 2), '') AS "sizeName",
        NULL::INTEGER AS "sizeSort",
        -- Split the job's remaining across SKUs by its jobVariantQuantity
        -- allocation; jobs with no allocation keep a single untagged row.
        SUM(
          CASE
            WHEN jvq."variantItemId" IS NULL THEN
              (j."productionQuantity" + j."scrapQuantity" - j."quantityReceivedToInventory" - j."quantityShipped")
            ELSE
              (j."productionQuantity" + j."scrapQuantity" - j."quantityReceivedToInventory" - j."quantityShipped")
              * jvq."quantity" / NULLIF(alloc."total", 0)
          END
        ) AS "qty"
      FROM "job" j
      LEFT JOIN LATERAL (
        SELECT SUM(x."quantity") AS "total"
        FROM "jobVariantQuantity" x
        WHERE x."jobId" = j."id" AND x."companyId" = company_id
      ) alloc ON TRUE
      -- Only attach the allocation when it has a positive total, so a job with
      -- no allocation (or an all-zero one) falls to a single untagged row via
      -- the NULL branch instead of losing its quantity to a divide-by-zero.
      LEFT JOIN "jobVariantQuantity" jvq
        ON jvq."jobId" = j."id" AND jvq."companyId" = company_id
       AND COALESCE(alloc."total", 0) > 0
      LEFT JOIN "itemVariant" iv
        ON iv."variantItemId" = jvq."variantItemId" AND iv."companyId" = company_id
      LEFT JOIN "item" vi ON vi."id" = jvq."variantItemId"
      WHERE j."companyId" = company_id
        AND j."locationId" = location_id
        AND j."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
        AND j."id" NOT IN (
          SELECT bwo."jobId" FROM "bundleWorkOrder" bwo WHERE bwo."companyId" = company_id
        )
        AND j."id" NOT IN (
          SELECT mwo."jobId"
          FROM "masterWorkOrder" mwo
          WHERE mwo."companyId" = company_id
            AND EXISTS (
              SELECT 1 FROM "bundleWorkOrder" bwo
              WHERE bwo."masterWorkOrderId" = mwo."id"
            )
        )
      GROUP BY j."itemId", jvq."variantItemId", iv."valuesKey", vi."readableIdWithRevision"
    ) grp
    WHERE grp."qty" IS NOT NULL AND grp."qty" <> 0
    GROUP BY grp."itemId"
  ),
  -- Distinct storage types the item is stocked in, joined via the storage
  -- units referenced by its ledger rows. NULL storageUnitId rows are
  -- excluded — they don't belong to any unit so they can't carry types.
  item_storage_types AS (
    SELECT
      il."itemId",
      ARRAY_AGG(DISTINCT t) AS "storageTypeIds"
    FROM "itemLedger" il
    INNER JOIN "storageUnit" su
      ON su."id" = il."storageUnitId"
     AND su."companyId" = company_id
    CROSS JOIN LATERAL unnest(su."storageTypeIds") AS t
    WHERE il."companyId" = company_id
      AND il."locationId" = location_id
    GROUP BY il."itemId"
  ),
  -- Distinct storage units the item is stocked in. NULL storageUnitId rows
  -- are excluded so the array only contains real units.
  item_storage_units AS (
    SELECT
      il."itemId",
      ARRAY_AGG(DISTINCT il."storageUnitId") AS "storageUnitIds"
    FROM "itemLedger" il
    WHERE il."companyId" = company_id
      AND il."locationId" = location_id
      AND il."storageUnitId" IS NOT NULL
    GROUP BY il."itemId"
  ),
  demand_forecast AS (
    SELECT "itemId", SUM(qty) AS "demandForecast"
    FROM (
      SELECT "itemId", "actualQuantity" AS qty
      FROM "demandActual"
      WHERE "companyId" = company_id AND "locationId" = location_id
      UNION ALL
      SELECT "itemId", "forecastQuantity" AS qty
      FROM "demandForecast"
      WHERE "companyId" = company_id AND "locationId" = location_id
    ) combined
    GROUP BY "itemId"
  ),
  -- Hide variant children from the inventory list; roll their qty onto parents.
  variant_child_ids AS (
    SELECT iv."variantItemId"
    FROM "itemVariant" iv
    WHERE iv."companyId" = company_id
  ),
  variant_qty_rollup AS (
    SELECT
      iv."parentItemId" AS "itemId",
      SUM(COALESCE(il."quantityOnHand", 0)) AS "quantityOnHand",
      SUM(COALESCE(il."quantityOnHold", 0)) AS "quantityOnHold",
      SUM(COALESCE(il."quantityRejected", 0)) AS "quantityRejected",
      SUM(COALESCE(so."quantityOnSalesOrder", 0)) AS "quantityOnSalesOrder",
      SUM(COALESCE(po."quantityOnPurchaseOrder", 0)) AS "quantityOnPurchaseOrder",
      SUM(COALESCE(jo."quantityOnProductionOrder", 0)) AS "quantityOnProductionOrder",
      SUM(COALESCE(jr."quantityOnProductionDemand", 0)) AS "quantityOnProductionDemand",
      SUM(COALESCE(df."demandForecast", 0)) AS "demandForecast",
      SUM(COALESCE(il."usageLast30Days", 0)) AS "usageLast30Days",
      SUM(COALESCE(il."usageLast90Days", 0)) AS "usageLast90Days"
    FROM "itemVariant" iv
    LEFT JOIN item_ledgers il ON il."itemId" = iv."variantItemId"
    LEFT JOIN open_sales_orders so ON so."itemId" = iv."variantItemId"
    LEFT JOIN open_purchase_orders po ON po."itemId" = iv."variantItemId"
    LEFT JOIN open_jobs jo ON jo."itemId" = iv."variantItemId"
    LEFT JOIN open_job_requirements jr ON jr."itemId" = iv."variantItemId"
    LEFT JOIN demand_forecast df ON df."itemId" = iv."variantItemId"
    WHERE iv."companyId" = company_id
    GROUP BY iv."parentItemId"
  )

SELECT
  i."id",
  i."readableId",
  i."readableIdWithRevision",
  i."name",
  i."active",
  i."type",
  i."itemTrackingType",
  i."replenishmentSystem",
  m."materialSubstanceId",
  m."materialFormId",
  m."dimensionId",
  md."name" AS "dimension",
  m."finishId",
  mf."name" AS "finish",
  m."gradeId",
  mg."name" AS "grade",
  mt."name" AS "materialType",
  m."materialTypeId",
  CASE
    WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
    ELSE i."thumbnailPath"
  END AS "thumbnailPath",
  i."unitOfMeasureCode",
  ir."leadTime",
  ir."lotSize",
  ip."reorderingPolicy",
  ip."demandAccumulationPeriod",
  ip."demandAccumulationSafetyStock",
  ip."reorderPoint",
  ip."reorderQuantity",
  ip."minimumOrderQuantity",
  ip."maximumOrderQuantity",
  ip."maximumInventoryQuantity",
  ip."orderMultiple",
  (COALESCE(il."quantityOnHand", 0) + COALESCE(vr."quantityOnHand", 0)) AS "quantityOnHand",
  (COALESCE(il."quantityOnHold", 0) + COALESCE(vr."quantityOnHold", 0)) AS "quantityOnHold",
  (COALESCE(il."quantityRejected", 0) + COALESCE(vr."quantityRejected", 0)) AS "quantityRejected",
  (COALESCE(so."quantityOnSalesOrder", 0) + COALESCE(vr."quantityOnSalesOrder", 0)) AS "quantityOnSalesOrder",
  (COALESCE(po."quantityOnPurchaseOrder", 0) + COALESCE(vr."quantityOnPurchaseOrder", 0)) AS "quantityOnPurchaseOrder",
  (COALESCE(jo."quantityOnProductionOrder", 0) + COALESCE(vr."quantityOnProductionOrder", 0)) AS "quantityOnProductionOrder",
  (COALESCE(jr."quantityOnProductionDemand", 0) + COALESCE(vr."quantityOnProductionDemand", 0)) AS "quantityOnProductionDemand",
  (COALESCE(df."demandForecast", 0) + COALESCE(vr."demandForecast", 0)) AS "demandForecast",
  (COALESCE(il."usageLast30Days", 0) + COALESCE(vr."usageLast30Days", 0)) AS "usageLast30Days",
  (COALESCE(il."usageLast90Days", 0) + COALESCE(vr."usageLast90Days", 0)) AS "usageLast90Days",
  CASE
    WHEN (COALESCE(il."usageLast30Days", 0) + COALESCE(vr."usageLast30Days", 0)) > 0
    THEN ROUND(
      (COALESCE(il."quantityOnHand", 0) + COALESCE(vr."quantityOnHand", 0))
      / (COALESCE(il."usageLast30Days", 0) + COALESCE(vr."usageLast30Days", 0)),
      2
    )
    ELSE NULL
  END AS "daysRemaining",
  COALESCE(ist."storageTypeIds", ARRAY[]::TEXT[]) AS "storageTypeIds",
  COALESCE(isu."storageUnitIds", ARRAY[]::TEXT[]) AS "storageUnitIds",
  COALESCE(sb."breakdown", '[]'::JSONB) AS "breakdown",
  COALESCE(jb."breakdown", '[]'::JSONB) AS "jobBreakdown"
FROM
  "item" i
  LEFT JOIN item_ledgers il ON i."id" = il."itemId"
  LEFT JOIN variant_qty_rollup vr ON i."id" = vr."itemId"
  LEFT JOIN style_breakdown sb ON i."id" = sb."itemId"
  LEFT JOIN job_breakdown jb ON i."id" = jb."itemId"
  LEFT JOIN item_storage_types ist ON i."id" = ist."itemId"
  LEFT JOIN item_storage_units isu ON i."id" = isu."itemId"
  LEFT JOIN open_sales_orders so ON i."id" = so."itemId"
  LEFT JOIN open_purchase_orders po ON i."id" = po."itemId"
  LEFT JOIN open_jobs jo ON i."id" = jo."itemId"
  LEFT JOIN open_job_requirements jr ON i."id" = jr."itemId"
  LEFT JOIN demand_forecast df ON i."id" = df."itemId"
  LEFT JOIN material m ON i."readableId" = m."id" AND m."companyId" = company_id
  LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
  LEFT JOIN "materialDimension" md ON m."dimensionId" = md."id"
  LEFT JOIN "materialFinish" mf ON m."finishId" = mf."id"
  LEFT JOIN "materialGrade" mg ON m."gradeId" = mg."id"
  LEFT JOIN "materialType" mt ON m."materialTypeId" = mt."id"
  LEFT JOIN "itemReplenishment" ir ON i."id" = ir."itemId" AND ir."companyId" = company_id
  LEFT JOIN "itemPlanning" ip ON i."id" = ip."itemId" AND ip."locationId" = location_id
WHERE
  i."itemTrackingType" <> 'Non-Inventory'
  AND i."companyId" = company_id
  AND NOT EXISTS (
    SELECT 1 FROM variant_child_ids vci WHERE vci."variantItemId" = i."id"
  );
  END;
$function$;

-- Dependent views (verified via pg_depend against the live DB): ONLY
-- purchaseOrderLines and salesOrderLines reference these columns, both selecting
-- colorCode/sizeCode directly. Drop them, drop the columns from all base-apparel
-- tables, then recreate the two views from their live definitions minus
-- color/size (security_invoker preserved). The other five tables have no
-- dependent views.
DROP VIEW IF EXISTS "salesOrderLines";
DROP VIEW IF EXISTS "purchaseOrderLines";

ALTER TABLE "itemLedger" DROP COLUMN IF EXISTS "colorCode", DROP COLUMN IF EXISTS "sizeCode";
ALTER TABLE "salesOrderLine" DROP COLUMN IF EXISTS "colorCode", DROP COLUMN IF EXISTS "sizeCode";
ALTER TABLE "purchaseOrderLine" DROP COLUMN IF EXISTS "colorCode", DROP COLUMN IF EXISTS "sizeCode";
ALTER TABLE "receiptLine" DROP COLUMN IF EXISTS "colorCode", DROP COLUMN IF EXISTS "sizeCode";
ALTER TABLE "shipmentLine" DROP COLUMN IF EXISTS "colorCode", DROP COLUMN IF EXISTS "sizeCode";
ALTER TABLE "productionQuantitySplitRow" DROP COLUMN IF EXISTS "colorCode", DROP COLUMN IF EXISTS "sizeCode";
ALTER TABLE "bundle"
  DROP COLUMN IF EXISTS "colorCode",
  DROP COLUMN IF EXISTS "colorName",
  DROP COLUMN IF EXISTS "sizeCode",
  DROP COLUMN IF EXISTS "sizeName";

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
    pl.configuration,
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
    sl.configuration,
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
