-- A job must have exactly one root make method (parentMaterialId IS NULL).
-- The insert_job_make_method trigger creates one per job, but historically some
-- flows inserted a second root, producing duplicate rows in the "jobs" view and
-- breaking getJob().single() (it redirects when more than one row is returned).
--
-- 1) Remove duplicate root make methods that are EMPTY (no operations/materials),
--    keeping one root per job (prefer a populated root, then the oldest, then the
--    smallest id). Roots that still have children are never auto-deleted, so if a
--    job somehow has two populated roots the unique index below will fail loudly
--    instead of silently discarding data.
WITH ranked AS (
  SELECT
    jmm.id,
    row_number() OVER (
      PARTITION BY jmm."jobId"
      ORDER BY
        CASE
          WHEN EXISTS (SELECT 1 FROM "jobOperation" o WHERE o."jobMakeMethodId" = jmm.id)
            OR EXISTS (SELECT 1 FROM "jobMaterial" m WHERE m."jobMakeMethodId" = jmm.id)
          THEN 0 ELSE 1
        END,
        jmm."createdAt" ASC,
        jmm.id ASC
    ) AS rn,
    (
      EXISTS (SELECT 1 FROM "jobOperation" o WHERE o."jobMakeMethodId" = jmm.id)
      OR EXISTS (SELECT 1 FROM "jobMaterial" m WHERE m."jobMakeMethodId" = jmm.id)
    ) AS has_children
  FROM "jobMakeMethod" jmm
  WHERE jmm."parentMaterialId" IS NULL
)
DELETE FROM "jobMakeMethod"
WHERE id IN (
  SELECT id FROM ranked WHERE rn > 1 AND has_children = false
);

-- 2) Enforce one root make method per job going forward.
CREATE UNIQUE INDEX IF NOT EXISTS "jobMakeMethod_unique_root_per_job"
  ON "jobMakeMethod" ("jobId")
  WHERE "parentMaterialId" IS NULL;
