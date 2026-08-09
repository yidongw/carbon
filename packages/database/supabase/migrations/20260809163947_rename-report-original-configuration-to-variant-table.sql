-- Production/supplier quantity *reports* snapshot the submitted variant grid.
-- The app now reads/writes this as `originalVariantTable` (matching the
-- variantTable rename elsewhere), so rename the report columns to match.
-- No view exposes these columns, so a plain RENAME suffices.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'productionQuantityReport'
      AND column_name = 'originalConfiguration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'productionQuantityReport'
      AND column_name = 'originalVariantTable'
  ) THEN
    ALTER TABLE "productionQuantityReport"
      RENAME COLUMN "originalConfiguration" TO "originalVariantTable";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'jobOperationSupplierQuantityReport'
      AND column_name = 'originalConfiguration'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'jobOperationSupplierQuantityReport'
      AND column_name = 'originalVariantTable'
  ) THEN
    ALTER TABLE "jobOperationSupplierQuantityReport"
      RENAME COLUMN "originalConfiguration" TO "originalVariantTable";
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
