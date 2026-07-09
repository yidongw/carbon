-- Ensure PostgREST reloads its schema cache after the master-work-order
-- migration. The hosted preview had the masterWorkOrder table + masterWorkOrders
-- view in Postgres, but PostgREST was still serving a stale schema cache, which
-- 500'd the /x/production/master-work-orders list. (Same fix as the style
-- foundation reload.)
NOTIFY pgrst, 'reload schema';
