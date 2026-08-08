-- Fix cross-tenant write hole: the INSERT/UPDATE/DELETE policies on
-- itemAttributeSetAttribute and itemAttributeSetAssignment were written with a
-- leading `"companyId" IS NULL OR ...`, which is TRUE for every caller and so
-- let any tenant mutate the shared (companyId = NULL) system rows — e.g. delete
-- the seeded Style->Garment assignment for ALL companies.
--
-- Writes to NULL-company system rows must be reserved for the system/seed path.
-- SELECT keeps `IS NULL OR ...` so every tenant can still read the system rows.
-- This mirrors the strict write policies already used on itemAttribute,
-- itemAttributeValue and itemAttributeSet in
-- 20260806132455_item_attributes_and_variants.sql.

-- itemAttributeSetAttribute -------------------------------------------------
DROP POLICY IF EXISTS "INSERT" ON "public"."itemAttributeSetAttribute";
CREATE POLICY "INSERT" ON "public"."itemAttributeSetAttribute"
FOR INSERT WITH CHECK (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

DROP POLICY IF EXISTS "UPDATE" ON "public"."itemAttributeSetAttribute";
CREATE POLICY "UPDATE" ON "public"."itemAttributeSetAttribute"
FOR UPDATE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

DROP POLICY IF EXISTS "DELETE" ON "public"."itemAttributeSetAttribute";
CREATE POLICY "DELETE" ON "public"."itemAttributeSetAttribute"
FOR DELETE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- itemAttributeSetAssignment ------------------------------------------------
DROP POLICY IF EXISTS "INSERT" ON "public"."itemAttributeSetAssignment";
CREATE POLICY "INSERT" ON "public"."itemAttributeSetAssignment"
FOR INSERT WITH CHECK (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

DROP POLICY IF EXISTS "UPDATE" ON "public"."itemAttributeSetAssignment";
CREATE POLICY "UPDATE" ON "public"."itemAttributeSetAssignment"
FOR UPDATE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

DROP POLICY IF EXISTS "DELETE" ON "public"."itemAttributeSetAssignment";
CREATE POLICY "DELETE" ON "public"."itemAttributeSetAssignment"
FOR DELETE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

NOTIFY pgrst, 'reload schema';
