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
exports.ItemSyncer = void 0;
var types_1 = require("../../../core/types");
var utils_1 = require("../../../core/utils");
var models_1 = require("../models");
var ItemSyncer = /** @class */ (function (_super) {
    __extends(ItemSyncer, _super);
    function ItemSyncer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =================================================================
    // 1. ID MAPPING - Uses default implementation from BaseEntitySyncer
    // =================================================================
    // =================================================================
    // 2. TIMESTAMP EXTRACTION
    // =================================================================
    ItemSyncer.prototype.getRemoteUpdatedAt = function (remote) {
        if (!remote.UpdatedDateUTC)
            return null;
        return (0, models_1.parseDotnetDate)(remote.UpdatedDateUTC);
    };
    // =================================================================
    // 3. LOCAL FETCH (Single + Batch)
    // =================================================================
    ItemSyncer.prototype.fetchLocal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchItemsByIds([id])];
                    case 1:
                        items = _b.sent();
                        return [2 /*return*/, (_a = items.get(id)) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    ItemSyncer.prototype.fetchLocalBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetchItemsByIds(ids)];
            });
        });
    };
    ItemSyncer.prototype.fetchItemsByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("item")
                                .leftJoin("itemCost", "itemCost.itemId", "item.id")
                                .leftJoin("itemUnitSalePrice", "itemUnitSalePrice.itemId", "item.id")
                                .select([
                                "item.id",
                                "item.readableId",
                                "item.readableIdWithRevision",
                                "item.name",
                                "item.description",
                                "item.companyId",
                                "item.type",
                                "item.unitOfMeasureCode",
                                "item.replenishmentSystem",
                                "item.itemTrackingType",
                                "item.updatedAt",
                                "itemCost.unitCost",
                                "itemUnitSalePrice.unitSalePrice"
                            ])
                                .where("item.id", "in", ids)
                                .where("item.companyId", "=", this.companyId)
                                .execute()];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, this.transformRows(rows)];
                }
            });
        });
    };
    ItemSyncer.prototype.transformRows = function (rows) {
        var _a, _b;
        var result = new Map();
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            var isPurchased = row.replenishmentSystem === "Buy" ||
                row.replenishmentSystem === "Buy and Make";
            var isSold = true; // Assume all items can be sold
            var isTrackedAsInventory = row.itemTrackingType !== "None";
            result.set(row.id, {
                id: row.id,
                code: (_a = row.readableIdWithRevision) !== null && _a !== void 0 ? _a : row.readableId,
                name: row.name,
                description: row.description,
                companyId: row.companyId,
                type: row.type,
                unitOfMeasureCode: row.unitOfMeasureCode,
                unitCost: Number(row.unitCost) || 0,
                unitSalePrice: Number(row.unitSalePrice) || 0,
                isPurchased: isPurchased,
                isSold: isSold,
                isTrackedAsInventory: isTrackedAsInventory,
                updatedAt: (_b = row.updatedAt) !== null && _b !== void 0 ? _b : new Date().toISOString(),
                raw: row
            });
        }
        return result;
    };
    // =================================================================
    // 4. REMOTE FETCH (Single + Batch) - API calls within syncer
    // =================================================================
    ItemSyncer.prototype.fetchRemote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.provider.request("GET", "/Items/".concat(id))];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, result.error ? null : ((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Items) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null)];
                }
            });
        });
    };
    ItemSyncer.prototype.fetchRemoteBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, _i, _a, item;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (ids.length === 0)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, this.provider.request("GET", "/Items?IDs=".concat(ids.join(",")))];
                    case 1:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("fetch items batch", response);
                        }
                        if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.Items) {
                            for (_i = 0, _a = response.data.Items; _i < _a.length; _i++) {
                                item = _a[_i];
                                result.set(item.ItemID, item);
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
    ItemSyncer.prototype.mapToRemote = function (local) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(local.id)];
                    case 1:
                        existingRemoteId = _c.sent();
                        return [2 /*return*/, {
                                ItemID: existingRemoteId,
                                Code: local.code.slice(0, 30),
                                Name: local.name.slice(0, 50),
                                Description: (_b = (_a = local.description) === null || _a === void 0 ? void 0 : _a.slice(0, 4000)) !== null && _b !== void 0 ? _b : undefined,
                                IsPurchased: local.isPurchased,
                                IsSold: local.isSold,
                                IsTrackedAsInventory: local.isTrackedAsInventory,
                                PurchaseDetails: local.isPurchased
                                    ? { UnitPrice: local.unitCost }
                                    : undefined,
                                SalesDetails: local.isSold
                                    ? { UnitPrice: local.unitSalePrice }
                                    : undefined
                            }];
                }
            });
        });
    };
    // =================================================================
    // 6. TRANSFORMATION (Xero -> Carbon) - Update only
    // =================================================================
    ItemSyncer.prototype.mapToLocal = function (remote) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                return [2 /*return*/, {
                        code: remote.Code,
                        name: (_a = remote.Name) !== null && _a !== void 0 ? _a : "",
                        description: (_b = remote.Description) !== null && _b !== void 0 ? _b : null,
                        unitCost: (_d = (_c = remote.PurchaseDetails) === null || _c === void 0 ? void 0 : _c.UnitPrice) !== null && _d !== void 0 ? _d : 0,
                        unitSalePrice: (_f = (_e = remote.SalesDetails) === null || _e === void 0 ? void 0 : _e.UnitPrice) !== null && _f !== void 0 ? _f : 0,
                        isPurchased: (_g = remote.IsPurchased) !== null && _g !== void 0 ? _g : false,
                        isSold: (_h = remote.IsSold) !== null && _h !== void 0 ? _h : false,
                        isTrackedAsInventory: (_j = remote.IsTrackedAsInventory) !== null && _j !== void 0 ? _j : false
                    }];
            });
        });
    };
    // =================================================================
    // 7. UPSERT LOCAL (Update existing only - Carbon is source of truth)
    // =================================================================
    ItemSyncer.prototype.upsertLocal = function (tx, data, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingLocalId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getLocalId(remoteId)];
                    case 1:
                        existingLocalId = _b.sent();
                        if (!(!existingLocalId && data.code)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findLocalItemByCode(tx, data.code)];
                    case 2:
                        existingLocalId = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!existingLocalId) {
                            throw new Error("Cannot create new items from Xero. Item with remote ID ".concat(remoteId, " (code: ").concat((_a = data.code) !== null && _a !== void 0 ? _a : "unknown", ") not found locally."));
                        }
                        // Update item table (mapping is handled by linkEntities in base class)
                        return [4 /*yield*/, tx
                                .updateTable("item")
                                .set({
                                name: data.name,
                                description: data.description,
                                updatedAt: new Date().toISOString()
                            })
                                .where("id", "=", existingLocalId)
                                .execute()];
                    case 4:
                        // Update item table (mapping is handled by linkEntities in base class)
                        _b.sent();
                        if (!(data.unitCost !== undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, tx
                                .updateTable("itemCost")
                                .set({ unitCost: data.unitCost })
                                .where("itemId", "=", existingLocalId)
                                .execute()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        if (!(data.unitSalePrice !== undefined)) return [3 /*break*/, 8];
                        return [4 /*yield*/, tx
                                .updateTable("itemUnitSalePrice")
                                .set({ unitSalePrice: data.unitSalePrice })
                                .where("itemId", "=", existingLocalId)
                                .execute()];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/, existingLocalId];
                }
            });
        });
    };
    /**
     * Try to find an existing Carbon item by its code (readableIdWithRevision or readableId).
     * Used for smart matching during backfill when no ID mapping exists yet.
     */
    ItemSyncer.prototype.findLocalItemByCode = function (tx, code) {
        return __awaiter(this, void 0, void 0, function () {
            var match;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tx
                            .selectFrom("item")
                            .select("id")
                            .where("companyId", "=", this.companyId)
                            .where(function (eb) {
                            return eb.or([
                                eb("readableIdWithRevision", "=", code),
                                eb("readableId", "=", code)
                            ]);
                        })
                            .executeTakeFirst()];
                    case 1:
                        match = _b.sent();
                        return [2 /*return*/, (_a = match === null || match === void 0 ? void 0 : match.id) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    /**
     * Search Xero for an existing item by exact Code match.
     * Used for smart matching during push when no ID mapping exists yet.
     */
    ItemSyncer.prototype.findRemoteItemByCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var escapedCode, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        escapedCode = code.replace(/"/g, '\\"');
                        return [4 /*yield*/, this.provider.request("GET", "/Items?where=Code==\"".concat(escapedCode, "\""))];
                    case 1:
                        result = _d.sent();
                        if (!result.error && ((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Items) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.ItemID)) {
                            return [2 /*return*/, result.data.Items[0].ItemID];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    // =================================================================
    // 8. UPSERT REMOTE (Single + Batch) - API calls within syncer
    // =================================================================
    ItemSyncer.prototype.upsertRemote = function (data, localId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, items, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(localId)];
                    case 1:
                        existingRemoteId = _d.sent();
                        if (!(!existingRemoteId && data.Code)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findRemoteItemByCode(data.Code)];
                    case 2:
                        existingRemoteId = _d.sent();
                        _d.label = 3;
                    case 3:
                        items = existingRemoteId
                            ? [__assign(__assign({}, data), { ItemID: existingRemoteId })]
                            : [data];
                        return [4 /*yield*/, this.provider.request("POST", "/Items", { body: JSON.stringify({ Items: items }) })];
                    case 4:
                        result = _d.sent();
                        if (result.error) {
                            (0, utils_1.throwXeroApiError)(existingRemoteId ? "update item" : "create item", result);
                        }
                        if (!((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Items) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.ItemID)) {
                            throw new Error("Xero API returned success but no ItemID was returned");
                        }
                        return [2 /*return*/, result.data.Items[0].ItemID];
                }
            });
        });
    };
    ItemSyncer.prototype.upsertRemoteBatch = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, items, localIdOrder, _i, data_1, _a, localId, payload, existingRemoteId, response, i, returnedItem, localId;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (data.length === 0)
                            return [2 /*return*/, result];
                        items = [];
                        localIdOrder = [];
                        _i = 0, data_1 = data;
                        _c.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        _a = data_1[_i], localId = _a.localId, payload = _a.payload;
                        return [4 /*yield*/, this.getRemoteId(localId)];
                    case 2:
                        existingRemoteId = _c.sent();
                        items.push(existingRemoteId
                            ? __assign(__assign({}, payload), { ItemID: existingRemoteId })
                            : payload);
                        localIdOrder.push(localId);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.provider.request("POST", "/Items", { body: JSON.stringify({ Items: items }) })];
                    case 5:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("batch upsert items", response);
                        }
                        if (!((_b = response.data) === null || _b === void 0 ? void 0 : _b.Items)) {
                            throw new Error("Xero API returned success but no Items array was returned");
                        }
                        for (i = 0; i < response.data.Items.length; i++) {
                            returnedItem = response.data.Items[i];
                            localId = localIdOrder[i];
                            if ((returnedItem === null || returnedItem === void 0 ? void 0 : returnedItem.ItemID) && localId) {
                                result.set(localId, returnedItem.ItemID);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return ItemSyncer;
}(types_1.BaseEntitySyncer));
exports.ItemSyncer = ItemSyncer;
