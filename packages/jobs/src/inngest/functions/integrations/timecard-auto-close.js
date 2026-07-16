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
exports.timeCardAutoCloseFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var client_1 = require("../../client");
exports.timeCardAutoCloseFunction = client_1.inngest.createFunction({ id: "timecard-auto-close", retries: 2 }, 
// Run every Sunday at 11pm UTC (after weekly task at 9pm)
{ cron: "0 23 * * 0" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("auto-close-timecards", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, companies, companiesError, totalClosed, _i, _b, company, _c, openEntries, entriesError, _d, openEntries_1, entry, employeeJob, clockOut, shiftId, shift, startParts, endParts, durationMinutes, updateError, err_1;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    console.log("Starting timecard auto-close: ".concat(new Date().toISOString()));
                                    _e.label = 1;
                                case 1:
                                    _e.trys.push([1, 14, , 15]);
                                    return [4 /*yield*/, serviceRole
                                            .from("companySettings")
                                            .select("id")
                                            .eq("timeCardEnabled", true)];
                                case 2:
                                    _a = _e.sent(), companies = _a.data, companiesError = _a.error;
                                    if (companiesError) {
                                        console.error("Failed to fetch companies: ".concat(companiesError.message));
                                        return [2 /*return*/];
                                    }
                                    console.log("Found ".concat((companies === null || companies === void 0 ? void 0 : companies.length) || 0, " companies with time clock enabled"));
                                    totalClosed = 0;
                                    _i = 0, _b = companies !== null && companies !== void 0 ? companies : [];
                                    _e.label = 3;
                                case 3:
                                    if (!(_i < _b.length)) return [3 /*break*/, 13];
                                    company = _b[_i];
                                    return [4 /*yield*/, serviceRole
                                            .from("timeCardEntry")
                                            .select("id, employeeId, clockIn")
                                            .eq("companyId", company.id)
                                            .is("clockOut", null)];
                                case 4:
                                    _c = _e.sent(), openEntries = _c.data, entriesError = _c.error;
                                    if (entriesError) {
                                        console.error("Failed to fetch open entries for company ".concat(company.id, ": ").concat(entriesError.message));
                                        return [3 /*break*/, 12];
                                    }
                                    if (!openEntries || openEntries.length === 0)
                                        return [3 /*break*/, 12];
                                    console.log("Company ".concat(company.id, ": ").concat(openEntries.length, " open entries"));
                                    _d = 0, openEntries_1 = openEntries;
                                    _e.label = 5;
                                case 5:
                                    if (!(_d < openEntries_1.length)) return [3 /*break*/, 12];
                                    entry = openEntries_1[_d];
                                    return [4 /*yield*/, serviceRole
                                            .from("employeeJob")
                                            .select("shiftId")
                                            .eq("id", entry.employeeId)
                                            .eq("companyId", company.id)
                                            .single()];
                                case 6:
                                    employeeJob = (_e.sent()).data;
                                    clockOut = void 0;
                                    shiftId = null;
                                    if (!(employeeJob === null || employeeJob === void 0 ? void 0 : employeeJob.shiftId)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, serviceRole
                                            .from("shift")
                                            .select("startTime, endTime")
                                            .eq("id", employeeJob.shiftId)
                                            .single()];
                                case 7:
                                    shift = (_e.sent()).data;
                                    if (shift) {
                                        startParts = shift.startTime.split(":").map(Number);
                                        endParts = shift.endTime.split(":").map(Number);
                                        durationMinutes = endParts[0] * 60 +
                                            endParts[1] -
                                            (startParts[0] * 60 + startParts[1]);
                                        // Handle overnight shifts
                                        if (durationMinutes <= 0)
                                            durationMinutes += 24 * 60;
                                        clockOut = new Date(new Date(entry.clockIn).getTime() + durationMinutes * 60000);
                                        shiftId = employeeJob.shiftId;
                                    }
                                    else {
                                        // Shift not found, fall back to 8 hours
                                        clockOut = new Date(new Date(entry.clockIn).getTime() + 8 * 3600000);
                                    }
                                    return [3 /*break*/, 9];
                                case 8:
                                    // No shift assigned, fall back to 8 hours
                                    clockOut = new Date(new Date(entry.clockIn).getTime() + 8 * 3600000);
                                    _e.label = 9;
                                case 9: return [4 /*yield*/, serviceRole
                                        .from("timeCardEntry")
                                        .update({
                                        clockOut: clockOut.toISOString(),
                                        autoCloseShiftId: shiftId,
                                        updatedAt: new Date().toISOString(),
                                        note: "Auto-closed by system (Sunday weekly close)"
                                    })
                                        .eq("id", entry.id)];
                                case 10:
                                    updateError = (_e.sent()).error;
                                    if (updateError) {
                                        console.error("Failed to auto-close entry ".concat(entry.id, ": ").concat(updateError.message));
                                    }
                                    else {
                                        totalClosed++;
                                        console.log("Auto-closed entry ".concat(entry.id, " for employee ").concat(entry.employeeId));
                                    }
                                    _e.label = 11;
                                case 11:
                                    _d++;
                                    return [3 /*break*/, 5];
                                case 12:
                                    _i++;
                                    return [3 /*break*/, 3];
                                case 13:
                                    console.log("Timecard auto-close completed: ".concat(totalClosed, " entries closed"));
                                    return [3 /*break*/, 15];
                                case 14:
                                    err_1 = _e.sent();
                                    console.error("Unexpected error in timecard auto-close: ".concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                                    return [3 /*break*/, 15];
                                case 15: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
