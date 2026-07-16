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
exports.messagingNotifySchema = void 0;
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
exports.messagingNotifySchema = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        type: zod_1.z.literal("jobOperationNote"),
        operationId: zod_1.z.string()
    })
]);
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, payload, _d, _e, _f, operationId, _g, job, previousMessages, assignee, jobId, makeMethodId, materialId, usersToNotify, notificationEvent, _h, _j, _k, _l;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        var request = _b.request;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _x.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    _e = (_d = exports.messagingNotifySchema).safeParse;
                    return [4 /*yield*/, request.json()];
                case 2:
                    payload = _e.apply(_d, [_x.sent()]);
                    if (!payload.success) return [3 /*break*/, 10];
                    _f = payload.data.type;
                    switch (_f) {
                        case "jobOperationNote": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 7];
                case 3:
                    operationId = payload.data.operationId;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("jobOperation")
                                .select("*, job(id, assignee), jobMakeMethod(id, parentMaterialId)")
                                .eq("id", operationId)
                                .single(),
                            client
                                .from("jobOperationNote")
                                .select("*")
                                .eq("jobOperationId", operationId)
                        ])];
                case 4:
                    _g = _x.sent(), job = _g[0], previousMessages = _g[1];
                    assignee = (_o = (_m = job.data) === null || _m === void 0 ? void 0 : _m.job) === null || _o === void 0 ? void 0 : _o.assignee;
                    jobId = (_q = (_p = job.data) === null || _p === void 0 ? void 0 : _p.job) === null || _q === void 0 ? void 0 : _q.id;
                    makeMethodId = (_s = (_r = job.data) === null || _r === void 0 ? void 0 : _r.jobMakeMethod) === null || _s === void 0 ? void 0 : _s.id;
                    materialId = (_u = (_t = job.data) === null || _t === void 0 ? void 0 : _t.jobMakeMethod) === null || _u === void 0 ? void 0 : _u.parentMaterialId;
                    usersToNotify = __spreadArray([], new Set(__spreadArray([], ((_w = (_v = previousMessages.data) === null || _v === void 0 ? void 0 : _v.map(function (m) { return m.createdBy; })) !== null && _w !== void 0 ? _w : []).filter(function (id) { return id !== userId; }), true)), true);
                    if (assignee && assignee !== userId) {
                        usersToNotify.push(assignee);
                    }
                    if (!(usersToNotify.length > 0)) return [3 /*break*/, 6];
                    notificationEvent = getNotificationEvent("jobOperationNote");
                    if (!notificationEvent) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            companyId: companyId,
                            documentId: "".concat(jobId, ":").concat(operationId, ":").concat(makeMethodId, ":").concat(materialId !== null && materialId !== void 0 ? materialId : ""),
                            event: notificationEvent,
                            recipient: {
                                type: "users",
                                userIds: usersToNotify
                            },
                            from: userId
                        })];
                case 5:
                    _x.sent();
                    _x.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    _h = react_router_1.data;
                    _j = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid payload"))];
                case 8: return [2 /*return*/, _h.apply(void 0, _j.concat([_x.sent()]))];
                case 9: return [2 /*return*/, { success: true }];
                case 10:
                    _k = react_router_1.data;
                    _l = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to notify user"))];
                case 11: return [2 /*return*/, _k.apply(void 0, _l.concat([_x.sent()]))];
            }
        });
    });
}
function getNotificationEvent(table) {
    switch (table) {
        case "jobOperationNote":
            return notifications_1.NotificationEvent.JobOperationMessage;
        default:
            return null;
    }
}
