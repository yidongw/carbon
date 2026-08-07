-- Persist full attribute combo identity on cutting split rows (N-attr safe).
-- colorCode/sizeCode remain as a 2-part dual-write for older garment tooling.

ALTER TABLE "masterWorkOrderSplitRow"
  ADD COLUMN IF NOT EXISTS "valuesKey" TEXT;

UPDATE "masterWorkOrderSplitRow"
SET "valuesKey" = NULLIF(CONCAT_WS('|', "colorCode", "sizeCode"), '')
WHERE "valuesKey" IS NULL
  AND ("colorCode" IS NOT NULL OR "sizeCode" IS NOT NULL);

NOTIFY pgrst, 'reload schema';
