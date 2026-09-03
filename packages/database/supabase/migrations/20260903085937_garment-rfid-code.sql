-- Garment RFID code: one row per finished garment piece, carrying a unique
-- RFID/EPC code. A child of a bundle work order (the color/size batch); the
-- garment's style/color/size/order are derived by joining up through the bundle.
-- Scope (minimal): the system only GENERATES and STORES the code. Printing the
-- care label and encoding the physical RFID chip are handled externally.

CREATE TABLE "garmentRfidCode" (
  "id" TEXT NOT NULL DEFAULT id('grf'),
  "code" TEXT NOT NULL,
  "bundleWorkOrderId" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL DEFAULT 1,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "customFields" JSONB,
  "tags" TEXT[],

  CONSTRAINT "garmentRfidCode_pkey" PRIMARY KEY ("id", "companyId"),
  CONSTRAINT "garmentRfidCode_bundleWorkOrderId_fkey"
    FOREIGN KEY ("bundleWorkOrderId") REFERENCES "bundleWorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "garmentRfidCode_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  -- The RFID code must be unique within a company (globally unique per factory).
  CONSTRAINT "garmentRfidCode_companyId_code_key" UNIQUE ("companyId", "code")
);

CREATE INDEX "garmentRfidCode_companyId_idx" ON "garmentRfidCode" ("companyId");
CREATE INDEX "garmentRfidCode_bundleWorkOrderId_idx" ON "garmentRfidCode" ("bundleWorkOrderId");

ALTER TABLE "garmentRfidCode" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."garmentRfidCode"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."garmentRfidCode"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."garmentRfidCode"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."garmentRfidCode"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

-- Reload PostgREST so the new table is exposed to the API immediately.
NOTIFY pgrst, 'reload schema';
