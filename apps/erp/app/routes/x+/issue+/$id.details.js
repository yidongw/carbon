"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.loader = loader;
exports.action = action;
exports.default = IssueDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var quality_1 = require("~/modules/quality");
var Issue_1 = require("~/modules/quality/ui/Issue");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, nonConformance;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality",
                        bypassRls: true
                    })];
                case 1:
                    _c = _d.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, client
                            .from("nonConformance")
                            .select("*")
                            .eq("id", id)
                            .single()];
                case 2:
                    nonConformance = _d.sent();
                    if (nonConformance.error) {
                        throw new Error(nonConformance.error.message);
                    }
                    return [2 /*return*/, {
                            nonConformance: nonConformance.data,
                            actionTasks: (0, quality_1.getIssueActionTasks)(client, id, companyId),
                            reviewers: (0, quality_1.getIssueReviewers)(client, id, companyId)
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, id, viewClient, issue, formData, validation, nonConformanceId, result, _d, _e, _f, _g;
        var _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "quality"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, userId = _c.userId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "quality"
                        })];
                case 2:
                    viewClient = (_k.sent()).client;
                    return [4 /*yield*/, (0, quality_1.getIssue)(viewClient, id)];
                case 3:
                    issue = _k.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, quality_1.isIssueLocked)((_h = issue.data) === null || _h === void 0 ? void 0 : _h.status),
                            redirectTo: path_1.path.to.issue(id),
                            message: "Cannot modify a closed issue. Reopen it first."
                        })];
                case 4:
                    _k.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(quality_1.issueValidator).validate(formData)];
                case 6:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    if (!validation.data.nonConformanceId) {
                        throw new Error("Could not find issue id");
                    }
                    nonConformanceId = validation.data.nonConformanceId;
                    if (!nonConformanceId) {
                        throw new Error("Could not find issue id");
                    }
                    return [4 /*yield*/, (0, quality_1.updateIssue)(client, {
                            id: id,
                            nonConformanceId: nonConformanceId,
                            name: validation.data.name,
                            priority: validation.data.priority,
                            source: validation.data.source,
                            locationId: validation.data.locationId,
                            nonConformanceTypeId: validation.data.nonConformanceTypeId,
                            nonConformanceWorkflowId: validation.data.nonConformanceWorkflowId || null,
                            openDate: validation.data.openDate,
                            dueDate: validation.data.dueDate || null,
                            closeDate: validation.data.closeDate || null,
                            description: validation.data.description || null,
                            quantity: (_j = validation.data.quantity) !== null && _j !== void 0 ? _j : undefined,
                            requiredActionIds: validation.data.requiredActionIds,
                            approvalRequirements: validation.data.approvalRequirements,
                            customFields: (0, form_2.setCustomFields)(formData),
                            updatedBy: userId
                        })];
                case 7:
                    result = _k.sent();
                    if (!result.error) return [3 /*break*/, 9];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.issue(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update issue"))];
                case 8: throw _d.apply(void 0, _e.concat([_k.sent()]));
                case 9:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.issue(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated issue"))];
                case 10: throw _f.apply(void 0, _g.concat([_k.sent()]));
            }
        });
    });
}
function IssueDetailsRoute() {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), nonConformance = _a.nonConformance, actionTasks = _a.actionTasks, reviewers = _a.reviewers;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.issue(id));
    if (!routeData)
        throw new Error("Could not find issue data");
    return (<react_1.VStack spacing={2}>
      <Issue_1.IssueContent key={id} id={id} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Description of Issue"], ["Description of Issue"])))} subTitle={nonConformance === null || nonConformance === void 0 ? void 0 : nonConformance.name} content={nonConformance === null || nonConformance === void 0 ? void 0 : nonConformance.content} isDisabled={(0, quality_1.isIssueLocked)(nonConformance === null || nonConformance === void 0 ? void 0 : nonConformance.status)}/>

      <react_2.Suspense fallback={<div className="flex min-h-[420px] w-full h-full rounded bg-gradient-to-tr from-background to-card items-center justify-center">
            <react_1.Spinner className="size-10"/>
          </div>}>
        <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.associations}>
          {function (resolvedAssociations) {
            var _a;
            return (<Issue_1.AssociatedItemsList associatedItems={(_a = resolvedAssociations === null || resolvedAssociations === void 0 ? void 0 : resolvedAssociations.items) !== null && _a !== void 0 ? _a : []} isDisabled={(0, quality_1.isIssueLocked)(nonConformance === null || nonConformance === void 0 ? void 0 : nonConformance.status)}/>);
        }}
        </react_router_1.Await>
      </react_2.Suspense>

      <components_1.DeferredFiles resolve={routeData === null || routeData === void 0 ? void 0 : routeData.files}>
        {function (resolvedFiles) { return (<components_1.Documents files={resolvedFiles} sourceDocument="Issue" sourceDocumentId={id} writeBucket="parts" writeBucketPermission="parts"/>); }}
      </components_1.DeferredFiles>

      <react_2.Suspense fallback={<div className="flex min-h-[420px] w-full h-full rounded bg-gradient-to-tr from-background to-card items-center justify-center">
            <react_1.Spinner className="size-10"/>
          </div>}>
        <react_router_1.Await resolve={actionTasks}>
          {function (resolvedTasks) {
            var _a, _b;
            return (<Issue_1.ActionTasksList tasks={(_a = resolvedTasks === null || resolvedTasks === void 0 ? void 0 : resolvedTasks.data) !== null && _a !== void 0 ? _a : []} suppliers={(_b = routeData === null || routeData === void 0 ? void 0 : routeData.suppliers) !== null && _b !== void 0 ? _b : []} isDisabled={(0, quality_1.isIssueLocked)(nonConformance === null || nonConformance === void 0 ? void 0 : nonConformance.status)}/>);
        }}
        </react_router_1.Await>
      </react_2.Suspense>

      <react_2.Suspense fallback={<div className="flex min-h-[420px] w-full h-full rounded bg-gradient-to-tr from-background to-card items-center justify-center">
            <react_1.Spinner className="size-10"/>
          </div>}>
        <react_router_1.Await resolve={reviewers}>
          {function (resolvedReviewers) {
            var _a;
            return (<Issue_1.ReviewersList reviewers={(_a = resolvedReviewers === null || resolvedReviewers === void 0 ? void 0 : resolvedReviewers.data) !== null && _a !== void 0 ? _a : []} isDisabled={(0, quality_1.isIssueLocked)(nonConformance === null || nonConformance === void 0 ? void 0 : nonConformance.status)}/>);
        }}
        </react_router_1.Await>
      </react_2.Suspense>
    </react_1.VStack>);
}
var templateObject_1;
