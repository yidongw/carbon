-- Per-company list of hidden navigation sub-items (keyed by their route path),
-- toggled from the module settings pages.
ALTER TABLE "companySettings"
  ADD COLUMN IF NOT EXISTS "hiddenSubmodules" TEXT[] NOT NULL DEFAULT '{}';

NOTIFY pgrst, 'reload schema';
