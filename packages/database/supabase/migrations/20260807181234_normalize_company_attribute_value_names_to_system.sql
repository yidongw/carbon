-- Normalize company-defined Color/Size value names to the system English base.
--
-- Goal: English is the base name; locales translate it for display. Company
-- values migrated from the old styleColor catalog often carry a localized name
-- (e.g. code "BK", name "黑色"). Where a company value shares its code with a
-- system value (companyId IS NULL), adopt the system English name so it renders
-- translated per-locale like the rest of the palette instead of a fixed literal.
--
-- Only the display name changes; the code (and therefore every selection /
-- variant / ledger reference) is untouched, and the (attributeId, code,
-- companyId) unique key is unaffected. Company values whose code does NOT match
-- a system value are left exactly as-is.

UPDATE "itemAttributeValue" v
SET "name" = sys."name"
FROM "itemAttributeValue" sys
WHERE sys."companyId" IS NULL
  AND v."companyId" IS NOT NULL
  AND v."attributeId" = sys."attributeId"
  AND v."code" = sys."code"
  AND v."name" IS DISTINCT FROM sys."name";

NOTIFY pgrst, 'reload schema';
