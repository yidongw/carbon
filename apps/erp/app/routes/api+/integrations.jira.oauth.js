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
exports.config = void 0;
exports.loader = loader;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var ee_1 = require("@carbon/ee");
var jira_server_1 = require("@carbon/ee/jira.server");
var react_router_1 = require("react-router");
var settings_server_1 = require("~/modules/settings/settings.server");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
exports.config = {
    runtime: "nodejs"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, url, searchParams, jiraAuthResponse, params, redirectUri, tokens, resources, resource, createdJiraIntegration, config_1, _d, requestUrl, redirectUrl, err_1;
        var _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _f.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = Object.fromEntries(url.searchParams.entries());
                    jiraAuthResponse = shared_1.oAuthCallbackSchema.safeParse(searchParams);
                    if (!jiraAuthResponse.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid Jira auth response" }, { status: 400 })];
                    }
                    params = jiraAuthResponse.data;
                    if (!params.state) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid state parameter" }, { status: 400 })];
                    }
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 8, , 9]);
                    redirectUri = "".concat(url.origin, "/api/integrations/jira/oauth");
                    return [4 /*yield*/, (0, jira_server_1.exchangeCodeForTokens)(params.code, redirectUri)];
                case 3:
                    tokens = _f.sent();
                    if (!tokens) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to exchange code for token" }, { status: 500 })];
                    }
                    return [4 /*yield*/, (0, jira_server_1.getAccessibleResources)(tokens.accessToken)];
                case 4:
                    resources = _f.sent();
                    if (resources.length === 0) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                error: "No Jira Cloud sites found. Make sure you have access to at least one Jira site."
                            }, { status: 400 })];
                    }
                    resource = resources[0];
                    return [4 /*yield*/, (0, settings_server_1.upsertCompanyIntegration)(client, {
                            id: "jira",
                            active: true,
                            metadata: {
                                credentials: {
                                    accessToken: tokens.accessToken,
                                    refreshToken: tokens.refreshToken,
                                    expiresAt: Date.now() + tokens.expiresIn * 1000,
                                    cloudId: resource.id,
                                    siteUrl: resource.url
                                }
                            },
                            updatedBy: userId,
                            companyId: companyId
                        })];
                case 5:
                    createdJiraIntegration = _f.sent();
                    config_1 = (0, ee_1.getIntegrationConfigById)("jira");
                    _d = typeof (config_1 === null || config_1 === void 0 ? void 0 : config_1.onInstall) === "function";
                    if (!_d) return [3 /*break*/, 7];
                    return [4 /*yield*/, config_1.onInstall(companyId)];
                case 6:
                    _d = (_f.sent());
                    _f.label = 7;
                case 7:
                    _d;
                    if ((_e = createdJiraIntegration === null || createdJiraIntegration === void 0 ? void 0 : createdJiraIntegration.data) === null || _e === void 0 ? void 0 : _e.metadata) {
                        requestUrl = new URL(request.url);
                        if (!auth_1.VERCEL_URL || auth_1.VERCEL_URL.includes("localhost")) {
                            requestUrl.protocol = "http";
                        }
                        redirectUrl = "".concat(requestUrl.origin).concat(path_1.path.to.integrations);
                        return [2 /*return*/, (0, react_router_1.redirect)(redirectUrl)];
                    }
                    else {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to save Jira integration" }, { status: 500 })];
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _f.sent();
                    console.error("Jira OAuth Error:", err_1);
                    return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to exchange code for token" }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
