-- Generic attribute display for samples, bundle WO, inventory breakdown.
-- Drop bundleWorkOrder.colorCode/sizeCode; expose attributeValues from variant.


-- Samples list: group by attributes only (sum qty across serials).
DROP VIEW IF EXISTS "styleSamples";
CREATE VIEW "styleSamples" WITH (SECURITY_INVOKER=true) AS
SELECT
  s.*,
  ss."itemId" AS "sampleItemId",
  COALESCE(te."sampleCount", 0) AS "sampleCount",
  COALESCE(te."sampledVariantCount", 0) AS "sampledColorCount",
  COALESCE(te."samples", '[]'::json) AS "samples"
FROM "styles" s
LEFT JOIN "styleSample" ss
  ON ss."styleId" = s."readableId" AND ss."companyId" = s."companyId"
LEFT JOIN LATERAL (
  SELECT
    sum(g."qty") AS "sampleCount",
    count(*) AS "sampledVariantCount",
    json_agg(
      json_build_object(
        'label', g."label",
        'attributes', g."attributes",
        'quantity', g."qty"
      ) ORDER BY g."label"
    ) AS "samples"
  FROM (
    SELECT
      t."attributes",
      COALESCE(
        (
          SELECT string_agg(kv.value, ' · ' ORDER BY kv.key)
          FROM jsonb_each_text(COALESCE(t."attributes", '{}'::jsonb)) AS kv(key, value)
        ),
        ''
      ) AS "label",
      count(*)::int AS "qty"
    FROM "trackedEntity" t
    WHERE t."sourceDocument" = 'Item'
      AND t."sourceDocumentId" = ss."itemId"
      AND t."companyId" = s."companyId"
      AND t."attributes" IS NOT NULL
      AND t."attributes" <> '{}'::jsonb
    GROUP BY t."attributes"
  ) g
) te ON true;


-- Bundle WO: identity = job.itemId (variant). Expose attributeValues JSON; drop color/size cols.
DROP VIEW IF EXISTS "bundleWorkOrders";

-- Relocate legacy bundle child jobs onto their variant SKU BEFORE dropping the
-- color/size columns. Pre-variant bundles have their backing job.itemId still on
-- the parent Style, with color/size only in bundleWorkOrder.colorCode/sizeCode;
-- once those are gone, a bundle's identity is read from job.itemId = variant SKU
-- (see the bundleWorkOrders view below). Map each legacy bundle's
-- (parent, colorCode, sizeCode) to the matching variant and move its job there.
-- Guarded on column presence so it runs where the legacy columns still exist and
-- is a clean no-op elsewhere (plpgsql defers planning until the branch executes).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='bundleWorkOrder' AND column_name='colorCode'
  ) THEN
    UPDATE "job" j
    SET "itemId" = m."variantItemId"
    FROM "bundleWorkOrder" bwo, (
      SELECT iv."variantItemId", iv."parentItemId", iv."companyId",
             cav."code" AS "colorCode", sav."code" AS "sizeCode"
      FROM "itemVariant" iv
      LEFT JOIN "itemVariantAttribute" cva
        ON cva."itemVariantId"=iv."id" AND cva."companyId"=iv."companyId" AND cva."attributeId"='iat_color'
      LEFT JOIN "itemAttributeValue" cav ON cav."id"=cva."attributeValueId"
      LEFT JOIN "itemVariantAttribute" sva
        ON sva."itemVariantId"=iv."id" AND sva."companyId"=iv."companyId" AND sva."attributeId"='iat_size'
      LEFT JOIN "itemAttributeValue" sav ON sav."id"=sva."attributeValueId"
    ) m
    WHERE bwo."jobId" = j."id"
      AND j."itemId" = m."parentItemId"
      AND j."companyId" = m."companyId"
      AND COALESCE(bwo."colorCode",'') = COALESCE(m."colorCode",'')
      AND COALESCE(bwo."sizeCode",'') = COALESCE(m."sizeCode",'')
      AND (bwo."colorCode" IS NOT NULL OR bwo."sizeCode" IS NOT NULL);
  END IF;
END $$;

ALTER TABLE "bundleWorkOrder" DROP COLUMN IF EXISTS "colorCode";
ALTER TABLE "bundleWorkOrder" DROP COLUMN IF EXISTS "sizeCode";

CREATE VIEW "bundleWorkOrders" WITH (SECURITY_INVOKER=true) AS
SELECT
  bwo."id",
  bwo."masterWorkOrderId",
  bwo."jobId",
  bwo."companyId",
  bwo."sequence",
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
  iv."valuesKey",
  COALESCE(
    NULLIF(replace(iv."valuesKey", '|', ' · '), ''),
    i."name",
    i."readableIdWithRevision"
  ) AS "attributeLabel",
  COALESCE((
    SELECT jsonb_object_agg(ia."code", COALESCE(iav."name", iav."code"))
    FROM "itemVariantAttribute" iva
    JOIN "itemAttribute" ia ON ia."id" = iva."attributeId"
    JOIN "itemAttributeValue" iav ON iav."id" = iva."attributeValueId"
    WHERE iva."itemVariantId" = iv."id"
      AND iva."companyId" = bwo."companyId"
  ), '{}'::jsonb) AS "attributeValues"
