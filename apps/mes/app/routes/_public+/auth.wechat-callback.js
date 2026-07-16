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
exports.default = WeChatCallbackRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var company_server_1 = require("@carbon/auth/company.server");
var session_server_1 = require("@carbon/auth/session.server");
var wechat_server_1 = require("@carbon/auth/wechat.server");
var react_router_1 = require("react-router");
var wechat_state_server_1 = require("~/services/wechat-state.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, code, state, _c, _d, stateSession, savedState, redirectTo, _e, _f, tokens, _g, _h, userInfo, _j, _k, user, _l, _m, serviceRole, companies, firstCompany, linkData, _o, _p, sessionData, _q, _r, authSession, _s, _t, sessionCookie, companyIdCookie, clearStateCookie;
        var _u, _v, _w, _x, _y, _z;
        var request = _b.request;
        return __generator(this, function (_0) {
            switch (_0.label) {
                case 0:
                    url = new URL(request.url);
                    code = url.searchParams.get("code");
                    state = url.searchParams.get("state");
                    if (!(!code || !state)) return [3 /*break*/, 2];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Missing code or state from WeChat"))];
                case 1: return [2 /*return*/, _c.apply(void 0, _d.concat([_0.sent()]))];
                case 2: return [4 /*yield*/, wechat_state_server_1.wechatStateStorage.getSession(request.headers.get("Cookie"))];
                case 3:
                    stateSession = _0.sent();
                    savedState = stateSession.get("state");
                    redirectTo = (_u = stateSession.get("redirectTo")) !== null && _u !== void 0 ? _u : "";
                    if (!(!savedState || savedState !== state)) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid state parameter"))];
                case 4: return [2 /*return*/, _e.apply(void 0, _f.concat([_0.sent()]))];
                case 5: return [4 /*yield*/, (0, wechat_server_1.exchangeWeChatCode)(code)];
                case 6:
                    tokens = _0.sent();
                    if (!!tokens) return [3 /*break*/, 8];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to exchange WeChat code"))];
                case 7: return [2 /*return*/, _g.apply(void 0, _h.concat([_0.sent()]))];
                case 8: return [4 /*yield*/, (0, wechat_server_1.getWeChatUserInfo)(tokens.access_token, tokens.openid)];
                case 9:
                    userInfo = _0.sent();
                    if (!!userInfo) return [3 /*break*/, 11];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to get WeChat user info"))];
                case 10: return [2 /*return*/, _j.apply(void 0, _k.concat([_0.sent()]))];
                case 11: return [4 /*yield*/, (0, wechat_server_1.findOrCreateWeChatUser)(userInfo.unionid, userInfo.nickname, userInfo.headimgurl)];
                case 12:
                    user = _0.sent();
                    if (!!user) return [3 /*break*/, 14];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to create user from WeChat"))];
                case 13: return [2 /*return*/, _l.apply(void 0, _m.concat([_0.sent()]))];
                case 14:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("userToCompany")
                            .select("companyId, ...company(companyGroupId)")
                            .eq("userId", user.id)];
                case 15:
                    companies = _0.sent();
                    firstCompany = (_v = companies.data) === null || _v === void 0 ? void 0 : _v[0];
                    return [4 /*yield*/, serviceRole.auth.admin.generateLink({
                            type: "magiclink",
                            email: (_w = user.email) !== null && _w !== void 0 ? _w : "wechat+".concat(userInfo.unionid, "@carbon.internal")
                        })];
                case 16:
                    linkData = (_0.sent()).data;
                    if (!!((_x = linkData === null || linkData === void 0 ? void 0 : linkData.properties) === null || _x === void 0 ? void 0 : _x.hashed_token)) return [3 /*break*/, 18];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to create WeChat session"))];
                case 17: return [2 /*return*/, _o.apply(void 0, _p.concat([_0.sent()]))];
                case 18: return [4 /*yield*/, serviceRole.auth.verifyOtp({
                        token_hash: linkData.properties.hashed_token,
                        type: "magiclink"
                    })];
                case 19:
                    sessionData = (_0.sent()).data;
                    if (!!(sessionData === null || sessionData === void 0 ? void 0 : sessionData.session)) return [3 /*break*/, 21];
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to verify WeChat session"))];
                case 20: return [2 /*return*/, _q.apply(void 0, _r.concat([_0.sent()]))];
                case 21: return [4 /*yield*/, (0, auth_server_1.refreshAccessToken)(sessionData.session.refresh_token, (_y = firstCompany === null || firstCompany === void 0 ? void 0 : firstCompany.companyId) !== null && _y !== void 0 ? _y : "", (_z = firstCompany === null || firstCompany === void 0 ? void 0 : firstCompany.companyGroupId) !== null && _z !== void 0 ? _z : "")];
                case 22:
                    authSession = _0.sent();
                    if (!!authSession) return [3 /*break*/, 24];
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to create auth session"))];
                case 23: return [2 /*return*/, _s.apply(void 0, _t.concat([_0.sent()]))];
                case 24: return [4 /*yield*/, (0, session_server_1.setAuthSession)(request, { authSession: authSession })];
                case 25:
                    sessionCookie = _0.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(authSession.companyId);
                    return [4 /*yield*/, wechat_state_server_1.wechatStateStorage.destroySession(stateSession)];
                case 26:
                    clearStateCookie = _0.sent();
                    return [2 /*return*/, (0, react_router_1.redirect)((0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot), {
                            headers: [
                                ["Set-Cookie", sessionCookie],
                                ["Set-Cookie", companyIdCookie],
                                ["Set-Cookie", clearStateCookie]
                            ]
                        })];
            }
        });
    });
}
function WeChatCallbackRoute() {
    return null;
}
