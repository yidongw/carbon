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
exports.meta = void 0;
exports.loader = loader;
exports.action = action;
exports.default = VerifyPhoneRoute;
var auth_1 = require("@carbon/auth");
var aliyun_sms_server_1 = require("@carbon/auth/aliyun-sms.server");
var auth_server_1 = require("@carbon/auth/auth.server");
var company_server_1 = require("@carbon/auth/company.server");
var phone_server_1 = require("@carbon/auth/phone.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var kv_1 = require("@carbon/kv");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | Verify Phone" }];
};
exports.meta = meta;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, redirectTo, authSession;
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = new URL(request.url);
                    redirectTo = url.searchParams.get("redirectTo");
                    return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 1:
                    authSession = _c.sent();
                    if (authSession) {
                        throw (0, react_router_1.redirect)((0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot));
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var ip, ratelimit, success, _c, _d, validation, _e, _f, _g, phone, code, redirectTo, isCodeValid, _h, _j, user, _k, message, _l, _m, _o, _p, authSession, _q, _r, sessionCookie, companyIdCookie, destination;
        var _s;
        var request = _b.request;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    ip = (_s = request.headers.get("x-forwarded-for")) !== null && _s !== void 0 ? _s : "127.0.0.1";
                    ratelimit = new kv_1.Ratelimit({
                        redis: kv_1.redis,
                        limiter: kv_1.Ratelimit.slidingWindow(auth_1.RATE_LIMIT, "1 h"),
                        analytics: true
                    });
                    return [4 /*yield*/, ratelimit.limit(ip)];
                case 1:
                    success = (_t.sent()).success;
                    if (!!success) return [3 /*break*/, 3];
                    _c = react_router_1.data;
                    _d = [(0, auth_1.error)(null, "Rate limit exceeded")];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Rate limit exceeded"))];
                case 2: return [2 /*return*/, _c.apply(void 0, _d.concat([_t.sent()]))];
                case 3:
                    _f = (_e = (0, form_1.validator)(auth_1.phoneVerifyValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 4: return [4 /*yield*/, _f.apply(_e, [_t.sent()])];
                case 5:
                    validation = _t.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, auth_1.error)(validation.error, "Invalid verification code")];
                    }
                    _g = validation.data, phone = _g.phone, code = _g.code, redirectTo = _g.redirectTo;
                    return [4 /*yield*/, (0, aliyun_sms_server_1.checkSmsVerifyCode)(phone, code)];
                case 6:
                    isCodeValid = _t.sent();
                    if (!!isCodeValid) return [3 /*break*/, 8];
                    _h = react_router_1.data;
                    _j = [(0, auth_1.error)(null, "Invalid or expired verification code")];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid or expired verification code"))];
                case 7: return [2 /*return*/, _h.apply(void 0, _j.concat([_t.sent()]))];
                case 8:
                    if (!(auth_1.CarbonEdition === utils_1.Edition.Enterprise)) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, phone_server_1.findPhoneUser)(phone)];
                case 9:
                    _k = _t.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, (0, phone_server_1.findOrCreatePhoneUser)(phone)];
                case 11:
                    _k = _t.sent();
                    _t.label = 12;
                case 12:
                    user = _k;
                    if (!!user) return [3 /*break*/, 14];
                    message = auth_1.CarbonEdition === utils_1.Edition.Enterprise
                        ? "User record not found"
                        : "Failed to create user account";
                    _l = react_router_1.data;
                    _m = [(0, auth_1.error)(null, message)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, message))];
                case 13: return [2 /*return*/, _l.apply(void 0, _m.concat([_t.sent()]))];
                case 14:
                    if (!!user.active) return [3 /*break*/, 16];
                    _o = react_router_1.data;
                    _p = [(0, auth_1.error)(null, "Your account is not active")];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Your account is not active"))];
                case 15: return [2 /*return*/, _o.apply(void 0, _p.concat([_t.sent()]))];
                case 16: return [4 /*yield*/, (0, auth_server_1.signInWithUserIdViaAdmin)(user.id)];
                case 17:
                    authSession = _t.sent();
                    if (!!authSession) return [3 /*break*/, 19];
                    _q = react_router_1.data;
                    _r = [(0, auth_1.error)(null, "Failed to sign in user")];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to sign in user"))];
                case 18: return [2 /*return*/, _q.apply(void 0, _r.concat([_t.sent()]))];
                case 19: return [4 /*yield*/, (0, session_server_1.setAuthSession)(request, { authSession: authSession })];
                case 20:
                    sessionCookie = _t.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(authSession.companyId);
                    destination = authSession.companyId
                        ? (0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot)
                        : path_1.path.to.onboarding;
                    return [2 /*return*/, (0, react_router_1.redirect)(destination, {
                            headers: [
                                ["Set-Cookie", sessionCookie],
                                ["Set-Cookie", companyIdCookie]
                            ]
                        })];
            }
        });
    });
}
function VerifyPhoneRoute() {
    var _a, _b, _c, _d;
    var t = (0, macro_1.useLingui)().t;
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var phone = (_a = searchParams.get("phone")) !== null && _a !== void 0 ? _a : "";
    var redirectTo = (_b = searchParams.get("redirectTo")) !== null && _b !== void 0 ? _b : undefined;
    var fetcher = (0, react_router_1.useFetcher)();
    return (<>
      <div className="flex justify-center mb-8">
        <img src="/carbon-mark-light.svg" alt={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 dark:hidden"/>
        <img src="/carbon-mark-dark.svg" alt={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 hidden dark:block"/>
      </div>
      <div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 w-[380px]">
        <form_1.ValidatedForm fetcher={fetcher} validator={auth_1.phoneVerifyValidator} defaultValues={{ phone: phone, redirectTo: redirectTo }} method="post">
          <form_1.Hidden name="phone" value={phone}/>
          <form_1.Hidden name="redirectTo" value={redirectTo}/>
          <react_1.VStack spacing={4} className="items-center">
            <react_1.Heading size="h3">
              <macro_1.Trans>Verify your phone</macro_1.Trans>
            </react_1.Heading>
            <p className="text-muted-foreground tracking-tight text-sm text-center">
              <macro_1.Trans>We've sent a verification code to {phone}</macro_1.Trans>
            </p>

            {((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.message) && (<react_1.Alert variant="destructive">
                <lu_1.LuCircleAlert className="w-4 h-4"/>
                <react_1.AlertTitle>
                  <macro_1.Trans>Verification Error</macro_1.Trans>
                </react_1.AlertTitle>
                <react_1.AlertDescription>{fetcher.data.message}</react_1.AlertDescription>
              </react_1.Alert>)}

            <form_1.InputOTP name="code" label=""/>

            <react_1.Button type="button" variant="link" size="sm" asChild>
              <react_router_1.Link to="/login">
                <macro_1.Trans>Use a different phone number</macro_1.Trans>
              </react_router_1.Link>
            </react_1.Button>
          </react_1.VStack>
        </form_1.ValidatedForm>
      </div>
    </>);
}
var templateObject_1, templateObject_2;
