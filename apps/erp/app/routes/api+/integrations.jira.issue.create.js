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
exports.loader = exports.action = void 0;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var jira_server_1 = require("@carbon/ee/jira.server");
var react_router_1 = require("react-router");
var quality_service_1 = require("~/modules/quality/quality.service");
var jira = (0, jira_server_1.getJiraClient)();
var action = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var formData, _c, companyId, client, actionId, projectKey, issueTypeId, summary, description, assigneeId, _d, carbonIssue, siteUrl, adfDescription, notes, tiptapDoc, issue, linked, nonConformanceId, url, error_1;
    var _e, _f, _g, _h, _j, _k;
    var request = _b.request;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _l.trys.push([0, 7, , 8]);
                return [4 /*yield*/, request.formData()];
            case 1:
                formData = _l.sent();
                return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
            case 2:
                _c = _l.sent(), companyId = _c.companyId, client = _c.client;
                actionId = formData.get("actionId");
                projectKey = formData.get("projectKey");
                issueTypeId = formData.get("issueTypeId");
                summary = formData.get("title");
                description = formData.get("description");
                assigneeId = formData.get("assignee");
                if (!actionId || !projectKey || !issueTypeId || !summary) {
                    return [2 /*return*/, (0, react_router_1.data)({
                            success: false,
                            message: "Missing required fields: actionId, projectKey, issueTypeId, title"
                        }, { status: 400 })];
                }
                return [4 /*yield*/, Promise.all([
                        (0, quality_service_1.getIssueAction)(client, actionId),
                        jira.getSiteUrl(companyId)
                    ])];
            case 3:
                _d = _l.sent(), carbonIssue = _d[0], siteUrl = _d[1];
                adfDescription = undefined;
                notes = (_e = carbonIssue.data) === null || _e === void 0 ? void 0 : _e.notes;
                if (notes && typeof notes === "object") {
                    try {
                        adfDescription = (0, jira_server_1.tiptapToAdf)(notes);
                    }
                    catch (e) {
                        console.error("Failed to convert notes to ADF:", e);
                    }
                }
                if (!adfDescription && description) {
                    try {
                        tiptapDoc = JSON.parse(description);
                        adfDescription = (0, jira_server_1.tiptapToAdf)(tiptapDoc);
                    }
                    catch (_m) {
                        adfDescription = {
                            version: 1,
                            type: "doc",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [{ type: "text", text: description }]
                                }
                            ]
                        };
                    }
                }
                return [4 /*yield*/, jira.createIssue(companyId, {
                        projectKey: projectKey,
                        issueTypeId: issueTypeId,
                        summary: summary,
                        description: adfDescription,
                        assigneeId: assigneeId || undefined
                    })];
            case 4:
                issue = _l.sent();
                if (!issue) {
                    return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to create Jira issue" }, { status: 500 })];
                }
                return [4 /*yield*/, (0, jira_server_1.linkActionToJiraIssue)(client, companyId, {
                        actionId: actionId,
                        issue: issue,
                        siteUrl: siteUrl
                    })];
            case 5:
                linked = _l.sent();
                if (!linked || ((_f = linked.data) === null || _f === void 0 ? void 0 : _f.length) === 0) {
                    return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to link issue" }, { status: 500 })];
                }
                nonConformanceId = (_g = linked.data) === null || _g === void 0 ? void 0 : _g[0].nonConformanceId;
                url = (0, auth_1.getAppUrl)() + "/x/issue/".concat(nonConformanceId, "/details");
                // Create a remote link in Jira pointing back to Carbon
                return [4 /*yield*/, jira.createRemoteLink(companyId, issue.id, url, "Linked Carbon Issue: ".concat((_k = (_j = (_h = carbonIssue.data) === null || _h === void 0 ? void 0 : _h.nonConformance) === null || _j === void 0 ? void 0 : _j.nonConformanceId) !== null && _k !== void 0 ? _k : ""))];
            case 6:
                // Create a remote link in Jira pointing back to Carbon
                _l.sent();
                return [2 /*return*/, { success: true, message: "Jira issue created" }];
            case 7:
                error_1 = _l.sent();
                console.error("Jira issue action error:", error_1);
                return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to create issue" }, { status: 400 })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.action = action;
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, companyId, client, url, projectKey, projects, _d, issueTypes, members, memberEmails, employees_1, filteredMembers;
    var request = _b.request;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
            case 1:
                _c = _e.sent(), companyId = _c.companyId, client = _c.client;
                url = new URL(request.url);
                projectKey = url.searchParams.get("projectKey");
                return [4 /*yield*/, jira.listProjects(companyId)];
            case 2:
                projects = _e.sent();
                if (!projectKey) return [3 /*break*/, 5];
                return [4 /*yield*/, Promise.all([
                        jira.getIssueTypes(companyId, projectKey),
                        jira.listProjectUsers(companyId, projectKey)
                    ])];
            case 3:
                _d = _e.sent(), issueTypes = _d[0], members = _d[1];
                memberEmails = members
                    .map(function (m) { return m.emailAddress; })
                    .filter(function (e) { return !!e; });
                return [4 /*yield*/, (0, jira_server_1.getCompanyEmployees)(client, companyId, memberEmails)];
            case 4:
                employees_1 = _e.sent();
                filteredMembers = members.filter(function (m) {
                    return employees_1.some(function (e) {
                        var _a;
                        if (!((_a = e.user) === null || _a === void 0 ? void 0 : _a.email) || !m.emailAddress)
                            return false;
                        return e.user.email.toLowerCase() === m.emailAddress.toLowerCase();
                    });
                });
                return [2 /*return*/, {
                        projects: projects,
                        issueTypes: issueTypes,
                        members: filteredMembers
                    }];
            case 5: return [2 /*return*/, { projects: projects }];
        }
    });
}); };
exports.loader = loader;
