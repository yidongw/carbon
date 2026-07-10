-- Master Work Order split rows: the color/size/quantity rows captured when the
-- cutting operation is reported on a master work order. They are the editable
-- rows shown in the "Confirm Split" modal, and each row materializes into one
-- bundle work order (child job) when the split is confirmed.

CREATE TABLE "masterWorkOrderSplitRow" (
  "id" TEXT NOT NULL DEFAULT id('mws'),
  "masterWorkOrderId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "colorCode" TEXT,
  "sizeCode" TEXT,
  "quantity" NUMERIC NOT NULL DEFAULT 0,
  -- Set once this row has been materialized into a bundle work order (the split
  -- is confirmed). NULL means the row is still pending / editable.
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
