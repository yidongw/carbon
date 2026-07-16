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
exports.getJiraClient = exports.JiraClient = void 0;
exports.exchangeCodeForTokens = exchangeCodeForTokens;
exports.refreshAccessToken = refreshAccessToken;
exports.getAccessibleResources = getAccessibleResources;
var auth_1 = require("@carbon/auth");
var client_server_1 = require("@carbon/auth/client.server");
var service_1 = require("./service");
var ATLASSIAN_AUTH_URL = "https://auth.atlassian.com";
var ATLASSIAN_API_URL = "https://api.atlassian.com";
/**
 * Exchange authorization code for access and refresh tokens.
 */
function exchangeCodeForTokens(code, redirectUri) {
    return __awaiter(this, void 0, void 0, function () {
        var response, _a, _b, _c, data, e_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(ATLASSIAN_AUTH_URL, "/oauth/token"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                grant_type: "authorization_code",
                                client_id: auth_1.JIRA_CLIENT_ID,
                                client_secret: auth_1.JIRA_CLIENT_SECRET,
                                code: code,
                                redirect_uri: redirectUri
                            })
                        })];
                case 1:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    _b = (_a = console).error;
                    _c = ["Failed to exchange code for tokens:",
                        response.status];
                    return [4 /*yield*/, response.text()];
                case 2:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [2 /*return*/, null];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = (_d.sent());
                    return [2 /*return*/, {
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            expiresIn: data.expires_in
                        }];
                case 5:
                    e_1 = _d.sent();
                    console.error("Error exchanging code for tokens:", e_1);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Refresh access token using refresh token.
 */
function refreshAccessToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function () {
        var response, _a, _b, _c, data, e_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(ATLASSIAN_AUTH_URL, "/oauth/token"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                grant_type: "refresh_token",
                                client_id: auth_1.JIRA_CLIENT_ID,
                                client_secret: auth_1.JIRA_CLIENT_SECRET,
                                refresh_token: refreshToken
                            })
                        })];
                case 1:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    _b = (_a = console).error;
                    _c = ["Failed to refresh token:",
                        response.status];
                    return [4 /*yield*/, response.text()];
                case 2:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [2 /*return*/, null];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = (_d.sent());
                    return [2 /*return*/, {
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            expiresIn: data.expires_in
                        }];
                case 5:
                    e_2 = _d.sent();
                    console.error("Error refreshing token:", e_2);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get accessible Jira Cloud resources for the authenticated user.
 * This is called during OAuth to get the cloudId.
 */
function getAccessibleResources(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var response, _a, _b, _c, e_3;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(ATLASSIAN_API_URL, "/oauth/token/accessible-resources"), {
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                Accept: "application/json"
                            }
                        })];
                case 1:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    _b = (_a = console).error;
                    _c = ["Failed to get accessible resources:",
                        response.status];
                    return [4 /*yield*/, response.text()];
                case 2:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [2 /*return*/, []];
                case 3: return [4 /*yield*/, response.json()];
                case 4: return [2 /*return*/, (_d.sent())];
                case 5:
                    e_3 = _d.sent();
                    console.error("Error getting accessible resources:", e_3);
                    return [2 /*return*/, []];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Jira Cloud REST API client.
 */
