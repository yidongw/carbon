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
exports.JobOperation = void 0;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var fa_1 = require("react-icons/fa");
var fa6_1 = require("react-icons/fa6");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var operations_service_1 = require("~/services/operations.service");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var ItemThumbnail_1 = require("../ItemThumbnail");
var Chat_1 = require("./components/Chat");
var Controls_1 = require("./components/Controls");
var IssueMaterialModal_1 = require("./components/IssueMaterialModal");
var MaintenanceDispatch_1 = require("./components/MaintenanceDispatch");
var Parameter_1 = require("./components/Parameter");
var QualityIssueModal_1 = require("./components/QualityIssueModal");
var QuantityModal_1 = require("./components/QuantityModal");
var ReworkModal_1 = require("./components/ReworkModal");
var SerialSelectorModal_1 = require("./components/SerialSelectorModal");
var Step_1 = require("./components/Step");
var TableSkeleton_1 = require("./components/TableSkeleton");
var useFiles_1 = require("./hooks/useFiles");
var useOperation_1 = require("./hooks/useOperation");
/**
 * Additive overlay badge showing how much of a material has been picked (staged at
 * lineside). Picking is optional, so this renders nothing unless something has actually
 * been picked — orange while partial, green once the full requirement is staged.
 */
function PickedBadge(_a) {
    var quantityPicked = _a.quantityPicked, quantityToPick = _a.quantityToPick;
    var t = (0, macro_1.useLingui)().t;
    var picked = Number(quantityPicked !== null && quantityPicked !== void 0 ? quantityPicked : 0);
    if (picked <= 0)
        return null;
    var toPick = Number(quantityToPick !== null && quantityToPick !== void 0 ? quantityToPick : 0);
    var isFullyPicked = toPick > 0 && picked >= toPick;
    return (<react_1.Badge variant={isFullyPicked ? "green" : "orange"} className="gap-1 shrink-0" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quantity picked to lineside"], ["Quantity picked to lineside"])))}>
      <lu_1.LuPackageCheck className="size-3"/>
      {isFullyPicked ? <macro_1.Trans>Picked</macro_1.Trans> : "".concat(picked, "/").concat(toPick)}
    </react_1.Badge>);
}
var JobOperation = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var events = _a.events, _u = _a.expiredEntityPolicy, expiredEntityPolicy = _u === void 0 ? "Block" : _u, files = _a.files, job = _a.job, kanban = _a.kanban, materials = _a.materials, method = _a.method, nonConformanceActions = _a.nonConformanceActions, originalOperation = _a.operation, productionQuantities = _a.productionQuantities, quantities = _a.quantities, procedure = _a.procedure, thumbnailPath = _a.thumbnailPath, trackedEntities = _a.trackedEntities, workCenter = _a.workCenter;
    var t = (0, macro_1.useLingui)().t;
    var _v = (0, hooks_1.useDateFormatter)(), formatDate = _v.formatDate, formatRelativeTime = _v.formatRelativeTime;
    var _w = (0, hooks_1.useUrlParams)(), params = _w[0], setParams = _w[1];
    var trackedEntityParam = params.get("trackedEntityId");
    var trackedEntityId = trackedEntityParam !== null && trackedEntityParam !== void 0 ? trackedEntityParam : (_b = trackedEntities[0]) === null || _b === void 0 ? void 0 : _b.id;
    var parentIsSerial = method === null || method === void 0 ? void 0 : method.requiresSerialTracking;
    var parentIsBatch = method === null || method === void 0 ? void 0 : method.requiresBatchTracking;
    var serialIndex = (_c = trackedEntities.findIndex(function (entity) { return entity.id === trackedEntityId; })) !== null && _c !== void 0 ? _c : 0;
    var navigate = (0, react_router_1.useNavigate)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _x = (0, hooks_1.useUser)(), userId = _x.id, companyId = _x.company.id;
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var items = (0, stores_1.useItems)()[0];
    var _y = (0, useFiles_1.useFiles)(job), downloadFile = _y.downloadFile, downloadModel = _y.downloadModel, getFilePath = _y.getFilePath;
    var attributeRecordModal = (0, react_1.useDisclosure)();
    var attributeRecordDeleteModal = (0, react_1.useDisclosure)();
    var maintenanceModal = (0, react_1.useDisclosure)();
    var qualityIssueModal = (0, react_1.useDisclosure)();
    var _z = (0, react_2.useState)(parentIsSerial ? serialIndex : 0), activeStep = _z[0], setActiveStep = _z[1];
    var _0 = (0, react_2.useState)(false), hasMultipleRecords = _0[0], setHasMultipleRecords = _0[1];
    (0, react_2.useEffect)(function () {
        if (parentIsSerial) {
            setActiveStep(serialIndex);
        }
    }, [parentIsSerial, serialIndex]);
    var isModalOpen = attributeRecordModal.isOpen || attributeRecordDeleteModal.isOpen;
    var _1 = (0, useOperation_1.useOperation)({
        operation: originalOperation,
        events: events,
        trackedEntities: trackedEntities,
        pauseInterval: isModalOpen,
        procedure: procedure
    }), actionsSheet = _1.actionsSheet, availableEntities = _1.availableEntities, active = _1.active, activeTab = _1.activeTab, completeModal = _1.completeModal, eventType = _1.eventType, finishModal = _1.finishModal, isOverdue = _1.isOverdue, issueModal = _1.issueModal, laborProductionEvent = _1.laborProductionEvent, machineProductionEvent = _1.machineProductionEvent, operation = _1.operation, progress = _1.progress, reworkModal = _1.reworkModal, scrapModal = _1.scrapModal, serialModal = _1.serialModal, selectedMaterial = _1.selectedMaterial, setActiveTab = _1.setActiveTab, setEventType = _1.setEventType, setSelectedMaterial = _1.setSelectedMaterial, setupProductionEvent = _1.setupProductionEvent;
    var controlsHeight = (0, react_2.useMemo)(function () {
        var operations = 1;
        if (operation.setupDuration > 0)
            operations++;
        if (operation.laborDuration > 0)
            operations++;
        if (operation.machineDuration > 0)
            operations++;
        return 60 + operations * 36;
    }, [
        operation.laborDuration,
        operation.machineDuration,
        operation.setupDuration
    ]);
    var mode = (0, react_1.useMode)();
    var operationId = (0, react_router_1.useParams)().operationId;
    var modelUpload = job.modelPath || operation.itemModelPath
        ? {
            modelPath: (_d = operation.itemModelPath) !== null && _d !== void 0 ? _d : job.modelPath,
            modelId: (_e = operation.itemModelId) !== null && _e !== void 0 ? _e : job.modelId,
            modelName: (_f = operation.itemModelName) !== null && _f !== void 0 ? _f : job.modelName,
            modelSize: (_g = operation.itemModelSize) !== null && _g !== void 0 ? _g : job.modelSize
        }
        : null;
    var fetcher = (0, react_router_1.useFetcher)();
    // Lazy creation of Inspection steps for non-conformance actions
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        function createInspectionStepsForNonConformanceActions() {
            return __awaiter(this, void 0, void 0, function () {
                var activeActions, resolvedProcedure, existingSteps, existingActionIds, newSteps, maxSortOrder, _i, activeActions_1, action, actionId, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!carbon || !operationId)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, nonConformanceActions];
                        case 2:
                            activeActions = _a.sent();
                            return [4 /*yield*/, procedure];
                        case 3:
                            resolvedProcedure = _a.sent();
                            if (activeActions.length === 0)
                                return [2 /*return*/];
                            existingSteps = resolvedProcedure.attributes.filter(function (step) {
                                return step.type === "Inspection" && step.nonConformanceActionId != null;
                            });
                            existingActionIds = new Set(existingSteps.map(function (step) { return step.nonConformanceActionId; }));
                            newSteps = [];
                            maxSortOrder = Math.max.apply(Math, __spreadArray(__spreadArray([], resolvedProcedure.attributes.map(function (s) { var _a; return (_a = s.sortOrder) !== null && _a !== void 0 ? _a : 0; }), false), [0], false));
                            for (_i = 0, activeActions_1 = activeActions; _i < activeActions_1.length; _i++) {
                                action = activeActions_1[_i];
                                actionId = action.id;
                                if (!actionId || existingActionIds.has(actionId))
                                    continue;
                                newSteps.push({
                                    companyId: companyId,
                                    createdBy: userId,
                                    operationId: operationId,
                                    name: "".concat(action.actionTypeName, " - ").concat(action.nonConformanceId),
                                    type: "Inspection",
                                    sortOrder: ++maxSortOrder,
                                    nonConformanceActionId: actionId
                                });
                            }
                            if (newSteps.length > 0) {
                                fetcher.submit(JSON.stringify(newSteps), {
                                    method: "post",
                                    action: path_1.path.to.inspectionSteps,
                                    encType: "application/json"
                                });
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error("Failed to create inspection steps for non-conformance actions:", error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        createInspectionStepsForNonConformanceActions();
    }, [
        carbon,
        operationId,
        nonConformanceActions,
        procedure,
        companyId,
        userId
    ]);
    var _2 = (0, react_2.useState)(null), selectedStep = _2[0], setSelectedStep = _2[1];
    var onRecordStepRecord = function (attribute) {
        (0, react_dom_1.flushSync)(function () {
            setSelectedStep(attribute);
        });
        attributeRecordModal.onOpen();
    };
    var onDeleteStepRecord = function (attribute) {
        (0, react_dom_1.flushSync)(function () {
            setSelectedStep(attribute);
        });
        attributeRecordDeleteModal.onOpen();
    };
    var onDeselectStep = function () {
        setSelectedStep(null);
        attributeRecordModal.onClose();
        attributeRecordDeleteModal.onClose();
    };
    var layoutData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var locationId = layoutData === null || layoutData === void 0 ? void 0 : layoutData.location;
    var completeFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useKeyboardWedge)({
        test: function (input) {
            if (kanban === null || kanban === void 0 ? void 0 : kanban.completedBarcodeOverride) {
                return input === kanban.completedBarcodeOverride;
            }
            else if (kanban === null || kanban === void 0 ? void 0 : kanban.id) {
                return input === path_1.path.to.kanbanComplete(kanban.id);
            }
            return false;
        },
        callback: function () {
            completeFetcher.load(path_1.path.to.endOperation(operation.id));
        },
        active: !!(kanban === null || kanban === void 0 ? void 0 : kanban.id)
    });
    var item = items.find(function (it) { return it.id === operation.itemId; });
    return (<>
      <react_1.Tabs key={"operation-".concat(operation.id)} value={activeTab} onValueChange={setActiveTab} className="w-full h-screen bg-card relative" style={{ "--controls-height": "".concat(controlsHeight, "px") }}>
        <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-2">
          <react_1.HStack className="w-full justify-between">
            <div className="flex items-center gap-0">
              <react_1.SidebarTrigger className="md:hidden"/>

              <react_1.Button variant="ghost" leftIcon={<lu_1.LuChevronLeft />} onClick={function () { return navigate(path_1.path.to.operations); }} className="pl-2">
                <macro_1.Trans>Schedule</macro_1.Trans>
              </react_1.Button>
            </div>
            <div className="flex flex-shrink-0 items-center justify-end gap-2">
              <react_1.TabsList className="md:ml-auto">
                <react_1.TabsTrigger value="details">
                  <macro_1.Trans>Details</macro_1.Trans>
                </react_1.TabsTrigger>
                <react_1.TabsTrigger disabled={!job.modelPath && !operation.itemModelPath} value="model">
                  <macro_1.Trans>Model</macro_1.Trans>
                </react_1.TabsTrigger>
                <react_1.TabsTrigger value="procedure">
                  <macro_1.Trans>Procedure</macro_1.Trans>
                </react_1.TabsTrigger>
                <react_1.TabsTrigger value="chat">
                  <macro_1.Trans>Chat</macro_1.Trans>
                </react_1.TabsTrigger>
              </react_1.TabsList>
            </div>
          </react_1.HStack>
        </header>

        <div className="flex flex-wrap items-center justify-between px-4 lg:pl-6 py-2 min-h-[var(--header-height)] bg-background gap-2 md:gap-4 max-w-[100vw] overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
          <react_1.HStack className="min-w-22 justify-between">
            <react_1.Heading size="h4">{operation.jobReadableId}</react_1.Heading>

            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More options"], ["More options"])))} variant="ghost" icon={<lu_1.LuEllipsisVertical />}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="start">
                <react_1.DropdownMenuItem asChild>
                  <a href={path_1.path.to.file.jobTraveler(operation.jobMakeMethodId)} target="_blank" rel="noreferrer">
                    <react_1.DropdownMenuIcon icon={<lu_1.LuQrCode />}/>
                    <macro_1.Trans>Job Traveler</macro_1.Trans>
                  </a>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem asChild>
                  <react_router_1.Link to={path_1.path.to.jobDetail(operation.jobId)}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlay />}/>
                    <macro_1.Trans>Job Details</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>
                {item && (<react_1.DropdownMenuItem asChild>
                    <react_router_1.Link to={path_1.path.to.itemMaster(item === null || item === void 0 ? void 0 : item.id, item.type)}>
                      <react_1.DropdownMenuIcon icon={<Icons_1.MethodItemTypeIcon type={item.type}/>}/>
                      <macro_1.Trans>Item Master</macro_1.Trans>
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>)}
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.HStack>

          <react_1.HStack className="hidden md:flex justify-end items-center gap-2">
            {((_h = job.customer) === null || _h === void 0 ? void 0 : _h.name) && (<react_1.HStack className="justify-start space-x-2">
                <lu_1.LuSquareUser className="text-muted-foreground"/>
                <span className="text-sm truncate">{job.customer.name}</span>
              </react_1.HStack>)}
            {operation.description && (<react_1.HStack className="justify-start space-x-2">
                <lu_1.LuClipboardCheck className="text-muted-foreground"/>
                <span className="text-sm truncate">
                  {operation.description}
                </span>
              </react_1.HStack>)}
            {operation.operationStatus && (<react_1.HStack className="justify-start space-x-2">
                <components_1.OperationStatusIcon status={operation.jobStatus === "Paused"
                ? "Paused"
                : operation.operationStatus}/>
                <span className="text-sm truncate">
                  {operation.jobStatus === "Paused"
                ? "Paused"
                : operation.operationStatus}
                </span>
              </react_1.HStack>)}
            {typeof operation.duration === "number" && (<react_1.HStack className="justify-start space-x-2">
                <lu_1.LuTimer className="text-muted-foreground"/>
                <span className="text-sm truncate">
                  {(0, utils_1.formatDurationMilliseconds)(operation.duration)}
                </span>
              </react_1.HStack>)}
            {operation.jobDeadlineType && (<react_1.HStack className="justify-start space-x-2">
                <components_1.DeadlineIcon deadlineType={operation.jobDeadlineType} overdue={isOverdue}/>

                <span className={(0, react_1.cn)("text-sm truncate", isOverdue ? "text-red-500" : "")}>
                  {["ASAP", "No Deadline"].includes(operation.jobDeadlineType)
                ? operation.jobDeadlineType
                : operation.operationDueDate
                    ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Due ", ""], ["Due ", ""])), formatRelativeTime((0, utils_1.convertDateStringToIsoString)(operation.operationDueDate))) : "–"}
                </span>
              </react_1.HStack>)}
          </react_1.HStack>
        </div>
        <react_1.Separator />

        <react_1.TabsContent value="details" className="flex flex-col">
          <react_1.ScrollArea className="w-full md:pr-[calc(var(--controls-width))] h-[calc(100dvh-var(--header-height)*2-var(--controls-height)-2rem)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
            <div className="flex items-start justify-between p-4 lg:p-6">
              <react_1.HStack>
                {thumbnailPath && (<ItemThumbnail_1.default thumbnailPath={thumbnailPath} size="xl"/>)}
                <div className="flex flex-col flex-grow">
                  <react_1.HStack spacing={2}>
                    <react_1.Heading size="h3" className="line-clamp-1">
                      {operation.description}
                    </react_1.Heading>
                    {operation.reworkId && <react_1.Badge variant="red">Rework</react_1.Badge>}
                  </react_1.HStack>
                  <p className="text-muted-foreground line-clamp-1">
                    {operation.itemDescription}{" "}
                  </p>
                </div>
              </react_1.HStack>
              <div className="flex flex-col flex-shrink items-end">
                <react_1.Heading size="h2">
                  {(0, utils_1.formatDurationMilliseconds)((((_j = progress.setup) !== null && _j !== void 0 ? _j : 0) +
            ((_k = progress.labor) !== null && _k !== void 0 ? _k : 0) +
            ((_l = progress.machine) !== null && _l !== void 0 ? _l : 0)) /
            Math.max(operation.quantityComplete, 1), {
            style: "short"
        })}
                </react_1.Heading>
                <p className="text-muted-foreground line-clamp-1">
                  {operation.itemUnitOfMeasure}
                </p>
              </div>
            </div>
            <react_1.Separator />
            <div className="flex items-start p-4 lg:p-6">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 w-full">
                <react_1.Card>
                  <react_1.CardHeader className="flex flex-row items-center gap-2 justify-between">
                    <react_1.CardTitle>
                      <macro_1.Trans>Completed</macro_1.Trans>
                    </react_1.CardTitle>
                    <fa6_1.FaCheck className="h-3 w-3 text-emerald-500"/>
                  </react_1.CardHeader>

                  <react_1.CardContent>
                    <react_1.Heading size="h1">
                      <macro_1.Trans>
                        {operation.quantityComplete} of{" "}
                        {operation.targetQuantity}
                      </macro_1.Trans>
                    </react_1.Heading>
                  </react_1.CardContent>
                </react_1.Card>
                <react_1.Card>
                  <react_1.CardHeader className="flex flex-row items-center gap-2 justify-between">
                    <react_1.CardTitle>
                      <macro_1.Trans>Scrapped</macro_1.Trans>
                    </react_1.CardTitle>
                    <fa6_1.FaTrash className="h-3 w-3 text-muted-foreground"/>
                  </react_1.CardHeader>
                  <react_1.CardContent>
                    <react_1.Heading size="h1">{operation.quantityScrapped}</react_1.Heading>
                  </react_1.CardContent>
                </react_1.Card>
                <react_1.Card>
                  <react_1.CardHeader className="flex flex-row items-center gap-2 justify-between">
                    <react_1.CardTitle>
                      <macro_1.Trans>Due Date</macro_1.Trans>
                    </react_1.CardTitle>
                    <components_1.DeadlineIcon deadlineType={operation.jobDeadlineType} overdue={isOverdue}/>
                  </react_1.CardHeader>
                  <react_1.CardContent>
                    <react_1.VStack className="justify-start" spacing={0}>
                      <react_1.Heading size="h3" className={(0, react_1.cn)("w-full truncate", isOverdue ? "text-red-500" : "")}>
                        {["ASAP", "No Deadline"].includes(operation.jobDeadlineType)
            ? operation.jobDeadlineType
            : operation.operationDueDate
                ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Due ", ""], ["Due ", ""])), formatRelativeTime((0, utils_1.convertDateStringToIsoString)(operation.operationDueDate))) : "–"}
                      </react_1.Heading>
                      <span className="text-muted-foreground text-sm">
                        {operation.operationDueDate
            ? formatDate(operation.operationDueDate)
            : null}
                      </span>
                    </react_1.VStack>
                  </react_1.CardContent>
                </react_1.Card>
              </div>
            </div>

            <react_2.Suspense key={"non-conformance-actions-".concat(operationId)}>
              <react_router_1.Await resolve={nonConformanceActions}>
                {function (resolvedNonConformanceActions) {
            return resolvedNonConformanceActions.map(function (action) {
                if (Object.keys(action.notes).length === 0) {
                    return null;
                }
                return (<>
                        <react_1.Separator />
                        <div className="flex flex-col items-start justify-between w-full">
                          <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
                            <div className="flex flex-col gap-0.5">
                              <react_1.Heading size="h3">
                                {action.actionTypeName}
                              </react_1.Heading>
                              <div>
                                <react_1.Badge variant="outline">
                                  {action.nonConformanceId}
                                </react_1.Badge>
                              </div>
                            </div>
                            <div className="prose dark:prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{
                        __html: (0, react_1.generateHTML)(action.notes)
                    }}/>
                          </div>
                        </div>
                      </>);
            });
        }}
              </react_router_1.Await>
            </react_2.Suspense>

            <react_2.Suspense key={"attributes-".concat(operationId)}>
              <react_router_1.Await resolve={procedure}>
                {function (resolvedProcedure) {
            var attributes = resolvedProcedure.attributes, parameters = resolvedProcedure.parameters;
            return (<>
                      {attributes.length > 0 && (<>
                          <react_1.Separator />
                          <div className="flex flex-col items-start justify-between w-full">
                            <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
                              <react_1.HStack className="justify-between w-full">
                                <react_1.Heading size="h3">
                                  <macro_1.Trans>Steps</macro_1.Trans>
                                </react_1.Heading>
                                <div className="flex items-center gap-2">
                                  {attributes.length > 0 &&
                        (function () {
                            var maxRecords = parentIsSerial
                                ? trackedEntities.length
                                : operation.operationQuantity +
                                    operation.quantityScrapped;
                            var isRecordSetStarted = recordSetIsStarted(attributes, activeStep);
                            var canCreateNewRecord = !parentIsSerial && isRecordSetStarted;
                            var canNavigateNext = isRecordSetStarted &&
                                activeStep <
                                    operation.operationQuantity +
                                        operation.quantityScrapped -
                                        1;
                            var showNavigation = hasMultipleRecords ||
                                attributes.some(function (att) {
                                    return att.jobOperationStepRecord.length >
                                        1;
                                });
                            return (<div className="flex flex-col items-end justify-center gap-2">
                                          <div className="flex items-center gap-1">
                                            {showNavigation &&
                                    !parentIsSerial && (<>
                                                  <react_1.IconButton aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Previous record set"], ["Previous record set"])))} variant="secondary" icon={<lu_1.LuChevronLeft />} onClick={function () {
                                        setActiveStep(activeStep - 1);
                                    }} isDisabled={activeStep === 0}/>
                                                  <span className="text-sm font-medium px-2 min-w-[60px] text-center">
                                                    <macro_1.Trans>
                                                      Record {activeStep + 1}
                                                    </macro_1.Trans>
                                                  </span>
                                                  <react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Next record set"], ["Next record set"])))} variant="secondary" icon={<lu_1.LuChevronRight />} onClick={function () {
                                        setActiveStep(activeStep + 1);
                                    }} isDisabled={!canNavigateNext}/>
                                                </>)}
                                            {canCreateNewRecord &&
                                    !showNavigation && (<react_1.Button aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Add new record set"], ["Add new record set"])))} variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={function () {
                                        var nextIndex = activeStep + 1;
                                        if (nextIndex >= maxRecords) {
                                            react_1.toast.warning(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Maximum number of records reached"], ["Maximum number of records reached"]))));
                                            return;
                                        }
                                        setHasMultipleRecords(true);
                                        setActiveStep(nextIndex);
                                    }} isDisabled={activeStep + 1 >= maxRecords}>
                                                  <macro_1.Trans>New Record</macro_1.Trans>
                                                </react_1.Button>)}
                                            {parentIsSerial && (<react_1.Heading size="h2">
                                                <macro_1.Trans>
                                                  {serialIndex + 1} of{" "}
                                                  {operation.operationQuantity}
                                                </macro_1.Trans>
                                              </react_1.Heading>)}
                                          </div>

                                          <react_1.BarProgress label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Steps"], ["Steps"])))} gradient invertGradient progress={(attributes.filter(function (a) {
                                    return a.jobOperationStepRecord.some(function (r) { return r.index === activeStep; });
                                }).length /
                                    attributes.length) *
                                    100}/>
                                          <span className="text-xs text-muted-foreground">
                                            <macro_1.Trans>
                                              {attributes.filter(function (a) {
                                    return a.jobOperationStepRecord.some(function (r) {
                                        return r.index === activeStep;
                                    });
                                }).length}{" "}
                                              of {attributes.length} complete
                                            </macro_1.Trans>
                                          </span>
                                        </div>);
                        })()}
                                </div>
                              </react_1.HStack>
                              <div className="border rounded-lg">
                                {attributes
                        .sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); })
                        .map(function (step, index) { return (<Step_1.StepsListItem key={"step-".concat(step.id)} activeStep={activeStep} step={step} onRecord={onRecordStepRecord} onDelete={onDeleteStepRecord} operationId={operationId} className={index === attributes.length - 1
                            ? "border-none"
                            : ""}/>); })}
                              </div>
                            </div>
                          </div>
                        </>)}
                      {parameters.length > 0 && (<>
                          <react_1.Separator />
                          <div className="flex flex-col items-start justify-between w-full">
                            <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
                              <react_1.HStack className="justify-between w-full">
                                <react_1.Heading size="h3">
                                  <macro_1.Trans>Process Parameters</macro_1.Trans>
                                </react_1.Heading>
                              </react_1.HStack>
                              <div className="border rounded-lg">
                                {parameters
                        .sort(function (a, b) { var _a, _b; return ((_a = a.key) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.key) !== null && _b !== void 0 ? _b : ""); })
                        .map(function (p, index) { return (<Parameter_1.ParametersListItem key={"parameter-".concat(p.id)} parameter={p} operationId={operationId} className={index === parameters.length - 1
                            ? "border-none"
                            : ""}/>); })}
                              </div>
                            </div>
                          </div>
                        </>)}
                    </>);
        }}
              </react_router_1.Await>
            </react_2.Suspense>

            <react_1.Separator />
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
                <react_1.HStack className="justify-between w-full">
                  <react_1.Heading size="h3">
                    <macro_1.Trans>Materials</macro_1.Trans>
                  </react_1.Heading>
                  <react_1.Button aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Issue Material"], ["Issue Material"])))} leftIcon={<lu_1.LuGitBranchPlus />} variant="secondary" size="lg" onClick={function () {
            (0, react_dom_1.flushSync)(function () {
                setSelectedMaterial(null);
            });
            issueModal.onOpen();
        }}>
                    <macro_1.Trans>Issue Material</macro_1.Trans>
                  </react_1.Button>
                </react_1.HStack>
                <react_2.Suspense key={"materials-".concat(operationId)} fallback={<TableSkeleton_1.TableSkeleton />}>
                  <react_router_1.Await resolve={materials}>
                    {function (resolvedMaterials) {
            var _a, _b, _c;
            var baseMaterials = resolvedMaterials === null || resolvedMaterials === void 0 ? void 0 : resolvedMaterials.materials.filter(function (m) { return !m.isKitComponent; });
            var kitMaterialsByParentId = resolvedMaterials === null || resolvedMaterials === void 0 ? void 0 : resolvedMaterials.materials.filter(function (m) { var _a; return (_a = m.isKitComponent) !== null && _a !== void 0 ? _a : false; }).reduce(function (acc, material) {
                if (material.kitParentId) {
                    if (!acc[material.kitParentId]) {
                        acc[material.kitParentId] = [];
                    }
                    acc[material.kitParentId].push(material);
                }
                return acc;
            }, {});
            return (<>
                          <react_1.Table className="w-full text-base">
                            <react_1.Thead>
                              <react_1.Tr>
                                <react_1.Th className="text-sm">
                                  <macro_1.Trans>Part</macro_1.Trans>
                                </react_1.Th>
                                <react_1.Th className="text-sm lg:table-cell hidden">
                                  <macro_1.Trans>Source</macro_1.Trans>
                                </react_1.Th>
                                <react_1.Th className="text-sm">
                                  <macro_1.Trans>Estimated</macro_1.Trans>
                                </react_1.Th>
                                <react_1.Th className="text-sm">
                                  <macro_1.Trans>Actual</macro_1.Trans>
                                </react_1.Th>
                                <react_1.Th className="text-right"/>
                              </react_1.Tr>
                            </react_1.Thead>
                            <react_1.Tbody>
                              {baseMaterials.length === 0 ? (<react_1.Tr>
                                  <react_1.Td colSpan={24} className="py-8 text-muted-foreground text-center">
                                    <macro_1.Trans>No materials</macro_1.Trans>
                                  </react_1.Td>
                                </react_1.Tr>) : (baseMaterials.map(function (material) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    var isRelatedToOperation = material.jobOperationId === operationId;
                    var someRelatedMaterialIsIssued = baseMaterials.some(function (m) {
                        var _a, _b;
                        return m.itemReadableIdWithoutRevision ===
                            material.itemReadableIdWithoutRevision &&
                            (((_a = m.quantityIssued) !== null && _a !== void 0 ? _a : 0) > 0 ||
                                ((_b = material.quantityIssued) !== null && _b !== void 0 ? _b : 0) > 0);
                    });
                    var kittedChildren = material.id
                        ? kitMaterialsByParentId[material.id]
                        : [];
                    return (<>
                                      <react_1.Tr key={"material-".concat(material.id)} className={(0, react_1.cn)("[&>td]:py-3", !isRelatedToOperation &&
                            "opacity-50 hover:opacity-100")}>
                                        <react_1.Td>
                                          <react_1.HStack spacing={2} className="justify-between">
                                            <react_1.VStack spacing={0}>
                                              <span className="font-semibold text-base">
                                                {(0, utils_1.getItemReadableId)(items, (_a = material.itemId) !== null && _a !== void 0 ? _a : "")}
                                              </span>
                                              <span className="text-muted-foreground text-sm">
                                                {material.description}
                                              </span>
                                            </react_1.VStack>
                                            {material.requiresBatchTracking ? (<react_1.Badge variant="secondary">
                                                <Icons_1.TrackingTypeIcon type="Batch" className="shrink-0"/>
                                              </react_1.Badge>) : material.requiresSerialTracking ? (<react_1.Badge variant="secondary">
                                                <Icons_1.TrackingTypeIcon type="Serial" className="shrink-0"/>
                                              </react_1.Badge>) : null}
                                            {material.hasExpiredConsumed && (<react_1.Badge variant="red" className="gap-1 shrink-0" title={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["A consumed batch or serial is now past its expiry date."], ["A consumed batch or serial is now past its expiry date."])))}>
                                                <lu_1.LuTriangleAlert className="size-3"/>
                                                <macro_1.Trans>Consumed expired</macro_1.Trans>
                                              </react_1.Badge>)}
                                            <PickedBadge quantityPicked={material.quantityPicked} quantityToPick={material.quantityToPick}/>
                                          </react_1.HStack>
                                        </react_1.Td>
                                        <react_1.Td className="hidden lg:table-cell">
                                          <div className="flex flex-row items-center gap-1">
                                            <react_1.Badge variant="secondary">
                                              <Icons_1.MethodIcon type={(_b = material.methodType) !== null && _b !== void 0 ? _b : ""} isKit={(_c = material.kit) !== null && _c !== void 0 ? _c : false} className="mr-2"/>
                                              {material.methodType ===
                            "Make to Order" && material.kit
                            ? t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Kit"], ["Kit"]))) : material.methodType}
                                            </react_1.Badge>
                                            <lu_1.LuArrowLeft className={(0, react_1.cn)(material.methodType ===
                            "Make to Order"
                            ? "rotate-180"
                            : "")}/>
                                            <react_1.Badge variant="secondary">
                                              <lu_1.LuGitPullRequest className="size-3 mr-1"/>
                                              {(_d = material.storageUnitName) !== null && _d !== void 0 ? _d : (material.methodType ===
                            "Make to Order"
                            ? t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["WIP"], ["WIP"]))) : t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Default Storage Unit"], ["Default Storage Unit"]))))}
                                            </react_1.Badge>
                                          </div>
                                        </react_1.Td>

                                        <react_1.Td>
                                          {parentIsSerial &&
                            (material.requiresBatchTracking ||
                                material.requiresSerialTracking)
                            ? "".concat((_e = material.quantity) !== null && _e !== void 0 ? _e : material.estimatedQuantity, "/").concat((_f = material.estimatedQuantity) !== null && _f !== void 0 ? _f : material.quantity)
                            : ((_g = material.estimatedQuantity) !== null && _g !== void 0 ? _g : material.quantity)}
                                        </react_1.Td>
                                        <react_1.Td>
                                          {material.methodType ===
                            "Make to Order" &&
                            material.requiresBatchTracking ===
                                false &&
                            material.requiresSerialTracking ===
                                false ? (<Icons_1.MethodIcon type="Make to Order" isKit={(_h = material.kit) !== null && _h !== void 0 ? _h : false}/>) : parentIsSerial &&
                            (material.requiresBatchTracking ||
                                material.requiresSerialTracking) ? ("".concat(material.quantityIssued, "/").concat((_j = material.quantity) !== null && _j !== void 0 ? _j : material.estimatedQuantity)) : (material.quantityIssued)}
                                        </react_1.Td>
                                        <react_1.Td className="text-right">
                                          {material.methodType !==
                            "Make to Order" &&
                            material.requiresBatchTracking ===
                                false &&
                            material.requiresSerialTracking ===
                                false && (<react_1.IconButton aria-label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Issue Material"], ["Issue Material"])))} variant="ghost" icon={<lu_1.LuGitBranchPlus />} className="h-8 w-8" onClick={function () {
                                (0, react_dom_1.flushSync)(function () {
                                    setSelectedMaterial(material);
                                });
                                issueModal.onOpen();
                            }}/>)}
                                          {(material.requiresBatchTracking ||
                            material.requiresSerialTracking) && (<react_1.Button className="flex-shrink-0" size="lg" variant={someRelatedMaterialIsIssued ||
                                !isRelatedToOperation
                                ? "secondary"
                                : "primary"} leftIcon={<lu_1.LuQrCode />} onClick={function () {
                                (0, react_dom_1.flushSync)(function () {
                                    setSelectedMaterial(material);
                                });
                                issueModal.onOpen();
                            }}>
                                              <macro_1.Trans>Issue</macro_1.Trans>
                                            </react_1.Button>)}
                                        </react_1.Td>
                                      </react_1.Tr>

                                      {kittedChildren &&
                            kittedChildren.map(function (kittedChild, index) {
                                var _a, _b, _c, _d, _e, _f, _g;
                                return (<react_1.Tr key={"kittedChild-".concat(kittedChild.id)} className={(0, react_1.cn)(index ===
                                        kittedChildren.length - 1
                                        ? "border-b"
                                        : index === 0
                                            ? "border-t"
                                            : "", !isRelatedToOperation &&
                                        "opacity-50 hover:opacity-100")}>
                                              <react_1.Td className="pl-10">
                                                <react_1.HStack spacing={2} className="justify-between">
                                                  <react_1.VStack spacing={0}>
                                                    <span className="font-semibold">
                                                      {(0, utils_1.getItemReadableId)(items, kittedChild.itemId)}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                      {kittedChild.description}
                                                    </span>
                                                  </react_1.VStack>
                                                  {kittedChild.requiresBatchTracking ? (<react_1.Badge variant="secondary">
                                                      <Icons_1.TrackingTypeIcon type="Batch" className="shrink-0"/>
                                                    </react_1.Badge>) : kittedChild.requiresSerialTracking ? (<react_1.Badge variant="secondary">
                                                      <Icons_1.TrackingTypeIcon type="Serial" className="shrink-0"/>
                                                    </react_1.Badge>) : null}
                                                  <PickedBadge quantityPicked={kittedChild.quantityPicked} quantityToPick={kittedChild.quantityToPick}/>
                                                </react_1.HStack>
                                              </react_1.Td>
                                              <react_1.Td className="lg:table-cell hidden">
                                                <react_1.Badge variant="secondary">
                                                  <Icons_1.MethodIcon type={(_a = kittedChild.methodType) !== null && _a !== void 0 ? _a : ""} isKit={(_b = kittedChild.kit) !== null && _b !== void 0 ? _b : false} className="mr-2"/>
                                                  {kittedChild.methodType ===
                                        "Make to Order" &&
                                        kittedChild.kit
                                        ? t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Kit"], ["Kit"]))) : kittedChild.methodType}
                                                </react_1.Badge>
                                              </react_1.Td>

                                              <react_1.Td>
                                                {parentIsSerial &&
                                        (kittedChild.requiresBatchTracking ||
                                            kittedChild.requiresSerialTracking)
                                        ? "".concat((_c = kittedChild.quantity) !== null && _c !== void 0 ? _c : kittedChild.estimatedQuantity, "/").concat((_d = kittedChild.estimatedQuantity) !== null && _d !== void 0 ? _d : kittedChild.quantity)
                                        : ((_e = kittedChild.estimatedQuantity) !== null && _e !== void 0 ? _e : kittedChild.quantity)}
                                              </react_1.Td>
                                              <react_1.Td>
                                                {kittedChild.methodType ===
                                        "Make to Order" &&
                                        kittedChild.requiresBatchTracking ===
                                            false &&
                                        kittedChild.requiresSerialTracking ===
                                            false ? (<Icons_1.MethodIcon type="Make to Order" isKit={(_f = kittedChild.kit) !== null && _f !== void 0 ? _f : false}/>) : parentIsSerial &&
                                        (kittedChild.requiresBatchTracking ||
                                            kittedChild.requiresSerialTracking) ? ("".concat(kittedChild.quantityIssued, "/").concat((_g = kittedChild.quantity) !== null && _g !== void 0 ? _g : kittedChild.estimatedQuantity)) : (kittedChild.quantityIssued)}
                                              </react_1.Td>
                                              <react_1.Td className="text-right">
                                                {kittedChild.methodType !==
                                        "Make to Order" &&
                                        kittedChild.requiresBatchTracking ===
                                            false &&
                                        kittedChild.requiresSerialTracking ===
                                            false && (<react_1.IconButton aria-label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Issue Material"], ["Issue Material"])))} variant="ghost" icon={<lu_1.LuGitBranchPlus />} className="h-8 w-8" onClick={function () {
                                            (0, react_dom_1.flushSync)(function () {
                                                setSelectedMaterial(kittedChild);
                                            });
                                            issueModal.onOpen();
                                        }}/>)}
                                                {(kittedChild.requiresBatchTracking ||
                                        kittedChild.requiresSerialTracking) && (<react_1.IconButton aria-label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Issue Material"], ["Issue Material"])))} variant="secondary" icon={<lu_1.LuQrCode />} className="h-8 w-8" onClick={function () {
                                            (0, react_dom_1.flushSync)(function () {
                                                setSelectedMaterial(kittedChild);
                                            });
                                            issueModal.onOpen();
                                        }}/>)}
                                              </react_1.Td>
                                            </react_1.Tr>);
                            })}
                                    </>);
                }))}
                            </react_1.Tbody>
                          </react_1.Table>
                          {issueModal.isOpen && (<IssueMaterialModal_1.IssueMaterialModal operationId={operation.id} expiredEntityPolicy={expiredEntityPolicy} locationId={locationId} workCenterId={(_a = operation.workCenterId) !== null && _a !== void 0 ? _a : undefined} material={selectedMaterial !== null && selectedMaterial !== void 0 ? selectedMaterial : undefined} parentId={trackedEntityId !== null && trackedEntityId !== void 0 ? trackedEntityId : ""} parentIdIsSerialized={(_b = method === null || method === void 0 ? void 0 : method.requiresSerialTracking) !== null && _b !== void 0 ? _b : false} trackedInputs={(_c = resolvedMaterials === null || resolvedMaterials === void 0 ? void 0 : resolvedMaterials.trackedInputs) !== null && _c !== void 0 ? _c : []} onClose={function () {
                        setSelectedMaterial(null);
                        issueModal.onClose();
                    }}/>)}
                        </>);
        }}
                  </react_router_1.Await>
                </react_2.Suspense>
              </div>
            </div>

            <react_1.Separator />
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
                <react_1.HStack className="justify-between w-full">
                  <react_1.Heading size="h3">
                    <macro_1.Trans>Production Logs</macro_1.Trans>
                  </react_1.Heading>
                  <react_1.HStack>
                    <react_1.Button aria-label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Record Quantity"], ["Record Quantity"])))} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={completeModal.onOpen}>
                      <macro_1.Trans>Record Quantity</macro_1.Trans>
                    </react_1.Button>
                  </react_1.HStack>
                </react_1.HStack>

                {/* Summary Badges */}
                <react_1.HStack className="gap-2 flex-wrap">
                  <react_1.Badge variant="outline">
                    <macro_1.Trans>Total Production</macro_1.Trans>:{" "}
                    {quantities
            .filter(function (q) { return q.type === "Production"; })
            .reduce(function (sum, q) { return sum + Number(q.quantity); }, 0)}
                  </react_1.Badge>
                  <react_1.Badge variant="outline">
                    <macro_1.Trans>Total Rework</macro_1.Trans>:{" "}
                    {quantities
            .filter(function (q) { return q.type === "Rework"; })
            .reduce(function (sum, q) { return sum + Number(q.quantity); }, 0)}
                  </react_1.Badge>
                  <react_1.Badge variant="outline">
                    <macro_1.Trans>Total Scrap</macro_1.Trans>:{" "}
                    {quantities
            .filter(function (q) { return q.type === "Scrap"; })
            .reduce(function (sum, q) { return sum + Number(q.quantity); }, 0)}
                  </react_1.Badge>
                </react_1.HStack>

                {/* Production Logs by Employee */}
                <div className="flex flex-col gap-2 w-full">
                  {(function () {
            // Group all data by employee
            var employeeMap = new Map();
            // Add quantities
            quantities.forEach(function (quantity) {
                var employeeName = quantity.employee
                    ? formatPersonName(quantity.employee)
                    : quantity.employeeId;
                if (!employeeMap.has(quantity.employeeId)) {
                    employeeMap.set(quantity.employeeId, {
                        employeeId: quantity.employeeId,
                        employeeName: employeeName,
                        production: [],
                        rework: [],
                        scrap: []
                    });
                }
                var emp = employeeMap.get(quantity.employeeId);
                if (quantity.type === "Production") {
                    emp.production.push(quantity);
                }
                else if (quantity.type === "Rework") {
                    emp.rework.push(quantity);
                }
                else if (quantity.type === "Scrap") {
                    emp.scrap.push(quantity);
                }
            });
            var employees = Array.from(employeeMap.values());
            if (employees.length === 0) {
                return (<div className="py-8 text-muted-foreground text-center">
                          <macro_1.Trans>No production logs</macro_1.Trans>
                        </div>);
            }
            return employees.map(function (emp) {
                return (<react_1.Card key={emp.employeeId} className="w-full">
                          <react_1.CardContent className="p-4">
                            <div className="flex flex-col gap-2">
                              {/* Employee Header */}
                              <div className="flex items-center justify-between">
                                <div className="font-medium">
                                  {emp.employeeName}
                                </div>
                              </div>

                              {/* Production Quantities */}
                              {emp.production.map(function (quantity) { return (<div key={quantity.id} className="flex flex-col gap-1">
                                  <div className="flex items-center justify-between bg-background">
                                    <div className="text-sm">
                                      {quantity.createdBy !==
                            quantity.employeeId &&
                            quantity.createdByUser && (<span className="text-muted-foreground mr-2">
                                            (
                                            {formatPersonName(quantity.createdByUser)}
                                            )
                                          </span>)}
                                      <span className="font-medium">
                                        {quantity.quantity}
                                      </span>{" "}
                                      | {formatDate(quantity.createdAt)}
                                    </div>
                                    <span className="text-xs text-right">
                                      <macro_1.Trans>production</macro_1.Trans>
                                    </span>
                                  </div>
                                  {quantity.configuration && (<div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                      {JSON.stringify(quantity.configuration)}
                                    </div>)}
                                </div>); })}

                              {/* Rework */}
                              {emp.rework.map(function (quantity) { return (<div key={quantity.id} className="flex flex-col gap-1">
                                  <div className="flex items-center justify-between bg-background">
                                    <div className="text-sm">
                                      {quantity.createdBy !==
                            quantity.employeeId &&
                            quantity.createdByUser && (<span className="text-muted-foreground mr-2">
                                            (
                                            {formatPersonName(quantity.createdByUser)}
                                            )
                                          </span>)}
                                      <span className="font-medium">
                                        {quantity.quantity}
                                      </span>{" "}
                                      | {formatDate(quantity.createdAt)}
                                    </div>
                                    <span className="text-xs text-right">
                                      <macro_1.Trans>rework</macro_1.Trans>
                                    </span>
                                  </div>
                                  {quantity.configuration && (<div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                      {JSON.stringify(quantity.configuration)}
                                    </div>)}
                                </div>); })}

                              {/* Scrap */}
                              {emp.scrap.map(function (quantity) { return (<div key={quantity.id} className="flex flex-col gap-1">
                                  <div className="flex items-center justify-between bg-background">
                                    <div className="text-sm">
                                      {quantity.createdBy !==
                            quantity.employeeId &&
                            quantity.createdByUser && (<span className="text-muted-foreground mr-2">
                                            (
                                            {formatPersonName(quantity.createdByUser)}
                                            )
                                          </span>)}
                                      <span className="font-medium">
                                        {quantity.quantity}
                                      </span>{" "}
                                      | {formatDate(quantity.createdAt)}
                                    </div>
                                    <span className="text-xs text-right">
                                      <macro_1.Trans>scrap</macro_1.Trans>
                                    </span>
                                  </div>
                                  {quantity.configuration && (<div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                      {JSON.stringify(quantity.configuration)}
                                    </div>)}
                                </div>); })}
                            </div>
                          </react_1.CardContent>
                        </react_1.Card>);
            });
        })()}
                </div>
              </div>
            </div>

            <react_1.Separator />
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
                <react_1.Heading size="h3">
                  <macro_1.Trans>Files</macro_1.Trans>
                </react_1.Heading>
                <p className="text-muted-foreground text-sm -mt-2">
                  <macro_1.Trans>
                    Files related to the job and the opportunity line.
                  </macro_1.Trans>
                </p>
                <react_2.Suspense key={"files-".concat(operationId)} fallback={<TableSkeleton_1.TableSkeleton />}>
                  <react_router_1.Await resolve={files}>
                    {function (resolvedFiles) {
            var _a;
            return (<react_1.Table className="w-full text-base">
                        <react_1.Thead>
                          <react_1.Tr>
                            <react_1.Th className="text-sm">
                              <macro_1.Trans>Name</macro_1.Trans>
                            </react_1.Th>
                            <react_1.Th className="text-sm">
                              <macro_1.Trans>Size</macro_1.Trans>
                            </react_1.Th>
                            <react_1.Th></react_1.Th>
                          </react_1.Tr>
                        </react_1.Thead>
                        <react_1.Tbody>
                          {resolvedFiles.length === 0 && !modelUpload ? (<react_1.Tr>
                              <react_1.Td colSpan={24} className="py-8 text-muted-foreground text-center">
                                <macro_1.Trans>No files</macro_1.Trans>
                              </react_1.Td>
                            </react_1.Tr>) : (<>
                              {(modelUpload === null || modelUpload === void 0 ? void 0 : modelUpload.modelName) && (<react_1.Tr className="[&>td]:py-3">
                                  <react_1.Td>
                                    <react_1.HStack>
                                      <lu_1.LuAxis3D className="text-emerald-500 w-6 h-6"/>
                                      <span>{modelUpload.modelName}</span>
                                    </react_1.HStack>
                                  </react_1.Td>
                                  <react_1.Td className="text-sm font-mono">
                                    {modelUpload.modelSize
                            ? (0, utils_1.convertKbToString)(Math.floor(((_a = modelUpload.modelSize) !== null && _a !== void 0 ? _a : 0) / 1024))
                            : "--"}
                                  </react_1.Td>
                                  <react_1.Td>
                                    <div className="flex justify-end w-full">
                                      <react_1.DropdownMenu>
                                        <react_1.DropdownMenuTrigger asChild>
                                          <react_1.IconButton aria-label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
                                        </react_1.DropdownMenuTrigger>
                                        <react_1.DropdownMenuContent align="end">
                                          <react_1.DropdownMenuItem onClick={function () {
                            return downloadModel(modelUpload);
                        }}>
                                            <react_1.DropdownMenuIcon icon={<lu_1.LuDownload />}/>
                                            <macro_1.Trans>Download</macro_1.Trans>
                                          </react_1.DropdownMenuItem>
                                        </react_1.DropdownMenuContent>
                                      </react_1.DropdownMenu>
                                    </div>
                                  </react_1.Td>
                                </react_1.Tr>)}
                              {resolvedFiles.map(function (file) {
                        var _a, _b;
                        var type = (0, operations_service_1.getFileType)(file.name);
                        return (<react_1.Tr key={"file-".concat(file.id)} className="[&>td]:py-3">
                                    <react_1.Td>
                                      <react_1.HStack>
                                        <components_1.FileIcon type={type}/>
                                        <span className="font-medium" onClick={function () {
                                if (["PDF", "Image"].includes(type)) {
                                    window.open(path_1.path.to.file.previewFile("".concat("private", "/").concat(getFilePath(file))), "_blank");
                                }
                            }}>
                                          {["PDF", "Image"].includes(type) ? (<components_1.FilePreview bucket="private" pathToFile={getFilePath(file)} 
                            // @ts-ignore
                            type={(0, operations_service_1.getFileType)(file.name)}>
                                              {file.name}
                                            </components_1.FilePreview>) : (file.name)}
                                        </span>
                                      </react_1.HStack>
                                    </react_1.Td>
                                    <react_1.Td className="text-sm font-mono">
                                      {(0, utils_1.convertKbToString)(Math.floor(((_b = (_a = file.metadata) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0) / 1024))}
                                    </react_1.Td>
                                    <react_1.Td>
                                      <div className="flex justify-end w-full">
                                        <react_1.DropdownMenu>
                                          <react_1.DropdownMenuTrigger asChild>
                                            <react_1.IconButton aria-label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
                                          </react_1.DropdownMenuTrigger>
                                          <react_1.DropdownMenuContent align="end">
                                            <react_1.DropdownMenuItem onClick={function () { return downloadFile(file); }}>
                                              <react_1.DropdownMenuIcon icon={<lu_1.LuDownload />}/>
                                              <macro_1.Trans>Download</macro_1.Trans>
                                            </react_1.DropdownMenuItem>
                                          </react_1.DropdownMenuContent>
                                        </react_1.DropdownMenu>
                                      </div>
                                    </react_1.Td>
                                  </react_1.Tr>);
                    })}
                            </>)}
                        </react_1.Tbody>
                      </react_1.Table>);
        }}
                  </react_router_1.Await>
                </react_2.Suspense>
              </div>
            </div>

            {parentIsSerial && (<>
                <react_1.Separator />
                <div className="flex flex-col items-start justify-between w-full">
                  <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
                    <react_1.HStack className="justify-between w-full">
                      <react_1.Heading size="h3">
                        <macro_1.Trans>Serial Numbers</macro_1.Trans>
                      </react_1.Heading>
                      {(trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.length) > 0 && (<react_1.HStack>
                          <components_1.PrintButton sourceDocument="Operation" sourceDocumentId={operationId} locationId={locationId} context="workCenter" workCenterId={(_m = operation.workCenterId) !== null && _m !== void 0 ? _m : undefined} fileRoutes={{
                    pdf: path_1.path.to.file.operationLabelsPdf,
                    zpl: path_1.path.to.file.operationLabelsZpl
                }}/>
                          <react_1.Button variant="secondary" size="lg" leftIcon={<lu_1.LuBarcode />}>
                            <macro_1.Trans>Scan</macro_1.Trans>
                          </react_1.Button>
                        </react_1.HStack>)}
                    </react_1.HStack>

                    <react_1.Table className="w-full text-base">
                      <react_1.Thead>
                        <react_1.Tr>
                          <react_1.Th className="text-sm">
                            <macro_1.Trans>Serial</macro_1.Trans>
                          </react_1.Th>
                          <react_1.Th className="text-right"/>
                        </react_1.Tr>
                      </react_1.Thead>
                      <react_1.Tbody>
                        {(trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.length) === 0 ? (<react_1.Tr>
                            <react_1.Td colSpan={24} className="py-8 text-muted-foreground text-center">
                              <lu_1.LuTriangleAlert className="text-red-500 size-4"/>
                              <macro_1.Trans>No serial numbers</macro_1.Trans>
                            </react_1.Td>
                          </react_1.Tr>) : (trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.map(function (entity) {
                var _a;
                return (<react_1.Tr key={"serial-".concat(entity.id)} className="[&>td]:py-3">
                              <react_1.Td>
                                <div className="flex gap-2 items-center">
                                  <span>{entity.id}</span>
                                  {entity.id === trackedEntityId && (<lu_1.LuCheck className="text-emerald-500 size-4"/>)}
                                  <react_1.Copy text={entity.id}/>
                                </div>
                              </react_1.Td>

                              <react_1.Td className="text-right">
                                <div className="flex justify-end gap-2">
                                  <components_1.PrintButton sourceDocument="Entity" sourceDocumentId={entity.id} locationId={locationId} context="workCenter" workCenterId={(_a = operation.workCenterId) !== null && _a !== void 0 ? _a : undefined} fileRoutes={{
                        pdf: path_1.path.to.file.trackedEntityLabelPdf,
                        zpl: path_1.path.to.file.trackedEntityLabelZpl
                    }}/>
                                  <react_1.Button variant="secondary" size="lg" isDisabled={entity.id === trackedEntityId} onClick={function () {
                        var entityIndex = trackedEntities.findIndex(function (e) { return e.id === entity.id; });
                        if (entityIndex !== -1) {
                            setActiveStep(entityIndex);
                        }
                        setParams({
                            trackedEntityId: entity.id
                        });
                    }}>
                                    <macro_1.Trans>Select</macro_1.Trans>
                                  </react_1.Button>
                                </div>
                              </react_1.Td>
                            </react_1.Tr>);
            }))}
                      </react_1.Tbody>
                    </react_1.Table>
                  </div>
                </div>
              </>)}
          </react_1.ScrollArea>
        </react_1.TabsContent>
        <react_1.TabsContent value="model">
          <div className="w-full h-[calc(100dvh-var(--header-height)*2)] p-0">
            <react_1.ModelViewer file={null} key={"model-".concat((_o = operation.itemModelPath) !== null && _o !== void 0 ? _o : job.modelPath)} url={"/file/preview/private/".concat((_p = operation.itemModelPath) !== null && _p !== void 0 ? _p : job.modelPath)} mode={mode} className="rounded-none"/>
          </div>
        </react_1.TabsContent>
        <react_1.TabsContent value="procedure" className="flex flex-grow">
          <div className="flex h-[calc(100dvh-var(--header-height)*2-var(--controls-height)-2rem)] w-full">
            <react_2.Suspense key={"procedure-".concat(operationId)}>
              <react_router_1.Await resolve={procedure}>
                {function (resolvedProcedure) {
            var attributes = resolvedProcedure.attributes, parameters = resolvedProcedure.parameters;
            if (attributes.length === 0 && parameters.length === 0)
                return null;
            return (<react_1.ScrollArea className="hidden lg:block w-1/3 border-r shrink-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
                      <react_1.Tabs defaultValue="attributes" className="w-full flex-1 h-full flex flex-col">
                        <div className="w-full py-2 px-4 sticky top-0 z-10">
                          <react_1.TabsList className="w-full grid grid-cols-2">
                            <react_1.TabsTrigger value="attributes">
                              <macro_1.Trans>Steps</macro_1.Trans>
                            </react_1.TabsTrigger>
                            <react_1.TabsTrigger value="parameters">
                              <macro_1.Trans>Parameters</macro_1.Trans>
                            </react_1.TabsTrigger>
                          </react_1.TabsList>
                        </div>
                        <react_1.TabsContent value="attributes" className="w-full flex-1 flex flex-col overflow-y-auto data-[state=inactive]:hidden">
                          <react_1.VStack className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
                            {attributes.length > 0 &&
                    (function () {
                        var maxRecords = parentIsSerial
                            ? trackedEntities.length
                            : operation.operationQuantity +
                                operation.quantityScrapped;
                        var isRecordSetStarted = recordSetIsStarted(attributes, activeStep);
                        var canCreateNewRecord = !parentIsSerial && isRecordSetStarted;
                        var canNavigateNext = isRecordSetStarted &&
                            activeStep <
                                operation.operationQuantity +
                                    operation.quantityScrapped -
                                    1;
                        var showNavigation = hasMultipleRecords ||
                            attributes.some(function (att) {
                                return att.jobOperationStepRecord.length > 1;
                            });
                        return (<div className="flex items-end justify-between gap-1 w-full px-4 pb-2 border-b">
                                    <div className="flex items-center gap-1">
                                      {showNavigation && !parentIsSerial && (<>
                                          <react_1.IconButton aria-label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Previous record set"], ["Previous record set"])))} variant="secondary" icon={<lu_1.LuChevronLeft />} onClick={function () {
                                    setActiveStep(activeStep - 1);
                                }} isDisabled={activeStep === 0}/>
                                          <span className="text-sm font-medium px-2 min-w-[60px] text-center">
                                            <macro_1.Trans>
                                              Record {activeStep + 1}
                                            </macro_1.Trans>
                                          </span>
                                          <react_1.IconButton aria-label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Next record set"], ["Next record set"])))} variant="secondary" icon={<lu_1.LuChevronRight />} onClick={function () {
                                    setActiveStep(activeStep + 1);
                                }} isDisabled={!canNavigateNext}/>
                                        </>)}
                                      {canCreateNewRecord &&
                                !showNavigation && (<react_1.Button aria-label={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Add new record set"], ["Add new record set"])))} variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={function () {
                                    var nextIndex = activeStep + 1;
                                    if (nextIndex >= maxRecords) {
                                        react_1.toast.warning(t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Maximum number of records reached"], ["Maximum number of records reached"]))));
                                        return;
                                    }
                                    setHasMultipleRecords(true);
                                    setActiveStep(nextIndex);
                                }} isDisabled={activeStep + 1 >= maxRecords}>
                                            <macro_1.Trans>New Record</macro_1.Trans>
                                          </react_1.Button>)}
                                      {parentIsSerial && (<react_1.Heading size="h2">
                                          <macro_1.Trans>
                                            {serialIndex + 1} of{" "}
                                            {operation.operationQuantity}
                                          </macro_1.Trans>
                                        </react_1.Heading>)}
                                    </div>

                                    <div className="flex flex-col justify-center items-end gap-1">
                                      <react_1.BarProgress label={t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Steps"], ["Steps"])))} gradient invertGradient progress={(attributes.filter(function (a) {
                                return a.jobOperationStepRecord.some(function (r) { return r.index === activeStep; });
                            }).length /
                                attributes.length) *
                                100}/>
                                      <span className="text-xs text-muted-foreground">
                                        <macro_1.Trans>
                                          {attributes.filter(function (a) {
                                return a.jobOperationStepRecord.some(function (r) { return r.index === activeStep; });
                            }).length}{" "}
                                          of {attributes.length} completed
                                        </macro_1.Trans>
                                      </span>
                                    </div>
                                  </div>);
                    })()}
                            {attributes.length > 0 && (<>
                                <div className="flex flex-col items-start justify-between w-full">
                                  <div className="flex flex-col w-full">
                                    <div>
                                      {attributes
                        .sort(function (a, b) {
                        var _a, _b;
                        return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) -
                            ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0);
                    })
                        .map(function (step, index) { return (<Step_1.StepsListItem key={"step-".concat(step.id)} activeStep={activeStep} step={step} compact={true} onRecord={onRecordStepRecord} onDelete={onDeleteStepRecord} operationId={operationId} className={index === attributes.length - 1
                            ? "border-none"
                            : ""}/>); })}
                                    </div>
                                  </div>
                                </div>
                              </>)}
                          </react_1.VStack>
                        </react_1.TabsContent>
                        <react_1.TabsContent value="parameters" className="w-full flex-1 flex flex-col overflow-y-auto data-[state=inactive]:hidden">
                          <react_1.VStack className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
                            {parameters.length > 0 && (<>
                                <react_1.Separator />
                                <div className="flex flex-col items-start justify-between w-full">
                                  <div className="flex flex-col gap-4 w-full">
                                    <div>
                                      {parameters
                        .sort(function (a, b) {
                        var _a, _b;
                        return ((_a = a.key) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.key) !== null && _b !== void 0 ? _b : "");
                    })
                        .map(function (p, index) { return (<Parameter_1.ParametersListItem key={"parameter-".concat(p.id)} parameter={p} operationId={operationId} className={index === parameters.length - 1
                            ? "border-none"
                            : ""}/>); })}
                                    </div>
                                  </div>
                                </div>
                              </>)}
                          </react_1.VStack>
                        </react_1.TabsContent>
                      </react_1.Tabs>
                    </react_1.ScrollArea>);
        }}
              </react_router_1.Await>
            </react_2.Suspense>

            <react_1.ScrollArea className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
              <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
            __html: (0, react_1.generateHTML)(((_q = operation.workInstruction) !== null && _q !== void 0 ? _q : {}))
        }}/>
            </react_1.ScrollArea>
          </div>
        </react_1.TabsContent>
        <react_1.TabsContent value="chat">
          <Chat_1.OperationChat operation={operation}/>
        </react_1.TabsContent>
        {!["chat", "procedure"].includes(activeTab) && (<Controls_1.Controls>
            <div className="flex flex-col items-center gap-2 p-4">
              <react_1.VStack spacing={2}>
                <react_1.VStack spacing={1}>
                  <span className="text-muted-foreground text-xs">
                    <macro_1.Trans>Work Center</macro_1.Trans>
                  </span>
                  <react_2.Suspense fallback={<react_1.Heading size="h4">...</react_1.Heading>} key={"work-center-".concat(operationId)}>
                    <react_router_1.Await resolve={workCenter}>
                      {function (resolvedWorkCenter) {
                var _a;
                return resolvedWorkCenter.data && (<react_1.Heading size="h4" className="line-clamp-1">
                            {(_a = resolvedWorkCenter.data) === null || _a === void 0 ? void 0 : _a.name}
                          </react_1.Heading>);
            }}
                    </react_router_1.Await>
                  </react_2.Suspense>
                </react_1.VStack>

                <react_1.VStack className="hidden tall:flex" spacing={1}>
                  <span className="text-muted-foreground text-xs">
                    <macro_1.Trans>Item</macro_1.Trans>
                  </span>
                  <react_1.Heading size="h4" className="line-clamp-1">
                    {operation.itemReadableId}
                  </react_1.Heading>
                </react_1.VStack>
              </react_1.VStack>

              <div className="md:hidden flex flex-col items-center gap-2 w-full">
                <react_1.VStack spacing={1}>
                  <span className="text-muted-foreground text-xs">
                    <macro_1.Trans>Job</macro_1.Trans>
                  </span>
                  <react_1.HStack className="justify-start space-x-2">
                    <lu_1.LuClipboardCheck className="text-muted-foreground"/>
                    <span className="text-sm truncate">
                      {operation.jobReadableId}
                    </span>
                  </react_1.HStack>
                </react_1.VStack>
                {((_r = job.customer) === null || _r === void 0 ? void 0 : _r.name) && (<react_1.VStack spacing={1}>
                    <span className="text-muted-foreground text-xs">
                      <macro_1.Trans>Customer</macro_1.Trans>
                    </span>
                    <react_1.HStack className="justify-start space-x-2">
                      <lu_1.LuSquareUser className="text-muted-foreground"/>
                      <span className="text-sm truncate">
                        {job.customer.name}
                      </span>
                    </react_1.HStack>
                  </react_1.VStack>)}

                {operation.description && (<react_1.VStack spacing={1}>
                    <span className="text-muted-foreground text-xs">
                      <macro_1.Trans>Description</macro_1.Trans>
                    </span>
                    <react_1.HStack className="justify-start space-x-2">
                      <lu_1.LuClipboardCheck className="text-muted-foreground"/>
                      <span className="text-sm truncate">
                        {operation.description}
                      </span>
                    </react_1.HStack>
                  </react_1.VStack>)}
                {operation.jobDeadlineType && (<react_1.VStack spacing={1}>
                    <span className="text-muted-foreground text-xs">
                      <macro_1.Trans>Deadline</macro_1.Trans>
                    </span>
                    <react_1.HStack className="justify-start space-x-2">
                      <components_1.DeadlineIcon deadlineType={operation.jobDeadlineType} overdue={isOverdue}/>

                      <span className={(0, react_1.cn)("text-sm truncate", isOverdue ? "text-red-500" : "")}>
                        {["ASAP", "No Deadline"].includes(operation.jobDeadlineType)
                    ? operation.jobDeadlineType
                    : operation.operationDueDate
                        ? t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Due ", ""], ["Due ", ""])), formatRelativeTime((0, utils_1.convertDateStringToIsoString)(operation.operationDueDate))) : "–"}
                      </span>
                    </react_1.HStack>
                  </react_1.VStack>)}
              </div>

              <Controls_1.WorkTypeToggle active={active} operation={operation} value={eventType} onChange={setEventType}/>

              <Controls_1.StartStopButton eventType={eventType} job={job} operation={operation} setupProductionEvent={setupProductionEvent} laborProductionEvent={laborProductionEvent} machineProductionEvent={machineProductionEvent} isTrackedActivity={(method === null || method === void 0 ? void 0 : method.requiresSerialTracking) === true ||
                (method === null || method === void 0 ? void 0 : method.requiresBatchTracking) === true} trackedEntityId={trackedEntityId}/>
              <div className="flex flex-row md:flex-col items-center gap-2 justify-center">
                <Controls_1.IconButtonWithTooltip disabled={parentIsSerial &&
                trackedEntities.some(function (entity) {
                    return entity.id === trackedEntityId &&
                        "Operation ".concat(operationId) in
                            entity.attributes;
                })} icon={<fa6_1.FaPlus className="text-accent-foreground group-hover:text-accent-foreground/80"/>} tooltip={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Log Completed"], ["Log Completed"])))} onClick={completeModal.onOpen}/>
                <Controls_1.IconButtonWithTooltip icon={<lu_1.LuEllipsisVertical className="text-accent-foreground group-hover:text-accent-foreground/80"/>} tooltip={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["More Actions"], ["More Actions"])))} onClick={actionsSheet.onOpen}/>
              </div>
            </div>
          </Controls_1.Controls>)}
        {!["chat"].includes(activeTab) && (<Controls_1.Times>
            <div className=" lg:p-6">
              <div className="w-full gap-2 grid grid-cols-[auto_auto_1fr]">
                {operation.setupDuration > 0 && (<>
                    <react_1.Tooltip>
                      <react_1.TooltipTrigger>
                        <lu_1.LuTimer className="h-4 w-4 mr-1"/>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent side="right">
                        <macro_1.Trans>Setup</macro_1.Trans>
                      </react_1.TooltipContent>
                    </react_1.Tooltip>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0 flex-nowrap">
                      {(0, utils_1.formatDurationMilliseconds)(progress.setup, {
                    style: "short"
                })}
                      /
                      {(0, utils_1.formatDurationMilliseconds)(operation.setupDuration, {
                    style: "short"
                })}
                    </span>
                    <react_1.BarProgress gradient invertGradient progress={(progress.setup / operation.setupDuration) * 100} activeClassName={progress.setup > operation.setupDuration
                    ? "bg-red-500"
                    : "bg-emerald-500"}/>
                  </>)}
                {operation.laborDuration > 0 && (<>
                    <react_1.Tooltip>
                      <react_1.TooltipTrigger>
                        <lu_1.LuHardHat className="h-4 w-4 mr-1"/>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent side="right">
                        <macro_1.Trans>Labor</macro_1.Trans>
                      </react_1.TooltipContent>
                    </react_1.Tooltip>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0 flex-nowrap">
                      {(0, utils_1.formatDurationMilliseconds)(progress.labor, {
                    style: "short"
                })}
                      /
                      {(0, utils_1.formatDurationMilliseconds)(operation.laborDuration, {
                    style: "short"
                })}
                    </span>
                    <react_1.BarProgress gradient invertGradient progress={(progress.labor / operation.laborDuration) * 100} activeClassName={progress.labor > operation.laborDuration
                    ? "bg-red-500"
                    : "bg-emerald-500"}/>
                  </>)}
                {operation.machineDuration > 0 && (<>
                    <react_1.Tooltip>
                      <react_1.TooltipTrigger>
                        <lu_1.LuHammer className="h-4 w-4 mr-1"/>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent side="right">
                        <macro_1.Trans>Machine</macro_1.Trans>
                      </react_1.TooltipContent>
                    </react_1.Tooltip>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0 flex-nowrap">
                      {(0, utils_1.formatDurationMilliseconds)(progress.machine, {
                    style: "short"
                })}
                      /
                      {(0, utils_1.formatDurationMilliseconds)(operation.machineDuration, {
                    style: "short"
                })}
                    </span>
                    <react_1.BarProgress gradient invertGradient progress={(progress.machine / operation.machineDuration) * 100} activeClassName={progress.machine > operation.machineDuration
                    ? "bg-red-500"
                    : "bg-emerald-500"}/>
                  </>)}
                <>
                  <react_1.Tooltip>
                    <react_1.TooltipTrigger>
                      <fa_1.FaTasks className="h-4 w-4 mr-1"/>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent side="right">
                      <macro_1.Trans>Quantity</macro_1.Trans>
                    </react_1.TooltipContent>
                  </react_1.Tooltip>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0 flex-nowrap">
                      {operation.quantityComplete}/{operation.targetQuantity}
                    </span>
                    <react_1.BarProgress activeClassName={operation.operationStatus === "Paused" &&
                operation.quantityComplete < operation.targetQuantity
                ? "bg-yellow-500"
                : "bg-emerald-500"} progress={(operation.quantityComplete /
                operation.targetQuantity) *
                100}/>
                  </div>
                </>
              </div>
            </div>
          </Controls_1.Times>)}
      </react_1.Tabs>
      <react_1.BottomSheet open={actionsSheet.isOpen} onOpenChange={function (open) {
            if (!open)
                actionsSheet.onClose();
        }}>
        <react_1.BottomSheetContent className="max-w-md mx-auto">
          <react_1.BottomSheetBody>
            <div className="flex flex-col gap-2 pb-2">
              <button type="button" className="flex items-center gap-3 rounded-lg bg-accent px-4 py-4 text-accent-foreground ring-1 ring-black/5 active:scale-[0.98] transition-transform" onClick={function () {
            actionsSheet.onClose();
            scrapModal.onOpen();
        }}>
                <fa6_1.FaTrash className="size-4 shrink-0 fill-muted-foreground"/>
                <span className="text-base/6 font-medium">
                  <macro_1.Trans>Scrap</macro_1.Trans>
                </span>
              </button>
              <button type="button" className="flex items-center gap-3 rounded-lg bg-accent px-4 py-4 text-accent-foreground ring-1 ring-black/5 active:scale-[0.98] transition-transform" onClick={function () {
            actionsSheet.onClose();
            reworkModal.onOpen();
        }}>
                <lu_1.LuGitPullRequest className="size-4 shrink-0 stroke-muted-foreground"/>
                <span className="text-base/6 font-medium">
                  <macro_1.Trans>Rework</macro_1.Trans>
                </span>
              </button>
              <button type="button" className="flex items-center gap-3 rounded-lg bg-accent px-4 py-4 text-accent-foreground ring-1 ring-black/5 active:scale-[0.98] transition-transform" onClick={function () {
            actionsSheet.onClose();
            finishModal.onOpen();
        }}>
                <lu_1.LuCheck className="size-4 shrink-0 stroke-muted-foreground"/>
                <span className="text-base/6 font-medium">
                  <macro_1.Trans>Finish</macro_1.Trans>
                </span>
              </button>
              <react_2.Suspense>
                <react_router_1.Await resolve={workCenter}>
                  {function (resolvedWorkCenter) {
            return resolvedWorkCenter.data &&
                !resolvedWorkCenter.data.isBlocked ? (<button type="button" className="flex items-center gap-3 rounded-lg bg-accent px-4 py-4 text-accent-foreground ring-1 ring-black/5 active:scale-[0.98] transition-transform" onClick={function () {
                    actionsSheet.onClose();
                    maintenanceModal.onOpen();
                }}>
                        <lu_1.LuWrench className="size-4 shrink-0 stroke-muted-foreground"/>
                        <span className="text-base/6 font-medium">
                          <macro_1.Trans>Maintenance</macro_1.Trans>
                        </span>
                      </button>) : null;
        }}
                </react_router_1.Await>
              </react_2.Suspense>
              <button type="button" className="flex items-center gap-3 rounded-lg bg-accent px-4 py-4 text-accent-foreground ring-1 ring-black/5 active:scale-[0.98] transition-transform" onClick={function () {
            actionsSheet.onClose();
            qualityIssueModal.onOpen();
        }}>
                <lu_1.LuTriangleAlert className="size-4 shrink-0 stroke-muted-foreground"/>
                <span className="text-base/6 font-medium">
                  <macro_1.Trans>Quality Issue</macro_1.Trans>
                </span>
              </button>
            </div>
          </react_1.BottomSheetBody>
        </react_1.BottomSheetContent>
      </react_1.BottomSheet>
      {reworkModal.isOpen && (<ReworkModal_1.ReworkModal operation={operation} jobId={job.id} isOpen={reworkModal.isOpen} onClose={reworkModal.onClose} trackedEntities={trackedEntities} parentIsSerial={parentIsSerial} parentIsBatch={parentIsBatch}/>)}
      {scrapModal.isOpen && (<QuantityModal_1.QuantityModal type="scrap" laborProductionEvent={laborProductionEvent} machineProductionEvent={machineProductionEvent} operation={operation} parentIsSerial={parentIsSerial} parentIsBatch={parentIsBatch} productionQuantities={productionQuantities} setupProductionEvent={setupProductionEvent} trackedEntityId={trackedEntityId} onClose={scrapModal.onClose}/>)}
      {completeModal.isOpen && (<react_2.Suspense key={"complete-modal-".concat(operationId)}>
          <react_router_1.Await resolve={materials}>
            {function (resolvedMaterials) {
                return (<QuantityModal_1.QuantityModal type="complete" laborProductionEvent={laborProductionEvent} machineProductionEvent={machineProductionEvent} materials={resolvedMaterials.materials} operation={operation} parentIsSerial={parentIsSerial} parentIsBatch={parentIsBatch} productionQuantities={productionQuantities} setupProductionEvent={setupProductionEvent} trackedEntityId={trackedEntityId} onClose={completeModal.onClose}/>);
            }}
          </react_router_1.Await>
        </react_2.Suspense>)}
      {/* @ts-ignore */}
      {finishModal.isOpen && (<react_2.Suspense key={"finish-modal-".concat(operationId)}>
          <react_router_1.Await resolve={procedure}>
            {function (resolvedProcedure) {
                var attributes = resolvedProcedure.attributes;
                var allStepsRecorded = attributes.every(function (a) { return a.jobOperationStepRecord !== null; });
                return (<QuantityModal_1.QuantityModal type="finish" allStepsRecorded={allStepsRecorded} laborProductionEvent={laborProductionEvent} machineProductionEvent={machineProductionEvent} operation={operation} productionQuantities={productionQuantities} setupProductionEvent={setupProductionEvent} trackedEntityId={trackedEntityId} onClose={finishModal.onClose}/>);
            }}
          </react_router_1.Await>
        </react_2.Suspense>)}

      {serialModal.isOpen && (<SerialSelectorModal_1.SerialSelectorModal availableEntities={availableEntities} onClose={serialModal.onClose} onCancel={function () { return navigate(path_1.path.to.operations); }} onSelect={function (entity) {
                var entityIndex = availableEntities.findIndex(function (e) { return e.id === entity.id; });
                if (entityIndex !== -1) {
                    setActiveStep(entityIndex);
                }
                setParams({
                    trackedEntityId: entity.id
                });
                serialModal.onClose();
            }}/>)}

      {attributeRecordModal.isOpen && selectedStep ? (<Step_1.RecordModal key={selectedStep.id} activeStep={activeStep} attribute={selectedStep} onClose={onDeselectStep}/>) : null}

      {attributeRecordDeleteModal.isOpen && selectedStep && (<Step_1.DeleteStepRecordModal onClose={onDeselectStep} id={(_t = (_s = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.jobOperationStepRecord.find(function (r) { return r.index === activeStep; })) === null || _s === void 0 ? void 0 : _s.id) !== null && _t !== void 0 ? _t : ""} title={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Delete Step"], ["Delete Step"])))} description={t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Are you sure you want to delete this step?"], ["Are you sure you want to delete this step?"])))}/>)}

      <QualityIssueModal_1.QualityIssueModal operationId={operation.id} trackedEntityId={parentIsSerial || parentIsBatch ? trackedEntityId : undefined} isOpen={qualityIssueModal.isOpen} onClose={qualityIssueModal.onClose}/>

      <react_2.Suspense key={"maintenance-modal-".concat(operationId)}>
        <react_router_1.Await resolve={workCenter}>
          {function (resolvedWorkCenter) {
            return resolvedWorkCenter.data && (<MaintenanceDispatch_1.MaintenanceDispatch workCenter={resolvedWorkCenter.data} isOpen={maintenanceModal.isOpen} onClose={maintenanceModal.onClose}/>);
        }}
        </react_router_1.Await>
      </react_2.Suspense>
    </>);
};
exports.JobOperation = JobOperation;
function recordSetIsStarted(attributes, activeStep) {
    return attributes.some(function (att) {
        return att.jobOperationStepRecord.some(function (record) {
            return record.index === activeStep &&
                (record.value !== null ||
                    record.numericValue !== null ||
                    record.booleanValue !== null ||
                    record.userValue !== null);
        });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31;
