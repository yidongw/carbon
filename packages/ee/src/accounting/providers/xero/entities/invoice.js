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
exports.SalesInvoiceSyncer = void 0;
var external_mapping_1 = require("../../../core/external-mapping");
var types_1 = require("../../../core/types");
var utils_1 = require("../../../core/utils");
var models_1 = require("../models");
// Status mapping: Carbon -> Xero
var CARBON_TO_XERO_STATUS = {
    Draft: "DRAFT",
    Pending: "SUBMITTED",
    Submitted: "AUTHORISED",
    "Partially Paid": "AUTHORISED",
    Paid: "PAID",
    Overdue: "AUTHORISED",
    Voided: "VOIDED",
    "Credit Note Issued": "AUTHORISED",
    Return: "AUTHORISED"
};
// Status mapping: Xero -> Carbon
var XERO_TO_CARBON_STATUS = {
    DRAFT: "Draft",
    SUBMITTED: "Pending",
    AUTHORISED: "Submitted",
    PAID: "Paid",
    VOIDED: "Voided",
    DELETED: "Voided"
};
// Syncable statuses (we only push posted invoices to Xero, not drafts)
var SYNCABLE_STATUSES = [
    "Pending",
    "Submitted",
    "Partially Paid",
    "Paid",
    "Overdue"
];
var SalesInvoiceSyncer = /** @class */ (function (_super) {
    __extends(SalesInvoiceSyncer, _super);
    function SalesInvoiceSyncer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =================================================================
    // 1. ID MAPPING - Uses default implementation from BaseEntitySyncer
    // The entityType "invoice" maps to the salesInvoice table
    // =================================================================
    SalesInvoiceSyncer.prototype.linkEntities = function (tx, localId, remoteId, remoteUpdatedAt) {
        return __awaiter(this, void 0, void 0, function () {
            var txMappingService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txMappingService = (0, external_mapping_1.createMappingService)(tx, this.companyId);
                        return [4 /*yield*/, txMappingService.link("invoice", localId, this.provider.id, remoteId, {
                                remoteUpdatedAt: remoteUpdatedAt
                            })];
                    case 1:
                        _a.sent();
                        // Also update updatedAt on salesInvoice
                        return [4 /*yield*/, tx
                                .updateTable("salesInvoice")
                                .set({
                                updatedAt: new Date().toISOString()
                            })
                                .where("id", "=", localId)
                                .execute()];
                    case 2:
                        // Also update updatedAt on salesInvoice
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // =================================================================
    // 2. TIMESTAMP EXTRACTION
    // =================================================================
    SalesInvoiceSyncer.prototype.getRemoteUpdatedAt = function (remote) {
        if (!remote.UpdatedDateUTC)
            return null;
        return (0, models_1.parseDotnetDate)(remote.UpdatedDateUTC);
    };
    // =================================================================
    // 3. LOCAL FETCH (Single + Batch)
    // =================================================================
    SalesInvoiceSyncer.prototype.fetchLocal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var invoices;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchInvoicesByIds([id])];
                    case 1:
                        invoices = _b.sent();
                        return [2 /*return*/, (_a = invoices.get(id)) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    SalesInvoiceSyncer.prototype.fetchLocalBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetchInvoicesByIds(ids)];
            });
        });
    };
    SalesInvoiceSyncer.prototype.fetchInvoicesByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var invoiceRows, lineRows, linesByInvoiceId, _i, _a, line, existing, result, _b, _c, row, lines;
            var _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("salesInvoice")
                                .select([
                                "salesInvoice.id",
                                "salesInvoice.invoiceId",
                                "salesInvoice.companyId",
                                "salesInvoice.customerId",
                                "salesInvoice.status",
                                "salesInvoice.currencyCode",
                                "salesInvoice.exchangeRate",
                                "salesInvoice.dateIssued",
                                "salesInvoice.dateDue",
                                "salesInvoice.datePaid",
                                "salesInvoice.customerReference",
                                "salesInvoice.subtotal",
                                "salesInvoice.totalTax",
                                "salesInvoice.totalDiscount",
                                "salesInvoice.totalAmount",
                                "salesInvoice.balance",
                                "salesInvoice.updatedAt"
                            ])
                                .where("salesInvoice.id", "in", ids)
                                .where("salesInvoice.companyId", "=", this.companyId)
                                .execute()];
                    case 1:
                        invoiceRows = _g.sent();
                        if (invoiceRows.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("salesInvoiceLine")
                                .leftJoin("item", "item.id", "salesInvoiceLine.itemId")
                                .select([
                                "salesInvoiceLine.id",
                                "salesInvoiceLine.invoiceId",
                                "salesInvoiceLine.invoiceLineType",
                                "salesInvoiceLine.itemId",
                                "salesInvoiceLine.description",
                                "salesInvoiceLine.quantity",
                                "salesInvoiceLine.unitPrice",
                                "salesInvoiceLine.taxPercent",
                                "item.readableIdWithRevision as itemReadableIdWithRevision"
                            ])
                                .where("salesInvoiceLine.invoiceId", "in", invoiceRows.map(function (r) { return r.id; }))
                                .execute()];
                    case 2:
                        lineRows = _g.sent();
                        linesByInvoiceId = new Map();
                        for (_i = 0, _a = lineRows; _i < _a.length; _i++) {
                            line = _a[_i];
                            existing = (_d = linesByInvoiceId.get(line.invoiceId)) !== null && _d !== void 0 ? _d : [];
                            existing.push(line);
                            linesByInvoiceId.set(line.invoiceId, existing);
                        }
                        result = new Map();
                        for (_b = 0, _c = invoiceRows; _b < _c.length; _b++) {
                            row = _c[_b];
                            lines = (_e = linesByInvoiceId.get(row.id)) !== null && _e !== void 0 ? _e : [];
                            result.set(row.id, {
                                id: row.id,
                                invoiceId: row.invoiceId,
                                companyId: row.companyId,
                                customerId: row.customerId,
                                customerExternalId: null, // Will be resolved during mapToRemote
                                status: row.status,
                                currencyCode: row.currencyCode,
                                exchangeRate: Number(row.exchangeRate) || 1,
                                dateIssued: row.dateIssued,
                                dateDue: row.dateDue,
                                datePaid: row.datePaid,
                                customerReference: row.customerReference,
                                subtotal: Number(row.subtotal) || 0,
                                totalTax: Number(row.totalTax) || 0,
                                totalDiscount: Number(row.totalDiscount) || 0,
                                totalAmount: Number(row.totalAmount) || 0,
                                balance: Number(row.balance) || 0,
                                lines: lines.map(function (line) {
                                    var quantity = Number(line.quantity) || 0;
                                    var unitPrice = Number(line.unitPrice) || 0;
                                    var taxPercent = Number(line.taxPercent) || 0;
                                    return {
                                        id: line.id,
                                        invoiceLineType: line.invoiceLineType,
                                        itemId: line.itemId,
                                        itemCode: line.itemReadableIdWithRevision,
                                        description: line.description,
                                        quantity: quantity,
                                        unitPrice: unitPrice,
                                        taxPercent: taxPercent,
                                        lineAmount: quantity * unitPrice
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
    // 4. REMOTE FETCH (Single + Batch) - API calls within syncer
    // =================================================================
    SalesInvoiceSyncer.prototype.fetchRemote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.provider.request("GET", "/Invoices/".concat(id))];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, result.error ? null : ((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Invoices) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null)];
                }
            });
        });
    };
    SalesInvoiceSyncer.prototype.fetchRemoteBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, _i, _a, invoice;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (ids.length === 0)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, this.provider.request("GET", "/Invoices?IDs=".concat(ids.join(",")))];
                    case 1:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("fetch invoices batch", response);
                        }
                        if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.Invoices) {
                            for (_i = 0, _a = response.data.Invoices; _i < _a.length; _i++) {
                                invoice = _a[_i];
                                result.set(invoice.InvoiceID, invoice);
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
    SalesInvoiceSyncer.prototype.mapToRemote = function (local) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, customerRemoteId, xeroProvider, defaultAccountCode, lineItems, _i, _a, line, taxAmount, lineItem, dueDate, issued, now;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(local.id)];
                    case 1:
                        existingRemoteId = _f.sent();
                        return [4 /*yield*/, this.ensureDependencySynced("customer", local.customerId)];
                    case 2:
                        customerRemoteId = _f.sent();
                        xeroProvider = this.provider;
                        defaultAccountCode = (_b = xeroProvider.settings) === null || _b === void 0 ? void 0 : _b.defaultSalesAccountCode;
                        console.log("[SalesInvoiceSyncer] Provider settings:", xeroProvider.settings);
                        console.log("[SalesInvoiceSyncer] Default sales account code:", defaultAccountCode);
                        lineItems = [];
                        _i = 0, _a = local.lines;
                        _f.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        line = _a[_i];
                        taxAmount = (line.quantity * line.unitPrice * line.taxPercent) / 100;
                        lineItem = {
                            Description: (_c = line.description) !== null && _c !== void 0 ? _c : undefined,
                            Quantity: line.quantity,
                            UnitAmount: line.unitPrice,
                            TaxAmount: taxAmount,
                            LineAmount: line.quantity * line.unitPrice,
                            // Use default account code from settings if no account specified
                            AccountCode: defaultAccountCode,
                            // TaxType is required by Xero: OUTPUT for sales tax, NONE for zero tax
                            TaxType: line.taxPercent > 0 ? "OUTPUT" : "NONE"
                        };
                        if (!line.itemId) return [3 /*break*/, 5];
                        // Ensure item is synced
                        return [4 /*yield*/, this.ensureDependencySynced("item", line.itemId)];
                    case 4:
                        // Ensure item is synced
                        _f.sent();
                        // Use the item code from Carbon (readableIdWithRevision)
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
                    case 7:
                        dueDate = local.dateDue;
                        if (!dueDate && local.dateIssued) {
                            issued = new Date(local.dateIssued);
                            issued.setDate(issued.getDate() + 30);
                            dueDate = issued.toISOString().split("T")[0]; // YYYY-MM-DD format
                        }
                        else if (!dueDate) {
                            now = new Date();
                            now.setDate(now.getDate() + 30);
                            dueDate = now.toISOString().split("T")[0];
                        }
                        return [2 /*return*/, {
                                InvoiceID: existingRemoteId,
                                Type: "ACCREC", // Accounts Receivable = Sales Invoice
                                InvoiceNumber: local.invoiceId,
                                Reference: (_d = local.customerReference) !== null && _d !== void 0 ? _d : undefined,
                                Contact: {
                                    ContactID: customerRemoteId
                                },
                                Date: (_e = local.dateIssued) !== null && _e !== void 0 ? _e : undefined,
                                DueDate: dueDate,
                                Status: CARBON_TO_XERO_STATUS[local.status],
                                LineAmountTypes: "Exclusive", // Tax is calculated separately
                                LineItems: lineItems,
                                SubTotal: local.subtotal,
                                TotalTax: local.totalTax,
                                Total: local.totalAmount,
                                AmountDue: local.balance,
                                AmountPaid: local.totalAmount - local.balance,
                                CurrencyCode: local.currencyCode,
                                CurrencyRate: local.exchangeRate !== 1 ? local.exchangeRate : undefined
                            }];
                }
            });
        });
    };
    // =================================================================
    // 6. TRANSFORMATION (Xero -> Carbon) - Update only
    // =================================================================
    SalesInvoiceSyncer.prototype.mapToLocal = function (remote) {
        return __awaiter(this, void 0, void 0, function () {
            var lines;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                lines = ((_a = remote.LineItems) !== null && _a !== void 0 ? _a : []).map(function (line, index) {
                    var _a, _b, _c, _d, _e, _f, _g;
                    return ({
                        id: (_a = line.LineItemID) !== null && _a !== void 0 ? _a : "line-".concat(index),
                        invoiceLineType: "Part", // Default, will be matched with existing lines
                        itemId: null, // Will be resolved by looking up ItemCode
                        itemCode: (_b = line.ItemCode) !== null && _b !== void 0 ? _b : null,
                        description: (_c = line.Description) !== null && _c !== void 0 ? _c : null,
                        quantity: (_d = line.Quantity) !== null && _d !== void 0 ? _d : 0,
                        unitPrice: (_e = line.UnitAmount) !== null && _e !== void 0 ? _e : 0,
                        taxPercent: line.TaxAmount
                            ? (line.TaxAmount / ((_f = line.LineAmount) !== null && _f !== void 0 ? _f : 1)) * 100 || 0
                            : 0,
                        lineAmount: (_g = line.LineAmount) !== null && _g !== void 0 ? _g : 0
                    });
                });
                return [2 /*return*/, {
                        status: XERO_TO_CARBON_STATUS[remote.Status],
                        dateIssued: (_b = remote.Date) !== null && _b !== void 0 ? _b : null,
                        dateDue: (_c = remote.DueDate) !== null && _c !== void 0 ? _c : null,
                        customerReference: (_d = remote.Reference) !== null && _d !== void 0 ? _d : null,
                        subtotal: (_e = remote.SubTotal) !== null && _e !== void 0 ? _e : 0,
                        totalTax: (_f = remote.TotalTax) !== null && _f !== void 0 ? _f : 0,
                        totalAmount: (_g = remote.Total) !== null && _g !== void 0 ? _g : 0,
                        balance: (_h = remote.AmountDue) !== null && _h !== void 0 ? _h : 0,
                        currencyCode: (_j = remote.CurrencyCode) !== null && _j !== void 0 ? _j : "USD",
                        exchangeRate: (_k = remote.CurrencyRate) !== null && _k !== void 0 ? _k : 1,
                        lines: lines
                    }];
            });
        });
    };
    // =================================================================
    // 7. UPSERT LOCAL (Update existing only - Carbon is source of truth)
    // =================================================================
    SalesInvoiceSyncer.prototype.upsertLocal = function (tx, data, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingLocalId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLocalId(remoteId)];
                    case 1:
                        existingLocalId = _a.sent();
                        if (!existingLocalId) {
                            throw new Error("Cannot create new invoices from Xero. Invoice with remote ID ".concat(remoteId, " not found locally."));
                        }
                        // Update invoice header (mapping is handled by linkEntities in base class)
                        return [4 /*yield*/, tx
                                .updateTable("salesInvoice")
                                .set({
                                status: data.status,
                                dateIssued: data.dateIssued,
                                dateDue: data.dateDue,
                                customerReference: data.customerReference,
                                subtotal: data.subtotal,
                                totalTax: data.totalTax,
                                totalAmount: data.totalAmount,
                                balance: data.balance,
                                currencyCode: data.currencyCode,
                                exchangeRate: data.exchangeRate,
                                updatedAt: new Date().toISOString()
                            })
                                .where("id", "=", existingLocalId)
                                .execute()];
                    case 2:
                        // Update invoice header (mapping is handled by linkEntities in base class)
                        _a.sent();
                        // Note: We don't update line items from Xero to preserve Carbon's line structure
                        // Lines are only updated from Carbon -> Xero direction
                        return [2 /*return*/, existingLocalId];
                }
            });
        });
    };
    // =================================================================
    // 8. UPSERT REMOTE (Single + Batch) - API calls within syncer
    // =================================================================
    SalesInvoiceSyncer.prototype.upsertRemote = function (data, localId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, invoices, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(localId)];
                    case 1:
                        existingRemoteId = _d.sent();
                        invoices = existingRemoteId
                            ? [__assign(__assign({}, data), { InvoiceID: existingRemoteId })]
                            : [data];
                        return [4 /*yield*/, this.provider.request("POST", "/Invoices", { body: JSON.stringify({ Invoices: invoices }) })];
                    case 2:
                        result = _d.sent();
                        if (result.error) {
                            (0, utils_1.throwXeroApiError)(existingRemoteId ? "update invoice" : "create invoice", result);
                        }
                        if (!((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Invoices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.InvoiceID)) {
                            throw new Error("Xero API returned success but no InvoiceID was returned");
                        }
                        return [2 /*return*/, result.data.Invoices[0].InvoiceID];
                }
            });
        });
    };
    SalesInvoiceSyncer.prototype.upsertRemoteBatch = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, invoices, localIdOrder, _i, data_1, _a, localId, payload, existingRemoteId, response, i, returnedInvoice, localId;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (data.length === 0)
                            return [2 /*return*/, result];
                        invoices = [];
                        localIdOrder = [];
                        _i = 0, data_1 = data;
                        _c.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        _a = data_1[_i], localId = _a.localId, payload = _a.payload;
                        return [4 /*yield*/, this.getRemoteId(localId)];
                    case 2:
                        existingRemoteId = _c.sent();
                        invoices.push(existingRemoteId
                            ? __assign(__assign({}, payload), { InvoiceID: existingRemoteId })
                            : payload);
                        localIdOrder.push(localId);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.provider.request("POST", "/Invoices", { body: JSON.stringify({ Invoices: invoices }) })];
                    case 5:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("batch upsert invoices", response);
                        }
                        if (!((_b = response.data) === null || _b === void 0 ? void 0 : _b.Invoices)) {
                            throw new Error("Xero API returned success but no Invoices array was returned");
                        }
                        for (i = 0; i < response.data.Invoices.length; i++) {
                            returnedInvoice = response.data.Invoices[i];
                            localId = localIdOrder[i];
                            if ((returnedInvoice === null || returnedInvoice === void 0 ? void 0 : returnedInvoice.InvoiceID) && localId) {
                                result.set(localId, returnedInvoice.InvoiceID);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // =================================================================
    // 9. SHOULD SYNC: Business logic for sync eligibility
    // =================================================================
    /**
     * Determine if an invoice should be synced based on its status.
     * Only invoices with syncable statuses (not Draft or Cancelled) are synced.
     */
    SalesInvoiceSyncer.prototype.shouldSync = function (context) {
        // For push operations, check the local entity status
        if (context.direction === "push" && context.localEntity) {
            if (!SYNCABLE_STATUSES.includes(context.localEntity.status)) {
                return "Invoice must be posted before syncing (current status: ".concat(context.localEntity.status, ")");
            }
        }
        return true;
    };
    return SalesInvoiceSyncer;
}(types_1.BaseEntitySyncer));
exports.SalesInvoiceSyncer = SalesInvoiceSyncer;
