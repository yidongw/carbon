-- Move demo metadata off the core "company" table into a dedicated 1:1 side table,
-- matching how Carbon models other per-company concerns (companyPlan, companySettings,
-- companyUsage). "company"."isDemo" stays as a cheap discriminator; the metadata
-- (expiry, seed status, and future fields like extension requests) lives here.

CREATE TABLE "demoCompany" (
  "id" TEXT NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE,
  "seedStatus" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_demoCompany" PRIMARY KEY ("id"),
  CONSTRAINT "fk_demoCompany_company" FOREIGN KEY ("id") REFERENCES "company"("id") ON DELETE CASCADE
);

ALTER TABLE "demoCompany" ENABLE ROW LEVEL SECURITY;

-- Members of the company can read its demo row; writes are service-role only.
CREATE POLICY "SELECT" ON "demoCompany"
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND "id" IN (
      SELECT "companyId" FROM "userToCompany" WHERE "userId" = auth.uid()::text
    )
  );

-- Supports the daily cleanup scan over expired demos.
CREATE INDEX "demoCompany_expiresAt_idx" ON "demoCompany" ("expiresAt");

-- Migrate existing demo metadata off "company".
INSERT INTO "demoCompany" ("id", "expiresAt", "seedStatus")
  SELECT "id", "demoExpiresAt", "demoSeedStatus"
  FROM "company"
  WHERE "isDemo" = true
  ON CONFLICT ("id") DO NOTHING;

-- Drop the now-relocated columns (the partial index goes with the column).
DROP INDEX IF EXISTS "company_demoExpiresAt_idx";
ALTER TABLE "company" DROP COLUMN "demoExpiresAt";
ALTER TABLE "company" DROP COLUMN "demoSeedStatus";
