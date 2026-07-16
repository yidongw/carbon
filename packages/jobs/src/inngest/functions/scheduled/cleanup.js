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
exports.cleanupFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var notifications_1 = require("@carbon/notifications");
var client_1 = require("../../client");
exports.cleanupFunction = client_1.inngest.createFunction({ id: "cleanup", retries: 2 }, { cron: "0 7,12,17 * * *" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("expire-quotes-and-rfqs", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, expiredQuotes, expiredSupplierQuotes, expireSupplierQuotes, expiredRfqs, closeRfqs, expireQuotes, notificationEvents, error_1;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    console.log("Starting cleanup tasks: ".concat(new Date().toISOString()));
                                    // Clean up expired quotes
                                    console.log("Checking for expired quotes...");
                                    return [4 /*yield*/, Promise.all([
                                            serviceRole
                                                .from("quote")
                                                .select("*")
                                                .eq("status", "Sent")
                                                .not("expirationDate", "is", null)
                                                .lt("expirationDate", new Date().toISOString()),
                                            serviceRole
                                                .from("supplierQuote")
                                                .select("*")
                                                .eq("status", "Active")
                                                .not("expirationDate", "is", null)
                                                .lt("expirationDate", new Date().toISOString())
                                        ])];
                                case 1:
                                    _a = _c.sent(), expiredQuotes = _a[0], expiredSupplierQuotes = _a[1];
                                    if (expiredQuotes.error) {
                                        console.error("Error fetching expired quotes: ".concat(JSON.stringify(expiredQuotes.error)));
                                        return [2 /*return*/];
                                    }
                                    if (expiredSupplierQuotes.error) {
                                        console.error("Error fetching expired supplier quotes: ".concat(JSON.stringify(expiredSupplierQuotes.error)));
                                        return [2 /*return*/];
                                    }
                                    if (!(expiredSupplierQuotes.data.length > 0)) return [3 /*break*/, 3];
                                    console.log("Found ".concat(expiredSupplierQuotes.data.length, " expired supplier quotes"));
                                    return [4 /*yield*/, serviceRole
                                            .from("supplierQuote")
                                            .update({ status: "Expired" })
                                            .in("id", expiredSupplierQuotes.data.map(function (quote) { return quote.id; }))];
                                case 2:
                                    expireSupplierQuotes = _c.sent();
                                    if (expireSupplierQuotes.error) {
                                        console.error("Error updating expired supplier quotes: ".concat(JSON.stringify(expireSupplierQuotes.error)));
                                        return [2 /*return*/];
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    console.log("No expired supplier quotes found");
                                    _c.label = 4;
                                case 4:
                                    // Auto-expire purchasing RFQs past due date
                                    console.log("Checking for expired purchasing RFQs...");
                                    return [4 /*yield*/, serviceRole
                                            .from("purchasingRfq")
                                            .select("*")
                                            .in("status", ["Draft", "Requested"])
                                            .not("expirationDate", "is", null)
                                            .lt("expirationDate", new Date().toISOString())];
                                case 5:
                                    expiredRfqs = _c.sent();
                                    if (!expiredRfqs.error) return [3 /*break*/, 6];
                                    console.error("Error fetching expired RFQs: ".concat(JSON.stringify(expiredRfqs.error)));
                                    return [3 /*break*/, 9];
                                case 6:
                                    if (!(expiredRfqs.data.length > 0)) return [3 /*break*/, 8];
                                    console.log("Found ".concat(expiredRfqs.data.length, " expired RFQs"));
                                    return [4 /*yield*/, serviceRole
                                            .from("purchasingRfq")
                                            .update({ status: "Closed" })
                                            .in("id", expiredRfqs.data.map(function (rfq) { return rfq.id; }))];
                                case 7:
                                    closeRfqs = _c.sent();
                                    if (closeRfqs.error) {
                                        console.error("Error closing expired RFQs: ".concat(JSON.stringify(closeRfqs.error)));
                                    }
                                    return [3 /*break*/, 9];
                                case 8:
                                    console.log("No expired RFQs found");
                                    _c.label = 9;
                                case 9:
                                    if (!!((_b = expiredQuotes === null || expiredQuotes === void 0 ? void 0 : expiredQuotes.data) === null || _b === void 0 ? void 0 : _b.length)) return [3 /*break*/, 10];
                                    console.log("No expired quotes found requiring notification");
                                    return [3 /*break*/, 17];
                                case 10:
                                    console.log("Found ".concat(expiredQuotes.data.length, " expired quotes"));
                                    return [4 /*yield*/, serviceRole
                                            .from("quote")
                                            .update({ status: "Expired" })
                                            .in("id", expiredQuotes.data.map(function (quote) { return quote.id; }))];
                                case 11:
                                    expireQuotes = _c.sent();
                                    if (expireQuotes.error) {
                                        console.error("Error updating expired quotes: ".concat(JSON.stringify(expireQuotes.error)));
                                        return [2 /*return*/];
                                    }
                                    notificationEvents = expiredQuotes.data
                                        .filter(function (quote) { return Boolean(quote.salesPersonId); })
                                        .map(function (quote) { return ({
                                        data: {
                                            companyId: quote.companyId,
                                            documentId: quote.id,
                                            event: notifications_1.NotificationEvent.QuoteExpired,
                                            recipient: {
                                                type: "user",
                                                userId: quote.salesPersonId
                                            }
                                        },
                                        name: "carbon/notify"
                                    }); });
                                    if (!(notificationEvents.length > 0)) return [3 /*break*/, 16];
                                    console.log("Triggering ".concat(notificationEvents.length, " notifications"));
                                    _c.label = 12;
                                case 12:
                                    _c.trys.push([12, 14, , 15]);
                                    return [4 /*yield*/, client_1.inngest.send(notificationEvents)];
                                case 13:
                                    _c.sent();
                                    return [3 /*break*/, 15];
                                case 14:
                                    error_1 = _c.sent();
                                    console.error("Error triggering notifications");
                                    console.error(error_1);
                                    return [3 /*break*/, 15];
                                case 15: return [3 /*break*/, 17];
                                case 16:
                                    console.log("No notifications to trigger");
                                    _c.label = 17;
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _c.sent();
                return [4 /*yield*/, step.run("check-gauge-calibration", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var outOfCalibrationGauges, companyIds, companySettingsResult, notificationGroupsByCompany, gaugeNotificationEvents, notifiedGaugeIds, _i, _a, gauge, notificationGroup, _b, notificationGroup_1, userId, gaugeIdsToUpdate, updateGauges, error_2, thirtyDaysAgo, ninetyDaysAgo, _c, completedCleanup, failedCleanup;
                        var _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    // Check for gauges going out of calibration
                                    console.log("Checking for gauges going out of calibration...");
                                    return [4 /*yield*/, serviceRole
                                            .from("gauges")
                                            .select("*")
                                            .eq("gaugeCalibrationStatusWithDueDate", "Out-of-Calibration")
                                            .neq("lastCalibrationStatus", "Out-of-Calibration")];
                                case 1:
                                    outOfCalibrationGauges = _e.sent();
                                    if (!outOfCalibrationGauges.error) return [3 /*break*/, 2];
                                    console.error("Error fetching out of calibration gauges: ".concat(JSON.stringify(outOfCalibrationGauges.error)));
                                    return [3 /*break*/, 13];
                                case 2:
                                    if (!(outOfCalibrationGauges.data.length > 0)) return [3 /*break*/, 12];
                                    console.log("Found ".concat(outOfCalibrationGauges.data.length, " gauges going out of calibration"));
                                    companyIds = __spreadArray([], new Set(outOfCalibrationGauges.data
                                        .map(function (g) { return g.companyId; })
                                        .filter(function (id) { return id !== null; })), true);
                                    return [4 /*yield*/, serviceRole
                                            .from("companySettings")
                                            .select("id, gaugeCalibrationExpiredNotificationGroup")
                                            .in("id", companyIds)];
                                case 3:
                                    companySettingsResult = _e.sent();
                                    if (!companySettingsResult.error) return [3 /*break*/, 4];
                                    console.error("Error fetching company settings: ".concat(JSON.stringify(companySettingsResult.error)));
                                    return [3 /*break*/, 11];
                                case 4:
                                    notificationGroupsByCompany = new Map(companySettingsResult.data.map(function (settings) {
                                        var _a;
                                        return [
                                            settings.id,
                                            (_a = settings.gaugeCalibrationExpiredNotificationGroup) !== null && _a !== void 0 ? _a : []
                                        ];
                                    }));
                                    gaugeNotificationEvents = [];
                                    notifiedGaugeIds = new Set();
                                    // Create notify events for each gauge × recipient pair.
                                    for (_i = 0, _a = outOfCalibrationGauges.data; _i < _a.length; _i++) {
                                        gauge = _a[_i];
                                        if (!gauge.companyId || !gauge.id)
                                            continue;
                                        notificationGroup = (_d = notificationGroupsByCompany.get(gauge.companyId)) !== null && _d !== void 0 ? _d : [];
                                        if (notificationGroup.length === 0) {
                                            console.log("No notification group configured for company ".concat(gauge.companyId, ", skipping gauge ").concat(gauge.gaugeId));
                                            continue;
                                        }
                                        for (_b = 0, notificationGroup_1 = notificationGroup; _b < notificationGroup_1.length; _b++) {
                                            userId = notificationGroup_1[_b];
                                            gaugeNotificationEvents.push({
                                                data: {
                                                    companyId: gauge.companyId,
                                                    documentId: gauge.id,
                                                    event: notifications_1.NotificationEvent.GaugeCalibrationExpired,
                                                    recipient: { type: "user", userId: userId }
                                                },
                                                name: "carbon/notify"
                                            });
                                            notifiedGaugeIds.add(gauge.id);
                                        }
                                    }
                                    if (!(gaugeNotificationEvents.length > 0)) return [3 /*break*/, 10];
                                    console.log("Triggering ".concat(gaugeNotificationEvents.length, " gauge calibration notifications"));
                                    _e.label = 5;
                                case 5:
                                    _e.trys.push([5, 8, , 9]);
                                    return [4 /*yield*/, client_1.inngest.send(gaugeNotificationEvents)];
                                case 6:
                                    _e.sent();
                                    gaugeIdsToUpdate = __spreadArray([], notifiedGaugeIds, true);
                                    return [4 /*yield*/, serviceRole
                                            .from("gauge")
                                            .update({ lastCalibrationStatus: "Out-of-Calibration" })
                                            .in("id", gaugeIdsToUpdate)];
                                case 7:
                                    updateGauges = _e.sent();
                                    if (updateGauges.error) {
                                        console.error("Error updating gauge lastCalibrationStatus: ".concat(JSON.stringify(updateGauges.error)));
                                    }
                                    else {
                                        console.log("Updated lastCalibrationStatus for ".concat(gaugeIdsToUpdate.length, " gauges"));
                                    }
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_2 = _e.sent();
                                    console.error("Error triggering gauge calibration notifications");
                                    console.error(error_2);
                                    return [3 /*break*/, 9];
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    console.log("No gauge calibration notifications to trigger");
                                    _e.label = 11;
                                case 11: return [3 /*break*/, 13];
                                case 12:
                                    console.log("No gauges going out of calibration found");
                                    _e.label = 13;
                                case 13:
                                    // Clean up old print jobs:
                                    // - Completed jobs older than 30 days (served their purpose)
                                    // - Failed jobs older than 90 days (retained longer for diagnostics)
                                    // - Jobs in generating, queued, or printing status are never cleaned up
                                    console.log("Cleaning up old print jobs...");
                                    thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
                                    ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
                                    return [4 /*yield*/, Promise.all([
                                            serviceRole
                                                .from("printJob")
                                                .delete()
                                                .eq("status", "completed")
                                                .lt("completedAt", thirtyDaysAgo),
                                            serviceRole
                                                .from("printJob")
                                                .delete()
                                                .eq("status", "failed")
                                                .lt("createdAt", ninetyDaysAgo)
                                        ])];
                                case 14:
                                    _c = _e.sent(), completedCleanup = _c[0], failedCleanup = _c[1];
                                    if (completedCleanup.error) {
                                        console.error("Error cleaning up completed print jobs: ".concat(JSON.stringify(completedCleanup.error)));
                                    }
                                    if (failedCleanup.error) {
                                        console.error("Error cleaning up failed print jobs: ".concat(JSON.stringify(failedCleanup.error)));
                                    }
                                    console.log("Print job cleanup completed");
                                    console.log("\uD83E\uDDF9 Cleanup tasks completed: ".concat(new Date().toISOString()));
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
