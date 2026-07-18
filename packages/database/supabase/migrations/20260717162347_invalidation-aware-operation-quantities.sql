-- Fix: jobOperation.quantity{Complete,Reworked,Scrapped} drift high after a
-- production report is cancelled.
--
-- Bug: sync_update_job_operation_quantities (the live event-interceptor wired to
-- productionQuantity via trg_event_sync_productionQuantity) maintains the stored
-- quantity columns purely from productionQuantity.type/quantity. Cancelling a
-- report is a soft delete -- it sets "invalidatedAt" via an UPDATE without
-- changing type or quantity -- so the interceptor computes
-- (- OLD.quantity + NEW.quantity) = 0 and never decrements the column. The
-- stored counts then over-count every cancelled row, which also lets an
-- operation auto-complete off quantity that was later voided. Every read that
-- sums live (invalidatedAt IS NULL) rows shows the true, lower number.
--
-- Fix: make each contribution invalidation-aware -- an invalidated row
-- contributes 0. Keeps existing behaviour for live inserts, quantity edits and
-- type flips, and additionally decrements when a row is invalidated (and re-adds
-- on the rare un-invalidate). The auto-done / job-rollup logic below is dev's,
-- unchanged.

CREATE OR REPLACE FUNCTION public.sync_update_job_operation_quantities(p_table text, p_operation text, p_new jsonb, p_old jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_job_operation_id TEXT;
  v_job_id TEXT;
  v_is_last_top_level_operation BOOLEAN := FALSE;
BEGIN
  IF p_operation = 'INSERT' THEN
    v_job_operation_id := p_new->>'jobOperationId';

    UPDATE "jobOperation"
    SET
      "quantityComplete" = "quantityComplete" +
        CASE WHEN (p_new->>'type') = 'Production' AND (p_new->>'invalidatedAt') IS NULL THEN (p_new->>'quantity')::numeric ELSE 0 END,
      "quantityReworked" = "quantityReworked" +
        CASE WHEN (p_new->>'type') = 'Rework' AND (p_new->>'invalidatedAt') IS NULL THEN (p_new->>'quantity')::numeric ELSE 0 END,
      "quantityScrapped" = "quantityScrapped" +
        CASE WHEN (p_new->>'type') = 'Scrap' AND (p_new->>'invalidatedAt') IS NULL THEN (p_new->>'quantity')::numeric ELSE 0 END
    WHERE id = v_job_operation_id;

  ELSIF p_operation = 'UPDATE' THEN
    v_job_operation_id := p_new->>'jobOperationId';

    UPDATE "jobOperation"
    SET
      "quantityComplete" = "quantityComplete"
        - CASE WHEN (p_old->>'type') = 'Production' AND (p_old->>'invalidatedAt') IS NULL THEN (p_old->>'quantity')::numeric ELSE 0 END
        + CASE WHEN (p_new->>'type') = 'Production' AND (p_new->>'invalidatedAt') IS NULL THEN (p_new->>'quantity')::numeric ELSE 0 END,
      "quantityReworked" = "quantityReworked"
        - CASE WHEN (p_old->>'type') = 'Rework' AND (p_old->>'invalidatedAt') IS NULL THEN (p_old->>'quantity')::numeric ELSE 0 END
        + CASE WHEN (p_new->>'type') = 'Rework' AND (p_new->>'invalidatedAt') IS NULL THEN (p_new->>'quantity')::numeric ELSE 0 END,
      "quantityScrapped" = "quantityScrapped"
        - CASE WHEN (p_old->>'type') = 'Scrap' AND (p_old->>'invalidatedAt') IS NULL THEN (p_old->>'quantity')::numeric ELSE 0 END
        + CASE WHEN (p_new->>'type') = 'Scrap' AND (p_new->>'invalidatedAt') IS NULL THEN (p_new->>'quantity')::numeric ELSE 0 END
    WHERE id = v_job_operation_id;

  ELSIF p_operation = 'DELETE' THEN
    v_job_operation_id := p_old->>'jobOperationId';

    UPDATE "jobOperation"
    SET
      "quantityComplete" = "quantityComplete" -
        CASE WHEN (p_old->>'type') = 'Production' AND (p_old->>'invalidatedAt') IS NULL THEN (p_old->>'quantity')::numeric ELSE 0 END,
      "quantityReworked" = "quantityReworked" -
        CASE WHEN (p_old->>'type') = 'Rework' AND (p_old->>'invalidatedAt') IS NULL THEN (p_old->>'quantity')::numeric ELSE 0 END,
      "quantityScrapped" = "quantityScrapped" -
        CASE WHEN (p_old->>'type') = 'Scrap' AND (p_old->>'invalidatedAt') IS NULL THEN (p_old->>'quantity')::numeric ELSE 0 END
    WHERE id = v_job_operation_id;
  END IF;

  -- Advance the operation's status from the produced quantity just synced above.
  -- (a) Reaching a positive target completes the operation.
  UPDATE "jobOperation" jo
  SET "status" = 'Done'
  WHERE jo.id = v_job_operation_id
    AND jo."status" NOT IN ('Done', 'Canceled')
    AND jo."quantityComplete" > 0
    AND COALESCE(NULLIF(jo."targetQuantity", 0), NULLIF(jo."operationQuantity", 0)) IS NOT NULL
    AND jo."quantityComplete" >= COALESCE(NULLIF(jo."targetQuantity", 0), NULLIF(jo."operationQuantity", 0));

  -- (b) Otherwise any reported production starts a not-yet-started operation.
  UPDATE "jobOperation" jo
  SET "status" = 'In Progress'
  WHERE jo.id = v_job_operation_id
    AND jo."status" IN ('Todo', 'Ready', 'Waiting')
    AND jo."quantityComplete" > 0;

  -- Sync job.quantityComplete only when this operation is the last top-level operation.
  -- "Top-level" means operation belongs to the root make method (parentMaterialId IS NULL).
  -- "Last" means no other top-level operation depends on it.
  -- Skip if job is already Completed or Cancelled (sync_finish_job_operation owns that).
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
$function$;

-- One-time backfill: recompute the stored columns from live rows for every
-- operation that has ever had a productionQuantity row (covers operations whose
-- rows were all cancelled -> they collapse to 0).
UPDATE "jobOperation" jo
SET
  "quantityComplete" = COALESCE(agg.completed, 0),
  "quantityReworked" = COALESCE(agg.reworked, 0),
  "quantityScrapped" = COALESCE(agg.scrapped, 0)
FROM (SELECT DISTINCT "jobOperationId" FROM "productionQuantity") ops
LEFT JOIN LATERAL (
  SELECT
    SUM(pq.quantity) FILTER (WHERE pq."type" = 'Production') AS completed,
    SUM(pq.quantity) FILTER (WHERE pq."type" = 'Rework')     AS reworked,
    SUM(pq.quantity) FILTER (WHERE pq."type" = 'Scrap')      AS scrapped
  FROM "productionQuantity" pq
  WHERE pq."jobOperationId" = ops."jobOperationId"
    AND pq."invalidatedAt" IS NULL
) agg ON true
WHERE jo.id = ops."jobOperationId"
  AND (
    jo."quantityComplete" IS DISTINCT FROM COALESCE(agg.completed, 0)
    OR jo."quantityReworked" IS DISTINCT FROM COALESCE(agg.reworked, 0)
    OR jo."quantityScrapped" IS DISTINCT FROM COALESCE(agg.scrapped, 0)
  );
