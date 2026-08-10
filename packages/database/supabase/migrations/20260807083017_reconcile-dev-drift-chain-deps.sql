-- Reconcile out-of-band dev-DB schema that the 2026-08 items/attributes/config
-- migration series (PRs #274 / #278) silently depends on but never creates.
--
-- These columns exist on the dev database (applied by hand, not via a committed
-- migration), so the later migrations were authored/tested against a DB that
-- already had them. On any database built purely from committed migrations
-- (staging, prod, a fresh local) the chain aborts:
--   * 20260807093041 recreates the "salesOrders" view  -> needs salesOrder.deletedAt/deletedBy
--   * 20260808151847 recreates "salesOrderLines"       -> needs salesOrderLine.deletedAt/deletedBy
--   * 20260807174512 relocates parent ledger rows      -> reads itemLedger.colorCode/sizeCode
--
-- This migration adds exactly those columns, idempotently, so it is a no-op on
-- dev and makes the chain reproducible everywhere else. Drift TABLES the chain
-- only DROP-guards (productionQuantitySplitRow, bundle) are left absent here and
-- are created to match dev by the later catch-up migration, together with the
-- broader dev drift (soft-delete columns on the remaining tables, the garment
-- subsystem, etc.).

-- Soft-delete columns consumed by the recreated sales-order views.
ALTER TABLE "salesOrder"
  ADD COLUMN IF NOT EXISTS "deletedAt" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "deletedBy" text;
ALTER TABLE "salesOrderLine"
  ADD COLUMN IF NOT EXISTS "deletedAt" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "deletedBy" text;

-- Legacy apparel columns read by the ledger->variant relocation migration.
-- They carry no data on clean DBs (the relocation is a no-op there) and are
-- dropped again by 20260808151847.
ALTER TABLE "itemLedger"
  ADD COLUMN IF NOT EXISTS "colorCode" text,
  ADD COLUMN IF NOT EXISTS "sizeCode" text;
