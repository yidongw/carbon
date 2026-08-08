-- Auto-complete a Master Work Order's backing job once every bundle job under it
-- is Completed and the master is fully cut. Master jobs are never received to
-- inventory (stock lands on the bundles) — this only flips the master's status,
-- it posts no ledger/receipt.
--
-- Implemented as a trigger on job.status so it fires for every path a bundle job
-- can complete (production reporting, receive-to-inventory, manual complete).

CREATE OR REPLACE FUNCTION public.auto_complete_master_work_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_master_id TEXT;
  v_master_job_id TEXT;
  v_master_target NUMERIC;
  v_total INT;
  v_completed INT;
  v_cut NUMERIC;
BEGIN
  -- Only when THIS job is a bundle job — find its master.
  SELECT bwo."masterWorkOrderId" INTO v_master_id
  FROM "bundleWorkOrder" bwo
  WHERE bwo."jobId" = NEW."id" AND bwo."companyId" = NEW."companyId"
  LIMIT 1;
  IF v_master_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- All sibling bundle jobs must be Completed. The just-completed row is already
  -- persisted at AFTER UPDATE time, so it is included in the counts.
  SELECT
    count(*),
    count(*) FILTER (WHERE j."status" = 'Completed'),
    COALESCE(SUM(j."productionQuantity"), 0)
  INTO v_total, v_completed, v_cut
  FROM "bundleWorkOrder" bwo
  JOIN "job" j ON j."id" = bwo."jobId"
  WHERE bwo."masterWorkOrderId" = v_master_id
    AND bwo."companyId" = NEW."companyId";

  IF v_total = 0 OR v_completed < v_total THEN
    RETURN NEW;
  END IF;

  -- Resolve the master's backing job + target, and require it to be fully cut
  -- (bundles cover the master's production quantity) so progressive cutting can't
  -- complete the master early.
  SELECT mwo."jobId", mj."productionQuantity"
  INTO v_master_job_id, v_master_target
  FROM "masterWorkOrder" mwo
  JOIN "job" mj ON mj."id" = mwo."jobId"
  WHERE mwo."id" = v_master_id AND mwo."companyId" = NEW."companyId";

  IF v_master_job_id IS NULL THEN
    RETURN NEW;
  END IF;
  IF COALESCE(v_master_target, 0) > 0 AND v_cut < v_master_target THEN
    RETURN NEW;
  END IF;

  UPDATE "job"
  SET "status" = 'Completed',
      "completedDate" = NOW(),
      "updatedAt" = NOW()
  WHERE "id" = v_master_job_id
    AND "companyId" = NEW."companyId"
    AND "status" IS DISTINCT FROM 'Completed';

  RETURN NEW;
END;
$$;

-- Fire only on the transition into Completed. The master's own status update runs
-- this again, but a master job is not a bundle job, so it returns immediately —
-- no recursion.
DROP TRIGGER IF EXISTS "auto_complete_master_work_order_trigger" ON "job";
CREATE TRIGGER "auto_complete_master_work_order_trigger"
AFTER UPDATE OF "status" ON "job"
FOR EACH ROW
WHEN (NEW."status" = 'Completed' AND OLD."status" IS DISTINCT FROM 'Completed')
EXECUTE FUNCTION public.auto_complete_master_work_order();
