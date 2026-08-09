-- Production qty / pickup lines store Style/Consumable *variant quantities*
-- (combo qty grid), not Part method configuration. Rename the JSONB column
-- to match inventory's `variantQuantities`.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'productionQuantity'
      AND column_name = 'configuration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'productionQuantity'
      AND column_name = 'variantQuantities'
  ) THEN
    ALTER TABLE "productionQuantity" RENAME COLUMN "configuration" TO "variantQuantities";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'jobOperationPickup'
      AND column_name = 'configuration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'jobOperationPickup'
      AND column_name = 'variantQuantities'
  ) THEN
    ALTER TABLE "jobOperationPickup" RENAME COLUMN "configuration" TO "variantQuantities";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'jobOperationSupplierPickup'
      AND column_name = 'configuration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'jobOperationSupplierPickup'
      AND column_name = 'variantQuantities'
  ) THEN
    ALTER TABLE "jobOperationSupplierPickup" RENAME COLUMN "configuration" TO "variantQuantities";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'jobOperationSupplierQuantity'
      AND column_name = 'configuration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'jobOperationSupplierQuantity'
      AND column_name = 'variantQuantities'
  ) THEN
    ALTER TABLE "jobOperationSupplierQuantity" RENAME COLUMN "configuration" TO "variantQuantities";
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
