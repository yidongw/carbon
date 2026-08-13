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

-- itemRevisions: the per-readableId revision list, keyed by (readableId, companyId,
-- type), so the item lists (Parts/Tools/Materials show a revision switcher) can
-- fetch it for just the current page instead of the views building a json_agg CTE
-- for the whole tenant. Shape is {id, revision} — the only fields the tables read.
-- Field-verified against the parts/materials/tools views (0 mismatches).
CREATE VIEW "itemRevisions" WITH (SECURITY_INVOKER=true) AS
SELECT
  i."readableId",
  i."companyId",
  i.type,
  json_agg(
    json_build_object('id', i.id, 'revision', i.revision)
    ORDER BY
      (CASE WHEN i.revision = '0'::text OR i.revision = ''::text OR i.revision IS NULL THEN 0 ELSE 1 END),
      i."createdAt"
  ) AS revisions
FROM item i
GROUP BY i."readableId", i."companyId", i.type;

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

-- Parts / Tools / Materials / Consumables: recreate lean, dropping the
-- item_revisions CTE (revisions is now fetched per-page via itemRevisions).
-- Consumables also drops its correlated `attributes` subquery (now via
-- itemAttributes). `supplierIds` (supplier filter) and `externalId` are kept.
-- None of these views have dependents.
DROP VIEW "parts";
CREATE VIEW "parts" WITH (SECURITY_INVOKER=true) AS
 WITH latest_items AS (
         SELECT DISTINCT ON (i."readableId", i."companyId") i.id,
            i."readableId",
            i.name,
            i.description,
            i.type,
            i."replenishmentSystem",
            i."defaultMethodType",
            i."itemTrackingType",
            i."unitOfMeasureCode",
            i.active,
            i."companyId",
            i."createdBy",
            i."createdAt",
            i."updatedBy",
            i."updatedAt",
            i.assignee,
            i."modelUploadId",
            i."thumbnailPath",
            i.notes,
            i."trackingMethod",
            i.embedding,
            i.revision,
            i."readableIdWithRevision",
            i."requiresInspection",
            i."sourcingType",
            mu.id AS "modelUploadId",
            mu."modelPath",
            mu."thumbnailPath" AS "modelThumbnailPath",
            mu.name AS "modelName",
            mu.size AS "modelSize"
           FROM item i
             LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
          WHERE i.type = 'Part'::"itemType"
          ORDER BY i."readableId", i."companyId", (
                CASE
                    WHEN i.revision = '0'::text OR i.revision = ''::text OR i.revision IS NULL THEN 0
                    ELSE 1
                END) DESC, i."createdAt" DESC NULLS LAST
        )
 SELECT li.active,
    li.assignee,
    li."defaultMethodType",
    li."sourcingType",
    li.description,
    li."itemTrackingType",
    li.name,
    li."replenishmentSystem",
    li."unitOfMeasureCode",
    li.notes,
    li.revision,
    li."readableId",
    li."readableIdWithRevision",
    li.id,
    li."companyId",
        CASE
            WHEN li."thumbnailPath" IS NULL AND li."modelThumbnailPath" IS NOT NULL THEN li."modelThumbnailPath"
            ELSE li."thumbnailPath"
        END AS "thumbnailPath",
    li."modelPath",
    li."modelName",
    li."modelSize",
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    p."customFields",
    p.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN eim.metadata IS NOT NULL THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE eim."externalId" IS NOT NULL OR eim.metadata IS NOT NULL), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE eim."entityType" = 'item'::text AND eim."entityId" = li.id) AS "externalId",
    li."createdBy",
    li."createdAt",
    li."updatedBy",
    li."updatedAt",
    p."templateId",
    tmpl.name AS "templateName"
   FROM part p
     JOIN latest_items li(id, "readableId", name, description, type, "replenishmentSystem", "defaultMethodType", "itemTrackingType", "unitOfMeasureCode", active, "companyId", "createdBy", "createdAt", "updatedBy", "updatedAt", assignee, "modelUploadId", "thumbnailPath", notes, "trackingMethod", embedding, revision, "readableIdWithRevision", "requiresInspection", "sourcingType", "modelUploadId_1", "modelPath", "modelThumbnailPath", "modelName", "modelSize") ON li."readableId" = p.id AND li."companyId" = p."companyId"
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON ps."itemId" = li.id AND ps."companyId" = li."companyId"
     LEFT JOIN "unitOfMeasure" uom ON uom.code = li."unitOfMeasureCode" AND uom."companyId" = li."companyId"
     LEFT JOIN "itemCost" ic ON ic."itemId" = li.id
     LEFT JOIN template tmpl ON tmpl.id = p."templateId";

