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
var linear_server_1 = require("@carbon/ee/linear.server");
var react_router_1 = require("react-router");
var quality_service_1 = require("~/modules/quality/quality.service");
var linear = (0, linear_server_1.getLinearClient)();
var action = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, companyId, client, form, actionId, _d, issueId, _e, carbonIssue, issue, email, assignee, linked, nonConformanceId, url, unlinked, action_1, found, e_1, error_1;
    var _f, _g, _h, _j, _k, _l, _m;
    var request = _b.request;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                _o.trys.push([0, 18, , 19]);
                return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
            case 1:
                _c = _o.sent(), companyId = _c.companyId, client = _c.client;
                return [4 /*yield*/, request.formData()];
            case 2:
                form = _o.sent();
                actionId = form.get("actionId");
                if (!actionId) {
                    return [2 /*return*/, { success: false, message: "Missing required fields: actionId" }];
                }
                _d = request.method;
                switch (_d) {
                    case "POST": return [3 /*break*/, 3];
                    case "DELETE": return [3 /*break*/, 8];
                }
                return [3 /*break*/, 17];
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
                        linear.getIssueById(companyId, issueId)
                    ])];
            case 4:
                _e = _o.sent(), carbonIssue = _e[0], issue = _e[1];
                if (!issue) {
                    return [2 /*return*/, { success: false, message: "Issue not found" }];
                }
                email = (_g = (_f = issue.assignee) === null || _f === void 0 ? void 0 : _f.email) !== null && _g !== void 0 ? _g : "";
                return [4 /*yield*/, client
                        .from("user")
                        .select("id")
                        .eq("email", email)
                        .single()];
            case 5:
                assignee = _o.sent();
                return [4 /*yield*/, (0, linear_server_1.linkActionToLinearIssue)(client, companyId, {
                        actionId: actionId,
                        issue: issue,
                        assignee: assignee.data ? assignee.data.id : null
                    })];
            case 6:
                linked = _o.sent();
                if (!linked || ((_h = linked.data) === null || _h === void 0 ? void 0 : _h.length) === 0) {
                    return [2 /*return*/, { success: false, message: "Failed to link issue" }];
                }
                nonConformanceId = (_j = linked.data) === null || _j === void 0 ? void 0 : _j[0].nonConformanceId;
                url = (0, auth_1.getAppUrl)() + "/x/issue/".concat(nonConformanceId, "/details");
                return [4 /*yield*/, linear.createAttachmentLink(companyId, {
                        issueId: issue.id,
                        url: url,
                        title: "Linked Carbon Issue: ".concat((_m = (_l = (_k = carbonIssue.data) === null || _k === void 0 ? void 0 : _k.nonConformance) === null || _l === void 0 ? void 0 : _l.nonConformanceId) !== null && _m !== void 0 ? _m : "")
                    })];
            case 7:
                _o.sent();
                return [2 /*return*/, { success: true, message: "Linked successfully" }];
            case 8: return [4 /*yield*/, (0, linear_server_1.unlinkActionFromLinearIssue)(client, companyId, {
                    actionId: actionId
                })];
            case 9:
                unlinked = _o.sent();
                if (unlinked.error) {
                    return [2 /*return*/, { success: false, message: "Failed to unlink issue" }];
                }
                _o.label = 10;
            case 10:
                _o.trys.push([10, 15, , 16]);
                return [4 /*yield*/, (0, quality_service_1.getIssueAction)(client, actionId)];
            case 11:
                action_1 = (_o.sent()).data;
                if (!(action_1 === null || action_1 === void 0 ? void 0 : action_1.nonConformanceId)) return [3 /*break*/, 14];
                return [4 /*yield*/, linear.listAttachments(companyId, action_1.nonConformanceId)];
            case 12:
                found = (_o.sent())[0];
                if (!found) return [3 /*break*/, 14];
                return [4 /*yield*/, linear.removeAttachment(companyId, found.id)];
            case 13:
                _o.sent();
                _o.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                e_1 = _o.sent();
                console.error("Failed to clean up Linear attachment:", e_1);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/, { success: true, message: "Unlinked successfully" }];
            case 17: return [3 /*break*/, 19];
            case 18:
                error_1 = _o.sent();
                console.error("Linear issue link action error:", error_1);
                return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to process request" }, { status: 400 })];
            case 19: return [2 /*return*/];
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
                return [4 /*yield*/, linear.listIssues(companyId, query)];
            case 2:
                issues = _c.sent();
                return [2 /*return*/, { issues: issues }];
        }
    });
}); };
exports.loader = loader;
