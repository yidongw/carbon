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
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var mod_ts_1 = require("https://deno.land/std@0.205.0/datetime/mod.ts");
var date_1 = require("npm:@internationalized/date");
var nanoid_ts_1 = require("https://deno.land/x/nanoid@v3.0.0/nanoid.ts");
var mod_ts_2 = require("https://deno.land/x/zod@v3.21.4/mod.ts");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
function getExpiredEntityPolicy(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var row, blob;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db
                        .selectFrom("companySettings")
                        .select("inventoryShelfLife")
                        .where("id", "=", companyId)
                        .executeTakeFirst()];
                case 1:
                    row = _b.sent();
                    blob = row === null || row === void 0 ? void 0 : row.inventoryShelfLife;
                    return [2 /*return*/, (_a = blob === null || blob === void 0 ? void 0 : blob.expiredEntityPolicy) !== null && _a !== void 0 ? _a : "Block"];
            }
        });
    });
}
/**
 * Reject expiry-violating consumption based on the company's policy.
 * Returns the warning message when policy is 'Warn' so callers can echo
 * it back in the response. Throws an Error in all reject cases so the
 * outer try/catch surfaces it as a 400.
 */
function checkExpiredEntity(entity, policy, override) {
    if (!entity.expirationDate)
        return {};
    var todayLocal = (0, date_1.today)((0, date_1.getLocalTimeZone)());
    try {
        if ((0, date_1.parseDate)(entity.expirationDate).compare(todayLocal) >= 0)
            return {};
    }
    catch (_a) {
        return {};
    }
    if (policy === "Warn") {
        return { warning: "Transferred expired tracked entity: ".concat(entity.id) };
    }
    if (policy === "BlockWithOverride" &&
        override.allowed &&
        override.reason &&
        override.reason.trim().length > 0) {
        return {};
    }
    throw new Error("Cannot transfer expired tracked entity: ".concat(entity.id));
}
var payloadValidator = mod_ts_2.z.discriminatedUnion("type", [
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("inventory"),
        stockTransferId: mod_ts_2.z.string(),
        stockTransferLineId: mod_ts_2.z.string(),
        quantity: mod_ts_2.z.number().positive(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string(),
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("unpickInventory"),
        stockTransferId: mod_ts_2.z.string(),
        stockTransferLineId: mod_ts_2.z.string(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string(),
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("serial"),
        stockTransferId: mod_ts_2.z.string(),
        stockTransferLineId: mod_ts_2.z.string(),
        trackedEntityId: mod_ts_2.z.string(),
        fromStorageUnitId: mod_ts_2.z.string().nullable(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string(),
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("batch"),
        stockTransferId: mod_ts_2.z.string(),
        stockTransferLineId: mod_ts_2.z.string(),
        trackedEntityId: mod_ts_2.z.string(),
        fromStorageUnitId: mod_ts_2.z.string().nullable(),
        quantity: mod_ts_2.z.number().positive(),
        overrideExpired: mod_ts_2.z.boolean().optional(),
        overrideReason: mod_ts_2.z.string().optional(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string(),
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("unpickSerial"),
        stockTransferId: mod_ts_2.z.string(),
        stockTransferLineId: mod_ts_2.z.string(),
        trackedEntityId: mod_ts_2.z.string(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string(),
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("unpickBatch"),
        stockTransferId: mod_ts_2.z.string(),
        stockTransferLineId: mod_ts_2.z.string(),
        trackedEntityId: mod_ts_2.z.string(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string(),
    }),
]);
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, today, validatedPayload, expiredWarning_1, splitEntityId_1, _a, stockTransferId_1, stockTransferLineId_1, quantity_1, locationId_1, userId_1, companyId_1, stockTransferId_2, stockTransferLineId_2, locationId_2, userId_2, companyId_2, fromStorageUnitId_1, stockTransferId_3, stockTransferLineId_3, trackedEntityId_1, locationId_3, userId_3, companyId_3, fromStorageUnitId_2, stockTransferId_4, stockTransferLineId_4, trackedEntityId_2, quantity_2, overrideExpired_1, overrideReason_1, locationId_4, userId_4, companyId_4, policy_1, stockTransferId_5, stockTransferLineId_5, trackedEntityId_3, locationId_5, userId_5, companyId_5, stockTransferId_6, stockTransferLineId_6, trackedEntityId_4, locationId_6, userId_6, companyId_6, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _b.sent();
                today = (0, mod_ts_1.format)(new Date(), "yyyy-MM-dd");
                _b.label = 2;
            case 2:
                _b.trys.push([2, 17, , 18]);
                validatedPayload = payloadValidator.parse(payload);
                console.log(__assign({ function: "post-stock-transfer" }, validatedPayload));
                _a = validatedPayload.type;
                switch (_a) {
                    case "inventory": return [3 /*break*/, 3];
                    case "unpickInventory": return [3 /*break*/, 5];
                    case "serial": return [3 /*break*/, 7];
                    case "batch": return [3 /*break*/, 9];
                    case "unpickSerial": return [3 /*break*/, 12];
                    case "unpickBatch": return [3 /*break*/, 14];
                }
                return [3 /*break*/, 16];
            case 3:
                stockTransferId_1 = validatedPayload.stockTransferId, stockTransferLineId_1 = validatedPayload.stockTransferLineId, quantity_1 = validatedPayload.quantity, locationId_1 = validatedPayload.locationId, userId_1 = validatedPayload.userId, companyId_1 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var stockTransferLine, itemLedgerInserts;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("stockTransferLine")
                                        .where("id", "=", stockTransferLineId_1)
                                        .where("companyId", "=", companyId_1)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    stockTransferLine = _b.sent();
                                    itemLedgerInserts = [];
                                    // Create item ledger entries for inventory transfer
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -quantity_1,
                                        locationId: locationId_1,
                                        storageUnitId: stockTransferLine.fromStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_1,
                                        createdBy: userId_1,
                                        companyId: companyId_1,
                                    });
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: quantity_1,
                                        locationId: locationId_1,
                                        storageUnitId: stockTransferLine.toStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_1,
                                        createdBy: userId_1,
                                        companyId: companyId_1,
                                    });
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3: 
                                // Update stock transfer line with picked quantity
                                return [4 /*yield*/, trx
                                        .updateTable("stockTransferLine")
                                        .set({
                                        pickedQuantity: ((_a = stockTransferLine.pickedQuantity) !== null && _a !== void 0 ? _a : 0) + quantity_1,
                                        updatedBy: userId_1,
                                        updatedAt: new Date().toISOString(),
                                    })
                                        .where("id", "=", stockTransferLineId_1)
                                        .where("companyId", "=", companyId_1)
                                        .execute()];
                                case 4:
                                    // Update stock transfer line with picked quantity
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 4:
                _b.sent();
                return [3 /*break*/, 16];
            case 5:
                stockTransferId_2 = validatedPayload.stockTransferId, stockTransferLineId_2 = validatedPayload.stockTransferLineId, locationId_2 = validatedPayload.locationId, userId_2 = validatedPayload.userId, companyId_2 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var stockTransferLine, currentPickedQuantity, itemLedgerInserts;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("stockTransferLine")
                                        .where("id", "=", stockTransferLineId_2)
                                        .where("companyId", "=", companyId_2)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    stockTransferLine = _b.sent();
                                    currentPickedQuantity = (_a = stockTransferLine.pickedQuantity) !== null && _a !== void 0 ? _a : 0;
                                    if (!(currentPickedQuantity > 0)) return [3 /*break*/, 3];
                                    itemLedgerInserts = [];
                                    // Create reverse item ledger entries to undo the transfer
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: currentPickedQuantity, // Positive to restore inventory at from shelf
                                        locationId: locationId_2,
                                        storageUnitId: stockTransferLine.fromStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_2,
                                        createdBy: userId_2,
                                        companyId: companyId_2,
                                    });
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -currentPickedQuantity, // Negative to remove inventory from to shelf
                                        locationId: locationId_2,
                                        storageUnitId: stockTransferLine.toStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_2,
                                        createdBy: userId_2,
                                        companyId: companyId_2,
                                    });
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3: 
                                // Reset picked quantity to 0
                                return [4 /*yield*/, trx
                                        .updateTable("stockTransferLine")
                                        .set({
                                        trackedEntityId: null,
                                        pickedQuantity: 0,
                                        updatedBy: userId_2,
                                        updatedAt: new Date().toISOString(),
                                    })
                                        .where("id", "=", stockTransferLineId_2)
                                        .where("companyId", "=", companyId_2)
                                        .execute()];
                                case 4:
                                    // Reset picked quantity to 0
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 6:
                _b.sent();
                return [3 /*break*/, 16];
            case 7:
                fromStorageUnitId_1 = validatedPayload.fromStorageUnitId, stockTransferId_3 = validatedPayload.stockTransferId, stockTransferLineId_3 = validatedPayload.stockTransferLineId, trackedEntityId_1 = validatedPayload.trackedEntityId, locationId_3 = validatedPayload.locationId, userId_3 = validatedPayload.userId, companyId_3 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var stockTransferLine, itemLedgerInserts, transferActivityId;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("stockTransferLine")
                                        .where("id", "=", stockTransferLineId_3)
                                        .where("companyId", "=", companyId_3)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    stockTransferLine = _b.sent();
                                    itemLedgerInserts = [];
                                    transferActivityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: transferActivityId,
                                            type: "Transfer",
                                            sourceDocument: "Stock Transfer",
                                            sourceDocumentId: stockTransferId_3,
                                            attributes: {
                                                "Stock Transfer": stockTransferId_3,
                                                "Stock Transfer Line": stockTransferLineId_3,
                                                "From Location": locationId_3,
                                                "To Location": locationId_3,
                                                "From Shelf": stockTransferLine.fromStorageUnitId,
                                                "To Shelf": stockTransferLine.toStorageUnitId,
                                            },
                                            companyId: companyId_3,
                                            createdBy: userId_3,
                                        })
                                            .execute()];
                                case 2:
                                    _b.sent();
                                    // Record tracked entity as input to transfer
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: transferActivityId,
                                            trackedEntityId: trackedEntityId_1,
                                            quantity: 1,
                                            companyId: companyId_3,
                                            createdBy: userId_3,
                                        })
                                            .execute()];
                                case 3:
                                    // Record tracked entity as input to transfer
                                    _b.sent();
                                    // Create item ledger entries for transfer
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -1,
                                        locationId: locationId_3,
                                        storageUnitId: fromStorageUnitId_1,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_3,
                                        trackedEntityId: trackedEntityId_1,
                                        createdBy: userId_3,
                                        companyId: companyId_3,
                                    });
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: 1,
                                        locationId: locationId_3,
                                        storageUnitId: stockTransferLine.toStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_3,
                                        trackedEntityId: trackedEntityId_1,
                                        createdBy: userId_3,
                                        companyId: companyId_3,
                                    });
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5: 
                                // Update stock transfer line with picked quantity
                                return [4 /*yield*/, trx
                                        .updateTable("stockTransferLine")
                                        .set({
                                        trackedEntityId: trackedEntityId_1,
                                        fromStorageUnitId: fromStorageUnitId_1,
                                        pickedQuantity: ((_a = stockTransferLine.pickedQuantity) !== null && _a !== void 0 ? _a : 0) + 1,
                                        updatedBy: userId_3,
                                        updatedAt: new Date().toISOString(),
                                    })
                                        .where("id", "=", stockTransferLineId_3)
                                        .where("companyId", "=", companyId_3)
                                        .execute()];
                                case 6:
                                    // Update stock transfer line with picked quantity
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 8:
                _b.sent();
                return [3 /*break*/, 16];
            case 9:
                fromStorageUnitId_2 = validatedPayload.fromStorageUnitId, stockTransferId_4 = validatedPayload.stockTransferId, stockTransferLineId_4 = validatedPayload.stockTransferLineId, trackedEntityId_2 = validatedPayload.trackedEntityId, quantity_2 = validatedPayload.quantity, overrideExpired_1 = validatedPayload.overrideExpired, overrideReason_1 = validatedPayload.overrideReason, locationId_4 = validatedPayload.locationId, userId_4 = validatedPayload.userId, companyId_4 = validatedPayload.companyId;
                return [4 /*yield*/, getExpiredEntityPolicy(companyId_4)];
            case 10:
                policy_1 = _b.sent();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var stockTransferLine, trackedEntity, expiredCheck, entityQuantity, transferQuantity, itemLedgerInserts, remainingQuantity, newTrackedEntityId, splitActivityId, transferActivityId;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("stockTransferLine")
                                        .where("id", "=", stockTransferLineId_4)
                                        .where("companyId", "=", companyId_4)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    stockTransferLine = _c.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", trackedEntityId_2)
                                            .where("companyId", "=", companyId_4)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    trackedEntity = _c.sent();
                                    expiredCheck = checkExpiredEntity({ id: trackedEntity.id, expirationDate: trackedEntity.expirationDate }, policy_1, { allowed: !!overrideExpired_1, reason: overrideReason_1 !== null && overrideReason_1 !== void 0 ? overrideReason_1 : null });
                                    if (expiredCheck.warning) {
                                        expiredWarning_1 = expiredCheck.warning;
                                    }
                                    entityQuantity = Number(trackedEntity.quantity);
                                    transferQuantity = quantity_2;
                                    itemLedgerInserts = [];
                                    if (!(entityQuantity !== transferQuantity)) return [3 /*break*/, 8];
                                    remainingQuantity = entityQuantity - transferQuantity;
                                    newTrackedEntityId = (0, nanoid_ts_1.nanoid)();
                                    splitEntityId_1 = newTrackedEntityId;
                                    splitActivityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: splitActivityId,
                                            type: "Split",
                                            sourceDocument: "Stock Transfer",
                                            sourceDocumentId: stockTransferId_4,
                                            attributes: {
                                                "Original Quantity": entityQuantity,
                                                "Transfer Quantity": transferQuantity,
                                                "Remaining Quantity": remainingQuantity,
                                                "Split Entity ID": newTrackedEntityId,
                                            },
                                            companyId: companyId_4,
                                            createdBy: userId_4,
                                        })
                                            .execute()];
                                case 3:
                                    _c.sent();
                                    // Record original entity as input to split
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: splitActivityId,
                                            trackedEntityId: trackedEntityId_2,
                                            quantity: entityQuantity,
                                            companyId: companyId_4,
                                            createdBy: userId_4,
                                        })
                                            .execute()];
                                case 4:
                                    // Record original entity as input to split
                                    _c.sent();
                                    // Create new tracked entity for remaining quantity
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedEntity")
                                            .values({
                                            id: newTrackedEntityId,
                                            readableId: trackedEntity.readableId,
                                            sourceDocument: trackedEntity.sourceDocument,
                                            sourceDocumentId: trackedEntity.sourceDocumentId,
                                            sourceDocumentReadableId: trackedEntity.sourceDocumentReadableId,
                                            quantity: remainingQuantity,
                                            status: "Available",
                                            attributes: trackedEntity.attributes,
                                            itemId: (_a = trackedEntity.itemId) !== null && _a !== void 0 ? _a : null,
                                            expirationDate: (_b = trackedEntity.expirationDate) !== null && _b !== void 0 ? _b : null,
                                            companyId: companyId_4,
                                            createdBy: userId_4,
                                        })
                                            .execute()];
                                case 5:
                                    // Create new tracked entity for remaining quantity
                                    _c.sent();
                                    // Record outputs from split
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values([
                                            {
                                                trackedActivityId: splitActivityId,
                                                trackedEntityId: newTrackedEntityId,
                                                quantity: remainingQuantity,
                                                companyId: companyId_4,
                                                createdBy: userId_4,
                                            },
                                            {
                                                trackedActivityId: splitActivityId,
                                                trackedEntityId: trackedEntityId_2,
                                                quantity: transferQuantity,
                                                companyId: companyId_4,
                                                createdBy: userId_4,
                                            },
                                        ])
                                            .execute()];
                                case 6:
                                    // Record outputs from split
                                    _c.sent();
                                    // Update original entity with split reference and new quantity
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            quantity: transferQuantity,
                                            attributes: __assign(__assign({}, trackedEntity.attributes), { "Split Entity ID": newTrackedEntityId }),
                                        })
                                            .where("id", "=", trackedEntityId_2)
                                            .execute()];
                                case 7:
                                    // Update original entity with split reference and new quantity
                                    _c.sent();
                                    // Create item ledger entries for split
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -entityQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: fromStorageUnitId_2,
                                        entryType: "Negative Adjmt.",
                                        documentType: "Batch Split",
                                        documentId: splitActivityId,
                                        trackedEntityId: trackedEntityId_2,
                                        createdBy: userId_4,
                                        companyId: companyId_4,
                                    }, {
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: transferQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: fromStorageUnitId_2,
                                        entryType: "Positive Adjmt.",
                                        documentType: "Batch Split",
                                        documentId: splitActivityId,
                                        trackedEntityId: trackedEntityId_2,
                                        createdBy: userId_4,
                                        companyId: companyId_4,
                                    }, {
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: remainingQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: fromStorageUnitId_2,
                                        entryType: "Positive Adjmt.",
                                        documentType: "Batch Split",
                                        documentId: splitActivityId,
                                        trackedEntityId: newTrackedEntityId,
                                        createdBy: userId_4,
                                        companyId: companyId_4,
                                    });
                                    _c.label = 8;
                                case 8:
                                    transferActivityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: transferActivityId,
                                            type: "Transfer",
                                            sourceDocument: "Stock Transfer",
                                            sourceDocumentId: stockTransferId_4,
                                            attributes: {
                                                "Stock Transfer": stockTransferId_4,
                                                "Stock Transfer Line": stockTransferLineId_4,
                                                "From Location": locationId_4,
                                                "To Location": locationId_4,
                                                "From Shelf": stockTransferLine.fromStorageUnitId,
                                                "To Shelf": stockTransferLine.toStorageUnitId,
                                            },
                                            companyId: companyId_4,
                                            createdBy: userId_4,
                                        })
                                            .execute()];
                                case 9:
                                    _c.sent();
                                    // Record tracked entity as input to transfer
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: transferActivityId,
                                            trackedEntityId: trackedEntityId_2,
                                            quantity: transferQuantity,
                                            companyId: companyId_4,
                                            createdBy: userId_4,
                                        })
                                            .execute()];
                                case 10:
                                    // Record tracked entity as input to transfer
                                    _c.sent();
                                    // Update tracked entity status to consumed
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            status: "Consumed",
                                        })
                                            .where("id", "=", trackedEntityId_2)
                                            .execute()];
                                case 11:
                                    // Update tracked entity status to consumed
                                    _c.sent();
                                    // Create item ledger entries for transfer
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -transferQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: fromStorageUnitId_2,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_4,
                                        trackedEntityId: trackedEntityId_2,
                                        createdBy: userId_4,
                                        companyId: companyId_4,
                                    }, {
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: transferQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: stockTransferLine.toStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_4,
                                        trackedEntityId: trackedEntityId_2,
                                        createdBy: userId_4,
                                        companyId: companyId_4,
                                    });
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 13];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 12:
                                    _c.sent();
                                    _c.label = 13;
                                case 13: 
                                // Update stock transfer line with picked quantity
                                return [4 /*yield*/, trx
                                        .updateTable("stockTransferLine")
                                        .set({
                                        trackedEntityId: trackedEntityId_2,
                                        fromStorageUnitId: fromStorageUnitId_2,
                                        pickedQuantity: transferQuantity,
                                        updatedBy: userId_4,
                                        updatedAt: new Date().toISOString(),
                                    })
                                        .where("id", "=", stockTransferLineId_4)
                                        .where("companyId", "=", companyId_4)
                                        .execute()];
                                case 14:
                                    // Update stock transfer line with picked quantity
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 11:
                _b.sent();
                return [3 /*break*/, 16];
            case 12:
                stockTransferId_5 = validatedPayload.stockTransferId, stockTransferLineId_5 = validatedPayload.stockTransferLineId, trackedEntityId_3 = validatedPayload.trackedEntityId, locationId_5 = validatedPayload.locationId, userId_5 = validatedPayload.userId, companyId_5 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var stockTransferLine, trackedEntity, transferActivity, itemLedgerInserts;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("stockTransferLine")
                                        .where("id", "=", stockTransferLineId_5)
                                        .where("companyId", "=", companyId_5)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    stockTransferLine = _b.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", trackedEntityId_3)
                                            .where("companyId", "=", companyId_5)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    trackedEntity = _b.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedActivity")
                                            .innerJoin("trackedActivityInput", "trackedActivity.id", "trackedActivityInput.trackedActivityId")
                                            .where("trackedActivity.type", "=", "Transfer")
                                            .where("trackedActivity.sourceDocument", "=", "Stock Transfer")
                                            .where("trackedActivity.sourceDocumentId", "=", stockTransferId_5)
                                            .where("trackedActivityInput.trackedEntityId", "=", trackedEntityId_3)
                                            .where("trackedActivity.companyId", "=", companyId_5)
                                            .selectAll("trackedActivity")
                                            .executeTakeFirstOrThrow()];
                                case 3:
                                    transferActivity = _b.sent();
                                    itemLedgerInserts = [];
                                    // Create reverse item ledger entries to undo the transfer
                                    // First, remove the entity from the destination shelf (toStorageUnitId)
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -1, // Negative to remove inventory from to shelf
                                        locationId: locationId_5,
                                        storageUnitId: stockTransferLine.toStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_5,
                                        trackedEntityId: trackedEntityId_3,
                                        createdBy: userId_5,
                                        companyId: companyId_5,
                                    });
                                    // Then, restore the entity to the source shelf (fromStorageUnitId)
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: 1, // Positive to restore inventory at from shelf
                                        locationId: locationId_5,
                                        storageUnitId: stockTransferLine.fromStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_5,
                                        trackedEntityId: trackedEntityId_3,
                                        createdBy: userId_5,
                                        companyId: companyId_5,
                                    });
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5: 
                                // Delete the tracked activity and its related records
                                return [4 /*yield*/, trx
                                        .deleteFrom("trackedActivityInput")
                                        .where("trackedActivityId", "=", transferActivity.id)
                                        .execute()];
                                case 6:
                                    // Delete the tracked activity and its related records
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .deleteFrom("trackedActivity")
                                            .where("id", "=", transferActivity.id)
                                            .execute()];
                                case 7:
                                    _b.sent();
                                    // Update tracked entity status back to available and restore shelf location
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            status: "Available",
                                            attributes: __assign(__assign({}, trackedEntity.attributes), { Shelf: stockTransferLine.fromStorageUnitId }),
                                        })
                                            .where("id", "=", trackedEntityId_3)
                                            .execute()];
                                case 8:
                                    // Update tracked entity status back to available and restore shelf location
                                    _b.sent();
                                    // Update stock transfer line with reduced picked quantity
                                    return [4 /*yield*/, trx
                                            .updateTable("stockTransferLine")
                                            .set({
                                            trackedEntityId: null,
                                            pickedQuantity: Math.max(0, ((_a = stockTransferLine.pickedQuantity) !== null && _a !== void 0 ? _a : 0) - 1),
                                            updatedBy: userId_5,
                                            updatedAt: new Date().toISOString(),
                                        })
                                            .where("id", "=", stockTransferLineId_5)
                                            .where("companyId", "=", companyId_5)
                                            .execute()];
                                case 9:
                                    // Update stock transfer line with reduced picked quantity
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 13:
                _b.sent();
                return [3 /*break*/, 16];
            case 14:
                stockTransferId_6 = validatedPayload.stockTransferId, stockTransferLineId_6 = validatedPayload.stockTransferLineId, trackedEntityId_4 = validatedPayload.trackedEntityId, locationId_6 = validatedPayload.locationId, userId_6 = validatedPayload.userId, companyId_6 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var stockTransferLine, trackedEntity, transferActivity, transferQuantity, itemLedgerInserts, splitEntityId, originalEntity, originalQuantity, remainingQuantity, splitActivity, finalTrackedEntityId;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("stockTransferLine")
                                        .where("id", "=", stockTransferLineId_6)
                                        .where("companyId", "=", companyId_6)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    stockTransferLine = _d.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", trackedEntityId_4)
                                            .where("companyId", "=", companyId_6)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    trackedEntity = _d.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedActivity")
                                            .innerJoin("trackedActivityInput", "trackedActivity.id", "trackedActivityInput.trackedActivityId")
                                            .where("trackedActivity.type", "=", "Transfer")
                                            .where("trackedActivity.sourceDocument", "=", "Stock Transfer")
                                            .where("trackedActivity.sourceDocumentId", "=", stockTransferId_6)
                                            .where("trackedActivityInput.trackedEntityId", "=", trackedEntityId_4)
                                            .where("trackedActivity.companyId", "=", companyId_6)
                                            .selectAll("trackedActivity")
                                            .executeTakeFirstOrThrow()];
                                case 3:
                                    transferActivity = _d.sent();
                                    transferQuantity = Number(trackedEntity.quantity);
                                    itemLedgerInserts = [];
                                    splitEntityId = (_a = trackedEntity.attributes) === null || _a === void 0 ? void 0 : _a["Split Entity ID"];
                                    if (!splitEntityId) return [3 /*break*/, 11];
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", splitEntityId)
                                            .where("companyId", "=", companyId_6)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 4:
                                    originalEntity = _d.sent();
                                    originalQuantity = Number(originalEntity.quantity) + transferQuantity;
                                    remainingQuantity = (_b = trackedEntity.attributes) === null || _b === void 0 ? void 0 : _b["Remaining Quantity"];
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedActivity")
                                            .where("type", "=", "Split")
                                            .where("sourceDocument", "=", "Stock Transfer")
                                            .where("sourceDocumentId", "=", stockTransferId_6)
                                            .where("companyId", "=", companyId_6)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 5:
                                    splitActivity = _d.sent();
                                    // Update original entity with merged quantity and restore shelf location
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            status: "Consumed",
                                            quantity: 0,
                                        })
                                            .where("id", "=", splitEntityId)
                                            .execute()];
                                case 6:
                                    // Update original entity with merged quantity and restore shelf location
                                    _d.sent();
                                    // Mark the split entity as consumed (don't delete it)
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            status: "Available",
                                            quantity: originalQuantity,
                                        })
                                            .where("id", "=", trackedEntityId_4)
                                            .execute()];
                                case 7:
                                    // Mark the split entity as consumed (don't delete it)
                                    _d.sent();
                                    // Create item ledger entries for merge
                                    // Both entities are on the fromStorageUnitId during the merge operation
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: originalQuantity, // zero out the split entity
                                        locationId: locationId_6,
                                        storageUnitId: stockTransferLine.fromStorageUnitId,
                                        entryType: "Positive Adjmt.",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_6,
                                        trackedEntityId: trackedEntityId_4,
                                        createdBy: userId_6,
                                        companyId: companyId_6,
                                    }, {
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -transferQuantity, // Positive to restore to original entity
                                        locationId: locationId_6,
                                        storageUnitId: stockTransferLine.toStorageUnitId, // Both entities are on the source shelf
                                        entryType: "Negative Adjmt.",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_6,
                                        trackedEntityId: trackedEntityId_4,
                                        createdBy: userId_6,
                                        companyId: companyId_6,
                                    }, {
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -(originalQuantity - transferQuantity), // Positive to restore to original entity
                                        locationId: locationId_6,
                                        storageUnitId: stockTransferLine.fromStorageUnitId, // Both entities are on the source shelf
                                        entryType: "Negative Adjmt.",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_6,
                                        trackedEntityId: splitEntityId,
                                        createdBy: userId_6,
                                        companyId: companyId_6,
                                    });
                                    // Delete split activity records
                                    return [4 /*yield*/, trx
                                            .deleteFrom("trackedActivityOutput")
                                            .where("trackedActivityId", "=", splitActivity.id)
                                            .execute()];
                                case 8:
                                    // Delete split activity records
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .deleteFrom("trackedActivityInput")
                                            .where("trackedActivityId", "=", splitActivity.id)
                                            .execute()];
                                case 9:
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .deleteFrom("trackedActivity")
                                            .where("id", "=", splitActivity.id)
                                            .execute()];
                                case 10:
                                    _d.sent();
                                    return [3 /*break*/, 13];
                                case 11: 
                                // This was a direct transfer, just restore the entity and shelf location
                                return [4 /*yield*/, trx
                                        .updateTable("trackedEntity")
                                        .set({
                                        status: "Available",
                                        attributes: __assign(__assign({}, trackedEntity.attributes), { Shelf: stockTransferLine.fromStorageUnitId }),
                                    })
                                        .where("id", "=", trackedEntityId_4)
                                        .execute()];
                                case 12:
                                    // This was a direct transfer, just restore the entity and shelf location
                                    _d.sent();
                                    finalTrackedEntityId = splitEntityId || trackedEntityId_4;
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: transferQuantity, // Positive to restore inventory at from shelf
                                        locationId: locationId_6,
                                        storageUnitId: stockTransferLine.fromStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_6,
                                        trackedEntityId: finalTrackedEntityId,
                                        createdBy: userId_6,
                                        companyId: companyId_6,
                                    });
                                    itemLedgerInserts.push({
                                        postingDate: today,
                                        itemId: stockTransferLine.itemId,
                                        quantity: -transferQuantity, // Negative to remove inventory from to shelf
                                        locationId: locationId_6,
                                        storageUnitId: stockTransferLine.toStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: stockTransferId_6,
                                        trackedEntityId: finalTrackedEntityId,
                                        createdBy: userId_6,
                                        companyId: companyId_6,
                                    });
                                    _d.label = 13;
                                case 13:
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 14:
                                    _d.sent();
                                    _d.label = 15;
                                case 15: 
                                // Delete the transfer activity and its related records
                                return [4 /*yield*/, trx
                                        .deleteFrom("trackedActivityInput")
                                        .where("trackedActivityId", "=", transferActivity.id)
                                        .execute()];
                                case 16:
                                    // Delete the transfer activity and its related records
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .deleteFrom("trackedActivity")
                                            .where("id", "=", transferActivity.id)
                                            .execute()];
                                case 17:
                                    _d.sent();
                                    // Update stock transfer line with reduced picked quantity
                                    return [4 /*yield*/, trx
                                            .updateTable("stockTransferLine")
                                            .set({
                                            trackedEntityId: null,
                                            pickedQuantity: Math.max(0, ((_c = stockTransferLine.pickedQuantity) !== null && _c !== void 0 ? _c : 0) - transferQuantity),
                                            updatedBy: userId_6,
                                            updatedAt: new Date().toISOString(),
                                        })
                                            .where("id", "=", stockTransferLineId_6)
                                            .where("companyId", "=", companyId_6)
                                            .execute()];
                                case 18:
                                    // Update stock transfer line with reduced picked quantity
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 15:
                _b.sent();
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                    warning: expiredWarning_1,
                    splitEntityId: splitEntityId_1,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 17:
                err_1 = _b.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 18: return [2 /*return*/];
        }
    });
}); });
