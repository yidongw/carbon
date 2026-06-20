-- Add routing progress aggregates to the jobs list view: operation completion counts
-- and minimum completed quantity across root-level operations (units fully through the line for linear routings).

CREATE OR REPLACE VIEW "jobs" WITH(SECURITY_INVOKER=true) AS
WITH job_model AS (
  SELECT
    j.id AS job_id,
    j."companyId",
    COALESCE(j."modelUploadId", i."modelUploadId") AS model_upload_id
  FROM "job" j
  INNER JOIN "item" i ON j."itemId" = i."id" AND j."companyId" = i."companyId"
),
root_operation_stats AS (
  SELECT
    jo."jobId",
    COUNT(*)::INTEGER AS "operationCount",
    COUNT(*) FILTER (WHERE jo."status" = 'Done')::INTEGER AS "completedOperationCount"
  FROM "jobOperation" jo
  INNER JOIN "jobMakeMethod" jmm ON jo."jobMakeMethodId" = jmm.id
  WHERE jmm."parentMaterialId" IS NULL
  GROUP BY jo."jobId"
),
root_routing_min_complete AS (
  SELECT
    jo."jobId",
    MIN(jo."quantityComplete") AS "quantityFullyComplete"
  FROM "jobOperation" jo
  INNER JOIN "jobMakeMethod" jmm ON jo."jobMakeMethodId" = jmm.id
  WHERE jmm."parentMaterialId" IS NULL
  GROUP BY jo."jobId"
)
SELECT
  j.*,
  jmm."id" AS "jobMakeMethodId",
  i.name,
  i."readableIdWithRevision" AS "itemReadableIdWithRevision",
  i.type AS "itemType",
  i.name AS "description",
  i."itemTrackingType",
  i.active,
  i."replenishmentSystem",
  mu.id AS "modelId",
  mu."autodeskUrn",
  mu."modelPath",
  CASE
    WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
    ELSE i."thumbnailPath"
  END AS "thumbnailPath",
  mu."name" AS "modelName",
  mu."size" AS "modelSize",
  so."salesOrderId" AS "salesOrderReadableId",
  qo."quoteId" AS "quoteReadableId",
  COALESCE(os."operationCount", 0) AS "operationCount",
  COALESCE(os."completedOperationCount", 0) AS "completedOperationCount",
  COALESCE(rrc."quantityFullyComplete", 0) AS "quantityFullyComplete"
FROM "job" j
LEFT JOIN "jobMakeMethod" jmm ON jmm."jobId" = j.id AND jmm."parentMaterialId" IS NULL
INNER JOIN "item" i ON j."itemId" = i."id" AND j."companyId" = i."companyId"
LEFT JOIN job_model jm ON j.id = jm.job_id AND j."companyId" = jm."companyId"
LEFT JOIN "modelUpload" mu ON mu.id = jm.model_upload_id
LEFT JOIN "salesOrder" so ON j."salesOrderId" = so.id AND j."companyId" = so."companyId"
LEFT JOIN "quote" qo ON j."quoteId" = qo.id AND j."companyId" = qo."companyId"
LEFT JOIN root_operation_stats os ON os."jobId" = j.id
LEFT JOIN root_routing_min_complete rrc ON rrc."jobId" = j.id;
