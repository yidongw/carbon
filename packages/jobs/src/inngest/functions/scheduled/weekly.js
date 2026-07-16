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
exports.weeklyFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var notifications_1 = require("@carbon/notifications");
var utils_1 = require("@carbon/utils");
var client_1 = require("../../client");
exports.weeklyFunction = client_1.inngest.createFunction({ id: "weekly", retries: 2 }, { cron: "0 21 * * 0" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("cloud-cleanup", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var bypassUrl, bypassResponse, bypassData, bypassList_1, _a, companies, companiesError, _b, companyPlans, plansError, planMap_1, oneWeekAgo_1, companiesToDelete, deletedCompaniesError, _i, companiesToDelete_1, company, _c, companiesToDelete_2, company, dropSearchError, error_1;
                        var _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    console.log("Starting weekly tasks: ".concat(new Date().toISOString()));
                                    _e.label = 1;
                                case 1:
                                    _e.trys.push([1, 11, , 12]);
                                    if (!(process.env.CARBON_EDITION === utils_1.Edition.Cloud)) return [3 /*break*/, 10];
                                    bypassUrl = "".concat(process.env.VERCEL_URL, "/api/settings/bypass");
                                    return [4 /*yield*/, fetch(bypassUrl)];
                                case 2:
                                    bypassResponse = _e.sent();
                                    if (!bypassResponse.ok) {
                                        console.error("Failed to fetch bypass list: ".concat(bypassResponse.statusText));
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, bypassResponse.json()];
                                case 3:
                                    bypassData = (_e.sent());
                                    bypassList_1 = (_d = bypassData.bypassList) !== null && _d !== void 0 ? _d : [];
                                    console.log("Bypass list: ".concat(bypassList_1));
                                    return [4 /*yield*/, serviceRole
                                            .from("company")
                                            .select("id, name, createdAt")];
                                case 4:
                                    _a = _e.sent(), companies = _a.data, companiesError = _a.error;
                                    if (companiesError) {
                                        console.error("Failed to fetch companies: ".concat(companiesError.message));
                                        return [2 /*return*/];
                                    }
                                    console.log("Found ".concat((companies === null || companies === void 0 ? void 0 : companies.length) || 0, " companies"));
                                    return [4 /*yield*/, serviceRole
                                            .from("companyPlan")
                                            .select("id, stripeSubscriptionStatus")];
                                case 5:
                                    _b = _e.sent(), companyPlans = _b.data, plansError = _b.error;
                                    if (plansError) {
                                        console.error("Failed to fetch company plans: ".concat(plansError.message));
                                        return [2 /*return*/];
                                    }
                                    planMap_1 = new Map((companyPlans === null || companyPlans === void 0 ? void 0 : companyPlans.map(function (plan) { return [
                                        plan.id,
                                        plan.stripeSubscriptionStatus
                                    ]; })) || []);
                                    oneWeekAgo_1 = new Date();
                                    oneWeekAgo_1.setDate(oneWeekAgo_1.getDate() - 7);
                                    companiesToDelete = (companies === null || companies === void 0 ? void 0 : companies.filter(function (company) {
                                        if (planMap_1.get(company.id) === "Canceled") {
                                            return true;
                                        }
                                        if (bypassList_1.includes(company.id)) {
                                            return false;
                                        }
                                        if (planMap_1.get(company.id)) {
                                            return false;
                                        }
                                        // Keep companies created in the last week
                                        var createdAt = new Date(company.createdAt);
                                        if (createdAt > oneWeekAgo_1) {
                                            return false;
                                        }
                                        // Delete this company
                                        return true;
                                    })) || [];
                                    console.log("Companies to delete: ".concat(companiesToDelete.length));
                                    return [4 /*yield*/, serviceRole
                                            .from("company")
                                            .delete()
                                            .in("id", companiesToDelete.map(function (company) { return company.id; }))];
                                case 6:
                                    deletedCompaniesError = (_e.sent()).error;
                                    if (deletedCompaniesError) {
                                        console.error("Failed to delete companies: ".concat(deletedCompaniesError.message));
                                        return [2 /*return*/];
                                    }
                                    else {
                                        console.log("Deleted ".concat(companiesToDelete.length, " companies"));
                                        for (_i = 0, companiesToDelete_1 = companiesToDelete; _i < companiesToDelete_1.length; _i++) {
                                            company = companiesToDelete_1[_i];
                                            console.log("Deleted company ".concat(company.name));
                                        }
                                    }
                                    _c = 0, companiesToDelete_2 = companiesToDelete;
                                    _e.label = 7;
                                case 7:
                                    if (!(_c < companiesToDelete_2.length)) return [3 /*break*/, 10];
                                    company = companiesToDelete_2[_c];
                                    return [4 /*yield*/, serviceRole.rpc("drop_company_search_index", { p_company_id: company.id })];
                                case 8:
                                    dropSearchError = (_e.sent()).error;
                                    if (dropSearchError) {
                                        console.error("Failed to drop search index for company ".concat(company.name, ": ").concat(dropSearchError.message));
                                    }
                                    else {
                                        console.log("Dropped search index for company ".concat(company.name));
                                    }
                                    _e.label = 9;
                                case 9:
                                    _c++;
                                    return [3 /*break*/, 7];
                                case 10: return [3 /*break*/, 12];
                                case 11:
                                    error_1 = _e.sent();
                                    console.error("Unexpected error in cloud cleanup: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                                    return [3 /*break*/, 12];
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _c.sent();
                return [4 /*yield*/, step.run("notify-outstanding-trainings", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, companiesWithTrainings, companiesError, uniqueCompanyIds, totalNotifications, _i, uniqueCompanyIds_1, companyId, _b, trainingStatus, trainingsError, outstandingTrainings, assignmentsByEmployee, _c, outstandingTrainings_1, training, key, _d, assignmentsByEmployee_1, _e, assignment, err_1, error_2;
                        var _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    // Notify employees with outstanding trainings (Pending or Overdue)
                                    console.log("Checking for outstanding training assignments...");
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 12, , 13]);
                                    return [4 /*yield*/, serviceRole
                                            .from("trainingAssignment")
                                            .select("companyId")
                                            .limit(1000)];
                                case 2:
                                    _a = _g.sent(), companiesWithTrainings = _a.data, companiesError = _a.error;
                                    if (companiesError) {
                                        console.error("Failed to fetch companies with trainings: ".concat(companiesError.message));
                                        return [2 /*return*/];
                                    }
                                    uniqueCompanyIds = __spreadArray([], new Set((_f = companiesWithTrainings === null || companiesWithTrainings === void 0 ? void 0 : companiesWithTrainings.map(function (c) { return c.companyId; })) !== null && _f !== void 0 ? _f : []), true);
                                    console.log("Found ".concat(uniqueCompanyIds.length, " companies with training assignments"));
                                    totalNotifications = 0;
                                    _i = 0, uniqueCompanyIds_1 = uniqueCompanyIds;
                                    _g.label = 3;
                                case 3:
                                    if (!(_i < uniqueCompanyIds_1.length)) return [3 /*break*/, 11];
                                    companyId = uniqueCompanyIds_1[_i];
                                    return [4 /*yield*/, serviceRole.rpc("get_training_assignment_status", {
                                            p_company_id: companyId
                                        })];
                                case 4:
                                    _b = _g.sent(), trainingStatus = _b.data, trainingsError = _b.error;
                                    if (trainingsError) {
                                        console.error("Failed to fetch trainings for company ".concat(companyId, ": ").concat(trainingsError.message));
                                        return [3 /*break*/, 10];
                                    }
                                    outstandingTrainings = (trainingStatus !== null && trainingStatus !== void 0 ? trainingStatus : []).filter(function (t) { return t.status === "Pending" || t.status === "Overdue"; });
                                    assignmentsByEmployee = new Map();
                                    for (_c = 0, outstandingTrainings_1 = outstandingTrainings; _c < outstandingTrainings_1.length; _c++) {
                                        training = outstandingTrainings_1[_c];
                                        key = "".concat(training.companyId, ":").concat(training.employeeId, ":").concat(training.trainingAssignmentId);
                                        if (!assignmentsByEmployee.has(key)) {
                                            assignmentsByEmployee.set(key, training);
                                        }
                                    }
                                    _d = 0, assignmentsByEmployee_1 = assignmentsByEmployee;
                                    _g.label = 5;
                                case 5:
                                    if (!(_d < assignmentsByEmployee_1.length)) return [3 /*break*/, 10];
                                    _e = assignmentsByEmployee_1[_d], assignment = _e[1];
                                    _g.label = 6;
                                case 6:
                                    _g.trys.push([6, 8, , 9]);
                                    return [4 /*yield*/, client_1.inngest.send({
                                            name: "carbon/notify",
                                            data: {
                                                companyId: assignment.companyId,
                                                documentId: assignment.trainingAssignmentId,
                                                event: notifications_1.NotificationEvent.TrainingAssignment,
                                                recipient: {
                                                    type: "user",
                                                    userId: assignment.employeeId
                                                }
                                            }
                                        })];
                                case 7:
                                    _g.sent();
                                    console.log("Sent reminder for training \"".concat(assignment.trainingName, "\" to employee ").concat(assignment.employeeId));
                                    totalNotifications++;
                                    return [3 /*break*/, 9];
                                case 8:
                                    err_1 = _g.sent();
                                    console.error("Failed to send training reminder: ".concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                                    return [3 /*break*/, 9];
                                case 9:
                                    _d++;
                                    return [3 /*break*/, 5];
                                case 10:
                                    _i++;
                                    return [3 /*break*/, 3];
                                case 11:
                                    console.log("Sent ".concat(totalNotifications, " training reminder notifications"));
                                    return [3 /*break*/, 13];
                                case 12:
                                    error_2 = _g.sent();
                                    console.error("Unexpected error in training notifications: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                                    return [3 /*break*/, 13];
                                case 13:
                                    console.log("Weekly tasks completed: ".concat(new Date().toISOString()));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
