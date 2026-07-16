"use strict";
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
exports.resolveTrackedEntityData = resolveTrackedEntityData;
exports.resolveKanbanData = resolveKanbanData;
exports.resolveStorageUnitData = resolveStorageUnitData;
var env_1 = require("@carbon/env");
function resolveTrackedEntityData(client, sourceDocument, sourceDocumentId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, trackedEntities, readableId, items;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, queryTrackedEntities(client, sourceDocument, sourceDocumentId, companyId)];
                case 1:
                    _a = _b.sent(), trackedEntities = _a.trackedEntities, readableId = _a.readableId;
                    if (!(trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.length))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, enrichTrackedEntities(client, trackedEntities)];
                case 2:
                    items = _b.sent();
                    if (items.length === 0)
                        return [2 /*return*/, null];
                    return [2 /*return*/, { items: items, readableId: readableId }];
            }
        });
    });
}
function resolveKanbanData(client, sourceDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        var kanban, kanbanUrl;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("kanbans")
                        .select("*")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 1:
                    kanban = (_c.sent()).data;
                    if (!kanban)
                        return [2 /*return*/, null];
                    kanbanUrl = "".concat(env_1.ERP_URL !== null && env_1.ERP_URL !== void 0 ? env_1.ERP_URL : "", "/api/kanban/").concat(sourceDocumentId);
                    return [2 /*return*/, {
                            items: [
                                {
                                    id: sourceDocumentId,
                                    kanbanUrl: kanbanUrl,
                                    itemId: kanban.readableIdWithRevision || kanban.itemId || "",
                                    itemName: kanban.name || "",
                                    locationName: kanban.locationName || "",
                                    storageUnitId: kanban.storageUnitId,
                                    storageUnitName: kanban.storageUnitName,
                                    supplierName: kanban.supplierName,
                                    quantity: (_a = kanban.quantity) !== null && _a !== void 0 ? _a : 0,
                                    unitOfMeasureCode: kanban.purchaseUnitOfMeasureCode,
                                    thumbnailPath: kanban.thumbnailPath
                                }
                            ],
                            readableId: (_b = kanban.readableIdWithRevision) !== null && _b !== void 0 ? _b : null
                        }];
            }
        });
    });
}
function resolveStorageUnitData(client, sourceDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        var unit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("storageUnit")
                        .select("id, name")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 1:
                    unit = (_a.sent()).data;
                    if (!unit)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            items: [{ name: unit.name, id: unit.id }],
                            readableId: unit.name
                        }];
            }
        });
    });
}
function queryTrackedEntities(client, sourceDocument, sourceDocumentId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, receipt, trackedEntities, shipment, trackedEntities, jobOperation, trackedEntities, trackedEntity, trackedEntity, jobId, readableId, job, stockTransfer, lines, entityIds, trackedEntities;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    _a = sourceDocument;
                    switch (_a) {
                        case "Receipt": return [3 /*break*/, 1];
                        case "Shipment": return [3 /*break*/, 4];
                        case "Operation": return [3 /*break*/, 7];
                        case "Entity": return [3 /*break*/, 10];
                        case "Split": return [3 /*break*/, 10];
                        case "Job": return [3 /*break*/, 12];
                        case "StockTransfer": return [3 /*break*/, 16];
                    }
                    return [3 /*break*/, 20];
                case 1: return [4 /*yield*/, client
                        .from("receipt")
                        .select("receiptId")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 2:
                    receipt = (_k.sent()).data;
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes ->> Receipt", sourceDocumentId)
                            .eq("companyId", companyId)];
                case 3:
                    trackedEntities = (_k.sent()).data;
                    return [2 /*return*/, { trackedEntities: trackedEntities, readableId: (_b = receipt === null || receipt === void 0 ? void 0 : receipt.receiptId) !== null && _b !== void 0 ? _b : null }];
                case 4: return [4 /*yield*/, client
                        .from("shipment")
                        .select("shipmentId")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 5:
                    shipment = (_k.sent()).data;
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes ->> Shipment", sourceDocumentId)
                            .eq("companyId", companyId)];
                case 6:
                    trackedEntities = (_k.sent()).data;
                    return [2 /*return*/, { trackedEntities: trackedEntities, readableId: (_c = shipment === null || shipment === void 0 ? void 0 : shipment.shipmentId) !== null && _c !== void 0 ? _c : null }];
                case 7: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("jobMakeMethodId, ...jobMakeMethod(...item(readableIdWithRevision))")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 8:
                    jobOperation = (_k.sent()).data;
                    if (!(jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.jobMakeMethodId))
                        return [2 /*return*/, { trackedEntities: null, readableId: null }];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes->>Job Make Method", jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.jobMakeMethodId)
                            .order("createdAt", { ascending: true })];
                case 9:
                    trackedEntities = (_k.sent()).data;
                    return [2 /*return*/, {
                            trackedEntities: trackedEntities,
                            readableId: (_d = jobOperation.readableIdWithRevision) !== null && _d !== void 0 ? _d : null
                        }];
                case 10: return [4 /*yield*/, client
                        .from("trackedEntity")
                        .select("*")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 11:
                    trackedEntity = (_k.sent()).data;
                    return [2 /*return*/, {
                            trackedEntities: trackedEntity ? [trackedEntity] : null,
                            readableId: (_e = trackedEntity === null || trackedEntity === void 0 ? void 0 : trackedEntity.readableId) !== null && _e !== void 0 ? _e : null
                        }];
                case 12: return [4 /*yield*/, client
                        .from("trackedEntity")
                        .select("*")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 13:
                    trackedEntity = (_k.sent()).data;
                    if (!trackedEntity)
                        return [2 /*return*/, { trackedEntities: null, readableId: null }];
                    jobId = (_f = trackedEntity.attributes) === null || _f === void 0 ? void 0 : _f.Job;
                    readableId = null;
                    if (!jobId) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("job")
                            .select("jobId")
                            .eq("id", jobId)
                            .single()];
                case 14:
                    job = (_k.sent()).data;
                    readableId = (_g = job === null || job === void 0 ? void 0 : job.jobId) !== null && _g !== void 0 ? _g : null;
                    _k.label = 15;
                case 15: return [2 /*return*/, {
                        trackedEntities: [trackedEntity],
                        readableId: readableId
                    }];
                case 16: return [4 /*yield*/, client
                        .from("stockTransfer")
                        .select("stockTransferId")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 17:
                    stockTransfer = (_k.sent()).data;
                    return [4 /*yield*/, client
                            .from("stockTransferLine")
                            .select("trackedEntityId")
                            .eq("stockTransferId", sourceDocumentId)
                            .not("trackedEntityId", "is", null)];
                case 18:
                    lines = (_k.sent()).data;
                    entityIds = __spreadArray([], new Set((lines !== null && lines !== void 0 ? lines : [])
                        .map(function (l) { return l.trackedEntityId; })
                        .filter(function (id) { return !!id; })), true);
                    if (entityIds.length === 0) {
                        return [2 /*return*/, {
                                trackedEntities: null,
                                readableId: (_h = stockTransfer === null || stockTransfer === void 0 ? void 0 : stockTransfer.stockTransferId) !== null && _h !== void 0 ? _h : null
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .in("id", entityIds)
                            .eq("companyId", companyId)];
                case 19:
                    trackedEntities = (_k.sent()).data;
                    return [2 /*return*/, {
                            trackedEntities: trackedEntities,
                            readableId: (_j = stockTransfer === null || stockTransfer === void 0 ? void 0 : stockTransfer.stockTransferId) !== null && _j !== void 0 ? _j : null
                        }];
                case 20: return [2 /*return*/, { trackedEntities: null, readableId: null }];
            }
        });
    });
}
function enrichTrackedEntities(client, trackedEntities) {
    return __awaiter(this, void 0, void 0, function () {
        var sourceDocIds, items, itemMap;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sourceDocIds = __spreadArray([], new Set(trackedEntities
                        .map(function (te) { return te.sourceDocumentId; })
                        .filter(Boolean)), true);
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id, readableId, revision, itemTrackingType")
                            .in("id", sourceDocIds)];
                case 1:
                    items = (_b.sent()).data;
                    itemMap = new Map((_a = items === null || items === void 0 ? void 0 : items.map(function (i) { return [i.id, i]; })) !== null && _a !== void 0 ? _a : []);
                    return [2 /*return*/, trackedEntities.flatMap(function (te) {
                            var _a, _b, _c;
                            var item = itemMap.get((_a = te.sourceDocumentId) !== null && _a !== void 0 ? _a : "");
                            if (!item)
                                return [];
                            return {
                                itemId: item.readableId,
                                revision: (_b = item.revision) !== null && _b !== void 0 ? _b : "0",
                                number: te.readableId || te.id,
                                trackedEntityId: te.id,
                                quantity: (_c = te.quantity) !== null && _c !== void 0 ? _c : 1,
                                trackingType: item.itemTrackingType
                            };
                        })];
            }
        });
    });
}
