ALTER TABLE "jobOperation"
ADD COLUMN IF NOT EXISTS "assignedAt" TIMESTAMP WITH TIME ZONE;

UPDATE "jobOperation"
SET "assignedAt" = COALESCE("updatedAt", "createdAt")
WHERE "assignee" IS NOT NULL
  AND "assignedAt" IS NULL;

CREATE TABLE "masterWorkOrder" (
  "id" TEXT NOT NULL DEFAULT id('mwo'),
  "jobId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "colorSize" JSONB,

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

CREATE TABLE "bundleWorkOrder" (
  "id" TEXT NOT NULL DEFAULT id('bwo'),
  "jobId" TEXT NOT NULL,
  "masterWorkOrderId" TEXT NOT NULL,
  "bundleId" TEXT,
  "companyId" TEXT NOT NULL,
  "bundleSequence" INTEGER NOT NULL,
  "bundleNumber" TEXT NOT NULL,
  "colorCode" TEXT NOT NULL,
  "sizeCode" TEXT,

  CONSTRAINT "bundleWorkOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bundleWorkOrder_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleWorkOrder_masterWorkOrderId_fkey"
    FOREIGN KEY ("masterWorkOrderId") REFERENCES "masterWorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleWorkOrder_bundleId_fkey"
    FOREIGN KEY ("bundleId") REFERENCES "bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "bundleWorkOrder_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bundleWorkOrder_jobId_key" UNIQUE ("jobId"),
  CONSTRAINT "bundleWorkOrder_bundleId_key" UNIQUE ("bundleId"),
  CONSTRAINT "bundleWorkOrder_bundleNumber_companyId_key"
    UNIQUE ("bundleNumber", "companyId")
);

CREATE INDEX "bundleWorkOrder_companyId_idx" ON "bundleWorkOrder" ("companyId");
CREATE INDEX "bundleWorkOrder_jobId_idx" ON "bundleWorkOrder" ("jobId");
CREATE INDEX "bundleWorkOrder_masterWorkOrderId_idx" ON "bundleWorkOrder" ("masterWorkOrderId");
CREATE INDEX "bundleWorkOrder_color_size_idx" ON "bundleWorkOrder" ("colorCode", "sizeCode", "companyId");

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

INSERT INTO "masterWorkOrder" ("jobId", "companyId")
SELECT j.id, j."companyId"
FROM "job" j
JOIN "item" i
  ON i.id = j."itemId"
 AND i."companyId" = j."companyId"
LEFT JOIN "masterWorkOrder" mwo
  ON mwo."jobId" = j.id
WHERE i.type = 'Style'
  AND j."parentJobId" IS NULL
  AND mwo.id IS NULL;

INSERT INTO "bundleWorkOrder" (
  "jobId",
  "masterWorkOrderId",
  "bundleId",
  "companyId",
  "bundleSequence",
  "bundleNumber",
  "colorCode",
  "sizeCode"
)
SELECT
  b."jobId",
  mwo.id,
  b.id,
  b."companyId",
  b.sequence,
  b."bundleNumber",
  b."colorCode",
  b."sizeCode"
FROM "bundle" b
JOIN "splitBatch" sb
  ON sb.id = b."splitBatchId"
 AND sb."companyId" = b."companyId"
JOIN "masterWorkOrder" mwo
  ON mwo."jobId" = sb."jobId"
 AND mwo."companyId" = b."companyId"
LEFT JOIN "bundleWorkOrder" bwo
  ON bwo."jobId" = b."jobId"
WHERE b."jobId" IS NOT NULL
  AND bwo.id IS NULL;
