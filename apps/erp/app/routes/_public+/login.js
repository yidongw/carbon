"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = void 0;
exports.loader = loader;
exports.action = action;
exports.default = LoginRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var users_server_1 = require("@carbon/auth/users.server");
var verification_server_1 = require("@carbon/auth/verification.server");
var env_1 = require("@carbon/env");
var form_1 = require("@carbon/form");
var kv_1 = require("@carbon/kv");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_turnstile_1 = require("@marsidev/react-turnstile");
var browser_1 = require("@simplewebauthn/browser");
var qrcode_react_1 = require("qrcode.react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var si_1 = require("react-icons/si");
var react_router_1 = require("react-router");
var Input_1 = require("~/components/Form/Input");
var formatValidationError_1 = require("~/utils/formatValidationError");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | Login" }];
};
exports.meta = meta;
// Shared sizing for the WeChat-QR area across its loading/ready/error states.
var QR_BOX_CLASS = "flex h-[204px] w-[204px] items-center justify-center rounded-xl bg-muted";
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, redirectTo, authSession, hasOutlookAuth, hasGoogleAuth, hasPasskeyAuth, cookieHeaders;
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = new URL(request.url);
                    redirectTo = url.searchParams.get("redirectTo");
                    return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 1:
                    authSession = _c.sent();
                    hasOutlookAuth = (0, auth_1.isAuthProviderEnabled)("azure");
                    hasGoogleAuth = (0, auth_1.isAuthProviderEnabled)("google");
                    hasPasskeyAuth = (0, auth_1.isAuthProviderEnabled)("passkey");
                    if (!authSession) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, auth_server_1.verifyAuthSession)(authSession)];
                case 2:
                    if (_c.sent()) {
                        throw (0, react_router_1.redirect)((0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot));
                    }
                    return [4 /*yield*/, (0, session_server_1.clearAuthCookies)(request)];
                case 3:
                    cookieHeaders = _c.sent();
                    return [2 /*return*/, (0, react_router_1.data)({
                            hasOutlookAuth: hasOutlookAuth,
                            hasGoogleAuth: hasGoogleAuth,
                            hasPasskeyAuth: hasPasskeyAuth,
                            providers: env_1.AUTH_PROVIDERS.split(","),
                            isWeChatBrowser: isWeChatUA(request)
                        }, { headers: cookieHeaders })];
                case 4: return [2 /*return*/, {
                        hasOutlookAuth: hasOutlookAuth,
                        hasGoogleAuth: hasGoogleAuth,
                        hasPasskeyAuth: hasPasskeyAuth,
                        providers: env_1.AUTH_PROVIDERS.split(","),
                        isWeChatBrowser: isWeChatUA(request)
                    }];
            }
        });
    });
}
function isWeChatUA(request) {
    var _a;
    return /MicroMessenger/i.test((_a = request.headers.get("user-agent")) !== null && _a !== void 0 ? _a : "");
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var ip, ratelimit, success, formData, turnstileToken, verifyResponse, verifyData, validation, _c, email, redirectTo, user, authSession, sessionCookie, magicLink, pkceHeader, verificationSent, verificationSent;
        var _d, _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
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
                    success = (_f.sent()).success;
                    if (!success) {
                        return [2 /*return*/, (0, auth_1.error)(null, "Rate limit exceeded")];
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _f.sent();
                    if (!(auth_1.CarbonEdition === utils_1.Edition.Cloud &&
                        auth_1.CLOUDFLARE_TURNSTILE_SITE_KEY !== "1x00000000000000000000AA")) return [3 /*break*/, 5];
                    turnstileToken = formData.get("turnstileToken");
                    return [4 /*yield*/, fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: new URLSearchParams({
                                secret: auth_1.CLOUDFLARE_TURNSTILE_SECRET_KEY !== null && auth_1.CLOUDFLARE_TURNSTILE_SECRET_KEY !== void 0 ? auth_1.CLOUDFLARE_TURNSTILE_SECRET_KEY : "",
                                response: turnstileToken !== null && turnstileToken !== void 0 ? turnstileToken : "",
                                remoteip: ip
                            })
                        })];
                case 3:
                    verifyResponse = _f.sent();
                    return [4 /*yield*/, verifyResponse.json()];
                case 4:
                    verifyData = _f.sent();
                    if (!verifyData.success) {
                        return [2 /*return*/, (0, auth_1.error)(null, "Bot verification failed. Please try again.")];
                    }
                    _f.label = 5;
                case 5: return [4 /*yield*/, (0, form_1.validator)(auth_1.magicLinkValidator).validate(formData)];
                case 6:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, auth_1.error)(validation.error, "Invalid email address")];
                    }
                    _c = validation.data, email = _c.email, redirectTo = _c.redirectTo;
                    return [4 /*yield*/, (0, users_server_1.getUserByEmail)(email)];
                case 7:
                    user = _f.sent();
                    if (!((0, auth_1.isBypassEmail)(email) && ((_e = user.data) === null || _e === void 0 ? void 0 : _e.active))) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, auth_server_1.signInWithBypassEmail)(email)];
                case 8:
                    authSession = _f.sent();
                    if (!authSession) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, session_server_1.setAuthSession)(request, { authSession: authSession })];
                case 9:
                    sessionCookie = _f.sent();
                    return [2 /*return*/, (0, react_router_1.redirect)((0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot), {
                            headers: [["Set-Cookie", sessionCookie]]
                        })];
                case 10:
                    if (!(user.data && user.data.active)) return [3 /*break*/, 15];
                    if (!(auth_1.LOGIN_METHOD === "magic-link")) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, auth_server_1.sendMagicLink)(email, redirectTo)];
                case 11:
                    magicLink = _f.sent();
                    if (magicLink.error) {
                        return [2 /*return*/, (0, auth_1.error)(null, "Failed to send magic link")];
                    }
                    return [4 /*yield*/, (0, session_server_1.setPkceCookie)(__assign(__assign({}, magicLink.pkceEntry), { redirectTo: (0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot) }))];
                case 12:
                    pkceHeader = _f.sent();
                    return [2 /*return*/, (0, react_router_1.data)({ success: true, mode: "login" }, { headers: [["Set-Cookie", pkceHeader]] })];
                case 13: return [4 /*yield*/, (0, verification_server_1.sendVerificationCode)(email)];
                case 14:
                    verificationSent = _f.sent();
                    if (!verificationSent) {
                        return [2 /*return*/, (0, auth_1.error)(null, "Failed to send verification code")];
                    }
                    return [2 /*return*/, { success: true, mode: "verify", email: email }];
                case 15:
                    if (!(auth_1.CarbonEdition === utils_1.Edition.Enterprise)) return [3 /*break*/, 16];
                    return [2 /*return*/, { success: false, message: "User record not found" }];
                case 16: return [4 /*yield*/, (0, verification_server_1.sendVerificationCode)(email)];
                case 17:
                    verificationSent = _f.sent();
                    if (!verificationSent) {
                        return [2 /*return*/, (0, auth_1.error)(null, "Failed to send verification code")];
                    }
                    return [2 /*return*/, { success: true, mode: "signup", email: email }];
            }
        });
    });
}
function LoginRoute() {
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var t = (0, macro_1.useLingui)().t;
    var formatError = (0, formatValidationError_1.useFormatValidationError)();
    var _l = (0, react_router_1.useLoaderData)(), hasOutlookAuthEnabled = _l.hasOutlookAuth, hasGoogleAuthEnabled = _l.hasGoogleAuth, hasPasskeyAuthEnabled = _l.hasPasskeyAuth, providers = _l.providers, isWeChatBrowser = _l.isWeChatBrowser;
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var redirectTo = (_a = searchParams.get("redirectTo")) !== null && _a !== void 0 ? _a : undefined;
    // Invite links can restrict sign-in to a single method via ?only=<method>.
    // The join flow drives the joiner through each required method in order.
    var onlyRaw = searchParams.get("only");
    var restrictTo = onlyRaw &&
        ["email", "phone", "wechat", "google", "azure", "passkey"].includes(onlyRaw)
        ? onlyRaw
        : null;
    var allow = function (method) { return !restrictTo || restrictTo === method; };
    var hasWeChatAuth = providers.includes("wechat") && allow("wechat");
    var hasPhoneAuth = providers.includes("phone") && allow("phone");
    var hasGoogleAuth = hasGoogleAuthEnabled && allow("google");
    var hasOutlookAuth = hasOutlookAuthEnabled && allow("azure");
    var hasPasskeyAuth = hasPasskeyAuthEnabled && allow("passkey");
    var showEmailForm = allow("email");
    // Always offer the WeChat button when the provider is on. In the WeChat
    // in-app browser it redirects (OAuth); elsewhere it reveals a QR to scan.
    var showWeChatButton = hasWeChatAuth;
    var canShowWeChatQr = !isWeChatBrowser && hasWeChatAuth;
    // Build the optional `redirectTo` query fragment; `sep` is "?" when starting
    // a query string and "&" when appending to one.
    var redirectQuery = (0, react_2.useCallback)(function (sep) {
        return redirectTo ? "".concat(sep, "redirectTo=").concat(encodeURIComponent(redirectTo)) : "";
    }, [redirectTo]);
    var _m = (0, react_2.useState)(hasPhoneAuth ? "phone" : "email"), loginMethod = _m[0], setLoginMethod = _m[1];
    var _o = (0, react_2.useState)("login"), mode = _o[0], setMode = _o[1];
    var _p = (0, react_2.useState)(""), signupEmail = _p[0], setSignupEmail = _p[1];
    var _q = (0, react_2.useState)(""), turnstileToken = _q[0], setTurnstileToken = _q[1];
    var _r = (0, react_2.useState)(false), passkeySupported = _r[0], setPasskeySupported = _r[1];
    var _s = (0, react_2.useState)(false), passkeyLoading = _s[0], setPasskeyLoading = _s[1];
    var conditionalAbortRef = (0, react_2.useRef)(null);
    var fetcher = (0, react_router_1.useFetcher)();
    var phoneFetcher = (0, react_router_1.useFetcher)();
    var theme = (0, react_1.useMode)();
    // Mint the QR with a plain fetch (not useFetcher().load) so EVERY failure —
    // a non-OK response (bad creds, WeChat API down) or a network-level rejection
    // (offline, connection reset) — is caught here and degraded to email, rather
    // than escalating to the route error boundary ("Something went wrong").
    var _t = (0, react_2.useState)({ status: "idle", url: null, scene: null }), qr = _t[0], setQr = _t[1];
    var loadWeChatQr = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var res, json, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setQr({ status: "loading", url: null, scene: null });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/api/wechat-qr-url".concat(redirectQuery("?")))];
                case 2:
                    res = _c.sent();
                    if (!res.ok)
                        throw new Error("WeChat QR mint failed");
                    return [4 /*yield*/, res.json()];
                case 3:
                    json = (_c.sent());
                    setQr(json.url
                        ? { status: "ready", url: json.url, scene: (_b = json.scene) !== null && _b !== void 0 ? _b : null }
                        : { status: "error", url: null, scene: null });
                    return [3 /*break*/, 5];
                case 4:
                    _a = _c.sent();
                    setQr({ status: "error", url: null, scene: null });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [redirectQuery]);
    // When Supabase OAuth falls back to the site URL instead of /callback (e.g.
    // due to redirect URL allow-list wildcard mismatch), the hash tokens land
    // here. Forward to /callback so the token handler there can process them.
    (0, react_2.useEffect)(function () {
        if (window.location.hash.includes("access_token=")) {
            var qs = redirectTo
                ? "?redirectTo=".concat(encodeURIComponent(redirectTo))
                : "";
            window.location.replace("/callback".concat(qs).concat(window.location.hash));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    (0, react_2.useEffect)(function () {
        var _a;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) && fetcher.data.mode) {
            if ((fetcher.data.mode === "signup" || fetcher.data.mode === "verify") &&
                mode !== "verify") {
                setMode("verify");
                if (fetcher.data.email) {
                    setSignupEmail(fetcher.data.email);
                    var verifyUrl = "/verify?email=".concat(encodeURIComponent(fetcher.data.email)).concat(redirectQuery("&"));
                    window.location.href = verifyUrl;
                }
            }
        }
    }, [fetcher.data, mode, redirectQuery]);
    // Detect passkey support and start conditional UI (autofill) on mount
    (0, react_1.useMount)(function () {
        if (!hasPasskeyAuth)
            return;
        if (!(0, browser_1.browserSupportsWebAuthn)())
            return;
        var checkAndStart = function () { return __awaiter(_this, void 0, void 0, function () {
            var conditionalSupported, _a, optRes, _b, challengeId, options, abortCtrl, credential, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = typeof PublicKeyCredential !== "undefined" &&
                            typeof PublicKeyCredential.isConditionalMediationAvailable ===
                                "function";
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, PublicKeyCredential.isConditionalMediationAvailable()];
                    case 1:
                        _a = (_d.sent());
                        _d.label = 2;
                    case 2:
                        conditionalSupported = _a;
                        setPasskeySupported(true);
                        if (!conditionalSupported)
                            return [2 /*return*/];
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 8, , 9]);
                        return [4 /*yield*/, fetch("/api/passkey/authenticate/options", {
                                method: "POST"
                            })];
                    case 4:
                        optRes = _d.sent();
                        if (!optRes.ok)
                            return [2 /*return*/];
                        return [4 /*yield*/, optRes.json()];
                    case 5:
                        _b = _d.sent(), challengeId = _b.challengeId, options = __rest(_b, ["challengeId"]);
                        abortCtrl = new AbortController();
                        conditionalAbortRef.current = abortCtrl;
                        return [4 /*yield*/, (0, browser_1.startAuthentication)({
                                optionsJSON: options,
                                useBrowserAutofill: true,
                                signal: abortCtrl.signal
                            })];
                    case 6:
                        credential = _d.sent();
                        return [4 /*yield*/, completePasskeyAuth(credential, challengeId)];
                    case 7:
                        _d.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        _c = _d.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        checkAndStart();
        return function () {
            var _a;
            (_a = conditionalAbortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
        };
    });
    var completePasskeyAuth = function (credential, challengeId) { return __awaiter(_this, void 0, void 0, function () {
        var verifyRes, body;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch("/api/passkey/authenticate/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ credential: credential, challengeId: challengeId, redirectTo: redirectTo })
                    })];
                case 1:
                    verifyRes = _b.sent();
                    if (verifyRes.redirected) {
                        window.location.href = verifyRes.url;
                        return [2 /*return*/];
                    }
                    if (!!verifyRes.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, verifyRes.json().catch(function () { return ({}); })];
                case 2:
                    body = _b.sent();
                    if (!(verifyRes.status === 404 && body.unknownCredential)) return [3 /*break*/, 4];
                    if (!(typeof PublicKeyCredential.signalUnknownCredential ===
                        "function")) return [3 /*break*/, 4];
                    return [4 /*yield*/, PublicKeyCredential.signalUnknownCredential({
                            rpId: window.location.hostname,
                            credentialId: body.credentialId
                        })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    react_1.toast.error((_a = body.message) !== null && _a !== void 0 ? _a : "Passkey sign-in failed");
                    _b.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var onSignInWithPasskey = function () { return __awaiter(_this, void 0, void 0, function () {
        var optRes, _a, challengeId, options, credential, e_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!passkeySupported)
                        return [2 /*return*/];
                    setPasskeyLoading(true);
                    (_b = conditionalAbortRef.current) === null || _b === void 0 ? void 0 : _b.abort();
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("/api/passkey/authenticate/options", {
                            method: "POST"
                        })];
                case 2:
                    optRes = _c.sent();
                    if (!optRes.ok)
                        throw new Error("Failed to get options");
                    return [4 /*yield*/, optRes.json()];
                case 3:
                    _a = _c.sent(), challengeId = _a.challengeId, options = __rest(_a, ["challengeId"]);
                    return [4 /*yield*/, (0, browser_1.startAuthentication)({
                            optionsJSON: options
                        })];
                case 4:
                    credential = _c.sent();
                    return [4 /*yield*/, completePasskeyAuth(credential, challengeId)];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 6:
                    e_1 = _c.sent();
                    if ((e_1 === null || e_1 === void 0 ? void 0 : e_1.name) !== "NotAllowedError" && (e_1 === null || e_1 === void 0 ? void 0 : e_1.name) !== "AbortError") {
                        react_1.toast.error("Passkey sign-in failed");
                    }
                    return [3 /*break*/, 8];
                case 7:
                    setPasskeyLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // After the SMS code is sent, go to /verify-phone to enter it (mirrors the email
    // flow's hop to /verify).
    (0, react_2.useEffect)(function () {
        var _a;
        if (((_a = phoneFetcher.data) === null || _a === void 0 ? void 0 : _a.success) && phoneFetcher.data.phone) {
            var verifyUrl = "/verify-phone?phone=".concat(encodeURIComponent(phoneFetcher.data.phone)).concat(redirectQuery("&"));
            window.location.href = verifyUrl;
        }
    }, [phoneFetcher.data, redirectQuery]);
    // Poll the QR scene while the WeChat QR tab is open; when the user has scanned
    // and the webhook has resolved them, the status response sets the session
    // cookie and we navigate to the authenticated app.
    var wechatScene = qr.scene;
    (0, react_2.useEffect)(function () {
        if (loginMethod !== "wechat-qr" || !wechatScene)
            return;
        var active = true;
        var poll = function () { return __awaiter(_this, void 0, void 0, function () {
            var res, json, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/api/wechat-qr-status?scene=".concat(encodeURIComponent(wechatScene)).concat(redirectQuery("&")))];
                    case 1:
                        res = _c.sent();
                        if (!res.ok)
                            return [2 /*return*/];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        json = (_c.sent());
                        if (active && json.status === "authed") {
                            window.location.href = (_b = json.redirectTo) !== null && _b !== void 0 ? _b : "/";
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        var id = setInterval(poll, 2000);
        poll();
        return function () {
            active = false;
            clearInterval(id);
        };
    }, [loginMethod, wechatScene, redirectQuery]);
    // Auto-load the QR as soon as the WeChat-QR method is active so the code +
    // polling start without needing a second click. On failure we stay put and
    // show a retry button (status "error" is not "idle", so this won't loop).
    (0, react_2.useEffect)(function () {
        if (loginMethod === "wechat-qr" &&
            canShowWeChatQr &&
            qr.status === "idle") {
            loadWeChatQr();
        }
    }, [loginMethod, canShowWeChatQr, qr.status, loadWeChatQr]);
    var onSignInWithGoogle = function () { return __awaiter(_this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, auth_1.carbonClient.auth.signInWithOAuth({
                        provider: "google",
                        options: {
                            redirectTo: "".concat(window.location.origin, "/callback").concat(redirectTo ? "?redirectTo=".concat(redirectTo) : "")
                        }
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        react_1.toast.error(formatError(error.message));
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onSignInWithAzure = function () { return __awaiter(_this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, auth_1.carbonClient.auth.signInWithOAuth({
                        provider: "azure",
                        options: {
                            scopes: "email",
                            redirectTo: "".concat(window.location.origin, "/callback").concat(redirectTo ? "?redirectTo=".concat(redirectTo) : "")
                        }
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        react_1.toast.error(formatError(error.message));
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onSignInWithWeChat = function () {
        window.location.href = "/auth/wechat".concat(redirectQuery("?"));
    };
    var onSelectWeChatQr = function () {
        setLoginMethod("wechat-qr");
        loadWeChatQr();
    };
    // The WeChat button redirects inside the WeChat browser (OAuth) but reveals
    // the scannable QR everywhere else.
    var onClickWeChat = isWeChatBrowser ? onSignInWithWeChat : onSelectWeChatQr;
    return (<>
      <div className="flex justify-center mb-8">
        <img src={auth_1.CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-mark-light.svg"} alt="Carbon Logo" className="w-24 dark:hidden"/>
        <img src={auth_1.CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-mark-dark.svg"} alt="Carbon Logo" className="w-24 hidden dark:block"/>
      </div>
      <div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 w-[380px]">
        {((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === true && ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.mode) === "login" ? (<>
            <react_1.VStack spacing={4} className="items-center justify-center">
              <react_1.Heading size="h3">
                <macro_1.Trans>Check your email</macro_1.Trans>
              </react_1.Heading>
              <p className="text-muted-foreground tracking-tight text-sm">
                <macro_1.Trans>
                  We've sent you a magic link to sign in to your account.
                </macro_1.Trans>
              </p>
            </react_1.VStack>
          </>) : mode === "verify" ? (<react_1.VStack spacing={4} className="items-center">
            <react_1.Heading size="h3">
              <macro_1.Trans>Verify your email</macro_1.Trans>
            </react_1.Heading>
            <p className="text-muted-foreground tracking-tight text-sm text-center">
              <macro_1.Trans>We've sent a verification code to {signupEmail}</macro_1.Trans>
            </p>
            <p className="text-muted-foreground tracking-tight text-xs text-center">
              <macro_1.Trans>Redirecting to verification page...</macro_1.Trans>
            </p>
            <react_1.Button type="button" variant="link" size="sm" onClick={function () {
                setMode("login");
                setSignupEmail("");
                window.location.reload();
            }}>
              <macro_1.Trans>Use a different email</macro_1.Trans>
            </react_1.Button>
          </react_1.VStack>) : (<react_1.VStack spacing={2}>
            {showWeChatButton && (<react_1.Button type="button" size="lg" className="w-full" onClick={onClickWeChat} isDisabled={fetcher.state !== "idle" ||
                    phoneFetcher.state !== "idle" ||
                    passkeyLoading} variant="secondary" leftIcon={<si_1.SiWechat className="w-4 h-4" style={{ color: "#07C160" }}/>}>
                <macro_1.Trans>Sign in with WeChat</macro_1.Trans>
              </react_1.Button>)}
            {hasGoogleAuth && (<react_1.Button type="button" size="lg" className="w-full" onClick={onSignInWithGoogle} isDisabled={fetcher.state !== "idle"} variant="secondary" leftIcon={<GoogleIcon />}>
                <macro_1.Trans>Sign in with Google</macro_1.Trans>
              </react_1.Button>)}
            {hasOutlookAuth && (<react_1.Button type="button" size="lg" className="w-full" onClick={onSignInWithAzure} isDisabled={fetcher.state !== "idle"} variant="secondary" leftIcon={<OutlookIcon className="size-6"/>}>
                <macro_1.Trans>Sign in with Outlook</macro_1.Trans>
              </react_1.Button>)}

            {hasPasskeyAuth && passkeySupported && (<react_1.Button type="button" size="lg" className="w-full" onClick={onSignInWithPasskey} isDisabled={passkeyLoading || fetcher.state !== "idle"} isLoading={passkeyLoading} variant="secondary" leftIcon={<lu_1.LuFingerprint className="size-4"/>}>
                <macro_1.Trans>Sign in with Passkey</macro_1.Trans>
              </react_1.Button>)}

            {(hasGoogleAuth ||
                hasOutlookAuth ||
                showWeChatButton ||
                (hasPasskeyAuth && passkeySupported)) &&
                (showEmailForm || hasPhoneAuth) && (<div className="py-3 w-full">
                  <react_1.Separator />
                </div>)}

            {loginMethod !== "wechat-qr" &&
                (function () {
                    var tabs = [];
                    if (hasPhoneAuth)
                        tabs.push({ key: "phone", label: <macro_1.Trans>Phone</macro_1.Trans> });
                    if (showEmailForm)
                        tabs.push({ key: "email", label: <macro_1.Trans>Email</macro_1.Trans> });
                    if (tabs.length < 2)
                        return null;
                    return (<div className="flex w-full items-center gap-1 rounded-xl bg-muted p-1">
                    {tabs.map(function (tab) { return (<button key={tab.key} type="button" disabled={fetcher.state !== "idle" ||
                                phoneFetcher.state !== "idle" ||
                                passkeyLoading} className={"flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ".concat(loginMethod === tab.key
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground")} onClick={function () { return setLoginMethod(tab.key); }}>
                        {tab.label}
                      </button>); })}
                  </div>);
                })()}

            {/* The QR view stays mounted through loading/ready/error so a
                failed mint shows a retry state in place. */}
            {loginMethod === "wechat-qr" && canShowWeChatQr ? (<react_1.VStack spacing={4} className="items-center py-2">
                {qr.status === "error" ? (<>
                    {/* Placeholder where the QR would be, with the refetch
                        button centered directly on it so a failed mint is
                        recoverable in place. */}
                    <div className={"relative ".concat(QR_BOX_CLASS)}>
                      <lu_1.LuQrCode className="h-20 w-20 text-muted-foreground/25"/>
                      <react_1.Button type="button" variant="secondary" size="sm" leftIcon={<lu_1.LuRefreshCw className="h-4 w-4"/>} onClick={loadWeChatQr} className="absolute shadow-sm">
                        <macro_1.Trans>Refresh QR code</macro_1.Trans>
                      </react_1.Button>
                    </div>
                    <p className="text-center text-xs text-destructive text-balance">
                      <macro_1.Trans>Couldn't load the WeChat QR code</macro_1.Trans>
                    </p>
                  </>) : qr.status === "ready" && qr.url ? (<>
                    <div className="rounded-xl bg-white p-3 shadow-sm outline outline-1 -outline-offset-1 outline-black/10">
                      <qrcode_react_1.QRCodeSVG value={qr.url} size={180} className="block"/>
                    </div>
                    <p className="text-center text-xs text-muted-foreground text-balance">
                      <macro_1.Trans>Scan with WeChat to sign in</macro_1.Trans>
                    </p>
                    <react_1.Button type="button" variant="ghost" size="sm" onClick={loadWeChatQr}>
                      <macro_1.Trans>Refresh QR code</macro_1.Trans>
                    </react_1.Button>
                  </>) : (<div className={QR_BOX_CLASS}>
                    <p className="text-sm text-muted-foreground">
                      <macro_1.Trans>Loading…</macro_1.Trans>
                    </p>
                  </div>)}
                {/* Always offer a way back: the tabs are hidden while the QR is
                    shown, so this is the only route back to email/phone. */}
                <react_1.Button type="button" variant="link" size="sm" onClick={function () {
                    return setLoginMethod(hasPhoneAuth ? "phone" : "email");
                }}>
                  <macro_1.Trans>Use another sign-in method</macro_1.Trans>
                </react_1.Button>
              </react_1.VStack>) : loginMethod === "phone" && hasPhoneAuth ? (<form_1.ValidatedForm fetcher={phoneFetcher} validator={auth_1.phoneLoginValidator} defaultValues={{ redirectTo: redirectTo }} method="post" action="/api/send-phone-code" className="w-full">
                <form_1.Hidden name="redirectTo" value={redirectTo} type="hidden"/>
                <form_1.Hidden name="turnstileToken" value={turnstileToken}/>
                <react_1.VStack spacing={2}>
                  {((_d = phoneFetcher.data) === null || _d === void 0 ? void 0 : _d.success) === false &&
                    ((_e = phoneFetcher.data) === null || _e === void 0 ? void 0 : _e.message) && (<react_1.Alert variant="destructive">
                        <lu_1.LuCircleAlert className="w-4 h-4"/>
                        <react_1.AlertTitle>
                          <macro_1.Trans>Authentication Error</macro_1.Trans>
                        </react_1.AlertTitle>
                        <react_1.AlertDescription>
                          {((_f = phoneFetcher.data) === null || _f === void 0 ? void 0 : _f.message) &&
                        formatError(phoneFetcher.data.message)}
                        </react_1.AlertDescription>
                      </react_1.Alert>)}

                  <Input_1.default name="phone" label="" prefix="+86" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Phone Number"], ["Phone Number"])))}/>

                  <form_1.Submit isDisabled={phoneFetcher.state !== "idle" ||
                    (!!auth_1.CLOUDFLARE_TURNSTILE_SITE_KEY && !turnstileToken)} isLoading={phoneFetcher.state === "submitting"} size="lg" className="w-full" withBlocker={false} variant="secondary">
                    <macro_1.Trans>Sign in with Phone</macro_1.Trans>
                  </form_1.Submit>
                  {!!auth_1.CLOUDFLARE_TURNSTILE_SITE_KEY && (<div className="w-full flex justify-center">
                      <react_turnstile_1.Turnstile siteKey={auth_1.CLOUDFLARE_TURNSTILE_SITE_KEY} onSuccess={function (token) { return setTurnstileToken(token); }} onError={function () { return setTurnstileToken(""); }} onExpire={function () { return setTurnstileToken(""); }} options={{
                        theme: theme === "dark" ? "dark" : "light"
                    }}/>
                    </div>)}
                </react_1.VStack>
              </form_1.ValidatedForm>) : showEmailForm ? (<form_1.ValidatedForm fetcher={fetcher} validator={auth_1.magicLinkValidator} defaultValues={{ redirectTo: redirectTo }} method="post" action="/login" className="w-full">
                <form_1.Hidden name="redirectTo" value={redirectTo} type="hidden"/>
                <form_1.Hidden name="turnstileToken" value={turnstileToken}/>
                <react_1.VStack spacing={2}>
                  {((_g = fetcher.data) === null || _g === void 0 ? void 0 : _g.success) === false && ((_h = fetcher.data) === null || _h === void 0 ? void 0 : _h.message) && (<react_1.Alert variant="destructive">
                      <lu_1.LuCircleAlert className="w-4 h-4"/>
                      <react_1.AlertTitle>
                        <macro_1.Trans>Authentication Error</macro_1.Trans>
                      </react_1.AlertTitle>
                      <react_1.AlertDescription>
                        {((_j = fetcher.data) === null || _j === void 0 ? void 0 : _j.message) &&
                        formatError(fetcher.data.message)}
                      </react_1.AlertDescription>
                    </react_1.Alert>)}

                  <Input_1.default name="email" label="" placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Email Address"], ["Email Address"])))} autoComplete={hasPasskeyAuth ? "email webauthn" : "email"}/>

                  <form_1.Submit isDisabled={fetcher.state !== "idle" ||
                    (!!auth_1.CLOUDFLARE_TURNSTILE_SITE_KEY && !turnstileToken)} isLoading={fetcher.state === "submitting"} size="lg" className="w-full" withBlocker={false} variant="secondary">
                    <macro_1.Trans>Sign in with Email</macro_1.Trans>
                  </form_1.Submit>
                  {!!auth_1.CLOUDFLARE_TURNSTILE_SITE_KEY && (<div className="w-full flex justify-center">
                      <react_turnstile_1.Turnstile siteKey={auth_1.CLOUDFLARE_TURNSTILE_SITE_KEY} onSuccess={function (token) { return setTurnstileToken(token); }} onError={function () { return setTurnstileToken(""); }} onExpire={function () { return setTurnstileToken(""); }} options={{
                        theme: theme === "dark" ? "dark" : "light"
                    }}/>
                    </div>)}
                </react_1.VStack>
              </form_1.ValidatedForm>) : null}
          </react_1.VStack>)}
      </div>

      <div className="flex flex-col gap-4 text-sm text-center text-balance text-muted-foreground w-[380px]">
        {mode !== "verify" &&
            ((_k = fetcher.data) === null || _k === void 0 ? void 0 : _k.success) !== true &&
            auth_1.CarbonEdition !== utils_1.Edition.Enterprise && (<p>
              <macro_1.Trans>Login or create a new account</macro_1.Trans>
            </p>)}
        {auth_1.CONTROLLED_ENVIRONMENT && <react_1.ItarLoginDisclaimer />}
        {auth_1.CarbonEdition !== utils_1.Edition.Community && (<p>
            <macro_1.Trans>
              By signing in, you agree to the{" "}
              <a href="https://carbon.ms/terms" target="_blank" rel="noreferrer" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="https://carbon.ms/privacy" target="_blank" rel="noreferrer" className="underline">
                Privacy Policy.
              </a>
            </macro_1.Trans>
          </p>)}
      </div>
    </>);
}
function GoogleIcon(props) {
    return (<svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" {...props}>
      <path_1.path d="M8.15991 6.54543V9.64362H12.4654C12.2763 10.64 11.709 11.4837 10.8581 12.0509L13.4544 14.0655C14.9671 12.6692 15.8399 10.6182 15.8399 8.18188C15.8399 7.61461 15.789 7.06911 15.6944 6.54552L8.15991 6.54543Z" fill="#4285F4"></path_1.path>
      <path_1.path d="M3.6764 9.52268L3.09083 9.97093L1.01807 11.5855C2.33443 14.1963 5.03241 16 8.15966 16C10.3196 16 12.1305 15.2873 13.4542 14.0655L10.8578 12.0509C10.1451 12.5309 9.23598 12.8219 8.15966 12.8219C6.07967 12.8219 4.31245 11.4182 3.67967 9.5273L3.6764 9.52268Z" fill="#34A853"></path_1.path>
      <path_1.path d="M1.01803 4.41455C0.472607 5.49087 0.159912 6.70543 0.159912 7.99995C0.159912 9.29447 0.472607 10.509 1.01803 11.5854C1.01803 11.5926 3.6799 9.51991 3.6799 9.51991C3.5199 9.03991 3.42532 8.53085 3.42532 7.99987C3.42532 7.46889 3.5199 6.95983 3.6799 6.47983L1.01803 4.41455Z" fill="#FBBC05"></path_1.path>
      <path_1.path d="M8.15982 3.18545C9.33802 3.18545 10.3853 3.59271 11.2216 4.37818L13.5125 2.0873C12.1234 0.792777 10.3199 0 8.15982 0C5.03257 0 2.33443 1.79636 1.01807 4.41455L3.67985 6.48001C4.31254 4.58908 6.07983 3.18545 8.15982 3.18545Z" fill="#EA4335"></path_1.path>
    </svg>);
}
function OutlookIcon(props) {
    return (<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="-274.66275 -425.834 2380.4105 2555.004" {...props}>
      <path_1.path d="M1831.083 894.25a40.879 40.879 0 00-19.503-35.131h-.213l-.767-.426-634.492-375.585a86.175 86.175 0 00-8.517-5.067 85.17 85.17 0 00-78.098 0 86.37 86.37 0 00-8.517 5.067l-634.49 375.585-.766.426c-19.392 12.059-25.337 37.556-13.278 56.948a41.346 41.346 0 0014.257 13.868l634.492 375.585a95.617 95.617 0 008.517 5.068 85.17 85.17 0 0078.098 0 95.52 95.52 0 008.517-5.068l634.492-375.585a40.84 40.84 0 0020.268-35.685z" fill="#0A2767"/>
      <path_1.path d="M520.453 643.477h416.38v381.674h-416.38zM1745.917 255.5V80.908c1-43.652-33.552-79.862-77.203-80.908H588.204C544.552 1.046 510 37.256 511 80.908V255.5l638.75 170.333z" fill="#0364B8"/>
      <path_1.path d="M511 255.5h425.833v383.25H511z" fill="#0078D4"/>
      <path_1.path d="M1362.667 255.5H936.833v383.25L1362.667 1022h383.25V638.75z" fill="#28A8EA"/>
      <path_1.path d="M936.833 638.75h425.833V1022H936.833z" fill="#0078D4"/>
      <path_1.path d="M936.833 1022h425.833v383.25H936.833z" fill="#0364B8"/>
      <path_1.path d="M520.453 1025.151h416.38v346.969h-416.38z" fill="#14447D"/>
      <path_1.path d="M1362.667 1022h383.25v383.25h-383.25z" fill="#0078D4"/>
      <linearGradient gradientTransform="matrix(1 0 0 -1 0 1705.333)" y2="1.998" x2="1128.458" y1="811.083" x1="1128.458" gradientUnits="userSpaceOnUse" id="a">
        <stop offset="0" stopColor="#35b8f1"/>
        <stop offset="1" stopColor="#28a8ea"/>
      </linearGradient>
      <path_1.path d="M1811.58 927.593l-.809.426-634.492 356.848c-2.768 1.703-5.578 3.321-8.517 4.769a88.437 88.437 0 01-34.407 8.517l-34.663-20.27a86.706 86.706 0 01-8.517-4.897L447.167 906.003h-.298l-21.036-11.753v722.384c.328 48.196 39.653 87.006 87.849 86.7h1230.914c.724 0 1.363-.341 2.129-.341a107.79 107.79 0 0029.808-6.217 86.066 86.066 0 0011.966-6.217c2.853-1.618 7.75-5.152 7.75-5.152a85.974 85.974 0 0034.833-68.772V894.25a38.323 38.323 0 01-19.502 33.343z" fill="url(#a)"/>
      <path_1.path d="M1797.017 891.397v44.287l-663.448 456.791-686.87-486.174a.426.426 0 00-.426-.426l-63.023-37.899v-31.938l25.976-.426 54.932 31.512 1.277.426 4.684 2.981s645.563 368.346 647.267 369.197l24.698 14.478c2.129-.852 4.258-1.703 6.813-2.555 1.278-.852 640.879-360.681 640.879-360.681z" fill="#0A2767" opacity=".5"/>
      <path_1.path d="M1811.58 927.593l-.809.468-634.492 356.848c-2.768 1.703-5.578 3.321-8.517 4.769a88.96 88.96 0 01-78.098 0 96.578 96.578 0 01-8.517-4.769l-634.49-356.848-.766-.468a38.326 38.326 0 01-20.057-33.343v722.384c.305 48.188 39.616 87.004 87.803 86.7h1229.64c48.188.307 87.5-38.509 87.807-86.696 0-.001 0 0 0 0V894.25a38.33 38.33 0 01-19.504 33.343z" fill="#1490DF"/>
      <path_1.path d="M1185.52 1279.629l-9.496 5.323a92.806 92.806 0 01-8.517 4.812 88.173 88.173 0 01-33.47 8.857l241.405 285.479 421.107 101.476a86.785 86.785 0 0026.7-33.343z" opacity=".1"/>
      <path_1.path d="M1228.529 1255.442l-52.505 29.51a92.806 92.806 0 01-8.517 4.812 88.173 88.173 0 01-33.47 8.857l113.101 311.838 549.538 74.989a86.104 86.104 0 0034.407-68.815v-9.326z" opacity=".05"/>
      <path_1.path d="M514.833 1703.333h1228.316a88.316 88.316 0 0052.59-17.033l-697.089-408.331a86.706 86.706 0 01-8.517-4.897L447.125 906.088h-.298l-20.993-11.838v719.914c-.048 49.2 39.798 89.122 88.999 89.169-.001 0-.001 0 0 0z" fill="#28A8EA"/>
      <path_1.path d="M1022 418.722v908.303c-.076 31.846-19.44 60.471-48.971 72.392a73.382 73.382 0 01-28.957 5.962H425.833V383.25H511v-42.583h433.073c43.019.163 77.834 35.035 77.927 78.055z" opacity=".1"/>
      <path_1.path d="M979.417 461.305v908.302a69.36 69.36 0 01-6.388 29.808c-11.826 29.149-40.083 48.273-71.54 48.417H425.833V383.25h475.656a71.493 71.493 0 0135.344 8.943c26.104 13.151 42.574 39.883 42.584 69.112z" opacity=".2"/>
      <path_1.path d="M979.417 461.305v823.136c-.208 43-34.928 77.853-77.927 78.225H425.833V383.25h475.656a71.493 71.493 0 0135.344 8.943c26.104 13.151 42.574 39.883 42.584 69.112z" opacity=".2"/>
      <path_1.path d="M936.833 461.305v823.136c-.046 43.067-34.861 78.015-77.927 78.225H425.833V383.25h433.072c43.062.023 77.951 34.951 77.927 78.013a.589.589 0 01.001.042z" opacity=".2"/>
      <linearGradient gradientTransform="matrix(1 0 0 -1 0 1705.333)" y2="324.259" x2="774.086" y1="1383.074" x1="162.747" gradientUnits="userSpaceOnUse" id="b">
        <stop offset="0" stopColor="#1784d9"/>
        <stop offset=".5" stopColor="#107ad5"/>
        <stop offset="1" stopColor="#0a63c9"/>
      </linearGradient>
      <path_1.path d="M78.055 383.25h780.723c43.109 0 78.055 34.947 78.055 78.055v780.723c0 43.109-34.946 78.055-78.055 78.055H78.055c-43.109 0-78.055-34.947-78.055-78.055V461.305c0-43.108 34.947-78.055 78.055-78.055z" fill="url(#b)"/>
      <path_1.path d="M243.96 710.631a227.05 227.05 0 0189.17-98.495 269.56 269.56 0 01141.675-35.515 250.91 250.91 0 01131.114 33.683 225.014 225.014 0 0186.742 94.109 303.751 303.751 0 0130.405 138.396 320.567 320.567 0 01-31.299 144.783 230.37 230.37 0 01-89.425 97.388 260.864 260.864 0 01-136.011 34.578 256.355 256.355 0 01-134.01-34.067 228.497 228.497 0 01-87.892-94.28 296.507 296.507 0 01-30.745-136.735 329.29 329.29 0 0130.276-143.845zm95.046 231.227a147.386 147.386 0 0050.163 64.812 131.028 131.028 0 0078.353 23.591 137.244 137.244 0 0083.634-24.358 141.156 141.156 0 0048.715-64.812 251.594 251.594 0 0015.543-90.404 275.198 275.198 0 00-14.649-91.554 144.775 144.775 0 00-47.182-67.537 129.58 129.58 0 00-82.91-25.55 135.202 135.202 0 00-80.184 23.804 148.626 148.626 0 00-51.1 65.365 259.759 259.759 0 00-.341 186.728z" fill="#FFF"/>
      <path_1.path d="M1362.667 255.5h383.25v383.25h-383.25z" fill="#50D9FF"/>
    </svg>);
}
var templateObject_1, templateObject_2;
