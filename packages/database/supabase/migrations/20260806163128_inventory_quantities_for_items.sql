-- Per-item inventory quantities for explicit item ids (including variant SKUs).
-- get_inventory_quantities excludes variant children and rolls onto parents for
-- list UIs; this helper is for SKU breakdown tables that need child rows.

CREATE OR REPLACE FUNCTION get_inventory_quantities_for_items(
  company_id TEXT,
  location_id TEXT,
  item_ids TEXT[]
)
  RETURNS TABLE (
    "id" TEXT,
    "quantityOnHand" NUMERIC,
    "quantityOnHold" NUMERIC,
    "quantityRejected" NUMERIC,
    "quantityOnSalesOrder" NUMERIC,
    "quantityOnPurchaseOrder" NUMERIC,
    "quantityOnProductionOrder" NUMERIC,
    "quantityOnProductionDemand" NUMERIC
  ) AS $$
BEGIN
  RETURN QUERY
  WITH
    open_purchase_orders AS (
      SELECT
        pol."itemId",
        SUM(pol."quantityToReceive" * pol."conversionFactor") AS "quantityOnPurchaseOrder"
      FROM "purchaseOrder" po
      INNER JOIN "purchaseOrderLine" pol ON pol."purchaseOrderId" = po."id"
      WHERE po."status" IN ('Planned', 'To Receive', 'To Receive and Invoice')
        AND po."companyId" = company_id
        AND pol."locationId" = location_id
        AND pol."itemId" = ANY(item_ids)
      GROUP BY pol."itemId"
    ),
    open_sales_orders AS (
      SELECT
        sol."itemId",
        SUM(sol."quantityToSend") AS "quantityOnSalesOrder"
      FROM "salesOrder" so
      INNER JOIN "salesOrderLine" sol ON sol."salesOrderId" = so."id"
      WHERE so."status" IN (
          'Confirmed', 'To Ship and Invoice', 'To Ship', 'To Invoice', 'In Progress'
        )
        AND so."companyId" = company_id
        AND sol."locationId" = location_id
        AND sol."itemId" = ANY(item_ids)
      GROUP BY sol."itemId"
    ),
    open_job_requirements AS (
      SELECT
        jm."itemId",
        SUM(jm."quantityToIssue") AS "quantityOnProductionDemand"
      FROM "jobMaterial" jm
      INNER JOIN "job" j ON jm."jobId" = j."id"
      WHERE j."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
        AND jm."methodType" != 'Make to Order'
        AND j."companyId" = company_id
        AND j."locationId" = location_id
        AND jm."itemId" = ANY(item_ids)
      GROUP BY jm."itemId"
    ),
    open_jobs AS (
      SELECT
        j."itemId",
        SUM(
          j."productionQuantity" + j."scrapQuantity"
          - j."quantityReceivedToInventory" - j."quantityShipped"
        ) AS "quantityOnProductionOrder"
      FROM job j
      WHERE j."status" IN ('Planned', 'Ready', 'In Progress', 'Paused')
        AND j."companyId" = company_id
        AND j."locationId" = location_id
        AND j."itemId" = ANY(item_ids)
        AND j."id" NOT IN (
          SELECT bwo."jobId" FROM "bundleWorkOrder" bwo WHERE bwo."companyId" = company_id
        )
      GROUP BY j."itemId"
    ),
    item_ledgers AS (
      SELECT
        "itemId",
        SUM("quantity") FILTER (
          WHERE "trackedEntityStatus" IS NULL OR "trackedEntityStatus" != 'Rejected'
        ) AS "quantityOnHand",
        SUM("quantity") FILTER (WHERE "trackedEntityStatus" = 'On Hold') AS "quantityOnHold",
        SUM("quantity") FILTER (WHERE "trackedEntityStatus" = 'Rejected') AS "quantityRejected"
      FROM "itemLedger"
      WHERE "companyId" = company_id
        AND "locationId" = location_id
        AND "itemId" = ANY(item_ids)
      GROUP BY "itemId"
    )
  SELECT
    i."id",
    COALESCE(il."quantityOnHand", 0),
    COALESCE(il."quantityOnHold", 0),
    COALESCE(il."quantityRejected", 0),
    COALESCE(so."quantityOnSalesOrder", 0),
    COALESCE(po."quantityOnPurchaseOrder", 0),
    COALESCE(jo."quantityOnProductionOrder", 0),
    COALESCE(jr."quantityOnProductionDemand", 0)
  FROM unnest(item_ids) AS i("id")
  LEFT JOIN item_ledgers il ON il."itemId" = i."id"
  LEFT JOIN open_sales_orders so ON so."itemId" = i."id"
  LEFT JOIN open_purchase_orders po ON po."itemId" = i."id"
  LEFT JOIN open_jobs jo ON jo."itemId" = i."id"
  LEFT JOIN open_job_requirements jr ON jr."itemId" = i."id";
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
