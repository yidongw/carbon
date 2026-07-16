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
exports.LIVE_JOB_STATUSES = exports.priceSourceTypes = void 0;
exports.applyPriceRules = applyPriceRules;
exports.closeSalesOrder = closeSalesOrder;
exports.convertSalesRfqToQuote = convertSalesRfqToQuote;
exports.convertQuoteToOrder = convertQuoteToOrder;
exports.copyQuoteLine = copyQuoteLine;
exports.copyQuote = copyQuote;
exports.createPricingRule = createPricingRule;
exports.deleteCustomer = deleteCustomer;
exports.deleteCustomerContact = deleteCustomerContact;
exports.deleteCustomerLocation = deleteCustomerLocation;
exports.deleteCustomerStatus = deleteCustomerStatus;
exports.deleteCustomerType = deleteCustomerType;
exports.deleteNoQuoteReason = deleteNoQuoteReason;
exports.deletePricingRule = deletePricingRule;
exports.deleteQuote = deleteQuote;
exports.deleteQuoteMakeMethod = deleteQuoteMakeMethod;
exports.deleteQuoteLine = deleteQuoteLine;
exports.deleteQuoteMaterial = deleteQuoteMaterial;
exports.deleteQuoteOperation = deleteQuoteOperation;
exports.deleteQuoteOperationStep = deleteQuoteOperationStep;
exports.deleteQuoteOperationParameter = deleteQuoteOperationParameter;
exports.deleteQuoteOperationTool = deleteQuoteOperationTool;
exports.deleteSalesOrder = deleteSalesOrder;
exports.deleteSalesOrderLine = deleteSalesOrderLine;
exports.deleteSalesRFQ = deleteSalesRFQ;
exports.deleteSalesRFQLine = deleteSalesRFQLine;
exports.duplicatePricingRule = duplicatePricingRule;
exports.getConfigurationParametersByQuoteLineId = getConfigurationParametersByQuoteLineId;
exports.getCustomer = getCustomer;
exports.getCustomerContact = getCustomerContact;
exports.getCustomerContacts = getCustomerContacts;
exports.getCustomerItemPriceOverride = getCustomerItemPriceOverride;
exports.getCustomerLocation = getCustomerLocation;
exports.getCustomerLocations = getCustomerLocations;
exports.getCustomerPayment = getCustomerPayment;
exports.getCustomerShipping = getCustomerShipping;
exports.getCustomerTax = getCustomerTax;
exports.getCustomerTypeItemPriceOverride = getCustomerTypeItemPriceOverride;
exports.getAllCustomersItemPriceOverride = getAllCustomersItemPriceOverride;
exports.getCustomers = getCustomers;
exports.getCustomersList = getCustomersList;
exports.getCustomerStatus = getCustomerStatus;
exports.getCustomerStatuses = getCustomerStatuses;
exports.getCustomerStatusesList = getCustomerStatusesList;
exports.getCustomerType = getCustomerType;
exports.getCustomerTypes = getCustomerTypes;
exports.getCustomerTypesList = getCustomerTypesList;
exports.getExternalSalesOrderLines = getExternalSalesOrderLines;
exports.getModelByQuoteLineId = getModelByQuoteLineId;
exports.getNoQuoteReasonsList = getNoQuoteReasonsList;
exports.getNoQuoteReason = getNoQuoteReason;
exports.getNoQuoteReasons = getNoQuoteReasons;
exports.getOpportunity = getOpportunity;
exports.getOrCreateOpportunityForRecord = getOrCreateOpportunityForRecord;
exports.getOrCreateOpportunityForSalesOrder = getOrCreateOpportunityForSalesOrder;
exports.getOpportunityDocuments = getOpportunityDocuments;
exports.getOpportunityLineDocuments = getOpportunityLineDocuments;
exports.getPricingRule = getPricingRule;
exports.getPricingRules = getPricingRules;
exports.getQuote = getQuote;
exports.getQuoteFavorites = getQuoteFavorites;
exports.getQuotes = getQuotes;
exports.getQuotesList = getQuotesList;
exports.getQuoteAssembliesByLine = getQuoteAssembliesByLine;
exports.getQuoteAssemblies = getQuoteAssemblies;
exports.getQuoteCustomerDetails = getQuoteCustomerDetails;
exports.getQuoteLine = getQuoteLine;
exports.getQuoteLinesList = getQuoteLinesList;
exports.getQuoteMakeMethod = getQuoteMakeMethod;
exports.getRootQuoteMakeMethod = getRootQuoteMakeMethod;
exports.getQuoteMethodTrees = getQuoteMethodTrees;
exports.getQuoteMethodTreeArray = getQuoteMethodTreeArray;
exports.getQuoteLines = getQuoteLines;
exports.getQuoteByExternalId = getQuoteByExternalId;
exports.getQuoteLinePrices = getQuoteLinePrices;
exports.getQuoteLinePricesByQuoteId = getQuoteLinePricesByQuoteId;
exports.getQuoteLinePricesByItemId = getQuoteLinePricesByItemId;
exports.getQuoteLinePricesByItemIds = getQuoteLinePricesByItemIds;
exports.getQuoteMaterials = getQuoteMaterials;
exports.getQuoteMaterial = getQuoteMaterial;
exports.getQuoteMaterialsByLine = getQuoteMaterialsByLine;
exports.getQuoteMaterialsByMethodId = getQuoteMaterialsByMethodId;
exports.getQuoteMaterialsByOperation = getQuoteMaterialsByOperation;
exports.getQuoteOperation = getQuoteOperation;
exports.getQuoteOperationsByLine = getQuoteOperationsByLine;
exports.getQuoteOperationsByMethodId = getQuoteOperationsByMethodId;
exports.getQuoteOperations = getQuoteOperations;
exports.getQuotePayment = getQuotePayment;
exports.getQuoteShipment = getQuoteShipment;
exports.getRelatedPricesForQuoteLine = getRelatedPricesForQuoteLine;
exports.getSalesDocumentsAssignedToMe = getSalesDocumentsAssignedToMe;
exports.getSalesOrder = getSalesOrder;
exports.getSalesOrderCustomerDetails = getSalesOrderCustomerDetails;
exports.getSalesOrderFavorites = getSalesOrderFavorites;
exports.getSalesOrderRelatedItems = getSalesOrderRelatedItems;
exports.getSalesOrders = getSalesOrders;
exports.getSalesOrdersList = getSalesOrdersList;
exports.getSalesOrdersByIds = getSalesOrdersByIds;
exports.getSalesOrderPayment = getSalesOrderPayment;
exports.getSalesTerms = getSalesTerms;
exports.getSalesOrderShipment = getSalesOrderShipment;
exports.getSalesOrderCustomers = getSalesOrderCustomers;
exports.getSalesOrderLines = getSalesOrderLines;
exports.getSalesOrderInvoiceLines = getSalesOrderInvoiceLines;
exports.getSalesOrderInvoicesByIds = getSalesOrderInvoicesByIds;
exports.getSalesOrderLinesByItemId = getSalesOrderLinesByItemId;
exports.getSalesOrderLinesByItemIds = getSalesOrderLinesByItemIds;
exports.getSalesOrderLine = getSalesOrderLine;
exports.getSalesOrderLineShipments = getSalesOrderLineShipments;
exports.getSalesRFQ = getSalesRFQ;
exports.getSalesRFQFavorites = getSalesRFQFavorites;
exports.getSalesRFQs = getSalesRFQs;
exports.getSalesRFQLine = getSalesRFQLine;
exports.getSalesRFQLines = getSalesRFQLines;
exports.insertCustomerContact = insertCustomerContact;
exports.insertCustomerLocation = insertCustomerLocation;
exports.insertSalesOrderLines = insertSalesOrderLines;
exports.finalizeQuote = finalizeQuote;
exports.releaseSalesOrder = releaseSalesOrder;
exports.resolvePrice = resolvePrice;
exports.resolvePriceList = resolvePriceList;
exports.getBaseCatalog = getBaseCatalog;
exports.upsertCustomer = upsertCustomer;
exports.upsertCustomerItemPriceOverride = upsertCustomerItemPriceOverride;
exports.deleteCustomerItemPriceOverride = deleteCustomerItemPriceOverride;
exports.getCustomerItemPriceOverrideById = getCustomerItemPriceOverrideById;
exports.getCustomerItemPriceOverridesList = getCustomerItemPriceOverridesList;
exports.updateCustomerAccounting = updateCustomerAccounting;
exports.updateCustomerContact = updateCustomerContact;
exports.updateCustomerLocation = updateCustomerLocation;
exports.updateCustomerPayment = updateCustomerPayment;
exports.updateCustomerShipping = updateCustomerShipping;
exports.updateCustomerTax = updateCustomerTax;
exports.updatePricingRule = updatePricingRule;
exports.upsertCustomerStatus = upsertCustomerStatus;
exports.upsertCustomerType = upsertCustomerType;
exports.upsertNoQuoteReason = upsertNoQuoteReason;
exports.updateSalesRFQFavorite = updateSalesRFQFavorite;
exports.updateQuoteExchangeRate = updateQuoteExchangeRate;
exports.updateQuoteLinePrecision = updateQuoteLinePrecision;
exports.updateSalesOrderExchangeRate = updateSalesOrderExchangeRate;
exports.updateQuoteFavorite = updateQuoteFavorite;
exports.updateSalesRFQStatus = updateSalesRFQStatus;
exports.updateQuoteMaterialOrder = updateQuoteMaterialOrder;
exports.updateQuoteOperationOrder = updateQuoteOperationOrder;
exports.updateQuoteStatus = updateQuoteStatus;
exports.upsertMakeMethodFromQuoteLine = upsertMakeMethodFromQuoteLine;
exports.upsertMakeMethodFromQuoteMethod = upsertMakeMethodFromQuoteMethod;
exports.insertQuote = insertQuote;
exports.updateQuote = updateQuote;
exports.upsertQuote = upsertQuote;
exports.upsertQuoteLine = upsertQuoteLine;
exports.updateQuoteLineOrder = updateQuoteLineOrder;
exports.upsertQuoteLineAdditionalCharges = upsertQuoteLineAdditionalCharges;
exports.upsertQuoteLinePrices = upsertQuoteLinePrices;
exports.calculatePricesForQuantities = calculatePricesForQuantities;
exports.resolveQuoteLinePrices = resolveQuoteLinePrices;
exports.resolvePurchaseToOrderPrices = resolvePurchaseToOrderPrices;
exports.recalculateQuoteLinePrices = recalculateQuoteLinePrices;
exports.upsertQuoteLineMethod = upsertQuoteLineMethod;
exports.upsertQuoteMaterial = upsertQuoteMaterial;
exports.upsertQuoteMaterialMakeMethod = upsertQuoteMaterialMakeMethod;
exports.upsertQuoteOperation = upsertQuoteOperation;
exports.upsertQuoteOperationStep = upsertQuoteOperationStep;
exports.upsertQuoteOperationParameter = upsertQuoteOperationParameter;
exports.upsertQuoteOperationTool = upsertQuoteOperationTool;
exports.upsertQuotePayment = upsertQuotePayment;
exports.upsertQuoteShipment = upsertQuoteShipment;
exports.updateSalesOrderFavorite = updateSalesOrderFavorite;
exports.updateSalesOrderStatus = updateSalesOrderStatus;
exports.insertSalesOrder = insertSalesOrder;
exports.updateSalesOrder = updateSalesOrder;
exports.cancelSalesOrder = cancelSalesOrder;
exports.upsertSalesOrder = upsertSalesOrder;
exports.upsertSalesOrderShipment = upsertSalesOrderShipment;
exports.upsertSalesOrderLine = upsertSalesOrderLine;
exports.updateSalesOrderLineOrder = updateSalesOrderLineOrder;
exports.upsertSalesOrderPayment = upsertSalesOrderPayment;
exports.insertSalesRFQ = insertSalesRFQ;
exports.updateSalesRFQ = updateSalesRFQ;
exports.upsertSalesRFQ = upsertSalesRFQ;
exports.upsertSalesRFQLine = upsertSalesRFQLine;
exports.updateSalesRFQLineOrder = updateSalesRFQLineOrder;
var database_1 = require("@carbon/database");
var date_1 = require("@internationalized/date");
var items_service_1 = require("~/modules/items/items.service");
var people_1 = require("~/modules/people");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var accounting_1 = require("../accounting");
var shared_service_1 = require("../shared/shared.service");
var sales_models_1 = require("./sales.models");
function applyPriceRules(startingPrice, matchedRules) {
    var appendedTrace = [];
    var finalPrice = startingPrice;
    var markupRules = matchedRules.filter(function (r) { return r.ruleType === "Markup"; });
    var discountRules = matchedRules.filter(function (r) { return r.ruleType === "Discount"; });
    // Discounts: highest priority wins (non-stacking); ties broken by best
    // effective amount against the current running price.
    if (discountRules.length > 0) {
        var ranked = discountRules
            .map(function (rule) { return ({
            rule: rule,
            effective: rule.amountType === "Percentage"
                ? finalPrice * rule.amount
                : rule.amount
        }); })
            .sort(function (a, b) {
            if (b.rule.priority !== a.rule.priority) {
                return b.rule.priority - a.rule.priority;
            }
            return b.effective - a.effective;
        });
        var winner = ranked[0];
        if (winner && winner.effective > 0) {
            finalPrice = finalPrice - winner.effective;
            appendedTrace.push({
                step: "Discount",
                source: "Rule: ".concat(winner.rule.name),
                amount: finalPrice,
                adjustment: -winner.effective,
                ruleId: winner.rule.id
            });
        }
    }
    // Markups: stack in priority order (highest first), compounding on the
    // running price so ordering + basis are both deterministic.
    var sortedMarkups = __spreadArray([], markupRules, true).sort(function (a, b) { return b.priority - a.priority; });
    for (var _i = 0, sortedMarkups_1 = sortedMarkups; _i < sortedMarkups_1.length; _i++) {
        var rule = sortedMarkups_1[_i];
        var adjustment = rule.amountType === "Percentage" ? finalPrice * rule.amount : rule.amount;
        finalPrice = finalPrice + adjustment;
        appendedTrace.push({
            step: "Markup",
            source: "Rule: ".concat(rule.name),
            amount: finalPrice,
            adjustment: adjustment,
            ruleId: rule.id
        });
    }
    if (finalPrice < 0) {
        appendedTrace.push({
            step: "Floor",
            source: "Clamped to 0 (rules drove price negative)",
            amount: 0,
            adjustment: -finalPrice
        });
        finalPrice = 0;
    }
    return { finalPrice: finalPrice, appendedTrace: appendedTrace };
}
function closeSalesOrder(client, salesOrderId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrder")
                    .update({
                    closed: true,
                    closedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                    closedBy: userId
                })
                    .eq("id", salesOrderId)
                    .select("id")
                    .single()];
        });
    });
}
function convertSalesRfqToQuote(client, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("convert", {
                    body: __assign({ type: "salesRfqToQuote" }, payload)
                })];
        });
    });
}
function convertQuoteToOrder(client, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("convert", {
                    body: __assign({ type: "quoteToSalesOrder" }, payload)
                })];
        });
    });
}
function copyQuoteLine(client, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("get-method", {
                    body: __assign(__assign({}, payload), { type: "quoteLineToQuoteLine", parts: {
                            billOfMaterial: payload.billOfMaterial,
                            billOfProcess: payload.billOfProcess,
                            parameters: payload.parameters,
                            tools: payload.tools,
                            steps: payload.steps,
                            workInstructions: payload.workInstructions
                        } })
                })];
        });
    });
}
function copyQuote(client, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("get-method", {
                    body: __assign(__assign({}, payload), { type: "quoteToQuote" })
                })];
        });
    });
}
function createPricingRule(client, companyId, userId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            return [2 /*return*/, client
                    .from("pricingRule")
                    .insert([
                    {
                        name: data.name,
                        ruleType: data.ruleType,
                        amountType: data.amountType,
                        amount: data.amount,
                        minQuantity: (_a = data.minQuantity) !== null && _a !== void 0 ? _a : null,
                        maxQuantity: (_b = data.maxQuantity) !== null && _b !== void 0 ? _b : null,
                        customerIds: (_c = data.customerIds) !== null && _c !== void 0 ? _c : [],
                        customerTypeIds: (_d = data.customerTypeIds) !== null && _d !== void 0 ? _d : [],
                        itemIds: (_e = data.itemIds) !== null && _e !== void 0 ? _e : [],
                        itemPostingGroupId: (_f = data.itemPostingGroupId) !== null && _f !== void 0 ? _f : null,
                        validFrom: data.validFrom || null,
                        validTo: data.validTo || null,
                        priority: (_g = data.priority) !== null && _g !== void 0 ? _g : 0,
                        active: (_h = data.active) !== null && _h !== void 0 ? _h : true,
                        companyId: companyId,
                        createdBy: userId
                    }
                ])
                    .select("id")
                    .single()];
        });
    });
}
function deleteCustomer(client, customerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("customer").delete().eq("id", customerId)];
        });
    });
}
function deleteCustomerContact(client, customerId, customerContactId) {
    return __awaiter(this, void 0, void 0, function () {
        var customerContact, contactDelete;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("customerContact")
                        .select("contactId")
                        .eq("customerId", customerId)
                        .eq("id", customerContactId)
                        .single()];
                case 1:
                    customerContact = _a.sent();
                    if (!customerContact.data) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("contact")
                            .delete()
                            .eq("id", customerContact.data.contactId)];
                case 2:
                    contactDelete = _a.sent();
                    if (contactDelete.error) {
                        return [2 /*return*/, contactDelete];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, customerContact];
            }
        });
    });
}
function deleteCustomerLocation(client, customerId, customerLocationId) {
    return __awaiter(this, void 0, void 0, function () {
        var customerLocation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("customerLocation")
                        .select("addressId")
                        .eq("customerId", customerId)
                        .eq("id", customerLocationId)
                        .single()];
                case 1:
                    customerLocation = (_a.sent()).data;
                    if (customerLocation === null || customerLocation === void 0 ? void 0 : customerLocation.addressId) {
                        return [2 /*return*/, client.from("address").delete().eq("id", customerLocation.addressId)];
                    }
                    else {
                        // The customerLocation should always have an addressId, but just in case
                        return [2 /*return*/, client
                                .from("customerLocation")
                                .delete()
                                .eq("customerId", customerId)
                                .eq("id", customerLocationId)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function deleteCustomerStatus(client, customerStatusId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("customerStatus").delete().eq("id", customerStatusId)];
        });
    });
}
function deleteCustomerType(client, customerTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("customerType").delete().eq("id", customerTypeId)];
        });
    });
}
function deleteNoQuoteReason(client, noQuoteReasonId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("noQuoteReason").delete().eq("id", noQuoteReasonId)];
        });
    });
}
function deletePricingRule(client, pricingRuleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("pricingRule").delete().eq("id", pricingRuleId)];
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
function deleteQuoteMakeMethod(client, quoteMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteMakeMethod").delete().eq("id", quoteMakeMethodId)];
        });
    });
}
function deleteQuoteLine(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteLine").delete().eq("id", quoteLineId)];
        });
    });
}
function deleteQuoteMaterial(client, quoteMaterialId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteMaterial").delete().eq("id", quoteMaterialId)];
        });
    });
}
function deleteQuoteOperation(client, quoteOperationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteOperation").delete().eq("id", quoteOperationId)];
        });
    });
}
function deleteQuoteOperationStep(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteOperationStep").delete().eq("id", id)];
        });
    });
}
function deleteQuoteOperationParameter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteOperationParameter").delete().eq("id", id)];
        });
    });
}
function deleteQuoteOperationTool(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteOperationTool").delete().eq("id", id)];
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
function deleteSalesOrderLine(client, salesOrderLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesOrderLine").delete().eq("id", salesOrderLineId)];
        });
    });
}
function deleteSalesRFQ(client, salesRfqId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesRfq").delete().eq("id", salesRfqId)];
        });
    });
}
function deleteSalesRFQLine(client, salesRFQLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesRfqLine").delete().eq("id", salesRFQLineId)];
        });
    });
}
function duplicatePricingRule(client, id, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, original, fetchError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPricingRule(client, id)];
                case 1:
                    _a = _b.sent(), original = _a.data, fetchError = _a.error;
                    if (fetchError || !original)
                        return [2 /*return*/, { data: null, error: fetchError }];
                    return [2 /*return*/, client
                            .from("pricingRule")
                            .insert([
                            {
                                name: "Copy of ".concat(original.name),
                                ruleType: original.ruleType,
                                amountType: original.amountType,
                                amount: original.amount,
                                minQuantity: original.minQuantity,
                                maxQuantity: original.maxQuantity,
                                customerIds: original.customerIds,
                                customerTypeIds: original.customerTypeIds,
                                itemIds: original.itemIds,
                                itemPostingGroupId: original.itemPostingGroupId,
                                validFrom: original.validFrom,
                                validTo: original.validTo,
                                priority: original.priority,
                                active: false,
                                companyId: companyId,
                                createdBy: userId
                            }
                        ])
                            .select("id")
                            .single()];
            }
        });
    });
}
function getConfigurationParametersByQuoteLineId(client, quoteLineId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var quoteLine, _a, parameters, groups;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("quoteLine")
                        .select("itemId")
                        .eq("id", quoteLineId)
                        .single()];
                case 1:
                    quoteLine = _d.sent();
                    if (quoteLine.error || !quoteLine.data) {
                        return [2 /*return*/, { groups: [], parameters: [] }];
                    }
                    return [4 /*yield*/, Promise.all([
                            // Order by sortOrder so the derived "primary" parameter is deterministic
                            // and follows the user-defined order (mirrors getConfigurationParameters).
                            client
                                .from("configurationParameter")
                                .select("*")
                                .eq("itemId", quoteLine.data.itemId)
                                .eq("companyId", companyId)
                                .order("sortOrder", { ascending: true })
                                .order("createdAt", { ascending: true }),
                            client
                                .from("configurationParameterGroup")
                                .select("*")
                                .eq("itemId", quoteLine.data.itemId)
                                .eq("companyId", companyId)
                                .order("sortOrder", { ascending: true })
                        ])];
                case 2:
                    _a = _d.sent(), parameters = _a[0], groups = _a[1];
                    if (parameters.error) {
                        console.error(parameters.error);
                        return [2 /*return*/, { groups: [], parameters: [] }];
                    }
                    if (groups.error) {
                        console.error(groups.error);
                        return [2 /*return*/, { groups: [], parameters: [] }];
                    }
                    return [2 /*return*/, { groups: (_b = groups.data) !== null && _b !== void 0 ? _b : [], parameters: (_c = parameters.data) !== null && _c !== void 0 ? _c : [] }];
            }
        });
    });
}
function getCustomer(client, customerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("customers").select("*").eq("id", customerId).single()];
        });
    });
}
function getCustomerContact(client, customerContactId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerContact")
                    .select("*, contact(id, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, notes)")
                    .eq("id", customerContactId)
                    .single()];
        });
    });
}
function getCustomerContacts(client, customerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerContact")
                    .select("*, contact(id, fullName, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, notes), user(id, active)")
                    .eq("customerId", customerId)];
        });
    });
}
function getCustomerItemPriceOverride(client_1, customerId_1, itemId_1, companyId_1) {
    return __awaiter(this, arguments, void 0, function (client, customerId, itemId, companyId, quantity, date) {
        var _a, data, error;
        if (quantity === void 0) { quantity = 1; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("customerItemPriceOverride")
                        .select("*, breaks:customerItemPriceOverrideBreak(id, quantity, overridePrice, active)")
                        .eq("customerId", customerId)
                        .eq("itemId", itemId)
                        .eq("companyId", companyId)
                        .eq("active", true)
                        .maybeSingle()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error || !data)
                        return [2 /*return*/, { data: null, error: error }];
                    return [2 /*return*/, { data: applyBreakToParent(data, quantity, date), error: null }];
            }
        });
    });
}
function getCustomerLocation(client, customerLocationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerLocation")
                    .select("*, address(id, addressLine1, addressLine2, city, stateProvince, countryCode, country(alpha2, name), postalCode)")
                    .eq("id", customerLocationId)
                    .single()];
        });
    });
}
function getCustomerLocations(client, customerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerLocation")
                    .select("*, address(id, addressLine1, addressLine2, city, stateProvince, country(alpha2, name), postalCode)")
                    .eq("customerId", customerId)];
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
function getCustomerTax(client, customerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerTax")
                    .select("*")
                    .eq("customerId", customerId)
                    .single()];
        });
    });
}
function getCustomerTypeItemPriceOverride(client_1, customerTypeId_1, itemId_1, companyId_1) {
    return __awaiter(this, arguments, void 0, function (client, customerTypeId, itemId, companyId, quantity, date) {
        var _a, data, error;
        if (quantity === void 0) { quantity = 1; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("customerItemPriceOverride")
                        .select("*, breaks:customerItemPriceOverrideBreak(id, quantity, overridePrice, active)")
                        .eq("customerTypeId", customerTypeId)
                        .eq("itemId", itemId)
                        .eq("companyId", companyId)
                        .eq("active", true)
                        .maybeSingle()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error || !data)
                        return [2 /*return*/, { data: null, error: error }];
                    return [2 /*return*/, { data: applyBreakToParent(data, quantity, date), error: null }];
            }
        });
    });
}
function getAllCustomersItemPriceOverride(client_1, itemId_1, companyId_1) {
    return __awaiter(this, arguments, void 0, function (client, itemId, companyId, quantity, date) {
        var _a, data, error;
        if (quantity === void 0) { quantity = 1; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("customerItemPriceOverride")
                        .select("*, breaks:customerItemPriceOverrideBreak(id, quantity, overridePrice, active)")
                        .is("customerId", null)
                        .is("customerTypeId", null)
                        .eq("itemId", itemId)
                        .eq("companyId", companyId)
                        .eq("active", true)
                        .maybeSingle()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error || !data)
                        return [2 /*return*/, { data: null, error: error }];
                    return [2 /*return*/, { data: applyBreakToParent(data, quantity, date), error: null }];
            }
        });
    });
}
// ignoreDateWindow=true is used by the catalog view; resolvePrice always
// enforces the date window.
function applyBreakToParent(parent, quantity, date, ignoreDateWindow) {
    if (ignoreDateWindow === void 0) { ignoreDateWindow = false; }
    if (!ignoreDateWindow) {
        var today_1 = date !== null && date !== void 0 ? date : new Date().toISOString().split("T")[0];
        if (parent.validFrom && parent.validFrom > today_1)
            return null;
        if (parent.validTo && parent.validTo < today_1)
            return null;
    }
    var raw = Array.isArray(parent.breaks)
        ? parent.breaks
        : [];
    // Inactive rungs are treated as if they don't exist so a toggled-off break
    // falls through to the next applicable rung (or the next scope in precedence).
    var active = raw.filter(function (b) { return b.active !== false; });
    var best = pickBestBreak(active, quantity);
    if (!best)
        return null;
    return {
        id: parent.id,
        quantity: best.quantity,
        overridePrice: best.overridePrice,
        notes: parent.notes,
        validFrom: parent.validFrom,
        validTo: parent.validTo,
        applyRulesOnTop: parent.applyRulesOnTop
    };
}
// Picks MAX(quantity) <= input. A break at quantity N only applies once the
// requested quantity reaches N; below the smallest rung, no override applies.
function pickBestBreak(breaks, quantity) {
    var best = null;
    for (var _i = 0, breaks_1 = breaks; _i < breaks_1.length; _i++) {
        var b = breaks_1[_i];
        if (b.quantity > quantity)
            continue;
        if (!best || b.quantity > best.quantity)
            best = b;
    }
    return best;
}
function getCustomers(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("customers")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getCustomersList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "customer", "id, name", function (query) {
                    return query.eq("companyId", companyId).order("name");
                })];
        });
    });
}
function getCustomerStatus(client, customerStatusId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerStatus")
                    .select("*")
                    .eq("id", customerStatusId)
                    .single()];
        });
    });
}
function getCustomerStatuses(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("customerStatus")
                .select("id, name, customFields", { count: "exact" })
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
function getCustomerStatusesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerStatus")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getCustomerType(client, customerTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerType")
                    .select("*")
                    .eq("id", customerTypeId)
                    .single()];
        });
    });
}
function getCustomerTypes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("customerType")
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
function getCustomerTypesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerType")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getExternalSalesOrderLines(client, customerId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.rpc("get_sales_order_lines_by_customer_id", { customer_id: customerId }, {
                count: "exact"
            });
            if (args.search) {
                query = query.or("readableId.ilike.%".concat(args.search, "%,customerReference.ilike.%").concat(args.search, "%,salesOrderId.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "orderDate", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getModelByQuoteLineId(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        var quoteLine, item, model;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, client
                        .from("quoteLine")
                        .select("itemId")
                        .eq("id", quoteLineId)
                        .single()];
                case 1:
                    quoteLine = _j.sent();
                    if (!quoteLine.data)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id, type, modelUploadId")
                            .eq("id", quoteLine.data.itemId)
                            .single()];
                case 2:
                    item = _j.sent();
                    if (!item.data || !item.data.modelUploadId) {
                        return [2 /*return*/, {
                                itemId: (_b = (_a = item.data) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                                type: (_d = (_c = item.data) === null || _c === void 0 ? void 0 : _c.type) !== null && _d !== void 0 ? _d : null,
                                modelPath: null
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("modelUpload")
                            .select("*")
                            .eq("id", item.data.modelUploadId)
                            .maybeSingle()];
                case 3:
                    model = _j.sent();
                    if (!model.data) {
                        return [2 /*return*/, {
                                itemId: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : null,
                                type: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.type) !== null && _h !== void 0 ? _h : null,
                                modelSize: null
                            }];
                    }
                    return [2 /*return*/, __assign({ itemId: item.data.id, type: item.data.type }, model.data)];
            }
        });
    });
}
function getNoQuoteReasonsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("noQuoteReason")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getNoQuoteReason(client, noQuoteReasonId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("noQuoteReason")
                    .select("*")
                    .eq("id", noQuoteReasonId)
                    .single()];
        });
    });
}
function getNoQuoteReasons(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("noQuoteReason")
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
function getOpportunity(client, opportunityId) {
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
                    return [4 /*yield*/, client.rpc("get_opportunity_with_related_records", {
                            opportunity_id: opportunityId
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
function getOrCreateOpportunityForRecord(client, record) {
    return __awaiter(this, void 0, void 0, function () {
        var opportunity, created, updated;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getOpportunity(client, (_a = record.opportunityId) !== null && _a !== void 0 ? _a : null)];
                case 1:
                    opportunity = _b.sent();
                    if (opportunity.data) {
                        return [2 /*return*/, opportunity];
                    }
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .insert([
                            {
                                companyId: record.companyId,
                                customerId: record.customerId
                            }
                        ])
                            .select("id")
                            .single()];
                case 2:
                    created = _b.sent();
                    if (created.error || !created.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: created.error
                            }];
                    }
                    return [4 /*yield*/, client
                            .from(record.table)
                            .update({ opportunityId: created.data.id })
                            .eq("id", record.id)];
                case 3:
                    updated = _b.sent();
                    if (updated.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: updated.error
                            }];
                    }
                    return [2 /*return*/, getOpportunity(client, created.data.id)];
            }
        });
    });
}
function getOrCreateOpportunityForSalesOrder(client, salesOrder) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getOrCreateOpportunityForRecord(client, __assign(__assign({}, salesOrder), { table: "salesOrder" }))];
        });
    });
}
function getOpportunityDocuments(client, companyId, opportunityId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.storage
                        .from("private")
                        .list("".concat(companyId, "/opportunity/").concat(opportunityId))];
                case 1:
                    result = _c.sent();
                    if (result.error) {
                        console.error("Failed to list opportunity documents", result.error);
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.map(function (f) { return (__assign(__assign({}, f), { bucket: "opportunity" })); })) !== null && _b !== void 0 ? _b : []];
            }
        });
    });
}
function getOpportunityLineDocuments(client, companyId, lineId, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, opportunityLineResult, itemResult, opportunityLineDocs, itemDocs;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client.storage
                            .from("private")
                            .list("".concat(companyId, "/opportunity-line/").concat(lineId)),
                        itemId
                            ? client.storage.from("private").list("".concat(companyId, "/parts/").concat(itemId))
                            : Promise.resolve({ data: [], error: null })
                    ])];
                case 1:
                    _a = _f.sent(), opportunityLineResult = _a[0], itemResult = _a[1];
                    if (opportunityLineResult.error) {
                        console.error("Failed to list opportunity line documents", opportunityLineResult.error);
                    }
                    if (itemResult.error) {
                        console.error("Failed to list item documents", itemResult.error);
                    }
                    opportunityLineDocs = (_c = (_b = opportunityLineResult.data) === null || _b === void 0 ? void 0 : _b.map(function (f) { return (__assign(__assign({}, f), { bucket: "opportunity-line" })); })) !== null && _c !== void 0 ? _c : [];
                    itemDocs = (_e = (_d = itemResult.data) === null || _d === void 0 ? void 0 : _d.map(function (f) { return (__assign(__assign({}, f), { bucket: "parts" })); })) !== null && _e !== void 0 ? _e : [];
                    return [2 /*return*/, __spreadArray(__spreadArray([], opportunityLineDocs, true), itemDocs, true)];
            }
        });
    });
}
function getPricingRule(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("pricingRule").select("*").eq("id", id).single()];
        });
    });
}
function getPricingRules(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("pricingRule")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args);
            }
            return [2 /*return*/, query];
        });
    });
}
exports.priceSourceTypes = [
    "Base",
    "Override",
    "Type Override",
    "All Override",
    "Rule"
];
function getQuote(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quotes").select("*").eq("id", quoteId).single()];
        });
    });
}
function getQuoteFavorites(client, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteFavorite")
                    .select("*")
                    .eq("companyId", companyId)
                    .eq("userId", userId)];
        });
    });
}
function getQuotes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("quotes")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("quoteId.ilike.%".concat(args.search, "%,customerReference.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "quoteId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getQuotesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "quote", "id, quoteId, revisionId", function (query) {
                    return query.eq("companyId", companyId).order("createdAt", { ascending: false });
                })];
        });
    });
}
function getQuoteAssembliesByLine(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteMakeMethod")
                    .select("*")
                    .eq("quoteLineId", quoteLineId)];
        });
    });
}
function getQuoteAssemblies(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteMakeMethod").select("*").eq("quoteId", quoteId)];
        });
    });
}
function getQuoteCustomerDetails(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteCustomerDetails")
                    .select("*")
                    .eq("quoteId", quoteId)
                    .single()];
        });
    });
}
function getQuoteLine(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteLines").select("*").eq("id", quoteLineId).single()];
        });
    });
}
function getQuoteLinesList(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteLine")
                    .select("id, description, ...item(readableIdWithRevision)")
                    .eq("quoteId", quoteId)];
        });
    });
}
function getQuoteMakeMethod(client, quoteMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteMakeMethod")
                    .select("*, ...item(itemType:type)")
                    .eq("id", quoteMakeMethodId)
                    .single()];
        });
    });
}
function getRootQuoteMakeMethod(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteMakeMethod")
                    .select("*, ...item(itemType:type)")
                    .eq("quoteLineId", quoteLineId)
                    .is("parentMaterialId", null)
                    .single()];
        });
    });
}
function getQuoteMethodTrees(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        var items, tree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getQuoteMethodTreeArray(client, quoteId)];
                case 1:
                    items = _a.sent();
                    if (items.error)
                        return [2 /*return*/, items];
                    tree = getQuoteMethodTreeArrayToTree(items.data);
                    return [2 /*return*/, {
                            data: tree,
                            error: null
                        }];
            }
        });
    });
}
function getQuoteMethodTreeArray(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_quote_methods", {
                    qid: quoteId
                })];
        });
    });
}
function getQuoteMethodTreeArrayToTree(items) {
    // function traverseAndRenameIds(node: QuoteMethodTreeItem) {
    //   const clone = structuredClone(node);
    //   clone.id = `node-${Math.random().toString(16).slice(2)}`;
    //   clone.children = clone.children.map((n) => traverseAndRenameIds(n));
    //   return clone;
    // }
    var rootItems = [];
    var lookup = {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var itemId = item.methodMaterialId;
        var parentId = item.parentMaterialId;
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            // @ts-ignore
            lookup[itemId] = { id: itemId, children: [] };
        }
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        lookup[itemId]["data"] = item;
        var treeItem = lookup[itemId];
        if (parentId === null || parentId === undefined) {
            rootItems.push(treeItem);
        }
        else {
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                // @ts-ignore
                lookup[parentId] = { id: parentId, children: [] };
            }
            // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
            lookup[parentId]["children"].push(treeItem);
        }
    }
    return rootItems;
    // return rootItems.map((item) => traverseAndRenameIds(item));
}
function getQuoteLines(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteLines")
                    .select("*")
                    .eq("quoteId", quoteId)
                    .order("sortOrder", { ascending: true })
                    .order("itemReadableId", { ascending: true })];
        });
    });
}
function getQuoteByExternalId(client, externalId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quote")
                    .select("*")
                    .eq("externalLinkId", externalId)
                    .single()];
        });
    });
}
function getQuoteLinePrices(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteLinePrice")
                    .select("*")
                    .eq("quoteLineId", quoteLineId)];
        });
    });
}
function getQuoteLinePricesByQuoteId(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteLinePrice")
                    .select("*")
                    .eq("quoteId", quoteId)
                    .order("quoteLineId", { ascending: true })];
        });
    });
}
function getQuoteLinePricesByItemId(client, itemId, currentQuoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteLinePrices")
                    .select("*")
                    .eq("itemId", itemId)
                    .neq("quoteId", currentQuoteId)
                    .order("quoteCreatedAt", { ascending: false })
                    .order("qty", { ascending: true })];
        });
    });
}
function getQuoteLinePricesByItemIds(client, itemIds, currentQuoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteLinePrices")
                    .select("*")
                    .in("itemId", itemIds)
                    .neq("quoteId", currentQuoteId)
                    .order("quoteCreatedAt", { ascending: false })
                    .order("qty", { ascending: true })
                    .limit(10)];
        });
    });
}
function getQuoteMaterials(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteMaterial").select("*").eq("quoteId", quoteId)];
        });
    });
}
function getQuoteMaterial(client, materialId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteMaterialWithMakeMethodId")
                    .select("*")
                    .eq("id", materialId)
                    .single()];
        });
    });
}
function getQuoteMaterialsByLine(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteMaterial")
                    .select("*")
                    .eq("quoteLineId", quoteLineId)];
        });
    });
}
function getQuoteMaterialsByMethodId(client, quoteMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteMaterial")
                    .select("*, item(name, itemTrackingType, replenishmentSystem)")
                    .eq("quoteMakeMethodId", quoteMakeMethodId)
                    .order("order", { ascending: true })];
        });
    });
}
function getQuoteMaterialsByOperation(client, quoteOperationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteMaterial")
                    .select("*")
                    .eq("quoteOperationId", quoteOperationId)];
        });
    });
}
function getQuoteOperation(client, quoteOperationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteOperation")
                    .select("*")
                    .eq("id", quoteOperationId)
                    .single()];
        });
    });
}
function getQuoteOperationsByLine(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteOperation")
                    .select("*")
                    .eq("quoteLineId", quoteLineId)];
        });
    });
}
function getQuoteOperationsByMethodId(client, quoteMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteOperation")
                    .select("*, quoteOperationTool(*), quoteOperationParameter(*), quoteOperationStep(*)")
                    .eq("quoteMakeMethodId", quoteMakeMethodId)
                    .order("order", { ascending: true })];
        });
    });
}
function getQuoteOperations(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteOperation").select("*").eq("quoteId", quoteId)];
        });
    });
}
function getQuotePayment(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quotePayment").select("*").eq("id", quoteId).single()];
        });
    });
}
function getQuoteShipment(client, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteShipment").select("*").eq("id", quoteId).single()];
        });
    });
}
function getRelatedPricesForQuoteLine(client, itemId, quoteId) {
    return __awaiter(this, void 0, void 0, function () {
        var item, itemIds, _a, historicalQuoteLinePrices, relatedSalesOrderLines;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client
                        .rpc("get_part_details", {
                        item_id: itemId
                    })
                        .single()];
                case 1:
                    item = _e.sent();
                    itemIds = (_d = (_c = (_b = item.data) === null || _b === void 0 ? void 0 : _b.revisions) === null || _c === void 0 ? void 0 : _c.map(function (revision) { return revision.id; })) !== null && _d !== void 0 ? _d : [itemId];
                    return [4 /*yield*/, Promise.all([
                            getQuoteLinePricesByItemIds(client, itemIds, quoteId),
                            getSalesOrderLinesByItemIds(client, itemIds)
                        ])];
                case 2:
                    _a = _e.sent(), historicalQuoteLinePrices = _a[0], relatedSalesOrderLines = _a[1];
                    return [2 /*return*/, {
                            historicalQuoteLinePrices: historicalQuoteLinePrices.data,
                            relatedSalesOrderLines: relatedSalesOrderLines.data
                        }];
            }
        });
    });
}
function getSalesDocumentsAssignedToMe(client, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, salesOrders, quotes, rfqs, merged;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("salesOrder")
                            .select("*")
                            .eq("assignee", userId)
                            .eq("companyId", companyId),
                        client
                            .from("quote")
                            .select("*")
                            .eq("assignee", userId)
                            .eq("companyId", companyId),
                        client
                            .from("salesRfq")
                            .select("*")
                            .eq("assignee", userId)
                            .eq("companyId", companyId)
                    ])];
                case 1:
                    _a = _h.sent(), salesOrders = _a[0], quotes = _a[1], rfqs = _a[2];
                    merged = __spreadArray(__spreadArray(__spreadArray([], ((_c = (_b = salesOrders.data) === null || _b === void 0 ? void 0 : _b.map(function (doc) { return (__assign(__assign({}, doc), { type: "salesOrder" })); })) !== null && _c !== void 0 ? _c : []), true), ((_e = (_d = quotes.data) === null || _d === void 0 ? void 0 : _d.map(function (doc) { return (__assign(__assign({}, doc), { type: "quote" })); })) !== null && _e !== void 0 ? _e : []), true), ((_g = (_f = rfqs.data) === null || _f === void 0 ? void 0 : _f.map(function (doc) { return (__assign(__assign({}, doc), { type: "rfq" })); })) !== null && _g !== void 0 ? _g : []), true).sort(function (a, b) { var _a, _b; return ((_a = a.createdAt) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.createdAt) !== null && _b !== void 0 ? _b : ""); });
                    return [2 /*return*/, merged];
            }
        });
    });
}
function getSalesOrder(client, salesOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesOrders").select("*").eq("id", salesOrderId).single()];
        });
    });
}
function getSalesOrderCustomerDetails(client, salesOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrderLocations")
                    .select("*")
                    .eq("id", salesOrderId)
                    .single()];
        });
    });
}
function getSalesOrderFavorites(client, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrderFavorite")
                    .select("*")
                    .eq("companyId", companyId)
                    .eq("userId", userId)];
        });
    });
}
function getSalesOrderRelatedItems(client, salesOrderId, opportunityId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, jobs, shipments, invoices;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client.from("job").select("*").eq("salesOrderId", salesOrderId),
                        client
                            .from("shipment")
                            .select("*, shipmentLine(*)")
                            .eq("opportunityId", opportunityId),
                        client
                            .from("salesInvoice")
                            .select("id, invoiceId, status")
                            .eq("opportunityId", opportunityId)
                    ])];
                case 1:
                    _a = _e.sent(), jobs = _a[0], shipments = _a[1], invoices = _a[2];
                    return [2 /*return*/, {
                            jobs: (_b = jobs.data) !== null && _b !== void 0 ? _b : [],
                            shipments: (_c = shipments.data) !== null && _c !== void 0 ? _c : [],
                            invoices: (_d = invoices.data) !== null && _d !== void 0 ? _d : []
                        }];
            }
        });
    });
}
function getSalesOrders(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("salesOrders")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("salesOrderId.ilike.%".concat(args.search, "%,customerReference.ilike.%").concat(args.search, "%"));
            }
            if (args.customerId) {
                query = query.eq("customerId", args.customerId);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "createdAt", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getSalesOrdersList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "salesOrder", "id, salesOrderId", function (query) {
                    return query.eq("companyId", companyId);
                })];
        });
    });
}
function getSalesOrdersByIds(client, ids) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesOrder").select("id, salesOrderId").in("id", ids)];
        });
    });
}
function getSalesOrderPayment(client, salesOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrderPayment")
                    .select("*")
                    .eq("id", salesOrderId)
                    .maybeSingle()];
        });
    });
}
function getSalesTerms(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("terms").select("salesTerms").eq("id", companyId).single()];
        });
    });
}
function getSalesOrderShipment(client, salesOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrderShipment")
                    .select("*")
                    .eq("id", salesOrderId)
                    .maybeSingle()];
        });
    });
}
function getSalesOrderCustomers(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesOrderCustomers").select("id, name")];
        });
    });
}
function getSalesOrderLines(client, salesOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrderLines")
                    .select("*")
                    .eq("salesOrderId", salesOrderId)
                    .order("sortOrder", { ascending: true })
                    .order("itemReadableId", { ascending: true })];
        });
    });
}
function getSalesOrderInvoiceLines(client, salesOrderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesInvoiceLine")
                    .select("invoiceId")
                    .eq("salesOrderId", salesOrderId)];
        });
    });
}
function getSalesOrderInvoicesByIds(client, invoiceIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesInvoices")
                    .select("id, invoiceTotal, status, currencyCode")
                    .in("id", invoiceIds)];
        });
    });
}
function getSalesOrderLinesByItemId(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrderLines")
                    .select("*")
                    .eq("itemId", itemId)
                    .order("orderDate", { ascending: false })
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getSalesOrderLinesByItemIds(client, itemIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrderLines")
                    .select("*")
                    .in("itemId", itemIds)
                    .order("orderDate", { ascending: false })
                    .order("createdAt", { ascending: false })
                    .limit(10)];
        });
    });
}
function getSalesOrderLine(client, salesOrderLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrderLines")
                    .select("*")
                    .eq("id", salesOrderLineId)
                    .single()];
        });
    });
}
function getSalesOrderLineShipments(client, salesOrderLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("shipmentLine")
                    .select("*, shipment(*), storageUnit(id, name)")
                    .eq("lineId", salesOrderLineId)
                    .gt("shippedQuantity", 0)];
        });
    });
}
function getSalesRFQ(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesRfqs").select("*").eq("id", id).single()];
        });
    });
}
function getSalesRFQFavorites(client, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesRfqFavorite")
                    .select("*")
                    .eq("companyId", companyId)
                    .eq("userId", userId)];
        });
    });
}
function getSalesRFQs(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("salesRfqs")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("rfqId.ilike.%".concat(args.search, "%,customerReference.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "rfqId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getSalesRFQLine(client, lineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesRfqLines").select("*").eq("id", lineId).single()];
        });
    });
}
function getSalesRFQLines(client, salesRfqId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesRfqLines")
                    .select("*")
                    .eq("salesRfqId", salesRfqId)
                    .order("order", { ascending: true })
                    .order("customerPartId", { ascending: true })];
        });
    });
}
function insertCustomerContact(client, customerContact) {
    return __awaiter(this, void 0, void 0, function () {
        var insertContact, contactId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("contact")
                        .insert([
                        __assign(__assign({}, customerContact.contact), { isCustomer: true, companyId: customerContact.companyId })
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
                            .from("customerContact")
                            .insert([
                            {
                                customerId: customerContact.customerId,
                                contactId: contactId,
                                customerLocationId: customerContact.customerLocationId,
                                customFields: customerContact.customFields
                            }
                        ])
                            .select("id")
                            .single()];
            }
        });
    });
}
function insertCustomerLocation(client, customerLocation) {
    return __awaiter(this, void 0, void 0, function () {
        var insertAddress, addressId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("address")
                        .insert([
                        __assign(__assign({}, customerLocation.address), { companyId: customerLocation.companyId })
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
                            .from("customerLocation")
                            .insert([
                            {
                                customerId: customerLocation.customerId,
                                addressId: addressId,
                                name: customerLocation.name,
                                customFields: customerLocation.customFields
                            }
                        ])
                            .select("id")
                            .single()];
            }
        });
    });
}
function insertSalesOrderLines(client, salesOrderLines) {
    return __awaiter(this, void 0, void 0, function () {
        var linesWithDefaults;
        return __generator(this, function (_a) {
            linesWithDefaults = salesOrderLines.map(function (line) {
                var _a, _b, _c, _d, _e, _f;
                return (__assign(__assign({}, line), { setupPrice: (_a = line.setupPrice) !== null && _a !== void 0 ? _a : 0, unitPrice: (_b = line.unitPrice) !== null && _b !== void 0 ? _b : 0, shippingCost: (_c = line.shippingCost) !== null && _c !== void 0 ? _c : 0, addOnCost: (_d = line.addOnCost) !== null && _d !== void 0 ? _d : 0, nonTaxableAddOnCost: (_e = line.nonTaxableAddOnCost) !== null && _e !== void 0 ? _e : 0, taxPercent: (_f = line.taxPercent) !== null && _f !== void 0 ? _f : 0 }));
            });
            return [2 /*return*/, client.from("salesOrderLine").insert(linesWithDefaults).select("id")];
        });
    });
}
function finalizeQuote(client, quoteId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var quoteUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("quote")
                        .update({
                        status: "Sent",
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                        updatedBy: userId
                    })
                        .eq("id", quoteId)];
                case 1:
                    quoteUpdate = _a.sent();
                    if (quoteUpdate.error) {
                        return [2 /*return*/, quoteUpdate];
                    }
                    return [2 /*return*/, client
                            .from("quoteLine")
                            .update({
                            status: "Complete",
                            updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            updatedBy: userId
                        })
                            .neq("status", "No Quote")
                            .eq("quoteId", quoteId)];
            }
        });
    });
}
function releaseSalesOrder(client, salesOrderId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesOrder")
                    .update({
                    status: "To Ship and Invoice",
                    updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                    updatedBy: userId
                })
                    .eq("id", salesOrderId)];
        });
    });
}
function resolvePrice(client, companyId, input) {
    return __awaiter(this, void 0, void 0, function () {
        var date, trace, resolvedCustomerTypeId, cust, resolvedItemPostingGroupId, costRow, basePrice, salePrice, startingPrice, overrideApplied, skipRules, override, typeOverride, allOverride, finalPrice, rulesQuery, allRules, matchedRules, ruleResult;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    date = (_a = input.date) !== null && _a !== void 0 ? _a : new Date().toISOString().split("T")[0];
                    trace = [];
                    resolvedCustomerTypeId = (_b = input.customerTypeId) !== null && _b !== void 0 ? _b : null;
                    if (!(input.customerId && !resolvedCustomerTypeId)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("customer")
                            .select("customerTypeId")
                            .eq("id", input.customerId)
                            .maybeSingle()];
                case 1:
                    cust = (_g.sent()).data;
                    resolvedCustomerTypeId = (_c = cust === null || cust === void 0 ? void 0 : cust.customerTypeId) !== null && _c !== void 0 ? _c : null;
                    _g.label = 2;
                case 2:
                    resolvedItemPostingGroupId = (_d = input.itemPostingGroupId) !== null && _d !== void 0 ? _d : null;
                    if (!!resolvedItemPostingGroupId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("itemCost")
                            .select("itemPostingGroupId")
                            .eq("itemId", input.itemId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 3:
                    costRow = (_g.sent()).data;
                    resolvedItemPostingGroupId = (_e = costRow === null || costRow === void 0 ? void 0 : costRow.itemPostingGroupId) !== null && _e !== void 0 ? _e : null;
                    _g.label = 4;
                case 4:
                    if (!(input.existingBasePrice !== undefined)) return [3 /*break*/, 5];
                    basePrice = input.existingBasePrice;
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client
                        .from("itemUnitSalePrice")
                        .select("unitSalePrice")
                        .eq("itemId", input.itemId)
                        .maybeSingle()];
                case 6:
                    salePrice = (_g.sent()).data;
                    basePrice = (_f = salePrice === null || salePrice === void 0 ? void 0 : salePrice.unitSalePrice) !== null && _f !== void 0 ? _f : 0;
                    _g.label = 7;
                case 7:
                    trace.push({
                        step: "Base Price",
                        source: "Item Unit Sale Price",
                        amount: basePrice
                    });
                    startingPrice = basePrice;
                    overrideApplied = false;
                    skipRules = false;
                    if (!input.customerId) return [3 /*break*/, 9];
                    return [4 /*yield*/, getCustomerItemPriceOverride(client, input.customerId, input.itemId, companyId, input.quantity, date)];
                case 8:
                    override = (_g.sent()).data;
                    if (override) {
                        startingPrice = override.overridePrice;
                        overrideApplied = true;
                        skipRules = override.applyRulesOnTop === false;
                        trace.push({
                            step: "Override",
                            source: override.notes
                                ? "Customer Price Override: ".concat(override.notes)
                                : "Customer Price Override",
                            amount: override.overridePrice,
                            adjustment: override.overridePrice - basePrice
                        });
                    }
                    _g.label = 9;
                case 9:
                    if (!(!overrideApplied && resolvedCustomerTypeId)) return [3 /*break*/, 11];
                    return [4 /*yield*/, getCustomerTypeItemPriceOverride(client, resolvedCustomerTypeId, input.itemId, companyId, input.quantity, date)];
                case 10:
                    typeOverride = (_g.sent()).data;
                    if (typeOverride) {
                        startingPrice = typeOverride.overridePrice;
                        overrideApplied = true;
                        skipRules = typeOverride.applyRulesOnTop === false;
                        trace.push({
                            step: "Type Override",
                            source: typeOverride.notes
                                ? "Customer Type Override: ".concat(typeOverride.notes)
                                : "Customer Type Override",
                            amount: typeOverride.overridePrice,
                            adjustment: typeOverride.overridePrice - basePrice
                        });
                    }
                    _g.label = 11;
                case 11:
                    if (!!overrideApplied) return [3 /*break*/, 13];
                    return [4 /*yield*/, getAllCustomersItemPriceOverride(client, input.itemId, companyId, input.quantity, date)];
                case 12:
                    allOverride = (_g.sent()).data;
                    if (allOverride) {
                        startingPrice = allOverride.overridePrice;
                        overrideApplied = true;
                        skipRules = allOverride.applyRulesOnTop === false;
                        trace.push({
                            step: "All Override",
                            source: allOverride.notes
                                ? "All Customers Override: ".concat(allOverride.notes)
                                : "All Customers Override",
                            amount: allOverride.overridePrice,
                            adjustment: allOverride.overridePrice - basePrice
                        });
                    }
                    _g.label = 13;
                case 13:
                    finalPrice = startingPrice;
                    if (!!skipRules) return [3 /*break*/, 15];
                    rulesQuery = client
                        .from("pricingRule")
                        .select("*")
                        .eq("companyId", companyId)
                        .eq("active", true);
                    rulesQuery = rulesQuery.or("validFrom.is.null,validFrom.lte.".concat(date));
                    rulesQuery = rulesQuery.or("validTo.is.null,validTo.gte.".concat(date));
                    return [4 /*yield*/, rulesQuery];
                case 14:
                    allRules = (_g.sent()).data;
                    matchedRules = (allRules !== null && allRules !== void 0 ? allRules : []).filter(function (rule) {
                        if (rule.minQuantity !== null && input.quantity < rule.minQuantity)
                            return false;
                        if (rule.maxQuantity !== null && input.quantity > rule.maxQuantity)
                            return false;
                        var ruleItemIds = rule.itemIds;
                        if (ruleItemIds &&
                            ruleItemIds.length > 0 &&
                            !ruleItemIds.includes(input.itemId))
                            return false;
                        if (rule.itemPostingGroupId !== null &&
                            rule.itemPostingGroupId !== resolvedItemPostingGroupId)
                            return false;
                        var ruleCustomerIds = rule.customerIds;
                        if (ruleCustomerIds && ruleCustomerIds.length > 0) {
                            if (!input.customerId || !ruleCustomerIds.includes(input.customerId))
                                return false;
                        }
                        var ruleCustomerTypeIds = rule.customerTypeIds;
                        if (ruleCustomerTypeIds && ruleCustomerTypeIds.length > 0) {
                            if (!resolvedCustomerTypeId ||
                                !ruleCustomerTypeIds.includes(resolvedCustomerTypeId))
                                return false;
                        }
                        return true;
                    });
                    ruleResult = applyPriceRules(startingPrice, matchedRules);
                    finalPrice = ruleResult.finalPrice;
                    trace.push.apply(trace, ruleResult.appendedTrace);
                    _g.label = 15;
                case 15:
                    trace.push({
                        step: "Final Price",
                        source: "Resolved",
                        amount: finalPrice
                    });
                    return [2 /*return*/, { finalPrice: finalPrice, basePrice: basePrice, trace: trace }];
            }
        });
    });
}
// itemPostingGroupId is stored on itemCost, not item. The generic filter
// helper assumes the column exists on the primary table, so we lift the
// posting-group filter out, pre-resolve matching item IDs from itemCost, and
// return the remaining filters to apply normally. Returns { itemIds: null }
// when no posting-group filter is present.
function resolvePostingGroupFilter(client, companyId, filters) {
    return __awaiter(this, void 0, void 0, function () {
        var postingGroupFilters, remaining, groupIds, data, itemIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!filters || filters.length === 0) {
                        return [2 /*return*/, { itemIds: null, filters: filters }];
                    }
                    postingGroupFilters = filters.filter(function (f) {
                        return f.column === "itemPostingGroupId" && Boolean(f.value);
                    });
                    if (postingGroupFilters.length === 0) {
                        return [2 /*return*/, { itemIds: null, filters: filters }];
                    }
                    remaining = filters.filter(function (f) { return f.column !== "itemPostingGroupId"; });
                    groupIds = postingGroupFilters.flatMap(function (f) {
                        return f.operator === "in" ? f.value.split(",") : [f.value];
                    });
                    return [4 /*yield*/, client
                            .from("itemCost")
                            .select("itemId")
                            .eq("companyId", companyId)
                            .in("itemPostingGroupId", groupIds)];
                case 1:
                    data = (_a.sent()).data;
                    itemIds = (data !== null && data !== void 0 ? data : []).map(function (r) { return r.itemId; });
                    return [2 /*return*/, { itemIds: itemIds, filters: remaining }];
            }
        });
    });
}
function resolvePriceList(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var date, previewQuantity, scopeQuery, scopedOverrides, overriddenItemIds, itemQuery, _a, postingGroupItemIds, filtersWithoutPostingGroup, _b, items, count, itemIds, resolvedCustomerTypeId, cust, overrideSelect, fillMap, overrideMap, typeOverrideMap, allOverrideMap, rows_1, rows_2, allRows, rulesQuery, allRules, rows;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    date = new Date().toISOString().split("T")[0];
                    previewQuantity = Math.max((_c = args.quantity) !== null && _c !== void 0 ? _c : 1, 0);
                    scopeQuery = client
                        .from("customerItemPriceOverride")
                        .select("itemId")
                        .eq("companyId", companyId)
                        .eq("active", true);
                    if (args.customerId) {
                        scopeQuery = scopeQuery.eq("customerId", args.customerId);
                    }
                    else if (args.customerTypeId) {
                        scopeQuery = scopeQuery.eq("customerTypeId", args.customerTypeId);
                    }
                    else {
                        return [2 /*return*/, { data: [], count: 0 }];
                    }
                    return [4 /*yield*/, scopeQuery];
                case 1:
                    scopedOverrides = (_f.sent()).data;
                    overriddenItemIds = (scopedOverrides !== null && scopedOverrides !== void 0 ? scopedOverrides : []).map(function (r) { return r.itemId; });
                    if (overriddenItemIds.length === 0) {
                        return [2 /*return*/, { data: [], count: 0 }];
                    }
                    itemQuery = client
                        .from("item")
                        .select("id, readableId, name, thumbnailPath, itemUnitSalePrice(unitSalePrice), itemCost(itemPostingGroupId)", { count: "exact" })
                        .eq("active", true)
                        .in("id", overriddenItemIds);
                    if (args.search) {
                        itemQuery = itemQuery.or("name.ilike.%".concat(args.search, "%,readableId.ilike.%").concat(args.search, "%"));
                    }
                    return [4 /*yield*/, resolvePostingGroupFilter(client, companyId, args.filters)];
                case 2:
                    _a = _f.sent(), postingGroupItemIds = _a.itemIds, filtersWithoutPostingGroup = _a.filters;
                    if (postingGroupItemIds !== null) {
                        if (postingGroupItemIds.length === 0) {
                            return [2 /*return*/, { data: [], count: 0 }];
                        }
                        itemQuery = itemQuery.in("id", postingGroupItemIds);
                    }
                    itemQuery = (0, query_1.setGenericQueryFilters)(itemQuery, __assign(__assign({}, args), { filters: filtersWithoutPostingGroup }));
                    return [4 /*yield*/, itemQuery];
                case 3:
                    _b = _f.sent(), items = _b.data, count = _b.count;
                    if (!items || items.length === 0) {
                        return [2 /*return*/, { data: [], count: count !== null && count !== void 0 ? count : 0 }];
                    }
                    itemIds = items.map(function (i) { return i.id; });
                    resolvedCustomerTypeId = (_d = args.customerTypeId) !== null && _d !== void 0 ? _d : null;
                    if (!(args.customerId && !resolvedCustomerTypeId)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("customer")
                            .select("customerTypeId")
                            .eq("id", args.customerId)
                            .maybeSingle()];
                case 4:
                    cust = (_f.sent()).data;
                    resolvedCustomerTypeId = (_e = cust === null || cust === void 0 ? void 0 : cust.customerTypeId) !== null && _e !== void 0 ? _e : null;
                    _f.label = 5;
                case 5:
                    overrideSelect = "id, itemId, notes, validFrom, validTo, applyRulesOnTop, breaks:customerItemPriceOverrideBreak(id, quantity, overridePrice, active)";
                    fillMap = function (rows, target) {
                        for (var _i = 0, _a = rows !== null && rows !== void 0 ? rows : []; _i < _a.length; _i++) {
                            var row = _a[_i];
                            // Catalog view bypasses the date window; resolvePrice still enforces it.
                            var applied = applyBreakToParent(row, previewQuantity, date, true);
                            if (applied)
                                target.set(row.itemId, applied);
                        }
                    };
                    overrideMap = new Map();
                    typeOverrideMap = new Map();
                    allOverrideMap = new Map();
                    if (!args.customerId) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("customerItemPriceOverride")
                            .select(overrideSelect)
                            .eq("companyId", companyId)
                            .eq("customerId", args.customerId)
                            .eq("active", true)
                            .in("itemId", itemIds)];
                case 6:
                    rows_1 = (_f.sent()).data;
                    fillMap(rows_1, overrideMap);
                    _f.label = 7;
                case 7:
                    if (!resolvedCustomerTypeId) return [3 /*break*/, 9];
                    return [4 /*yield*/, client
                            .from("customerItemPriceOverride")
                            .select(overrideSelect)
                            .eq("companyId", companyId)
                            .eq("customerTypeId", resolvedCustomerTypeId)
                            .eq("active", true)
                            .in("itemId", itemIds)];
                case 8:
                    rows_2 = (_f.sent()).data;
                    fillMap(rows_2, typeOverrideMap);
                    _f.label = 9;
                case 9: return [4 /*yield*/, client
                        .from("customerItemPriceOverride")
                        .select(overrideSelect)
                        .eq("companyId", companyId)
                        .is("customerId", null)
                        .is("customerTypeId", null)
                        .eq("active", true)
                        .in("itemId", itemIds)];
                case 10:
                    allRows = (_f.sent()).data;
                    fillMap(allRows, allOverrideMap);
                    rulesQuery = client
                        .from("pricingRule")
                        .select("*")
                        .eq("companyId", companyId)
                        .eq("active", true);
                    rulesQuery = rulesQuery.or("validFrom.is.null,validFrom.lte.".concat(date));
                    rulesQuery = rulesQuery.or("validTo.is.null,validTo.gte.".concat(date));
                    return [4 /*yield*/, rulesQuery];
                case 11:
                    allRules = (_f.sent()).data;
                    rows = items.map(function (item) {
                        var _a, _b, _c, _d;
                        var salePriceRow = Array.isArray(item.itemUnitSalePrice)
                            ? item.itemUnitSalePrice[0]
                            : item.itemUnitSalePrice;
                        var basePrice = (_a = salePriceRow === null || salePriceRow === void 0 ? void 0 : salePriceRow.unitSalePrice) !== null && _a !== void 0 ? _a : 0;
                        var itemCostRow = Array.isArray(item.itemCost)
                            ? item.itemCost[0]
                            : item.itemCost;
                        var itemPostingGroupId = (_b = itemCostRow === null || itemCostRow === void 0 ? void 0 : itemCostRow.itemPostingGroupId) !== null && _b !== void 0 ? _b : null;
                        var trace = [];
                        var startingPrice = basePrice;
                        var isOverridden = false;
                        var overrideId = null;
                        var overrideQuantity = null;
                        var overrideNotes = null;
                        var overrideValidFrom = null;
                        var overrideValidTo = null;
                        var overrideSource = null;
                        var skipRules = false;
                        trace.push({
                            step: "Base Price",
                            source: "Item Unit Sale Price",
                            amount: basePrice
                        });
                        var override = overrideMap.get(item.id);
                        var typeOverride = typeOverrideMap.get(item.id);
                        var allOverride = allOverrideMap.get(item.id);
                        var appliedOverride = (_c = override !== null && override !== void 0 ? override : typeOverride) !== null && _c !== void 0 ? _c : allOverride;
                        if (appliedOverride) {
                            startingPrice = appliedOverride.overridePrice;
                            isOverridden = true;
                            overrideId = appliedOverride.id;
                            overrideQuantity = appliedOverride.quantity;
                            overrideNotes = appliedOverride.notes;
                            overrideValidFrom = appliedOverride.validFrom;
                            overrideValidTo = appliedOverride.validTo;
                            skipRules = appliedOverride.applyRulesOnTop === false;
                            if (override) {
                                overrideSource = "Override";
                                trace.push({
                                    step: "Override",
                                    source: override.notes
                                        ? "Customer Price Override: ".concat(override.notes)
                                        : "Customer Price Override",
                                    amount: override.overridePrice,
                                    adjustment: override.overridePrice - basePrice
                                });
                            }
                            else if (typeOverride) {
                                overrideSource = "Type Override";
                                trace.push({
                                    step: "Type Override",
                                    source: typeOverride.notes
                                        ? "Customer Type Override: ".concat(typeOverride.notes)
                                        : "Customer Type Override",
                                    amount: typeOverride.overridePrice,
                                    adjustment: typeOverride.overridePrice - basePrice
                                });
                            }
                            else if (allOverride) {
                                overrideSource = "All Override";
                                trace.push({
                                    step: "All Override",
                                    source: allOverride.notes
                                        ? "All Customers Override: ".concat(allOverride.notes)
                                        : "All Customers Override",
                                    amount: allOverride.overridePrice,
                                    adjustment: allOverride.overridePrice - basePrice
                                });
                            }
                        }
                        var finalPrice = startingPrice;
                        var hasRuleAdjustment = false;
                        if (!skipRules) {
                            var matchedRules = (allRules !== null && allRules !== void 0 ? allRules : []).filter(function (rule) {
                                if (rule.minQuantity !== null && previewQuantity < rule.minQuantity)
                                    return false;
                                if (rule.maxQuantity !== null && previewQuantity > rule.maxQuantity)
                                    return false;
                                var ruleItemIds = rule.itemIds;
                                if (ruleItemIds &&
                                    ruleItemIds.length > 0 &&
                                    !ruleItemIds.includes(item.id))
                                    return false;
                                if (rule.itemPostingGroupId !== null &&
                                    rule.itemPostingGroupId !== itemPostingGroupId)
                                    return false;
                                var ruleCustomerIds = rule.customerIds;
                                var ruleCustomerTypeIds = rule.customerTypeIds;
                                if (ruleCustomerIds && ruleCustomerIds.length > 0) {
                                    if (!args.customerId || !ruleCustomerIds.includes(args.customerId))
                                        return false;
                                }
                                if (ruleCustomerTypeIds && ruleCustomerTypeIds.length > 0) {
                                    if (!resolvedCustomerTypeId ||
                                        !ruleCustomerTypeIds.includes(resolvedCustomerTypeId))
                                        return false;
                                }
                                return true;
                            });
                            var ruleResult = applyPriceRules(startingPrice, matchedRules);
                            finalPrice = ruleResult.finalPrice;
                            trace.push.apply(trace, ruleResult.appendedTrace);
                            hasRuleAdjustment = ruleResult.appendedTrace.length > 0;
                        }
                        trace.push({
                            step: "Final Price",
                            source: "Resolved",
                            amount: finalPrice
                        });
                        var source = isOverridden
                            ? overrideSource
                            : hasRuleAdjustment
                                ? "Rule"
                                : "Base";
                        return {
                            itemId: item.id,
                            partId: item.readableId,
                            itemName: item.name,
                            itemPostingGroupId: itemPostingGroupId,
                            thumbnailPath: (_d = item.thumbnailPath) !== null && _d !== void 0 ? _d : null,
                            basePrice: basePrice,
                            resolvedPrice: finalPrice,
                            isOverridden: isOverridden,
                            source: source,
                            trace: trace,
                            overrideId: overrideId,
                            overrideQuantity: overrideQuantity,
                            overrideNotes: overrideNotes,
                            overrideValidFrom: overrideValidFrom,
                            overrideValidTo: overrideValidTo
                        };
                    });
                    return [2 /*return*/, {
                            data: rows,
                            count: count !== null && count !== void 0 ? count : 0
                        }];
            }
        });
    });
}
function getBaseCatalog(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query, _a, postingGroupItemIds, filtersWithoutPostingGroup, _b, items, count, rows;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    query = client
                        .from("item")
                        .select("id, readableId, name, thumbnailPath, itemUnitSalePrice(unitSalePrice), itemCost(itemPostingGroupId)", { count: "exact" })
                        .eq("companyId", companyId)
                        .eq("active", true);
                    if (args.search) {
                        query = query.or("name.ilike.%".concat(args.search, "%,readableId.ilike.%").concat(args.search, "%"));
                    }
                    return [4 /*yield*/, resolvePostingGroupFilter(client, companyId, args.filters)];
                case 1:
                    _a = _c.sent(), postingGroupItemIds = _a.itemIds, filtersWithoutPostingGroup = _a.filters;
                    if (postingGroupItemIds !== null) {
                        if (postingGroupItemIds.length === 0) {
                            return [2 /*return*/, { data: [], count: 0 }];
                        }
                        query = query.in("id", postingGroupItemIds);
                    }
                    query = (0, query_1.setGenericQueryFilters)(query, __assign(__assign({}, args), { filters: filtersWithoutPostingGroup }));
                    return [4 /*yield*/, query];
                case 2:
                    _b = _c.sent(), items = _b.data, count = _b.count;
                    if (!items || items.length === 0) {
                        return [2 /*return*/, { data: [], count: count !== null && count !== void 0 ? count : 0 }];
                    }
                    rows = items.map(function (item) {
                        var _a, _b, _c;
                        var salePriceRow = Array.isArray(item.itemUnitSalePrice)
                            ? item.itemUnitSalePrice[0]
                            : item.itemUnitSalePrice;
                        var basePrice = (_a = salePriceRow === null || salePriceRow === void 0 ? void 0 : salePriceRow.unitSalePrice) !== null && _a !== void 0 ? _a : 0;
                        var itemCostRow = Array.isArray(item.itemCost)
                            ? item.itemCost[0]
                            : item.itemCost;
                        return {
                            itemId: item.id,
                            partId: item.readableId,
                            itemName: item.name,
                            itemPostingGroupId: (_b = itemCostRow === null || itemCostRow === void 0 ? void 0 : itemCostRow.itemPostingGroupId) !== null && _b !== void 0 ? _b : null,
                            thumbnailPath: (_c = item.thumbnailPath) !== null && _c !== void 0 ? _c : null,
                            basePrice: basePrice,
                            resolvedPrice: basePrice,
                            isOverridden: false,
                            source: "Base",
                            trace: [],
                            overrideId: null,
                            overrideQuantity: null,
                            overrideNotes: null,
                            overrideValidFrom: null,
                            overrideValidTo: null
                        };
                    });
                    return [2 /*return*/, { data: rows, count: count !== null && count !== void 0 ? count : 0 }];
            }
        });
    });
}
function upsertCustomer(client, customer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in customer) {
                return [2 /*return*/, client
                        .from("customer")
                        .insert([customer])
                        .select("id, name")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("customer")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(customer)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", customer.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertCustomerItemPriceOverride(client, companyId, userId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var sortedBreaks, parentFields, parentId, parentError, _a, row, error, lookup, scopedLookup, existing, _b, row, error, _c, row, error, _d, existingRows, fetchExistingError, existingIds, submittedIds, toDelete, error, updateTimestamp, _i, sortedBreaks_1, b, error, toInsert, error;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    if (data.customerId && data.customerTypeId) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Cannot set both customerId and customerTypeId" }
                            }];
                    }
                    sortedBreaks = __spreadArray([], data.breaks, true).sort(function (a, b) { return a.quantity - b.quantity; });
                    parentFields = {
                        notes: (_e = data.notes) !== null && _e !== void 0 ? _e : null,
                        validFrom: (_f = data.validFrom) !== null && _f !== void 0 ? _f : null,
                        validTo: (_g = data.validTo) !== null && _g !== void 0 ? _g : null,
                        active: data.active,
                        applyRulesOnTop: data.applyRulesOnTop
                    };
                    parentId = null;
                    parentError = null;
                    if (!data.id) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("customerItemPriceOverride")
                            .update(__assign(__assign({}, parentFields), { customerId: (_h = data.customerId) !== null && _h !== void 0 ? _h : null, customerTypeId: (_j = data.customerTypeId) !== null && _j !== void 0 ? _j : null, itemId: data.itemId, updatedBy: userId, updatedAt: new Date().toISOString() }))
                            .eq("id", data.id)
                            .eq("companyId", companyId)
                            .select("id")
                            .single()];
                case 1:
                    _a = _q.sent(), row = _a.data, error = _a.error;
                    parentId = (_k = row === null || row === void 0 ? void 0 : row.id) !== null && _k !== void 0 ? _k : null;
                    parentError = error;
                    return [3 /*break*/, 7];
                case 2:
                    lookup = client
                        .from("customerItemPriceOverride")
                        .select("id")
                        .eq("itemId", data.itemId)
                        .eq("companyId", companyId);
                    scopedLookup = data.customerId
                        ? lookup.eq("customerId", data.customerId)
                        : data.customerTypeId
                            ? lookup.eq("customerTypeId", data.customerTypeId)
                            : lookup.is("customerId", null).is("customerTypeId", null);
                    return [4 /*yield*/, scopedLookup.maybeSingle()];
                case 3:
                    existing = (_q.sent()).data;
                    if (!existing) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("customerItemPriceOverride")
                            .update(__assign(__assign({}, parentFields), { updatedBy: userId, updatedAt: new Date().toISOString() }))
                            .eq("id", existing.id)
                            .select("id")
                            .single()];
                case 4:
                    _b = _q.sent(), row = _b.data, error = _b.error;
                    parentId = (_l = row === null || row === void 0 ? void 0 : row.id) !== null && _l !== void 0 ? _l : null;
                    parentError = error;
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client
                        .from("customerItemPriceOverride")
                        .insert(__assign(__assign({}, parentFields), { customerId: (_m = data.customerId) !== null && _m !== void 0 ? _m : null, customerTypeId: (_o = data.customerTypeId) !== null && _o !== void 0 ? _o : null, itemId: data.itemId, companyId: companyId, createdBy: userId }))
                        .select("id")
                        .single()];
                case 6:
                    _c = _q.sent(), row = _c.data, error = _c.error;
                    parentId = (_p = row === null || row === void 0 ? void 0 : row.id) !== null && _p !== void 0 ? _p : null;
                    parentError = error;
                    _q.label = 7;
                case 7:
                    if (parentError || !parentId) {
                        return [2 /*return*/, { data: null, error: parentError }];
                    }
                    return [4 /*yield*/, client
                            .from("customerItemPriceOverrideBreak")
                            .select("id")
                            .eq("customerItemPriceOverrideId", parentId)
                            .eq("companyId", companyId)];
                case 8:
                    _d = _q.sent(), existingRows = _d.data, fetchExistingError = _d.error;
                    if (fetchExistingError) {
                        return [2 /*return*/, { data: null, error: fetchExistingError }];
                    }
                    existingIds = new Set((existingRows !== null && existingRows !== void 0 ? existingRows : []).map(function (r) { return r.id; }));
                    submittedIds = new Set(sortedBreaks
                        .map(function (b) { return b.id; })
                        .filter(function (id) { return typeof id === "string"; }));
                    toDelete = __spreadArray([], existingIds, true).filter(function (id) { return !submittedIds.has(id); });
                    if (!(toDelete.length > 0)) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("customerItemPriceOverrideBreak")
                            .delete()
                            .in("id", toDelete)
                            .eq("companyId", companyId)];
                case 9:
                    error = (_q.sent()).error;
                    if (error)
                        return [2 /*return*/, { data: null, error: error }];
                    _q.label = 10;
                case 10:
                    updateTimestamp = new Date().toISOString();
                    _i = 0, sortedBreaks_1 = sortedBreaks;
                    _q.label = 11;
                case 11:
                    if (!(_i < sortedBreaks_1.length)) return [3 /*break*/, 14];
                    b = sortedBreaks_1[_i];
                    if (!b.id || !existingIds.has(b.id))
                        return [3 /*break*/, 13];
                    return [4 /*yield*/, client
                            .from("customerItemPriceOverrideBreak")
                            .update({
                            quantity: b.quantity,
                            overridePrice: b.overridePrice,
                            active: b.active,
                            updatedBy: userId,
                            updatedAt: updateTimestamp
                        })
                            .eq("id", b.id)
                            .eq("companyId", companyId)];
                case 12:
                    error = (_q.sent()).error;
                    if (error)
                        return [2 /*return*/, { data: null, error: error }];
                    _q.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 11];
                case 14:
                    toInsert = sortedBreaks.filter(function (b) { return !b.id || !existingIds.has(b.id); });
                    if (!(toInsert.length > 0)) return [3 /*break*/, 16];
                    return [4 /*yield*/, client
                            .from("customerItemPriceOverrideBreak")
                            .insert(toInsert.map(function (b) { return ({
                            customerItemPriceOverrideId: parentId,
                            quantity: b.quantity,
                            overridePrice: b.overridePrice,
                            active: b.active,
                            companyId: companyId,
                            createdBy: userId
                        }); }))];
                case 15:
                    error = (_q.sent()).error;
                    if (error)
                        return [2 /*return*/, { data: null, error: error }];
                    _q.label = 16;
                case 16: return [2 /*return*/, { data: { id: parentId }, error: null }];
            }
        });
    });
}
function deleteCustomerItemPriceOverride(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerItemPriceOverride")
                    .delete()
                    .eq("id", id)
                    .eq("companyId", companyId)];
        });
    });
}
function getCustomerItemPriceOverrideById(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerItemPriceOverride")
                    .select("\n      *,\n      customer:customerId(id, name),\n      customerType:customerTypeId(id, name),\n      item:itemId(id, name),\n      breaks:customerItemPriceOverrideBreak(id, quantity, overridePrice, active)\n    ")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getCustomerItemPriceOverridesList(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("customerItemPriceOverride")
                .select("\n      *,\n      customer:customerId(id, name),\n      customerType:customerTypeId(id, name),\n      item:itemId(id, name, unitSalePrice:itemUnitSalePrice(unitSalePrice))\n    ", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("item.name.ilike.%".concat(args.search, "%,customer.name.ilike.%").concat(args.search, "%,notes.ilike.%").concat(args.search, "%"));
            }
            if (args.customerId) {
                query = query.eq("customerId", args.customerId);
            }
            if (args.customerTypeId) {
                query = query.eq("customerTypeId", args.customerTypeId);
            }
            if (args.itemId) {
                query = query.eq("itemId", args.itemId);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "createdAt", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function updateCustomerAccounting(client, customerAccounting) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customer")
                    .update((0, supabase_1.sanitize)(customerAccounting))
                    .eq("id", customerAccounting.id)];
        });
    });
}
function updateCustomerContact(client, customerContact) {
    return __awaiter(this, void 0, void 0, function () {
        var customFieldUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!customerContact.customFields) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("customerContact")
                            .update({
                            customFields: customerContact.customFields,
                            customerLocationId: customerContact.customerLocationId
                        })
                            .eq("contactId", customerContact.contactId)];
                case 1:
                    customFieldUpdate = _a.sent();
                    if (customFieldUpdate.error) {
                        return [2 /*return*/, customFieldUpdate];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, client
                        .from("contact")
                        .update((0, supabase_1.sanitize)(customerContact.contact))
                        .eq("id", customerContact.contactId)
                        .select("id")
                        .single()];
            }
        });
    });
}
function updateCustomerLocation(client, customerLocation) {
    return __awaiter(this, void 0, void 0, function () {
        var customFieldUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!customerLocation.customFields) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("customerLocation")
                            .update({
                            name: customerLocation.name,
                            customFields: customerLocation.customFields
                        })
                            .eq("addressId", customerLocation.addressId)];
                case 1:
                    customFieldUpdate = _a.sent();
                    if (customFieldUpdate.error) {
                        return [2 /*return*/, customFieldUpdate];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, client
                        .from("address")
                        .update((0, supabase_1.sanitize)(customerLocation.address))
                        .eq("id", customerLocation.addressId)
                        .select("id")
                        .single()];
            }
        });
    });
}
function updateCustomerPayment(client, customerPayment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerPayment")
                    .update((0, supabase_1.sanitize)(customerPayment))
                    .eq("customerId", customerPayment.customerId)];
        });
    });
}
function updateCustomerShipping(client, customerShipping) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerShipping")
                    .update((0, supabase_1.sanitize)(customerShipping))
                    .eq("customerId", customerShipping.customerId)];
        });
    });
}
function updateCustomerTax(client, customerTax) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerTax")
                    .update((0, supabase_1.sanitize)(customerTax))
                    .eq("customerId", customerTax.customerId)];
        });
    });
}
function updatePricingRule(client, id, userId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pricingRule")
                    .update((0, supabase_1.sanitize)(__assign(__assign({}, data), { updatedBy: userId, updatedAt: new Date().toISOString() })))
                    .eq("id", id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertCustomerStatus(client, customerStatus) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in customerStatus) {
                return [2 /*return*/, client.from("customerStatus").insert([customerStatus]).select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("customerStatus")
                        .update((0, supabase_1.sanitize)(customerStatus))
                        .eq("id", customerStatus.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertCustomerType(client, customerType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in customerType) {
                return [2 /*return*/, client.from("customerType").insert([customerType]).select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("customerType")
                        .update((0, supabase_1.sanitize)(customerType))
                        .eq("id", customerType.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertNoQuoteReason(client, noQuoteReason) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in noQuoteReason) {
                return [2 /*return*/, client.from("noQuoteReason").insert([noQuoteReason]).select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("noQuoteReason")
                        .update((0, supabase_1.sanitize)(noQuoteReason))
                        .eq("id", noQuoteReason.id)];
            }
            return [2 /*return*/];
        });
    });
}
function updateSalesRFQFavorite(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, favorite, userId;
        return __generator(this, function (_a) {
            id = args.id, favorite = args.favorite, userId = args.userId;
            if (!favorite) {
                return [2 /*return*/, client
                        .from("salesRfqFavorite")
                        .delete()
                        .eq("rfqId", id)
                        .eq("userId", userId)];
            }
            else {
                return [2 /*return*/, client
                        .from("salesRfqFavorite")
                        .insert({ rfqId: id, userId: userId })];
            }
            return [2 /*return*/];
        });
    });
}
function updateQuoteExchangeRate(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var update;
        return __generator(this, function (_a) {
            update = {
                id: data.id,
                exchangeRate: data.exchangeRate,
                exchangeRateUpdatedAt: new Date().toISOString()
            };
            return [2 /*return*/, client.from("quote").update(update).eq("id", update.id)];
        });
    });
}
function updateQuoteLinePrecision(client, quoteLineId, precision) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("quoteLine")
                    .update({ unitPricePrecision: precision })
                    .eq("id", quoteLineId)
                    .select("id")
                    .single()];
        });
    });
}
function updateSalesOrderExchangeRate(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var update;
        return __generator(this, function (_a) {
            update = {
                id: data.id,
                exchangeRate: data.exchangeRate,
                exchangeRateUpdatedAt: new Date().toISOString()
            };
            return [2 /*return*/, client.from("salesOrder").update(update).eq("id", update.id)];
        });
    });
}
function updateQuoteFavorite(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, favorite, userId;
        return __generator(this, function (_a) {
            id = args.id, favorite = args.favorite, userId = args.userId;
            if (!favorite) {
                return [2 /*return*/, client
                        .from("quoteFavorite")
                        .delete()
                        .eq("quoteId", id)
                        .eq("userId", userId)];
            }
            else {
                return [2 /*return*/, client.from("quoteFavorite").insert({ quoteId: id, userId: userId })];
            }
            return [2 /*return*/];
        });
    });
}
function updateSalesRFQStatus(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        var noQuoteReasonId, status, rest, updateData;
        return __generator(this, function (_a) {
            noQuoteReasonId = update.noQuoteReasonId, status = update.status, rest = __rest(update, ["noQuoteReasonId", "status"]);
            updateData = __assign(__assign(__assign({ status: status }, rest), (noQuoteReasonId ? { noQuoteReasonId: noQuoteReasonId } : {})), (status === "Ready for Quote"
                ? { completedDate: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString() }
                : {}));
            return [2 /*return*/, client.from("salesRfq").update(updateData).eq("id", update.id)];
        });
    });
}
function updateQuoteMaterialOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, order = _a.order, updatedBy = _a.updatedBy;
                return client.from("quoteMaterial").update({ order: order, updatedBy: updatedBy }).eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateQuoteOperationOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, order = _a.order, updatedBy = _a.updatedBy;
                return client.from("quoteOperation").update({ order: order, updatedBy: updatedBy }).eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateQuoteStatus(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        var status, rest, updateData;
        return __generator(this, function (_a) {
            status = update.status, rest = __rest(update, ["status"]);
            updateData = __assign(__assign({ status: status }, rest), (status === "Sent"
                ? { completedDate: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString() }
                : {}));
            return [2 /*return*/, client.from("quote").update(updateData).eq("id", update.id)];
        });
    });
}
function upsertMakeMethodFromQuoteLine(client, lineMethod) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("get-method", {
                    body: {
                        type: "quoteLineToItem",
                        sourceId: "".concat(lineMethod.quoteId, ":").concat(lineMethod.quoteLineId),
                        targetId: lineMethod.itemId,
                        companyId: lineMethod.companyId,
                        userId: lineMethod.userId,
                        parts: lineMethod.parts
                    }
                })];
        });
    });
}
function upsertMakeMethodFromQuoteMethod(client, quoteMethod) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.functions.invoke("get-method", {
                        body: {
                            type: "quoteMakeMethodToItem",
                            sourceId: quoteMethod.sourceId,
                            targetId: quoteMethod.targetId,
                            companyId: quoteMethod.companyId,
                            userId: quoteMethod.userId,
                            parts: quoteMethod.parts
                        }
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Failed to save method" }
                            }];
                    }
                    return [2 /*return*/, { data: null, error: null }];
            }
        });
    });
}
function insertQuote(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var quoteId, seq, opportunityId, opportunity, _a, customerPayment, customerShipping, seller, _b, paymentTermId, invoiceCustomerId, invoiceCustomerContactId, invoiceCustomerLocationId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, exchangeRate, exchangeRateUpdatedAt, currency, locationId, quote, createdQuoteId, _d, payment, shipment, externalLink;
        var _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    if (!input.quoteId) return [3 /*break*/, 1];
                    quoteId = input.quoteId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "quote",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _m.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_e = seq.error) !== null && _e !== void 0 ? _e : { message: "Failed to generate quote sequence" }
                            }];
                    }
                    quoteId = seq.data;
                    _m.label = 3;
                case 3:
                    opportunityId = input.opportunityId;
                    if (!!opportunityId) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .insert({
                            customerId: input.customerId,
                            companyId: input.companyId
                        })
                            .select("id")
                            .single()];
                case 4:
                    opportunity = _m.sent();
                    if (opportunity.error)
                        return [2 /*return*/, { data: null, error: opportunity.error }];
                    opportunityId = opportunity.data.id;
                    _m.label = 5;
                case 5: return [4 /*yield*/, Promise.all([
                        getCustomerPayment(client, input.customerId),
                        getCustomerShipping(client, input.customerId),
                        (0, people_1.getEmployeeJob)(client, input.createdBy, input.companyId)
                    ])];
                case 6:
                    _a = _m.sent(), customerPayment = _a[0], customerShipping = _a[1], seller = _a[2];
                    if (customerPayment.error)
                        return [2 /*return*/, { data: null, error: customerPayment.error }];
                    if (customerShipping.error)
                        return [2 /*return*/, { data: null, error: customerShipping.error }];
                    _b = customerPayment.data, paymentTermId = _b.paymentTermId, invoiceCustomerId = _b.invoiceCustomerId, invoiceCustomerContactId = _b.invoiceCustomerContactId, invoiceCustomerLocationId = _b.invoiceCustomerLocationId;
                    _c = customerShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    exchangeRate = 1;
                    exchangeRateUpdatedAt = new Date().toISOString();
                    if (!input.currencyCode) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, input.companyGroupId, input.currencyCode)];
                case 7:
                    currency = _m.sent();
                    if (currency.data) {
                        exchangeRate = (_f = currency.data.exchangeRate) !== null && _f !== void 0 ? _f : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _m.label = 8;
                case 8:
                    locationId = (_j = (_g = input.locationId) !== null && _g !== void 0 ? _g : (_h = seller === null || seller === void 0 ? void 0 : seller.data) === null || _h === void 0 ? void 0 : _h.locationId) !== null && _j !== void 0 ? _j : null;
                    return [4 /*yield*/, client
                            .from("quote")
                            .insert({
                            quoteId: quoteId,
                            customerId: input.customerId,
                            customerContactId: input.customerContactId,
                            customerLocationId: input.customerLocationId,
                            customerEngineeringContactId: input.customerEngineeringContactId,
                            customerReference: input.customerReference,
                            salesPersonId: input.salesPersonId,
                            estimatorId: input.estimatorId,
                            dueDate: input.dueDate,
                            opportunityId: opportunityId,
                            status: (_k = input.status) !== null && _k !== void 0 ? _k : "Draft",
                            expirationDate: input.expirationDate,
                            currencyCode: input.currencyCode,
                            exchangeRate: exchangeRate,
                            exchangeRateUpdatedAt: exchangeRateUpdatedAt,
                            locationId: locationId,
                            internalNotes: input.notes,
                            customFields: input.customFields,
                            companyId: input.companyId,
                            createdBy: input.createdBy,
                            updatedBy: input.createdBy
                        })
                            .select("id, quoteId")
                            .single()];
                case 9:
                    quote = _m.sent();
                    if (quote.error)
                        return [2 /*return*/, { data: null, error: quote.error }];
                    createdQuoteId = quote.data.id;
                    return [4 /*yield*/, Promise.all([
                            client.from("quotePayment").insert({
                                id: createdQuoteId,
                                paymentTermId: paymentTermId,
                                invoiceCustomerId: invoiceCustomerId,
                                invoiceCustomerContactId: invoiceCustomerContactId,
                                invoiceCustomerLocationId: invoiceCustomerLocationId,
                                companyId: input.companyId
                            }),
                            client.from("quoteShipment").insert({
                                id: createdQuoteId,
                                locationId: locationId,
                                shippingMethodId: shippingMethodId,
                                shippingTermId: shippingTermId,
                                incoterm: incoterm,
                                incotermLocation: incotermLocation,
                                companyId: input.companyId
                            }),
                            (0, shared_service_1.upsertExternalLink)(client, {
                                documentType: "Quote",
                                documentId: createdQuoteId,
                                customerId: input.customerId,
                                expiresAt: input.expirationDate,
                                companyId: input.companyId
                            })
                        ])];
                case 10:
                    _d = _m.sent(), payment = _d[0], shipment = _d[1], externalLink = _d[2];
                    if (!(payment.error || shipment.error)) return [3 /*break*/, 12];
                    return [4 /*yield*/, deleteQuote(client, createdQuoteId)];
                case 11:
                    _m.sent();
                    return [2 /*return*/, { data: null, error: (_l = payment.error) !== null && _l !== void 0 ? _l : shipment.error }];
                case 12:
                    if (!externalLink.data) return [3 /*break*/, 14];
                    return [4 /*yield*/, client
                            .from("quote")
                            .update({ externalLinkId: externalLink.data.id })
                            .eq("id", createdQuoteId)];
                case 13:
                    _m.sent();
                    _m.label = 14;
                case 14: return [2 /*return*/, { data: { id: createdQuoteId, quoteId: quoteId }, error: null }];
            }
        });
    });
}
function updateQuote(client, input, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, notes, updates, exchangeRate, exchangeRateUpdatedAt, existing, currency;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = input.id, updatedBy = input.updatedBy, notes = input.notes, updates = __rest(input, ["id", "updatedBy", "notes"]);
                    return [4 /*yield*/, client
                            .from("quote")
                            .select("currencyCode, opportunityId")
                            .eq("id", id)
                            .single()];
                case 1:
                    existing = _b.sent();
                    if (existing.error)
                        return [2 /*return*/, { data: null, error: existing.error }];
                    if (!(updates.currencyCode &&
                        companyGroupId &&
                        existing.data.currencyCode !== updates.currencyCode)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, updates.currencyCode)];
                case 2:
                    currency = _b.sent();
                    if (currency.data) {
                        exchangeRate = (_a = currency.data.exchangeRate) !== null && _a !== void 0 ? _a : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _b.label = 3;
                case 3:
                    if (!(updates.customerId && existing.data.opportunityId)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .update({ customerId: updates.customerId })
                            .eq("id", existing.data.opportunityId)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [2 /*return*/, client
                        .from("quote")
                        .update(__assign(__assign(__assign(__assign(__assign({}, (0, supabase_1.sanitize)(updates)), (exchangeRate !== undefined && { exchangeRate: exchangeRate })), (exchangeRateUpdatedAt && { exchangeRateUpdatedAt: exchangeRateUpdatedAt })), (notes !== undefined && { internalNotes: notes })), { updatedBy: updatedBy, updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                        .eq("id", id)
                        .select("id")
                        .single()];
            }
        });
    });
}
/** @deprecated Use insertQuote for new quotes, updateQuote for existing quotes */
function upsertQuote(client, quote) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, customerPayment, customerShipping, employee, opportunity, _b, paymentTermId, invoiceCustomerId, invoiceCustomerContactId, invoiceCustomerLocationId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, currency, locationId, _companyGroupId, quoteData, insert, quoteId, _d, shipment, payment, externalLink, existingQuote, _e, currencyCode, opportunityId, currency, _cgId, quoteUpdateData;
        var _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    if (!("createdBy" in quote)) return [3 /*break*/, 15];
                    return [4 /*yield*/, Promise.all([
                            getCustomerPayment(client, quote.customerId),
                            getCustomerShipping(client, quote.customerId),
                            (0, people_1.getEmployeeJob)(client, quote.createdBy, quote.companyId),
                            client
                                .from("opportunity")
                                .insert([
                                { companyId: quote.companyId, customerId: quote.customerId }
                            ])
                                .select("id")
                                .single()
                        ])];
                case 1:
                    _a = _o.sent(), customerPayment = _a[0], customerShipping = _a[1], employee = _a[2], opportunity = _a[3];
                    if (customerPayment.error)
                        return [2 /*return*/, customerPayment];
                    if (customerShipping.error)
                        return [2 /*return*/, customerShipping];
                    _b = customerPayment.data, paymentTermId = _b.paymentTermId, invoiceCustomerId = _b.invoiceCustomerId, invoiceCustomerContactId = _b.invoiceCustomerContactId, invoiceCustomerLocationId = _b.invoiceCustomerLocationId;
                    _c = customerShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    if (!quote.currencyCode) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, quote.companyGroupId, quote.currencyCode)];
                case 2:
                    currency = _o.sent();
                    if (currency.data) {
                        quote.exchangeRate = (_f = currency.data.exchangeRate) !== null && _f !== void 0 ? _f : undefined;
                        quote.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    quote.exchangeRate = 1;
                    quote.exchangeRateUpdatedAt = new Date().toISOString();
                    _o.label = 4;
                case 4:
                    locationId = (_h = (_g = employee === null || employee === void 0 ? void 0 : employee.data) === null || _g === void 0 ? void 0 : _g.locationId) !== null && _h !== void 0 ? _h : null;
                    _companyGroupId = quote.companyGroupId, quoteData = __rest(quote, ["companyGroupId"]);
                    return [4 /*yield*/, client
                            .from("quote")
                            .insert([
                            __assign(__assign({}, quoteData), { opportunityId: (_j = opportunity.data) === null || _j === void 0 ? void 0 : _j.id })
                        ])
                            .select("id, quoteId")];
                case 5:
                    insert = _o.sent();
                    if (insert.error) {
                        return [2 /*return*/, insert];
                    }
                    quoteId = (_l = (_k = insert.data) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.id;
                    if (!quoteId)
                        return [2 /*return*/, insert];
                    return [4 /*yield*/, Promise.all([
                            client.from("quoteShipment").insert([
                                {
                                    id: quoteId,
                                    locationId: locationId,
                                    shippingMethodId: shippingMethodId,
                                    shippingTermId: shippingTermId,
                                    incoterm: incoterm,
                                    incotermLocation: incotermLocation,
                                    companyId: quote.companyId
                                }
                            ]),
                            client.from("quotePayment").insert([
                                {
                                    id: quoteId,
                                    invoiceCustomerId: invoiceCustomerId,
                                    invoiceCustomerContactId: invoiceCustomerContactId,
                                    invoiceCustomerLocationId: invoiceCustomerLocationId,
                                    paymentTermId: paymentTermId,
                                    companyId: quote.companyId
                                }
                            ]),
                            (0, shared_service_1.upsertExternalLink)(client, {
                                documentType: "Quote",
                                documentId: quoteId,
                                customerId: quote.customerId,
                                expiresAt: quote.expirationDate,
                                companyId: quote.companyId
                            })
                        ])];
                case 6:
                    _d = _o.sent(), shipment = _d[0], payment = _d[1], externalLink = _d[2];
                    if (!shipment.error) return [3 /*break*/, 8];
                    return [4 /*yield*/, deleteQuote(client, quoteId)];
                case 7:
                    _o.sent();
                    return [2 /*return*/, payment];
                case 8:
                    if (!payment.error) return [3 /*break*/, 10];
                    return [4 /*yield*/, deleteQuote(client, quoteId)];
                case 9:
                    _o.sent();
                    return [2 /*return*/, payment];
                case 10:
                    if (!opportunity.error) return [3 /*break*/, 12];
                    return [4 /*yield*/, deleteQuote(client, quoteId)];
                case 11:
                    _o.sent();
                    return [2 /*return*/, opportunity];
                case 12:
                    if (!externalLink.data) return [3 /*break*/, 14];
                    return [4 /*yield*/, client
                            .from("quote")
                            .update({ externalLinkId: externalLink.data.id })
                            .eq("id", quoteId)];
                case 13:
                    _o.sent();
                    _o.label = 14;
                case 14: return [2 /*return*/, insert];
                case 15: return [4 /*yield*/, client
                        .from("quote")
                        .select("companyId, currencyCode, opportunityId")
                        .eq("id", quote.id)
                        .single()];
                case 16:
                    existingQuote = _o.sent();
                    if (existingQuote.error)
                        return [2 /*return*/, existingQuote];
                    _e = existingQuote.data, currencyCode = _e.currencyCode, opportunityId = _e.opportunityId;
                    if (!(quote.currencyCode && currencyCode !== quote.currencyCode)) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, quote.companyGroupId, quote.currencyCode)];
                case 17:
                    currency = _o.sent();
                    if (currency.data) {
                        quote.exchangeRate = (_m = currency.data.exchangeRate) !== null && _m !== void 0 ? _m : undefined;
                        quote.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _o.label = 18;
                case 18:
                    if (!(quote.customerId && opportunityId)) return [3 /*break*/, 20];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .update({ customerId: quote.customerId })
                            .eq("id", opportunityId)];
                case 19:
                    _o.sent();
                    _o.label = 20;
                case 20:
                    _cgId = quote.companyGroupId, quoteUpdateData = __rest(quote, ["companyGroupId"]);
                    return [2 /*return*/, client
                            .from("quote")
                            .update(__assign(__assign({}, (0, supabase_1.sanitize)(quoteUpdateData)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                            .eq("id", quote.id)];
            }
        });
    });
}
function upsertQuoteLine(client, quotationLine) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, maxSortOrder;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ("id" in quotationLine) {
                        return [2 /*return*/, client
                                .from("quoteLine")
                                .update((0, supabase_1.sanitize)(quotationLine))
                                .eq("id", quotationLine.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("quoteLine")
                            .select("sortOrder")
                            .eq("quoteId", quotationLine.quoteId)];
                case 1:
                    existing = _b.sent();
                    maxSortOrder = ((_a = existing.data) !== null && _a !== void 0 ? _a : []).reduce(function (max, row) { var _a; return Math.max(max, (_a = row.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [2 /*return*/, client
                            .from("quoteLine")
                            .insert([__assign(__assign({}, quotationLine), { sortOrder: maxSortOrder + 1 })])
                            .select("*")
                            .single()];
            }
        });
    });
}
function updateQuoteLineOrder(db, updates) {
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
                                        .updateTable("quoteLine")
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
function upsertQuoteLineAdditionalCharges(client, lineId, update) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("quoteLine").update(update).eq("id", lineId)];
        });
    });
}
function upsertQuoteLinePrices(client, quoteId, lineId, quoteLinePrices) {
    return __awaiter(this, void 0, void 0, function () {
        var existingPrices, deletePrices, quoteExchangeRate, quoteLineUnitPricePrecision, pricesByQuantity, pricesWithExistingDiscountsAndLeadTimes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("quoteLinePrice")
                        .select("*")
                        .eq("quoteLineId", lineId)];
                case 1:
                    existingPrices = _a.sent();
                    if (existingPrices.error) {
                        return [2 /*return*/, existingPrices];
                    }
                    return [4 /*yield*/, client
                            .from("quoteLinePrice")
                            .delete()
                            .eq("quoteLineId", lineId)];
                case 2:
                    deletePrices = _a.sent();
                    if (deletePrices.error) {
                        return [2 /*return*/, deletePrices];
                    }
                    return [4 /*yield*/, client
                            .from("quote")
                            .select("id, exchangeRate")
                            .eq("id", quoteId)
                            .single()];
                case 3:
                    quoteExchangeRate = _a.sent();
                    return [4 /*yield*/, client
                            .from("quoteLine")
                            .select("unitPricePrecision")
                            .eq("id", lineId)
                            .single()];
                case 4:
                    quoteLineUnitPricePrecision = _a.sent();
                    pricesByQuantity = existingPrices.data.reduce(function (acc, price) {
                        acc[price.quantity] = price;
                        return acc;
                    }, {});
                    pricesWithExistingDiscountsAndLeadTimes = quoteLinePrices.map(function (p) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        var existing = pricesByQuantity[p.quantity];
                        var roundedUnitPrice = Number(p.unitPrice.toFixed((_b = (_a = quoteLineUnitPricePrecision.data) === null || _a === void 0 ? void 0 : _a.unitPricePrecision) !== null && _b !== void 0 ? _b : 2));
                        return __assign(__assign({}, p), { unitPrice: roundedUnitPrice, discountPercent: (_c = existing === null || existing === void 0 ? void 0 : existing.discountPercent) !== null && _c !== void 0 ? _c : p.discountPercent, leadTime: (_d = existing === null || existing === void 0 ? void 0 : existing.leadTime) !== null && _d !== void 0 ? _d : p.leadTime, categoryMarkups: (_f = (_e = p.categoryMarkups) !== null && _e !== void 0 ? _e : existing === null || existing === void 0 ? void 0 : existing.categoryMarkups) !== null && _f !== void 0 ? _f : {}, quoteId: quoteId, exchangeRate: (_h = (_g = quoteExchangeRate.data) === null || _g === void 0 ? void 0 : _g.exchangeRate) !== null && _h !== void 0 ? _h : 1 });
                    });
                    return [2 /*return*/, (client
                            .from("quoteLinePrice")
                            // @ts-expect-error - categoryMarkups is a Json object
                            .insert(pricesWithExistingDiscountsAndLeadTimes))];
            }
        });
    });
}
function buildCostEffects(client, quoteLineId) {
    return __awaiter(this, void 0, void 0, function () {
        function normalizeTime(time, unit) {
            var fixedHours = 0;
            var hoursPerUnit = 0;
            switch (unit) {
                case "Total Hours":
                    fixedHours = time;
                    break;
                case "Total Minutes":
                    fixedHours = time / 60;
                    break;
                case "Hours/Piece":
                    hoursPerUnit = time;
                    break;
                case "Hours/100 Pieces":
                    hoursPerUnit = time / 100;
                    break;
                case "Hours/1000 Pieces":
                    hoursPerUnit = time / 1000;
                    break;
                case "Minutes/Piece":
                    hoursPerUnit = time / 60;
                    break;
                case "Minutes/100 Pieces":
                    hoursPerUnit = time / 100 / 60;
                    break;
                case "Minutes/1000 Pieces":
                    hoursPerUnit = time / 1000 / 60;
                    break;
                case "Pieces/Hour":
                    hoursPerUnit = 1 / time;
                    break;
                case "Pieces/Minute":
                    hoursPerUnit = 1 / (time / 60);
                    break;
                case "Seconds/Piece":
                    hoursPerUnit = time / 3600;
                    break;
            }
            return { fixedHours: fixedHours, hoursPerUnit: hoursPerUnit };
        }
        function pushBuyCostEffect(itemId, itemType, quantity, unitCost) {
            var costFn = function (outerQty) {
                var requestedQty = quantity * outerQty;
                return ((0, shared_service_1.lookupBuyPriceFromMap)(itemId, requestedQty, priceMap, unitCost) *
                    requestedQty);
            };
            var key = itemType === "Material"
                ? "materialCost"
                : itemType === "Part"
                    ? "partCost"
                    : itemType === "Tool"
                        ? "toolCost"
                        : itemType === "Consumable"
                            ? "consumableCost"
                            : itemType === "Service"
                                ? "serviceCost"
                                : null;
            if (key)
                effects[key].push(costFn);
        }
        function walkTree(node, parentQuantity) {
            var d = node.data;
            var qty = d.quantity * parentQuantity;
            if (d.methodType === "Purchase to Order") {
                pushBuyCostEffect(d.itemId, d.itemType, qty, d.unitCost);
            }
            else if (d.methodType === "Pull from Inventory") {
                var costFn = function (outerQty) { return d.unitCost * qty * outerQty; };
                var key = d.itemType === "Material"
                    ? "materialCost"
                    : d.itemType === "Part"
                        ? "partCost"
                        : d.itemType === "Tool"
                            ? "toolCost"
                            : d.itemType === "Consumable"
                                ? "consumableCost"
                                : d.itemType === "Service"
                                    ? "serviceCost"
                                    : null;
                if (key)
                    effects[key].push(costFn);
            }
            var nodeOps = operations.filter(function (o) { return o.quoteMakeMethodId === d.quoteMaterialMakeMethodId; });
            var _loop_1 = function (op) {
                if (op.operationType === "Inside") {
                    if (op.setupTime) {
                        var _c = normalizeTime(op.setupTime, op.setupUnit), fixedHours_1 = _c.fixedHours, hoursPerUnit_1 = _c.hoursPerUnit;
                        effects.laborCost.push(function (outerQty) {
                            var _a, _b;
                            return (hoursPerUnit_1 * outerQty * qty * ((_a = op.laborRate) !== null && _a !== void 0 ? _a : 0) +
                                fixedHours_1 * ((_b = op.laborRate) !== null && _b !== void 0 ? _b : 0));
                        });
                        effects.overheadCost.push(function (outerQty) {
                            var _a, _b;
                            return (hoursPerUnit_1 * outerQty * qty * ((_a = op.overheadRate) !== null && _a !== void 0 ? _a : 0) +
                                fixedHours_1 * ((_b = op.overheadRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    var laborFixedHours_1 = 0;
                    var laborHoursPerUnit_1 = 0;
                    var machineFixedHours_1 = 0;
                    var machineHoursPerUnit_1 = 0;
                    if (op.laborTime) {
                        var n = normalizeTime(op.laborTime, op.laborUnit);
                        laborFixedHours_1 = n.fixedHours;
                        laborHoursPerUnit_1 = n.hoursPerUnit;
                        effects.laborCost.push(function (outerQty) {
                            var _a, _b;
                            return (laborHoursPerUnit_1 * outerQty * qty * ((_a = op.laborRate) !== null && _a !== void 0 ? _a : 0) +
                                laborFixedHours_1 * ((_b = op.laborRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    if (op.machineTime) {
                        var n = normalizeTime(op.machineTime, op.machineUnit);
                        machineFixedHours_1 = n.fixedHours;
                        machineHoursPerUnit_1 = n.hoursPerUnit;
                        effects.machineCost.push(function (outerQty) {
                            var _a, _b;
                            return (machineHoursPerUnit_1 * outerQty * qty * ((_a = op.machineRate) !== null && _a !== void 0 ? _a : 0) +
                                machineFixedHours_1 * ((_b = op.machineRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    var hpu_1 = Math.max(laborHoursPerUnit_1, machineHoursPerUnit_1);
                    var fh_1 = Math.max(laborFixedHours_1, machineFixedHours_1);
                    effects.overheadCost.push(function (outerQty) {
                        var _a, _b;
                        if (hpu_1 * outerQty * qty > fh_1) {
                            return hpu_1 * outerQty * qty * ((_a = op.overheadRate) !== null && _a !== void 0 ? _a : 0);
                        }
                        return fh_1 * ((_b = op.overheadRate) !== null && _b !== void 0 ? _b : 0);
                    });
                }
                else if (op.operationType === "Outside") {
                    effects.outsideCost.push(function (outerQty) {
                        var cost = op.operationUnitCost * qty * outerQty;
                        return Math.max(op.operationMinimumCost, cost);
                    });
                }
            };
            for (var _i = 0, nodeOps_1 = nodeOps; _i < nodeOps_1.length; _i++) {
                var op = nodeOps_1[_i];
                _loop_1(op);
            }
            for (var _a = 0, _b = node.children; _a < _b.length; _a++) {
                var child = _b[_a];
                walkTree(child, qty);
            }
        }
        var operationsResult, operations, buyMaterials, buyItemIds, priceMap, _i, _a, mat, price, rootMethod, treeResult, rootItems, lookup, _b, _c, item, itemId, parentId, effects, _d, costCategoryKeys_1, key, _e, rootItems_1, root;
        var _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, client
                        .from("quoteOperation")
                        .select("*")
                        .eq("quoteLineId", quoteLineId)];
                case 1:
                    operationsResult = _j.sent();
                    operations = (_f = operationsResult.data) !== null && _f !== void 0 ? _f : [];
                    return [4 /*yield*/, client
                            .from("quoteMaterial")
                            .select("id, itemId, unitCost")
                            .eq("quoteLineId", quoteLineId)
                            .eq("methodType", "Purchase to Order")];
                case 2:
                    buyMaterials = _j.sent();
                    buyItemIds = __spreadArray([], new Set(((_g = buyMaterials.data) !== null && _g !== void 0 ? _g : []).map(function (m) { return m.itemId; })), true);
                    return [4 /*yield*/, (0, items_service_1.getSupplierPriceBreaksForItems)(client, buyItemIds)];
                case 3:
                    priceMap = _j.sent();
                    _i = 0, _a = (_h = buyMaterials.data) !== null && _h !== void 0 ? _h : [];
                    _j.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    mat = _a[_i];
                    price = (0, shared_service_1.lookupBuyPriceFromMap)(mat.itemId, 1, priceMap, mat.unitCost);
                    if (!(price !== mat.unitCost)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("quoteMaterial")
                            .update({ unitCost: price })
                            .eq("id", mat.id)];
                case 5:
                    _j.sent();
                    _j.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, client
                        .from("quoteMakeMethod")
                        .select("id")
                        .eq("quoteLineId", quoteLineId)
                        .is("parentMaterialId", null)
                        .single()];
                case 8:
                    rootMethod = _j.sent();
                    if (rootMethod.error)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, client.rpc("get_quote_methods_by_method_id", {
                            mid: rootMethod.data.id
                        })];
                case 9:
                    treeResult = _j.sent();
                    if (treeResult.error || !treeResult.data)
                        return [2 /*return*/, null];
                    rootItems = [];
                    lookup = {};
                    for (_b = 0, _c = treeResult.data; _b < _c.length; _b++) {
                        item = _c[_b];
                        itemId = item.methodMaterialId;
                        parentId = item.parentMaterialId;
                        if (!lookup[itemId]) {
                            lookup[itemId] = {
                                id: itemId,
                                children: [],
                                data: item
                            };
                        }
                        else {
                            lookup[itemId].data = item;
                        }
                        if (!parentId) {
                            rootItems.push(lookup[itemId]);
                        }
                        else {
                            if (!lookup[parentId]) {
                                lookup[parentId] = {
                                    id: parentId,
                                    children: [],
                                    data: {}
                                };
                            }
                            lookup[parentId].children.push(lookup[itemId]);
                        }
                    }
                    effects = {};
                    for (_d = 0, costCategoryKeys_1 = sales_models_1.costCategoryKeys; _d < costCategoryKeys_1.length; _d++) {
                        key = costCategoryKeys_1[_d];
                        effects[key] = [];
                    }
                    for (_e = 0, rootItems_1 = rootItems; _e < rootItems_1.length; _e++) {
                        root = rootItems_1[_e];
                        walkTree(root, 1);
                    }
                    return [2 /*return*/, { effects: effects, costCategoryKeys: sales_models_1.costCategoryKeys }];
            }
        });
    });
}
function calculatePricesForQuantities(client, quoteId, quoteLineId, quantities, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, quoteResult, lineResult, settingsResult, companyId, customerId, itemId, exchangeRate, precision, rawMarkups, defaultMarkups, _i, _b, _c, key, value, result, effects, priceRows, _loop_2, _d, quantities_1, qty, insertResult;
        var _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (!quantities.length)
                        return [2 /*return*/, { error: null }];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("quote")
                                .select("companyId, customerId, exchangeRate")
                                .eq("id", quoteId)
                                .single(),
                            client
                                .from("quoteLine")
                                .select("itemId, unitPricePrecision")
                                .eq("id", quoteLineId)
                                .single()
                        ])];
                case 1:
                    _a = _k.sent(), quoteResult = _a[0], lineResult = _a[1];
                    if (quoteResult.error)
                        return [2 /*return*/, { error: quoteResult.error }];
                    if (lineResult.error)
                        return [2 /*return*/, { error: lineResult.error }];
                    return [4 /*yield*/, client
                            .from("companySettings")
                            .select("quoteLineCategoryMarkups")
                            .eq("id", quoteResult.data.companyId)
                            .single()];
                case 2:
                    settingsResult = _k.sent();
                    if (settingsResult.error)
                        return [2 /*return*/, { error: settingsResult.error }];
                    companyId = quoteResult.data.companyId;
                    customerId = (_e = quoteResult.data.customerId) !== null && _e !== void 0 ? _e : undefined;
                    itemId = (_f = lineResult.data.itemId) !== null && _f !== void 0 ? _f : undefined;
                    exchangeRate = (_g = quoteResult.data.exchangeRate) !== null && _g !== void 0 ? _g : 1;
                    precision = (_h = lineResult.data.unitPricePrecision) !== null && _h !== void 0 ? _h : 2;
                    rawMarkups = (_j = settingsResult.data.quoteLineCategoryMarkups) !== null && _j !== void 0 ? _j : {};
                    defaultMarkups = {};
                    for (_i = 0, _b = Object.entries(rawMarkups); _i < _b.length; _i++) {
                        _c = _b[_i], key = _c[0], value = _c[1];
                        defaultMarkups[key] = value * 100;
                    }
                    return [4 /*yield*/, buildCostEffects(client, quoteLineId)];
                case 3:
                    result = _k.sent();
                    // buildCostEffects returns null when the line has no costed method yet —
                    // treat as a no-op so partial drafts don't block the save.
                    if (!result)
                        return [2 /*return*/, { error: null }];
                    effects = result.effects;
                    priceRows = [];
                    _loop_2 = function (qty) {
                        var categoryCosts, _l, costCategoryKeys_2, key, total, rollupPrice, finalPrice, _m;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0:
                                    categoryCosts = {};
                                    for (_l = 0, costCategoryKeys_2 = sales_models_1.costCategoryKeys; _l < costCategoryKeys_2.length; _l++) {
                                        key = costCategoryKeys_2[_l];
                                        total = effects[key].reduce(function (acc, fn) { return acc + fn(qty); }, 0);
                                        categoryCosts[key] = qty > 0 ? total / qty : 0;
                                    }
                                    rollupPrice = sales_models_1.costCategoryKeys.reduce(function (sum, key) {
                                        var _a, _b;
                                        var cost = (_a = categoryCosts[key]) !== null && _a !== void 0 ? _a : 0;
                                        var markup = (_b = defaultMarkups[key]) !== null && _b !== void 0 ? _b : 0;
                                        return sum + cost * (1 + markup / 100);
                                    }, 0);
                                    if (!itemId) return [3 /*break*/, 2];
                                    return [4 /*yield*/, resolvePrice(client, companyId, {
                                            itemId: itemId,
                                            quantity: qty,
                                            customerId: customerId,
                                            existingBasePrice: rollupPrice
                                        })];
                                case 1:
                                    _m = (_o.sent()).finalPrice;
                                    return [3 /*break*/, 3];
                                case 2:
                                    _m = rollupPrice;
                                    _o.label = 3;
                                case 3:
                                    finalPrice = _m;
                                    priceRows.push({
                                        quoteId: quoteId,
                                        quoteLineId: quoteLineId,
                                        quantity: qty,
                                        unitPrice: Number(finalPrice.toFixed(precision)),
                                        categoryMarkups: defaultMarkups,
                                        exchangeRate: exchangeRate,
                                        createdBy: userId,
                                        leadTime: 0,
                                        discountPercent: 0
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _d = 0, quantities_1 = quantities;
                    _k.label = 4;
                case 4:
                    if (!(_d < quantities_1.length)) return [3 /*break*/, 7];
                    qty = quantities_1[_d];
                    return [5 /*yield**/, _loop_2(qty)];
                case 5:
                    _k.sent();
                    _k.label = 6;
                case 6:
                    _d++;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, client.from("quoteLinePrice").insert(priceRows)];
                case 8:
                    insertResult = _k.sent();
                    if (insertResult.error) {
                        console.error("[qpricing][MtO calc] INSERT ERROR", {
                            quoteLineId: quoteLineId,
                            error: insertResult.error
                        });
                        return [2 /*return*/, { error: insertResult.error }];
                    }
                    return [2 /*return*/, { error: null }];
            }
        });
    });
}
function resolveQuoteLinePrices(client, companyId, quoteId, quoteLineId, quantities, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, quoteResult, lineResult, itemId, exchangeRate, precision, customerId, priceRows, _i, quantities_2, qty, resolved, insertResult;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!quantities.length)
                        return [2 /*return*/, { error: null }];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("quote")
                                .select("customerId, exchangeRate")
                                .eq("id", quoteId)
                                .single(),
                            client
                                .from("quoteLine")
                                .select("itemId, unitPricePrecision")
                                .eq("id", quoteLineId)
                                .single()
                        ])];
                case 1:
                    _a = _e.sent(), quoteResult = _a[0], lineResult = _a[1];
                    if (quoteResult.error)
                        return [2 /*return*/, { error: quoteResult.error }];
                    if (lineResult.error)
                        return [2 /*return*/, { error: lineResult.error }];
                    // Missing itemId is a benign draft state, not an error.
                    if (!lineResult.data.itemId)
                        return [2 /*return*/, { error: null }];
                    itemId = lineResult.data.itemId;
                    exchangeRate = (_b = quoteResult.data.exchangeRate) !== null && _b !== void 0 ? _b : 1;
                    precision = (_c = lineResult.data.unitPricePrecision) !== null && _c !== void 0 ? _c : 2;
                    customerId = (_d = quoteResult.data.customerId) !== null && _d !== void 0 ? _d : undefined;
                    priceRows = [];
                    _i = 0, quantities_2 = quantities;
                    _e.label = 2;
                case 2:
                    if (!(_i < quantities_2.length)) return [3 /*break*/, 5];
                    qty = quantities_2[_i];
                    return [4 /*yield*/, resolvePrice(client, companyId, {
                            itemId: itemId,
                            quantity: qty,
                            customerId: customerId
                        })];
                case 3:
                    resolved = _e.sent();
                    priceRows.push({
                        quoteId: quoteId,
                        quoteLineId: quoteLineId,
                        quantity: qty,
                        unitPrice: Number(resolved.finalPrice.toFixed(precision)),
                        exchangeRate: exchangeRate,
                        createdBy: userId,
                        leadTime: 0,
                        discountPercent: 0
                    });
                    _e.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, client.from("quoteLinePrice").insert(priceRows)];
                case 6:
                    insertResult = _e.sent();
                    if (insertResult.error) {
                        console.error("[qpricing][Pull] INSERT ERROR", {
                            quoteLineId: quoteLineId,
                            error: insertResult.error
                        });
                        return [2 /*return*/, { error: insertResult.error }];
                    }
                    return [2 /*return*/, { error: null }];
            }
        });
    });
}
function resolvePurchaseToOrderPrices(client, companyId, quoteId, quoteLineId, quantities, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, quoteResult, lineResult, itemId, exchangeRate, precision, customerId, priceMap, priceRows, _i, quantities_3, qty, supplierPrice, resolved, insertResult;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!quantities.length)
                        return [2 /*return*/, { error: null }];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("quote")
                                .select("customerId, exchangeRate")
                                .eq("id", quoteId)
                                .single(),
                            client
                                .from("quoteLine")
                                .select("itemId, unitPricePrecision")
                                .eq("id", quoteLineId)
                                .single()
                        ])];
                case 1:
                    _a = _e.sent(), quoteResult = _a[0], lineResult = _a[1];
                    if (quoteResult.error)
                        return [2 /*return*/, { error: quoteResult.error }];
                    if (lineResult.error)
                        return [2 /*return*/, { error: lineResult.error }];
                    if (!lineResult.data.itemId)
                        return [2 /*return*/, { error: null }];
                    itemId = lineResult.data.itemId;
                    exchangeRate = (_b = quoteResult.data.exchangeRate) !== null && _b !== void 0 ? _b : 1;
                    precision = (_c = lineResult.data.unitPricePrecision) !== null && _c !== void 0 ? _c : 2;
                    customerId = (_d = quoteResult.data.customerId) !== null && _d !== void 0 ? _d : undefined;
                    return [4 /*yield*/, (0, items_service_1.getSupplierPriceBreaksForItems)(client, [itemId])];
                case 2:
                    priceMap = _e.sent();
                    priceRows = [];
                    _i = 0, quantities_3 = quantities;
                    _e.label = 3;
                case 3:
                    if (!(_i < quantities_3.length)) return [3 /*break*/, 6];
                    qty = quantities_3[_i];
                    supplierPrice = (0, shared_service_1.lookupBuyPriceFromMap)(itemId, qty, priceMap, 0);
                    return [4 /*yield*/, resolvePrice(client, companyId, {
                            itemId: itemId,
                            quantity: qty,
                            customerId: customerId,
                            existingBasePrice: supplierPrice
                        })];
                case 4:
                    resolved = _e.sent();
                    priceRows.push({
                        quoteId: quoteId,
                        quoteLineId: quoteLineId,
                        quantity: qty,
                        unitPrice: Number(resolved.finalPrice.toFixed(precision)),
                        exchangeRate: exchangeRate,
                        createdBy: userId,
                        leadTime: 0,
                        discountPercent: 0
                    });
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, client.from("quoteLinePrice").insert(priceRows)];
                case 7:
                    insertResult = _e.sent();
                    if (insertResult.error) {
                        console.error("[qpricing][P2O] INSERT ERROR", {
                            quoteLineId: quoteLineId,
                            error: insertResult.error
                        });
                        return [2 /*return*/, { error: insertResult.error }];
                    }
                    return [2 /*return*/, { error: null }];
            }
        });
    });
}
function recalculateQuoteLinePrices(client, quoteId, quoteLineId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var existingPrices, _a, lineResult, quoteResult, precision, itemId, companyId, customerId, defaultMarkups, settingsResult, rawDefaults, _i, _b, _c, key, value, result, effects, updatedRows, _loop_3, _d, _e, row, deleteResult, insertResult;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0: return [4 /*yield*/, client
                        .from("quoteLinePrice")
                        .select("*")
                        .eq("quoteLineId", quoteLineId)];
                case 1:
                    existingPrices = _s.sent();
                    if (existingPrices.error)
                        return [2 /*return*/, { error: existingPrices.error }];
                    if (!((_f = existingPrices.data) === null || _f === void 0 ? void 0 : _f.length))
                        return [2 /*return*/, { error: null }];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("quoteLine")
                                .select("itemId, unitPricePrecision")
                                .eq("id", quoteLineId)
                                .single(),
                            client
                                .from("quote")
                                .select("companyId, customerId")
                                .eq("id", quoteId)
                                .single()
                        ])];
                case 2:
                    _a = _s.sent(), lineResult = _a[0], quoteResult = _a[1];
                    precision = (_h = (_g = lineResult.data) === null || _g === void 0 ? void 0 : _g.unitPricePrecision) !== null && _h !== void 0 ? _h : 2;
                    itemId = (_k = (_j = lineResult.data) === null || _j === void 0 ? void 0 : _j.itemId) !== null && _k !== void 0 ? _k : undefined;
                    companyId = (_l = quoteResult.data) === null || _l === void 0 ? void 0 : _l.companyId;
                    customerId = (_o = (_m = quoteResult.data) === null || _m === void 0 ? void 0 : _m.customerId) !== null && _o !== void 0 ? _o : undefined;
                    defaultMarkups = {};
                    if (!companyId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("companySettings")
                            .select("quoteLineCategoryMarkups")
                            .eq("id", companyId)
                            .single()];
                case 3:
                    settingsResult = _s.sent();
                    rawDefaults = (_q = (_p = settingsResult.data) === null || _p === void 0 ? void 0 : _p.quoteLineCategoryMarkups) !== null && _q !== void 0 ? _q : {};
                    for (_i = 0, _b = Object.entries(rawDefaults); _i < _b.length; _i++) {
                        _c = _b[_i], key = _c[0], value = _c[1];
                        defaultMarkups[key] = value * 100;
                    }
                    _s.label = 4;
                case 4: return [4 /*yield*/, buildCostEffects(client, quoteLineId)];
                case 5:
                    result = _s.sent();
                    if (!result)
                        return [2 /*return*/, { error: null }];
                    effects = result.effects;
                    updatedRows = [];
                    _loop_3 = function (row) {
                        var qty, rowMarkups, markups, categoryCosts, _t, costCategoryKeys_3, key, total, rollupPrice, finalPrice, _u;
                        return __generator(this, function (_v) {
                            switch (_v.label) {
                                case 0:
                                    qty = row.quantity;
                                    rowMarkups = (_r = row.categoryMarkups) !== null && _r !== void 0 ? _r : {};
                                    markups = Object.keys(rowMarkups).length > 0 ? rowMarkups : defaultMarkups;
                                    categoryCosts = {};
                                    for (_t = 0, costCategoryKeys_3 = sales_models_1.costCategoryKeys; _t < costCategoryKeys_3.length; _t++) {
                                        key = costCategoryKeys_3[_t];
                                        total = effects[key].reduce(function (acc, fn) { return acc + fn(qty); }, 0);
                                        categoryCosts[key] = qty > 0 ? total / qty : 0;
                                    }
                                    rollupPrice = sales_models_1.costCategoryKeys.reduce(function (sum, key) {
                                        var _a, _b;
                                        var cost = (_a = categoryCosts[key]) !== null && _a !== void 0 ? _a : 0;
                                        var markup = (_b = markups[key]) !== null && _b !== void 0 ? _b : 0;
                                        return sum + cost * (1 + markup / 100);
                                    }, 0);
                                    if (!(itemId && companyId)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, resolvePrice(client, companyId, {
                                            itemId: itemId,
                                            quantity: qty,
                                            customerId: customerId,
                                            existingBasePrice: rollupPrice
                                        })];
                                case 1:
                                    _u = (_v.sent()).finalPrice;
                                    return [3 /*break*/, 3];
                                case 2:
                                    _u = rollupPrice;
                                    _v.label = 3;
                                case 3:
                                    finalPrice = _u;
                                    updatedRows.push({
                                        quoteId: row.quoteId,
                                        quoteLineId: row.quoteLineId,
                                        quantity: row.quantity,
                                        unitPrice: Number(finalPrice.toFixed(precision)),
                                        categoryMarkups: markups,
                                        exchangeRate: row.exchangeRate,
                                        createdBy: row.createdBy,
                                        updatedBy: userId,
                                        leadTime: row.leadTime,
                                        discountPercent: row.discountPercent
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _d = 0, _e = existingPrices.data;
                    _s.label = 6;
                case 6:
                    if (!(_d < _e.length)) return [3 /*break*/, 9];
                    row = _e[_d];
                    return [5 /*yield**/, _loop_3(row)];
                case 7:
                    _s.sent();
                    _s.label = 8;
                case 8:
                    _d++;
                    return [3 /*break*/, 6];
                case 9: return [4 /*yield*/, client
                        .from("quoteLinePrice")
                        .delete()
                        .eq("quoteLineId", quoteLineId)];
                case 10:
                    deleteResult = _s.sent();
                    if (deleteResult.error) {
                        console.error("[qpricing][recalc] DELETE ERROR", {
                            quoteLineId: quoteLineId,
                            error: deleteResult.error
                        });
                        return [2 /*return*/, { error: deleteResult.error }];
                    }
                    return [4 /*yield*/, client.from("quoteLinePrice").insert(updatedRows)];
                case 11:
                    insertResult = _s.sent();
                    if (insertResult.error) {
                        console.error("[qpricing][recalc] INSERT ERROR", {
                            quoteLineId: quoteLineId,
                            error: insertResult.error
                        });
                        return [2 /*return*/, { error: insertResult.error }];
                    }
                    return [2 /*return*/, { error: null }];
            }
        });
    });
}
function upsertQuoteLineMethod(client, lineMethod) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            body = {
                type: "itemToQuoteLine",
                sourceId: lineMethod.itemId,
                targetId: "".concat(lineMethod.quoteId, ":").concat(lineMethod.quoteLineId),
                companyId: lineMethod.companyId,
                userId: lineMethod.userId
            };
            // Only add configuration if it exists
            if (lineMethod.configuration !== undefined) {
                body.configuration = lineMethod.configuration;
            }
            // Only add parts if it exists
            if (lineMethod.parts !== undefined) {
                body.parts = lineMethod.parts;
            }
            return [2 /*return*/, client.functions.invoke("get-method", {
                    body: body
                })];
        });
    });
}
function upsertQuoteMaterial(client, quoteMaterial) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("updatedBy" in quoteMaterial) {
                return [2 /*return*/, client
                        .from("quoteMaterial")
                        .update((0, supabase_1.sanitize)(quoteMaterial))
                        .eq("id", quoteMaterial.id)
                        .select("id, methodType")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("quoteMaterial")
                    .insert([quoteMaterial])
                    .select("id, methodType")
                    .single()];
        });
    });
}
function upsertQuoteMaterialMakeMethod(client, quoteMethod) {
    return __awaiter(this, void 0, void 0, function () {
        var body, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        type: "itemToQuoteMakeMethod",
                        sourceId: quoteMethod.sourceId,
                        targetId: quoteMethod.targetId,
                        companyId: quoteMethod.companyId,
                        userId: quoteMethod.userId
                    };
                    // Only add configuration if it exists
                    if (quoteMethod.configuration !== undefined) {
                        body.configuration = quoteMethod.configuration;
                    }
                    // Only add parts if it exists
                    if (quoteMethod.parts !== undefined) {
                        body.parts = quoteMethod.parts;
                    }
                    return [4 /*yield*/, client.functions.invoke("get-method", {
                            body: body
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Failed to pull method" }
                            }];
                    }
                    return [2 /*return*/, { data: null, error: null }];
            }
        });
    });
}
function upsertQuoteOperation(client, operation) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in operation) {
                return [2 /*return*/, client
                        .from("quoteOperation")
                        .insert([operation])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("quoteOperation")
                    .update((0, supabase_1.sanitize)(operation))
                    .eq("id", operation.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertQuoteOperationStep(client, quoteOperationStep) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in quoteOperationStep) {
                return [2 /*return*/, client
                        .from("quoteOperationStep")
                        .insert(quoteOperationStep)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("quoteOperationStep")
                    .update((0, supabase_1.sanitize)(quoteOperationStep))
                    .eq("id", quoteOperationStep.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertQuoteOperationParameter(client, quoteOperationParameter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in quoteOperationParameter) {
                return [2 /*return*/, client
                        .from("quoteOperationParameter")
                        .insert(quoteOperationParameter)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("quoteOperationParameter")
                    .update((0, supabase_1.sanitize)(quoteOperationParameter))
                    .eq("id", quoteOperationParameter.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertQuoteOperationTool(client, quoteOperationTool) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in quoteOperationTool) {
                return [2 /*return*/, client
                        .from("quoteOperationTool")
                        .insert(quoteOperationTool)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("quoteOperationTool")
                    .update((0, supabase_1.sanitize)(quoteOperationTool))
                    .eq("id", quoteOperationTool.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertQuotePayment(client, quotePayment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in quotePayment) {
                return [2 /*return*/, client
                        .from("quotePayment")
                        .update((0, supabase_1.sanitize)(quotePayment))
                        .eq("id", quotePayment.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("quotePayment")
                    .insert([quotePayment])
                    .select("id")
                    .single()];
        });
    });
}
function upsertQuoteShipment(client, quoteShipment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in quoteShipment) {
                return [2 /*return*/, client
                        .from("quoteShipment")
                        .update((0, supabase_1.sanitize)(quoteShipment))
                        .eq("id", quoteShipment.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("quoteShipment")
                    .insert([quoteShipment])
                    .select("id")
                    .single()];
        });
    });
}
function updateSalesOrderFavorite(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, favorite, userId;
        return __generator(this, function (_a) {
            id = args.id, favorite = args.favorite, userId = args.userId;
            if (!favorite) {
                return [2 /*return*/, client
                        .from("salesOrderFavorite")
                        .delete()
                        .eq("salesOrderId", id)
                        .eq("userId", userId)];
            }
            else {
                return [2 /*return*/, client
                        .from("salesOrderFavorite")
                        .insert({ salesOrderId: id, userId: userId })];
            }
            return [2 /*return*/];
        });
    });
}
function updateSalesOrderStatus(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        var status, rest, updateData;
        return __generator(this, function (_a) {
            status = update.status, rest = __rest(update, ["status"]);
            updateData = __assign(__assign({ status: status }, rest), (["To Ship", "To Ship and Invoice"].includes(status)
                ? { completedDate: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString() }
                : {}));
            return [2 /*return*/, client.from("salesOrder").update(updateData).eq("id", update.id)];
        });
    });
}
function insertSalesOrder(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var salesOrderId, seq, opportunityId, opportunity, _a, customerPayment, customerShipping, seller, _b, paymentTermId, invoiceCustomerId, invoiceCustomerContactId, invoiceCustomerLocationId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, currencyCode, companyResult, exchangeRate, exchangeRateUpdatedAt, currency, locationId, order, orderId, _d, shipment, payment;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    if (!input.salesOrderId) return [3 /*break*/, 1];
                    salesOrderId = input.salesOrderId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "salesOrder",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _t.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_e = seq.error) !== null && _e !== void 0 ? _e : { message: "Failed to generate SO sequence" }
                            }];
                    }
                    salesOrderId = seq.data;
                    _t.label = 3;
                case 3:
                    opportunityId = input.opportunityId;
                    if (!!opportunityId) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .insert({
                            customerId: input.customerId,
                            companyId: input.companyId
                        })
                            .select("id")
                            .single()];
                case 4:
                    opportunity = _t.sent();
                    if (opportunity.error)
                        return [2 /*return*/, { data: null, error: opportunity.error }];
                    opportunityId = opportunity.data.id;
                    _t.label = 5;
                case 5: return [4 /*yield*/, Promise.all([
                        getCustomerPayment(client, input.customerId),
                        getCustomerShipping(client, input.customerId),
                        (0, people_1.getEmployeeJob)(client, input.createdBy, input.companyId)
                    ])];
                case 6:
                    _a = _t.sent(), customerPayment = _a[0], customerShipping = _a[1], seller = _a[2];
                    if (customerPayment.error)
                        return [2 /*return*/, { data: null, error: customerPayment.error }];
                    if (customerShipping.error)
                        return [2 /*return*/, { data: null, error: customerShipping.error }];
                    _b = customerPayment.data, paymentTermId = _b.paymentTermId, invoiceCustomerId = _b.invoiceCustomerId, invoiceCustomerContactId = _b.invoiceCustomerContactId, invoiceCustomerLocationId = _b.invoiceCustomerLocationId;
                    _c = customerShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    currencyCode = input.currencyCode;
                    if (!!currencyCode) return [3 /*break*/, 8];
                    return [4 /*yield*/, client
                            .from("company")
                            .select("baseCurrencyCode")
                            .eq("id", input.companyId)
                            .single()];
                case 7:
                    companyResult = _t.sent();
                    currencyCode = (_g = (_f = companyResult.data) === null || _f === void 0 ? void 0 : _f.baseCurrencyCode) !== null && _g !== void 0 ? _g : "USD";
                    _t.label = 8;
                case 8:
                    exchangeRate = 1;
                    exchangeRateUpdatedAt = new Date().toISOString();
                    if (!currencyCode) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, input.companyGroupId, currencyCode)];
                case 9:
                    currency = _t.sent();
                    if (currency.data) {
                        exchangeRate = (_h = currency.data.exchangeRate) !== null && _h !== void 0 ? _h : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _t.label = 10;
                case 10:
                    locationId = (_l = (_j = input.locationId) !== null && _j !== void 0 ? _j : (_k = seller === null || seller === void 0 ? void 0 : seller.data) === null || _k === void 0 ? void 0 : _k.locationId) !== null && _l !== void 0 ? _l : null;
                    return [4 /*yield*/, client
                            .from("salesOrder")
                            .insert({
                            salesOrderId: salesOrderId,
                            customerId: input.customerId,
                            customerContactId: input.customerContactId,
                            customerLocationId: input.customerLocationId,
                            opportunityId: opportunityId,
                            status: (_m = input.status) !== null && _m !== void 0 ? _m : "Draft",
                            orderDate: (_o = input.orderDate) !== null && _o !== void 0 ? _o : new Date().toISOString().split("T")[0],
                            currencyCode: currencyCode,
                            exchangeRate: exchangeRate,
                            exchangeRateUpdatedAt: exchangeRateUpdatedAt,
                            locationId: locationId,
                            internalNotes: (_p = input.notes) !== null && _p !== void 0 ? _p : null,
                            customFields: input.customFields,
                            companyId: input.companyId,
                            createdBy: input.createdBy,
                            updatedBy: input.createdBy
                        })
                            .select("id, salesOrderId")
                            .single()];
                case 11:
                    order = _t.sent();
                    if (order.error)
                        return [2 /*return*/, { data: null, error: order.error }];
                    orderId = order.data.id;
                    return [4 /*yield*/, Promise.all([
                            client.from("salesOrderShipment").insert({
                                id: orderId,
                                locationId: locationId,
                                receiptRequestedDate: (_q = input.requestedDate) !== null && _q !== void 0 ? _q : null,
                                receiptPromisedDate: (_r = input.promisedDate) !== null && _r !== void 0 ? _r : null,
                                shippingMethodId: shippingMethodId,
                                shippingTermId: shippingTermId,
                                incoterm: incoterm,
                                incotermLocation: incotermLocation,
                                companyId: input.companyId
                            }),
                            client.from("salesOrderPayment").insert({
                                id: orderId,
                                paymentTermId: paymentTermId,
                                invoiceCustomerId: invoiceCustomerId !== null && invoiceCustomerId !== void 0 ? invoiceCustomerId : input.customerId,
                                invoiceCustomerContactId: invoiceCustomerContactId,
                                invoiceCustomerLocationId: invoiceCustomerLocationId,
                                companyId: input.companyId
                            })
                        ])];
                case 12:
                    _d = _t.sent(), shipment = _d[0], payment = _d[1];
                    if (!(shipment.error || payment.error)) return [3 /*break*/, 14];
                    return [4 /*yield*/, deleteSalesOrder(client, orderId)];
                case 13:
                    _t.sent();
                    return [2 /*return*/, { data: null, error: (_s = shipment.error) !== null && _s !== void 0 ? _s : payment.error }];
                case 14: return [2 /*return*/, { data: { id: orderId, salesOrderId: salesOrderId }, error: null }];
            }
        });
    });
}
function updateSalesOrder(client, input, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, notes, updates, exchangeRate, exchangeRateUpdatedAt, existing, currency;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = input.id, updatedBy = input.updatedBy, notes = input.notes, updates = __rest(input, ["id", "updatedBy", "notes"]);
                    return [4 /*yield*/, client
                            .from("salesOrder")
                            .select("currencyCode, opportunityId")
                            .eq("id", id)
                            .single()];
                case 1:
                    existing = _b.sent();
                    if (existing.error)
                        return [2 /*return*/, { data: null, error: existing.error }];
                    if (!(updates.currencyCode &&
                        companyGroupId &&
                        existing.data.currencyCode !== updates.currencyCode)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, updates.currencyCode)];
                case 2:
                    currency = _b.sent();
                    if (currency.data) {
                        exchangeRate = (_a = currency.data.exchangeRate) !== null && _a !== void 0 ? _a : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _b.label = 3;
                case 3:
                    if (!(updates.customerId && existing.data.opportunityId)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .update({ customerId: updates.customerId })
                            .eq("id", existing.data.opportunityId)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [2 /*return*/, client
                        .from("salesOrder")
                        .update(__assign(__assign(__assign(__assign(__assign({}, (0, supabase_1.sanitize)(updates)), (exchangeRate !== undefined && { exchangeRate: exchangeRate })), (exchangeRateUpdatedAt && { exchangeRateUpdatedAt: exchangeRateUpdatedAt })), (notes !== undefined && { internalNotes: notes })), { updatedBy: updatedBy, updatedAt: new Date().toISOString() }))
                        .eq("id", id)
                        .select("id")
                        .single()];
            }
        });
    });
}
exports.LIVE_JOB_STATUSES = [
    "Draft",
    "Ready",
    "In Progress",
    "Paused"
];
function cancelSalesOrder(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var orderUpdate, jobIdsToCancel, liveJobs, jobUpdate, cancelledJobIds;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, updateSalesOrderStatus(client, {
                        id: args.id,
                        status: "Cancelled",
                        assignee: undefined,
                        updatedBy: args.userId
                    })];
                case 1:
                    orderUpdate = _c.sent();
                    if (orderUpdate.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to cancel sales order: ".concat(orderUpdate.error.message),
                                cancelledJobIds: []
                            }];
                    }
                    if (!(args.jobs === undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("job")
                            .select("id")
                            .eq("salesOrderId", args.id)
                            .in("status", exports.LIVE_JOB_STATUSES)];
                case 2:
                    liveJobs = _c.sent();
                    if (liveJobs.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Sales order cancelled, but failed to look up associated jobs to cancel",
                                cancelledJobIds: []
                            }];
                    }
                    jobIdsToCancel = ((_a = liveJobs.data) !== null && _a !== void 0 ? _a : [])
                        .map(function (j) { return j.id; })
                        .filter(function (v) { return Boolean(v); });
                    return [3 /*break*/, 4];
                case 3:
                    jobIdsToCancel = args.jobs.filter(Boolean);
                    _c.label = 4;
                case 4:
                    if (jobIdsToCancel.length === 0) {
                        return [2 /*return*/, {
                                success: true,
                                message: "Sales order cancelled",
                                cancelledJobIds: []
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("job")
                            .update({ status: "Cancelled", updatedBy: args.userId })
                            .in("id", jobIdsToCancel)
                            .in("status", exports.LIVE_JOB_STATUSES)
                            .select("id")];
                case 5:
                    jobUpdate = _c.sent();
                    if (jobUpdate.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Sales order cancelled, but failed to cancel some associated jobs: ".concat(jobUpdate.error.message),
                                cancelledJobIds: []
                            }];
                    }
                    cancelledJobIds = ((_b = jobUpdate.data) !== null && _b !== void 0 ? _b : [])
                        .map(function (j) { return j.id; })
                        .filter(function (v) { return Boolean(v); });
                    return [2 /*return*/, {
                            success: true,
                            message: cancelledJobIds.length === 0
                                ? "Sales order cancelled"
                                : "Sales order cancelled and ".concat(cancelledJobIds.length, " job").concat(cancelledJobIds.length === 1 ? "" : "s", " cancelled"),
                            cancelledJobIds: cancelledJobIds
                        }];
            }
        });
    });
}
/** @deprecated Use insertSalesOrder for new orders, updateSalesOrder for existing orders */
function upsertSalesOrder(client, salesOrder) {
    return __awaiter(this, void 0, void 0, function () {
        var existingSalesOrder, _a, currencyCode, opportunityId, currency, _cgId, salesOrderUpdateData, _b, customerPayment, customerShipping, employee, opportunity, _c, paymentTermId, invoiceCustomerId, invoiceCustomerContactId, invoiceCustomerLocationId, _d, shippingMethodId, shippingTermId, incoterm, incotermLocation, locationId, currency, requestedDate, promisedDate, _companyGroupId, orderData, order, salesOrderId, _e, shipment, payment;
        var _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if (!("id" in salesOrder)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("salesOrder")
                            .select("companyId, currencyCode, opportunityId")
                            .eq("id", salesOrder.id)
                            .single()];
                case 1:
                    existingSalesOrder = _l.sent();
                    if (existingSalesOrder.error)
                        return [2 /*return*/, existingSalesOrder];
                    _a = existingSalesOrder.data, currencyCode = _a.currencyCode, opportunityId = _a.opportunityId;
                    if (!(salesOrder.currencyCode && currencyCode !== salesOrder.currencyCode)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, salesOrder.companyGroupId, salesOrder.currencyCode)];
                case 2:
                    currency = _l.sent();
                    if (currency.data) {
                        salesOrder.exchangeRate = (_f = currency.data.exchangeRate) !== null && _f !== void 0 ? _f : undefined;
                        salesOrder.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _l.label = 3;
                case 3:
                    if (!(salesOrder.customerId && opportunityId)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .update({ customerId: salesOrder.customerId })
                            .eq("id", opportunityId)];
                case 4:
                    _l.sent();
                    _l.label = 5;
                case 5:
                    _cgId = salesOrder.companyGroupId, salesOrderUpdateData = __rest(salesOrder, ["companyGroupId"]);
                    return [2 /*return*/, client
                            .from("salesOrder")
                            .update((0, supabase_1.sanitize)(salesOrderUpdateData))
                            .eq("id", salesOrder.id)
                            .select("id, salesOrderId")];
                case 6: return [4 /*yield*/, Promise.all([
                        getCustomerPayment(client, salesOrder.customerId),
                        getCustomerShipping(client, salesOrder.customerId),
                        (0, people_1.getEmployeeJob)(client, salesOrder.createdBy, salesOrder.companyId),
                        client
                            .from("opportunity")
                            .insert([
                            {
                                companyId: salesOrder.companyId,
                                customerId: salesOrder.customerId
                            }
                        ])
                            .select("id")
                            .single()
                    ])];
                case 7:
                    _b = _l.sent(), customerPayment = _b[0], customerShipping = _b[1], employee = _b[2], opportunity = _b[3];
                    if (customerPayment.error)
                        return [2 /*return*/, customerPayment];
                    if (customerShipping.error)
                        return [2 /*return*/, customerShipping];
                    _c = customerPayment.data, paymentTermId = _c.paymentTermId, invoiceCustomerId = _c.invoiceCustomerId, invoiceCustomerContactId = _c.invoiceCustomerContactId, invoiceCustomerLocationId = _c.invoiceCustomerLocationId;
                    _d = customerShipping.data, shippingMethodId = _d.shippingMethodId, shippingTermId = _d.shippingTermId, incoterm = _d.incoterm, incotermLocation = _d.incotermLocation;
                    locationId = (_h = (_g = employee === null || employee === void 0 ? void 0 : employee.data) === null || _g === void 0 ? void 0 : _g.locationId) !== null && _h !== void 0 ? _h : null;
                    if (!salesOrder.currencyCode) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, salesOrder.companyGroupId, salesOrder.currencyCode)];
                case 8:
                    currency = _l.sent();
                    if (currency.data) {
                        salesOrder.exchangeRate = (_j = currency.data.exchangeRate) !== null && _j !== void 0 ? _j : undefined;
                        salesOrder.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    return [3 /*break*/, 10];
                case 9:
                    salesOrder.exchangeRate = 1;
                    salesOrder.exchangeRateUpdatedAt = new Date().toISOString();
                    _l.label = 10;
                case 10:
                    requestedDate = salesOrder.requestedDate, promisedDate = salesOrder.promisedDate, _companyGroupId = salesOrder.companyGroupId, orderData = __rest(salesOrder, ["requestedDate", "promisedDate", "companyGroupId"]);
                    return [4 /*yield*/, client
                            .from("salesOrder")
                            .insert([__assign(__assign({}, orderData), { opportunityId: (_k = opportunity.data) === null || _k === void 0 ? void 0 : _k.id })])
                            .select("id, salesOrderId")];
                case 11:
                    order = _l.sent();
                    if (order.error) {
                        return [2 /*return*/, order];
                    }
                    if (!order.data || order.data.length === 0) {
                        return [2 /*return*/, {
                                error: {
                                    message: "Sales order insert returned no data",
                                    details: "The insert operation completed but returned an empty result set"
                                },
                                data: null
                            }];
                    }
                    salesOrderId = order.data[0].id;
                    return [4 /*yield*/, Promise.all([
                            client.from("salesOrderShipment").insert([
                                {
                                    id: salesOrderId,
                                    locationId: locationId,
                                    shippingMethodId: shippingMethodId,
                                    receiptRequestedDate: requestedDate,
                                    receiptPromisedDate: promisedDate,
                                    shippingTermId: shippingTermId,
                                    incoterm: incoterm,
                                    incotermLocation: incotermLocation,
                                    companyId: salesOrder.companyId
                                }
                            ]),
                            client.from("salesOrderPayment").insert([
                                {
                                    id: salesOrderId,
                                    invoiceCustomerId: invoiceCustomerId,
                                    invoiceCustomerContactId: invoiceCustomerContactId,
                                    invoiceCustomerLocationId: invoiceCustomerLocationId,
                                    paymentTermId: paymentTermId,
                                    companyId: salesOrder.companyId
                                }
                            ])
                        ])];
                case 12:
                    _e = _l.sent(), shipment = _e[0], payment = _e[1];
                    if (!shipment.error) return [3 /*break*/, 14];
                    return [4 /*yield*/, deleteSalesOrder(client, salesOrderId)];
                case 13:
                    _l.sent();
                    return [2 /*return*/, shipment];
                case 14:
                    if (!payment.error) return [3 /*break*/, 16];
                    return [4 /*yield*/, deleteSalesOrder(client, salesOrderId)];
                case 15:
                    _l.sent();
                    return [2 /*return*/, payment];
                case 16:
                    if (!opportunity.error) return [3 /*break*/, 18];
                    return [4 /*yield*/, deleteSalesOrder(client, salesOrderId)];
                case 17:
                    _l.sent();
                    return [2 /*return*/, opportunity];
                case 18: return [2 /*return*/, order];
            }
        });
    });
}
function upsertSalesOrderShipment(client, salesOrderShipment) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, updatedBy, rest, existing, order;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!("id" in salesOrderShipment)) return [3 /*break*/, 3];
                    _a = salesOrderShipment, id = _a.id, updatedBy = _a.updatedBy, rest = __rest(_a, ["id", "updatedBy"]);
                    return [4 /*yield*/, client
                            .from("salesOrderShipment")
                            .select("id")
                            .eq("id", id)
                            .maybeSingle()];
                case 1:
                    existing = _b.sent();
                    if (existing.data) {
                        return [2 /*return*/, client
                                .from("salesOrderShipment")
                                .update((0, supabase_1.sanitize)(__assign(__assign({}, rest), { updatedBy: updatedBy })))
                                .eq("id", id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("salesOrder")
                            .select("companyId")
                            .eq("id", id)
                            .single()];
                case 2:
                    order = _b.sent();
                    if (order.error) {
                        return [2 /*return*/, order];
                    }
                    return [2 /*return*/, client
                            .from("salesOrderShipment")
                            .insert([
                            (0, supabase_1.sanitize)(__assign(__assign({ id: id }, rest), { companyId: order.data.companyId, updatedBy: updatedBy }))
                        ])
                            .select("id")
                            .single()];
                case 3: return [2 /*return*/, client
                        .from("salesOrderShipment")
                        .insert([salesOrderShipment])
                        .select("id")
                        .single()];
            }
        });
    });
}
function upsertSalesOrderLine(client, salesOrderLine) {
    return __awaiter(this, void 0, void 0, function () {
        var salesOrder, existing, maxSortOrder;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if ("id" in salesOrderLine) {
                        return [2 /*return*/, client
                                .from("salesOrderLine")
                                .update((0, supabase_1.sanitize)(salesOrderLine))
                                .eq("id", salesOrderLine.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, getSalesOrder(client, salesOrderLine.salesOrderId)];
                case 1:
                    salesOrder = _k.sent();
                    if (salesOrder.error)
                        return [2 /*return*/, salesOrder];
                    return [4 /*yield*/, client
                            .from("salesOrderLine")
                            .select("sortOrder")
                            .eq("salesOrderId", salesOrderLine.salesOrderId)];
                case 2:
                    existing = _k.sent();
                    maxSortOrder = ((_a = existing.data) !== null && _a !== void 0 ? _a : []).reduce(function (max, row) { var _a; return Math.max(max, (_a = row.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [2 /*return*/, client
                            .from("salesOrderLine")
                            .insert([
                            __assign(__assign({}, salesOrderLine), { setupPrice: (_b = salesOrderLine.setupPrice) !== null && _b !== void 0 ? _b : 0, unitPrice: (_c = salesOrderLine.unitPrice) !== null && _c !== void 0 ? _c : 0, shippingCost: (_d = salesOrderLine.shippingCost) !== null && _d !== void 0 ? _d : 0, addOnCost: (_e = salesOrderLine.addOnCost) !== null && _e !== void 0 ? _e : 0, nonTaxableAddOnCost: (_f = salesOrderLine.nonTaxableAddOnCost) !== null && _f !== void 0 ? _f : 0, taxPercent: (_g = salesOrderLine.taxPercent) !== null && _g !== void 0 ? _g : 0, exchangeRate: (_j = (_h = salesOrder.data) === null || _h === void 0 ? void 0 : _h.exchangeRate) !== null && _j !== void 0 ? _j : 1, sortOrder: maxSortOrder + 1 })
                        ])
                            .select("id")
                            .single()];
            }
        });
    });
}
function updateSalesOrderLineOrder(db, updates) {
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
                                        .updateTable("salesOrderLine")
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
function upsertSalesOrderPayment(client, salesOrderPayment) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, updatedBy, rest, existing, order;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!("id" in salesOrderPayment)) return [3 /*break*/, 3];
                    _a = salesOrderPayment, id = _a.id, updatedBy = _a.updatedBy, rest = __rest(_a, ["id", "updatedBy"]);
                    return [4 /*yield*/, client
                            .from("salesOrderPayment")
                            .select("id")
                            .eq("id", id)
                            .maybeSingle()];
                case 1:
                    existing = _b.sent();
                    if (existing.data) {
                        return [2 /*return*/, client
                                .from("salesOrderPayment")
                                .update((0, supabase_1.sanitize)(__assign(__assign({}, rest), { updatedBy: updatedBy })))
                                .eq("id", id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("salesOrder")
                            .select("companyId")
                            .eq("id", id)
                            .single()];
                case 2:
                    order = _b.sent();
                    if (order.error) {
                        return [2 /*return*/, order];
                    }
                    return [2 /*return*/, client
                            .from("salesOrderPayment")
                            .insert([
                            (0, supabase_1.sanitize)(__assign(__assign({ id: id }, rest), { companyId: order.data.companyId, updatedBy: updatedBy }))
                        ])
                            .select("id")
                            .single()];
                case 3: return [2 /*return*/, client
                        .from("salesOrderPayment")
                        .insert([salesOrderPayment])
                        .select("id")
                        .single()];
            }
        });
    });
}
function insertSalesRFQ(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var rfqId, seq, opportunity, rfq;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!input.rfqId) return [3 /*break*/, 1];
                    rfqId = input.rfqId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "salesRfq",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _e.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate salesRfq sequence"
                                }
                            }];
                    }
                    rfqId = seq.data;
                    _e.label = 3;
                case 3: return [4 /*yield*/, client
                        .from("opportunity")
                        .insert({
                        companyId: input.companyId,
                        customerId: input.customerId
                    })
                        .select("id")
                        .single()];
                case 4:
                    opportunity = _e.sent();
                    if (opportunity.error)
                        return [2 /*return*/, { data: null, error: opportunity.error }];
                    return [4 /*yield*/, client
                            .from("salesRfq")
                            .insert({
                            rfqId: rfqId,
                            customerId: input.customerId,
                            customerContactId: input.customerContactId,
                            customerReference: input.customerReference,
                            rfqDate: (_b = input.rfqDate) !== null && _b !== void 0 ? _b : (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            expirationDate: input.expirationDate,
                            locationId: input.locationId,
                            salesPersonId: input.salesPersonId,
                            status: (_c = input.status) !== null && _c !== void 0 ? _c : "Draft",
                            internalNotes: (_d = input.notes) !== null && _d !== void 0 ? _d : null,
                            customFields: input.customFields,
                            opportunityId: opportunity.data.id,
                            companyId: input.companyId,
                            createdBy: input.createdBy,
                            updatedBy: input.createdBy
                        })
                            .select("id, rfqId")
                            .single()];
                case 5:
                    rfq = _e.sent();
                    if (rfq.error)
                        return [2 /*return*/, { data: null, error: rfq.error }];
                    return [2 /*return*/, { data: { id: rfq.data.id, rfqId: rfq.data.rfqId }, error: null }];
            }
        });
    });
}
function updateSalesRFQ(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, customerId, notes, updates, existingRfq;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = input.id, updatedBy = input.updatedBy, customerId = input.customerId, notes = input.notes, updates = __rest(input, ["id", "updatedBy", "customerId", "notes"]);
                    if (!customerId) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("salesRfq")
                            .select("opportunityId")
                            .eq("id", id)
                            .single()];
                case 1:
                    existingRfq = _b.sent();
                    if (!((_a = existingRfq.data) === null || _a === void 0 ? void 0 : _a.opportunityId)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .update({ customerId: customerId })
                            .eq("id", existingRfq.data.opportunityId)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/, client
                        .from("salesRfq")
                        .update(__assign(__assign(__assign(__assign({}, (0, supabase_1.sanitize)(updates)), (customerId && { customerId: customerId })), (notes !== undefined && { internalNotes: notes })), { updatedBy: updatedBy, updatedAt: new Date().toISOString() }))
                        .eq("id", id)
                        .select("id")
                        .single()];
            }
        });
    });
}
/** @deprecated Use insertSalesRFQ for new RFQs, updateSalesRFQ for existing RFQs */
function upsertSalesRFQ(client, rfq) {
    return __awaiter(this, void 0, void 0, function () {
        var opportunity, insert, existingRfq;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!("createdBy" in rfq)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .insert([{ companyId: rfq.companyId, customerId: rfq.customerId }])
                            .select("id")
                            .single()];
                case 1:
                    opportunity = _c.sent();
                    if (opportunity.error) {
                        return [2 /*return*/, opportunity];
                    }
                    return [4 /*yield*/, client
                            .from("salesRfq")
                            .insert([
                            __assign(__assign({}, rfq), { opportunityId: (_a = opportunity.data) === null || _a === void 0 ? void 0 : _a.id })
                        ])
                            .select("id, rfqId")];
                case 2:
                    insert = _c.sent();
                    if (insert.error) {
                        return [2 /*return*/, insert];
                    }
                    return [2 /*return*/, insert];
                case 3:
                    if (!rfq.customerId) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("salesRfq")
                            .select("opportunityId")
                            .eq("id", rfq.id)
                            .single()];
                case 4:
                    existingRfq = _c.sent();
                    if (!((_b = existingRfq.data) === null || _b === void 0 ? void 0 : _b.opportunityId)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .update({ customerId: rfq.customerId })
                            .eq("id", existingRfq.data.opportunityId)];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [2 /*return*/, client
                        .from("salesRfq")
                        .update(__assign(__assign({}, (0, supabase_1.sanitize)(rfq)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                        .eq("id", rfq.id)];
            }
        });
    });
}
function upsertSalesRFQLine(client, salesRfqLine) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, maxOrder;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!("createdBy" in salesRfqLine)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("salesRfqLine")
                            .select("order")
                            .eq("salesRfqId", salesRfqLine.salesRfqId)];
                case 1:
                    existing = _b.sent();
                    maxOrder = ((_a = existing.data) !== null && _a !== void 0 ? _a : []).reduce(function (max, row) { var _a; return Math.max(max, (_a = row.order) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [2 /*return*/, client
                            .from("salesRfqLine")
                            .insert([__assign(__assign({}, salesRfqLine), { order: maxOrder + 1 })])
                            .select("id")
                            .single()];
                case 2: return [2 /*return*/, client
                        .from("salesRfqLine")
                        .update((0, supabase_1.sanitize)(salesRfqLine))
                        .eq("id", salesRfqLine.id)
                        .select("id")
                        .single()];
            }
        });
    });
}
function updateSalesRFQLineOrder(db, updates) {
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
                                        .updateTable("salesRfqLine")
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
