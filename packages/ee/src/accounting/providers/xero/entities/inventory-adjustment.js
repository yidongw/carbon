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
exports.InventoryAdjustmentSyncer = void 0;
var types_1 = require("../../../core/types");
var utils_1 = require("../../../core/utils");
var models_1 = require("../models");
var InventoryAdjustmentSyncer = /** @class */ (function (_super) {
    __extends(InventoryAdjustmentSyncer, _super);
    function InventoryAdjustmentSyncer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =================================================================
    // 1. ID MAPPING - Uses default implementation from BaseEntitySyncer
    // =================================================================
    // =================================================================
    // 2. TIMESTAMP EXTRACTION
    // =================================================================
    InventoryAdjustmentSyncer.prototype.getRemoteUpdatedAt = function (remote) {
        if (!remote.UpdatedDateUTC)
            return null;
        return (0, models_1.parseDotnetDate)(remote.UpdatedDateUTC);
    };
    // =================================================================
    // 3. LOCAL FETCH (Single + Batch)
    // =================================================================
    InventoryAdjustmentSyncer.prototype.fetchLocal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchAdjustmentsByIds([id])];
                    case 1:
                        items = _b.sent();
                        return [2 /*return*/, (_a = items.get(id)) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    InventoryAdjustmentSyncer.prototype.fetchLocalBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetchAdjustmentsByIds(ids)];
            });
        });
    };
    InventoryAdjustmentSyncer.prototype.fetchAdjustmentsByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("itemLedger")
                                .innerJoin("item", "item.id", "itemLedger.itemId")
                                .leftJoin("itemCost", "itemCost.itemId", "itemLedger.itemId")
                                .leftJoin("accountDefault", "accountDefault.companyId", "itemLedger.companyId")
                                .select([
                                "itemLedger.id",
                                "itemLedger.entryNumber",
                                "itemLedger.postingDate",
                                "itemLedger.entryType",
                                "itemLedger.itemId",
                                "itemLedger.locationId",
                                "itemLedger.quantity",
                                "itemLedger.companyId",
                                "itemLedger.createdAt",
                                "itemCost.unitCost",
                                "accountDefault.inventoryAccount",
                                "accountDefault.inventoryAdjustmentVarianceAccount as adjustmentVarianceAccount",
                                "item.readableId as itemReadableId"
                            ])
                                .where("itemLedger.id", "in", ids)
                                .where("itemLedger.companyId", "=", this.companyId)
                                .where("itemLedger.entryType", "in", [
                                "Positive Adjmt.",
                                "Negative Adjmt."
                            ])
                                .execute()];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, this.transformRows(rows)];
                }
            });
        });
    };
    InventoryAdjustmentSyncer.prototype.transformRows = function (rows) {
        var _a;
        var result = new Map();
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            // Skip rows without required GL accounts
            if (!row.inventoryAccount || !row.adjustmentVarianceAccount) {
                continue;
            }
            result.set(row.id, {
                id: row.id,
                entryNumber: row.entryNumber,
                postingDate: row.postingDate,
                entryType: row.entryType,
                itemId: row.itemId,
                locationId: row.locationId,
                quantity: Number(row.quantity) || 0,
                companyId: row.companyId,
                unitCost: Number(row.unitCost) || 0,
                inventoryAccount: row.inventoryAccount,
                adjustmentVarianceAccount: row.adjustmentVarianceAccount,
                updatedAt: (_a = row.createdAt) !== null && _a !== void 0 ? _a : new Date().toISOString(),
                raw: row
            });
        }
        return result;
    };
    // =================================================================
    // 4. REMOTE FETCH - Stubs (push-only syncer)
    // =================================================================
    InventoryAdjustmentSyncer.prototype.fetchRemote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.provider.request("GET", "/ManualJournals/".concat(id))];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, result.error ? null : ((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.ManualJournals) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null)];
                }
            });
        });
    };
    InventoryAdjustmentSyncer.prototype.fetchRemoteBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, _i, _a, journal;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (ids.length === 0)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, this.provider.request("GET", "/ManualJournals?IDs=".concat(ids.join(",")))];
                    case 1:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("fetch manual journals batch", response);
                        }
                        if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.ManualJournals) {
                            for (_i = 0, _a = response.data.ManualJournals; _i < _a.length; _i++) {
                                journal = _a[_i];
                                result.set(journal.ManualJournalID, journal);
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
    InventoryAdjustmentSyncer.prototype.mapToRemote = function (local) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, amount, isPositive, journalLines;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(local.id)];
                    case 1:
                        existingRemoteId = _a.sent();
                        amount = Math.abs(local.quantity) * local.unitCost;
                        isPositive = local.entryType === "Positive Adjmt.";
                        // Ensure item dependency is synced
                        return [4 /*yield*/, this.ensureDependencySynced("item", local.itemId)];
                    case 2:
                        // Ensure item dependency is synced
                        _a.sent();
                        journalLines = [
                            {
                                LineAmount: isPositive ? amount : -amount,
                                AccountCode: local.inventoryAccount,
                                Description: "Inventory ".concat(isPositive ? "increase" : "decrease", ": ").concat(local.quantity, " units")
                            },
                            {
                                LineAmount: isPositive ? -amount : amount,
                                AccountCode: local.adjustmentVarianceAccount,
                                Description: "Adjustment variance: ".concat(local.quantity, " units")
                            }
                        ];
                        return [2 /*return*/, {
                                ManualJournalID: existingRemoteId,
                                Narration: "Inventory Adjustment #".concat(local.entryNumber, ": ").concat(local.entryType, " (").concat(local.quantity, " units @ ").concat(local.unitCost, "/unit)"),
                                Date: local.postingDate,
                                Status: "POSTED",
                                LineAmountTypes: "NoTax",
                                JournalLines: journalLines
                            }];
                }
            });
        });
    };
    // =================================================================
    // 6. TRANSFORMATION (Xero -> Carbon) - Not supported (push-only)
    // =================================================================
    InventoryAdjustmentSyncer.prototype.mapToLocal = function (_remote) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Inventory adjustments are push-only. Cannot map from Xero to Carbon.");
            });
        });
    };
    // =================================================================
    // 7. UPSERT LOCAL - Not supported (push-only)
    // =================================================================
    InventoryAdjustmentSyncer.prototype.upsertLocal = function (_tx, _data, _remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Inventory adjustments are push-only. Cannot upsert locally from Xero.");
            });
        });
    };
    // =================================================================
    // 8. UPSERT REMOTE (Single + Batch)
    // =================================================================
    InventoryAdjustmentSyncer.prototype.upsertRemote = function (data, localId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, journals, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(localId)];
                    case 1:
                        existingRemoteId = _d.sent();
                        journals = existingRemoteId
                            ? [__assign(__assign({}, data), { ManualJournalID: existingRemoteId })]
                            : [data];
                        return [4 /*yield*/, this.provider.request("POST", "/ManualJournals", {
                                body: JSON.stringify({ ManualJournals: journals })
                            })];
                    case 2:
                        result = _d.sent();
                        if (result.error) {
                            (0, utils_1.throwXeroApiError)(existingRemoteId
                                ? "update inventory adjustment journal"
                                : "create inventory adjustment journal", result);
                        }
                        if (!((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.ManualJournals) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.ManualJournalID)) {
                            throw new Error("Xero API returned success but no ManualJournalID was returned");
                        }
                        return [2 /*return*/, result.data.ManualJournals[0].ManualJournalID];
                }
            });
        });
    };
    InventoryAdjustmentSyncer.prototype.upsertRemoteBatch = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, journals, localIdOrder, _i, data_1, _a, localId, payload, existingRemoteId, response, i, returnedJournal, localId;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (data.length === 0)
                            return [2 /*return*/, result];
                        journals = [];
                        localIdOrder = [];
                        _i = 0, data_1 = data;
                        _c.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        _a = data_1[_i], localId = _a.localId, payload = _a.payload;
                        return [4 /*yield*/, this.getRemoteId(localId)];
                    case 2:
                        existingRemoteId = _c.sent();
                        journals.push(existingRemoteId
                            ? __assign(__assign({}, payload), { ManualJournalID: existingRemoteId })
                            : payload);
                        localIdOrder.push(localId);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.provider.request("POST", "/ManualJournals", {
                            body: JSON.stringify({ ManualJournals: journals })
                        })];
                    case 5:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("batch upsert inventory adjustment journals", response);
                        }
                        if (!((_b = response.data) === null || _b === void 0 ? void 0 : _b.ManualJournals)) {
                            throw new Error("Xero API returned success but no ManualJournals array was returned");
                        }
                        for (i = 0; i < response.data.ManualJournals.length; i++) {
                            returnedJournal = response.data.ManualJournals[i];
                            localId = localIdOrder[i];
                            if ((returnedJournal === null || returnedJournal === void 0 ? void 0 : returnedJournal.ManualJournalID) && localId) {
                                result.set(localId, returnedJournal.ManualJournalID);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return InventoryAdjustmentSyncer;
}(types_1.BaseEntitySyncer));
exports.InventoryAdjustmentSyncer = InventoryAdjustmentSyncer;
