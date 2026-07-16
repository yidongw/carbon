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
var identity_server_1 = require("@carbon/auth/identity.server");
var wechat_server_1 = require("@carbon/auth/wechat.server");
var kv_1 = require("@carbon/kv");
var SCENE_PREFIX = "wechat-qr:";
/**
 * GET — WeChat 接口配置信息 verification handshake: echo back `echostr` when the
 * signature checks out so WeChat accepts this URL as the message/event receiver.
 */
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, ok;
        var _c, _d, _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            url = new URL(request.url);
            console.log("[wechat webhook] GET verify", url.search);
            ok = (0, wechat_server_1.verifyWeChatSignature)({
                signature: (_c = url.searchParams.get("signature")) !== null && _c !== void 0 ? _c : "",
                timestamp: (_d = url.searchParams.get("timestamp")) !== null && _d !== void 0 ? _d : "",
                nonce: (_e = url.searchParams.get("nonce")) !== null && _e !== void 0 ? _e : ""
            });
            if (ok) {
                return [2 /*return*/, new Response((_f = url.searchParams.get("echostr")) !== null && _f !== void 0 ? _f : "", {
                        headers: { "Content-Type": "text/plain" }
                    })];
            }
            return [2 /*return*/, new Response("invalid signature", { status: 401 })];
        });
    });
}
/**
 * POST — scan/subscribe event push. When a user scans a scene-tagged QR, mark the
 * matching scene as authenticated (resolving openid → user) so the browser's poll
 * can complete the login.
 */
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, ok, msg, _c, isScan, scene, openid, key, pending, _d, parsed, profile, unionid, result, user;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        var request = _b.request;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    url = new URL(request.url);
                    ok = (0, wechat_server_1.verifyWeChatSignature)({
                        signature: (_e = url.searchParams.get("signature")) !== null && _e !== void 0 ? _e : "",
                        timestamp: (_f = url.searchParams.get("timestamp")) !== null && _f !== void 0 ? _f : "",
                        nonce: (_g = url.searchParams.get("nonce")) !== null && _g !== void 0 ? _g : ""
                    });
                    if (!ok)
                        return [2 /*return*/, new Response("invalid signature", { status: 401 })];
                    _c = wechat_server_1.parseWeChatEventXml;
                    return [4 /*yield*/, request.text()];
                case 1:
                    msg = _c.apply(void 0, [_q.sent()]);
                    console.log("[wechat webhook] POST event", JSON.stringify(msg));
                    isScan = msg.MsgType === "event" &&
                        (msg.Event === "SCAN" || msg.Event === "subscribe");
                    if (!isScan) return [3 /*break*/, 11];
                    scene = ((_h = msg.EventKey) !== null && _h !== void 0 ? _h : "").replace(/^qrscene_/, "");
                    openid = (_j = msg.FromUserName) !== null && _j !== void 0 ? _j : "";
                    key = "".concat(SCENE_PREFIX).concat(scene);
                    if (!scene) return [3 /*break*/, 3];
                    return [4 /*yield*/, kv_1.redis.get(key)];
                case 2:
                    _d = _q.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _d = null;
                    _q.label = 4;
                case 4:
                    pending = _d;
                    if (!(pending && openid)) return [3 /*break*/, 11];
                    parsed = JSON.parse(pending);
                    return [4 /*yield*/, (0, wechat_server_1.getWeChatMpUserInfo)(openid)];
                case 5:
                    profile = _q.sent();
                    unionid = (_k = profile === null || profile === void 0 ? void 0 : profile.unionid) !== null && _k !== void 0 ? _k : openid;
                    if (!parsed.linkUserId) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, identity_server_1.linkIdentity)(parsed.linkUserId, "wechat", unionid)];
                case 6:
                    result = _q.sent();
                    return [4 /*yield*/, kv_1.redis.set(key, JSON.stringify(result.success
                            ? { status: "linked" }
                            : { status: "link_failed", reason: result.reason }), "EX", 120)];
                case 7:
                    _q.sent();
                    return [2 /*return*/, new Response((0, wechat_server_1.buildWeChatTextReply)(openid, (_l = msg.ToUserName) !== null && _l !== void 0 ? _l : "", result.success
                            ? "✅ 已绑定"
                            : "绑定失败：该微信可能已绑定到其他账号"), { headers: { "Content-Type": "text/xml; charset=utf-8" } })];
                case 8: return [4 /*yield*/, (0, wechat_server_1.findOrCreateWeChatUser)(unionid, (_m = profile === null || profile === void 0 ? void 0 : profile.nickname) !== null && _m !== void 0 ? _m : "", (_o = profile === null || profile === void 0 ? void 0 : profile.headimgurl) !== null && _o !== void 0 ? _o : "")];
                case 9:
                    user = _q.sent();
                    if (!user) return [3 /*break*/, 11];
                    return [4 /*yield*/, kv_1.redis.set(key, JSON.stringify({ status: "authed", userId: user.id }), "EX", 120)];
                case 10:
                    _q.sent();
                    // Passive reply: confirm the sign-in in the user's WeChat chat.
                    return [2 /*return*/, new Response((0, wechat_server_1.buildWeChatTextReply)(openid, (_p = msg.ToUserName) !== null && _p !== void 0 ? _p : "", "✅ 已登录"), { headers: { "Content-Type": "text/xml; charset=utf-8" } })];
                case 11: 
                // WeChat retries unless it receives "success" (or an empty body).
                return [2 /*return*/, new Response("success", { headers: { "Content-Type": "text/plain" } })];
            }
        });
    });
}
