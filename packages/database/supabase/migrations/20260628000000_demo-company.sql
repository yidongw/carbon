-- Demo companies: per-user, full-feature, time-limited sandbox companies.
--
-- "isDemo" marks a company as a demo. "demoExpiresAt" is when access ends
-- (creation + 30 days). A scheduled job (packages/jobs .../scheduled/demo-cleanup.ts)
-- deletes the company once it is 30 days past "demoExpiresAt" (i.e. ~60 days after
-- creation). Paying or an approved extension pushes "demoExpiresAt" out by 30 days.
--
-- Existing RLS policies on "company" apply to all columns, so no policy changes are
-- needed here.

ALTER TABLE "company" ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "company" ADD COLUMN "demoExpiresAt" TIMESTAMP WITH TIME ZONE;

-- Supports the daily cleanup scan over expired demo companies.
CREATE INDEX "company_demoExpiresAt_idx"
  ON "company" ("demoExpiresAt")
  WHERE "isDemo" = true;
