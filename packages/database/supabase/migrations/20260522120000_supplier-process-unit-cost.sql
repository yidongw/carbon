-- Restore per-unit subcontract pricing on supplierProcess (removed in 20241115011318).
-- Used by job/quote/item BOP routing and frozen on jobOperationSubcontractSnapshot.

DROP VIEW IF EXISTS "supplierProcesses";

ALTER TABLE "supplierProcess"
  ADD COLUMN IF NOT EXISTS "unitCost" NUMERIC(10, 4) NOT NULL DEFAULT 0;

CREATE VIEW "supplierProcesses" WITH (SECURITY_INVOKER = true) AS
  SELECT
    sp.*,
    p.name AS "processName"
  FROM "supplierProcess" sp
  INNER JOIN "process" p ON sp."processId" = p.id;
