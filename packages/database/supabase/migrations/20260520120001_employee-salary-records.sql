-- Monthly salary records: one per employee per calendar month.
-- totalEarned is recomputed by trigger whenever a productionQuantity row
-- has its paymentYear/paymentMonth set (approved) or cleared (revoked).
-- Finance can pay in full or partial installments via employeeSalaryPayment.

DO $$ BEGIN
  CREATE TYPE "salaryRecordStatus" AS ENUM ('Unpaid', 'Partially Paid', 'Paid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "employeeSalaryRecord" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "employeeId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL CHECK ("month" >= 1 AND "month" <= 12),
  -- Cached total; recomputed when production quantities are approved/revoked
  "totalEarned" NUMERIC(10,4) NOT NULL DEFAULT 0,
  "totalPaid" NUMERIC(10,4) NOT NULL DEFAULT 0,
  "status" "salaryRecordStatus" NOT NULL DEFAULT 'Unpaid',
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "employeeSalaryRecord_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "employeeSalaryRecord_employee_period_key" UNIQUE ("employeeId", "companyId", "year", "month"),
  CONSTRAINT "employeeSalaryRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE RESTRICT,
  CONSTRAINT "employeeSalaryRecord_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE,
  CONSTRAINT "employeeSalaryRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT,
  CONSTRAINT "employeeSalaryRecord_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "idx_salaryRecord_companyId" ON "employeeSalaryRecord" ("companyId", "year", "month");
CREATE INDEX IF NOT EXISTS "idx_salaryRecord_employeeId" ON "employeeSalaryRecord" ("employeeId", "companyId");

ALTER TABLE "employeeSalaryRecord" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Employees can view their own salary records" ON "employeeSalaryRecord"
  FOR SELECT USING (auth.uid()::text = "employeeId");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users with people_view can see all salary records" ON "employeeSalaryRecord"
  FOR SELECT USING (
    has_role('employee', "companyId") AND
    has_company_permission('people_view', "companyId")
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users with people_create can insert salary records" ON "employeeSalaryRecord"
  FOR INSERT WITH CHECK (
    has_role('employee', "companyId") AND
    has_company_permission('people_create', "companyId")
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users with people_update can update salary records" ON "employeeSalaryRecord"
  FOR UPDATE USING (
    has_role('employee', "companyId") AND
    has_company_permission('people_update', "companyId")
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Individual payment installments against a salary record
CREATE TABLE IF NOT EXISTS "employeeSalaryPayment" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "salaryRecordId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "amount" NUMERIC(10,4) NOT NULL CHECK ("amount" > 0),
  "paidAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "paidBy" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "employeeSalaryPayment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "employeeSalaryPayment_salaryRecordId_fkey" FOREIGN KEY ("salaryRecordId") REFERENCES "employeeSalaryRecord"("id") ON DELETE CASCADE,
  CONSTRAINT "employeeSalaryPayment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE,
  CONSTRAINT "employeeSalaryPayment_paidBy_fkey" FOREIGN KEY ("paidBy") REFERENCES "user"("id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "idx_salaryPayment_salaryRecordId" ON "employeeSalaryPayment" ("salaryRecordId");
CREATE INDEX IF NOT EXISTS "idx_salaryPayment_companyId" ON "employeeSalaryPayment" ("companyId");

ALTER TABLE "employeeSalaryPayment" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Employees can view their own salary payments" ON "employeeSalaryPayment"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "employeeSalaryRecord" r
      WHERE r.id = "salaryRecordId"
      AND r."employeeId" = auth.uid()::text
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users with people_view can see all salary payments" ON "employeeSalaryPayment"
  FOR SELECT USING (
    has_role('employee', "companyId") AND
    has_company_permission('people_view', "companyId")
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users with people_create can record payments" ON "employeeSalaryPayment"
  FOR INSERT WITH CHECK (
    has_role('employee', "companyId") AND
    has_company_permission('people_create', "companyId")
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Recomputes totalEarned + totalPaid for one employee/period and upserts the record.
-- Source of truth for earnings: productionQuantity rows where paymentYear/Month are set.
-- Rate is always live from jobOperation.insideUnitCost (no snapshot).
-- Status is payment-derived: Unpaid / Partially Paid / Paid.
CREATE OR REPLACE FUNCTION sync_salary_record(
  p_employee_id TEXT,
  p_company_id  TEXT,
  p_year        INTEGER,
  p_month       INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_earned NUMERIC;
  v_total_paid   NUMERIC;
  v_new_status   "salaryRecordStatus";
  v_caller       TEXT;
BEGIN
  v_caller := COALESCE(auth.uid()::text, p_employee_id);

  -- Sum approved, non-invalidated production quantities for this employee/period
  SELECT COALESCE(SUM(pq.quantity * jo."insideUnitCost"), 0)
  INTO v_total_earned
  FROM "productionQuantity" pq
  INNER JOIN "jobOperation" jo ON jo.id = pq."jobOperationId"
  WHERE pq."employeeId"    = p_employee_id
    AND pq."companyId"     = p_company_id
    AND pq."type"          = 'Production'
    AND pq."paymentYear"   = p_year
    AND pq."paymentMonth"  = p_month
    AND pq."invalidatedAt" IS NULL;

  -- Sum payments recorded against this period's salary record
  SELECT COALESCE(SUM(sp.amount), 0)
  INTO v_total_paid
  FROM "employeeSalaryPayment" sp
  INNER JOIN "employeeSalaryRecord" sr ON sr.id = sp."salaryRecordId"
  WHERE sr."employeeId" = p_employee_id
    AND sr."companyId"  = p_company_id
    AND sr."year"       = p_year
    AND sr."month"      = p_month;

  IF v_total_paid > 0 AND v_total_earned > 0 AND v_total_paid >= v_total_earned THEN
    v_new_status := 'Paid';
  ELSIF v_total_paid > 0 THEN
    v_new_status := 'Partially Paid';
  ELSE
    v_new_status := 'Unpaid';
  END IF;

  INSERT INTO "employeeSalaryRecord"
    ("employeeId", "companyId", "year", "month", "totalEarned", "totalPaid", "status", "createdBy")
  VALUES
    (p_employee_id, p_company_id, p_year, p_month, v_total_earned, v_total_paid, v_new_status, v_caller)
  ON CONFLICT ("employeeId", "companyId", "year", "month")
  DO UPDATE SET
    "totalEarned" = v_total_earned,
    "totalPaid"   = v_total_paid,
    "status"      = v_new_status,
    "updatedAt"   = NOW(),
    "updatedBy"   = v_caller;
END;
$$;

-- Trigger: sync salary record when a productionQuantity row's payment period,
-- quantity, or invalidation status changes.
-- Fires on INSERT (if already approved) and UPDATE of relevant columns.
CREATE OR REPLACE FUNCTION trigger_sync_salary_on_production_quantity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- On INSERT with payment period set and not invalidated (manager auto-approved)
  IF TG_OP = 'INSERT'
    AND NEW."paymentYear" IS NOT NULL
    AND NEW."employeeId" IS NOT NULL
    AND NEW."invalidatedAt" IS NULL
  THEN
    PERFORM sync_salary_record(NEW."employeeId", NEW."companyId", NEW."paymentYear", NEW."paymentMonth");

  ELSIF TG_OP = 'UPDATE' THEN
    -- Sync the new period if it has one (and row is not invalidated, or was just invalidated)
    IF NEW."paymentYear" IS NOT NULL AND NEW."employeeId" IS NOT NULL THEN
      PERFORM sync_salary_record(NEW."employeeId", NEW."companyId", NEW."paymentYear", NEW."paymentMonth");
    END IF;

    -- Sync the old period if it was different (override/revoke/period change)
    IF OLD."paymentYear" IS NOT NULL
      AND OLD."employeeId" IS NOT NULL
      AND (
        OLD."paymentYear" != NEW."paymentYear"
        OR OLD."paymentMonth" != NEW."paymentMonth"
        OR NEW."paymentYear" IS NULL
        OR (OLD."invalidatedAt" IS DISTINCT FROM NEW."invalidatedAt")
      )
    THEN
      PERFORM sync_salary_record(OLD."employeeId", OLD."companyId", OLD."paymentYear", OLD."paymentMonth");
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_salary_on_production_quantity ON "productionQuantity";
CREATE TRIGGER trg_sync_salary_on_production_quantity
AFTER INSERT OR UPDATE OF "paymentYear", "paymentMonth", "quantity", "invalidatedAt"
ON "productionQuantity"
FOR EACH ROW
EXECUTE FUNCTION trigger_sync_salary_on_production_quantity();

-- Trigger: sync salary record when a payment is recorded or deleted
CREATE OR REPLACE FUNCTION trigger_sync_salary_on_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec RECORD;
BEGIN
  SELECT r."employeeId", r."companyId", r."year", r."month"
  INTO v_rec
  FROM "employeeSalaryRecord" r
  WHERE r.id = COALESCE(NEW."salaryRecordId", OLD."salaryRecordId");

  IF FOUND THEN
    PERFORM sync_salary_record(v_rec."employeeId", v_rec."companyId", v_rec."year", v_rec."month");
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_salary_on_payment ON "employeeSalaryPayment";
CREATE TRIGGER trg_sync_salary_on_payment
AFTER INSERT OR DELETE
ON "employeeSalaryPayment"
FOR EACH ROW
EXECUTE FUNCTION trigger_sync_salary_on_payment();

-- Enriched view for the ERP salary list: joins user, department, and pending
-- production-pay totals.
CREATE OR REPLACE VIEW "employeeSalaryRecords" WITH (SECURITY_INVOKER = true) AS
SELECT
  r.*,
  u."firstName",
  u."lastName",
  u."fullName" AS "employeeName",
  u."avatarUrl",
  (r."totalEarned" - r."totalPaid") AS "amountOwed",
  d."id" AS "departmentId",
  d."name" AS "departmentName",
  COALESCE(p."pendingCount", 0)::integer AS "pendingCount",
  COALESCE(p."pendingAmount", 0)::numeric AS "pendingAmount"
FROM "employeeSalaryRecord" r
INNER JOIN "user" u ON u.id = r."employeeId"
LEFT JOIN "employeeJob" ej ON ej."id" = r."employeeId" AND ej."companyId" = r."companyId"
LEFT JOIN "department" d ON d."id" = ej."departmentId"
LEFT JOIN LATERAL (
  SELECT
    COUNT(*)::integer AS "pendingCount",
    COALESCE(SUM(pq."quantity" * jo."insideUnitCost"), 0)::numeric AS "pendingAmount"
  FROM "productionQuantity" pq
  INNER JOIN "jobOperation" jo ON jo."id" = pq."jobOperationId"
  WHERE pq."employeeId" = r."employeeId"
    AND pq."companyId" = r."companyId"
    AND pq."type" = 'Production'
    AND pq."paymentYear" IS NULL
    AND pq."invalidatedAt" IS NULL
) p ON true;
