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
exports.default = Route;
var auth_1 = require("@carbon/auth");
var aliyun_sms_server_1 = require("@carbon/auth/aliyun-sms.server");
var client_server_1 = require("@carbon/auth/client.server");
var identity_server_1 = require("@carbon/auth/identity.server");
var phone_server_1 = require("@carbon/auth/phone.server");
var session_server_1 = require("@carbon/auth/session.server");
var verification_server_1 = require("@carbon/auth/verification.server");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
// Links an additional login method (phone / email) to the already-authenticated
// joiner so they can satisfy an invite link's required-login-methods sequence.
// Mirrors the profile "add phone/email" intents; WeChat/OAuth linking reuse
// their existing routes (/auth/wechat?link=1, /api/wechat-qr-url?link=1).
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var code, authSession, userId, formData, intent, phone, owner, sent, phone, smsCode, link, email, owner, _i, _c, t, sent, email, emailCode, emailOwner, _d, _e, t, link, serviceRole, authError;
        var params = _b.params, request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    code = params.code;
                    if (!code)
                        throw new Error("No code provided");
                    return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 1:
                    authSession = _f.sent();
                    if (!authSession) {
                        throw (0, react_router_1.redirect)("".concat(path_1.path.to.login, "?redirectTo=").concat(encodeURIComponent(path_1.path.to.joinLink(code))));
                    }
                    userId = authSession.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _f.sent();
                    intent = formData.get("intent");
                    if (!(intent === "addPhoneSend")) return [3 /*break*/, 5];
                    phone = formData.get("phone");
                    if (!/^1[3-9]\d{9}$/.test(phone !== null && phone !== void 0 ? phone : "")) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Invalid phone number" })];
                    }
                    return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)("phone", (0, phone_server_1.toE164Phone)(phone))];
                case 3:
                    owner = _f.sent();
                    if (owner) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: owner === userId
                                    ? "This phone is already linked to your account"
                                    : "That phone is already linked to another account"
                            })];
                    }
                    return [4 /*yield*/, (0, aliyun_sms_server_1.sendSmsVerifyCode)(phone)];
                case 4:
                    sent = _f.sent();
                    return [2 /*return*/, sent
                            ? (0, react_router_1.data)({ success: true, step: "addPhoneSent", phone: phone })
                            : (0, react_router_1.data)({ success: false, message: "Failed to send verification code" })];
                case 5:
                    if (!(intent === "addPhoneVerify")) return [3 /*break*/, 8];
                    phone = formData.get("phone");
                    smsCode = formData.get("code");
                    return [4 /*yield*/, (0, aliyun_sms_server_1.checkSmsVerifyCode)(phone, smsCode)];
                case 6:
                    if (!(_f.sent())) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Invalid or expired code" })];
                    }
                    return [4 /*yield*/, (0, identity_server_1.linkIdentity)(userId, "phone", (0, phone_server_1.toE164Phone)(phone))];
                case 7:
                    link = _f.sent();
                    if (!link.success) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: link.reason === "conflict"
                                    ? "That phone is already linked to another account"
                                    : "Failed to link phone"
                            })];
                    }
                    return [2 /*return*/, (0, react_router_1.data)({ linked: true })];
                case 8:
                    if (!(intent === "addEmailSend")) return [3 /*break*/, 14];
                    email = formData.get("email");
                    if (!email || !email.includes("@")) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Invalid email address" })];
                    }
                    owner = null;
                    _i = 0, _c = ["email", "google", "azure"];
                    _f.label = 9;
                case 9:
                    if (!(_i < _c.length)) return [3 /*break*/, 12];
                    t = _c[_i];
                    return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)(t, email)];
                case 10:
                    owner = _f.sent();
                    if (owner)
                        return [3 /*break*/, 12];
                    _f.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12:
                    if (owner) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: owner === userId
                                    ? "This email is already linked to your account"
                                    : "That email is already linked to another account"
                            })];
                    }
                    return [4 /*yield*/, (0, verification_server_1.sendVerificationCode)(email)];
                case 13:
                    sent = _f.sent();
                    return [2 /*return*/, sent
                            ? (0, react_router_1.data)({ success: true, step: "addEmailSent", email: email })
                            : (0, react_router_1.data)({ success: false, message: "Failed to send verification code" })];
                case 14:
                    if (!(intent === "addEmailVerify")) return [3 /*break*/, 25];
                    email = formData.get("email");
                    emailCode = formData.get("code");
                    return [4 /*yield*/, (0, verification_server_1.verifyEmailCode)(email, emailCode)];
                case 15:
                    if (!(_f.sent())) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Invalid or expired code" })];
                    }
                    emailOwner = null;
                    _d = 0, _e = ["email", "google", "azure"];
                    _f.label = 16;
                case 16:
                    if (!(_d < _e.length)) return [3 /*break*/, 19];
                    t = _e[_d];
                    return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)(t, email)];
                case 17:
                    emailOwner = _f.sent();
                    if (emailOwner)
                        return [3 /*break*/, 19];
                    _f.label = 18;
                case 18:
                    _d++;
                    return [3 /*break*/, 16];
                case 19:
                    if (emailOwner && emailOwner !== userId) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "That email is already linked to another account"
                            })];
                    }
                    if (emailOwner === userId) {
                        return [2 /*return*/, (0, react_router_1.data)({ linked: true })];
                    }
                    return [4 /*yield*/, (0, identity_server_1.linkIdentity)(userId, "email", email)];
                case 20:
                    link = _f.sent();
                    if (!link.success) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: link.reason === "conflict"
                                    ? "That email is already linked to another account"
                                    : "Failed to link email"
                            })];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole.auth.admin.updateUserById(userId, { email: email, email_confirm: true })];
                case 21:
                    authError = (_f.sent()).error;
                    if (!authError) return [3 /*break*/, 22];
                    console.error("[join link-email] updateUserById failed, rolling back");
                    return [3 /*break*/, 24];
                case 22: return [4 /*yield*/, serviceRole.from("user").update({ email: email }).eq("id", userId)];
                case 23:
                    _f.sent();
                    _f.label = 24;
                case 24: return [2 /*return*/, (0, react_router_1.data)({ linked: true })];
                case 25: return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Unknown action" })];
            }
        });
    });
}
function Route() {
    return null;
}
