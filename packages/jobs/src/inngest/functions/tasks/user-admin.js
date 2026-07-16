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
exports.userAdminFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var users_server_1 = require("@carbon/auth/users.server");
var email_1 = require("@carbon/documents/email");
var env_1 = require("@carbon/env");
var resend_server_1 = require("@carbon/lib/resend.server");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var utils_1 = require("@carbon/utils");
var components_1 = require("@react-email/components");
var nanoid_1 = require("nanoid");
var client_1 = require("../../client");
exports.userAdminFunction = client_1.inngest.createFunction({ id: "user-admin", retries: 3 }, { event: "carbon/user-admin" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole, payload, result;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                payload = event.data;
                return [4 /*yield*/, step.run("user-admin-action", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var result, _a, userId, companyId, location_1, ip, _b, company, user, existingInvite, newCode, refreshed, inviter, _c;
                        var _d;
                        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                        return __generator(this, function (_r) {
                            switch (_r.label) {
                                case 0:
                                    console.log("User admin update ".concat(payload.type, " for ").concat(payload.id));
                                    result = { success: false, message: "Unknown action" };
                                    _a = payload.type;
                                    switch (_a) {
                                        case "deactivate": return [3 /*break*/, 1];
                                        case "resend": return [3 /*break*/, 5];
                                    }
                                    return [3 /*break*/, 12];
                                case 1:
                                    console.log("Deactivating ".concat(payload.id));
                                    return [4 /*yield*/, (0, users_server_1.deactivateUser)(serviceRole, payload.id, payload.companyId)];
                                case 2:
                                    result = _r.sent();
                                    if (!(result.success && env_1.CarbonEdition === utils_1.Edition.Cloud)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, stripe_server_1.updateSubscriptionQuantityForCompany)(payload.companyId)];
                                case 3:
                                    _r.sent();
                                    _r.label = 4;
                                case 4: return [3 /*break*/, 12];
                                case 5:
                                    userId = payload.id, companyId = payload.companyId, location_1 = payload.location, ip = payload.ip;
                                    console.log("Resending invite for ".concat(payload.id));
                                    return [4 /*yield*/, Promise.all([
                                            serviceRole
                                                .from("company")
                                                .select("name")
                                                .eq("id", companyId)
                                                .single(),
                                            serviceRole
                                                .from("user")
                                                .select("email, fullName")
                                                .eq("id", userId)
                                                .single()
                                        ])];
                                case 6:
                                    _b = _r.sent(), company = _b[0], user = _b[1];
                                    if (!company.data || !user.data) {
                                        throw new Error("Failed to load company or user");
                                    }
                                    return [4 /*yield*/, serviceRole
                                            .from("invite")
                                            .select("createdBy")
                                            .eq("email", (_e = user.data.email) !== null && _e !== void 0 ? _e : "")
                                            .eq("companyId", companyId)
                                            .maybeSingle()];
                                case 7:
                                    existingInvite = _r.sent();
                                    if (existingInvite.error || !existingInvite.data) {
                                        return [2 /*return*/, {
                                                success: false,
                                                message: "No invite record found for user"
                                            }];
                                    }
                                    newCode = (0, nanoid_1.nanoid)();
                                    return [4 /*yield*/, serviceRole
                                            .from("invite")
                                            .update({ code: newCode, acceptedAt: null, revokedAt: null })
                                            .eq("email", (_f = user.data.email) !== null && _f !== void 0 ? _f : "")
                                            .eq("companyId", companyId)
                                            .select("code")
                                            .single()];
                                case 8:
                                    refreshed = _r.sent();
                                    if (refreshed.error || !refreshed.data) {
                                        return [2 /*return*/, {
                                                success: false,
                                                message: "Failed to refresh invite"
                                            }];
                                    }
                                    return [4 /*yield*/, serviceRole
                                            .from("user")
                                            .select("email, fullName")
                                            .eq("id", existingInvite.data.createdBy)
                                            .single()];
                                case 9:
                                    inviter = _r.sent();
                                    _c = resend_server_1.sendEmail;
                                    _d = {
                                        from: "Carbon <no-reply@".concat(env_1.RESEND_DOMAIN, ">"),
                                        to: (_g = user.data.email) !== null && _g !== void 0 ? _g : "",
                                        subject: "You have been invited to join ".concat((_h = company.data) === null || _h === void 0 ? void 0 : _h.name, " on Carbon"),
                                        headers: {
                                            "X-Entity-Ref-ID": (0, nanoid_1.nanoid)()
                                        }
                                    };
                                    return [4 /*yield*/, (0, components_1.render)((0, email_1.InviteEmail)({
                                            invitedByEmail: (_l = (_k = (_j = inviter.data) === null || _j === void 0 ? void 0 : _j.email) !== null && _k !== void 0 ? _k : user.data.email) !== null && _l !== void 0 ? _l : "",
                                            invitedByName: (_o = (_m = inviter.data) === null || _m === void 0 ? void 0 : _m.fullName) !== null && _o !== void 0 ? _o : "",
                                            email: (_p = user.data.email) !== null && _p !== void 0 ? _p : undefined,
                                            name: (_q = user.data.fullName) !== null && _q !== void 0 ? _q : "",
                                            companyName: company.data.name,
                                            inviteLink: "".concat((0, env_1.getAppUrl)(), "/invite/").concat(refreshed.data.code),
                                            ip: ip,
                                            location: location_1
                                        }))];
                                case 10: return [4 /*yield*/, _c.apply(void 0, [(_d.html = _r.sent(),
                                            _d)])];
                                case 11:
                                    _r.sent();
                                    result = {
                                        success: true,
                                        message: "Successfully resent invite for ".concat(payload.id)
                                    };
                                    return [3 /*break*/, 12];
                                case 12:
                                    if (result.success) {
                                        console.log("Success ".concat(payload.id));
                                    }
                                    else {
                                        console.error("Admin action ".concat(payload.type, " failed for ").concat(payload.id, ": ").concat(result.message));
                                    }
                                    return [2 /*return*/, result];
                            }
                        });
                    }); })];
            case 1:
                result = _c.sent();
                return [2 /*return*/, result];
        }
    });
}); });
