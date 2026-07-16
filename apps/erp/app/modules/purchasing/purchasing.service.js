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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePurchaseOrder = closePurchaseOrder;
exports.convertSupplierQuoteToOrder = convertSupplierQuoteToOrder;
exports.deletePurchaseOrder = deletePurchaseOrder;
exports.deletePurchaseOrderLine = deletePurchaseOrderLine;
exports.duplicatePurchaseOrder = duplicatePurchaseOrder;
exports.deleteSupplier = deleteSupplier;
exports.deleteSupplierContact = deleteSupplierContact;
exports.deleteSupplierLocation = deleteSupplierLocation;
exports.deleteSupplierProcess = deleteSupplierProcess;
exports.deleteSupplierQuote = deleteSupplierQuote;
exports.deleteSupplierQuoteLine = deleteSupplierQuoteLine;
exports.deleteSupplierType = deleteSupplierType;
exports.getPurchaseOrder = getPurchaseOrder;
exports.finalizeSupplierQuote = finalizeSupplierQuote;
exports.getPurchaseOrders = getPurchaseOrders;
exports.getPurchaseOrderDelivery = getPurchaseOrderDelivery;
exports.getPurchaseOrderLocations = getPurchaseOrderLocations;
exports.getPurchaseOrderPayment = getPurchaseOrderPayment;
exports.getPurchaseOrderLines = getPurchaseOrderLines;
exports.getPurchaseOrderLine = getPurchaseOrderLine;
exports.getPurchaseOrderSuppliers = getPurchaseOrderSuppliers;
exports.getPurchasingDocumentsAssignedToMe = getPurchasingDocumentsAssignedToMe;
exports.getPurchasingPlanning = getPurchasingPlanning;
exports.getPurchasingTerms = getPurchasingTerms;
exports.getSupplier = getSupplier;
exports.getSupplierApprovalContext = getSupplierApprovalContext;
exports.getSupplierContact = getSupplierContact;
exports.getSupplierContacts = getSupplierContacts;
exports.getSupplierInteraction = getSupplierInteraction;
exports.getSupplierInteractionDocuments = getSupplierInteractionDocuments;
exports.getSupplierInteractionLineDocuments = getSupplierInteractionLineDocuments;
exports.getSupplierLocations = getSupplierLocations;
exports.getSupplierLocation = getSupplierLocation;
exports.getSupplierPayment = getSupplierPayment;
exports.getSupplierProcessById = getSupplierProcessById;
exports.getSupplierProcessesByProcess = getSupplierProcessesByProcess;
exports.getSupplierProcessesBySupplier = getSupplierProcessesBySupplier;
exports.getSupplierQuote = getSupplierQuote;
exports.getSupplierQuoteByInteractionId = getSupplierQuoteByInteractionId;
exports.getSupplierQuoteByExternalLinkId = getSupplierQuoteByExternalLinkId;
exports.getSupplierQuotes = getSupplierQuotes;
exports.getSupplierQuoteLine = getSupplierQuoteLine;
exports.getSupplierQuoteLines = getSupplierQuoteLines;
exports.getSupplierQuoteLinePrices = getSupplierQuoteLinePrices;
exports.getSupplierQuoteLinePricesByQuoteId = getSupplierQuoteLinePricesByQuoteId;
exports.getSupplierQuotesList = getSupplierQuotesList;
exports.getSupplierShipping = getSupplierShipping;
exports.getSuppliers = getSuppliers;
exports.getSuppliersList = getSuppliersList;
exports.getSupplierType = getSupplierType;
exports.getSupplierTypes = getSupplierTypes;
exports.getSupplierTypesList = getSupplierTypesList;
exports.insertSupplier = insertSupplier;
exports.insertSupplierContact = insertSupplierContact;
exports.insertSupplierInteraction = insertSupplierInteraction;
exports.insertSupplierLocation = insertSupplierLocation;
exports.finalizePurchaseOrder = finalizePurchaseOrder;
exports.sendSupplierQuote = sendSupplierQuote;
exports.updatePurchaseOrderStatusLegacy = updatePurchaseOrderStatusLegacy;
exports.updatePurchaseOrderExchangeRate = updatePurchaseOrderExchangeRate;
exports.updatePurchaseOrderFavorite = updatePurchaseOrderFavorite;
exports.updatePurchaseOrderStatus = updatePurchaseOrderStatus;
exports.updateSupplierAccounting = updateSupplierAccounting;
exports.updateSupplierContact = updateSupplierContact;
exports.updateSupplierLocation = updateSupplierLocation;
exports.updateSupplierPayment = updateSupplierPayment;
exports.updateSupplierQuoteExchangeRate = updateSupplierQuoteExchangeRate;
exports.updateSupplierQuoteFavorite = updateSupplierQuoteFavorite;
exports.updateSupplierQuoteStatus = updateSupplierQuoteStatus;
exports.updateSupplierShipping = updateSupplierShipping;
exports.getSupplierTax = getSupplierTax;
exports.updateSupplierTax = updateSupplierTax;
exports.insertPurchaseOrder = insertPurchaseOrder;
exports.updatePurchaseOrder = updatePurchaseOrder;
exports.upsertPurchaseOrder = upsertPurchaseOrder;
exports.upsertPurchaseOrderDelivery = upsertPurchaseOrderDelivery;
exports.upsertPurchaseOrderLine = upsertPurchaseOrderLine;
exports.updatePurchaseOrderLineOrder = updatePurchaseOrderLineOrder;
exports.upsertPurchaseOrderPayment = upsertPurchaseOrderPayment;
exports.upsertSupplier = upsertSupplier;
exports.upsertSupplierProcess = upsertSupplierProcess;
exports.insertSupplierQuote = insertSupplierQuote;
exports.updateSupplierQuote = updateSupplierQuote;
exports.upsertSupplierQuote = upsertSupplierQuote;
exports.upsertSupplierQuoteLine = upsertSupplierQuoteLine;
exports.updateSupplierQuoteLineOrder = updateSupplierQuoteLineOrder;
exports.upsertSupplierType = upsertSupplierType;
exports.deletePurchasingRFQ = deletePurchasingRFQ;
exports.deletePurchasingRFQLine = deletePurchasingRFQLine;
exports.getPurchasingRFQ = getPurchasingRFQ;
exports.getPurchasingRFQs = getPurchasingRFQs;
exports.getPurchasingRFQLine = getPurchasingRFQLine;
exports.getPurchasingRFQLines = getPurchasingRFQLines;
exports.getPurchasingRFQSuppliers = getPurchasingRFQSuppliers;
exports.insertPurchasingRFQ = insertPurchasingRFQ;
exports.updatePurchasingRFQ = updatePurchasingRFQ;
exports.upsertPurchasingRFQ = upsertPurchasingRFQ;
exports.upsertPurchasingRFQLine = upsertPurchasingRFQLine;
exports.updatePurchasingRFQLineOrder = updatePurchasingRFQLineOrder;
exports.upsertPurchasingRFQSuppliers = upsertPurchasingRFQSuppliers;
exports.updatePurchasingRFQStatus = updatePurchasingRFQStatus;
exports.getLinkedSupplierQuotes = getLinkedSupplierQuotes;
exports.getLinkedPurchasingRfqs = getLinkedPurchasingRfqs;
exports.getLinkedPurchasingRfqsForInteraction = getLinkedPurchasingRfqsForInteraction;
exports.getSiblingQuotesForQuote = getSiblingQuotesForQuote;
exports.getLinkedPurchasingRfqsForOrder = getLinkedPurchasingRfqsForOrder;
exports.getSupplierQuotesForComparison = getSupplierQuotesForComparison;
exports.getPurchasingRFQSuppliersWithLinks = getPurchasingRFQSuppliersWithLinks;
exports.getDefaultAttachmentsForPO = getDefaultAttachmentsForPO;
var database_1 = require("@carbon/database");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var people_1 = require("~/modules/people");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var accounting_service_1 = require("../accounting/accounting.service");
var shared_service_1 = require("../shared/shared.service");
function closePurchaseOrder(client, purchaseOrderId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrder")
                    .update({
                    closed: true,
                    closedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                    closedBy: userId
                })
                    .eq("id", purchaseOrderId)
                    .select("id")
                    .single()];
        });
    });
}
function convertSupplierQuoteToOrder(client, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("convert", {
                    body: __assign({ type: "supplierQuoteToPurchaseOrder" }, payload)
                })];
        });
    });
}
function deletePurchaseOrder(client, purchaseOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("purchaseOrder").delete().eq("id", purchaseOrderId)];
        });
    });
}
function deletePurchaseOrderLine(client, purchaseOrderLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrderLine")
                    .delete()
                    .eq("id", purchaseOrderLineId)];
        });
    });
}
// Creates a new Draft PO header + delivery + payment via insertPurchaseOrder
// and copies the source PO's lines into it. Receipt/invoice progress is
// reset; only the order/line definition is duplicated.
function duplicatePurchaseOrder(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var _c, source, sourceDelivery, sourceLines, insertResult, newId, lineRows, lineInsert;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        var sourcePurchaseOrderId = _b.sourcePurchaseOrderId, companyId = _b.companyId, companyGroupId = _b.companyGroupId, userId = _b.userId;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseOrder")
                            .select("id, supplierId, supplierContactId, supplierLocationId, supplierReference, currencyCode, purchaseOrderType, internalNotes, externalNotes")
                            .eq("id", sourcePurchaseOrderId)
                            .single(),
                        client
                            .from("purchaseOrderDelivery")
                            .select("locationId, receiptRequestedDate")
                            .eq("id", sourcePurchaseOrderId)
                            .maybeSingle(),
                        client
                            .from("purchaseOrderLine")
                            .select("purchaseOrderLineType, itemId, assetId, description, purchaseQuantity, supplierUnitPrice, inventoryUnitOfMeasureCode, purchaseUnitOfMeasureCode, locationId, storageUnitId, setupPrice, requiresInspection, customFields, conversionFactor, tags, internalNotes, externalNotes, exchangeRate, supplierShippingCost, modelUploadId, supplierTaxAmount, jobId, jobOperationId, promisedDate, requiredDate, accountId, costCenterId, ownerId, sortOrder, supplierPartId")
                            .eq("purchaseOrderId", sourcePurchaseOrderId)
                    ])];
                case 1:
                    _c = _q.sent(), source = _c[0], sourceDelivery = _c[1], sourceLines = _c[2];
                    if (source.error || !source.data) {
                        return [2 /*return*/, { data: null, error: source.error }];
                    }
                    if (sourceLines.error) {
                        return [2 /*return*/, { data: null, error: sourceLines.error }];
                    }
                    return [4 /*yield*/, insertPurchaseOrder(client, {
                            supplierId: source.data.supplierId,
                            supplierContactId: (_d = source.data.supplierContactId) !== null && _d !== void 0 ? _d : undefined,
                            supplierLocationId: (_e = source.data.supplierLocationId) !== null && _e !== void 0 ? _e : undefined,
                            supplierReference: (_f = source.data.supplierReference) !== null && _f !== void 0 ? _f : undefined,
                            currencyCode: (_g = source.data.currencyCode) !== null && _g !== void 0 ? _g : undefined,
                            purchaseOrderType: (_h = source.data.purchaseOrderType) !== null && _h !== void 0 ? _h : undefined,
                            notes: (_j = source.data.internalNotes) !== null && _j !== void 0 ? _j : undefined,
                            externalNotes: (_k = source.data.externalNotes) !== null && _k !== void 0 ? _k : undefined,
                            locationId: (_m = (_l = sourceDelivery.data) === null || _l === void 0 ? void 0 : _l.locationId) !== null && _m !== void 0 ? _m : undefined,
                            receiptRequestedDate: (_p = (_o = sourceDelivery.data) === null || _o === void 0 ? void 0 : _o.receiptRequestedDate) !== null && _p !== void 0 ? _p : undefined,
                            status: "Draft",
                            companyId: companyId,
                            companyGroupId: companyGroupId,
                            createdBy: userId
                        })];
                case 2:
                    insertResult = _q.sent();
                    if (insertResult.error || !insertResult.data) {
                        return [2 /*return*/, insertResult];
                    }
                    newId = insertResult.data.id;
                    if (!(sourceLines.data && sourceLines.data.length > 0)) return [3 /*break*/, 5];
                    lineRows = sourceLines.data.map(function (line) { return (__assign(__assign({}, line), { purchaseOrderId: newId, companyId: companyId, createdBy: userId })); });
                    return [4 /*yield*/, client
                            .from("purchaseOrderLine")
                            .insert(lineRows)];
                case 3:
                    lineInsert = _q.sent();
                    if (!lineInsert.error) return [3 /*break*/, 5];
                    // Best-effort rollback so we don't leave an orphan header.
                    return [4 /*yield*/, deletePurchaseOrder(client, newId)];
                case 4:
                    // Best-effort rollback so we don't leave an orphan header.
                    _q.sent();
                    return [2 /*return*/, { data: null, error: lineInsert.error }];
                case 5: return [2 /*return*/, insertResult];
            }
        });
    });
}
function deleteSupplier(client, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("supplier").delete().eq("id", supplierId)];
        });
    });
}
function deleteSupplierContact(client, supplierId, supplierContactId) {
    return __awaiter(this, void 0, void 0, function () {
        var supplierContact, contactDelete;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("supplierContact")
                        .select("contactId")
                        .eq("supplierId", supplierId)
                        .eq("id", supplierContactId)
                        .single()];
                case 1:
                    supplierContact = _a.sent();
                    if (!supplierContact.data) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("contact")
                            .delete()
                            .eq("id", supplierContact.data.contactId)];
                case 2:
                    contactDelete = _a.sent();
                    if (contactDelete.error) {
                        return [2 /*return*/, contactDelete];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, supplierContact];
            }
        });
    });
}
function deleteSupplierLocation(client, supplierId, supplierLocationId) {
    return __awaiter(this, void 0, void 0, function () {
        var supplierLocation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("supplierLocation")
                        .select("addressId")
                        .eq("supplierId", supplierId)
                        .eq("id", supplierLocationId)
                        .single()];
                case 1:
                    supplierLocation = (_a.sent()).data;
                    if (supplierLocation === null || supplierLocation === void 0 ? void 0 : supplierLocation.addressId) {
                        return [2 /*return*/, client.from("address").delete().eq("id", supplierLocation.addressId)];
                    }
                    else {
                        // The supplierLocation should always have an addressId, but just in case
                        return [2 /*return*/, client
                                .from("supplierLocation")
                                .delete()
                                .eq("supplierId", supplierId)
                                .eq("id", supplierLocationId)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function deleteSupplierProcess(client, supplierProcessId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierProcess")
                    .delete()
                    .eq("id", supplierProcessId)
                    .single()];
        });
    });
}
function deleteSupplierQuote(client, supplierQuoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("supplierQuote").delete().eq("id", supplierQuoteId)];
        });
    });
}
function deleteSupplierQuoteLine(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("supplierQuoteLine").delete().eq("id", id)];
        });
    });
}
function deleteSupplierType(client, supplierTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("supplierType").delete().eq("id", supplierTypeId)];
        });
    });
}
function getPurchaseOrder(client, purchaseOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrders")
                    .select("*")
                    .eq("id", purchaseOrderId)
                    .single()];
        });
    });
}
function finalizeSupplierQuote(client, supplierQuoteId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var quoteUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("supplierQuote")
                        .update({
                        status: "Active",
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                        updatedBy: userId
                    })
                        .eq("id", supplierQuoteId)];
                case 1:
                    quoteUpdate = _a.sent();
                    if (quoteUpdate.error) {
                        return [2 /*return*/, quoteUpdate];
                    }
                    return [2 /*return*/, { data: null, error: null }];
            }
        });
    });
}
function getPurchaseOrders(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("purchaseOrders")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("purchaseOrderId.ilike.%".concat(args.search, "%,supplierReference.ilike.%").concat(args.search, "%"));
            }
            if (args.supplierId) {
                query = query.eq("supplierId", args.supplierId);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "purchaseOrderId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getPurchaseOrderDelivery(client, purchaseOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrderDelivery")
                    .select("*")
                    .eq("id", purchaseOrderId)
                    .maybeSingle()];
        });
    });
}
function getPurchaseOrderLocations(client, purchaseOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrderLocations")
                    .select("*")
                    .eq("id", purchaseOrderId)
                    .single()];
        });
    });
}
function getPurchaseOrderPayment(client, purchaseOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrderPayment")
                    .select("*")
                    .eq("id", purchaseOrderId)
                    .maybeSingle()];
        });
    });
}
function getPurchaseOrderLines(client, purchaseOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrderLines")
                    .select("*")
                    .eq("purchaseOrderId", purchaseOrderId)
                    .order("sortOrder", { ascending: true })
                    .order("createdAt", { ascending: true })];
        });
    });
}
function getPurchaseOrderLine(client, purchaseOrderLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrderLines")
                    .select("*")
                    .eq("id", purchaseOrderLineId)
                    .single()];
        });
    });
}
function getPurchaseOrderSuppliers(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrderSuppliers")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getPurchasingDocumentsAssignedToMe(client, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, purchaseOrders, supplierQuotes, purchaseInvoices, merged;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseOrder")
                            .select("*")
                            .eq("assignee", userId)
                            .eq("companyId", companyId),
                        client
                            .from("supplierQuote")
                            .select("*")
                            .eq("assignee", userId)
                            .eq("companyId", companyId),
                        client
                            .from("purchaseInvoice")
                            .select("*")
                            .eq("assignee", userId)
                            .eq("companyId", companyId)
                    ])];
                case 1:
                    _a = _h.sent(), purchaseOrders = _a[0], supplierQuotes = _a[1], purchaseInvoices = _a[2];
                    merged = __spreadArray(__spreadArray(__spreadArray([], ((_c = (_b = purchaseOrders.data) === null || _b === void 0 ? void 0 : _b.map(function (doc) { return (__assign(__assign({}, doc), { type: "purchaseOrder" })); })) !== null && _c !== void 0 ? _c : []), true), ((_e = (_d = supplierQuotes.data) === null || _d === void 0 ? void 0 : _d.map(function (doc) { return (__assign(__assign({}, doc), { type: "supplierQuote" })); })) !== null && _e !== void 0 ? _e : []), true), ((_g = (_f = purchaseInvoices.data) === null || _f === void 0 ? void 0 : _f.map(function (doc) { return (__assign(__assign({}, doc), { type: "purchaseInvoice" })); })) !== null && _g !== void 0 ? _g : []), true).sort(function (a, b) { var _a, _b; return ((_a = a.createdAt) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.createdAt) !== null && _b !== void 0 ? _b : ""); });
                    return [2 /*return*/, merged];
            }
        });
    });
}
function getPurchasingPlanning(client, locationId, companyId, periods, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.rpc("get_purchasing_planning", {
                location_id: locationId,
                company_id: companyId,
                periods: periods
            }, {
                count: "exact"
            });
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,readableIdWithRevision.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "quantityToOrder", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getPurchasingTerms(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("terms")
                    .select("purchasingTerms")
                    .eq("id", companyId)
                    .single()];
        });
    });
}
function getSupplier(client, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("suppliers").select("*").eq("id", supplierId).single()];
        });
    });
}
function getSupplierApprovalContext(serviceRole, supplierId, status, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var latest, req, canApprove, decision, terminalRequest;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, shared_service_1.getLatestApprovalRequestForDocument)(serviceRole, "supplier", supplierId)];
                case 1:
                    latest = _d.sent();
                    req = latest.data;
                    return [4 /*yield*/, (0, shared_service_1.canApproveRequest)(serviceRole, {
                            amount: (_a = req === null || req === void 0 ? void 0 : req.amount) !== null && _a !== void 0 ? _a : null,
                            documentType: "supplier",
                            companyId: companyId
                        }, userId)];
                case 2:
                    canApprove = _d.sent();
                    decision = null;
                    return [4 /*yield*/, serviceRole
                            .from("approvalRequest")
                            .select("status, decisionBy, decisionAt")
                            .eq("documentType", "supplier")
                            .eq("documentId", supplierId)
                            .in("status", ["Approved", "Rejected"])
                            .order("decisionAt", { ascending: false })
                            .limit(1)
                            .maybeSingle()];
                case 3:
                    terminalRequest = _d.sent();
                    if (((_b = terminalRequest.data) === null || _b === void 0 ? void 0 : _b.decisionBy) &&
                        ((_c = terminalRequest.data) === null || _c === void 0 ? void 0 : _c.decisionAt) &&
                        (terminalRequest.data.status === "Approved" ||
                            terminalRequest.data.status === "Rejected")) {
                        decision = {
                            status: terminalRequest.data.status,
                            decisionBy: terminalRequest.data.decisionBy,
                            decisionAt: terminalRequest.data.decisionAt
                        };
                    }
                    if (!req || req.status !== "Pending" || !req.requestedBy || !req.id) {
                        return [2 /*return*/, {
                                approvalRequest: null,
                                canApprove: canApprove,
                                decision: decision
                            }];
                    }
                    return [2 /*return*/, {
                            approvalRequest: { id: req.id },
                            canApprove: canApprove,
                            decision: decision
                        }];
            }
        });
    });
}
function getSupplierContact(client, supplierContactId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierContact")
                    .select("*, contact(id, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, notes)")
                    .eq("id", supplierContactId)
                    .single()];
        });
    });
}
function getSupplierContacts(client, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierContact")
                    .select("*, contact(id, fullName, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, notes), user(id, active)")
                    .eq("supplierId", supplierId)];
        });
    });
}
function getSupplierInteraction(client, opportunityId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!opportunityId) {
                        // @ts-expect-error
                        return [2 /*return*/, {
                                data: null,
                                error: null
                            }];
                    }
                    return [4 /*yield*/, client.rpc("get_supplier_interaction_with_related_records", {
                            supplier_interaction_id: opportunityId
                        })];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, {
                            data: (_a = response.data) === null || _a === void 0 ? void 0 : _a[0],
                            error: response.error
                        }];
            }
        });
    });
}
function getSupplierInteractionDocuments(client, companyId, interactionId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.storage
                        .from("private")
                        .list("".concat(companyId, "/supplier-interaction/").concat(interactionId))];
                case 1:
                    result = _c.sent();
                    if (result.error) {
                        console.error("Failed to list supplier interaction documents", result.error);
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.map(function (f) { return (__assign(__assign({}, f), { bucket: "supplier-interaction" })); })) !== null && _b !== void 0 ? _b : [])];
            }
        });
    });
}
function getSupplierInteractionLineDocuments(client, companyId, lineId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.storage
                        .from("private")
                        .list("".concat(companyId, "/supplier-interaction-line/").concat(lineId))];
                case 1:
                    result = _c.sent();
                    if (result.error) {
                        console.error("Failed to list supplier interaction line documents", result.error);
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.map(function (f) { return (__assign(__assign({}, f), { bucket: "supplier-interaction-line" })); })) !== null && _b !== void 0 ? _b : [])];
            }
        });
    });
}
function getSupplierLocations(client, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierLocation")
                    .select("*, address(id, addressLine1, addressLine2, city, stateProvince, country(alpha2, name), postalCode)")
                    .eq("supplierId", supplierId)];
        });
    });
}
function getSupplierLocation(client, supplierContactId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierLocation")
                    .select("*, address(id, addressLine1, addressLine2, city, stateProvince, country(alpha2, name), postalCode)")
                    .eq("id", supplierContactId)
                    .single()];
        });
    });
}
function getSupplierPayment(client, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierPayment")
                    .select("*")
                    .eq("supplierId", supplierId)
                    .single()];
        });
    });
}
function getSupplierProcessById(client, supplierProcessId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierProcesses")
                    .select("*")
                    .eq("id", supplierProcessId)
                    .single()];
        });
    });
}
function getSupplierProcessesByProcess(client, processId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierProcesses")
                    .select("*")
                    .eq("processId", processId)];
        });
    });
}
function getSupplierProcessesBySupplier(client, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierProcesses")
                    .select("*")
                    .eq("supplierId", supplierId)];
        });
    });
}
function getSupplierQuote(client, supplierQuoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierQuotes")
                    .select("*")
                    .eq("id", supplierQuoteId)
                    .single()];
        });
    });
}
function getSupplierQuoteByInteractionId(client, interactionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierQuotes")
                    .select("*")
                    .eq("supplierInteractionId", interactionId)
                    .single()];
        });
    });
}
function getSupplierQuoteByExternalLinkId(client, externalLinkId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierQuote")
                    .select("*")
                    .eq("externalLinkId", externalLinkId)
                    .single()];
        });
    });
}
function getSupplierQuotes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("supplierQuotes")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("supplierQuoteId.ilike.%".concat(args.search, "%,name.ilike.%").concat(args.search, "%,supplierReference.ilike%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "supplierQuoteId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getSupplierQuoteLine(client, supplierQuoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierQuoteLines")
                    .select("*")
                    .eq("id", supplierQuoteLineId)
                    .single()];
        });
    });
}
function getSupplierQuoteLines(client, supplierQuoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierQuoteLines")
                    .select("*")
                    .eq("supplierQuoteId", supplierQuoteId)
                    .order("sortOrder", { ascending: true })];
        });
    });
}
function getSupplierQuoteLinePrices(client, supplierQuoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierQuoteLinePrice")
                    .select("*")
                    .eq("supplierQuoteLineId", supplierQuoteLineId)];
        });
    });
}
function getSupplierQuoteLinePricesByQuoteId(client, supplierQuoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierQuoteLinePrice")
                    .select("*")
                    .eq("supplierQuoteId", supplierQuoteId)
                    .order("supplierQuoteLineId", { ascending: true })];
        });
    });
}
function getSupplierQuotesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "supplierQuote", "id, supplierQuoteId", function (query) {
                    return query.eq("companyId", companyId).order("createdAt", { ascending: false });
                })];
        });
    });
}
function getSupplierShipping(client, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierShipping")
                    .select("*")
                    .eq("supplierId", supplierId)
                    .single()];
        });
    });
}
function getSuppliers(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("suppliers")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args.type) {
                query = query.eq("supplierTypeId", args.type);
            }
            if (args.status) {
                query = query.eq("status", args.status);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getSuppliersList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "supplier", "id, name", function (query) {
                    return query.eq("companyId", companyId).order("name");
                })];
        });
    });
}
function getSupplierType(client, supplierTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierType")
                    .select("*")
                    .eq("id", supplierTypeId)
                    .single()];
        });
    });
}
function getSupplierTypes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("supplierType")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getSupplierTypesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierType")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function insertSupplier(client, supplier) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("supplier").insert([supplier]).select("*").single()];
        });
    });
}
function insertSupplierContact(client, supplierContact) {
    return __awaiter(this, void 0, void 0, function () {
        var insertContact, contactId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("contact")
                        .insert([
                        __assign(__assign({}, supplierContact.contact), { companyId: supplierContact.companyId, isCustomer: false })
                    ])
                        .select("id")
                        .single()];
                case 1:
                    insertContact = _b.sent();
                    if (insertContact.error) {
                        return [2 /*return*/, insertContact];
                    }
                    contactId = (_a = insertContact.data) === null || _a === void 0 ? void 0 : _a.id;
                    if (!contactId) {
                        return [2 /*return*/, { data: null, error: new Error("Contact ID not found") }];
                    }
                    return [2 /*return*/, client
                            .from("supplierContact")
                            .insert([
                            {
                                supplierId: supplierContact.supplierId,
                                contactId: contactId,
                                supplierLocationId: supplierContact.supplierLocationId,
                                customFields: supplierContact.customFields
                            }
                        ])
                            .select("id")
                            .single()];
            }
        });
    });
}
function insertSupplierInteraction(client, companyId, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierInteraction")
                    .insert([{ companyId: companyId, supplierId: supplierId }])
                    .select("id")
                    .single()];
        });
    });
}
function insertSupplierLocation(client, supplierLocation) {
    return __awaiter(this, void 0, void 0, function () {
        var insertAddress, addressId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("address")
                        .insert([
                        __assign(__assign({}, supplierLocation.address), { companyId: supplierLocation.companyId })
                    ])
                        .select("id")
                        .single()];
                case 1:
                    insertAddress = _b.sent();
                    if (insertAddress.error) {
                        return [2 /*return*/, insertAddress];
                    }
                    addressId = (_a = insertAddress.data) === null || _a === void 0 ? void 0 : _a.id;
                    if (!addressId) {
                        return [2 /*return*/, { data: null, error: new Error("Address ID not found") }];
                    }
                    return [2 /*return*/, client
                            .from("supplierLocation")
                            .insert([
                            {
                                supplierId: supplierLocation.supplierId,
                                addressId: addressId,
                                name: supplierLocation.name,
                                customFields: supplierLocation.customFields
                            }
                        ])
                            .select("id")
                            .single()];
            }
        });
    });
}
function finalizePurchaseOrder(client, purchaseOrderId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, purchaseOrder, lines, status, updateData;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getPurchaseOrder(client, purchaseOrderId),
                        getPurchaseOrderLines(client, purchaseOrderId)
                    ])];
                case 1:
                    _a = _c.sent(), purchaseOrder = _a[0], lines = _a[1];
                    status = (0, utils_1.getPurchaseOrderStatus)(lines.data || []).status;
                    updateData = {
                        status: status,
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                        updatedBy: userId
                    };
                    // Only set orderDate if it's not already set
                    if (!((_b = purchaseOrder.data) === null || _b === void 0 ? void 0 : _b.orderDate)) {
                        updateData.orderDate = (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString();
                    }
                    return [2 /*return*/, client
                            .from("purchaseOrder")
                            .update(updateData)
                            .eq("id", purchaseOrderId)];
            }
        });
    });
}
function sendSupplierQuote(client, supplierQuoteId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var quoteUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("supplierQuote")
                        .update({
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                        updatedBy: userId
                    })
                        .eq("id", supplierQuoteId)];
                case 1:
                    quoteUpdate = _a.sent();
                    if (quoteUpdate.error) {
                        return [2 /*return*/, quoteUpdate];
                    }
                    return [2 /*return*/, { data: null, error: null }];
            }
        });
    });
}
/** @deprecated Use updatePurchaseOrderStatus or the new updatePurchaseOrder instead */
function updatePurchaseOrderStatusLegacy(client, purchaseOrder) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrder")
                    .update(purchaseOrder)
                    .eq("id", purchaseOrder.id)];
        });
    });
}
function updatePurchaseOrderExchangeRate(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var update;
        return __generator(this, function (_a) {
            update = {
                id: data.id,
                exchangeRate: data.exchangeRate,
                exchangeRateUpdatedAt: new Date().toISOString()
            };
            return [2 /*return*/, client.from("purchaseOrder").update(update).eq("id", update.id)];
        });
    });
}
function updatePurchaseOrderFavorite(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, favorite, userId;
        return __generator(this, function (_a) {
            id = args.id, favorite = args.favorite, userId = args.userId;
            if (!favorite) {
                return [2 /*return*/, client
                        .from("purchaseOrderFavorite")
                        .delete()
                        .eq("purchaseOrderId", id)
                        .eq("userId", userId)];
            }
            else {
                return [2 /*return*/, client
                        .from("purchaseOrderFavorite")
                        .insert({ purchaseOrderId: id, userId: userId })];
            }
            return [2 /*return*/];
        });
    });
}
function updatePurchaseOrderStatus(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("purchaseOrder").update(update).eq("id", update.id)];
        });
    });
}
function updateSupplierAccounting(client, supplierAccounting) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplier")
                    .update((0, supabase_1.sanitize)(supplierAccounting))
                    .eq("id", supplierAccounting.id)];
        });
    });
}
function updateSupplierContact(client, supplierContact) {
    return __awaiter(this, void 0, void 0, function () {
        var customFieldUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!supplierContact.customFields) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("supplierContact")
                            .update({
                            customFields: supplierContact.customFields,
                            supplierLocationId: supplierContact.supplierLocationId
                        })
                            .eq("contactId", supplierContact.contactId)];
                case 1:
                    customFieldUpdate = _a.sent();
                    if (customFieldUpdate.error) {
                        return [2 /*return*/, customFieldUpdate];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, client
                        .from("contact")
                        .update((0, supabase_1.sanitize)(supplierContact.contact))
                        .eq("id", supplierContact.contactId)
                        .select("id")
                        .single()];
            }
        });
    });
}
function updateSupplierLocation(client, supplierLocation) {
    return __awaiter(this, void 0, void 0, function () {
        var customFieldUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!supplierLocation.customFields) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("supplierLocation")
                            .update({
                            name: supplierLocation.name,
                            customFields: supplierLocation.customFields
                        })
                            .eq("addressId", supplierLocation.addressId)];
                case 1:
                    customFieldUpdate = _a.sent();
                    if (customFieldUpdate.error) {
                        return [2 /*return*/, customFieldUpdate];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, client
                        .from("address")
                        .update((0, supabase_1.sanitize)(supplierLocation.address))
                        .eq("id", supplierLocation.addressId)
                        .select("id")
                        .single()];
            }
        });
    });
}
function updateSupplierPayment(client, supplierPayment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierPayment")
                    .update((0, supabase_1.sanitize)(supplierPayment))
                    .eq("supplierId", supplierPayment.supplierId)];
        });
    });
}
function updateSupplierQuoteExchangeRate(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var update;
        return __generator(this, function (_a) {
            update = {
                id: data.id,
                exchangeRate: data.exchangeRate,
                exchangeRateUpdatedAt: new Date().toISOString()
            };
            return [2 /*return*/, client.from("supplierQuote").update(update).eq("id", update.id)];
        });
    });
}
function updateSupplierQuoteFavorite(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, favorite, userId;
        return __generator(this, function (_a) {
            id = args.id, favorite = args.favorite, userId = args.userId;
            if (!favorite) {
                return [2 /*return*/, client
                        .from("supplierQuoteFavorite")
                        .delete()
                        .eq("supplierQuoteId", id)
                        .eq("userId", userId)];
            }
            else {
                return [2 /*return*/, client
                        .from("supplierQuoteFavorite")
                        .insert({ supplierQuoteId: id, userId: userId })];
            }
            return [2 /*return*/];
        });
    });
}
function updateSupplierQuoteStatus(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("supplierQuote").update(update).eq("id", update.id)];
        });
    });
}
function updateSupplierShipping(client, supplierShipping) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierShipping")
                    .update((0, supabase_1.sanitize)(supplierShipping))
                    .eq("supplierId", supplierShipping.supplierId)];
        });
    });
}
function getSupplierTax(client, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierTax")
                    .select("*")
                    .eq("supplierId", supplierId)
                    .maybeSingle()];
        });
    });
}
function updateSupplierTax(client, supplierTax) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierTax")
                    .update((0, supabase_1.sanitize)(supplierTax))
                    .eq("supplierId", supplierTax.supplierId)];
        });
    });
}
function insertPurchaseOrder(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var purchaseOrderId, seq, _a, supplierInteraction, supplierPayment, supplierShipping, purchaser, _b, paymentTermId, invoiceSupplierId, invoiceSupplierContactId, invoiceSupplierLocationId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, exchangeRate, exchangeRateUpdatedAt, currency, locationId, order, orderId, _d, delivery, payment;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    if (!input.purchaseOrderId) return [3 /*break*/, 1];
                    purchaseOrderId = input.purchaseOrderId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "purchaseOrder",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _t.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_e = seq.error) !== null && _e !== void 0 ? _e : {
                                    message: "Failed to generate PO sequence"
                                }
                            }];
                    }
                    purchaseOrderId = seq.data;
                    _t.label = 3;
                case 3: return [4 /*yield*/, Promise.all([
                        insertSupplierInteraction(client, input.companyId, input.supplierId),
                        getSupplierPayment(client, input.supplierId),
                        getSupplierShipping(client, input.supplierId),
                        (0, people_1.getEmployeeJob)(client, input.createdBy, input.companyId)
                    ])];
                case 4:
                    _a = _t.sent(), supplierInteraction = _a[0], supplierPayment = _a[1], supplierShipping = _a[2], purchaser = _a[3];
                    if (supplierInteraction.error)
                        return [2 /*return*/, { data: null, error: supplierInteraction.error }];
                    if (supplierPayment.error)
                        return [2 /*return*/, { data: null, error: supplierPayment.error }];
                    if (supplierShipping.error)
                        return [2 /*return*/, { data: null, error: supplierShipping.error }];
                    _b = supplierPayment.data, paymentTermId = _b.paymentTermId, invoiceSupplierId = _b.invoiceSupplierId, invoiceSupplierContactId = _b.invoiceSupplierContactId, invoiceSupplierLocationId = _b.invoiceSupplierLocationId;
                    _c = supplierShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    exchangeRate = 1;
                    exchangeRateUpdatedAt = new Date().toISOString();
                    if (!input.currencyCode) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, input.companyGroupId, input.currencyCode)];
                case 5:
                    currency = _t.sent();
                    if (currency.data) {
                        exchangeRate = (_f = currency.data.exchangeRate) !== null && _f !== void 0 ? _f : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _t.label = 6;
                case 6:
                    locationId = (_j = (_g = input.locationId) !== null && _g !== void 0 ? _g : (_h = purchaser === null || purchaser === void 0 ? void 0 : purchaser.data) === null || _h === void 0 ? void 0 : _h.locationId) !== null && _j !== void 0 ? _j : null;
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .insert({
                            purchaseOrderId: purchaseOrderId,
                            purchaseOrderType: input.purchaseOrderType,
                            supplierId: input.supplierId,
                            supplierContactId: input.supplierContactId,
                            supplierLocationId: input.supplierLocationId,
                            supplierInteractionId: (_k = supplierInteraction.data) === null || _k === void 0 ? void 0 : _k.id,
                            status: (_l = input.status) !== null && _l !== void 0 ? _l : "Draft",
                            orderDate: (_m = input.orderDate) !== null && _m !== void 0 ? _m : new Date().toISOString().split("T")[0],
                            currencyCode: input.currencyCode,
                            exchangeRate: exchangeRate,
                            exchangeRateUpdatedAt: exchangeRateUpdatedAt,
                            supplierReference: (_o = input.supplierReference) !== null && _o !== void 0 ? _o : null,
                            internalNotes: (_p = input.notes) !== null && _p !== void 0 ? _p : null,
                            externalNotes: (_q = input.externalNotes) !== null && _q !== void 0 ? _q : null,
                            customFields: input.customFields,
                            companyId: input.companyId,
                            createdBy: input.createdBy,
                            updatedBy: input.createdBy
                        })
                            .select("id, purchaseOrderId")
                            .single()];
                case 7:
                    order = _t.sent();
                    if (order.error)
                        return [2 /*return*/, { data: null, error: order.error }];
                    orderId = order.data.id;
                    return [4 /*yield*/, Promise.all([
                            client.from("purchaseOrderDelivery").insert({
                                id: orderId,
                                locationId: locationId,
                                receiptRequestedDate: (_r = input.receiptRequestedDate) !== null && _r !== void 0 ? _r : null,
                                shippingMethodId: shippingMethodId,
                                shippingTermId: shippingTermId,
                                incoterm: incoterm,
                                incotermLocation: incotermLocation,
                                companyId: input.companyId
                            }),
                            client.from("purchaseOrderPayment").insert({
                                id: orderId,
                                paymentTermId: paymentTermId,
                                invoiceSupplierId: invoiceSupplierId !== null && invoiceSupplierId !== void 0 ? invoiceSupplierId : input.supplierId,
                                invoiceSupplierContactId: invoiceSupplierContactId,
                                invoiceSupplierLocationId: invoiceSupplierLocationId,
                                companyId: input.companyId
                            })
                        ])];
                case 8:
                    _d = _t.sent(), delivery = _d[0], payment = _d[1];
                    if (!(delivery.error || payment.error)) return [3 /*break*/, 10];
                    return [4 /*yield*/, deletePurchaseOrder(client, orderId)];
                case 9:
                    _t.sent();
                    return [2 /*return*/, { data: null, error: (_s = delivery.error) !== null && _s !== void 0 ? _s : payment.error }];
                case 10: return [2 /*return*/, { data: { id: orderId, purchaseOrderId: purchaseOrderId }, error: null }];
            }
        });
    });
}
function updatePurchaseOrder(client, input, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, notes, updates, exchangeRate, exchangeRateUpdatedAt, currency;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = input.id, updatedBy = input.updatedBy, notes = input.notes, updates = __rest(input, ["id", "updatedBy", "notes"]);
                    if (!(updates.currencyCode && companyGroupId)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, companyGroupId, updates.currencyCode)];
                case 1:
                    currency = _b.sent();
                    if (currency.data) {
                        exchangeRate = (_a = currency.data.exchangeRate) !== null && _a !== void 0 ? _a : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/, client
                        .from("purchaseOrder")
                        .update(__assign(__assign(__assign(__assign(__assign({}, (0, supabase_1.sanitize)(updates)), (exchangeRate !== undefined && { exchangeRate: exchangeRate })), (exchangeRateUpdatedAt && { exchangeRateUpdatedAt: exchangeRateUpdatedAt })), (notes !== undefined && { internalNotes: notes })), { updatedBy: updatedBy, updatedAt: new Date().toISOString() }))
                        .eq("id", id)
                        .select("id")
                        .single()];
            }
        });
    });
}
/** @deprecated Use insertPurchaseOrder for new orders, updatePurchaseOrder for existing orders */
function upsertPurchaseOrder(client, purchaseOrder, receiptRequestedDate) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, supplierInteraction, supplierPayment, supplierShipping, purchaser, _b, paymentTermId, invoiceSupplierId, invoiceSupplierContactId, invoiceSupplierLocationId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, currency, locationId, _locationId, _companyGroupId, purchaseOrderData, order, purchaseOrderId, _d, delivery, payment;
        var _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if ("id" in purchaseOrder) {
                        return [2 /*return*/, client
                                .from("purchaseOrder")
                                .update((0, supabase_1.sanitize)(purchaseOrder))
                                .eq("id", purchaseOrder.id)
                                .select("id, purchaseOrderId")];
                    }
                    return [4 /*yield*/, Promise.all([
                            insertSupplierInteraction(client, purchaseOrder.companyId, purchaseOrder.supplierId),
                            getSupplierPayment(client, purchaseOrder.supplierId),
                            getSupplierShipping(client, purchaseOrder.supplierId),
                            (0, people_1.getEmployeeJob)(client, purchaseOrder.createdBy, purchaseOrder.companyId)
                        ])];
                case 1:
                    _a = _l.sent(), supplierInteraction = _a[0], supplierPayment = _a[1], supplierShipping = _a[2], purchaser = _a[3];
                    if (supplierInteraction.error)
                        return [2 /*return*/, supplierInteraction];
                    if (supplierPayment.error)
                        return [2 /*return*/, supplierPayment];
                    if (supplierShipping.error)
                        return [2 /*return*/, supplierShipping];
                    _b = supplierPayment.data, paymentTermId = _b.paymentTermId, invoiceSupplierId = _b.invoiceSupplierId, invoiceSupplierContactId = _b.invoiceSupplierContactId, invoiceSupplierLocationId = _b.invoiceSupplierLocationId;
                    _c = supplierShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    if (!purchaseOrder.currencyCode) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, purchaseOrder.companyGroupId, purchaseOrder.currencyCode)];
                case 2:
                    currency = _l.sent();
                    if (currency.data) {
                        purchaseOrder.exchangeRate = (_e = currency.data.exchangeRate) !== null && _e !== void 0 ? _e : undefined;
                        purchaseOrder.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    purchaseOrder.exchangeRate = 1;
                    purchaseOrder.exchangeRateUpdatedAt = new Date().toISOString();
                    _l.label = 4;
                case 4:
                    locationId = (_h = (_f = purchaseOrder.locationId) !== null && _f !== void 0 ? _f : (_g = purchaser === null || purchaser === void 0 ? void 0 : purchaser.data) === null || _g === void 0 ? void 0 : _g.locationId) !== null && _h !== void 0 ? _h : null;
                    _locationId = purchaseOrder.locationId, _companyGroupId = purchaseOrder.companyGroupId, purchaseOrderData = __rest(purchaseOrder, ["locationId", "companyGroupId"]);
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .insert([
                            __assign(__assign({}, purchaseOrderData), { supplierInteractionId: (_j = supplierInteraction.data) === null || _j === void 0 ? void 0 : _j.id, status: (_k = purchaseOrder.status) !== null && _k !== void 0 ? _k : "Draft" })
                        ])
                            .select("id, purchaseOrderId")];
                case 5:
                    order = _l.sent();
                    if (order.error)
                        return [2 /*return*/, order];
                    purchaseOrderId = order.data[0].id;
                    return [4 /*yield*/, Promise.all([
                            client.from("purchaseOrderDelivery").insert([
                                {
                                    id: purchaseOrderId,
                                    receiptRequestedDate: receiptRequestedDate !== null && receiptRequestedDate !== void 0 ? receiptRequestedDate : null,
                                    locationId: locationId,
                                    shippingMethodId: shippingMethodId,
                                    shippingTermId: shippingTermId,
                                    incoterm: incoterm,
                                    incotermLocation: incotermLocation,
                                    companyId: purchaseOrder.companyId
                                }
                            ]),
                            client.from("purchaseOrderPayment").insert([
                                {
                                    id: purchaseOrderId,
                                    invoiceSupplierId: invoiceSupplierId,
                                    invoiceSupplierContactId: invoiceSupplierContactId,
                                    invoiceSupplierLocationId: invoiceSupplierLocationId,
                                    paymentTermId: paymentTermId,
                                    companyId: purchaseOrder.companyId
                                }
                            ])
                        ])];
                case 6:
                    _d = _l.sent(), delivery = _d[0], payment = _d[1];
                    if (!delivery.error) return [3 /*break*/, 8];
                    return [4 /*yield*/, deletePurchaseOrder(client, purchaseOrderId)];
                case 7:
                    _l.sent();
                    return [2 /*return*/, payment];
                case 8:
                    if (!payment.error) return [3 /*break*/, 10];
                    return [4 /*yield*/, deletePurchaseOrder(client, purchaseOrderId)];
                case 9:
                    _l.sent();
                    return [2 /*return*/, payment];
                case 10: return [2 /*return*/, order];
            }
        });
    });
}
function upsertPurchaseOrderDelivery(client, purchaseOrderDelivery) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in purchaseOrderDelivery) {
                return [2 /*return*/, client
                        .from("purchaseOrderDelivery")
                        .update((0, supabase_1.sanitize)(purchaseOrderDelivery))
                        .eq("id", purchaseOrderDelivery.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("purchaseOrderDelivery")
                    .insert([purchaseOrderDelivery])
                    .select("id")
                    .single()];
        });
    });
}
function upsertPurchaseOrderLine(client, purchaseOrderLine) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, maxSortOrder;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ("id" in purchaseOrderLine) {
                        return [2 /*return*/, client
                                .from("purchaseOrderLine")
                                .update((0, supabase_1.sanitize)(purchaseOrderLine))
                                .eq("id", purchaseOrderLine.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("purchaseOrderLine")
                            .select("sortOrder")
                            .eq("purchaseOrderId", purchaseOrderLine.purchaseOrderId)];
                case 1:
                    existing = _b.sent();
                    maxSortOrder = ((_a = existing.data) !== null && _a !== void 0 ? _a : []).reduce(function (max, row) { var _a; return Math.max(max, (_a = row.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [2 /*return*/, client
                            .from("purchaseOrderLine")
                            .insert([__assign(__assign({}, purchaseOrderLine), { sortOrder: maxSortOrder + 1 })])
                            .select("id")
                            .single()];
            }
        });
    });
}
function updatePurchaseOrderLineOrder(db, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, updates_1, _a, id, sortOrder, updatedBy;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _i = 0, updates_1 = updates;
                                _b.label = 1;
                            case 1:
                                if (!(_i < updates_1.length)) return [3 /*break*/, 4];
                                _a = updates_1[_i], id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                                return [4 /*yield*/, trx
                                        .updateTable("purchaseOrderLine")
                                        .set({ sortOrder: sortOrder, updatedBy: updatedBy })
                                        .where("id", "=", id)
                                        .execute()];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function upsertPurchaseOrderPayment(client, purchaseOrderPayment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in purchaseOrderPayment) {
                return [2 /*return*/, client
                        .from("purchaseOrderPayment")
                        .update((0, supabase_1.sanitize)(purchaseOrderPayment))
                        .eq("id", purchaseOrderPayment.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("purchaseOrderPayment")
                    .insert([purchaseOrderPayment])
                    .select("id")
                    .single()];
        });
    });
}
function upsertSupplier(client, supplier) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in supplier) {
                return [2 /*return*/, client
                        .from("supplier")
                        .insert([supplier])
                        .select("id, name")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("supplier")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(supplier)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", supplier.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertSupplierProcess(client, supplierProcess) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in supplierProcess) {
                return [2 /*return*/, client
                        .from("supplierProcess")
                        .insert([supplierProcess])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("supplierProcess")
                    .update((0, supabase_1.sanitize)(supplierProcess))
                    .eq("id", supplierProcess.id)
                    .select("id")
                    .single()];
        });
    });
}
function insertSupplierQuote(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var supplierQuoteId, seq, exchangeRate, exchangeRateUpdatedAt, currency, supplierInteraction, quote, createdQuoteId, externalLink;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!input.supplierQuoteId) return [3 /*break*/, 1];
                    supplierQuoteId = input.supplierQuoteId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "supplierQuote",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _h.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate supplier quote sequence"
                                }
                            }];
                    }
                    supplierQuoteId = seq.data;
                    _h.label = 3;
                case 3:
                    exchangeRate = 1;
                    exchangeRateUpdatedAt = new Date().toISOString();
                    if (!input.currencyCode) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, input.companyGroupId, input.currencyCode)];
                case 4:
                    currency = _h.sent();
                    if (currency.data) {
                        exchangeRate = (_b = currency.data.exchangeRate) !== null && _b !== void 0 ? _b : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _h.label = 5;
                case 5: return [4 /*yield*/, insertSupplierInteraction(client, input.companyId, input.supplierId)];
                case 6:
                    supplierInteraction = _h.sent();
                    if (supplierInteraction.error)
                        return [2 /*return*/, { data: null, error: supplierInteraction.error }];
                    return [4 /*yield*/, client
                            .from("supplierQuote")
                            .insert({
                            supplierQuoteId: supplierQuoteId,
                            supplierId: input.supplierId,
                            supplierContactId: input.supplierContactId,
                            supplierLocationId: input.supplierLocationId,
                            supplierInteractionId: (_c = supplierInteraction.data) === null || _c === void 0 ? void 0 : _c.id,
                            status: (_d = input.status) !== null && _d !== void 0 ? _d : "Draft",
                            expirationDate: input.expirationDate,
                            currencyCode: input.currencyCode,
                            exchangeRate: exchangeRate,
                            exchangeRateUpdatedAt: exchangeRateUpdatedAt,
                            internalNotes: input.notes,
                            customFields: input.customFields,
                            quotedDate: (_e = input.quotedDate) !== null && _e !== void 0 ? _e : new Date().toISOString(),
                            supplierReference: (_f = input.supplierReference) !== null && _f !== void 0 ? _f : null,
                            supplierQuoteType: (_g = input.supplierQuoteType) !== null && _g !== void 0 ? _g : "Purchase",
                            companyId: input.companyId,
                            createdBy: input.createdBy,
                            updatedBy: input.createdBy
                        })
                            .select("id, supplierQuoteId, externalLinkId")
                            .single()];
                case 7:
                    quote = _h.sent();
                    if (quote.error)
                        return [2 /*return*/, { data: null, error: quote.error }];
                    createdQuoteId = quote.data.id;
                    if (!!quote.data.externalLinkId) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, shared_service_1.upsertExternalLink)(client, {
                            documentType: "SupplierQuote",
                            documentId: createdQuoteId,
                            supplierId: input.supplierId,
                            expiresAt: input.expirationDate,
                            companyId: input.companyId
                        })];
                case 8:
                    externalLink = _h.sent();
                    if (!externalLink.data) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("supplierQuote")
                            .update({ externalLinkId: externalLink.data.id })
                            .eq("id", createdQuoteId)];
                case 9:
                    _h.sent();
                    _h.label = 10;
                case 10: return [2 /*return*/, { data: { id: createdQuoteId, supplierQuoteId: supplierQuoteId }, error: null }];
            }
        });
    });
}
function updateSupplierQuote(client, input, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, notes, updates, exchangeRate, exchangeRateUpdatedAt, existing, currency;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = input.id, updatedBy = input.updatedBy, notes = input.notes, updates = __rest(input, ["id", "updatedBy", "notes"]);
                    return [4 /*yield*/, client
                            .from("supplierQuote")
                            .select("currencyCode")
                            .eq("id", id)
                            .single()];
                case 1:
                    existing = _b.sent();
                    if (existing.error)
                        return [2 /*return*/, { data: null, error: existing.error }];
                    if (!(updates.currencyCode &&
                        companyGroupId &&
                        existing.data.currencyCode !== updates.currencyCode)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, companyGroupId, updates.currencyCode)];
                case 2:
                    currency = _b.sent();
                    if (currency.data) {
                        exchangeRate = (_a = currency.data.exchangeRate) !== null && _a !== void 0 ? _a : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _b.label = 3;
                case 3: return [2 /*return*/, client
                        .from("supplierQuote")
                        .update(__assign(__assign(__assign(__assign(__assign({}, (0, supabase_1.sanitize)(updates)), (exchangeRate !== undefined && { exchangeRate: exchangeRate })), (exchangeRateUpdatedAt && { exchangeRateUpdatedAt: exchangeRateUpdatedAt })), (notes !== undefined && { internalNotes: notes })), { updatedBy: updatedBy, updatedAt: new Date().toISOString() }))
                        .eq("id", id)
                        .select("id")
                        .single()];
            }
        });
    });
}
/** @deprecated Use insertSupplierQuote for new quotes, updateSupplierQuote for existing quotes */
function upsertSupplierQuote(client, supplierQuote) {
    return __awaiter(this, void 0, void 0, function () {
        var currency, supplierInteraction, _companyGroupId, supplierQuoteData, insert, supplierQuoteId, externalLink, update, existingQuote, _a, currencyCode, existingStatus, currency, _companyGroupId2, supplierQuoteUpdateData;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    if (!("createdBy" in supplierQuote)) return [3 /*break*/, 9];
                    if (!supplierQuote.currencyCode) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, supplierQuote.companyGroupId, supplierQuote.currencyCode)];
                case 1:
                    currency = _j.sent();
                    if (currency.data) {
                        supplierQuote.exchangeRate = (_b = currency.data.exchangeRate) !== null && _b !== void 0 ? _b : undefined;
                        supplierQuote.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    return [3 /*break*/, 3];
                case 2:
                    supplierQuote.exchangeRate = 1;
                    supplierQuote.exchangeRateUpdatedAt = new Date().toISOString();
                    _j.label = 3;
                case 3: return [4 /*yield*/, insertSupplierInteraction(client, supplierQuote.companyId, supplierQuote.supplierId)];
                case 4:
                    supplierInteraction = _j.sent();
                    if (supplierInteraction.error)
                        return [2 /*return*/, supplierInteraction];
                    _companyGroupId = supplierQuote.companyGroupId, supplierQuoteData = __rest(supplierQuote, ["companyGroupId"]);
                    return [4 /*yield*/, client
                            .from("supplierQuote")
                            .insert([
                            __assign(__assign({}, supplierQuoteData), { status: (_c = supplierQuoteData.status) !== null && _c !== void 0 ? _c : "Draft", supplierInteractionId: (_d = supplierInteraction.data) === null || _d === void 0 ? void 0 : _d.id })
                        ])
                            .select("id, supplierQuoteId, externalLinkId")
                            .single()];
                case 5:
                    insert = _j.sent();
                    if (insert.error) {
                        return [2 /*return*/, insert];
                    }
                    supplierQuoteId = (_e = insert.data) === null || _e === void 0 ? void 0 : _e.id;
                    if (!supplierQuoteId)
                        return [2 /*return*/, insert];
                    if (!!insert.data.externalLinkId) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, shared_service_1.upsertExternalLink)(client, {
                            documentType: "SupplierQuote",
                            documentId: supplierQuoteId,
                            supplierId: supplierQuote.supplierId,
                            expiresAt: supplierQuote.expirationDate,
                            companyId: supplierQuote.companyId
                        })];
                case 6:
                    externalLink = _j.sent();
                    if (!externalLink.data) return [3 /*break*/, 8];
                    return [4 /*yield*/, client
                            .from("supplierQuote")
                            .update({ externalLinkId: externalLink.data.id })
                            .eq("id", supplierQuoteId)];
                case 7:
                    update = _j.sent();
                    if (update.error) {
                        return [2 /*return*/, update];
                    }
                    _j.label = 8;
                case 8: return [2 /*return*/, insert];
                case 9: return [4 /*yield*/, client
                        .from("supplierQuote")
                        .select("currencyCode, status")
                        .eq("id", supplierQuote.id)
                        .single()];
                case 10:
                    existingQuote = _j.sent();
                    if (existingQuote.error)
                        return [2 /*return*/, existingQuote];
                    _a = existingQuote.data, currencyCode = _a.currencyCode, existingStatus = _a.status;
                    if (!(supplierQuote.currencyCode &&
                        currencyCode !== supplierQuote.currencyCode)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, supplierQuote.companyGroupId, supplierQuote.currencyCode)];
                case 11:
                    currency = _j.sent();
                    if (currency.data) {
                        supplierQuote.exchangeRate = (_f = currency.data.exchangeRate) !== null && _f !== void 0 ? _f : undefined;
                        supplierQuote.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _j.label = 12;
                case 12:
                    _companyGroupId2 = supplierQuote.companyGroupId, supplierQuoteUpdateData = __rest(supplierQuote, ["companyGroupId"]);
                    return [2 /*return*/, client
                            .from("supplierQuote")
                            .update(__assign(__assign({}, (0, supabase_1.sanitize)(supplierQuoteUpdateData)), { status: supplierQuote.expirationDate &&
                                (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() > supplierQuote.expirationDate
                                ? "Expired"
                                : ((_h = (_g = supplierQuote.status) !== null && _g !== void 0 ? _g : existingStatus) !== null && _h !== void 0 ? _h : "Draft"), updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                            .eq("id", supplierQuote.id)];
            }
        });
    });
}
function upsertSupplierQuoteLine(client, supplierQuoteLine) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, maxSortOrder;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if ("id" in supplierQuoteLine) {
                        return [2 /*return*/, client
                                .from("supplierQuoteLine")
                                .update((0, supabase_1.sanitize)(supplierQuoteLine))
                                .eq("id", supplierQuoteLine.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("supplierQuoteLine")
                            .select("sortOrder")
                            .eq("supplierQuoteId", supplierQuoteLine.supplierQuoteId)];
                case 1:
                    existing = _c.sent();
                    maxSortOrder = ((_a = existing.data) !== null && _a !== void 0 ? _a : []).reduce(function (max, row) { var _a; return Math.max(max, (_a = row.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [2 /*return*/, client
                            .from("supplierQuoteLine")
                            .insert([
                            __assign(__assign({}, supplierQuoteLine), { description: (_b = supplierQuoteLine.description) !== null && _b !== void 0 ? _b : "", sortOrder: maxSortOrder + 1 })
                        ])
                            .select("id")
                            .single()];
            }
        });
    });
}
function updateSupplierQuoteLineOrder(db, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, updates_2, _a, id, sortOrder, updatedBy;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _i = 0, updates_2 = updates;
                                _b.label = 1;
                            case 1:
                                if (!(_i < updates_2.length)) return [3 /*break*/, 4];
                                _a = updates_2[_i], id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                                return [4 /*yield*/, trx
                                        .updateTable("supplierQuoteLine")
                                        .set({ sortOrder: sortOrder, updatedBy: updatedBy })
                                        .where("id", "=", id)
                                        .execute()];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function upsertSupplierType(client, supplierType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in supplierType) {
                return [2 /*return*/, client
                        .from("supplierType")
                        .insert([supplierType])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("supplierType")
                        .update((0, supabase_1.sanitize)(supplierType))
                        .eq("id", supplierType.id)];
            }
            return [2 /*return*/];
        });
    });
}
// ============================================================
// PURCHASING RFQ FUNCTIONS
// ============================================================
function deletePurchasingRFQ(client, purchasingRfqId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("purchasingRfq").delete().eq("id", purchasingRfqId)];
        });
    });
}
function deletePurchasingRFQLine(client, purchasingRfqLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfqLine")
                    .delete()
                    .eq("id", purchasingRfqLineId)];
        });
    });
}
function getPurchasingRFQ(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("purchasingRfqs").select("*").eq("id", id).single()];
        });
    });
}
function getPurchasingRFQs(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("purchasingRfqs")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("rfqId", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "rfqId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getPurchasingRFQLine(client, lineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfqLines")
                    .select("*")
                    .eq("id", lineId)
                    .single()];
        });
    });
}
function getPurchasingRFQLines(client, purchasingRfqId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfqLines")
                    .select("*")
                    .eq("purchasingRfqId", purchasingRfqId)
                    .order("order", { ascending: true })];
        });
    });
}
function getPurchasingRFQSuppliers(client, purchasingRfqId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfqSupplier")
                    .select("*, supplier:supplierId(id, name)")
                    .eq("purchasingRfqId", purchasingRfqId)];
        });
    });
}
function insertPurchasingRFQ(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var rfqId, seq, rfq;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!input.rfqId) return [3 /*break*/, 1];
                    rfqId = input.rfqId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "purchasingRfq",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _d.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate purchasingRfq sequence"
                                }
                            }];
                    }
                    rfqId = seq.data;
                    _d.label = 3;
                case 3: return [4 /*yield*/, client
                        .from("purchasingRfq")
                        .insert({
                        rfqId: rfqId,
                        rfqDate: (_b = input.rfqDate) !== null && _b !== void 0 ? _b : (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                        expirationDate: input.expirationDate,
                        locationId: input.locationId,
                        employeeId: input.employeeId,
                        status: (_c = input.status) !== null && _c !== void 0 ? _c : "Draft",
                        notes: input.notes,
                        customFields: input.customFields,
                        companyId: input.companyId,
                        createdBy: input.createdBy,
                        updatedBy: input.createdBy
                    })
                        .select("id, rfqId")
                        .single()];
                case 4:
                    rfq = _d.sent();
                    if (rfq.error)
                        return [2 /*return*/, { data: null, error: rfq.error }];
                    return [2 /*return*/, { data: { id: rfq.data.id, rfqId: rfq.data.rfqId }, error: null }];
            }
        });
    });
}
function updatePurchasingRFQ(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, updates;
        return __generator(this, function (_a) {
            id = input.id, updatedBy = input.updatedBy, updates = __rest(input, ["id", "updatedBy"]);
            return [2 /*return*/, client
                    .from("purchasingRfq")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(updates)), { updatedBy: updatedBy, updatedAt: new Date().toISOString() }))
                    .eq("id", id)
                    .select("id")
                    .single()];
        });
    });
}
/** @deprecated Use insertPurchasingRFQ for new RFQs, updatePurchasingRFQ for existing RFQs */
function upsertPurchasingRFQ(client, purchasingRfq) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (purchasingRfq.id) {
                return [2 /*return*/, client
                        .from("purchasingRfq")
                        .update((0, supabase_1.sanitize)(purchasingRfq))
                        .eq("id", purchasingRfq.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("purchasingRfq")
                    .insert([purchasingRfq])
                    .select("id")
                    .single()];
        });
    });
}
function upsertPurchasingRFQLine(client, purchasingRfqLine) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in purchasingRfqLine) {
                return [2 /*return*/, client
                        .from("purchasingRfqLine")
                        .update((0, supabase_1.sanitize)(purchasingRfqLine))
                        .eq("id", purchasingRfqLine.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("purchasingRfqLine")
                    .insert([purchasingRfqLine])
                    .select("id")
                    .single()];
        });
    });
}
function updatePurchasingRFQLineOrder(db, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, updates_3, _a, id, sortOrder, updatedBy;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _i = 0, updates_3 = updates;
                                _b.label = 1;
                            case 1:
                                if (!(_i < updates_3.length)) return [3 /*break*/, 4];
                                _a = updates_3[_i], id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                                return [4 /*yield*/, trx
                                        .updateTable("purchasingRfqLine")
                                        .set({ order: sortOrder, updatedBy: updatedBy })
                                        .where("id", "=", id)
                                        .execute()];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function upsertPurchasingRFQSuppliers(client, purchasingRfqId, supplierIds, companyId, createdBy) {
    return __awaiter(this, void 0, void 0, function () {
        var suppliersToInsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Delete existing suppliers for this RFQ
                return [4 /*yield*/, client
                        .from("purchasingRfqSupplier")
                        .delete()
                        .eq("purchasingRfqId", purchasingRfqId)];
                case 1:
                    // Delete existing suppliers for this RFQ
                    _a.sent();
                    // Insert new suppliers
                    if (supplierIds.length === 0) {
                        return [2 /*return*/, { data: [], error: null }];
                    }
                    suppliersToInsert = supplierIds.map(function (supplierId) { return ({
                        purchasingRfqId: purchasingRfqId,
                        supplierId: supplierId,
                        companyId: companyId,
                        createdBy: createdBy
                    }); });
                    return [2 /*return*/, client
                            .from("purchasingRfqSupplier")
                            .insert(suppliersToInsert)
                            .select("id")];
            }
        });
    });
}
function updatePurchasingRFQStatus(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfq")
                    .update({
                    status: args.status,
                    assignee: args.assignee,
                    updatedBy: args.updatedBy,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", args.id)
                    .select("id")
                    .single()];
        });
    });
}
function getLinkedSupplierQuotes(client, purchasingRfqId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfqToSupplierQuote")
                    .select("\n      supplierQuoteId,\n      supplierQuote:supplierQuoteId (*, supplier:supplierId (*))\n    ")
                    .eq("purchasingRfqId", purchasingRfqId)];
        });
    });
}
function getLinkedPurchasingRfqs(client, supplierQuoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfqToSupplierQuote")
                    .select("\n      purchasingRfqId,\n      purchasingRfq:purchasingRfqId (*)\n    ")
                    .eq("supplierQuoteId", supplierQuoteId)];
        });
    });
}
function getLinkedPurchasingRfqsForInteraction(client, supplierInteractionId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, quotes, quotesError, quoteIds;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("supplierQuote")
                        .select("id")
                        .eq("supplierInteractionId", supplierInteractionId)];
                case 1:
                    _a = _b.sent(), quotes = _a.data, quotesError = _a.error;
                    if (quotesError || !quotes || quotes.length === 0) {
                        return [2 /*return*/, { data: [], error: quotesError }];
                    }
                    quoteIds = quotes.map(function (q) { return q.id; });
                    // Then get all purchasing RFQs linked to any of these quotes
                    return [2 /*return*/, client
                            .from("purchasingRfqToSupplierQuote")
                            .select("\n      purchasingRfqId,\n      purchasingRfq:purchasingRfqId (*)\n    ")
                            .in("supplierQuoteId", quoteIds)];
            }
        });
    });
}
// Get sibling quotes (quotes sharing any RFQ with current quote)
function getSiblingQuotesForQuote(client, supplierQuoteId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, linkedRfqs, rfqError, rfqIds;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("purchasingRfqToSupplierQuote")
                        .select("purchasingRfqId")
                        .eq("supplierQuoteId", supplierQuoteId)];
                case 1:
                    _a = _b.sent(), linkedRfqs = _a.data, rfqError = _a.error;
                    if (rfqError || !linkedRfqs || linkedRfqs.length === 0) {
                        return [2 /*return*/, { data: [], error: rfqError }];
                    }
                    rfqIds = linkedRfqs.map(function (r) { return r.purchasingRfqId; });
                    // Get all quotes linked to any of these RFQs (excluding current quote)
                    return [2 /*return*/, client
                            .from("purchasingRfqToSupplierQuote")
                            .select("\n      supplierQuoteId,\n      supplierQuote:supplierQuoteId (*, supplier:supplierId (*))\n    ")
                            .in("purchasingRfqId", rfqIds)
                            .neq("supplierQuoteId", supplierQuoteId)];
            }
        });
    });
}
// Direct Order→RFQ lookup (more efficient than going through interaction)
function getLinkedPurchasingRfqsForOrder(client, purchaseOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfqToPurchaseOrder")
                    .select("\n      purchasingRfqId,\n      purchasingRfq:purchasingRfqId (*)\n    ")
                    .eq("purchaseOrderId", purchaseOrderId)];
        });
    });
}
function getSupplierQuotesForComparison(client, purchasingRfqId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, links, linksError, allQuotes, activeQuoteIds, lines, prices;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("purchasingRfqToSupplierQuote")
                        .select("\n      supplierQuoteId,\n      supplierQuote:supplierQuoteId (*, supplier:supplierId (*))\n    ")
                        .eq("purchasingRfqId", purchasingRfqId)];
                case 1:
                    _a = _d.sent(), links = _a.data, linksError = _a.error;
                    if (linksError || !(links === null || links === void 0 ? void 0 : links.length)) {
                        return [2 /*return*/, { data: { quotes: [], lines: [], prices: [] }, error: linksError }];
                    }
                    allQuotes = links
                        .map(function (l) { return l.supplierQuote; })
                        .filter(function (q) { return q !== null; });
                    if (allQuotes.length === 0) {
                        return [2 /*return*/, { data: { quotes: [], lines: [], prices: [] }, error: null }];
                    }
                    activeQuoteIds = allQuotes
                        .filter(function (q) { return q.status === "Active"; })
                        .map(function (q) { return q.id; })
                        .filter(function (id) { return !!id; });
                    // 2. Fetch lines and pricing for active quotes only (if any)
                    if (activeQuoteIds.length === 0) {
                        return [2 /*return*/, {
                                data: { quotes: allQuotes, lines: [], prices: [] },
                                error: null
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("supplierQuoteLines")
                            .select("*")
                            .in("supplierQuoteId", activeQuoteIds)];
                case 2:
                    lines = _d.sent();
                    return [4 /*yield*/, client
                            .from("supplierQuoteLinePrice")
                            .select("*")
                            .in("supplierQuoteId", activeQuoteIds)];
                case 3:
                    prices = _d.sent();
                    return [2 /*return*/, {
                            data: {
                                quotes: allQuotes,
                                lines: (_b = lines.data) !== null && _b !== void 0 ? _b : [],
                                prices: (_c = prices.data) !== null && _c !== void 0 ? _c : []
                            },
                            error: lines.error || prices.error
                        }];
            }
        });
    });
}
// Get RFQ suppliers with their supplier info
function getPurchasingRFQSuppliersWithLinks(client, purchasingRfqId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchasingRfqSupplier")
                    .select("*, supplier:supplierId(id, name)")
                    .eq("purchasingRfqId", purchasingRfqId)];
        });
    });
}
function getDefaultAttachmentsForPO(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, supplierId, itemIds, prefixes, _i, _a, id, results;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    companyId = args.companyId, supplierId = args.supplierId, itemIds = args.itemIds;
                    prefixes = [
                        { source: "company", path: "".concat(companyId, "/default-attachments/company") }
                    ];
                    if (supplierId) {
                        prefixes.push({
                            source: "supplier",
                            path: "".concat(companyId, "/default-attachments/supplier/").concat(supplierId)
                        });
                    }
                    for (_i = 0, _a = itemIds !== null && itemIds !== void 0 ? itemIds : []; _i < _a.length; _i++) {
                        id = _a[_i];
                        prefixes.push({
                            source: "item",
                            path: "".concat(companyId, "/default-attachments/item/").concat(id)
                        });
                    }
                    return [4 /*yield*/, Promise.all(prefixes.map(function (_a) {
                            var path = _a.path;
                            return client.storage.from("private").list(path);
                        }))];
                case 1:
                    results = _b.sent();
                    return [2 /*return*/, results.flatMap(function (result, idx) {
                            var _a;
                            var _b = prefixes[idx], source = _b.source, prefix = _b.path;
                            return ((_a = result.data) !== null && _a !== void 0 ? _a : []).map(function (f) {
                                var _a;
                                return ({
                                    source: source,
                                    name: f.name,
                                    size: ((_a = f.metadata) === null || _a === void 0 ? void 0 : _a.size) != null
                                        ? Math.round(f.metadata.size / 1024)
                                        : null,
                                    path: "".concat(prefix, "/").concat(f.name)
                                });
                            });
                        })];
            }
        });
    });
}
