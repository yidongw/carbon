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
var aliyun_sms_server_1 = require("@carbon/auth/aliyun-sms.server");
var phone_server_1 = require("@carbon/auth/phone.server");
var form_1 = require("@carbon/form");
var kv_1 = require("@carbon/kv");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
// Sends an Aliyun SMS verification code, then the client navigates to /verify-phone
// to enter it. Aliyun owns the code (generation, expiry, resend throttle); we add a
// coarse per-IP limit and the same Turnstile bot check the email login uses.
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var ip, ratelimit, success, formData, turnstileToken, verifyResponse, verifyData, validation, phone, _c, sent;
        var _d;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    ip = (_d = request.headers.get("x-forwarded-for")) !== null && _d !== void 0 ? _d : "127.0.0.1";
                    ratelimit = new kv_1.Ratelimit({
                        redis: kv_1.redis,
                        limiter: kv_1.Ratelimit.slidingWindow(auth_1.RATE_LIMIT, "1 h"),
                        analytics: true
                    });
                    return [4 /*yield*/, ratelimit.limit(ip)];
                case 1:
                    success = (_e.sent()).success;
                    if (!success) {
                        return [2 /*return*/, (0, auth_1.error)(null, "Rate limit exceeded")];
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _e.sent();
                    if (!(auth_1.CarbonEdition === utils_1.Edition.Cloud &&
                        auth_1.CLOUDFLARE_TURNSTILE_SITE_KEY !== "1x00000000000000000000AA")) return [3 /*break*/, 5];
                    turnstileToken = formData.get("turnstileToken");
                    return [4 /*yield*/, fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: new URLSearchParams({
                                secret: auth_1.CLOUDFLARE_TURNSTILE_SECRET_KEY !== null && auth_1.CLOUDFLARE_TURNSTILE_SECRET_KEY !== void 0 ? auth_1.CLOUDFLARE_TURNSTILE_SECRET_KEY : "",
                                response: turnstileToken !== null && turnstileToken !== void 0 ? turnstileToken : "",
                                remoteip: ip
                            })
                        })];
                case 3:
                    verifyResponse = _e.sent();
                    return [4 /*yield*/, verifyResponse.json()];
                case 4:
                    verifyData = _e.sent();
                    if (!verifyData.success) {
                        return [2 /*return*/, (0, auth_1.error)(null, "Bot verification failed. Please try again.")];
                    }
                    _e.label = 5;
                case 5: return [4 /*yield*/, (0, form_1.validator)(auth_1.phoneLoginValidator).validate(formData)];
                case 6:
                    validation = _e.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, auth_1.error)(validation.error, "Invalid phone number")];
                    }
                    phone = validation.data.phone;
                    _c = auth_1.CarbonEdition === utils_1.Edition.Enterprise;
                    if (!_c) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, phone_server_1.findPhoneUser)(phone)];
                case 7:
                    _c = !(_e.sent());
                    _e.label = 8;
                case 8:
                    // Enterprise deployments don't allow self-signup: only send a code to numbers
                    // that already belong to a provisioned user (mirrors the email login gate).
                    if (_c) {
                        return [2 /*return*/, (0, auth_1.error)(null, "User record not found")];
                    }
                    return [4 /*yield*/, (0, aliyun_sms_server_1.sendSmsVerifyCode)(phone)];
                case 9:
                    sent = _e.sent();
                    if (!sent) {
                        return [2 /*return*/, (0, auth_1.error)(null, "Failed to send verification code")];
                    }
                    return [2 /*return*/, (0, react_router_1.data)({ success: true, phone: phone })];
            }
        });
    });
}
