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
exports.getSlackInstallUrl = exports.getSlackInstaller = exports.createSlackWebClient = exports.createSlackApp = exports.slackOAuthTokenResponseSchema = exports.slackOAuthCallbackSchema = void 0;
exports.verifySlackWebhook = verifySlackWebhook;
exports.postToSlackThread = postToSlackThread;
exports.createSlackThread = createSlackThread;
exports.updateSlackMessage = updateSlackMessage;
exports.getSlackThreadReplies = getSlackThreadReplies;
var node_crypto_1 = require("node:crypto");
var auth_1 = require("@carbon/auth");
var bolt_1 = require("@slack/bolt");
var oauth_1 = require("@slack/oauth");
var web_api_1 = require("@slack/web-api");
var zod_1 = require("zod");
var App = bolt_1.default.App;
exports.slackOAuthCallbackSchema = zod_1.z.object({
    code: zod_1.z.string(),
    state: zod_1.z.string()
});
exports.slackOAuthTokenResponseSchema = zod_1.z.object({
    ok: zod_1.z.literal(true),
    app_id: zod_1.z.string(),
    authed_user: zod_1.z.object({
        id: zod_1.z.string()
    }),
    scope: zod_1.z.string(),
    token_type: zod_1.z.literal("bot"),
    access_token: zod_1.z.string(),
    bot_user_id: zod_1.z.string(),
    team: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string()
    }),
    // incoming_webhook is only present when the app has incoming-webhook scope
    incoming_webhook: zod_1.z
        .object({
        channel: zod_1.z.string(),
        channel_id: zod_1.z.string(),
        configuration_url: zod_1.z.string().url(),
        url: zod_1.z.string().url()
    })
        .optional(),
    // Enterprise field can be an object, null, or missing
    enterprise: zod_1.z
        .object({
        name: zod_1.z.string(),
        id: zod_1.z.string()
    })
        .nullable()
        .optional()
});
var slackInstaller = null;
var createSlackApp = function (_a) {
    var token = _a.token, botId = _a.botId;
    return new App({
        signingSecret: auth_1.SLACK_SIGNING_SECRET,
        token: token,
        botId: botId
    });
};
exports.createSlackApp = createSlackApp;
var createSlackWebClient = function (_a) {
    var token = _a.token;
    return new web_api_1.WebClient(token);
};
exports.createSlackWebClient = createSlackWebClient;
var getSlackInstaller = function () {
    if (!slackInstaller) {
        if (!auth_1.SLACK_CLIENT_ID || !auth_1.SLACK_CLIENT_SECRET) {
            throw new Error("Slack client credentials are required but not provided");
        }
        slackInstaller = new oauth_1.InstallProvider({
            clientId: auth_1.SLACK_CLIENT_ID,
            clientSecret: auth_1.SLACK_CLIENT_SECRET,
            stateSecret: auth_1.SLACK_STATE_SECRET,
            logLevel: process.env.NODE_ENV === "development" ? bolt_1.default.LogLevel.DEBUG : undefined
        });
    }
    return slackInstaller;
};
exports.getSlackInstaller = getSlackInstaller;
var getSlackInstallUrl = function (_a) {
    var companyId = _a.companyId, userId = _a.userId;
    return (0, exports.getSlackInstaller)().generateInstallUrl({
        scopes: [
            "assistant:write",
            "chat:write.public",
            "chat:write",
            "commands",
            "files:read",
            "im:history",
            "incoming-webhook",
            "team:read",
            "users:read",
            "users:read.email"
        ],
        redirectUri: auth_1.SLACK_OAUTH_REDIRECT_URL,
        metadata: JSON.stringify({ companyId: companyId, userId: userId })
    });
};
exports.getSlackInstallUrl = getSlackInstallUrl;
function verifySlackWebhook(req) {
    return __awaiter(this, void 0, void 0, function () {
        var fiveMinutesInSeconds, slackSignatureVersion, body, timestamp, slackSignature, currentTime, sigBasestring, mySignature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!auth_1.SLACK_SIGNING_SECRET) {
                        throw new Error("SLACK_SIGNING_SECRET is not set");
                    }
                    fiveMinutesInSeconds = 5 * 60;
                    slackSignatureVersion = "v0";
                    return [4 /*yield*/, req.text()];
                case 1:
                    body = _a.sent();
                    timestamp = req.headers.get("x-slack-request-timestamp");
                    slackSignature = req.headers.get("x-slack-signature");
                    if (!timestamp || !slackSignature) {
                        throw new Error("Missing required Slack headers");
                    }
                    currentTime = Math.floor(Date.now() / 1000);
                    if (Math.abs(currentTime - Number.parseInt(timestamp)) > fiveMinutesInSeconds) {
                        throw new Error("Request is too old");
                    }
                    sigBasestring = "".concat(slackSignatureVersion, ":").concat(timestamp, ":").concat(body);
                    mySignature = (0, node_crypto_1.createHmac)("sha256", auth_1.SLACK_SIGNING_SECRET)
                        .update(sigBasestring)
                        .digest("hex");
                    if ("".concat(slackSignatureVersion, "=").concat(mySignature) !== slackSignature) {
                        throw new Error("Invalid Slack signature");
                    }
                    return [2 /*return*/, JSON.parse(body)];
            }
        });
    });
}
/**
 * Post a message to a Slack thread
 */
function postToSlackThread(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client;
        var token = _b.token, channelId = _b.channelId, threadTs = _b.threadTs, blocks = _b.blocks, text = _b.text;
        return __generator(this, function (_c) {
            client = (0, exports.createSlackWebClient)({ token: token });
            return [2 /*return*/, client.chat.postMessage({
                    channel: channelId,
                    thread_ts: threadTs,
                    blocks: blocks,
                    text: text || "Message from Carbon",
                    unfurl_links: false,
                    unfurl_media: false
                })];
        });
    });
}
/**
 * Create a new Slack thread
 */
function createSlackThread(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client;
        var token = _b.token, channelId = _b.channelId, blocks = _b.blocks, text = _b.text;
        return __generator(this, function (_c) {
            client = (0, exports.createSlackWebClient)({ token: token });
            return [2 /*return*/, client.chat.postMessage({
                    channel: channelId,
                    blocks: blocks,
                    text: text || "New thread from Carbon",
                    unfurl_links: false,
                    unfurl_media: false
                })];
        });
    });
}
/**
 * Update a Slack message
 */
function updateSlackMessage(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client;
        var token = _b.token, channelId = _b.channelId, ts = _b.ts, blocks = _b.blocks, text = _b.text;
        return __generator(this, function (_c) {
            client = (0, exports.createSlackWebClient)({ token: token });
            return [2 /*return*/, client.chat.update({
                    channel: channelId,
                    ts: ts,
                    blocks: blocks,
                    text: text || "Updated message from Carbon"
                })];
        });
    });
}
/**
 * Get thread replies from Slack
 */
function getSlackThreadReplies(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client;
        var token = _b.token, channelId = _b.channelId, threadTs = _b.threadTs, _c = _b.limit, limit = _c === void 0 ? 100 : _c;
        return __generator(this, function (_d) {
            client = (0, exports.createSlackWebClient)({ token: token });
            return [2 /*return*/, client.conversations.replies({
                    channel: channelId,
                    ts: threadTs,
                    limit: limit
                })];
        });
    });
}