var JiraClient = /** @class */ (function () {
    function JiraClient() {
    }
    JiraClient.prototype.getCredentials = function (integration) {
        return integration.metadata
            .credentials;
    };
    /**
     * Get authentication headers, refreshing token if needed.
     */
    JiraClient.prototype.getAuthHeaders = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceRole, data, integration, credentials, now, refreshed, newCredentials;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serviceRole = (0, client_server_1.getCarbonServiceRole)();
                        return [4 /*yield*/, (0, service_1.getJiraIntegration)(serviceRole, companyId)];
                    case 1:
                        data = (_a.sent()).data;
                        integration = data === null || data === void 0 ? void 0 : data[0];
                        if (!integration) {
                            throw new Error("Jira integration not found for company");
                        }
                        credentials = this.getCredentials(integration);
                        now = Date.now();
                        if (!(credentials.expiresAt - now < 5 * 60 * 1000)) return [3 /*break*/, 4];
                        return [4 /*yield*/, refreshAccessToken(credentials.refreshToken)];
                    case 2:
                        refreshed = _a.sent();
                        if (!refreshed) return [3 /*break*/, 4];
                        newCredentials = __assign(__assign({}, credentials), { accessToken: refreshed.accessToken, refreshToken: refreshed.refreshToken, expiresAt: now + refreshed.expiresIn * 1000 });
                        // Update stored credentials
                        return [4 /*yield*/, (0, service_1.updateJiraCredentials)(serviceRole, companyId, newCredentials)];
                    case 3:
                        // Update stored credentials
                        _a.sent();
                        return [2 /*return*/, {
                                Authorization: "Bearer ".concat(refreshed.accessToken),
                                Accept: "application/json",
                                "Content-Type": "application/json"
                            }];
                    case 4: return [2 /*return*/, {
                            Authorization: "Bearer ".concat(credentials.accessToken),
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        }];
                }
            });
        });
    };
    /**
     * Get the cloud ID for API requests.
     */
    JiraClient.prototype.getCloudId = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceRole, data, integration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serviceRole = (0, client_server_1.getCarbonServiceRole)();
                        return [4 /*yield*/, (0, service_1.getJiraIntegration)(serviceRole, companyId)];
                    case 1:
                        data = (_a.sent()).data;
                        integration = data === null || data === void 0 ? void 0 : data[0];
                        if (!integration) {
                            throw new Error("Jira integration not found for company");
                        }
                        return [2 /*return*/, this.getCredentials(integration).cloudId];
                }
            });
        });
    };
    /**
     * Get the site URL for linking.
     */
    JiraClient.prototype.getSiteUrl = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceRole, data, integration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serviceRole = (0, client_server_1.getCarbonServiceRole)();
                        return [4 /*yield*/, (0, service_1.getJiraIntegration)(serviceRole, companyId)];
                    case 1:
                        data = (_a.sent()).data;
                        integration = data === null || data === void 0 ? void 0 : data[0];
                        if (!integration) {
                            throw new Error("Jira integration not found for company");
                        }
                        return [2 /*return*/, this.getCredentials(integration).siteUrl];
                }
            });
        });
    };
    /**
     * Make an API request to Jira Cloud.
     */
    JiraClient.prototype.request = function (companyId, path, options) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, cloudId, response, errorText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1:
                        headers = _a.sent();
                        return [4 /*yield*/, this.getCloudId(companyId)];
                    case 2:
                        cloudId = _a.sent();
                        return [4 /*yield*/, fetch("".concat(ATLASSIAN_API_URL, "/ex/jira/").concat(cloudId, "/rest/api/3").concat(path), __assign(__assign({}, options), { headers: __assign(__assign({}, headers), ((options === null || options === void 0 ? void 0 : options.headers) || {})) }))];
                    case 3:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.text()];
                    case 4:
                        errorText = _a.sent();
                        console.error("Jira API error (".concat(path, "):"), response.status, errorText);
                        throw new Error("Jira API error: ".concat(response.status));
                    case 5:
                        // Handle 204 No Content
                        if (response.status === 204) {
                            return [2 /*return*/, {}];
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        });
    };
    /**
     * Health check - verify the integration is working.
     */
    JiraClient.prototype.healthcheck = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/myself")];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all projects accessible to the user.
     */
    JiraClient.prototype.listProjects = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/project/search?maxResults=50")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.values || []];
                    case 2:
                        e_4 = _a.sent();
                        console.error("Error listing Jira projects:", e_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get issue types for a project.
     */
    JiraClient.prototype.getIssueTypes = function (companyId, projectKey) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/project/".concat(projectKey))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (response.issueTypes || []).filter(function (t) { return !t.subtask; })];
                    case 2:
                        e_5 = _a.sent();
                        console.error("Error getting Jira issue types:", e_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get users assignable to a project.
     */
    JiraClient.prototype.listProjectUsers = function (companyId, projectKey) {
        return __awaiter(this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/user/assignable/search?project=".concat(projectKey, "&maxResults=50"))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_6 = _a.sent();
                        console.error("Error listing Jira project users:", e_6);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search for issues using JQL.
     */
    JiraClient.prototype.searchIssues = function (companyId, query) {
        return __awaiter(this, void 0, void 0, function () {
            var escapedQuery, jql, response, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        escapedQuery = query.replace(/['"\\]/g, "\\$&");
                        jql = "text ~ \"".concat(escapedQuery, "\" ORDER BY updated DESC");
                        return [4 /*yield*/, this.request(companyId, "/search/jql?jql=".concat(encodeURIComponent(jql), "&maxResults=10&fields=summary,description,status,assignee,duedate,issuetype,project,priority"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.issues || []];
                    case 2:
                        e_7 = _a.sent();
                        console.error("Error searching Jira issues:", e_7);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a single issue by ID or key.
     */
    JiraClient.prototype.getIssue = function (companyId, issueIdOrKey) {
        return __awaiter(this, void 0, void 0, function () {
            var e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/issue/".concat(issueIdOrKey, "?fields=summary,description,status,assignee,duedate,issuetype,project,priority"))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_8 = _a.sent();
                        console.error("Error getting Jira issue:", e_8);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new issue.
     */
    JiraClient.prototype.createIssue = function (companyId, input) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, response, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        fields = {
                            project: { key: input.projectKey },
                            issuetype: { id: input.issueTypeId },
                            summary: input.summary
                        };
                        if (input.description) {
                            fields.description = input.description;
                        }
                        if (input.assigneeId) {
                            fields.assignee = { accountId: input.assigneeId };
                        }
                        if (input.priority) {
                            fields.priority = { name: input.priority };
                        }
                        return [4 /*yield*/, this.request(companyId, "/issue", {
                                method: "POST",
                                body: JSON.stringify({ fields: fields })
                            })];
                    case 1:
                        response = _a.sent();
                        // Fetch the full issue details
                        return [2 /*return*/, this.getIssue(companyId, response.key)];
                    case 2:
                        e_9 = _a.sent();
                        console.error("Error creating Jira issue:", e_9);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update an existing issue.
     */
    JiraClient.prototype.updateIssue = function (companyId, issueId, input) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        fields = {};
                        if (input.summary !== undefined) {
                            fields.summary = input.summary;
                        }
                        if (input.description !== undefined) {
                            fields.description = input.description;
                        }
                        if (input.assigneeId !== undefined) {
                            fields.assignee = input.assigneeId
                                ? { accountId: input.assigneeId }
                                : null;
                        }
                        if (input.priority !== undefined) {
                            fields.priority = { name: input.priority };
                        }
                        return [4 /*yield*/, this.request(companyId, "/issue/".concat(issueId), {
                                method: "PUT",
                                body: JSON.stringify({ fields: fields })
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_10 = _a.sent();
                        console.error("Error updating Jira issue:", e_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get available transitions for an issue.
     */
    JiraClient.prototype.getTransitions = function (companyId, issueId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/issue/".concat(issueId, "/transitions"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.transitions || []];
                    case 2:
                        e_11 = _a.sent();
                        console.error("Error getting Jira transitions:", e_11);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Transition an issue to a status matching the target category.
     */
    JiraClient.prototype.transitionIssue = function (companyId, issueId, targetCategory) {
        return __awaiter(this, void 0, void 0, function () {
            var transitions, transition, e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getTransitions(companyId, issueId)];
                    case 1:
                        transitions = _a.sent();
                        transition = transitions.find(function (t) { return t.to.statusCategory.key === targetCategory; });
                        if (!transition) {
                            console.warn("No transition found to ".concat(targetCategory, " for issue ").concat(issueId));
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.request(companyId, "/issue/".concat(issueId, "/transitions"), {
                                method: "POST",
                                body: JSON.stringify({ transition: { id: transition.id } })
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_12 = _a.sent();
                        console.error("Error transitioning Jira issue:", e_12);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a remote link (backlink to Carbon).
     */
    JiraClient.prototype.createRemoteLink = function (companyId, issueId, url, title) {
        return __awaiter(this, void 0, void 0, function () {
            var e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/issue/".concat(issueId, "/remotelink"), {
                                method: "POST",
                                body: JSON.stringify({
                                    globalId: "carbon-".concat(url),
                                    application: {
                                        type: "com.carbon.ms",
                                        name: "Carbon"
                                    },
                                    object: {
                                        url: url,
                                        title: title
                                    }
                                })
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_13 = _a.sent();
                        console.error("Error creating Jira remote link:", e_13);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get remote links for an issue.
     */
    JiraClient.prototype.getRemoteLinks = function (companyId, issueId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/issue/".concat(issueId, "/remotelink"))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_14 = _a.sent();
                        console.error("Error getting Jira remote links:", e_14);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a remote link by global ID.
     */
    JiraClient.prototype.deleteRemoteLink = function (companyId, issueId, globalId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/issue/".concat(issueId, "/remotelink?globalId=").concat(encodeURIComponent(globalId)), { method: "DELETE" })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_15 = _a.sent();
                        console.error("Error deleting Jira remote link:", e_15);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Find users by email.
     */
    JiraClient.prototype.findUserByEmail = function (companyId, email) {
        return __awaiter(this, void 0, void 0, function () {
            var users, e_16;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request(companyId, "/user/search?query=".concat(encodeURIComponent(email), "&maxResults=1"))];
                    case 1:
                        users = _b.sent();
                        return [2 /*return*/, users.length > 0 ? ((_a = users[0]) !== null && _a !== void 0 ? _a : null) : null];
                    case 2:
                        e_16 = _b.sent();
                        console.error("Error finding Jira user:", e_16);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return JiraClient;
}());
exports.JiraClient = JiraClient;
var instance = null;
var getJiraClient = function () {
    if (!instance)
        instance = new JiraClient();
    return instance;
};
exports.getJiraClient = getJiraClient;
