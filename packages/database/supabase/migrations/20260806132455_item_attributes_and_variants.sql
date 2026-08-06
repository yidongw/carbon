-- Flexible product attributes + variant SKUs
-- Catalog: itemAttribute / Value / Set / SetAttribute / SetAssignment / Selection
-- Variants: itemVariant + itemVariantAttribute (child items hold inventory)

-- ---------------------------------------------------------------------------
-- itemAttribute
-- ---------------------------------------------------------------------------
CREATE TABLE "itemAttribute" (
  "id" TEXT NOT NULL DEFAULT id('iat'),
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "companyId" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "itemAttribute_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "itemAttribute_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemAttribute_code_companyId_key" UNIQUE ("code", "companyId")
);

CREATE INDEX "itemAttribute_companyId_idx" ON "itemAttribute" ("companyId");

ALTER TABLE "itemAttribute" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."itemAttribute"
FOR SELECT USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);

CREATE POLICY "INSERT" ON "public"."itemAttribute"
FOR INSERT WITH CHECK (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

CREATE POLICY "UPDATE" ON "public"."itemAttribute"
FOR UPDATE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

CREATE POLICY "DELETE" ON "public"."itemAttribute"
FOR DELETE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- ---------------------------------------------------------------------------
-- itemAttributeValue
-- ---------------------------------------------------------------------------
CREATE TABLE "itemAttributeValue" (
  "id" TEXT NOT NULL DEFAULT id('iav'),
  "attributeId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "companyId" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "itemAttributeValue_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "itemAttributeValue_attributeId_fkey"
    FOREIGN KEY ("attributeId") REFERENCES "itemAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeValue_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeValue_attributeId_code_companyId_key"
    UNIQUE ("attributeId", "code", "companyId")
);

CREATE INDEX "itemAttributeValue_companyId_idx" ON "itemAttributeValue" ("companyId");
CREATE INDEX "itemAttributeValue_attributeId_idx" ON "itemAttributeValue" ("attributeId");

ALTER TABLE "itemAttributeValue" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."itemAttributeValue"
FOR SELECT USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);

CREATE POLICY "INSERT" ON "public"."itemAttributeValue"
FOR INSERT WITH CHECK (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

CREATE POLICY "UPDATE" ON "public"."itemAttributeValue"
FOR UPDATE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

CREATE POLICY "DELETE" ON "public"."itemAttributeValue"
FOR DELETE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- ---------------------------------------------------------------------------
-- itemAttributeSet
-- ---------------------------------------------------------------------------
CREATE TABLE "itemAttributeSet" (
  "id" TEXT NOT NULL DEFAULT id('ias'),
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "companyId" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "itemAttributeSet_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "itemAttributeSet_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeSet_code_companyId_key" UNIQUE ("code", "companyId")
);

CREATE INDEX "itemAttributeSet_companyId_idx" ON "itemAttributeSet" ("companyId");

ALTER TABLE "itemAttributeSet" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."itemAttributeSet"
FOR SELECT USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);

