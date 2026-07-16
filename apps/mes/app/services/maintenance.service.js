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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveMaintenanceDispatchesByLocation = getActiveMaintenanceDispatchesByLocation;
exports.getMaintenanceDispatchesAssignedTo = getMaintenanceDispatchesAssignedTo;
exports.getBlockedWorkCenters = getBlockedWorkCenters;
exports.getWorkCenterWithBlockingStatus = getWorkCenterWithBlockingStatus;
exports.getMaintenanceDispatch = getMaintenanceDispatch;
exports.getActiveMaintenanceEventByEmployee = getActiveMaintenanceEventByEmployee;
exports.getActiveMaintenanceEventsCount = getActiveMaintenanceEventsCount;
exports.startMaintenanceEvent = startMaintenanceEvent;
exports.endMaintenanceEvent = endMaintenanceEvent;
exports.updateMaintenanceDispatchStatus = updateMaintenanceDispatchStatus;
exports.assignMaintenanceDispatch = assignMaintenanceDispatch;
exports.getMaintenanceDispatchEvents = getMaintenanceDispatchEvents;
exports.getMaintenanceDispatchItems = getMaintenanceDispatchItems;
exports.getWorkCenterReplacementParts = getWorkCenterReplacementParts;
exports.addMaintenanceDispatchItem = addMaintenanceDispatchItem;
exports.deleteMaintenanceDispatchItem = deleteMaintenanceDispatchItem;
exports.getMaintenanceDispatchItemTrackedEntities = getMaintenanceDispatchItemTrackedEntities;
function getActiveMaintenanceDispatchesByLocation(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("activeMaintenanceDispatchesByLocation")
                    .select("*")
                    .eq("locationId", locationId)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getMaintenanceDispatchesAssignedTo(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("activeMaintenanceDispatchesByLocation")
                    .select("*")
                    .eq("assignee", userId)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getBlockedWorkCenters(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("workCentersWithBlockingStatus")
                    .select("id, name, isBlocked, blockingDispatchId, blockingDispatchReadableId")
                    .eq("locationId", locationId)
                    .eq("isBlocked", true)];
        });
    });
}
function getWorkCenterWithBlockingStatus(client, workCenterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("workCentersWithBlockingStatus")
                    .select("id, name, isBlocked, blockingDispatchId, blockingDispatchReadableId")
                    .eq("id", workCenterId)
                    .single()];
        });
    });
}
function getMaintenanceDispatch(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatch")
                    .select("\n      *,\n      workCenter:workCenterId (id, name, locationId),\n      assigneeUser:assignee (id, fullName, avatarUrl),\n      suspectedFailureMode:suspectedFailureModeId (id, name),\n      actualFailureMode:actualFailureModeId (id, name),\n      maintenanceSchedule:maintenanceScheduleId (id, name),\n      procedure:procedureId (id, name, content)\n    ")
                    .eq("id", dispatchId)
                    .single()];
        });
    });
}
function getActiveMaintenanceEventByEmployee(client, employeeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchEvent")
                    .select("\n      *,\n      maintenanceDispatch:maintenanceDispatchId (\n        id,\n        maintenanceDispatchId,\n        status,\n        priority,\n        severity,\n        oeeImpact,\n        workCenterId\n      )\n    ")
                    .eq("employeeId", employeeId)
                    .is("endTime", null)
                    .maybeSingle()];
        });
    });
}
function getActiveMaintenanceEventsCount(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("activeMaintenanceDispatchesByLocation")
                    .select("id", { count: "exact", head: true })
                    .eq("locationId", locationId)];
        });
    });
}
function startMaintenanceEvent(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchEvent")
                    .insert([
                    {
                        maintenanceDispatchId: args.maintenanceDispatchId,
                        employeeId: args.employeeId,
                        workCenterId: args.workCenterId,
                        startTime: args.startTime,
                        companyId: args.companyId,
                        createdBy: args.createdBy
                    }
                ])
                    .select("id")
                    .single()];
        });
    });
}
function endMaintenanceEvent(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchEvent")
                    .update({
                    endTime: args.endTime,
                    updatedBy: args.updatedBy
                })
                    .eq("id", args.eventId)
                    .select("id")
                    .single()];
        });
    });
}
function updateMaintenanceDispatchStatus(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatch")
                    .update({
                    status: args.status,
                    actualStartTime: args.actualStartTime,
                    actualEndTime: args.actualEndTime,
                    completedAt: args.completedAt,
                    updatedBy: args.updatedBy
                })
                    .eq("id", args.dispatchId)
                    .select("id")
                    .single()];
        });
    });
}
function assignMaintenanceDispatch(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatch")
                    .update({
                    assignee: args.assignee,
                    status: "Assigned",
                    updatedBy: args.updatedBy
                })
                    .eq("id", args.dispatchId)
                    .select("id")
                    .single()];
        });
    });
}
function getMaintenanceDispatchEvents(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchEvent")
                    .select("*")
                    .eq("maintenanceDispatchId", dispatchId)
                    .order("startTime", { ascending: false })];
        });
    });
}
function getMaintenanceDispatchItems(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchItem")
                    .select("\n      *,\n      item:itemId (id, name, description, itemTrackingType)\n    ")
                    .eq("maintenanceDispatchId", dispatchId)];
        });
    });
}
function getWorkCenterReplacementParts(client, workCenterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("workCenterReplacementPart")
                    .select("\n      *,\n      item:itemId (id, name, description)\n    ")
                    .eq("workCenterId", workCenterId)];
        });
    });
}
function addMaintenanceDispatchItem(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchItem")
                    .insert([
                    {
                        maintenanceDispatchId: args.maintenanceDispatchId,
                        itemId: args.itemId,
                        quantity: args.quantity,
                        unitOfMeasureCode: args.unitOfMeasureCode,
                        companyId: args.companyId,
                        createdBy: args.createdBy
                    }
                ])
                    .select("id")
                    .single()];
        });
    });
}
function deleteMaintenanceDispatchItem(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceDispatchItem").delete().eq("id", itemId)];
        });
    });
}
function getMaintenanceDispatchItemTrackedEntities(client, maintenanceDispatchItemId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchItemTrackedEntity")
                    .select("\n      *,\n      trackedEntity:trackedEntityId (id, quantity, status, readableId:sourceDocumentReadableId)\n    ")
                    .eq("maintenanceDispatchItemId", maintenanceDispatchItemId)];
        });
    });
}
