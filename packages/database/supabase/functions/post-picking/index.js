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
// A pick is a TRANSFER of material from the warehouse source shelf
// (pickingListLine.storageUnitId) to the work center's lineside shelf
// (pickingListLine.toStorageUnitId). Consumption happens later at production,
// which is why we also point jobMaterial.storageUnitId at the lineside shelf.
var payloadValidator = mod_ts_2.z.discriminatedUnion("type", [
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("inventory"),
        pickingListId: mod_ts_2.z.string(),
        pickingListLineId: mod_ts_2.z.string(),
        quantity: mod_ts_2.z.number().positive(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string()
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("unpickInventory"),
        pickingListId: mod_ts_2.z.string(),
        pickingListLineId: mod_ts_2.z.string(),
        quantity: mod_ts_2.z.number().positive(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string()
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("serial"),
        pickingListId: mod_ts_2.z.string(),
        pickingListLineId: mod_ts_2.z.string(),
        trackedEntityId: mod_ts_2.z.string(),
        fromStorageUnitId: mod_ts_2.z.string().nullable(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string()
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("batch"),
        pickingListId: mod_ts_2.z.string(),
        pickingListLineId: mod_ts_2.z.string(),
        trackedEntityId: mod_ts_2.z.string(),
        fromStorageUnitId: mod_ts_2.z.string().nullable(),
        quantity: mod_ts_2.z.number().positive(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string()
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("unpickSerial"),
        pickingListId: mod_ts_2.z.string(),
        pickingListLineId: mod_ts_2.z.string(),
        trackedEntityId: mod_ts_2.z.string(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string()
    }),
    mod_ts_2.z.object({
        type: mod_ts_2.z.literal("unpickBatch"),
        pickingListId: mod_ts_2.z.string(),
        pickingListLineId: mod_ts_2.z.string(),
        trackedEntityId: mod_ts_2.z.string(),
        locationId: mod_ts_2.z.string(),
        userId: mod_ts_2.z.string(),
        companyId: mod_ts_2.z.string()
    })
]);
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var today, payload, validatedPayload, splitEntityId_1, _a, pickingListId_1, pickingListLineId_1, quantity_1, locationId_1, userId_1, companyId_1, pickingListId_2, pickingListLineId_2, quantity_2, locationId_2, userId_2, companyId_2, pickingListId_3, pickingListLineId_3, trackedEntityId_1, fromStorageUnitId_1, locationId_3, userId_3, companyId_3, pickingListId_4, pickingListLineId_4, trackedEntityId_2, fromStorageUnitId_2, quantity_3, locationId_4, userId_4, companyId_4, pickingListId_5, pickingListLineId_5, trackedEntityId_3, locationId_5, userId_5, companyId_5, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                today = (0, mod_ts_1.format)((0, date_1.today)((0, date_1.getLocalTimeZone)()).toDate((0, date_1.getLocalTimeZone)()), "yyyy-MM-dd");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 14, , 15]);
                return [4 /*yield*/, req.json()];
            case 2:
                payload = _b.sent();
                validatedPayload = payloadValidator.parse(payload);
                _a = validatedPayload.type;
                switch (_a) {
                    case "inventory": return [3 /*break*/, 3];
                    case "unpickInventory": return [3 /*break*/, 5];
                    case "serial": return [3 /*break*/, 7];
                    case "batch": return [3 /*break*/, 9];
                    case "unpickSerial": return [3 /*break*/, 11];
                    case "unpickBatch": return [3 /*break*/, 11];
                }
                return [3 /*break*/, 13];
            case 3:
                pickingListId_1 = validatedPayload.pickingListId, pickingListLineId_1 = validatedPayload.pickingListLineId, quantity_1 = validatedPayload.quantity, locationId_1 = validatedPayload.locationId, userId_1 = validatedPayload.userId, companyId_1 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var line, inserts;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("pickingListLine")
                                        .where("id", "=", pickingListLineId_1)
                                        .where("companyId", "=", companyId_1)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    line = _b.sent();
                                    inserts = [
                                        {
                                            postingDate: today,
                                            itemId: line.itemId,
                                            quantity: -quantity_1,
                                            locationId: locationId_1,
                                            storageUnitId: line.storageUnitId,
                                            entryType: "Transfer",
                                            documentType: "Direct Transfer",
                                            documentId: pickingListId_1,
                                            createdBy: userId_1,
                                            companyId: companyId_1
                                        },
                                        {
                                            postingDate: today,
                                            itemId: line.itemId,
                                            quantity: quantity_1,
                                            locationId: locationId_1,
                                            storageUnitId: line.toStorageUnitId,
                                            entryType: "Transfer",
                                            documentType: "Direct Transfer",
                                            documentId: pickingListId_1,
                                            createdBy: userId_1,
                                            companyId: companyId_1
                                        }
                                    ];
                                    return [4 /*yield*/, trx.insertInto("itemLedger").values(inserts).execute()];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("pickingListLine")
                                            .set({
                                            quantityPicked: Number((_a = line.quantityPicked) !== null && _a !== void 0 ? _a : 0) + quantity_1,
                                            status: "Picked",
                                            updatedBy: userId_1,
                                            updatedAt: new Date().toISOString()
                                        })
                                            .where("id", "=", pickingListLineId_1)
                                            .where("companyId", "=", companyId_1)
                                            .execute()];
                                case 3:
                                    _b.sent();
                                    // Production consumes from where the material now physically sits.
                                    return [4 /*yield*/, pointJobMaterialAtLineside(trx, line, userId_1)];
                                case 4:
                                    // Production consumes from where the material now physically sits.
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 4:
                _b.sent();
                return [3 /*break*/, 13];
            case 5:
                pickingListId_2 = validatedPayload.pickingListId, pickingListLineId_2 = validatedPayload.pickingListLineId, quantity_2 = validatedPayload.quantity, locationId_2 = validatedPayload.locationId, userId_2 = validatedPayload.userId, companyId_2 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var line, inserts;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("pickingListLine")
                                        .where("id", "=", pickingListLineId_2)
                                        .where("companyId", "=", companyId_2)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    line = _b.sent();
                                    inserts = [
                                        {
                                            postingDate: today,
                                            itemId: line.itemId,
                                            quantity: -quantity_2,
                                            locationId: locationId_2,
                                            storageUnitId: line.toStorageUnitId,
                                            entryType: "Transfer",
                                            documentType: "Direct Transfer",
                                            documentId: pickingListId_2,
                                            createdBy: userId_2,
                                            companyId: companyId_2
                                        },
                                        {
                                            postingDate: today,
                                            itemId: line.itemId,
                                            quantity: quantity_2,
                                            locationId: locationId_2,
                                            storageUnitId: line.storageUnitId,
                                            entryType: "Transfer",
                                            documentType: "Direct Transfer",
                                            documentId: pickingListId_2,
                                            createdBy: userId_2,
                                            companyId: companyId_2
                                        }
                                    ];
                                    return [4 /*yield*/, trx.insertInto("itemLedger").values(inserts).execute()];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("pickingListLine")
                                            .set({
                                            quantityPicked: Math.max(0, Number((_a = line.quantityPicked) !== null && _a !== void 0 ? _a : 0) - quantity_2),
                                            status: "Pending",
                                            updatedBy: userId_2,
                                            updatedAt: new Date().toISOString()
                                        })
                                            .where("id", "=", pickingListLineId_2)
                                            .where("companyId", "=", companyId_2)
                                            .execute()];
                                case 3:
                                    _b.sent();
                                    // Restore the warehouse source as the consumption point.
                                    return [4 /*yield*/, restoreJobMaterialSource(trx, line, userId_2)];
                                case 4:
                                    // Restore the warehouse source as the consumption point.
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 6:
                _b.sent();
                return [3 /*break*/, 13];
            case 7:
                pickingListId_3 = validatedPayload.pickingListId, pickingListLineId_3 = validatedPayload.pickingListLineId, trackedEntityId_1 = validatedPayload.trackedEntityId, fromStorageUnitId_1 = validatedPayload.fromStorageUnitId, locationId_3 = validatedPayload.locationId, userId_3 = validatedPayload.userId, companyId_3 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var line, activityId, inserts;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("pickingListLine")
                                        .where("id", "=", pickingListLineId_3)
                                        .where("companyId", "=", companyId_3)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    line = _b.sent();
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Pick",
                                            sourceDocument: "Picking List",
                                            sourceDocumentId: pickingListId_3,
                                            attributes: {
                                                "Picking List": pickingListId_3,
                                                "Picking List Line": pickingListLineId_3,
                                                "From Shelf": fromStorageUnitId_1,
                                                "To Shelf": line.toStorageUnitId
                                            },
                                            companyId: companyId_3,
                                            createdBy: userId_3
                                        })
                                            .execute()];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: activityId,
                                            trackedEntityId: trackedEntityId_1,
                                            quantity: 1,
                                            companyId: companyId_3,
                                            createdBy: userId_3
                                        })
                                            .execute()];
                                case 3:
                                    _b.sent();
                                    inserts = [
                                        {
                                            postingDate: today,
                                            itemId: line.itemId,
                                            quantity: -1,
                                            locationId: locationId_3,
                                            storageUnitId: fromStorageUnitId_1,
                                            entryType: "Transfer",
                                            documentType: "Direct Transfer",
                                            documentId: pickingListId_3,
                                            trackedEntityId: trackedEntityId_1,
                                            createdBy: userId_3,
                                            companyId: companyId_3
                                        },
                                        {
                                            postingDate: today,
                                            itemId: line.itemId,
                                            quantity: 1,
                                            locationId: locationId_3,
                                            storageUnitId: line.toStorageUnitId,
                                            entryType: "Transfer",
                                            documentType: "Direct Transfer",
                                            documentId: pickingListId_3,
                                            trackedEntityId: trackedEntityId_1,
                                            createdBy: userId_3,
                                            companyId: companyId_3
                                        }
                                    ];
                                    return [4 /*yield*/, trx.insertInto("itemLedger").values(inserts).execute()];
                                case 4:
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("pickingListLine")
                                            .set({
                                            quantityPicked: Number((_a = line.quantityPicked) !== null && _a !== void 0 ? _a : 0) + 1,
                                            status: "Picked",
                                            updatedBy: userId_3,
                                            updatedAt: new Date().toISOString()
                                        })
                                            .where("id", "=", pickingListLineId_3)
                                            .where("companyId", "=", companyId_3)
                                            .execute()];
                                case 5:
                                    _b.sent();
                                    // Record which lot this line picked (drives the line's picked-lot
                                    // display, unpick, and the allocation-dedup in the picker).
                                    return [4 /*yield*/, trx
                                            .insertInto("pickingListLineTrackedEntity")
                                            .values({
                                            pickingListLineId: pickingListLineId_3,
                                            trackedEntityId: trackedEntityId_1,
                                            quantity: 1,
                                            quantityPicked: 1
                                        })
                                            .onConflict(function (oc) {
                                            return oc.columns(["pickingListLineId", "trackedEntityId"]).doUpdateSet({
                                                quantity: function (eb) { return eb("pickingListLineTrackedEntity.quantity", "+", 1); },
                                                quantityPicked: function (eb) {
                                                    return eb("pickingListLineTrackedEntity.quantityPicked", "+", 1);
                                                }
                                            });
                                        })
                                            .execute()];
                                case 6:
                                    // Record which lot this line picked (drives the line's picked-lot
                                    // display, unpick, and the allocation-dedup in the picker).
                                    _b.sent();
                                    return [4 /*yield*/, pointJobMaterialAtLineside(trx, line, userId_3)];
                                case 7:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 8:
                _b.sent();
                return [3 /*break*/, 13];
            case 9:
                pickingListId_4 = validatedPayload.pickingListId, pickingListLineId_4 = validatedPayload.pickingListLineId, trackedEntityId_2 = validatedPayload.trackedEntityId, fromStorageUnitId_2 = validatedPayload.fromStorageUnitId, quantity_3 = validatedPayload.quantity, locationId_4 = validatedPayload.locationId, userId_4 = validatedPayload.userId, companyId_4 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var line, trackedEntity, entityQuantity, transferQuantity, inserts, remainingQuantity, newTrackedEntityId, splitActivityId, activityId;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("pickingListLine")
                                        .where("id", "=", pickingListLineId_4)
                                        .where("companyId", "=", companyId_4)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    line = _d.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", trackedEntityId_2)
                                            .where("companyId", "=", companyId_4)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    trackedEntity = _d.sent();
                                    entityQuantity = Number(trackedEntity.quantity);
                                    transferQuantity = quantity_3;
                                    inserts = [];
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
                                            sourceDocument: "Picking List",
                                            sourceDocumentId: pickingListId_4,
                                            attributes: {
                                                "Original Quantity": entityQuantity,
                                                "Transfer Quantity": transferQuantity,
                                                "Remaining Quantity": remainingQuantity,
                                                "Split Entity ID": newTrackedEntityId
                                            },
                                            companyId: companyId_4,
                                            createdBy: userId_4
                                        })
                                            .execute()];
                                case 3:
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: splitActivityId,
                                            trackedEntityId: trackedEntityId_2,
                                            quantity: entityQuantity,
                                            companyId: companyId_4,
                                            createdBy: userId_4
                                        })
                                            .execute()];
                                case 4:
                                    _d.sent();
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
                                            createdBy: userId_4
                                        })
                                            .execute()];
                                case 5:
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values([
                                            {
                                                trackedActivityId: splitActivityId,
                                                trackedEntityId: newTrackedEntityId,
                                                quantity: remainingQuantity,
                                                companyId: companyId_4,
                                                createdBy: userId_4
                                            },
                                            {
                                                trackedActivityId: splitActivityId,
                                                trackedEntityId: trackedEntityId_2,
                                                quantity: transferQuantity,
                                                companyId: companyId_4,
                                                createdBy: userId_4
                                            }
                                        ])
                                            .execute()];
                                case 6:
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            quantity: transferQuantity,
                                            attributes: __assign(__assign({}, trackedEntity.attributes), { "Split Entity ID": newTrackedEntityId })
                                        })
                                            .where("id", "=", trackedEntityId_2)
                                            .execute()];
                                case 7:
                                    _d.sent();
                                    inserts.push({
                                        postingDate: today,
                                        itemId: line.itemId,
                                        quantity: -entityQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: fromStorageUnitId_2,
                                        entryType: "Negative Adjmt.",
                                        documentType: "Batch Split",
                                        documentId: splitActivityId,
                                        trackedEntityId: trackedEntityId_2,
                                        createdBy: userId_4,
                                        companyId: companyId_4
                                    }, {
                                        postingDate: today,
                                        itemId: line.itemId,
                                        quantity: transferQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: fromStorageUnitId_2,
                                        entryType: "Positive Adjmt.",
                                        documentType: "Batch Split",
                                        documentId: splitActivityId,
                                        trackedEntityId: trackedEntityId_2,
                                        createdBy: userId_4,
                                        companyId: companyId_4
                                    }, {
                                        postingDate: today,
                                        itemId: line.itemId,
                                        quantity: remainingQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: fromStorageUnitId_2,
                                        entryType: "Positive Adjmt.",
                                        documentType: "Batch Split",
                                        documentId: splitActivityId,
                                        trackedEntityId: newTrackedEntityId,
                                        createdBy: userId_4,
                                        companyId: companyId_4
                                    });
                                    _d.label = 8;
                                case 8:
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Pick",
                                            sourceDocument: "Picking List",
                                            sourceDocumentId: pickingListId_4,
                                            attributes: {
                                                "Picking List": pickingListId_4,
                                                "Picking List Line": pickingListLineId_4,
                                                "From Shelf": fromStorageUnitId_2,
                                                "To Shelf": line.toStorageUnitId
                                            },
                                            companyId: companyId_4,
                                            createdBy: userId_4
                                        })
                                            .execute()];
                                case 9:
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: activityId,
                                            trackedEntityId: trackedEntityId_2,
                                            quantity: transferQuantity,
                                            companyId: companyId_4,
                                            createdBy: userId_4
                                        })
                                            .execute()];
                                case 10:
                                    _d.sent();
                                    // A pick MOVES the batch — it stays Available (consumed at production).
                                    inserts.push({
                                        postingDate: today,
                                        itemId: line.itemId,
                                        quantity: -transferQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: fromStorageUnitId_2,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: pickingListId_4,
                                        trackedEntityId: trackedEntityId_2,
                                        createdBy: userId_4,
                                        companyId: companyId_4
                                    }, {
                                        postingDate: today,
                                        itemId: line.itemId,
                                        quantity: transferQuantity,
                                        locationId: locationId_4,
                                        storageUnitId: line.toStorageUnitId,
                                        entryType: "Transfer",
                                        documentType: "Direct Transfer",
                                        documentId: pickingListId_4,
                                        trackedEntityId: trackedEntityId_2,
                                        createdBy: userId_4,
                                        companyId: companyId_4
                                    });
                                    return [4 /*yield*/, trx.insertInto("itemLedger").values(inserts).execute()];
                                case 11:
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("pickingListLine")
                                            .set({
                                            quantityPicked: Number((_c = line.quantityPicked) !== null && _c !== void 0 ? _c : 0) + transferQuantity,
                                            status: "Picked",
                                            updatedBy: userId_4,
                                            updatedAt: new Date().toISOString()
                                        })
                                            .where("id", "=", pickingListLineId_4)
                                            .where("companyId", "=", companyId_4)
                                            .execute()];
                                case 12:
                                    _d.sent();
                                    // Record which lot this line picked (drives picked-lot display,
                                    // unpick, and the picker's allocation-dedup).
                                    return [4 /*yield*/, trx
                                            .insertInto("pickingListLineTrackedEntity")
                                            .values({
                                            pickingListLineId: pickingListLineId_4,
                                            trackedEntityId: trackedEntityId_2,
                                            quantity: transferQuantity,
                                            quantityPicked: transferQuantity
                                        })
                                            .onConflict(function (oc) {
                                            return oc.columns(["pickingListLineId", "trackedEntityId"]).doUpdateSet({
                                                quantity: function (eb) {
                                                    return eb("pickingListLineTrackedEntity.quantity", "+", transferQuantity);
                                                },
                                                quantityPicked: function (eb) {
                                                    return eb("pickingListLineTrackedEntity.quantityPicked", "+", transferQuantity);
                                                }
                                            });
                                        })
                                            .execute()];
                                case 13:
                                    // Record which lot this line picked (drives picked-lot display,
                                    // unpick, and the picker's allocation-dedup).
                                    _d.sent();
                                    return [4 /*yield*/, pointJobMaterialAtLineside(trx, line, userId_4)];
                                case 14:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 10:
                _b.sent();
                return [3 /*break*/, 13];
            case 11:
                pickingListId_5 = validatedPayload.pickingListId, pickingListLineId_5 = validatedPayload.pickingListLineId, trackedEntityId_3 = validatedPayload.trackedEntityId, locationId_5 = validatedPayload.locationId, userId_5 = validatedPayload.userId, companyId_5 = validatedPayload.companyId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var line, trackedEntity, qty, activity, inserts;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("pickingListLine")
                                        .where("id", "=", pickingListLineId_5)
                                        .where("companyId", "=", companyId_5)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    line = _b.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", trackedEntityId_3)
                                            .where("companyId", "=", companyId_5)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    trackedEntity = _b.sent();
                                    qty = Number(trackedEntity.quantity);
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedActivity")
                                            .innerJoin("trackedActivityInput", "trackedActivity.id", "trackedActivityInput.trackedActivityId")
                                            .where("trackedActivity.type", "=", "Pick")
                                            .where("trackedActivity.sourceDocument", "=", "Picking List")
                                            .where("trackedActivity.sourceDocumentId", "=", pickingListId_5)
                                            .where("trackedActivityInput.trackedEntityId", "=", trackedEntityId_3)
                                            .where("trackedActivity.companyId", "=", companyId_5)
                                            .selectAll("trackedActivity")
                                            .executeTakeFirstOrThrow()];
                                case 3:
                                    activity = _b.sent();
                                    inserts = [
                                        {
                                            postingDate: today,
                                            itemId: line.itemId,
                                            quantity: -qty,
                                            locationId: locationId_5,
                                            storageUnitId: line.toStorageUnitId,
                                            entryType: "Transfer",
                                            documentType: "Direct Transfer",
                                            documentId: pickingListId_5,
                                            trackedEntityId: trackedEntityId_3,
                                            createdBy: userId_5,
                                            companyId: companyId_5
                                        },
                                        {
                                            postingDate: today,
                                            itemId: line.itemId,
                                            quantity: qty,
                                            locationId: locationId_5,
                                            storageUnitId: line.storageUnitId,
                                            entryType: "Transfer",
                                            documentType: "Direct Transfer",
                                            documentId: pickingListId_5,
                                            trackedEntityId: trackedEntityId_3,
                                            createdBy: userId_5,
                                            companyId: companyId_5
                                        }
                                    ];
                                    return [4 /*yield*/, trx.insertInto("itemLedger").values(inserts).execute()];
                                case 4:
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .deleteFrom("trackedActivityInput")
                                            .where("trackedActivityId", "=", activity.id)
                                            .execute()];
                                case 5:
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .deleteFrom("trackedActivity")
                                            .where("id", "=", activity.id)
                                            .execute()];
                                case 6:
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("pickingListLine")
                                            .set({
                                            quantityPicked: Math.max(0, Number((_a = line.quantityPicked) !== null && _a !== void 0 ? _a : 0) - qty),
                                            status: "Pending",
                                            updatedBy: userId_5,
                                            updatedAt: new Date().toISOString()
                                        })
                                            .where("id", "=", pickingListLineId_5)
                                            .where("companyId", "=", companyId_5)
                                            .execute()];
                                case 7:
                                    _b.sent();
                                    // Drop the recorded lot so it's pickable again + display clears.
                                    return [4 /*yield*/, trx
                                            .deleteFrom("pickingListLineTrackedEntity")
                                            .where("pickingListLineId", "=", pickingListLineId_5)
                                            .where("trackedEntityId", "=", trackedEntityId_3)
                                            .execute()];
                                case 8:
                                    // Drop the recorded lot so it's pickable again + display clears.
                                    _b.sent();
                                    return [4 /*yield*/, restoreJobMaterialSource(trx, line, userId_5)];
                                case 9:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 12:
                _b.sent();
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/, new Response(JSON.stringify({ success: true, splitEntityId: splitEntityId_1 }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200
                })];
            case 14:
                err_1 = _b.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify({ success: false, message: err_1.message }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500
                    })];
            case 15: return [2 /*return*/];
        }
    });
}); });
// Point the job material at the lineside shelf so production (backflush/issue)
// consumes from where the pick just moved the stock.
function pointJobMaterialAtLineside(trx, line, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!line.toStorageUnitId)
                        return [2 /*return*/];
                    return [4 /*yield*/, trx
                            .updateTable("jobMaterial")
                            .set({
                            storageUnitId: line.toStorageUnitId,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .where("id", "=", line.jobMaterialId)
                            .execute()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Restore the warehouse source on unpick.
function restoreJobMaterialSource(trx, line, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trx
                        .updateTable("jobMaterial")
                        .set({
                        storageUnitId: line.storageUnitId,
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .where("id", "=", line.jobMaterialId)
                        .execute()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
