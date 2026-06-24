-- Store per-report configuration breakdown (configTable) on production quantities,
-- matching the job.configuration shape used when creating configured items.
ALTER TABLE "productionQuantity" ADD COLUMN IF NOT EXISTS "configuration" JSONB;
