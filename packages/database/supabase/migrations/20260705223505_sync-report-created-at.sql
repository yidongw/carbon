-- Sync productionQuantityReport.createdAt from primary productionQuantity line
-- where a user corrected the quantity's createdAt but the report wasn't updated
UPDATE "productionQuantityReport" r
SET "createdAt" = pq."createdAt", "updatedAt" = NOW()
FROM (
  SELECT DISTINCT ON ("reportId") "reportId", "createdAt"
  FROM "productionQuantity"
  WHERE "invalidatedAt" IS NULL
    AND "type" = 'Production'
    AND "reportId" IS NOT NULL
  ORDER BY "reportId", "createdAt" ASC
) pq
WHERE r.id = pq."reportId"
  AND r."createdAt" IS DISTINCT FROM pq."createdAt";
