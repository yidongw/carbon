-- Genericize styles.attributes + inventory breakdown without iat_color/iat_size.
-- Bundle job breakdown keys off child job.itemId (variant SKU).
-- Styles view exposes attributes JSON from itemAttributeSelection (set order).

-- Genericize styles view attributes + inventory breakdown (no iat_color/iat_size).
-- Must DROP: CREATE OR REPLACE cannot remove columns (colors/sizes → attributes).
DROP VIEW IF EXISTS "styleSamples";
DROP VIEW IF EXISTS "styles";

CREATE VIEW "styles" WITH (SECURITY_INVOKER=true) AS
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
  (
    SELECT string_agg(iav."code", ' ' ORDER BY COALESCE(isa."sortOrder", 100), iav."sortOrder", iav."code")
    FROM "itemAttributeSelection" ias
    JOIN "itemAttributeValue" iav ON iav."id" = ias."attributeValueId"
    LEFT JOIN "itemAttributeSetAttribute" isa
      ON isa."attributeId" = ias."attributeId"
     AND isa."attributeSetId" = li."attributeSetId"
    WHERE ias."itemId" = li."id"
      AND ias."companyId" = li."companyId"
  ) AS "attributeCodes",
  ir."revisions",
  s."customFields",
  s."tags",
  ic."itemPostingGroupId",
  li."createdBy",
  li."createdAt",
  li."updatedBy",
  li."updatedAt"
FROM "style" s
INNER JOIN latest_items li ON li."readableId" = s."id" AND li."companyId" = s."companyId"
LEFT JOIN item_revisions ir ON ir."readableId" = li."readableId" AND ir."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;


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
  -- Per-variant on-hand for Style/Consumable parents (no iat_color/iat_size).
  style_breakdown AS (
    SELECT
      grp."itemId",
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'variantItemId', grp."variantItemId",
          'valuesKey', grp."valuesKey",
          'label', grp."label",
          'colorCode', grp."colorCode",
          'colorName', grp."colorName",
          'sizeCode', grp."sizeCode",
          'sizeName', grp."sizeName",
          'sizeSort', grp."sizeSort",
          'quantityOnHand', grp."qty"
        )
        ORDER BY grp."label" NULLS LAST, grp."valuesKey" NULLS LAST
      ) AS "breakdown"
    FROM (
      SELECT
        iv."parentItemId" AS "itemId",
        iv."variantItemId",
        iv."valuesKey",
        COALESCE(vi."readableIdWithRevision", iv."valuesKey") AS "label",
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
          'colorCode', grp."colorCode",
          'colorName', grp."colorName",
          'sizeCode', grp."sizeCode",
          'sizeName', grp."sizeName",
          'sizeSort', grp."sizeSort",
          'quantityOnHand', grp."qty"
        )
        ORDER BY grp."label" NULLS LAST, grp."valuesKey" NULLS LAST
      ) AS "breakdown"
    FROM (
      SELECT
        mj."itemId",
        bj."itemId" AS "variantItemId",
        iv."valuesKey",
        COALESCE(vi."readableIdWithRevision", iv."valuesKey", bj."itemId") AS "label",
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

-- Bundle WO identity is the child job.itemId (variant SKU). Keep colorCode/
-- sizeCode columns nullable for old rows but stop resolving names via iat_color.
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
  COALESCE(i."name", i."readableIdWithRevision") AS "colorName"
FROM "bundleWorkOrder" bwo
JOIN "job" j ON j."id" = bwo."jobId"
LEFT JOIN "item" i
  ON i."id" = j."itemId" AND i."companyId" = j."companyId";

-- Samples list: group by full attributes JSON (not Color/Size keys).
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
        t."readableId"
      ) AS "label",
      count(*)::int AS "qty"
    FROM "trackedEntity" t
    WHERE t."sourceDocument" = 'Item'
      AND t."sourceDocumentId" = ss."itemId"
      AND t."companyId" = s."companyId"
    GROUP BY t."attributes", t."readableId"
  ) g
) te ON true;

NOTIFY pgrst, 'reload schema';
