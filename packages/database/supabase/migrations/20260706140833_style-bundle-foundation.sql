ALTER TYPE "itemType" ADD VALUE IF NOT EXISTS 'Style';
ALTER TYPE "payableLineType" ADD VALUE IF NOT EXISTS 'Style';
ALTER TYPE "purchaseOrderLineType" ADD VALUE IF NOT EXISTS 'Style';
ALTER TYPE "salesInvoiceLineType" ADD VALUE IF NOT EXISTS 'Style';

-- Postgres will not let the rest of this migration reference newly-added enum
-- values until the current transaction commits.
COMMIT;
BEGIN;

ALTER TABLE "purchaseInvoiceLine" DROP CONSTRAINT IF EXISTS "purchaseInvoiceLines_lineType_check";
ALTER TABLE "purchaseInvoiceLine"
ADD CONSTRAINT "purchaseInvoiceLines_lineType_check"
CHECK (
  (
    "invoiceLineType" = 'Comment' AND
    "itemId" IS NULL AND
    "accountId" IS NULL AND
    "assetId" IS NULL AND
    "description" IS NOT NULL
  )
  OR (
    "invoiceLineType" = 'G/L Account' AND
    "itemId" IS NULL AND
    "accountId" IS NOT NULL AND
    "assetId" IS NULL
  )
  OR (
    (
      "invoiceLineType" = 'Style' OR
      "invoiceLineType" = 'Part' OR
      "invoiceLineType" = 'Material' OR
      "invoiceLineType" = 'Tool' OR
      "invoiceLineType" = 'Consumable' OR
      "invoiceLineType" = 'Fixture' OR
      "invoiceLineType" = 'Service'
    ) AND
    "itemId" IS NOT NULL AND
    "accountId" IS NULL AND
    "assetId" IS NULL
  )
  OR (
    "invoiceLineType" = 'Fixed Asset' AND
    "itemId" IS NULL AND
    "accountId" IS NULL AND
    "assetId" IS NOT NULL
  )
);

ALTER TABLE "salesInvoiceLine" DROP CONSTRAINT IF EXISTS "salesInvoiceLineType_check";
ALTER TABLE "salesInvoiceLine"
ADD CONSTRAINT "salesInvoiceLineType_check"
CHECK (
  (
    "invoiceLineType" = 'Comment' AND
    "itemId" IS NULL AND
    "accountId" IS NULL AND
    "assetId" IS NULL AND
    "description" IS NOT NULL
  )
  OR (
    (
      "invoiceLineType" = 'Style' OR
      "invoiceLineType" = 'Part' OR
      "invoiceLineType" = 'Material' OR
      "invoiceLineType" = 'Tool' OR
      "invoiceLineType" = 'Consumable' OR
      "invoiceLineType" = 'Fixture' OR
      "invoiceLineType" = 'Service'
    ) AND
    "itemId" IS NOT NULL AND
    "accountId" IS NULL AND
    "assetId" IS NULL
  )
  OR (
    "invoiceLineType" = 'Fixed Asset' AND
    "itemId" IS NULL AND
    "accountId" IS NULL AND
    "assetId" IS NOT NULL
  )
);

ALTER TABLE "purchaseOrderLine" DROP CONSTRAINT IF EXISTS "purchaseOrderLineType_check";
ALTER TABLE "purchaseOrderLine"
ADD CONSTRAINT "purchaseOrderLineType_check"
CHECK (
  (
    "purchaseOrderLineType" = 'Comment' AND
    "itemId" IS NULL AND
    "accountId" IS NULL AND
    "assetId" IS NULL AND
    "description" IS NOT NULL
  )
  OR (
    "purchaseOrderLineType" = 'G/L Account' AND
    "itemId" IS NULL AND
    "accountId" IS NOT NULL AND
    "assetId" IS NULL
  )
  OR (
    (
      "purchaseOrderLineType" = 'Style' OR
      "purchaseOrderLineType" = 'Part' OR
      "purchaseOrderLineType" = 'Material' OR
      "purchaseOrderLineType" = 'Tool' OR
      "purchaseOrderLineType" = 'Consumable' OR
      "purchaseOrderLineType" = 'Fixture' OR
      "purchaseOrderLineType" = 'Service'
    ) AND
    "itemId" IS NOT NULL AND
    "accountId" IS NULL AND
    "assetId" IS NULL
  )
  OR (
    "purchaseOrderLineType" = 'Fixed Asset' AND
    "itemId" IS NULL AND
    "accountId" IS NULL AND
    "assetId" IS NOT NULL
  )
);

CREATE TABLE "style" (
  "id" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "customFields" JSONB,
  "tags" TEXT[],

  CONSTRAINT "style_pkey" PRIMARY KEY ("id", "companyId"),
  CONSTRAINT "style_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "style_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "style_itemId_key" UNIQUE ("itemId")
);

