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
exports.action = action;
exports.default = AuthCallback;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var company_server_1 = require("@carbon/auth/company.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, code, pkceEntry, cookieCompanyId, authSession_1, redirectTo, sessionCookie, companyIdCookie, authSession;
        var _c;
        var request = _b.request;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    url = new URL(request.url);
                    code = url.searchParams.get("code");
                    if (!code) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, session_server_1.getPkceCookie)(request)];
                case 1:
                    pkceEntry = _d.sent();
                    if (!pkceEntry) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                error: "Please open this link in the same browser where you requested sign-in."
                            })];
                    }
                    cookieCompanyId = (0, company_server_1.getCompanyId)(request);
                    return [4 /*yield*/, (0, auth_server_1.exchangePkceCode)(code, pkceEntry, cookieCompanyId)];
                case 2:
                    authSession_1 = _d.sent();
                    if (!authSession_1) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                error: "Magic link expired or already used. Please request a new one."
                            })];
                    }
                    redirectTo = (_c = url.searchParams.get("redirectTo")) !== null && _c !== void 0 ? _c : undefined;
                    return [4 /*yield*/, (0, session_server_1.setAuthSession)(request, { authSession: authSession_1 })];
                case 3:
                    sessionCookie = _d.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(authSession_1.companyId);
                    return [2 /*return*/, (0, react_router_1.redirect)((0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot), {
                            headers: [
                                ["Set-Cookie", sessionCookie],
                                ["Set-Cookie", companyIdCookie]
                            ]
                        })];
                case 4: return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 5:
                    authSession = _d.sent();
                    if (!authSession) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, session_server_1.destroyAuthSession)(request)];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [2 /*return*/, (0, react_router_1.data)({ error: null })];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var validation, _c, _d, _e, accessToken, refreshToken, userId, redirectTo, serviceRole, _f, companies, _g, userData, userError, _h, _j, _k, _l, _m, _o, cookieCompanyId, match, authSession, sessionCookie, companyIdCookie;
        var _p, _q, _r, _s, _t;
        var request = _b.request;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    _d = (_c = (0, form_1.validator)(auth_1.callbackValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 1: return [4 /*yield*/, _d.apply(_c, [_u.sent()])];
                case 2:
                    validation = _u.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(validation.error, "Invalid callback form"), {
                                status: 400
                            })];
                    }
                    _e = validation.data, accessToken = _e.accessToken, refreshToken = _e.refreshToken, userId = _e.userId, redirectTo = _e.redirectTo;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, Promise.all([
                            serviceRole
                                .from("userToCompany")
                                .select("companyId, ...company(companyGroupId)")
                                .eq("userId", userId)
                                .limit(50),
                            serviceRole.auth.getUser(accessToken)
                        ])];
                case 3:
                    _f = _u.sent(), companies = _f[0], _g = _f[1], userData = _g.data, userError = _g.error;
                    if (!(!(userData === null || userData === void 0 ? void 0 : userData.user) || userError)) return [3 /*break*/, 5];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userError, "Invalid access token"))];
                case 4: return [2 /*return*/, _h.apply(void 0, _j.concat([_u.sent()]))];
                case 5:
                    if (!(userData.user.id !== userId)) return [3 /*break*/, 7];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Session mismatch"))];
                case 6: return [2 /*return*/, _k.apply(void 0, _l.concat([_u.sent()]))];
                case 7:
                    if (!companies.error) return [3 /*break*/, 9];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companies.error, "Failed to load company"))];
                case 8: return [2 /*return*/, _m.apply(void 0, _o.concat([_u.sent()]))];
                case 9:
                    cookieCompanyId = (0, company_server_1.getCompanyId)(request);
                    match = ((_q = (_p = companies.data) === null || _p === void 0 ? void 0 : _p.find(function (c) { return c.companyId === cookieCompanyId; })) !== null && _q !== void 0 ? _q : (_r = companies.data) === null || _r === void 0 ? void 0 : _r[0]);
                    authSession = (0, auth_server_1.makeAuthSessionFromTokens)(accessToken, refreshToken, userData.user, (_s = match === null || match === void 0 ? void 0 : match.companyId) !== null && _s !== void 0 ? _s : "", (_t = match === null || match === void 0 ? void 0 : match.companyGroupId) !== null && _t !== void 0 ? _t : "");
                    return [4 /*yield*/, (0, session_server_1.setAuthSession)(request, { authSession: authSession })];
                case 10:
                    sessionCookie = _u.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(authSession.companyId);
                    return [2 /*return*/, (0, react_router_1.redirect)((0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot), {
                            headers: [
                                ["Set-Cookie", sessionCookie],
                                ["Set-Cookie", companyIdCookie]
                            ]
                        })];
            }
        });
    });
}
function AuthCallback() {
    var _a;
    var loaderError = (0, react_router_1.useLoaderData)().error;
    var fetcher = (0, react_router_1.useFetcher)();
    var isAuthenticating = (0, react_2.useRef)(false);
    var _b = (0, react_2.useState)(loaderError !== null && loaderError !== void 0 ? loaderError : null), error = _b[0], setError = _b[1];
    var hash = (0, react_router_1.useLocation)().hash;
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var redirectTo = (_a = searchParams.get("redirectTo")) !== null && _a !== void 0 ? _a : undefined;
    (0, react_2.useEffect)(function () {
        var hashParams = new URLSearchParams(hash.slice(1));
        var errorDescription = hashParams.get("error_description");
        if (errorDescription) {
            setError(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
        }
    }, [hash]);
    (0, react_2.useEffect)(function () {
        var subscription = auth_1.carbonClient.auth.onAuthStateChange(function (event, session) {
            if (["SIGNED_IN", "INITIAL_SESSION"].includes(event) &&
                !isAuthenticating.current) {
                isAuthenticating.current = true;
                var accessToken = session === null || session === void 0 ? void 0 : session.access_token;
                var refreshToken = session === null || session === void 0 ? void 0 : session.refresh_token;
                var userId = session === null || session === void 0 ? void 0 : session.user.id;
                if (!accessToken || !refreshToken || !userId)
                    return;
                var formData = new FormData();
                formData.append("accessToken", accessToken);
                formData.append("refreshToken", refreshToken);
                formData.append("userId", userId);
                if (redirectTo)
                    formData.append("redirectTo", redirectTo);
                fetcher.submit(formData, { method: "post" });
            }
        }).data.subscription;
        return function () {
            subscription.unsubscribe();
        };
    }, [fetcher, redirectTo]);
    return (<div className="flex flex-col items-center justify-center">
      {error ? (<div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 mt-8 w-[380px]">
          <react_1.VStack spacing={4}>
            <react_1.Alert variant="destructive">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>Error</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>{error}</react_1.AlertDescription>
            </react_1.Alert>
            {error.includes("expired") && (<>
                <p className="text-sm text-muted-foreground">
                  <macro_1.Trans>
                    But don't worry. You can use the forgot password flow to
                    request a new magic link.
                  </macro_1.Trans>
                </p>
                <react_1.Button size="lg" asChild className="w-full">
                  <react_router_1.Link to={path_1.path.to.login}>
                    <macro_1.Trans>Login</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.Button>
              </>)}
          </react_1.VStack>
        </div>) : (<react_1.LoadingBars />)}
    </div>);
}
