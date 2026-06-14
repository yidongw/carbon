-- 20260518000001 added insideUnitCost to jobOperation, methodOperation, and
-- quoteOperation but missed templateMethodOperation. Add it here.

ALTER TABLE "templateMethodOperation"
  ADD COLUMN IF NOT EXISTS "insideUnitCost" NUMERIC(10,4) NOT NULL DEFAULT 0;
