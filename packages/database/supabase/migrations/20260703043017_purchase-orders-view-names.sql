-- Expose display names for the inline-editable purchaseOrders foreign keys
-- (shippingMethodId on purchaseOrderDelivery, paymentTermId on
-- purchaseOrderPayment, locationId on purchaseOrderDelivery) so the Purchase
-- Orders list table can render the selected value without an async lookup.
-- Rebuilt verbatim from the live view (pg_get_viewdef); only three LEFT JOINs
-- and three name columns are appended at the end, as CREATE OR REPLACE VIEW
-- requires the existing column list to stay identical and in order.

CREATE OR REPLACE VIEW "purchaseOrders" WITH (SECURITY_INVOKER=true) AS
 SELECT p.id,
    p."purchaseOrderId",
    p."revisionId",
    p.status,
    p."orderDate",
    p."supplierId",
    p."supplierLocationId",
    p."supplierContactId",
    p."supplierReference",
    p.assignee,
    p."companyId",
    p."closedAt",
    p."closedBy",
    p."customFields",
    p."createdAt",
    p."createdBy",
    p."updatedAt",
    p."updatedBy",
    p."currencyCode",
    p."exchangeRate",
    p."exchangeRateUpdatedAt",
    p.tags,
    p."internalNotes",
    p."externalNotes",
    p."supplierInteractionId",
    p."purchaseOrderType",
    p."jobId",
    p."jobReadableId",
    pl."thumbnailPath",
    pl."itemType",
    pl."orderTotal" + pd."supplierShippingCost" * p."exchangeRate" AS "orderTotal",
    pd."shippingMethodId",
    pd."shippingTermId",
    pd."receiptRequestedDate",
    pd."receiptPromisedDate",
    pd."deliveryDate",
    pd."dropShipment",
    pp."paymentTermId",
    pd."locationId",
    pd."supplierShippingCost",
    pd.incoterm,
    pd."incotermLocation",
    u."fullName" AS "createdByFullName",
    u.email AS "createdByEmail",
    u.phone AS "createdByPhone",
    ua."fullName" AS "assigneeFullName",
    ua.email AS "assigneeEmail",
    ua.phone AS "assigneePhone",
    uam."fullName" AS "accountManagerFullName",
    uam.email AS "accountManagerEmail",
    uam.phone AS "accountManagerPhone",
    sm.name AS "shippingMethodName",
    pt.name AS "paymentTermName",
    loc.name AS "locationName"
   FROM "purchaseOrder" p
     LEFT JOIN ( SELECT pol."purchaseOrderId",
            min(
                CASE
                    WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            sum(COALESCE(pol."purchaseQuantity", 0::numeric) * COALESCE(pol."unitPrice", 0::numeric) + COALESCE(pol."shippingCost", 0::numeric) + COALESCE(pol."taxAmount", 0::numeric)) AS "orderTotal",
            min(i.type) AS "itemType"
           FROM "purchaseOrderLine" pol
             LEFT JOIN item i ON i.id = pol."itemId"
             LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
          GROUP BY pol."purchaseOrderId") pl ON pl."purchaseOrderId" = p.id
     LEFT JOIN "purchaseOrderDelivery" pd ON pd.id = p.id
     LEFT JOIN "shippingTerm" st ON st.id = pd."shippingTermId"
     LEFT JOIN "purchaseOrderPayment" pp ON pp.id = p.id
     LEFT JOIN "user" u ON u.id = p."createdBy"
     LEFT JOIN "user" ua ON ua.id = p.assignee
     LEFT JOIN supplier s ON s.id = p."supplierId"
     LEFT JOIN "user" uam ON uam.id = s."accountManagerId"
     LEFT JOIN "shippingMethod" sm ON sm.id = pd."shippingMethodId"
     LEFT JOIN "paymentTerm" pt ON pt.id = pp."paymentTermId"
     LEFT JOIN "location" loc ON loc.id = pd."locationId";
