-- Expose paymentTerm + location display names on the "salesInvoices" view so the
-- Sales Invoices list table can inline-edit paymentTermId / locationId with the
-- selected value rendered. Rebuilt verbatim from the live view (pg_get_viewdef);
-- two LEFT JOINs and two name columns are appended at the end, as
-- CREATE OR REPLACE VIEW requires the existing column list to stay identical.

CREATE OR REPLACE VIEW "salesInvoices" WITH (SECURITY_INVOKER=true) AS
 SELECT si.id,
    si."invoiceId",
    si.status,
    si."customerId",
    si."customerReference",
    si."invoiceCustomerId",
    si."invoiceCustomerLocationId",
    si."invoiceCustomerContactId",
    si."paymentTermId",
    si."postingDate",
    si."dateIssued",
    si."dateDue",
    si."datePaid",
    si."locationId",
    si."currencyCode",
    COALESCE(sil.subtotal, 0::numeric) AS subtotal,
    si."totalDiscount",
    COALESCE(sil.subtotal, 0::numeric) + COALESCE(sil."totalTax", 0::numeric) + COALESCE(ss."shippingCost", 0::numeric) AS "totalAmount",
    COALESCE(sil."totalTax", 0::numeric) AS "totalTax",
    si.balance,
    si."exchangeRate",
    si."exchangeRateUpdatedAt",
    si."opportunityId",
    si."shipmentId",
    si.assignee,
    si."companyId",
    si."customFields",
    si."internalNotes",
    si."externalNotes",
    si.tags,
    si."createdAt",
    si."createdBy",
    si."updatedAt",
    si."updatedBy",
    sil."thumbnailPath",
    sil."itemType",
    COALESCE(sil.subtotal, 0::numeric) + COALESCE(sil."totalTax", 0::numeric) + COALESCE(ss."shippingCost", 0::numeric) AS "invoiceTotal",
    sil.lines,
    pt.name AS "paymentTermName",
    loc.name AS "locationName"
   FROM "salesInvoice" si
     LEFT JOIN ( SELECT sil_1."invoiceId",
            min(
                CASE
                    WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            sum(COALESCE(sil_1.quantity, 0::numeric) * COALESCE(sil_1."unitPrice", 0::numeric) + COALESCE(sil_1."addOnCost", 0::numeric) + COALESCE(sil_1."nonTaxableAddOnCost", 0::numeric) + COALESCE(sil_1."shippingCost", 0::numeric)) AS subtotal,
            sum(COALESCE(sil_1."taxPercent", 0::numeric) * (COALESCE(sil_1.quantity, 0::numeric) * COALESCE(sil_1."unitPrice", 0::numeric) + COALESCE(sil_1."addOnCost", 0::numeric) + COALESCE(sil_1."shippingCost", 0::numeric))) AS "totalTax",
            min(i.type) AS "itemType",
            array_agg(json_build_object('id', sil_1.id, 'invoiceLineType', sil_1."invoiceLineType", 'quantity', sil_1.quantity, 'unitPrice', sil_1."unitPrice", 'itemId', sil_1."itemId")) AS lines
           FROM "salesInvoiceLine" sil_1
             LEFT JOIN item i ON i.id = sil_1."itemId"
             LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
          GROUP BY sil_1."invoiceId") sil ON sil."invoiceId" = si.id
     JOIN "salesInvoiceShipment" ss ON ss.id = si.id
     LEFT JOIN "paymentTerm" pt ON pt.id = si."paymentTermId"
     LEFT JOIN "location" loc ON loc.id = si."locationId";
