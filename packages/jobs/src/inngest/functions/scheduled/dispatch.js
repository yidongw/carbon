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
exports.dispatchFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var notifications_1 = require("@carbon/notifications");
var date_1 = require("@internationalized/date");
var client_1 = require("../../client");
// Day of week mapping (0 = Sunday, 1 = Monday, etc.)
var dayOfWeekFields = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
];
// Check if a date is enabled for the schedule based on day-of-week settings
function isDayEnabledForSchedule(schedule, targetDate) {
    // Only check day-of-week for Daily frequency
    if (schedule.frequency !== "Daily") {
        return true;
    }
    var dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    var dayField = dayOfWeekFields[dayOfWeek];
    return schedule[dayField] === true;
}
// Check if a date is a holiday for the company
function isHoliday(companyId, date) {
    return __awaiter(this, void 0, void 0, function () {
        var dateString, serviceRole, _a, holiday, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dateString = date.toISOString().split("T")[0];
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("holiday")
                            .select("id")
                            .eq("companyId", companyId)
                            .eq("date", dateString)
                            .maybeSingle()];
                case 1:
                    _a = _b.sent(), holiday = _a.data, error = _a.error;
                    if (error) {
                        console.error("Error checking holiday for ".concat(dateString, ": ").concat(error.message));
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, holiday !== null];
            }
        });
    });
}
exports.dispatchFunction = client_1.inngest.createFunction({ id: "dispatch", retries: 2 }, { cron: "0 6 * * *" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("generate-maintenance-dispatches", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var currentDateTime, _a, companiesWithSettings, settingsError, totalDispatchesCreated, _loop_1, _i, _b, settings, error_1;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    currentDateTime = (0, date_1.now)((0, date_1.getLocalTimeZone)());
                                    console.log("Starting maintenance dispatch generation: ".concat(currentDateTime.toString()));
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 7, , 8]);
                                    return [4 /*yield*/, serviceRole
                                            .from("companySettings")
                                            .select("id, maintenanceGenerateInAdvance, maintenanceAdvanceDays")
                                            .eq("maintenanceGenerateInAdvance", true)];
                                case 2:
                                    _a = _d.sent(), companiesWithSettings = _a.data, settingsError = _a.error;
                                    if (settingsError) {
                                        console.error("Failed to fetch company settings: ".concat(settingsError.message));
                                        return [2 /*return*/];
                                    }
                                    console.log("Found ".concat((companiesWithSettings === null || companiesWithSettings === void 0 ? void 0 : companiesWithSettings.length) || 0, " companies with auto-generation enabled"));
                                    totalDispatchesCreated = 0;
                                    _loop_1 = function (settings) {
                                        var advanceDays, futureDate, _e, dueSchedules, schedulesError, _f, _g, schedule, typedSchedule, currentNextDueAt, _loop_2, state_1, err_1;
                                        return __generator(this, function (_h) {
                                            switch (_h.label) {
                                                case 0:
                                                    advanceDays = (_c = settings.maintenanceAdvanceDays) !== null && _c !== void 0 ? _c : 7;
                                                    futureDate = currentDateTime.add({ days: advanceDays });
                                                    return [4 /*yield*/, serviceRole
                                                            .from("maintenanceSchedule")
                                                            .select("*")
                                                            .eq("companyId", settings.id)
                                                            .eq("active", true)
                                                            .or("nextDueAt.is.null,nextDueAt.lte.".concat(futureDate.toAbsoluteString()))];
                                                case 1:
                                                    _e = _h.sent(), dueSchedules = _e.data, schedulesError = _e.error;
                                                    if (schedulesError) {
                                                        console.error("Failed to fetch schedules for company ".concat(settings.id, ": ").concat(schedulesError.message));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    console.log("Company ".concat(settings.id, ": ").concat((dueSchedules === null || dueSchedules === void 0 ? void 0 : dueSchedules.length) || 0, " schedules due"));
                                                    _f = 0, _g = dueSchedules !== null && dueSchedules !== void 0 ? dueSchedules : [];
                                                    _h.label = 2;
                                                case 2:
                                                    if (!(_f < _g.length)) return [3 /*break*/, 10];
                                                    schedule = _g[_f];
                                                    _h.label = 3;
                                                case 3:
                                                    _h.trys.push([3, 8, , 9]);
                                                    typedSchedule = schedule;
                                                    currentNextDueAt = typedSchedule.nextDueAt
                                                        ? new Date(typedSchedule.nextDueAt)
                                                        : new Date();
                                                    _loop_2 = function () {
                                                        var targetDate, isHolidayDate, _j, sequenceData, sequenceError, _k, newDispatch, dispatchError, scheduleItems, workCenterEmployees, userIds;
                                                        return __generator(this, function (_l) {
                                                            switch (_l.label) {
                                                                case 0:
                                                                    targetDate = currentNextDueAt;
                                                                    // For Daily schedules, check if this day of week is enabled
                                                                    if (!isDayEnabledForSchedule(typedSchedule, targetDate)) {
                                                                        console.log("Skipping schedule \"".concat(typedSchedule.name, "\" for ").concat(targetDate.toISOString().split("T")[0], " - day of week not enabled"));
                                                                        // Advance to next day for daily schedules
                                                                        if (typedSchedule.frequency === "Daily") {
                                                                            currentNextDueAt = new Date(currentNextDueAt);
                                                                            currentNextDueAt.setDate(currentNextDueAt.getDate() + 1);
                                                                            return [2 /*return*/, "continue"];
                                                                        }
                                                                        return [2 /*return*/, "break"];
                                                                    }
                                                                    if (!typedSchedule.skipHolidays) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, isHoliday(settings.id, targetDate)];
                                                                case 1:
                                                                    isHolidayDate = _l.sent();
                                                                    if (isHolidayDate) {
                                                                        console.log("Skipping schedule \"".concat(typedSchedule.name, "\" - ").concat(targetDate.toISOString().split("T")[0], " is a holiday"));
                                                                        // Advance to next occurrence based on frequency
                                                                        currentNextDueAt = new Date(currentNextDueAt);
                                                                        switch (typedSchedule.frequency) {
                                                                            case "Daily":
                                                                                currentNextDueAt.setDate(currentNextDueAt.getDate() + 1);
                                                                                break;
                                                                            case "Weekly":
                                                                                currentNextDueAt.setDate(currentNextDueAt.getDate() + 7);
                                                                                break;
                                                                            case "Monthly":
                                                                                currentNextDueAt.setMonth(currentNextDueAt.getMonth() + 1);
                                                                                break;
                                                                            case "Quarterly":
                                                                                currentNextDueAt.setMonth(currentNextDueAt.getMonth() + 3);
                                                                                break;
                                                                            case "Annual":
                                                                                currentNextDueAt.setFullYear(currentNextDueAt.getFullYear() + 1);
                                                                                break;
                                                                        }
                                                                        return [2 /*return*/, "continue"];
                                                                    }
                                                                    _l.label = 2;
                                                                case 2: return [4 /*yield*/, serviceRole.rpc("get_next_sequence", {
                                                                        sequence_name: "maintenanceDispatch",
                                                                        company_id: settings.id
                                                                    })];
                                                                case 3:
                                                                    _j = _l.sent(), sequenceData = _j.data, sequenceError = _j.error;
                                                                    if (sequenceError) {
                                                                        console.error("Failed to get sequence for schedule ".concat(schedule.id, ": ").concat(sequenceError.message));
                                                                        return [2 /*return*/, "break"];
                                                                    }
                                                                    return [4 /*yield*/, serviceRole
                                                                            .from("maintenanceDispatch")
                                                                            .insert({
                                                                            maintenanceDispatchId: sequenceData,
                                                                            status: "Open",
                                                                            priority: schedule.priority,
                                                                            source: "Scheduled",
                                                                            severity: "Preventive",
                                                                            oeeImpact: "Planned",
                                                                            workCenterId: schedule.workCenterId,
                                                                            maintenanceScheduleId: schedule.id,
                                                                            procedureId: schedule.procedureId,
                                                                            plannedStartTime: targetDate.toISOString(),
                                                                            companyId: settings.id,
                                                                            createdBy: "system"
                                                                        })
                                                                            .select("id")
                                                                            .single()];
                                                                case 4:
                                                                    _k = _l.sent(), newDispatch = _k.data, dispatchError = _k.error;
                                                                    if (dispatchError) {
                                                                        console.error("Failed to create dispatch for schedule ".concat(schedule.id, ": ").concat(dispatchError.message));
                                                                        return [2 /*return*/, "break"];
                                                                    }
                                                                    return [4 /*yield*/, serviceRole
                                                                            .from("maintenanceScheduleItem")
                                                                            .select("itemId, quantity, unitOfMeasureCode")
                                                                            .eq("maintenanceScheduleId", schedule.id)];
                                                                case 5:
                                                                    scheduleItems = (_l.sent()).data;
                                                                    if (!(scheduleItems && scheduleItems.length > 0)) return [3 /*break*/, 7];
                                                                    return [4 /*yield*/, serviceRole.from("maintenanceDispatchItem").insert(scheduleItems.map(function (item) { return ({
                                                                            maintenanceDispatchId: newDispatch.id,
                                                                            itemId: item.itemId,
                                                                            quantity: item.quantity,
                                                                            unitOfMeasureCode: item.unitOfMeasureCode,
                                                                            companyId: settings.id,
                                                                            createdBy: "system"
                                                                        }); }))];
                                                                case 6:
                                                                    _l.sent();
                                                                    _l.label = 7;
                                                                case 7: 
                                                                // Link work center
                                                                return [4 /*yield*/, serviceRole.from("maintenanceDispatchWorkCenter").insert({
                                                                        maintenanceDispatchId: newDispatch.id,
                                                                        workCenterId: schedule.workCenterId,
                                                                        companyId: settings.id,
                                                                        createdBy: "system"
                                                                    })];
                                                                case 8:
                                                                    // Link work center
                                                                    _l.sent();
                                                                    totalDispatchesCreated++;
                                                                    console.log("Created dispatch ".concat(sequenceData, " for schedule \"").concat(schedule.name, "\" on ").concat(targetDate.toISOString().split("T")[0]));
                                                                    return [4 /*yield*/, serviceRole
                                                                            .from("workCenterEmployee")
                                                                            .select("userId")
                                                                            .eq("workCenterId", schedule.workCenterId)];
                                                                case 9:
                                                                    workCenterEmployees = (_l.sent()).data;
                                                                    if (!(workCenterEmployees && workCenterEmployees.length > 0)) return [3 /*break*/, 11];
                                                                    userIds = workCenterEmployees.map(function (e) { return e.userId; });
                                                                    return [4 /*yield*/, client_1.inngest.send({
                                                                            name: "carbon/notify",
                                                                            data: {
                                                                                event: notifications_1.NotificationEvent.MaintenanceDispatchCreated,
                                                                                companyId: settings.id,
                                                                                documentId: newDispatch.id,
                                                                                recipient: {
                                                                                    type: "users",
                                                                                    userIds: userIds
                                                                                }
                                                                            }
                                                                        })];
                                                                case 10:
                                                                    _l.sent();
                                                                    console.log("Notified ".concat(userIds.length, " work center employees about dispatch ").concat(sequenceData));
                                                                    _l.label = 11;
                                                                case 11:
                                                                    // Calculate next due date based on frequency
                                                                    currentNextDueAt = new Date(currentNextDueAt);
                                                                    switch (schedule.frequency) {
                                                                        case "Daily":
                                                                            currentNextDueAt.setDate(currentNextDueAt.getDate() + 1);
                                                                            break;
                                                                        case "Weekly":
                                                                            currentNextDueAt.setDate(currentNextDueAt.getDate() + 7);
                                                                            break;
                                                                        case "Monthly":
                                                                            currentNextDueAt.setMonth(currentNextDueAt.getMonth() + 1);
                                                                            break;
                                                                        case "Quarterly":
                                                                            currentNextDueAt.setMonth(currentNextDueAt.getMonth() + 3);
                                                                            break;
                                                                        case "Annual":
                                                                            currentNextDueAt.setFullYear(currentNextDueAt.getFullYear() + 1);
                                                                            break;
                                                                    }
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    };
                                                    _h.label = 4;
                                                case 4:
                                                    if (!(currentNextDueAt <= new Date(futureDate.toAbsoluteString()))) return [3 /*break*/, 6];
                                                    return [5 /*yield**/, _loop_2()];
                                                case 5:
                                                    state_1 = _h.sent();
                                                    if (state_1 === "break")
                                                        return [3 /*break*/, 6];
                                                    return [3 /*break*/, 4];
                                                case 6: 
                                                // Update schedule's lastGeneratedAt and nextDueAt after processing all dates
                                                return [4 /*yield*/, serviceRole
                                                        .from("maintenanceSchedule")
                                                        .update({
                                                        lastGeneratedAt: currentDateTime.toAbsoluteString(),
                                                        nextDueAt: currentNextDueAt.toISOString()
                                                    })
                                                        .eq("id", schedule.id)];
                                                case 7:
                                                    // Update schedule's lastGeneratedAt and nextDueAt after processing all dates
                                                    _h.sent();
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    err_1 = _h.sent();
                                                    console.error("Error processing schedule ".concat(schedule.id, ": ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                                                    return [3 /*break*/, 9];
                                                case 9:
                                                    _f++;
                                                    return [3 /*break*/, 2];
                                                case 10: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _b = companiesWithSettings !== null && companiesWithSettings !== void 0 ? companiesWithSettings : [];
                                    _d.label = 3;
                                case 3:
                                    if (!(_i < _b.length)) return [3 /*break*/, 6];
                                    settings = _b[_i];
                                    return [5 /*yield**/, _loop_1(settings)];
                                case 4:
                                    _d.sent();
                                    _d.label = 5;
                                case 5:
                                    _i++;
                                    return [3 /*break*/, 3];
                                case 6:
                                    console.log("Maintenance dispatch generation completed: ".concat(totalDispatchesCreated, " dispatches created"));
                                    return [2 /*return*/, { dispatchesCreated: totalDispatchesCreated }];
                                case 7:
                                    error_1 = _d.sent();
                                    console.error("Unexpected error in maintenance generation: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                                    throw error_1;
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1: return [2 /*return*/, _c.sent()];
        }
    });
}); });
