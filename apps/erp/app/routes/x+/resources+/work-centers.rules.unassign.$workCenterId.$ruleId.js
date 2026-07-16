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
exports.clientAction = clientAction;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var plan_server_1 = require("@carbon/ee/plan.server");
var react_router_1 = require("react-router");
var storageRules_1 = require("~/modules/storageRules");
var path_1 = require("~/utils/path");
var react_query_1 = require("~/utils/react-query");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, workCenterId, ruleId, result, _d, _e, _f, _g;
        var _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            delete: "resources"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, plan_server_1.requirePlan)({
                            request: request,
                            client: client,
                            companyId: companyId,
                            feature: "STORAGE_RULES",
                            redirectTo: path_1.path.to.storageRules
                        })];
                case 2:
                    _k.sent();
                    workCenterId = params.workCenterId, ruleId = params.ruleId;
                    if (!workCenterId || !ruleId)
                        throw new Error("workCenterId and ruleId required");
                    return [4 /*yield*/, (0, storageRules_1.unassignStorageRule)(client, {
                            targetType: "workCenter",
                            targetId: workCenterId,
                            ruleId: ruleId
                        })];
                case 3:
                    result = _k.sent();
                    if (!result.error) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [(_h = request.headers.get("Referer")) !== null && _h !== void 0 ? _h : path_1.path.to.storageRules];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to unassign rule"))];
                case 4: throw _d.apply(void 0, _e.concat([_k.sent()]));
                case 5:
                    _f = react_router_1.redirect;
                    _g = [(_j = request.headers.get("Referer")) !== null && _j !== void 0 ? _j : path_1.path.to.storageRules];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Rule unassigned"))];
                case 6: throw _f.apply(void 0, _g.concat([_k.sent()]));
            }
        });
    });
}
function clientAction(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var workCenterId;
        var _c;
        var serverAction = _b.serverAction, params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    workCenterId = params.workCenterId;
                    if (workCenterId) {
                        (_c = window === null || window === void 0 ? void 0 : window.clientCache) === null || _c === void 0 ? void 0 : _c.setQueryData((0, react_query_1.storageRuleAssignmentsQuery)("workCenter", workCenterId, (0, react_query_1.getCompanyId)())
                            .queryKey, null);
                    }
                    return [4 /*yield*/, serverAction()];
                case 1: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
