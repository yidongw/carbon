-- Standard style colors (companyId IS NULL = system-wide, not editable by companies)
INSERT INTO "styleColor" ("id", "colorCode", "colorName", "companyId", "createdBy")
SELECT id('sco'), v."colorCode", v."colorName", NULL, 'system'
FROM (VALUES
  ('BK',  'Black'),
  ('WH',  'White'),
  ('GY',  'Gray'),
  ('LGY', 'Light Gray'),
  ('CH',  'Charcoal'),
  ('NV',  'Navy'),
  ('BL',  'Blue'),
  ('LBL', 'Light Blue'),
  ('RD',  'Red'),
  ('PK',  'Pink'),
  ('WN',  'Wine'),
  ('PP',  'Purple'),
  ('OR',  'Orange'),
  ('YL',  'Yellow'),
  ('GR',  'Green'),
  ('OL',  'Olive'),
  ('BG',  'Beige'),
  ('CR',  'Cream'),
  ('KH',  'Khaki'),
  ('BN',  'Brown')
) AS v("colorCode", "colorName")
WHERE NOT EXISTS (
  SELECT 1 FROM "styleColor" sc
  WHERE sc."colorCode" = v."colorCode" AND sc."companyId" IS NULL
);
