-- Consolidate item attribute VALUES to a single per-company set.
--
-- Bug: each standard size/color code existed twice in "itemAttributeValue" — a
-- shared system row ("companyId" IS NULL, ids iav_size_*/iav_color_*) AND a
-- company-scoped copy with the same code but a different id. Reads deduped by
-- code ("prefer company row"), but the Style detail page (and Styles list size
-- chips) match/aggregate by value id, so an item that carries BOTH a system-id
-- and a company-id selection for the same code renders that code twice, and an
-- item that carries only the system id drops the badge entirely (e.g. a Style
-- showing only "4XL", the one company-only size without a system twin).
--
-- Fix: every company owns its own values (already seeded per company by
-- seedStyleReference). Give every company a copy of every system code, then
-- de-duplicate + repoint any references off the system ids, then delete the
-- system rows. Attributes / sets / set-attribute joins / type assignments stay
-- system-owned (single shared definitions, never duplicated) and are untouched.

-- 1) Ensure every company has a company-scoped copy of every system value.
--    Preserves any existing company customization via ON CONFLICT DO NOTHING.
INSERT INTO "itemAttributeValue" ("attributeId", "code", "name", "sortOrder", "companyId", "createdBy")
SELECT sv."attributeId", sv."code", sv."name", sv."sortOrder", c."id", 'system'
FROM "itemAttributeValue" sv
CROSS JOIN "company" c
WHERE sv."companyId" IS NULL
ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING;

-- 2a) Drop system-pointing selections that already have a company-pointing twin
--     on the same item (repointing them would collide on the
--     (itemId, attributeValueId, companyId) primary key). This also removes the
--     visible duplicate size/color chips.
DELETE FROM "itemAttributeSelection" s
USING "itemAttributeValue" sysv, "itemAttributeValue" cv
WHERE s."attributeValueId" = sysv."id"
  AND sysv."companyId" IS NULL
  AND cv."attributeId" = sysv."attributeId"
  AND cv."code" = sysv."code"
  AND cv."companyId" = s."companyId"
  AND EXISTS (
    SELECT 1 FROM "itemAttributeSelection" s2
    WHERE s2."itemId" = s."itemId"
      AND s2."companyId" = s."companyId"
      AND s2."attributeValueId" = cv."id"
  );

-- 2b) Repoint the remaining system-pointing selections to the company-scoped row
--     with the same (attributeId, code). ON DELETE RESTRICT requires this before
--     the delete in step 4.
UPDATE "itemAttributeSelection" s
SET "attributeValueId" = cv."id"
FROM "itemAttributeValue" sysv
JOIN "itemAttributeValue" cv
  ON cv."attributeId" = sysv."attributeId"
 AND cv."code" = sysv."code"
WHERE s."attributeValueId" = sysv."id"
  AND sysv."companyId" IS NULL
  AND cv."companyId" = s."companyId";

-- 3a) Drop duplicate variants of the same parent that would collapse to the same
--     (attributeId, code) set once system/company ids are unified — otherwise the
--     itemVariant.valuesKey UNIQUE(parentItemId, valuesKey, companyId) would
--     collide when the trigger recomputes. Keep the lowest id; cascades to
--     itemVariantAttribute only (no other table references itemVariant).
WITH "variantCodeKey" AS (
  SELECT
    iv."id" AS "variantId",
    iv."parentItemId",
    iv."companyId",
    string_agg(va."attributeId" || ':' || vav."code", '|' ORDER BY va."attributeId") AS "codeKey"
  FROM "itemVariant" iv
  JOIN "itemVariantAttribute" va ON va."itemVariantId" = iv."id" AND va."companyId" = iv."companyId"
  JOIN "itemAttributeValue" vav ON vav."id" = va."attributeValueId"
  GROUP BY iv."id", iv."parentItemId", iv."companyId"
),
"dupeVariants" AS (
  SELECT
    "variantId",
    "companyId",
    row_number() OVER (
      PARTITION BY "parentItemId", "companyId", "codeKey" ORDER BY "variantId"
    ) AS rn
  FROM "variantCodeKey"
)
DELETE FROM "itemVariant" iv
USING "dupeVariants" d
WHERE iv."id" = d."variantId"
  AND iv."companyId" = d."companyId"
  AND d.rn > 1;

-- 3b) Repoint the remaining variant attribute values. The itemVariant.valuesKey
--     trigger recomputes automatically from the new ids.
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
