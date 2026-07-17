-- Per-company list of hidden MES home/sidebar sections (keyed by section id:
-- pickup, report, schedule, assigned, active, recent, jobs, salary,
-- maintenance, picking), toggled from the MES settings page in the ERP.
ALTER TABLE "companySettings"
  ADD COLUMN IF NOT EXISTS "hiddenMesSections" TEXT[] NOT NULL DEFAULT '{}';

NOTIFY pgrst, 'reload schema';
