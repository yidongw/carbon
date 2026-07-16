-- Drive a job operation's status from its reported production quantity.
--
-- Apparel bundles (and the master cutting op) report progress by quantity, not
-- by time-clock production events, so their process status never moved off
-- 'Todo'. Extend the function that already maintains jobOperation.quantityComplete
-- on every productionQuantity INSERT/UPDATE/DELETE so it also advances status:
--   * any production reported  -> promote a not-yet-started op to 'In Progress'
--   * produced reaches target  -> mark the op 'Done'
-- 'Done' is intentionally reached from any active status (including an explicit
-- 'Paused') so completing the last units finishes the op; a partially-reported
-- op is only promoted from the not-started states (Todo/Ready/Waiting) so it
-- won't un-pause an explicitly paused op. 'Canceled' is never touched. Setting
-- 'Done' lets sync_finish_job_operation close open events and unlock dependents.
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
BEGIN
  IF p_operation = 'INSERT' THEN
    v_job_operation_id := p_new->>'jobOperationId';

    UPDATE "jobOperation"
    SET
      "quantityComplete" = "quantityComplete" +
        CASE WHEN (p_new->>'type') = 'Production' THEN (p_new->>'quantity')::numeric ELSE 0 END,
      "quantityReworked" = "quantityReworked" +
        CASE WHEN (p_new->>'type') = 'Rework' THEN (p_new->>'quantity')::numeric ELSE 0 END,
      "quantityScrapped" = "quantityScrapped" +
        CASE WHEN (p_new->>'type') = 'Scrap' THEN (p_new->>'quantity')::numeric ELSE 0 END
    WHERE id = v_job_operation_id;

  ELSIF p_operation = 'UPDATE' THEN
    v_job_operation_id := p_new->>'jobOperationId';

    UPDATE "jobOperation"
    SET
      "quantityComplete" = "quantityComplete"
        - CASE WHEN (p_old->>'type') = 'Production' THEN (p_old->>'quantity')::numeric ELSE 0 END
        + CASE WHEN (p_new->>'type') = 'Production' THEN (p_new->>'quantity')::numeric ELSE 0 END,
      "quantityReworked" = "quantityReworked"
        - CASE WHEN (p_old->>'type') = 'Rework' THEN (p_old->>'quantity')::numeric ELSE 0 END
        + CASE WHEN (p_new->>'type') = 'Rework' THEN (p_new->>'quantity')::numeric ELSE 0 END,
      "quantityScrapped" = "quantityScrapped"
        - CASE WHEN (p_old->>'type') = 'Scrap' THEN (p_old->>'quantity')::numeric ELSE 0 END
        + CASE WHEN (p_new->>'type') = 'Scrap' THEN (p_new->>'quantity')::numeric ELSE 0 END
    WHERE id = v_job_operation_id;

  ELSIF p_operation = 'DELETE' THEN
    v_job_operation_id := p_old->>'jobOperationId';

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
$$;
