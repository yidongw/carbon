-- Allow HR/accounting (people_view) to read production quantities for approval queues.

CREATE POLICY "Users with people_view can read production quantities"
ON "productionQuantity"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('people_view'))::text[]
  )
);

CREATE POLICY "Users with people_view can read production quantity reports"
ON "productionQuantityReport"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('people_view'))::text[]
  )
);
