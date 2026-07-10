-- Bundle work orders carry the configuration (color/size, etc.) of the cutting
-- quantity cell they were generated from. colorCode/sizeCode stay as
-- denormalized columns (derived from this) for easy display/filtering.
ALTER TABLE "bundleWorkOrder" ADD COLUMN IF NOT EXISTS "configuration" JSONB;

NOTIFY pgrst, 'reload schema';
