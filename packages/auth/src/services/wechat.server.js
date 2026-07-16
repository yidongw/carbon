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
exports.buildWeChatMpAuthUrl = buildWeChatMpAuthUrl;
exports.exchangeWeChatCode = exchangeWeChatCode;
exports.getWeChatUserInfo = getWeChatUserInfo;
exports.splitWeChatNickname = splitWeChatNickname;
exports.findOrCreateWeChatUser = findOrCreateWeChatUser;
exports.getWeChatAccessToken = getWeChatAccessToken;
exports.createWeChatQrTicket = createWeChatQrTicket;
exports.getWeChatMpUserInfo = getWeChatMpUserInfo;
exports.verifyWeChatSignature = verifyWeChatSignature;
exports.buildWeChatTextReply = buildWeChatTextReply;
exports.parseWeChatEventXml = parseWeChatEventXml;
var node_crypto_1 = require("node:crypto");
var env_1 = require("@carbon/env");
var kv_1 = require("@carbon/kv");
var client_server_1 = require("../lib/supabase/client.server");
var identity_server_1 = require("./identity.server");
// OAuth callback for the in-app flow. The host varies per environment (and per
// tunnel restart), so the caller passes the current request origin and we build
// the full redirect_uri here — no WECHAT_REDIRECT_URL env var to keep in sync.
// (The resulting domain must still be registered under the account's 网页授权域名.)
var WECHAT_CALLBACK_PATH = "/auth/wechat-callback";
function buildWeChatMpAuthUrl(state, origin) {
    var params = new URLSearchParams({
        appid: env_1.WECHAT_MP_APP_ID !== null && env_1.WECHAT_MP_APP_ID !== void 0 ? env_1.WECHAT_MP_APP_ID : "",
        redirect_uri: "".concat(origin).concat(WECHAT_CALLBACK_PATH),
        response_type: "code",
        scope: "snsapi_userinfo",
        state: state
    });
    return "https://open.weixin.qq.com/connect/oauth2/authorize?".concat(params.toString(), "#wechat_redirect");
}
function exchangeWeChatCode(code) {
    return __awaiter(this, void 0, void 0, function () {
        var url, resp, data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".concat(env_1.WECHAT_MP_APP_ID, "&secret=").concat(env_1.WECHAT_MP_APP_SECRET, "&code=").concat(code, "&grant_type=authorization_code");
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    resp = _b.sent();
                    return [4 /*yield*/, resp.json()];
                case 2:
                    data = (_b.sent());
                    if (data.errcode || !data.access_token || !data.openid)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            access_token: data.access_token,
                            openid: data.openid,
                            unionid: (_a = data.unionid) !== null && _a !== void 0 ? _a : data.openid
                        }];
            }
        });
    });
}
function getWeChatUserInfo(accessToken, openid) {
    return __awaiter(this, void 0, void 0, function () {
        var url, resp, data;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    url = "https://api.weixin.qq.com/sns/userinfo?access_token=".concat(accessToken, "&openid=").concat(openid, "&lang=zh_CN");
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    resp = _e.sent();
                    return [4 /*yield*/, resp.json()];
                case 2:
                    data = (_e.sent());
                    console.log("[wechat userinfo] response", JSON.stringify(data));
                    if (data.errcode)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            unionid: (_b = (_a = data.unionid) !== null && _a !== void 0 ? _a : data.openid) !== null && _b !== void 0 ? _b : "",
                            nickname: (_c = data.nickname) !== null && _c !== void 0 ? _c : "",
                            headimgurl: (_d = data.headimgurl) !== null && _d !== void 0 ? _d : ""
                        }];
            }
        });
    });
}
function splitWeChatNickname(nickname) {
    var _a;
    var trimmed = nickname.trim();
    if (!trimmed) {
        return { firstName: "", lastName: "" };
    }
    var parts = trimmed.split(/\s+/);
    return {
        firstName: (_a = parts[0]) !== null && _a !== void 0 ? _a : trimmed,
        lastName: parts.slice(1).join(" ")
    };
}
function findOrCreateWeChatUser(unionid, nickname, avatarUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, existingId, existingUser, _a, firstName_1, lastName_1, updates, refreshed, syntheticEmail, _b, authUser, authError, _c, firstName, lastName, updatedUser, link;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)("wechat", unionid)];
                case 1:
                    existingId = _f.sent();
                    if (!existingId) return [3 /*break*/, 4];
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("*")
                            .eq("id", existingId)
                            .maybeSingle()];
                case 2:
                    existingUser = (_f.sent()).data;
                    if (!existingUser)
                        return [2 /*return*/, null];
                    _a = splitWeChatNickname(nickname), firstName_1 = _a.firstName, lastName_1 = _a.lastName;
                    updates = {};
                    if (avatarUrl && avatarUrl !== existingUser.avatarUrl) {
                        updates.avatarUrl = avatarUrl;
                    }
                    if (firstName_1 && !((_d = existingUser.firstName) === null || _d === void 0 ? void 0 : _d.trim())) {
                        updates.firstName = firstName_1;
                        updates.lastName = lastName_1;
                    }
                    if (Object.keys(updates).length === 0) {
                        return [2 /*return*/, existingUser];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .update(updates)
                            .eq("id", existingUser.id)
                            .select("*")
                            .single()];
                case 3:
                    refreshed = (_f.sent()).data;
                    return [2 /*return*/, refreshed !== null && refreshed !== void 0 ? refreshed : existingUser];
                case 4:
                    syntheticEmail = "wechat+".concat(unionid.toLowerCase(), "@carbon.internal");
                    return [4 /*yield*/, serviceRole.auth.admin.createUser({
                            email: syntheticEmail,
                            email_confirm: true,
                            user_metadata: {
                                wechat_unionid: unionid,
                                name: nickname,
                                avatar_url: avatarUrl
                            }
                        })];
                case 5:
                    _b = _f.sent(), authUser = _b.data, authError = _b.error;
                    console.log("[wechat findOrCreate] createUser", authError ? "ERROR: ".concat(JSON.stringify(authError)) : (_e = authUser.user) === null || _e === void 0 ? void 0 : _e.id);
                    if (authError || !authUser.user)
                        return [2 /*return*/, null];
                    _c = splitWeChatNickname(nickname), firstName = _c.firstName, lastName = _c.lastName;
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .update({
                            email: null,
                            wechat_unionid: unionid,
                            firstName: firstName,
                            lastName: lastName,
                            avatarUrl: avatarUrl || null
                        })
                            .eq("id", authUser.user.id)
                            .select("*")
                            .single()];
                case 6:
                    updatedUser = (_f.sent()).data;
                    return [4 /*yield*/, (0, identity_server_1.linkIdentity)(authUser.user.id, "wechat", unionid)];
                case 7:
                    link = _f.sent();
                    if (!link.success) {
                        console.error("[wechat findOrCreate] identity link failed", link);
                    }
                    return [2 /*return*/, updatedUser];
            }
        });
    });
}
// ── 公众号 (MP) parametric-QR scan login ──────────────────────────────────────
// Desktop "scan to sign in" using only the MP (test) account: mint a scene-tagged
// QR, the user scans it, WeChat pushes a SCAN/subscribe event to our webhook.
var WECHAT_API = "https://api.weixin.qq.com";
/** Global access_token for cgi-bin APIs, cached in Redis (token lives ~7200s). */
function getWeChatAccessToken() {
    return __awaiter(this, void 0, void 0, function () {
        var cached, resp, data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, kv_1.redis.get("wechat:mp:access_token")];
                case 1:
                    cached = _b.sent();
                    if (cached)
                        return [2 /*return*/, cached];
                    return [4 /*yield*/, fetch("".concat(WECHAT_API, "/cgi-bin/token?grant_type=client_credential&appid=").concat(env_1.WECHAT_MP_APP_ID, "&secret=").concat(env_1.WECHAT_MP_APP_SECRET))];
                case 2:
                    resp = _b.sent();
                    return [4 /*yield*/, resp.json()];
                case 3:
                    data = (_b.sent());
                    if (!data.access_token) {
                        console.error("[wechat token] failed", JSON.stringify(data));
                        return [2 /*return*/, null];
                    }
                    // Refresh a little early to avoid edge expiry.
                    return [4 /*yield*/, kv_1.redis.set("wechat:mp:access_token", data.access_token, "EX", Math.max(((_a = data.expires_in) !== null && _a !== void 0 ? _a : 7200) - 200, 60))];
                case 4:
                    // Refresh a little early to avoid edge expiry.
                    _b.sent();
                    return [2 /*return*/, data.access_token];
            }
        });
    });
}
/**
 * Create a temporary parametric QR tied to `scene`. Returns the URL the QR
 * encodes (render it client-side). Scanning it makes WeChat push a SCAN/subscribe
 * event carrying `scene` + the user's openid to our webhook.
 */
