-- Assign employees to processes.
-- Mirrors "supplierProcess" (supplier <-> process) with an employee <-> process join.

CREATE TABLE "employeeProcess" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "employeeId" TEXT NOT NULL,
  "processId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "employeeProcess_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "employeeProcess_employeeId_processId_key" UNIQUE ("employeeId", "processId"),
  CONSTRAINT "employeeProcess_employeeId_fkey" FOREIGN KEY ("employeeId", "companyId") REFERENCES "employee"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "employeeProcess_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE CASCADE,
  CONSTRAINT "employeeProcess_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE,
  CONSTRAINT "employeeProcess_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "employeeProcess_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE
);

CREATE INDEX "employeeProcess_companyId_idx" ON "employeeProcess" ("companyId");
CREATE INDEX "employeeProcess_employeeId_idx" ON "employeeProcess" ("employeeId");
CREATE INDEX "employeeProcess_processId_idx" ON "employeeProcess" ("processId");

ALTER TABLE "employeeProcess" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."employeeProcess"
FOR SELECT USING (
  "companyId" = ANY (
    (
      SELECT
        get_companies_with_employee_role()
    )::text[]
  )
);

-- Assignable from both the Process form (resources) and the Employee page (people).
CREATE POLICY "INSERT" ON "public"."employeeProcess"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (
      SELECT
        get_companies_with_employee_permission ('resources_create')
    )::text[]
  )
  OR "companyId" = ANY (
    (
      SELECT
        get_companies_with_employee_permission ('people_create')
    )::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."employeeProcess"
FOR UPDATE USING (
  "companyId" = ANY (
    (
      SELECT
        get_companies_with_employee_permission ('resources_update')
    )::text[]
  )
  OR "companyId" = ANY (
    (
      SELECT
        get_companies_with_employee_permission ('people_update')
    )::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."employeeProcess"
FOR DELETE USING (
  "companyId" = ANY (
    (
      SELECT
        get_companies_with_employee_permission ('resources_delete')
    )::text[]
  )
  OR "companyId" = ANY (
    (
      SELECT
        get_companies_with_employee_permission ('people_delete')
    )::text[]
  )
);

-- Read view: employee process assignments with the process name attached.
CREATE OR REPLACE VIEW "employeeProcesses" WITH(SECURITY_INVOKER=true) AS
  SELECT
    ep.*,
    p.name AS "processName"
  FROM "employeeProcess" ep
  INNER JOIN "process" p ON ep."processId" = p.id;

-- Recreate the processes view to also aggregate assigned employees.
DROP VIEW IF EXISTS "processes";
CREATE OR REPLACE VIEW "processes" WITH(SECURITY_INVOKER=true) AS
  SELECT
    p.*,
    wcp."workCenters",
    sp."suppliers",
    ep."employees"
  FROM "process" p
  LEFT JOIN (
    SELECT
      "processId",
      array_agg("workCenterId"::text) as "workCenters"
    FROM "workCenterProcess" wcp
    INNER JOIN "workCenter" wc ON wcp."workCenterId" = wc.id
    GROUP BY "processId"
  ) wcp ON p.id = wcp."processId"
  LEFT JOIN (
    SELECT
      "processId",
      jsonb_agg(jsonb_build_object('id', sp."id", 'name', s.name)) as "suppliers"
    FROM "supplierProcess" sp
    INNER JOIN "supplier" s ON sp."supplierId" = s.id
    GROUP BY "processId"
  ) sp ON p.id = sp."processId"
  LEFT JOIN (
    SELECT
      "processId",
      array_agg("employeeId"::text) as "employees"
    FROM "employeeProcess" ep
    INNER JOIN "employee" e ON ep."employeeId" = e.id AND ep."companyId" = e."companyId"
    GROUP BY "processId"
  ) ep ON p.id = ep."processId";
