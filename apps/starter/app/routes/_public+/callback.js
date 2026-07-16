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
var users_server_1 = require("@carbon/auth/users.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var authSession;
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 1:
                    authSession = _c.sent();
                    if (!authSession) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, session_server_1.destroyAuthSession)(request)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [2 /*return*/, {}];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var validation, _c, _d, _e, refreshToken, userId, serviceRole, companies, firstCompany, companyId, companyGroupId, authSession, _f, _g, user, sessionCookie, companyIdCookie, _h, _j;
        var _k, _l, _m;
        var request = _b.request;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    _d = (_c = (0, form_1.validator)(auth_1.callbackValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 1: return [4 /*yield*/, _d.apply(_c, [_o.sent()])];
                case 2:
                    validation = _o.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(validation.error, "Invalid callback form"), {
                                status: 400
                            })];
                    }
                    _e = validation.data, refreshToken = _e.refreshToken, userId = _e.userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("userToCompany")
                            .select("companyId, ...company(companyGroupId)")
                            .eq("userId", userId)];
                case 3:
                    companies = _o.sent();
                    firstCompany = (_k = companies.data) === null || _k === void 0 ? void 0 : _k[0];
                    companyId = firstCompany === null || firstCompany === void 0 ? void 0 : firstCompany.companyId;
                    companyGroupId = (_l = firstCompany === null || firstCompany === void 0 ? void 0 : firstCompany.companyGroupId) !== null && _l !== void 0 ? _l : "";
                    return [4 /*yield*/, (0, auth_server_1.refreshAccessToken)(refreshToken, companyId, companyGroupId)];
                case 4:
                    authSession = _o.sent();
                    if (!!authSession) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(authSession, "Invalid refresh token"))];
                case 5: return [2 /*return*/, _f.apply(void 0, _g.concat([_o.sent()]))];
                case 6: return [4 /*yield*/, (0, users_server_1.getUserByEmail)((_m = authSession.email) !== null && _m !== void 0 ? _m : "")];
                case 7:
                    user = _o.sent();
                    if (!(user === null || user === void 0 ? void 0 : user.data)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, session_server_1.setAuthSession)(request, {
                            authSession: authSession
                        })];
                case 8:
                    sessionCookie = _o.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(authSession.companyId);
                    return [2 /*return*/, (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot, {
                            headers: [
                                ["Set-Cookie", sessionCookie],
                                ["Set-Cookie", companyIdCookie]
                            ]
                        })];
                case 9:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(user.error, "User not found"))];
                case 10: return [2 /*return*/, _h.apply(void 0, _j.concat([_o.sent()]))];
            }
        });
    });
}
function AuthCallback() {
    var fetcher = (0, react_router_1.useFetcher)();
    var isAuthenticating = (0, react_2.useRef)(false);
    var _a = (0, react_2.useState)(null), error = _a[0], setError = _a[1];
    var hash = (0, react_router_1.useLocation)().hash;
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
                var refreshToken = session === null || session === void 0 ? void 0 : session.refresh_token;
                var userId = session === null || session === void 0 ? void 0 : session.user.id;
                if (!refreshToken || !userId)
                    return;
                var formData = new FormData();
                formData.append("refreshToken", refreshToken);
                formData.append("userId", userId);
                fetcher.submit(formData, { method: "post" });
            }
        }).data.subscription;
        return function () {
            subscription.unsubscribe();
        };
    }, [fetcher]);
    return (<div className="flex flex-col items-center justify-center">
      <div className="flex justify-center mb-8">
        <img src="/carbon-mark-light.svg" alt="Carbon Logo" className="w-24 dark:hidden"/>
        <img src="/carbon-mark-dark.svg" alt="Carbon Logo" className="w-24 hidden dark:block"/>
        <img src="/carbon-mark-dark.svg" alt="Carbon Logo" className="w-24 hidden dark:block"/>
      </div>
      {error ? (<div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 mt-8 w-[380px]">
          <react_1.VStack spacing={4}>
            <react_1.Alert variant="destructive">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>Error</react_1.AlertTitle>
              <react_1.AlertDescription>{error}</react_1.AlertDescription>
            </react_1.Alert>
            {error.includes("expired") && (<>
                <p className="text-sm text-muted-foreground">
                  But don't worry. You can use the forgot password flow to
                  request a new magic link.
                </p>
                <react_1.Button size="lg" asChild className="w-full">
                  <react_router_1.Link to={path_1.path.to.login}>Login</react_router_1.Link>
                </react_1.Button>
              </>)}
          </react_1.VStack>
        </div>) : (<react_1.LoadingBars />)}
    </div>);
}
