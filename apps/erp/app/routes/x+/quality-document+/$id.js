"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.handle = void 0;
exports.action = action;
exports.loader = loader;
exports.default = QualityDocumentRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var quality_1 = require("~/modules/quality");
var QualityDocumentEditor_1 = require("~/modules/quality/ui/Documents/QualityDocumentEditor");
var QualityDocumentExplorer_1 = require("~/modules/quality/ui/Documents/QualityDocumentExplorer");
var QualityDocumentHeader_1 = require("~/modules/quality/ui/Documents/QualityDocumentHeader");
var QualityDocumentProperties_1 = require("~/modules/quality/ui/Documents/QualityDocumentProperties");
var shared_1 = require("~/modules/shared");
var database_server_1 = require("~/services/database.server");
var path_1 = require("~/utils/path");
function getQualityDocumentApprovalContext(serviceRole, documentId, status, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultContext, _a, latest, approvalRequired, req, canApprove, isRequester;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    defaultContext = {
                        approvalRequest: null,
                        canApprove: false,
                        canReopen: true,
                        canDelete: true,
                        isApprovalRequired: false
                    };
                    if (status !== "Draft" && status !== "Archived") {
                        return [2 /*return*/, defaultContext];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, shared_1.getLatestApprovalRequestForDocument)(serviceRole, "qualityDocument", documentId),
                            (0, shared_1.isApprovalRequired)(serviceRole, "qualityDocument", companyId, undefined)
                        ])];
                case 1:
                    _a = _b.sent(), latest = _a[0], approvalRequired = _a[1];
                    req = latest.data;
                    if (!req || req.status !== "Pending" || !req.requestedBy || !req.id) {
                        return [2 /*return*/, __assign(__assign({}, defaultContext), { isApprovalRequired: approvalRequired })];
                    }
                    return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                            amount: req.amount,
                            documentType: req.documentType,
                            companyId: req.companyId
                        }, userId)];
                case 2:
                    canApprove = _b.sent();
                    isRequester = (0, shared_1.canCancelRequest)({ requestedBy: req.requestedBy, status: req.status }, userId);
                    return [2 /*return*/, {
                            approvalRequest: { id: req.id },
                            canApprove: canApprove,
                            canReopen: isRequester || canApprove,
                            canDelete: isRequester,
                            isApprovalRequired: approvalRequired
                        }];
            }
        });
    });
}
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Policy & Procedure"], ["Policy & Procedure"]))),
    to: path_1.path.to.qualityDocuments,
    module: "quality"
};
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, id, validation, _c, _d, _e, approvalRequestId, decision, notes, serviceRole, approvalRequest, _f, _g, canApprove, _h, _j, db, result, _k, _l, _m, requestedBy, companyId, e_1, _o, _p;
        var _q, _r, _s, _t;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "quality"
                        })];
                case 1:
                    userId = (_u.sent()).userId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    _d = (_c = (0, form_1.validator)(quality_1.qualityDocumentApprovalValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _d.apply(_c, [_u.sent()])];
                case 3:
                    validation = _u.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _e = validation.data, approvalRequestId = _e.approvalRequestId, decision = _e.decision, notes = _e.notes;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, shared_1.getLatestApprovalRequestForDocument)(serviceRole, "qualityDocument", id)];
                case 4:
                    approvalRequest = _u.sent();
                    if (!(!approvalRequest.data || approvalRequest.data.id !== approvalRequestId)) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.qualityDocument(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Approval request not found"))];
                case 5: throw _f.apply(void 0, _g.concat([_u.sent()]));
                case 6: return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                        amount: approvalRequest.data.amount,
                        documentType: approvalRequest.data.documentType,
                        companyId: approvalRequest.data.companyId
                    }, userId)];
                case 7:
                    canApprove = _u.sent();
                    if (!!canApprove) return [3 /*break*/, 9];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.qualityDocument(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "You do not have permission to approve this request"))];
                case 8: throw _h.apply(void 0, _j.concat([_u.sent()]));
                case 9:
                    db = (0, database_server_1.getDatabaseClient)();
                    if (!(decision === "Approved")) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, shared_1.approveRequest)(db, approvalRequestId, userId, notes || undefined)];
                case 10:
                    _k = _u.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, (0, shared_1.rejectRequest)(db, approvalRequestId, userId, notes || undefined)];
                case 12:
                    _k = _u.sent();
                    _u.label = 13;
                case 13:
                    result = _k;
                    if (!result.error) return [3 /*break*/, 15];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.qualityDocument(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, (_r = (_q = result.error) === null || _q === void 0 ? void 0 : _q.message) !== null && _r !== void 0 ? _r : "Failed to process approval decision"))];
                case 14: throw _l.apply(void 0, _m.concat([_u.sent()]));
                case 15:
                    requestedBy = (_s = approvalRequest.data) === null || _s === void 0 ? void 0 : _s.requestedBy;
                    companyId = (_t = approvalRequest.data) === null || _t === void 0 ? void 0 : _t.companyId;
                    if (!(requestedBy && companyId && requestedBy !== userId)) return [3 /*break*/, 19];
                    _u.label = 16;
                case 16:
                    _u.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: decision === "Approved"
                                ? notifications_1.NotificationEvent.ApprovalApproved
                                : notifications_1.NotificationEvent.ApprovalRejected,
                            companyId: companyId,
                            documentId: id,
                            documentType: "qualityDocument",
                            recipient: { type: "user", userId: requestedBy },
                            from: userId
                        })];
                case 17:
                    _u.sent();
                    return [3 /*break*/, 19];
                case 18:
                    e_1 = _u.sent();
                    console.error("Failed to trigger approval decision notification", e_1);
                    return [3 /*break*/, 19];
                case 19:
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.qualityDocument(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Approval request ".concat(decision.toLowerCase(), " successfully")))];
                case 20: throw _o.apply(void 0, _p.concat([_u.sent()]));
            }
        });
    });
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, id, serviceRole, documentPromise, _d, document, tags, approval, _e, _f;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality",
                        bypassRls: true
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    documentPromise = (0, quality_1.getQualityDocument)(client, id);
                    return [4 /*yield*/, Promise.all([
                            documentPromise,
                            (0, shared_1.getTagsList)(client, companyId, "qualityDocument"),
                            documentPromise.then(function (d) {
                                var _a, _b;
                                return getQualityDocumentApprovalContext(serviceRole, id, (_b = (_a = d.data) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : null, companyId, userId);
                            })
                        ])];
                case 2:
                    _d = _h.sent(), document = _d[0], tags = _d[1], approval = _d[2];
                    if (!document.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.qualityDocuments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(document.error, "Failed to load document"))];
                case 3: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 4: return [2 /*return*/, __assign({ document: document.data, versions: (0, quality_1.getQualityDocumentVersions)(client, document.data, companyId), tags: (_g = tags.data) !== null && _g !== void 0 ? _g : [] }, approval)];
            }
        });
    });
}
function QualityDocumentRoute() {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var document = (0, react_router_1.useLoaderData)().document;
    return (<Layout_1.PanelProvider key={"".concat(id, "-").concat(document.version)}>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <QualityDocumentHeader_1.default />
        <div className="flex flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels explorer={<QualityDocumentExplorer_1.default key={"explorer-".concat(id, "-").concat(document.version)}/>} content={<div className="bg-background h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <QualityDocumentEditor_1.default />
                  <react_router_1.Outlet />
                </div>} properties={<QualityDocumentProperties_1.default key={"properties-".concat(id, "-").concat(document.version)}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1;
