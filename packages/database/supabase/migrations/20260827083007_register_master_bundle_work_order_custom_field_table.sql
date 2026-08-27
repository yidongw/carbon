-- Register the master/bundle work order tables in customFieldTable.
--
-- These tables opt into saved table views (`withSavedView`, table="masterWorkOrder"
-- / "bundleWorkOrder"), but `tableView.table` has a FK to `customFieldTable`.
-- Because these two were never registered there, every attempt to save a view
-- for them failed the FK and rolled back silently. Register them (matching the
-- pattern used for job/salesOrder/purchaseOrder) so their views can be saved.
INSERT INTO "customFieldTable" ("table", "module", "name")
VALUES
  ('masterWorkOrder', 'Production', 'Master Work Order'),
  ('bundleWorkOrder', 'Production', 'Bundle Work Order')
ON CONFLICT ("table") DO NOTHING;
