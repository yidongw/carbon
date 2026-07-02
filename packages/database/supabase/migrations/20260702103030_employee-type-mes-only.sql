-- MES-only employee types.
--
-- An employee type marked "mesOnly" grants access to the MES (shop floor) only.
-- People with such a type are blocked from the ERP (office app) and, because
-- they have no office access, they do NOT count toward the billable seat count.
-- Any type that is not mesOnly is an "office" type and counts as a paid seat.
--
-- This is an access decision, not a billing switch: billing is derived from
-- whether a person can open the ERP. See updateSubscriptionQuantityForCompany.

ALTER TABLE "employeeType"
  ADD COLUMN IF NOT EXISTS "mesOnly" BOOLEAN NOT NULL DEFAULT false;

-- Console Operators are PIN/kiosk shop-floor users → MES-only, non-billable.
-- This also closes the existing loophole where they still counted as seats.
UPDATE "employeeType" SET "mesOnly" = true
  WHERE "systemType" = 'Console Operator';
