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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.BillSyncer = void 0;
var kysely_1 = require("kysely");
var external_mapping_1 = require("../../../core/external-mapping");
var types_1 = require("../../../core/types");
var utils_1 = require("../../../core/utils");
var models_1 = require("../models");
// Status mapping between Carbon and Xero
var CARBON_TO_XERO_STATUS = {
    Draft: "DRAFT",
    Pending: "SUBMITTED",
    Open: "AUTHORISED",
    Return: "DRAFT", // No direct equivalent, map to DRAFT
    "Debit Note Issued": "AUTHORISED",
    Paid: "PAID",
    "Partially Paid": "AUTHORISED", // Xero tracks partial payment via AmountDue
    Overdue: "AUTHORISED", // Xero doesn't have overdue status
    Voided: "VOIDED"
};
var XERO_TO_CARBON_STATUS = {
    DRAFT: "Draft",
    SUBMITTED: "Pending",
    AUTHORISED: "Open",
    PAID: "Paid",
    VOIDED: "Voided",
    DELETED: "Voided"
};
var BillSyncer = /** @class */ (function (_super) {
    __extends(BillSyncer, _super);
    function BillSyncer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =================================================================
    // 1. ID MAPPING - Uses default implementation from BaseEntitySyncer
    // The entityType "bill" maps to the purchaseInvoice table
    // =================================================================
    BillSyncer.prototype.linkEntities = function (tx, localId, remoteId, remoteUpdatedAt) {
        return __awaiter(this, void 0, void 0, function () {
            var txMappingService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txMappingService = (0, external_mapping_1.createMappingService)(tx, this.companyId);
                        return [4 /*yield*/, txMappingService.link("bill", localId, this.provider.id, remoteId, {
                                remoteUpdatedAt: remoteUpdatedAt
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // =================================================================
    // 2. TIMESTAMP EXTRACTION
    // =================================================================
    BillSyncer.prototype.getRemoteUpdatedAt = function (remote) {
        if (!remote.UpdatedDateUTC)
            return null;
        return (0, models_1.parseDotnetDate)(remote.UpdatedDateUTC);
    };
    // =================================================================
    // 3. LOCAL FETCH (Single + Batch)
    // =================================================================
    BillSyncer.prototype.fetchLocal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var bills;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchBillsByIds([id])];
                    case 1:
                        bills = _b.sent();
                        return [2 /*return*/, (_a = bills.get(id)) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    BillSyncer.prototype.fetchLocalBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (ids.length === 0)
                    return [2 /*return*/, new Map()];
                return [2 /*return*/, this.fetchBillsByIds(ids)];
            });
        });
    };
    BillSyncer.prototype.fetchBillsByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var billRows, billIds, lineRows, supplierIds, supplierExternalIds, mappingService, _i, supplierIds_1, supplierId, externalId, linesByInvoice, _a, lineRows_1, line, existing, result, _b, billRows_1, row, lines;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("purchaseInvoice")
                                .select([
                                "id",
                                "companyId",
                                "invoiceId",
                                "supplierId",
                                "status",
                                "dateIssued",
                                "dateDue",
                                "datePaid",
                                "currencyCode",
                                "exchangeRate",
                                "subtotal",
                                "totalTax",
                                "totalDiscount",
                                "totalAmount",
                                "balance",
                                "supplierReference",
                                "updatedAt",
                                "customFields"
                            ])
                                .where("id", "in", ids)
                                .where("companyId", "=", this.companyId)
                                .execute()];
                    case 1:
                        billRows = _g.sent();
                        if (billRows.length === 0)
                            return [2 /*return*/, new Map()];
                        billIds = billRows.map(function (b) { return b.id; });
                        return [4 /*yield*/, this.database
                                .selectFrom("purchaseInvoiceLine")
                                .leftJoin("item", "item.id", "purchaseInvoiceLine.itemId")
                                .leftJoin("account", "account.id", "purchaseInvoiceLine.accountId")
                                .select([
                                "purchaseInvoiceLine.id",
                                "purchaseInvoiceLine.invoiceId",
                                "purchaseInvoiceLine.description",
                                "purchaseInvoiceLine.quantity",
                                "purchaseInvoiceLine.unitPrice",
                                "purchaseInvoiceLine.itemId",
                                "purchaseInvoiceLine.taxPercent",
                                "purchaseInvoiceLine.taxAmount",
                                "purchaseInvoiceLine.totalAmount",
                                "purchaseInvoiceLine.purchaseOrderLineId",
                                "item.readableId as itemCode",
                                "account.number as accountNumber"
                            ])
                                .where("purchaseInvoiceLine.invoiceId", "in", billIds)
                                .execute()];
                    case 2:
                        lineRows = _g.sent();
                        supplierIds = billRows
                            .map(function (b) { return b.supplierId; })
                            .filter(function (id) { return id !== null; });
                        supplierExternalIds = new Map();
                        if (!(supplierIds.length > 0)) return [3 /*break*/, 6];
                        mappingService = (0, external_mapping_1.createMappingService)(this.database, this.companyId);
                        _i = 0, supplierIds_1 = supplierIds;
                        _g.label = 3;
                    case 3:
                        if (!(_i < supplierIds_1.length)) return [3 /*break*/, 6];
                        supplierId = supplierIds_1[_i];
                        return [4 /*yield*/, mappingService.getExternalId("supplier", supplierId, this.provider.id)];
                    case 4:
                        externalId = _g.sent();
                        supplierExternalIds.set(supplierId, externalId);
                        _g.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        linesByInvoice = new Map();
                        for (_a = 0, lineRows_1 = lineRows; _a < lineRows_1.length; _a++) {
                            line = lineRows_1[_a];
                            existing = (_c = linesByInvoice.get(line.invoiceId)) !== null && _c !== void 0 ? _c : [];
                            existing.push(line);
                            linesByInvoice.set(line.invoiceId, existing);
                        }
                        result = new Map();
                        for (_b = 0, billRows_1 = billRows; _b < billRows_1.length; _b++) {
                            row = billRows_1[_b];
                            lines = (_d = linesByInvoice.get(row.id)) !== null && _d !== void 0 ? _d : [];
                            result.set(row.id, {
                                id: row.id,
                                companyId: row.companyId,
                                invoiceId: row.invoiceId,
                                supplierId: row.supplierId,
                                supplierExternalId: row.supplierId
                                    ? ((_e = supplierExternalIds.get(row.supplierId)) !== null && _e !== void 0 ? _e : null)
                                    : null,
                                status: row.status,
                                dateIssued: row.dateIssued,
                                dateDue: row.dateDue,
                                datePaid: row.datePaid,
                                currencyCode: row.currencyCode,
                                exchangeRate: Number(row.exchangeRate) || 1,
                                subtotal: Number(row.subtotal) || 0,
                                totalTax: Number(row.totalTax) || 0,
                                totalDiscount: Number(row.totalDiscount) || 0,
                                totalAmount: Number(row.totalAmount) || 0,
                                balance: Number(row.balance) || 0,
                                supplierReference: row.supplierReference,
                                lines: lines.map(function (line) { return ({
                                    id: line.id,
                                    description: line.description,
                                    quantity: Number(line.quantity) || 0,
                                    unitPrice: Number(line.unitPrice) || 0,
                                    itemId: line.itemId,
                                    itemCode: line.itemCode,
                                    accountNumber: line.accountNumber,
                                    taxPercent: line.taxPercent != null ? Number(line.taxPercent) : null,
                                    taxAmount: line.taxAmount != null ? Number(line.taxAmount) : null,
                                    totalAmount: Number(line.totalAmount) || 0,
                                    purchaseOrderLineId: line.purchaseOrderLineId
                                }); }),
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
    BillSyncer.prototype.fetchRemote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, data, invoice;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.provider.request("GET", "/Invoices/".concat(id))];
                    case 1:
                        result = _b.sent();
                        if (result.error)
                            return [2 /*return*/, null];
                        data = result.data;
                        invoice = (_a = data === null || data === void 0 ? void 0 : data.Invoices) === null || _a === void 0 ? void 0 : _a[0];
                        // Only return if it's a Bill (ACCPAY)
                        if (!invoice || invoice.Type !== "ACCPAY") {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, invoice];
                }
            });
        });
    };
    BillSyncer.prototype.fetchRemoteBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, data, _i, _a, invoice;
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
                            (0, utils_1.throwXeroApiError)("fetch bills batch", response);
                        }
                        data = response.data;
                        for (_i = 0, _a = (_b = data === null || data === void 0 ? void 0 : data.Invoices) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                            invoice = _a[_i];
                            // Only include Bills (ACCPAY)
                            if (invoice.Type === "ACCPAY") {
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
    BillSyncer.prototype.mapToRemote = function (local) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, contactId, xeroProvider, defaultAccountCode, lineItems, dueDate, issued, now;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(local.id)];
                    case 1:
                        existingRemoteId = _d.sent();
                        contactId = local.supplierExternalId;
                        if (!(!contactId && local.supplierId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.ensureDependencySynced("vendor", local.supplierId)];
                    case 2:
                        contactId = _d.sent();
                        _d.label = 3;
                    case 3:
                        if (!contactId) {
                            throw new Error("Cannot sync bill ".concat(local.id, ": No supplier linked or supplier not synced to Xero"));
                        }
                        xeroProvider = this.provider;
                        defaultAccountCode = (_a = xeroProvider.settings) === null || _a === void 0 ? void 0 : _a.defaultPurchaseAccountCode;
                        return [4 /*yield*/, Promise.all(local.lines.map(function (line) { return __awaiter(_this, void 0, void 0, function () {
                                var itemCode, item, description, ref, hasTax;
                                var _a, _b, _c, _d, _e;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0:
                                            itemCode = line.itemCode;
                                            if (!(!itemCode && line.itemId)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.database
                                                    .selectFrom("item")
                                                    .select("readableId")
                                                    .where("id", "=", line.itemId)
                                                    .executeTakeFirst()];
                                        case 1:
                                            item = _f.sent();
                                            itemCode = (_a = item === null || item === void 0 ? void 0 : item.readableId) !== null && _a !== void 0 ? _a : null;
                                            _f.label = 2;
                                        case 2:
                                            description = (_b = line.description) !== null && _b !== void 0 ? _b : undefined;
                                            if (line.purchaseOrderLineId) {
                                                ref = "[ref:".concat(line.purchaseOrderLineId, "]");
                                                description = description ? "".concat(description, " ").concat(ref) : ref;
                                            }
                                            hasTax = (line.taxPercent != null && line.taxPercent > 0) ||
                                                (line.taxAmount != null && line.taxAmount > 0);
                                            return [2 /*return*/, {
                                                    Description: description,
                                                    Quantity: line.quantity,
                                                    UnitAmount: line.unitPrice,
                                                    ItemCode: (_c = itemCode === null || itemCode === void 0 ? void 0 : itemCode.slice(0, 30)) !== null && _c !== void 0 ? _c : undefined,
                                                    // Use line's account number if specified, otherwise use default from settings
                                                    AccountCode: (_d = line.accountNumber) !== null && _d !== void 0 ? _d : defaultAccountCode,
                                                    TaxAmount: (_e = line.taxAmount) !== null && _e !== void 0 ? _e : undefined,
                                                    LineAmount: line.totalAmount,
                                                    // TaxType is required by Xero: INPUT for purchase tax, NONE for zero tax
                                                    TaxType: hasTax ? "INPUT" : "NONE"
                                                }];
                                    }
                                });
                            }); }))];
                    case 4:
                        lineItems = _d.sent();
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
                                Type: "ACCPAY",
                                InvoiceNumber: local.invoiceId,
                                Reference: (_b = local.supplierReference) !== null && _b !== void 0 ? _b : undefined,
                                Contact: { ContactID: contactId },
                                Date: (_c = local.dateIssued) !== null && _c !== void 0 ? _c : undefined,
                                DueDate: dueDate,
                                Status: CARBON_TO_XERO_STATUS[local.status],
                                CurrencyCode: local.currencyCode,
                                CurrencyRate: local.exchangeRate !== 1 ? local.exchangeRate : undefined,
                                LineItems: lineItems,
                                SubTotal: local.subtotal,
                                TotalTax: local.totalTax,
                                Total: local.totalAmount
                            }];
                }
            });
        });
    };
    // =================================================================
    // 6. TRANSFORMATION (Xero -> Carbon)
    // =================================================================
    BillSyncer.prototype.mapToLocal = function (remote) {
        return __awaiter(this, void 0, void 0, function () {
            var status, lines;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                status = XERO_TO_CARBON_STATUS[remote.Status];
                // Check for partial payment
                if (remote.Status === "AUTHORISED" &&
                    remote.AmountPaid &&
                    remote.AmountPaid > 0 &&
                    remote.AmountDue &&
                    remote.AmountDue > 0) {
                    status = "Partially Paid";
                }
                // Check for overdue (would need to compare DueDate with current date)
                if (remote.Status === "AUTHORISED" &&
                    remote.DueDate &&
                    new Date(remote.DueDate) < new Date()) {
                    status = "Overdue";
                }
                lines = ((_a = remote.LineItems) !== null && _a !== void 0 ? _a : []).map(function (line, index) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                    // Extract [ref:<id>] from description if present
                    var refMatch = (_a = line.Description) === null || _a === void 0 ? void 0 : _a.match(/\s*\[ref:([^\]]+)\]$/);
                    var purchaseOrderLineId = (_b = refMatch === null || refMatch === void 0 ? void 0 : refMatch[1]) !== null && _b !== void 0 ? _b : null;
                    var description = (_d = (_c = line.Description) === null || _c === void 0 ? void 0 : _c.replace(/\s*\[ref:[^\]]+\]$/, "")) !== null && _d !== void 0 ? _d : null;
                    return {
                        id: (_e = line.LineItemID) !== null && _e !== void 0 ? _e : "temp-".concat(index),
                        description: description,
                        quantity: (_f = line.Quantity) !== null && _f !== void 0 ? _f : 1,
                        unitPrice: (_g = line.UnitAmount) !== null && _g !== void 0 ? _g : 0,
                        itemId: null, // Will be resolved during upsertLocal if ItemCode matches
                        itemCode: (_h = line.ItemCode) !== null && _h !== void 0 ? _h : null,
                        accountNumber: (_j = line.AccountCode) !== null && _j !== void 0 ? _j : null,
                        taxPercent: null,
                        taxAmount: (_k = line.TaxAmount) !== null && _k !== void 0 ? _k : null,
                        totalAmount: (_l = line.LineAmount) !== null && _l !== void 0 ? _l : 0,
                        purchaseOrderLineId: purchaseOrderLineId
                    };
                });
                return [2 /*return*/, {
                        invoiceId: (_b = remote.InvoiceNumber) !== null && _b !== void 0 ? _b : remote.InvoiceID,
                        supplierExternalId: remote.Contact.ContactID,
                        status: status,
                        dateIssued: (_c = remote.Date) !== null && _c !== void 0 ? _c : null,
                        dateDue: (_d = remote.DueDate) !== null && _d !== void 0 ? _d : null,
                        datePaid: remote.Status === "PAID" ? new Date().toISOString() : null,
                        currencyCode: (_e = remote.CurrencyCode) !== null && _e !== void 0 ? _e : "USD",
                        exchangeRate: (_f = remote.CurrencyRate) !== null && _f !== void 0 ? _f : 1,
                        subtotal: (_g = remote.SubTotal) !== null && _g !== void 0 ? _g : 0,
                        totalTax: (_h = remote.TotalTax) !== null && _h !== void 0 ? _h : 0,
                        totalDiscount: 0,
                        totalAmount: (_j = remote.Total) !== null && _j !== void 0 ? _j : 0,
                        balance: (_k = remote.AmountDue) !== null && _k !== void 0 ? _k : 0,
                        supplierReference: (_l = remote.Reference) !== null && _l !== void 0 ? _l : null,
                        lines: lines,
                        updatedAt: remote.UpdatedDateUTC
                            ? (0, models_1.parseDotnetDate)(remote.UpdatedDateUTC).toISOString()
                            : new Date().toISOString()
                    }];
            });
        });
    };
    // =================================================================
    // 7. UPSERT LOCAL
    // =================================================================
    BillSyncer.prototype.upsertLocal = function (tx, data, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingLocalId, supplierId, txMappingService, defaultUser, supplierInteraction, sequenceResult, invoiceId, newInvoice;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0: return [4 /*yield*/, this.getLocalId(remoteId)];
                    case 1:
                        existingLocalId = _t.sent();
                        supplierId = null;
                        if (!data.supplierExternalId) return [3 /*break*/, 3];
                        txMappingService = (0, external_mapping_1.createMappingService)(tx, this.companyId);
                        return [4 /*yield*/, txMappingService.getEntityId(this.provider.id, data.supplierExternalId, "supplier")];
                    case 2:
                        supplierId = _t.sent();
                        _t.label = 3;
                    case 3:
                        if (!existingLocalId) return [3 /*break*/, 6];
                        // Update existing purchase invoice (mapping is handled by linkEntities in base class)
                        return [4 /*yield*/, tx
                                .updateTable("purchaseInvoice")
                                .set({
                                supplierId: supplierId,
                                status: data.status,
                                dateIssued: data.dateIssued,
                                dateDue: data.dateDue,
                                datePaid: data.datePaid,
                                currencyCode: data.currencyCode,
                                exchangeRate: data.exchangeRate,
                                subtotal: data.subtotal,
                                totalTax: data.totalTax,
                                totalDiscount: data.totalDiscount,
                                totalAmount: data.totalAmount,
                                balance: data.balance,
                                supplierReference: data.supplierReference,
                                updatedAt: new Date().toISOString()
                            })
                                .where("id", "=", existingLocalId)
                                .where("companyId", "=", this.companyId)
                                .execute()];
                    case 4:
                        // Update existing purchase invoice (mapping is handled by linkEntities in base class)
                        _t.sent();
                        // Update lines - delete existing and recreate
                        return [4 /*yield*/, this.upsertLines(tx, existingLocalId, (_a = data.lines) !== null && _a !== void 0 ? _a : [])];
                    case 5:
                        // Update lines - delete existing and recreate
                        _t.sent();
                        return [2 /*return*/, existingLocalId];
                    case 6:
                        // Create new purchase invoice from Xero
                        // This requires: supplierInteractionId, invoiceId (sequence), createdBy, companyId
                        if (!supplierId) {
                            throw new Error("Cannot create purchase invoice from Xero: Supplier with Xero ContactID ".concat(data.supplierExternalId, " not found in Carbon. Sync the vendor first."));
                        }
                        return [4 /*yield*/, this.getDefaultUser(tx)];
                    case 7:
                        defaultUser = _t.sent();
                        if (!defaultUser) {
                            throw new Error("Cannot create purchase invoice from Xero: No default user found for company ".concat(this.companyId));
                        }
                        return [4 /*yield*/, tx
                                .insertInto("supplierInteraction")
                                .values({
                                companyId: this.companyId,
                                supplierId: supplierId
                            })
                                .returning("id")
                                .executeTakeFirstOrThrow()];
                    case 8:
                        supplierInteraction = _t.sent();
                        return [4 /*yield*/, (0, kysely_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT get_next_sequence('purchaseInvoice', ", ") as get_next_sequence\n    "], ["\n      SELECT get_next_sequence('purchaseInvoice', ", ") as get_next_sequence\n    "])), this.companyId).execute(tx)];
                    case 9:
                        sequenceResult = _t.sent();
                        invoiceId = (_d = (_c = (_b = sequenceResult.rows[0]) === null || _b === void 0 ? void 0 : _b.get_next_sequence) !== null && _c !== void 0 ? _c : data.invoiceId) !== null && _d !== void 0 ? _d : "XERO-".concat(remoteId.slice(0, 8));
                        return [4 /*yield*/, tx
                                .insertInto("purchaseInvoice")
                                .values({
                                invoiceId: invoiceId,
                                companyId: this.companyId,
                                createdBy: defaultUser,
                                supplierId: supplierId,
                                supplierInteractionId: supplierInteraction.id,
                                status: (_e = data.status) !== null && _e !== void 0 ? _e : "Draft",
                                dateIssued: (_f = data.dateIssued) !== null && _f !== void 0 ? _f : null,
                                dateDue: (_g = data.dateDue) !== null && _g !== void 0 ? _g : null,
                                datePaid: (_h = data.datePaid) !== null && _h !== void 0 ? _h : null,
                                currencyCode: (_j = data.currencyCode) !== null && _j !== void 0 ? _j : "USD",
                                exchangeRate: (_k = data.exchangeRate) !== null && _k !== void 0 ? _k : 1,
                                subtotal: (_l = data.subtotal) !== null && _l !== void 0 ? _l : 0,
                                totalTax: (_m = data.totalTax) !== null && _m !== void 0 ? _m : 0,
                                totalDiscount: (_o = data.totalDiscount) !== null && _o !== void 0 ? _o : 0,
                                totalAmount: (_p = data.totalAmount) !== null && _p !== void 0 ? _p : 0,
                                balance: (_q = data.balance) !== null && _q !== void 0 ? _q : 0,
                                supplierReference: (_r = data.supplierReference) !== null && _r !== void 0 ? _r : null
                            })
                                .returning("id")
                                .executeTakeFirstOrThrow()];
                    case 10:
                        newInvoice = _t.sent();
                        // Insert lines for the new invoice
                        return [4 /*yield*/, this.upsertLines(tx, newInvoice.id, (_s = data.lines) !== null && _s !== void 0 ? _s : [])];
                    case 11:
                        // Insert lines for the new invoice
                        _t.sent();
                        return [2 /*return*/, newInvoice.id];
                }
            });
        });
    };
    /**
     * Get a default user for system-generated records.
     * Tries company owner first, then falls back to first active employee.
     */
    BillSyncer.prototype.getDefaultUser = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var group, employee;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tx
                            .selectFrom("company")
                            .innerJoin("companyGroup", "companyGroup.id", "company.companyGroupId")
                            .select("companyGroup.ownerId")
                            .where("company.id", "=", this.companyId)
                            .executeTakeFirst()];
                    case 1:
                        group = _b.sent();
                        if (group === null || group === void 0 ? void 0 : group.ownerId) {
                            return [2 /*return*/, group.ownerId];
                        }
                        return [4 /*yield*/, tx
                                .selectFrom("employeeJob")
                                .innerJoin("user", "user.id", "employeeJob.id")
                                .select("employeeJob.id")
                                .where("employeeJob.companyId", "=", this.companyId)
                                .where("user.active", "=", true)
                                .orderBy("user.createdAt", "asc")
                                .limit(1)
                                .executeTakeFirst()];
                    case 2:
                        employee = _b.sent();
                        return [2 /*return*/, (_a = employee === null || employee === void 0 ? void 0 : employee.id) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    BillSyncer.prototype.upsertLines = function (tx, invoiceId, lines) {
        return __awaiter(this, void 0, void 0, function () {
            var itemCodes, itemMap, items, _i, items_1, item, accountNumbers, accountIdMap, companyGroupId, accounts, _a, accounts_1, a, invoice, _b, lines_1, line, itemId;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: 
                    // Delete existing lines
                    return [4 /*yield*/, tx
                            .deleteFrom("purchaseInvoiceLine")
                            .where("invoiceId", "=", invoiceId)
                            .execute()];
                    case 1:
                        // Delete existing lines
                        _f.sent();
                        if (lines.length === 0)
                            return [2 /*return*/];
                        itemCodes = lines
                            .map(function (l) { return l.itemCode; })
                            .filter(function (code) { return code !== null; });
                        itemMap = new Map();
                        if (!(itemCodes.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, tx
                                .selectFrom("item")
                                .select(["id", "readableId"])
                                .where("readableId", "in", itemCodes)
                                .where("companyId", "=", this.companyId)
                                .execute()];
                    case 2:
                        items = _f.sent();
                        for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                            item = items_1[_i];
                            itemMap.set(item.readableId, item.id);
                        }
                        _f.label = 3;
                    case 3:
                        accountNumbers = __spreadArray([], new Set(lines.map(function (l) { return l.accountNumber; }).filter(function (n) { return n !== null; })), true);
                        accountIdMap = new Map();
                        if (!(accountNumbers.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getCompanyGroupId(tx)];
                    case 4:
                        companyGroupId = _f.sent();
                        if (!companyGroupId) return [3 /*break*/, 6];
                        return [4 /*yield*/, tx
                                .selectFrom("account")
                                .select(["id", "number"])
                                .where("companyGroupId", "=", companyGroupId)
                                .where("number", "in", accountNumbers)
                                .where("active", "=", true)
                                .execute()];
                    case 5:
                        accounts = _f.sent();
                        for (_a = 0, accounts_1 = accounts; _a < accounts_1.length; _a++) {
                            a = accounts_1[_a];
                            if (a.number)
                                accountIdMap.set(a.number, a.id);
                        }
                        _f.label = 6;
                    case 6: return [4 /*yield*/, tx
                            .selectFrom("purchaseInvoice")
                            .select(["companyId", "createdBy", "exchangeRate"])
                            .where("id", "=", invoiceId)
                            .executeTakeFirstOrThrow()];
                    case 7:
                        invoice = _f.sent();
                        _b = 0, lines_1 = lines;
                        _f.label = 8;
                    case 8:
                        if (!(_b < lines_1.length)) return [3 /*break*/, 11];
                        line = lines_1[_b];
                        itemId = line.itemCode
                            ? ((_c = itemMap.get(line.itemCode)) !== null && _c !== void 0 ? _c : null)
                            : null;
                        return [4 /*yield*/, tx
                                .insertInto("purchaseInvoiceLine")
                                .values({
                                invoiceId: invoiceId,
                                companyId: invoice.companyId,
                                createdBy: invoice.createdBy,
                                description: line.description,
                                quantity: line.quantity,
                                unitPrice: line.unitPrice,
                                supplierUnitPrice: line.unitPrice,
                                itemId: itemId,
                                accountId: line.accountNumber
                                    ? ((_d = accountIdMap.get(line.accountNumber)) !== null && _d !== void 0 ? _d : null)
                                    : null,
                                taxPercent: line.taxPercent,
                                taxAmount: line.taxAmount,
                                supplierTaxAmount: (_e = line.taxAmount) !== null && _e !== void 0 ? _e : 0,
                                totalAmount: line.totalAmount,
                                supplierExtendedPrice: line.totalAmount,
                                exchangeRate: invoice.exchangeRate,
                                invoiceLineType: itemId ? "Part" : "G/L Account",
                                supplierShippingCost: 0
                            })
                                .execute()];
                    case 9:
                        _f.sent();
                        _f.label = 10;
                    case 10:
                        _b++;
                        return [3 /*break*/, 8];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    // =================================================================
    // 8. UPSERT REMOTE (Single + Batch)
    // =================================================================
    BillSyncer.prototype.upsertRemote = function (data, localId) {
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
                            (0, utils_1.throwXeroApiError)(existingRemoteId ? "update bill" : "create bill", result);
                        }
                        if (!((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Invoices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.InvoiceID)) {
                            throw new Error("Xero API returned success but no InvoiceID was returned for bill");
                        }
                        return [2 /*return*/, result.data.Invoices[0].InvoiceID];
                }
            });
        });
    };
    BillSyncer.prototype.upsertRemoteBatch = function (data) {
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
                            (0, utils_1.throwXeroApiError)("batch upsert bills", response);
                        }
                        if (!((_b = response.data) === null || _b === void 0 ? void 0 : _b.Invoices)) {
                            throw new Error("Xero API returned success but no Invoices array was returned for bills");
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
    return BillSyncer;
}(types_1.BaseEntitySyncer));
exports.BillSyncer = BillSyncer;
var templateObject_1;
