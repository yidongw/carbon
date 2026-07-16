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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = IssueNewRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var notifications_1 = require("@carbon/ee/notifications");
var form_1 = require("@carbon/form");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var quality_1 = require("~/modules/quality");
var IssueForm_1 = require("~/modules/quality/ui/Issue/IssueForm");
var settings_server_1 = require("~/modules/settings/settings.server");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Issues"], ["Issues"]))),
    to: path_1.path.to.issues
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, _d, workflows, types, requiredActions;
        var _e, _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, quality_1.getIssueWorkflowsList)(client, companyId),
                            (0, quality_1.getIssueTypesList)(client, companyId),
                            (0, quality_1.getRequiredActionsList)(client, companyId)
                        ])];
                case 2:
                    _d = _h.sent(), workflows = _d[0], types = _d[1], requiredActions = _d[2];
                    return [2 /*return*/, {
                            workflows: (_e = workflows.data) !== null && _e !== void 0 ? _e : [],
                            types: (_f = types.data) !== null && _f !== void 0 ? _f : [],
                            requiredActions: (_g = requiredActions.data) !== null && _g !== void 0 ? _g : []
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, serviceRole, formData, validation, d, createResult, _d, _e, ncrId, url, trackedEntityIdsParam, trackedEntityIds, tasks, _f, _g, integrations, error_1;
        var _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "quality"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _j.sent();
                    return [4 /*yield*/, request.formData()];
                case 3:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(quality_1.issueValidator).validate(formData)];
                case 4:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    d = validation.data;
                    return [4 /*yield*/, (0, quality_1.insertIssue)(serviceRole, {
                            nonConformanceId: d.nonConformanceId || undefined,
                            name: d.name,
                            priority: d.priority,
                            source: d.source,
                            locationId: d.locationId,
                            nonConformanceTypeId: d.nonConformanceTypeId,
                            openDate: d.openDate,
                            description: d.description,
                            nonConformanceWorkflowId: d.nonConformanceWorkflowId,
                            dueDate: d.dueDate,
                            closeDate: d.closeDate,
                            quantity: d.quantity,
                            requiredActionIds: d.requiredActionIds,
                            approvalRequirements: d.approvalRequirements,
                            items: d.items,
                            jobOperationId: d.jobOperationId,
                            customerId: d.customerId,
                            salesOrderLineId: d.salesOrderLineId,
                            operationSupplierProcessId: d.operationSupplierProcessId,
                            companyId: companyId,
                            createdBy: userId,
                            customFields: (0, form_2.setCustomFields)(formData)
                        })];
                case 5:
                    createResult = _j.sent();
                    if (!(createResult.error || !createResult.data)) return [3 /*break*/, 7];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.issues];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createResult.error, "Failed to insert issue"))];
                case 6: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 7:
                    ncrId = createResult.data.id;
                    url = new URL(request.url);
                    trackedEntityIdsParam = url.searchParams.get("trackedEntityIds");
                    trackedEntityIds = trackedEntityIdsParam
                        ? trackedEntityIdsParam.split(",").filter(Boolean)
                        : [];
                    if (!(trackedEntityIds.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, serviceRole.from("nonConformanceTrackedEntity").insert(trackedEntityIds.map(function (trackedEntityId) { return ({
                            nonConformanceId: ncrId,
                            trackedEntityId: trackedEntityId,
                            companyId: companyId,
                            createdBy: userId
                        }); }))];
                case 8:
                    _j.sent();
                    _j.label = 9;
                case 9:
                    if (!validation.data.jobOperationId) return [3 /*break*/, 11];
                    return [4 /*yield*/, autoLinkJobOperationDisposition(serviceRole, {
                            nonConformanceId: ncrId,
                            companyId: companyId,
                            userId: userId,
                            jobOperationId: validation.data.jobOperationId
                        })];
                case 10:
                    _j.sent();
                    _j.label = 11;
                case 11: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "nonConformanceTasks",
                            id: ncrId,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 12:
                    tasks = _j.sent();
                    if (!tasks.error) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, quality_1.deleteIssue)(serviceRole, ncrId)];
                case 13:
                    _j.sent();
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.issue(ncrId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to create tasks"))];
                case 14: throw _f.apply(void 0, _g.concat([_j.sent()]));
                case 15:
                    _j.trys.push([15, 18, , 19]);
                    return [4 /*yield*/, (0, settings_server_1.getCompanyIntegrations)(client, companyId)];
                case 16:
                    integrations = _j.sent();
                    return [4 /*yield*/, (0, notifications_1.notifyIssueCreated)({ client: client, serviceRole: serviceRole }, integrations, {
                            companyId: companyId,
                            userId: userId,
                            carbonUrl: "".concat(auth_1.ERP_URL).concat(path_1.path.to.issue(ncrId)),
                            issue: {
                                id: ncrId,
                                nonConformanceId: createResult.data.nonConformanceId,
                                title: validation.data.name,
                                description: (_h = validation.data.description) !== null && _h !== void 0 ? _h : "",
                                severity: validation.data.priority
                            }
                        })];
                case 17:
                    _j.sent();
                    return [3 /*break*/, 19];
                case 18:
                    error_1 = _j.sent();
                    console.error("Failed to send notifications:", error_1);
                    return [3 /*break*/, 19];
                case 19: throw (0, react_router_1.redirect)(path_1.path.to.issue(ncrId));
            }
        });
    });
}
function IssueNewRoute() {
    var _a;
    var _b = (0, react_router_1.useLoaderData)(), workflows = _b.workflows, types = _b.types, requiredActions = _b.requiredActions;
    var defaults = (0, hooks_1.useUser)().defaults;
    var params = (0, hooks_1.useUrlParams)()[0];
    var supplierId = params.get("supplierId");
    var customerId = params.get("customerId");
    var jobId = params.get("jobId");
    var jobOperationId = params.get("jobOperationId");
    var itemId = params.get("itemId");
    var salesOrderId = params.get("salesOrderId");
    var shipmentId = params.get("shipmentId");
    var purchaseOrderId = params.get("purchaseOrderId");
    var purchaseOrderLineId = params.get("purchaseOrderLineId");
    var salesOrderLineId = params.get("salesOrderLineId");
    var shipmentLineId = params.get("shipmentLineId");
    var operationSupplierProcessId = params.get("operationSupplierProcessId");
    var initialValues = {
        id: undefined,
        nonConformanceId: undefined,
        approvalRequirements: [],
        customerId: customerId !== null && customerId !== void 0 ? customerId : "",
        items: itemId ? [itemId] : [],
        jobId: jobId !== null && jobId !== void 0 ? jobId : "",
        jobOperationId: jobOperationId !== null && jobOperationId !== void 0 ? jobOperationId : "",
        itemId: itemId !== null && itemId !== void 0 ? itemId : "",
        locationId: (_a = defaults.locationId) !== null && _a !== void 0 ? _a : "",
        name: "",
        nonConformanceTypeId: "",
        nonConformanceWorkflowId: "",
        openDate: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
        priority: "Medium",
        purchaseOrderId: purchaseOrderId !== null && purchaseOrderId !== void 0 ? purchaseOrderId : "",
        purchaseOrderLineId: purchaseOrderLineId !== null && purchaseOrderLineId !== void 0 ? purchaseOrderLineId : "",
        quantity: 1,
        requiredActionIds: [],
        salesOrderId: salesOrderId !== null && salesOrderId !== void 0 ? salesOrderId : "",
        salesOrderLineId: salesOrderLineId !== null && salesOrderLineId !== void 0 ? salesOrderLineId : "",
        shipmentId: shipmentId !== null && shipmentId !== void 0 ? shipmentId : "",
        shipmentLineId: shipmentLineId !== null && shipmentLineId !== void 0 ? shipmentLineId : "",
        source: "Internal",
        supplierId: supplierId !== null && supplierId !== void 0 ? supplierId : "",
        trackedEntityId: "",
        operationSupplierProcessId: operationSupplierProcessId !== null && operationSupplierProcessId !== void 0 ? operationSupplierProcessId : ""
    };
    return (<div className="max-w-4xl w-full p-2 sm:p-0 mx-auto mt-0 md:mt-8">
      <IssueForm_1.default initialValues={initialValues} nonConformanceWorkflows={workflows} nonConformanceTypes={types} requiredActions={requiredActions}/>
    </div>);
}
function autoLinkJobOperationDisposition(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, companyId, userId, jobOperationId, operation, jobMakeMethodId, makeMethod, itemId, entities, lotEntities, entityIds, existingNcrLinks, alreadyOnNcr, ncrLinkRows, ncrInsert, existingItem, itemRowId, currentQty, insert, alreadyLinked, alreadyLinkedSet, linkRows, linkInsert, addedQty;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    nonConformanceId = args.nonConformanceId, companyId = args.companyId, userId = args.userId, jobOperationId = args.jobOperationId;
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("jobMakeMethodId")
                            .eq("id", jobOperationId)
                            .single()];
                case 1:
                    operation = _k.sent();
                    jobMakeMethodId = (_b = (_a = operation.data) === null || _a === void 0 ? void 0 : _a.jobMakeMethodId) !== null && _b !== void 0 ? _b : null;
                    if (!jobMakeMethodId)
                        return [2 /*return*/];
                    return [4 /*yield*/, client
                            .from("jobMakeMethod")
                            .select("itemId")
                            .eq("id", jobMakeMethodId)
                            .single()];
                case 2:
                    makeMethod = _k.sent();
                    itemId = (_d = (_c = makeMethod.data) === null || _c === void 0 ? void 0 : _c.itemId) !== null && _d !== void 0 ? _d : null;
                    if (!itemId)
                        return [2 /*return*/];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id, quantity")
                            .eq("attributes->>Job Make Method", jobMakeMethodId)
                            .eq("companyId", companyId)];
                case 3:
                    entities = _k.sent();
                    lotEntities = ((_e = entities.data) !== null && _e !== void 0 ? _e : []);
                    if (lotEntities.length === 0)
                        return [2 /*return*/];
                    entityIds = lotEntities.map(function (e) { return e.id; });
                    return [4 /*yield*/, client
                            .from("nonConformanceTrackedEntity")
                            .select("trackedEntityId")
                            .eq("nonConformanceId", nonConformanceId)
                            .in("trackedEntityId", entityIds)];
                case 4:
                    existingNcrLinks = _k.sent();
                    alreadyOnNcr = new Set(((_f = existingNcrLinks.data) !== null && _f !== void 0 ? _f : []).map(function (r) { return r.trackedEntityId; }));
                    ncrLinkRows = entityIds
                        .filter(function (id) { return !alreadyOnNcr.has(id); })
                        .map(function (trackedEntityId) { return ({
                        nonConformanceId: nonConformanceId,
                        trackedEntityId: trackedEntityId,
                        companyId: companyId,
                        createdBy: userId
                    }); });
                    if (!(ncrLinkRows.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("nonConformanceTrackedEntity")
                            .insert(ncrLinkRows)];
                case 5:
                    ncrInsert = _k.sent();
                    if (ncrInsert.error) {
                        console.error(ncrInsert.error);
                        return [2 /*return*/];
                    }
                    _k.label = 6;
                case 6: return [4 /*yield*/, client
                        .from("nonConformanceItem")
                        .select("id, quantity")
                        .eq("nonConformanceId", nonConformanceId)
                        .eq("itemId", itemId)
                        .maybeSingle()];
                case 7:
                    existingItem = _k.sent();
                    if (!existingItem.data) return [3 /*break*/, 8];
                    itemRowId = existingItem.data.id;
                    currentQty = Number((_g = existingItem.data.quantity) !== null && _g !== void 0 ? _g : 0);
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, client
                        .from("nonConformanceItem")
                        .insert({
                        itemId: itemId,
                        nonConformanceId: nonConformanceId,
                        createdBy: userId,
                        companyId: companyId,
                        quantity: 0
                    })
                        .select("id, quantity")
                        .single()];
                case 9:
                    insert = _k.sent();
                    if (insert.error || !insert.data) {
                        console.error(insert.error);
                        return [2 /*return*/];
                    }
                    itemRowId = insert.data.id;
                    currentQty = Number((_h = insert.data.quantity) !== null && _h !== void 0 ? _h : 0);
                    _k.label = 10;
                case 10: return [4 /*yield*/, client
                        .from("nonConformanceItemTrackedEntity")
                        .select("trackedEntityId")
                        .eq("nonConformanceId", nonConformanceId)
                        .in("trackedEntityId", entityIds)];
                case 11:
                    alreadyLinked = _k.sent();
                    alreadyLinkedSet = new Set(((_j = alreadyLinked.data) !== null && _j !== void 0 ? _j : []).map(function (r) { return r.trackedEntityId; }));
                    linkRows = lotEntities
                        .filter(function (e) { return !alreadyLinkedSet.has(e.id); })
                        .map(function (e) {
                        var _a;
                        return ({
                            nonConformanceItemId: itemRowId,
                            trackedEntityId: e.id,
                            quantity: Number((_a = e.quantity) !== null && _a !== void 0 ? _a : 1),
                            companyId: companyId,
                            createdBy: userId
                        });
                    });
                    if (linkRows.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, client
                            .from("nonConformanceItemTrackedEntity")
                            .insert(linkRows)];
                case 12:
                    linkInsert = _k.sent();
                    if (linkInsert.error) {
                        console.error(linkInsert.error);
                        return [2 /*return*/];
                    }
                    addedQty = linkRows.reduce(function (acc, r) { return acc + r.quantity; }, 0);
                    return [4 /*yield*/, client
                            .from("nonConformanceItem")
                            .update({
                            quantity: currentQty + addedQty,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", itemRowId)
                            .eq("companyId", companyId)];
                case 13:
                    _k.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var templateObject_1;
