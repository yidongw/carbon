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
exports.loader = loader;
exports.default = ConfirmMagicLink;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
function resolveCallbackUrl(requestUrl, redirectTo, encodedCallback) {
    if (encodedCallback) {
        try {
            return decodeURIComponent(encodedCallback);
        }
        catch (_a) {
            return null;
        }
    }
    if (redirectTo === null || redirectTo === void 0 ? void 0 : redirectTo.includes("/callback")) {
        return redirectTo;
    }
    if (redirectTo === null || redirectTo === void 0 ? void 0 : redirectTo.startsWith("/")) {
        return "".concat(requestUrl.origin, "/callback?redirectTo=").concat(encodeURIComponent(redirectTo));
    }
    return null;
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, token, callbackUrl, targetHost, targetOrigin;
        var request = _b.request;
        return __generator(this, function (_c) {
            url = new URL(request.url);
            token = url.searchParams.get("token");
            if (!token) {
                throw (0, react_router_1.redirect)("/");
            }
            callbackUrl = resolveCallbackUrl(url, url.searchParams.get("redirectTo"), url.searchParams.get("callback"));
            if (callbackUrl) {
                try {
                    targetHost = new URL(callbackUrl).host;
                    if (url.host !== targetHost) {
                        targetOrigin = new URL(callbackUrl).origin;
                        throw (0, react_router_1.redirect)("".concat(targetOrigin, "/magic-link?").concat(url.searchParams.toString()));
                    }
                }
                catch (error) {
                    if (error instanceof Response)
                        throw error;
                }
            }
            return [2 /*return*/, null];
        });
    });
}
function ConfirmMagicLink() {
    var t = (0, macro_1.useLingui)().t;
    var params = (0, react_router_1.useSearchParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var token = params.get("token");
    // {{ .RedirectTo }} from the email template is the full callback URL built by
    // sendMagicLink (e.g. https://app/callback?redirectTo=%2Fjoin%2Fcode%2Fapply).
    var redirectTo = params.get("redirectTo");
    var encodedCallback = params.get("callback");
    if (!token) {
        navigate("/");
        return null;
    }
    var getCallbackUrl = function () {
        var _a;
        return ((_a = resolveCallbackUrl(new URL(window.location.href), redirectTo, encodedCallback)) !== null && _a !== void 0 ? _a : "".concat(window.location.origin, "/callback"));
    };
    var getConfirmationURL = function (token) {
        var callbackUrl = getCallbackUrl();
        return "".concat(auth_1.SUPABASE_URL, "/auth/v1/verify?token=").concat(token, "&type=magiclink&redirect_to=").concat(encodeURIComponent(callbackUrl));
    };
    return (<>
      <div className="flex justify-center mb-8">
        <img src={auth_1.CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-mark-light.svg"} className="w-24 dark:hidden" alt={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))}/>
        <img src={auth_1.CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-mark-dark.svg"} className="w-24 hidden dark:block" alt={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))}/>
      </div>
      <div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 w-[380px]">
        <react_1.VStack spacing={4} className="items-center justify-center">
          <react_1.Heading size="h3">
            <macro_1.Trans>Let's build something</macro_1.Trans> 🚀
          </react_1.Heading>
          <react_1.Button size="lg" onClick={function () {
            window.location.href = getConfirmationURL(token);
        }}>
            <macro_1.Trans>Log In</macro_1.Trans>
          </react_1.Button>
        </react_1.VStack>
      </div>
    </>);
}
var templateObject_1, templateObject_2;
