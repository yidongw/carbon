-- Add payment period columns to productionQuantity.
-- paymentYear/paymentMonth serve dual purpose:
--   NULL  → pending (employee submitted, awaiting manager approval)
--   SET   → approved; values define which salary period the earnings belong to
-- Managers set these at insert time (auto-approved) or via UPDATE (approval/override).
-- Note: employeeId column is added by 20260519130000_job-operation-pickup.sql

ALTER TABLE "productionQuantity"
  ADD COLUMN "paymentYear"  INTEGER CHECK ("paymentYear" > 2000),
  ADD COLUMN "paymentMonth" INTEGER CHECK ("paymentMonth" >= 1 AND "paymentMonth" <= 12);

-- Both fields must be set together or both null
ALTER TABLE "productionQuantity"
  ADD CONSTRAINT "productionQuantity_payment_period_check"
    CHECK (
      ("paymentYear" IS NULL AND "paymentMonth" IS NULL) OR
      ("paymentYear" IS NOT NULL AND "paymentMonth" IS NOT NULL)
    );

CREATE INDEX "idx_productionQuantity_payment"
  ON "productionQuantity" ("companyId", "paymentYear", "paymentMonth")
  WHERE "paymentYear" IS NOT NULL;
