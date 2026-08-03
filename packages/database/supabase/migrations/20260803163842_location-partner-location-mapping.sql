-- A partner warehouse now points at a SPECIFIC customer/supplier location and reads
-- its address through that link (single source of truth). The warehouse's own
-- address columns act as an override: if set they win, if NULL the address is
-- inherited from the linked customer/supplier location. This replaces the previous
-- behavior where resolveOrCreatePartnerLocation stamped placeholder "-" addresses
-- that permanently drifted from the customer's real location.

-- 1. Link columns to the specific partner location (customerLocation/supplierLocation).
ALTER TABLE "location"
  ADD COLUMN "customerLocationId" TEXT REFERENCES "customerLocation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD COLUMN "supplierLocationId" TEXT REFERENCES "supplierLocation" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "location"
  ADD CONSTRAINT "location_partner_location_exclusive"
  CHECK ("customerLocationId" IS NULL OR "supplierLocationId" IS NULL);

CREATE INDEX "location_customerLocationId_idx" ON "location" ("customerLocationId");
CREATE INDEX "location_supplierLocationId_idx" ON "location" ("supplierLocationId");

-- 2. Allow inherit-via-NULL: a partner warehouse may store no address of its own.
--    (Regular internal warehouses continue to carry their own address.)
ALTER TABLE "location" ALTER COLUMN "addressLine1" DROP NOT NULL;
ALTER TABLE "location" ALTER COLUMN "city" DROP NOT NULL;
ALTER TABLE "location" ALTER COLUMN "postalCode" DROP NOT NULL;

-- 3. Backfill existing partner warehouses (created with only customerId + "-"
--    placeholders): link each to that customer's first location and clear the
--    placeholder address so it inherits the real one.
UPDATE "location" l
SET "customerLocationId" = cl."id"
FROM (
  SELECT DISTINCT ON ("customerId") "id", "customerId"
  FROM "customerLocation"
  ORDER BY "customerId", "id"
) cl
WHERE l."customerId" = cl."customerId"
  AND l."customerLocationId" IS NULL;

-- Clear the "-" placeholders on every partner warehouse so the address resolves
-- from the linked location (or shows blank) instead of a literal dash.
UPDATE "location"
SET
  "addressLine1" = NULLIF("addressLine1", '-'),
  "addressLine2" = NULLIF("addressLine2", '-'),
  "city" = NULLIF("city", '-'),
  "postalCode" = NULLIF("postalCode", '-')
WHERE "customerId" IS NOT NULL OR "supplierId" IS NOT NULL;
