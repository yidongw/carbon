-- Add insideUnitCost to operations: the per-unit amount paid to the employee
-- who completes the operation (distinct from the work-center laborRate which is overhead).
-- For outside operations, operationUnitCost covers the supplier payment instead.

ALTER TABLE "jobOperation"
  ADD COLUMN "insideUnitCost" NUMERIC(10,4) NOT NULL DEFAULT 0;

ALTER TABLE "methodOperation"
  ADD COLUMN "insideUnitCost" NUMERIC(10,4) NOT NULL DEFAULT 0;

ALTER TABLE "quoteOperation"
  ADD COLUMN "insideUnitCost" NUMERIC(10,4) NOT NULL DEFAULT 0;
