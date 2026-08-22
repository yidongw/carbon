-- Per-color "Apply on Variants" columns for the BOM/BOP.
--
-- Each BOM line (methodMaterial) and BOP operation (methodOperation) gains a
-- declarative attribute-value filter scoped to the MANUFACTURED item's own
-- variant attributes (e.g. the garment's color/size), NOT the component's.
--
--   applyOnVariantValueIds = []            -> applies to ALL variants (default)
--   applyOnVariantValueIds = ["iav_red"]   -> applies only to a target variant
--                                             whose frozen attribute values
--                                             (itemVariantAttribute) are a
--                                             SUPERSET of this set.
--
-- Size is simply never listed, so every size shares the same lines; color lines
-- diverge. The mechanism is attribute-generic (any itemAttribute). Filtering
-- happens at explosion time in get-method: non-matching lines/ops are never
-- inserted into the job/quote snapshot, so downstream (issue, backflush,
-- costing, mrp) needs no change. get_method_tree is recreated to project the
-- new column in a later migration (after #367's own recreation, so both fixes
-- survive on a fresh DB).

-- Method + template tables carry the scope authored in the BoM/BoP editors.
ALTER TABLE "methodMaterial"
  ADD COLUMN IF NOT EXISTS "applyOnVariantValueIds" JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE "methodOperation"
  ADD COLUMN IF NOT EXISTS "applyOnVariantValueIds" JSONB NOT NULL DEFAULT '[]'::jsonb;
-- Template editors write to their own mirror tables; keep them in lockstep so
-- the shared methodMaterial/methodOperation validators round-trip identically.
ALTER TABLE "templateMethodMaterial"
  ADD COLUMN IF NOT EXISTS "applyOnVariantValueIds" JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE "templateMethodOperation"
  ADD COLUMN IF NOT EXISTS "applyOnVariantValueIds" JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Snapshot of the line's scope on the exploded job material, so `recalculate`
-- can re-apply per-color scaling on a master job (otherwise it recomputes
-- estimatedQuantity = perUnit × job.quantity and clobbers the scaling). Empty =
-- unscoped → recalc uses job.quantity as before, so non-garment jobs are
-- unaffected.
ALTER TABLE "jobMaterial"
  ADD COLUMN IF NOT EXISTS "applyOnVariantValueIds" JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Optional display color (hex) for an attribute value, assigned at creation and
-- used as the chip color for per-color BOM scope. NULL falls back to the
-- generated categorical palette (e.g. for sizes with no natural color).
ALTER TABLE "itemAttributeValue" ADD COLUMN IF NOT EXISTS "color" TEXT;

-- Backfill default display colors for the standard apparel color values so
-- existing companies (e.g. on promote to staging/prod) get colored per-color
-- BOM chips instead of grey. Mapping mirrors STYLE_COLOR_DEFAULT_HEX in
-- packages/database/src/styleReference.ts (the seed uses that constant for
-- brand-new companies; this backfills existing rows). Only fills unset values —
-- never overwrites a color a company chose. Codes not listed, and all sizes,
-- stay unset and render grey.
UPDATE "itemAttributeValue" v
SET "color" = m.hex
FROM (VALUES
  ('BG', '#E4D5B7'),
  ('BK', '#111827'),
  ('BL', '#2563EB'),
  ('BN', '#92400E'),
  ('CH', '#374151'),
  ('CR', '#FBF3D9'),
  ('GR', '#16A34A'),
  ('GY', '#6B7280'),
  ('KH', '#C3B091'),
  ('LBL', '#93C5FD'),
  ('LGY', '#D1D5DB'),
  ('NV', '#1E3A8A'),
  ('OL', '#808000'),
  ('OR', '#F97316'),
  ('PK', '#EC4899'),
  ('PP', '#9333EA'),
  ('RD', '#DC2626'),
  ('WH', '#FFFFFF'),
  ('WN', '#7B1E3D'),
  ('YL', '#FACC15')
) AS m(code, hex)
WHERE v."attributeId" = 'iat_color'
  AND v.code = m.code
  AND (v."color" IS NULL OR v."color" = '');
