-- Add assignedAt to the master work orders view + the two MES report RPCs so
-- the shop-floor tables can show when each row was assigned.

-- 1) masterWorkOrders view: append assignedAt (CREATE OR REPLACE can add trailing cols)
CREATE OR REPLACE VIEW "masterWorkOrders" AS
 SELECT mwo.id,
    mwo."jobId",
    mwo."companyId",
    mwo.tags,
    mwo."createdAt",
    mwo."createdBy",
    mwo."updatedAt",
    mwo."updatedBy",
    j."jobId" AS "jobReadableId",
    j.status,
    j.quantity,
    j."dueDate",
    j."locationId",
    j."itemId",
    i."readableIdWithRevision",
    i.name AS "itemName",
    i.type AS "itemType",
    i."thumbnailPath",
    j."customerId",
    j."startDate",
    j."deadlineType",
    j."salesOrderId",
    j."salesOrderLineId",
    so."salesOrderId" AS "salesOrderReadableId",
    loc.name AS "locationName",
    j.assignee,
    j."scrapQuantity",
    j."storageUnitId",
    j."assignedAt"
   FROM "masterWorkOrder" mwo
     JOIN job j ON j.id = mwo."jobId"
     LEFT JOIN item i ON i.id = j."itemId" AND i."companyId" = j."companyId"
     LEFT JOIN "salesOrder" so ON j."salesOrderId" = so.id AND j."companyId" = so."companyId"
     LEFT JOIN location loc ON loc.id = j."locationId";

-- 2) get_assigned_operations_for_report: append assignedAt (return type change -> DROP+CREATE)
DROP FUNCTION IF EXISTS get_assigned_operations_for_report(text);
CREATE FUNCTION public.get_assigned_operations_for_report(company_id text)
 RETURNS TABLE(id text, "jobId" text, "operationOrder" double precision, "processId" text, description text, "operationStatus" "jobOperationStatus", "targetQuantity" numeric, "operationQuantity" numeric, "quantityComplete" numeric, "quantityReworked" numeric, "quantityScrapped" numeric, assignee text, "jobReadableId" text, "itemReadableId" text, "bundleWorkOrderId" text, "masterWorkOrderId" text, "readableIdWithRevision" text, "styleReadableId" text, "itemName" text, "attributeLabel" text, "assignedAt" timestamptz)
 LANGUAGE plpgsql
AS $function$
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
    bwo."attributeLabel",
    jo."assignedAt"
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
$function$;

-- 3) get_assigned_job_operations: append assignedAt (return type change -> DROP+CREATE)
DROP FUNCTION IF EXISTS get_assigned_job_operations(text, text);
CREATE FUNCTION public.get_assigned_job_operations(user_id text, company_id text)
 RETURNS TABLE(id text, "jobId" text, "operationOrder" double precision, "processId" text, "workCenterId" text, description text, "setupTime" numeric, "setupUnit" factor, "laborTime" numeric, "laborUnit" factor, "machineTime" numeric, "machineUnit" factor, "operationOrderType" "methodOperationOrder", "jobReadableId" text, "jobStatus" "jobStatus", "jobDueDate" date, "jobDeadlineType" "deadlineType", "jobCustomerId" text, "salesOrderReadableId" text, "salesOrderId" text, "salesOrderLineId" text, "parentMaterialId" text, "itemReadableId" text, "itemDescription" text, "operationStatus" "jobOperationStatus", "targetQuantity" numeric, "operationQuantity" numeric, "quantityComplete" numeric, "quantityReworked" numeric, "quantityScrapped" numeric, "thumbnailPath" text, assignee text, tags text[], "operationDueDate" date, "assignedAt" timestamptz)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    jo."id",
    jo."jobId",
    jo."order" AS "operationOrder",
    jo."processId",
    jo."workCenterId",
    jo."description",
    jo."setupTime",
    jo."setupUnit",
    jo."laborTime",
    jo."laborUnit",
    jo."machineTime",
    jo."machineUnit",
    jo."operationOrder" AS "operationOrderType",
    j."jobId" AS "jobReadableId",
    j."status" AS "jobStatus",
    j."dueDate" AS "jobDueDate",
    j."deadlineType" AS "jobDeadlineType",
    j."customerId" AS "jobCustomerId",
    so."salesOrderId" AS "salesOrderReadableId",
    so."id" AS "salesOrderId",
    j."salesOrderLineId",
    jmm."parentMaterialId",
    i."readableId" as "itemReadableId",
    i."name" as "itemDescription",
    CASE
      WHEN j."status" = 'Paused' THEN 'Paused'
      ELSE jo."status"
    END AS "operationStatus",
    jo."targetQuantity"::NUMERIC,
    jo."operationQuantity",
    jo."quantityComplete",
    jo."quantityReworked",
    jo."quantityScrapped",
    CASE
      WHEN jmm."parentMaterialId" IS NULL THEN COALESCE(i."thumbnailPath", j_mu."thumbnailPath", i_mu."thumbnailPath")
      ELSE COALESCE(i."thumbnailPath", i_mu."thumbnailPath")
    END as "thumbnailPath",
    jo."assignee",
    jo."tags",
    jo."dueDate" AS "operationDueDate",
    jo."assignedAt"
  FROM "jobOperation" jo
  JOIN "job" j ON j.id = jo."jobId"
  LEFT JOIN "salesOrderLine" sol ON sol."id" = j."salesOrderLineId"
  LEFT JOIN "salesOrder" so ON so."id" = sol."salesOrderId"
  LEFT JOIN "jobMakeMethod" jmm ON jo."jobMakeMethodId" = jmm.id
  LEFT JOIN "item" i ON jmm."itemId" = i.id
  LEFT JOIN "modelUpload" j_mu ON j_mu.id = j."modelUploadId"
  LEFT JOIN "modelUpload" i_mu ON i_mu.id = i."modelUploadId"
  WHERE jo."assignee" = user_id
  AND (
    jo."status" IN ('Todo', 'Ready', 'Waiting', 'In Progress', 'Paused')
    OR COALESCE(jo."quantityReworked", 0) > 0
  )
  AND j."status" IN ('Ready', 'In Progress', 'Paused')
  AND j."companyId" = company_id
  ORDER BY jo."priority";
END;
$function$;

NOTIFY pgrst, 'reload schema';
