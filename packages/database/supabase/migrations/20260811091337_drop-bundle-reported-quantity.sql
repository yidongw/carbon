-- Drop bundleWorkOrder.reportedQuantity / lastReportedAt.
--
-- These were a denormalized whole-bundle running total written by
-- recordBundleProductionReport (sum of every "Production" report line across all
-- of the bundle job's operations). For a multi-operation bundle that over-counts
-- and is meaningless per process, so the ERP process breakdown already ignored it
-- and computed reported quantity from jobOperation.quantityComplete instead. We
-- now do that everywhere and remove the stored columns. Bundle progress is:
--   * whole-bundle "reported" = job.quantityComplete (units past the final op),
--     already exposed by this view;
--   * per-process = that jobOperation's quantityComplete.
-- Job completion is owned by the operation-sync trigger chain, not by the removed
-- writer.

DROP VIEW IF EXISTS "bundleWorkOrders";

ALTER TABLE "bundleWorkOrder" DROP COLUMN IF EXISTS "reportedQuantity";
ALTER TABLE "bundleWorkOrder" DROP COLUMN IF EXISTS "lastReportedAt";

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

NOTIFY pgrst, 'reload schema';
