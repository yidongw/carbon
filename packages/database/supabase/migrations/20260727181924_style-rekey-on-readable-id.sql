-- =============================================================================
-- Re-key the "style" extension table on id (= item.readableId), matching how
-- part / material / tool / consumable already work.
--
-- Before: style had a NOT NULL UNIQUE "itemId" bound to a single item revision,
--   and the "styles" view INNER JOINed on li.id = s.itemId. Because the row was
--   tied to one revision's item.id, any Style item inserted through a path that
--   did not also point that row at the right revision (createRevision, external
--   API, raw SQL, seed/debug) was dropped from the view -- an orphan/phantom
--   Style. Every other item type avoids this by keying its extension on the
--   product (id = readableId, shared across all revisions).
--
-- After: style is keyed purely by id (= readableId); the "styles" view joins on
--   li.readableId = s.id, so every revision of a style resolves to the single
--   shared style row. The itemId column, its UNIQUE constraint, FK and index
--   are removed.
-- =============================================================================

BEGIN;

-- 1. Recreate the "styles" view to join on readableId. This is the only place
--    that referenced style.itemId; the column list/order is otherwise identical
--    (CREATE OR REPLACE keeps downstream consumers and the flat search columns
--    working), so we can drop the column afterwards.
CREATE OR REPLACE VIEW "styles" WITH (SECURITY_INVOKER=true) AS
WITH latest_items AS (
  SELECT DISTINCT ON (i."readableId", i."companyId")
    i.*
  FROM "item" i
  WHERE i."type" = 'Style'
  ORDER BY i."readableId", i."companyId",
    CASE WHEN i."revision" = '0' OR i."revision" = '' OR i."revision" IS NULL THEN 0 ELSE 1 END DESC,
    i."createdAt" DESC NULLS LAST
),
item_revisions AS (
  SELECT
    i."readableId",
    i."companyId",
    json_agg(
      json_build_object(
        'id', i.id,
        'revision', i."revision",
        'name', i."name",
        'description', i."description",
        'active', i."active",
        'createdAt', i."createdAt"
      ) ORDER BY
        CASE WHEN i."revision" = '0' OR i."revision" = '' OR i."revision" IS NULL THEN 0 ELSE 1 END,
        i."createdAt"
      ) AS "revisions"
  FROM "item" i
  WHERE i."type" = 'Style'
  GROUP BY i."readableId", i."companyId"
)
SELECT
  li."active",
  li."assignee",
  li."defaultMethodType",
  li."sourcingType",
  li."description",
  li."itemTrackingType",
  li."name",
  li."replenishmentSystem",
  li."unitOfMeasureCode",
  li."notes",
  li."revision",
  li."readableId",
  li."readableIdWithRevision",
  li."id",
  li."companyId",
  li."thumbnailPath",
  (
    SELECT json_agg(json_build_object('id', sc."id", 'colorCode', sc."colorCode", 'colorName', sc."colorName") ORDER BY sc."colorCode")
    FROM "styleColorAssignment" sca
    JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
    WHERE sca."styleId" = s."id"
      AND sca."companyId" = s."companyId"
  ) AS colors,
  ir."revisions",
  s."customFields",
  s."tags",
  ic."itemPostingGroupId",
  li."createdBy",
  li."createdAt",
  li."updatedBy",
  li."updatedAt",
  (
    SELECT json_agg(json_build_object('id', ss."id", 'sizeCode', ss."sizeCode", 'sizeName', ss."sizeName") ORDER BY ss."sortOrder", ss."sizeCode")
    FROM "styleSizeAssignment" ssa
    JOIN "styleSize" ss ON ss."id" = ssa."styleSizeId"
    WHERE ssa."styleId" = s."id"
      AND ssa."companyId" = s."companyId"
  ) AS sizes,
  -- Flat, searchable text aggregates (appended for CREATE OR REPLACE compatibility)
  (
    SELECT string_agg(sc."colorCode", ' ' ORDER BY sc."colorCode")
    FROM "styleColorAssignment" sca
    JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
    WHERE sca."styleId" = s."id"
      AND sca."companyId" = s."companyId"
  ) AS "colorCodes",
  (
    SELECT string_agg(sc."colorName", ' ' ORDER BY sc."colorName")
    FROM "styleColorAssignment" sca
    JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
    WHERE sca."styleId" = s."id"
      AND sca."companyId" = s."companyId"
  ) AS "colorNames",
  (
    SELECT string_agg(ss."sizeCode", ' ' ORDER BY ss."sortOrder", ss."sizeCode")
    FROM "styleSizeAssignment" ssa
    JOIN "styleSize" ss ON ss."id" = ssa."styleSizeId"
    WHERE ssa."styleId" = s."id"
      AND ssa."companyId" = s."companyId"
  ) AS "sizeCodes"
FROM "style" s
INNER JOIN latest_items li ON li."readableId" = s."id" AND li."companyId" = s."companyId"
LEFT JOIN item_revisions ir ON ir."readableId" = li."readableId" AND ir."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

-- 2. Drop the now-unreferenced itemId column and its constraints/index.
ALTER TABLE "style" DROP CONSTRAINT IF EXISTS "style_itemId_key";
ALTER TABLE "style" DROP CONSTRAINT IF EXISTS "style_itemId_fkey";
DROP INDEX IF EXISTS "style_itemId_idx";
ALTER TABLE "style" DROP COLUMN IF EXISTS "itemId";

-- 3. Update the item-insert interceptor (added in 20260727164338) to stop
--    populating itemId. Style is now keyed by readableId, so revisions share
--    the single row and the ON CONFLICT DO NOTHING is the correct no-op.
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

  INSERT INTO "style" ("id", "companyId", "createdBy")
  VALUES (
    p_new->>'readableId',
    p_new->>'companyId',
    p_new->>'createdBy'
  )
  ON CONFLICT ("id", "companyId") DO NOTHING;
END;
$$;

COMMIT;
