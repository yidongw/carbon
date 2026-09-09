-- Apparel Size rows in itemAttributeValue must use canonical apparel sortOrder
-- (XS→…→4XL, OS last), matching STYLE_SIZE_CODES in styleReference.ts.
--
-- Company-only custom size "4XL" was often seeded/edited with sortOrder 0 (or
-- another low index), so Size pickers and 规格数量 grids put 4XL before L/XL.
-- Standard codes that drifted also get corrected here.

UPDATE "itemAttributeValue"
SET "sortOrder" = CASE "code"
  WHEN 'XS'  THEN 0
  WHEN 'S'   THEN 1
  WHEN 'M'   THEN 2
  WHEN 'L'   THEN 3
  WHEN 'XL'  THEN 4
  WHEN '2XL' THEN 5
  WHEN '3XL' THEN 6
  WHEN '4XL' THEN 7
  WHEN 'OS'  THEN 8
  ELSE "sortOrder"
END
WHERE "attributeId" = 'iat_size'
  AND "code" IN ('XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'OS');
