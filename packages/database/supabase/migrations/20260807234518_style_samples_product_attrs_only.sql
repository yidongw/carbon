-- styleSamples: group/label by product attribute codes only.
-- trackedEntity.attributes also carries Receipt/Shipment/etc. system keys;
-- dumping the full bag produced chips like "BK · REC_… · SH_… · L".

DROP VIEW IF EXISTS "styleSamples";
CREATE VIEW "styleSamples" WITH (SECURITY_INVOKER=true) AS
SELECT
  s.*,
  ss."itemId" AS "sampleItemId",
  COALESCE(te."sampleCount", 0) AS "sampleCount",
  COALESCE(te."sampledVariantCount", 0) AS "sampledColorCount",
  COALESCE(te."samples", '[]'::json) AS "samples"
FROM "styles" s
LEFT JOIN "styleSample" ss
  ON ss."styleId" = s."readableId" AND ss."companyId" = s."companyId"
LEFT JOIN LATERAL (
  SELECT
    sum(g."qty") AS "sampleCount",
    count(*) AS "sampledVariantCount",
    json_agg(
      json_build_object(
        'label', g."label",
        'attributes', g."attributes",
        'quantity', g."qty"
      ) ORDER BY g."label"
    ) AS "samples"
  FROM (
    SELECT
      pa."productAttributes" AS "attributes",
      COALESCE(
        (
          SELECT string_agg(kv.value, ' · ' ORDER BY kv.key)
          FROM jsonb_each_text(pa."productAttributes") AS kv(key, value)
        ),
        ''
      ) AS "label",
      count(*)::int AS "qty"
    FROM "trackedEntity" t
    CROSS JOIN LATERAL (
      SELECT COALESCE(
        (
          SELECT jsonb_object_agg(kv.key, to_jsonb(kv.value))
          FROM jsonb_each_text(COALESCE(t."attributes", '{}'::jsonb)) AS kv(key, value)
          WHERE EXISTS (
            SELECT 1
            FROM "itemAttribute" ia
            WHERE ia."code" = kv.key
              AND (ia."companyId" = t."companyId" OR ia."companyId" IS NULL)
          )
        ),
        '{}'::jsonb
      ) AS "productAttributes"
    ) pa
    WHERE t."sourceDocument" = 'Item'
      AND t."sourceDocumentId" = ss."itemId"
      AND t."companyId" = s."companyId"
      AND pa."productAttributes" <> '{}'::jsonb
    GROUP BY pa."productAttributes"
  ) g
) te ON true;
