-- productionQuantity.createdBy has always been a plain TEXT column with no
-- foreign key. PostgREST therefore cannot embed the reporter via
-- `createdByUser:createdBy(...)`, so getProductionQuantitiesForJobOperation
-- errored out (PGRST200 "Could not find a relationship") and returned no rows.
-- That is why the MES operation "Production Logs" section and the bundle report
-- history showed nothing even when quantities existed.
--
-- Add the missing foreign key so the embed resolves, matching the equivalent
-- constraint on productionEvent.createdBy.
ALTER TABLE "productionQuantity"
  ADD CONSTRAINT "productionQuantity_createdBy_fkey"
  FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT;
