"use client";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var framer_motion_1 = require("framer-motion");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Activity_1 = require("~/components/Activity");
var Form_1 = require("~/components/Form");
var Procedure_1 = require("~/components/Form/Procedure");
var SupplierProcess_1 = require("~/components/Form/SupplierProcess");
var UnitHint_1 = require("~/components/Form/UnitHint");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var Icons_1 = require("~/components/Icons");
var InfiniteScroll_1 = require("~/components/InfiniteScroll");
var Modals_1 = require("~/components/Modals");
var Overlay_1 = require("~/components/Overlay");
var SortableList_1 = require("~/components/SortableList");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var configParamsTableColumns_1 = require("../../configParamsTableColumns");
var operationType_1 = require("../../operationType");
var production_models_1 = require("../../production.models");
var production_service_1 = require("../../production.service");
var OutsideOperationBadge_1 = require("../OutsideOperationBadge");
var operationBop_1 = require("../operationBop");
var ConfigParamsReportedTargetTable_1 = require("./ConfigParamsReportedTargetTable");
var JobOperationStatus_1 = require("./JobOperationStatus");
var OperationDueDatePicker_1 = require("./OperationDueDatePicker");
var productionQuantityLabels_1 = require("./productionQuantityLabels");
function makeItems(operations, tags, temporaryItems, urlParams, t, jobId, jobQuantityTarget, job, onAddProductionQuantity, onOpenConfigSummary, hasConfigurationParameters) {
    return operations.map(function (operation) {
        return makeItem(operation, tags, temporaryItems, urlParams, t, jobId, jobQuantityTarget, job, onAddProductionQuantity, onOpenConfigSummary, hasConfigurationParameters);
    });
}
function makeItem(operation, tags, temporaryItems, urlParams, t, jobId, jobQuantityTarget, job, onAddProductionQuantity, onOpenConfigSummary, hasConfigurationParameters) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        id: operation.id,
        title: (<react_1.VStack spacing={0} className="min-w-0">
        <h3 className="font-semibold truncate cursor-pointer">
          {operation.description}
        </h3>
        {(0, operationType_1.isOutsideOperationType)(operation.operationType) ? (<SupplierProcess_1.SupplierProcessPreview processId={operation.processId} supplierProcessId={operation.operationSupplierProcessId}/>) : null}
      </react_1.VStack>),
        checked: false,
        order: operation.operationOrder,
        details: (0, operationType_1.isOutsideOperationType)(operation.operationType) ? (<OutsideOperationBadge_1.OutsideOperationBadge />) : (<react_1.HStack spacing={1}>
        {((_a = operation === null || operation === void 0 ? void 0 : operation.setupTime) !== null && _a !== void 0 ? _a : 0) > 0 && (<react_1.Badge variant="secondary">
            <components_1.TimeTypeIcon type="Setup" className="h-3 w-3 mr-1"/>
            {operation.setupTime} {operation.setupUnit}
          </react_1.Badge>)}
        {((_b = operation === null || operation === void 0 ? void 0 : operation.laborTime) !== null && _b !== void 0 ? _b : 0) > 0 && (<react_1.Badge variant="secondary">
            <components_1.TimeTypeIcon type="Labor" className="h-3 w-3 mr-1"/>
            {operation.laborTime} {operation.laborUnit}
          </react_1.Badge>)}

        {((_c = operation === null || operation === void 0 ? void 0 : operation.machineTime) !== null && _c !== void 0 ? _c : 0) > 0 && (<react_1.Badge variant="secondary">
            <components_1.TimeTypeIcon type="Machine" className="h-3 w-3 mr-1"/>
            {operation.machineTime} {operation.machineUnit}
          </react_1.Badge>)}
      </react_1.HStack>),
        quantityProgress: temporaryItems[operation.id]
            ? null
            : {
                complete: (_d = operation.quantityComplete) !== null && _d !== void 0 ? _d : 0,
                target: jobQuantityTarget,
                onAddQuantity: onAddProductionQuantity
                    ? function () { return onAddProductionQuantity(operation.id); }
                    : undefined,
                onOpenConfigTable: hasConfigurationParameters && onOpenConfigSummary
                    ? function () { return onOpenConfigSummary(operation.id); }
                    : undefined
            },
        footer: temporaryItems[operation.id] ? null : (<react_1.HStack className="w-full justify-between">
        <react_1.HStack>
          <JobOperationStatus_1.JobOperationStatus operation={operation} jobId={jobId} job={job}/>
          <components_1.Assignee table="jobOperation" id={operation.id} size="sm" value={(_e = operation.assignee) !== null && _e !== void 0 ? _e : undefined}/>
        </react_1.HStack>
        <react_1.HStack>
          <OperationDueDatePicker_1.OperationDueDatePicker operationId={operation.id} dueDate={(_f = operation.dueDate) !== null && _f !== void 0 ? _f : null} manuallyScheduled={operation.manuallyScheduled}/>
          <JobOperationStatus_1.JobOperationTags operation={operation} availableTags={tags}/>
          <react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <a href={path_1.path.to.external.mesJobOperation(operation.id)} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Open in MES"], ["Open in MES"])))}>
                <react_1.IconButton icon={<lu_1.LuPlay />} variant="secondary" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Open in MES"], ["Open in MES"])))} size="sm"/>
              </a>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <span>
                <macro_1.Trans>Open in MES</macro_1.Trans>
              </span>
            </react_1.TooltipContent>
          </react_1.Tooltip>
          <react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <react_router_1.Link to={"".concat(path_1.path.to.newIssue, "?").concat(new URLSearchParams(__assign({ jobOperationId: operation.id, operationSupplierProcessId: (_g = operation.operationSupplierProcessId) !== null && _g !== void 0 ? _g : "" }, urlParams)).toString())} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Create Issue"], ["Create Issue"])))}>
                <react_1.IconButton icon={<lu_1.LuShieldX />} variant="secondary" aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Create Issue"], ["Create Issue"])))} size="sm" className="transition-transform active:scale-[0.96]"></react_1.IconButton>
              </react_router_1.Link>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <span>
                <macro_1.Trans>Create Issue</macro_1.Trans>
              </span>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </react_1.HStack>
      </react_1.HStack>),
        data: operation
    };
}
var initialOperation = {
    assignee: null,
    description: "",
    laborRate: 0,
    laborTime: 0,
    laborUnit: "Minutes/Piece",
    machineRate: 0,
    machineTime: 0,
    machineUnit: "Minutes/Piece",
    operationUnitCost: 0,
    operationLeadTime: 0,
    operationOrder: "After Previous",
    operationType: "Inside",
    overheadRate: 0,
    processId: "",
    procedureId: "",
    reworkId: null,
    setupTime: 0,
    setupUnit: "Total Minutes",
    status: "Todo",
    tags: [],
    workCenterId: "",
    workInstruction: {}
};
var usePendingOperations = function (jobId) {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        var _a, _b;
        return ((_b = (fetcher.formAction === path_1.path.to.newJobOperation(jobId) ||
            ((_a = fetcher.formAction) === null || _a === void 0 ? void 0 : _a.includes("/job/methods/".concat(jobId, "/operation"))))) !== null && _b !== void 0 ? _b : false);
    })
        .reduce(function (acc, fetcher) {
        var formData = fetcher.formData;
        var operation = production_models_1.jobOperationValidator.safeParse(Object.fromEntries(formData));
        if (operation.success) {
            return __spreadArray(__spreadArray([], acc, true), [operation.data], false);
        }
        return acc;
    }, []);
};
var JobBillOfProcess = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var jobMakeMethodId = _a.jobMakeMethodId, locationId = _a.locationId, materials = _a.materials, initialOperations = _a.operations, tags = _a.tags, itemId = _a.itemId, salesOrderLineId = _a.salesOrderLineId, customerId = _a.customerId, routeJobId = _a.routeJobId, routeJob = _a.routeJob;
    var t = (0, macro_1.useLingui)().t;
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var _j = (0, auth_1.useCarbon)(), carbon = _j.carbon, accessToken = _j.accessToken;
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var deleteOperationFetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidator = (0, react_router_1.useRevalidator)();
    var _k = (0, hooks_1.useUser)(), userId = _k.id, companyId = _k.company.id;
    var params = (0, hooks_1.useUrlParams)()[0];
    var selected = params.get("selectedOperation");
    var _l = (0, react_2.useState)(selected ? selected : null), selectedItemId = _l[0], setSelectedItemId = _l[1];
    var paramsJobId = (0, react_router_1.useParams)().jobId;
    var jobId = routeJobId !== null && routeJobId !== void 0 ? routeJobId : paramsJobId;
    if (!jobId)
        throw new Error("jobId not found");
    var routeJobData = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    var jobData = routeJob ? { job: routeJob } : routeJobData;
    var _m = (0, react_2.useState)({}), temporaryItems = _m[0], setTemporaryItems = _m[1];
    var _o = (0, react_2.useState)(function () {
        return initialOperations.reduce(function (acc, operation) {
            if (operation.workInstruction) {
                acc[operation.id] = operation.workInstruction;
            }
            return acc;
        }, {});
    }), workInstructions = _o[0], setWorkInstructions = _o[1];
    var _p = (0, react_2.useState)({}), checkedState = _p[0], setCheckedState = _p[1];
    var _q = (0, react_2.useState)(function () {
        return initialOperations.reduce(function (acc, op) {
            acc[op.id] = op.order;
            return acc;
        }, {});
    }), orderState = _q[0], setOrderState = _q[1];
    var operationsById = new Map();
    // Add initial operations to map
    initialOperations.forEach(function (operation) {
        if (!operation.id)
            return;
        operationsById.set(operation.id, operation);
    });
    var pendingOperations = usePendingOperations(jobId);
    // Replace existing operations with pending ones
    pendingOperations.forEach(function (pendingOperation) {
        if (!pendingOperation.id) {
            operationsById.set("temporary", __assign(__assign({}, pendingOperation), { jobId: jobId, assignee: null, reworkId: null, status: "Todo", workInstruction: {}, jobOperationTool: [], jobOperationParameter: [], jobOperationStep: [], tags: [] }));
        }
        else {
            operationsById.set(pendingOperation.id, __assign(__assign(__assign({}, operationsById.get(pendingOperation.id)), pendingOperation), { jobId: jobId }));
        }
    });
    // Add temporary items
    Object.entries(temporaryItems).forEach(function (_a) {
        var id = _a[0], operation = _a[1];
        operationsById.set(id, __assign(__assign({}, operation), { jobId: jobId, jobOperationTool: [], jobOperationParameter: [], jobOperationStep: [] }));
    });
    var operations = Array.from(operationsById.values()).sort(function (a, b) { var _a, _b; return ((_a = orderState[a.id]) !== null && _a !== void 0 ? _a : a.order) - ((_b = orderState[b.id]) !== null && _b !== void 0 ? _b : b.order); });
    var isDisabled = ["Completed", "Cancelled"].includes((_c = (_b = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : "");
    var onAddProductionQuantity = !isDisabled && permissions.can("create", "production")
        ? function (operationId) {
            openOverlay(Overlay_1.overlay.to.newJobProductionQuantity({
                jobId: jobId,
                jobOperationId: operationId
            }), {
                onSuccess: function () {
                    revalidator.revalidate();
                }
            });
        }
        : undefined;
    var onToggleItem = function (id) {
        if (!permissions.can("update", "parts"))
            return;
        setCheckedState(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[id] = !prev[id], _a)));
        });
    };
    var onAddItem = function () {
        var operationId = (0, nanoid_1.nanoid)();
        var newOrder = 1;
        if (operations.length) {
            newOrder = Math.max.apply(Math, operations.map(function (op) { return op.order; })) + 1;
        }
        var newOperation = __assign(__assign({}, initialOperation), { id: operationId, order: newOrder, jobMakeMethodId: jobMakeMethodId, jobId: jobId });
        setTemporaryItems(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[operationId] = newOperation, _a)));
        });
        setSelectedItemId(operationId);
    };
    var onRemoveItem = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var operation;
        return __generator(this, function (_a) {
            if (!permissions.can("update", "production"))
                return [2 /*return*/];
            operation = operationsById.get(id);
            if (!operation)
                return [2 /*return*/];
            if (temporaryItems[id]) {
                setTemporaryItems(function (prev) {
                    var _a = prev, _b = id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                    return rest;
                });
            }
            else {
                deleteOperationFetcher.submit({ id: id }, {
                    method: "post",
                    action: path_1.path.to.jobOperationsDelete(jobId)
                });
            }
            setSelectedItemId(null);
            setOrderState(function (prev) {
                var _a = prev, _b = id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return rest;
            });
            return [2 /*return*/];
        });
    }); };
    var onReorder = function (items) {
        if (!permissions.can("update", "production") || isDisabled)
            return;
        var newItems = items.map(function (item, index) { return (__assign(__assign({}, item), { data: __assign(__assign({}, item.data), { order: index + 1 }) })); });
        var updates = newItems.reduce(function (acc, item) {
            if (!temporaryItems[item.id]) {
                acc[item.id] = item.data.order;
            }
            return acc;
        }, {});
        setOrderState(function (prev) { return (__assign(__assign({}, prev), updates)); });
        updateSortOrder(updates);
    };
    var updateSortOrder = (0, react_1.useDebounce)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        sortOrderFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.jobOperationsOrder(jobId)
        });
    }, 1000, true);
    var onCloseOnDrag = (0, react_2.useCallback)(function () {
        setCheckedState({});
    }, []);
    var onUpdateWorkInstruction = (0, react_1.useDebounce)(function (content) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(selectedItemId !== null && !temporaryItems[selectedItemId])) return [3 /*break*/, 2];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("jobOperation").update({
                            workInstruction: content,
                            updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            updatedBy: userId
                        }).eq("id", selectedItemId))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, 2500, true);
    var onUploadImage = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/parts/").concat(selectedItemId, "/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file, { upsert: true }))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    var _r = (0, react_2.useState)([]), productionEvents = _r[0], setProductionEvents = _r[1];
    var _s = (0, react_2.useState)(0), page = _s[0], setPage = _s[1];
    var _t = (0, react_2.useState)(false), isLoading = _t[0], setIsLoading = _t[1];
    var _u = (0, react_2.useState)(true), hasMore = _u[0], setHasMore = _u[1];
    var addOperationButtonRef = (0, react_2.useRef)(null);
    var _v = (0, react_2.useState)(null), configurationParameters = _v[0], setConfigurationParameters = _v[1];
    var configSummaryModal = (0, react_1.useDisclosure)();
    var _w = (0, react_2.useState)(null), configSummaryOperationId = _w[0], setConfigSummaryOperationId = _w[1];
    var _x = (0, react_2.useState)([]), configSummaryRows = _x[0], setConfigSummaryRows = _x[1];
    var _y = (0, react_2.useState)(false), configSummaryLoading = _y[0], setConfigSummaryLoading = _y[1];
    var hasConfigurationParameters = ((_d = configurationParameters === null || configurationParameters === void 0 ? void 0 : configurationParameters.length) !== null && _d !== void 0 ? _d : 0) > 0;
    (0, react_2.useEffect)(function () {
        if (!itemId || !carbon)
            return;
        void (0, items_1.getConfigurationParameters)(carbon, itemId, companyId).then(function (_a) {
            var parameters = _a.parameters;
            setConfigurationParameters(parameters.length > 0 ? parameters : null);
        });
    }, [carbon, companyId, itemId]);
    var openConfigSummary = (0, react_2.useCallback)(function (operationId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, quantityResult, pickupResult, reportedConfigurations, pickupConfigurations;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!carbon || !(configurationParameters === null || configurationParameters === void 0 ? void 0 : configurationParameters.length))
                        return [2 /*return*/];
                    setConfigSummaryOperationId(operationId);
                    setConfigSummaryRows([]);
                    setConfigSummaryLoading(true);
                    configSummaryModal.onOpen();
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("productionQuantity")
                                .select("configuration")
                                .eq("jobOperationId", operationId)
                                .eq("companyId", companyId)
                                .eq("type", "Production")
                                .is("invalidatedAt", null),
                            carbon
                                .from("jobOperationPickup")
                                .select("configuration")
                                .eq("jobOperationId", operationId)
                                .eq("companyId", companyId)
                        ])];
                case 1:
                    _a = _e.sent(), quantityResult = _a[0], pickupResult = _a[1];
                    if (quantityResult.error) {
                        react_1.toast.error(quantityResult.error.message);
                        setConfigSummaryLoading(false);
                        return [2 /*return*/];
                    }
                    reportedConfigurations = ((_b = quantityResult.data) !== null && _b !== void 0 ? _b : [])
                        .map(function (row) { return row.configuration; })
                        .filter(function (config) { return config != null; });
                    pickupConfigurations = ((_c = pickupResult.data) !== null && _c !== void 0 ? _c : [])
                        .map(function (row) { return row.configuration; })
                        .filter(function (config) { return config != null; });
                    setConfigSummaryRows((0, configParamsTableColumns_1.buildReportedTargetRows)({
                        targetConfiguration: (_d = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _d === void 0 ? void 0 : _d.configuration,
                        reportedConfigurations: reportedConfigurations,
                        pickupConfigurations: pickupConfigurations,
                        parameters: configurationParameters,
                        defaultQuantityLabel: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantities"], ["Quantities"])))
                    }));
                    setConfigSummaryLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [
        carbon,
        companyId,
        configSummaryModal,
        configurationParameters,
        (_e = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _e === void 0 ? void 0 : _e.configuration,
        t
    ]);
    var jobQuantityTarget = (_g = (_f = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _f === void 0 ? void 0 : _f.quantity) !== null && _g !== void 0 ? _g : 0;
    var items = makeItems(operations, tags, temporaryItems, {
        itemId: itemId,
        salesOrderLineId: salesOrderLineId,
        customerId: customerId
    }, t, jobId, jobQuantityTarget, jobData === null || jobData === void 0 ? void 0 : jobData.job, onAddProductionQuantity, hasConfigurationParameters ? openConfigSummary : undefined, hasConfigurationParameters).map(function (item) {
        var _a;
        return (__assign(__assign({}, item), { checked: (_a = checkedState[item.id]) !== null && _a !== void 0 ? _a : false }));
    });
    (0, react_2.useEffect)(function () {
        setProductionEvents([]);
        setPage(0);
        setHasMore(true);
    }, []);
    (0, react_1.useRealtimeChannel)({
        topic: "production-events:".concat(selectedItemId),
        enabled: !!selectedItemId && !temporaryItems[selectedItemId],
        setup: function (channel) {
            return channel.on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "productionEvent",
                filter: "jobOperationId=eq.".concat(selectedItemId)
            }, function (payload) {
                switch (payload.eventType) {
                    case "INSERT":
                        var inserted_1 = payload.new;
                        setProductionEvents(function (prevEvents) { return __spreadArray(__spreadArray([], prevEvents, true), [
                            inserted_1
                        ], false); });
                        break;
                    case "UPDATE":
                        var updated_1 = payload.new;
                        setProductionEvents(function (prevEvents) {
                            return prevEvents.map(function (event) {
                                return event.id === updated_1.id
                                    ? updated_1
                                    : event;
                            });
                        });
                        break;
                    case "DELETE":
                        var deleted_1 = payload.old;
                        setProductionEvents(function (prevEvents) {
                            return prevEvents.filter(function (event) { return event.id !== deleted_1.id; });
                        });
                        break;
                    default:
                        break;
                }
            });
        }
    });
    var loadMoreProductionEvents = (0, react_2.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var newProductionEvents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isLoading || !hasMore || !selectedItemId)
                        return [2 /*return*/];
                    setIsLoading(true);
                    return [4 /*yield*/, (0, production_service_1.getProductionEventsPage)(carbon, selectedItemId, companyId, false, page + 1)];
                case 1:
                    newProductionEvents = _a.sent();
                    if (newProductionEvents.data && newProductionEvents.data.length > 0) {
                        setProductionEvents(function (prev) { return __spreadArray(__spreadArray([], prev, true), newProductionEvents.data, true); });
                        setPage(function (prevPage) { return prevPage + 1; });
                    }
                    else {
                        setHasMore(false);
                    }
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [isLoading, hasMore, carbon, selectedItemId, companyId, page]);
    var _z = (0, react_2.useState)(1), tabChangeRerender = _z[0], setTabChangeRerender = _z[1];
    var initialWorkInstructions = (0, react_2.useMemo)(function () {
        return initialOperations.reduce(function (acc, operation) {
            if (operation.workInstruction && operation.id) {
                acc[operation.id] = operation.workInstruction;
            }
            return acc;
        }, {});
    }, [initialOperations]);
    (0, react_2.useEffect)(function () {
        setWorkInstructions(initialWorkInstructions);
    }, [initialWorkInstructions]);
    var renderListItem = function (_a) {
        var _b, _c, _d, _e, _f, _g;
        var item = _a.item, items = _a.items, order = _a.order, onToggleItem = _a.onToggleItem, onRemoveItem = _a.onRemoveItem;
        var isOpen = item.id === selectedItemId;
        var isNewOperation = item.id in temporaryItems;
        var operationDetails = operationsById.get(item.id);
        var tools = (_b = operationDetails === null || operationDetails === void 0 ? void 0 : operationDetails.jobOperationTool) !== null && _b !== void 0 ? _b : [];
        var parameters = (_c = operationDetails === null || operationDetails === void 0 ? void 0 : operationDetails.jobOperationParameter) !== null && _c !== void 0 ? _c : [];
        var steps = (_d = operationDetails === null || operationDetails === void 0 ? void 0 : operationDetails.jobOperationStep) !== null && _d !== void 0 ? _d : [];
        var operationFormContent = (<div className="flex w-full min-w-0 flex-col py-2 pr-2">
        <framer_motion_1.motion.div initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.75,
                delay: 0.15
            }}>
          <OperationForm item={item} jobId={jobId} isDisabled={isDisabled} job={jobData === null || jobData === void 0 ? void 0 : jobData.job} locationId={locationId} workInstruction={(_e = workInstructions[item.id]) !== null && _e !== void 0 ? _e : {}} setWorkInstructions={setWorkInstructions} setTemporaryItems={setTemporaryItems} setSelectedItemId={setSelectedItemId} temporaryItems={temporaryItems} onSubmit={function () {
                var _a;
                setSelectedItemId(null);
                (_a = addOperationButtonRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });
            }}/>
        </framer_motion_1.motion.div>
      </div>);
        var tabs = [
            {
                id: 0,
                label: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Details"], ["Details"]))),
                content: operationFormContent
            },
            {
                id: 1,
                label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Instructions"], ["Instructions"]))),
                disabled: (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                content: (<div className="flex flex-col">
            <div>
              {permissions.can("update", "parts") ? (<Editor_1.Editor initialValue={(_f = workInstructions[item.id]) !== null && _f !== void 0 ? _f : {}} onUpload={onUploadImage} onChange={function (content) {
                            if (!permissions.can("update", "production"))
                                return;
                            setWorkInstructions(function (prev) {
                                var _a;
                                return (__assign(__assign({}, prev), (_a = {}, _a[item.id] = content, _a)));
                            });
                            onUpdateWorkInstruction(content);
                        }} className="py-8"/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                            __html: (0, react_1.generateHTML)((_g = item.data.workInstruction) !== null && _g !== void 0 ? _g : {})
                        }}/>)}
            </div>
          </div>)
            },
            {
                id: 2,
                disabled: (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>
              <macro_1.Trans>Params</macro_1.Trans>
            </span>
            {parameters.length > 0 && <react_1.Count count={parameters.length}/>}
          </span>),
                content: (<div className="flex w-full flex-col py-4">
            <ParametersForm parameters={parameters} operationId={item.id} isDisabled={selectedItemId === null || !!temporaryItems[selectedItemId]} temporaryItems={temporaryItems}/>
          </div>)
            },
            {
                id: 3,
                disabled: (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>
              <macro_1.Trans>Steps</macro_1.Trans>
            </span>
            {steps.length > 0 && <react_1.Count count={steps.length}/>}
          </span>),
                content: (<div className="flex w-full flex-col py-4">
            <StepsForm steps={steps} operationId={item.id} isDisabled={selectedItemId === null || !!temporaryItems[selectedItemId]} temporaryItems={temporaryItems} materials={materials}/>
          </div>)
            },
            {
                id: 4,
                disabled: (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>
              <macro_1.Trans>Tools</macro_1.Trans>
            </span>
            {tools.length > 0 && <react_1.Count count={tools.length}/>}
          </span>),
                content: (<div className="flex w-full flex-col py-4">
            <ToolsForm tools={tools} operationId={item.id} isDisabled={selectedItemId === null || !!temporaryItems[selectedItemId]} temporaryItems={temporaryItems}/>
          </div>)
            },
            {
                id: 5,
                disabled: (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Events"], ["Events"]))),
                content: (<framer_motion_1.motion.div className="flex w-full flex-col pr-2 py-6 min-h-[300px]" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.75,
                        delay: 0.15
                    }}>
            <InfiniteScroll_1.default component={ProductionEventActivity} items={productionEvents} loadMore={loadMoreProductionEvents} hasMore={hasMore}/>
          </framer_motion_1.motion.div>)
            },
            {
                id: 6,
                disabled: (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Chat"], ["Chat"]))),
                content: <OperationChat jobOperationId={item.id}/>
            }
        ];
        return (<SortableList_1.SortableListItem item={item} items={items} order={order} key={item.id} isExpanded={isOpen} onSelectItem={setSelectedItemId} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} handleDrag={onCloseOnDrag} dragHandle className="my-2 " renderHeaderAction={function () { return (<button type="button" aria-label={isOpen ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Close operation"], ["Close operation"]))) : t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Edit operation"], ["Edit operation"])))} onClick={isOpen
                    ? function () {
                        if (isNewOperation) {
                            onRemoveItem(item.id);
                        }
                        else {
                            setSelectedItemId(null);
                        }
                    }
                    : function () {
                        setSelectedItemId(item.id);
                    }} className="flex items-center justify-center">
            {isOpen ? (<lu_1.LuX className="h-5 w-5 text-foreground"/>) : (<lu_1.LuSettings2 className="stroke-1 h-5 w-5 text-foreground/80 hover:stroke-primary/70"/>)}
          </button>); }} renderExtra={function () {
                return isOpen ? (<framer_motion_1.LayoutGroup id={"".concat(item.id)}>
              <div className="flex w-full flex-col">
                <div className="w-full p-2">
                  <framer_motion_1.motion.div initial={{
                        opacity: 0,
                        filter: "blur(4px)"
                    }} animate={{
                        opacity: 1,
                        filter: "blur(0px)"
                    }} transition={{
                        type: "spring",
                        duration: 0.15
                    }} className="w-full">
                    {isNewOperation ? (operationFormContent) : (<components_1.DirectionAwareTabs className="mr-auto" initialTabId={0} tabs={tabs} onChange={function () {
                            return setTabChangeRerender(tabChangeRerender + 1);
                        }}/>)}
                  </framer_motion_1.motion.div>
                </div>
              </div>
            </framer_motion_1.LayoutGroup>) : null;
            }}/>);
    };
    var list = (<SortableList_1.SortableList items={items} onReorder={onReorder} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} renderItem={renderListItem}/>);
    var configSummaryOperation = configSummaryOperationId
        ? operationsById.get(configSummaryOperationId)
        : undefined;
    var configSummaryModalElement = hasConfigurationParameters ? (<react_1.Modal open={configSummaryModal.isOpen} onOpenChange={function (open) {
            if (!open)
                configSummaryModal.onClose();
        }}>
      <react_1.ModalContent className={(0, react_1.cn)("flex w-fit min-w-[20rem] max-w-[min(90vw,56rem)] max-h-[85dvh] flex-col overflow-hidden", "md:w-fit sm:w-fit sm:max-w-[min(90vw,56rem)]")}>
        <react_1.ModalHeader className="mb-4 shrink-0">
          <react_1.ModalTitle>
            {(_h = configSummaryOperation === null || configSummaryOperation === void 0 ? void 0 : configSummaryOperation.description) !== null && _h !== void 0 ? _h : (<macro_1.Trans>Configuration quantities</macro_1.Trans>)}
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody className="mb-0 min-h-0 flex-1 overflow-y-auto overflow-x-auto pb-6">
          {configSummaryLoading ? (<react_1.Loading isLoading/>) : (<ConfigParamsReportedTargetTable_1.ConfigParamsReportedTargetTable rows={configSummaryRows} parameters={configurationParameters !== null && configurationParameters !== void 0 ? configurationParameters : []}/>)}
        </react_1.ModalBody>
        <react_1.ModalFooter className="shrink-0">
          <react_1.Button variant="secondary" onClick={configSummaryModal.onClose}>
            <macro_1.Trans>Close</macro_1.Trans>
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>) : null;
    if (routeJob) {
        return (<>
        <div className="flex w-[min(42rem,calc(100vw-1.5rem))] flex-col">
          <react_1.HStack className="shrink-0 items-center justify-between border-b border-border px-4 py-3 pr-12">
            <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
              <macro_1.Trans>Bill of Process</macro_1.Trans>
            </h3>
            <react_1.Button ref={addOperationButtonRef} variant="secondary" isDisabled={!permissions.can("update", "production") ||
                selectedItemId !== null ||
                isDisabled} onClick={onAddItem} className="transition-transform active:scale-[0.96]">
              <macro_1.Trans>Add Operation</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>
          <div className="min-h-0 max-h-[min(72vh,48rem)] overflow-y-auto px-3 py-3">
            {list}
          </div>
        </div>
        {configSummaryModalElement}
      </>);
    }
    return (<>
      <react_1.Card>
        <react_1.HStack className="justify-between">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Bill of Process</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>

          <react_1.CardAction>
            <react_1.Button ref={addOperationButtonRef} variant="secondary" isDisabled={!permissions.can("update", "production") ||
            selectedItemId !== null ||
            isDisabled} onClick={onAddItem} className="transition-transform active:scale-[0.96]">
              <macro_1.Trans>Add Operation</macro_1.Trans>
            </react_1.Button>
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>{list}</react_1.CardContent>
      </react_1.Card>
      {configSummaryModalElement}
    </>);
};
exports.default = JobBillOfProcess;
function StepsForm(_a) {
    var _this = this;
    var operationId = _a.operationId, isDisabled = _a.isDisabled, steps = _a.steps, temporaryItems = _a.temporaryItems, materials = _a.materials;
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)("Task"), type = _b[0], setType = _b[1];
    var _c = (0, react_2.useState)({}), description = _c[0], setDescription = _c[1];
    var _d = (0, react_2.useState)([]), numericControls = _d[0], setNumericControls = _d[1];
    // Initialize sort order state based on existing steps
    var _e = (0, react_2.useState)(function () {
        return __spreadArray([], steps, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); })
            .map(function (step) { return step.id || ""; });
    }), sortOrder = _e[0], setSortOrder = _e[1];
    var disclosure = (0, react_1.useDisclosure)();
    // Update sort order when steps change
    (0, react_2.useEffect)(function () {
        if (steps && steps.length > 0) {
            var sorted = __spreadArray([], steps, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); })
                .map(function (step) { return step.id || ""; });
            setSortOrder(sorted);
        }
    }, [steps]);
    var onReorder = function (newOrder) {
        if (isDisabled)
            return;
        var updates = {};
        newOrder.forEach(function (id, index) {
            updates[id] = index + 1;
        });
        setSortOrder(newOrder);
        updateSortOrder(updates);
    };
    var updateSortOrder = (0, react_1.useDebounce)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        sortOrderFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.jobOperationStepOrder(operationId)
        });
    }, 1000, true);
    var typeOptions = (0, react_2.useMemo)(function () {
        return shared_1.procedureStepType.map(function (type) { return ({
            label: (<react_1.HStack>
            <Icons_1.ProcedureStepTypeIcon type={type} className="mr-2"/>
            {type}
          </react_1.HStack>),
            value: type
        }); });
    }, []);
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var allItems = (0, stores_1.useItems)()[0];
    var materialItemIds = (0, react_2.useMemo)(function () { return new Set((materials !== null && materials !== void 0 ? materials : []).map(function (m) { return m.itemId; })); }, [materials]);
    var itemMentions = (0, react_2.useMemo)(function () {
        return allItems
            .filter(function (item) { return materialItemIds.has(item.id); })
            .map(function (item) {
            var _a;
            return ({
                id: item.id,
                label: (_a = item.name) !== null && _a !== void 0 ? _a : item.readableIdWithRevision,
                helper: item.name ? item.readableIdWithRevision : undefined
            });
        });
    }, [allItems, materialItemIds]);
    var onUploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/parts/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error(t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    if (isDisabled && temporaryItems[operationId]) {
        return (<react_1.Alert className="max-w-[420px] mx-auto my-8">
        <lu_1.LuTriangleAlert />
        <react_1.AlertTitle>
          <macro_1.Trans>Cannot add steps to unsaved operation</macro_1.Trans>
        </react_1.AlertTitle>
        <react_1.AlertDescription>
          <macro_1.Trans>Please save the operation before adding steps.</macro_1.Trans>
        </react_1.AlertDescription>
      </react_1.Alert>);
    }
    return (<react_1.Loading className="flex flex-col gap-6" isLoading={fetcher.state !== "idle"}>
      {disclosure.isOpen ? (<div className="p-6 border rounded-lg bg-card mb-6">
          <form_1.ValidatedForm action={path_1.path.to.newJobOperationStep} method="post" validator={shared_1.operationStepValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
                id: undefined,
                name: "",
                description: "",
                type: "Task",
                unitOfMeasureCode: "",
                minValue: 0,
                maxValue: 0,
                listValues: [],
                sortOrder: steps.reduce(function (acc, a) { var _a; return Math.max(acc, (_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0) +
                    1,
                operationId: operationId
            }} onSubmit={function () {
                setType("Value");
                setDescription({});
            }} className="w-full">
            <Form_1.Hidden name="operationId"/>
            <Form_1.Hidden name="sortOrder"/>
            <Form_1.Hidden name="description" value={JSON.stringify(description)}/>
            <react_1.VStack spacing={4}>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <Form_1.SelectControlled name="type" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Type"], ["Type"])))} options={typeOptions} value={type} onChange={function (option) {
                if (option) {
                    setType(option.value);
                }
            }}/>
                <form_1.Input name="name" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Name"], ["Name"])))}/>
              </div>

              <react_1.VStack spacing={2} className="w-full col-span-2">
                <react_1.Label>
                  <macro_1.Trans>Description</macro_1.Trans>
                </react_1.Label>
                <Editor_1.Editor initialValue={description} onUpload={onUploadImage} onChange={function (value) {
                setDescription(value);
            }} mentions={[{ char: "@", items: itemMentions }]} className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"/>
              </react_1.VStack>

              {type === "Measurement" && (<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  <UnitOfMeasure_1.default name="unitOfMeasureCode" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>

                  <react_1.ToggleGroup type="multiple" value={numericControls} onValueChange={setNumericControls} className="justify-start items-start mt-6">
                    <react_1.ToggleGroupItem size="sm" value="min">
                      <lu_1.LuMinimize2 className="mr-2"/>
                      Minimum
                    </react_1.ToggleGroupItem>
                    <react_1.ToggleGroupItem size="sm" value="max">
                      <lu_1.LuMaximize2 className="mr-2"/>
                      Maximum
                    </react_1.ToggleGroupItem>
                  </react_1.ToggleGroup>

                  {numericControls.includes("min") && (<Form_1.Number name="minValue" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Minimum"], ["Minimum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }}/>)}
                  {numericControls.includes("max") && (<Form_1.Number name="maxValue" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Maximum"], ["Maximum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }}/>)}
                </div>)}
              {type === "List" && (<Form_1.Array name="listValues" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}

              <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                <macro_1.Trans>Save Step</macro_1.Trans>
              </Form_1.Submit>
            </react_1.VStack>
          </form_1.ValidatedForm>
        </div>) : (<div className="flex justify-end mb-4">
          <react_1.Button onClick={disclosure.onOpen} leftIcon={<lu_1.LuCirclePlus />}>
            <macro_1.Trans>Add Step</macro_1.Trans>
          </react_1.Button>
        </div>)}

      {steps.length > 0 && (<div className="border rounded-lg ">
          <framer_motion_1.Reorder.Group axis="y" values={sortOrder} onReorder={onReorder} className="w-full">
            {sortOrder.map(function (stepId) {
                var step = steps.find(function (s) { return s.id === stepId; });
                if (!step)
                    return null;
                var index = sortOrder.indexOf(stepId);
                return (<DraggableStepItem key={stepId} stepId={stepId} isDisabled={isDisabled}>
                  {function (dragControls) { return (<StepsListItem attribute={step} operationId={operationId} typeOptions={typeOptions} isDisabled={isDisabled} dragControls={dragControls} itemMentions={itemMentions} className={index === sortOrder.length - 1 ? "border-none" : ""}/>); }}
                </DraggableStepItem>);
            })}
          </framer_motion_1.Reorder.Group>
        </div>)}
    </react_1.Loading>);
}
function DraggableStepItem(_a) {
    var stepId = _a.stepId, isDisabled = _a.isDisabled, children = _a.children;
    var dragControls = (0, framer_motion_1.useDragControls)();
    return (<framer_motion_1.Reorder.Item key={stepId} value={stepId} dragListener={false} dragControls={dragControls}>
      {children(dragControls)}
    </framer_motion_1.Reorder.Item>);
}
function StepsListItem(_a) {
    var _this = this;
    var _b, _c, _d;
    var attribute = _a.attribute, operationId = _a.operationId, typeOptions = _a.typeOptions, _e = _a.isDisabled, isDisabled = _e === void 0 ? false : _e, dragControls = _a.dragControls, itemMentions = _a.itemMentions, className = _a.className;
    var name = attribute.name, unitOfMeasureCode = attribute.unitOfMeasureCode, minValue = attribute.minValue, maxValue = attribute.maxValue, id = attribute.id, updatedBy = attribute.updatedBy, updatedAt = attribute.updatedAt, createdBy = attribute.createdBy, createdAt = attribute.createdAt;
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var createdUpdatedText = (0, productionQuantityLabels_1.useRelativeCreatedUpdatedText)();
    var disclosure = (0, react_1.useDisclosure)();
    var deleteModalDisclosure = (0, react_1.useDisclosure)();
    var submitted = (0, react_2.useRef)(false);
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    var _f = (0, react_2.useState)(function () {
        if (!attribute.description)
            return {};
        // Handle both object and string formats
        if (typeof attribute.description === "object") {
            return attribute.description;
        }
        try {
            return JSON.parse(attribute.description);
            // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        }
        catch (e) {
            return {};
        }
    }), description = _f[0], setDescription = _f[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (submitted.current && fetcher.state === "idle") {
            disclosure.onClose();
            submitted.current = false;
        }
    }, [fetcher.state]);
    var _g = (0, react_2.useState)(attribute.type), type = _g[0], setType = _g[1];
    var _h = (0, react_2.useState)(function () {
        var controls = [];
        if (type === "Measurement") {
            if (minValue !== null) {
                controls.push("min");
            }
            if (maxValue !== null) {
                controls.push("max");
            }
        }
        return controls;
    }), numericControls = _h[0], setNumericControls = _h[1];
    var isUpdated = updatedBy !== null;
    var person = isUpdated ? updatedBy : createdBy;
    var date = updatedAt !== null && updatedAt !== void 0 ? updatedAt : createdAt;
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var onUploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/parts/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error(t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    if (!id)
        return null;
    return (<div className={(0, react_1.cn)("border-b p-6", className)}>
      {disclosure.isOpen ? (<form_1.ValidatedForm action={path_1.path.to.jobOperationStep(id)} method="post" validator={shared_1.operationStepValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
                disclosure.onClose();
            }} defaultValues={__assign(__assign({}, attribute), { operationId: operationId })} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <Form_1.Hidden name="description" value={JSON.stringify(description)}/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Form_1.SelectControlled name="type" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Type"], ["Type"])))} options={typeOptions} onChange={function (option) {
                if (option) {
                    setType(option.value);
                }
            }}/>
              <form_1.Input name="name" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Name"], ["Name"])))}/>
            </div>

            <react_1.VStack spacing={2} className="w-full col-span-2">
              <react_1.Label>
                <macro_1.Trans>Description</macro_1.Trans>
              </react_1.Label>
              <Editor_1.Editor initialValue={description} onUpload={onUploadImage} onChange={function (value) {
                setDescription(value);
            }} mentions={[{ char: "@", items: itemMentions }]} className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"/>
            </react_1.VStack>

            {type === "Measurement" && (<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <UnitOfMeasure_1.default name="unitOfMeasureCode" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>

                <react_1.ToggleGroup type="multiple" value={numericControls} onValueChange={setNumericControls} className="justify-start items-start mt-6">
                  <react_1.ToggleGroupItem size="sm" value="min">
                    <lu_1.LuMinimize2 className="mr-2"/>
                    Minimum
                  </react_1.ToggleGroupItem>
                  <react_1.ToggleGroupItem size="sm" value="max">
                    <lu_1.LuMaximize2 className="mr-2"/>
                    Maximum
                  </react_1.ToggleGroupItem>
                </react_1.ToggleGroup>

                {numericControls.includes("min") && (<Form_1.Number name="minValue" label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Minimum"], ["Minimum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }}/>)}
                {numericControls.includes("max") && (<Form_1.Number name="maxValue" label={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Maximum"], ["Maximum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }}/>)}
              </div>)}
            {type === "List" && (<Form_1.Array name="listValues" label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <Form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.VStack>
        </form_1.ValidatedForm>) : (<div className="flex flex-col gap-2 w-full">
          <div className="flex flex-1 justify-between items-center w-full">
            <react_1.HStack spacing={4} className="w-1/2">
              <react_1.IconButton aria-label={t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost" disabled={isDisabled} className="cursor-grab active:cursor-grabbing" onPointerDown={function (e) {
                if (!isDisabled && dragControls)
                    dragControls.start(e);
            }} style={{ touchAction: "none" }}/>
              <react_1.HStack spacing={4} className="flex-1">
                <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                  <Icons_1.ProcedureStepTypeIcon type={type}/>
                </div>
                <react_1.VStack spacing={0}>
                  <react_1.HStack>
                    <p className="text-foreground text-sm font-medium">
                      {attribute.name}
                    </p>
                    {attribute.description &&
                Object.keys(attribute.description).length > 0 ? (<react_1.Tooltip>
                        <react_1.TooltipTrigger>
                          <lu_1.LuInfo className="text-muted-foreground size-3"/>
                        </react_1.TooltipTrigger>
                        <react_1.TooltipContent side="right">
                          <p className="prose prose-sm dark:prose-invert text-foreground text-sm" dangerouslySetInnerHTML={{
                    __html: (0, react_1.generateHTML)(attribute.description)
                }}/>
                        </react_1.TooltipContent>
                      </react_1.Tooltip>) : null}
                  </react_1.HStack>
                  {attribute.type === "Measurement" && (<span className="text-xs text-muted-foreground">
                      {attribute.minValue !== null &&
                    attribute.maxValue !== null
                    ? "Must be between ".concat(attribute.minValue, " and ").concat(attribute.maxValue, " ").concat((_b = unitOfMeasures.find(function (u) { return u.value === unitOfMeasureCode; })) === null || _b === void 0 ? void 0 : _b.label)
                    : attribute.minValue !== null
                        ? "Must be > ".concat(attribute.minValue, " ").concat((_c = unitOfMeasures.find(function (u) { return u.value === unitOfMeasureCode; })) === null || _c === void 0 ? void 0 : _c.label)
                        : attribute.maxValue !== null
                            ? "Must be < ".concat(attribute.maxValue, " ").concat((_d = unitOfMeasures.find(function (u) { return u.value === unitOfMeasureCode; })) === null || _d === void 0 ? void 0 : _d.label)
                            : null}
                    </span>)}
                </react_1.VStack>
              </react_1.HStack>
            </react_1.HStack>
            <div className="flex items-center justify-end gap-2">
              <react_1.HStack spacing={2}>
                <span className="text-xs text-muted-foreground">
                  {createdUpdatedText(isUpdated, formatRelativeTime(date))}
                </span>
                <components_1.EmployeeAvatar employeeId={person} withName={false}/>
              </react_1.HStack>
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                    <macro_1.Trans>Edit</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem destructive onClick={deleteModalDisclosure.onOpen}>
                    <macro_1.Trans>Delete</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
            </div>
          </div>
          {attribute.jobOperationStepRecord && (<PreviewStepRecords attribute={attribute}/>)}
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteJobOperationStep(id)} isOpen={deleteModalDisclosure.isOpen} name={name} text={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Are you sure you want to delete the ", " attribute from this operation? This cannot be undone."], ["Are you sure you want to delete the ", " attribute from this operation? This cannot be undone."])), name)} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function PreviewStepRecords(_a) {
    var attribute = _a.attribute;
    var t = (0, macro_1.useLingui)().t;
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    if (!attribute.jobOperationStepRecord ||
        !Array.isArray(attribute.jobOperationStepRecord)) {
        return null;
    }
    var records = attribute.jobOperationStepRecord;
    return (<div className="mt-4">
      <div className="border rounded-lg overflow-hidden">
        {records.map(function (record, index) {
            var _a;
            return (<div key={record.id || index} className={(0, react_1.cn)("flex flex-1 items-center justify-between px-3 py-2", index !== records.length - 1 && "border-b")}>
            <div className="flex w-1/2 items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                {t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Record ", ""], ["Record ", ""])), index + 1)}
              </span>
              <div className="text-right font-medium">
                <PreviewStepRecord attribute={attribute} record={record}/>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 w-1/2">
              <react_1.HStack spacing={2}>
                <span className="text-xs text-muted-foreground">
                  {t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Created ", ""], ["Created ", ""])), formatRelativeTime((_a = record.createdAt) !== null && _a !== void 0 ? _a : ""))}
                </span>
                <components_1.EmployeeAvatar employeeId={record.createdBy} withName={false}/>
              </react_1.HStack>
            </div>
          </div>);
        })}
      </div>
    </div>);
}
function PreviewStepRecord(_a) {
    var _b, _c, _d, _e, _f, _g;
    var attribute = _a.attribute, record = _a.record;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var employees = (0, stores_1.usePeople)()[0];
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    return (<>
      {attribute.type === "Task" && (<react_1.Checkbox checked={(_b = record.booleanValue) !== null && _b !== void 0 ? _b : false}/>)}
      {attribute.type === "Checkbox" && (<react_1.Checkbox checked={(_c = record.booleanValue) !== null && _c !== void 0 ? _c : false}/>)}
      {attribute.type === "Value" && <p className="text-sm">{record.value}</p>}
      {attribute.type === "Measurement" &&
            typeof record.numericValue === "number" && (<p className={(0, react_1.cn)("text-sm", attribute.minValue !== null &&
                attribute.minValue !== undefined &&
                record.numericValue < attribute.minValue &&
                "text-red-500", attribute.maxValue !== null &&
                attribute.maxValue !== undefined &&
                record.numericValue > attribute.maxValue &&
                "text-red-500")}>
            {numberFormatter.format(record.numericValue)}{" "}
            {(_d = unitOfMeasures.find(function (u) { return u.value === attribute.unitOfMeasureCode; })) === null || _d === void 0 ? void 0 : _d.label}
          </p>)}
      {attribute.type === "Timestamp" && (<p className="text-sm">{formatDateTime((_e = record.value) !== null && _e !== void 0 ? _e : "")}</p>)}
      {attribute.type === "List" && <p className="text-sm">{record.value}</p>}
      {attribute.type === "Person" && (<p className="text-sm">
          {(_f = employees.find(function (e) { return e.id === record.userValue; })) === null || _f === void 0 ? void 0 : _f.name}
        </p>)}
      {attribute.type === "File" && record.value && (<div className="flex justify-end gap-2 text-xs">
          <lu_1.LuPaperclip className="size-4 text-muted-foreground"/>
          <a href={(0, path_1.getPrivateUrl)(record.value)} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>)}
      {attribute.type === "Inspection" && (<div className="flex justify-end gap-2 items-center text-sm">
          {record.value && (<>
              <lu_1.LuPaperclip className="size-4 text-muted-foreground"/>
              <a href={(0, path_1.getPrivateUrl)(record.value)} target="_blank" rel="noopener noreferrer" className="text-xs">
                View File
              </a>
            </>)}
          <react_1.Checkbox checked={(_g = record.booleanValue) !== null && _g !== void 0 ? _g : false}/>
        </div>)}
    </>);
}
function ParametersForm(_a) {
    var operationId = _a.operationId, isDisabled = _a.isDisabled, parameters = _a.parameters, temporaryItems = _a.temporaryItems;
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    if (isDisabled && temporaryItems[operationId]) {
        return (<react_1.Alert className="max-w-[420px] mx-auto my-8">
        <lu_1.LuTriangleAlert />
        <react_1.AlertTitle>
          <macro_1.Trans>Cannot add parameters to unsaved operation</macro_1.Trans>
        </react_1.AlertTitle>
        <react_1.AlertDescription>
          <macro_1.Trans>Please save the operation before adding parameters.</macro_1.Trans>
        </react_1.AlertDescription>
      </react_1.Alert>);
    }
    return (<div className="flex flex-col gap-6">
      <div className="p-6 border rounded-lg bg-card">
        <form_1.ValidatedForm action={path_1.path.to.newJobOperationParameter} method="post" validator={shared_1.operationParameterValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
            id: undefined,
            key: "",
            value: "",
            operationId: operationId
        }} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <form_1.Input name="key" label={t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Key"], ["Key"])))} autoFocus={parameters.length === 0}/>
              <form_1.Input name="value" label={t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Value"], ["Value"])))}/>
            </div>
            <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
              <macro_1.Trans>Add Parameter</macro_1.Trans>
            </Form_1.Submit>
          </react_1.VStack>
        </form_1.ValidatedForm>
      </div>

      {parameters.length > 0 && (<div className="border rounded-lg">
          {__spreadArray([], parameters, true).sort(function (a, b) { var _a, _b; return String((_a = a.id) !== null && _a !== void 0 ? _a : "").localeCompare(String((_b = b.id) !== null && _b !== void 0 ? _b : "")); })
                .map(function (p, index) { return (<ParametersListItem key={p.id} parameter={p} operationId={operationId} className={index === parameters.length - 1 ? "border-none" : ""}/>); })}
        </div>)}
    </div>);
}
function ParametersListItem(_a) {
    var _b = _a.parameter, key = _b.key, value = _b.value, id = _b.id, updatedBy = _b.updatedBy, updatedAt = _b.updatedAt, createdBy = _b.createdBy, createdAt = _b.createdAt, operationId = _a.operationId, className = _a.className;
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var createdUpdatedText = (0, productionQuantityLabels_1.useRelativeCreatedUpdatedText)();
    var disclosure = (0, react_1.useDisclosure)();
    var deleteModalDisclosure = (0, react_1.useDisclosure)();
    var submitted = (0, react_2.useRef)(false);
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (submitted.current && fetcher.state === "idle") {
            disclosure.onClose();
            submitted.current = false;
        }
    }, [fetcher.state]);
    var isUpdated = updatedBy !== null;
    var person = isUpdated ? updatedBy : createdBy;
    var date = updatedAt !== null && updatedAt !== void 0 ? updatedAt : createdAt;
    if (!id)
        return null;
    return (<div className={(0, react_1.cn)("border-b p-6", className)}>
      {disclosure.isOpen ? (<form_1.ValidatedForm action={path_1.path.to.jobOperationParameter(id)} method="post" validator={shared_1.operationParameterValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
                disclosure.onClose();
            }} defaultValues={{
                id: id,
                key: key !== null && key !== void 0 ? key : "",
                value: value !== null && value !== void 0 ? value : "",
                operationId: operationId
            }} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <form_1.Input name="key" label={t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Key"], ["Key"])))}/>
              <form_1.Input name="value" label={t(templateObject_34 || (templateObject_34 = __makeTemplateObject(["Value"], ["Value"])))}/>
            </div>
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <Form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.VStack>
        </form_1.ValidatedForm>) : (<div className="flex flex-1 justify-between items-center w-full">
          <react_1.HStack spacing={4} className="w-1/2">
            <react_1.HStack spacing={4} className="flex-1">
              <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                <lu_1.LuActivity className="size-4"/>
              </div>
              <react_1.VStack spacing={0}>
                <span className="text-sm font-medium">{key}</span>
              </react_1.VStack>
              <span className="text-base text-muted-foreground">{value}</span>
            </react_1.HStack>
          </react_1.HStack>
          <div className="flex items-center justify-end gap-2">
            <react_1.HStack spacing={2}>
              <span className="text-xs text-muted-foreground">
                {createdUpdatedText(isUpdated, formatRelativeTime(date))}
              </span>
              <components_1.EmployeeAvatar employeeId={person} withName={false}/>
            </react_1.HStack>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                  <macro_1.Trans>Edit</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem destructive onClick={deleteModalDisclosure.onOpen}>
                  <macro_1.Trans>Delete</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </div>
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteJobOperationParameter(id)} isOpen={deleteModalDisclosure.isOpen} name={key} text={t(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Are you sure you want to delete the ", " parameter from this operation? This cannot be undone."], ["Are you sure you want to delete the ", " parameter from this operation? This cannot be undone."])), key)} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function OperationForm(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    var item = _a.item, jobId = _a.jobId, isDisabled = _a.isDisabled, job = _a.job, locationId = _a.locationId, workInstruction = _a.workInstruction, setWorkInstructions = _a.setWorkInstructions, setTemporaryItems = _a.setTemporaryItems, setSelectedItemId = _a.setSelectedItemId, temporaryItems = _a.temporaryItems, onSubmit = _a.onSubmit;
    var t = (0, macro_1.useLingui)().t;
    var operationOrderOptions = (0, react_2.useMemo)(function () { return [
        { value: "After Previous", label: <macro_1.Trans>After Previous</macro_1.Trans> },
        { value: "With Previous", label: <macro_1.Trans>With Previous</macro_1.Trans> }
    ]; }, []);
    var operationTypeOptions = (0, operationBop_1.useOperationTypeSelectOptions)();
    var company = (0, hooks_1.useUser)().company;
    var fetcher = (0, react_router_1.useFetcher)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.id) {
            // Clear temporary item after successful save
            setTemporaryItems(function (prev) {
                var _a = prev, _b = item.id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return rest;
            });
            if ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) {
                react_1.toast.success(fetcher.data.message);
            }
            onSubmit();
        }
    }, [item.id, fetcher.data, onSubmit, setTemporaryItems]);
    var _4 = (0, react_2.useState)(false), procedureWasChanged = _4[0], setProcedureWasChanged = _4[1];
    var procedureSyncDisclosure = (0, react_1.useDisclosure)();
    var _5 = (0, react_2.useState)({
        description: (_c = item.data.description) !== null && _c !== void 0 ? _c : "",
        insideUnitCost: (_d = item.data.insideUnitCost) !== null && _d !== void 0 ? _d : 0,
        laborRate: (_e = item.data.laborRate) !== null && _e !== void 0 ? _e : 0,
        laborTime: (_f = item.data.laborTime) !== null && _f !== void 0 ? _f : 0,
        laborUnit: (_g = item.data.laborUnit) !== null && _g !== void 0 ? _g : "Hours/Piece",
        laborUnitHint: (0, UnitHint_1.getUnitHint)(item.data.laborUnit),
        machineRate: (_h = item.data.machineRate) !== null && _h !== void 0 ? _h : 0,
        machineTime: (_j = item.data.machineTime) !== null && _j !== void 0 ? _j : 0,
        machineUnit: (_k = item.data.machineUnit) !== null && _k !== void 0 ? _k : "Hours/Piece",
        machineUnitHint: (0, UnitHint_1.getUnitHint)(item.data.machineUnit),
        operationMinimumCost: (_l = item.data.operationMinimumCost) !== null && _l !== void 0 ? _l : 0,
        operationLeadTime: (_m = item.data.operationLeadTime) !== null && _m !== void 0 ? _m : 0,
        operationSupplierProcessId: (_o = item.data.operationSupplierProcessId) !== null && _o !== void 0 ? _o : "",
        operationType: ((_p = item.data.operationType) !== null && _p !== void 0 ? _p : "Inside"),
        operationUnitCost: (_q = item.data.operationUnitCost) !== null && _q !== void 0 ? _q : 0,
        overheadRate: (_r = item.data.overheadRate) !== null && _r !== void 0 ? _r : 0,
        processId: (_s = item.data.processId) !== null && _s !== void 0 ? _s : "",
        procedureId: (_t = item.data.procedureId) !== null && _t !== void 0 ? _t : "",
        setupTime: (_u = item.data.setupTime) !== null && _u !== void 0 ? _u : 0,
        setupUnit: (_v = item.data.setupUnit) !== null && _v !== void 0 ? _v : "Total Minutes",
        setupUnitHint: (0, UnitHint_1.getUnitHint)(item.data.setupUnit)
    }), processData = _5[0], setProcessData = _5[1];
    (0, react_2.useEffect)(function () {
        setTemporaryItems(function (prev) {
            var _a;
            var current = prev[item.id];
            if (!current)
                return prev;
            return __assign(__assign({}, prev), (_a = {}, _a[item.id] = __assign(__assign({}, current), { description: processData.description, operationType: processData.operationType, processId: processData.processId, operationSupplierProcessId: processData.operationSupplierProcessId, operationMinimumCost: processData.operationMinimumCost, operationUnitCost: processData.operationUnitCost, operationLeadTime: processData.operationLeadTime, laborRate: processData.laborRate, machineRate: processData.machineRate, overheadRate: processData.overheadRate, setupTime: processData.setupTime, laborTime: processData.laborTime, machineTime: processData.machineTime }), _a));
        });
    }, [processData, item.id, setTemporaryItems]);
    var procedures = (0, Procedure_1.useProcedures)({ processId: processData.processId }).procedures;
    var procedureTabSummary = (0, react_2.useMemo)(function () {
        var _a;
        if (!processData.procedureId)
            return undefined;
        var procedure = procedures.find(function (p) { return p.id === processData.procedureId; });
        return (_a = procedure === null || procedure === void 0 ? void 0 : procedure.name) !== null && _a !== void 0 ? _a : "…";
    }, [processData.procedureId, procedures]);
    var procedureTabSummaryTitle = (0, react_2.useMemo)(function () {
        if (!processData.procedureId)
            return undefined;
        var procedure = procedures.find(function (p) { return p.id === processData.procedureId; });
        if (!procedure)
            return undefined;
        return procedure.version
            ? "".concat(procedure.name, " v").concat(procedure.version)
            : procedure.name;
    }, [processData.procedureId, procedures]);
    var onProcessChange = function (processId) { return __awaiter(_this, void 0, void 0, function () {
        var _a, process, workCenters, supplierProcesses, activeWorkCenters, operationType, useSupplierRouting;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!carbon || !processId)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon.from("process").select("*").eq("id", processId).single(),
                            carbon
                                .from("workCenterProcess")
                                .select("workCenter(*)")
                                .eq("processId", processId)
                                .eq("workCenter.active", true),
                            carbon.from("supplierProcess").select("*").eq("processId", processId)
                        ])];
                case 1:
                    _a = _e.sent(), process = _a[0], workCenters = _a[1], supplierProcesses = _a[2];
                    activeWorkCenters = (_c = (_b = workCenters === null || workCenters === void 0 ? void 0 : workCenters.data) === null || _b === void 0 ? void 0 : _b.filter(function (wc) { return Boolean(wc.workCenter); })) !== null && _c !== void 0 ? _c : [];
                    if (process.error)
                        throw new Error(process.error.message);
                    operationType = (0, operationType_1.defaultOperationTypeFromProcess)((_d = process.data) === null || _d === void 0 ? void 0 : _d.processType);
                    useSupplierRouting = (0, operationType_1.showsSupplierRoutingFields)(operationType);
                    setProcessData(function (p) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        return (__assign(__assign({}, p), { processId: processId, procedureId: "", description: (_b = (_a = process.data) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", laborUnit: (_d = (_c = process.data) === null || _c === void 0 ? void 0 : _c.defaultStandardFactor) !== null && _d !== void 0 ? _d : "Hours/Piece", laborUnitHint: (0, UnitHint_1.getUnitHint)((_e = process.data) === null || _e === void 0 ? void 0 : _e.defaultStandardFactor), laborRate: 
                            // get the average labor rate from the work centers
                            activeWorkCenters.length
                                ? activeWorkCenters.reduce(function (acc, workCenter) {
                                    var _a, _b;
                                    return (acc += (_b = (_a = workCenter.workCenter) === null || _a === void 0 ? void 0 : _a.laborRate) !== null && _b !== void 0 ? _b : 0);
                                }, 0) / activeWorkCenters.length
                                : p.laborRate, machineUnit: (_g = (_f = process.data) === null || _f === void 0 ? void 0 : _f.defaultStandardFactor) !== null && _g !== void 0 ? _g : "Hours/Piece", machineUnitHint: (0, UnitHint_1.getUnitHint)((_h = process.data) === null || _h === void 0 ? void 0 : _h.defaultStandardFactor), machineRate: 
                            // get the average labor rate from the work centers
                            activeWorkCenters.length
                                ? activeWorkCenters.reduce(function (acc, workCenter) {
                                    var _a, _b;
                                    return (acc += (_b = (_a = workCenter.workCenter) === null || _a === void 0 ? void 0 : _a.machineRate) !== null && _b !== void 0 ? _b : 0);
                                }, 0) / activeWorkCenters.length
                                : p.machineRate, 
                            // get the average quoting rate from the work centers
                            overheadRate: activeWorkCenters.length
                                ? (activeWorkCenters === null || activeWorkCenters === void 0 ? void 0 : activeWorkCenters.reduce(function (acc, workCenter) {
                                    var _a, _b;
                                    return (acc += (_b = (_a = workCenter.workCenter) === null || _a === void 0 ? void 0 : _a.overheadRate) !== null && _b !== void 0 ? _b : 0);
                                }, 0)) / activeWorkCenters.length
                                : p.overheadRate, operationMinimumCost: useSupplierRouting &&
                                supplierProcesses.data &&
                                supplierProcesses.data.length > 0
                                ? supplierProcesses.data.reduce(function (acc, sp) {
                                    var _a;
                                    return (acc += (_a = sp.minimumCost) !== null && _a !== void 0 ? _a : 0);
                                }, 0) / supplierProcesses.data.length
                                : useSupplierRouting
                                    ? p.operationMinimumCost
                                    : 0, operationUnitCost: useSupplierRouting &&
                                supplierProcesses.data &&
                                supplierProcesses.data.length > 0
                                ? supplierProcesses.data.reduce(function (acc, sp) {
                                    var _a;
                                    return (acc += (_a = sp.unitCost) !== null && _a !== void 0 ? _a : 0);
                                }, 0) / supplierProcesses.data.length
                                : useSupplierRouting
                                    ? p.operationUnitCost
                                    : 0, operationLeadTime: useSupplierRouting &&
                                supplierProcesses.data &&
                                supplierProcesses.data.length > 0
                                ? supplierProcesses.data.reduce(function (acc, sp) {
                                    var _a;
                                    return (acc += (_a = sp.leadTime) !== null && _a !== void 0 ? _a : 0);
                                }, 0) / supplierProcesses.data.length
                                : useSupplierRouting
                                    ? p.operationLeadTime
                                    : 0, operationType: operationType }));
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var onWorkCenterChange = function (workCenterId) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    if (!!workCenterId) return [3 /*break*/, 2];
                    // get the average costs
                    return [4 /*yield*/, onProcessChange(processData.processId)];
                case 1:
                    // get the average costs
                    _b.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, carbon
                        .from("workCenter")
                        .select("*")
                        .eq("id", workCenterId)
                        .single()];
                case 3:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error.message);
                    setProcessData(function (d) {
                        var _a, _b, _c, _d, _e;
                        return (__assign(__assign({}, d), { laborRate: (_a = data === null || data === void 0 ? void 0 : data.laborRate) !== null && _a !== void 0 ? _a : 0, laborUnit: (_b = data === null || data === void 0 ? void 0 : data.defaultStandardFactor) !== null && _b !== void 0 ? _b : "Hours/Piece", laborUnitHint: (0, UnitHint_1.getUnitHint)(data === null || data === void 0 ? void 0 : data.defaultStandardFactor), machineRate: (_c = data === null || data === void 0 ? void 0 : data.machineRate) !== null && _c !== void 0 ? _c : 0, machineUnit: (_d = data === null || data === void 0 ? void 0 : data.defaultStandardFactor) !== null && _d !== void 0 ? _d : "Hours/Piece", machineUnitHint: (0, UnitHint_1.getUnitHint)(data === null || data === void 0 ? void 0 : data.defaultStandardFactor), overheadRate: (_e = data === null || data === void 0 ? void 0 : data.overheadRate) !== null && _e !== void 0 ? _e : 0 }));
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var onSupplierProcessChange = function (supplierProcessId) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("supplierProcess")
                            .select("*")
                            .eq("id", supplierProcessId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error.message);
                    setProcessData(function (d) {
                        var _a, _b, _c;
                        return (__assign(__assign({}, d), { operationMinimumCost: (_a = data === null || data === void 0 ? void 0 : data.minimumCost) !== null && _a !== void 0 ? _a : 0, operationUnitCost: (_b = data === null || data === void 0 ? void 0 : data.unitCost) !== null && _b !== void 0 ? _b : 0, operationLeadTime: (_c = data === null || data === void 0 ? void 0 : data.leadTime) !== null && _c !== void 0 ? _c : 0, operationSupplierProcessId: supplierProcessId }));
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className={operationBop_1.operationFormContainerClass}>
      <form_1.ValidatedForm action={temporaryItems[item.id]
            ? path_1.path.to.newJobOperation(jobId)
            : path_1.path.to.jobOperation(jobId, item.id)} method="post" defaultValues={item.data} validator={["Draft", "Planned"].includes((_w = job === null || job === void 0 ? void 0 : job.status) !== null && _w !== void 0 ? _w : "")
            ? production_models_1.jobOperationValidator
            : production_models_1.jobOperationValidatorForReleasedJob} className="flex w-full min-w-0 flex-col gap-y-4" fetcher={fetcher}>
        <div>
          <Form_1.Hidden name="id"/>
          <Form_1.Hidden name="jobMakeMethodId"/>
          <Form_1.Hidden name="order"/>
        </div>
        <div className={operationBop_1.operationFormGridClass}>
          <div className={operationBop_1.operationFormPairFieldClass}>
            <Form_1.Process name="processId" label={t(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Process"], ["Process"])))} onChange={function (value) {
            onProcessChange(value === null || value === void 0 ? void 0 : value.value);
        }}/>
          </div>
          <div className={operationBop_1.operationFormPairFieldClass}>
            <Form_1.Select name="operationOrder" label={t(templateObject_38 || (templateObject_38 = __makeTemplateObject(["Operation Order"], ["Operation Order"])))} placeholder={t(templateObject_39 || (templateObject_39 = __makeTemplateObject(["Operation Order"], ["Operation Order"])))} options={operationOrderOptions}/>
          </div>
          <div className={operationBop_1.operationFormTypeFieldClass}>
            <Form_1.SelectControlled name="operationType" label={t(templateObject_40 || (templateObject_40 = __makeTemplateObject(["Operation Type"], ["Operation Type"])))} placeholder={t(templateObject_41 || (templateObject_41 = __makeTemplateObject(["Operation Type"], ["Operation Type"])))} options={operationTypeOptions} value={processData.operationType} onChange={function (value) {
            var operationType = value === null || value === void 0 ? void 0 : value.value;
            var useSupplierRouting = (0, operationType_1.showsSupplierRoutingFields)(operationType);
            setProcessData(function (d) { return (__assign(__assign(__assign({}, d), { setupUnit: "Total Minutes", laborUnit: "Minutes/Piece", machineUnit: "Minutes/Piece", operationType: operationType }), (useSupplierRouting
                ? {}
                : {
                    operationSupplierProcessId: "",
                    operationMinimumCost: 0,
                    operationUnitCost: 0,
                    operationLeadTime: 0
                }))); });
        }}/>
          </div>

          <div className={operationBop_1.operationFormDescriptionFieldClass}>
            <Form_1.InputControlled name="description" label={t(templateObject_42 || (templateObject_42 = __makeTemplateObject(["Description"], ["Description"])))} value={processData.description} onChange={function (newValue) {
            setProcessData(function (d) { return (__assign(__assign({}, d), { description: newValue })); });
        }}/>
          </div>

          {(0, operationType_1.isInsideOperationType)(processData.operationType) ? (<>
              <div className={operationBop_1.operationFormWorkCenterFieldClass}>
                <Form_1.WorkCenter name="workCenterId" label={t(templateObject_43 || (templateObject_43 = __makeTemplateObject(["Work Center"], ["Work Center"])))} autoSelectSingleOption={Boolean(processData.processId)} locationId={locationId} isOptional={["Draft", "Planned"].includes((_x = job === null || job === void 0 ? void 0 : job.status) !== null && _x !== void 0 ? _x : "")} processId={processData.processId} onChange={function (value) {
                if (value) {
                    onWorkCenterChange(value === null || value === void 0 ? void 0 : value.value);
                }
            }}/>
              </div>
              <div className={operationBop_1.operationFormPairFieldClass}>
                <Form_1.NumberControlled name="laborRate" label={t(templateObject_44 || (templateObject_44 = __makeTemplateObject(["Labor Rate"], ["Labor Rate"])))} minValue={0} value={processData.laborRate} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { laborRate: newValue })); });
            }}/>
              </div>
              <div className={operationBop_1.operationFormPairFieldClass}>
                <Form_1.NumberControlled name="machineRate" label={t(templateObject_45 || (templateObject_45 = __makeTemplateObject(["Machine Rate"], ["Machine Rate"])))} minValue={0} value={processData.machineRate} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { machineRate: newValue })); });
            }}/>
              </div>
              <div className={operationBop_1.operationFormPairFieldClass}>
                <Form_1.NumberControlled name="overheadRate" label={t(templateObject_46 || (templateObject_46 = __makeTemplateObject(["Overhead Rate"], ["Overhead Rate"])))} minValue={0} value={processData.overheadRate} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { overheadRate: newValue })); });
            }}/>
              </div>
              <div className={operationBop_1.operationFormPairFieldClass}>
                <Form_1.NumberControlled name="insideUnitCost" label={t(templateObject_47 || (templateObject_47 = __makeTemplateObject(["Unit rate"], ["Unit rate"])))} minValue={0} value={processData.insideUnitCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { insideUnitCost: newValue !== null && newValue !== void 0 ? newValue : 0 })); });
            }}/>
              </div>
            </>) : null}
          {(0, operationType_1.showsSupplierRoutingFields)(processData.operationType) ? (<>
              <div className={operationBop_1.operationFormWorkCenterFieldClass}>
                <Form_1.SupplierProcess name="operationSupplierProcessId" label={t(templateObject_48 || (templateObject_48 = __makeTemplateObject(["Supplier"], ["Supplier"])))} processId={processData.processId} isOptional={false} onChange={function (value) {
                if (value) {
                    onSupplierProcessChange(value === null || value === void 0 ? void 0 : value.value);
                }
                else {
                    setProcessData(function (d) { return (__assign(__assign({}, d), { operationSupplierProcessId: "" })); });
                }
            }}/>
              </div>
              <div className={operationBop_1.operationFormPairFieldClass}>
                <Form_1.NumberControlled name="operationMinimumCost" label={t(templateObject_49 || (templateObject_49 = __makeTemplateObject(["Minimum Cost"], ["Minimum Cost"])))} isOptional={false} minValue={0} value={processData.operationMinimumCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationMinimumCost: newValue })); });
            }}/>
              </div>
              <div className={operationBop_1.operationFormPairFieldClass}>
                <Form_1.NumberControlled name="operationUnitCost" label={t(templateObject_50 || (templateObject_50 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} isOptional={false} minValue={0} value={processData.operationUnitCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationUnitCost: newValue })); });
            }}/>
              </div>
              <div className={operationBop_1.operationFormPairFieldClass}>
                <Form_1.NumberControlled name="operationLeadTime" label={t(templateObject_51 || (templateObject_51 = __makeTemplateObject(["Lead Time"], ["Lead Time"])))} isOptional={false} minValue={0} value={processData.operationLeadTime} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationLeadTime: newValue })); });
            }}/>
              </div>
            </>) : (<>
              <Form_1.Hidden name="operationSupplierProcessId" value=""/>
              <Form_1.Hidden name="operationMinimumCost" value={0}/>
              <Form_1.Hidden name="operationUnitCost" value={0}/>
              <Form_1.Hidden name="operationLeadTime" value={0}/>
            </>)}
        </div>

        {(0, operationType_1.isInsideOperationType)(processData.operationType) && (<operationBop_1.OperationDetailTabs sections={[
                {
                    id: "setup",
                    label: <macro_1.Trans>Setup</macro_1.Trans>,
                    accessibilityLabel: t(templateObject_52 || (templateObject_52 = __makeTemplateObject(["Setup"], ["Setup"]))),
                    icon: <components_1.TimeTypeIcon type="Setup"/>,
                    summary: ((_y = processData.setupTime) !== null && _y !== void 0 ? _y : 0) > 0
                        ? (0, operationBop_1.formatOperationTabSummary)(processData.setupTime, processData.setupUnit)
                        : undefined,
                    summaryTitle: ((_z = processData.setupTime) !== null && _z !== void 0 ? _z : 0) > 0
                        ? "".concat(processData.setupTime, " ").concat(processData.setupUnit)
                        : undefined,
                    content: (<>
                    <div className={operationBop_1.operationDetailHintFieldClass}>
                      <Form_1.UnitHint name="setupHint" label={t(templateObject_53 || (templateObject_53 = __makeTemplateObject(["Setup"], ["Setup"])))} value={processData.setupUnitHint} onChange={function (hint) {
                            setProcessData(function (d) { return (__assign(__assign({}, d), { setupUnitHint: hint, setupUnit: hint === "Fixed"
                                    ? "Total Minutes"
                                    : "Minutes/Piece" })); });
                        }}/>
                    </div>
                    <div className={operationBop_1.operationDetailMetricFieldClass}>
                      <Form_1.NumberControlled name="setupTime" label={t(templateObject_54 || (templateObject_54 = __makeTemplateObject(["Setup Time"], ["Setup Time"])))} isOptional={false} minValue={0} value={processData.setupTime} onChange={function (newValue) {
                            return setProcessData(function (d) { return (__assign(__assign({}, d), { setupTime: newValue })); });
                        }}/>
                    </div>
                    <div className={operationBop_1.operationDetailMetricFieldClass}>
                      <Form_1.StandardFactor name="setupUnit" label={t(templateObject_55 || (templateObject_55 = __makeTemplateObject(["Setup Unit"], ["Setup Unit"])))} isOptional={false} hint={processData.setupUnitHint} value={processData.setupUnit} onChange={function (newValue) {
                            setProcessData(function (d) {
                                var _a;
                                return (__assign(__assign({}, d), { setupUnit: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Total Minutes" }));
                            });
                        }}/>
                    </div>
                  </>)
                },
                {
                    id: "labor",
                    label: <macro_1.Trans>Labor</macro_1.Trans>,
                    accessibilityLabel: t(templateObject_56 || (templateObject_56 = __makeTemplateObject(["Labor"], ["Labor"]))),
                    icon: <components_1.TimeTypeIcon type="Labor"/>,
                    summary: ((_0 = processData.laborTime) !== null && _0 !== void 0 ? _0 : 0) > 0
                        ? (0, operationBop_1.formatOperationTabSummary)(processData.laborTime, processData.laborUnit)
                        : undefined,
                    summaryTitle: ((_1 = processData.laborTime) !== null && _1 !== void 0 ? _1 : 0) > 0
                        ? "".concat(processData.laborTime, " ").concat(processData.laborUnit)
                        : undefined,
                    content: (<>
                    <div className={operationBop_1.operationDetailHintFieldClass}>
                      <Form_1.UnitHint name="laborHint" label={t(templateObject_57 || (templateObject_57 = __makeTemplateObject(["Labor"], ["Labor"])))} value={processData.laborUnitHint} onChange={function (hint) {
                            setProcessData(function (d) { return (__assign(__assign({}, d), { laborUnitHint: hint, laborUnit: hint === "Fixed"
                                    ? "Total Minutes"
                                    : "Minutes/Piece" })); });
                        }}/>
                    </div>
                    <div className={operationBop_1.operationDetailMetricFieldClass}>
                      <Form_1.NumberControlled name="laborTime" label={t(templateObject_58 || (templateObject_58 = __makeTemplateObject(["Labor Time"], ["Labor Time"])))} isOptional={false} minValue={0} value={processData.laborTime} onChange={function (newValue) {
                            return setProcessData(function (d) { return (__assign(__assign({}, d), { laborTime: newValue })); });
                        }}/>
                    </div>
                    <div className={operationBop_1.operationDetailMetricFieldClass}>
                      <Form_1.StandardFactor name="laborUnit" label={t(templateObject_59 || (templateObject_59 = __makeTemplateObject(["Labor Unit"], ["Labor Unit"])))} isOptional={false} hint={processData.laborUnitHint} value={processData.laborUnit} onChange={function (newValue) {
                            setProcessData(function (d) {
                                var _a;
                                return (__assign(__assign({}, d), { laborUnit: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Total Minutes" }));
                            });
                        }}/>
                    </div>
                  </>)
                },
                {
                    id: "machine",
                    label: <macro_1.Trans>Machine</macro_1.Trans>,
                    accessibilityLabel: t(templateObject_60 || (templateObject_60 = __makeTemplateObject(["Machine"], ["Machine"]))),
                    icon: <components_1.TimeTypeIcon type="Machine"/>,
                    summary: ((_2 = processData.machineTime) !== null && _2 !== void 0 ? _2 : 0) > 0
                        ? (0, operationBop_1.formatOperationTabSummary)(processData.machineTime, processData.machineUnit)
                        : undefined,
                    summaryTitle: ((_3 = processData.machineTime) !== null && _3 !== void 0 ? _3 : 0) > 0
                        ? "".concat(processData.machineTime, " ").concat(processData.machineUnit)
                        : undefined,
                    content: (<>
                    <div className={operationBop_1.operationDetailHintFieldClass}>
                      <Form_1.UnitHint name="machineHint" label={t(templateObject_61 || (templateObject_61 = __makeTemplateObject(["Machine"], ["Machine"])))} value={processData.machineUnitHint} onChange={function (hint) {
                            setProcessData(function (d) { return (__assign(__assign({}, d), { machineUnitHint: hint, machineUnit: hint === "Fixed"
                                    ? "Total Minutes"
                                    : "Minutes/Piece" })); });
                        }}/>
                    </div>
                    <div className={operationBop_1.operationDetailMetricFieldClass}>
                      <Form_1.NumberControlled name="machineTime" label={t(templateObject_62 || (templateObject_62 = __makeTemplateObject(["Machine Time"], ["Machine Time"])))} isOptional={false} minValue={0} value={processData.machineTime} onChange={function (newValue) {
                            return setProcessData(function (d) { return (__assign(__assign({}, d), { machineTime: newValue })); });
                        }}/>
                    </div>
                    <div className={operationBop_1.operationDetailMetricFieldClass}>
                      <Form_1.StandardFactor name="machineUnit" label={t(templateObject_63 || (templateObject_63 = __makeTemplateObject(["Machine Unit"], ["Machine Unit"])))} isOptional={false} hint={processData.machineUnitHint} value={processData.machineUnit} onChange={function (newValue) {
                            setProcessData(function (d) {
                                var _a;
                                return (__assign(__assign({}, d), { machineUnit: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Total Minutes" }));
                            });
                        }}/>
                    </div>
                  </>)
                },
                {
                    id: "procedure",
                    label: <macro_1.Trans>Procedure</macro_1.Trans>,
                    accessibilityLabel: t(templateObject_64 || (templateObject_64 = __makeTemplateObject(["Procedure"], ["Procedure"]))),
                    icon: <lu_1.LuListChecks />,
                    summary: procedureTabSummary,
                    summaryTitle: procedureTabSummaryTitle,
                    contentClassName: "flex w-full min-w-0 flex-col gap-4 px-4 pb-4 pt-4",
                    content: (<>
                    <Procedure_1.default name="procedureId" label={t(templateObject_65 || (templateObject_65 = __makeTemplateObject(["Procedure"], ["Procedure"])))} processId={processData.processId} value={processData.procedureId} onChange={function (value) {
                            if (value && value.value !== item.data.procedureId) {
                                setProcedureWasChanged(true);
                            }
                            setProcessData(function (d) { return (__assign(__assign({}, d), { procedureId: value === null || value === void 0 ? void 0 : value.value })); });
                        }}/>
                    {!temporaryItems[item.id] && processData.procedureId && (<div className="flex flex-col gap-2 w-auto">
                        {procedureWasChanged && (<span className="text-sm text-muted-foreground">
                            <macro_1.Trans>
                              The procedure was changed, but not synced to the
                              operation.
                            </macro_1.Trans>
                          </span>)}
                        <div>
                          <react_1.Button variant="secondary" rightIcon={<lu_1.LuRefreshCcw />} onClick={procedureSyncDisclosure.onOpen}>
                            <macro_1.Trans>Sync Procedure</macro_1.Trans>
                          </react_1.Button>
                          {procedureSyncDisclosure.isOpen && (<ProcedureSyncModal operationId={item.id} procedureId={processData.procedureId} onClose={procedureSyncDisclosure.onClose}/>)}
                        </div>
                      </div>)}
                  </>)
                }
            ]}/>)}
        <framer_motion_1.motion.div className="flex w-full items-center justify-end p-2" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
            type: "spring",
            bounce: 0,
            duration: 0.55
        }}>
          <framer_motion_1.motion.div layout className="ml-auto mr-1 pt-2">
            <Form_1.Submit isDisabled={isDisabled}>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.Submit>
          </framer_motion_1.motion.div>
        </framer_motion_1.motion.div>
      </form_1.ValidatedForm>
    </div>);
}
function ProcedureSyncModal(_a) {
    var _b;
    var operationId = _a.operationId, procedureId = _a.procedureId, onClose = _a.onClose;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success, onClose]);
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm validator={production_models_1.procedureSyncValidator} action={path_1.path.to.jobOperationProcedureSync} method="post" fetcher={fetcher} defaultValues={{
            operationId: operationId,
            procedureId: procedureId
        }}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Are you sure?</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody className="py-4">
            <Form_1.Hidden name="operationId"/>
            <Form_1.Hidden name="procedureId"/>
            <react_1.Alert variant="warning">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>Potential Data Loss</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <macro_1.Trans>
                  Syncing the procedure will update the operation with the new
                  work instructions, steps, and parameters. Any steps that are
                  not part of the procedure will be removed.
                </macro_1.Trans>
              </react_1.AlertDescription>
            </react_1.Alert>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"}>
              <macro_1.Trans>Sync</macro_1.Trans>
            </Form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var ProductionEventActivity = function (_a) {
    var _b;
    var item = _a.item;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var getActivityMessage = (0, productionQuantityLabels_1.useProductionEventActivityMessage)();
    return (<Activity_1.default employeeId={(_b = item.employeeId) !== null && _b !== void 0 ? _b : item.createdBy} activityMessage={getActivityMessage(item)} activityTime={formatDateTime(item.startTime)} activityIcon={item.type ? (<components_1.TimeTypeIcon type={item.type} className={(0, react_1.cn)(item.type === "Labor"
                ? "text-emerald-500"
                : item.type === "Machine"
                    ? "text-blue-500"
                    : "text-yellow-500")}/>) : null}/>);
};
function ToolsListItem(_a) {
    var _b = _a.tool, toolId = _b.toolId, quantity = _b.quantity, id = _b.id, updatedBy = _b.updatedBy, updatedAt = _b.updatedAt, createdBy = _b.createdBy, createdAt = _b.createdAt, operationId = _a.operationId, className = _a.className;
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var createdUpdatedText = (0, productionQuantityLabels_1.useRelativeCreatedUpdatedText)();
    var disclosure = (0, react_1.useDisclosure)();
    var deleteModalDisclosure = (0, react_1.useDisclosure)();
    var submitted = (0, react_2.useRef)(false);
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (submitted.current && fetcher.state === "idle") {
            disclosure.onClose();
            submitted.current = false;
        }
    }, [fetcher.state]);
    var tools = (0, stores_1.useTools)();
    var tool = tools.find(function (t) { return t.id === toolId; });
    if (!tool || !id)
        return null;
    var isUpdated = updatedBy !== null;
    var person = isUpdated ? updatedBy : createdBy;
    var date = updatedAt !== null && updatedAt !== void 0 ? updatedAt : createdAt;
    return (<div className={(0, react_1.cn)("border-b p-6 bg-card", className)}>
      {disclosure.isOpen ? (<form_1.ValidatedForm action={path_1.path.to.jobOperationTool(id)} method="post" validator={shared_1.operationToolValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
                disclosure.onClose();
            }} defaultValues={{
                id: id,
                toolId: toolId !== null && toolId !== void 0 ? toolId : "",
                quantity: quantity !== null && quantity !== void 0 ? quantity : 1,
                operationId: operationId
            }} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              <Form_1.Tool name="toolId" label={t(templateObject_66 || (templateObject_66 = __makeTemplateObject(["Tool"], ["Tool"])))} autoFocus/>
              <Form_1.Number name="quantity" label={t(templateObject_67 || (templateObject_67 = __makeTemplateObject(["Quantity"], ["Quantity"])))}/>
            </div>
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <Form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.VStack>
        </form_1.ValidatedForm>) : (<div className="flex flex-1 justify-between items-center w-full">
          <react_1.HStack spacing={4} className="w-1/2">
            <react_1.HStack spacing={4} className="flex-1">
              <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                <lu_1.LuHammer className="size-4"/>
              </div>
              <react_1.VStack spacing={0}>
                <span className="text-sm font-medium">
                  {tool.readableIdWithRevision}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tool.name}
                </span>
              </react_1.VStack>
              <span className="text-base text-muted-foreground text-right">
                {quantity}
              </span>
            </react_1.HStack>
          </react_1.HStack>
          <div className="flex items-center justify-end gap-2">
            <react_1.HStack spacing={2}>
              <span className="text-xs text-muted-foreground">
                {createdUpdatedText(isUpdated, formatRelativeTime(date))}
              </span>
              <components_1.EmployeeAvatar employeeId={person} withName={false}/>
            </react_1.HStack>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_68 || (templateObject_68 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                  <macro_1.Trans>Edit</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem destructive onClick={deleteModalDisclosure.onOpen}>
                  <macro_1.Trans>Delete</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </div>
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteJobOperationTool(id)} isOpen={deleteModalDisclosure.isOpen} name={tool.readableIdWithRevision} text={t(templateObject_69 || (templateObject_69 = __makeTemplateObject(["Are you sure you want to delete ", " from this operation? This cannot be undone."], ["Are you sure you want to delete ", " from this operation? This cannot be undone."])), tool.readableIdWithRevision)} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function ToolsForm(_a) {
    var operationId = _a.operationId, isDisabled = _a.isDisabled, tools = _a.tools, temporaryItems = _a.temporaryItems;
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    if (isDisabled && temporaryItems[operationId]) {
        return (<react_1.Alert className="max-w-[420px] mx-auto my-8">
        <lu_1.LuTriangleAlert />
        <react_1.AlertTitle>
          <macro_1.Trans>Cannot add tools to unsaved operation</macro_1.Trans>
        </react_1.AlertTitle>
        <react_1.AlertDescription>
          <macro_1.Trans>Please save the operation before adding tools.</macro_1.Trans>
        </react_1.AlertDescription>
      </react_1.Alert>);
    }
    return (<div className="flex flex-col gap-6">
      <div className="p-6 border rounded-lg bg-card">
        <form_1.ValidatedForm action={path_1.path.to.newJobOperationTool} method="post" validator={shared_1.operationToolValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
            id: undefined,
            toolId: "",
            quantity: 1,
            operationId: operationId
        }} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Form_1.Tool name="toolId" label={t(templateObject_70 || (templateObject_70 = __makeTemplateObject(["Tool"], ["Tool"])))} autoFocus/>
              <Form_1.Number name="quantity" label={t(templateObject_71 || (templateObject_71 = __makeTemplateObject(["Quantity"], ["Quantity"])))}/>
            </div>

            <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
              <macro_1.Trans>Save Tool</macro_1.Trans>
            </Form_1.Submit>
          </react_1.VStack>
        </form_1.ValidatedForm>
      </div>

      {tools.length > 0 && (<div className="border rounded-lg">
          {__spreadArray([], tools, true).sort(function (a, b) { var _a, _b; return String((_a = a.id) !== null && _a !== void 0 ? _a : "").localeCompare(String((_b = b.id) !== null && _b !== void 0 ? _b : "")); })
                .map(function (t, index) { return (<ToolsListItem key={t.id} tool={t} operationId={operationId} className={index === tools.length - 1 ? "border-none" : ""}/>); })}
        </div>)}
    </div>);
}
function OperationChat(_a) {
    var _this = this;
    var jobOperationId = _a.jobOperationId;
    var user = (0, hooks_1.useUser)();
    var employees = (0, stores_1.usePeople)()[0];
    var _b = (0, react_2.useState)([]), messages = _b[0], setMessages = _b[1];
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var _c = (0, react_2.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var _d = (0, auth_1.useCarbon)(), carbon = _d.carbon, accessToken = _d.accessToken;
    var fetchChat = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    (0, react_dom_1.flushSync)(function () {
                        setIsLoading(true);
                    });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("jobOperationNote").select("*").eq("jobOperationId", jobOperationId).order("createdAt", { ascending: true }))];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error(error);
                        return [2 /*return*/];
                    }
                    setMessages(data);
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        fetchChat();
    });
    (0, react_1.useRealtimeChannel)({
        topic: "job-operation-notes-".concat(jobOperationId),
        setup: function (channel) {
            return channel.on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "jobOperationNote",
                filter: "jobOperationId=eq.".concat(jobOperationId)
            }, function (payload) {
                setMessages(function (prev) {
                    if (prev.some(function (m) { return m.id === payload.new.id; })) {
                        return prev;
                    }
                    return __spreadArray(__spreadArray([], prev, true), [payload.new], false);
                });
            });
        }
    });
    var messagesEndRef = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
            block: "nearest",
            inline: "start",
            behavior: messages.length > 0 ? "smooth" : "auto"
        });
    }, [messages]);
    var _e = (0, react_2.useState)(""), message = _e[0], setMessage = _e[1];
    var notify = (0, react_1.useDebounce)(function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, fetch(path_1.path.to.api.messagingNotify, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                type: "jobOperationNote",
                                operationId: jobOperationId
                            }),
                            credentials: "include" // This is sufficient for CORS with cookies
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Failed to notify user");
                    }
                    return [2 /*return*/];
            }
        });
    }); }, 5000, true);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var newMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!message.trim())
                        return [2 /*return*/];
                    newMessage = {
                        id: (0, nanoid_1.nanoid)(),
                        jobOperationId: jobOperationId,
                        createdBy: user.id,
                        note: message,
                        createdAt: new Date().toISOString(),
                        companyId: user.company.id
                    };
                    (0, react_dom_1.flushSync)(function () {
                        setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newMessage], false); });
                        setMessage("");
                    });
                    return [4 /*yield*/, Promise.all([
                            carbon === null || carbon === void 0 ? void 0 : carbon.from("jobOperationNote").insert(newMessage),
                            notify()
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="flex flex-col h-[50dvh]">
      <react_1.ScrollArea className="flex-1 p-4">
        <react_1.Loading isLoading={isLoading}>
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (<div className="flex justify-center pt-16">
                <components_1.Empty />
              </div>) : (messages.map(function (m) {
            var _a;
            var createdBy = employees.find(function (employee) { return employee.id === m.createdBy; });
            var isUser = m.createdBy === user.id;
            return (<div key={m.id} className={(0, react_1.cn)("flex gap-2 items-end", isUser && "flex-row-reverse")}>
                    <react_1.Avatar src={(_a = createdBy === null || createdBy === void 0 ? void 0 : createdBy.avatarUrl) !== null && _a !== void 0 ? _a : undefined} name={createdBy === null || createdBy === void 0 ? void 0 : createdBy.name}/>

                    <div className="flex flex-col gap-1 max-w-[80%] ">
                      <div className="flex flex-col gap-1">
                        {!isUser && (<span className="text-xs opacity-70">
                            {createdBy === null || createdBy === void 0 ? void 0 : createdBy.name}
                          </span>)}
                        <div className={(0, react_1.cn)("rounded-2xl p-3 w-full flex flex-col gap-1", isUser ? "bg-blue-500 text-white" : "bg-muted")}>
                          <p className="text-sm">{m.note}</p>

                          <span className="text-xs opacity-70">
                            {new Date(m.createdAt).toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit"
                })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>);
        }))}
            <div ref={messagesEndRef} style={{ height: 0 }}/>
          </div>
        </react_1.Loading>
      </react_1.ScrollArea>

      <div>
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <react_1.Input className="flex-1" placeholder={t(templateObject_72 || (templateObject_72 = __makeTemplateObject(["Type a message..."], ["Type a message..."])))} name="message" value={message} onChange={function (e) { return setMessage(e.target.value); }}/>
          <react_1.Button className="h-10" aria-label={t(templateObject_73 || (templateObject_73 = __makeTemplateObject(["Send"], ["Send"])))} type="submit" leftIcon={<lu_1.LuSend />}>
            Send
          </react_1.Button>
        </form>
      </div>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45, templateObject_46, templateObject_47, templateObject_48, templateObject_49, templateObject_50, templateObject_51, templateObject_52, templateObject_53, templateObject_54, templateObject_55, templateObject_56, templateObject_57, templateObject_58, templateObject_59, templateObject_60, templateObject_61, templateObject_62, templateObject_63, templateObject_64, templateObject_65, templateObject_66, templateObject_67, templateObject_68, templateObject_69, templateObject_70, templateObject_71, templateObject_72, templateObject_73;
