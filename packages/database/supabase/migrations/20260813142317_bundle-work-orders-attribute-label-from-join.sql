-- Rebuild bundleWorkOrders: derive attributeLabel from the stable
-- itemVariantAttribute join (ordered by attribute sortOrder) instead of the
-- mutable, code-derived iv."valuesKey" string. Everything else is unchanged from
-- 20260811091337_drop-bundle-reported-quantity.sql; iv."valuesKey" is still
-- selected as a column for backwards compatibility.

DROP VIEW IF EXISTS "bundleWorkOrders";

CREATE VIEW "bundleWorkOrders" WITH (security_invoker=true) AS
SELECT
  bwo."id",
  bwo."masterWorkOrderId",
  bwo."jobId",
  bwo."companyId",
  bwo."sequence",
  bwo."createdAt",
  bwo."createdBy",
  bwo."updatedAt",
  bwo."updatedBy",
  bwo."tags",
  j."jobId" AS "jobReadableId",
  j."status",
  j."quantity",
  j."dueDate",
  j."itemId",
  i."readableIdWithRevision",
  i."name" AS "itemName",
  j."assignee",
  j."quantityComplete",
  j."assignedAt",
  (
    SELECT count(*)
    FROM "jobOperation" jo
    WHERE jo."jobId" = bwo."jobId"
  )::integer AS "processCount",
  j."scrapQuantity",
  j."storageUnitId",
  j."locationId",
  j."salesOrderId",
  j."salesOrderLineId",
  iv."valuesKey",
  COALESCE(
    NULLIF((
      SELECT string_agg(
        COALESCE(iav."name", iav."code"),
        ' · '
        ORDER BY ia."sortOrder", ia."code"
      )
      FROM "itemVariantAttribute" iva
      JOIN "itemAttribute" ia ON ia."id" = iva."attributeId"
      JOIN "itemAttributeValue" iav ON iav."id" = iva."attributeValueId"
      WHERE iva."itemVariantId" = iv."id"
        AND iva."companyId" = bwo."companyId"
    ), ''),
    i."name",
    i."readableIdWithRevision"
  ) AS "attributeLabel",
  COALESCE((
    SELECT jsonb_object_agg(ia."code", COALESCE(iav."name", iav."code"))
    FROM "itemVariantAttribute" iva
    JOIN "itemAttribute" ia ON ia."id" = iva."attributeId"
    JOIN "itemAttributeValue" iav ON iav."id" = iva."attributeValueId"
    WHERE iva."itemVariantId" = iv."id"
      AND iva."companyId" = bwo."companyId"
  ), '{}'::jsonb) AS "attributeValues"
FROM "bundleWorkOrder" bwo
JOIN "job" j ON j."id" = bwo."jobId"
LEFT JOIN "item" i
  ON i."id" = j."itemId" AND i."companyId" = j."companyId"
LEFT JOIN "itemVariant" iv
  ON iv."variantItemId" = j."itemId" AND iv."companyId" = j."companyId";

NOTIFY pgrst, 'reload schema';
