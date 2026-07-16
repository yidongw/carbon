-- Track when a job operation's assignee was set, so work order process tables
-- can show "Assigned At" per process step.
ALTER TABLE "jobOperation" ADD COLUMN IF NOT EXISTS "assignedAt" TIMESTAMPTZ;

NOTIFY pgrst, 'reload schema';
