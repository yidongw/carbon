-- Bind physical UHF chip EPC (externalCode) to system-minted garmentRfidCode.code.
-- Handheld UHF PDA bulk-reads a bundle's chips; we assign 1:1 by sequence when
-- the unique EPC count matches the bundle piece count.

ALTER TABLE "garmentRfidCode"
  ADD COLUMN IF NOT EXISTS "externalCode" TEXT,
  ADD COLUMN IF NOT EXISTS "boundAt" TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS "boundBy" TEXT REFERENCES "user"("id");

-- One physical chip may only bind to one garment row per company.
CREATE UNIQUE INDEX IF NOT EXISTS "garmentRfidCode_companyId_externalCode_key"
  ON "garmentRfidCode" ("companyId", "externalCode")
  WHERE "externalCode" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "garmentRfidCode_externalCode_idx"
  ON "garmentRfidCode" ("externalCode")
  WHERE "externalCode" IS NOT NULL;

NOTIFY pgrst, 'reload schema';
