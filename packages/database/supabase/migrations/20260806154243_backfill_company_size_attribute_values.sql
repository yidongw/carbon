-- Company-scoped Size itemAttributeValue rows were skipped when a system
-- (companyId NULL) row with the same code already existed. Colors/Sizes admin
-- now reads company-scoped itemAttributeValue only, so backfill from styleSize.

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
ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING;

NOTIFY pgrst, 'reload schema';
