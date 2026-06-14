-- Part 1: Add employeeId to productionQuantity
-- employeeId = who did the work (selected in the form)
-- createdBy  = who submitted the record (from auth session)
ALTER TABLE "productionQuantity" ADD COLUMN "employeeId" text REFERENCES "user"("id");
UPDATE "productionQuantity" SET "employeeId" = "createdBy";
ALTER TABLE "productionQuantity" ALTER COLUMN "employeeId" SET NOT NULL;

-- Part 2: jobOperationPickup table
-- Records that an employee has physically retrieved materials/units for a specific
-- production quantity. Informational only — no inventory effect.
-- Distinct from the existing material issue flow (issue.tsx) which moves stock.
CREATE TABLE "jobOperationPickup" (
  "id"             text not null default xid(),
  "jobOperationId" text not null references "jobOperation"("id") on delete cascade,
  "employeeId"     text not null references "user"("id"),
  "quantity"       numeric not null,
  "configuration"  jsonb,
  "notes"          text,
  "companyId"      text not null references "company"("id"),
  "createdAt"      timestamp with time zone not null default now(),
  "createdBy"      text not null references "user"("id"),
  "updatedAt"      timestamp with time zone,
  "updatedBy"      text,
  constraint "jobOperationPickup_pkey" primary key ("id")
);

CREATE INDEX "jobOperationPickup_jobOperationId_idx" ON "jobOperationPickup" ("jobOperationId");
CREATE INDEX "jobOperationPickup_companyId_idx" ON "jobOperationPickup" ("companyId");
CREATE INDEX "jobOperationPickup_employeeId_idx" ON "jobOperationPickup" ("employeeId");

ALTER TABLE "jobOperationPickup" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view job operation pickups" ON "jobOperationPickup"
  FOR SELECT
  USING (
    has_role('employee', "companyId")
    AND "companyId" = ANY(
      SELECT "companyId" FROM "userToCompany" WHERE "userId" = auth.uid()::text
    )
  );

CREATE POLICY "Employees can insert job operation pickups" ON "jobOperationPickup"
  FOR INSERT
  WITH CHECK (
    has_role('employee', "companyId")
    AND "companyId" = ANY(
      SELECT "companyId" FROM "userToCompany" WHERE "userId" = auth.uid()::text
    )
  );

CREATE POLICY "Employees can update job operation pickups" ON "jobOperationPickup"
  FOR UPDATE
  USING (
    has_role('employee', "companyId")
    AND has_company_permission('production_update', "companyId")
  );

CREATE POLICY "Employees can delete job operation pickups" ON "jobOperationPickup"
  FOR DELETE
  USING (
    has_role('employee', "companyId")
    AND "companyId" = ANY(
      SELECT "companyId" FROM "userToCompany" WHERE "userId" = auth.uid()::text
    )
  );

ALTER TABLE "jobOperationPickup" REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE "jobOperationPickup";
