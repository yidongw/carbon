-- Make the DB the sole owner of itemVariant.valuesKey. A trigger recomputes it
-- from itemVariantAttribute (sorted attributeValueIds, COLLATE "C") whenever a
-- variant's attribute rows change, so application code never writes it. valuesKey
-- becomes nullable so a variant row can be inserted before its attribute rows
-- (the trigger fills it in); the UNIQUE(parentItemId, valuesKey, companyId)
-- constraint still enforces one variant per attribute-combo once set (NULLs are
-- distinct, so the transient pre-attribute window can't collide).

ALTER TABLE "itemVariant" ALTER COLUMN "valuesKey" DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.set_item_variant_values_key()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  _itemVariantId text;
  _companyId text;
BEGIN
  _itemVariantId := COALESCE(NEW."itemVariantId", OLD."itemVariantId");
  _companyId := COALESCE(NEW."companyId", OLD."companyId");

  UPDATE "itemVariant" iv
  SET "valuesKey" = (
    SELECT string_agg(iva."attributeValueId", '|' ORDER BY iva."attributeId" COLLATE "C")
    FROM "itemVariantAttribute" iva
    WHERE iva."itemVariantId" = _itemVariantId
      AND iva."companyId" = _companyId
  )
  WHERE iv."id" = _itemVariantId
    AND iv."companyId" = _companyId;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS "item_variant_attribute_values_key" ON "itemVariantAttribute";
CREATE TRIGGER "item_variant_attribute_values_key"
AFTER INSERT OR UPDATE OR DELETE ON "itemVariantAttribute"
FOR EACH ROW
EXECUTE FUNCTION public.set_item_variant_values_key();

-- Reconcile any existing rows (idempotent; matches the trigger's formula).
UPDATE "itemVariant" iv
SET "valuesKey" = sub."key"
FROM (
  SELECT iva."itemVariantId", iva."companyId",
         string_agg(iva."attributeValueId", '|' ORDER BY iva."attributeId" COLLATE "C") AS "key"
  FROM "itemVariantAttribute" iva
  GROUP BY iva."itemVariantId", iva."companyId"
) sub
WHERE iv."id" = sub."itemVariantId" AND iv."companyId" = sub."companyId";

NOTIFY pgrst, 'reload schema';
