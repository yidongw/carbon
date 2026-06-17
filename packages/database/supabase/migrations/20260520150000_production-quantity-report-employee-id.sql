-- Rename reportedBy -> employeeId and drop redundant reportedAt (use createdAt).
-- Idempotent: fresh installs use employeeId from 20260520120000; older DBs still have reportedBy.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'productionQuantityReport'
      AND column_name = 'reportedBy'
  ) THEN
    ALTER TABLE "productionQuantityReport"
      DROP CONSTRAINT IF EXISTS "productionQuantityReport_reportedBy_fkey";

    ALTER TABLE "productionQuantityReport"
      RENAME COLUMN "reportedBy" TO "employeeId";
  END IF;
END $$;

ALTER TABLE "productionQuantityReport"
  DROP COLUMN IF EXISTS "reportedAt";

ALTER TABLE "productionQuantityReport"
  DROP CONSTRAINT IF EXISTS "productionQuantityReport_employeeId_fkey";

ALTER TABLE "productionQuantityReport"
  ADD CONSTRAINT "productionQuantityReport_employeeId_fkey"
    FOREIGN KEY ("employeeId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Align employeeId with active line when backfill used createdBy
UPDATE "productionQuantityReport" pqr
SET "employeeId" = sub."employeeId"
FROM (
  SELECT DISTINCT ON (pq."reportId")
    pq."reportId",
    pq."employeeId"
  FROM "productionQuantity" pq
  WHERE pq."invalidatedAt" IS NULL
  ORDER BY pq."reportId", pq."createdAt" ASC
) sub
WHERE pqr.id = sub."reportId"
  AND sub."employeeId" IS NOT NULL
  AND pqr."employeeId" IS DISTINCT FROM sub."employeeId";
