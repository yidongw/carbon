-- Backfill jobOperation.assignee from job.assignee for Bundle Work Orders.
--
-- Context: assigning the "负责人" on a Bundle Work Order row only wrote
-- job.assignee, while the MES report (get_assigned_operations_for_report)
-- filters on the operation-level jobOperation.assignee. The job -> operation
-- mirror did not exist, so bundle-level assignee changes made before that fix
-- never surfaced in the report. This one-time correction reconciles existing
-- data with the new behavior.
--
-- Scope: only bundle-backed jobs whose job has an assignee that differs from
-- the operation's assignee. Idempotent (re-running is a no-op once aligned)
-- and safe on databases without such data.

UPDATE "jobOperation" jo
SET "assignee" = j."assignee",
    "assignedAt" = COALESCE(j."assignedAt", jo."assignedAt")
FROM "job" j
JOIN "bundleWorkOrder" bwo
  ON bwo."jobId" = j."id"
 AND bwo."companyId" = j."companyId"
WHERE jo."jobId" = j."id"
  AND jo."companyId" = j."companyId"
  AND j."assignee" IS NOT NULL
  AND jo."assignee" IS DISTINCT FROM j."assignee";
