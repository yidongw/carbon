-- Supplier pickups/quantity reports, subcontract snapshots, and operationType extension.

ALTER TABLE "productionQuantityReport" REPLICA IDENTITY FULL;

ALTER TYPE "operationType" ADD VALUE IF NOT EXISTS 'Inside and Outside';

-- Frozen subcontract pricing per job operation + supplier process (one row per pair).
CREATE TABLE "jobOperationSubcontractSnapshot" (
  "id" TEXT NOT NULL DEFAULT id('joss'),
  "companyId" TEXT NOT NULL,
  "jobOperationId" TEXT NOT NULL,
  "supplierProcessId" TEXT NOT NULL,
  "operationMinimumCost" NUMERIC NOT NULL DEFAULT 0,
  "operationUnitCost" NUMERIC NOT NULL DEFAULT 0,
  "operationLeadTime" NUMERIC NOT NULL DEFAULT 0,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "jobOperationSubcontractSnapshot_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "jobOperationSubcontractSnapshot_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSubcontractSnapshot_jobOperationId_fkey"
    FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSubcontractSnapshot_supplierProcessId_fkey"
    FOREIGN KEY ("supplierProcessId") REFERENCES "supplierProcess" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSubcontractSnapshot_createdBy_fkey"
    FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSubcontractSnapshot_jobOperationId_supplierProcessId_key"
    UNIQUE ("jobOperationId", "supplierProcessId")
);

CREATE INDEX "jobOperationSubcontractSnapshot_jobOperationId_idx"
  ON "jobOperationSubcontractSnapshot" ("jobOperationId");
CREATE INDEX "jobOperationSubcontractSnapshot_companyId_idx"
  ON "jobOperationSubcontractSnapshot" ("companyId");

ALTER TABLE "jobOperationSubcontractSnapshot" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "jobOperationSubcontractSnapshot"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "jobOperationSubcontractSnapshot"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "jobOperationSubcontractSnapshot"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

ALTER TABLE "jobOperationSubcontractSnapshot" REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE "jobOperationSubcontractSnapshot";

