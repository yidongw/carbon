-- Production quantity reports: parent report with append-only productionQuantity lines.
-- Active lines (invalidatedAt IS NULL) drive rollups; invalidated lines are history.

CREATE TABLE "productionQuantityReport" (
  "id" TEXT NOT NULL DEFAULT id('pqr'),
  "companyId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "jobOperationId" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "originalQuantity" NUMERIC NOT NULL DEFAULT 0,
  "originalConfiguration" JSONB,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "productionQuantityReport_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "productionQuantityReport_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantityReport_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantityReport_jobOperationId_fkey"
    FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "productionQuantityReport_employeeId_fkey"
    FOREIGN KEY ("employeeId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "productionQuantityReport_createdBy_fkey"
    FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "productionQuantityReport_updatedBy_fkey"
    FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "productionQuantityReport_jobOperationId_idx"
  ON "productionQuantityReport" ("jobOperationId");
CREATE INDEX "productionQuantityReport_jobId_idx"
  ON "productionQuantityReport" ("jobId");
CREATE INDEX "productionQuantityReport_companyId_idx"
  ON "productionQuantityReport" ("companyId");

ALTER TABLE "productionQuantityReport" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "productionQuantityReport"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "productionQuantityReport"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "productionQuantityReport"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

ALTER PUBLICATION supabase_realtime ADD TABLE "productionQuantityReport";

-- Extend productionQuantity with report linkage and invalidation
ALTER TABLE "productionQuantity"
  ADD COLUMN IF NOT EXISTS "reportId" TEXT,
  ADD COLUMN IF NOT EXISTS "invalidatedAt" TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS "invalidatedBy" TEXT;

ALTER TABLE "productionQuantity"
  ADD CONSTRAINT "productionQuantity_reportId_fkey"
    FOREIGN KEY ("reportId") REFERENCES "productionQuantityReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "productionQuantity"
  ADD CONSTRAINT "productionQuantity_invalidatedBy_fkey"
    FOREIGN KEY ("invalidatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "productionQuantity_reportId_idx"
  ON "productionQuantity" ("reportId");
CREATE INDEX IF NOT EXISTS "productionQuantity_reportId_invalidatedAt_idx"
  ON "productionQuantity" ("reportId", "invalidatedAt");
CREATE INDEX IF NOT EXISTS "productionQuantity_jobOperationId_invalidatedAt_idx"
  ON "productionQuantity" ("jobOperationId", "invalidatedAt");

-- Backfill: one synthetic report per existing production quantity row
DO $$
DECLARE
  pq RECORD;
  new_report_id TEXT;
BEGIN
  FOR pq IN
    SELECT
      pq2.id,
      pq2."companyId",
      jo."jobId",
      pq2."jobOperationId",
      pq2."employeeId",
      pq2."createdAt",
      pq2.quantity,
      pq2.configuration
    FROM "productionQuantity" pq2
    INNER JOIN "jobOperation" jo ON jo.id = pq2."jobOperationId"
    WHERE pq2."reportId" IS NULL
  LOOP
    new_report_id := id('pqr');

    INSERT INTO "productionQuantityReport" (
      "id",
      "companyId",
      "jobId",
      "jobOperationId",
      "employeeId",
      "originalQuantity",
      "originalConfiguration",
      "createdBy",
      "createdAt"
    ) VALUES (
      new_report_id,
      pq."companyId",
      pq."jobId",
      pq."jobOperationId",
      pq."employeeId",
      pq.quantity,
      pq.configuration,
      pq."createdBy",
      pq."createdAt"
    );

    UPDATE "productionQuantity"
    SET "reportId" = new_report_id
    WHERE id = pq.id;
  END LOOP;
END;
$$;

ALTER TABLE "productionQuantity"
  ALTER COLUMN "reportId" SET NOT NULL;

-- Disallow hard deletes on production quantities (use invalidation instead)
DROP POLICY IF EXISTS "DELETE" ON "public"."productionQuantity";

-- Rollup interceptor: only active lines (invalidatedAt IS NULL) contribute
CREATE OR REPLACE FUNCTION sync_update_job_operation_quantities(
  p_table TEXT,
  p_operation TEXT,
  p_new JSONB,
  p_old JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_operation_id TEXT;
  v_job_id TEXT;
  v_is_last_top_level_operation BOOLEAN := FALSE;
  v_old_active BOOLEAN;
  v_new_active BOOLEAN;
BEGIN
  IF p_operation = 'INSERT' THEN
    v_job_operation_id := p_new->>'jobOperationId';

    IF p_new->>'invalidatedAt' IS NULL THEN
      UPDATE "jobOperation"
      SET
        "quantityComplete" = "quantityComplete" +
          CASE WHEN (p_new->>'type') = 'Production' THEN (p_new->>'quantity')::numeric ELSE 0 END,
        "quantityReworked" = "quantityReworked" +
          CASE WHEN (p_new->>'type') = 'Rework' THEN (p_new->>'quantity')::numeric ELSE 0 END,
        "quantityScrapped" = "quantityScrapped" +
          CASE WHEN (p_new->>'type') = 'Scrap' THEN (p_new->>'quantity')::numeric ELSE 0 END
      WHERE id = v_job_operation_id;
    END IF;

  ELSIF p_operation = 'UPDATE' THEN
    v_job_operation_id := COALESCE(p_new->>'jobOperationId', p_old->>'jobOperationId');
    v_old_active := p_old->>'invalidatedAt' IS NULL;
    v_new_active := p_new->>'invalidatedAt' IS NULL;

    IF v_old_active THEN
      UPDATE "jobOperation"
      SET
        "quantityComplete" = "quantityComplete" -
          CASE WHEN (p_old->>'type') = 'Production' THEN (p_old->>'quantity')::numeric ELSE 0 END,
        "quantityReworked" = "quantityReworked" -
          CASE WHEN (p_old->>'type') = 'Rework' THEN (p_old->>'quantity')::numeric ELSE 0 END,
        "quantityScrapped" = "quantityScrapped" -
          CASE WHEN (p_old->>'type') = 'Scrap' THEN (p_old->>'quantity')::numeric ELSE 0 END
      WHERE id = v_job_operation_id;
    END IF;

    IF v_new_active THEN
      UPDATE "jobOperation"
      SET
        "quantityComplete" = "quantityComplete" +
          CASE WHEN (p_new->>'type') = 'Production' THEN (p_new->>'quantity')::numeric ELSE 0 END,
        "quantityReworked" = "quantityReworked" +
          CASE WHEN (p_new->>'type') = 'Rework' THEN (p_new->>'quantity')::numeric ELSE 0 END,
        "quantityScrapped" = "quantityScrapped" +
          CASE WHEN (p_new->>'type') = 'Scrap' THEN (p_new->>'quantity')::numeric ELSE 0 END
      WHERE id = v_job_operation_id;
    END IF;

  ELSIF p_operation = 'DELETE' THEN
    v_job_operation_id := p_old->>'jobOperationId';

    IF p_old->>'invalidatedAt' IS NULL THEN
      UPDATE "jobOperation"
      SET
        "quantityComplete" = "quantityComplete" -
          CASE WHEN (p_old->>'type') = 'Production' THEN (p_old->>'quantity')::numeric ELSE 0 END,
        "quantityReworked" = "quantityReworked" -
          CASE WHEN (p_old->>'type') = 'Rework' THEN (p_old->>'quantity')::numeric ELSE 0 END,
        "quantityScrapped" = "quantityScrapped" -
          CASE WHEN (p_old->>'type') = 'Scrap' THEN (p_old->>'quantity')::numeric ELSE 0 END
      WHERE id = v_job_operation_id;
    END IF;
  END IF;

  SELECT jo."jobId" INTO v_job_id
  FROM "jobOperation" jo
  WHERE jo.id = v_job_operation_id;

  SELECT EXISTS (
    SELECT 1
    FROM "jobOperation" jo
    INNER JOIN "jobMakeMethod" jmm ON jmm.id = jo."jobMakeMethodId"
    WHERE jo.id = v_job_operation_id
      AND jmm."parentMaterialId" IS NULL
      AND NOT EXISTS (
        SELECT 1
        FROM "jobOperationDependency" dep
        INNER JOIN "jobOperation" child_jo ON child_jo.id = dep."operationId"
        INNER JOIN "jobMakeMethod" child_jmm ON child_jmm.id = child_jo."jobMakeMethodId"
        WHERE dep."dependsOnId" = jo.id
          AND child_jmm."parentMaterialId" IS NULL
      )
  ) INTO v_is_last_top_level_operation;

  IF v_job_id IS NOT NULL AND v_is_last_top_level_operation THEN
    UPDATE "job"
    SET "quantityComplete" = (
      SELECT COALESCE(jo."quantityComplete", 0)
      FROM "jobOperation" jo
      WHERE jo.id = v_job_operation_id
    )
    WHERE id = v_job_id
      AND status NOT IN ('Completed', 'Cancelled');
  END IF;
END;
$$;
