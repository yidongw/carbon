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
exports.createIssueSlackThread = createIssueSlackThread;
exports.deleteSlackDocumentThread = deleteSlackDocumentThread;
exports.getCompanySlackThreads = getCompanySlackThreads;
exports.getIssueSlackThread = getIssueSlackThread;
exports.getSlackAuth = getSlackAuth;
exports.getSlackUserIdByCarbonId = getSlackUserIdByCarbonId;
exports.getSlackDocumentThread = getSlackDocumentThread;
exports.getSlackIntegrationByTeamId = getSlackIntegrationByTeamId;
exports.getCarbonEmployeeFromSlackId = getCarbonEmployeeFromSlackId;
exports.syncDocumentToSlack = syncDocumentToSlack;
exports.syncDocumentCreatedToSlack = syncDocumentCreatedToSlack;
exports.syncDocumentStatusToSlack = syncDocumentStatusToSlack;
exports.syncDocumentAssignmentToSlack = syncDocumentAssignmentToSlack;
exports.syncDocumentCustomToSlack = syncDocumentCustomToSlack;
exports.syncIssueStatusToSlack = syncIssueStatusToSlack;
exports.syncIssueTaskToSlack = syncIssueTaskToSlack;
exports.syncIssueAssignmentToSlack = syncIssueAssignmentToSlack;
exports.updateSlackDocumentThread = updateSlackDocumentThread;
var client_server_1 = require("@carbon/auth/client.server");
var kv_1 = require("@carbon/kv");
var trigger_1 = require("@carbon/lib/trigger");
var utils_1 = require("@carbon/utils");
var client_1 = require("./client");
function createIssueSlackThread(client, data, slackAuth) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, _a, slackClient, blocks, threadMessage, threadRecord, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    if (!(slackAuth !== null && slackAuth !== void 0)) return [3 /*break*/, 1];
                    _a = slackAuth;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getSlackAuth(client, data.companyId, data.userId)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    auth = _a;
                    if (!auth) {
                        throw new Error("Slack auth not found");
                    }
                    slackClient = (0, client_1.createSlackWebClient)({ token: auth === null || auth === void 0 ? void 0 : auth.slackToken });
                    blocks = __spreadArray([
                        {
                            type: "header",
                            text: {
                                type: "plain_text",
                                text: "Issue ".concat(data.nonConformanceId)
                            }
                        },
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: "*".concat(data.title, "*\n").concat(data.description || "_No description provided_")
                            },
                            fields: [
                                {
                                    type: "mrkdwn",
                                    text: "*Status:*\nRegistered"
                                },
                                {
                                    type: "mrkdwn",
                                    text: "*Severity:*\n".concat(data.severity)
                                }
                            ]
                        },
                        {
                            type: "context",
                            elements: [
                                {
                                    type: "mrkdwn",
                                    text: "Created by <@".concat(auth.slackUserId, ">")
                                }
                            ]
                        }
                    ], (data.carbonUrl && (0, utils_1.isUrl)(data.carbonUrl)
                        ? [
                            {
                                type: "actions",
                                elements: [
                                    {
                                        type: "button",
                                        text: {
                                            type: "plain_text",
                                            text: "View in Carbon"
                                        },
                                        url: data.carbonUrl,
                                        action_id: "view_in_carbon"
                                    }
                                ]
                            }
                        ]
                        : []), true);
                    return [4 /*yield*/, slackClient.chat.postMessage({
                            channel: auth.channelId,
                            unfurl_links: false,
                            unfurl_media: false,
                            blocks: blocks
                        })];
                case 4:
                    threadMessage = _b.sent();
                    if (!threadMessage.ts) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("slackDocumentThread")
                            .insert({
                            documentType: "nonConformance",
                            documentId: data.id,
                            companyId: data.companyId,
                            channelId: auth.channelId,
                            threadTs: threadMessage.ts,
                            createdBy: data.userId
                        })
                            .select("*")
                            .single()];
                case 5:
                    threadRecord = _b.sent();
                    if (threadRecord.error) {
                        console.error("Error creating thread record:", threadRecord.error);
                    }
                    return [2 /*return*/, threadRecord];
                case 6: return [2 /*return*/, {
                        data: null,
                        error: { message: "Failed to post message to Slack" }
                    }];
                case 7:
                    error_1 = _b.sent();
                    console.error("Error creating Issue Slack thread:", error_1);
                    return [2 /*return*/, {
                            data: null,
                            error: {
                                message: error_1 instanceof Error ? error_1.message : "Unknown error"
                            }
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function deleteSlackDocumentThread(client, documentType, documentId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("slackDocumentThread")
                    .delete()
                    .eq("documentType", documentType)
                    .eq("documentId", documentId)
                    .eq("companyId", companyId)];
        });
    });
}
function getCompanySlackThreads(client, companyId, documentType) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("slackDocumentThread")
                .select("*")
                .eq("companyId", companyId);
            if (documentType) {
                query = query.eq("documentType", documentType);
            }
            return [2 /*return*/, query.order("createdAt", { ascending: false })];
        });
    });
}
function getIssueSlackThread(client, nonConformanceId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getSlackDocumentThread(client, "nonConformance", nonConformanceId, companyId)];
        });
    });
}
function getSlackAuth(client, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var companyIntegration, metadata, slackUserId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("companyIntegration")
                        .select("*")
                        .eq("companyId", companyId)
                        .eq("id", "slack")
                        .maybeSingle()];
                case 1:
                    companyIntegration = _b.sent();
                    if (companyIntegration.error) {
                        return [2 /*return*/, null];
                    }
                    metadata = (_a = companyIntegration.data) === null || _a === void 0 ? void 0 : _a.metadata;
                    if (!metadata) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, getSlackUserIdByCarbonId(client, metadata.access_token, userId)];
                case 2:
                    slackUserId = _b.sent();
                    return [2 /*return*/, {
                            slackToken: metadata.access_token,
                            channelId: metadata.channel_id,
                            slackUserId: slackUserId || undefined
                        }];
            }
        });
    });
}
function getSlackUserIdByCarbonId(client, accessToken, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var cachedUserId, user, slackClient, slackUser, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, kv_1.redis.get("slack-user:".concat(userId))];
                case 1:
                    cachedUserId = _c.sent();
                    if (cachedUserId && typeof cachedUserId === "string") {
                        return [2 /*return*/, cachedUserId];
                    }
                    return [4 /*yield*/, client
                            .from("user")
                            .select("email")
                            .eq("id", userId)
                            .single()];
                case 2:
                    user = _c.sent();
                    if (user.error || !((_a = user.data) === null || _a === void 0 ? void 0 : _a.email)) {
                        return [2 /*return*/, null];
                    }
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 7, , 8]);
                    slackClient = (0, client_1.createSlackWebClient)({ token: accessToken });
                    return [4 /*yield*/, slackClient.users.lookupByEmail({
                            email: user.data.email
                        })];
                case 4:
                    slackUser = _c.sent();
                    if (!(slackUser.ok && ((_b = slackUser.user) === null || _b === void 0 ? void 0 : _b.id))) return [3 /*break*/, 6];
                    return [4 /*yield*/, kv_1.redis.set("slack-user:".concat(userId), slackUser.user.id)];
                case 5:
                    _c.sent();
                    return [2 /*return*/, slackUser.user.id];
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _c.sent();
                    console.error("Failed to lookup Slack user by email:", error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function getSlackDocumentThread(client, documentType, documentId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("slackDocumentThread")
                    .select("*")
                    .eq("documentType", documentType)
                    .eq("documentId", documentId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getSlackIntegrationByTeamId(client, teamId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("companyIntegration")
                        .select("*")
                        .eq("metadata->>team_id", teamId)
                        .eq("id", "slack")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getCarbonEmployeeFromSlackId(client, accessToken, slackUserId, carbonCompanyId) {
    return __awaiter(this, void 0, void 0, function () {
        var slackClient, userInfo, email, user, location_1, job, location_2, error_3;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 8, , 9]);
                    slackClient = (0, client_1.createSlackWebClient)({ token: accessToken });
                    return [4 /*yield*/, slackClient.users.info({
                            user: slackUserId
                        })];
                case 1:
                    userInfo = _j.sent();
                    if (!userInfo.ok || !((_b = (_a = userInfo.user) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.email)) {
                        return [2 /*return*/, { data: null, error: "Could not retrieve user email from Slack" }];
                    }
                    email = userInfo.user.profile.email;
                    return [4 /*yield*/, client
                            .from("user")
                            .select("id")
                            .eq("email", email)
                            .single()];
                case 2:
                    user = _j.sent();
                    if (!(user.error || !((_c = user.data) === null || _c === void 0 ? void 0 : _c.id))) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("location")
                            .select("id")
                            .eq("companyId", carbonCompanyId)];
                case 3:
                    location_1 = _j.sent();
                    return [2 /*return*/, {
                            data: {
                                id: "system",
                                locationId: (_e = (_d = location_1.data) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.id
                            },
                            error: null
                        }];
                case 4: return [4 /*yield*/, client
                        .from("employeeJob")
                        .select("*")
                        .eq("id", user.data.id)
                        .eq("companyId", carbonCompanyId)
                        .maybeSingle()];
                case 5:
                    job = _j.sent();
                    if (!(job.error || !((_f = job.data) === null || _f === void 0 ? void 0 : _f.id))) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("location")
                            .select("id")
                            .eq("companyId", carbonCompanyId)];
                case 6:
                    location_2 = _j.sent();
                    return [2 /*return*/, {
                            data: {
                                id: user.data.id,
                                locationId: (_h = (_g = location_2.data) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.id
                            },
                            error: null
                        }];
                case 7: return [2 /*return*/, job];
                case 8:
                    error_3 = _j.sent();
                    console.error("Error getting Carbon employee from Slack ID:", error_3);
                    return [2 /*return*/, {
                            data: null,
                            error: error_3 instanceof Error ? error_3.message : "Unknown error"
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function syncDocumentToSlack(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, _a, thread, slackAuth, result, _b, taskName, assignee, taskId, task, _c, task, _d, task, _e, previousAssignee, newAssignee, error_4;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, Promise.all([
                            getSlackDocumentThread(serviceRole, data.documentType, data.documentId, data.companyId),
                            getSlackAuth(serviceRole, data.companyId, data.userId)
                        ])];
                case 1:
                    _a = _s.sent(), thread = _a[0], slackAuth = _a[1];
                    if (!slackAuth) {
                        console.error("Slack auth not found for company", data.companyId);
                        return [2 /*return*/, {
                                data: null,
                                error: "Slack auth not found"
                            }];
                    }
                    if (!thread.data) return [3 /*break*/, 34];
                    _s.label = 2;
                case 2:
                    _s.trys.push([2, 33, , 34]);
                    result = void 0;
                    _b = data.type;
                    switch (_b) {
                        case "created": return [3 /*break*/, 3];
                        case "status-update": return [3 /*break*/, 5];
                        case "task-update": return [3 /*break*/, 7];
                        case "assignment-update": return [3 /*break*/, 24];
                        case "custom": return [3 /*break*/, 30];
                    }
                    return [3 /*break*/, 31];
                case 3: return [4 /*yield*/, (0, trigger_1.trigger)("slack-document-created", {
                        documentType: data.documentType,
                        documentId: data.documentId,
                        companyId: data.companyId,
                        channelId: thread.data.channelId,
                        threadTs: thread.data.threadTs
                    })];
                case 4:
                    result = _s.sent();
                    return [3 /*break*/, 32];
                case 5: return [4 /*yield*/, (0, trigger_1.trigger)("slack-document-status-update", {
                        documentType: data.documentType,
                        documentId: data.documentId,
                        companyId: data.companyId,
                        previousStatus: data.payload.previousStatus,
                        newStatus: data.payload.newStatus,
                        updatedBy: slackAuth.slackUserId || data.payload.updatedBy
                    })];
                case 6:
                    result = _s.sent();
                    return [3 /*break*/, 32];
                case 7:
                    taskName = "";
                    assignee = null;
                    taskId = data.payload.taskId || data.documentId;
                    if (!(data.payload.taskType === "investigation")) return [3 /*break*/, 12];
                    return [4 /*yield*/, client
                            .from("nonConformanceInvestigationTask")
                            .select("assignee, status, ...nonConformanceInvestigationType(name)")
                            .eq("id", taskId)
                            .single()];
                case 8:
                    task = _s.sent();
                    taskName = ((_f = task.data) === null || _f === void 0 ? void 0 : _f.name) || "";
                    if (!((_g = task.data) === null || _g === void 0 ? void 0 : _g.assignee)) return [3 /*break*/, 10];
                    return [4 /*yield*/, getSlackUserIdByCarbonId(client, slackAuth.slackToken, ((_h = task.data) === null || _h === void 0 ? void 0 : _h.assignee) || "")];
                case 9:
                    _c = _s.sent();
                    return [3 /*break*/, 11];
                case 10:
                    _c = null;
                    _s.label = 11;
                case 11:
                    assignee = _c;
                    return [3 /*break*/, 22];
                case 12:
                    if (!(data.payload.taskType === "action")) return [3 /*break*/, 17];
                    return [4 /*yield*/, client
                            .from("nonConformanceActionTask")
                            .select("assignee,status, ...nonConformanceRequiredAction(name)")
                            .eq("id", taskId)
                            .single()];
                case 13:
                    task = _s.sent();
                    taskName = ((_j = task.data) === null || _j === void 0 ? void 0 : _j.name) || "";
                    if (!((_k = task.data) === null || _k === void 0 ? void 0 : _k.assignee)) return [3 /*break*/, 15];
                    return [4 /*yield*/, getSlackUserIdByCarbonId(client, slackAuth.slackToken, ((_l = task.data) === null || _l === void 0 ? void 0 : _l.assignee) || "")];
                case 14:
                    _d = _s.sent();
                    return [3 /*break*/, 16];
                case 15:
                    _d = null;
                    _s.label = 16;
                case 16:
                    assignee = _d;
                    return [3 /*break*/, 22];
                case 17:
                    if (!(data.payload.taskType === "approval")) return [3 /*break*/, 22];
                    return [4 /*yield*/, client
                            .from("nonConformanceApprovalTask")
                            .select("assignee, status, approvalType")
                            .eq("id", taskId)
                            .single()];
                case 18:
                    task = _s.sent();
                    taskName = ((_m = task.data) === null || _m === void 0 ? void 0 : _m.approvalType) || "";
                    if (!((_o = task.data) === null || _o === void 0 ? void 0 : _o.assignee)) return [3 /*break*/, 20];
                    return [4 /*yield*/, getSlackUserIdByCarbonId(client, slackAuth.slackToken, ((_p = task.data) === null || _p === void 0 ? void 0 : _p.assignee) || "")];
                case 19:
                    _e = _s.sent();
                    return [3 /*break*/, 21];
                case 20:
                    _e = "";
                    _s.label = 21;
                case 21:
                    assignee = _e;
                    _s.label = 22;
                case 22: return [4 /*yield*/, (0, trigger_1.trigger)("slack-document-task-update", {
                        assignee: assignee,
                        documentType: data.documentType,
                        documentId: data.documentId,
                        companyId: data.companyId,
                        taskName: taskName,
                        taskType: data.payload.taskType,
                        status: data.payload.status,
                        completedAt: data.payload.completedAt
                    })];
                case 23:
                    result = _s.sent();
                    return [3 /*break*/, 32];
                case 24:
                    previousAssignee = void 0;
                    newAssignee = void 0;
                    if (!data.payload.previousAssignee) return [3 /*break*/, 26];
                    return [4 /*yield*/, getSlackUserIdByCarbonId(client, slackAuth.slackToken, data.payload.previousAssignee || "")];
                case 25:
                    previousAssignee =
                        (_q = (_s.sent())) !== null && _q !== void 0 ? _q : undefined;
                    _s.label = 26;
                case 26:
                    if (!data.payload.newAssignee) return [3 /*break*/, 28];
                    return [4 /*yield*/, getSlackUserIdByCarbonId(client, slackAuth.slackToken, data.payload.newAssignee || "")];
                case 27:
                    newAssignee =
                        (_r = (_s.sent())) !== null && _r !== void 0 ? _r : undefined;
                    _s.label = 28;
                case 28: return [4 /*yield*/, (0, trigger_1.trigger)("slack-document-assignment-update", {
                        documentType: data.documentType,
                        documentId: data.documentId,
                        companyId: data.companyId,
                        previousAssignee: previousAssignee,
                        newAssignee: newAssignee !== null && newAssignee !== void 0 ? newAssignee : "",
                        updatedBy: slackAuth.slackUserId || data.payload.updatedBy
                    })];
                case 29:
                    result = _s.sent();
                    return [3 /*break*/, 32];
                case 30:
                    // For now, just log custom updates
                    console.log("Custom update for ".concat(data.documentType, ":"), data.payload);
                    return [2 /*return*/, { data: { success: true }, error: null }];
                case 31: throw new Error("Invalid type ".concat(data.type));
                case 32: return [2 /*return*/, { data: { success: true, taskId: result.ids[0] }, error: null }];
                case 33:
                    error_4 = _s.sent();
                    console.error("slack-document-sync error:", error_4);
                    return [2 /*return*/, {
                            data: null,
                            error: error_4 instanceof Error ? error_4.message : "Unknown error"
                        }];
                case 34: return [2 /*return*/, { data: null, error: null }];
            }
        });
    });
}
function syncDocumentCreatedToSlack(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, syncDocumentToSlack(client, {
                    documentType: data.documentType,
                    documentId: data.documentId,
                    companyId: data.companyId,
                    userId: data.userId,
                    type: "created",
                    payload: {
                        channelId: data.channelId,
                        threadTs: data.threadTs,
                        metadata: data.metadata
                    }
                })];
        });
    });
}
function syncDocumentStatusToSlack(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, syncDocumentToSlack(client, {
                    documentType: data.documentType,
                    documentId: data.documentId,
                    companyId: data.companyId,
                    userId: data.userId,
                    type: "status-update",
                    payload: {
                        previousStatus: data.previousStatus,
                        newStatus: data.newStatus,
                        updatedBy: data.userId,
                        reason: data.reason,
                        metadata: data.metadata
                    }
                })];
        });
    });
}
function syncDocumentAssignmentToSlack(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, syncDocumentToSlack(client, {
                    documentType: data.documentType,
                    documentId: data.documentId,
                    companyId: data.companyId,
                    userId: data.userId,
                    type: "assignment-update",
                    payload: {
                        previousAssignee: data.previousAssignee,
                        newAssignee: data.newAssignee,
                        updatedBy: data.userId,
                        metadata: data.metadata
                    }
                })];
        });
    });
}
function syncDocumentCustomToSlack(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, syncDocumentToSlack(client, {
                    documentType: data.documentType,
                    documentId: data.documentId,
                    companyId: data.companyId,
                    userId: data.userId,
                    type: "custom",
                    payload: __assign({ customType: data.customType }, data.payload)
                })];
        });
    });
}
function syncIssueStatusToSlack(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, syncDocumentStatusToSlack(client, {
                    documentType: "nonConformance",
                    documentId: data.nonConformanceId,
                    companyId: data.companyId,
                    userId: data.userId,
                    previousStatus: data.previousStatus,
                    newStatus: data.newStatus,
                    reason: data.reason
                })];
        });
    });
}
function syncIssueTaskToSlack(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, nonConformance, nonConformance, nonConformance;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    nonConformanceId = "";
                    if (!(data.taskType === "investigation")) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("nonConformanceInvestigationTask")
                            .select("nonConformanceId")
                            .eq("id", data.id)
                            .single()];
                case 1:
                    nonConformance = _d.sent();
                    nonConformanceId = ((_a = nonConformance.data) === null || _a === void 0 ? void 0 : _a.nonConformanceId) || "";
                    _d.label = 2;
                case 2:
                    if (!(data.taskType === "action")) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("nonConformanceActionTask")
                            .select("nonConformanceId")
                            .eq("id", data.id)
                            .single()];
                case 3:
                    nonConformance = _d.sent();
                    nonConformanceId = ((_b = nonConformance.data) === null || _b === void 0 ? void 0 : _b.nonConformanceId) || "";
                    _d.label = 4;
                case 4:
                    if (!(data.taskType === "review")) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("nonConformanceApprovalTask")
                            .select("nonConformanceId")
                            .eq("id", data.id)
                            .single()];
                case 5:
                    nonConformance = _d.sent();
                    nonConformanceId = ((_c = nonConformance.data) === null || _c === void 0 ? void 0 : _c.nonConformanceId) || "";
                    _d.label = 6;
                case 6: return [2 /*return*/, syncDocumentToSlack(client, {
                        documentType: "nonConformance",
                        documentId: nonConformanceId,
                        companyId: data.companyId,
                        userId: data.userId,
                        type: "task-update",
                        payload: {
                            taskId: data.id,
                            taskType: data.taskType,
                            status: data.status,
                            completedAt: data.completedAt
                        }
                    })];
            }
        });
    });
}
function syncIssueAssignmentToSlack(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, syncDocumentAssignmentToSlack(client, {
                    documentType: "nonConformance",
                    documentId: data.nonConformanceId,
                    companyId: data.companyId,
                    userId: data.userId,
                    previousAssignee: data.previousAssignee,
                    newAssignee: data.newAssignee
                })];
        });
    });
}
function updateSlackDocumentThread(client, id, updates) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("slackDocumentThread")
                    .update(__assign(__assign({}, updates), { updatedAt: new Date().toISOString() }))
                    .eq("id", id)
                    .select("*")
                    .single()];
        });
    });
}