FROM "bundleWorkOrder" bwo
JOIN "job" j ON j."id" = bwo."jobId"
LEFT JOIN "item" i
  ON i."id" = j."itemId" AND i."companyId" = j."companyId"
LEFT JOIN "itemVariant" iv
  ON iv."variantItemId" = j."itemId" AND iv."companyId" = j."companyId";

DROP FUNCTION IF EXISTS get_inventory_quantities(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.get_inventory_quantities(company_id text, location_id text)
 RETURNS TABLE(id text, "readableId" text, "readableIdWithRevision" text, name text, active boolean, type "itemType", "itemTrackingType" "itemTrackingType", "replenishmentSystem" "itemReplenishmentSystem", "materialSubstanceId" text, "materialFormId" text, "dimensionId" text, dimension text, "finishId" text, finish text, "gradeId" text, grade text, "materialType" text, "materialTypeId" text, "thumbnailPath" text, "unitOfMeasureCode" text, "leadTime" integer, "lotSize" integer, "reorderingPolicy" "itemReorderingPolicy", "demandAccumulationPeriod" integer, "demandAccumulationSafetyStock" numeric, "reorderPoint" integer, "reorderQuantity" integer, "minimumOrderQuantity" integer, "maximumOrderQuantity" integer, "maximumInventoryQuantity" numeric, "orderMultiple" integer, "quantityOnHand" numeric, "quantityOnHold" numeric, "quantityRejected" numeric, "quantityOnSalesOrder" numeric, "quantityOnPurchaseOrder" numeric, "quantityOnProductionOrder" numeric, "quantityOnProductionDemand" numeric, "demandForecast" numeric, "usageLast30Days" numeric, "usageLast90Days" numeric, "daysRemaining" numeric, "storageTypeIds" text[], "storageUnitIds" text[], breakdown jsonb, "jobBreakdown" jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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
  -- Open jobs, counted once per garment. Bundle-backing jobs are excluded because
  -- their quantity is already represented by their master job (they are a
  -- progressively-cut subset of it), so summing both would double-count.
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
      SELECT bwo."jobId" FROM "bundleWorkOrder" bwo WHERE bwo."companyId" = company_id
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

      UNION ALL

      SELECT
        il."itemId",
        NULL::TEXT AS "variantItemId",
        NULLIF(CONCAT_WS('|', il."colorCode", il."sizeCode"), '') AS "valuesKey",
        NULLIF(CONCAT_WS(' · ', il."colorCode", il."sizeCode"), '') AS "label",
        il."colorCode",
        il."colorCode" AS "colorName",
        il."sizeCode",
        il."sizeCode" AS "sizeName",
        NULL::INTEGER AS "sizeSort",
        SUM(il."quantity") FILTER (
          WHERE il."trackedEntityStatus" IS NULL
             OR il."trackedEntityStatus" != 'Rejected'
        ) AS "qty"
      FROM "itemLedger" il
      WHERE il."companyId" = company_id
        AND il."locationId" = location_id
        AND (il."colorCode" IS NOT NULL OR il."sizeCode" IS NOT NULL)
      GROUP BY il."itemId", il."colorCode", il."sizeCode"
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
        AND mj."companyId" = company_id
        AND mj."locationId" = location_id
        AND mj."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
        AND bj."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
      GROUP BY mj."itemId", bj."itemId", iv."valuesKey", vi."readableIdWithRevision"

      UNION ALL

      SELECT
        j."itemId",
        NULL::TEXT AS "variantItemId",
        NULL::TEXT AS "valuesKey",
        NULL::TEXT AS "label",
        NULL::TEXT AS "colorCode",
        NULL::TEXT AS "colorName",
        NULL::TEXT AS "sizeCode",
        NULL::TEXT AS "sizeName",
        NULL::INTEGER AS "sizeSort",
        SUM(
          (j."productionQuantity" + j."scrapQuantity" - j."quantityReceivedToInventory" - j."quantityShipped")
          - COALESCE(bsum."bundleQty", 0)
        ) AS "qty"
      FROM "job" j
      LEFT JOIN "masterWorkOrder" mwo ON mwo."jobId" = j."id"
      LEFT JOIN LATERAL (
        SELECT SUM(bj."productionQuantity" + bj."scrapQuantity" - bj."quantityReceivedToInventory" - bj."quantityShipped") AS "bundleQty"
        FROM "bundleWorkOrder" b2
        INNER JOIN "job" bj ON bj."id" = b2."jobId"
        WHERE b2."masterWorkOrderId" = mwo."id"
          AND bj."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
      ) bsum ON mwo."id" IS NOT NULL
      WHERE j."companyId" = company_id
        AND j."locationId" = location_id
        AND j."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
        AND j."id" NOT IN (
          SELECT bwo."jobId" FROM "bundleWorkOrder" bwo WHERE bwo."companyId" = company_id
        )
      GROUP BY j."itemId"
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


NOTIFY pgrst, 'reload schema';
