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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = WeChatCallbackRoute;
var auth_1 = require("@carbon/auth");
var identity_server_1 = require("@carbon/auth/identity.server");
var session_server_1 = require("@carbon/auth/session.server");
var wechat_server_1 = require("@carbon/auth/wechat.server");
var react_router_1 = require("react-router");
var wechat_session_server_1 = require("~/services/wechat-session.server");
var wechat_state_server_1 = require("~/services/wechat-state.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, code, state, _c, _d, stateSession, savedState, redirectTo, _e, _f, tokens, _g, _h, userInfo, _j, _k, authSession, _l, _m, result, clearStateCookie_1, flashResult, user, _o, _p, headers, _q, _r, clearStateCookie;
        var _s, _t;
        var request = _b.request;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    url = new URL(request.url);
                    code = url.searchParams.get("code");
                    state = url.searchParams.get("state");
                    console.log("[wechat callback] hit", {
                        code: code === null || code === void 0 ? void 0 : code.slice(0, 8),
                        state: state === null || state === void 0 ? void 0 : state.slice(0, 8)
                    });
                    if (!(!code || !state)) return [3 /*break*/, 2];
                    console.error("[wechat callback] missing code or state");
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Missing code or state from WeChat"))];
                case 1: return [2 /*return*/, _c.apply(void 0, _d.concat([_u.sent()]))];
                case 2: return [4 /*yield*/, wechat_state_server_1.wechatStateStorage.getSession(request.headers.get("Cookie"))];
                case 3:
                    stateSession = _u.sent();
                    savedState = stateSession.get("state");
                    redirectTo = (_s = stateSession.get("redirectTo")) !== null && _s !== void 0 ? _s : "";
                    console.log("[wechat callback] state check", {
                        savedState: savedState === null || savedState === void 0 ? void 0 : savedState.slice(0, 8),
                        match: savedState === state
                    });
                    if (!(!savedState || savedState !== state)) return [3 /*break*/, 5];
                    console.error("[wechat callback] state mismatch");
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid state parameter"))];
                case 4: return [2 /*return*/, _e.apply(void 0, _f.concat([_u.sent()]))];
                case 5: return [4 /*yield*/, (0, wechat_server_1.exchangeWeChatCode)(code)];
                case 6:
                    tokens = _u.sent();
                    console.log("[wechat callback] tokens", tokens ? "ok" : "FAILED");
                    if (!!tokens) return [3 /*break*/, 8];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to exchange WeChat code"))];
                case 7: return [2 /*return*/, _g.apply(void 0, _h.concat([_u.sent()]))];
                case 8: return [4 /*yield*/, (0, wechat_server_1.getWeChatUserInfo)(tokens.access_token, tokens.openid)];
                case 9:
                    userInfo = _u.sent();
                    console.log("[wechat callback] userInfo", userInfo
                        ? { unionid: (_t = userInfo.unionid) === null || _t === void 0 ? void 0 : _t.slice(0, 8), nickname: userInfo.nickname }
                        : "FAILED");
                    if (!!userInfo) return [3 /*break*/, 11];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to get WeChat user info"))];
                case 10: return [2 /*return*/, _j.apply(void 0, _k.concat([_u.sent()]))];
                case 11:
                    if (!(stateSession.get("link") === "1")) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 12:
                    authSession = _u.sent();
                    if (!!(authSession === null || authSession === void 0 ? void 0 : authSession.userId)) return [3 /*break*/, 14];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.login];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Please sign in before linking WeChat"))];
                case 13: return [2 /*return*/, _l.apply(void 0, _m.concat([_u.sent()]))];
                case 14: return [4 /*yield*/, (0, identity_server_1.linkIdentity)(authSession.userId, "wechat", userInfo.unionid)];
                case 15:
                    result = _u.sent();
                    return [4 /*yield*/, wechat_state_server_1.wechatStateStorage.destroySession(stateSession)];
                case 16:
                    clearStateCookie_1 = _u.sent();
                    return [4 /*yield*/, (0, session_server_1.flash)(request, result.success
                            ? (0, auth_1.success)("Linked WeChat")
                            : (0, auth_1.error)(null, result.reason === "conflict"
                                ? "That WeChat is already linked to another account"
                                : "Failed to link WeChat"))];
                case 17:
                    flashResult = _u.sent();
                    return [2 /*return*/, (0, react_router_1.redirect)((0, auth_1.safeRedirect)(redirectTo, path_1.path.to.profile), {
                            headers: [
                                ["Set-Cookie", flashResult.headers["Set-Cookie"]],
                                ["Set-Cookie", clearStateCookie_1]
                            ]
                        })];
                case 18: return [4 /*yield*/, (0, wechat_server_1.findOrCreateWeChatUser)(userInfo.unionid, userInfo.nickname, userInfo.headimgurl)];
                case 19:
                    user = _u.sent();
                    console.log("[wechat callback] user", user ? { id: user.id, email: user.email } : "FAILED");
                    if (!!user) return [3 /*break*/, 21];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to create user from WeChat"))];
                case 20: return [2 /*return*/, _o.apply(void 0, _p.concat([_u.sent()]))];
                case 21: return [4 /*yield*/, (0, wechat_session_server_1.createWeChatAuthSession)(request, { id: user.id })];
                case 22:
                    headers = _u.sent();
                    if (!!headers) return [3 /*break*/, 24];
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to create auth session"))];
                case 23: return [2 /*return*/, _q.apply(void 0, _r.concat([_u.sent()]))];
                case 24: return [4 /*yield*/, wechat_state_server_1.wechatStateStorage.destroySession(stateSession)];
                case 25:
                    clearStateCookie = _u.sent();
                    return [2 /*return*/, (0, react_router_1.redirect)((0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot), {
                            headers: __spreadArray(__spreadArray([], headers, true), [["Set-Cookie", clearStateCookie]], false)
                        })];
            }
        });
    });
}
function WeChatCallbackRoute() {
    return null;
}
