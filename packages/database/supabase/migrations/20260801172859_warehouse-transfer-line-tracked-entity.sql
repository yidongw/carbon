-- Remember which serial/lot a warehouse-transfer line moves, so the exact unit
-- picked when the transfer is created carries through (no re-entry at ship) and
-- can be excluded from other transfers' available stock (reservation).
ALTER TABLE "warehouseTransferLine"
  ADD COLUMN "trackedEntityId" TEXT
  REFERENCES "trackedEntity" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "warehouseTransferLine_trackedEntityId_idx"
  ON "warehouseTransferLine" ("trackedEntityId");
