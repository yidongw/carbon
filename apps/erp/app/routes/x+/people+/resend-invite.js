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
var email_1 = require("@carbon/documents/email");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var resend_server_1 = require("@carbon/lib/resend.server");
var components_1 = require("@react-email/components");
var nanoid_1 = require("nanoid");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, validation, _c, _d, users, serviceRole, userId, location_1, ip, _e, company, user, existingInvite, _f, _g, newCode, refreshed, _h, _j, inviter, _k, _l, _m, location_2, ip_1, _o, _p, e_1, _q, _r;
        var _s;
        var _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
        var request = _b.request;
        return __generator(this, function (_8) {
            switch (_8.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "users"
                    })];
                case 1:
                    companyId = (_8.sent()).companyId;
                    _d = (_c = (0, form_1.validator)(users_1.resendInviteValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _d.apply(_c, [_8.sent()])];
                case 3:
                    validation = _8.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    users = validation.data.users;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    if (!(users.length === 1)) return [3 /*break*/, 15];
                    userId = users[0];
                    location_1 = (_t = request.headers.get("x-vercel-ip-city")) !== null && _t !== void 0 ? _t : "Unknown";
                    ip = (_u = request.headers.get("x-forwarded-for")) !== null && _u !== void 0 ? _u : "127.0.0.1";
                    return [4 /*yield*/, Promise.all([
                            serviceRole.from("company").select("name").eq("id", companyId).single(),
                            serviceRole
                                .from("user")
                                .select("email, fullName")
                                .eq("id", userId)
                                .single()
                        ])];
                case 4:
                    _e = _8.sent(), company = _e[0], user = _e[1];
                    if (!company.data || !user.data) {
                        throw new Error("Failed to load company or user");
                    }
                    return [4 /*yield*/, serviceRole
                            .from("invite")
                            .select("createdBy")
                            .eq("email", (_v = user.data.email) !== null && _v !== void 0 ? _v : "")
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 5:
                    existingInvite = _8.sent();
                    if (!(existingInvite.error || !existingInvite.data)) return [3 /*break*/, 7];
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(existingInvite.error, "No invite record found for user"))];
                case 6: return [2 /*return*/, _f.apply(void 0, _g.concat([_8.sent()]))];
                case 7:
                    newCode = (0, nanoid_1.nanoid)();
                    return [4 /*yield*/, serviceRole
                            .from("invite")
                            .update({ code: newCode, acceptedAt: null, revokedAt: null })
                            .eq("email", (_w = user.data.email) !== null && _w !== void 0 ? _w : "")
                            .eq("companyId", companyId)
                            .select("code")
                            .single()];
                case 8:
                    refreshed = _8.sent();
                    if (!(refreshed.error || !refreshed.data)) return [3 /*break*/, 10];
                    _h = react_router_1.data;
                    _j = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(refreshed.error, "Failed to refresh invite"))];
                case 9: return [2 /*return*/, _h.apply(void 0, _j.concat([_8.sent()]))];
                case 10: return [4 /*yield*/, serviceRole
                        .from("user")
                        .select("email, fullName")
                        .eq("id", existingInvite.data.createdBy)
                        .single()];
                case 11:
                    inviter = _8.sent();
                    _k = resend_server_1.sendEmail;
                    _s = {
                        from: "Carbon <no-reply@".concat(auth_1.RESEND_DOMAIN, ">"),
                        to: (_x = user.data.email) !== null && _x !== void 0 ? _x : "",
                        subject: "You have been invited to join ".concat((_y = company.data) === null || _y === void 0 ? void 0 : _y.name, " on Carbon"),
                        headers: {
                            "X-Entity-Ref-ID": (0, nanoid_1.nanoid)()
                        }
                    };
                    return [4 /*yield*/, (0, components_1.render)((0, email_1.InviteEmail)({
                            invitedByEmail: (_1 = (_0 = (_z = inviter.data) === null || _z === void 0 ? void 0 : _z.email) !== null && _0 !== void 0 ? _0 : user.data.email) !== null && _1 !== void 0 ? _1 : "",
                            invitedByName: (_3 = (_2 = inviter.data) === null || _2 === void 0 ? void 0 : _2.fullName) !== null && _3 !== void 0 ? _3 : "",
                            email: (_4 = user.data.email) !== null && _4 !== void 0 ? _4 : "",
                            name: (_5 = user.data.fullName) !== null && _5 !== void 0 ? _5 : "",
                            companyName: company.data.name,
                            inviteLink: "".concat((0, auth_1.getAppUrl)(), "/invite/").concat(refreshed.data.code),
                            ip: ip,
                            location: location_1
                        }))];
                case 12: return [4 /*yield*/, _k.apply(void 0, [(_s.html = _8.sent(),
                            _s)])];
                case 13:
                    _8.sent();
                    _l = react_router_1.data;
                    _m = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully resent invite"))];
                case 14: return [2 /*return*/, _l.apply(void 0, _m.concat([_8.sent()]))];
                case 15:
                    location_2 = (_6 = request.headers.get("x-vercel-ip-city")) !== null && _6 !== void 0 ? _6 : "Unknown";
                    ip_1 = (_7 = request.headers.get("x-forwarded-for")) !== null && _7 !== void 0 ? _7 : "127.0.0.1";
                    _8.label = 16;
                case 16:
                    _8.trys.push([16, 19, , 21]);
                    return [4 /*yield*/, (0, jobs_1.batchTrigger)("user-admin", users.map(function (id) { return ({
                            payload: {
                                id: id,
                                type: "resend",
                                companyId: companyId,
                                location: location_2,
                                ip: ip_1
                            }
                        }); }))];
                case 17:
                    _8.sent();
                    _o = react_router_1.data;
                    _p = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully added invites to queue"))];
                case 18: return [2 /*return*/, _o.apply(void 0, _p.concat([_8.sent()]))];
                case 19:
                    e_1 = _8.sent();
                    _q = react_router_1.data;
                    _r = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(e_1, "Failed to reinvite users"))];
                case 20: return [2 /*return*/, _q.apply(void 0, _r.concat([_8.sent()]))];
                case 21: return [2 /*return*/];
            }
        });
    });
}
