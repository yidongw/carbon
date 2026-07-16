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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStartModal = JobStartModal;
exports.JobCancelModal = JobCancelModal;
exports.JobCompleteModal = JobCompleteModal;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var AuditLog_1 = require("~/components/AuditLog");
var Form_1 = require("~/components/Form");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var Select_1 = require("~/components/Select");
var SupplierAvatar_1 = require("~/components/SupplierAvatar");
var TreeView_1 = require("~/components/TreeView");
var hooks_1 = require("~/hooks");
var bom_1 = require("~/utils/bom");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
var production_service_1 = require("../../production.service");
var JobStatus_1 = require("./JobStatus");
function JobTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var jobId = _a.jobId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var releaseModal = (0, react_1.useDisclosure)();
    var cancelModal = (0, react_1.useDisclosure)();
    var completeModal = (0, react_1.useDisclosure)();
    var deleteJobModal = (0, react_1.useDisclosure)();
    var _p = (0, AuditLog_1.useAuditLog)({
        entityType: "productionJob",
        entityId: jobId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _p.trigger, auditLogDrawer = _p.drawer;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    var statusFetcher = (0, react_router_1.useFetcher)();
    var status = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _b === void 0 ? void 0 : _b.status;
    var todaysDate = (0, react_2.useMemo)(function () { return (0, date_1.today)((0, date_1.getLocalTimeZone)()); }, []);
    var isDraft = ["Draft", "Planned"].includes(status !== null && status !== void 0 ? status : "");
    var isPaused = status === "Paused";
    var isRunning = ["Ready", "In Progress"].includes(status !== null && status !== void 0 ? status : "");
    var isDone = ["Completed", "Cancelled"].includes(status !== null && status !== void 0 ? status : "");
    var isLocked = (0, production_models_1.isJobLocked)(status);
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.jobDetails(jobId)}>
          {(_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _c === void 0 ? void 0 : _c.jobId) !== null && _d !== void 0 ? _d : jobId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _e === void 0 ? void 0 : _e.jobId) !== null && _f !== void 0 ? _f : ""}/>
        <JobStatus_1.default iconOnly status={status}/>
        {["Draft", "Planned", "In Progress", "Ready", "Paused"].includes(status !== null && status !== void 0 ? status : "") &&
            ((_g = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _g === void 0 ? void 0 : _g.dueDate) && (<>
              {(0, date_1.isSameDay)((0, date_1.parseDate)(routeData.job.dueDate), todaysDate) && (<JobStatus_1.default iconOnly status="Due Today"/>)}
              {(0, date_1.parseDate)(routeData.job.dueDate) < todaysDate && (<JobStatus_1.default iconOnly status="Overdue"/>)}
            </>)}
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            <react_1.DropdownMenuItem asChild>
              <a target="_blank" href={path_1.path.to.file.jobTravelerByJobId(jobId)} rel="noreferrer">
                <react_1.DropdownMenuIcon icon={<lu_1.LuQrCode />}/>
                <macro_1.Trans>Job Traveler</macro_1.Trans>
              </a>
            </react_1.DropdownMenuItem>
            {auditLogTrigger}
            {((_h = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _h === void 0 ? void 0 : _h.salesOrderId) &&
            ((_j = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _j === void 0 ? void 0 : _j.salesOrderLineId) && (<>
                  <react_1.DropdownMenuSeparator />
                  <react_1.DropdownMenuItem asChild>
                    <react_router_1.Link to={path_1.path.to.salesOrderLine(routeData.job.salesOrderId, routeData.job.salesOrderLineId)}>
                      <react_1.DropdownMenuIcon icon={<ri_1.RiProgress8Line />}/>
                      <macro_1.Trans>Sales Order</macro_1.Trans>
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>
                </>)}
            <react_1.DropdownMenuSeparator />
            {isDraft && (<react_1.DropdownMenuItem disabled={statusFetcher.state !== "idle" ||
                !permissions.can("update", "production")} onClick={function () {
                return statusFetcher.submit({ status: "Planned" }, { method: "post", action: path_1.path.to.jobStatus(jobId) });
            }}>
                <react_1.DropdownMenuIcon className="text-yellow-500" icon={<lu_1.LuCheckCheck />}/>
                <macro_1.Trans>Mark as Planned</macro_1.Trans>
              </react_1.DropdownMenuItem>)}
            <react_1.DropdownMenuItem disabled={!isDraft ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "production") ||
            (((_k = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _k === void 0 ? void 0 : _k.quantity) === 0 &&
                ((_l = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _l === void 0 ? void 0 : _l.scrapQuantity) === 0)} onClick={releaseModal.onOpen}>
              <react_1.DropdownMenuIcon className="text-blue-600" icon={<lu_1.LuCirclePlay />}/>
              <macro_1.Trans>Release</macro_1.Trans>
            </react_1.DropdownMenuItem>
            {isPaused ? (<react_1.DropdownMenuItem disabled={statusFetcher.state !== "idle" ||
                !permissions.can("update", "production")} onClick={function () {
                return statusFetcher.submit({ status: "Ready" }, { method: "post", action: path_1.path.to.jobStatus(jobId) });
            }}>
                <react_1.DropdownMenuIcon className="text-blue-600" icon={<lu_1.LuCirclePlay />}/>
                <macro_1.Trans>Resume</macro_1.Trans>
              </react_1.DropdownMenuItem>) : (<react_1.DropdownMenuItem disabled={!isRunning ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "production")} onClick={function () {
                return statusFetcher.submit({ status: "Paused" }, { method: "post", action: path_1.path.to.jobStatus(jobId) });
            }}>
                <react_1.DropdownMenuIcon className="text-orange-500" icon={<lu_1.LuCirclePause />}/>
                <macro_1.Trans>Pause</macro_1.Trans>
              </react_1.DropdownMenuItem>)}
            <react_1.DropdownMenuItem disabled={isDone ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "production")} onClick={completeModal.onOpen}>
              <react_1.DropdownMenuIcon className="text-green-600" icon={<lu_1.LuCircleCheck />}/>
              <macro_1.Trans>Complete</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem disabled={isDone ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "production")} onClick={cancelModal.onOpen}>
              <react_1.DropdownMenuIcon className="text-red-600" icon={<lu_1.LuCircleStop />}/>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={!isDone ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "production")} onClick={function () {
            return statusFetcher.submit({ status: status === "Cancelled" ? "Draft" : "In Progress" }, { method: "post", action: path_1.path.to.jobStatus(jobId) });
        }}>
              <react_1.DropdownMenuIcon className="text-blue-600" icon={<lu_1.LuCirclePlay />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={!permissions.can("delete", "production") ||
            !permissions.is("employee") ||
            isLocked} destructive onClick={deleteJobModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Job</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>
      {auditLogDrawer}
      {releaseModal.isOpen && (<JobStartModal job={routeData === null || routeData === void 0 ? void 0 : routeData.job} onClose={releaseModal.onClose} fetcher={statusFetcher}/>)}
      {cancelModal.isOpen && (<JobCancelModal job={routeData === null || routeData === void 0 ? void 0 : routeData.job} onClose={cancelModal.onClose} fetcher={statusFetcher}/>)}
      {completeModal.isOpen && (<JobCompleteModal job={routeData === null || routeData === void 0 ? void 0 : routeData.job} onClose={completeModal.onClose} fetcher={statusFetcher}/>)}
      {deleteJobModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteJob(jobId)} isOpen={deleteJobModal.isOpen} name={(_m = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _m === void 0 ? void 0 : _m.jobId} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_o = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _o === void 0 ? void 0 : _o.jobId)} onCancel={deleteJobModal.onClose} onSubmit={deleteJobModal.onClose}/>)}
    </>);
}
var JobHeader = function () {
    var t = (0, macro_1.useLingui)().t;
    var jobId = (0, react_router_1.useParams)().jobId;
    if (!jobId)
        throw new Error("jobId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    var links = [
        { name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Details"], ["Details"]))), to: path_1.path.to.jobDetails(jobId) },
        { name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Materials"], ["Materials"]))), to: path_1.path.to.jobMaterials(jobId) },
        { name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Operations"], ["Operations"]))), to: path_1.path.to.jobOperations(jobId) },
        { name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Events"], ["Events"]))), to: path_1.path.to.jobProductionEvents(jobId) },
        {
            name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Process Completions"], ["Process Completions"]))),
            to: path_1.path.to.jobProductionQuantities(jobId)
        },
        { name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Step Records"], ["Step Records"]))), to: path_1.path.to.jobOperationStepRecords(jobId) }
    ];
    return (<>
      {leftSlotEl && (0, react_dom_1.createPortal)(<JobTopbarLeft jobId={jobId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center">
          <Layout_1.DetailsTopbar links={links}/>
        </div>
        <react_1.IconButton aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = JobHeader;
function useCloseInlineStatusModal(fetcher, submitted, onClose) {
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        var _a;
        if (!submitted.current)
            return;
        if (fetcher.state === "loading") {
            onClose();
            submitted.current = false;
            return;
        }
        if (fetcher.state === "idle") {
            submitted.current = false;
            if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
                onClose();
            }
        }
    }, [fetcher.state, fetcher.data, onClose, fetcher]);
}
function JobStartModal(_a) {
    var _this = this;
    var _b;
    var job = _a.job, onClose = _a.onClose, fetcher = _a.fetcher, stay = _a.stay;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _c = (0, react_2.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_2.useState)([]), missingOperationAssemblies = _d[0], setMissingOperationAssemblies = _d[1];
    var _e = (0, react_2.useState)(false), eachOutsideOperationHasASupplier = _e[0], setEachOutsideOperationHasASupplier = _e[1];
    var _f = (0, react_2.useState)(false), hasOutsideOperations = _f[0], setHasOutsideOperations = _f[1];
    var _g = (0, react_2.useState)({}), existingPurchaseOrdersBySupplierId = _g[0], setExistingPurchaseOrdersBySupplierId = _g[1];
    var _h = (0, react_2.useState)({}), selectedPurchaseOrdersBySupplierId = _h[0], setSelectedPurchaseOrdersBySupplierId = _h[1];
    var startSubmitted = (0, react_2.useRef)(false);
    useCloseInlineStatusModal(fetcher, startSubmitted, onClose);
    var validate = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, makeMethod, materials, operations, methodTree, outsideOperations, existingPurchaseOrderLines, _b, existingJobOperationIds, operationsNeedingPurchaseOrders, uniqueOutsideProcessIds, supplierProcesses, _c, uniqueSupplierIds, draftPurchaseOrders, kittedMakeMethodIds, uniqueMakeMethodIds, flatMethod, bomIds, bomInfoByMakeMethodId, missingAssemblies;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    if (!carbon || !job)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("jobMakeMethod")
                                .select("*")
                                .eq("jobId", job.id)
                                .is("parentMaterialId", null)
                                .single(),
                            carbon
                                .from("jobMaterialWithMakeMethodId")
                                .select("*")
                                .eq("jobId", job.id),
                            carbon.from("jobOperation").select("*").eq("jobId", job.id),
                            (0, production_service_1.getJobMethodTree)(carbon, job.id)
                        ])];
                case 1:
                    _a = _r.sent(), makeMethod = _a[0], materials = _a[1], operations = _a[2], methodTree = _a[3];
                    outsideOperations = ((_d = operations.data) === null || _d === void 0 ? void 0 : _d.filter(function (op) { return op.operationType === "Outside"; })) || [];
                    if (!(outsideOperations.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, carbon
                            .from("purchaseOrderLine")
                            .select("jobOperationId")
                            .in("jobOperationId", outsideOperations.map(function (op) { return op.id; }))];
                case 2:
                    _b = _r.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _b = { data: [] };
                    _r.label = 4;
                case 4:
                    existingPurchaseOrderLines = _b;
                    existingJobOperationIds = new Set((_f = (_e = existingPurchaseOrderLines.data) === null || _e === void 0 ? void 0 : _e.map(function (pol) { return pol.jobOperationId; })) !== null && _f !== void 0 ? _f : []);
                    operationsNeedingPurchaseOrders = outsideOperations.filter(function (op) {
                        return !existingJobOperationIds.has(op.id) && op.operationSupplierProcessId;
                    });
                    uniqueOutsideProcessIds = operationsNeedingPurchaseOrders.map(function (op) { return op.operationSupplierProcessId; });
                    if (!(uniqueOutsideProcessIds.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, carbon
                            .from("supplierProcess")
                            .select("supplierId")
                            .in("id", uniqueOutsideProcessIds)];
                case 5:
                    _c = _r.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _c = { data: [] };
                    _r.label = 7;
                case 7:
                    supplierProcesses = _c;
                    uniqueSupplierIds = new Set((_h = (_g = supplierProcesses.data) === null || _g === void 0 ? void 0 : _g.map(function (sp) { return sp.supplierId; })) !== null && _h !== void 0 ? _h : []);
                    if (!uniqueSupplierIds.size) return [3 /*break*/, 9];
                    return [4 /*yield*/, carbon
                            .from("purchaseOrder")
                            .select("id, purchaseOrderId, supplierId")
                            .eq("status", "Draft")
                            .in("supplierId", Array.from(uniqueSupplierIds))];
                case 8:
                    draftPurchaseOrders = _r.sent();
                    setExistingPurchaseOrdersBySupplierId((_k = (_j = draftPurchaseOrders.data) === null || _j === void 0 ? void 0 : _j.reduce(function (acc, po) {
                        acc[po.supplierId] = acc[po.supplierId] || [];
                        acc[po.supplierId].push({
                            id: po.id,
                            purchaseOrderId: po.purchaseOrderId
                        });
                        return acc;
                    }, {})) !== null && _k !== void 0 ? _k : {});
                    _r.label = 9;
                case 9:
                    setSelectedPurchaseOrdersBySupplierId(Array.from(uniqueSupplierIds).reduce(function (acc, supplierId) {
                        acc[supplierId] = "new";
                        return acc;
                    }, {}));
                    kittedMakeMethodIds = new Set((_m = (_l = materials.data) === null || _l === void 0 ? void 0 : _l.filter(function (m) { return m.jobMaterialMakeMethodId && m.kit; }).map(function (m) { return m.jobMaterialMakeMethodId; })) !== null && _m !== void 0 ? _m : []);
                    uniqueMakeMethodIds = new Set((_p = (_o = materials.data) === null || _o === void 0 ? void 0 : _o.filter(function (m) {
                        return m.jobMaterialMakeMethodId &&
                            m.methodType === "Make to Order" &&
                            !kittedMakeMethodIds.has(m.jobMaterialMakeMethodId);
                    }).map(function (m) { return m.jobMaterialMakeMethodId; })) !== null && _p !== void 0 ? _p : []);
                    uniqueMakeMethodIds.add((_q = makeMethod.data) === null || _q === void 0 ? void 0 : _q.id);
                    flatMethod = methodTree.data && methodTree.data.length > 0
                        ? (0, TreeView_1.flattenTree)(methodTree.data[0])
                        : [];
                    bomIds = (0, bom_1.generateBomIds)(flatMethod);
                    bomInfoByMakeMethodId = new Map(flatMethod.map(function (node, index) { return [
                        node.data.jobMaterialMakeMethodId,
                        {
                            bomId: bomIds[index],
                            description: node.data.description || node.data.itemReadableId
                        }
                    ]; }));
                    missingAssemblies = Array.from(uniqueMakeMethodIds)
                        .filter(function (makeMethodId) {
                        var _a, _b;
                        return !((_b = (_a = operations.data) === null || _a === void 0 ? void 0 : _a.some(function (op) { return op.jobMakeMethodId === makeMethodId; })) !== null && _b !== void 0 ? _b : false);
                    })
                        .map(function (makeMethodId) {
                        var info = bomInfoByMakeMethodId.get(makeMethodId !== null && makeMethodId !== void 0 ? makeMethodId : "");
                        return info
                            ? { bomId: info.bomId, description: info.description }
                            : { bomId: "?", description: makeMethodId !== null && makeMethodId !== void 0 ? makeMethodId : "Unknown" };
                    });
                    (0, react_dom_1.flushSync)(function () {
                        setMissingOperationAssemblies(missingAssemblies);
                        setHasOutsideOperations(operationsNeedingPurchaseOrders.length > 0);
                        setEachOutsideOperationHasASupplier(operationsNeedingPurchaseOrders.length === 0 ||
                            operationsNeedingPurchaseOrders.every(function (op) { return op.operationSupplierProcessId !== null; }));
                    });
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        validate();
    });
    if (!job)
        return null;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent size={hasOutsideOperations && eachOutsideOperationHasASupplier
            ? "large"
            : "medium"}>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Release Job</macro_1.Trans> {job === null || job === void 0 ? void 0 : job.jobId}
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        {loading ? (<react_1.ModalBody>
            <div className="flex flex-col h-[118px] w-full items-center justify-center gap-2">
              <react_1.Spinner className="size-8"/>
              <p className="text-sm">
                <macro_1.Trans>Validating job...</macro_1.Trans>
              </p>
            </div>
          </react_1.ModalBody>) : (<>
            <react_1.ModalBody>
              <react_1.VStack>
                {missingOperationAssemblies.length === 0 &&
                eachOutsideOperationHasASupplier && (<p className="text-sm">
                      <macro_1.Trans>
                        Are you sure you want to release this job? It will
                        become available to the shop floor, and drive purchasing
                        and production.
                      </macro_1.Trans>
                    </p>)}
                {hasOutsideOperations && eachOutsideOperationHasASupplier && (<>
                    <react_1.Alert>
                      <lu_1.LuShoppingCart />
                      <react_1.AlertTitle>
                        <macro_1.Trans>Purchase orders required</macro_1.Trans>
                      </react_1.AlertTitle>
                      <react_1.AlertDescription>
                        <macro_1.Trans>
                          A new purchase order will be created for each
                          supplier. Alternatively, you can choose an existing
                          draft purchase order for the supplier to add the
                          outside operations to.
                        </macro_1.Trans>
                      </react_1.AlertDescription>
                    </react_1.Alert>
                    {Object.entries(selectedPurchaseOrdersBySupplierId).map(function (_a) {
                    var _b;
                    var supplierId = _a[0], purchaseOrderId = _a[1];
                    var purchaseOrders = (_b = existingPurchaseOrdersBySupplierId[supplierId]) !== null && _b !== void 0 ? _b : [];
                    return (<div key={supplierId} className="flex justify-between items-center text-sm rounded-lg border p-4 w-full">
                            <SupplierAvatar_1.default supplierId={supplierId}/>
                            <Select_1.default size="sm" value={purchaseOrderId} isReadOnly={!Array.isArray(purchaseOrders) ||
                            purchaseOrders.length === 0} options={__spreadArray([
                            { value: "new", label: "Create New" }
                        ], purchaseOrders.map(function (po) { return ({
                            label: po.purchaseOrderId,
                            value: po.id
                        }); }), true)} onChange={function (value) {
                            setSelectedPurchaseOrdersBySupplierId(function (prev) {
                                var _a;
                                return (__assign(__assign({}, prev), (_a = {}, _a[supplierId] = value, _a)));
                            });
                        }}/>
                          </div>);
                })}
                  </>)}
                {missingOperationAssemblies.length > 0 && (<react_1.Alert variant="warning">
                    <lu_1.LuTriangleAlert />
                    <react_1.AlertTitle>
                      <macro_1.Trans>Missing Operations</macro_1.Trans>
                    </react_1.AlertTitle>
                    <react_1.AlertDescription>
                      <macro_1.Trans>
                        The following assemblies have no operations. Please
                        assign an operation to each before releasing.
                      </macro_1.Trans>
                      <ul className="mt-2 list-disc pl-4 space-y-1">
                        {__spreadArray([], missingOperationAssemblies, true).sort(function (a, b) {
                    return a.bomId.localeCompare(b.bomId, undefined, {
                        numeric: true
                    });
                })
                    .map(function (assembly) { return (<li key={assembly.bomId}>
                              <span className="font-medium">
                                {assembly.bomId}
                              </span>{" "}
                              — {assembly.description}
                            </li>); })}
                      </ul>
                    </react_1.AlertDescription>
                  </react_1.Alert>)}
                {!eachOutsideOperationHasASupplier && hasOutsideOperations && (<react_1.Alert variant="warning">
                    <lu_1.LuTriangleAlert />
                    <react_1.AlertTitle>
                      <macro_1.Trans>Missing Suppliers</macro_1.Trans>
                    </react_1.AlertTitle>
                    <react_1.AlertDescription>
                      <macro_1.Trans>
                        There are outside operations associated with this job
                        that have no suppliers. Please assign a supplier to each
                        outside operation before releasing it.
                      </macro_1.Trans>
                    </react_1.AlertDescription>
                  </react_1.Alert>)}
              </react_1.VStack>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <fetcher.Form onSubmit={function () {
                startSubmitted.current = true;
            }} method="post" action={"".concat(path_1.path.to.jobStatus(job.id), "?schedule=1").concat(stay ? "&stay=1" : "")}>
                <input type="hidden" name="status" value="Ready"/>
                <input type="hidden" name="selectedPurchaseOrdersBySupplierId" value={JSON.stringify(selectedPurchaseOrdersBySupplierId)}/>
                <react_1.Button isLoading={fetcher.state !== "idle" &&
                ((_b = fetcher.formData) === null || _b === void 0 ? void 0 : _b.get("status")) === "Ready"} isDisabled={fetcher.state !== "idle" ||
                missingOperationAssemblies.length > 0 ||
                !eachOutsideOperationHasASupplier} type="submit">
                  <macro_1.Trans>Release Job</macro_1.Trans>
                </react_1.Button>
              </fetcher.Form>
            </react_1.ModalFooter>
          </>)}
      </react_1.ModalContent>
    </react_1.Modal>);
}
function JobCancelModal(_a) {
    var job = _a.job, onClose = _a.onClose, fetcher = _a.fetcher, stay = _a.stay;
    var cancelSubmitted = (0, react_2.useRef)(false);
    useCloseInlineStatusModal(fetcher, cancelSubmitted, onClose);
    if (!job)
        return null;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Cancel</macro_1.Trans> {job === null || job === void 0 ? void 0 : job.jobId}
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <macro_1.Trans>
            Are you sure you want to cancel this job? It will no longer be
            available on the shop floor.
          </macro_1.Trans>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onClose}>
            <macro_1.Trans>Don't Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form onSubmit={function () {
            cancelSubmitted.current = true;
        }} method="post" action={stay
            ? "".concat(path_1.path.to.jobStatus(job.id), "?stay=1")
            : path_1.path.to.jobStatus(job.id)}>
            <input type="hidden" name="status" value="Cancelled"/>
            <react_1.Button variant="destructive" type="submit">
              <macro_1.Trans>Cancel Job</macro_1.Trans>
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function JobCompleteModal(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var job = _a.job, onClose = _a.onClose, fetcher = _a.fetcher, stay = _a.stay;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _l = (0, react_2.useState)(true), loading = _l[0], setLoading = _l[1];
    var t = (0, macro_1.useLingui)().t;
    var _m = (0, react_2.useState)(undefined), defaultStorageUnitId = _m[0], setDefaultStorageUnitId = _m[1];
    var _o = (0, react_2.useState)((_b = job === null || job === void 0 ? void 0 : job.quantityComplete) !== null && _b !== void 0 ? _b : 0), quantityComplete = _o[0], setQuantityComplete = _o[1];
    var _p = (0, react_2.useState)(false), hasTrackedQuantity = _p[0], setHasTrackedQuantity = _p[1];
    var _q = (0, react_2.useState)(undefined), leftoverAction = _q[0], setLeftoverAction = _q[1];
    var _r = (0, react_2.useState)(0), leftoverShipQuantity = _r[0], setLeftoverShipQuantity = _r[1];
    var _s = (0, react_2.useState)(0), leftoverReceiveQuantity = _s[0], setLeftoverReceiveQuantity = _s[1];
    var makeToOrder = !!(job === null || job === void 0 ? void 0 : job.salesOrderId) && !!(job === null || job === void 0 ? void 0 : job.salesOrderLineId);
    var leftoverQuantity = Math.max(0, quantityComplete - ((_c = job === null || job === void 0 ? void 0 : job.quantity) !== null && _c !== void 0 ? _c : 0));
    var hasLeftover = leftoverQuantity > 0;
    var getJobData = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, pickMethod, makeMethod, trackedEntities, availableQuantity;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("pickMethod")
                                .select("*")
                                .eq("locationId", job === null || job === void 0 ? void 0 : job.locationId)
                                .eq("itemId", job === null || job === void 0 ? void 0 : job.itemId)
                                .single(),
                            carbon
                                .from("jobMakeMethod")
                                .select("*")
                                .eq("jobId", job === null || job === void 0 ? void 0 : job.id)
                                .is("parentMaterialId", null)
                                .single()
                        ])];
                case 1:
                    _a = _f.sent(), pickMethod = _a[0], makeMethod = _a[1];
                    if (!(((_b = makeMethod.data) === null || _b === void 0 ? void 0 : _b.requiresSerialTracking) ||
                        ((_c = makeMethod.data) === null || _c === void 0 ? void 0 : _c.requiresBatchTracking))) return [3 /*break*/, 3];
                    return [4 /*yield*/, carbon
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes->>Job Make Method", (_d = makeMethod.data) === null || _d === void 0 ? void 0 : _d.id)
                            .order("createdAt", { ascending: true })];
                case 2:
                    trackedEntities = _f.sent();
                    if ((_e = trackedEntities.data) === null || _e === void 0 ? void 0 : _e.length) {
                        availableQuantity = trackedEntities.data.reduce(function (acc, curr) {
                            if (curr.status === "Available")
                                return acc + curr.quantity;
                            return acc;
                        }, 0);
                        setQuantityComplete(availableQuantity);
                        setHasTrackedQuantity(true);
                    }
                    _f.label = 3;
                case 3:
                    (0, react_dom_1.flushSync)(function () {
                        var _a, _b;
                        setDefaultStorageUnitId((_b = (_a = pickMethod.data) === null || _a === void 0 ? void 0 : _a.defaultStorageUnitId) !== null && _b !== void 0 ? _b : undefined);
                    });
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        if (!job)
            return;
        getJobData();
    });
    var handleLeftoverActionChange = function (action) {
        setLeftoverAction(action);
        if (action === "ship") {
            setLeftoverShipQuantity(leftoverQuantity);
            setLeftoverReceiveQuantity(0);
        }
        else if (action === "receive") {
            setLeftoverShipQuantity(0);
            setLeftoverReceiveQuantity(leftoverQuantity);
        }
        else if (action === "split") {
            var halfQty = Math.floor(leftoverQuantity / 2);
            setLeftoverShipQuantity(halfQty);
            setLeftoverReceiveQuantity(leftoverQuantity - halfQty);
        }
        else {
            setLeftoverShipQuantity(0);
            setLeftoverReceiveQuantity(0);
        }
    };
    if (!job)
        return null;
    return (<react_1.Modal open onOpenChange={onClose}>
      <react_1.ModalContent size={hasLeftover ? "large" : "medium"}>
        {loading ? (<react_1.ModalBody>
            <div className="flex flex-col h-[118px] w-full items-center justify-center gap-2">
              <react_1.Spinner className="size-8"/>
            </div>
          </react_1.ModalBody>) : (<form_1.ValidatedForm method="post" action={stay
                ? "".concat(path_1.path.to.jobComplete(job.id), "?stay=1")
                : path_1.path.to.jobComplete(job.id)} validator={production_models_1.jobCompleteValidator} onSuccess={onClose} defaultValues={{
                quantityComplete: (_d = job.quantity) !== null && _d !== void 0 ? _d : 0,
                salesOrderId: (_e = job.salesOrderId) !== null && _e !== void 0 ? _e : undefined,
                salesOrderLineId: (_f = job.salesOrderLineId) !== null && _f !== void 0 ? _f : undefined,
                locationId: (_g = job.locationId) !== null && _g !== void 0 ? _g : undefined,
                storageUnitId: (_j = (_h = job.storageUnitId) !== null && _h !== void 0 ? _h : defaultStorageUnitId) !== null && _j !== void 0 ? _j : undefined
            }} fetcher={fetcher}>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                {makeToOrder
                ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Complete Job"], ["Complete Job"]))) : t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Receive ", " to Inventory"], ["Receive ", " to Inventory"])), job.jobId)}
              </react_1.ModalTitle>
              <react_1.ModalDescription>
                {makeToOrder
                ? t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["This job will no longer be available on the shop floor."], ["This job will no longer be available on the shop floor."]))) : t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["This job will be received to inventory. It will no longer be available on the shop floor."], ["This job will be received to inventory. It will no longer be available on the shop floor."])))}
              </react_1.ModalDescription>
            </react_1.ModalHeader>
            <form_1.Hidden name="salesOrderId"/>
            <form_1.Hidden name="salesOrderLineId"/>
            <form_1.Hidden name="leftoverAction" value={leftoverAction}/>
            <form_1.Hidden name="leftoverShipQuantity" value={leftoverShipQuantity.toString()}/>
            <form_1.Hidden name="leftoverReceiveQuantity" value={leftoverReceiveQuantity.toString()}/>
            {makeToOrder && (<>
                <form_1.Hidden name="locationId"/>
                <form_1.Hidden name="storageUnitId"/>
              </>)}
            <react_1.ModalBody>
              <react_1.VStack spacing={4}>
                {!makeToOrder && (<>
                    <Form_1.Location name="locationId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Location"], ["Location"])))} isReadOnly/>
                    <Form_1.StorageUnit name="storageUnitId" locationId={(_k = job.locationId) !== null && _k !== void 0 ? _k : undefined} label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))}/>
                  </>)}
                <form_1.NumberControlled name="quantityComplete" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Quantity Completed"], ["Quantity Completed"])))} value={quantityComplete} onChange={function (value) { return setQuantityComplete(value); }} isDisabled={hasTrackedQuantity} helperText={hasTrackedQuantity
                ? t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Quantity is derived from completed serials/batches in MES and cannot be edited."], ["Quantity is derived from completed serials/batches in MES and cannot be edited."]))) : undefined}/>
                {hasLeftover && (<>
                    <react_1.Alert>
                      <lu_1.LuPackage />
                      <react_1.AlertTitle>
                        <macro_1.Trans>Leftover Parts Detected</macro_1.Trans>
                      </react_1.AlertTitle>
                      <react_1.AlertDescription>
                        {t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["You completed ", " more ", " than the ordered quantity of ", ". What would you like to do with the extra parts?"], ["You completed ", " more ", " than the ordered quantity of ", ". What would you like to do with the extra parts?"])), leftoverQuantity, leftoverQuantity === 1 ? "part" : "parts", job.quantity)}
                      </react_1.AlertDescription>
                    </react_1.Alert>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {makeToOrder && (<react_1.Button variant={leftoverAction === "ship" ? "primary" : "secondary"} onClick={function () { return handleLeftoverActionChange("ship"); }} type="button" className="h-auto py-3">
                          <react_1.VStack spacing={1}>
                            <span>
                              <macro_1.Trans>Ship to Customer</macro_1.Trans>
                            </span>
                            <span className="text-xs opacity-70">
                              <macro_1.Trans>Include extra parts in shipment</macro_1.Trans>
                            </span>
                          </react_1.VStack>
                        </react_1.Button>)}
                      <react_1.Button variant={leftoverAction === "receive" ? "primary" : "secondary"} onClick={function () { return handleLeftoverActionChange("receive"); }} type="button" className="h-auto py-3">
                        <react_1.VStack spacing={1}>
                          <span>
                            <macro_1.Trans>Receive to Inventory</macro_1.Trans>
                          </span>
                          <span className="text-xs opacity-70">
                            <macro_1.Trans>Add to stock for future use</macro_1.Trans>
                          </span>
                        </react_1.VStack>
                      </react_1.Button>
                      {makeToOrder && (<react_1.Button variant={leftoverAction === "split" ? "primary" : "secondary"} onClick={function () { return handleLeftoverActionChange("split"); }} type="button" className="h-auto py-3">
                          <react_1.VStack spacing={1}>
                            <span>
                              <macro_1.Trans>Split</macro_1.Trans>
                            </span>
                            <span className="text-xs opacity-70">
                              <macro_1.Trans>Ship some, stock some</macro_1.Trans>
                            </span>
                          </react_1.VStack>
                        </react_1.Button>)}
                      <react_1.Button variant={leftoverAction === "discard" ? "primary" : "secondary"} onClick={function () { return handleLeftoverActionChange("discard"); }} type="button" className="h-auto py-3">
                        <react_1.VStack spacing={1}>
                          <span>
                            <macro_1.Trans>Discard</macro_1.Trans>
                          </span>
                          <span className="text-xs opacity-70">
                            <macro_1.Trans>No action needed</macro_1.Trans>
                          </span>
                        </react_1.VStack>
                      </react_1.Button>
                    </div>
                    {leftoverAction === "split" && (<react_1.HStack className="w-full">
                        <div className="flex-1">
                          <form_1.NumberControlled name="leftoverShipQuantity" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Ship to Customer"], ["Ship to Customer"])))} value={leftoverShipQuantity} onChange={function (value) {
                        var shipQty = Math.min(value, leftoverQuantity);
                        setLeftoverShipQuantity(shipQty);
                        setLeftoverReceiveQuantity(leftoverQuantity - shipQty);
                    }} minValue={0} maxValue={leftoverQuantity}/>
                        </div>
                        <div className="flex-1">
                          <form_1.NumberControlled name="leftoverReceiveQuantity" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Receive to Inventory"], ["Receive to Inventory"])))} value={leftoverReceiveQuantity} onChange={function (value) {
                        var receiveQty = Math.min(value, leftoverQuantity);
                        setLeftoverReceiveQuantity(receiveQty);
                        setLeftoverShipQuantity(leftoverQuantity - receiveQty);
                    }} minValue={0} maxValue={leftoverQuantity}/>
                        </div>
                      </react_1.HStack>)}
                  </>)}
              </react_1.VStack>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button type="submit" isDisabled={hasLeftover && !leftoverAction}>
                <macro_1.Trans>Complete Job</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </form_1.ValidatedForm>)}
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21;
