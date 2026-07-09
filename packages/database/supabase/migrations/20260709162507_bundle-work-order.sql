-- Bundle Work Order: a child of a Master Work Order, one per color/size bundle,
-- backed 1:1 by a child job (parentJobId = the master's job) for downstream
-- process execution.

CREATE TABLE "bundleWorkOrder" (
  "id" TEXT NOT NULL DEFAULT id('bwo'),
  "masterWorkOrderId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "bundleNumber" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL DEFAULT 1,
  "colorCode" TEXT,
  "sizeCode" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "customFields" JSONB,
  "tags" TEXT[],

  CONSTRAINT "bundleWorkOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bundleWorkOrder_masterWorkOrderId_fkey"
    FOREIGN KEY ("masterWorkOrderId") REFERENCES "masterWorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleWorkOrder_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleWorkOrder_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleWorkOrder_jobId_key" UNIQUE ("jobId")
);

CREATE INDEX "bundleWorkOrder_companyId_idx" ON "bundleWorkOrder" ("companyId");
CREATE INDEX "bundleWorkOrder_masterWorkOrderId_idx" ON "bundleWorkOrder" ("masterWorkOrderId");
CREATE INDEX "bundleWorkOrder_jobId_idx" ON "bundleWorkOrder" ("jobId");

ALTER TABLE "bundleWorkOrder" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."bundleWorkOrder"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."bundleWorkOrder"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."bundleWorkOrder"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."bundleWorkOrder"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

-- List view: bundle work orders joined to their backing job + style item.
CREATE VIEW "bundleWorkOrders" WITH (SECURITY_INVOKER=true) AS
SELECT
  bwo."id",
  bwo."masterWorkOrderId",
  bwo."jobId",
  bwo."companyId",
  bwo."bundleNumber",
  bwo."sequence",
  bwo."colorCode",
  bwo."sizeCode",
  bwo."createdAt",
  bwo."createdBy",
  bwo."updatedAt",
  bwo."updatedBy",
  bwo."tags",
  j."jobId" AS "jobReadableId",
  j."status",
  j."quantity",
  j."dueDate",
  j."itemId",
  i."readableIdWithRevision",
  i."name" AS "itemName"
FROM "bundleWorkOrder" bwo
JOIN "job" j ON j."id" = bwo."jobId"
LEFT JOIN "item" i
  ON i."id" = j."itemId" AND i."companyId" = j."companyId";

-- Reload PostgREST so the new table + view are exposed immediately.
NOTIFY pgrst, 'reload schema';
