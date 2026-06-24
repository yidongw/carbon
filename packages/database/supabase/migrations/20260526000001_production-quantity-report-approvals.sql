-- Production pay approvals via unified approvalRequest workflow.
-- documentId references productionQuantityReport.id (superseded on report revision).

ALTER TYPE "approvalDocumentType" ADD VALUE IF NOT EXISTS 'productionQuantityReport';
COMMIT;

CREATE INDEX IF NOT EXISTS "approvalRequest_companyId_documentType_status_idx"
  ON "approvalRequest" ("companyId", "documentType", "status");

DROP VIEW IF EXISTS "approvalRequests";
CREATE OR REPLACE VIEW "approvalRequests" WITH (SECURITY_INVOKER=true) AS
SELECT
  ar."id",
  ar."documentType",
  ar."documentId",
  ar."status",
  ar."requestedBy",
  ar."requestedAt",
  ar."decisionBy",
  ar."decisionAt",
  ar."decisionNotes",
  ar."companyId",
  ar."createdAt",
  CASE
    WHEN ar."documentType" = 'purchaseOrder' THEN po."purchaseOrderId"
    WHEN ar."documentType" = 'qualityDocument' THEN qd."name"
    WHEN ar."documentType" = 'supplier' THEN sup."name"
    WHEN ar."documentType" = 'productionQuantityReport' THEN
      COALESCE(j."jobId", '') || ' · ' || COALESCE(u."fullName", u."firstName", '')
    ELSE NULL
  END AS "documentReadableId",
  CASE
    WHEN ar."documentType" = 'purchaseOrder' THEN s."name"
    WHEN ar."documentType" = 'qualityDocument' THEN qd."description"
    WHEN ar."documentType" = 'supplier' THEN NULL
    WHEN ar."documentType" = 'productionQuantityReport' THEN
      COALESCE(p."name", jo."description")
    ELSE NULL
  END AS "documentDescription"
FROM "approvalRequest" ar
LEFT JOIN "purchaseOrder" po ON ar."documentType" = 'purchaseOrder' AND ar."documentId" = po."id"
LEFT JOIN "supplier" s ON po."supplierId" = s."id"
LEFT JOIN "qualityDocument" qd ON ar."documentType" = 'qualityDocument' AND ar."documentId" = qd."id"
LEFT JOIN "supplier" sup ON ar."documentType" = 'supplier' AND ar."documentId" = sup."id"
LEFT JOIN "productionQuantityReport" pqr
  ON ar."documentType" = 'productionQuantityReport' AND ar."documentId" = pqr."id"
LEFT JOIN "job" j ON pqr."jobId" = j."id"
LEFT JOIN "user" u ON pqr."employeeId" = u."id"
LEFT JOIN "jobOperation" jo ON pqr."jobOperationId" = jo."id"
LEFT JOIN "process" p ON jo."processId" = p."id";
