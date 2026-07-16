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
exports.loader = loader;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var storage_rules_server_1 = require("@carbon/ee/storage-rules.server");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var maintenance_service_1 = require("~/services/maintenance.service");
var operations_service_1 = require("~/services/operations.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, operationId, url, trackedEntityId, type, serviceRole, jobOperation, _d, _e, _f, _g, workCenterStatus, _h, _j, trackedEntities, acknowledged, ruleEval, _k, _l, currentTime, startEvent, _m, _o;
        var _p, _q, _r, _s, _t, _u, _v, _w;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _x.sent(), userId = _c.userId, companyId = _c.companyId;
                    operationId = params.operationId;
                    if (!operationId)
                        throw new Error("Operation ID is required");
                    url = new URL(request.url);
                    trackedEntityId = url.searchParams.get("trackedEntityId");
                    type = ((_p = url.searchParams.get("type")) !== null && _p !== void 0 ? _p : "Labor");
                    if (!["Setup", "Labor", "Machine"].includes(type)) {
                        type = "Labor";
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _x.sent();
                    return [4 /*yield*/, Promise.all([
                            serviceRole
                                .from("jobOperation")
                                .select("*")
                                .eq("id", operationId)
                                .maybeSingle(),
                            serviceRole
                                .from("productionEvent")
                                .update({
                                endTime: null,
                                updatedBy: userId
                            })
                                .eq("jobOperationId", operationId)
                                .is("endTime", null)
                        ])];
                case 3:
                    jobOperation = (_x.sent())[0];
                    if (!(jobOperation.error || !jobOperation.data)) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(jobOperation.error, "Failed to fetch job operation"))];
                case 4: throw _d.apply(void 0, _e.concat([_x.sent()]));
                case 5:
                    if (!(((_q = jobOperation.data) === null || _q === void 0 ? void 0 : _q.companyId) !== companyId)) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("You are not authorized to start this operation", "Unauthorized"))];
                case 6: throw _f.apply(void 0, _g.concat([_x.sent()]));
                case 7:
                    if (!jobOperation.data.workCenterId) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, maintenance_service_1.getWorkCenterWithBlockingStatus)(serviceRole, jobOperation.data.workCenterId)];
                case 8:
                    workCenterStatus = _x.sent();
                    if (!((_r = workCenterStatus.data) === null || _r === void 0 ? void 0 : _r.isBlocked)) return [3 /*break*/, 10];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Work center is blocked for maintenance (".concat(workCenterStatus.data.blockingDispatchReadableId, ")"), "Work Center Blocked"))];
                case 9: throw _h.apply(void 0, _j.concat([_x.sent()]));
                case 10:
                    if (!(!trackedEntityId && jobOperation.data.jobMakeMethodId)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, operations_service_1.getTrackedEntitiesByMakeMethodId)(serviceRole, jobOperation.data.jobMakeMethodId)];
                case 11:
                    trackedEntities = _x.sent();
                    if (trackedEntities.data && trackedEntities.data.length > 0) {
                        // Use the last tracked entity if available
                        trackedEntityId =
                            trackedEntities.data[trackedEntities.data.length - 1].id;
                    }
                    _x.label = 12;
                case 12:
                    if (!jobOperation.data.workCenterId) return [3 /*break*/, 15];
                    acknowledged = url.searchParams.get("acknowledged") === "true";
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "workCenter",
                            surface: "operationStart",
                            lines: [
                                {
                                    lineId: operationId,
                                    itemId: null,
                                    workCenterId: jobOperation.data.workCenterId,
                                    operation: {
                                        id: operationId,
                                        itemId: null,
                                        quantity: (_s = jobOperation.data.operationQuantity) !== null && _s !== void 0 ? _s : null,
                                        workInstructionId: (_t = jobOperation.data
                                            .workInstructionId) !== null && _t !== void 0 ? _t : null
                                    },
                                    quantity: (_u = jobOperation.data.operationQuantity) !== null && _u !== void 0 ? _u : 0
                                }
                            ]
                        })];
                case 13:
                    ruleEval = _x.sent();
                    if (!(ruleEval.violations.length > 0 &&
                        (0, storage_rules_server_1.isBlocked)(ruleEval.violations, acknowledged))) return [3 /*break*/, 15];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.operation(operationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)((_w = (_v = ruleEval.violations[0]) === null || _v === void 0 ? void 0 : _v.message) !== null && _w !== void 0 ? _w : "Rule violation", "Cannot start operation"))];
                case 14: throw _k.apply(void 0, _l.concat([_x.sent()]));
                case 15:
                    if (!(type === "Machine")) return [3 /*break*/, 17];
                    currentTime = (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString();
                    return [4 /*yield*/, serviceRole
                            .from("productionEvent")
                            .update({
                            endTime: currentTime,
                            updatedAt: currentTime,
                            updatedBy: userId
                        })
                            .eq("jobOperationId", operationId)
                            .in("type", ["Setup", "Labor"])
                            .is("endTime", null)];
                case 16:
                    _x.sent();
                    _x.label = 17;
                case 17: return [4 /*yield*/, (0, operations_service_1.startProductionEvent)(serviceRole, {
                        type: type,
                        jobOperationId: operationId,
                        workCenterId: jobOperation.data.workCenterId,
                        startTime: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString(),
                        employeeId: userId,
                        companyId: companyId,
                        createdBy: userId
                    }, trackedEntityId || undefined)];
                case 18:
                    startEvent = _x.sent();
                    if (!startEvent.error) return [3 /*break*/, 20];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(startEvent.error, "Failed to start event"))];
                case 19: throw _m.apply(void 0, _o.concat([_x.sent()]));
                case 20: throw (0, react_router_1.redirect)(path_1.path.to.operation(operationId));
            }
        });
    });
}
