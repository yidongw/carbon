-- Style variants-quantity no longer keeps adjustment history. This table was
-- only written from the job variants-quantity path.
DROP TABLE IF EXISTS "jobConfigurationHistory";

NOTIFY pgrst, 'reload schema';
