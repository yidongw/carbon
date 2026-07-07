-- Ensure PostgREST reloads its schema cache after the style/bundle foundation
-- migration. The hosted preview had the tables in Postgres, but PostgREST was
-- still serving a stale schema cache, which broke all new style endpoints.
NOTIFY pgrst, 'reload schema';
