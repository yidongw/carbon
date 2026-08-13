-- Backfill: stamp the stable variantItemId onto each cell of the 10 persisted
-- variantQuantities grids, matching cell.valuesKey -> itemVariant.variantItemId
-- under the row's PARENT item id. Readers already prefer variantItemId over the
-- mutable valuesKey; this makes existing data match the new writer output.
--
-- Safety properties:
--   * Guarded  — only rows whose target JSONB has a `variantTable` array are touched.
--   * Idempotent — cells already carrying a variantItemId are left as-is.
--   * Lossless  — a cell whose valuesKey has no matching variant is left unchanged
--                 (still matchable by valuesKey), so no quantity is ever dropped.
--
-- Parent-item resolution:
--   * Job-linked tables normalize job.itemId up through itemVariant (job.itemId can
--     be the CHILD variant SKU for garment/bundle jobs), exactly like
--     resolveStyleMethodItemId.
--   * Inventory/document lines store the PARENT Style as their own itemId;
--     normalizing is harmless (a true parent has no itemVariant row -> itself).
--
-- Legacy `configTable` key: writers normalize configTable -> variantTable, so
-- current rows use variantTable. Any residual configTable-only rows are simply
-- not stamped here and keep matching by valuesKey (lossless).

CREATE OR REPLACE FUNCTION pg_temp.bf_parent(_itemId text, _companyId text)
RETURNS text LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    (SELECT iv."parentItemId"
       FROM "itemVariant" iv
      WHERE iv."variantItemId" = _itemId
        AND iv."companyId" = _companyId),
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

-- --- Job-linked: productionQuantity ---
UPDATE "productionQuantity" t
SET "variantQuantities" = jsonb_set(
  t."variantQuantities", '{variantTable}',
  pg_temp.bf_stamp(
    t."variantQuantities"->'variantTable',
    pg_temp.bf_parent(
      (SELECT j."itemId" FROM "jobOperation" jo
         JOIN "job" j ON j."id" = jo."jobId"
        WHERE jo."id" = t."jobOperationId"),
      t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'variantTable') = 'array';

-- --- Job-linked: jobOperationPickup ---
UPDATE "jobOperationPickup" t
SET "variantQuantities" = jsonb_set(
  t."variantQuantities", '{variantTable}',
  pg_temp.bf_stamp(
    t."variantQuantities"->'variantTable',
    pg_temp.bf_parent(
      (SELECT j."itemId" FROM "jobOperation" jo
         JOIN "job" j ON j."id" = jo."jobId"
        WHERE jo."id" = t."jobOperationId"),
      t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'variantTable') = 'array';

-- --- Job-linked: jobOperationSupplierPickup ---
UPDATE "jobOperationSupplierPickup" t
SET "variantQuantities" = jsonb_set(
  t."variantQuantities", '{variantTable}',
  pg_temp.bf_stamp(
    t."variantQuantities"->'variantTable',
    pg_temp.bf_parent(
      (SELECT j."itemId" FROM "jobOperation" jo
         JOIN "job" j ON j."id" = jo."jobId"
        WHERE jo."id" = t."jobOperationId"),
      t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'variantTable') = 'array';

-- --- Job-linked: jobOperationSupplierQuantity ---
UPDATE "jobOperationSupplierQuantity" t
SET "variantQuantities" = jsonb_set(
  t."variantQuantities", '{variantTable}',
  pg_temp.bf_stamp(
    t."variantQuantities"->'variantTable',
    pg_temp.bf_parent(
      (SELECT j."itemId" FROM "jobOperation" jo
         JOIN "job" j ON j."id" = jo."jobId"
        WHERE jo."id" = t."jobOperationId"),
      t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'variantTable') = 'array';

-- --- Report snapshot: productionQuantityReport (row carries jobId directly) ---
UPDATE "productionQuantityReport" t
SET "originalVariantTable" = jsonb_set(
  t."originalVariantTable", '{variantTable}',
  pg_temp.bf_stamp(
    t."originalVariantTable"->'variantTable',
    pg_temp.bf_parent(
      (SELECT j."itemId" FROM "job" j WHERE j."id" = t."jobId"),
      t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."originalVariantTable"->'variantTable') = 'array';

-- --- Report snapshot: jobOperationSupplierQuantityReport (carries jobId) ---
UPDATE "jobOperationSupplierQuantityReport" t
SET "originalVariantTable" = jsonb_set(
  t."originalVariantTable", '{variantTable}',
  pg_temp.bf_stamp(
    t."originalVariantTable"->'variantTable',
    pg_temp.bf_parent(
      (SELECT j."itemId" FROM "job" j WHERE j."id" = t."jobId"),
      t."companyId"),
    t."companyId"))
WHERE jsonb_typeof(t."originalVariantTable"->'variantTable') = 'array';

-- --- Inventory/document lines: parent = line.itemId (normalize is harmless) ---
UPDATE "warehouseTransferLine" t
SET "variantQuantities" = jsonb_set(
  t."variantQuantities", '{variantTable}',
  pg_temp.bf_stamp(t."variantQuantities"->'variantTable',
    pg_temp.bf_parent(t."itemId", t."companyId"), t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'variantTable') = 'array';

UPDATE "stockTransferLine" t
SET "variantQuantities" = jsonb_set(
  t."variantQuantities", '{variantTable}',
  pg_temp.bf_stamp(t."variantQuantities"->'variantTable',
    pg_temp.bf_parent(t."itemId", t."companyId"), t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'variantTable') = 'array';

UPDATE "shipmentLine" t
SET "variantQuantities" = jsonb_set(
  t."variantQuantities", '{variantTable}',
  pg_temp.bf_stamp(t."variantQuantities"->'variantTable',
    pg_temp.bf_parent(t."itemId", t."companyId"), t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'variantTable') = 'array';

UPDATE "receiptLine" t
SET "variantQuantities" = jsonb_set(
  t."variantQuantities", '{variantTable}',
  pg_temp.bf_stamp(t."variantQuantities"->'variantTable',
    pg_temp.bf_parent(t."itemId", t."companyId"), t."companyId"))
WHERE jsonb_typeof(t."variantQuantities"->'variantTable') = 'array';
