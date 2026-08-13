-- Migrate any remaining legacy `configTable` grids onto the current `variantTable`
-- key (stamped with variantItemId), then drop the `configTable` key. After this,
-- no stored blob uses `configTable`, so the transitional dual-read can be removed
-- from the app. variantTable wins when both keys are present (matches the wire's
-- normalizeVariantQuantitiesPayload). Idempotent + lossless (same bf_stamp rules
-- as 20260813142708).

CREATE OR REPLACE FUNCTION pg_temp.bf_parent(_itemId text, _companyId text)
RETURNS text LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    (SELECT iv."parentItemId" FROM "itemVariant" iv
      WHERE iv."variantItemId" = _itemId AND iv."companyId" = _companyId),
    _itemId);
$$;

CREATE OR REPLACE FUNCTION pg_temp.bf_stamp(_tbl jsonb, _parentItemId text, _companyId text)
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    jsonb_agg(
      CASE
        WHEN NULLIF(e.elem->>'variantItemId','') IS NOT NULL THEN e.elem
        WHEN iv."variantItemId" IS NOT NULL
          THEN e.elem || jsonb_build_object('variantItemId', iv."variantItemId")
        ELSE e.elem
      END
      ORDER BY e.ord
    ),
    '[]'::jsonb
  )
  FROM jsonb_array_elements(_tbl) WITH ORDINALITY AS e(elem, ord)
  LEFT JOIN "itemVariant" iv
    ON iv."parentItemId" = _parentItemId
   AND iv."valuesKey" = (e.elem->>'valuesKey')
   AND iv."companyId" = _companyId;
$$;

-- Promote configTable -> variantTable (variantTable wins if present), stamp, drop configTable.
-- Job-linked: parent = norm(job.itemId).
UPDATE "productionQuantity" t
SET "variantQuantities" = jsonb_set(t."variantQuantities" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(
    COALESCE(CASE WHEN jsonb_typeof(t."variantQuantities"->'variantTable')='array' THEN t."variantQuantities"->'variantTable' END, t."variantQuantities"->'configTable'),
    pg_temp.bf_parent((SELECT j."itemId" FROM "jobOperation" jo JOIN "job" j ON j."id"=jo."jobId" WHERE jo."id"=t."jobOperationId"), t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'configTable')='array';

UPDATE "jobOperationPickup" t
SET "variantQuantities" = jsonb_set(t."variantQuantities" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(
    COALESCE(CASE WHEN jsonb_typeof(t."variantQuantities"->'variantTable')='array' THEN t."variantQuantities"->'variantTable' END, t."variantQuantities"->'configTable'),
    pg_temp.bf_parent((SELECT j."itemId" FROM "jobOperation" jo JOIN "job" j ON j."id"=jo."jobId" WHERE jo."id"=t."jobOperationId"), t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'configTable')='array';

UPDATE "jobOperationSupplierPickup" t
SET "variantQuantities" = jsonb_set(t."variantQuantities" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(
    COALESCE(CASE WHEN jsonb_typeof(t."variantQuantities"->'variantTable')='array' THEN t."variantQuantities"->'variantTable' END, t."variantQuantities"->'configTable'),
    pg_temp.bf_parent((SELECT j."itemId" FROM "jobOperation" jo JOIN "job" j ON j."id"=jo."jobId" WHERE jo."id"=t."jobOperationId"), t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'configTable')='array';

UPDATE "jobOperationSupplierQuantity" t
SET "variantQuantities" = jsonb_set(t."variantQuantities" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(
    COALESCE(CASE WHEN jsonb_typeof(t."variantQuantities"->'variantTable')='array' THEN t."variantQuantities"->'variantTable' END, t."variantQuantities"->'configTable'),
    pg_temp.bf_parent((SELECT j."itemId" FROM "jobOperation" jo JOIN "job" j ON j."id"=jo."jobId" WHERE jo."id"=t."jobOperationId"), t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'configTable')='array';

-- Report snapshots: parent = norm(job.itemId), row carries jobId.
UPDATE "productionQuantityReport" t
SET "originalVariantTable" = jsonb_set(t."originalVariantTable" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(
    COALESCE(CASE WHEN jsonb_typeof(t."originalVariantTable"->'variantTable')='array' THEN t."originalVariantTable"->'variantTable' END, t."originalVariantTable"->'configTable'),
    pg_temp.bf_parent((SELECT j."itemId" FROM "job" j WHERE j."id"=t."jobId"), t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."originalVariantTable"->'configTable')='array';

UPDATE "jobOperationSupplierQuantityReport" t
SET "originalVariantTable" = jsonb_set(t."originalVariantTable" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(
    COALESCE(CASE WHEN jsonb_typeof(t."originalVariantTable"->'variantTable')='array' THEN t."originalVariantTable"->'variantTable' END, t."originalVariantTable"->'configTable'),
    pg_temp.bf_parent((SELECT j."itemId" FROM "job" j WHERE j."id"=t."jobId"), t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."originalVariantTable"->'configTable')='array';

-- Inventory/document lines: parent = norm(line.itemId).
UPDATE "warehouseTransferLine" t
SET "variantQuantities" = jsonb_set(t."variantQuantities" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(COALESCE(CASE WHEN jsonb_typeof(t."variantQuantities"->'variantTable')='array' THEN t."variantQuantities"->'variantTable' END, t."variantQuantities"->'configTable'),
    pg_temp.bf_parent(t."itemId", t."companyId"), t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'configTable')='array';

UPDATE "stockTransferLine" t
SET "variantQuantities" = jsonb_set(t."variantQuantities" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(COALESCE(CASE WHEN jsonb_typeof(t."variantQuantities"->'variantTable')='array' THEN t."variantQuantities"->'variantTable' END, t."variantQuantities"->'configTable'),
    pg_temp.bf_parent(t."itemId", t."companyId"), t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'configTable')='array';

UPDATE "shipmentLine" t
SET "variantQuantities" = jsonb_set(t."variantQuantities" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(COALESCE(CASE WHEN jsonb_typeof(t."variantQuantities"->'variantTable')='array' THEN t."variantQuantities"->'variantTable' END, t."variantQuantities"->'configTable'),
    pg_temp.bf_parent(t."itemId", t."companyId"), t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'configTable')='array';

UPDATE "receiptLine" t
SET "variantQuantities" = jsonb_set(t."variantQuantities" - 'configTable', '{variantTable}',
  pg_temp.bf_stamp(COALESCE(CASE WHEN jsonb_typeof(t."variantQuantities"->'variantTable')='array' THEN t."variantQuantities"->'variantTable' END, t."variantQuantities"->'configTable'),
    pg_temp.bf_parent(t."itemId", t."companyId"), t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'configTable')='array';
