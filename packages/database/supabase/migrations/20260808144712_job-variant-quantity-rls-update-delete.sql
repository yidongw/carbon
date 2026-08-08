-- Align jobVariantQuantity DELETE with replace/adjust (production_update).
-- Previously DELETE required production_delete, so users who can adjust Style
-- qty (production_update) failed when replace deleted existing rows.
DROP POLICY IF EXISTS "DELETE" ON "public"."jobVariantQuantity";
CREATE POLICY "DELETE" ON "public"."jobVariantQuantity"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

-- Ensure PostgREST picks up masterWorkOrderSplitRow column drops from
-- 20260808143927_drop_master_split_row_color_size (that migration lacked NOTIFY).
NOTIFY pgrst, 'reload schema';
