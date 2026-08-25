-- get_assigned_operations_for_report
--
-- Lists every uncompleted operation that is assigned to someone on a garment
-- bundle job, across ALL assignees (not just the current user). Drives the MES
-- "Report Production Quantity" table: one row per assigned, uncompleted process
-- so a bundle with several assigned processes shows several rows. Filterable by
-- assignee in the UI; each row opens the report-quantity modal.
--
-- Mirrors get_assigned_job_operations' "uncompleted" definition but:
--   * drops the `assignee = user_id` filter (all assignees),
--   * requires an assignee (this table is only assigned work),
--   * INNER JOINs the bundleWorkOrders view for garment/style context
--     (attributeLabel, style, master order) — which also scopes the result to
--     bundle-backed operations, the ones the garment report modal handles.

DROP FUNCTION IF EXISTS get_assigned_operations_for_report(text);
CREATE OR REPLACE FUNCTION get_assigned_operations_for_report(
  company_id TEXT
)
RETURNS TABLE (
  "id" TEXT,
  "jobId" TEXT,
  "operationOrder" DOUBLE PRECISION,
  "processId" TEXT,
  "description" TEXT,
  "operationStatus" "jobOperationStatus",
  "targetQuantity" NUMERIC,
  "operationQuantity" NUMERIC,
  "quantityComplete" NUMERIC,
  "quantityReworked" NUMERIC,
  "quantityScrapped" NUMERIC,
  "assignee" TEXT,
  "jobReadableId" TEXT,
  "itemReadableId" TEXT,
  "bundleWorkOrderId" TEXT,
  "masterWorkOrderId" TEXT,
  "readableIdWithRevision" TEXT,
  "itemName" TEXT,
  "attributeLabel" TEXT
)
SECURITY INVOKER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    jo."id",
    jo."jobId",
    jo."order" AS "operationOrder",
    jo."processId",
    jo."description",
    CASE
      WHEN j."status" = 'Paused' THEN 'Paused'
      ELSE jo."status"
    END AS "operationStatus",
    jo."targetQuantity"::NUMERIC,
    jo."operationQuantity",
    jo."quantityComplete",
    jo."quantityReworked",
    jo."quantityScrapped",
    jo."assignee",
    j."jobId" AS "jobReadableId",
    COALESCE(i."readableId", bwo."readableIdWithRevision") AS "itemReadableId",
    bwo."id" AS "bundleWorkOrderId",
    bwo."masterWorkOrderId",
    bwo."readableIdWithRevision",
    bwo."itemName",
    bwo."attributeLabel"
  FROM "jobOperation" jo
  JOIN "job" j ON j.id = jo."jobId"
  JOIN "bundleWorkOrders" bwo ON bwo."jobId" = jo."jobId"
  LEFT JOIN "jobMakeMethod" jmm ON jo."jobMakeMethodId" = jmm.id
  LEFT JOIN "item" i ON jmm."itemId" = i.id
  WHERE jo."assignee" IS NOT NULL
    AND (
      jo."status" IN ('Todo', 'Ready', 'Waiting', 'In Progress', 'Paused')
      OR COALESCE(jo."quantityReworked", 0) > 0
    )
    AND j."status" IN ('Ready', 'In Progress', 'Paused')
    AND j."companyId" = company_id
  ORDER BY j."jobId", jo."order";
END;
$$ LANGUAGE plpgsql;

NOTIFY pgrst, 'reload schema';
