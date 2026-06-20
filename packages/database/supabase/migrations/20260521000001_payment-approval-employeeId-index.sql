-- Add index on productionQuantity(employeeId, companyId) for salary queries.
-- Runs after 20260519130000 which adds the employeeId column.

CREATE INDEX IF NOT EXISTS "idx_productionQuantity_employeeId"
  ON "productionQuantity" ("employeeId", "companyId");

-- Allow HR/finance (people_update) to approve completions by setting paymentYear/paymentMonth.
-- The existing UPDATE policy only covers production_update; salary managers need this too.
CREATE POLICY "Users with people_update can approve production quantities for salary"
ON "productionQuantity"
FOR UPDATE USING (
  has_role('employee', "companyId") AND
  has_company_permission('people_update', "companyId")
);

-- Ensure the salary sync trigger includes "invalidatedAt".
-- 20260520120001 already creates it correctly; this is a safe no-op on fresh DBs.
DROP TRIGGER IF EXISTS trg_sync_salary_on_production_quantity ON "productionQuantity";
CREATE TRIGGER trg_sync_salary_on_production_quantity
AFTER INSERT OR UPDATE OF "paymentYear", "paymentMonth", "quantity", "invalidatedAt"
ON "productionQuantity"
FOR EACH ROW
EXECUTE FUNCTION trigger_sync_salary_on_production_quantity();
