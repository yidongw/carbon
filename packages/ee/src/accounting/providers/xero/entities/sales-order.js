"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.SalesOrderSyncer = void 0;
var types_1 = require("../../../core/types");
var utils_1 = require("../../../core/utils");
var models_1 = require("../models");
// Status mapping: Carbon -> Xero Quote
var CARBON_TO_XERO_STATUS = {
    Draft: "DRAFT",
    "Needs Approval": "DRAFT",
    Confirmed: "ACCEPTED",
    "In Progress": "ACCEPTED",
    "To Ship and Invoice": "ACCEPTED",
    "To Ship": "ACCEPTED",
    "To Invoice": "ACCEPTED",
    Completed: "ACCEPTED",
    Invoiced: "INVOICED",
    Cancelled: "DELETED",
    Closed: "ACCEPTED"
};
// Syncable statuses — only sync orders past Draft/Needs Approval/Cancelled
var SYNCABLE_STATUSES = [
    "Confirmed",
    "In Progress",
    "To Ship and Invoice",
    "To Ship",
    "To Invoice",
    "Completed",
    "Invoiced"
];
var SalesOrderSyncer = /** @class */ (function (_super) {
    __extends(SalesOrderSyncer, _super);
    function SalesOrderSyncer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =================================================================
    // 1. ID MAPPING - Uses default implementation from BaseEntitySyncer
    // =================================================================
    // =================================================================
    // 2. TIMESTAMP EXTRACTION
    // =================================================================
    SalesOrderSyncer.prototype.getRemoteUpdatedAt = function (remote) {
        if (!remote.UpdatedDateUTC)
            return null;
        return (0, models_1.parseDotnetDate)(remote.UpdatedDateUTC);
    };
    // =================================================================
    // 3. LOCAL FETCH (Single + Batch)
    // =================================================================
    SalesOrderSyncer.prototype.fetchLocal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var orders;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchOrdersByIds([id])];
                    case 1:
                        orders = _b.sent();
                        return [2 /*return*/, (_a = orders.get(id)) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    SalesOrderSyncer.prototype.fetchLocalBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetchOrdersByIds(ids)];
            });
        });
    };
    SalesOrderSyncer.prototype.fetchOrdersByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var orderRows, lineRows, linesByOrderId, _i, _a, line, existing, result, _b, _c, row, lines;
            var _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("salesOrder")
                                .select([
                                "salesOrder.id",
                                "salesOrder.salesOrderId",
                                "salesOrder.companyId",
                                "salesOrder.customerId",
                                "salesOrder.status",
                                "salesOrder.orderDate",
                                "salesOrder.currencyCode",
                                "salesOrder.exchangeRate",
                                "salesOrder.customerReference",
                                "salesOrder.updatedAt"
                            ])
                                .where("salesOrder.id", "in", ids)
                                .where("salesOrder.companyId", "=", this.companyId)
                                .execute()];
                    case 1:
                        orderRows = _g.sent();
                        if (orderRows.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("salesOrderLine")
                                .leftJoin("item", "item.id", "salesOrderLine.itemId")
                                .leftJoin("account", "account.id", "salesOrderLine.accountId")
                                .select([
                                "salesOrderLine.id",
                                "salesOrderLine.salesOrderId",
                                "salesOrderLine.salesOrderLineType",
                                "salesOrderLine.itemId",
                                "salesOrderLine.description",
                                "salesOrderLine.saleQuantity",
                                "salesOrderLine.unitPrice",
                                "salesOrderLine.setupPrice",
                                "item.readableIdWithRevision as itemReadableIdWithRevision",
                                "account.number as accountNumber"
                            ])
                                .where("salesOrderLine.salesOrderId", "in", orderRows.map(function (r) { return r.id; }))
                                .execute()];
                    case 2:
                        lineRows = _g.sent();
                        linesByOrderId = new Map();
                        for (_i = 0, _a = lineRows; _i < _a.length; _i++) {
                            line = _a[_i];
                            existing = (_d = linesByOrderId.get(line.salesOrderId)) !== null && _d !== void 0 ? _d : [];
                            existing.push(line);
                            linesByOrderId.set(line.salesOrderId, existing);
                        }
                        result = new Map();
                        for (_b = 0, _c = orderRows; _b < _c.length; _b++) {
                            row = _c[_b];
                            lines = (_e = linesByOrderId.get(row.id)) !== null && _e !== void 0 ? _e : [];
                            result.set(row.id, {
                                id: row.id,
                                salesOrderId: row.salesOrderId,
                                companyId: row.companyId,
                                customerId: row.customerId,
                                customerExternalId: null, // Will be resolved during mapToRemote
                                status: row.status,
                                orderDate: row.orderDate,
                                currencyCode: row.currencyCode,
                                exchangeRate: Number(row.exchangeRate) || 1,
                                customerReference: row.customerReference,
                                lines: lines.map(function (line) {
                                    var unitPrice = Number(line.unitPrice) || 0;
                                    var setupPrice = Number(line.setupPrice) || 0;
                                    var quantity = Number(line.saleQuantity) || 0;
                                    return {
                                        id: line.id,
                                        salesOrderLineType: line.salesOrderLineType,
                                        itemId: line.itemId,
                                        itemCode: line.itemReadableIdWithRevision,
                                        description: line.description,
                                        quantity: quantity,
                                        unitPrice: unitPrice,
                                        setupPrice: setupPrice,
                                        accountNumber: line.accountNumber,
                                        lineAmount: quantity * unitPrice + setupPrice
                                    };
                                }),
                                updatedAt: (_f = row.updatedAt) !== null && _f !== void 0 ? _f : new Date().toISOString(),
                                raw: row
                            });
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // =================================================================
    // 4. REMOTE FETCH (Single + Batch)
    // =================================================================
    SalesOrderSyncer.prototype.fetchRemote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.provider.request("GET", "/Quotes/".concat(id))];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, result.error ? null : ((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Quotes) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null)];
                }
            });
        });
    };
    SalesOrderSyncer.prototype.fetchRemoteBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, _i, _a, quote;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (ids.length === 0)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, this.provider.request("GET", "/Quotes?IDs=".concat(ids.join(",")))];
                    case 1:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("fetch quotes batch", response);
                        }
                        if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.Quotes) {
                            for (_i = 0, _a = response.data.Quotes; _i < _a.length; _i++) {
                                quote = _a[_i];
                                result.set(quote.QuoteID, quote);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // =================================================================
    // 5. TRANSFORMATION (Carbon -> Xero)
    // =================================================================
    SalesOrderSyncer.prototype.mapToRemote = function (local) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, customerRemoteId, lineItems, _i, _a, line, lineItem;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(local.id)];
                    case 1:
                        existingRemoteId = _f.sent();
                        return [4 /*yield*/, this.ensureDependencySynced("customer", local.customerId)];
                    case 2:
                        customerRemoteId = _f.sent();
                        lineItems = [];
                        _i = 0, _a = local.lines;
                        _f.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        line = _a[_i];
                        // Skip comment lines — they have no financial data
                        if (line.salesOrderLineType === "Comment") {
                            return [3 /*break*/, 6];
                        }
                        lineItem = {
                            Description: (_b = line.description) !== null && _b !== void 0 ? _b : undefined,
                            Quantity: line.quantity,
                            UnitAmount: line.unitPrice,
                            AccountCode: (_c = line.accountNumber) !== null && _c !== void 0 ? _c : undefined,
                            LineAmount: line.lineAmount
                        };
                        if (!line.itemId) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.ensureDependencySynced("item", line.itemId)];
                    case 4:
                        _f.sent();
                        if (line.itemCode) {
                            lineItem.ItemCode = line.itemCode.slice(0, 30);
                        }
                        _f.label = 5;
                    case 5:
                        lineItems.push(lineItem);
                        _f.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/, {
                            QuoteID: existingRemoteId,
                            QuoteNumber: local.salesOrderId,
                            Reference: (_d = local.customerReference) !== null && _d !== void 0 ? _d : undefined,
                            Contact: {
                                ContactID: customerRemoteId
                            },
                            Date: (_e = local.orderDate) !== null && _e !== void 0 ? _e : undefined,
                            Status: CARBON_TO_XERO_STATUS[local.status],
                            LineAmountTypes: "Exclusive",
                            LineItems: lineItems,
                            CurrencyCode: local.currencyCode,
                            CurrencyRate: local.exchangeRate !== 1 ? local.exchangeRate : undefined,
                            Title: "Sales Order ".concat(local.salesOrderId)
                        }];
                }
            });
        });
    };
    // =================================================================
    // 6. TRANSFORMATION (Xero -> Carbon) - Not supported (push-only)
    // =================================================================
    SalesOrderSyncer.prototype.mapToLocal = function (_remote) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Sales orders are push-only. Cannot map from Xero to Carbon.");
            });
        });
    };
    // =================================================================
    // 7. UPSERT LOCAL - Not supported (push-only)
    // =================================================================
    SalesOrderSyncer.prototype.upsertLocal = function (_tx, _data, _remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Sales orders are push-only. Cannot upsert locally from Xero.");
            });
        });
    };
    // =================================================================
    // 8. UPSERT REMOTE (Single + Batch)
    // =================================================================
    SalesOrderSyncer.prototype.upsertRemote = function (data, localId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, method, quotes, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(localId)];
                    case 1:
                        existingRemoteId = _d.sent();
                        method = existingRemoteId ? "POST" : "PUT";
                        quotes = existingRemoteId
                            ? [__assign(__assign({}, data), { QuoteID: existingRemoteId })]
                            : [data];
                        return [4 /*yield*/, this.provider.request(method, "/Quotes", { body: JSON.stringify({ Quotes: quotes }) })];
                    case 2:
                        result = _d.sent();
                        if (result.error) {
                            (0, utils_1.throwXeroApiError)(existingRemoteId
                                ? "update sales order quote"
                                : "create sales order quote", result);
                        }
                        if (!((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Quotes) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.QuoteID)) {
                            throw new Error("Xero API returned success but no QuoteID was returned");
                        }
                        return [2 /*return*/, result.data.Quotes[0].QuoteID];
                }
            });
        });
    };
    SalesOrderSyncer.prototype.upsertRemoteBatch = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, quotes, localIdOrder, _i, data_1, _a, localId, payload, existingRemoteId, response, i, returnedQuote, localId;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (data.length === 0)
                            return [2 /*return*/, result];
                        quotes = [];
                        localIdOrder = [];
                        _i = 0, data_1 = data;
                        _c.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        _a = data_1[_i], localId = _a.localId, payload = _a.payload;
                        return [4 /*yield*/, this.getRemoteId(localId)];
                    case 2:
                        existingRemoteId = _c.sent();
                        quotes.push(existingRemoteId
                            ? __assign(__assign({}, payload), { QuoteID: existingRemoteId })
                            : payload);
                        localIdOrder.push(localId);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.provider.request("POST", "/Quotes", { body: JSON.stringify({ Quotes: quotes }) })];
                    case 5:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("batch upsert sales order quotes", response);
                        }
                        if (!((_b = response.data) === null || _b === void 0 ? void 0 : _b.Quotes)) {
                            throw new Error("Xero API returned success but no Quotes array was returned");
                        }
                        for (i = 0; i < response.data.Quotes.length; i++) {
                            returnedQuote = response.data.Quotes[i];
                            localId = localIdOrder[i];
                            if ((returnedQuote === null || returnedQuote === void 0 ? void 0 : returnedQuote.QuoteID) && localId) {
                                result.set(localId, returnedQuote.QuoteID);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // =================================================================
    // 9. SHOULD SYNC: Only sync orders past Draft/Needs Approval
    // =================================================================
    SalesOrderSyncer.prototype.shouldSync = function (context) {
        if (context.direction === "push" && context.localEntity) {
            if (!SYNCABLE_STATUSES.includes(context.localEntity.status)) {
                return "Sales order must be confirmed before syncing (current status: ".concat(context.localEntity.status, ")");
            }
        }
        return true;
    };
    return SalesOrderSyncer;
}(types_1.BaseEntitySyncer));
exports.SalesOrderSyncer = SalesOrderSyncer;
