-- Fix salesOrders.orderTotal undercounting equal-amount lines.
--
-- The line-aggregate subquery joined `job`, which fans out each line once per
-- job; `sum(DISTINCT ...)` was used to collapse those duplicate per-line rows.
-- But DISTINCT also collapses genuinely distinct lines that happen to evaluate
-- to the same amount — which is exactly what per-variant Style expansion
-- produces (e.g. 3 colors x 10 units x $5 = three identical $50 lines summed as
-- one $50). The SO list "Order Total" and the sales revenue KPIs (which sum
-- this column) therefore under-report.
--
-- Fix: compute the line total (and thumbnail / itemType / lines array) in a
-- subquery that does NOT join job, so there is no fan-out and a plain SUM is
-- correct; aggregate jobs in a separate subquery. This also fixes the
-- pre-existing duplication of the `lines` array when a line had multiple jobs.

CREATE OR REPLACE VIEW "salesOrders" WITH (security_invoker = true) AS
 SELECT s.id,
    s."salesOrderId",
    s."revisionId",
    s.status,
    s."orderDate",
    s."currencyCode",
    s."customerId",
    s."customerLocationId",
    s."customerContactId",
    s."customerReference",
    s.assignee,
    s."companyId",
    s."closedAt",
    s."closedBy",
    s."customFields",
    s."createdAt",
    s."createdBy",
    s."updatedAt",
    s."updatedBy",
    s."locationId",
    s."exchangeRate",
    s."exchangeRateUpdatedAt",
    s."externalNotes",
    s."internalNotes",
    s."salesPersonId",
    s."sentCompleteDate",
    s."opportunityId",
    s."completedDate",
    s."customerEngineeringContactId",
    s."deletedAt",
    s."deletedBy",
        CASE
            WHEN (s.status <> ALL (ARRAY['Closed'::"salesOrderStatus", 'Cancelled'::"salesOrderStatus"])) AND (EXISTS ( SELECT 1
               FROM "salesOrderLine" sol
              WHERE sol."salesOrderId" = s.id AND sol."methodType" = 'Make to Order'::"methodType" AND COALESCE(( SELECT sum(j."quantityComplete") AS sum
                       FROM job j
                      WHERE j."salesOrderLineId" = sol.id AND j."salesOrderId" = sol."salesOrderId"), 0::numeric) < sol."saleQuantity")) THEN 'In Progress'::"salesOrderStatus"
            ELSE s.status
        END AS "displayStatus",
    sl."thumbnailPath",
    sl."itemType",
    sl."orderTotal" + COALESCE(ss."shippingCost", 0::numeric) AS "orderTotal",
    sj.jobs,
    sl.lines,
    st.name AS "shippingTermName",
    sp."paymentTermId",
    ss."shippingMethodId",
    ss."receiptRequestedDate",
    ss."receiptPromisedDate",
    ss."dropShipment",
    ss."shippingCost",
    ss.incoterm,
    ss."incotermLocation",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN eim.metadata IS NOT NULL THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE eim."externalId" IS NOT NULL OR eim.metadata IS NOT NULL), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE eim."entityType" = 'salesOrder'::text AND eim."entityId" = s.id) AS "externalId",
    sm.name AS "shippingMethodName",
    loc.name AS "locationName",
    pt.name AS "paymentTermName"
   FROM "salesOrder" s
     LEFT JOIN ( SELECT sol."salesOrderId",
            min(
                CASE
                    WHEN i."thumbnailPath" IS NULL AND mu."thumbnailPath" IS NOT NULL THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            sum((1::numeric + COALESCE(sol."taxPercent", 0::numeric)) * (COALESCE(sol."saleQuantity", 0::numeric) * COALESCE(sol."unitPrice", 0::numeric) + COALESCE(sol."shippingCost", 0::numeric) + COALESCE(sol."addOnCost", 0::numeric)) + COALESCE(sol."nonTaxableAddOnCost", 0::numeric)) AS "orderTotal",
            min(i.type) AS "itemType",
            array_agg(json_build_object('id', sol.id, 'methodType', sol."methodType", 'saleQuantity', sol."saleQuantity")) AS lines
           FROM "salesOrderLine" sol
             LEFT JOIN item i ON i.id = sol."itemId"
             LEFT JOIN "modelUpload" mu ON mu.id = i."modelUploadId"
          GROUP BY sol."salesOrderId") sl ON sl."salesOrderId" = s.id
     LEFT JOIN ( SELECT sol."salesOrderId",
            array_agg(json_build_object('id', j.id, 'jobId', j."jobId", 'status', j.status, 'dueDate', j."dueDate", 'productionQuantity', j."productionQuantity", 'quantityComplete', j."quantityComplete", 'quantityShipped', j."quantityShipped", 'quantity', j.quantity, 'scrapQuantity', j."scrapQuantity", 'salesOrderLineId', sol.id, 'assignee', j.assignee)) AS jobs
           FROM "salesOrderLine" sol
             JOIN job j ON j."salesOrderId" = sol."salesOrderId" AND j."salesOrderLineId" = sol.id
          GROUP BY sol."salesOrderId") sj ON sj."salesOrderId" = s.id
     LEFT JOIN "salesOrderShipment" ss ON ss.id = s.id
     LEFT JOIN "shippingTerm" st ON st.id = ss."shippingTermId"
     LEFT JOIN "salesOrderPayment" sp ON sp.id = s.id
     LEFT JOIN "shippingMethod" sm ON sm.id = ss."shippingMethodId"
     LEFT JOIN "location" loc ON loc.id = s."locationId"
     LEFT JOIN "paymentTerm" pt ON pt.id = sp."paymentTermId";

NOTIFY pgrst, 'reload schema';