CREATE POLICY "INSERT" ON "public"."itemAttributeSet"
FOR INSERT WITH CHECK (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

CREATE POLICY "UPDATE" ON "public"."itemAttributeSet"
FOR UPDATE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

CREATE POLICY "DELETE" ON "public"."itemAttributeSet"
FOR DELETE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- ---------------------------------------------------------------------------
-- itemAttributeSetAttribute (which attributes belong to a set)
-- ---------------------------------------------------------------------------
CREATE TABLE "itemAttributeSetAttribute" (
  "attributeSetId" TEXT NOT NULL,
  "attributeId" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "companyId" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "itemAttributeSetAttribute_pkey"
    PRIMARY KEY ("attributeSetId", "attributeId"),
  CONSTRAINT "itemAttributeSetAttribute_attributeSetId_fkey"
    FOREIGN KEY ("attributeSetId") REFERENCES "itemAttributeSet"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeSetAttribute_attributeId_fkey"
    FOREIGN KEY ("attributeId") REFERENCES "itemAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeSetAttribute_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "itemAttributeSetAttribute_attributeId_idx"
  ON "itemAttributeSetAttribute" ("attributeId");

ALTER TABLE "itemAttributeSetAttribute" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."itemAttributeSetAttribute"
FOR SELECT USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);

CREATE POLICY "INSERT" ON "public"."itemAttributeSetAttribute"
FOR INSERT WITH CHECK (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

CREATE POLICY "UPDATE" ON "public"."itemAttributeSetAttribute"
FOR UPDATE USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

CREATE POLICY "DELETE" ON "public"."itemAttributeSetAttribute"
FOR DELETE USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- ---------------------------------------------------------------------------
-- itemAttributeSetAssignment (which sets an itemType may use)
-- ---------------------------------------------------------------------------
CREATE TABLE "itemAttributeSetAssignment" (
  "id" TEXT NOT NULL DEFAULT id('isa'),
  "itemType" "itemType" NOT NULL,
  "attributeSetId" TEXT NOT NULL,
  "companyId" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "itemAttributeSetAssignment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "itemAttributeSetAssignment_attributeSetId_fkey"
    FOREIGN KEY ("attributeSetId") REFERENCES "itemAttributeSet"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeSetAssignment_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeSetAssignment_itemType_set_company_key"
    UNIQUE ("itemType", "attributeSetId", "companyId")
);

CREATE INDEX "itemAttributeSetAssignment_itemType_idx"
  ON "itemAttributeSetAssignment" ("itemType");
CREATE INDEX "itemAttributeSetAssignment_attributeSetId_idx"
  ON "itemAttributeSetAssignment" ("attributeSetId");

ALTER TABLE "itemAttributeSetAssignment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."itemAttributeSetAssignment"
FOR SELECT USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);

CREATE POLICY "INSERT" ON "public"."itemAttributeSetAssignment"
FOR INSERT WITH CHECK (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

CREATE POLICY "UPDATE" ON "public"."itemAttributeSetAssignment"
FOR UPDATE USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

CREATE POLICY "DELETE" ON "public"."itemAttributeSetAssignment"
FOR DELETE USING (
  "companyId" IS NULL OR
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- ---------------------------------------------------------------------------
-- item.attributeSetId (chosen set on the parent item)
-- ---------------------------------------------------------------------------
ALTER TABLE "item"
  ADD COLUMN "attributeSetId" TEXT
  REFERENCES "itemAttributeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "item_attributeSetId_idx" ON "item" ("attributeSetId");

-- ---------------------------------------------------------------------------
-- itemAttributeSelection (values enabled on a parent item)
-- ---------------------------------------------------------------------------
CREATE TABLE "itemAttributeSelection" (
  "itemId" TEXT NOT NULL,
  "attributeId" TEXT NOT NULL,
  "attributeValueId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "itemAttributeSelection_pkey"
    PRIMARY KEY ("itemId", "attributeValueId", "companyId"),
  CONSTRAINT "itemAttributeSelection_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeSelection_attributeId_fkey"
    FOREIGN KEY ("attributeId") REFERENCES "itemAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeSelection_attributeValueId_fkey"
    FOREIGN KEY ("attributeValueId") REFERENCES "itemAttributeValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "itemAttributeSelection_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "itemAttributeSelection_itemId_idx"
  ON "itemAttributeSelection" ("itemId", "companyId");
CREATE INDEX "itemAttributeSelection_attributeId_idx"
  ON "itemAttributeSelection" ("attributeId");
CREATE INDEX "itemAttributeSelection_attributeValueId_idx"
  ON "itemAttributeSelection" ("attributeValueId");

ALTER TABLE "itemAttributeSelection" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."itemAttributeSelection"
FOR SELECT USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);

CREATE POLICY "INSERT" ON "public"."itemAttributeSelection"
FOR INSERT WITH CHECK (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

CREATE POLICY "UPDATE" ON "public"."itemAttributeSelection"
FOR UPDATE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

CREATE POLICY "DELETE" ON "public"."itemAttributeSelection"
FOR DELETE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- ---------------------------------------------------------------------------
-- itemVariant (parent template → child SKU item)
-- ---------------------------------------------------------------------------
CREATE TABLE "itemVariant" (
  "id" TEXT NOT NULL DEFAULT id('ivr'),
  "parentItemId" TEXT NOT NULL,
  "variantItemId" TEXT NOT NULL,
  "valuesKey" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "itemVariant_pkey" PRIMARY KEY ("id", "companyId"),
  CONSTRAINT "itemVariant_parentItemId_fkey"
    FOREIGN KEY ("parentItemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemVariant_variantItemId_fkey"
    FOREIGN KEY ("variantItemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemVariant_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemVariant_variantItemId_key" UNIQUE ("variantItemId"),
  CONSTRAINT "itemVariant_parent_valuesKey_company_key"
    UNIQUE ("parentItemId", "valuesKey", "companyId")
);

CREATE INDEX "itemVariant_parentItemId_idx"
  ON "itemVariant" ("parentItemId", "companyId");
CREATE INDEX "itemVariant_companyId_idx" ON "itemVariant" ("companyId");

ALTER TABLE "itemVariant" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."itemVariant"
FOR SELECT USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);

CREATE POLICY "INSERT" ON "public"."itemVariant"
FOR INSERT WITH CHECK (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

CREATE POLICY "UPDATE" ON "public"."itemVariant"
FOR UPDATE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

CREATE POLICY "DELETE" ON "public"."itemVariant"
FOR DELETE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- ---------------------------------------------------------------------------
-- itemVariantAttribute (frozen attribute values on a variant)
-- ---------------------------------------------------------------------------
CREATE TABLE "itemVariantAttribute" (
  "itemVariantId" TEXT NOT NULL,
  "attributeId" TEXT NOT NULL,
  "attributeValueId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "itemVariantAttribute_pkey"
    PRIMARY KEY ("itemVariantId", "attributeId", "companyId"),
  CONSTRAINT "itemVariantAttribute_itemVariantId_companyId_fkey"
    FOREIGN KEY ("itemVariantId", "companyId")
      REFERENCES "itemVariant"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "itemVariantAttribute_attributeId_fkey"
    FOREIGN KEY ("attributeId") REFERENCES "itemAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "itemVariantAttribute_attributeValueId_fkey"
    FOREIGN KEY ("attributeValueId") REFERENCES "itemAttributeValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "itemVariantAttribute_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "itemVariantAttribute_attributeValueId_idx"
  ON "itemVariantAttribute" ("attributeValueId");

ALTER TABLE "itemVariantAttribute" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."itemVariantAttribute"
FOR SELECT USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);

CREATE POLICY "INSERT" ON "public"."itemVariantAttribute"
FOR INSERT WITH CHECK (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_create'))::text[])
);

CREATE POLICY "UPDATE" ON "public"."itemVariantAttribute"
FOR UPDATE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_update'))::text[])
);

CREATE POLICY "DELETE" ON "public"."itemVariantAttribute"
FOR DELETE USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_permission('parts_delete'))::text[])
);

-- ---------------------------------------------------------------------------
-- System seed: Color / Size attributes, sets, type assignments
-- ---------------------------------------------------------------------------
INSERT INTO "itemAttribute" ("id", "code", "name", "sortOrder", "companyId", "createdBy")
VALUES
  ('iat_color', 'Color', 'Color', 0, NULL, 'system'),
  ('iat_size', 'Size', 'Size', 1, NULL, 'system');

INSERT INTO "itemAttributeValue" ("id", "attributeId", "code", "name", "sortOrder", "companyId", "createdBy")
VALUES
  ('iav_size_xs',  'iat_size', 'XS',  'XS',  0, NULL, 'system'),
  ('iav_size_s',   'iat_size', 'S',   'S',   1, NULL, 'system'),
  ('iav_size_m',   'iat_size', 'M',   'M',   2, NULL, 'system'),
  ('iav_size_l',   'iat_size', 'L',   'L',   3, NULL, 'system'),
  ('iav_size_xl',  'iat_size', 'XL',  'XL',  4, NULL, 'system'),
  ('iav_size_2xl', 'iat_size', '2XL', '2XL', 5, NULL, 'system'),
  ('iav_size_3xl', 'iat_size', '3XL', '3XL', 6, NULL, 'system'),
  ('iav_size_os',  'iat_size', 'OS',  'OS',  7, NULL, 'system');

INSERT INTO "itemAttributeSet" ("id", "code", "name", "companyId", "createdBy")
VALUES
  ('ias_garment', 'Garment', 'Garment', NULL, 'system'),
  ('ias_fabric',  'Fabric',  'Fabric',  NULL, 'system'),
  ('ias_trim',    'Trim',    'Trim',    NULL, 'system');

INSERT INTO "itemAttributeSetAttribute"
  ("attributeSetId", "attributeId", "sortOrder", "companyId", "createdBy")
VALUES
  ('ias_garment', 'iat_color', 0, NULL, 'system'),
  ('ias_garment', 'iat_size',  1, NULL, 'system'),
  ('ias_fabric',  'iat_color', 0, NULL, 'system'),
  ('ias_trim',    'iat_color', 0, NULL, 'system');

INSERT INTO "itemAttributeSetAssignment"
  ("id", "itemType", "attributeSetId", "companyId", "createdBy")
VALUES
  ('isa_style_garment', 'Style',      'ias_garment', NULL, 'system'),
  ('isa_cons_fabric',   'Consumable', 'ias_fabric',  NULL, 'system'),
  ('isa_cons_trim',     'Consumable', 'ias_trim',    NULL, 'system');

-- ---------------------------------------------------------------------------
-- Migrate styleColor / styleSize catalogs → attribute values
-- Colors may be company-scoped OR global (companyId NULL). For global colors
-- that are assigned to a style, create a company-scoped attribute value so
-- selections stay tenant-local.
-- styleColorAssignment.styleId may be readableId (current) OR legacy item.id.
-- ---------------------------------------------------------------------------
INSERT INTO "itemAttributeValue" (
  "attributeId", "code", "name", "sortOrder", "companyId", "createdBy", "createdAt"
)
SELECT DISTINCT
  'iat_color',
  sc."colorCode",
  sc."colorName",
  100,
  COALESCE(sc."companyId", sca."companyId"),
  COALESCE(sc."createdBy", sca."createdBy"),
  COALESCE(sc."createdAt", sca."createdAt")
FROM "styleColorAssignment" sca
JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING;

INSERT INTO "itemAttributeValue" (
  "attributeId", "code", "name", "sortOrder", "companyId", "createdBy", "createdAt"
)
SELECT
  'iat_color',
  sc."colorCode",
  sc."colorName",
  100,
  sc."companyId",
  sc."createdBy",
  sc."createdAt"
FROM "styleColor" sc
WHERE sc."companyId" IS NOT NULL
ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING;

INSERT INTO "itemAttributeValue" (
  "attributeId", "code", "name", "sortOrder", "companyId", "createdBy", "createdAt"
)
SELECT
  'iat_size',
  ss."sizeCode",
  ss."sizeName",
  ss."sortOrder",
  ss."companyId",
  ss."createdBy",
  ss."createdAt"
FROM "styleSize" ss
WHERE ss."companyId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "itemAttributeValue" iav
    WHERE iav."attributeId" = 'iat_size'
      AND iav."code" = ss."sizeCode"
      AND iav."companyId" IS NULL
  )
ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING;

-- ---------------------------------------------------------------------------
-- Assign Garment set + selections on existing Style items
-- ---------------------------------------------------------------------------
UPDATE "item" i
SET "attributeSetId" = 'ias_garment'
WHERE i."type" = 'Style'
  AND i."attributeSetId" IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM "itemVariant" iv WHERE iv."variantItemId" = i."id"
  );

