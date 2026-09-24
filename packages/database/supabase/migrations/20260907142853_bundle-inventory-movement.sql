-- Bundle inventory movement: a standalone in/out ledger ("台账"). A warehouse
-- worker scans any ONE garment's 1D barcode; that code resolves (via
-- garmentRfidCode) to its bundle work order, and one whole-bundle IN or OUT
-- movement is logged here. Deliberately NOT wired to the core itemLedger — this
-- posts no cost/stock, it is an operational scan log (v1). Per-piece movement and
-- real inventory posting are future work.

CREATE TABLE "bundleInventoryMovement" (
  "id" TEXT NOT NULL DEFAULT id('bim'),
  "bundleWorkOrderId" TEXT NOT NULL,
  "direction" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "scannedCode" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "customFields" JSONB,
  "tags" TEXT[],

  CONSTRAINT "bundleInventoryMovement_pkey" PRIMARY KEY ("id", "companyId"),
  CONSTRAINT "bundleInventoryMovement_direction_check"
    CHECK ("direction" IN ('In', 'Out')),
  CONSTRAINT "bundleInventoryMovement_bundleWorkOrderId_fkey"
    FOREIGN KEY ("bundleWorkOrderId") REFERENCES "bundleWorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleInventoryMovement_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "bundleInventoryMovement_companyId_idx" ON "bundleInventoryMovement" ("companyId");
CREATE INDEX "bundleInventoryMovement_bundleWorkOrderId_idx" ON "bundleInventoryMovement" ("bundleWorkOrderId");
CREATE INDEX "bundleInventoryMovement_createdBy_idx" ON "bundleInventoryMovement" ("createdBy");

ALTER TABLE "bundleInventoryMovement" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."bundleInventoryMovement"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."bundleInventoryMovement"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."bundleInventoryMovement"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."bundleInventoryMovement"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

-- Reload PostgREST so the new table is exposed to the API immediately.
NOTIFY pgrst, 'reload schema';
