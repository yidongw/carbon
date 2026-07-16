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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var pdf_1 = require("@carbon/documents/pdf");
var template_1 = require("@carbon/documents/template");
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var quality_1 = require("~/modules/quality");
var settings_1 = require("~/modules/settings");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, _d, company, nonConformance, nonConformanceTypes, actionTasks, approvalTasks, reviewers, requiredActions, items, associations, actionTaskIds, jobOperationStepRecords, _e, operationIds, jobOperations, _f, operationToJobId, uniqueUsers, userNames, userResults, locale, documentTemplate, templateConfig, resolved, sections, stream, body, headers;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality"
                    })];
                case 1:
                    _c = _w.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find issue id");
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(client, companyId),
                            (0, quality_1.getIssue)(client, id),
                            (0, quality_1.getIssueTypes)(client, companyId),
                            (0, quality_1.getIssueActionTasks)(client, id, companyId),
                            (0, quality_1.getIssueApprovalTasks)(client, id, companyId),
                            (0, quality_1.getIssueReviewers)(client, id, companyId),
                            (0, quality_1.getRequiredActionsList)(client, companyId),
                            (0, quality_1.getIssueItems)(client, id, companyId)
                        ])];
                case 2:
                    _d = _w.sent(), company = _d[0], nonConformance = _d[1], nonConformanceTypes = _d[2], actionTasks = _d[3], approvalTasks = _d[4], reviewers = _d[5], requiredActions = _d[6], items = _d[7];
                    return [4 /*yield*/, (0, quality_1.getIssueAssociations)(client, id, companyId)];
                case 3:
                    associations = _w.sent();
                    actionTaskIds = (_h = (_g = actionTasks.data) === null || _g === void 0 ? void 0 : _g.map(function (task) { return task.id; })) !== null && _h !== void 0 ? _h : [];
                    if (!(actionTaskIds.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("jobOperationStep")
                            .select("id, name, nonConformanceActionId, operationId, jobOperationStepRecord(*)")
                            .in("nonConformanceActionId", actionTaskIds)
                            .not("nonConformanceActionId", "is", null)];
                case 4:
                    _e = _w.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _e = { data: [] };
                    _w.label = 6;
                case 6:
                    jobOperationStepRecords = _e;
                    operationIds = (_k = (_j = jobOperationStepRecords.data) === null || _j === void 0 ? void 0 : _j.map(function (step) { return step.operationId; }).filter(Boolean)) !== null && _k !== void 0 ? _k : [];
                    if (!(operationIds.length > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("id, jobId, job(jobId)")
                            .in("id", operationIds)];
                case 7:
                    _f = _w.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _f = { data: [] };
                    _w.label = 9;
                case 9:
                    jobOperations = _f;
                    operationToJobId = {};
                    (_l = jobOperations.data) === null || _l === void 0 ? void 0 : _l.forEach(function (op) {
                        var _a;
                        if ((_a = op.job) === null || _a === void 0 ? void 0 : _a.jobId) {
                            operationToJobId[op.id] = op.job.jobId;
                        }
                    });
                    uniqueUsers = new Set();
                    // Add non-conformance creator
                    if ((_m = nonConformance.data) === null || _m === void 0 ? void 0 : _m.createdBy) {
                        uniqueUsers.add(nonConformance.data.createdBy);
                    }
                    (_o = actionTasks.data) === null || _o === void 0 ? void 0 : _o.forEach(function (task) {
                        if (task.assignee)
                            uniqueUsers.add(task.assignee);
                    });
                    // Add createdBy users from job operation step records
                    (_p = jobOperationStepRecords.data) === null || _p === void 0 ? void 0 : _p.forEach(function (step) {
                        var _a;
                        (_a = step.jobOperationStepRecord) === null || _a === void 0 ? void 0 : _a.forEach(function (record) {
                            if (record.createdBy)
                                uniqueUsers.add(record.createdBy);
                        });
                    });
                    userNames = {};
                    if (!(uniqueUsers.size > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, Promise.all(Array.from(uniqueUsers).map(function (userId) {
                            return client
                                .from("user")
                                .select("id, fullName, firstName, lastName")
                                .eq("id", userId)
                                .single();
                        }))];
                case 10:
                    userResults = _w.sent();
                    userResults.forEach(function (result) {
                        var _a;
                        if (result.data) {
                            userNames[result.data.id] =
                                (_a = result.data.fullName) !== null && _a !== void 0 ? _a : "".concat(result.data.firstName, " ").concat(result.data.lastName);
                        }
                    });
                    _w.label = 11;
                case 11:
                    if (company.error) {
                        console.error(company.error);
                    }
                    if (nonConformance.error) {
                        console.error(nonConformance.error);
                    }
                    if (nonConformanceTypes.error) {
                        console.error(nonConformanceTypes.error);
                    }
                    if (actionTasks.error) {
                        console.error(actionTasks.error);
                    }
                    if (approvalTasks.error) {
                        console.error(approvalTasks.error);
                    }
                    if (items.error) {
                        console.error(items.error);
                    }
                    if (company.error ||
                        nonConformance.error ||
                        nonConformanceTypes.error ||
                        actionTasks.error ||
                        approvalTasks.error ||
                        items.error) {
                        throw new Error("Failed to load issue");
                    }
                    locale = (0, utils_1.getPreferenceHeaders)(request).locale;
                    return [4 /*yield*/, (0, settings_1.getDocumentTemplate)(client, companyId, "issue")];
                case 12:
                    documentTemplate = _w.sent();
                    templateConfig = (0, template_1.toDocumentTemplate)(documentTemplate.data, "issue");
                    resolved = (0, template_1.resolveTemplate)("issue", templateConfig);
                    return [4 /*yield*/, (0, settings_1.resolveSections)(client, companyId, (0, template_1.collectSectionIds)(resolved))];
                case 13:
                    sections = _w.sent();
                    return [4 /*yield*/, (0, pdf_1.ensureFont)(resolved.settings.fontFamily)];
                case 14:
                    _w.sent();
                    return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.IssuePDF company={company.data} locale={locale} nonConformance={nonConformance.data} nonConformanceTypes={(_q = nonConformanceTypes.data) !== null && _q !== void 0 ? _q : []} actionTasks={(_r = actionTasks.data) !== null && _r !== void 0 ? _r : []} requiredActions={(_s = requiredActions.data) !== null && _s !== void 0 ? _s : []} reviewers={(_t = reviewers.data) !== null && _t !== void 0 ? _t : []} items={(_u = items.data) !== null && _u !== void 0 ? _u : []} associations={associations} assignees={userNames} jobOperationStepRecords={(_v = jobOperationStepRecords.data) !== null && _v !== void 0 ? _v : []} operationToJobId={operationToJobId} template={templateConfig} sections={sections}/>)];
                case 15:
                    stream = _w.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var buffers = [];
                            stream.on("data", function (data) {
                                buffers.push(data);
                            });
                            stream.on("end", function () {
                                resolve(Buffer.concat(buffers));
                            });
                            stream.on("error", reject);
                        })];
                case 16:
                    body = _w.sent();
                    headers = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - ").concat(nonConformance.data.nonConformanceId, ".pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(body), { status: 200, headers: headers })];
            }
        });
    });
}
