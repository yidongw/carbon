-- =============================================================================
-- Style Samples (样衣) — inventory location tracking
--
-- A "sample" is a physical sample garment for a style. We model it as ONE hidden
-- serial-tracked companion item per style (itemType = 'Sample'), and each
-- physical sample garment is one serial unit (trackedEntity) under that item,
-- tagged with {color, size} in its attributes. Location is tracked through the
-- existing itemLedger / trackedEntity / traceability system.
--
-- This migration adds:
--   1. the 'Sample' itemType (so sample items can be excluded from every picker
--      with a single `type != 'Sample'` predicate on the shared item store).
--   2. the "styleSample" extension table linking a companion sample item -> style.
--   3. the "styleSamples" view (styles + per-style sample count) backing the
--      Samples list page.
--
-- No new item interceptor is needed: the generic sync_create_item_related_records
-- (itemCost/itemReplenishment/...) is type-agnostic, and the make-method / style
-- interceptors already key on their own types so they skip 'Sample'.
-- =============================================================================

-- ALTER TYPE ... ADD VALUE cannot be used in the same transaction it is added,
-- so commit the enum change before the rest (mirrors 20260706140833_style-foundation).
ALTER TYPE "itemType" ADD VALUE IF NOT EXISTS 'Sample';

COMMIT;
BEGIN;

-- One row per companion sample item; links it back to its style.
CREATE TABLE "styleSample" (
  "itemId" TEXT NOT NULL,
  "styleId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "styleSample_pkey" PRIMARY KEY ("itemId"),
  CONSTRAINT "styleSample_itemId_unique" UNIQUE ("itemId"),
  -- one companion sample item per style
  CONSTRAINT "styleSample_styleId_companyId_key" UNIQUE ("styleId", "companyId"),
  CONSTRAINT "styleSample_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "styleSample_styleId_companyId_fkey"
    FOREIGN KEY ("styleId", "companyId") REFERENCES "style"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "styleSample_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "styleSample_styleId_idx" ON "styleSample" ("styleId", "companyId");
CREATE INDEX "styleSample_companyId_idx" ON "styleSample" ("companyId");

ALTER TABLE "styleSample" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view style samples" ON "styleSample"
  FOR SELECT
  USING (
    "companyId" = ANY(
      SELECT "companyId" FROM "userToCompany" WHERE "userId" = (SELECT auth.uid())::text
    )
  );

CREATE POLICY "Employees with parts_create can insert style samples" ON "styleSample"
  FOR INSERT
  WITH CHECK (has_company_permission('parts_create', "companyId"));

CREATE POLICY "Employees with parts_update can update style samples" ON "styleSample"
  FOR UPDATE
  USING (has_company_permission('parts_update', "companyId"));

CREATE POLICY "Employees with parts_delete can delete style samples" ON "styleSample"
  FOR DELETE
  USING (has_company_permission('parts_delete', "companyId"));

-- Styles + per-style sample count. Built on top of the existing "styles" view so
-- it inherits the latest-revision resolution, color/size aggregation, etc.
-- NOTE: styles."id" is the per-revision item id, while styleSample."styleId"
-- (like styleColorAssignment) is the style readableId (= style.id). Join on
-- s."readableId", NOT s."id".
CREATE OR REPLACE VIEW "styleSamples" WITH (SECURITY_INVOKER=true) AS
SELECT
  s.*,
  ss."itemId" AS "sampleItemId",
  COALESCE(te."sampleCount", 0) AS "sampleCount",
  COALESCE(te."sampledColorCount", 0) AS "sampledColorCount",
  COALESCE(te."samples", '[]'::json) AS "samples"
FROM "styles" s
LEFT JOIN "styleSample" ss
  ON ss."styleId" = s."readableId" AND ss."companyId" = s."companyId"
LEFT JOIN LATERAL (
  SELECT
    sum(g."qty") AS "sampleCount",
    count(DISTINCT g."colorCode") AS "sampledColorCount",
    json_agg(
      json_build_object(
        'colorCode', g."colorCode",
        'colorName', g."colorName",
        'size', g."size",
        'quantity', g."qty"
      ) ORDER BY g."colorCode", g."size"
    ) AS "samples"
  FROM (
    SELECT
      t."attributes"->>'Color' AS "colorCode",
      COALESCE(sc."colorName", t."attributes"->>'Color') AS "colorName",
      t."attributes"->>'Size' AS "size",
      count(*)::int AS "qty"
    FROM "trackedEntity" t
    LEFT JOIN "styleColor" sc
      ON sc."colorCode" = t."attributes"->>'Color'
      AND sc."companyId" = t."companyId"
    WHERE t."sourceDocument" = 'Item'
      AND t."sourceDocumentId" = ss."itemId"
      AND t."companyId" = s."companyId"
    GROUP BY 1, 2, 3
  ) g
) te ON true;

COMMIT;