INSERT INTO "itemAttributeSelection" (
  "itemId", "attributeId", "attributeValueId", "companyId", "createdBy", "createdAt"
)
SELECT DISTINCT ON (i."id", iav."code")
  i."id",
  'iat_color',
  iav."id",
  sca."companyId",
  sca."createdBy",
  sca."createdAt"
FROM "styleColorAssignment" sca
JOIN "styleColor" sc
  ON sc."id" = sca."styleColorId"
JOIN "item" i
  ON i."companyId" = sca."companyId"
 AND i."type" = 'Style'
 AND (i."readableId" = sca."styleId" OR i."id" = sca."styleId")
JOIN "itemAttributeValue" iav
  ON iav."attributeId" = 'iat_color'
 AND iav."code" = sc."colorCode"
 AND iav."companyId" = sca."companyId"
WHERE NOT EXISTS (
  SELECT 1 FROM "itemVariant" iv WHERE iv."variantItemId" = i."id"
)
ORDER BY i."id", iav."code"
ON CONFLICT DO NOTHING;

INSERT INTO "itemAttributeSelection" (
  "itemId", "attributeId", "attributeValueId", "companyId", "createdBy", "createdAt"
)
SELECT DISTINCT ON (i."id", iav."code")
  i."id",
  'iat_size',
  iav."id",
  ssa."companyId",
  ssa."createdBy",
  ssa."createdAt"
