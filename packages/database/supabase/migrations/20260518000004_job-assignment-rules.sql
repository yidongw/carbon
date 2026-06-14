-- Job assignment rules: match jobs to employee groups based on job/operation attributes.
-- Finance/ops team defines rules; simulation shows which current jobs match.
-- jobGroupAssignment records the actual assignments (manual or rule-driven).

CREATE TABLE "jobAssignmentRule" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  -- JSONB array of conditions: [{field, operator, value}]
  -- Supported fields: customerId, processId, workCenterId, locationId, tags
  -- Supported operators: eq, neq, in, contains
  "conditions" JSONB NOT NULL DEFAULT '[]',
  -- Which group should receive the assignment
  "targetGroupId" TEXT NOT NULL,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "jobAssignmentRule_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "jobAssignmentRule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE,
  CONSTRAINT "jobAssignmentRule_targetGroupId_fkey" FOREIGN KEY ("targetGroupId") REFERENCES "group"("id") ON DELETE RESTRICT,
  CONSTRAINT "jobAssignmentRule_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT,
  CONSTRAINT "jobAssignmentRule_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_jobAssignmentRule_companyId" ON "jobAssignmentRule" ("companyId", "active");

ALTER TABLE "jobAssignmentRule" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with production_view can read assignment rules" ON "jobAssignmentRule"
FOR SELECT USING (
  has_role('employee', "companyId") AND
  has_company_permission('production_view', "companyId")
);

CREATE POLICY "Employees with production_create can create assignment rules" ON "jobAssignmentRule"
FOR INSERT WITH CHECK (
  has_role('employee', "companyId") AND
  has_company_permission('production_create', "companyId")
);

CREATE POLICY "Employees with production_update can update assignment rules" ON "jobAssignmentRule"
FOR UPDATE USING (
  has_role('employee', "companyId") AND
  has_company_permission('production_update', "companyId")
);

CREATE POLICY "Employees with production_delete can delete assignment rules" ON "jobAssignmentRule"
FOR DELETE USING (
  has_role('employee', "companyId") AND
  has_company_permission('production_delete', "companyId")
);

-- Records which jobs are assigned to which groups
CREATE TABLE "jobGroupAssignment" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "jobId" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  -- Null means manually assigned; non-null means rule-driven
  "ruleId" TEXT,
  "assignedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "assignedBy" TEXT NOT NULL,

  CONSTRAINT "jobGroupAssignment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "jobGroupAssignment_job_group_key" UNIQUE ("jobId", "groupId"),
  CONSTRAINT "jobGroupAssignment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE,
  CONSTRAINT "jobGroupAssignment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE,
  CONSTRAINT "jobGroupAssignment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE,
  CONSTRAINT "jobGroupAssignment_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "jobAssignmentRule"("id") ON DELETE SET NULL,
  CONSTRAINT "jobGroupAssignment_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "user"("id") ON DELETE RESTRICT
);

CREATE INDEX "idx_jobGroupAssignment_jobId" ON "jobGroupAssignment" ("jobId");
CREATE INDEX "idx_jobGroupAssignment_groupId" ON "jobGroupAssignment" ("groupId");
CREATE INDEX "idx_jobGroupAssignment_companyId" ON "jobGroupAssignment" ("companyId");

ALTER TABLE "jobGroupAssignment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with production_view can read job group assignments" ON "jobGroupAssignment"
FOR SELECT USING (
  has_role('employee', "companyId") AND
  has_company_permission('production_view', "companyId")
);

CREATE POLICY "Employees can see their own job assignments" ON "jobGroupAssignment"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "membership" m
    WHERE m."groupId" = "jobGroupAssignment"."groupId"
    AND m."memberUserId" = auth.uid()::text
  )
);

CREATE POLICY "Employees with production_create can create job group assignments" ON "jobGroupAssignment"
FOR INSERT WITH CHECK (
  has_role('employee', "companyId") AND
  has_company_permission('production_create', "companyId")
);

CREATE POLICY "Employees with production_delete can delete job group assignments" ON "jobGroupAssignment"
FOR DELETE USING (
  has_role('employee', "companyId") AND
  has_company_permission('production_delete', "companyId")
);

-- Enriched view for display
CREATE OR REPLACE VIEW "jobAssignmentRules" WITH (SECURITY_INVOKER = true) AS
SELECT
  r.*,
  g.name AS "targetGroupName"
FROM "jobAssignmentRule" r
LEFT JOIN "group" g ON g.id = r."targetGroupId";
