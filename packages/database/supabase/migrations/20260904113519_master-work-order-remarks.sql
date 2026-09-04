-- Master Work Order remarks: an optional free-text note on the master work order,
-- used to explain the plan when the target quantity is 0 (e.g. "cut to a 1:2:1
-- color ratio", or "cut whatever the fabric yields"). A 0 target means "no fixed
-- plan" — cutting is reported unrestricted — so the remark carries the real intent.

ALTER TABLE "masterWorkOrder" ADD COLUMN IF NOT EXISTS "remarks" TEXT;

-- Re-expose the list view with the new column (appended so existing columns keep
-- their order, which CREATE OR REPLACE VIEW requires).
CREATE OR REPLACE VIEW "masterWorkOrders" WITH (SECURITY_INVOKER=true) AS
SELECT
  mwo."id",
  mwo."jobId",
  mwo."companyId",
  mwo."tags",
  mwo."createdAt",
  mwo."createdBy",
  mwo."updatedAt",
  mwo."updatedBy",
  j."jobId" AS "jobReadableId",
  j."status",
  j."quantity",
  j."dueDate",
  j."locationId",
  j."itemId",
  i."readableIdWithRevision",
  i."name" AS "itemName",
  i."type" AS "itemType",
  i."thumbnailPath",
  j."customerId",
  j."startDate",
  j."deadlineType",
  j."salesOrderId",
  j."salesOrderLineId",
  so."salesOrderId" AS "salesOrderReadableId",
  loc."name" AS "locationName",
  j."assignee",
  j."scrapQuantity",
  j."storageUnitId",
  mwo."remarks"
FROM "masterWorkOrder" mwo
JOIN "job" j ON j."id" = mwo."jobId"
LEFT JOIN "item" i
  ON i."id" = j."itemId" AND i."companyId" = j."companyId"
LEFT JOIN "salesOrder" so
  ON j."salesOrderId" = so."id" AND j."companyId" = so."companyId"
LEFT JOIN "location" loc ON loc."id" = j."locationId";
