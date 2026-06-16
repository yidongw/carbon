-- Universal soft delete: deletedAt / deletedBy on user-deletable tables.
-- Application layer converts DELETE → UPDATE via wrapSoftDeleteClient().

CREATE OR REPLACE FUNCTION public.is_visible(deleted_at timestamptz)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT deleted_at IS NULL
      OR current_setting('app.include_deleted', true) = 'true';
$$;

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'ability', 'account', 'address', 'apiKey', 'batchProperty', 'company',
    'configurationParameter', 'configurationParameterGroup', 'contractor', 'costCenter',
    'customField', 'customer', 'customerStatus', 'customerType', 'department', 'document',
    'externalLink', 'gauge', 'gaugeType', 'group', 'holiday', 'item', 'itemPostingGroup',
    'itemRule', 'itemShelfLife', 'job', 'jobAssignmentRule', 'jobMaterial', 'jobOperation',
    'jobOperationParameter', 'jobOperationPickup', 'jobOperationStep', 'jobOperationTool',
    'journal', 'journalLine', 'kanban', 'location', 'maintenanceDispatch',
    'maintenanceDispatchComment', 'maintenanceDispatchEvent', 'maintenanceDispatchItem',
    'maintenanceFailureMode', 'maintenanceSchedule', 'maintenanceScheduleItem',
    'materialDimension', 'materialFinish', 'materialForm', 'materialGrade', 'materialSubstance',
    'materialType', 'methodMaterial', 'methodOperation', 'methodOperationParameter',
    'methodOperationStep', 'methodOperationTool', 'noQuoteReason', 'nonConformance', 'partner',
    'pricingRule', 'procedure', 'process', 'productionEvent', 'purchaseInvoice', 'purchaseOrder',
    'purchasingRfq', 'qualityDocument', 'quote', 'quoteLine', 'quoteLinePrice', 'quoteMakeMethod',
    'quoteMaterial', 'quoteOperation', 'quoteOperationParameter', 'quoteOperationStep',
    'quoteOperationTool', 'receipt', 'receiptLine', 'riskRegister', 'salesInvoice',
    'salesInvoiceLine', 'salesOrder', 'salesOrderLine', 'salesRfq', 'salesRfqLine',
    'scrapReason', 'shipment', 'shipmentLine', 'stockTransfer', 'storageType', 'storageUnit',
    'suggestion', 'supplier', 'supplierQuote', 'supplierQuoteLine', 'supplierType', 'tableView',
    'templateConfigurationParameter', 'templateMethodMaterial', 'templateMethodOperation',
    'templateMethodOperationParameter', 'templateMethodOperationStep', 'templateMethodOperationTool',
    'timeCardEntry', 'training', 'trainingAssignment', 'unitOfMeasure', 'warehouseTransfer',
    'warehouseTransferLine', 'webhook'
  ];
  has_company_id boolean;
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    IF to_regclass(format('public.%I', t)) IS NULL THEN
      CONTINUE;
    END IF;

    EXECUTE format(
      'ALTER TABLE %I ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ',
      t
    );
    EXECUTE format(
      'ALTER TABLE %I ADD COLUMN IF NOT EXISTS "deletedBy" TEXT',
      t
    );

    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = t
        AND column_name = 'companyId'
    ) INTO has_company_id;

    IF has_company_id THEN
      EXECUTE format(
        'CREATE INDEX IF NOT EXISTS %I ON %I ("companyId") WHERE "deletedAt" IS NULL',
        t || '_not_deleted_companyId_idx',
        t
      );
    END IF;
  END LOOP;
END $$;

-- Jobs list view: hide soft-deleted jobs (still join deleted items for history).
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
INNER JOIN "item" i ON j."itemId" = i."id" AND j."companyId" = i."companyId"
LEFT JOIN job_model jm ON j.id = jm.job_id AND j."companyId" = jm."companyId"
LEFT JOIN "modelUpload" mu ON mu.id = jm.model_upload_id
LEFT JOIN "salesOrder" so ON j."salesOrderId" = so.id AND j."companyId" = so."companyId"
LEFT JOIN "quote" qo ON j."quoteId" = qo.id AND j."companyId" = qo."companyId"
LEFT JOIN root_operation_stats os ON os."jobId" = j.id
LEFT JOIN root_routing_min_complete rrc ON rrc."jobId" = j.id
WHERE j."deletedAt" IS NULL;

-- Parts list view: exclude soft-deleted item revisions from latest/revision aggregates.
CREATE OR REPLACE VIEW "parts" WITH (SECURITY_INVOKER=true) AS
WITH latest_items AS (
  SELECT DISTINCT ON (i."readableId", i."companyId")
    i.*,
    mu.id as "modelUploadId",
    mu."modelPath",
    mu."thumbnailPath" as "modelThumbnailPath",
    mu."name" as "modelName",
    mu."size" as "modelSize"
  FROM "item" i
  LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
  WHERE i."type" = 'Part'
    AND i."deletedAt" IS NULL
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
      ) as "revisions"
  FROM "item" i
  WHERE i."type" = 'Part'
    AND i."deletedAt" IS NULL
  GROUP BY i."readableId", i."companyId"
)
SELECT
  li."active",
  li."assignee",
  li."defaultMethodType",
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
  CASE
    WHEN li."thumbnailPath" IS NULL AND li."modelThumbnailPath" IS NOT NULL THEN li."modelThumbnailPath"
    ELSE li."thumbnailPath"
  END as "thumbnailPath",
  li."modelPath",
  li."modelName",
  li."modelSize",
  ps."supplierIds",
  uom.name as "unitOfMeasure",
  ir."revisions",
  p."customFields",
  p."tags",
  ic."itemPostingGroupId",
  (
    SELECT COALESCE(
      jsonb_object_agg(
        eim."integration",
        CASE
          WHEN eim."metadata" IS NOT NULL THEN eim."metadata"
          ELSE to_jsonb(eim."externalId")
        END
      ) FILTER (WHERE eim."externalId" IS NOT NULL OR eim."metadata" IS NOT NULL),
      '{}'::jsonb
    )
    FROM "externalIntegrationMapping" eim
    WHERE eim."entityType" = 'item' AND eim."entityId" = li.id
  ) AS "externalId",
  li."createdBy",
  li."createdAt",
  li."updatedBy",
  li."updatedAt",
  p."templateId",
  tmpl.name as "templateName"
FROM "part" p
INNER JOIN latest_items li ON li."readableId" = p."id" AND li."companyId" = p."companyId"
LEFT JOIN item_revisions ir ON ir."readableId" = p."id" AND ir."companyId" = p."companyId"
LEFT JOIN (
  SELECT
    "itemId",
    "companyId",
    string_agg(ps."supplierPartId", ',') AS "supplierIds"
  FROM "supplierPart" ps
  GROUP BY "itemId", "companyId"
) ps ON ps."itemId" = li."id" AND ps."companyId" = li."companyId"
LEFT JOIN "unitOfMeasure" uom ON uom.code = li."unitOfMeasureCode" AND uom."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id
LEFT JOIN "template" tmpl ON tmpl.id = p."templateId";
