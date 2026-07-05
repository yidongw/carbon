-- Expose the location display name on the "jobs" view so the Jobs list table can
-- inline-edit locationId with the selected value rendered (no async lookup /
-- raw id flash). Rebuilt verbatim from the live view (pg_get_viewdef); only one
-- LEFT JOIN and one name column are appended, as CREATE OR REPLACE VIEW requires
-- the existing column list to stay identical and in order.

CREATE OR REPLACE VIEW "jobs" WITH (SECURITY_INVOKER=true) AS
 WITH job_model AS (
         SELECT j_1.id AS job_id,
            j_1."companyId",
            COALESCE(j_1."modelUploadId", i_1."modelUploadId") AS model_upload_id
           FROM job j_1
             LEFT JOIN item i_1 ON j_1."itemId" = i_1.id AND j_1."companyId" = i_1."companyId"
        ), root_operation_stats AS (
         SELECT jo."jobId",
            count(*)::integer AS "operationCount",
            count(*) FILTER (WHERE jo.status = 'Done'::"jobOperationStatus")::integer AS "completedOperationCount"
           FROM "jobOperation" jo
             JOIN "jobMakeMethod" jmm_1 ON jo."jobMakeMethodId" = jmm_1.id
          WHERE jmm_1."parentMaterialId" IS NULL
          GROUP BY jo."jobId"
        ), root_routing_min_complete AS (
         SELECT jo."jobId",
            min(jo."quantityComplete") AS "quantityFullyComplete"
           FROM "jobOperation" jo
             JOIN "jobMakeMethod" jmm_1 ON jo."jobMakeMethodId" = jmm_1.id
          WHERE jmm_1."parentMaterialId" IS NULL
          GROUP BY jo."jobId"
        )
 SELECT j.id,
    j."jobId",
    j."itemId",
    j."unitOfMeasureCode",
    j."customerId",
    j."locationId",
    j.status,
    j."dueDate",
    j."deadlineType",
    j.quantity,
    j."scrapQuantity",
    j."productionQuantity",
    j."quantityComplete",
    j."quantityShipped",
    j."quantityReceivedToInventory",
    j."salesOrderId",
    j."salesOrderLineId",
    j."quoteId",
    j."quoteLineId",
    j."modelUploadId",
    j.notes,
    j.assignee,
    j."customFields",
    j."companyId",
    j."createdAt",
    j."createdBy",
    j."updatedAt",
    j."updatedBy",
    j.tags,
    j.configuration,
    j."releasedDate",
    j."completedDate",
    j."estimatedTime",
    j."actualTime",
    j."secondsToComplete",
    j."startDate",
    j."storageUnitId",
    j.priority,
    j."deletedAt",
    j."deletedBy",
    jmm.id AS "jobMakeMethodId",
    i.name,
    i."readableIdWithRevision" AS "itemReadableIdWithRevision",
    i.type AS "itemType",
    i.name AS description,
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
    mu.name AS "modelName",
    mu.size AS "modelSize",
    so."salesOrderId" AS "salesOrderReadableId",
    qo."quoteId" AS "quoteReadableId",
    COALESCE(os."operationCount", 0) AS "operationCount",
    COALESCE(os."completedOperationCount", 0) AS "completedOperationCount",
    COALESCE(rrc."quantityFullyComplete", 0::numeric) AS "quantityFullyComplete",
    loc.name AS "locationName"
   FROM job j
     LEFT JOIN "jobMakeMethod" jmm ON jmm."jobId" = j.id AND jmm."parentMaterialId" IS NULL
     LEFT JOIN item i ON j."itemId" = i.id AND j."companyId" = i."companyId"
     LEFT JOIN job_model jm ON j.id = jm.job_id AND j."companyId" = jm."companyId"
     LEFT JOIN "modelUpload" mu ON mu.id = jm.model_upload_id
     LEFT JOIN "salesOrder" so ON j."salesOrderId" = so.id AND j."companyId" = so."companyId"
     LEFT JOIN quote qo ON j."quoteId" = qo.id AND j."companyId" = qo."companyId"
     LEFT JOIN root_operation_stats os ON os."jobId" = j.id
     LEFT JOIN root_routing_min_complete rrc ON rrc."jobId" = j.id
     LEFT JOIN "location" loc ON loc.id = j."locationId"
  WHERE j."deletedAt" IS NULL;
