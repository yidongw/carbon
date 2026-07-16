-- Cut split rows: the color/size/quantity rows captured when a Master Work
-- Order's cutting is reported. productionQuantity.configuration stays merged
-- (one cell per color/size); these rows preserve the un-merged breakdown
-- (multiple rows per color/size allowed) so the "Split Batch" modal can prefill
-- one bundle per row. `bundleWorkOrderId` is set once a row is materialized into
-- a bundle (NULL = still pending). `productionQuantityReportId` is the cutting
-- report that produced the row (re-reporting replaces its still-pending rows).

CREATE TABLE "masterWorkOrderSplitRow" (
  "id" TEXT NOT NULL DEFAULT id('mws'),
  "masterWorkOrderId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "productionQuantityReportId" TEXT,
  "colorCode" TEXT,
  "sizeCode" TEXT,
  "quantity" NUMERIC NOT NULL DEFAULT 0,
  "bundleWorkOrderId" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "masterWorkOrderSplitRow_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "masterWorkOrderSplitRow_masterWorkOrderId_fkey"
    FOREIGN KEY ("masterWorkOrderId") REFERENCES "masterWorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "masterWorkOrderSplitRow_bundleWorkOrderId_fkey"
    FOREIGN KEY ("bundleWorkOrderId") REFERENCES "bundleWorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "masterWorkOrderSplitRow_productionQuantityReportId_fkey"
    FOREIGN KEY ("productionQuantityReportId") REFERENCES "productionQuantityReport"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "masterWorkOrderSplitRow_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "masterWorkOrderSplitRow_companyId_idx" ON "masterWorkOrderSplitRow" ("companyId");
CREATE INDEX "masterWorkOrderSplitRow_masterWorkOrderId_idx" ON "masterWorkOrderSplitRow" ("masterWorkOrderId");

ALTER TABLE "masterWorkOrderSplitRow" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."masterWorkOrderSplitRow"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."masterWorkOrderSplitRow"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."masterWorkOrderSplitRow"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."masterWorkOrderSplitRow"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

NOTIFY pgrst, 'reload schema';
