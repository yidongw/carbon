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
var users_server_1 = require("@carbon/auth/users.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, validation, _c, _d, users, serviceRole, usersToRevoke, _e, _f, deactivate, _g, _h, batchPayload, revokeInvites, _j, _k, _l, _m;
        var request = _b.request;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "users"
                    })];
                case 1:
                    companyId = (_o.sent()).companyId;
                    _d = (_c = (0, form_1.validator)(users_1.revokeInviteValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _d.apply(_c, [_o.sent()])];
                case 3:
                    validation = _o.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    users = validation.data.users;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("id, email")
                            .in("id", users)];
                case 4:
                    usersToRevoke = _o.sent();
                    if (!usersToRevoke.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(usersToRevoke.error.message, "Failed to load users"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_o.sent()]))];
                case 6:
                    if (!(usersToRevoke.data.length == 1)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, users_server_1.deactivateUser)(serviceRole, usersToRevoke.data[0].id, companyId)];
                case 7:
                    deactivate = _o.sent();
                    if (!!deactivate.success) return [3 /*break*/, 9];
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(deactivate.message, "Failed to deactivate user"))];
                case 8: return [2 /*return*/, _g.apply(void 0, _h.concat([_o.sent()]))];
                case 9:
                    if (!(auth_1.CarbonEdition === utils_1.Edition.Cloud)) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, stripe_server_1.updateSubscriptionQuantityForCompany)(companyId)];
                case 10:
                    _o.sent();
                    _o.label = 11;
                case 11: return [3 /*break*/, 14];
                case 12:
                    batchPayload = users.map(function (id) { return ({
                        payload: {
                            id: id,
                            type: "deactivate",
                            companyId: companyId
                        }
                    }); });
                    return [4 /*yield*/, (0, jobs_1.batchTrigger)("user-admin", batchPayload)];
                case 13:
                    _o.sent();
                    _o.label = 14;
                case 14: return [4 /*yield*/, serviceRole
                        .from("invite")
                        .update({ revokedAt: new Date().toISOString() })
                        .in("email", usersToRevoke.data.map(function (user) { var _a; return (_a = user.email) !== null && _a !== void 0 ? _a : ""; }))
                        .eq("companyId", companyId)
                        .is("revokedAt", null)];
                case 15:
                    revokeInvites = _o.sent();
                    if (!revokeInvites.error) return [3 /*break*/, 17];
                    _j = react_router_1.data;
                    _k = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(revokeInvites.error.message, "Failed to revoke invites"))];
                case 16: return [2 /*return*/, _j.apply(void 0, _k.concat([_o.sent()]))];
                case 17:
                    _l = react_router_1.data;
                    _m = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully revoked invites"))];
                case 18: return [2 /*return*/, _l.apply(void 0, _m.concat([_o.sent()]))];
            }
        });
    });
}
