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
exports.loader = loader;
var auth_1 = require("@carbon/auth");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
// Server-side proxy for GoTrue's /user/identities/authorize endpoint.
//
// carbonClient has persistSession: false, so client-side JS has no session
// and linkIdentity() sends the anon JWT (no sub claim) instead of the user
// token → GoTrue rejects with "invalid claim: missing sub claim".
//
// This loader reads the access token from the session cookie, calls GoTrue
// with skip_http_redirect=true (which makes GoTrue return the OAuth provider
// URL as JSON instead of doing a 302), then redirects the browser there.
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var authSession, url, provider, redirectTo, forwardedHost, forwardedProto, trustedOrigin, callbackOrigin, callbackOriginParam, candidate, callbackUrl, goTrueUrl, response, body, oauthUrl;
        var _c, _d;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 1:
                    authSession = _e.sent();
                    if (!authSession)
                        return [2 /*return*/, (0, react_router_1.redirect)(path_1.path.to.login)];
                    url = new URL(request.url);
                    provider = url.searchParams.get("provider");
                    redirectTo = (_c = url.searchParams.get("redirectTo")) !== null && _c !== void 0 ? _c : path_1.path.to.profile;
                    if (provider !== "google" && provider !== "azure") {
                        return [2 /*return*/, (0, react_router_1.redirect)(path_1.path.to.profile)];
                    }
                    forwardedHost = request.headers.get("x-forwarded-host");
                    forwardedProto = (_d = request.headers.get("x-forwarded-proto")) !== null && _d !== void 0 ? _d : "https";
                    trustedOrigin = forwardedHost
                        ? "".concat(forwardedProto, "://").concat(forwardedHost)
                        : new URL(request.url).origin;
                    callbackOrigin = trustedOrigin;
                    callbackOriginParam = url.searchParams.get("callbackOrigin");
                    if (callbackOriginParam) {
                        try {
                            candidate = new URL(callbackOriginParam);
                            if (!forwardedHost ||
                                candidate.host.toLowerCase() === forwardedHost.toLowerCase()) {
                                callbackOrigin = candidate.origin;
                            }
                            else {
                                console.warn("[link-provider] rejecting callbackOrigin host mismatch", candidate.host, forwardedHost);
                            }
                        }
                        catch (_f) {
                            // Malformed callbackOrigin — fall back to the trusted origin.
                        }
                    }
                    callbackUrl = "".concat(callbackOrigin, "/callback?redirectTo=").concat(encodeURIComponent(redirectTo));
                    goTrueUrl = new URL("".concat(auth_1.SUPABASE_URL, "/auth/v1/user/identities/authorize"));
                    goTrueUrl.searchParams.set("provider", provider);
                    goTrueUrl.searchParams.set("redirect_to", callbackUrl);
                    // skip_http_redirect=true makes GoTrue return JSON { url: "https://..." }
                    // instead of a 302 redirect — this is how auth-js calls this endpoint.
                    goTrueUrl.searchParams.set("skip_http_redirect", "true");
                    return [4 /*yield*/, fetch(goTrueUrl.toString(), {
                            headers: {
                                Authorization: "Bearer ".concat(authSession.accessToken),
                                apikey: auth_1.SUPABASE_ANON_KEY
                            }
                        })];
                case 2:
                    response = _e.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text().catch(function () { return "(unreadable)"; })];
                case 3:
                    body = _e.sent();
                    console.error("[link-provider] GoTrue error", response.status, body);
                    return [2 /*return*/, (0, react_router_1.redirect)("".concat(path_1.path.to.profile, "?error=").concat(encodeURIComponent("Failed to link account (".concat(response.status, ")"))))];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    oauthUrl = (_e.sent()).url;
                    if (!oauthUrl) {
                        return [2 /*return*/, (0, react_router_1.redirect)("".concat(path_1.path.to.profile, "?error=").concat(encodeURIComponent("Failed to initiate OAuth link")))];
                    }
                    return [2 /*return*/, (0, react_router_1.redirect)(oauthUrl)];
            }
        });
    });
}
