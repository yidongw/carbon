-- update_receipt_line_serial_tracking REPLACED a tracked entity's attributes
-- with only the receipt keys. Receiving an EXISTING serial (e.g. the inbound
-- side of a warehouse transfer, where the shipped unit already carries
-- {Color, Size, Shipment, ...}) therefore wiped its Color/Size and turned a
-- proper sample serial (111333-BK-L-1) into a config-less "NULL·NULL" unit.
--
-- Merge the receipt keys into the existing attributes instead, so Color/Size
-- (and prior document links) survive. The INSERT branch (a brand-new serial,
-- e.g. a PO receipt) is unaffected — it starts from an empty entity.
CREATE OR REPLACE FUNCTION update_receipt_line_serial_tracking(
  p_receipt_line_id TEXT,
  p_receipt_id TEXT,
  p_serial_number TEXT,
  p_index INTEGER,
  p_tracked_entity_id TEXT DEFAULT NULL,
  p_expiry_date TEXT DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_item_id            TEXT;
  v_item_readable_id   TEXT;
  v_company_id         TEXT;
  v_created_by         TEXT;
  v_supplier_id        TEXT;
  v_attributes         JSONB;
  v_resolved_expiry    DATE;
  v_expiration_date    DATE;
BEGIN
  SELECT
    rl."itemId",
    i."readableIdWithRevision",
    rl."companyId",
    rl."createdBy",
    r."supplierId"
  INTO
    v_item_id,
    v_item_readable_id,
    v_company_id,
    v_created_by,
    v_supplier_id
  FROM "receiptLine" rl
  JOIN "receipt" r ON r.id = rl."receiptId"
  JOIN "item" i ON i.id = rl."itemId"
  WHERE rl.id = p_receipt_line_id;

  v_attributes := jsonb_build_object(
    'Receipt Line', p_receipt_line_id,
    'Receipt', p_receipt_id,
    'Receipt Line Index', p_index
  );

  IF v_supplier_id IS NOT NULL THEN
    v_attributes := v_attributes || jsonb_build_object('Supplier', v_supplier_id);
  END IF;

  IF p_expiry_date IS NOT NULL AND p_expiry_date <> '' THEN
    BEGIN
      v_expiration_date := p_expiry_date::DATE;
    EXCEPTION WHEN OTHERS THEN
      v_expiration_date := NULL;
    END;
  ELSE
    v_resolved_expiry := resolve_shelf_life_start_for_receipt(v_item_id, p_receipt_id);
    IF v_resolved_expiry IS NOT NULL THEN
      v_expiration_date := v_resolved_expiry;
    END IF;
  END IF;

  IF p_tracked_entity_id IS NULL THEN
    INSERT INTO "trackedEntity" (
      "quantity",
      "status",
      "sourceDocument",
      "sourceDocumentId",
      "sourceDocumentReadableId",
      "readableId",
      "attributes",
      "companyId",
      "createdBy",
      "itemId",
      "expirationDate"
    )
    VALUES (
      1,
      'On Hold',
      'Item',
      v_item_id,
      v_item_readable_id,
      p_serial_number,
      v_attributes,
      v_company_id,
      v_created_by,
      v_item_id,
      v_expiration_date
    );
  ELSE
    UPDATE "trackedEntity"
    SET
      "readableId" = p_serial_number,
      -- Merge (not replace): keep Color/Size and any prior document links.
      "attributes" = COALESCE("attributes", '{}'::jsonb) || v_attributes,
      "sourceDocumentReadableId" = v_item_readable_id,
      "itemId" = v_item_id,
      "expirationDate" = COALESCE(v_expiration_date, "expirationDate")
    WHERE id = p_tracked_entity_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
