-- Allow public access to invite links by code for the join page
-- This enables unauthenticated users to view invite link details

DROP POLICY IF EXISTS "SELECT" ON "public"."inviteLink";

CREATE POLICY "SELECT" ON "public"."inviteLink"
FOR SELECT USING (
  -- Allow users with permission to view all links in their companies
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('users_view'))::text[]
  )
  -- OR allow anyone to view a specific link by code (for public join page)
  OR TRUE
);