function createWeChatQrTicket(scene_1) {
    return __awaiter(this, arguments, void 0, function (scene, expireSeconds) {
        var token, resp, data;
        if (expireSeconds === void 0) { expireSeconds = 600; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getWeChatAccessToken()];
                case 1:
                    token = _a.sent();
                    if (!token)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, fetch("".concat(WECHAT_API, "/cgi-bin/qrcode/create?access_token=").concat(token), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                expire_seconds: expireSeconds,
                                action_name: "QR_STR_SCENE",
                                action_info: { scene: { scene_str: scene } }
                            })
                        })];
                case 2:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 3:
                    data = (_a.sent());
                    if (!data.ticket || !data.url) {
                        console.error("[wechat qrcode] failed", JSON.stringify(data));
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, { url: data.url, ticket: data.ticket }];
            }
        });
    });
}
/** Follower profile (nickname/avatar/unionid) for a given openid; null if not retrievable. */
function getWeChatMpUserInfo(openid) {
    return __awaiter(this, void 0, void 0, function () {
        var token, resp, data;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, getWeChatAccessToken()];
                case 1:
                    token = _d.sent();
                    if (!token)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, fetch("".concat(WECHAT_API, "/cgi-bin/user/info?access_token=").concat(token, "&openid=").concat(openid, "&lang=zh_CN"))];
                case 2:
                    resp = _d.sent();
                    return [4 /*yield*/, resp.json()];
                case 3:
                    data = (_d.sent());
                    if (data.errcode)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            nickname: (_a = data.nickname) !== null && _a !== void 0 ? _a : "",
                            headimgurl: (_b = data.headimgurl) !== null && _b !== void 0 ? _b : "",
                            unionid: (_c = data.unionid) !== null && _c !== void 0 ? _c : openid
                        }];
            }
        });
    });
}
/** Verify the signature WeChat attaches to webhook GET (verify) and POST (events). */
function verifyWeChatSignature(params) {
    var signature = params.signature, timestamp = params.timestamp, nonce = params.nonce;
    if (!signature || !timestamp || !nonce || !env_1.WECHAT_WEBHOOK_TOKEN)
        return false;
    var hash = (0, node_crypto_1.createHash)("sha1")
        .update([env_1.WECHAT_WEBHOOK_TOKEN, timestamp, nonce].sort().join(""))
        .digest("hex");
    return hash === signature;
}
/**
 * Build a passive-reply text message. Returned as the webhook response body so
 * WeChat delivers `content` to the user as a chat message from the account.
 * `toUser` is the recipient openid (the event's FromUserName); `fromUser` is the
 * account's gh id (the event's ToUserName).
 */
function buildWeChatTextReply(toUser, fromUser, content) {
    var now = Math.floor(Date.now() / 1000);
    return "<xml><ToUserName><![CDATA[".concat(toUser, "]]></ToUserName><FromUserName><![CDATA[").concat(fromUser, "]]></FromUserName><CreateTime>").concat(now, "</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[").concat(content, "]]></Content></xml>");
}
/** Minimal extractor for WeChat's flat event XML (values may be CDATA-wrapped). */
function parseWeChatEventXml(xml) {
    var _a, _b;
    var out = {};
    // Drop the outer <xml>…</xml> wrapper so it isn't captured as a single field.
    var inner = xml.replace(/<\/?xml>/g, "");
    var re = /<(\w+)>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/\1>/g;
    var m;
    while ((m = re.exec(inner))) {
        var key = m[1];
        if (!key)
            continue;
        out[key] = ((_b = (_a = m[2]) !== null && _a !== void 0 ? _a : m[3]) !== null && _b !== void 0 ? _b : "").trim();
    }
    return out;
}
