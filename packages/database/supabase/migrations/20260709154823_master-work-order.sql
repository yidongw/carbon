-- Master Work Order: a first-class apparel production object, backed 1:1 by a
-- Style-item job for execution. The job stays the internal execution substrate;
-- the master work order is the user-facing object with its own UI.

CREATE TABLE "masterWorkOrder" (
  "id" TEXT NOT NULL DEFAULT id('mwo'),
  "jobId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "colorSize" JSONB,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "customFields" JSONB,
  "tags" TEXT[],

  CONSTRAINT "masterWorkOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "masterWorkOrder_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "masterWorkOrder_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "masterWorkOrder_jobId_key" UNIQUE ("jobId")
);

CREATE INDEX "masterWorkOrder_companyId_idx" ON "masterWorkOrder" ("companyId");
CREATE INDEX "masterWorkOrder_jobId_idx" ON "masterWorkOrder" ("jobId");

ALTER TABLE "masterWorkOrder" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."masterWorkOrder"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."masterWorkOrder"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."masterWorkOrder"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."masterWorkOrder"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

-- List view: master work orders joined to their backing job + style item, so the
-- list UI reuses the same view + generic-query-filter pattern as jobs.
CREATE VIEW "masterWorkOrders" WITH (SECURITY_INVOKER=true) AS
SELECT
  mwo."id",
  mwo."jobId",
  mwo."companyId",
  mwo."colorSize",
  mwo."tags",
  mwo."createdAt",
  mwo."createdBy",
  mwo."updatedAt",
  mwo."updatedBy",
  j."jobId" AS "jobReadableId",
  j."status",
  j."quantity",
  j."dueDate",
  j."locationId",
  j."itemId",
  i."readableIdWithRevision",
  i."name" AS "itemName"
FROM "masterWorkOrder" mwo
JOIN "job" j ON j."id" = mwo."jobId"
LEFT JOIN "item" i
  ON i."id" = j."itemId" AND i."companyId" = j."companyId";