CREATE INDEX "style_itemId_idx" ON "style" ("itemId");
CREATE INDEX "style_companyId_idx" ON "style" ("companyId");

ALTER TABLE "style" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."style"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."style"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."style"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."style"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_delete'))::text[]
  )
);

CREATE TYPE "splitBatchStatus" AS ENUM (
  'Draft',
  'Confirmed',
  'Cancelled'
);

CREATE TYPE "bundleStatus" AS ENUM (
  'Planned',
  'Released',
  'In Progress',
  'Completed',
  'Cancelled'
);

CREATE TABLE "splitBatch" (
  "id" TEXT NOT NULL DEFAULT id('sbt'),
  "jobId" TEXT NOT NULL,
  "jobOperationId" TEXT,
  "itemId" TEXT NOT NULL,
  "status" "splitBatchStatus" NOT NULL DEFAULT 'Draft',
  "notes" TEXT,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "splitBatch_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "splitBatch_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "splitBatch_jobOperationId_fkey"
    FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "splitBatch_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "splitBatch_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "splitBatch_jobId_idx" ON "splitBatch" ("jobId");
CREATE INDEX "splitBatch_jobOperationId_idx" ON "splitBatch" ("jobOperationId");
CREATE INDEX "splitBatch_itemId_idx" ON "splitBatch" ("itemId");
CREATE INDEX "splitBatch_companyId_idx" ON "splitBatch" ("companyId");

ALTER TABLE "splitBatch" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."splitBatch"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."splitBatch"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."splitBatch"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."splitBatch"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

CREATE TABLE "bundle" (
  "id" TEXT NOT NULL DEFAULT id('bnd'),
  "splitBatchId" TEXT NOT NULL,
  "jobId" TEXT,
  "itemId" TEXT NOT NULL,
  "bundleNumber" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "colorCode" TEXT NOT NULL,
  "colorName" TEXT NOT NULL,
  "sizeCode" TEXT,
  "shadeLot" TEXT,
  "quantity" NUMERIC NOT NULL,
  "status" "bundleStatus" NOT NULL DEFAULT 'Planned',
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "bundle_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bundle_splitBatchId_fkey"
    FOREIGN KEY ("splitBatchId") REFERENCES "splitBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundle_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "bundle_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundle_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundle_quantity_positive" CHECK ("quantity" > 0),
  CONSTRAINT "bundle_bundleNumber_key" UNIQUE ("bundleNumber", "companyId")
);

CREATE INDEX "bundle_splitBatchId_idx" ON "bundle" ("splitBatchId");
CREATE INDEX "bundle_jobId_idx" ON "bundle" ("jobId");
CREATE INDEX "bundle_itemId_idx" ON "bundle" ("itemId");
CREATE INDEX "bundle_companyId_idx" ON "bundle" ("companyId");
CREATE INDEX "bundle_color_size_idx" ON "bundle" ("colorCode", "sizeCode", "companyId");

ALTER TABLE "bundle" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."bundle"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."bundle"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."bundle"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."bundle"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

CREATE TABLE "productionQuantitySplitRow" (
  "id" TEXT NOT NULL DEFAULT id('psr'),
  "productionQuantityId" TEXT NOT NULL,
  "reportId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "jobOperationId" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "rowKey" TEXT NOT NULL,
  "colorCode" TEXT NOT NULL,
  "sizeCode" TEXT,
  "shadeLot" TEXT,
  "configurationKey" TEXT NOT NULL,
  "rowConfiguration" JSONB,
  "quantity" NUMERIC NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "productionQuantitySplitRow_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "productionQuantitySplitRow_productionQuantityId_fkey"
    FOREIGN KEY ("productionQuantityId") REFERENCES "productionQuantity"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantitySplitRow_reportId_fkey"
    FOREIGN KEY ("reportId") REFERENCES "productionQuantityReport"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantitySplitRow_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantitySplitRow_jobOperationId_fkey"
    FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantitySplitRow_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantitySplitRow_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantitySplitRow_quantity_positive" CHECK ("quantity" > 0),
  CONSTRAINT "productionQuantitySplitRow_productionQuantityId_rowKey_key"
    UNIQUE ("productionQuantityId", "rowKey")
);

CREATE INDEX "productionQuantitySplitRow_productionQuantityId_idx" ON "productionQuantitySplitRow" ("productionQuantityId");
CREATE INDEX "productionQuantitySplitRow_reportId_idx" ON "productionQuantitySplitRow" ("reportId");
CREATE INDEX "productionQuantitySplitRow_jobId_idx" ON "productionQuantitySplitRow" ("jobId");
CREATE INDEX "productionQuantitySplitRow_jobOperationId_idx" ON "productionQuantitySplitRow" ("jobOperationId");
CREATE INDEX "productionQuantitySplitRow_itemId_idx" ON "productionQuantitySplitRow" ("itemId");
CREATE INDEX "productionQuantitySplitRow_companyId_idx" ON "productionQuantitySplitRow" ("companyId");
CREATE INDEX "productionQuantitySplitRow_grouping_idx" ON "productionQuantitySplitRow" ("itemId", "colorCode", "sizeCode", "shadeLot", "companyId");

ALTER TABLE "productionQuantitySplitRow" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."productionQuantitySplitRow"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."productionQuantitySplitRow"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."productionQuantitySplitRow"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."productionQuantitySplitRow"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

CREATE TABLE "bundleAllocation" (
  "id" TEXT NOT NULL DEFAULT id('bal'),
  "bundleId" TEXT NOT NULL,
  "productionQuantitySplitRowId" TEXT NOT NULL,
  "quantity" NUMERIC NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "bundleAllocation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bundleAllocation_bundleId_fkey"
    FOREIGN KEY ("bundleId") REFERENCES "bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleAllocation_productionQuantitySplitRowId_fkey"
    FOREIGN KEY ("productionQuantitySplitRowId") REFERENCES "productionQuantitySplitRow"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleAllocation_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleAllocation_quantity_positive" CHECK ("quantity" > 0)
);

CREATE INDEX "bundleAllocation_bundleId_idx" ON "bundleAllocation" ("bundleId");
CREATE INDEX "bundleAllocation_productionQuantitySplitRowId_idx" ON "bundleAllocation" ("productionQuantitySplitRowId");
CREATE INDEX "bundleAllocation_companyId_idx" ON "bundleAllocation" ("companyId");

ALTER TABLE "bundleAllocation" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."bundleAllocation"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."bundleAllocation"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."bundleAllocation"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."bundleAllocation"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

CREATE TABLE "styleColor" (
  "id" TEXT NOT NULL DEFAULT id('sco'),
  "colorCode" TEXT NOT NULL,
  "colorName" TEXT NOT NULL,
  "companyId" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "styleColor_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "styleColor_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "styleColor_colorCode_companyId_key" UNIQUE ("colorCode", "companyId")
);

CREATE INDEX "styleColor_companyId_idx" ON "styleColor" ("companyId");
CREATE INDEX "styleColor_colorCode_idx" ON "styleColor" ("colorCode");

ALTER TABLE "styleColor" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."styleColor"
FOR SELECT USING (
  "companyId" IS NULL OR
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."styleColor"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."styleColor"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."styleColor"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_delete'))::text[]
  )
);

