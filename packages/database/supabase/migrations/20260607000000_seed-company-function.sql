-- seed_company(): server-side replacement for the `seed-company` edge function.
--
-- Motivation: the edge function paid a ~5s cold start on (nearly) every onboarding
-- (it is invoked ~once per company, so it is almost always cold) plus 95 sequential
-- round trips to insert the chart of accounts. Running the whole seed as one plpgsql
-- RPC removes the cold start and collapses the work into a single round trip with
-- set-based inserts (accounts resolved in one statement).
--
-- The seed *data* stays in packages/database/supabase/functions/lib/seed.data.ts
-- (single source of truth, also used by seed-dev + the i18n display-name generator).
-- The app passes it in as `seed` jsonb, so this function is data-agnostic logic only.
--
-- SECURITY DEFINER: every target table has RLS, and during onboarding the caller has
-- no userToCompany row yet, so the function must run as owner to bypass RLS.

CREATE OR REPLACE FUNCTION seed_company(
  company_id text,
  user_id text,
  parent_company_id text DEFAULT NULL,
  seed jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company         company%ROWTYPE;
  v_parent          company%ROWTYPE;
  v_group_id        text;
  v_is_new_group    boolean;
  v_employee_type_id text;
  v_id_part         text;
  v_defaults        jsonb;
  v_perms           jsonb;
  v_has_elimination boolean;
BEGIN
  SELECT * INTO v_company FROM company WHERE id = company_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'seed_company: company not found: %', company_id;
  END IF;

  v_group_id := v_company."companyGroupId";
  v_is_new_group := (v_group_id IS NULL AND parent_company_id IS NULL);

  -- Subsidiary joining an existing group: inherit the parent's group
  IF parent_company_id IS NOT NULL AND v_group_id IS NULL THEN
    SELECT "companyGroupId" INTO v_group_id FROM company WHERE id = parent_company_id;
    IF v_group_id IS NULL THEN
      RAISE EXCEPTION 'seed_company: parent company % has no group', parent_company_id;
    END IF;
  END IF;

  -- New root company: create the group and assign it
  IF v_is_new_group THEN
    INSERT INTO "companyGroup"(name, "createdBy", "ownerId")
    VALUES (v_company.name, user_id, user_id)
    RETURNING id INTO v_group_id;

    UPDATE company SET "companyGroupId" = v_group_id WHERE id = company_id;
  END IF;

  IF parent_company_id IS NOT NULL THEN
    UPDATE company
    SET "companyGroupId" = v_group_id, "parentCompanyId" = parent_company_id
    WHERE id = company_id;
  END IF;

  -- Storage bucket
  INSERT INTO storage.buckets(id, name, public)
  VALUES (company_id, company_id, false)
  ON CONFLICT (id) DO NOTHING;

  -- Link the founding user to the company
  INSERT INTO "userToCompany"("userId", "companyId", role)
  VALUES (user_id, company_id, 'employee');

  -- High-order groups (id template: {idPrefix}-{cccc}-{cccc}-{cccccccccccc})
  v_id_part := substr(company_id, 1, 4) || '-' || substr(company_id, 5, 4) || '-' || substr(company_id, 9, 12);
  INSERT INTO "group"(id, name, "companyId", "isEmployeeTypeGroup", "isCustomerTypeGroup", "isSupplierTypeGroup")
  SELECT g."idPrefix" || '-' || v_id_part, g.name, company_id,
         g."isEmployeeTypeGroup", g."isCustomerTypeGroup", g."isSupplierTypeGroup"
  FROM jsonb_to_recordset(seed->'groups') AS g(
    "idPrefix" text, name text,
    "isEmployeeTypeGroup" boolean, "isCustomerTypeGroup" boolean, "isSupplierTypeGroup" boolean
  );

  -- Admin employee type
  INSERT INTO "employeeType"(name, "companyId", protected, "systemType")
  VALUES ('Admin', company_id, true, 'Admin'::"employeeTypeSystemType")
  RETURNING id INTO v_employee_type_id;

  -- Admin permissions for every module
  INSERT INTO "employeeTypePermission"("employeeTypeId", module, "create", "update", "delete", "view")
  SELECT v_employee_type_id, m.name,
         ARRAY[company_id], ARRAY[company_id], ARRAY[company_id], ARRAY[company_id]
  FROM modules m
  WHERE m.name IS NOT NULL;

  -- Founding employee
  INSERT INTO "employee"(id, "employeeTypeId", "companyId", active)
  VALUES (user_id, v_employee_type_id, company_id, true);

  -- Default approval rules (Admin employee-type group approves all four document types)
  INSERT INTO "approvalRule"("documentType", enabled, "approverGroupIds", "lowerBoundAmount", "companyId", "createdBy")
  VALUES
    ('purchaseOrder'::"approvalDocumentType",            true, ARRAY[v_employee_type_id], 0, company_id, user_id),
    ('qualityDocument'::"approvalDocumentType",          true, ARRAY[v_employee_type_id], 0, company_id, user_id),
    ('supplier'::"approvalDocumentType",                 true, ARRAY[v_employee_type_id], 0, company_id, user_id),
    ('productionQuantityReport'::"approvalDocumentType", true, ARRAY[v_employee_type_id], 0, company_id, user_id);

  -- Per-company master data ----------------------------------------------------
  INSERT INTO "customerStatus"(name, "companyId", "createdBy")
  SELECT x.value, company_id, 'system'
  FROM jsonb_array_elements_text(seed->'customerStatuses') AS x(value);

  INSERT INTO "scrapReason"(name, "companyId", "createdBy")
  SELECT x.value, company_id, 'system'
  FROM jsonb_array_elements_text(seed->'scrapReasons') AS x(value);

  INSERT INTO "paymentTerm"(name, "daysDue", "calculationMethod", "daysDiscount", "discountPercentage", "companyId", "createdBy")
  SELECT p.name, p."daysDue", p."calculationMethod"::"paymentTermCalculationMethod",
         p."daysDiscount", p."discountPercentage", company_id, 'system'
  FROM jsonb_to_recordset(seed->'paymentTerms') AS p(
    name text, "daysDue" int, "calculationMethod" text, "daysDiscount" int, "discountPercentage" numeric
  );

  INSERT INTO "unitOfMeasure"(name, code, "companyId", "createdBy")
  SELECT u.name, u.code, company_id, 'system'
  FROM jsonb_to_recordset(seed->'unitOfMeasures') AS u(name text, code text);

  INSERT INTO "gaugeType"(name, "companyId", "createdBy")
  SELECT x.value, company_id, 'system'
  FROM jsonb_array_elements_text(seed->'gaugeTypes') AS x(value);

  INSERT INTO "maintenanceFailureMode"(name, "companyId", "createdBy")
  SELECT x.value, company_id, 'system'
  FROM jsonb_array_elements_text(seed->'failureModes') AS x(value);

  INSERT INTO "nonConformanceType"(name, "companyId", "createdBy")
  SELECT n.name, company_id, 'system'
  FROM jsonb_to_recordset(seed->'nonConformanceTypes') AS n(name text);

  INSERT INTO "nonConformanceRequiredAction"(name, "systemType", "companyId", "createdBy")
  SELECT n.name, n."systemType"::"nonConformanceSystemActionType", company_id, 'system'
  FROM jsonb_to_recordset(seed->'nonConformanceRequiredActions') AS n(name text, "systemType" text);

  -- Sequences (id is computed by the table's trigger from prefix/next/size)
  INSERT INTO "sequence"("table", name, prefix, suffix, next, size, step, "companyId")
  SELECT s."table", s.name, s.prefix, s.suffix, s.next, s.size, s.step, company_id
  FROM jsonb_to_recordset(seed->'sequences') AS s(
    "table" text, name text, prefix text, suffix text, next int, size int, step int
  );

  -- Group-shared accounting data: only seed for a brand-new group ---------------
  IF v_is_new_group THEN
    INSERT INTO currency(code, "exchangeRate", "decimalPlaces", "companyGroupId", "createdBy")
    SELECT c.code, c."exchangeRate", c."decimalPlaces", v_group_id, 'system'
    FROM jsonb_to_recordset(seed->'currencies') AS c(code text, "exchangeRate" numeric, "decimalPlaces" int);

    -- Chart of accounts in ONE statement. Pre-generate an id per `key`, then resolve
    -- parentId via a self-join on that map. The self-FK is checked at statement end,
    -- so every row is present by then. `id()` is volatile => the CTE is materialized,
    -- so each key maps to a single stable id across both joins.
    WITH input AS (
      SELECT * FROM jsonb_to_recordset(seed->'accounts') AS a(
        key text, "parentKey" text, number text, name text,
        "isGroup" boolean, "accountType" text, "incomeBalance" text,
        class text, "consolidatedRate" text, "isSystem" boolean
      )
    ),
    ids AS (
      SELECT key, id('acct') AS id FROM input
    )
    INSERT INTO account(
      id, "companyGroupId", number, name, "isGroup", "accountType",
      "incomeBalance", class, "consolidatedRate", "isSystem", "createdBy", "parentId"
    )
    SELECT self.id, v_group_id, i.number, i.name,
           COALESCE(i."isGroup", false),
           i."accountType"::"accountType",
           i."incomeBalance"::"glIncomeBalance",
           i.class::"glAccountClass",
           COALESCE(i."consolidatedRate", 'Current')::"glConsolidatedRate",
           COALESCE(i."isSystem", false),
           'system',
           parent.id
    FROM input i
    JOIN ids self ON self.key = i.key
    LEFT JOIN ids parent ON parent.key = i."parentKey";

    INSERT INTO dimension(name, "entityType", "companyGroupId", "createdBy")
    SELECT d.name, d."entityType"::"dimensionEntityType", v_group_id, user_id
    FROM jsonb_to_recordset(seed->'dimensions') AS d(name text, "entityType" text);
  END IF;

  -- Company accounting defaults: resolve each account number -> id within this group
  SELECT jsonb_object_agg(d.key, a.id)
  INTO v_defaults
  FROM jsonb_each_text(seed->'accountDefaults') AS d(key, num)
  JOIN account a ON a."companyGroupId" = v_group_id AND a.number = d.num;

  v_defaults := COALESCE(v_defaults, '{}'::jsonb) || jsonb_build_object('companyId', company_id);
  INSERT INTO "accountDefault"
  SELECT * FROM jsonb_populate_record(NULL::"accountDefault", v_defaults);

  -- Fiscal year settings
  INSERT INTO "fiscalYearSettings"("companyId", "startMonth", "taxStartMonth", "updatedBy")
  VALUES (
    company_id,
    (seed->'fiscalYearSettings'->>'startMonth')::"month",
    (seed->'fiscalYearSettings'->>'taxStartMonth')::"month",
    COALESCE(seed->'fiscalYearSettings'->>'updatedBy', 'system')
  );

  -- Grant the founding user permissions for this company across every module
  IF NOT EXISTS (SELECT 1 FROM "userPermission" WHERE id = user_id) THEN
    RAISE EXCEPTION 'seed_company: userPermission not found for user %', user_id;
  END IF;

  SELECT COALESCE(permissions, '{}'::jsonb) INTO v_perms FROM "userPermission" WHERE id = user_id;
  SELECT v_perms || jsonb_object_agg(k, COALESCE(v_perms->k, '[]'::jsonb) || to_jsonb(company_id))
  INTO v_perms
  FROM (
    SELECT lower(m.name::text) || s AS k
    FROM modules m
    CROSS JOIN unnest(ARRAY['_view', '_create', '_update', '_delete']) AS s
    WHERE m.name IS NOT NULL
  ) keys;
  UPDATE "userPermission" SET permissions = v_perms WHERE id = user_id;

  -- Auto-create the elimination entity for a subsidiary's parent (once per parent)
  IF parent_company_id IS NOT NULL AND v_group_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM company
      WHERE "companyGroupId" = v_group_id
        AND "parentCompanyId" = parent_company_id
        AND "isEliminationEntity" = true
    ) INTO v_has_elimination;

    IF NOT v_has_elimination THEN
      SELECT * INTO v_parent FROM company WHERE id = parent_company_id;
      INSERT INTO company(
        name, "addressLine1", city, "stateProvince", "postalCode",
        "baseCurrencyCode", "countryCode", "parentCompanyId", "isEliminationEntity", "companyGroupId"
      )
      VALUES (
        'Elimination - ' || COALESCE(v_parent.name, 'Unknown'), '', '', '', '',
        COALESCE(v_parent."baseCurrencyCode", v_company."baseCurrencyCode"),
        COALESCE(v_parent."countryCode", v_company."countryCode", ''),
        parent_company_id, true, v_group_id
      );
    END IF;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION seed_company(text, text, text, jsonb) TO authenticated, service_role;

NOTIFY pgrst, 'reload schema';
