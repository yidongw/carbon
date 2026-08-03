-- Read model for warehouses. A partner warehouse (linked to a customer/supplier
-- location) stores no address of its own; this view resolves its address THROUGH
-- the linked location: own column ?? inherited. All in-app reads that need a
-- location's address should use this view; writes still target the "location" table.
CREATE OR REPLACE VIEW "locations" WITH (security_invoker = true) AS
SELECT
  l."id",
  l."name",
  l."companyId",
  COALESCE(l."addressLine1", ca."addressLine1", sa."addressLine1") AS "addressLine1",
  COALESCE(l."addressLine2", ca."addressLine2", sa."addressLine2") AS "addressLine2",
  COALESCE(l."city", ca."city", sa."city") AS "city",
  COALESCE(l."stateProvince", ca."stateProvince", sa."stateProvince") AS "stateProvince",
  COALESCE(l."postalCode", ca."postalCode", sa."postalCode") AS "postalCode",
  -- address.countryCode and location.countryCode both store the alpha2 code.
  COALESCE(l."countryCode", ca."countryCode", sa."countryCode") AS "countryCode",
  l."timezone",
  l."latitude",
  l."longitude",
  l."customerId",
  l."supplierId",
  l."customerLocationId",
  l."supplierLocationId",
  cust."name" AS "customerName",
  supp."name" AS "supplierName",
  COALESCE(cl."name", sl."name") AS "partnerLocationName",
  (l."addressLine1" IS NULL AND (ca."id" IS NOT NULL OR sa."id" IS NOT NULL)) AS "isAddressInherited",
  l."customFields",
  l."tags",
  l."createdBy",
  l."createdAt",
  l."updatedBy",
  l."updatedAt"
FROM "location" l
  LEFT JOIN "customerLocation" cl ON cl."id" = l."customerLocationId"
  LEFT JOIN "address" ca ON ca."id" = cl."addressId"
  LEFT JOIN "supplierLocation" sl ON sl."id" = l."supplierLocationId"
  LEFT JOIN "address" sa ON sa."id" = sl."addressId"
  LEFT JOIN "customer" cust ON cust."id" = l."customerId"
  LEFT JOIN "supplier" supp ON supp."id" = l."supplierId";