CREATE TABLE "styleColorAssignment" (
  "styleId" TEXT NOT NULL,
  "styleColorId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),

  CONSTRAINT "styleColorAssignment_pkey" PRIMARY KEY ("styleId", "styleColorId", "companyId"),
  CONSTRAINT "styleColorAssignment_styleId_companyId_fkey"
    FOREIGN KEY ("styleId", "companyId") REFERENCES "style"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "styleColorAssignment_styleColorId_fkey"
    FOREIGN KEY ("styleColorId") REFERENCES "styleColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "styleColorAssignment_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "styleColorAssignment_styleId_idx" ON "styleColorAssignment" ("styleId", "companyId");
CREATE INDEX "styleColorAssignment_styleColorId_idx" ON "styleColorAssignment" ("styleColorId");

ALTER TABLE "styleColorAssignment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."styleColorAssignment"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."styleColorAssignment"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."styleColorAssignment"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."styleColorAssignment"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_delete'))::text[]
  )
);

CREATE VIEW "styles" WITH (SECURITY_INVOKER=true) AS
WITH latest_items AS (
  SELECT DISTINCT ON (i."readableId", i."companyId")
    i.*
  FROM "item" i
  WHERE i."type" = 'Style'
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
  (
    SELECT json_agg(json_build_object('id', sc."id", 'colorCode', sc."colorCode", 'colorName', sc."colorName") ORDER BY sc."colorCode")
    FROM "styleColorAssignment" sca
    JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
    WHERE sca."styleId" = s."id"
      AND sca."companyId" = s."companyId"
  ) AS colors,
  ir."revisions",
  s."customFields",
  s."tags",
  ic."itemPostingGroupId",
  li."createdBy",
  li."createdAt",
  li."updatedBy",
  li."updatedAt"
FROM "style" s
INNER JOIN latest_items li ON li."id" = s."itemId"
LEFT JOIN item_revisions ir ON ir."readableId" = li."readableId" AND ir."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

CREATE OR REPLACE FUNCTION sync_create_make_method_related_records(
  p_table TEXT,
  p_operation TEXT,
  p_new JSONB,
  p_old JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_operation != 'INSERT' THEN RETURN; END IF;

  IF (p_new->>'type') IN ('Part', 'Tool', 'Style') THEN
    INSERT INTO "makeMethod"("itemId", "createdBy", "companyId")
    VALUES (p_new->>'id', p_new->>'createdBy', p_new->>'companyId');
  END IF;
END;
$$;

COMMIT;
