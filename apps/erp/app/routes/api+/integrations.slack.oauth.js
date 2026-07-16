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
exports.loader = loader;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var ee_1 = require("@carbon/ee");
var slack_server_1 = require("@carbon/ee/slack.server");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var settings_server_1 = require("~/modules/settings/settings.server");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, url, searchParams, slackAuthResponse, veryfiedState, parsedMetadata, body, response, responseText, responseData, parsedJson, tokenData, createdSlackIntegration, slackApp, err_1, requestUrl, redirectUrl, err_2;
        var _d, _e, _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = Object.fromEntries(url.searchParams.entries());
                    slackAuthResponse = shared_1.oAuthCallbackSchema.safeParse(searchParams);
                    if (!slackAuthResponse.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid Slack auth response" }, { status: 400 })];
                    }
                    return [4 /*yield*/, ((_d = (0, slack_server_1.getSlackInstaller)().stateStore) === null || _d === void 0 ? void 0 : _d.verifyStateParam(new Date(), slackAuthResponse.data.state))];
                case 2:
                    veryfiedState = _h.sent();
                    parsedMetadata = zod_1.z
                        .object({
                        companyId: zod_1.z.string(),
                        userId: zod_1.z.string()
                    })
                        .safeParse(JSON.parse((_e = veryfiedState === null || veryfiedState === void 0 ? void 0 : veryfiedState.metadata) !== null && _e !== void 0 ? _e : "{}"));
                    if (!parsedMetadata.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid metadata" }, { status: 400 })];
                    }
                    if (parsedMetadata.data.companyId !== companyId) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid company" }, { status: 400 })];
                    }
                    if (parsedMetadata.data.userId !== userId) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid user" }, { status: 400 })];
                    }
                    // Validate required environment variables
                    if (!auth_1.SLACK_CLIENT_ID || !auth_1.SLACK_CLIENT_SECRET || !auth_1.SLACK_OAUTH_REDIRECT_URL) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Slack OAuth not configured" }, { status: 500 })];
                    }
                    _h.label = 3;
                case 3:
                    _h.trys.push([3, 13, , 14]);
                    body = new URLSearchParams({
                        client_id: auth_1.SLACK_CLIENT_ID,
                        client_secret: auth_1.SLACK_CLIENT_SECRET,
                        code: slackAuthResponse.data.code,
                        redirect_uri: auth_1.SLACK_OAUTH_REDIRECT_URL
                    });
                    return [4 /*yield*/, fetch("https://slack.com/api/oauth.v2.access", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: body.toString()
                        })];
                case 4:
                    response = _h.sent();
                    if (!response.ok) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to exchange code for token - HTTP error" }, { status: 500 })];
                    }
                    return [4 /*yield*/, response.text()];
                case 5:
                    responseText = _h.sent();
                    responseData = void 0;
                    try {
                        responseData = JSON.parse(responseText);
                        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
                    }
                    catch (parseError) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid JSON response from Slack" }, { status: 500 })];
                    }
                    // Check if Slack returned an error
                    if (!responseData.ok) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Slack OAuth error: ".concat(responseData.error) }, { status: 400 })];
                    }
                    parsedJson = slack_server_1.slackOAuthTokenResponseSchema.safeParse(responseData);
                    if (!parsedJson.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to parse Slack OAuth response" }, { status: 500 })];
                    }
                    tokenData = parsedJson.data;
                    return [4 /*yield*/, (0, settings_server_1.upsertCompanyIntegration)(client, {
                            id: ee_1.Slack.id,
                            active: true,
                            metadata: __assign(__assign({ access_token: tokenData.access_token, team_id: tokenData.team.id, team_name: tokenData.team.name }, (tokenData.incoming_webhook && {
                                channel: tokenData.incoming_webhook.channel,
                                channel_id: tokenData.incoming_webhook.channel_id,
                                slack_configuration_url: tokenData.incoming_webhook.configuration_url,
                                url: tokenData.incoming_webhook.url
                            })), { bot_user_id: tokenData.bot_user_id }),
                            updatedBy: userId,
                            companyId: companyId
                        })];
                case 6:
                    createdSlackIntegration = _h.sent();
                    if (!((_f = createdSlackIntegration === null || createdSlackIntegration === void 0 ? void 0 : createdSlackIntegration.data) === null || _f === void 0 ? void 0 : _f.metadata)) return [3 /*break*/, 11];
                    slackApp = (0, slack_server_1.createSlackApp)({
                        token: tokenData.access_token,
                        botId: tokenData.bot_user_id
                    });
                    if (!((_g = tokenData.incoming_webhook) === null || _g === void 0 ? void 0 : _g.channel_id)) return [3 /*break*/, 10];
                    _h.label = 7;
                case 7:
                    _h.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, slackApp.client.chat.postMessage({
                            channel: tokenData.incoming_webhook.channel_id,
                            unfurl_links: false,
                            unfurl_media: false,
                            blocks: [
                                {
                                    type: "section",
                                    text: {
                                        type: "mrkdwn",
                                        text: "Ahoy maties! 🦜🏴‍☠️ Here be your new Cargh-bon bot. Use `/` to get started."
                                    }
                                }
                            ]
                        })];
                case 8:
                    _h.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _h.sent();
                    return [3 /*break*/, 10];
                case 10:
                    requestUrl = new URL(request.url);
                    if (!auth_1.VERCEL_URL || auth_1.VERCEL_URL.includes("localhost")) {
                        requestUrl.protocol = "http";
                    }
                    redirectUrl = "".concat(requestUrl.origin).concat(path_1.path.to.integrations);
                    return [2 /*return*/, (0, react_router_1.redirect)(redirectUrl)];
                case 11: return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to save Slack integration" }, { status: 500 })];
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_2 = _h.sent();
                    return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to exchange code for token" }, { status: 500 })];
                case 14: return [2 /*return*/];
            }
        });
    });
}
