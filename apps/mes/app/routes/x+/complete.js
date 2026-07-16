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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var printing_server_1 = require("@carbon/printing/printing.server");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
var operations_service_1 = require("~/services/operations.service");
var path_1 = require("~/utils/path");
/**
 * Triggers an auto-print of the entity's label when this is its first
 * operation (i.e. the entity was just minted) and the work center's
 * printer assignment has auto-print enabled.
 */
function autoPrintFirstOperationLabel(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var entity, attributes, operationCount, workCenter, locationId, config, e_1;
        var _c, _d, _e;
        var serviceRole = _b.serviceRole, trackedEntityId = _b.trackedEntityId, workCenterId = _b.workCenterId, companyId = _b.companyId, userId = _b.userId;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, serviceRole
                            .from("trackedEntity")
                            .select("attributes")
                            .eq("id", trackedEntityId)
                            .single()];
                case 1:
                    entity = (_f.sent()).data;
                    attributes = ((_c = entity === null || entity === void 0 ? void 0 : entity.attributes) !== null && _c !== void 0 ? _c : {});
                    operationCount = Object.keys(attributes).filter(function (k) {
                        return k.startsWith("Operation ");
                    }).length;
                    if (operationCount > 1)
                        return [2 /*return*/];
                    if (!workCenterId)
                        return [2 /*return*/];
                    return [4 /*yield*/, serviceRole
                            .from("workCenter")
                            .select("locationId")
                            .eq("id", workCenterId)
                            .single()];
                case 2:
                    workCenter = (_f.sent()).data;
                    locationId = (_d = workCenter === null || workCenter === void 0 ? void 0 : workCenter.locationId) !== null && _d !== void 0 ? _d : undefined;
                    if (!locationId)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, printing_server_1.getCachedPrinterConfig)(serviceRole, companyId, locationId, "workCenter", workCenterId)];
                case 3:
                    config = _f.sent();
                    if (!((_e = config === null || config === void 0 ? void 0 : config.autoPrint) !== null && _e !== void 0 ? _e : true)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Job",
                            sourceDocumentId: trackedEntityId,
                            companyId: companyId,
                            userId: userId,
                            locationId: locationId,
                            workCenterId: workCenterId
                        })];
                case 4:
                    _f.sent();
                    _f.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _f.sent();
                    console.error("Auto-print failed:", e_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, canAutoApprove, _d, now, currentYear, currentMonth, formData, validation, serviceRole, jobOperation, _e, _f, totalAccountedQuantity, willBeFinished, response, newTrackedEntityId, completedEntityId, printEntityId, trackedEntityId, _g, _h, finishOperation, _j, _k, _l, _m, response, _o, _p, finishOperation, _q, _r, _s, _t, _u, trackedEntityId, trackingType, d, insertProduction, _v, _w, issue, _x, _y, finishOperation, _z, _0, _1, _2, _3, _4;
        var _5, _6, _7, _8, _9, _10, _11, _12;
        var request = _b.request;
        return __generator(this, function (_13) {
            switch (_13.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _13.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    canAutoApprove = false;
                    _13.label = 2;
                case 2:
                    _13.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, { update: "production" })];
                case 3:
                    _13.sent();
                    canAutoApprove = true;
                    return [3 /*break*/, 5];
                case 4:
                    _d = _13.sent();
                    canAutoApprove = false;
                    return [3 /*break*/, 5];
                case 5:
                    now = new Date();
                    currentYear = now.getFullYear();
                    currentMonth = now.getMonth() + 1;
                    return [4 /*yield*/, request.formData()];
                case 6:
                    formData = _13.sent();
                    return [4 /*yield*/, (0, form_1.validator)(models_1.nonScrapQuantityValidator).validate(formData)];
                case 7:
                    validation = _13.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 8:
                    serviceRole = _13.sent();
                    return [4 /*yield*/, serviceRole
                            .from("jobOperation")
                            .select("*")
                            .eq("id", validation.data.jobOperationId)
                            .maybeSingle()];
                case 9:
                    jobOperation = _13.sent();
                    if (!(jobOperation.error || !jobOperation.data)) return [3 /*break*/, 11];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(jobOperation.error, "Failed to fetch job operation")), { flash: "error" }))];
                case 10: return [2 /*return*/, _e.apply(void 0, _f.concat([_13.sent()]))];
                case 11:
                    totalAccountedQuantity = ((_5 = jobOperation.data.quantityComplete) !== null && _5 !== void 0 ? _5 : 0) +
                        ((_6 = jobOperation.data.quantityReworked) !== null && _6 !== void 0 ? _6 : 0) +
                        ((_7 = jobOperation.data.quantityScrapped) !== null && _7 !== void 0 ? _7 : 0) +
                        validation.data.quantity;
                    willBeFinished = totalAccountedQuantity >=
                        ((_9 = (_8 = jobOperation.data.targetQuantity) !== null && _8 !== void 0 ? _8 : jobOperation.data.operationQuantity) !== null && _9 !== void 0 ? _9 : 0);
                    if (!(validation.data.trackingType === "Serial")) return [3 /*break*/, 22];
                    return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                            body: __assign(__assign({ type: "jobOperationSerialComplete" }, validation.data), { employeeId: userId, paymentYear: canAutoApprove ? currentYear : null, paymentMonth: canAutoApprove ? currentMonth : null, companyId: companyId, userId: userId })
                        })];
                case 12:
                    response = _13.sent();
                    newTrackedEntityId = (_10 = response.data) === null || _10 === void 0 ? void 0 : _10.newTrackedEntityId;
                    completedEntityId = validation.data.trackedEntityId;
                    printEntityId = completedEntityId || newTrackedEntityId;
                    if (!printEntityId) return [3 /*break*/, 14];
                    return [4 /*yield*/, autoPrintFirstOperationLabel({
                            serviceRole: serviceRole,
                            trackedEntityId: printEntityId,
                            workCenterId: (_11 = jobOperation.data.workCenterId) !== null && _11 !== void 0 ? _11 : undefined,
                            companyId: companyId,
                            userId: userId
                        })];
                case 13:
                    _13.sent();
                    _13.label = 14;
                case 14:
                    trackedEntityId = newTrackedEntityId;
                    if (!response.error) return [3 /*break*/, 16];
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(response.error, "Failed to complete job operation")), { flash: "error" }))];
                case 15: return [2 /*return*/, _g.apply(void 0, _h.concat([_13.sent()]))];
                case 16:
                    if (!willBeFinished) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, operations_service_1.finishJobOperation)(serviceRole, {
                            jobOperationId: jobOperation.data.id,
                            userId: userId,
                            companyId: companyId
                        })];
                case 17:
                    finishOperation = _13.sent();
                    if (!finishOperation.error) return [3 /*break*/, 19];
                    _j = react_router_1.data;
                    _k = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(finishOperation.error, "Failed to finish operation")), { flash: "error" }))];
                case 18: return [2 /*return*/, _j.apply(void 0, _k.concat([_13.sent()]))];
                case 19:
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.success)("Operation finished successfully")), { flash: "success" }))];
                case 20: return [2 /*return*/, _l.apply(void 0, _m.concat([_13.sent()]))];
                case 21:
                    if (trackedEntityId) {
                        return [2 /*return*/, (0, react_router_1.redirect)("".concat(path_1.path.to.operation(validation.data.jobOperationId), "?trackedEntityId=").concat(trackedEntityId))];
                    }
                    return [2 /*return*/, (0, react_router_1.redirect)("".concat(path_1.path.to.operation(validation.data.jobOperationId)))];
                case 22:
                    if (!(validation.data.trackingType === "Batch")) return [3 /*break*/, 33];
                    return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                            body: __assign(__assign({ type: "jobOperationBatchComplete" }, validation.data), { employeeId: userId, paymentYear: canAutoApprove ? currentYear : null, paymentMonth: canAutoApprove ? currentMonth : null, companyId: companyId, userId: userId })
                        })];
                case 23:
                    response = _13.sent();
                    if (!response.error) return [3 /*break*/, 25];
                    _o = react_router_1.data;
                    _p = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(response.error, "Failed to complete job operation")), { flash: "error" }))];
                case 24: return [2 /*return*/, _o.apply(void 0, _p.concat([_13.sent()]))];
                case 25:
                    if (!validation.data.trackedEntityId) return [3 /*break*/, 27];
                    return [4 /*yield*/, autoPrintFirstOperationLabel({
                            serviceRole: serviceRole,
                            trackedEntityId: validation.data.trackedEntityId,
                            workCenterId: (_12 = jobOperation.data.workCenterId) !== null && _12 !== void 0 ? _12 : undefined,
                            companyId: companyId,
                            userId: userId
                        })];
                case 26:
                    _13.sent();
                    _13.label = 27;
                case 27:
                    if (!willBeFinished) return [3 /*break*/, 32];
                    return [4 /*yield*/, (0, operations_service_1.finishJobOperation)(serviceRole, {
                            jobOperationId: jobOperation.data.id,
                            userId: userId,
                            companyId: companyId
                        })];
                case 28:
                    finishOperation = _13.sent();
                    if (!finishOperation.error) return [3 /*break*/, 30];
                    _q = react_router_1.data;
                    _r = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(finishOperation.error, "Failed to finish operation")), { flash: "error" }))];
                case 29: return [2 /*return*/, _q.apply(void 0, _r.concat([_13.sent()]))];
                case 30:
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.success)("Operation finished successfully")), { flash: "success" }))];
                case 31: return [2 /*return*/, _s.apply(void 0, _t.concat([_13.sent()]))];
                case 32: return [2 /*return*/, (0, react_router_1.redirect)("".concat(path_1.path.to.operation(validation.data.jobOperationId)))];
                case 33:
                    _u = validation.data, trackedEntityId = _u.trackedEntityId, trackingType = _u.trackingType, d = __rest(_u, ["trackedEntityId", "trackingType"]);
                    return [4 /*yield*/, (0, operations_service_1.insertProductionQuantity)(client, __assign(__assign({}, d), { employeeId: userId, paymentYear: canAutoApprove ? currentYear : null, paymentMonth: canAutoApprove ? currentMonth : null, companyId: companyId, createdBy: userId }))];
                case 34:
                    insertProduction = _13.sent();
                    if (!insertProduction.error) return [3 /*break*/, 36];
                    _v = react_router_1.data;
                    _w = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(insertProduction.error, "Failed to record production quantity")), { flash: "error" }))];
                case 35: return [2 /*return*/, _v.apply(void 0, _w.concat([_13.sent()]))];
                case 36: return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                        body: {
                            id: validation.data.jobOperationId,
                            type: "jobOperation",
                            quantity: validation.data.quantity,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 37:
                    issue = _13.sent();
                    if (!issue.error) return [3 /*break*/, 39];
                    _x = react_router_1.data;
                    _y = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(issue.error, "Failed to issue materials")), { flash: "error" }))];
                case 38: return [2 /*return*/, _x.apply(void 0, _y.concat([_13.sent()]))];
                case 39:
                    if (!willBeFinished) return [3 /*break*/, 44];
                    return [4 /*yield*/, (0, operations_service_1.finishJobOperation)(serviceRole, {
                            jobOperationId: jobOperation.data.id,
                            userId: userId,
                            companyId: companyId
                        })];
                case 40:
                    finishOperation = _13.sent();
                    if (!finishOperation.error) return [3 /*break*/, 42];
                    _z = react_router_1.data;
                    _0 = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(finishOperation.error, "Failed to finish operation")), { flash: "error" }))];
                case 41: return [2 /*return*/, _z.apply(void 0, _0.concat([_13.sent()]))];
                case 42:
                    _1 = react_router_1.redirect;
                    _2 = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.success)("Operation finished successfully")), { flash: "success" }))];
                case 43: return [2 /*return*/, _1.apply(void 0, _2.concat([_13.sent()]))];
                case 44:
                    _3 = react_router_1.data;
                    _4 = [insertProduction.data];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.success)("Successfully completed part")), { flash: "success" }))];
                case 45: return [2 /*return*/, _3.apply(void 0, _4.concat([_13.sent()]))];
            }
        });
    });
}
