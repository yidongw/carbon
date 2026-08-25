-- Add the parent STYLE (not the variant SKU) to the bundleWorkOrders view.
--
-- The view already exposed `readableIdWithRevision` (the variant SKU, e.g.
-- "111333-BG-S") which several MES screens mislabeled as "Style". A style is the
-- parent item (e.g. "111333"); the color/size belong in Attributes. Add
-- `styleId` / `styleReadableId` derived from the variant's parent item
-- (itemVariant.parentItemId), falling back to the item's own readable id for
-- non-variant items (e.g. "NE"). Also surface it from
-- get_assigned_operations_for_report so the report table can filter by style.

DROP VIEW IF EXISTS "bundleWorkOrders";
CREATE VIEW "bundleWorkOrders" WITH (security_invoker=true) AS
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
  style."id" AS "styleId",
  COALESCE(style."readableId", i."readableIdWithRevision") AS "styleReadableId",
  j."assignee",
  j."quantityComplete",
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
    NULLIF((
      SELECT string_agg(
        COALESCE(iav."name", iav."code"),
        ' · '
        ORDER BY ia."sortOrder", ia."code"
      )
      FROM "itemVariantAttribute" iva
      JOIN "itemAttribute" ia ON ia."id" = iva."attributeId"
      JOIN "itemAttributeValue" iav ON iav."id" = iva."attributeValueId"
      WHERE iva."itemVariantId" = iv."id"
        AND iva."companyId" = bwo."companyId"
    ), ''),
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
  ON iv."variantItemId" = j."itemId" AND iv."companyId" = j."companyId"
LEFT JOIN "item" style
  ON style."id" = iv."parentItemId" AND style."companyId" = j."companyId";

-- Surface styleReadableId from the assigned-operations report RPC (it already
-- joins the bundleWorkOrders view), so the report table filters by style too.
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
  "styleReadableId" TEXT,
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
    bwo."styleReadableId",
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
