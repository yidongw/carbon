-- Fix get_inventory_quantities variant rollup hiding pre-existing parent stock.
--
-- The prior version used COALESCE(vr.x, il.x, 0): because variant_qty_rollup
-- produces a (0-filled) row for every parent that has variants, the COALESCE
-- REPLACED the parent's own ledger with the child rollup. Styles that were
-- migrated to variants but still carry their legacy stock on the parent item id
-- (with colorCode/sizeCode) suddenly showed On Hand = 0 in the inventory list
-- while their size/color breakdown still showed the real quantity.
--
-- Correct model: headline quantity = parent's own ledger + rollup of variant
-- children (ADD, not replace). Legacy stock stays booked on the parent; new
-- movements post to variant child SKUs; both belong to the parent's total.
--
-- The style breakdown now also includes variant-child ledgers, keyed by each
-- child's frozen color/size attribute values and attributed to the parent, so
-- the headline On Hand reconciles with the sum of the breakdown going forward.

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
  -- Per-size/color on-hand for Style items. Combines two sources attributed to
  -- the parent item id:
  --   1) legacy rows booked directly on the parent (colorCode/sizeCode non-null)
  --   2) variant child SKU ledgers, keyed by the child's frozen color/size
  --      attribute values
  -- so SUM(breakdown) reconciles with the headline quantityOnHand.
  style_breakdown AS (
    SELECT
      grp."itemId",
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'colorCode', grp."colorCode",
          'colorName', grp."colorName",
          'sizeCode', grp."sizeCode",
          'sizeName', grp."sizeName",
          'sizeSort', grp."sizeSort",
          'quantityOnHand', grp."qty"
        )
        ORDER BY grp."sizeSort" NULLS LAST, grp."sizeCode" NULLS LAST, grp."colorCode" NULLS LAST
      ) AS "breakdown"
    FROM (
      SELECT
        u."itemId",
        u."colorCode",
        MAX(u."colorName") AS "colorName",
        u."sizeCode",
        MAX(u."sizeName") AS "sizeName",
        MAX(u."sizeSort") AS "sizeSort",
        SUM(u."qty") AS "qty"
      FROM (
        -- (1) legacy parent-booked color/size rows
        SELECT
          il."itemId",
          il."colorCode",
          COALESCE(sc."colorName", il."colorCode") AS "colorName",
          il."sizeCode",
          COALESCE(ss."sizeName", il."sizeCode") AS "sizeName",
          ss."sortOrder" AS "sizeSort",
          SUM(il."quantity") FILTER (
            WHERE il."trackedEntityStatus" IS NULL
               OR il."trackedEntityStatus" != 'Rejected'
          ) AS "qty"
        FROM "itemLedger" il
        LEFT JOIN LATERAL (
          SELECT iav."name" AS "colorName"
          FROM "itemAttributeValue" iav
          WHERE iav."attributeId" = 'iat_color'
            AND iav."code" = il."colorCode"
            AND (iav."companyId" = il."companyId" OR iav."companyId" IS NULL)
          ORDER BY iav."companyId" NULLS LAST
          LIMIT 1
        ) sc ON il."colorCode" IS NOT NULL
        LEFT JOIN LATERAL (
          SELECT iav."name" AS "sizeName", iav."sortOrder"
          FROM "itemAttributeValue" iav
          WHERE iav."attributeId" = 'iat_size'
            AND iav."code" = il."sizeCode"
            AND (iav."companyId" = il."companyId" OR iav."companyId" IS NULL)
          ORDER BY iav."companyId" NULLS LAST
          LIMIT 1
        ) ss ON il."sizeCode" IS NOT NULL
        WHERE il."companyId" = company_id
          AND il."locationId" = location_id
          AND (il."colorCode" IS NOT NULL OR il."sizeCode" IS NOT NULL)
        GROUP BY il."itemId", il."colorCode", sc."colorName", il."sizeCode", ss."sizeName", ss."sortOrder"

        UNION ALL

        -- (2) variant child SKU ledgers, keyed by frozen color/size attributes,
        --     attributed to the parent item
        SELECT
          iv."parentItemId" AS "itemId",
          cav."code" AS "colorCode",
          cav."name" AS "colorName",
          sav."code" AS "sizeCode",
          sav."name" AS "sizeName",
          sav."sortOrder" AS "sizeSort",
          SUM(il."quantity") FILTER (
            WHERE il."trackedEntityStatus" IS NULL
               OR il."trackedEntityStatus" != 'Rejected'
          ) AS "qty"
        FROM "itemVariant" iv
        INNER JOIN "itemLedger" il
          ON il."itemId" = iv."variantItemId"
         AND il."companyId" = company_id
         AND il."locationId" = location_id
        LEFT JOIN "itemVariantAttribute" cva
          ON cva."itemVariantId" = iv."id"
         AND cva."companyId" = iv."companyId"
         AND cva."attributeId" = 'iat_color'
        LEFT JOIN "itemAttributeValue" cav ON cav."id" = cva."attributeValueId"
        LEFT JOIN "itemVariantAttribute" sva
          ON sva."itemVariantId" = iv."id"
         AND sva."companyId" = iv."companyId"
         AND sva."attributeId" = 'iat_size'
        LEFT JOIN "itemAttributeValue" sav ON sav."id" = sva."attributeValueId"
        WHERE iv."companyId" = company_id
        GROUP BY iv."parentItemId", cav."code", cav."name", sav."code", sav."name", sav."sortOrder"
      ) u
      GROUP BY u."itemId", u."colorCode", u."sizeCode"
    ) grp
    WHERE grp."qty" IS NOT NULL AND grp."qty" <> 0
    GROUP BY grp."itemId"
  ),
  -- Per-color/size split of the "Quantity on Jobs" total for garment Style items.
  -- Driven from the same counted (non-bundle) open jobs as open_jobs:
  --   * tagged rows  = each open master job's open bundles, by color/size
  --   * untagged row = master net minus its open bundles' net (not-yet-cut part),
  --                    plus any plain (non-garment) style job's full net
  -- so SUM(jobBreakdown) == open_jobs.quantityOnProductionOrder per item.
  job_breakdown AS (
    SELECT
      grp."itemId",
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'colorCode', grp."colorCode",
          'colorName', grp."colorName",
          'sizeCode', grp."sizeCode",
          'sizeName', grp."sizeName",
          'sizeSort', grp."sizeSort",
          'quantityOnHand', grp."qty"
        )
        ORDER BY grp."sizeSort" NULLS LAST, grp."sizeCode" NULLS LAST, grp."colorCode" NULLS LAST
      ) AS "breakdown"
    FROM (
      -- tagged: open bundle jobs of open master jobs, grouped by color/size
      SELECT
        mj."itemId",
        bwo."colorCode",
        COALESCE(sc."colorName", bwo."colorCode") AS "colorName",
        bwo."sizeCode",
        COALESCE(ss."sizeName", bwo."sizeCode") AS "sizeName",
        ss."sortOrder" AS "sizeSort",
        SUM(bj."productionQuantity" + bj."scrapQuantity" - bj."quantityReceivedToInventory" - bj."quantityShipped") AS "qty"
      FROM "masterWorkOrder" mwo
      INNER JOIN "job" mj ON mj."id" = mwo."jobId"
      INNER JOIN "bundleWorkOrder" bwo ON bwo."masterWorkOrderId" = mwo."id"
      INNER JOIN "job" bj ON bj."id" = bwo."jobId"
      LEFT JOIN LATERAL (
        SELECT iav."name" AS "colorName"
        FROM "itemAttributeValue" iav
        WHERE iav."attributeId" = 'iat_color'
          AND iav."code" = bwo."colorCode"
          AND (iav."companyId" = mj."companyId" OR iav."companyId" IS NULL)
        ORDER BY iav."companyId" NULLS LAST
        LIMIT 1
      ) sc ON bwo."colorCode" IS NOT NULL
      LEFT JOIN LATERAL (
        SELECT iav."name" AS "sizeName", iav."sortOrder"
        FROM "itemAttributeValue" iav
        WHERE iav."attributeId" = 'iat_size'
          AND iav."code" = bwo."sizeCode"
          AND (iav."companyId" = mj."companyId" OR iav."companyId" IS NULL)
        ORDER BY iav."companyId" NULLS LAST
        LIMIT 1
      ) ss ON bwo."sizeCode" IS NOT NULL
      WHERE mwo."companyId" = company_id
        AND mj."companyId" = company_id
        AND mj."locationId" = location_id
        AND mj."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
        AND bj."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
      GROUP BY mj."itemId", bwo."colorCode", sc."colorName", bwo."sizeCode", ss."sizeName", ss."sortOrder"

      UNION ALL

      -- untagged remainder: each counted (non-bundle) open job's net minus the net
      -- of its own open bundles. Plain style jobs (no master/bundles) contribute
      -- their full net here.
      SELECT
        j."itemId",
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
