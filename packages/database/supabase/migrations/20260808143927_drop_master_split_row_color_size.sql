-- Retire the legacy 2-part colorCode/sizeCode dual-write on masterWorkOrderSplitRow.
-- valuesKey (backfilled in 20260807235641 and written on every insert) is now the
-- sole source of truth for a split row's attribute combo, so the generic attribute
-- model fully replaces the color/size pair here. No view references these columns.
ALTER TABLE "masterWorkOrderSplitRow" DROP COLUMN IF EXISTS "colorCode";
ALTER TABLE "masterWorkOrderSplitRow" DROP COLUMN IF EXISTS "sizeCode";
