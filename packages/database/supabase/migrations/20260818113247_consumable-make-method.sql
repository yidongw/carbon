-- Allow Consumables to be manufactured (have a makeMethod = BOM + routing),
-- so finished fabric (成品布) can be made from greige (胚布) via an outside
-- dyeing (印染) operation and roll up into a Style's cost.
--
-- Two changes:
--   1. Widen the make-method interceptor so every Consumable insert also gets a
--      makeMethod row (matching Part/Tool/Style, which get one unconditionally
--      regardless of Buy/Make so a later Buy->Make flip has a method to edit).
--   2. Backfill a makeMethod for existing Consumables that lack one.

CREATE OR REPLACE FUNCTION sync_create_make_method_related_records(
  p_table TEXT,
  p_operation TEXT,
  p_new JSONB,
  p_old JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_operation != 'INSERT' THEN RETURN; END IF;

  IF (p_new->>'type') IN ('Part', 'Tool', 'Style', 'Consumable') THEN
    INSERT INTO "makeMethod"("itemId", "createdBy", "companyId")
    VALUES (p_new->>'id', p_new->>'createdBy', p_new->>'companyId');
  END IF;
END;
$$;

-- Backfill: every existing Consumable that has no makeMethod gets one.
INSERT INTO "makeMethod" ("itemId", "createdBy", "companyId")
SELECT i."id", i."createdBy", i."companyId"
FROM "item" i
WHERE i."type" = 'Consumable'
  AND NOT EXISTS (
    SELECT 1
    FROM "makeMethod" mm
    WHERE mm."itemId" = i."id"
      AND mm."companyId" = i."companyId"
  );