CREATE TABLE "jobOperationSupplierPickup" (
  "id" TEXT NOT NULL DEFAULT id('josp'),
  "companyId" TEXT NOT NULL,
  "jobOperationId" TEXT NOT NULL,
  "supplierProcessId" TEXT NOT NULL,
  "quantity" NUMERIC NOT NULL,
  "configuration" JSONB,
  "notes" TEXT,
  "purchaseOrderLineId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "jobOperationSupplierPickup_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "jobOperationSupplierPickup_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierPickup_jobOperationId_fkey"
    FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierPickup_supplierProcessId_fkey"
    FOREIGN KEY ("supplierProcessId") REFERENCES "supplierProcess" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierPickup_purchaseOrderLineId_fkey"
    FOREIGN KEY ("purchaseOrderLineId") REFERENCES "purchaseOrderLine" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierPickup_createdBy_fkey"
    FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierPickup_updatedBy_fkey"
    FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "jobOperationSupplierPickup_jobOperationId_idx"
  ON "jobOperationSupplierPickup" ("jobOperationId");
CREATE INDEX "jobOperationSupplierPickup_companyId_idx"
  ON "jobOperationSupplierPickup" ("companyId");

ALTER TABLE "jobOperationSupplierPickup" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "jobOperationSupplierPickup"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "jobOperationSupplierPickup"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "jobOperationSupplierPickup"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "jobOperationSupplierPickup"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

ALTER TABLE "jobOperationSupplierPickup" REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE "jobOperationSupplierPickup";

CREATE TABLE "jobOperationSupplierQuantityReport" (
  "id" TEXT NOT NULL DEFAULT id('josqr'),
  "companyId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "jobOperationId" TEXT NOT NULL,
  "supplierProcessId" TEXT NOT NULL,
  "subcontractSnapshotId" TEXT NOT NULL,
  "originalQuantity" NUMERIC NOT NULL DEFAULT 0,
  "originalConfiguration" JSONB,
  "notes" TEXT,
  "purchaseOrderLineId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "jobOperationSupplierQuantityReport_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "jobOperationSupplierQuantityReport_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantityReport_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantityReport_jobOperationId_fkey"
    FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantityReport_supplierProcessId_fkey"
    FOREIGN KEY ("supplierProcessId") REFERENCES "supplierProcess" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantityReport_subcontractSnapshotId_fkey"
    FOREIGN KEY ("subcontractSnapshotId") REFERENCES "jobOperationSubcontractSnapshot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantityReport_purchaseOrderLineId_fkey"
    FOREIGN KEY ("purchaseOrderLineId") REFERENCES "purchaseOrderLine" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantityReport_createdBy_fkey"
    FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantityReport_updatedBy_fkey"
    FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "jobOperationSupplierQuantityReport_jobOperationId_idx"
  ON "jobOperationSupplierQuantityReport" ("jobOperationId");
CREATE INDEX "jobOperationSupplierQuantityReport_jobId_idx"
  ON "jobOperationSupplierQuantityReport" ("jobId");
CREATE INDEX "jobOperationSupplierQuantityReport_companyId_idx"
  ON "jobOperationSupplierQuantityReport" ("companyId");

ALTER TABLE "jobOperationSupplierQuantityReport" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "jobOperationSupplierQuantityReport"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "jobOperationSupplierQuantityReport"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "jobOperationSupplierQuantityReport"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

ALTER TABLE "jobOperationSupplierQuantityReport" REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE "jobOperationSupplierQuantityReport";

CREATE TABLE "jobOperationSupplierQuantity" (
  "id" TEXT NOT NULL DEFAULT id('josq'),
  "companyId" TEXT NOT NULL,
  "jobOperationId" TEXT NOT NULL,
  "reportId" TEXT NOT NULL,
  "supplierProcessId" TEXT NOT NULL,
  "type" "productionQuantityType" NOT NULL,
  "quantity" NUMERIC NOT NULL,
  "configuration" JSONB,
  "scrapReasonId" TEXT,
  "notes" TEXT,
  "invalidatedAt" TIMESTAMP WITH TIME ZONE,
  "invalidatedBy" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,

  CONSTRAINT "jobOperationSupplierQuantity_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "jobOperationSupplierQuantity_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantity_jobOperationId_fkey"
    FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantity_reportId_fkey"
    FOREIGN KEY ("reportId") REFERENCES "jobOperationSupplierQuantityReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantity_supplierProcessId_fkey"
    FOREIGN KEY ("supplierProcessId") REFERENCES "supplierProcess" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantity_scrapReasonId_fkey"
    FOREIGN KEY ("scrapReasonId") REFERENCES "scrapReason" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantity_invalidatedBy_fkey"
    FOREIGN KEY ("invalidatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobOperationSupplierQuantity_createdBy_fkey"
    FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "jobOperationSupplierQuantity_reportId_idx"
  ON "jobOperationSupplierQuantity" ("reportId");
CREATE INDEX "jobOperationSupplierQuantity_reportId_invalidatedAt_idx"
  ON "jobOperationSupplierQuantity" ("reportId", "invalidatedAt");
CREATE INDEX "jobOperationSupplierQuantity_jobOperationId_invalidatedAt_idx"
  ON "jobOperationSupplierQuantity" ("jobOperationId", "invalidatedAt");

ALTER TABLE "jobOperationSupplierQuantity" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "jobOperationSupplierQuantity"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "jobOperationSupplierQuantity"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "jobOperationSupplierQuantity"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

-- No DELETE policy (mirror productionQuantity invalidation-only semantics).

ALTER TABLE "jobOperationSupplierQuantity" REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE "jobOperationSupplierQuantity";

ALTER TABLE "purchaseOrderLine"
  ADD COLUMN IF NOT EXISTS "jobOperationSupplierQuantityReportId" TEXT
    REFERENCES "jobOperationSupplierQuantityReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Employee and supplier quantity lines both roll up to the same jobOperation counters.
CREATE OR REPLACE FUNCTION sync_update_job_operation_supplier_quantities(
  p_table TEXT,
  p_operation TEXT,
  p_new JSONB,
  p_old JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM sync_update_job_operation_quantities(p_table, p_operation, p_new, p_old);
END;
$$;

SELECT attach_event_trigger(
  'jobOperationSupplierQuantity',
  ARRAY['sync_update_job_operation_supplier_quantities']::TEXT[],
  ARRAY[]::TEXT[]
);
