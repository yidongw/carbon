-- The scan-based bundle in/out ledger belongs to the Inventory module, not
-- Production, so its write policies should key off inventory_* permissions (the
-- original table shipped with production_* by mistake). SELECT stays employee-role.

DROP POLICY IF EXISTS "INSERT" ON "public"."bundleInventoryMovement";
DROP POLICY IF EXISTS "UPDATE" ON "public"."bundleInventoryMovement";
DROP POLICY IF EXISTS "DELETE" ON "public"."bundleInventoryMovement";

CREATE POLICY "INSERT" ON "public"."bundleInventoryMovement"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('inventory_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."bundleInventoryMovement"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('inventory_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."bundleInventoryMovement"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('inventory_delete'))::text[]
  )
);

NOTIFY pgrst, 'reload schema';
