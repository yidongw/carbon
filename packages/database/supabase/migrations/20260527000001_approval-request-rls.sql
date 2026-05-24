-- approvalRequest had RLS enabled without policies (all rows blocked for authenticated users).

CREATE POLICY "SELECT" ON "approvalRequest"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('people_view'))::text[]
  )
  OR "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('purchasing_view'))::text[]
  )
  OR "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('quality_view'))::text[]
  )
  OR "requestedBy" = auth.uid()::text
);

CREATE POLICY "INSERT" ON "approvalRequest"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('people_create'))::text[]
  )
  OR "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
  OR "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('purchasing_create'))::text[]
  )
  OR "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('quality_create'))::text[]
  )
  OR "requestedBy" = auth.uid()::text
);

CREATE POLICY "UPDATE" ON "approvalRequest"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('people_update'))::text[]
  )
  OR "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('purchasing_update'))::text[]
  )
  OR "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('quality_update'))::text[]
  )
  OR "requestedBy" = auth.uid()::text
);
