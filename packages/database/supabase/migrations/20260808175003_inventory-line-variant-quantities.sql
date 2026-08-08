-- Inventory document lines store Style/Consumable *variant quantities*
-- (combo qty grid), not Part method configuration. Rename the JSONB column
-- accordingly. Safe if the column was already created as "configuration".
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'warehouseTransferLine'
      AND column_name = 'configuration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'warehouseTransferLine'
      AND column_name = 'variantQuantities'
  ) THEN
    ALTER TABLE "warehouseTransferLine" RENAME COLUMN "configuration" TO "variantQuantities";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'stockTransferLine'
      AND column_name = 'configuration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'stockTransferLine'
      AND column_name = 'variantQuantities'
  ) THEN
    ALTER TABLE "stockTransferLine" RENAME COLUMN "configuration" TO "variantQuantities";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'shipmentLine'
      AND column_name = 'configuration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'shipmentLine'
      AND column_name = 'variantQuantities'
  ) THEN
    ALTER TABLE "shipmentLine" RENAME COLUMN "configuration" TO "variantQuantities";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'receiptLine'
      AND column_name = 'configuration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'receiptLine'
      AND column_name = 'variantQuantities'
  ) THEN
    ALTER TABLE "receiptLine" RENAME COLUMN "configuration" TO "variantQuantities";
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
