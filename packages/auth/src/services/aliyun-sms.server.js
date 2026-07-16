"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.sendSmsVerifyCode = sendSmsVerifyCode;
exports.checkSmsVerifyCode = checkSmsVerifyCode;
var node_crypto_1 = require("node:crypto");
var env_1 = require("@carbon/env");
// Aliyun 号码认证服务 (Dypnsapi) — SMS verification-code service. Aliyun GENERATES,
// stores, rate-limits AND validates the code; we only call send + check (we never
// generate or persist a code ourselves). Domestic China only (CountryCode 86).
// RPC-style API signed with Aliyun's v1 HMAC-SHA1 scheme — implemented with fetch
// to match the rest of this package (cf. wechat.server.ts) rather than pulling in
// the Aliyun SDK.
var DYPNSAPI_ENDPOINT = "https://dypnsapi.aliyuncs.com/";
var DYPNSAPI_VERSION = "2017-05-25";
/** RFC 3986 percent-encoding, as required by Aliyun's signing algorithm. */
function percentEncode(value) {
    return encodeURIComponent(value)
        .replace(/\+/g, "%20")
        .replace(/\*/g, "%2A")
        .replace(/%7E/g, "~");
}
function canonicalize(params) {
    return Object.entries(params)
        .sort(function (_a, _b) {
        var a = _a[0];
        var b = _b[0];
        return (a < b ? -1 : a > b ? 1 : 0);
    })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(percentEncode(key), "=").concat(percentEncode(value));
    })
        .join("&");
}
/** Sign with HMAC-SHA1 over "GET&%2F&<canonicalized-query>" using "<secret>&". */
function sign(params) {
    var stringToSign = "GET&".concat(percentEncode("/"), "&").concat(percentEncode(canonicalize(params)));
    return (0, node_crypto_1.createHmac)("sha1", "".concat(env_1.ALIBABA_CLOUD_ACCESS_KEY_SECRET, "&"))
        .update(stringToSign)
        .digest("base64");
}
function callDypnsapi(action, business) {
    return __awaiter(this, void 0, void 0, function () {
        var params, resp, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!env_1.ALIBABA_CLOUD_ACCESS_KEY_ID || !env_1.ALIBABA_CLOUD_ACCESS_KEY_SECRET) {
                        console.error("[aliyun sms] missing ALIBABA_CLOUD_ACCESS_KEY_* env");
                        return [2 /*return*/, null];
                    }
                    params = __assign(__assign({}, business), { Action: action, Format: "JSON", Version: DYPNSAPI_VERSION, AccessKeyId: env_1.ALIBABA_CLOUD_ACCESS_KEY_ID, SignatureMethod: "HMAC-SHA1", SignatureVersion: "1.0", SignatureNonce: (0, node_crypto_1.randomUUID)(), 
                        // ISO8601 UTC without milliseconds, e.g. 2026-06-29T12:00:00Z.
                        Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z") });
                    params.Signature = sign(params);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(DYPNSAPI_ENDPOINT, "?").concat(canonicalize(params)))];
                case 2:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 3:
                    data = (_a.sent());
                    if (data.Code !== "OK") {
                        console.error("[aliyun sms] api error", JSON.stringify(data));
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data];
                case 4:
                    err_1 = _a.sent();
                    console.error("[aliyun sms] request failed", err_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Code validity. The system templates (e.g. 100001 "您的验证码为${code}。…${min}分钟内
// 有效") expect both a `code` and a `min` variable, so they must stay in sync.
var CODE_VALID_MINUTES = 5;
/**
 * Send an SMS verification code to a phone number. The `##code##` placeholder tells
 * Aliyun to generate (and later be able to validate) the code; passing a literal
 * code instead would make CheckSmsVerifyCode unusable. The template variables
 * (`code`, `min`) must match the configured system template.
 */
function sendSmsVerifyCode(phoneNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!env_1.ALIBABA_CLOUD_SMS_SIGN_NAME || !env_1.ALIBABA_CLOUD_SMS_TEMPLATE_CODE) {
                        console.error("[aliyun sms] missing sign name or template code env");
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, callDypnsapi("SendSmsVerifyCode", {
                            PhoneNumber: phoneNumber,
                            SignName: env_1.ALIBABA_CLOUD_SMS_SIGN_NAME,
                            TemplateCode: env_1.ALIBABA_CLOUD_SMS_TEMPLATE_CODE,
                            TemplateParam: JSON.stringify({
                                code: "##code##",
                                min: String(CODE_VALID_MINUTES)
                            }),
                            CodeLength: "6",
                            ValidTime: String(CODE_VALID_MINUTES * 60)
                        })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, !!data];
            }
        });
    });
}
/**
 * Verify a code the user entered. Aliyun owns the code lifecycle, so a successful
 * API call does NOT mean the code matched — the outcome lives in Model.VerifyResult
 * and only "PASS" counts as verified.
 */
function checkSmsVerifyCode(phoneNumber, verifyCode) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, callDypnsapi("CheckSmsVerifyCode", {
                        PhoneNumber: phoneNumber,
                        VerifyCode: verifyCode
                    })];
                case 1:
                    data = _b.sent();
                    return [2 /*return*/, ((_a = data === null || data === void 0 ? void 0 : data.Model) === null || _a === void 0 ? void 0 : _a.VerifyResult) === "PASS"];
            }
        });
    });
}
