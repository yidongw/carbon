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
exports.loader = loader;
exports.action = action;
exports.default = JobDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Layout_1 = require("~/components/Layout");
var hooks_1 = require("~/hooks");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var JobMakeMethodTools_1 = require("~/modules/production/ui/Jobs/JobMakeMethodTools");
var PurchasingStatus_1 = require("~/modules/purchasing/ui/PurchaseOrder/PurchasingStatus");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, jobId, job, _d, _e, rootMethod, methodId, _f, materials, operations, tags, makeMethod;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        bypassRls: true
                    })];
                case 1:
                    _c = _u.sent(), client = _c.client, companyId = _c.companyId;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    return [4 /*yield*/, (0, production_1.getJob)(client, jobId)];
                case 2:
                    job = _u.sent();
                    if (!job.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(job.error, "Failed to load job"))];
                case 3: throw _d.apply(void 0, _e.concat([_u.sent()]));
                case 4: return [4 /*yield*/, (0, production_1.getRootMakeMethod)(client, jobId, companyId)];
                case 5:
                    rootMethod = _u.sent();
                    if (rootMethod.error) {
                        return [2 /*return*/, {
                                notes: ((_h = (_g = job.data) === null || _g === void 0 ? void 0 : _g.notes) !== null && _h !== void 0 ? _h : {}),
                                purchaseOrderLines: (0, production_1.getJobPurchaseOrderLines)(client, jobId),
                                materials: [],
                                operations: [],
                                makeMethod: null,
                                files: Promise.resolve([]),
                                productionData: Promise.resolve({
                                    quantities: [],
                                    events: [],
                                    notes: []
                                }),
                                tags: []
                            }];
                    }
                    methodId = rootMethod.data.id;
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJobMaterialsByMethodId)(client, methodId),
                            (0, production_1.getJobOperationsByMethodId)(client, methodId),
                            (0, shared_1.getTagsList)(client, companyId, "operation"),
                            (0, production_1.getJobMakeMethodById)(client, methodId, companyId)
                        ])];
                case 6:
                    _f = _u.sent(), materials = _f[0], operations = _f[1], tags = _f[2], makeMethod = _f[3];
                    return [2 /*return*/, {
                            notes: ((_k = (_j = job.data) === null || _j === void 0 ? void 0 : _j.notes) !== null && _k !== void 0 ? _k : {}),
                            purchaseOrderLines: (0, production_1.getJobPurchaseOrderLines)(client, jobId),
                            materials: (_m = (_l = materials === null || materials === void 0 ? void 0 : materials.data) === null || _l === void 0 ? void 0 : _l.map(function (m) {
                                var _a, _b;
                                return (__assign(__assign({}, m), { itemType: m.itemType, unitOfMeasureCode: (_a = m.unitOfMeasureCode) !== null && _a !== void 0 ? _a : "", jobOperationId: (_b = m.jobOperationId) !== null && _b !== void 0 ? _b : undefined }));
                            })) !== null && _m !== void 0 ? _m : [],
                            operations: (_p = (_o = operations.data) === null || _o === void 0 ? void 0 : _o.map(function (o) {
                                var _a, _b, _c, _d, _e, _f;
                                return (__assign(__assign({}, o), { description: (_a = o.description) !== null && _a !== void 0 ? _a : "", workCenterId: (_b = o.workCenterId) !== null && _b !== void 0 ? _b : undefined, laborRate: (_c = o.laborRate) !== null && _c !== void 0 ? _c : 0, machineRate: (_d = o.machineRate) !== null && _d !== void 0 ? _d : 0, operationSupplierProcessId: (_e = o.operationSupplierProcessId) !== null && _e !== void 0 ? _e : undefined, jobMakeMethodId: (_f = o.jobMakeMethodId) !== null && _f !== void 0 ? _f : methodId, workInstruction: o.workInstruction }));
                            })) !== null && _p !== void 0 ? _p : [],
                            makeMethod: (_q = makeMethod.data) !== null && _q !== void 0 ? _q : null,
                            files: (0, production_1.getJobDocumentsWithItemId)(client, companyId, job.data, rootMethod.data.itemId),
                            productionData: (0, production_1.getProductionDataByOperations)(client, (_s = (_r = operations === null || operations === void 0 ? void 0 : operations.data) === null || _r === void 0 ? void 0 : _r.map(function (o) { return o.id; })) !== null && _s !== void 0 ? _s : []),
                            tags: (_t = tags.data) !== null && _t !== void 0 ? _t : []
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, id, viewClient, job, formData, validation, result, _d, _e, recalculate, _f, _g, _h, _j;
        var _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    id = params.jobId;
                    if (!id)
                        throw new Error("Could not find jobId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "production"
                        })];
                case 2:
                    viewClient = (_l.sent()).client;
                    return [4 /*yield*/, (0, production_1.getJob)(viewClient, id)];
                case 3:
                    job = _l.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, production_1.isJobLocked)((_k = job.data) === null || _k === void 0 ? void 0 : _k.status),
                            redirectTo: path_1.path.to.job(id),
                            message: "Cannot modify a locked job. Reopen it first."
                        })];
                case 4:
                    _l.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _l.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_1.jobValidator).validate(formData)];
                case 6:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, production_1.updateJob)(client, {
                            id: id,
                            quantity: validation.data.quantity,
                            scrapQuantity: validation.data.scrapQuantity,
                            itemId: validation.data.itemId,
                            dueDate: validation.data.dueDate || null,
                            startDate: validation.data.startDate || null,
                            deadlineType: validation.data.deadlineType,
                            locationId: validation.data.locationId,
                            unitOfMeasureCode: validation.data.unitOfMeasureCode,
                            customerId: validation.data.customerId || null,
                            modelUploadId: validation.data.modelUploadId || null,
                            customFields: (0, form_2.setCustomFields)(formData),
                            updatedBy: userId
                        })];
                case 7:
                    result = _l.sent();
                    if (!result.error) return [3 /*break*/, 9];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.job(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update job"))];
                case 8: throw _d.apply(void 0, _e.concat([_l.sent()]));
                case 9: return [4 /*yield*/, (0, production_1.recalculateJobRequirements)((0, client_server_1.getCarbonServiceRole)(), {
                        id: id,
                        companyId: companyId,
                        userId: userId
                    })];
                case 10:
                    recalculate = _l.sent();
                    if (!recalculate.error) return [3 /*break*/, 12];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.job(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(recalculate.error, "Failed to recalculate job requirements"))];
                case 11: throw _f.apply(void 0, _g.concat([_l.sent()]));
                case 12:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.job(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated job"))];
                case 13: throw _h.apply(void 0, _j.concat([_l.sent()]));
            }
        });
    });
}
var SECTION_ORDER_STORAGE_KEY = "jobDetailsSectionOrder";
// Default top-to-bottom order. Bill of Process is pinned first by default; the
// user can drag any section to reorder, and the order is remembered per browser.
var DEFAULT_SECTION_ORDER = [
    "bop",
    "notes",
    "bom",
    "purchaseOrders",
    "estimates",
    "documents",
    "cad",
    "risk"
];
function JobDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var t = (0, macro_1.useLingui)().t;
    var _q = (0, react_router_1.useLoaderData)(), notes = _q.notes, purchaseOrderLines = _q.purchaseOrderLines, materials = _q.materials, operations = _q.operations, makeMethod = _q.makeMethod, productionData = _q.productionData, tags = _q.tags, files = _q.files;
    var jobId = (0, react_router_1.useParams)().jobId;
    if (!jobId)
        throw new Error("Could not find jobId");
    var permissions = (0, hooks_1.usePermissions)();
    var _r = (0, Layout_1.usePanels)(), setIsExplorerCollapsed = _r.setIsExplorerCollapsed, isExplorerCollapsed = _r.isExplorerCollapsed;
    (0, react_1.useMount)(function () {
        if (isExplorerCollapsed) {
            setIsExplorerCollapsed(false);
        }
    });
    var jobData = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    if (!jobData)
        throw new Error("Could not find job data");
    (0, hooks_1.useRealtime)("modelUpload", "modelPath=eq.(".concat(jobData === null || jobData === void 0 ? void 0 : jobData.job.modelPath, ")"));
    var methodId = makeMethod === null || makeMethod === void 0 ? void 0 : makeMethod.id;
    var isReadOnly = !permissions.can("update", "production");
    var _s = (0, components_1.useReorderableOrder)(SECTION_ORDER_STORAGE_KEY, DEFAULT_SECTION_ORDER), sectionOrder = _s[0], setSectionOrder = _s[1];
    var sections = {
        bop: {
            label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Bill of Process"], ["Bill of Process"]))),
            node: methodId ? (<Jobs_1.JobBillOfProcess key={"bop:".concat(methodId)} jobMakeMethodId={methodId} 
            // @ts-ignore
            materials={materials} 
            // @ts-ignore
            operations={operations} locationId={(_b = (_a = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _a === void 0 ? void 0 : _a.locationId) !== null && _b !== void 0 ? _b : ""} tags={tags} itemId={makeMethod.itemId} salesOrderLineId={(_c = jobData === null || jobData === void 0 ? void 0 : jobData.job.salesOrderLineId) !== null && _c !== void 0 ? _c : ""} customerId={(_d = jobData === null || jobData === void 0 ? void 0 : jobData.job.customerId) !== null && _d !== void 0 ? _d : ""}/>) : null
        },
        notes: {
            label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Notes"], ["Notes"]))),
            node: (<Jobs_1.JobNotes id={jobId} title={(_e = jobData === null || jobData === void 0 ? void 0 : jobData.job.jobId) !== null && _e !== void 0 ? _e : ""} subTitle={(_f = jobData === null || jobData === void 0 ? void 0 : jobData.job.itemReadableIdWithRevision) !== null && _f !== void 0 ? _f : ""} notes={notes}/>)
        },
        bom: {
            label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Bill of Material"], ["Bill of Material"]))),
            node: methodId ? (<Jobs_1.JobBillOfMaterial key={"bom:".concat(methodId)} jobMakeMethodId={methodId} 
            // @ts-ignore
            materials={materials} 
            // @ts-ignore
            operations={operations}/>) : null
        },
        purchaseOrders: {
            label: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Purchase Orders"], ["Purchase Orders"]))),
            node: (<react_2.Suspense>
          <react_router_1.Await resolve={purchaseOrderLines}>
            {function (purchaseOrderLines) {
                    var _a;
                    return (<JobPurchaseOrderLines purchaseOrderLines={(_a = purchaseOrderLines.data) !== null && _a !== void 0 ? _a : []}/>);
                }}
          </react_router_1.Await>
        </react_2.Suspense>)
        },
        estimates: {
            label: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Estimates vs Actuals"], ["Estimates vs Actuals"]))),
            node: (<react_2.Suspense fallback={<div className="flex w-full h-full rounded bg-gradient-to-tr from-background to-card items-center justify-center min-h-[200px]">
              <react_1.Spinner className="h-10 w-10"/>
            </div>}>
          <react_router_1.Await resolve={productionData}>
            {function (resolvedProductionData) { return (<Jobs_1.JobEstimatesVsActuals 
                // @ts-ignore
                materials={materials !== null && materials !== void 0 ? materials : []} 
                // @ts-ignore
                operations={operations} productionEvents={resolvedProductionData.events} productionQuantities={resolvedProductionData.quantities} notes={resolvedProductionData.notes}/>); }}
          </react_router_1.Await>
        </react_2.Suspense>)
        },
        documents: {
            label: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Documents"], ["Documents"]))),
            node: (<components_1.DeferredFiles resolve={files}>
          {function (resolvedFiles) {
                    var _a, _b;
                    return (<Jobs_1.JobDocuments files={resolvedFiles} jobId={(_a = jobData.job.id) !== null && _a !== void 0 ? _a : ""} bucket="parts" itemId={(_b = makeMethod === null || makeMethod === void 0 ? void 0 : makeMethod.itemId) !== null && _b !== void 0 ? _b : jobData.job.itemId} modelUpload={__assign({}, jobData.job)}/>);
                }}
        </components_1.DeferredFiles>)
        },
        cad: {
            label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["CAD Model"], ["CAD Model"]))),
            node: isReadOnly ? null : (<react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>{t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))}</react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <components_1.CadModel isReadOnly={isReadOnly} metadata={{
                    jobId: (_h = (_g = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _g === void 0 ? void 0 : _g.id) !== null && _h !== void 0 ? _h : undefined,
                    itemId: (_k = (_j = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _j === void 0 ? void 0 : _j.itemId) !== null && _k !== void 0 ? _k : undefined
                }} modelPath={(_m = (_l = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _l === void 0 ? void 0 : _l.modelPath) !== null && _m !== void 0 ? _m : null} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>
          </react_1.CardContent>
        </react_1.Card>)
        },
        risk: {
            label: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Risk Register"], ["Risk Register"]))),
            node: (<Jobs_1.JobRiskRegister jobId={jobId} itemId={(_p = (_o = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _o === void 0 ? void 0 : _o.itemId) !== null && _p !== void 0 ? _p : ""}/>)
        }
    };
    return (<div className="h-[calc(100dvh-49px)] w-full items-start overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
      <react_1.VStack spacing={2} className="p-2">
        <JobMakeMethodTools_1.default makeMethod={makeMethod !== null && makeMethod !== void 0 ? makeMethod : undefined}/>

        <components_1.ReorderableSectionGroup order={sectionOrder} onReorder={setSectionOrder}>
          {sectionOrder.map(function (id) {
            var section = sections[id];
            if (!section)
                return null;
            return (<components_1.ReorderableSection key={id} id={id} label={section.label}>
                {section.node}
              </components_1.ReorderableSection>);
        })}
        </components_1.ReorderableSectionGroup>
      </react_1.VStack>
    </div>);
}
function JobPurchaseOrderLines(_a) {
    var purchaseOrderLines = _a.purchaseOrderLines;
    var purchaseOrders = (0, Jobs_1.groupJobPurchaseOrderLines)(purchaseOrderLines);
    if (purchaseOrders.length === 0) {
        return null;
    }
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>Purchase Orders</react_1.CardTitle>
      </react_1.CardHeader>
      <react_1.CardContent>
        <div className="border rounded-lg">
          {purchaseOrders.map(function (order, index) { return (<div key={order.purchaseOrder.id} className={(0, react_1.cn)("border-b p-6", index === purchaseOrders.length - 1 && "border-b-0")}>
              <JobPurchaseOrderGroupItem order={order}/>
            </div>); })}
        </div>
      </react_1.CardContent>
    </react_1.Card>);
}
function JobPurchaseOrderGroupItem(_a) {
    var _b, _c, _d, _e;
    var order = _a.order;
    var items = (0, stores_1.useItems)()[0];
    var primaryLine = (_b = order.lines.find(function (line) { return line.jobOperation; })) !== null && _b !== void 0 ? _b : order.lines[0];
    var item = items.find(function (i) { return i.id === (primaryLine === null || primaryLine === void 0 ? void 0 : primaryLine.itemId); });
    var currencyCode = (_c = order.purchaseOrder.currencyCode) !== null && _c !== void 0 ? _c : "USD";
    var formatter = (0, hooks_1.useCurrencyFormatter)({ currency: currencyCode });
    var isPartiallyShipped = order.lines.some(function (line) { var _a; return ((_a = line.quantityShipped) !== null && _a !== void 0 ? _a : 0) > 0; });
    var isShipped = order.lines.every(function (line) { var _a, _b; return ((_a = line.quantityShipped) !== null && _a !== void 0 ? _a : 0) >= ((_b = line.purchaseQuantity) !== null && _b !== void 0 ? _b : 0); });
    var isPartiallyReceived = order.lines.some(function (line) { var _a; return ((_a = line.quantityReceived) !== null && _a !== void 0 ? _a : 0) > 0; });
    var isReceived = order.lines.every(function (line) { var _a, _b; return ((_a = line.quantityReceived) !== null && _a !== void 0 ? _a : 0) >= ((_b = line.purchaseQuantity) !== null && _b !== void 0 ? _b : 0); });
    var status = isReceived
        ? "Received"
        : isPartiallyReceived
            ? "Partially Received"
            : isShipped
                ? "Shipped"
                : isPartiallyShipped
                    ? "Partially Shipped"
                    : "To Ship";
    var statusColor = isReceived
        ? "green"
        : isPartiallyReceived
            ? "yellow"
            : isShipped
                ? "blue"
                : isPartiallyShipped
                    ? "orange"
                    : "gray";
    return (<div className="flex w-full items-center justify-between gap-8">
      <react_1.HStack spacing={4} className="w-fit shrink-0">
        <div className="bg-muted border rounded-full flex shrink-0 items-center justify-center p-2">
          <lu_1.LuShoppingCart className="size-4"/>
        </div>
        <react_1.VStack spacing={0}>
          <components_1.Hyperlink className="text-sm font-medium whitespace-nowrap" to={path_1.path.to.purchaseOrder(order.purchaseOrder.id)}>
            {order.purchaseOrder.purchaseOrderId}
          </components_1.Hyperlink>
          <PurchasingStatus_1.default status={order.purchaseOrder.status}/>
        </react_1.VStack>
      </react_1.HStack>

      <react_1.VStack spacing={0} className="w-fit shrink-0 items-center text-center">
        <span className="text-sm font-medium whitespace-nowrap">
          {item === null || item === void 0 ? void 0 : item.readableIdWithRevision}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {(_e = (_d = primaryLine === null || primaryLine === void 0 ? void 0 : primaryLine.jobOperation) === null || _d === void 0 ? void 0 : _d.description) !== null && _e !== void 0 ? _e : item === null || item === void 0 ? void 0 : item.name}
        </span>
      </react_1.VStack>

      <react_1.VStack spacing={1} className="w-fit shrink-0 items-end">
        <components_1.SupplierAvatar className="text-sm" supplierId={order.purchaseOrder.supplierId}/>
        <react_1.Badge variant={statusColor}>{status}</react_1.Badge>
      </react_1.VStack>

      <div className="w-fit shrink-0">
        <Jobs_1.JobPurchaseOrderPriceBreakdown currencyCode={currencyCode} lines={order.lines} total={order.total}>
          <button type="button" className="text-sm font-semibold tabular-nums underline-offset-4 hover:underline whitespace-nowrap">
            {formatter.format(order.total)}
          </button>
        </Jobs_1.JobPurchaseOrderPriceBreakdown>
      </div>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
