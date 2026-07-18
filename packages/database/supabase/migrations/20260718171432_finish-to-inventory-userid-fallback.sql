-- Fix: completing a job to inventory fails when jobOperation.updatedBy is
-- null (a never-touched / Todo op reaches its target and finishes). The
-- finish interceptor passed jobOperation.updatedBy straight through as the
-- itemLedger.createdBy (NOT NULL), so the whole productionQuantity insert
-- rolled back. Fall back to jobOperation.createdBy (always set) so any
-- completion path has a valid user.

CREATE OR REPLACE FUNCTION public.sync_finish_job_operation(p_table text, p_operation text, p_new jsonb, p_old jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_job_location_id TEXT;
  v_job_storage_unit_id TEXT;
  v_job_quantity NUMERIC;
  v_sales_order_id TEXT;
  v_quantity_complete NUMERIC;
  v_job_status TEXT;
BEGIN
  IF p_operation != 'UPDATE' THEN RETURN; END IF;
  IF (p_new->>'status') != 'Done' OR (p_old->>'status') = 'Done' THEN RETURN; END IF;

  UPDATE "productionEvent"
  SET "endTime" = NOW()
  WHERE "jobOperationId" = p_new->>'id'
    AND "endTime" IS NULL;

  UPDATE "jobOperation" op
  SET status = 'Ready'
  WHERE EXISTS (
    SELECT 1
    FROM "jobOperationDependency" dep
    WHERE dep."operationId" = op.id
      AND dep."dependsOnId" = p_new->>'id'
      AND op.status = 'Waiting'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM "jobOperationDependency" dep2
    JOIN "jobOperation" jo2 ON jo2.id = dep2."dependsOnId"
    WHERE dep2."operationId" = op.id
      AND jo2.status != 'Done'
      AND jo2.id != p_new->>'id'
  );

  SELECT status INTO v_job_status FROM "job" WHERE id = p_new->>'jobId';
  IF v_job_status NOT IN ('Ready', 'In Progress', 'Paused') THEN
    RETURN;
  END IF;

  IF is_last_job_operation(p_new->>'id') THEN
    SELECT "locationId", "storageUnitId", quantity, "salesOrderId"
    INTO v_job_location_id, v_job_storage_unit_id, v_job_quantity, v_sales_order_id
    FROM "job"
    WHERE id = p_new->>'jobId';

    v_quantity_complete := (
      SELECT COALESCE(SUM(terminal_jo."quantityComplete"), 0)
      FROM "jobOperation" terminal_jo
      INNER JOIN "jobMakeMethod" terminal_jmm ON terminal_jmm.id = terminal_jo."jobMakeMethodId"
      WHERE terminal_jo."jobId" = p_new->>'jobId'
        AND terminal_jmm."parentMaterialId" IS NULL
        AND NOT EXISTS (
          SELECT 1
          FROM "jobOperationDependency" dep
          INNER JOIN "jobOperation" child_jo ON child_jo.id = dep."operationId"
          INNER JOIN "jobMakeMethod" child_jmm ON child_jmm.id = child_jo."jobMakeMethodId"
          WHERE dep."dependsOnId" = terminal_jo.id
            AND child_jmm."parentMaterialId" IS NULL
        )
    );

    IF COALESCE(v_quantity_complete, 0) = 0 THEN
      v_quantity_complete := v_job_quantity;
    END IF;

    PERFORM complete_job_to_inventory(
      p_job_id := p_new->>'jobId',
      p_quantity_complete := v_quantity_complete,
      p_storage_unit_id := v_job_storage_unit_id,
      p_location_id := v_job_location_id,
      p_company_id := p_new->>'companyId',
      p_user_id := COALESCE(NULLIF(p_new->>'updatedBy', ''), p_new->>'createdBy')
    );
  END IF;
END;
$function$


