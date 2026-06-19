-- Keep historical jobs loadable when their item is soft-deleted (or otherwise
-- not visible through RLS). Use LEFT JOIN so the job row survives.

DROP VIEW IF EXISTS "jobs";
CREATE VIEW "jobs" WITH (SECURITY_INVOKER = true) AS
WITH job_model AS (
  SELECT
    j.id AS job_id,
    j."companyId",
    COALESCE(j."modelUploadId", i."modelUploadId") AS model_upload_id
  FROM "job" j
  LEFT JOIN "item" i ON j."itemId" = i."id" AND j."companyId" = i."companyId"
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
  i."deletedAt" AS "itemDeletedAt",
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
LEFT JOIN "item" i ON j."itemId" = i."id" AND j."companyId" = i."companyId"
LEFT JOIN job_model jm ON j.id = jm.job_id AND j."companyId" = jm."companyId"
LEFT JOIN "modelUpload" mu ON mu.id = jm.model_upload_id
LEFT JOIN "salesOrder" so ON j."salesOrderId" = so.id AND j."companyId" = so."companyId"
LEFT JOIN "quote" qo ON j."quoteId" = qo.id AND j."companyId" = qo."companyId"
LEFT JOIN root_operation_stats os ON os."jobId" = j.id
LEFT JOIN root_routing_min_complete rrc ON rrc."jobId" = j.id
WHERE j."deletedAt" IS NULL;

-- Historical BOM trees should still load when line items are soft-deleted.
CREATE OR REPLACE FUNCTION get_job_method(jid TEXT)
RETURNS TABLE (
    "jobId" TEXT,
    "methodMaterialId" TEXT,
    "jobMakeMethodId" TEXT,
    "jobMaterialMakeMethodId" TEXT,
    "itemId" TEXT,
    "itemReadableId" TEXT,
    "description" TEXT,
    "itemType" TEXT,
    "quantity" NUMERIC,
    "unitCost" NUMERIC,
    "methodType" "methodType",
    "parentMaterialId" TEXT,
    "order" DOUBLE PRECISION,
    "isRoot" BOOLEAN,
    "kit" BOOLEAN,
    "revision" TEXT,
    "version" NUMERIC(10,2),
    "storageUnitId" TEXT
) AS $$
WITH RECURSIVE material AS (
    SELECT
        "jobId",
        "id",
        "id" AS "jobMakeMethodId",
        'Make to Order'::"methodType" AS "methodType",
        "id" AS "jobMaterialMakeMethodId",
        "itemId",
        'Part' AS "itemType",
        1::NUMERIC AS "quantity",
        0::NUMERIC AS "unitCost",
        "parentMaterialId",
        CAST(1 AS DOUBLE PRECISION) AS "order",
        TRUE AS "isRoot",
        FALSE AS "kit",
        "version",
        NULL::TEXT AS "storageUnitId"
    FROM
        "jobMakeMethod"
    WHERE
        "jobId" = jid
        AND "parentMaterialId" IS NULL
    UNION
    SELECT
        child."jobId",
        child."id",
        child."jobMakeMethodId",
        child."methodType",
        child."jobMaterialMakeMethodId",
        child."itemId",
        child."itemType",
        child."quantity",
        child."unitCost",
        parent."id" AS "parentMaterialId",
        child."order",
        FALSE AS "isRoot",
        child."kit",
        child."version",
        child."storageUnitId"
    FROM
        "jobMaterialWithMakeMethodId" child
        INNER JOIN material parent ON parent."jobMaterialMakeMethodId" = child."jobMakeMethodId"
    WHERE parent."methodType" = 'Make to Order'
)
SELECT
  material."jobId",
  material.id as "methodMaterialId",
  material."jobMakeMethodId",
  material."jobMaterialMakeMethodId",
  material."itemId",
  item."readableIdWithRevision" AS "itemReadableId",
  item."name" AS "description",
  material."itemType",
  material."quantity",
  material."unitCost",
  material."methodType",
  material."parentMaterialId",
  material."order",
  material."isRoot",
  material."kit",
  item."revision",
  material."version",
  material."storageUnitId"
FROM material
LEFT JOIN item ON material."itemId" = item.id
WHERE material."jobId" = jid
ORDER BY "order"
$$ LANGUAGE sql STABLE;
