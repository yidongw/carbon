-- The styleSamples view aggregated EVERY tracked entity of the sample companion
-- item by Color/Size. A unit that got a serial without a color+size — e.g. one
-- received on a receipt (samples are selectable items now) or minted via the
-- serial "generate" button — has null attributes and showed up as a bogus
-- "NULL · NULL" sample variant. Such a unit is just inventory of the sample
-- item, not a sample variant, so exclude it from the samples aggregation.
BEGIN;

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
      -- Real sample variants only: skip units with no color/size (not a variant).
      AND COALESCE(t."attributes"->>'Color', '') <> ''
      AND COALESCE(t."attributes"->>'Size', '') <> ''
    GROUP BY 1, 2, 3
  ) g
) te ON true;

COMMIT;
