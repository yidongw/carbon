-- Styles list perf: stop computing per-row heavy aggregates for the whole tenant.
--
-- The styles/styleSamples views built three heavy per-row things that the list
-- had to materialize for EVERY tenant row before LIMIT:
--   * attributes     - correlated json_agg over itemAttribute*/itemAttributeValue
--   * attributeCodes - string_agg search helper, dead since search stopped using it
--   * revisions      - json_agg CTE (item_revisions) + a duplicate scan of `item`
-- The Styles/StyleSamples tables have no revision switcher, and `attributes` is
-- now fetched per-page via the new `itemAttributes` view (two-query enrichment in
-- getStyles/getStyleSamples). So drop all three from the view bodies.
--
-- `itemAttributes` is keyed by itemId (no DISTINCT ON), so the app can fetch the
-- attributes JSON for just the ~100 ids on the current page. Verified to produce
-- byte-identical JSON to the old styles.attributes column.

CREATE VIEW "itemAttributes" WITH (SECURITY_INVOKER=true) AS
SELECT
  d."itemId",
  d."companyId",
  COALESCE(json_agg(
    json_build_object(
      'attributeId', d."attrId",
      'code', d."code",
      'name', d."name",
      'values', COALESCE((
        SELECT json_agg(
          json_build_object('id', iav."id", 'code', iav."code", 'name', COALESCE(iav."name", iav."code"))
          ORDER BY iav."sortOrder", iav."code")
        FROM "itemAttributeSelection" ias2
        JOIN "itemAttributeValue" iav ON iav."id" = ias2."attributeValueId"
        WHERE ias2."itemId" = d."itemId" AND ias2."companyId" = d."companyId" AND ias2."attributeId" = d."attrId"
      ), '[]'::json)
    ) ORDER BY d."sortOrder"
  ), '[]'::json) AS "attributes"
FROM (
  SELECT DISTINCT
    ias."itemId",
    ias."companyId",
    ias."attributeId" AS "attrId",
    ia."code",
    ia."name",
    COALESCE(isa."sortOrder", 100) AS "sortOrder"
  FROM "itemAttributeSelection" ias
  JOIN "itemAttribute" ia ON ia."id" = ias."attributeId"
  LEFT JOIN "item" it ON it."id" = ias."itemId"
  LEFT JOIN "itemAttributeSetAttribute" isa
    ON isa."attributeId" = ias."attributeId" AND isa."attributeSetId" = it."attributeSetId"
) d
GROUP BY d."itemId", d."companyId";

-- styleSamples depends on styles; recreate both lean (DISTINCT ON latest-revision
-- selection and all displayed columns unchanged - only the 3 heavy columns removed).
DROP VIEW "styleSamples";
DROP VIEW "styles";

CREATE VIEW "styles" WITH (SECURITY_INVOKER=true) AS
WITH latest_items AS (
  SELECT DISTINCT ON (i."readableId", i."companyId")
    i.id, i."readableId", i.name, i.description, i.type, i."replenishmentSystem",
    i."defaultMethodType", i."itemTrackingType", i."unitOfMeasureCode", i.active,
    i."companyId", i."createdBy", i."createdAt", i."updatedBy", i."updatedAt", i.assignee,
    i."modelUploadId", i."thumbnailPath", i.notes, i."trackingMethod", i.embedding, i.revision,
    i."readableIdWithRevision", i."requiresInspection", i."sourcingType", i."attributeSetId"
  FROM item i
  WHERE i.type = 'Style'::"itemType"
    AND NOT (EXISTS (SELECT 1 FROM "itemVariant" iv WHERE iv."variantItemId" = i.id))
  ORDER BY i."readableId", i."companyId",
    (CASE WHEN i.revision = '0'::text OR i.revision = ''::text OR i.revision IS NULL THEN 0 ELSE 1 END) DESC,
    i."createdAt" DESC NULLS LAST
)
SELECT
  li.active, li.assignee, li."defaultMethodType", li."sourcingType", li.description,
  li."itemTrackingType", li.name, li."replenishmentSystem", li."unitOfMeasureCode", li.notes,
  li.revision, li."readableId", li."readableIdWithRevision", li.id, li."companyId",
  li."thumbnailPath", li."attributeSetId",
  s."customFields", s.tags, ic."itemPostingGroupId",
  li."createdBy", li."createdAt", li."updatedBy", li."updatedAt"
FROM style s
  JOIN latest_items li ON li."readableId" = s.id AND li."companyId" = s."companyId"
  LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

CREATE VIEW "styleSamples" WITH (SECURITY_INVOKER=true) AS
SELECT
  s.active, s.assignee, s."defaultMethodType", s."sourcingType", s.description, s."itemTrackingType",
  s.name, s."replenishmentSystem", s."unitOfMeasureCode", s.notes, s.revision, s."readableId",
  s."readableIdWithRevision", s.id, s."companyId", s."thumbnailPath", s."attributeSetId",
  s."customFields", s.tags, s."itemPostingGroupId", s."createdBy", s."createdAt", s."updatedBy", s."updatedAt",
  ss."itemId" AS "sampleItemId",
  COALESCE(te."sampleCount", 0::bigint) AS "sampleCount",
  COALESCE(te."sampledVariantCount", 0::bigint) AS "sampledVariantCount",
  COALESCE(te.samples, '[]'::json) AS samples
FROM styles s
  LEFT JOIN "styleSample" ss ON ss."styleId" = s."readableId" AND ss."companyId" = s."companyId"
  LEFT JOIN LATERAL (
    SELECT
      sum(g.qty) AS "sampleCount",
      count(*) AS "sampledVariantCount",
      json_agg(json_build_object('label', g.label, 'attributes', g.attributes, 'quantity', g.qty) ORDER BY g.label) AS samples
    FROM (
      SELECT
        pa."productAttributes" AS attributes,
        COALESCE((SELECT string_agg(kv.value, ' · '::text ORDER BY kv.key)
                  FROM jsonb_each_text(pa."productAttributes") kv(key, value)), ''::text) AS label,
        count(*)::integer AS qty
      FROM "trackedEntity" t
        CROSS JOIN LATERAL (
          SELECT COALESCE((SELECT jsonb_object_agg(kv.key, to_jsonb(kv.value))
                           FROM jsonb_each_text(COALESCE(t.attributes, '{}'::jsonb)) kv(key, value)
                           WHERE (EXISTS (SELECT 1 FROM "itemAttribute" ia
                                          WHERE ia.code = kv.key AND (ia."companyId" = t."companyId" OR ia."companyId" IS NULL)))),
                          '{}'::jsonb) AS "productAttributes"
        ) pa
      WHERE t."sourceDocument" = 'Item'::text
        AND t."sourceDocumentId" = ss."itemId"
        AND t."companyId" = s."companyId"
        AND pa."productAttributes" <> '{}'::jsonb
      GROUP BY pa."productAttributes"
    ) g
  ) te ON true;

NOTIFY pgrst, 'reload schema';
