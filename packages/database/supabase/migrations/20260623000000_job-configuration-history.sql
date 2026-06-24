-- Job configuration quantity history: append-only log of adjustments to a job's
-- configuration parameters. Each row records the signed delta that was applied
-- (configuration = the adjustment's configTable, quantity = signed delta total).
-- The job's current configuration/quantity remains the running sum of all adjustments.
-- History is immutable: only SELECT and INSERT policies are granted.

CREATE TABLE "jobConfigurationHistory" (
  "id" TEXT NOT NULL DEFAULT id('jch'),
  "companyId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "configuration" JSONB NOT NULL,
  "quantity" NUMERIC NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,

  CONSTRAINT "jobConfigurationHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "jobConfigurationHistory_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobConfigurationHistory_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobConfigurationHistory_createdBy_fkey"
    FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "jobConfigurationHistory_jobId_idx"
  ON "jobConfigurationHistory" ("jobId");
CREATE INDEX "jobConfigurationHistory_companyId_idx"
  ON "jobConfigurationHistory" ("companyId");

ALTER TABLE "jobConfigurationHistory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "jobConfigurationHistory"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "jobConfigurationHistory"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

-- No UPDATE or DELETE policies: history rows are immutable.
