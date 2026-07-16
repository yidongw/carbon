"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paperlessPartsFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var paperless_parts_1 = require("@carbon/ee/paperless-parts");
var zod_1 = require("zod");
var client_1 = require("../../client");
var payloadSchema = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        type: zod_1.z.literal("quote.created"),
        created: zod_1.z.string(),
        object: zod_1.z.string(),
        data: zod_1.z.any()
    }),
    zod_1.z.object({
        type: zod_1.z.literal("quote.status_changed"),
        created: zod_1.z.string(),
        object: zod_1.z.string(),
        data: zod_1.z.any()
    }),
    zod_1.z.object({
        type: zod_1.z.literal("quote.sent"),
        created: zod_1.z.string(),
        object: zod_1.z.string(),
        data: zod_1.z.object({
            uuid: zod_1.z.string(),
            number: zod_1.z.number(),
            status: zod_1.z.string(),
            created: zod_1.z.string(),
            expired: zod_1.z.boolean(),
            due_date: zod_1.z.string().nullable(),
            erp_code: zod_1.z.string().nullable(),
            metadata: zod_1.z.object({}),
            priority: zod_1.z.number().nullable(),
            tax_rate: zod_1.z.string().nullable(),
            estimator: zod_1.z.string().nullable(),
            sent_date: zod_1.z.string(),
            contact_id: zod_1.z.number(),
            rfq_number: zod_1.z.string().nullable(),
            quote_items: zod_1.z.array(zod_1.z.string()),
            quote_notes: zod_1.z.string().nullable(),
            salesperson: zod_1.z.string().nullable(),
            expired_date: zod_1.z.string().nullable(),
            private_notes: zod_1.z.string().nullable(),
            revision_number: zod_1.z.number().nullable(),
            supporting_files: zod_1.z.array(zod_1.z.string()),
            export_controlled: zod_1.z.boolean(),
            send_from_facility: zod_1.z.string(),
            request_for_quote_id: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).nullable(),
            digital_last_viewed_on: zod_1.z.string().nullable(),
            manual_rfq_received_date: zod_1.z.string().nullable(),
            authenticated_pdf_quote_url: zod_1.z.string().nullable()
        })
    }),
    zod_1.z.object({
        type: zod_1.z.literal("order.created"),
        created: zod_1.z.string(),
        object: zod_1.z.string(),
        data: zod_1.z.object({
            uuid: zod_1.z.string(),
            status: zod_1.z.string(),
            number: zod_1.z.number().optional()
        })
    }),
    zod_1.z.object({
        type: zod_1.z.literal("order.status_changed"),
        created: zod_1.z.string(),
        object: zod_1.z.string(),
        data: zod_1.z.any()
    }),
    zod_1.z.object({
        type: zod_1.z.literal("integration_action.requested"),
        created: zod_1.z.string(),
        object: zod_1.z.string(),
        data: zod_1.z.any()
    }),
    zod_1.z.object({
        type: zod_1.z.literal("integration.turned_on"),
        created: zod_1.z.string(),
        object: zod_1.z.string(),
        data: zod_1.z.any()
    }),
    zod_1.z.object({
        type: zod_1.z.literal("integration.turned_off"),
        created: zod_1.z.string(),
        object: zod_1.z.string(),
        data: zod_1.z.any()
    })
]);
var paperlessPartsSchema = zod_1.z.object({
    apiKey: zod_1.z.string(),
    companyId: zod_1.z.string(),
    payload: payloadSchema
});
var integrationSchema = zod_1.z.object({
    methodType: zod_1.z.enum(["Purchase to Order", "Pull from Inventory"]).optional(),
    trackingType: zod_1.z.enum(["Inventory", "Non-Inventory", "Batch"]).optional(),
    usePaperlessOrderNumber: zod_1.z.boolean().optional(),
    billOfProcessBlackList: zod_1.z.array(zod_1.z.string()).optional()
});
exports.paperlessPartsFunction = client_1.inngest.createFunction({ id: "paperless-parts", retries: 1 }, { event: "carbon/paperless-parts" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var payload, result, carbon, paperless, _c, company, integration, integrationData, usePaperlessOrderNumber, methodType, trackingType, billOfProcessBlackList, _d, quotePayload, ppQuoteNumber, ppQuoteRevisionNumber, ppQuote, existingQuoteMapping, _e, _f, quoteCustomerId, quoteCustomerContactId, quoteCreatedBy, quoteLocationId, quoteReadableId, nextSequence, quote, _g, quoteCustomerPayment, quoteCustomerShipping, quoteOpportunity, _h, quotePaymentTermId, quoteInvoiceCustomerId, quoteInvoiceCustomerContactId, quoteInvoiceCustomerLocationId, _j, quoteShippingMethodId, quoteShippingTermId, currency, insert, quoteId, _k, quoteShipment, quotePayment, quoteExternalLink, error_1, orderPayload, orderNumber, order, orderData, existingOrderMapping, status_1, update, _l, _m, orderCustomerId, orderCustomerContactId, _o, orderCreatedBy, orderSalesPersonId, orderLocationId, _p, orderShipmentLocationId, orderInvoiceLocationId, _q, orderCustomerPayment, orderCustomerShipping, orderOpportunity, salesOrderReadableId, nextSequence, _r, orderPaymentTermId, orderInvoiceCustomerId, orderInvoiceCustomerContactId, orderInvoiceCustomerLocationId, _s, orderShippingMethodId, orderShippingTermId, salesOrderInsert, salesOrderId, _t, orderShipment, orderPayment, error_2;
    var _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_17) {
        switch (_17.label) {
            case 0:
                payload = paperlessPartsSchema.parse(event.data);
                console.info("Paperless Parts webhook received: ".concat(payload.payload.type));
                console.info("Payload:", payload);
                carbon = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, (0, paperless_parts_1.getPaperlessParts)(payload.apiKey)];
            case 1:
                paperless = _17.sent();
                return [4 /*yield*/, Promise.all([
                        carbon.from("company").select("*").eq("id", payload.companyId).single(),
                        carbon
                            .from("companyIntegration")
                            .select("*")
                            .eq("companyId", payload.companyId)
                            .eq("id", "paperless-parts")
                            .single()
                    ])];
            case 2:
                _c = _17.sent(), company = _c[0], integration = _c[1];
                if (company.error || !company.data) {
                    throw new Error("Failed to fetch company from Carbon");
                }
                if (integration.error || !integration.data) {
                    throw new Error("Failed to fetch integration from Carbon");
                }
                integrationData = integrationSchema.safeParse(integration.data.metadata);
                usePaperlessOrderNumber = false;
                methodType = "Pull from Inventory";
                trackingType = "Inventory";
                billOfProcessBlackList = [];
                if (integrationData.success) {
                    methodType = (_u = integrationData.data.methodType) !== null && _u !== void 0 ? _u : "Pull from Inventory";
                    trackingType = (_v = integrationData.data.trackingType) !== null && _v !== void 0 ? _v : "Inventory";
                    if (integrationData.data.usePaperlessOrderNumber) {
                        usePaperlessOrderNumber = true;
                    }
                    if (integrationData.data.billOfProcessBlackList) {
                        billOfProcessBlackList = integrationData.data.billOfProcessBlackList;
                    }
                }
                _d = payload.payload.type;
                switch (_d) {
                    case "quote.created": return [3 /*break*/, 3];
                    case "quote.status_changed": return [3 /*break*/, 4];
                    case "quote.sent": return [3 /*break*/, 5];
                    case "order.status_changed": return [3 /*break*/, 31];
                    case "order.created": return [3 /*break*/, 31];
                    case "integration_action.requested": return [3 /*break*/, 53];
                    case "integration.turned_on": return [3 /*break*/, 54];
                    case "integration.turned_off": return [3 /*break*/, 55];
                }
                return [3 /*break*/, 56];
            case 3:
                console.info("Processing quote created event");
                result = {
                    success: true,
                    message: "Quote created event processed successfully"
                };
                return [3 /*break*/, 57];
            case 4:
                console.info("Processing quote status changed event");
                result = {
                    success: true,
                    message: "Quote status changed event processed successfully"
                };
                return [3 /*break*/, 57];
            case 5:
                console.info("Processing quote sent event");
                quotePayload = payload.payload.data;
                ppQuoteNumber = quotePayload.number;
                ppQuoteRevisionNumber = quotePayload.revision_number;
                return [4 /*yield*/, paperless.quotes.quoteDetails(ppQuoteNumber, ppQuoteRevisionNumber
                        ? { revision: ppQuoteRevisionNumber }
                        : undefined)];
            case 6:
                ppQuote = _17.sent();
                if (ppQuote.error || !ppQuote.data) {
                    throw new Error("Failed to fetch quote details from Paperless Parts");
                }
                if (!ppQuote.data.contact) {
                    // This should never happen based on the validation rules in Paperless Parts
                    throw new Error("Quote contact not found in Paperless Parts - cannot create Carbon Quote");
                }
                return [4 /*yield*/, carbon
                        .from("externalIntegrationMapping")
                        .select("entityId")
                        .eq("entityType", "quote")
                        .eq("integration", "paperlessId")
                        .eq("externalId", quotePayload.uuid)
                        .eq("companyId", payload.companyId)
                        .maybeSingle()];
            case 7:
                existingQuoteMapping = _17.sent();
                if ((_w = existingQuoteMapping === null || existingQuoteMapping === void 0 ? void 0 : existingQuoteMapping.data) === null || _w === void 0 ? void 0 : _w.entityId) {
                    console.log("Quote already exists", existingQuoteMapping.data.entityId);
                    result = {
                        success: true,
                        message: "Quote already exists"
                    };
                    return [3 /*break*/, 57];
                }
                return [4 /*yield*/, Promise.all([
                        (0, paperless_parts_1.getCustomerIdAndContactId)(carbon, paperless, {
                            company: company.data,
                            contact: ppQuote.data.contact
                        }),
                        (0, paperless_parts_1.getEmployeeAndSalesPersonId)(carbon, {
                            company: company.data,
                            estimator: ppQuote.data.estimator,
                            salesPerson: ppQuote.data.salesperson
                        }),
                        (0, paperless_parts_1.getOrderLocationId)(carbon, {
                            company: company.data,
                            sendFrom: ppQuote.data.send_from_facility
                        })
                    ])];
            case 8:
                _e = _17.sent(), _f = _e[0], quoteCustomerId = _f.customerId, quoteCustomerContactId = _f.customerContactId, quoteCreatedBy = _e[1].createdBy, quoteLocationId = _e[2];
                if (!quoteCustomerId) {
                    throw new Error("Failed to get customer ID");
                }
                if (!quoteCustomerContactId) {
                    throw new Error("Failed to get customer contact ID");
                }
                quoteReadableId = void 0;
                if (!usePaperlessOrderNumber) return [3 /*break*/, 9];
                quoteReadableId = ppQuote.data.number.toString();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, getNextSequence(carbon, "quote", payload.companyId)];
            case 10:
                nextSequence = _17.sent();
                if (!nextSequence.data) {
                    throw new Error("Failed to get next sequence number for quote");
                }
                quoteReadableId = nextSequence.data;
                _17.label = 11;
            case 11:
                quote = {
                    companyId: payload.companyId,
                    customerId: quoteCustomerId,
                    customerContactId: quoteCustomerContactId,
                    quoteId: quoteReadableId,
                    status: "Draft",
                    currencyCode: company.data.baseCurrencyCode,
                    createdBy: quoteCreatedBy,
                    exchangeRate: 1,
                    exchangeRateUpdatedAt: undefined,
                    expirationDate: undefined,
                    revisionId: ppQuoteRevisionNumber !== null && ppQuoteRevisionNumber !== void 0 ? ppQuoteRevisionNumber : 0
                };
                return [4 /*yield*/, Promise.all([
                        getCustomerPayment(carbon, quote.customerId),
                        getCustomerShipping(carbon, quote.customerId),
                        carbon
                            .from("opportunity")
                            .insert([
                            {
                                companyId: quote.companyId,
                                customerId: quote.customerId
                            }
                        ])
                            .select("id")
                            .single()
                    ])];
            case 12:
                _g = _17.sent(), quoteCustomerPayment = _g[0], quoteCustomerShipping = _g[1], quoteOpportunity = _g[2];
                if (quoteCustomerPayment.error)
                    return [2 /*return*/, quoteCustomerPayment];
                if (quoteCustomerShipping.error)
                    return [2 /*return*/, quoteCustomerShipping];
                _h = quoteCustomerPayment.data, quotePaymentTermId = _h.paymentTermId, quoteInvoiceCustomerId = _h.invoiceCustomerId, quoteInvoiceCustomerContactId = _h.invoiceCustomerContactId, quoteInvoiceCustomerLocationId = _h.invoiceCustomerLocationId;
                _j = quoteCustomerShipping.data, quoteShippingMethodId = _j.shippingMethodId, quoteShippingTermId = _j.shippingTermId;
                if (!quote.currencyCode) return [3 /*break*/, 14];
                return [4 /*yield*/, getCurrencyByCode(carbon, company.data.companyGroupId, quote.currencyCode)];
            case 13:
                currency = _17.sent();
                if (currency.data) {
                    quote.exchangeRate = (_x = currency.data.exchangeRate) !== null && _x !== void 0 ? _x : undefined;
                    quote.exchangeRateUpdatedAt = new Date().toISOString();
                }
                return [3 /*break*/, 15];
            case 14:
                quote.exchangeRate = 1;
                quote.exchangeRateUpdatedAt = new Date().toISOString();
                _17.label = 15;
            case 15: return [4 /*yield*/, carbon
                    .from("quote")
                    .insert([
                    __assign(__assign({}, quote), { opportunityId: (_y = quoteOpportunity.data) === null || _y === void 0 ? void 0 : _y.id })
                ])
                    .select("id, quoteId")];
            case 16:
                insert = _17.sent();
                if (insert.error) {
                    return [2 /*return*/, insert];
                }
                quoteId = (_0 = (_z = insert.data) === null || _z === void 0 ? void 0 : _z[0]) === null || _0 === void 0 ? void 0 : _0.id;
                if (!quoteId)
                    return [2 /*return*/, insert];
                // Create the mapping for the new quote
                return [4 /*yield*/, carbon.from("externalIntegrationMapping").insert({
                        entityType: "quote",
                        entityId: quoteId,
                        integration: "paperlessId",
                        externalId: quotePayload.uuid,
                        companyId: payload.companyId,
                        allowDuplicateExternalId: false
                    })];
            case 17:
                // Create the mapping for the new quote
                _17.sent();
                return [4 /*yield*/, Promise.all([
                        carbon.from("quoteShipment").insert([
                            {
                                id: quoteId,
                                locationId: quoteLocationId,
                                shippingMethodId: quoteShippingMethodId,
                                shippingTermId: quoteShippingTermId,
                                companyId: quote.companyId
                            }
                        ]),
                        carbon.from("quotePayment").insert([
                            {
                                id: quoteId,
                                invoiceCustomerId: quoteInvoiceCustomerId,
                                invoiceCustomerContactId: quoteInvoiceCustomerContactId,
                                invoiceCustomerLocationId: quoteInvoiceCustomerLocationId,
                                paymentTermId: quotePaymentTermId,
                                companyId: quote.companyId
                            }
                        ]),
                        upsertExternalLink(carbon, {
                            documentType: "Quote",
                            documentId: quoteId,
                            customerId: quote.customerId,
                            expiresAt: (_1 = quote.expirationDate) !== null && _1 !== void 0 ? _1 : undefined,
                            companyId: quote.companyId
                        })
                    ])];
            case 18:
                _k = _17.sent(), quoteShipment = _k[0], quotePayment = _k[1], quoteExternalLink = _k[2];
                if (!quoteShipment.error) return [3 /*break*/, 20];
                return [4 /*yield*/, deleteQuote(carbon, quoteId)];
            case 19:
                _17.sent();
                return [2 /*return*/, quoteShipment];
            case 20:
                if (!quotePayment.error) return [3 /*break*/, 22];
                return [4 /*yield*/, deleteQuote(carbon, quoteId)];
            case 21:
                _17.sent();
                return [2 /*return*/, quotePayment];
            case 22:
                if (!quoteOpportunity.error) return [3 /*break*/, 24];
                return [4 /*yield*/, deleteQuote(carbon, quoteId)];
            case 23:
                _17.sent();
                return [2 /*return*/, quoteOpportunity];
            case 24:
                if (!quoteExternalLink.data) return [3 /*break*/, 26];
                return [4 /*yield*/, carbon
                        .from("quote")
                        .update({ externalLinkId: quoteExternalLink.data.id })
                        .eq("id", quoteId)];
            case 25:
                _17.sent();
                _17.label = 26;
            case 26:
                _17.trys.push([26, 28, , 30]);
                return [4 /*yield*/, (0, paperless_parts_1.insertQuoteLines)(carbon, {
                        quoteId: quoteId,
                        opportunityId: (_2 = quoteOpportunity.data) === null || _2 === void 0 ? void 0 : _2.id,
                        locationId: quoteLocationId,
                        companyId: payload.companyId,
                        createdBy: quoteCreatedBy,
                        quoteItems: (_3 = ppQuote.data.quote_items) !== null && _3 !== void 0 ? _3 : [],
                        defaultMethodType: methodType,
                        defaultTrackingType: trackingType,
                        billOfProcessBlackList: billOfProcessBlackList
                    })];
            case 27:
                _17.sent();
                console.log("Quote lines successfully created");
                return [3 /*break*/, 30];
            case 28:
                error_1 = _17.sent();
                console.error("Failed to insert quote lines:", error_1);
                return [4 /*yield*/, deleteQuote(carbon, quoteId)];
            case 29:
                _17.sent();
                result = {
                    success: false,
                    message: "Failed to insert quote lines"
                };
                return [3 /*break*/, 57];
            case 30:
                console.info("New Carbon quote created from Paperless Parts");
                result = {
                    success: true,
                    message: "Quote sent event processed successfully"
                };
                return [3 /*break*/, 57];
            case 31:
                console.info("Processing order created event");
                orderPayload = payload.payload.data;
                orderNumber = orderPayload.number;
                if (!orderNumber) {
                    throw new Error("Order number is required");
                }
                return [4 /*yield*/, paperless.orders.orderDetails(orderNumber)];
            case 32:
                order = _17.sent();
                if (order.error || !order.data) {
                    throw new Error("Failed to fetch order details from Paperless Parts");
                }
                orderData = paperless_parts_1.OrderSchema.parse(order.data);
                return [4 /*yield*/, carbon
                        .from("externalIntegrationMapping")
                        .select("entityId")
                        .eq("entityType", "salesOrder")
                        .eq("integration", "paperlessId")
                        .eq("externalId", orderPayload.uuid)
                        .eq("companyId", payload.companyId)
                        .maybeSingle()];
            case 33:
                existingOrderMapping = _17.sent();
                if (!((_4 = existingOrderMapping === null || existingOrderMapping === void 0 ? void 0 : existingOrderMapping.data) === null || _4 === void 0 ? void 0 : _4.entityId)) return [3 /*break*/, 35];
                console.log("Order already exists", existingOrderMapping.data.entityId);
                status_1 = (0, paperless_parts_1.getCarbonOrderStatus)(orderData.status);
                return [4 /*yield*/, carbon
                        .from("salesOrder")
                        .update({ status: status_1 })
                        .eq("id", existingOrderMapping.data.entityId)];
            case 34:
                update = _17.sent();
                if (update.error) {
                    console.log("Failed to update sales order", update.error);
                    result = {
                        success: false,
                        message: "Failed to update sales order"
                    };
                    return [3 /*break*/, 57];
                }
                result = {
                    success: true,
                    message: "Order already exists"
                };
                return [3 /*break*/, 57];
            case 35: return [4 /*yield*/, Promise.all([
                    (0, paperless_parts_1.getCustomerIdAndContactId)(carbon, paperless, {
                        company: company.data,
                        contact: orderData.contact
                    }),
                    (0, paperless_parts_1.getEmployeeAndSalesPersonId)(carbon, {
                        company: company.data,
                        estimator: orderData.estimator,
                        salesPerson: orderData.sales_person
                    }),
                    (0, paperless_parts_1.getOrderLocationId)(carbon, {
                        company: company.data,
                        sendFrom: orderData.send_from_facility
                    })
                ])];
            case 36:
                _l = _17.sent(), _m = _l[0], orderCustomerId = _m.customerId, orderCustomerContactId = _m.customerContactId, _o = _l[1], orderCreatedBy = _o.createdBy, orderSalesPersonId = _o.salesPersonId, orderLocationId = _l[2];
                if (!orderCustomerId) {
                    throw new Error("Failed to get customer ID");
                }
                if (!orderCustomerContactId) {
                    throw new Error("Failed to get customer contact ID");
                }
                return [4 /*yield*/, (0, paperless_parts_1.getCustomerLocationIds)(carbon, {
                        company: company.data,
                        customerId: orderCustomerId,
                        billingInfo: (_5 = orderData.billing_info) !== null && _5 !== void 0 ? _5 : undefined,
                        shippingInfo: (_6 = orderData.shipping_info) !== null && _6 !== void 0 ? _6 : undefined
                    })];
            case 37:
                _p = _17.sent(), orderShipmentLocationId = _p.shipmentLocationId, orderInvoiceLocationId = _p.invoiceLocationId;
                return [4 /*yield*/, Promise.all([
                        getCustomerPayment(carbon, orderCustomerId),
                        getCustomerShipping(carbon, orderCustomerId),
                        carbon
                            .from("opportunity")
                            .insert([
                            {
                                customerId: orderCustomerId,
                                companyId: payload.companyId
                            }
                        ])
                            .select("id")
                            .single()
                    ])];
            case 38:
                _q = _17.sent(), orderCustomerPayment = _q[0], orderCustomerShipping = _q[1], orderOpportunity = _q[2];
                salesOrderReadableId = void 0;
                if (!usePaperlessOrderNumber) return [3 /*break*/, 39];
                salesOrderReadableId = orderNumber.toString();
                return [3 /*break*/, 41];
            case 39: return [4 /*yield*/, getNextSequence(carbon, "salesOrder", payload.companyId)];
            case 40:
                nextSequence = _17.sent();
                if (nextSequence.error) {
                    throw new Error("Failed to get sequence");
                }
                salesOrderReadableId = nextSequence.data;
                _17.label = 41;
            case 41:
                if (orderCustomerPayment.error) {
                    throw new Error("Failed to get customer payment");
                }
                if (orderCustomerShipping.error) {
                    throw new Error("Failed to get customer shipping");
                }
                _r = orderCustomerPayment.data, orderPaymentTermId = _r.paymentTermId, orderInvoiceCustomerId = _r.invoiceCustomerId, orderInvoiceCustomerContactId = _r.invoiceCustomerContactId, orderInvoiceCustomerLocationId = _r.invoiceCustomerLocationId;
                _s = orderCustomerShipping.data, orderShippingMethodId = _s.shippingMethodId, orderShippingTermId = _s.shippingTermId;
                if (orderOpportunity.error) {
                    throw new Error("Failed to create opportunity");
                }
                return [4 /*yield*/, carbon
                        .from("salesOrder")
                        .insert([
                        {
                            salesOrderId: salesOrderReadableId,
                            companyId: payload.companyId,
                            createdBy: orderCreatedBy,
                            currencyCode: (_7 = company.data) === null || _7 === void 0 ? void 0 : _7.baseCurrencyCode,
                            customerId: orderCustomerId,
                            customerContactId: orderCustomerContactId,
                            customerLocationId: orderShipmentLocationId,
                            customerReference: (_9 = (_8 = orderData.payment_details) === null || _8 === void 0 ? void 0 : _8.purchase_order_number) !== null && _9 !== void 0 ? _9 : "",
                            locationId: orderLocationId,
                            opportunityId: (_10 = orderOpportunity.data) === null || _10 === void 0 ? void 0 : _10.id,
                            orderDate: new Date((_11 = orderData.created) !== null && _11 !== void 0 ? _11 : "").toISOString(),
                            salesPersonId: orderSalesPersonId,
                            status: (0, paperless_parts_1.getCarbonOrderStatus)(orderData.status),
                            internalNotes: orderData.private_notes
                                ? {
                                    type: "doc",
                                    content: [
                                        {
                                            type: "paragraph",
                                            content: [
                                                { type: "text", text: orderData.private_notes }
                                            ]
                                        }
                                    ]
                                }
                                : null
                        }
                    ])
                        .select("id, salesOrderId")];
            case 42:
                salesOrderInsert = _17.sent();
                if (salesOrderInsert.error) {
                    console.log("Failed to create sales order", salesOrderInsert.error);
                    result = {
                        success: false,
                        message: "Failed to create sales order"
                    };
                    return [3 /*break*/, 57];
                }
                salesOrderId = (_13 = (_12 = salesOrderInsert.data) === null || _12 === void 0 ? void 0 : _12[0]) === null || _13 === void 0 ? void 0 : _13.id;
                if (!salesOrderId) {
                    console.log("Failed to get sales order ID");
                    result = {
                        success: false,
                        message: "Failed to get sales order ID"
                    };
                    return [3 /*break*/, 57];
                }
                // Create the mapping for the new sales order
                return [4 /*yield*/, carbon.from("externalIntegrationMapping").insert({
                        entityType: "salesOrder",
                        entityId: salesOrderId,
                        integration: "paperlessId",
                        externalId: orderData.uuid,
                        companyId: payload.companyId,
                        allowDuplicateExternalId: false
                    })];
            case 43:
                // Create the mapping for the new sales order
                _17.sent();
                return [4 /*yield*/, Promise.all([
                        carbon.from("salesOrderShipment").insert([
                            {
                                id: salesOrderId,
                                locationId: orderLocationId,
                                customerId: orderCustomerId,
                                shippingCost: parseFloat((_15 = (_14 = orderData.payment_details) === null || _14 === void 0 ? void 0 : _14.shipping_cost) !== null && _15 !== void 0 ? _15 : "0"),
                                customerLocationId: orderShipmentLocationId,
                                shippingMethodId: orderShippingMethodId,
                                shippingTermId: orderShippingTermId,
                                companyId: payload.companyId
                            }
                        ]),
                        carbon.from("salesOrderPayment").insert([
                            {
                                id: salesOrderId,
                                invoiceCustomerId: orderInvoiceCustomerId,
                                invoiceCustomerContactId: orderInvoiceCustomerContactId,
                                invoiceCustomerLocationId: orderInvoiceCustomerId === orderCustomerId
                                    ? (orderInvoiceLocationId !== null && orderInvoiceLocationId !== void 0 ? orderInvoiceLocationId : orderInvoiceCustomerLocationId)
                                    : orderInvoiceCustomerLocationId,
                                paymentTermId: orderPaymentTermId,
                                companyId: payload.companyId
                            }
                        ])
                    ])];
            case 44:
                _t = _17.sent(), orderShipment = _t[0], orderPayment = _t[1];
                if (!orderShipment.error) return [3 /*break*/, 46];
                console.log("Failed to create shipment", orderShipment.error);
                return [4 /*yield*/, deleteSalesOrder(carbon, salesOrderId)];
            case 45:
                _17.sent();
                result = {
                    success: false,
                    message: "Failed to create shipment"
                };
                return [3 /*break*/, 57];
            case 46:
                if (!orderPayment.error) return [3 /*break*/, 48];
                console.log("Failed to create payment", orderPayment.error);
                return [4 /*yield*/, deleteSalesOrder(carbon, salesOrderId)];
            case 47:
                _17.sent();
                result = {
                    success: false,
                    message: "Failed to create payment"
                };
                return [3 /*break*/, 57];
            case 48:
                _17.trys.push([48, 50, , 52]);
                return [4 /*yield*/, (0, paperless_parts_1.insertOrderLines)(carbon, {
                        salesOrderId: salesOrderId,
                        opportunityId: (_16 = orderOpportunity.data) === null || _16 === void 0 ? void 0 : _16.id,
                        locationId: orderLocationId,
                        companyId: payload.companyId,
                        createdBy: orderCreatedBy,
                        orderItems: orderData.order_items || [],
                        defaultMethodType: methodType,
                        defaultTrackingType: trackingType,
                        billOfProcessBlackList: billOfProcessBlackList
                    })];
            case 49:
                _17.sent();
                console.log("Order lines successfully created");
                return [3 /*break*/, 52];
            case 50:
                error_2 = _17.sent();
                console.error("Failed to insert order lines:", error_2);
                return [4 /*yield*/, deleteSalesOrder(carbon, salesOrderId)];
            case 51:
                _17.sent();
                result = {
                    success: false,
                    message: "Failed to insert order lines"
                };
                return [3 /*break*/, 57];
            case 52:
                console.info("New Carbon sales order created from Paperless Parts");
                result = {
                    success: true,
                    message: "Order created event processed successfully"
                };
                return [3 /*break*/, 57];
            case 53:
                console.info("Processing integration action requested event");
                result = {
                    success: true,
                    message: "Integration action requested event processed successfully"
                };
                return [3 /*break*/, 57];
            case 54:
                console.info("Processing integration turned on event");
                result = {
                    success: true,
                    message: "Integration turned on event processed successfully"
                };
                return [3 /*break*/, 57];
            case 55:
                console.info("Processing integration turned off event");
                result = {
                    success: true,
                    message: "Integration turned off event processed successfully"
                };
                return [3 /*break*/, 57];
            case 56:
                console.error("Unsupported event type: ".concat(payload.payload));
                result = {
                    success: false,
                    message: "Unsupported event type"
                };
                return [3 /*break*/, 57];
            case 57:
                if (result.success) {
                    console.info("Successfully processed ".concat(payload.payload.type, " event"));
                }
                else {
                    console.error("Failed to process ".concat(payload.payload.type, " event: ").concat(result.message));
                }
                return [2 /*return*/, result];
        }
    });
}); });
function getNextSequence(client, table, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_next_sequence", {
                    sequence_name: table,
                    company_id: companyId
                })];
        });
    });
}
function getCustomerPayment(client, customerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerPayment")
                    .select("*")
                    .eq("customerId", customerId)
                    .single()];
        });
    });
}
function getCustomerShipping(client, customerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerShipping")
                    .select("*")
                    .eq("customerId", customerId)
                    .single()];
        });
    });
}
function getCurrencyByCode(client, companyGroupId, currencyCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("currency")
                    .select("exchangeRate")
                    .eq("companyGroupId", companyGroupId)
                    .eq("code", currencyCode)
                    .single()];
        });
    });
}
function deleteQuote(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quote").delete().eq("id", quoteId)];
        });
    });
}
function deleteSalesOrder(client, salesOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesOrder").delete().eq("id", salesOrderId)];
        });
    });
}
function upsertExternalLink(client, externalLink) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("externalLink")
                    .insert({
                    documentType: externalLink.documentType,
                    documentId: externalLink.documentId,
                    customerId: externalLink.customerId,
                    expiresAt: externalLink.expiresAt,
                    companyId: externalLink.companyId
                })
                    .select("id")
                    .single()];
        });
    });
}
