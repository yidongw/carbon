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
exports.jiraSyncFunction = exports.syncIssueFromJiraSchema = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var jira_server_1 = require("@carbon/ee/jira.server");
var schemas_js_1 = require("../../../schemas.js");
Object.defineProperty(exports, "syncIssueFromJiraSchema", { enumerable: true, get: function () { return schemas_js_1.syncIssueFromJiraSchema; } });
var client_1 = require("../../client");
exports.jiraSyncFunction = client_1.inngest.createFunction({ id: "sync-issue-from-jira", retries: 1 }, { event: "carbon/jira-sync" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var jira, payload, carbon, _c, company, integration, issueId, mapping, actionId, fullIssue, siteUrl, assignee, employees, updated;
    var _d;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                jira = (0, jira_server_1.getJiraClient)();
                payload = schemas_js_1.syncIssueFromJiraSchema.parse(event.data);
                console.info("Jira webhook received");
                console.info("Event type: ".concat(payload.event.webhookEvent));
                // Only handle issue_updated events
                if (payload.event.webhookEvent !== "jira:issue_updated" &&
                    payload.event.webhookEvent !== "issue_updated") {
                    return [2 /*return*/, {
                            success: true,
                            message: "Ignoring event type: ".concat(payload.event.webhookEvent)
                        }];
                }
                if (!payload.event.issue) {
                    return [2 /*return*/, {
                            success: false,
                            message: "No issue data in webhook payload"
                        }];
                }
                carbon = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, Promise.all([
                        carbon.from("company").select("*").eq("id", payload.companyId).single(),
                        carbon
                            .from("companyIntegration")
                            .select("*")
                            .eq("companyId", payload.companyId)
                            .eq("id", "jira")
                            .single()
                    ])];
            case 1:
                _c = _e.sent(), company = _c[0], integration = _c[1];
                if (company.error || !company.data) {
                    throw new Error("Failed to fetch company from Carbon");
                }
                if (integration.error || !integration.data) {
                    throw new Error("Failed to fetch integration from Carbon");
                }
                issueId = payload.event.issue.id;
                return [4 /*yield*/, carbon
                        .from("externalIntegrationMapping")
                        .select("entityId")
                        .eq("entityType", "nonConformanceActionTask")
                        .eq("integration", "jira")
                        .eq("externalId", issueId)
                        .eq("companyId", payload.companyId)
                        .maybeSingle()];
            case 2:
                mapping = _e.sent();
                if (!mapping.data) {
                    return [2 /*return*/, {
                            success: false,
                            message: "No linked action found for Jira issue ID ".concat(issueId)
                        }];
                }
                actionId = mapping.data.entityId;
                return [4 /*yield*/, jira.getIssue(payload.companyId, issueId)];
            case 3:
                fullIssue = _e.sent();
                if (!fullIssue) {
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to fetch issue ".concat(issueId, " from Jira")
                        }];
                }
                return [4 /*yield*/, jira.getSiteUrl(payload.companyId)];
            case 4:
                siteUrl = _e.sent();
                assignee = null;
                if (!((_d = fullIssue.fields.assignee) === null || _d === void 0 ? void 0 : _d.emailAddress)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, jira_server_1.getCompanyEmployees)(carbon, payload.companyId, [
                        fullIssue.fields.assignee.emailAddress
                    ])];
            case 5:
                employees = _e.sent();
                assignee = employees.length > 0 ? employees[0].userId : null;
                _e.label = 6;
            case 6: return [4 /*yield*/, (0, jira_server_1.linkActionToJiraIssue)(carbon, payload.companyId, {
                    actionId: actionId,
                    issue: fullIssue,
                    siteUrl: siteUrl,
                    assignee: assignee,
                    syncNotes: true
                })];
            case 7:
                updated = _e.sent();
                if (!updated || updated.error) {
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to update action for Jira issue ID ".concat(issueId)
                        }];
                }
                return [2 /*return*/, {
                        success: true,
                        message: "Synced Jira issue ".concat(fullIssue.key)
                    }];
        }
    });
}); });
