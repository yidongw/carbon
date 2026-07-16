"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = AccountProfile;
var auth_1 = require("@carbon/auth");
var aliyun_sms_server_1 = require("@carbon/auth/aliyun-sms.server");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var identity_server_1 = require("@carbon/auth/identity.server");
var phone_server_1 = require("@carbon/auth/phone.server");
var session_server_1 = require("@carbon/auth/session.server");
var verification_server_1 = require("@carbon/auth/verification.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var browser_1 = require("@simplewebauthn/browser");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var account_1 = require("~/modules/account");
var Profile_1 = require("~/modules/account/ui/Profile");
var path_1 = require("~/utils/path");
var KNOWN_METHODS = ["email", "google", "azure", "phone", "wechat"];
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Profile"], ["Profile"]))),
    to: path_1.path.to.profile
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, serviceRole, linkError, _d, user, passkeysResult, identities, _e, _f, enabled, enabledMethods;
        var _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _h.sent(), client = _c.client, userId = _c.userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    linkError = new URL(request.url).searchParams.get("linkError");
                    return [4 /*yield*/, Promise.all([
                            (0, account_1.getAccount)(client, userId),
                            serviceRole
                                .from("passkeyCredential")
                                .select("id, credentialName, createdAt, lastUsedAt, backedUp")
                                .eq("userId", userId)
                                .order("createdAt", { ascending: false }),
                            (0, identity_server_1.getUserIdentities)(userId)
                        ])];
                case 2:
                    _d = _h.sent(), user = _d[0], passkeysResult = _d[1], identities = _d[2];
                    if (!(user.error || !user.data)) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(user.error, "Failed to get user"))];
                case 3: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 4:
                    enabled = auth_1.AUTH_PROVIDERS.split(",");
                    enabledMethods = KNOWN_METHODS.filter(function (m) { return enabled.includes(m); });
                    return [2 /*return*/, {
                            user: user.data,
                            passkeys: ((_g = passkeysResult.data) !== null && _g !== void 0 ? _g : []),
                            identities: identities,
                            enabledMethods: enabledMethods,
                            linkError: linkError
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, formData, validation, _d, firstName, lastName, about, phone, number, updateAccount, _e, _f, _g, _h, photoPath, avatarUpdate, _j, _k, _l, _m, _o, _p, credentialId, serviceRole, dbError, _q, _r, credentialId, credentialName, serviceRole, dbError, _s, _t, intent, type, value, result, _u, _v, _w, _x, phone, owner, sent, phone, code, link, _y, _z, _0, _1, email, owner, _i, _2, t, sent, email, code, emailOwner, _3, _4, t, _5, _6, link, _7, _8, serviceRole, authError, _9, _10, _11, _12;
        var _13;
        var request = _b.request;
        return __generator(this, function (_14) {
            switch (_14.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _14.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _14.sent();
                    if (!(formData.get("intent") === "about")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, form_1.validator)(account_1.accountProfileValidator).validate(formData)];
                case 3:
                    validation = _14.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, firstName = _d.firstName, lastName = _d.lastName, about = _d.about, phone = _d.phone, number = _d.number;
                    return [4 /*yield*/, (0, account_1.updatePublicAccount)(client, {
                            id: userId,
                            firstName: firstName,
                            lastName: lastName,
                            about: about,
                            phone: phone,
                            number: number
                        })];
                case 4:
                    updateAccount = _14.sent();
                    if (!updateAccount.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateAccount.error, "Failed to update profile"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_14.sent()]))];
                case 6:
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated profile"))];
                case 7: return [2 /*return*/, _g.apply(void 0, _h.concat([_14.sent()]))];
                case 8:
                    if (!(formData.get("intent") === "photo")) return [3 /*break*/, 15];
                    photoPath = formData.get("path");
                    if (!(photoPath === null || typeof photoPath === "string")) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, account_1.updateAvatar)(client, userId, photoPath)];
                case 9:
                    avatarUpdate = _14.sent();
                    if (!avatarUpdate.error) return [3 /*break*/, 11];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.profile];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(avatarUpdate.error, "Failed to update avatar"))];
                case 10: throw _j.apply(void 0, _k.concat([_14.sent()]));
                case 11:
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.profile];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)(photoPath === null ? "Removed avatar" : "Updated avatar"))];
                case 12: throw _l.apply(void 0, _m.concat([_14.sent()]));
                case 13:
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.profile];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid avatar path"))];
                case 14: throw _o.apply(void 0, _p.concat([_14.sent()]));
                case 15:
                    if (!(formData.get("intent") === "deletePasskey")) return [3 /*break*/, 19];
                    credentialId = formData.get("credentialId");
                    if (!credentialId) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Missing credentialId"), { status: 400 })];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("passkeyCredential")
                            .delete()
                            .eq("id", credentialId)
                            .eq("userId", userId)];
                case 16:
                    dbError = (_14.sent()).error;
                    if (!dbError) return [3 /*break*/, 18];
                    _q = react_router_1.data;
                    _r = [(0, auth_1.error)(dbError, "Failed to delete passkey")];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(dbError, "Failed to delete passkey"))];
                case 17: return [2 /*return*/, _q.apply(void 0, _r.concat([_14.sent()]))];
                case 18: return [2 /*return*/, (0, react_router_1.data)((0, auth_1.success)("Passkey removed"))];
                case 19:
                    if (!(formData.get("intent") === "renamePasskey")) return [3 /*break*/, 23];
                    credentialId = formData.get("credentialId");
                    credentialName = (_13 = formData.get("credentialName")) === null || _13 === void 0 ? void 0 : _13.trim();
                    if (!credentialId || !credentialName) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Missing fields"), { status: 400 })];
                    }
                    if (credentialName.length > 100) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Passkey name must be 100 characters or fewer"), {
                                status: 400
                            })];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("passkeyCredential")
                            .update({ credentialName: credentialName })
                            .eq("id", credentialId)
                            .eq("userId", userId)];
                case 20:
                    dbError = (_14.sent()).error;
                    if (!dbError) return [3 /*break*/, 22];
                    _s = react_router_1.data;
                    _t = [(0, auth_1.error)(dbError, "Failed to rename passkey")];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(dbError, "Failed to rename passkey"))];
                case 21: return [2 /*return*/, _s.apply(void 0, _t.concat([_14.sent()]))];
                case 22: return [2 /*return*/, (0, react_router_1.data)((0, auth_1.success)("Passkey renamed"))];
                case 23:
                    intent = formData.get("intent");
                    if (!(intent === "removeIdentity")) return [3 /*break*/, 28];
                    type = formData.get("type");
                    value = formData.get("value");
                    return [4 /*yield*/, (0, identity_server_1.unlinkIdentity)(userId, type, value)];
                case 24:
                    result = _14.sent();
                    if (!!result.success) return [3 /*break*/, 26];
                    _u = react_router_1.data;
                    _v = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, result.reason === "last_method"
                            ? "You can't remove your only login method"
                            : "Failed to remove login method"))];
                case 25: return [2 /*return*/, _u.apply(void 0, _v.concat([_14.sent()]))];
                case 26:
                    _w = react_router_1.data;
                    _x = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Removed login method"))];
                case 27: return [2 /*return*/, _w.apply(void 0, _x.concat([_14.sent()]))];
                case 28:
                    if (!(intent === "addPhoneSend")) return [3 /*break*/, 31];
                    phone = formData.get("phone");
                    if (!/^1[3-9]\d{9}$/.test(phone !== null && phone !== void 0 ? phone : "")) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Invalid phone number" })];
                    }
                    return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)("phone", (0, phone_server_1.toE164Phone)(phone))];
                case 29:
                    owner = _14.sent();
                    if (owner) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: owner === userId
                                    ? "This phone is already linked to your account"
                                    : "That phone is already linked to another account"
                            })];
                    }
                    return [4 /*yield*/, (0, aliyun_sms_server_1.sendSmsVerifyCode)(phone)];
                case 30:
                    sent = _14.sent();
                    return [2 /*return*/, sent
                            ? (0, react_router_1.data)({ success: true, step: "addPhoneSent", phone: phone })
                            : (0, react_router_1.data)({ success: false, message: "Failed to send verification code" })];
                case 31:
                    if (!(intent === "addPhoneVerify")) return [3 /*break*/, 37];
                    phone = formData.get("phone");
                    code = formData.get("code");
                    return [4 /*yield*/, (0, aliyun_sms_server_1.checkSmsVerifyCode)(phone, code)];
                case 32:
                    if (!(_14.sent())) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Invalid or expired code" })];
                    }
                    return [4 /*yield*/, (0, identity_server_1.linkIdentity)(userId, "phone", (0, phone_server_1.toE164Phone)(phone))];
                case 33:
                    link = _14.sent();
                    if (!!link.success) return [3 /*break*/, 35];
                    _y = react_router_1.data;
                    _z = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, link.reason === "conflict"
                            ? "That phone is already linked to another account"
                            : "Failed to link phone"))];
                case 34: return [2 /*return*/, _y.apply(void 0, _z.concat([_14.sent()]))];
                case 35:
                    _0 = react_router_1.data;
                    _1 = [{ linked: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Linked phone"))];
                case 36: return [2 /*return*/, _0.apply(void 0, _1.concat([_14.sent()]))];
                case 37:
                    if (!(intent === "addEmailSend")) return [3 /*break*/, 43];
                    email = formData.get("email");
                    if (!email || !email.includes("@")) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Invalid email address" })];
                    }
                    owner = null;
                    _i = 0, _2 = ["email", "google", "azure"];
                    _14.label = 38;
                case 38:
                    if (!(_i < _2.length)) return [3 /*break*/, 41];
                    t = _2[_i];
                    return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)(t, email)];
                case 39:
                    owner = _14.sent();
                    if (owner)
                        return [3 /*break*/, 41];
                    _14.label = 40;
                case 40:
                    _i++;
                    return [3 /*break*/, 38];
                case 41:
                    if (owner) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: owner === userId
                                    ? "This email is already linked to your account"
                                    : "That email is already linked to another account"
                            })];
                    }
                    return [4 /*yield*/, (0, verification_server_1.sendVerificationCode)(email)];
                case 42:
                    sent = _14.sent();
                    return [2 /*return*/, sent
                            ? (0, react_router_1.data)({ success: true, step: "addEmailSent", email: email })
                            : (0, react_router_1.data)({ success: false, message: "Failed to send verification code" })];
                case 43:
                    if (!(intent === "addEmailVerify")) return [3 /*break*/, 60];
                    email = formData.get("email");
                    code = formData.get("code");
                    return [4 /*yield*/, (0, verification_server_1.verifyEmailCode)(email, code)];
                case 44:
                    if (!(_14.sent())) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Invalid or expired code" })];
                    }
                    emailOwner = null;
                    _3 = 0, _4 = ["email", "google", "azure"];
                    _14.label = 45;
                case 45:
                    if (!(_3 < _4.length)) return [3 /*break*/, 48];
                    t = _4[_3];
                    return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)(t, email)];
                case 46:
                    emailOwner = _14.sent();
                    if (emailOwner)
                        return [3 /*break*/, 48];
                    _14.label = 47;
                case 47:
                    _3++;
                    return [3 /*break*/, 45];
                case 48:
                    if (emailOwner && emailOwner !== userId) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "That email is already linked to another account"
                            })];
                    }
                    if (!(emailOwner === userId)) return [3 /*break*/, 50];
                    _5 = react_router_1.data;
                    _6 = [{ linked: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Linked email"))];
                case 49: 
                // Already linked (e.g. via Google) — treat as success, no-op.
                return [2 /*return*/, _5.apply(void 0, _6.concat([_14.sent()]))];
                case 50: return [4 /*yield*/, (0, identity_server_1.linkIdentity)(userId, "email", email)];
                case 51:
                    link = _14.sent();
                    if (!!link.success) return [3 /*break*/, 53];
                    _7 = react_router_1.data;
                    _8 = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, link.reason === "conflict"
                            ? "That email is already linked to another account"
                            : "Failed to link email"))];
                case 52: return [2 /*return*/, _7.apply(void 0, _8.concat([_14.sent()]))];
                case 53:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole.auth.admin.updateUserById(userId, { email: email, email_confirm: true })];
                case 54:
                    authError = (_14.sent()).error;
                    if (!authError) return [3 /*break*/, 57];
                    console.error("[addEmailVerify] updateUserById failed, rolling back", authError);
                    return [4 /*yield*/, (0, identity_server_1.unlinkIdentity)(userId, "email", email)];
                case 55:
                    _14.sent();
                    _9 = react_router_1.data;
                    _10 = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to link email"))];
                case 56: return [2 /*return*/, _9.apply(void 0, _10.concat([_14.sent()]))];
                case 57: return [4 /*yield*/, serviceRole.from("user").update({ email: email }).eq("id", userId)];
                case 58:
                    _14.sent();
                    _11 = react_router_1.data;
                    _12 = [{ linked: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Linked email"))];
                case 59: return [2 /*return*/, _11.apply(void 0, _12.concat([_14.sent()]))];
                case 60: return [2 /*return*/, null];
            }
        });
    });
}
function AccountProfile() {
    var _this = this;
    var t = (0, macro_2.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), user = _a.user, passkeys = _a.passkeys, identities = _a.identities, enabledMethods = _a.enabledMethods, linkError = _a.linkError;
    var deleteFetcher = (0, react_router_1.useFetcher)();
    var renameFetcher = (0, react_router_1.useFetcher)();
    var revalidate = (0, react_router_1.useRevalidator)().revalidate;
    var passkeysEnabled = (0, auth_1.isAuthProviderEnabled)("passkey");
    // OAuth link failures redirect back with ?linkError=; toast it (deferred one
    // tick so the Toaster subscribes first) and strip the param.
    (0, react_2.useEffect)(function () {
        if (!linkError)
            return;
        var id = setTimeout(function () { return react_1.toast.error(linkError); }, 0);
        var params = new URLSearchParams(window.location.search);
        if (params.has("linkError")) {
            params.delete("linkError");
            var qs = params.toString();
            window.history.replaceState(null, "", window.location.pathname + (qs ? "?".concat(qs) : ""));
        }
        return function () { return clearTimeout(id); };
    }, [linkError]);
    var _b = (0, react_2.useState)(false), registering = _b[0], setRegistering = _b[1];
    var _c = (0, react_2.useState)(null), selectedPasskey = _c[0], setSelectedPasskey = _c[1];
    var _d = (0, react_2.useState)(""), editedName = _d[0], setEditedName = _d[1];
    var _e = (0, react_2.useState)(null), confirmDeleteId = _e[0], setConfirmDeleteId = _e[1];
    var onAddPasskey = function () { return __awaiter(_this, void 0, void 0, function () {
        var optRes, options, credential, verifyRes, body, result, e_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!passkeysEnabled) {
                        react_1.toast.error("Passkeys are disabled");
                        return [2 /*return*/];
                    }
                    setRegistering(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 9, 10, 11]);
                    return [4 /*yield*/, fetch("/api/passkey/register/options", {
                            method: "POST"
                        })];
                case 2:
                    optRes = _d.sent();
                    if (!optRes.ok)
                        throw new Error("Failed to get options");
                    return [4 /*yield*/, optRes.json()];
                case 3:
                    options = _d.sent();
                    return [4 /*yield*/, (0, browser_1.startRegistration)({
                            optionsJSON: options
                        })];
                case 4:
                    credential = _d.sent();
                    return [4 /*yield*/, fetch("/api/passkey/register/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(credential)
                        })];
                case 5:
                    verifyRes = _d.sent();
                    if (!!verifyRes.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, verifyRes.json().catch(function () { return ({}); })];
                case 6:
                    body = _d.sent();
                    throw new Error((_a = body.message) !== null && _a !== void 0 ? _a : "Registration failed");
                case 7: return [4 /*yield*/, verifyRes.json()];
                case 8:
                    result = _d.sent();
                    react_1.toast.success("".concat((_b = result.credentialName) !== null && _b !== void 0 ? _b : "Passkey", " registered"));
                    revalidate();
                    return [3 /*break*/, 11];
                case 9:
                    e_1 = _d.sent();
                    if ((e_1 === null || e_1 === void 0 ? void 0 : e_1.name) !== "NotAllowedError" && (e_1 === null || e_1 === void 0 ? void 0 : e_1.name) !== "AbortError") {
                        react_1.toast.error((_c = e_1.message) !== null && _c !== void 0 ? _c : "Failed to register passkey");
                    }
                    return [3 /*break*/, 11];
                case 10:
                    setRegistering(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var openPasskeyDrawer = function (pk) {
        setSelectedPasskey(pk);
        setEditedName(pk.credentialName);
    };
    var closePasskeyDrawer = function () {
        setSelectedPasskey(null);
        setEditedName("");
    };
    var onRenamePasskey = function () {
        if (!selectedPasskey)
            return;
        var formData = new FormData();
        formData.append("intent", "renamePasskey");
        formData.append("credentialId", selectedPasskey.id);
        formData.append("credentialName", editedName);
        renameFetcher.submit(formData, { method: "post" });
        closePasskeyDrawer();
        revalidate();
    };
    var onConfirmDelete = function () {
        if (!confirmDeleteId)
            return;
        var formData = new FormData();
        formData.append("intent", "deletePasskey");
        formData.append("credentialId", confirmDeleteId);
        deleteFetcher.submit(formData, { method: "post" });
        setConfirmDeleteId(null);
        closePasskeyDrawer();
    };
    return (<react_1.VStack spacing={4} className="pb-6">
      <Profile_1.LoginMethodsForm identities={identities} enabledMethods={enabledMethods} wechatName={[user.firstName, user.lastName].filter(Boolean).join(" ")}/>
      <Profile_1.ProfileForm user={user}/>

      {passkeysEnabled && (<react_1.Card>
          <react_1.CardHeader>
            <react_1.HStack className="justify-between">
              <div>
                <react_1.CardTitle>Passkeys</react_1.CardTitle>
                <react_1.CardDescription>
                  Sign in with biometrics instead of a magic link. Passkeys are
                  secured by Face ID, Touch ID, or your device PIN.
                </react_1.CardDescription>
              </div>
              <react_1.Button type="button" variant="secondary" onClick={onAddPasskey} isDisabled={registering} isLoading={registering} leftIcon={<lu_1.LuFingerprint className="size-4"/>}>
                Add Passkey
              </react_1.Button>
            </react_1.HStack>
          </react_1.CardHeader>
          <react_1.CardContent>
            {passkeys.length === 0 ? (<p className="text-sm text-muted-foreground">
                No passkeys registered yet.
              </p>) : (<react_1.HStack spacing={2}>
                {passkeys.map(function (pk) { return (<react_1.HStack key={pk.id} className="justify-between p-3 rounded-md border border-border space-x-4 cursor-pointer hover:bg-muted/40 transition-colors" onClick={function () { return openPasskeyDrawer(pk); }}>
                    <react_1.HStack spacing={3} className="items-start">
                      <lu_1.LuFingerprint className="size-4 text-muted-foreground shrink-0 mt-1"/>
                      <react_1.VStack spacing={0}>
                        <p className="text-sm font-medium">
                          {pk.credentialName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Added{" "}
                          {new Date(pk.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    })}
                          {pk.lastUsedAt && (<>
                              {" · "}Last used{" "}
                              {new Date(pk.lastUsedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                            </>)}
                          {pk.backedUp && " · Synced"}
                        </p>
                      </react_1.VStack>
                    </react_1.HStack>

                    <react_1.IconButton onClick={function (e) {
                        e.stopPropagation();
                        setConfirmDeleteId(pk.id);
                    }} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Delete passkey"], ["Delete passkey"])))} type="button" variant="ghost" icon={<lu_1.LuTrash2 />} className="cursor-pointer"/>
                  </react_1.HStack>); })}
              </react_1.HStack>)}
          </react_1.CardContent>
        </react_1.Card>)}

      <react_1.Modal open={!!selectedPasskey} onOpenChange={function (open) {
            if (!open)
                closePasskeyDrawer();
        }}>
        <react_1.ModalContent size="small">
          <react_1.ModalHeader>
            <react_1.ModalTitle>Edit Passkey</react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4} className="w-full">
              <react_1.VStack className="w-full" spacing={0}>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <react_1.Input value={editedName} onChange={function (e) { return setEditedName(e.target.value); }} placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Passkey name"], ["Passkey name"])))}/>
              </react_1.VStack>
              {selectedPasskey && (<react_1.VStack spacing={1} className="w-full">
                  <p className="text-xs text-muted-foreground">
                    Added{" "}
                    {new Date(selectedPasskey.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  {selectedPasskey.lastUsedAt && (<p className="text-xs text-muted-foreground">
                      Last used{" "}
                      {new Date(selectedPasskey.lastUsedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                    </p>)}
                  {selectedPasskey.backedUp && (<p className="text-xs text-muted-foreground">Synced</p>)}
                </react_1.VStack>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button type="button" variant="secondary" onClick={closePasskeyDrawer}>
              Cancel
            </react_1.Button>
            <react_1.Button type="button" onClick={onRenamePasskey} isDisabled={!editedName.trim() ||
            editedName === (selectedPasskey === null || selectedPasskey === void 0 ? void 0 : selectedPasskey.credentialName)}>
              Save
            </react_1.Button>
          </react_1.ModalFooter>
        </react_1.ModalContent>
      </react_1.Modal>

      <react_1.Modal open={!!confirmDeleteId} onOpenChange={function (open) {
            if (!open)
                setConfirmDeleteId(null);
        }}>
        <react_1.ModalContent size="small">
          <react_1.ModalHeader>
            <react_1.ModalTitle>Delete Passkey</react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            Are you sure you want to delete this passkey? You won't be able to
            use it to sign in anymore.
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button type="button" variant="secondary" onClick={function () { return setConfirmDeleteId(null); }}>
              Cancel
            </react_1.Button>
            <react_1.Button type="button" variant="destructive" onClick={onConfirmDelete} isLoading={deleteFetcher.state !== "idle"} isDisabled={deleteFetcher.state !== "idle"}>
              Delete
            </react_1.Button>
          </react_1.ModalFooter>
        </react_1.ModalContent>
      </react_1.Modal>
    </react_1.VStack>);
}
var templateObject_1, templateObject_2, templateObject_3;
