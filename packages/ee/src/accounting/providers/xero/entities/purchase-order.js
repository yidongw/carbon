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
exports.PurchaseOrderSyncer = void 0;
var external_mapping_1 = require("../../../core/external-mapping");
var types_1 = require("../../../core/types");
var utils_1 = require("../../../core/utils");
var models_1 = require("../models");
// Status mapping between Carbon and Xero
var CARBON_TO_XERO_STATUS = {
    Draft: "DRAFT",
    "Needs Approval": "SUBMITTED",
    "To Review": "SUBMITTED",
    Rejected: "DRAFT",
    Planned: "DRAFT",
    "To Receive": "AUTHORISED",
    "To Receive and Invoice": "AUTHORISED",
    "To Invoice": "BILLED",
    Completed: "BILLED",
    Closed: "BILLED"
};
var XERO_TO_CARBON_STATUS = {
    DRAFT: "Draft",
    SUBMITTED: "To Review",
    AUTHORISED: "To Receive",
    BILLED: "To Invoice",
    DELETED: "Closed"
};
var PurchaseOrderSyncer = /** @class */ (function (_super) {
    __extends(PurchaseOrderSyncer, _super);
    function PurchaseOrderSyncer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =================================================================
    // 1. ID MAPPING - Uses default implementation from BaseEntitySyncer
    // The entityType "purchaseOrder" maps to the purchaseOrder table
    // =================================================================
    // =================================================================
    // 2. TIMESTAMP EXTRACTION
    // =================================================================
    PurchaseOrderSyncer.prototype.getRemoteUpdatedAt = function (remote) {
        if (!remote.UpdatedDateUTC)
            return null;
        return (0, models_1.parseDotnetDate)(remote.UpdatedDateUTC);
    };
    // =================================================================
    // 3. LOCAL FETCH (Single + Batch)
    // =================================================================
    PurchaseOrderSyncer.prototype.fetchLocal = function (id) {
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
    PurchaseOrderSyncer.prototype.fetchLocalBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (ids.length === 0)
                    return [2 /*return*/, new Map()];
                return [2 /*return*/, this.fetchOrdersByIds(ids)];
            });
        });
    };
    PurchaseOrderSyncer.prototype.fetchOrdersByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var orderRows, orderIds, lineRows, supplierIds, supplierExternalIds, mappingService, _i, supplierIds_1, supplierId, externalId, linesByOrder, _a, lineRows_1, line, existing, result, _b, orderRows_1, row, lines, subtotal, totalTax, _c, lines_1, line;
            var _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("purchaseOrder")
                                .select([
                                "id",
                                "companyId",
                                "purchaseOrderId",
                                "supplierId",
                                "status",
                                "orderDate",
                                "currencyCode",
                                "exchangeRate",
                                "supplierReference",
                                "updatedAt"
                            ])
                                .where("id", "in", ids)
                                .where("companyId", "=", this.companyId)
                                .execute()];
                    case 1:
                        orderRows = _h.sent();
                        if (orderRows.length === 0)
                            return [2 /*return*/, new Map()];
                        orderIds = orderRows.map(function (o) { return o.id; });
                        return [4 /*yield*/, this.database
                                .selectFrom("purchaseOrderLine")
                                .leftJoin("item", "item.id", "purchaseOrderLine.itemId")
                                .leftJoin("account", "account.id", "purchaseOrderLine.accountId")
                                .select([
                                "purchaseOrderLine.id",
                                "purchaseOrderLine.purchaseOrderId",
                                "purchaseOrderLine.description",
                                "purchaseOrderLine.purchaseQuantity",
                                "purchaseOrderLine.unitPrice",
                                "purchaseOrderLine.itemId",
                                "purchaseOrderLine.taxPercent",
                                "purchaseOrderLine.taxAmount",
                                "purchaseOrderLine.extendedPrice",
                                "purchaseOrderLine.quantityReceived",
                                "purchaseOrderLine.quantityInvoiced",
                                "item.readableId as itemCode",
                                "account.number as accountNumber"
                            ])
                                .where("purchaseOrderLine.purchaseOrderId", "in", orderIds)
                                .execute()];
                    case 2:
                        lineRows = _h.sent();
                        supplierIds = orderRows.map(function (o) { return o.supplierId; });
                        supplierExternalIds = new Map();
                        if (!(supplierIds.length > 0)) return [3 /*break*/, 6];
                        mappingService = (0, external_mapping_1.createMappingService)(this.database, this.companyId);
                        _i = 0, supplierIds_1 = supplierIds;
                        _h.label = 3;
                    case 3:
                        if (!(_i < supplierIds_1.length)) return [3 /*break*/, 6];
                        supplierId = supplierIds_1[_i];
                        return [4 /*yield*/, mappingService.getExternalId("supplier", supplierId, this.provider.id)];
                    case 4:
                        externalId = _h.sent();
                        supplierExternalIds.set(supplierId, externalId);
                        _h.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        linesByOrder = new Map();
                        for (_a = 0, lineRows_1 = lineRows; _a < lineRows_1.length; _a++) {
                            line = lineRows_1[_a];
                            existing = (_d = linesByOrder.get(line.purchaseOrderId)) !== null && _d !== void 0 ? _d : [];
                            existing.push(line);
                            linesByOrder.set(line.purchaseOrderId, existing);
                        }
                        result = new Map();
                        for (_b = 0, orderRows_1 = orderRows; _b < orderRows_1.length; _b++) {
                            row = orderRows_1[_b];
                            lines = (_e = linesByOrder.get(row.id)) !== null && _e !== void 0 ? _e : [];
                            subtotal = 0;
                            totalTax = 0;
                            for (_c = 0, lines_1 = lines; _c < lines_1.length; _c++) {
                                line = lines_1[_c];
                                subtotal += Number(line.extendedPrice) || 0;
                                totalTax += Number(line.taxAmount) || 0;
                            }
                            result.set(row.id, {
                                id: row.id,
                                companyId: row.companyId,
                                purchaseOrderId: row.purchaseOrderId,
                                supplierId: row.supplierId,
                                supplierExternalId: (_f = supplierExternalIds.get(row.supplierId)) !== null && _f !== void 0 ? _f : null,
                                status: row.status,
                                orderDate: row.orderDate,
                                deliveryDate: null, // Would need to join purchaseOrderDelivery
                                deliveryAddress: null,
                                deliveryInstructions: null,
                                currencyCode: row.currencyCode,
                                exchangeRate: Number(row.exchangeRate) || 1,
                                subtotal: subtotal,
                                totalTax: totalTax,
                                totalAmount: subtotal + totalTax,
                                supplierReference: row.supplierReference,
                                lines: lines.map(function (line) { return ({
                                    id: line.id,
                                    description: line.description,
                                    quantity: Number(line.purchaseQuantity) || 0,
                                    unitPrice: Number(line.unitPrice) || 0,
                                    itemId: line.itemId,
                                    itemCode: line.itemCode,
                                    accountNumber: line.accountNumber,
                                    taxPercent: line.taxPercent != null ? Number(line.taxPercent) : null,
                                    taxAmount: line.taxAmount != null ? Number(line.taxAmount) : null,
                                    totalAmount: Number(line.extendedPrice) || 0,
                                    quantityReceived: line.quantityReceived != null
                                        ? Number(line.quantityReceived)
                                        : null,
                                    quantityInvoiced: line.quantityInvoiced != null ? Number(line.quantityInvoiced) : null
                                }); }),
                                updatedAt: (_g = row.updatedAt) !== null && _g !== void 0 ? _g : new Date().toISOString(),
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
    PurchaseOrderSyncer.prototype.fetchRemote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, data;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.provider.request("GET", "/PurchaseOrders/".concat(id))];
                    case 1:
                        result = _c.sent();
                        if (result.error)
                            return [2 /*return*/, null];
                        data = result.data;
                        return [2 /*return*/, (_b = (_a = data === null || data === void 0 ? void 0 : data.PurchaseOrders) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null];
                }
            });
        });
    };
    PurchaseOrderSyncer.prototype.fetchRemoteBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, data, _i, _a, po;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (ids.length === 0)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, this.provider.request("GET", "/PurchaseOrders?IDs=".concat(ids.join(",")))];
                    case 1:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("fetch purchase orders batch", response);
                        }
                        data = response.data;
                        for (_i = 0, _a = (_b = data === null || data === void 0 ? void 0 : data.PurchaseOrders) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                            po = _a[_i];
                            result.set(po.PurchaseOrderID, po);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // =================================================================
    // 5. TRANSFORMATION (Carbon -> Xero)
    // =================================================================
    PurchaseOrderSyncer.prototype.mapToRemote = function (local) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, contactId, xeroProvider, defaultAccountCode, lineItems;
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(local.id)];
                    case 1:
                        existingRemoteId = _h.sent();
                        contactId = local.supplierExternalId;
                        if (!(!contactId && local.supplierId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.ensureDependencySynced("vendor", local.supplierId)];
                    case 2:
                        contactId = _h.sent();
                        _h.label = 3;
                    case 3:
                        if (!contactId) {
                            throw new Error("Cannot sync PO ".concat(local.id, ": No supplier linked or supplier not synced to Xero"));
                        }
                        xeroProvider = this.provider;
                        defaultAccountCode = (_a = xeroProvider.settings) === null || _a === void 0 ? void 0 : _a.defaultPurchaseAccountCode;
                        return [4 /*yield*/, Promise.all(local.lines.map(function (line) { return __awaiter(_this, void 0, void 0, function () {
                                var itemCode, item, hasTax;
                                var _a, _b, _c, _d, _e;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0:
                                            itemCode = line.itemCode;
                                            if (!line.itemId) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.ensureDependencySynced("item", line.itemId)];
                                        case 1:
                                            _f.sent();
                                            if (!!itemCode) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.database
                                                    .selectFrom("item")
                                                    .select("readableId")
                                                    .where("id", "=", line.itemId)
                                                    .executeTakeFirst()];
                                        case 2:
                                            item = _f.sent();
                                            itemCode = (_a = item === null || item === void 0 ? void 0 : item.readableId) !== null && _a !== void 0 ? _a : null;
                                            _f.label = 3;
                                        case 3:
                                            hasTax = (line.taxPercent != null && line.taxPercent > 0) ||
                                                (line.taxAmount != null && line.taxAmount > 0);
                                            return [2 /*return*/, {
                                                    Description: (_b = line.description) !== null && _b !== void 0 ? _b : undefined,
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
                        lineItems = _h.sent();
                        return [2 /*return*/, {
                                PurchaseOrderID: existingRemoteId,
                                PurchaseOrderNumber: local.purchaseOrderId,
                                Reference: (_b = local.supplierReference) !== null && _b !== void 0 ? _b : undefined,
                                Contact: { ContactID: contactId },
                                Date: (_c = local.orderDate) !== null && _c !== void 0 ? _c : undefined,
                                DeliveryDate: (_d = local.deliveryDate) !== null && _d !== void 0 ? _d : undefined,
                                DeliveryAddress: (_e = local.deliveryAddress) !== null && _e !== void 0 ? _e : undefined,
                                DeliveryInstructions: (_f = local.deliveryInstructions) !== null && _f !== void 0 ? _f : undefined,
                                Status: CARBON_TO_XERO_STATUS[local.status],
                                CurrencyCode: (_g = local.currencyCode) !== null && _g !== void 0 ? _g : undefined,
                                CurrencyRate: local.exchangeRate && local.exchangeRate !== 1
                                    ? local.exchangeRate
                                    : undefined,
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
    PurchaseOrderSyncer.prototype.mapToLocal = function (remote) {
        return __awaiter(this, void 0, void 0, function () {
            var status, lines;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                status = XERO_TO_CARBON_STATUS[remote.Status];
                lines = ((_a = remote.LineItems) !== null && _a !== void 0 ? _a : []).map(function (line, index) {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ({
                        id: (_a = line.LineItemID) !== null && _a !== void 0 ? _a : "temp-".concat(index),
                        description: (_b = line.Description) !== null && _b !== void 0 ? _b : null,
                        quantity: (_c = line.Quantity) !== null && _c !== void 0 ? _c : 1,
                        unitPrice: (_d = line.UnitAmount) !== null && _d !== void 0 ? _d : 0,
                        itemId: null, // Will be resolved during upsertLocal if ItemCode matches
                        itemCode: (_e = line.ItemCode) !== null && _e !== void 0 ? _e : null,
                        accountNumber: (_f = line.AccountCode) !== null && _f !== void 0 ? _f : null,
                        taxPercent: null,
                        taxAmount: (_g = line.TaxAmount) !== null && _g !== void 0 ? _g : null,
                        totalAmount: (_h = line.LineAmount) !== null && _h !== void 0 ? _h : 0,
                        quantityReceived: null,
                        quantityInvoiced: null
                    });
                });
                return [2 /*return*/, {
                        purchaseOrderId: (_b = remote.PurchaseOrderNumber) !== null && _b !== void 0 ? _b : remote.PurchaseOrderID,
                        supplierExternalId: remote.Contact.ContactID,
                        status: status,
                        orderDate: (_c = remote.Date) !== null && _c !== void 0 ? _c : null,
                        deliveryDate: (_d = remote.DeliveryDate) !== null && _d !== void 0 ? _d : null,
                        deliveryAddress: (_e = remote.DeliveryAddress) !== null && _e !== void 0 ? _e : null,
                        deliveryInstructions: (_f = remote.DeliveryInstructions) !== null && _f !== void 0 ? _f : null,
                        currencyCode: (_g = remote.CurrencyCode) !== null && _g !== void 0 ? _g : "USD",
                        exchangeRate: (_h = remote.CurrencyRate) !== null && _h !== void 0 ? _h : 1,
                        subtotal: (_j = remote.SubTotal) !== null && _j !== void 0 ? _j : 0,
                        totalTax: (_k = remote.TotalTax) !== null && _k !== void 0 ? _k : 0,
                        totalAmount: (_l = remote.Total) !== null && _l !== void 0 ? _l : 0,
                        supplierReference: (_m = remote.Reference) !== null && _m !== void 0 ? _m : null,
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
    PurchaseOrderSyncer.prototype.upsertLocal = function (tx, data, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingLocalId, supplierId, txMappingService;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getLocalId(remoteId)];
                    case 1:
                        existingLocalId = _b.sent();
                        supplierId = null;
                        if (!data.supplierExternalId) return [3 /*break*/, 3];
                        txMappingService = (0, external_mapping_1.createMappingService)(tx, this.companyId);
                        return [4 /*yield*/, txMappingService.getEntityId(this.provider.id, data.supplierExternalId, "supplier")];
                    case 2:
                        supplierId = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!existingLocalId) return [3 /*break*/, 6];
                        // Update existing purchase order (mapping is handled by linkEntities in base class)
                        return [4 /*yield*/, tx
                                .updateTable("purchaseOrder")
                                .set({
                                supplierId: supplierId !== null && supplierId !== void 0 ? supplierId : undefined,
                                status: data.status,
                                orderDate: data.orderDate,
                                currencyCode: data.currencyCode,
                                exchangeRate: data.exchangeRate,
                                supplierReference: data.supplierReference,
                                updatedAt: new Date().toISOString()
                            })
                                .where("id", "=", existingLocalId)
                                .where("companyId", "=", this.companyId)
                                .execute()];
                    case 4:
                        // Update existing purchase order (mapping is handled by linkEntities in base class)
                        _b.sent();
                        // Update lines
                        return [4 /*yield*/, this.upsertLines(tx, existingLocalId, (_a = data.lines) !== null && _a !== void 0 ? _a : [])];
                    case 5:
                        // Update lines
                        _b.sent();
                        return [2 /*return*/, existingLocalId];
                    case 6: 
                    // For new POs from Xero, we need to create them
                    // This requires more context (supplierInteractionId, createdBy, etc.)
                    throw new Error("Cannot create new purchase order from Xero. PO with ID ".concat(remoteId, " must be created in Carbon first and then synced."));
                }
            });
        });
    };
    PurchaseOrderSyncer.prototype.upsertLines = function (tx, purchaseOrderId, lines) {
        return __awaiter(this, void 0, void 0, function () {
            var itemCodes, itemMap, items, _i, items_1, item, accountNumbers, accountIdMap, companyGroupId, accounts, _a, accounts_1, a, po, _b, lines_2, line, itemId;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: 
                    // Delete existing lines
                    return [4 /*yield*/, tx
                            .deleteFrom("purchaseOrderLine")
                            .where("purchaseOrderId", "=", purchaseOrderId)
                            .execute()];
                    case 1:
                        // Delete existing lines
                        _g.sent();
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
                        items = _g.sent();
                        for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                            item = items_1[_i];
                            itemMap.set(item.readableId, item.id);
                        }
                        _g.label = 3;
                    case 3:
                        accountNumbers = __spreadArray([], new Set(lines.map(function (l) { return l.accountNumber; }).filter(function (n) { return n !== null; })), true);
                        accountIdMap = new Map();
                        if (!(accountNumbers.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getCompanyGroupId(tx)];
                    case 4:
                        companyGroupId = _g.sent();
                        if (!companyGroupId) return [3 /*break*/, 6];
                        return [4 /*yield*/, tx
                                .selectFrom("account")
                                .select(["id", "number"])
                                .where("companyGroupId", "=", companyGroupId)
                                .where("number", "in", accountNumbers)
                                .where("active", "=", true)
                                .execute()];
                    case 5:
                        accounts = _g.sent();
                        for (_a = 0, accounts_1 = accounts; _a < accounts_1.length; _a++) {
                            a = accounts_1[_a];
                            if (a.number)
                                accountIdMap.set(a.number, a.id);
                        }
                        _g.label = 6;
                    case 6: return [4 /*yield*/, tx
                            .selectFrom("purchaseOrder")
                            .select(["companyId", "createdBy", "exchangeRate"])
                            .where("id", "=", purchaseOrderId)
                            .executeTakeFirstOrThrow()];
                    case 7:
                        po = _g.sent();
                        _b = 0, lines_2 = lines;
                        _g.label = 8;
                    case 8:
                        if (!(_b < lines_2.length)) return [3 /*break*/, 11];
                        line = lines_2[_b];
                        itemId = line.itemCode
                            ? ((_c = itemMap.get(line.itemCode)) !== null && _c !== void 0 ? _c : null)
                            : null;
                        return [4 /*yield*/, tx
                                .insertInto("purchaseOrderLine")
                                .values({
                                purchaseOrderId: purchaseOrderId,
                                companyId: po.companyId,
                                createdBy: po.createdBy,
                                description: line.description,
                                purchaseQuantity: line.quantity,
                                unitPrice: line.unitPrice,
                                supplierUnitPrice: line.unitPrice,
                                itemId: itemId,
                                accountId: line.accountNumber
                                    ? ((_d = accountIdMap.get(line.accountNumber)) !== null && _d !== void 0 ? _d : null)
                                    : null,
                                taxPercent: line.taxPercent,
                                taxAmount: line.taxAmount,
                                supplierTaxAmount: (_e = line.taxAmount) !== null && _e !== void 0 ? _e : 0,
                                extendedPrice: line.totalAmount,
                                supplierExtendedPrice: line.totalAmount,
                                exchangeRate: (_f = po.exchangeRate) !== null && _f !== void 0 ? _f : 1,
                                purchaseOrderLineType: itemId ? "Part" : "G/L Account",
                                supplierShippingCost: 0,
                                invoicedComplete: false,
                                receivedComplete: false,
                                requiresInspection: false
                            })
                                .execute()];
                    case 9:
                        _g.sent();
                        _g.label = 10;
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
    PurchaseOrderSyncer.prototype.upsertRemote = function (data, localId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, purchaseOrders, result, resData, poId;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(localId)];
                    case 1:
                        existingRemoteId = _c.sent();
                        purchaseOrders = existingRemoteId
                            ? [__assign(__assign({}, data), { PurchaseOrderID: existingRemoteId })]
                            : [data];
                        return [4 /*yield*/, this.provider.request("POST", "/PurchaseOrders", {
                                body: JSON.stringify({ PurchaseOrders: purchaseOrders })
                            })];
                    case 2:
                        result = _c.sent();
                        if (result.error) {
                            (0, utils_1.throwXeroApiError)(existingRemoteId ? "update purchase order" : "create purchase order", result);
                        }
                        resData = result.data;
                        poId = (_b = (_a = resData === null || resData === void 0 ? void 0 : resData.PurchaseOrders) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.PurchaseOrderID;
                        if (!poId) {
                            throw new Error("Xero API returned success but no PurchaseOrderID was returned");
                        }
                        return [2 /*return*/, poId];
                }
            });
        });
    };
    PurchaseOrderSyncer.prototype.upsertRemoteBatch = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, purchaseOrders, localIdOrder, _i, data_1, _a, localId, payload, existingRemoteId, response, i, returnedPO, localId;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (data.length === 0)
                            return [2 /*return*/, result];
                        purchaseOrders = [];
                        localIdOrder = [];
                        _i = 0, data_1 = data;
                        _c.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        _a = data_1[_i], localId = _a.localId, payload = _a.payload;
                        return [4 /*yield*/, this.getRemoteId(localId)];
                    case 2:
                        existingRemoteId = _c.sent();
                        purchaseOrders.push(existingRemoteId
                            ? __assign(__assign({}, payload), { PurchaseOrderID: existingRemoteId })
                            : payload);
                        localIdOrder.push(localId);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.provider.request("POST", "/PurchaseOrders", {
                            body: JSON.stringify({ PurchaseOrders: purchaseOrders })
                        })];
                    case 5:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("batch upsert purchase orders", response);
                        }
                        if (!((_b = response.data) === null || _b === void 0 ? void 0 : _b.PurchaseOrders)) {
                            throw new Error("Xero API returned success but no PurchaseOrders array was returned");
                        }
                        for (i = 0; i < response.data.PurchaseOrders.length; i++) {
                            returnedPO = response.data.PurchaseOrders[i];
                            localId = localIdOrder[i];
                            if ((returnedPO === null || returnedPO === void 0 ? void 0 : returnedPO.PurchaseOrderID) && localId) {
                                result.set(localId, returnedPO.PurchaseOrderID);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // =================================================================
    // 9. SHOULD SYNC: Only sync POs that are past Draft/Planned status
    // =================================================================
    PurchaseOrderSyncer.prototype.shouldSync = function (context) {
        if (context.direction === "push" && context.localEntity) {
            // Only sync POs in locked statuses (finalized and receiving/invoicing)
            var syncableStatuses = [
                "To Receive",
                "To Receive and Invoice",
                "To Invoice",
                "Completed"
            ];
            if (!syncableStatuses.includes(context.localEntity.status)) {
                return "Purchase order must be in a locked status to sync (current: ".concat(context.localEntity.status, ")");
            }
        }
        return true;
    };
    return PurchaseOrderSyncer;
}(types_1.BaseEntitySyncer));
exports.PurchaseOrderSyncer = PurchaseOrderSyncer;
