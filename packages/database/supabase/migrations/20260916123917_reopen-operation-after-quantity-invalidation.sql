-- A voided production report can drop an already-completed operation below its
-- target. Reopen it so it remains available for reporting.

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

  -- A report invalidation can leave a previously auto-completed operation with
  -- remaining work. Reopen it before considering the normal completion rule.
  UPDATE "jobOperation" jo
  SET "status" = 'In Progress'
  WHERE jo.id = v_job_operation_id
    AND jo."status" = 'Done'
    AND jo."quantityComplete" > 0
    AND jo."quantityComplete" + COALESCE(jo."quantityScrapped", 0)
      < COALESCE(NULLIF(jo."targetQuantity", 0), NULLIF(jo."operationQuantity", 0));

  -- Advance the operation's status from the produced quantity just synced above.
  UPDATE "jobOperation" jo
  SET "status" = 'Done'
  WHERE jo.id = v_job_operation_id
    AND jo."status" NOT IN ('Done', 'Canceled')
    AND jo."quantityComplete" > 0
    AND COALESCE(NULLIF(jo."targetQuantity", 0), NULLIF(jo."operationQuantity", 0)) IS NOT NULL
    AND jo."quantityComplete" >= COALESCE(NULLIF(jo."targetQuantity", 0), NULLIF(jo."operationQuantity", 0));

  -- Otherwise any reported production starts a not-yet-started operation.
  UPDATE "jobOperation" jo
  SET "status" = 'In Progress'
  WHERE jo.id = v_job_operation_id
    AND jo."status" IN ('Todo', 'Ready', 'Waiting')
    AND jo."quantityComplete" > 0;

  -- Sync job.quantityComplete only when this operation is the last top-level operation.
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

-- Repair only operations that are demonstrably stale because a report was
-- invalidated; deliberately completed operations without an invalidation stay Done.
UPDATE "jobOperation" jo
SET "status" = 'In Progress'
WHERE jo."status" = 'Done'
  AND jo."quantityComplete" > 0
  AND jo."quantityComplete" + COALESCE(jo."quantityScrapped", 0)
    < COALESCE(NULLIF(jo."targetQuantity", 0), NULLIF(jo."operationQuantity", 0))
  AND EXISTS (
    SELECT 1
    FROM "productionQuantity" pq
    WHERE pq."jobOperationId" = jo.id
      AND pq."invalidatedAt" IS NOT NULL
  );
