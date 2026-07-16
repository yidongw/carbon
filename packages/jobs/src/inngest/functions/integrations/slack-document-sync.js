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
exports.slackDocumentAssignmentUpdateFunction = exports.slackDocumentTaskUpdateFunction = exports.slackDocumentStatusUpdateFunction = exports.slackDocumentCreatedFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var messages_1 = require("@carbon/ee/slack/messages");
var env_1 = require("@carbon/env");
var web_api_1 = require("@slack/web-api");
var client_1 = require("../../client");
exports.slackDocumentCreatedFunction = client_1.inngest.createFunction({ id: "slack-document-created", retries: 1 }, { event: "carbon/slack-document-created" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, documentType, documentId, companyId, channelId, threadTs, serviceRole, documentData, integration, slackToken, baseUrl, error_1;
    var _d;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _c = event.data, documentType = _c.documentType, documentId = _c.documentId, companyId = _c.companyId, channelId = _c.channelId, threadTs = _c.threadTs;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
            case 2:
                serviceRole = _e.sent();
                return [4 /*yield*/, getDocumentData(serviceRole, documentType, documentId, companyId)];
            case 3:
                documentData = _e.sent();
                if (!documentData) {
                    throw new Error("".concat(documentType, " ").concat(documentId, " not found"));
                }
                return [4 /*yield*/, serviceRole
                        .from("companyIntegration")
                        .select("metadata")
                        .eq("id", "slack")
                        .eq("companyId", companyId)
                        .single()];
            case 4:
                integration = (_e.sent()).data;
                if (!(integration === null || integration === void 0 ? void 0 : integration.metadata)) {
                    throw new Error("Slack integration not found");
                }
                slackToken = (_d = integration.metadata) === null || _d === void 0 ? void 0 : _d.access_token;
                baseUrl = env_1.VERCEL_URL || "http://localhost:3000";
                return [4 /*yield*/, postToSlackThread({
                        token: slackToken,
                        channelId: channelId,
                        threadTs: threadTs,
                        blocks: (0, messages_1.formatDocumentCreated)(documentData, baseUrl)
                    })];
            case 5:
                _e.sent();
                return [2 /*return*/, { success: true }];
            case 6:
                error_1 = _e.sent();
                console.error("Error posting ".concat(documentType, " to Slack:"), error_1);
                throw error_1;
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.slackDocumentStatusUpdateFunction = client_1.inngest.createFunction({ id: "slack-document-status-update", retries: 1 }, { event: "carbon/slack-document-status-update" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, documentType, documentId, companyId, previousStatus, newStatus, updatedBy, reason, serviceRole, thread, integration, slackToken, documentData, statusUpdate, error_2;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _c = event.data, documentType = _c.documentType, documentId = _c.documentId, companyId = _c.companyId, previousStatus = _c.previousStatus, newStatus = _c.newStatus, updatedBy = _c.updatedBy, reason = _c.reason;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
            case 2:
                serviceRole = _d.sent();
                return [4 /*yield*/, serviceRole
                        .from("slackDocumentThread")
                        .select("channelId, threadTs")
                        .eq("documentType", documentType)
                        .eq("documentId", documentId)
                        .eq("companyId", companyId)
                        .single()];
            case 3:
                thread = (_d.sent()).data;
                if (!thread) {
                    return [2 /*return*/, { success: true, message: "No Slack thread found" }];
                }
                return [4 /*yield*/, serviceRole
                        .from("companyIntegration")
                        .select("metadata")
                        .eq("id", "slack")
                        .eq("companyId", companyId)
                        .single()];
            case 4:
                integration = (_d.sent()).data;
                if (!(integration === null || integration === void 0 ? void 0 : integration.metadata)) {
                    throw new Error("Slack integration not found");
                }
                slackToken = integration.metadata.access_token;
                return [4 /*yield*/, getDocumentData(serviceRole, documentType, documentId, companyId)];
            case 5:
                documentData = _d.sent();
                if (!documentData) {
                    throw new Error("".concat(documentType, " ").concat(documentId, " not found"));
                }
                statusUpdate = {
                    previousStatus: previousStatus,
                    newStatus: newStatus,
                    updatedBy: updatedBy,
                    reason: reason
                };
                return [4 /*yield*/, postToSlackThread({
                        token: slackToken,
                        channelId: thread.channelId,
                        threadTs: thread.threadTs,
                        blocks: (0, messages_1.formatStatusUpdate)(documentType, documentData.readableId, statusUpdate)
                    })];
            case 6:
                _d.sent();
                return [2 /*return*/, { success: true }];
            case 7:
                error_2 = _d.sent();
                console.error("Error posting ".concat(documentType, " status update to Slack:"), error_2);
                throw error_2;
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.slackDocumentTaskUpdateFunction = client_1.inngest.createFunction({ id: "slack-document-task-update", retries: 1 }, { event: "carbon/slack-document-task-update" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, documentType, documentId, companyId, taskType, taskName, status, assignee, completedAt, serviceRole, thread, integration, slackToken, documentData, taskUpdate, error_3;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _c = event.data, documentType = _c.documentType, documentId = _c.documentId, companyId = _c.companyId, taskType = _c.taskType, taskName = _c.taskName, status = _c.status, assignee = _c.assignee, completedAt = _c.completedAt;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
            case 2:
                serviceRole = _d.sent();
                return [4 /*yield*/, serviceRole
                        .from("slackDocumentThread")
                        .select("channelId, threadTs")
                        .eq("documentType", documentType)
                        .eq("documentId", documentId)
                        .eq("companyId", companyId)
                        .single()];
            case 3:
                thread = (_d.sent()).data;
                if (!thread) {
                    return [2 /*return*/, { success: true, message: "No Slack thread found" }];
                }
                return [4 /*yield*/, serviceRole
                        .from("companyIntegration")
                        .select("metadata")
                        .eq("id", "slack")
                        .eq("companyId", companyId)
                        .single()];
            case 4:
                integration = (_d.sent()).data;
                if (!(integration === null || integration === void 0 ? void 0 : integration.metadata)) {
                    throw new Error("Slack integration not found");
                }
                slackToken = integration.metadata.access_token;
                return [4 /*yield*/, getDocumentData(serviceRole, documentType, documentId, companyId)];
            case 5:
                documentData = _d.sent();
                if (!documentData) {
                    throw new Error("".concat(documentType, " ").concat(documentId, " not found"));
                }
                taskUpdate = {
                    taskType: taskType,
                    taskName: taskName,
                    status: status,
                    assignee: assignee,
                    completedAt: completedAt
                };
                return [4 /*yield*/, postToSlackThread({
                        token: slackToken,
                        channelId: thread.channelId,
                        threadTs: thread.threadTs,
                        blocks: (0, messages_1.formatTaskUpdate)(documentType, documentData.readableId, taskUpdate)
                    })];
            case 6:
                _d.sent();
                return [2 /*return*/, { success: true }];
            case 7:
                error_3 = _d.sent();
                console.error("Error posting ".concat(documentType, " task update to Slack:"), error_3);
                throw error_3;
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.slackDocumentAssignmentUpdateFunction = client_1.inngest.createFunction({ id: "slack-document-assignment-update", retries: 1 }, { event: "carbon/slack-document-assignment-update" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, documentType, documentId, companyId, previousAssignee, newAssignee, updatedBy, serviceRole, thread, integration, slackToken, documentData, assignmentUpdate, error_4;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _c = event.data, documentType = _c.documentType, documentId = _c.documentId, companyId = _c.companyId, previousAssignee = _c.previousAssignee, newAssignee = _c.newAssignee, updatedBy = _c.updatedBy;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
            case 2:
                serviceRole = _d.sent();
                return [4 /*yield*/, serviceRole
                        .from("slackDocumentThread")
                        .select("channelId, threadTs")
                        .eq("documentType", documentType)
                        .eq("documentId", documentId)
                        .eq("companyId", companyId)
                        .single()];
            case 3:
                thread = (_d.sent()).data;
                if (!thread) {
                    return [2 /*return*/, { success: true, message: "No Slack thread found" }];
                }
                return [4 /*yield*/, serviceRole
                        .from("companyIntegration")
                        .select("metadata")
                        .eq("id", "slack")
                        .eq("companyId", companyId)
                        .single()];
            case 4:
                integration = (_d.sent()).data;
                if (!(integration === null || integration === void 0 ? void 0 : integration.metadata)) {
                    throw new Error("Slack integration not found");
                }
                slackToken = integration.metadata.access_token;
                return [4 /*yield*/, getDocumentData(serviceRole, documentType, documentId, companyId)];
            case 5:
                documentData = _d.sent();
                if (!documentData) {
                    throw new Error("".concat(documentType, " ").concat(documentId, " not found"));
                }
                assignmentUpdate = {
                    previousAssignee: previousAssignee,
                    newAssignee: newAssignee,
                    updatedBy: updatedBy
                };
                return [4 /*yield*/, postToSlackThread({
                        token: slackToken,
                        channelId: thread.channelId,
                        threadTs: thread.threadTs,
                        blocks: (0, messages_1.formatAssignmentUpdate)(documentType, documentData.readableId, assignmentUpdate)
                    })];
            case 6:
                _d.sent();
                return [2 /*return*/, { success: true }];
            case 7:
                error_4 = _d.sent();
                console.error("Error posting ".concat(documentType, " assignment update to Slack:"), error_4);
                throw error_4;
            case 8: return [2 /*return*/];
        }
    });
}); });
function getDocumentData(serviceRole, documentType, documentId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, data, data, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = documentType;
                    switch (_a) {
                        case "nonConformance": return [3 /*break*/, 1];
                        case "quote": return [3 /*break*/, 3];
                        case "salesOrder": return [3 /*break*/, 5];
                        case "job": return [3 /*break*/, 7];
                        case "purchaseOrder": return [3 /*break*/, 9];
                        case "invoice": return [3 /*break*/, 9];
                        case "receipt": return [3 /*break*/, 9];
                        case "shipment": return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 9];
                case 1: return [4 /*yield*/, serviceRole
                        .from("nonConformance")
                        .select("*")
                        .eq("id", documentId)
                        .eq("companyId", companyId)
                        .single()];
                case 2:
                    data = (_b.sent()).data;
                    if (!data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            documentType: "nonConformance",
                            id: data.id,
                            readableId: data.nonConformanceId,
                            nonConformanceId: data.nonConformanceId,
                            title: data.name,
                            description: data.description,
                            status: data.status,
                            createdBy: data.createdBy,
                            createdAt: data.createdAt
                        }];
                case 3: return [4 /*yield*/, serviceRole
                        .from("quote")
                        .select("id, quoteId, customerReference, status, createdBy, createdAt")
                        .eq("id", documentId)
                        .eq("companyId", companyId)
                        .single()];
                case 4:
                    data = (_b.sent()).data;
                    if (!data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            documentType: "quote",
                            id: data.id,
                            readableId: data.quoteId,
                            title: data.customerReference,
                            description: data.customerReference,
                            status: data.status,
                            createdBy: data.createdBy,
                            createdAt: data.createdAt
                        }];
                case 5: return [4 /*yield*/, serviceRole
                        .from("salesOrder")
                        .select("id, salesOrderId, customerReference, status, createdBy, createdAt")
                        .eq("id", documentId)
                        .eq("companyId", companyId)
                        .single()];
                case 6:
                    data = (_b.sent()).data;
                    if (!data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            documentType: "salesOrder",
                            id: data.id,
                            readableId: data.salesOrderId,
                            title: data.customerReference,
                            description: data.customerReference,
                            status: data.status,
                            createdBy: data.createdBy,
                            createdAt: data.createdAt
                        }];
                case 7: return [4 /*yield*/, serviceRole
                        .from("job")
                        .select("id, jobId, status, createdBy, createdAt")
                        .eq("id", documentId)
                        .eq("companyId", companyId)
                        .single()];
                case 8:
                    data = (_b.sent()).data;
                    if (!data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            documentType: "job",
                            id: data.id,
                            readableId: data.jobId,
                            title: data.jobId,
                            description: data.jobId,
                            status: data.status,
                            createdBy: data.createdBy,
                            createdAt: data.createdAt
                        }];
                case 9:
                    console.warn("Document type ".concat(documentType, " not yet implemented"));
                    return [2 /*return*/, null];
            }
        });
    });
}
function postToSlackThread(params) {
    return __awaiter(this, void 0, void 0, function () {
        var token, channelId, threadTs, blocks, text, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = params.token, channelId = params.channelId, threadTs = params.threadTs, blocks = params.blocks, text = params.text;
                    client = new web_api_1.WebClient(token);
                    return [4 /*yield*/, client.chat.postMessage({
                            channel: channelId,
                            thread_ts: threadTs,
                            blocks: blocks,
                            text: text || "Update from Carbon"
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
