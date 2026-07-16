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
exports.cookieDomainMigrationMiddleware = exports.isTestEdition = void 0;
exports.setAuthSession = setAuthSession;
exports.clearAuthCookies = clearAuthCookies;
exports.destroyAuthSession = destroyAuthSession;
exports.flash = flash;
exports.getAuthSession = getAuthSession;
exports.getOrRefreshAuthSession = getOrRefreshAuthSession;
exports.getSessionFlash = getSessionFlash;
exports.requireAuthSession = requireAuthSession;
exports.refreshAuthSession = refreshAuthSession;
exports.updateSessionConsole = updateSessionConsole;
exports.updateCompanySession = updateCompanySession;
exports.setPkceCookie = setPkceCookie;
exports.destroyPkceCookie = destroyPkceCookie;
exports.getPkceCookie = getPkceCookie;
var kv_1 = require("@carbon/kv");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var env_1 = require("../config/env");
var bypass_email_1 = require("../utils/bypass-email");
var cookie_1 = require("../utils/cookie");
var http_1 = require("../utils/http");
var path_1 = require("../utils/path");
var auth_server_1 = require("./auth.server");
var company_server_1 = require("./company.server");
var users_1 = require("./users");
function assertAuthSession(request_1) {
    return __awaiter(this, arguments, void 0, function (request, _a) {
        var authSession;
        var _b = _a === void 0 ? {} : _a, onFailRedirectTo = _b.onFailRedirectTo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getAuthSession(request)];
                case 1:
                    authSession = _c.sent();
                    if (!(authSession === null || authSession === void 0 ? void 0 : authSession.accessToken) || !(authSession === null || authSession === void 0 ? void 0 : authSession.refreshToken)) {
                        throw (0, react_router_1.redirect)("".concat(onFailRedirectTo || path_1.path.to.login, "?").concat((0, http_1.makeRedirectToFromHere)(request)));
                    }
                    return [2 /*return*/, authSession];
            }
        });
    });
}
exports.isTestEdition = env_1.CarbonEdition === utils_1.Edition.Test;
var cookieDomain = exports.isTestEdition ? undefined : (0, cookie_1.getCookieDomain)(env_1.DOMAIN);
var sessionStorage = (0, react_router_1.createCookieSessionStorage)({
    cookie: {
        name: "carbon",
        httpOnly: true,
        path: "/",
        sameSite: exports.isTestEdition ? "none" : "lax",
        secrets: [env_1.SESSION_SECRET],
        secure: !!cookieDomain,
        domain: cookieDomain
    }
});
function setAuthSession(request_1) {
    return __awaiter(this, arguments, void 0, function (request, _a) {
        var session;
        var _b = _a === void 0 ? {} : _a, authSession = _b.authSession;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getSession(request)];
                case 1:
                    session = _c.sent();
                    if (authSession !== undefined) {
                        session.set(env_1.SESSION_KEY, authSession);
                    }
                    return [2 /*return*/, sessionStorage.commitSession(session, {
                            maxAge: (0, bypass_email_1.isBypassSession)(authSession !== null && authSession !== void 0 ? authSession : {})
                                ? env_1.BYPASS_SESSION_MAX_AGE
                                : env_1.SESSION_MAX_AGE
                        })];
            }
        });
    });
}
function clearAuthCookies(request) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionCookie, companyIdCookie;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSession(request)];
                case 1:
                    session = _a.sent();
                    return [4 /*yield*/, sessionStorage.destroySession(session)];
                case 2:
                    sessionCookie = _a.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(null);
                    return [2 /*return*/, [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie]
                        ]];
            }
        });
    });
}
function destroyAuthSession(request) {
    return __awaiter(this, void 0, void 0, function () {
        var headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, clearAuthCookies(request)];
                case 1:
                    headers = _a.sent();
                    return [2 /*return*/, (0, react_router_1.redirect)(path_1.path.to.login, {
                            headers: headers
                        })];
            }
        });
    });
}
/**
 * Keep the session cookie single-valued across a DOMAIN change.
 *
 * When DOMAIN changes, new sessions get a cookie scoped to the new cookieDomain
 * while browsers may still hold the cookie under an earlier scope — host-only
 * (DOMAIN was unset) or a narrower subdomain (a prior, more specific DOMAIN).
 * All variants are sent together and the browser orders the older ones first, so
 * the server reads a stale value and the user bounces to /login — repeatedly,
 * which surfaces as ERR_TOO_MANY_REDIRECTS.
 *
 * Fix: whenever the browser sends more than one session cookie (stale variants
 * present) OR a response sets/clears the domain-scoped cookie (login/logout),
 * expire every variant that is NOT the current cookieDomain scope — the
 * host-only cookie and each subdomain level between the request host and
 * cookieDomain. Only the cookieDomain-scoped cookie survives, so the browser
 * stops shadowing it. Self-limiting (once deduped there's a single cookie) and a
 * no-op when DOMAIN is unset or there's nothing to reconcile.
 */
