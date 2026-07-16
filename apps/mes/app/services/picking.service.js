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
exports.getAssignedPickingLists = getAssignedPickingLists;
exports.getPickingListForExecution = getPickingListForExecution;
exports.updatePickingListStatus = updatePickingListStatus;
exports.setPickingListLineQuantity = setPickingListLineQuantity;
exports.setPickingListLineTrackedEntity = setPickingListLineTrackedEntity;
var models_1 = require("~/services/models");
function getAssignedPickingLists(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickingLists")
                    .select("*")
                    .eq("assignee", userId)
                    .in("status", ["Draft", "In Progress"])
                    .order("dueDate", { ascending: true, nullsFirst: false })];
        });
    });
}
function getPickingListForExecution(client, pickingListId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, pickingList, plError, _b, lines, lineError, lineIds, trackedEntities, _c, availabilityResult, availability, _i, _d, row;
        var _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, client
                        .from("pickingList")
                        .select("*, location:location(name)")
                        .eq("id", pickingListId)
                        .single()];
                case 1:
                    _a = _h.sent(), pickingList = _a.data, plError = _a.error;
                    if (plError || !pickingList)
                        return [2 /*return*/, { data: null, error: plError }];
                    return [4 /*yield*/, client
                            .from("pickingListLine")
                            .select("*, item:item(name, readableId), job:job(jobId), jobOperation:jobOperation(order, processId, workCenterId, process:process(name), workCenter:workCenter(name)), storageUnit:storageUnit!pickingListLine_storageUnitId_fkey(name), toStorageUnit:storageUnit!pickingListLine_toStorageUnitId_fkey(name)")
                            .eq("pickingListId", pickingListId)
                            .order("jobOperationId")
                            .order("storageUnitId")];
                case 2:
                    _b = _h.sent(), lines = _b.data, lineError = _b.error;
                    if (lineError)
                        return [2 /*return*/, { data: null, error: lineError }];
                    lineIds = (_e = lines === null || lines === void 0 ? void 0 : lines.map(function (l) { return l.id; })) !== null && _e !== void 0 ? _e : [];
                    if (!(lineIds.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("pickingListLineTrackedEntity")
                            .select("*, trackedEntity:trackedEntity(readableId, quantity)")
                            .in("pickingListLineId", lineIds)];
                case 3:
                    _c = _h.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = { data: [] };
                    _h.label = 5;
                case 5:
                    trackedEntities = (_c).data;
                    return [4 /*yield*/, client.rpc("get_picking_list_availability", {
                            p_picking_list_id: pickingListId
                        })];
                case 6:
                    availabilityResult = _h.sent();
                    availability = new Map();
                    for (_i = 0, _d = (_f = availabilityResult.data) !== null && _f !== void 0 ? _f : []; _i < _d.length; _i++) {
                        row = _d[_i];
                        availability.set(row.pickingListLineId, Number((_g = row.availableQuantity) !== null && _g !== void 0 ? _g : 0));
                    }
                    return [2 /*return*/, {
                            data: __assign(__assign({}, pickingList), { lines: lines === null || lines === void 0 ? void 0 : lines.map(function (line) {
                                    var _a, _b;
                                    return (__assign(__assign({}, line), { availableQuantity: (_a = availability.get(line.id)) !== null && _a !== void 0 ? _a : 0, trackedEntities: (_b = trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.filter(function (te) { return te.pickingListLineId === line.id; })) !== null && _b !== void 0 ? _b : [] }));
                                }) }),
                            error: null
                        }];
            }
        });
    });
}
function updatePickingListStatus(client, pickingListId, status, updatedBy, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickingList")
                    .update({
                    status: status,
                    updatedBy: updatedBy,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", pickingListId)
                    .eq("companyId", companyId)];
        });
    });
}
function getPostPickingErrorMessage(error) {
    var _a;
    return (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to pick material";
}
/**
 * Set the picked quantity on a picking line (pick, short, or unpick).
 *
 * A pick TRANSFERS the material from its warehouse source shelf to the work
 * center's lineside shelf via the `post-picking` edge function (consumption
 * happens later at production). `quantity <= 0` reverses a prior pick. "Short"
 * just records the status with no inventory movement — the kitter couldn't
 * fully pick it, and production handles the shortfall. The picking list header
 * status is maintained by the `update_picking_list_status` trigger.
 */
function setPickingListLineQuantity(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lineResult, line, pickingList, item, previousPicked, target, delta, body, result, update;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("pickingListLine")
                        .select("*, pickingList(locationId, companyId, status), item(itemTrackingType)")
                        .eq("id", args.pickingListLineId)
                        .eq("companyId", args.companyId)
                        .single()];
                case 1:
                    lineResult = _c.sent();
                    if (lineResult.error || !lineResult.data) {
                        return [2 /*return*/, { data: null, error: (_a = lineResult.error) !== null && _a !== void 0 ? _a : "Line not found" }];
                    }
                    line = lineResult.data;
                    pickingList = line.pickingList;
                    item = line.item;
                    if (!pickingList) {
                        return [2 /*return*/, { data: null, error: "Missing related data" }];
                    }
                    if ((0, models_1.isPickingListLocked)(pickingList.status)) {
                        return [2 /*return*/, {
                                data: null,
                                error: "This picking list is closed. Reopen it from the ERP to continue."
                            }];
                    }
                    if ((item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial" ||
                        (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Batch") {
                        return [2 /*return*/, {
                                data: null,
                                error: "Tracked items must be picked via the scan flow"
                            }];
                    }
                    previousPicked = Number((_b = line.quantityPicked) !== null && _b !== void 0 ? _b : 0);
                    target = Math.max(0, args.quantity);
                    delta = target - previousPicked;
                    if (!(delta !== 0)) return [3 /*break*/, 3];
                    // A null source is allowed: the kitter can pick material the system shows no
                    // stock for (counts are often wrong) — on-hand simply goes negative at the
                    // source until it's reconciled. Only the lineside destination is required.
                    if (delta > 0 && !line.toStorageUnitId) {
                        return [2 /*return*/, {
                                data: null,
                                error: "No lineside destination is set for this line"
                            }];
                    }
                    body = delta > 0
                        ? {
                            type: "inventory",
                            pickingListId: line.pickingListId,
                            pickingListLineId: line.id,
                            quantity: delta,
                            locationId: pickingList.locationId,
                            userId: args.userId,
                            companyId: pickingList.companyId
                        }
                        : {
                            type: "unpickInventory",
                            pickingListId: line.pickingListId,
                            pickingListLineId: line.id,
                            quantity: -delta,
                            locationId: pickingList.locationId,
                            userId: args.userId,
                            companyId: pickingList.companyId
                        };
                    return [4 /*yield*/, client.functions.invoke("post-picking", { body: body })];
                case 2:
                    result = _c.sent();
                    if (result.error) {
                        return [2 /*return*/, { data: null, error: getPostPickingErrorMessage(result.error) }];
                    }
                    _c.label = 3;
                case 3:
                    if (!args.markShort) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("pickingListLine")
                            .update({
                            status: "Short",
                            quantityPicked: target,
                            updatedBy: args.userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", args.pickingListLineId)];
                case 4:
                    update = _c.sent();
                    if (update.error) {
                        return [2 /*return*/, { data: null, error: update.error }];
                    }
                    _c.label = 5;
                case 5: return [2 /*return*/, { data: { id: args.pickingListLineId }, error: null }];
            }
        });
    });
}
/**
 * Pick (or unpick) a tracked (serial/batch) lot for a picking line. Mirrors the
 * ERP service: moves the chosen lot warehouse→lineside via `post-picking`,
 * records it on the line, points the job material at lineside. `unpick` reverses.
 */
