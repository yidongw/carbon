-- Planned Style/attribute qty as relational rows (same grain as itemVariant).
-- job.configuration remains Part method params only — never Style configTable.

CREATE TABLE "jobVariantQuantity" (
  "id" TEXT NOT NULL DEFAULT id('jvq'),
  "jobId" TEXT NOT NULL,
  "variantItemId" TEXT NOT NULL,
  "quantity" NUMERIC NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "jobVariantQuantity_pkey" PRIMARY KEY ("id", "companyId"),
  CONSTRAINT "jobVariantQuantity_quantity_check" CHECK ("quantity" > 0),
  CONSTRAINT "jobVariantQuantity_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobVariantQuantity_variantItemId_fkey"
    FOREIGN KEY ("variantItemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "jobVariantQuantity_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jobVariantQuantity_job_variant_company_key"
    UNIQUE ("jobId", "variantItemId", "companyId")
);

CREATE INDEX "jobVariantQuantity_jobId_companyId_idx"
  ON "jobVariantQuantity" ("jobId", "companyId");
CREATE INDEX "jobVariantQuantity_variantItemId_idx"
  ON "jobVariantQuantity" ("variantItemId");
CREATE INDEX "jobVariantQuantity_companyId_idx"
  ON "jobVariantQuantity" ("companyId");
CREATE INDEX "jobVariantQuantity_createdBy_idx"
  ON "jobVariantQuantity" ("createdBy");

ALTER TABLE "public"."jobVariantQuantity" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."jobVariantQuantity"
FOR SELECT USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);

CREATE POLICY "INSERT" ON "public"."jobVariantQuantity"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_create'))::text[]
  )
);

CREATE POLICY "UPDATE" ON "public"."jobVariantQuantity"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_update'))::text[]
  )
);

CREATE POLICY "DELETE" ON "public"."jobVariantQuantity"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('production_delete'))::text[]
  )
);

NOTIFY pgrst, 'reload schema';
