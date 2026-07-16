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
exports.loader = loader;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var storage_rules_server_1 = require("@carbon/ee/storage-rules.server");
var react_router_1 = require("react-router");
var operations_service_1 = require("~/services/operations.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, operationId, url, trackedEntityId, serviceRole, _d, jobOperation, productionQuantities, _e, _f, _g, _h, completeAll, jobMakeMethod, _j, _k, currentQuantity, quantityToComplete, willBeFinished, isTrackedEntity, acknowledged, ruleEval, _l, _m, trackedEntities, response, newTrackedEntityId, finishOperation, _o, _p, _q, _r, response, _s, _t, insertProduction, _u, _v, issue, _w, _x, finishOperation, _y, _z, _0, _1, _2, _3;
        var _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_18) {
            switch (_18.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _18.sent(), userId = _c.userId, companyId = _c.companyId;
                    operationId = params.operationId;
                    if (!operationId)
                        throw new Error("Operation ID is required");
                    url = new URL(request.url);
                    trackedEntityId = url.searchParams.get("trackedEntityId");
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _18.sent();
                    return [4 /*yield*/, Promise.all([
                            serviceRole
                                .from("jobOperation")
                                .select("*, ...process(completeAllOnScan)")
                                .eq("id", operationId)
                                .maybeSingle(),
                            serviceRole
                                .from("productionQuantity")
                                .select("*")
                                .eq("type", "Production")
                                .eq("jobOperationId", operationId)
                        ])];
                case 3:
                    _d = _18.sent(), jobOperation = _d[0], productionQuantities = _d[1];
                    if (!(jobOperation.error ||
                        !jobOperation.data ||
                        !jobOperation.data.jobMakeMethodId)) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(jobOperation.error, "Failed to fetch job operation")), { flash: "error" }))];
                case 4: return [2 /*return*/, _e.apply(void 0, _f.concat([_18.sent()]))];
                case 5:
                    if (!(((_4 = jobOperation.data) === null || _4 === void 0 ? void 0 : _4.companyId) !== companyId)) return [3 /*break*/, 7];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)("You are not authorized to start this operation", "Unauthorized")), { flash: "error" }))];
                case 6: return [2 /*return*/, _g.apply(void 0, _h.concat([_18.sent()]))];
                case 7:
                    completeAll = (_6 = (_5 = jobOperation.data) === null || _5 === void 0 ? void 0 : _5.completeAllOnScan) !== null && _6 !== void 0 ? _6 : false;
                    return [4 /*yield*/, Promise.all([
                            serviceRole
                                .from("jobMakeMethod")
                                .select("*")
                                .eq("id", jobOperation.data.jobMakeMethodId)
                                .maybeSingle()
                        ])];
                case 8:
                    jobMakeMethod = (_18.sent())[0];
                    if (!(jobMakeMethod.error || !jobMakeMethod.data)) return [3 /*break*/, 10];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(jobMakeMethod.error, "Failed to fetch job make method"))];
                case 9: return [2 /*return*/, _j.apply(void 0, _k.concat([_18.sent()]))];
                case 10:
                    currentQuantity = (_8 = (_7 = productionQuantities.data) === null || _7 === void 0 ? void 0 : _7.reduce(function (acc, curr) { return acc + curr.quantity; }, 0)) !== null && _8 !== void 0 ? _8 : 0;
                    quantityToComplete = completeAll
                        ? Math.max(0, ((_9 = jobOperation.data.operationQuantity) !== null && _9 !== void 0 ? _9 : 0) -
                            currentQuantity -
                            ((_10 = jobOperation.data.quantityReworked) !== null && _10 !== void 0 ? _10 : 0))
                        : 1;
                    willBeFinished = quantityToComplete + currentQuantity >=
                        ((_12 = (_11 = jobOperation.data.targetQuantity) !== null && _11 !== void 0 ? _11 : jobOperation.data.operationQuantity) !== null && _12 !== void 0 ? _12 : 0);
                    isTrackedEntity = jobMakeMethod.data.requiresSerialTracking ||
                        jobMakeMethod.data.requiresBatchTracking;
                    if (!(willBeFinished && jobOperation.data.workCenterId)) return [3 /*break*/, 13];
                    acknowledged = url.searchParams.get("acknowledged") === "true";
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "workCenter",
                            surface: "operationFinish",
                            lines: [
                                {
                                    lineId: operationId,
                                    itemId: jobMakeMethod.data.itemId,
                                    workCenterId: jobOperation.data.workCenterId,
                                    operation: {
                                        id: operationId,
                                        itemId: jobMakeMethod.data.itemId,
                                        quantity: (_13 = jobOperation.data.operationQuantity) !== null && _13 !== void 0 ? _13 : null,
                                        workInstructionId: (_14 = jobOperation.data
                                            .workInstructionId) !== null && _14 !== void 0 ? _14 : null
                                    },
                                    quantity: quantityToComplete
                                }
                            ]
                        })];
                case 11:
                    ruleEval = _18.sent();
                    if (!(ruleEval.violations.length > 0 &&
                        (0, storage_rules_server_1.isBlocked)(ruleEval.violations, acknowledged))) return [3 /*break*/, 13];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)((_16 = (_15 = ruleEval.violations[0]) === null || _15 === void 0 ? void 0 : _15.message) !== null && _16 !== void 0 ? _16 : "Rule violation", "Cannot finish operation"))];
                case 12: return [2 /*return*/, _l.apply(void 0, _m.concat([_18.sent()]))];
                case 13:
                    if (!(quantityToComplete > 0)) return [3 /*break*/, 32];
                    if (!isTrackedEntity) return [3 /*break*/, 26];
                    if (!!trackedEntityId) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, operations_service_1.getTrackedEntitiesByMakeMethodId)(serviceRole, jobOperation.data.jobMakeMethodId)];
                case 14:
                    trackedEntities = _18.sent();
                    if (trackedEntities.data && trackedEntities.data.length > 0) {
                        trackedEntityId =
                            trackedEntities.data[trackedEntities.data.length - 1].id;
                    }
                    _18.label = 15;
                case 15:
                    if (!jobMakeMethod.data.requiresSerialTracking) return [3 /*break*/, 22];
                    return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                            body: {
                                type: "jobOperationSerialComplete",
                                quantity: 1,
                                jobOperationId: jobOperation.data.id,
                                trackedEntityId: trackedEntityId,
                                trackingType: "Serial",
                                notes: "Generated by QR code",
                                companyId: companyId,
                                userId: userId
                            }
                        })];
                case 16:
                    response = _18.sent();
                    newTrackedEntityId = (_17 = response.data) === null || _17 === void 0 ? void 0 : _17.newTrackedEntityId;
                    if (newTrackedEntityId) {
                        return [2 /*return*/, (0, react_router_1.redirect)("".concat(path_1.path.to.operation(operationId), "?trackedEntityId=").concat(newTrackedEntityId))];
                    }
                    if (!willBeFinished) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, operations_service_1.finishJobOperation)(serviceRole, {
                            jobOperationId: jobOperation.data.id,
                            userId: userId,
                            companyId: companyId
                        })];
                case 17:
                    finishOperation = _18.sent();
                    if (!finishOperation.error) return [3 /*break*/, 19];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(finishOperation.error, "Failed to finish operation"))];
                case 18: return [2 /*return*/, _o.apply(void 0, _p.concat([_18.sent()]))];
                case 19:
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.success)("Operation finished successfully")), { flash: "success" }))];
                case 20: return [2 /*return*/, _q.apply(void 0, _r.concat([_18.sent()]))];
                case 21: return [3 /*break*/, 25];
                case 22:
                    if (!jobMakeMethod.data.requiresBatchTracking) return [3 /*break*/, 25];
                    return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                            body: {
                                type: "jobOperationBatchComplete",
                                quantity: quantityToComplete,
                                jobOperationId: jobOperation.data.id,
                                trackedEntityId: trackedEntityId,
                                trackingType: "Batch",
                                notes: "Generated by QR code",
                                companyId: companyId,
                                userId: userId
                            }
                        })];
                case 23:
                    response = _18.sent();
                    if (!response.error) return [3 /*break*/, 25];
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(response.error, "Failed to complete job operation")), { flash: "error" }))];
                case 24: return [2 /*return*/, _s.apply(void 0, _t.concat([_18.sent()]))];
                case 25: return [3 /*break*/, 32];
                case 26: return [4 /*yield*/, (0, operations_service_1.insertProductionQuantity)(serviceRole, {
                        quantity: quantityToComplete,
                        jobOperationId: jobOperation.data.id,
                        notes: "Generated by QR code",
                        companyId: companyId,
                        createdBy: userId,
                        employeeId: userId
                    })];
                case 27:
                    insertProduction = _18.sent();
                    if (!insertProduction.error) return [3 /*break*/, 29];
                    _u = react_router_1.redirect;
                    _v = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(insertProduction.error, "Failed to record production quantity")), { flash: "error" }))];
                case 28: return [2 /*return*/, _u.apply(void 0, _v.concat([_18.sent()]))];
                case 29: return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                        body: {
                            id: operationId,
                            type: "jobOperation",
                            quantity: quantityToComplete,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 30:
                    issue = _18.sent();
                    if (!issue.error) return [3 /*break*/, 32];
                    _w = react_router_1.redirect;
                    _x = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(issue.error, "Failed to issue materials")), { flash: "error" }))];
                case 31: return [2 /*return*/, _w.apply(void 0, _x.concat([_18.sent()]))];
                case 32:
                    if (!willBeFinished) return [3 /*break*/, 37];
                    return [4 /*yield*/, (0, operations_service_1.finishJobOperation)(serviceRole, {
                            jobOperationId: jobOperation.data.id,
                            userId: userId,
                            companyId: companyId
                        })];
                case 33:
                    finishOperation = _18.sent();
                    if (!finishOperation.error) return [3 /*break*/, 35];
                    _y = react_router_1.redirect;
                    _z = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.error)(finishOperation.error, "Failed to finish operation")), { flash: "error" }))];
                case 34: return [2 /*return*/, _y.apply(void 0, _z.concat([_18.sent()]))];
                case 35:
                    _0 = react_router_1.redirect;
                    _1 = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.success)("Operation finished successfully")), { flash: "success" }))];
                case 36: return [2 /*return*/, _0.apply(void 0, _1.concat([_18.sent()]))];
                case 37:
                    _2 = react_router_1.redirect;
                    _3 = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, __assign(__assign({}, (0, auth_1.success)("Successfully completed part")), { flash: "success" }))];
                case 38: return [2 /*return*/, _2.apply(void 0, _3.concat([_18.sent()]))];
            }
        });
    });
}
