-- Demo companies: per-user, full-feature, time-limited sandbox companies.
--
-- "company"."isDemo" is a cheap discriminator. The rest of the demo metadata lives in a
-- dedicated 1:1 side table (matching companyPlan / companySettings / companyUsage):
--   expiresAt   — when access ends (creation + 30 days)
--   seedStatus  — pending | seeding | seeded (sample-data seeding state)
-- A scheduled job deletes a demo 30 days past expiresAt (~60 days after creation).

ALTER TABLE "company" ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "demoCompany" (
  "id" TEXT NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE,
  -- NOT NULL + default so the atomic claim (... WHERE seedStatus <> 'seeding') can never
  -- skip a NULL row, and any insert path that omits it still gets a valid status.
  "seedStatus" TEXT NOT NULL DEFAULT 'pending',
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