function setPickingListLineTrackedEntity(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lineResult, line, pickingList, item, isSerial, isBatch, type, body, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("pickingListLine")
                        .select("*, pickingList(locationId, companyId, status), item(itemTrackingType)")
                        .eq("id", args.pickingListLineId)
                        .single()];
                case 1:
                    lineResult = _d.sent();
                    if (lineResult.error || !lineResult.data) {
                        return [2 /*return*/, { data: null, error: (_a = lineResult.error) !== null && _a !== void 0 ? _a : "Line not found" }];
                    }
                    line = lineResult.data;
                    pickingList = line.pickingList;
                    item = line.item;
                    if (!pickingList) {
                        return [2 /*return*/, { data: null, error: "Missing related data" }];
                    }
                    if ((0, models_1.isPickingListLocked)(pickingList.status)) {
                        return [2 /*return*/, {
                                data: null,
                                error: "This picking list is closed. Reopen it from the ERP to continue."
                            }];
                    }
                    isSerial = (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial";
                    isBatch = (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Batch";
                    if (!isSerial && !isBatch) {
                        return [2 /*return*/, { data: null, error: "This line is not a tracked item" }];
                    }
                    if (!args.unpick && !line.toStorageUnitId) {
                        return [2 /*return*/, {
                                data: null,
                                error: "No lineside destination is set for this line"
                            }];
                    }
                    type = args.unpick
                        ? isSerial
                            ? "unpickSerial"
                            : "unpickBatch"
                        : isSerial
                            ? "serial"
                            : "batch";
                    body = {
                        type: type,
                        pickingListId: line.pickingListId,
                        pickingListLineId: line.id,
                        trackedEntityId: args.trackedEntityId,
                        locationId: pickingList.locationId,
                        userId: args.userId,
                        companyId: pickingList.companyId
                    };
                    if (!args.unpick) {
                        body.fromStorageUnitId = (_b = args.fromStorageUnitId) !== null && _b !== void 0 ? _b : null;
                        if (isBatch)
                            body.quantity = Math.max(1, (_c = args.quantity) !== null && _c !== void 0 ? _c : 1);
                    }
                    return [4 /*yield*/, client.functions.invoke("post-picking", { body: body })];
                case 2:
                    result = _d.sent();
                    if (result.error) {
                        return [2 /*return*/, { data: null, error: getPostPickingErrorMessage(result.error) }];
                    }
                    return [2 /*return*/, { data: { id: args.pickingListLineId }, error: null }];
            }
        });
    });
}
