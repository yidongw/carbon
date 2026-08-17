-- Consolidate item attribute VALUES to a single per-company set.
--
-- Bug: each standard size/color code existed twice in "itemAttributeValue" — a
-- shared system row ("companyId" IS NULL, ids iav_size_*/iav_color_*) AND a
-- company-scoped copy with the same code but a different id. Reads deduped by
-- code ("prefer company row"), but the Style detail page matched stored
-- selections to options by id, so a selection that stored the system id (while
-- the option list exposed the company id) silently dropped its badge — e.g. a
-- Style showing only "4XL" (the one company-only size without a system twin).
--
-- Fix: every company owns its own values (already seeded per company by
-- seedStyleReference). Give every company a copy of every system code, repoint
-- any references that still point at system ids, then delete the system rows.
-- Attributes / sets / set-attribute joins / type assignments stay system-owned
-- (single shared definitions, never duplicated) and are untouched.

-- 1) Ensure every company has a company-scoped copy of every system value.
--    Preserves any existing company customization via ON CONFLICT DO NOTHING.
INSERT INTO "itemAttributeValue" ("attributeId", "code", "name", "sortOrder", "companyId", "createdBy")
SELECT sv."attributeId", sv."code", sv."name", sv."sortOrder", c."id", 'system'
FROM "itemAttributeValue" sv
CROSS JOIN "company" c
WHERE sv."companyId" IS NULL
ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING;

-- 2) Repoint item attribute selections that reference a system value id to the
--    company-scoped row with the same (attributeId, code). ON DELETE RESTRICT
--    requires this before the delete in step 4.
UPDATE "itemAttributeSelection" s
SET "attributeValueId" = cv."id"
FROM "itemAttributeValue" sysv
JOIN "itemAttributeValue" cv
  ON cv."attributeId" = sysv."attributeId"
 AND cv."code" = sysv."code"
WHERE s."attributeValueId" = sysv."id"
  AND sysv."companyId" IS NULL
  AND cv."companyId" = s."companyId";

-- 3) Same repoint for frozen variant attribute values. The itemVariant.valuesKey
--    trigger recomputes automatically from the new ids.
UPDATE "itemVariantAttribute" v
SET "attributeValueId" = cv."id"
FROM "itemAttributeValue" sysv
JOIN "itemAttributeValue" cv
  ON cv."attributeId" = sysv."attributeId"
 AND cv."code" = sysv."code"
WHERE v."attributeValueId" = sysv."id"
  AND sysv."companyId" IS NULL
  AND cv."companyId" = v."companyId";

-- 4) Remove the shared system value rows. Now that every company has its own
--    copy and nothing references the system ids, this is safe.
DELETE FROM "itemAttributeValue" WHERE "companyId" IS NULL;

NOTIFY pgrst, 'reload schema';
