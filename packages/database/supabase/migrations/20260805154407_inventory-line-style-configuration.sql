-- Persist Style/Consumable variant quantity grids on inventory document lines
-- (combo rows: valuesKey + Quantities). Not Part method configuration.
ALTER TABLE "warehouseTransferLine" ADD COLUMN IF NOT EXISTS "variantQuantities" JSONB;
ALTER TABLE "stockTransferLine" ADD COLUMN IF NOT EXISTS "variantQuantities" JSONB;
ALTER TABLE "shipmentLine" ADD COLUMN IF NOT EXISTS "variantQuantities" JSONB;
ALTER TABLE "receiptLine" ADD COLUMN IF NOT EXISTS "variantQuantities" JSONB;

-- Views project `*.*`, so the new column is exposed without a rebuild.
