CREATE TYPE "membershipApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE "inviteLink" (
  "id" TEXT NOT NULL DEFAULT id('inl'),
  "code" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "employeeTypeId" TEXT NOT NULL,
  "locationId" TEXT NOT NULL,
  "label" TEXT,
  "expiresAt" TIMESTAMPTZ,
  "revokedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "inviteLink_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "inviteLink_code_key" UNIQUE ("code"),
  CONSTRAINT "inviteLink_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "inviteLink_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "inviteLink_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "employeeType"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "inviteLink_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "membershipApplication" (
  "id" TEXT NOT NULL DEFAULT id('map'),
  "companyId" TEXT NOT NULL,
  "inviteLinkId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "employeeTypeId" TEXT NOT NULL,
  "locationId" TEXT NOT NULL,
  "status" "membershipApplicationStatus" NOT NULL DEFAULT 'pending',
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "membershipApplication_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "membershipApplication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "membershipApplication_inviteLinkId_fkey" FOREIGN KEY ("inviteLinkId") REFERENCES "inviteLink"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "membershipApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "membershipApplication_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "employeeType"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "membershipApplication_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "membershipApplication_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "user"("id")
);

CREATE INDEX "inviteLink_companyId_idx" ON "inviteLink" ("companyId");
CREATE INDEX "inviteLink_redeemable_code_idx" ON "inviteLink" ("code")
  WHERE "revokedAt" IS NULL;

CREATE INDEX "membershipApplication_companyId_idx" ON "membershipApplication" ("companyId");
CREATE INDEX "membershipApplication_status_idx" ON "membershipApplication" ("companyId", "status");
CREATE UNIQUE INDEX "membershipApplication_pending_user_company_idx"
  ON "membershipApplication" ("userId", "companyId")
  WHERE "status" = 'pending';

ALTER TABLE "inviteLink" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "membershipApplication" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."inviteLink"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('users_view'))::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."inviteLink"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('users_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."inviteLink"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('users_update'))::text[]
  )
);

CREATE POLICY "SELECT" ON "public"."membershipApplication"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('users_view'))::text[]
  )
  OR "userId" = auth.uid()::text
);

CREATE POLICY "INSERT" ON "public"."membershipApplication"
FOR INSERT WITH CHECK (
  "userId" = auth.uid()::text
);

CREATE POLICY "UPDATE" ON "public"."membershipApplication"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('users_update'))::text[]
  )
);