DROP VIEW "tools";
CREATE VIEW "tools" WITH (SECURITY_INVOKER=true) AS
 WITH latest_items AS (
         SELECT DISTINCT ON (i."readableId", i."companyId") i.id,
            i."readableId",
            i.name,
            i.description,
            i.type,
            i."replenishmentSystem",
            i."defaultMethodType",
            i."itemTrackingType",
            i."unitOfMeasureCode",
            i.active,
            i."companyId",
            i."createdBy",
            i."createdAt",
            i."updatedBy",
            i."updatedAt",
            i.assignee,
            i."modelUploadId",
            i."thumbnailPath",
            i.notes,
            i."trackingMethod",
            i.embedding,
            i.revision,
            i."readableIdWithRevision",
            i."requiresInspection",
            i."sourcingType",
            mu.id AS "modelUploadId",
            mu."modelPath",
            mu."thumbnailPath" AS "modelThumbnailPath",
            mu.name AS "modelName",
            mu.size AS "modelSize"
           FROM item i
             LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
          WHERE i.type = 'Tool'::"itemType"
          ORDER BY i."readableId", i."companyId", (
                CASE
                    WHEN i.revision = '0'::text OR i.revision = ''::text OR i.revision IS NULL THEN 0
                    ELSE 1
                END) DESC, i."createdAt" DESC NULLS LAST
        )
 SELECT li.active,
    li.assignee,
    li."defaultMethodType",
    li."sourcingType",
    li.description,
    li."itemTrackingType",
    li.name,
    li."replenishmentSystem",
    li."unitOfMeasureCode",
    li.notes,
    li.revision,
    li."readableId",
    li."readableIdWithRevision",
    li.id,
    li."companyId",
        CASE
            WHEN li."thumbnailPath" IS NULL AND li."modelThumbnailPath" IS NOT NULL THEN li."modelThumbnailPath"
            ELSE li."thumbnailPath"
        END AS "thumbnailPath",
    li."modelPath",
    li."modelName",
    li."modelSize",
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    t."customFields",
    t.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN eim.metadata IS NOT NULL THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE eim."externalId" IS NOT NULL OR eim.metadata IS NOT NULL), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE eim."entityType" = 'item'::text AND eim."entityId" = li.id) AS "externalId",
    li."createdBy",
    li."createdAt",
    li."updatedBy",
    li."updatedAt"
   FROM tool t
     JOIN latest_items li(id, "readableId", name, description, type, "replenishmentSystem", "defaultMethodType", "itemTrackingType", "unitOfMeasureCode", active, "companyId", "createdBy", "createdAt", "updatedBy", "updatedAt", assignee, "modelUploadId", "thumbnailPath", notes, "trackingMethod", embedding, revision, "readableIdWithRevision", "requiresInspection", "sourcingType", "modelUploadId_1", "modelPath", "modelThumbnailPath", "modelName", "modelSize") ON li."readableId" = t.id AND li."companyId" = t."companyId"
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON ps."itemId" = li.id AND ps."companyId" = li."companyId"
     LEFT JOIN "unitOfMeasure" uom ON uom.code = li."unitOfMeasureCode" AND uom."companyId" = li."companyId"
     LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

