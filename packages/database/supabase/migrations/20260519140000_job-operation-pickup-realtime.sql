ALTER TABLE "jobOperationPickup" REPLICA IDENTITY FULL;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE "jobOperationPickup";
EXCEPTION WHEN duplicate_object THEN
  NULL;
END;
$$;
