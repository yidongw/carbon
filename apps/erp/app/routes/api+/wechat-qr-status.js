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
var client_server_1 = require("@carbon/auth/client.server");
var kv_1 = require("@carbon/kv");
var react_router_1 = require("react-router");
var wechat_session_server_1 = require("~/services/wechat-session.server");
var path_1 = require("~/utils/path");
var SCENE_PREFIX = "wechat-qr:";
/**
 * Poll endpoint for the QR scan-login. While pending → { status: "pending" }.
 * Once the webhook marks the scene authed, mint the session (Set-Cookie) and
 * return the redirect target for the browser to navigate to.
 */
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var providers, url, scene, redirectTo, key, raw, parsed, serviceRole, user, headers;
        var _c, _d;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    providers = auth_1.AUTH_PROVIDERS.split(",");
                    if (!providers.includes("wechat")) {
                        return [2 /*return*/, (0, react_router_1.data)({ status: "disabled" }, { status: 404 })];
                    }
                    url = new URL(request.url);
                    scene = (_c = url.searchParams.get("scene")) !== null && _c !== void 0 ? _c : "";
                    redirectTo = (_d = url.searchParams.get("redirectTo")) !== null && _d !== void 0 ? _d : "";
                    if (!scene)
                        return [2 /*return*/, (0, react_router_1.data)({ status: "expired" })];
                    key = "".concat(SCENE_PREFIX).concat(scene);
                    return [4 /*yield*/, kv_1.redis.get(key)];
                case 1:
                    raw = _e.sent();
                    if (!raw)
                        return [2 /*return*/, (0, react_router_1.data)({ status: "expired" })];
                    parsed = JSON.parse(raw);
                    if (!(parsed.status === "linked")) return [3 /*break*/, 3];
                    return [4 /*yield*/, kv_1.redis.del(key)];
                case 2:
                    _e.sent();
                    return [2 /*return*/, (0, react_router_1.data)({ status: "linked" })];
                case 3:
                    if (!(parsed.status === "link_failed")) return [3 /*break*/, 5];
                    return [4 /*yield*/, kv_1.redis.del(key)];
                case 4:
                    _e.sent();
                    return [2 /*return*/, (0, react_router_1.data)({ status: "link_failed", reason: parsed.reason })];
                case 5:
                    if (parsed.status !== "authed" || !parsed.userId) {
                        return [2 /*return*/, (0, react_router_1.data)({ status: "pending" })];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("id, wechat_unionid")
                            .eq("id", parsed.userId)
                            .single()];
                case 6:
                    user = (_e.sent()).data;
                    if (!user || !user.wechat_unionid)
                        return [2 /*return*/, (0, react_router_1.data)({ status: "expired" })];
                    return [4 /*yield*/, (0, wechat_session_server_1.createWeChatAuthSession)(request, { id: user.id })];
                case 7:
                    headers = _e.sent();
                    if (!headers) {
                        // Keep the scene so the next poll can retry rather than silently dropping it.
                        return [2 /*return*/, (0, react_router_1.data)({ status: "pending" })];
                    }
                    return [4 /*yield*/, kv_1.redis.del(key)];
                case 8:
                    _e.sent();
                    return [2 /*return*/, (0, react_router_1.data)({
                            status: "authed",
                            redirectTo: (0, auth_1.safeRedirect)(redirectTo, path_1.path.to.authenticatedRoot)
                        }, { headers: headers })];
            }
        });
    });
}