FROM "styleSizeAssignment" ssa
JOIN "styleSize" ss
  ON ss."id" = ssa."styleSizeId"
JOIN "item" i
  ON i."companyId" = ssa."companyId"
 AND i."type" = 'Style'
 AND (i."readableId" = ssa."styleId" OR i."id" = ssa."styleId")
JOIN "itemAttributeValue" iav
  ON iav."attributeId" = 'iat_size'
 AND iav."code" = ss."sizeCode"
 AND (
   iav."companyId" = ssa."companyId"
   OR iav."companyId" IS NULL
 )
WHERE NOT EXISTS (
  SELECT 1 FROM "itemVariant" iv WHERE iv."variantItemId" = i."id"
)
ORDER BY i."id", iav."code", iav."companyId" NULLS LAST
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Generate Style color×size variant SKUs from selections
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  parent RECORD;
  color_rec RECORD;
  size_rec RECORD;
  variant_readable_id TEXT;
  variant_item_id TEXT;
  variant_row_id TEXT;
  values_key TEXT;
  color_count INT;
  size_count INT;
BEGIN
  FOR parent IN
    SELECT i.*
    FROM "item" i
    WHERE i."type" = 'Style'
      AND i."attributeSetId" = 'ias_garment'
      AND NOT EXISTS (
        SELECT 1 FROM "itemVariant" iv WHERE iv."variantItemId" = i."id"
      )
  LOOP
    SELECT count(*) INTO color_count
    FROM "itemAttributeSelection"
    WHERE "itemId" = parent."id" AND "attributeId" = 'iat_color';

    SELECT count(*) INTO size_count
    FROM "itemAttributeSelection"
    WHERE "itemId" = parent."id" AND "attributeId" = 'iat_size';

    -- Need both axes with at least one value each to explode SKUs
    IF color_count < 1 OR size_count < 1 THEN
      CONTINUE;
    END IF;

    -- Single effective SKU (1×1): still create a child so inventory is consistent
    -- for multi-axis sets; plain qty UX is handled in app when count = 1.

    FOR color_rec IN
      SELECT iav."id" AS value_id, iav."code", iav."name"
      FROM "itemAttributeSelection" sel
      JOIN "itemAttributeValue" iav ON iav."id" = sel."attributeValueId"
      WHERE sel."itemId" = parent."id" AND sel."attributeId" = 'iat_color'
      ORDER BY iav."sortOrder", iav."code"
    LOOP
      FOR size_rec IN
        SELECT iav."id" AS value_id, iav."code", iav."name"
        FROM "itemAttributeSelection" sel
        JOIN "itemAttributeValue" iav ON iav."id" = sel."attributeValueId"
        WHERE sel."itemId" = parent."id" AND sel."attributeId" = 'iat_size'
        ORDER BY iav."sortOrder", iav."code"
      LOOP
        values_key := color_rec.code || '|' || size_rec.code;
        variant_readable_id := parent."readableId" || '-' || color_rec.code || '-' || size_rec.code;

        IF EXISTS (
          SELECT 1 FROM "itemVariant"
          WHERE "parentItemId" = parent."id"
            AND "valuesKey" = values_key
            AND "companyId" = parent."companyId"
        ) THEN
          CONTINUE;
        END IF;

        -- Skip if readableId already taken (manual collision)
        IF EXISTS (
          SELECT 1 FROM "item"
          WHERE "readableId" = variant_readable_id
            AND "companyId" = parent."companyId"
            AND "type" = parent."type"
            AND "revision" IS NOT DISTINCT FROM parent."revision"
        ) THEN
          CONTINUE;
        END IF;

        variant_item_id := id('item');

        INSERT INTO "item" (
          "id",
          "readableId",
          "revision",
          "name",
          "description",
          "type",
          "replenishmentSystem",
          "defaultMethodType",
          "itemTrackingType",
          "unitOfMeasureCode",
          "active",
          "requiresInspection",
          "sourcingType",
          "thumbnailPath",
          "notes",
          "attributeSetId",
          "companyId",
          "createdBy",
          "createdAt"
        )
        VALUES (
          variant_item_id,
          variant_readable_id,
          COALESCE(parent."revision", '0'),
          parent."name" || ' / ' || color_rec.name || ' / ' || size_rec.name,
          parent."description",
          parent."type",
          parent."replenishmentSystem",
          parent."defaultMethodType",
          parent."itemTrackingType",
          parent."unitOfMeasureCode",
          parent."active",
          parent."requiresInspection",
          parent."sourcingType",
          parent."thumbnailPath",
          parent."notes",
          NULL, -- variants do not own a set; parent does
          parent."companyId",
          parent."createdBy",
          NOW()
        );

        -- Clear requiresConfiguration on child if trigger copied parent habits
        UPDATE "itemReplenishment"
        SET "requiresConfiguration" = false
        WHERE "itemId" = variant_item_id;

        variant_row_id := id('ivr');

        INSERT INTO "itemVariant" (
          "id", "parentItemId", "variantItemId", "valuesKey",
          "companyId", "createdBy", "createdAt"
        )
        VALUES (
          variant_row_id,
          parent."id",
          variant_item_id,
          values_key,
          parent."companyId",
          parent."createdBy",
          NOW()
        );

        INSERT INTO "itemVariantAttribute" (
          "itemVariantId", "attributeId", "attributeValueId",
          "companyId", "createdBy", "createdAt"
        )
        VALUES
          (variant_row_id, 'iat_color', color_rec.value_id, parent."companyId", parent."createdBy", NOW()),
          (variant_row_id, 'iat_size',  size_rec.value_id,  parent."companyId", parent."createdBy", NOW());
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
