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
var session_server_1 = require("@carbon/auth/session.server");
var users_server_1 = require("@carbon/auth/users.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, validation, _d, _e, _f, users, redirectTo, _g, _h, targetUserId, result, _j, _k, batchPayload, _l, _m, e_1, _o, _p;
        var request = _b.request;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        delete: "users"
                    })];
                case 1:
                    _c = _q.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    _e = (_d = (0, form_1.validator)(users_1.deactivateUsersValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_q.sent()])];
                case 3:
                    validation = _q.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, users = _f.users, redirectTo = _f.redirectTo;
                    if (!users.includes(userId)) return [3 /*break*/, 5];
                    _g = react_router_1.redirect;
                    _h = [(0, auth_1.safeRedirect)(redirectTo)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "You cannot deactivate yourself"))];
                case 4: throw _g.apply(void 0, _h.concat([_q.sent()]));
                case 5:
                    if (!(users.length === 1)) return [3 /*break*/, 8];
                    targetUserId = users[0];
                    return [4 /*yield*/, (0, users_server_1.deactivateUser)(client, targetUserId, companyId)];
                case 6:
                    result = _q.sent();
                    _j = react_router_1.redirect;
                    _k = [(0, auth_1.safeRedirect)(redirectTo)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, result)];
                case 7: throw _j.apply(void 0, _k.concat([_q.sent()]));
                case 8:
                    batchPayload = users.map(function (id) { return ({
                        payload: {
                            id: id,
                            type: "deactivate",
                            companyId: companyId
                        }
                    }); });
                    _q.label = 9;
                case 9:
                    _q.trys.push([9, 12, , 14]);
                    return [4 /*yield*/, (0, jobs_1.batchTrigger)("user-admin", batchPayload)];
                case 10:
                    _q.sent();
                    _l = react_router_1.redirect;
                    _m = [(0, auth_1.safeRedirect)(redirectTo)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Success. Please check back in a few moments."))];
                case 11: throw _l.apply(void 0, _m.concat([_q.sent()]));
                case 12:
                    e_1 = _q.sent();
                    _o = react_router_1.redirect;
                    _p = [(0, auth_1.safeRedirect)(redirectTo)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(e_1, "Failed to deactivate users"))];
                case 13: throw _o.apply(void 0, _p.concat([_q.sent()]));
                case 14: return [2 /*return*/];
            }
        });
    });
}
