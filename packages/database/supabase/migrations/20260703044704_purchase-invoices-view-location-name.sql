-- Expose the location display name on the "purchaseInvoices" view so the Purchase
-- Invoices list table can inline-edit locationId with the selected value rendered.
-- paymentTermName is already exposed. Rebuilt verbatim from the live view
-- (pg_get_viewdef); one LEFT JOIN and one name column appended at the end, as
-- CREATE OR REPLACE VIEW requires the existing column list to stay identical.

CREATE OR REPLACE VIEW "purchaseInvoices" WITH (SECURITY_INVOKER=true) AS
 SELECT pi.id,
    pi."invoiceId",
    pi."supplierId",
    pi."invoiceSupplierId",
    pi."supplierInteractionId",
    pi."supplierReference",
    pi."invoiceSupplierContactId",
    pi."invoiceSupplierLocationId",
    pi."locationId",
    pi."postingDate",
    pi."dateIssued",
    pi."dateDue",
    pi."datePaid",
    pi."paymentTermId",
    pi."currencyCode",
    pi."exchangeRate",
    pi."exchangeRateUpdatedAt",
    COALESCE(pl.subtotal, 0::numeric)::numeric(10,2) AS subtotal,
    pi."totalDiscount",
    (COALESCE(pl."orderTotal", 0::numeric) + COALESCE(pid."supplierShippingCost", 0::numeric) *
        CASE
            WHEN pi."exchangeRate" = 0::numeric THEN 1::numeric
            ELSE pi."exchangeRate"
        END)::numeric(10,2) AS "totalAmount",
    COALESCE(pl."totalTax", 0::numeric)::numeric(10,2) AS "totalTax",
    pi.balance,
    pi.assignee,
    pi."createdBy",
    pi."createdAt",
    pi."updatedBy",
    pi."updatedAt",
    pi."internalNotes",
    pi."customFields",
    pi."companyId",
    pl."thumbnailPath",
    pl."itemType",
    COALESCE(pl."orderTotal", 0::numeric) + COALESCE(pid."supplierShippingCost", 0::numeric) *
        CASE
            WHEN pi."exchangeRate" = 0::numeric THEN 1::numeric
            ELSE pi."exchangeRate"
        END AS "orderTotal",
        CASE
            WHEN pi."dateDue" < CURRENT_DATE AND pi."datePaid" IS NULL THEN 'Overdue'::"purchaseInvoiceStatus"
            ELSE pi.status
        END AS status,
    pt.name AS "paymentTermName",
    loc.name AS "locationName"
   FROM "purchaseInvoice" pi
     LEFT JOIN ( SELECT pol."invoiceId",
            min(
                CASE
                    WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            sum(COALESCE(pol.quantity, 0::numeric) * COALESCE(pol."unitPrice", 0::numeric) + COALESCE(pol."shippingCost", 0::numeric)) AS subtotal,
            sum(COALESCE(pol."taxAmount", 0::numeric)) AS "totalTax",
            sum(COALESCE(pol.quantity, 0::numeric) * COALESCE(pol."unitPrice", 0::numeric) + COALESCE(pol."shippingCost", 0::numeric) + COALESCE(pol."taxAmount", 0::numeric)) AS "orderTotal",
            min(i.type) AS "itemType"
           FROM "purchaseInvoiceLine" pol
             LEFT JOIN item i ON i.id = pol."itemId"
             LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
          GROUP BY pol."invoiceId") pl ON pl."invoiceId" = pi.id
     LEFT JOIN "paymentTerm" pt ON pt.id = pi."paymentTermId"
     LEFT JOIN "purchaseInvoiceDelivery" pid ON pid.id = pi.id
     LEFT JOIN "location" loc ON loc.id = pi."locationId";
