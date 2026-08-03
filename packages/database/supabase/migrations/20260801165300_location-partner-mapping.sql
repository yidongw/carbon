-- A location (warehouse) can represent a customer or a supplier, so transfers can
-- send stock/samples "to" a partner and the tracked entity's location reflects
-- that it's now at that customer/supplier. At most one of the two may be set.
ALTER TABLE "location"
  ADD COLUMN "customerId" TEXT REFERENCES "customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD COLUMN "supplierId" TEXT REFERENCES "supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "location"
  ADD CONSTRAINT "location_partner_exclusive"
  CHECK ("customerId" IS NULL OR "supplierId" IS NULL);

CREATE INDEX "location_customerId_idx" ON "location" ("customerId");
CREATE INDEX "location_supplierId_idx" ON "location" ("supplierId");
