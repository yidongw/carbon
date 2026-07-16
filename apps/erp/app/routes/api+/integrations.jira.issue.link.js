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
    var _c, companyId, client, form, actionId, _d, issueId, _e, carbonIssue, issue, siteUrl, email, assigneeId, assignee, linked, nonConformanceId, url, notes, adfDescription, e_1, mapping, unlinked, remoteLinks, carbonLink, e_2, error_1;
    var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var request = _b.request;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                _r.trys.push([0, 23, , 24]);
                return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
            case 1:
                _c = _r.sent(), companyId = _c.companyId, client = _c.client;
                return [4 /*yield*/, request.formData()];
            case 2:
                form = _r.sent();
                actionId = form.get("actionId");
                if (!actionId) {
                    return [2 /*return*/, { success: false, message: "Missing required fields: actionId" }];
                }
                _d = request.method;
                switch (_d) {
                    case "POST": return [3 /*break*/, 3];
                    case "DELETE": return [3 /*break*/, 13];
                }
                return [3 /*break*/, 22];
            case 3:
                issueId = form.get("issueId");
                if (!issueId) {
                    return [2 /*return*/, {
                            success: false,
                            message: "Missing required fields: issueId"
                        }];
                }
                return [4 /*yield*/, Promise.all([
                        (0, quality_service_1.getIssueAction)(client, actionId),
                        jira.getIssue(companyId, issueId),
                        jira.getSiteUrl(companyId)
                    ])];
            case 4:
                _e = _r.sent(), carbonIssue = _e[0], issue = _e[1], siteUrl = _e[2];
                if (!issue) {
                    return [2 /*return*/, { success: false, message: "Issue not found" }];
                }
                email = (_g = (_f = issue.fields.assignee) === null || _f === void 0 ? void 0 : _f.emailAddress) !== null && _g !== void 0 ? _g : "";
                assigneeId = null;
                if (!email) return [3 /*break*/, 6];
                return [4 /*yield*/, client
                        .from("user")
                        .select("id")
                        .eq("email", email)
                        .single()];
            case 5:
                assignee = _r.sent();
                assigneeId = (_j = (_h = assignee.data) === null || _h === void 0 ? void 0 : _h.id) !== null && _j !== void 0 ? _j : null;
                _r.label = 6;
            case 6: return [4 /*yield*/, (0, jira_server_1.linkActionToJiraIssue)(client, companyId, {
                    actionId: actionId,
                    issue: issue,
                    siteUrl: siteUrl,
                    assignee: assigneeId
                })];
            case 7:
                linked = _r.sent();
                if (!linked || ((_k = linked.data) === null || _k === void 0 ? void 0 : _k.length) === 0) {
                    return [2 /*return*/, { success: false, message: "Failed to link issue" }];
                }
                nonConformanceId = (_l = linked.data) === null || _l === void 0 ? void 0 : _l[0].nonConformanceId;
                url = (0, auth_1.getAppUrl)() + "/x/issue/".concat(nonConformanceId, "/details");
                notes = (_m = carbonIssue.data) === null || _m === void 0 ? void 0 : _m.notes;
                if (!(notes && typeof notes === "object")) return [3 /*break*/, 11];
                _r.label = 8;
            case 8:
                _r.trys.push([8, 10, , 11]);
                adfDescription = (0, jira_server_1.tiptapToAdf)(notes);
                return [4 /*yield*/, jira.updateIssue(companyId, issue.id, {
                        description: adfDescription
                    })];
            case 9:
                _r.sent();
                return [3 /*break*/, 11];
            case 10:
                e_1 = _r.sent();
                console.error("Failed to update Jira issue description:", e_1);
                return [3 /*break*/, 11];
            case 11: 
            // Create a remote link in Jira pointing back to Carbon
            return [4 /*yield*/, jira.createRemoteLink(companyId, issue.id, url, "Linked Carbon Issue: ".concat((_q = (_p = (_o = carbonIssue.data) === null || _o === void 0 ? void 0 : _o.nonConformance) === null || _p === void 0 ? void 0 : _p.nonConformanceId) !== null && _q !== void 0 ? _q : ""))];
            case 12:
                // Create a remote link in Jira pointing back to Carbon
                _r.sent();
                return [2 /*return*/, { success: true, message: "Linked successfully" }];
            case 13: return [4 /*yield*/, (0, jira_server_1.getJiraIssueFromExternalId)(client, companyId, actionId)];
            case 14:
                mapping = _r.sent();
                return [4 /*yield*/, (0, jira_server_1.unlinkActionFromJiraIssue)(client, companyId, {
                        actionId: actionId
                    })];
            case 15:
                unlinked = _r.sent();
                if (unlinked.error) {
                    return [2 /*return*/, { success: false, message: "Failed to unlink issue" }];
                }
                if (!mapping) return [3 /*break*/, 21];
                _r.label = 16;
            case 16:
                _r.trys.push([16, 20, , 21]);
                return [4 /*yield*/, jira.getRemoteLinks(companyId, mapping.id)];
            case 17:
                remoteLinks = _r.sent();
                carbonLink = remoteLinks.find(function (link) {
                    var _a;
                    return ((_a = link.application) === null || _a === void 0 ? void 0 : _a.name) === "Carbon" ||
                        link.globalId.startsWith("carbon-");
                });
                if (!carbonLink) return [3 /*break*/, 19];
                return [4 /*yield*/, jira.deleteRemoteLink(companyId, mapping.id, carbonLink.globalId)];
            case 18:
                _r.sent();
                _r.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                e_2 = _r.sent();
                console.error("Failed to clean up Jira remote link:", e_2);
                return [3 /*break*/, 21];
            case 21: return [2 /*return*/, { success: true, message: "Unlinked successfully" }];
            case 22: return [3 /*break*/, 24];
            case 23:
                error_1 = _r.sent();
                console.error("Jira issue link action error:", error_1);
                return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to process request" }, { status: 400 })];
            case 24: return [2 /*return*/];
        }
    });
}); };
exports.action = action;
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var companyId, url, query, issues;
    var request = _b.request;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
            case 1:
                companyId = (_c.sent()).companyId;
                url = new URL(request.url);
                query = url.searchParams.get("search");
                if (!query || query.trim().length === 0) {
                    return [2 /*return*/, { issues: [] }];
                }
                return [4 /*yield*/, jira.searchIssues(companyId, query)];
            case 2:
                issues = _c.sent();
                return [2 /*return*/, { issues: issues }];
        }
    });
}); };
exports.loader = loader;
