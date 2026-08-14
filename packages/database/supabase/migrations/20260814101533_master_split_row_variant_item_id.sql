-- Stamp the stable variantItemId onto masterWorkOrderSplitRow so Split Batch can
-- match a cut row to its variant SKU by the drift-proof id instead of the mutable,
-- code-derived valuesKey. Mirrors the variant-item-id backfill on quantity cells
-- (20260813142708_backfill-variant-item-id-on-quantity-cells.sql). Once
-- itemVariant.valuesKey is flipped to an opaque uniqueness fingerprint, valuesKey
-- matching breaks; variantItemId does not.

ALTER TABLE "masterWorkOrderSplitRow"
  ADD COLUMN IF NOT EXISTS "variantItemId" TEXT;

-- Backfill: match each split row's (parent item, valuesKey) to its itemVariant.
--   * Parent item — the master's job.itemId, normalized up through itemVariant
--     (a master job can carry a CHILD variant SKU; a true parent has no itemVariant
--     row and resolves to itself), exactly like resolveStyleMethodItemId.
--   * valuesKey — itemVariant.valuesKey is STILL a code-combo at this migration, so
--     the code-combo persisted on the split row matches. (This is why the backfill
--     must run before any opaque-valuesKey flip.)
--
-- Safety properties:
--   * Guarded    — only rows with a non-empty valuesKey are considered.
--   * Idempotent — rows already carrying a variantItemId are skipped.
--   * Lossless   — a row whose valuesKey has no matching variant is left NULL
--                  (still matchable by valuesKey), so no cut row is ever dropped.
UPDATE "masterWorkOrderSplitRow" sr
SET "variantItemId" = iv."variantItemId"
FROM "masterWorkOrder" mwo
JOIN "job" j ON j."id" = mwo."jobId",
     "itemVariant" iv
WHERE sr."variantItemId" IS NULL
  AND NULLIF(sr."valuesKey", '') IS NOT NULL
  AND mwo."id" = sr."masterWorkOrderId"
  AND mwo."companyId" = sr."companyId"
  AND iv."companyId" = sr."companyId"
  AND iv."valuesKey" = sr."valuesKey"
  AND iv."parentItemId" = COALESCE(
        (SELECT pv."parentItemId"
           FROM "itemVariant" pv
          WHERE pv."variantItemId" = j."itemId"
            AND pv."companyId" = sr."companyId"),
        j."itemId");

-- FK to the variant SKU item row, matching the table's other id columns. ON DELETE
-- SET NULL (like bundleWorkOrderId) so removing a variant SKU never cascade-deletes
-- cut history.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'masterWorkOrderSplitRow_variantItemId_fkey'
  ) THEN
    ALTER TABLE "masterWorkOrderSplitRow"
      ADD CONSTRAINT "masterWorkOrderSplitRow_variantItemId_fkey"
      FOREIGN KEY ("variantItemId") REFERENCES "item"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
