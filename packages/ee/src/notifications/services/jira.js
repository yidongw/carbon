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
exports.JiraNotificationService = void 0;
var auth_1 = require("@carbon/auth");
var index_server_1 = require("../../jira/lib/index.server");
var jira = (0, index_server_1.getJiraClient)();
/**
 * Jira Notification Service
 * Updates Jira issues based on Carbon notification events
 */
var JiraNotificationService = /** @class */ (function () {
    function JiraNotificationService() {
        this.id = "jira";
        this.name = "Jira";
    }
    JiraNotificationService.prototype.send = function (event, context) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, issue, targetCategory, issue, user, jiraUser, issue, notes, description, e_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = event.type;
                        switch (_a) {
                            case "task.status.changed": return [3 /*break*/, 1];
                            case "task.assigned": return [3 /*break*/, 4];
                            case "task.notes.changed": return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 15];
                    case 1:
                        if (!event.data.type ||
                            !["action", "investigation"].includes(event.data.type))
                            return [2 /*return*/];
                        return [4 /*yield*/, (0, index_server_1.getJiraIssueFromExternalId)(context.serviceRole, event.companyId, event.data.id)];
                    case 2:
                        issue = _c.sent();
                        if (!issue)
                            return [2 /*return*/];
                        targetCategory = (0, index_server_1.mapCarbonStatusToJiraCategory)(event.data.status);
                        return [4 /*yield*/, jira.transitionIssue(event.companyId, issue.id, targetCategory)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 15];
                    case 4:
                        if (event.data.table !== "nonConformanceActionTask")
                            return [2 /*return*/];
                        return [4 /*yield*/, (0, index_server_1.getJiraIssueFromExternalId)(context.serviceRole, event.companyId, event.data.id)];
                    case 5:
                        issue = _c.sent();
                        if (!issue)
                            return [2 /*return*/]; // No linked Jira issue
                        return [4 /*yield*/, (0, auth_1.getUser)(context.serviceRole, event.data.assignee)];
                    case 6:
                        user = (_c.sent()).data;
                        if (!user)
                            return [2 /*return*/]; // No assignee user
                        return [4 /*yield*/, jira.findUserByEmail(event.companyId, (_b = user.email) !== null && _b !== void 0 ? _b : "")];
                    case 7:
                        jiraUser = _c.sent();
                        if (!jiraUser)
                            return [2 /*return*/];
                        return [4 /*yield*/, jira.updateIssue(event.companyId, issue.id, {
                                assigneeId: jiraUser.accountId
                            })];
                    case 8:
                        _c.sent();
                        return [3 /*break*/, 15];
                    case 9:
                        if (event.data.table !== "nonConformanceActionTask")
                            return [2 /*return*/];
                        return [4 /*yield*/, (0, index_server_1.getJiraIssueFromExternalId)(context.serviceRole, event.companyId, event.data.id)];
                    case 10:
                        issue = _c.sent();
                        if (!issue)
                            return [2 /*return*/]; // No linked Jira issue
                        notes = event.data.notes;
                        if (!notes)
                            return [2 /*return*/];
                        _c.label = 11;
                    case 11:
                        _c.trys.push([11, 13, , 14]);
                        description = (0, index_server_1.tiptapToAdf)(notes);
                        return [4 /*yield*/, jira.updateIssue(event.companyId, issue.id, {
                                description: description
                            })];
                    case 12:
                        _c.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        e_1 = _c.sent();
                        console.error("Failed to sync notes to Jira:", e_1);
                        return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return JiraNotificationService;
}());
exports.JiraNotificationService = JiraNotificationService;