var cookieDomainMigrationMiddleware = function (_a, next_1) { return __awaiter(void 0, [_a, next_1], void 0, function (_b, next) {
    var response, rawCookie, hasStaleVariants, setCookies, touchesSessionCookie, host;
    var _c, _d, _e, _f, _g;
    var request = _b.request;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, next()];
            case 1:
                response = _h.sent();
                if (!cookieDomain)
                    return [2 /*return*/, response];
                rawCookie = (_c = request.headers.get("Cookie")) !== null && _c !== void 0 ? _c : "";
                hasStaleVariants = ((_e = (_d = rawCookie.match(/(?:^|;\s*)carbon=/g)) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) > 1;
                setCookies = typeof response.headers.getSetCookie === "function"
                    ? response.headers.getSetCookie()
                    : [];
                touchesSessionCookie = setCookies.some(function (c) { return c.startsWith("carbon=") && /;\s*Domain=/i.test(c); });
                if (!hasStaleVariants && !touchesSessionCookie)
                    return [2 /*return*/, response];
                // Expire the host-only variant (no Domain attribute) ...
                response.headers.append("Set-Cookie", "carbon=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
                host = ((_g = ((_f = request.headers.get("host")) !== null && _f !== void 0 ? _f : "").split(":")[0]) !== null && _g !== void 0 ? _g : "").toLowerCase();
                while (host && host !== cookieDomain && host.includes(".")) {
                    response.headers.append("Set-Cookie", "carbon=; Domain=".concat(host, "; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"));
                    host = host.slice(host.indexOf(".") + 1);
                }
                return [2 /*return*/, response];
        }
    });
}); };
exports.cookieDomainMigrationMiddleware = cookieDomainMigrationMiddleware;
function flash(request, result) {
    return __awaiter(this, void 0, void 0, function () {
        var session, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, getSession(request)];
                case 1:
                    session = _d.sent();
                    if (typeof result.success === "boolean") {
                        session.flash("success", result.success);
                        session.flash("message", result.message);
                        if (result.flash) {
                            session.flash("flash", result.flash);
                        }
                    }
                    _b = {};
                    _c = {};
                    _a = "Set-Cookie";
                    return [4 /*yield*/, sessionStorage.commitSession(session)];
                case 2: return [2 /*return*/, (_b.headers = (_c[_a] = _d.sent(), _c),
                        _b)];
            }
        });
    });
}
function getAuthSession(request) {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSession(request)];
                case 1:
                    session = _a.sent();
                    return [2 /*return*/, session.get(env_1.SESSION_KEY)];
            }
        });
    });
}
function getOrRefreshAuthSession(request) {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAuthSession(request)];
                case 1:
                    session = _a.sent();
                    if (!session)
                        return [2 /*return*/, null];
                    if (isExpiringSoon(session.expiresAt)) {
                        return [2 /*return*/, refreshAuthSession(request)];
                    }
                    return [2 /*return*/, session];
            }
        });
    });
}
function getSessionFlash(request) {
    return __awaiter(this, void 0, void 0, function () {
        var session, result, headers, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getSession(request)];
                case 1:
                    session = _c.sent();
                    result = {
                        success: session.get("success") === true,
                        message: session.get("message"),
                        flash: session.get("flash")
                    };
                    if (!result.message)
                        return [2 /*return*/, null];
                    _b = {};
                    _a = "Set-Cookie";
                    return [4 /*yield*/, sessionStorage.commitSession(session)];
                case 2:
                    headers = (_b[_a] = _c.sent(), _b);
                    return [2 /*return*/, { result: result, headers: headers }];
            }
        });
    });
}
function getSession(request) {
    return __awaiter(this, void 0, void 0, function () {
        var cookie;
        return __generator(this, function (_a) {
            cookie = request.headers.get("Cookie");
            return [2 /*return*/, sessionStorage.getSession(cookie)];
        });
    });
}
function isExpiringSoon(expiresAt) {
    return (expiresAt - env_1.REFRESH_ACCESS_TOKEN_THRESHOLD) * 1000 < Date.now();
}
function requireAuthSession(request_1) {
    return __awaiter(this, arguments, void 0, function (request, _a) {
        var authSession, isValidSession, _b;
        var _c = _a === void 0 ? { verify: false } : _a, onFailRedirectTo = _c.onFailRedirectTo, verify = _c.verify;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, assertAuthSession(request, {
                        onFailRedirectTo: onFailRedirectTo
                    })];
                case 1:
                    authSession = _d.sent();
                    if (!verify) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, auth_server_1.verifyAuthSession)(authSession)];
                case 2:
                    _b = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _b = true;
                    _d.label = 4;
                case 4:
                    isValidSession = _b;
                    if (!isValidSession || isExpiringSoon(authSession.expiresAt)) {
                        return [2 /*return*/, refreshAuthSession(request)];
                    }
                    return [2 /*return*/, authSession];
            }
        });
    });
}
function refreshAuthSession(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authSession, refreshedAuthSession, signInWithBypassEmail, redirectUrl, sessionCookie, companyIdCookie, sessionCookie, companyIdCookie;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAuthSession(request)];
                case 1:
                    authSession = _a.sent();
                    return [4 /*yield*/, (0, auth_server_1.refreshAccessToken)(authSession === null || authSession === void 0 ? void 0 : authSession.refreshToken, authSession === null || authSession === void 0 ? void 0 : authSession.companyId, authSession === null || authSession === void 0 ? void 0 : authSession.companyGroupId)];
                case 2:
                    refreshedAuthSession = _a.sent();
                    if (!(!refreshedAuthSession &&
                        authSession &&
                        (0, bypass_email_1.isBypassSession)(authSession) &&
                        authSession.email)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./auth.server"); })];
                case 3:
                    signInWithBypassEmail = (_a.sent()).signInWithBypassEmail;
                    return [4 /*yield*/, signInWithBypassEmail(authSession.email)];
                case 4:
                    refreshedAuthSession = _a.sent();
                    _a.label = 5;
                case 5:
                    // Preserve console mode and bypass flag across token refresh
                    if (refreshedAuthSession && authSession) {
                        if (authSession.console) {
                            refreshedAuthSession.console = authSession.console;
                        }
                        if (authSession.bypass || (0, bypass_email_1.isBypassSession)(authSession)) {
                            refreshedAuthSession.bypass = true;
                        }
                    }
                    if (!!refreshedAuthSession) return [3 /*break*/, 7];
                    redirectUrl = "".concat(path_1.path.to.login, "?").concat((0, http_1.makeRedirectToFromHere)(request));
                    return [4 /*yield*/, setAuthSession(request, {
                            authSession: null
                        })];
                case 6:
                    sessionCookie = _a.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(null);
                    throw (0, react_router_1.redirect)(redirectUrl, {
                        headers: [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie]
                        ]
                    });
                case 7:
                    if (!(0, http_1.isGet)(request)) return [3 /*break*/, 9];
                    return [4 /*yield*/, setAuthSession(request, {
                            authSession: refreshedAuthSession
                        })];
                case 8:
                    sessionCookie = _a.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(refreshedAuthSession.companyId);
                    throw (0, react_router_1.redirect)((0, http_1.getCurrentPath)(request), {
                        headers: [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie]
                        ]
                    });
                case 9: return [2 /*return*/, refreshedAuthSession];
            }
        });
    });
}
function updateSessionConsole(request, consoleCompanyId) {
    return __awaiter(this, void 0, void 0, function () {
        var session, authSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSession(request)];
                case 1:
                    session = _a.sent();
                    return [4 /*yield*/, getAuthSession(request)];
                case 2:
                    authSession = _a.sent();
                    if (authSession) {
                        session.set(env_1.SESSION_KEY, __assign(__assign({}, authSession), { console: consoleCompanyId }));
                    }
                    return [2 /*return*/, sessionStorage.commitSession(session, {
                            maxAge: (0, bypass_email_1.isBypassSession)(authSession !== null && authSession !== void 0 ? authSession : {})
                                ? env_1.BYPASS_SESSION_MAX_AGE
                                : env_1.SESSION_MAX_AGE
                        })];
            }
        });
    });
}
function updateCompanySession(request, companyId, companyGroupId) {
    return __awaiter(this, void 0, void 0, function () {
        var session, authSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSession(request)];
                case 1:
                    session = _a.sent();
                    return [4 /*yield*/, getAuthSession(request)];
                case 2:
                    authSession = _a.sent();
                    if (!(authSession !== undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, kv_1.redis.del((0, users_1.getPermissionCacheKey)(authSession === null || authSession === void 0 ? void 0 : authSession.userId))];
                case 3:
                    _a.sent();
                    session.set(env_1.SESSION_KEY, __assign(__assign({}, authSession), { companyId: companyId, companyGroupId: companyGroupId }));
                    _a.label = 4;
                case 4: return [2 /*return*/, sessionStorage.commitSession(session, {
                        maxAge: (0, bypass_email_1.isBypassSession)(authSession !== null && authSession !== void 0 ? authSession : {})
                            ? env_1.BYPASS_SESSION_MAX_AGE
                            : env_1.SESSION_MAX_AGE
                    })];
            }
        });
    });
}
// Short-lived cookie that carries the PKCE code verifier from the login action
// to the /callback loader. Only sent on requests to /callback.
var pkceVerifierCookie = (0, react_router_1.createCookie)("sb-pkce-cv", {
    path: "/callback",
    maxAge: 15 * 60, // 15 minutes — long enough to receive and click the email
    httpOnly: true,
    sameSite: "lax",
    secure: env_1.VERCEL_ENV === "production"
});
function setPkceCookie(pkceEntry) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, pkceVerifierCookie.serialize(JSON.stringify(pkceEntry))];
        });
    });
}
function destroyPkceCookie() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, pkceVerifierCookie.serialize("", { maxAge: 0 })];
        });
    });
}
function getPkceCookie(request) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pkceVerifierCookie.parse(request.headers.get("cookie"))];
                case 1:
                    raw = _a.sent();
                    if (typeof raw !== "string" || !raw)
                        return [2 /*return*/, null];
                    try {
                        parsed = JSON.parse(raw);
                        if (typeof (parsed === null || parsed === void 0 ? void 0 : parsed.k) === "string" && typeof (parsed === null || parsed === void 0 ? void 0 : parsed.v) === "string") {
                            return [2 /*return*/, {
                                    k: parsed.k,
                                    v: parsed.v,
                                    redirectTo: typeof parsed.redirectTo === "string" ? parsed.redirectTo : undefined
                                }];
                        }
                    }
                    catch (_b) { }
                    return [2 /*return*/, null];
            }
        });
    });
}