DROP VIEW "materials";
CREATE VIEW "materials" WITH (SECURITY_INVOKER=true) AS
 WITH latest_items AS (
         SELECT DISTINCT ON (i_1."readableId", i_1."companyId") i_1.id,
            i_1."readableId",
            i_1.name,
            i_1.description,
            i_1.type,
            i_1."replenishmentSystem",
            i_1."defaultMethodType",
            i_1."itemTrackingType",
            i_1."unitOfMeasureCode",
            i_1.active,
            i_1."companyId",
            i_1."createdBy",
            i_1."createdAt",
            i_1."updatedBy",
            i_1."updatedAt",
            i_1.assignee,
            i_1."modelUploadId",
            i_1."thumbnailPath",
            i_1.notes,
            i_1."trackingMethod",
            i_1.embedding,
            i_1.revision,
            i_1."readableIdWithRevision",
            i_1."requiresInspection",
            i_1."sourcingType",
            mu_1."modelPath",
            mu_1."thumbnailPath" AS "modelThumbnailPath",
            mu_1.name AS "modelName",
            mu_1.size AS "modelSize"
           FROM item i_1
             LEFT JOIN "modelUpload" mu_1 ON mu_1.id = i_1."modelUploadId"
          WHERE i_1.type = 'Material'::"itemType"
          ORDER BY i_1."readableId", i_1."companyId", (
                CASE
                    WHEN i_1.revision = '0'::text OR i_1.revision = ''::text OR i_1.revision IS NULL THEN 0
                    ELSE 1
                END) DESC, i_1."createdAt" DESC NULLS LAST
        )
 SELECT i.active,
    i.assignee,
    i."defaultMethodType",
    i.description,
    i."itemTrackingType",
    i.name,
    i."replenishmentSystem",
    i."unitOfMeasureCode",
    i.notes,
    i.revision,
    i."readableId",
    i."readableIdWithRevision",
    i.id,
    i."companyId",
        CASE
            WHEN i."thumbnailPath" IS NULL AND i."modelThumbnailPath" IS NOT NULL THEN i."modelThumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i."modelUploadId",
    i."modelPath",
    i."modelName",
    i."modelSize",
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    mf.name AS "materialForm",
    ms.name AS "materialSubstance",
    md.name AS dimensions,
    mfin.name AS finish,
    mg.name AS grade,
    mt.name AS "materialType",
    m."materialSubstanceId",
    m."materialFormId",
    m."customFields",
    m.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN eim.metadata IS NOT NULL THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE eim."externalId" IS NOT NULL OR eim.metadata IS NOT NULL), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE eim."entityType" = 'item'::text AND eim."entityId" = i.id) AS "externalId",
    i."createdBy",
    i."createdAt",
    i."updatedBy",
    i."updatedAt",
    m."gradeId",
    m."dimensionId",
    m."finishId",
    m."materialTypeId"
   FROM material m
     JOIN latest_items i ON i."readableId" = m.id AND i."companyId" = m."companyId"
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON ps."itemId" = i.id AND ps."companyId" = i."companyId"
     LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
     LEFT JOIN "unitOfMeasure" uom ON uom.code = i."unitOfMeasureCode" AND uom."companyId" = i."companyId"
     LEFT JOIN "materialForm" mf ON mf.id = m."materialFormId"
     LEFT JOIN "materialSubstance" ms ON ms.id = m."materialSubstanceId"
     LEFT JOIN "materialDimension" md ON m."dimensionId" = md.id
     LEFT JOIN "materialFinish" mfin ON m."finishId" = mfin.id
     LEFT JOIN "materialGrade" mg ON m."gradeId" = mg.id
     LEFT JOIN "materialType" mt ON m."materialTypeId" = mt.id
     LEFT JOIN "itemCost" ic ON ic."itemId" = i.id;

DROP VIEW "consumables";
CREATE VIEW "consumables" WITH (SECURITY_INVOKER=true) AS
 WITH latest_items AS (
         SELECT DISTINCT ON (i."readableId", i."companyId") i.id,
            i."readableId",
            i.name,
            i.description,
            i.type,
            i."replenishmentSystem",
            i."defaultMethodType",
            i."itemTrackingType",
            i."unitOfMeasureCode",
            i.active,
            i."companyId",
            i."createdBy",
            i."createdAt",
            i."updatedBy",
            i."updatedAt",
            i.assignee,
            i."modelUploadId",
            i."thumbnailPath",
            i.notes,
            i."trackingMethod",
            i.embedding,
            i.revision,
            i."readableIdWithRevision",
            i."requiresInspection",
            i."sourcingType",
            i."attributeSetId",
            mu."modelPath",
            mu."thumbnailPath" AS "modelThumbnailPath",
            mu.name AS "modelName",
            mu.size AS "modelSize"
           FROM item i
             LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
          WHERE i.type = 'Consumable'::"itemType" AND NOT (EXISTS ( SELECT 1
                   FROM "itemVariant" iv
                  WHERE iv."variantItemId" = i.id))
          ORDER BY i."readableId", i."companyId", (
                CASE
                    WHEN i.revision = '0'::text OR i.revision = ''::text OR i.revision IS NULL THEN 0
                    ELSE 1
                END) DESC, i."createdAt" DESC NULLS LAST
        )
 SELECT li.active,
    li.assignee,
    li."defaultMethodType",
    li.description,
    li."itemTrackingType",
    li.name,
    li."replenishmentSystem",
    li."unitOfMeasureCode",
    li.notes,
    li.revision,
    li."readableId",
    li."readableIdWithRevision",
    li.id,
    li."companyId",
        CASE
            WHEN li."thumbnailPath" IS NULL AND li."modelThumbnailPath" IS NOT NULL THEN li."modelThumbnailPath"
            ELSE li."thumbnailPath"
        END AS "thumbnailPath",
    li."modelUploadId",
    li."modelPath",
    li."modelName",
    li."modelSize",
    li."attributeSetId",
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    c."customFields",
    c.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN eim.metadata IS NOT NULL THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE eim."externalId" IS NOT NULL OR eim.metadata IS NOT NULL), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE eim."entityType" = 'item'::text AND eim."entityId" = li.id) AS "externalId",
    li."createdBy",
    li."createdAt",
    li."updatedBy",
    li."updatedAt"
   FROM consumable c
     JOIN latest_items li ON li."readableId" = c.id AND li."companyId" = c."companyId"
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON ps."itemId" = li.id AND ps."companyId" = li."companyId"
     LEFT JOIN "unitOfMeasure" uom ON uom.code = li."unitOfMeasureCode" AND uom."companyId" = li."companyId"
     LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

NOTIFY pgrst, 'reload schema';
