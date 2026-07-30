-- =============================================================================
-- Guarantee every Style item has a matching "style" extension row.
--
-- A Style is only visible in the "styles" view (and therefore the Styles list)
-- because that view INNER JOINs the "style" extension table on item.id. That
-- extension row used to be created by application code only (upsertStyle), so
-- any item inserted through a different path -- createRevision, the external
-- write API, raw SQL, or seed/debug scripts -- produced an ORPHAN Style: a row
-- in the base "item" table (so it still showed up in item/style pickers, which
-- read "item" directly) but absent from the Styles list. Item-type comboboxes
-- consequently offered "styles" that could never be opened or built against.
--
-- itemCost / itemReplenishment / itemUnitSalePrice / itemPlanning (and
-- makeMethod, for Part/Tool/Style) are already auto-created on item insert via
-- the sync_* interceptors attached to "item". This adds the "style" extension
-- row to that same family so the item<->style invariant holds regardless of
-- which code path inserts the item. Idempotent (ON CONFLICT DO NOTHING) so it
-- coexists with the application upsert and with revision inserts that reuse an
-- existing readableId.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION sync_create_style_related_records(
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
  IF (p_new->>'type') IS DISTINCT FROM 'Style' THEN RETURN; END IF;

  -- "style".id mirrors item.readableId (shared across revisions), itemId is the
  -- per-revision item.id. Application code (insertStyleRecord / upsertStyle)
  -- later upserts the same row to fill customFields, so DO NOTHING here.
  INSERT INTO "style" ("id", "itemId", "companyId", "createdBy")
  VALUES (
    p_new->>'readableId',
    p_new->>'id',
    p_new->>'companyId',
    p_new->>'createdBy'
  )
  ON CONFLICT ("id", "companyId") DO NOTHING;
END;
$$;

-- Re-attach the item after-sync interceptors, appending the style creator.
-- attach_event_trigger drops and recreates the trigger, so the full list must
-- be passed (matches 20260410031802_item-interceptors.sql).
SELECT attach_event_trigger('item',
  ARRAY[]::TEXT[],
  ARRAY[
    'sync_create_item_related_records',
    'sync_create_make_method_related_records',
    'sync_create_style_related_records'
  ]::TEXT[]
);

COMMIT;
