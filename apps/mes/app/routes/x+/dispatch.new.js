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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
var operations_service_1 = require("~/services/operations.service");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, formData, validation, serviceRole, nextSequence, _d, _e, content, isOperatorPerformed, status, currentTime, locationId, workCenter, insertDispatch, _f, _g, companySettings, notificationGroup, failureMode, err_1, _h, _j;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        var request = _b.request;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _v.sent(), companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _v.sent();
                    return [4 /*yield*/, (0, form_1.validator)(models_1.maintenanceDispatchValidator).validate(formData)];
                case 3:
                    validation = _v.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 4:
                    serviceRole = _v.sent();
                    return [4 /*yield*/, serviceRole.rpc("get_next_sequence", {
                            sequence_name: "maintenanceDispatch",
                            company_id: companyId
                        })];
                case 5:
                    nextSequence = _v.sent();
                    if (!nextSequence.error) return [3 /*break*/, 7];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(nextSequence.error, "Failed to get next sequence"))];
                case 6: return [2 /*return*/, _d.apply(void 0, _e.concat([_v.sent()]))];
                case 7:
                    content = validation.data.content
                        ? JSON.parse(validation.data.content)
                        : {};
                    isOperatorPerformed = validation.data.severity === "Operator Performed";
                    status = isOperatorPerformed
                        ? validation.data.actualEndTime
                            ? "Completed"
                            : "In Progress"
                        : "Open";
                    currentTime = (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString();
                    if (!validation.data.workCenterId) return [3 /*break*/, 9];
                    return [4 /*yield*/, serviceRole
                            .from("workCenter")
                            .select("locationId")
                            .eq("id", validation.data.workCenterId)
                            .single()];
                case 8:
                    workCenter = _v.sent();
                    if (!workCenter.error && ((_k = workCenter.data) === null || _k === void 0 ? void 0 : _k.locationId)) {
                        locationId = workCenter.data.locationId;
                    }
                    _v.label = 9;
                case 9: return [4 /*yield*/, serviceRole
                        .from("maintenanceDispatch")
                        .insert([
                        {
                            maintenanceDispatchId: nextSequence.data,
                            status: status,
                            priority: validation.data.priority,
                            severity: validation.data.severity,
                            oeeImpact: validation.data.oeeImpact,
                            source: "Reactive", // Coming from MES is always reactive
                            workCenterId: validation.data.workCenterId,
                            locationId: locationId,
                            assignee: isOperatorPerformed ? userId : undefined,
                            suspectedFailureModeId: validation.data.suspectedFailureModeId || undefined,
                            actualFailureModeId: validation.data.actualFailureModeId || undefined,
                            plannedStartTime: currentTime, // Set plannedStartTime to today for reactive maintenance
                            actualStartTime: validation.data.actualStartTime || undefined,
                            actualEndTime: validation.data.actualEndTime || undefined,
                            content: content,
                            companyId: companyId,
                            createdBy: userId
                        }
                    ])
                        .select("id")
                        .single()];
                case 10:
                    insertDispatch = _v.sent();
                    if (!insertDispatch.error) return [3 /*break*/, 12];
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertDispatch.error, "Failed to create maintenance dispatch"))];
                case 11: return [2 /*return*/, _f.apply(void 0, _g.concat([_v.sent()]))];
                case 12:
                    if (!(validation.data.oeeImpact === "Down")) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, operations_service_1.endProductionEventsByWorkCenter)(serviceRole, {
                            workCenterId: validation.data.workCenterId,
                            companyId: companyId,
                            endTime: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString()
                        })];
                case 13:
                    _v.sent();
                    _v.label = 14;
                case 14:
                    if (!((_l = insertDispatch.data) === null || _l === void 0 ? void 0 : _l.id)) return [3 /*break*/, 22];
                    _v.label = 15;
                case 15:
                    _v.trys.push([15, 21, , 22]);
                    return [4 /*yield*/, serviceRole
                            .from("companySettings")
                            .select("maintenanceDispatchNotificationGroup, qualityDispatchNotificationGroup, operationsDispatchNotificationGroup, otherDispatchNotificationGroup")
                            .eq("id", companyId)
                            .single()];
                case 16:
                    companySettings = _v.sent();
                    if (!(!companySettings.error && companySettings.data)) return [3 /*break*/, 20];
                    notificationGroup = [];
                    if (!validation.data.suspectedFailureModeId) return [3 /*break*/, 18];
                    return [4 /*yield*/, serviceRole
                            .from("maintenanceFailureMode")
                            .select("type")
                            .eq("id", validation.data.suspectedFailureModeId)
                            .single()];
                case 17:
                    failureMode = _v.sent();
                    if (!failureMode.error && ((_m = failureMode.data) === null || _m === void 0 ? void 0 : _m.type)) {
                        // Route to the appropriate notification group based on type
                        switch (failureMode.data.type) {
                            case "Maintenance":
                                notificationGroup =
                                    (_o = companySettings.data.maintenanceDispatchNotificationGroup) !== null && _o !== void 0 ? _o : [];
                                break;
                            case "Quality":
                                notificationGroup =
                                    (_p = companySettings.data.qualityDispatchNotificationGroup) !== null && _p !== void 0 ? _p : [];
                                break;
                            case "Operations":
                                notificationGroup =
                                    (_q = companySettings.data.operationsDispatchNotificationGroup) !== null && _q !== void 0 ? _q : [];
                                break;
                            case "Other":
                                notificationGroup =
                                    (_r = companySettings.data.otherDispatchNotificationGroup) !== null && _r !== void 0 ? _r : [];
                                break;
                        }
                    }
                    _v.label = 18;
                case 18:
                    // Default to maintenance group if no failure mode or no notification group found
                    if (notificationGroup.length === 0) {
                        notificationGroup =
                            (_s = companySettings.data.maintenanceDispatchNotificationGroup) !== null && _s !== void 0 ? _s : [];
                    }
                    if (!(notificationGroup.length > 0)) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            companyId: companyId,
                            documentId: insertDispatch.data.id,
                            event: notifications_1.NotificationEvent.MaintenanceDispatchCreated,
                            recipient: {
                                type: "group",
                                groupIds: notificationGroup
                            },
                            from: userId
                        })];
                case 19:
                    _v.sent();
                    _v.label = 20;
                case 20: return [3 /*break*/, 22];
                case 21:
                    err_1 = _v.sent();
                    console.error("Failed to trigger maintenance dispatch notification", err_1);
                    return [3 /*break*/, 22];
                case 22:
                    if (((_t = insertDispatch.data) === null || _t === void 0 ? void 0 : _t.id) && isOperatorPerformed) {
                        throw (0, react_router_1.redirect)(path_1.path.to.maintenanceDetail(insertDispatch.data.id));
                    }
                    _h = react_router_1.data;
                    _j = [{ id: (_u = insertDispatch.data) === null || _u === void 0 ? void 0 : _u.id }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Maintenance dispatch created"))];
                case 23: return [2 /*return*/, _h.apply(void 0, _j.concat([_v.sent()]))];
            }
        });
    });
}
