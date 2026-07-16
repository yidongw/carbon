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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateWorkCenter = activateWorkCenter;
exports.deleteAbility = deleteAbility;
exports.deleteContractor = deleteContractor;
exports.deleteEmployeeAbility = deleteEmployeeAbility;
exports.deleteFailureMode = deleteFailureMode;
exports.deleteLocation = deleteLocation;
exports.deleteMaintenanceDispatch = deleteMaintenanceDispatch;
exports.deleteMaintenanceDispatchComment = deleteMaintenanceDispatchComment;
exports.deleteMaintenanceDispatchEvent = deleteMaintenanceDispatchEvent;
exports.deleteMaintenanceDispatchItem = deleteMaintenanceDispatchItem;
exports.deleteMaintenanceDispatchWorkCenter = deleteMaintenanceDispatchWorkCenter;
exports.deleteMaintenanceSchedule = deleteMaintenanceSchedule;
exports.deleteMaintenanceScheduleItem = deleteMaintenanceScheduleItem;
exports.deletePartner = deletePartner;
exports.activateProcess = activateProcess;
exports.processDeactivate = processDeactivate;
exports.deleteProcess = deleteProcess;
exports.deleteShift = deleteShift;
exports.deleteSuggestion = deleteSuggestion;
exports.deleteTraining = deleteTraining;
exports.deleteTrainingAssignment = deleteTrainingAssignment;
exports.deleteTrainingQuestion = deleteTrainingQuestion;
exports.deleteWorkCenter = deleteWorkCenter;
exports.getAbilities = getAbilities;
exports.getAbilitiesList = getAbilitiesList;
exports.getAbility = getAbility;
exports.getContractor = getContractor;
exports.getContractors = getContractors;
exports.getEmployeeAbilities = getEmployeeAbilities;
exports.getFailureMode = getFailureMode;
exports.getFailureModes = getFailureModes;
exports.getFailureModesList = getFailureModesList;
exports.getLocation = getLocation;
exports.getLocations = getLocations;
exports.getLocationsList = getLocationsList;
exports.getMaintenanceDispatch = getMaintenanceDispatch;
exports.getMaintenanceDispatchComments = getMaintenanceDispatchComments;
exports.getMaintenanceDispatchEvents = getMaintenanceDispatchEvents;
exports.getMaintenanceDispatchItems = getMaintenanceDispatchItems;
exports.getMaintenanceDispatchItemTrackedEntities = getMaintenanceDispatchItemTrackedEntities;
exports.getMaintenanceDispatches = getMaintenanceDispatches;
exports.getMaintenanceDispatchesByLocation = getMaintenanceDispatchesByLocation;
exports.getMaintenanceDispatchWorkCenters = getMaintenanceDispatchWorkCenters;
exports.getMaintenanceSchedule = getMaintenanceSchedule;
exports.getMaintenanceScheduleItems = getMaintenanceScheduleItems;
exports.getMaintenanceSchedules = getMaintenanceSchedules;
exports.getMaintenanceSchedulesByLocation = getMaintenanceSchedulesByLocation;
exports.getOutstandingTrainingsForUser = getOutstandingTrainingsForUser;
exports.getPartner = getPartner;
exports.getPartnerBySupplierId = getPartnerBySupplierId;
exports.getPartners = getPartners;
exports.getProcess = getProcess;
exports.getProcesses = getProcesses;
exports.getProcessesList = getProcessesList;
exports.getSuggestion = getSuggestion;
exports.getSuggestions = getSuggestions;
exports.getTraining = getTraining;
exports.getTrainingAssignment = getTrainingAssignment;
exports.getTrainingAssignmentForCompletion = getTrainingAssignmentForCompletion;
exports.getTrainingAssignments = getTrainingAssignments;
exports.getTrainingAssignmentStatus = getTrainingAssignmentStatus;
exports.getTrainingAssignmentSummary = getTrainingAssignmentSummary;
exports.getTrainingQuestions = getTrainingQuestions;
exports.getTrainings = getTrainings;
exports.getTrainingsList = getTrainingsList;
exports.getWorkCenter = getWorkCenter;
exports.getWorkCenters = getWorkCenters;
exports.getWorkCentersByLocation = getWorkCentersByLocation;
exports.getWorkCentersList = getWorkCentersList;
exports.getWorkCentersListWithBlockingStatus = getWorkCentersListWithBlockingStatus;
exports.insertAbility = insertAbility;
exports.insertEmployeeAbilities = insertEmployeeAbilities;
exports.insertTrainingCompletion = insertTrainingCompletion;
exports.updateAbility = updateAbility;
exports.updateSuggestionEmoji = updateSuggestionEmoji;
exports.updateSuggestionTags = updateSuggestionTags;
exports.updateTrainingQuestionOrder = updateTrainingQuestionOrder;
exports.upsertContractor = upsertContractor;
exports.upsertEmployeeAbility = upsertEmployeeAbility;
exports.upsertFailureMode = upsertFailureMode;
exports.upsertLocation = upsertLocation;
exports.insertMaintenanceDispatch = insertMaintenanceDispatch;
exports.updateMaintenanceDispatch = updateMaintenanceDispatch;
exports.upsertMaintenanceDispatch = upsertMaintenanceDispatch;
exports.upsertMaintenanceDispatchComment = upsertMaintenanceDispatchComment;
exports.upsertMaintenanceDispatchEvent = upsertMaintenanceDispatchEvent;
exports.upsertMaintenanceDispatchItem = upsertMaintenanceDispatchItem;
exports.upsertMaintenanceDispatchWorkCenter = upsertMaintenanceDispatchWorkCenter;
exports.upsertMaintenanceSchedule = upsertMaintenanceSchedule;
exports.upsertMaintenanceScheduleItem = upsertMaintenanceScheduleItem;
exports.upsertPartner = upsertPartner;
exports.upsertProcess = upsertProcess;
exports.upsertTraining = upsertTraining;
exports.upsertTrainingAssignment = upsertTrainingAssignment;
exports.upsertTrainingQuestion = upsertTrainingQuestion;
exports.upsertWorkCenter = upsertWorkCenter;
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
function activateWorkCenter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("workCenter").update({ active: true }).eq("id", id)];
        });
    });
}
function deleteAbility(client_1, abilityId_1) {
    return __awaiter(this, arguments, void 0, function (client, abilityId, hardDelete) {
        if (hardDelete === void 0) { hardDelete = true; }
        return __generator(this, function (_a) {
            return [2 /*return*/, hardDelete
                    ? client.from("ability").delete().eq("id", abilityId)
                    : client.from("ability").update({ active: false }).eq("id", abilityId)];
        });
    });
}
function deleteContractor(client, contractorId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("contractor").delete().eq("id", contractorId)];
        });
    });
}
function deleteEmployeeAbility(client, employeeAbilityId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeAbility")
                    .update({ active: false })
                    .eq("id", employeeAbilityId)];
        });
    });
}
function deleteFailureMode(client, failureModeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceFailureMode").delete().eq("id", failureModeId)];
        });
    });
}
function deleteLocation(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("location").delete().eq("id", locationId)];
        });
    });
}
function deleteMaintenanceDispatch(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceDispatch").delete().eq("id", dispatchId)];
        });
    });
}
function deleteMaintenanceDispatchComment(client, commentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceDispatchComment").delete().eq("id", commentId)];
        });
    });
}
function deleteMaintenanceDispatchEvent(client, eventId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceDispatchEvent").delete().eq("id", eventId)];
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
function deleteMaintenanceDispatchWorkCenter(client, workCenterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchWorkCenter")
                    .delete()
                    .eq("id", workCenterId)];
        });
    });
}
function deleteMaintenanceSchedule(client, scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceSchedule").delete().eq("id", scheduleId)];
        });
    });
}
function deleteMaintenanceScheduleItem(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceScheduleItem").delete().eq("id", itemId)];
        });
    });
}
function deletePartner(client, partnerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("partner").delete().eq("id", partnerId)];
        });
    });
}
function activateProcess(client, processId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("process").update({ active: true }).eq("id", processId)];
        });
    });
}
function processDeactivate(client, processId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("process").update({ active: false }).eq("id", processId)];
        });
    });
}
function deleteProcess(client, processId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("process").delete().eq("id", processId)];
        });
    });
}
function deleteShift(client, shiftId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Set all employeeShifts to null
            return [2 /*return*/, client.from("shift").update({ active: false }).eq("id", shiftId)];
        });
    });
}
function deleteSuggestion(client, suggestionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("suggestion").delete().eq("id", suggestionId)];
        });
    });
}
function deleteTraining(client, trainingId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("training").delete().eq("id", trainingId)];
        });
    });
}
function deleteTrainingAssignment(client, assignmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("trainingAssignment").delete().eq("id", assignmentId)];
        });
    });
}
function deleteTrainingQuestion(client, trainingQuestionId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trainingQuestion")
                    .delete()
                    .eq("id", trainingQuestionId)
                    .eq("companyId", companyId)];
        });
    });
}
function deleteWorkCenter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("workCenter").update({ active: false }).eq("id", id)];
        });
    });
}
function getAbilities(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("ability")
                .select("*, employeeAbility(employeeId)", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .eq("active", true)
                .eq("employeeAbility.active", true);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getAbilitiesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("ability")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getAbility(client, abilityId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("ability")
                    .select("*, employeeAbility(id, employeeId, lastTrainingDate, trainingDays, trainingCompleted)", {
                    count: "exact"
                })
                    .eq("id", abilityId)
                    .eq("active", true)
                    .eq("employeeAbility.active", true)
                    .single()];
        });
    });
}
function getContractor(client, contractorId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("contractors")
                    .select("*")
                    .eq("supplierContactId", contractorId)
                    .single()];
        });
    });
}
function getContractors(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("contractors")
                .select("*")
                .eq("companyId", companyId)
                .eq("active", true);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("fullName.ilike.%".concat(args.search, "%,email.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "lastName", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getEmployeeAbilities(client, employeeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeAbility")
                    .select("*, ability(id, name, curve, shadowWeeks)")
                    .eq("employeeId", employeeId)
                    .eq("active", true)];
        });
    });
}
function getFailureMode(client, failureModeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceFailureMode")
                    .select("*")
                    .eq("id", failureModeId)
                    .single()];
        });
    });
}
function getFailureModes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("maintenanceFailureMode")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getFailureModesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceFailureMode")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getLocation(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("location").select("*").eq("id", locationId).single()];
        });
    });
}
function getLocations(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("location")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getLocationsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("location")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getMaintenanceDispatch(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatch")
                    .select("*,\n      assignee:user!maintenanceDispatch_assignee_fkey(id, fullName, avatarUrl),\n      suspectedFailureMode:maintenanceFailureMode!maintenanceDispatch_suspectedFailureModeId_fkey(id, name),\n      actualFailureMode:maintenanceFailureMode!maintenanceDispatch_actualFailureModeId_fkey(id, name),\n      schedule:maintenanceSchedule(id, name),\n      procedure:procedureId(id, name)")
                    .eq("id", dispatchId)
                    .single()];
        });
    });
}
function getMaintenanceDispatchComments(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchComment")
                    .select("id, comment, createdAt,\n       createdBy:user!maintenanceDispatchComment_createdBy_fkey(id, fullName, avatarUrl)")
                    .eq("maintenanceDispatchId", dispatchId)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getMaintenanceDispatchEvents(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchEvent")
                    .select("id, startTime, endTime, duration, notes,\n       employee:user!maintenanceDispatchEvent_employeeId_fkey(id, fullName, avatarUrl),\n       workCenter:workCenter!maintenanceDispatchEvent_workCenterId_fkey(id, name)")
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
                    .select("id, itemId, quantity, unitOfMeasureCode, unitCost, totalCost,\n       item:item!maintenanceDispatchItem_itemId_fkey(id, name, itemTrackingType)")
                    .eq("maintenanceDispatchId", dispatchId)];
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
function getMaintenanceDispatches(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("maintenanceDispatch")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("maintenanceDispatchId", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaintenanceDispatchesByLocation(client, companyId, locationId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.rpc("get_maintenance_dispatches_by_location", {
                p_company_id: companyId,
                p_location_id: locationId
            }, { count: "exact" });
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("maintenanceDispatchId", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaintenanceDispatchWorkCenters(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchWorkCenter")
                    .select("id, workCenterId,\n       workCenter:workCenter!maintenanceDispatchWorkCenter_workCenterId_fkey(id, name)")
                    .eq("maintenanceDispatchId", dispatchId)];
        });
    });
}
function getMaintenanceSchedule(client, scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceSchedule")
                    .select("*,\n       workCenter:workCenter!maintenanceSchedule_workCenterId_fkey(id, name)")
                    .eq("id", scheduleId)
                    .single()];
        });
    });
}
function getMaintenanceScheduleItems(client, scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceScheduleItem")
                    .select("id, quantity, unitOfMeasureCode,\n       item:item!maintenanceScheduleItem_itemId_fkey(id, name)")
                    .eq("maintenanceScheduleId", scheduleId)];
        });
    });
}
function getMaintenanceSchedules(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("maintenanceSchedules")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if ((args === null || args === void 0 ? void 0 : args.active) !== undefined) {
                query = query.eq("active", args.active);
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaintenanceSchedulesByLocation(client, companyId, locationId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.rpc("get_maintenance_schedules_by_location", {
                p_company_id: companyId,
                p_location_id: locationId
            }, { count: "exact" });
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if ((args === null || args === void 0 ? void 0 : args.active) !== undefined) {
                query = query.eq("active", args.active);
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getOutstandingTrainingsForUser(client, companyId, employeeId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, filteredData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.rpc("get_training_assignment_status", {
                        p_company_id: companyId
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        return [2 /*return*/, { data: null, error: error }];
                    filteredData = (data !== null && data !== void 0 ? data : [])
                        .filter(function (d) {
                        return d.employeeId === employeeId &&
                            (d.status === "Pending" || d.status === "Overdue");
                    })
                        .sort(function (a, b) {
                        // Overdue first
                        if (a.status === "Overdue" && b.status !== "Overdue")
                            return -1;
                        if (a.status !== "Overdue" && b.status === "Overdue")
                            return 1;
                        return 0;
                    });
                    return [2 /*return*/, { data: filteredData, error: null }];
            }
        });
    });
}
function getPartner(client, partnerId, abilityId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("partners")
                    .select("*")
                    .eq("supplierLocationId", partnerId)
                    .eq("abilityId", abilityId)
                    .single()];
        });
    });
}
function getPartnerBySupplierId(client, partnerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("partners")
                    .select("*")
                    .eq("supplierLocationId", partnerId)
                    .single()];
        });
    });
}
function getPartners(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("partners")
                .select("*")
                .eq("companyId", companyId)
                .eq("active", true);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("supplierName", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "supplierName", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getProcess(client, processId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("processes").select("*").eq("id", processId).single()];
        });
    });
}
function getProcesses(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("processes")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getProcessesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("process")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .eq("active", true)
                    .order("name")];
        });
    });
}
function getSuggestion(client, suggestionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("suggestions").select("*").eq("id", suggestionId).single()];
        });
    });
}
function getSuggestions(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("suggestions")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("suggestion", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getTraining(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("training")
                    .select("*, trainingQuestion(*)")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getTrainingAssignment(client, assignmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trainingAssignment")
                    .select("*, training(id, name, frequency, type, status)")
                    .eq("id", assignmentId)
                    .single()];
        });
    });
}
function getTrainingAssignmentForCompletion(client, assignmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trainingAssignment")
                    .select("*,\n      training(\n        id,\n        name,\n        description,\n        content,\n        frequency,\n        type,\n        status,\n        estimatedDuration,\n        trainingQuestion(*)\n      )")
                    .eq("id", assignmentId)
                    .single()];
        });
    });
}
function getTrainingAssignments(client, companyId, trainingId) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("trainingAssignment")
                .select("*, training(id, name, frequency)")
                .eq("companyId", companyId);
            if (trainingId) {
                query = query.eq("trainingId", trainingId);
            }
            return [2 /*return*/, query];
        });
    });
}
function getTrainingAssignmentStatus(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, filteredData, searchLower_1, sortColumn, sortAsc, count, offset;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, client.rpc("get_training_assignment_status", {
                        p_company_id: companyId
                    })];
                case 1:
                    _a = _j.sent(), data = _a.data, error = _a.error;
                    if (error)
                        return [2 /*return*/, { data: null, error: error, count: null }];
                    filteredData = data !== null && data !== void 0 ? data : [];
                    // Apply filters in memory since we're using an RPC function
                    if (args === null || args === void 0 ? void 0 : args.trainingId) {
                        filteredData = filteredData.filter(function (d) { return d.trainingId === args.trainingId; });
                    }
                    if (args === null || args === void 0 ? void 0 : args.status) {
                        filteredData = filteredData.filter(function (d) { return d.status === args.status; });
                    }
                    if (args === null || args === void 0 ? void 0 : args.search) {
                        searchLower_1 = args.search.toLowerCase();
                        filteredData = filteredData.filter(function (d) {
                            var _a, _b;
                            return ((_a = d.trainingName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1)) ||
                                ((_b = d.employeeName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1));
                        });
                    }
                    sortColumn = (_d = (_c = (_b = args === null || args === void 0 ? void 0 : args.sorts) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.sortBy) !== null && _d !== void 0 ? _d : "employeeName";
                    sortAsc = (_g = (_f = (_e = args === null || args === void 0 ? void 0 : args.sorts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.sortAsc) !== null && _g !== void 0 ? _g : true;
                    filteredData.sort(function (a, b) {
                        var _a, _b;
                        var aVal = (_a = a[sortColumn]) !== null && _a !== void 0 ? _a : "";
                        var bVal = (_b = b[sortColumn]) !== null && _b !== void 0 ? _b : "";
                        if (aVal < bVal)
                            return sortAsc ? -1 : 1;
                        if (aVal > bVal)
                            return sortAsc ? 1 : -1;
                        return 0;
                    });
                    count = filteredData.length;
                    if (args === null || args === void 0 ? void 0 : args.limit) {
                        offset = (_h = args.offset) !== null && _h !== void 0 ? _h : 0;
                        filteredData = filteredData.slice(offset, offset + args.limit);
                    }
                    return [2 /*return*/, { data: filteredData, error: null, count: count }];
            }
        });
    });
}
function getTrainingAssignmentSummary(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_training_assignment_summary", {
                    p_company_id: companyId
                })];
        });
    });
}
function getTrainingQuestions(client, trainingId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trainingQuestion")
                    .select("*")
                    .eq("trainingId", trainingId)
                    .order("sortOrder", { ascending: true })];
        });
    });
}
function getTrainings(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("trainings")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getTrainingsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("training")
                    .select("id, name, status")
                    .eq("companyId", companyId)
                    .eq("status", "Active")
                    .order("name", { ascending: true })];
        });
    });
}
function getWorkCenter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("workCenters")
                    .select("*")
                    .eq("active", true)
                    .eq("id", id)
                    .single()];
        });
    });
}
function getWorkCenters(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("workCenters")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getWorkCentersByLocation(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, workCentersResult, blockingStatusResult, blockingStatusMap, mergedData;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("workCenters")
                            .select("*")
                            .eq("locationId", locationId)
                            .eq("active", true),
                        client
                            .from("workCentersWithBlockingStatus")
                            .select("id, isBlocked, blockingDispatchId, blockingDispatchReadableId")
                            .eq("locationId", locationId)
                            .eq("active", true)
                    ])];
                case 1:
                    _a = _e.sent(), workCentersResult = _a[0], blockingStatusResult = _a[1];
                    if (workCentersResult.error) {
                        return [2 /*return*/, workCentersResult];
                    }
                    blockingStatusMap = new Map((_c = (_b = blockingStatusResult.data) === null || _b === void 0 ? void 0 : _b.map(function (wc) { return [wc.id, wc]; })) !== null && _c !== void 0 ? _c : []);
                    mergedData = (_d = workCentersResult.data) === null || _d === void 0 ? void 0 : _d.map(function (wc) {
                        var _a, _b, _c;
                        var blockingStatus = blockingStatusMap.get(wc.id);
                        return __assign(__assign({}, wc), { isBlocked: (_a = blockingStatus === null || blockingStatus === void 0 ? void 0 : blockingStatus.isBlocked) !== null && _a !== void 0 ? _a : false, blockingDispatchId: (_b = blockingStatus === null || blockingStatus === void 0 ? void 0 : blockingStatus.blockingDispatchId) !== null && _b !== void 0 ? _b : null, blockingDispatchReadableId: (_c = blockingStatus === null || blockingStatus === void 0 ? void 0 : blockingStatus.blockingDispatchReadableId) !== null && _c !== void 0 ? _c : null });
                    });
                    return [2 /*return*/, { data: mergedData, error: null }];
            }
        });
    });
}
function getWorkCentersList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("workCenters")
                    .select("*")
                    .eq("companyId", companyId)
                    .eq("active", true)
                    .order("name")];
        });
    });
}
function getWorkCentersListWithBlockingStatus(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("workCentersWithBlockingStatus")
                    .select("*")
                    .eq("companyId", companyId)
                    .eq("active", true)
                    .order("name")];
        });
    });
}
function insertAbility(client, ability) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("ability").insert([ability]).select("*").single()];
        });
    });
}
function insertEmployeeAbilities(client, abilityId, employeeIds, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var employeeAbilities;
        return __generator(this, function (_a) {
            employeeAbilities = employeeIds.map(function (employeeId) { return ({
                abilityId: abilityId,
                employeeId: employeeId,
                companyId: companyId,
                trainingCompleted: true
            }); });
            return [2 /*return*/, client
                    .from("employeeAbility")
                    .insert(employeeAbilities)
                    .select("id")
                    .single()];
        });
    });
}
function insertTrainingCompletion(client, completion) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trainingCompletion")
                    .insert(__assign(__assign({}, completion), { completedAt: new Date().toISOString() }))
                    .select("id")
                    .single()];
        });
    });
}
function updateAbility(client, id, ability) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("ability").update((0, supabase_1.sanitize)(ability)).eq("id", id)];
        });
    });
}
function updateSuggestionEmoji(client, suggestionId, emoji) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("suggestion").update({ emoji: emoji }).eq("id", suggestionId)];
        });
    });
}
function updateSuggestionTags(client, suggestionId, tags) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("suggestion").update({ tags: tags }).eq("id", suggestionId)];
        });
    });
}
function updateTrainingQuestionOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client
                    .from("trainingQuestion")
                    .update({ sortOrder: sortOrder, updatedBy: updatedBy })
                    .eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function upsertContractor(client, contractorWithAbilities) {
    return __awaiter(this, void 0, void 0, function () {
        var abilities, contractor, updateContractor, deleteContractorAbilities, createContractor, contractorAbilities;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    abilities = contractorWithAbilities.abilities, contractor = __rest(contractorWithAbilities, ["abilities"]);
                    if (!("updatedBy" in contractor)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("contractor")
                            .update((0, supabase_1.sanitize)(contractor))
                            .eq("id", contractor.id)];
                case 1:
                    updateContractor = _a.sent();
                    if (updateContractor.error) {
                        return [2 /*return*/, updateContractor];
                    }
                    return [4 /*yield*/, client
                            .from("contractorAbility")
                            .delete()
                            .eq("contractorId", contractor.id)];
                case 2:
                    deleteContractorAbilities = _a.sent();
                    if (deleteContractorAbilities.error) {
                        return [2 /*return*/, deleteContractorAbilities];
                    }
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, client
                        .from("contractor")
                        .insert([contractor])];
                case 4:
                    createContractor = _a.sent();
                    if (createContractor.error) {
                        return [2 /*return*/, createContractor];
                    }
                    _a.label = 5;
                case 5:
                    contractorAbilities = abilities.map(function (ability) {
                        return {
                            contractorId: contractor.id,
                            abilityId: ability,
                            createdBy: "createdBy" in contractor ? contractor.createdBy : contractor.updatedBy
                        };
                    });
                    return [2 /*return*/, client.from("contractorAbility").insert(contractorAbilities)];
            }
        });
    });
}
function upsertEmployeeAbility(client, employeeAbility) {
    return __awaiter(this, void 0, void 0, function () {
        var id, update, deactivatedId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = employeeAbility.id, update = __rest(employeeAbility, ["id"]);
                    if (id) {
                        return [2 /*return*/, client.from("employeeAbility").update((0, supabase_1.sanitize)(update)).eq("id", id)];
                    }
                    return [4 /*yield*/, client
                            .from("employeeAbility")
                            .select("id")
                            .eq("employeeId", employeeAbility.employeeId)
                            .eq("abilityId", employeeAbility.abilityId)
                            .eq("active", false)
                            .single()];
                case 1:
                    deactivatedId = _b.sent();
                    if ((_a = deactivatedId.data) === null || _a === void 0 ? void 0 : _a.id) {
                        return [2 /*return*/, client
                                .from("employeeAbility")
                                .update((0, supabase_1.sanitize)(__assign(__assign({}, update), { active: true })))
                                .eq("id", deactivatedId.data.id)];
                    }
                    return [2 /*return*/, client
                            .from("employeeAbility")
                            .insert([__assign({}, update)])
                            .select("id")
                            .single()];
            }
        });
    });
}
function upsertFailureMode(client, failureMode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in failureMode) {
                return [2 /*return*/, client
                        .from("maintenanceFailureMode")
                        .insert([failureMode])
                        .select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceFailureMode")
                        .update((0, supabase_1.sanitize)(failureMode))
                        .eq("id", failureMode.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertLocation(client, location) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in location) {
                return [2 /*return*/, client
                        .from("location")
                        .update((0, supabase_1.sanitize)(location))
                        .eq("id", location.id)];
            }
            return [2 /*return*/, client.from("location").insert([location]).select("*").single()];
        });
    });
}
function insertMaintenanceDispatch(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var maintenanceDispatchId, seq, dispatch;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    if (!input.maintenanceDispatchId) return [3 /*break*/, 1];
                    maintenanceDispatchId = input.maintenanceDispatchId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "maintenanceDispatch",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _m.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate maintenanceDispatch sequence"
                                }
                            }];
                    }
                    maintenanceDispatchId = seq.data;
                    _m.label = 3;
                case 3: return [4 /*yield*/, client
                        .from("maintenanceDispatch")
                        .insert({
                        maintenanceDispatchId: maintenanceDispatchId,
                        status: (_b = input.status) !== null && _b !== void 0 ? _b : "Open",
                        priority: (_c = input.priority) !== null && _c !== void 0 ? _c : "Medium",
                        severity: (_d = input.severity) !== null && _d !== void 0 ? _d : "Support Required",
                        source: (_e = input.source) !== null && _e !== void 0 ? _e : "Reactive",
                        oeeImpact: (_f = input.oeeImpact) !== null && _f !== void 0 ? _f : "No Impact",
                        workCenterId: (_g = input.workCenterId) !== null && _g !== void 0 ? _g : null,
                        locationId: input.locationId,
                        assignee: (_h = input.assignee) !== null && _h !== void 0 ? _h : null,
                        suspectedFailureModeId: (_j = input.suspectedFailureModeId) !== null && _j !== void 0 ? _j : null,
                        plannedStartTime: (_k = input.plannedStartTime) !== null && _k !== void 0 ? _k : null,
                        plannedEndTime: (_l = input.plannedEndTime) !== null && _l !== void 0 ? _l : null,
                        content: input.content,
                        companyId: input.companyId,
                        createdBy: input.createdBy,
                        updatedBy: input.createdBy
                    })
                        .select("id, maintenanceDispatchId")
                        .single()];
                case 4:
                    dispatch = _m.sent();
                    if (dispatch.error)
                        return [2 /*return*/, { data: null, error: dispatch.error }];
                    return [2 /*return*/, {
                            data: {
                                id: dispatch.data.id,
                                maintenanceDispatchId: dispatch.data.maintenanceDispatchId
                            },
                            error: null
                        }];
            }
        });
    });
}
function updateMaintenanceDispatch(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rest, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = input.id, rest = __rest(input, ["id"]);
                    return [4 /*yield*/, client
                            .from("maintenanceDispatch")
                            .update((0, supabase_1.sanitize)(rest))
                            .eq("id", id)
                            .select("id")
                            .single()];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        return [2 /*return*/, { data: null, error: result.error }];
                    return [2 /*return*/, { data: { id: result.data.id }, error: null }];
            }
        });
    });
}
/** @deprecated Use insertMaintenanceDispatch for new dispatches, updateMaintenanceDispatch for existing dispatches */
function upsertMaintenanceDispatch(client, dispatch) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in dispatch) {
                return [2 /*return*/, (client
                        .from("maintenanceDispatch")
                        // @ts-expect-error TS2769 - TODO: fix type
                        .insert([dispatch])
                        .select("id")
                        .single())];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatch")
                        .update((0, supabase_1.sanitize)(dispatch))
                        .eq("id", dispatch.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatchComment(client, comment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in comment) {
                return [2 /*return*/, client
                        .from("maintenanceDispatchComment")
                        .insert([comment])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatchComment")
                        .update((0, supabase_1.sanitize)(comment))
                        .eq("id", comment.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatchEvent(client, event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in event) {
                return [2 /*return*/, client
                        .from("maintenanceDispatchEvent")
                        .insert([event])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatchEvent")
                        .update((0, supabase_1.sanitize)(event))
                        .eq("id", event.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatchItem(client, item) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in item) {
                return [2 /*return*/, client
                        .from("maintenanceDispatchItem")
                        .insert([item])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatchItem")
                        .update((0, supabase_1.sanitize)(item))
                        .eq("id", item.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatchWorkCenter(client, workCenter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in workCenter) {
                return [2 /*return*/, client
                        .from("maintenanceDispatchWorkCenter")
                        .insert([workCenter])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatchWorkCenter")
                        .update((0, supabase_1.sanitize)(workCenter))
                        .eq("id", workCenter.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceSchedule(client, schedule) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in schedule) {
                return [2 /*return*/, client
                        .from("maintenanceSchedule")
                        .insert([schedule])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceSchedule")
                        .update((0, supabase_1.sanitize)(schedule))
                        .eq("id", schedule.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceScheduleItem(client, item) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in item) {
                return [2 /*return*/, client
                        .from("maintenanceScheduleItem")
                        .insert([item])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceScheduleItem")
                        .update((0, supabase_1.sanitize)(item))
                        .eq("id", item.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertPartner(client, partner) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!("updatedBy" in partner)) return [3 /*break*/, 1];
                    return [2 /*return*/, client
                            .from("partner")
                            .update((0, supabase_1.sanitize)(partner))
                            .eq("id", partner.id)];
                case 1: return [4 /*yield*/, client.from("partner").insert([partner])];
                case 2: 
                // @ts-expect-error TS2769 - TODO: fix type
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function upsertProcess(client, process) {
    return __awaiter(this, void 0, void 0, function () {
        var workCenters_1, insert_1, processInsert, processId_1, processProcesses_1, processProcessInsert, workCenters, update, processUpdate, deleteWorkCenters, processProcesses, processProcessUpdate;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!("createdBy" in process)) return [3 /*break*/, 4];
                    workCenters_1 = process.workCenters, insert_1 = __rest(process, ["workCenters"]);
                    return [4 /*yield*/, client
                            .from("process")
                            .insert([
                            __assign(__assign({}, insert_1), { defaultStandardFactor: (_a = insert_1.defaultStandardFactor) !== null && _a !== void 0 ? _a : "Minutes/Piece" })
                        ])
                            .select("id")
                            .single()];
                case 1:
                    processInsert = _b.sent();
                    if (processInsert.error) {
                        return [2 /*return*/, processInsert];
                    }
                    processId_1 = processInsert.data.id;
                    processProcesses_1 = workCenters_1 === null || workCenters_1 === void 0 ? void 0 : workCenters_1.map(function (workCenterId) { return ({
                        workCenterId: workCenterId,
                        processId: processId_1,
                        companyId: insert_1.companyId,
                        createdBy: insert_1.createdBy
                    }); });
                    if (!processProcesses_1) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("workCenterProcess")
                            .insert(processProcesses_1)];
                case 2:
                    processProcessInsert = _b.sent();
                    if (processProcessInsert.error) {
                        return [2 /*return*/, processProcessInsert];
                    }
                    _b.label = 3;
                case 3: return [2 /*return*/, processInsert];
                case 4:
                    workCenters = process.workCenters, update = __rest(process, ["workCenters"]);
                    return [4 /*yield*/, client
                            .from("process")
                            .update((0, supabase_1.sanitize)(update))
                            .eq("id", process.id)];
                case 5:
                    processUpdate = _b.sent();
                    if (processUpdate.error) {
                        return [2 /*return*/, processUpdate];
                    }
                    return [4 /*yield*/, client
                            .from("workCenterProcess")
                            .delete()
                            .eq("processId", process.id)];
                case 6:
                    deleteWorkCenters = _b.sent();
                    if (deleteWorkCenters.error) {
                        return [2 /*return*/, deleteWorkCenters];
                    }
                    processProcesses = workCenters === null || workCenters === void 0 ? void 0 : workCenters.map(function (workCenterId) { return ({
                        processId: process.id,
                        workCenterId: workCenterId,
                        companyId: update.companyId,
                        createdBy: update.updatedBy
                    }); });
                    if (!processProcesses) return [3 /*break*/, 8];
                    return [4 /*yield*/, client
                            .from("workCenterProcess")
                            .insert(processProcesses)];
                case 7:
                    processProcessUpdate = _b.sent();
                    if (processProcessUpdate.error) {
                        return [2 /*return*/, processProcessUpdate];
                    }
                    _b.label = 8;
                case 8: return [2 /*return*/, processUpdate];
            }
        });
    });
}
function upsertTraining(client, training) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in training) {
                return [2 /*return*/, client
                        .from("training")
                        .update((0, supabase_1.sanitize)(training))
                        .eq("id", training.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client.from("training").insert([training]).select("id").single()];
        });
    });
}
function upsertTrainingAssignment(client, assignment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (assignment.id) {
                return [2 /*return*/, client
                        .from("trainingAssignment")
                        .update({
                        groupIds: assignment.groupIds,
                        updatedBy: assignment.updatedBy
                    })
                        .eq("id", assignment.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("trainingAssignment")
                    .insert({
                    trainingId: assignment.trainingId,
                    groupIds: assignment.groupIds,
                    companyId: assignment.companyId,
                    createdBy: assignment.createdBy
                })
                    .select("id")
                    .single()];
        });
    });
}
function upsertTrainingQuestion(client, trainingQuestion) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in trainingQuestion) {
                return [2 /*return*/, client
                        .from("trainingQuestion")
                        .update((0, supabase_1.sanitize)(trainingQuestion))
                        .eq("id", trainingQuestion.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("trainingQuestion")
                    .insert([trainingQuestion])
                    .select("id")
                    .single()];
        });
    });
}
function upsertWorkCenter(client, workCenter) {
    return __awaiter(this, void 0, void 0, function () {
        var processes_1, insert_2, workCenterInsert, workCenterId_1, workCenterProcesses_1, workCenterProcessInsert, processes, update, workCenterUpdate, deleteProcesses, workCenterProcesses, workCenterProcessUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!("createdBy" in workCenter)) return [3 /*break*/, 4];
                    processes_1 = workCenter.processes, insert_2 = __rest(workCenter, ["processes"]);
                    return [4 /*yield*/, client
                            .from("workCenter")
                            .insert([insert_2])
                            .select("id")
                            .single()];
                case 1:
                    workCenterInsert = _a.sent();
                    if (workCenterInsert.error) {
                        return [2 /*return*/, workCenterInsert];
                    }
                    workCenterId_1 = workCenterInsert.data.id;
                    workCenterProcesses_1 = processes_1 === null || processes_1 === void 0 ? void 0 : processes_1.map(function (process) { return ({
                        workCenterId: workCenterId_1,
                        processId: process,
                        companyId: insert_2.companyId,
                        createdBy: insert_2.createdBy
                    }); });
                    if (!workCenterProcesses_1) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("workCenterProcess")
                            .insert(workCenterProcesses_1)];
                case 2:
                    workCenterProcessInsert = _a.sent();
                    if (workCenterProcessInsert.error) {
                        return [2 /*return*/, workCenterProcessInsert];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, workCenterInsert];
                case 4:
                    processes = workCenter.processes, update = __rest(workCenter, ["processes"]);
                    return [4 /*yield*/, client
                            .from("workCenter")
                            .update((0, supabase_1.sanitize)(update))
                            .eq("id", workCenter.id)];
                case 5:
                    workCenterUpdate = _a.sent();
                    if (workCenterUpdate.error) {
                        return [2 /*return*/, workCenterUpdate];
                    }
                    return [4 /*yield*/, client
                            .from("workCenterProcess")
                            .delete()
                            .eq("workCenterId", workCenter.id)];
                case 6:
                    deleteProcesses = _a.sent();
                    if (deleteProcesses.error) {
                        return [2 /*return*/, deleteProcesses];
                    }
                    workCenterProcesses = processes === null || processes === void 0 ? void 0 : processes.map(function (process) { return ({
                        workCenterId: workCenter.id,
                        processId: process,
                        companyId: update.companyId,
                        createdBy: update.updatedBy
                    }); });
                    if (!workCenterProcesses) return [3 /*break*/, 8];
                    return [4 /*yield*/, client
                            .from("workCenterProcess")
                            .insert(workCenterProcesses)];
                case 7:
                    workCenterProcessUpdate = _a.sent();
                    if (workCenterProcessUpdate.error) {
                        return [2 /*return*/, workCenterProcessUpdate];
                    }
                    _a.label = 8;
                case 8: return [2 /*return*/, workCenterUpdate];
            }
        });
    });
}
