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
exports.MethodOperationTags = MethodOperationTags;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var styleMethod_service_1 = require("~/modules/items/styleMethod.service");
var productionLabels_1 = require("~/modules/production/productionLabels");
var framer_motion_1 = require("framer-motion");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var components_1 = require("~/components");
var ConfigurationEditor_1 = require("~/components/Configurator/ConfigurationEditor");
var Form_1 = require("~/components/Form");
var SupplierProcess_1 = require("~/components/Form/SupplierProcess");
var UnitHint_1 = require("~/components/Form/UnitHint");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var Icons_1 = require("~/components/Icons");
var Modals_1 = require("~/components/Modals");
var SortableList_1 = require("~/components/SortableList");
var hooks_1 = require("~/hooks");
var useTags_1 = require("~/hooks/useTags");
var operationType_1 = require("~/modules/production/operationType");
var OutsideOperationBadge_1 = require("~/modules/production/ui/OutsideOperationBadge");
var operationBop_1 = require("~/modules/production/ui/operationBop");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var initialOperation = {
    description: "",
    laborTime: 0,
    laborUnit: "Minutes/Piece",
    machineTime: 0,
    machineUnit: "Minutes/Piece",
    operationOrder: "After Previous",
    operationType: "Inside",
    processId: "",
    procedureId: "",
    setupTime: 0,
    setupUnit: "Total Minutes",
    tags: [],
    workCenterId: "",
    workInstruction: {},
    operationMinimumCost: 0,
    operationLeadTime: 0,
    operationUnitCost: 0
};
var BillOfProcess = function (_a) {
    var _b;
    var methodBindings = _a.methodBindings, _c = _a.configurable, configurable = _c === void 0 ? false : _c, configurationRules = _a.configurationRules, makeMethod = _a.makeMethod, materials = _a.materials, initialOperations = _a.operations, parameters = _a.parameters, tags = _a.tags, configurationRuleBindings = _a.configurationRuleBindings;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var styleProcessLabel = (0, productionLabels_1.useStyleProcessLabel)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var materialId = searchParams.get("materialId");
    var isReadOnly = permissions.can("update", "parts") === false ||
        makeMethod.status !== "Draft";
    var makeMethodId = makeMethod.id;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var deleteOperationFetcher = (0, react_router_1.useFetcher)();
    var userId = (0, hooks_1.useUser)().id;
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
    var addOperationButtonRef = (0, react_2.useRef)(null);
    var _d = (0, react_2.useState)(null), selectedItemId = _d[0], setSelectedItemId = _d[1];
    var _e = (0, react_2.useState)({}), temporaryItems = _e[0], setTemporaryItems = _e[1];
    var _f = (0, react_2.useState)(function () {
        return initialOperations.reduce(function (acc, operation) {
            if (operation.workInstruction) {
                acc[operation.id] = operation.workInstruction;
            }
            return acc;
        }, {});
    }), workInstructions = _f[0], setWorkInstructions = _f[1];
    var _g = (0, react_2.useState)({}), checkedState = _g[0], setCheckedState = _g[1];
    var _h = (0, react_2.useState)(function () {
        return initialOperations.reduce(function (acc, op) {
            acc[op.id] = op.order;
            return acc;
        }, {});
    }), orderState = _h[0], setOrderState = _h[1];
    // If the server rejects a reorder (e.g. a system-owned Style cutting operation
    // must stay first), roll the optimistic order back to the persisted order.
    (0, react_2.useEffect)(function () {
        var _a;
        if (sortOrderFetcher.state === "idle" &&
            ((_a = sortOrderFetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false) {
            setOrderState(initialOperations.reduce(function (acc, op) {
                if (op.id)
                    acc[op.id] = op.order;
                return acc;
            }, {}));
        }
    }, [sortOrderFetcher.state, sortOrderFetcher.data, initialOperations]);
    var operationsById = new Map();
    // Add initial operations to map
    initialOperations.forEach(function (operation) {
        if (!operation.id)
            return;
        operationsById.set(operation.id, operation);
    });
    var pendingOperations = usePendingOperations(methodBindings);
    // Replace existing operations with pending ones
    pendingOperations.forEach(function (pendingOperation) {
        var _a;
        if (!pendingOperation.id) {
            operationsById.set("temporary", __assign(__assign({}, pendingOperation), { workInstruction: {}, methodOperationTool: [], tags: [] }));
            return;
        }
        // Remove existing operation if it exists
        operationsById.delete(pendingOperation.id);
        // Add pending operation
        operationsById.set(pendingOperation.id, __assign(__assign({}, pendingOperation), { workInstruction: workInstructions[pendingOperation.id] || null, order: (_a = orderState[pendingOperation.id]) !== null && _a !== void 0 ? _a : pendingOperation.order, methodOperationTool: [], tags: [] }));
    });
    // Add temporary items to operations
    Object.entries(temporaryItems).forEach(function (_a) {
        var id = _a[0], operation = _a[1];
        if (!operationsById.has(id)) {
            operationsById.set(id, __assign(__assign({}, operation), { methodOperationTool: [] }));
        }
    });
    var operations = Array.from(operationsById.values()).sort(function (a, b) { var _a, _b; return ((_a = orderState[a.id]) !== null && _a !== void 0 ? _a : a.order) - ((_b = orderState[b.id]) !== null && _b !== void 0 ? _b : b.order); });
    var items = makeItems(operations, tags, styleProcessLabel).map(function (item) {
        var _a;
        return (__assign(__assign({}, item), { checked: (_a = checkedState[item.id]) !== null && _a !== void 0 ? _a : false }));
    });
    var onUpdateWorkInstruction = (0, react_1.useDebounce)(function (id, content) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!temporaryItems[id]) return [3 /*break*/, 2];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("methodOperation").update({
                            workInstruction: content,
                            updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            updatedBy: userId
                        }).eq("id", id))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, 1000, true);
    var onUploadImage = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/parts/").concat(selectedItemId, "/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file, {
                            upsert: true,
                            cacheControl: "3600"
                        }))];
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
    var onToggleItem = function (id) {
        if (isReadOnly)
            return;
        setCheckedState(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[id] = !prev[id], _a)));
        });
    };
    var onReorder = function (items) {
        if (isReadOnly)
            return;
        // Create new order state
        var newOrderState = items.reduce(function (acc, item, index) {
            acc[item.id] = index + 1;
            return acc;
        }, {});
        // Update order state immediately
        setOrderState(newOrderState);
        // Only send saved items to the server (exclude temporary items)
        var updates = Object.entries(newOrderState).reduce(function (acc, _a) {
            var id = _a[0], order = _a[1];
            if (!temporaryItems[id]) {
                acc[id] = order;
            }
            return acc;
        }, {});
        updateSortOrder(updates);
    };
    var updateSortOrder = (0, react_1.useThrottle)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        sortOrderFetcher.submit(formData, {
            method: "post",
            action: methodBindings.urls.methodOperationsOrder
        });
    }, 1000, true);
    var onAddItem = function () {
        var operationId = (0, nanoid_1.nanoid)();
        var newOrder = 1;
        if (operations.length) {
            newOrder = Math.max.apply(Math, operations.map(function (op) { return op.order; })) + 1;
        }
        var newOperation = __assign(__assign({}, initialOperation), { id: operationId, order: newOrder, makeMethodId: makeMethodId });
        setTemporaryItems(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[operationId] = newOperation, _a)));
        });
        setSelectedItemId(operationId);
    };
    var onRemoveItem = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var operation;
        return __generator(this, function (_a) {
            if (isReadOnly)
                return [2 /*return*/];
            operation = operationsById.get(id);
            if (!operation)
                return [2 /*return*/];
            // Check if this is a temporary item (exists in temporaryItems state)
            if (temporaryItems[id]) {
                setTemporaryItems(function (prev) {
                    var _a = prev, _b = id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                    return rest;
                });
            }
            else {
                deleteOperationFetcher.submit({ id: id }, {
                    method: "post",
                    action: methodBindings.urls.methodOperationsDelete
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
    var companyId = (0, hooks_1.useUser)().company.id;
    var _j = (0, react_2.useState)(1), tabChangeRerender = _j[0], setTabChangeRerender = _j[1];
    var renderListItem = function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var item = _a.item, items = _a.items, order = _a.order, onToggleItem = _a.onToggleItem, onRemoveItem = _a.onRemoveItem;
        var isOpen = item.id === selectedItemId;
        var tools = (_c = (_b = initialOperations.find(function (o) { return o.id === item.id; })) === null || _b === void 0 ? void 0 : _b.methodOperationTool) !== null && _c !== void 0 ? _c : [];
        var parameters = (_e = (_d = initialOperations.find(function (o) { return o.id === item.id; })) === null || _d === void 0 ? void 0 : _d.methodOperationParameter) !== null && _e !== void 0 ? _e : [];
        var steps = (_g = (_f = initialOperations.find(function (o) { return o.id === item.id; })) === null || _f === void 0 ? void 0 : _f.methodOperationStep) !== null && _g !== void 0 ? _g : [];
        var hasProcedure = !!item.data.procedureId;
        var tabs = [
            {
                id: 0,
                label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Details"], ["Details"]))),
                content: (<div className="flex w-full flex-col pr-2 py-2">
            <framer_motion_1.motion.div initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.75,
                        delay: 0.15
                    }}>
              <OperationForm methodBindings={methodBindings} isReadOnly={isReadOnly} configurable={configurable} item={item} rulesByField={rulesByField} workInstruction={(_h = workInstructions[item.id]) !== null && _h !== void 0 ? _h : {}} temporaryItems={temporaryItems} onConfigure={onConfigure} setSelectedItemId={setSelectedItemId} setTemporaryItems={setTemporaryItems} setWorkInstructions={setWorkInstructions} onSubmit={function () {
                        var _a;
                        setSelectedItemId(null);
                        (_a = addOperationButtonRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center"
                        });
                    }}/>
            </framer_motion_1.motion.div>
          </div>)
            },
            {
                id: 1,
                label: (<span className="flex items-center gap-2">
            Instructions
            {hasProcedure && (<react_1.Tooltip>
                <react_1.TooltipTrigger>
                  <react_1.Badge variant="secondary">
                    <lu_1.LuListChecks />
                  </react_1.Badge>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent side="bottom" className="opacity-100">
                  <p>
                    <macro_1.Trans>
                      Instructions are inherited from the procedure.
                    </macro_1.Trans>
                  </p>
                </react_1.TooltipContent>
              </react_1.Tooltip>)}
          </span>),
                disabled: item.id in temporaryItems ||
                    hasProcedure ||
                    (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                content: (<div className="flex flex-col">
            <div>
              {!isReadOnly ? (<Editor_1.Editor initialValue={(_j = workInstructions[item.id]) !== null && _j !== void 0 ? _j : {}} onUpload={onUploadImage} onChange={function (content) {
                            if (isReadOnly)
                                return;
                            setWorkInstructions(function (prev) {
                                var _a;
                                return (__assign(__assign({}, prev), (_a = {}, _a[item.id] = content, _a)));
                            });
                            onUpdateWorkInstruction(item.id, content);
                        }} mentions={[{ char: "@", items: itemMentions }]} className="py-8"/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                            __html: (0, react_1.generateHTML)((_k = item.data.workInstruction) !== null && _k !== void 0 ? _k : {})
                        }}/>)}
            </div>
          </div>)
            },
            {
                id: 2,
                disabled: item.id in temporaryItems ||
                    hasProcedure ||
                    (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>Parameters</span>
            {hasProcedure && (<react_1.Tooltip>
                <react_1.TooltipTrigger>
                  <react_1.Badge variant="secondary">
                    <lu_1.LuListChecks />
                  </react_1.Badge>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent side="bottom" className="opacity-100">
                  <p>
                    <macro_1.Trans>Parameters are inherited from the procedure.</macro_1.Trans>
                  </p>
                </react_1.TooltipContent>
              </react_1.Tooltip>)}
            {!hasProcedure && parameters.length > 0 && (<react_1.Count count={parameters.length}/>)}
          </span>),
                content: (<div className="flex w-full flex-col py-4">
            <ParametersForm methodBindings={methodBindings} parameters={parameters} operationId={item.id} temporaryItems={temporaryItems} isDisabled={isReadOnly ||
                        selectedItemId === null ||
                        (selectedItemId !== null && !!temporaryItems[selectedItemId])} configurable={configurable} rulesByField={rulesByField} onConfigure={onConfigure}/>
          </div>)
            },
            {
                id: 3,
                disabled: item.id in temporaryItems ||
                    hasProcedure ||
                    (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>Steps</span>
            {hasProcedure && (<react_1.Tooltip>
                <react_1.TooltipTrigger>
                  <react_1.Badge variant="secondary">
                    <lu_1.LuListChecks />
                  </react_1.Badge>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent side="bottom" className="opacity-100">
                  <p>
                    <macro_1.Trans>Attributes are inherited from the procedure.</macro_1.Trans>
                  </p>
                </react_1.TooltipContent>
              </react_1.Tooltip>)}
            {!hasProcedure && steps.length > 0 && (<react_1.Count count={steps.length}/>)}
          </span>),
                content: (<div className="flex w-full flex-col py-4">
            <AttributesForm methodBindings={methodBindings} steps={steps} operationId={item.id} temporaryItems={temporaryItems} isDisabled={isReadOnly ||
                        selectedItemId === null ||
                        (selectedItemId !== null && !!temporaryItems[selectedItemId])} configurable={configurable} rulesByField={rulesByField} onConfigure={onConfigure} itemMentions={itemMentions}/>
          </div>)
            },
            {
                id: 4,
                disabled: item.id in temporaryItems ||
                    (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>Tools</span>
            {tools.length > 0 && <react_1.Count count={tools.length}/>}
          </span>),
                content: (<div className="flex w-full flex-col py-4">
            <ToolsForm methodBindings={methodBindings} tools={tools} operationId={item.id} temporaryItems={temporaryItems} isDisabled={isReadOnly ||
                        selectedItemId === null ||
                        (selectedItemId !== null && !!temporaryItems[selectedItemId])}/>
          </div>)
            }
        ];
        return (<SortableList_1.SortableListItem isReadOnly={isReadOnly} item={item} items={items} order={order} key={item.id} isExpanded={isOpen} onSelectItem={setSelectedItemId} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} handleDrag={function () { return setSelectedItemId(null); }} dragHandle className="my-2" renderHeaderAction={function () { return (<button type="button" aria-label={isOpen ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Close operation"], ["Close operation"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Edit operation"], ["Edit operation"])))} onClick={isOpen
                    ? function () {
                        setSelectedItemId(null);
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
                    <components_1.DirectionAwareTabs className="mr-auto" tabs={tabs} onChange={function () {
                        return setTabChangeRerender(tabChangeRerender + 1);
                    }}/>
                  </framer_motion_1.motion.div>
                </div>
              </div>
            </framer_motion_1.LayoutGroup>) : null;
            }}/>);
    };
    var configuratorDisclosure = (0, react_1.useDisclosure)();
    var _k = (0, react_2.useState)(null), configuration = _k[0], setConfiguration = _k[1];
    var onConfigure = function (c) {
        (0, react_dom_1.flushSync)(function () {
            setConfiguration(c);
        });
        configuratorDisclosure.onOpen();
    };
    var rulesByField = new Map((_b = configurationRules === null || configurationRules === void 0 ? void 0 : configurationRules.map(function (rule) { return [rule.field, rule]; })) !== null && _b !== void 0 ? _b : []);
    return (<react_1.Card>
      <react_1.HStack className="justify-between">
        <react_1.CardHeader>
          <react_1.CardTitle className="flex flex-row items-center gap-2">
            <macro_1.Trans>Bill of Process</macro_1.Trans> {isReadOnly && <lu_1.LuLock />}
          </react_1.CardTitle>
        </react_1.CardHeader>

        <react_1.CardAction>
          <div className="flex items-center gap-2">
            <react_1.Button ref={addOperationButtonRef} variant="secondary" isDisabled={isReadOnly || selectedItemId !== null} onClick={onAddItem}>
              <macro_1.Trans>Add Operation</macro_1.Trans>
            </react_1.Button>
            {configurable && operations.length > 0 && (<react_1.IconButton icon={<lu_1.LuSquareFunction />} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Configure"], ["Configure"])))} variant="ghost" className={(0, react_1.cn)(rulesByField.has("billOfProcess:".concat(makeMethodId, ":").concat(materialId)) && "text-emerald-500 hover:text-emerald-500")} onClick={function () {
                var _a;
                return onConfigure({
                    label: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Bill of Process"], ["Bill of Process"]))),
                    field: "billOfProcess:".concat(makeMethodId, ":").concat(materialId),
                    code: (_a = rulesByField.get("billOfProcess:".concat(makeMethodId, ":").concat(materialId))) === null || _a === void 0 ? void 0 : _a.code,
                    returnType: {
                        type: "list",
                        listOptions: operations.map(function (op) { return op.description; })
                    }
                });
            }}/>)}
          </div>
        </react_1.CardAction>
      </react_1.HStack>
      <react_1.CardContent>
        <SortableList_1.SortableList isReadOnly={isReadOnly} items={items} onReorder={onReorder} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} renderItem={renderListItem}/>
      </react_1.CardContent>
      {configuratorDisclosure.isOpen && configuration && (<ConfigurationEditor_1.ConfigurationEditor configuration={configuration} open={configuratorDisclosure.isOpen} 
        // @ts-ignore
        parameters={parameters !== null && parameters !== void 0 ? parameters : []} onClose={configuratorDisclosure.onClose} configurationRuleBindings={configurationRuleBindings}/>)}
    </react_1.Card>);
};
exports.default = BillOfProcess;
function OperationForm(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var methodBindings = _a.methodBindings, isReadOnly = _a.isReadOnly, configurable = _a.configurable, item = _a.item, rulesByField = _a.rulesByField, workInstruction = _a.workInstruction, temporaryItems = _a.temporaryItems, onConfigure = _a.onConfigure, setSelectedItemId = _a.setSelectedItemId, setWorkInstructions = _a.setWorkInstructions, setTemporaryItems = _a.setTemporaryItems, onSubmit = _a.onSubmit;
    var t = (0, macro_1.useLingui)().t;
    var operationOrderOptions = (0, react_2.useMemo)(function () { return [
        { value: "After Previous", label: <macro_1.Trans>After Previous</macro_1.Trans> },
        { value: "With Previous", label: <macro_1.Trans>With Previous</macro_1.Trans> }
    ]; }, []);
    var operationTypeOptions = (0, operationBop_1.useOperationTypeSelectOptions)();
    var methodOperationFetcher = (0, react_router_1.useFetcher)();
    var company = (0, hooks_1.useUser)().company;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    (0, react_2.useEffect)(function () {
        // Remove from temporary items after successful submission
        if (methodOperationFetcher.data && methodOperationFetcher.data.id) {
            // Clear temporary item after successful save
            setTemporaryItems(function (prev) {
                var _a = prev, _b = item.id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return rest;
            });
            if (methodOperationFetcher.data.success) {
                react_1.toast.success(methodOperationFetcher.data.message);
            }
            onSubmit();
        }
    }, [item.id, methodOperationFetcher.data, setTemporaryItems, onSubmit]);
    var _u = (0, react_2.useState)({
        description: (_c = item.data.description) !== null && _c !== void 0 ? _c : "",
        laborTime: (_d = item.data.laborTime) !== null && _d !== void 0 ? _d : 0,
        laborUnit: (_e = item.data.laborUnit) !== null && _e !== void 0 ? _e : "Hours/Piece",
        laborUnitHint: (0, UnitHint_1.getUnitHint)(item.data.laborUnit),
        machineTime: (_f = item.data.machineTime) !== null && _f !== void 0 ? _f : 0,
        machineUnit: (_g = item.data.machineUnit) !== null && _g !== void 0 ? _g : "Hours/Piece",
        machineUnitHint: (0, UnitHint_1.getUnitHint)(item.data.machineUnit),
        operationOrder: (_h = item.data.operationOrder) !== null && _h !== void 0 ? _h : "After Previous",
        operationType: (_j = item.data.operationType) !== null && _j !== void 0 ? _j : "Inside",
        processId: (_k = item.data.processId) !== null && _k !== void 0 ? _k : "",
        procedureId: (_l = item.data.procedureId) !== null && _l !== void 0 ? _l : "",
        workCenterId: (_m = item.data.workCenterId) !== null && _m !== void 0 ? _m : "",
        setupTime: (_o = item.data.setupTime) !== null && _o !== void 0 ? _o : 0,
        setupUnit: (_p = item.data.setupUnit) !== null && _p !== void 0 ? _p : "Total Minutes",
        setupUnitHint: (0, UnitHint_1.getUnitHint)(item.data.setupUnit),
        operationMinimumCost: (_q = item.data.operationMinimumCost) !== null && _q !== void 0 ? _q : 0,
        operationLeadTime: (_r = item.data.operationLeadTime) !== null && _r !== void 0 ? _r : 0,
        operationUnitCost: (_s = item.data.operationUnitCost) !== null && _s !== void 0 ? _s : 0,
        insideUnitCost: (_t = item.data.insideUnitCost) !== null && _t !== void 0 ? _t : 0
    }), processData = _u[0], setProcessData = _u[1];
    var onProcessChange = function (processId) { return __awaiter(_this, void 0, void 0, function () {
        var _a, process, supplierProcesses, operationType, useSupplierRouting;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!carbon || !processId)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon.from("process").select("*").eq("id", processId).single(),
                            carbon.from("supplierProcess").select("*").eq("processId", processId)
                        ])];
                case 1:
                    _a = _c.sent(), process = _a[0], supplierProcesses = _a[1];
                    if (process.error)
                        throw new Error(process.error.message);
                    operationType = (0, operationType_1.defaultOperationTypeFromProcess)((_b = process.data) === null || _b === void 0 ? void 0 : _b.processType);
                    useSupplierRouting = (0, operationType_1.showsSupplierRoutingFields)(operationType);
                    setProcessData(function (p) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        return (__assign(__assign({}, p), { processId: processId, procedureId: "", description: (_b = (_a = process.data) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", laborUnit: (_d = (_c = process.data) === null || _c === void 0 ? void 0 : _c.defaultStandardFactor) !== null && _d !== void 0 ? _d : "Hours/Piece", laborUnitHint: (0, UnitHint_1.getUnitHint)((_e = process.data) === null || _e === void 0 ? void 0 : _e.defaultStandardFactor), machineUnit: (_g = (_f = process.data) === null || _f === void 0 ? void 0 : _f.defaultStandardFactor) !== null && _g !== void 0 ? _g : "Hours/Piece", machineUnitHint: (0, UnitHint_1.getUnitHint)((_h = process.data) === null || _h === void 0 ? void 0 : _h.defaultStandardFactor), operationType: operationType, operationMinimumCost: useSupplierRouting &&
                                supplierProcesses.data &&
                                supplierProcesses.data.length > 0
                                ? supplierProcesses.data.reduce(function (acc, sp) {
                                    var _a;
                                    return (acc += (_a = sp.minimumCost) !== null && _a !== void 0 ? _a : 0);
                                }, 0) / supplierProcesses.data.length
                                : p.operationMinimumCost, operationUnitCost: useSupplierRouting &&
                                supplierProcesses.data &&
                                supplierProcesses.data.length > 0
                                ? supplierProcesses.data.reduce(function (acc, sp) {
                                    var _a;
                                    return (acc += (_a = sp.unitCost) !== null && _a !== void 0 ? _a : 0);
                                }, 0) / supplierProcesses.data.length
                                : p.operationUnitCost, operationLeadTime: useSupplierRouting &&
                                supplierProcesses.data &&
                                supplierProcesses.data.length > 0
                                ? supplierProcesses.data.reduce(function (acc, sp) {
                                    var _a;
                                    return (acc += (_a = sp.leadTime) !== null && _a !== void 0 ? _a : 0);
                                }, 0) / supplierProcesses.data.length
                                : p.operationLeadTime }));
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
                    if (!carbon || !workCenterId)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("workCenter")
                            .select("*")
                            .eq("id", workCenterId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error.message);
                    setProcessData(function (p) {
                        var _a, _b;
                        return (__assign(__assign({}, p), { workCenterId: workCenterId, laborUnit: (_a = data === null || data === void 0 ? void 0 : data.defaultStandardFactor) !== null && _a !== void 0 ? _a : "Hours/Piece", laborUnitHint: (0, UnitHint_1.getUnitHint)(data === null || data === void 0 ? void 0 : data.defaultStandardFactor), machineUnit: (_b = data === null || data === void 0 ? void 0 : data.defaultStandardFactor) !== null && _b !== void 0 ? _b : "Hours/Piece", machineUnitHint: (0, UnitHint_1.getUnitHint)(data === null || data === void 0 ? void 0 : data.defaultStandardFactor) }));
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var key = function (field) { return getFieldKey(field, item.id); };
    return (<form_1.ValidatedForm action={temporaryItems[item.id]
            ? methodBindings.urls.newMethodOperation
            : methodBindings.urls.methodOperation(item.id)} method="post" defaultValues={item.data} validator={items_models_1.methodOperationValidator} className="w-full flex flex-col gap-y-4" fetcher={methodOperationFetcher}>
      <div>
        <Form_1.Hidden name="id"/>
        <Form_1.Hidden name="makeMethodId"/>
        <Form_1.Hidden name="order"/>
      </div>

      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
        <Form_1.Process name="processId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Process"], ["Process"])))} isConfigured={rulesByField.has(key("processId"))} onConfigure={configurable && !temporaryItems[item.id]
            ? function () {
                var _a;
                onConfigure({
                    label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Process"], ["Process"]))),
                    field: key("processId"),
                    code: (_a = rulesByField.get(key("processId"))) === null || _a === void 0 ? void 0 : _a.code,
                    defaultValue: processData.processId,
                    returnType: {
                        type: "text",
                        helperText: "the unique identifier for the process. you can get this from the URL when editing a process"
                    }
                });
            }
            : undefined} onChange={function (value) {
            onProcessChange(value === null || value === void 0 ? void 0 : value.value);
        }}/>

        <Form_1.Select name="operationOrder" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Operation Order"], ["Operation Order"])))} placeholder={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Operation Order"], ["Operation Order"])))} options={operationOrderOptions} onChange={function (value) {
            setProcessData(function (d) { return (__assign(__assign({}, d), { operationOrder: value === null || value === void 0 ? void 0 : value.value })); });
        }} isConfigured={rulesByField.has(key("operationOrder"))} onConfigure={configurable && !temporaryItems[item.id]
            ? function () {
                var _a;
                onConfigure({
                    label: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Operation Order"], ["Operation Order"]))),
                    field: key("operationOrder"),
                    code: (_a = rulesByField.get(key("operationOrder"))) === null || _a === void 0 ? void 0 : _a.code,
                    defaultValue: processData.operationOrder,
                    returnType: {
                        type: "enum",
                        listOptions: ["After Previous", "With Previous"]
                    }
                });
            }
            : undefined}/>

        <Form_1.SelectControlled name="operationType" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Operation Type"], ["Operation Type"])))} placeholder={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Operation Type"], ["Operation Type"])))} options={operationTypeOptions} value={processData.operationType} onChange={function (value) {
            var operationType = value === null || value === void 0 ? void 0 : value.value;
            var useSupplierRouting = (0, operationType_1.showsSupplierRoutingFields)(operationType);
            setProcessData(function (d) { return (__assign(__assign(__assign({}, d), { setupUnit: "Total Minutes", laborUnit: "Minutes/Piece", machineUnit: "Minutes/Piece", operationType: operationType }), (useSupplierRouting
                ? {}
                : {
                    operationMinimumCost: 0,
                    operationUnitCost: 0,
                    operationLeadTime: 0
                }))); });
        }} isConfigured={rulesByField.has(key("operationType"))} onConfigure={configurable && !temporaryItems[item.id]
            ? function () {
                var _a;
                onConfigure({
                    label: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Operation Type"], ["Operation Type"]))),
                    field: key("operationType"),
                    code: (_a = rulesByField.get(key("operationType"))) === null || _a === void 0 ? void 0 : _a.code,
                    defaultValue: processData.operationType,
                    returnType: {
                        type: "enum",
                        listOptions: __spreadArray([], operationBop_1.operationTypeConfigureListOptions, true)
                    }
                });
            }
            : undefined}/>

        <Form_1.InputControlled name="description" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Description"], ["Description"])))} value={processData.description} onChange={function (newValue) {
            setProcessData(function (d) { return (__assign(__assign({}, d), { description: newValue })); });
        }} className="col-span-2" isConfigured={rulesByField.has(key("description"))} onConfigure={configurable && !temporaryItems[item.id]
            ? function () {
                var _a;
                onConfigure({
                    label: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Description"], ["Description"]))),
                    field: key("description"),
                    code: (_a = rulesByField.get(key("description"))) === null || _a === void 0 ? void 0 : _a.code,
                    defaultValue: processData.description,
                    returnType: {
                        type: "text"
                    }
                });
            }
            : undefined}/>

        {(0, operationType_1.isInsideOperationType)(processData.operationType) ? (<>
            <Form_1.WorkCenter name="workCenterId" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Work Center"], ["Work Center"])))} isOptional processId={processData.processId} isConfigured={rulesByField.has(key("workCenterId"))} onConfigure={configurable && !temporaryItems[item.id]
                ? function () {
                    var _a;
                    onConfigure({
                        label: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Work Center"], ["Work Center"]))),
                        field: key("workCenterId"),
                        code: (_a = rulesByField.get(key("workCenterId"))) === null || _a === void 0 ? void 0 : _a.code,
                        defaultValue: processData.workCenterId,
                        returnType: {
                            type: "text",
                            helperText: "the unique identifier for the work center. you can get this from the URL when editing a work center"
                        }
                    });
                }
                : undefined} onChange={function (value) {
                if (value) {
                    onWorkCenterChange(value === null || value === void 0 ? void 0 : value.value);
                }
            }}/>
            <Form_1.NumberControlled name="insideUnitCost" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Unit rate"], ["Unit rate"])))} minValue={0} value={processData.insideUnitCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { insideUnitCost: newValue !== null && newValue !== void 0 ? newValue : 0 })); });
            }} isConfigured={rulesByField.has(key("insideUnitCost"))} onConfigure={configurable && !temporaryItems[item.id]
                ? function () {
                    var _a;
                    onConfigure({
                        label: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Unit rate"], ["Unit rate"]))),
                        field: key("insideUnitCost"),
                        code: (_a = rulesByField.get(key("insideUnitCost"))) === null || _a === void 0 ? void 0 : _a.code,
                        defaultValue: processData.insideUnitCost,
                        returnType: {
                            type: "numeric"
                        }
                    });
                }
                : undefined}/>
          </>) : null}
        {(0, operationType_1.showsSupplierRoutingFields)(processData.operationType) ? (<>
            <Form_1.SupplierProcess name="operationSupplierProcessId" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Supplier"], ["Supplier"])))} processId={processData.processId} isOptional={false}/>
            <Form_1.NumberControlled name="operationMinimumCost" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Minimum Cost"], ["Minimum Cost"])))} isOptional={false} minValue={0} value={processData.operationMinimumCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationMinimumCost: newValue })); });
            }}/>
            <Form_1.NumberControlled name="operationUnitCost" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} isOptional={false} minValue={0} value={processData.operationUnitCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationUnitCost: newValue })); });
            }}/>
            <Form_1.NumberControlled name="operationLeadTime" label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Lead Time"], ["Lead Time"])))} isOptional={false} minValue={0} value={processData.operationLeadTime} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationLeadTime: newValue })); });
            }}/>
          </>) : (<>
            <Form_1.Hidden name="operationSupplierProcessId" value=""/>
            <Form_1.Hidden name="operationMinimumCost" value={0}/>
            <Form_1.Hidden name="operationUnitCost" value={0}/>
            <Form_1.Hidden name="operationLeadTime" value={0}/>
          </>)}
      </div>

      {(0, operationType_1.isInsideOperationType)(processData.operationType) ? (<operationBop_1.MethodOperationInsideDetailTabs processData={processData} setProcessData={setProcessData} fieldKey={key} configurable={configurable} isTemporary={Boolean(temporaryItems[item.id])} rulesByField={rulesByField} onConfigure={onConfigure}/>) : null}
      <framer_motion_1.motion.div className="flex w-full items-center justify-end p-2" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
            type: "spring",
            bounce: 0,
            duration: 0.55
        }}>
        <framer_motion_1.motion.div layout className="ml-auto mr-1 pt-2">
          <Form_1.Submit isDisabled={isReadOnly || methodOperationFetcher.state !== "idle"} isLoading={methodOperationFetcher.state === "submitting"}>
            Save
          </Form_1.Submit>
        </framer_motion_1.motion.div>
      </framer_motion_1.motion.div>
    </form_1.ValidatedForm>);
}
function AttributesForm(_a) {
    var _this = this;
    var methodBindings = _a.methodBindings, operationId = _a.operationId, configurable = _a.configurable, isDisabled = _a.isDisabled, steps = _a.steps, temporaryItems = _a.temporaryItems, rulesByField = _a.rulesByField, onConfigure = _a.onConfigure, itemMentions = _a.itemMentions;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)("Task"), type = _b[0], setType = _b[1];
    var _c = (0, react_2.useState)({}), description = _c[0], setDescription = _c[1];
    var _d = (0, react_2.useState)([]), numericControls = _d[0], setNumericControls = _d[1];
    // Initialize sort order state based on existing steps
    var _e = (0, react_2.useState)(function () {
        return __spreadArray([], steps, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); })
            .map(function (step) { return step.id || ""; });
    }), sortOrder = _e[0], setSortOrder = _e[1];
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
            action: methodBindings.urls.methodOperationStepOrder(operationId)
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
                        react_1.toast.error(t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
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
      {!isDisabled && (<div className="p-6 border bg-card rounded-lg mb-6">
          <form_1.ValidatedForm action={methodBindings.urls.newMethodOperationStep} method="post" validator={shared_1.operationStepValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
                id: undefined,
                name: "",
                description: {},
                type: "Task",
                unitOfMeasureCode: "",
                minValue: 0,
                maxValue: 0,
                listValues: [],
                sortOrder: steps.reduce(function (acc, a) { var _a; return Math.max(acc, (_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0) +
                    1,
                operationId: operationId
            }} onSubmit={function () {
                setType("Task");
                setDescription({});
            }} className="w-full">
            <Form_1.Hidden name="operationId"/>
            <Form_1.Hidden name="sortOrder"/>
            <Form_1.Hidden name="description" value={JSON.stringify(description)}/>
            <react_1.VStack spacing={4}>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <Form_1.SelectControlled name="type" label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Type"], ["Type"])))} options={typeOptions} value={type} onChange={function (option) {
                if (option) {
                    setType(option.value);
                }
            }}/>
                <form_1.Input name="name" label={t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Name"], ["Name"])))}/>
              </div>

              <react_1.VStack spacing={2} className="w-full col-span-2">
                <react_1.Label>Description</react_1.Label>
                <Editor_1.Editor initialValue={description} onUpload={onUploadImage} onChange={function (value) {
                setDescription(value);
            }} mentions={[{ char: "@", items: itemMentions }]} className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"/>
              </react_1.VStack>

              {type === "Measurement" && (<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  <Form_1.UnitOfMeasure name="unitOfMeasureCode" label={t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>

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

                  {numericControls.includes("min") && (<Form_1.Number name="minValue" label={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Minimum"], ["Minimum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }}/>)}
                  {numericControls.includes("max") && (<Form_1.Number name="maxValue" label={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Maximum"], ["Maximum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }}/>)}
                </div>)}
              {type === "List" && (<Form_1.Array name="listValues" label={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}

              <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                Save Step
              </Form_1.Submit>
            </react_1.VStack>
          </form_1.ValidatedForm>
        </div>)}

      {steps.length > 0 && (<div className="border bg-card rounded-lg">
          <framer_motion_1.Reorder.Group axis="y" values={sortOrder} onReorder={onReorder} className="w-full">
            {sortOrder.map(function (stepId) {
                var step = steps.find(function (s) { return s.id === stepId; });
                if (!step)
                    return null;
                var index = sortOrder.indexOf(stepId);
                return (<DraggableStepItem key={stepId} stepId={stepId} isDisabled={isDisabled}>
                  {function (dragControls) { return (<AttributesListItem methodBindings={methodBindings} attribute={step} operationId={operationId} typeOptions={typeOptions} isDisabled={isDisabled} dragControls={dragControls} className={index === sortOrder.length - 1 ? "border-none" : ""} configurable={configurable} rulesByField={rulesByField} onConfigure={onConfigure} itemMentions={itemMentions}/>); }}
                </DraggableStepItem>);
            })}
          </framer_motion_1.Reorder.Group>
        </div>)}
      {steps.length === 0 && isDisabled && (<div className="flex flex-1 py-24 justify-between items-center w-full">
          <components_1.Empty />
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
function AttributesListItem(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var methodBindings = _a.methodBindings, attribute = _a.attribute, operationId = _a.operationId, typeOptions = _a.typeOptions, className = _a.className, configurable = _a.configurable, rulesByField = _a.rulesByField, onConfigure = _a.onConfigure, _f = _a.isDisabled, isDisabled = _f === void 0 ? false : _f, dragControls = _a.dragControls, itemMentions = _a.itemMentions;
    var t = (0, macro_1.useLingui)().t;
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var name = attribute.name, unitOfMeasureCode = attribute.unitOfMeasureCode, minValue = attribute.minValue, maxValue = attribute.maxValue, id = attribute.id, updatedBy = attribute.updatedBy, updatedAt = attribute.updatedAt, createdBy = attribute.createdBy, createdAt = attribute.createdAt;
    var disclosure = (0, react_1.useDisclosure)();
    var deleteModalDisclosure = (0, react_1.useDisclosure)();
    var submitted = (0, react_2.useRef)(false);
    var fetcher = (0, react_router_1.useFetcher)();
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
    var _j = (0, react_2.useState)((_b = attribute.description) !== null && _b !== void 0 ? _b : {}), description = _j[0], setDescription = _j[1];
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
                        react_1.toast.error(t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
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
    var isConfigured = configurable &&
        attribute.type === "Measurement" &&
        (rulesByField.has(getFieldKey("attribute:".concat(id, ":minValue"), operationId)) ||
            rulesByField.has(getFieldKey("attribute:".concat(id, ":maxValue"), operationId)));
    return (<div className={(0, react_1.cn)("border-b p-6", className)}>
      {disclosure.isOpen ? (<form_1.ValidatedForm action={methodBindings.urls.methodOperationStep(id)} method="post" validator={shared_1.operationStepValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
                disclosure.onClose();
            }} defaultValues={__assign(__assign({}, attribute), { operationId: operationId })} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <Form_1.Hidden name="description" value={JSON.stringify(description)}/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Form_1.SelectControlled name="type" label={t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Type"], ["Type"])))} options={typeOptions} onChange={function (option) {
                if (option) {
                    setType(option.value);
                }
            }}/>
              <form_1.Input name="name" label={t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Name"], ["Name"])))}/>
            </div>

            <react_1.VStack spacing={2} className="w-full col-span-2">
              <react_1.Label>Description</react_1.Label>
              <Editor_1.Editor initialValue={description} onUpload={onUploadImage} onChange={function (value) {
                setDescription(value);
            }} mentions={[{ char: "@", items: itemMentions }]} className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"/>
            </react_1.VStack>

            {type === "Measurement" && (<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <Form_1.UnitOfMeasure name="unitOfMeasureCode" label={t(templateObject_34 || (templateObject_34 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>

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

                {numericControls.includes("min") && (<Form_1.Number name="minValue" label={t(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Minimum"], ["Minimum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }} isConfigured={rulesByField.has(getFieldKey("attribute:".concat(id, ":minValue"), operationId))} onConfigure={configurable && typeof onConfigure === "function"
                        ? function () {
                            var _a;
                            onConfigure({
                                label: t(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Minimum"], ["Minimum"]))),
                                field: getFieldKey("attribute:".concat(id, ":minValue"), operationId),
                                code: (_a = rulesByField.get(getFieldKey("attribute:".concat(id, ":minValue"), operationId))) === null || _a === void 0 ? void 0 : _a.code,
                                defaultValue: minValue !== null && minValue !== void 0 ? minValue : 0,
                                returnType: {
                                    type: "numeric"
                                }
                            });
                        }
                        : undefined}/>)}
                {numericControls.includes("max") && (<Form_1.Number name="maxValue" label={t(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Maximum"], ["Maximum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }} isConfigured={rulesByField.has(getFieldKey("attribute:".concat(id, ":maxValue"), operationId))} onConfigure={configurable && typeof onConfigure === "function"
                        ? function () {
                            var _a;
                            onConfigure({
                                label: t(templateObject_38 || (templateObject_38 = __makeTemplateObject(["Maximum"], ["Maximum"]))),
                                field: getFieldKey("attribute:".concat(id, ":maxValue"), operationId),
                                code: (_a = rulesByField.get(getFieldKey("attribute:".concat(id, ":maxValue"), operationId))) === null || _a === void 0 ? void 0 : _a.code,
                                defaultValue: maxValue !== null && maxValue !== void 0 ? maxValue : 0,
                                returnType: {
                                    type: "numeric"
                                }
                            });
                        }
                        : undefined}/>)}
              </div>)}
            {type === "List" && (<Form_1.Array name="listValues" label={t(templateObject_39 || (templateObject_39 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                Cancel
              </react_1.Button>
              <Form_1.Submit isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                Save
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.VStack>
        </form_1.ValidatedForm>) : (<div className="flex flex-1 justify-between items-center w-full">
          <react_1.HStack spacing={4} className="w-1/2">
            <react_1.IconButton aria-label={t(templateObject_40 || (templateObject_40 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost" disabled={isDisabled} className="cursor-grab active:cursor-grabbing" onPointerDown={function (e) {
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
                Object.keys(attribute.description).length > 0 && (<react_1.Tooltip>
                        <react_1.TooltipTrigger>
                          <lu_1.LuInfo className="text-muted-foreground size-3"/>
                        </react_1.TooltipTrigger>
                        <react_1.TooltipContent side="right">
                          <p className="prose prose-sm dark:prose-invert text-foreground text-sm" dangerouslySetInnerHTML={{
                    __html: (0, react_1.generateHTML)(attribute.description)
                }}/>
                        </react_1.TooltipContent>
                      </react_1.Tooltip>)}
                </react_1.HStack>
                {attribute.type === "Measurement" && (<span className="text-xs text-muted-foreground">
                    {attribute.minValue !== null && attribute.maxValue !== null
                    ? "Must be between ".concat(attribute.minValue, " and ").concat(attribute.maxValue, " ").concat((_c = unitOfMeasures.find(function (u) { return u.value === unitOfMeasureCode; })) === null || _c === void 0 ? void 0 : _c.label)
                    : attribute.minValue !== null
                        ? "Must be > ".concat(attribute.minValue, " ").concat((_d = unitOfMeasures.find(function (u) { return u.value === unitOfMeasureCode; })) === null || _d === void 0 ? void 0 : _d.label)
                        : attribute.maxValue !== null
                            ? "Must be < ".concat(attribute.maxValue, " ").concat((_e = unitOfMeasures.find(function (u) { return u.value === unitOfMeasureCode; })) === null || _e === void 0 ? void 0 : _e.label)
                            : null}
                  </span>)}
              </react_1.VStack>
              {isConfigured && (<react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <div className="flex flex-col items-center justify-center gap-1 text-emerald-500">
                      <lu_1.LuSquareFunction aria-label={t(templateObject_41 || (templateObject_41 = __makeTemplateObject(["Configured"], ["Configured"])))} className="size-4 "/>
                      <span className="text-xxs font-mono uppercase">
                        Configured
                      </span>
                    </div>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    <p className="text-foreground text-sm">
                      This attribute is configured
                    </p>
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}
              {attribute.type === "List" &&
                Array.isArray(attribute.listValues) && (<react_1.Tooltip>
                    <react_1.TooltipTrigger>
                      <lu_1.LuList className="size-4 text-muted-foreground"/>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>
                      {attribute.listValues.map(function (value) { return (<p key={value} className="text-foreground text-sm">
                          {value}
                        </p>); })}
                    </react_1.TooltipContent>
                  </react_1.Tooltip>)}
            </react_1.HStack>
          </react_1.HStack>
          <div className="flex items-center justify-end gap-2">
            <react_1.HStack spacing={2}>
              <span className="text-xs text-muted-foreground">
                {isUpdated ? "Updated" : "Created"} {formatRelativeTime(date)}
              </span>
              <components_1.EmployeeAvatar employeeId={person} withName={false}/>
            </react_1.HStack>
            {!isDisabled && (<react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_42 || (templateObject_42 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                    Edit
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem destructive onClick={deleteModalDisclosure.onOpen}>
                    Delete
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>)}
          </div>
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={methodBindings.urls.deleteMethodOperationStep(id)} isOpen={deleteModalDisclosure.isOpen} name={name} text={"Are you sure you want to delete the ".concat(name, " attribute from this operation? This cannot be undone.")} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function ParametersForm(_a) {
    var methodBindings = _a.methodBindings, operationId = _a.operationId, configurable = _a.configurable, isDisabled = _a.isDisabled, parameters = _a.parameters, temporaryItems = _a.temporaryItems, rulesByField = _a.rulesByField, onConfigure = _a.onConfigure;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
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
      {!isDisabled && (<div className="p-6 border rounded-lg bg-card">
          <form_1.ValidatedForm action={methodBindings.urls.newMethodOperationParameter} method="post" validator={shared_1.operationParameterValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
                id: undefined,
                key: "",
                value: "",
                operationId: operationId
            }} className="w-full">
            <Form_1.Hidden name="operationId"/>
            <react_1.VStack spacing={4}>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <form_1.Input name="key" label={t(templateObject_43 || (templateObject_43 = __makeTemplateObject(["Key"], ["Key"])))} autoFocus={parameters.length === 0}/>
                <form_1.Input name="value" label={t(templateObject_44 || (templateObject_44 = __makeTemplateObject(["Value"], ["Value"])))}/>
              </div>
              <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                Add Parameter
              </Form_1.Submit>
            </react_1.VStack>
          </form_1.ValidatedForm>
        </div>)}

      {parameters.length > 0 && (<div className="border bg-card rounded-lg">
          {__spreadArray([], parameters, true).sort(function (a, b) { var _a, _b; return String((_a = a.id) !== null && _a !== void 0 ? _a : "").localeCompare(String((_b = b.id) !== null && _b !== void 0 ? _b : "")); })
                .map(function (p, index) { return (<ParametersListItem key={p.id} methodBindings={methodBindings} parameter={p} operationId={operationId} className={index === parameters.length - 1 ? "border-none" : ""} configurable={configurable} rulesByField={rulesByField} onConfigure={onConfigure} isDisabled={isDisabled}/>); })}
        </div>)}
      {parameters.length === 0 && isDisabled && (<div className="flex flex-1 py-24 justify-between items-center w-full">
          <components_1.Empty />
        </div>)}
    </div>);
}
function ParametersListItem(_a) {
    var methodBindings = _a.methodBindings, _b = _a.parameter, key = _b.key, value = _b.value, id = _b.id, updatedBy = _b.updatedBy, updatedAt = _b.updatedAt, createdBy = _b.createdBy, createdAt = _b.createdAt, operationId = _a.operationId, className = _a.className, configurable = _a.configurable, rulesByField = _a.rulesByField, onConfigure = _a.onConfigure, _c = _a.isDisabled, isDisabled = _c === void 0 ? false : _c;
    var t = (0, macro_1.useLingui)().t;
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var disclosure = (0, react_1.useDisclosure)();
    var deleteModalDisclosure = (0, react_1.useDisclosure)();
    var submitted = (0, react_2.useRef)(false);
    var fetcher = (0, react_router_1.useFetcher)();
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
    var isConfigured = rulesByField.has(getFieldKey("parameter:".concat(id, ":value"), operationId));
    return (<div className={(0, react_1.cn)("border-b p-6", className)}>
      {disclosure.isOpen ? (<form_1.ValidatedForm action={methodBindings.urls.methodOperationParameter(id)} method="post" validator={shared_1.operationParameterValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
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
              <form_1.Input name="key" label={t(templateObject_45 || (templateObject_45 = __makeTemplateObject(["Key"], ["Key"])))}/>
              <form_1.Input name="value" label={t(templateObject_46 || (templateObject_46 = __makeTemplateObject(["Value"], ["Value"])))} isConfigured={isConfigured} onConfigure={configurable && typeof onConfigure === "function"
                ? function () {
                    var _a;
                    onConfigure({
                        label: key,
                        field: getFieldKey("parameter:".concat(id, ":value"), operationId),
                        code: (_a = rulesByField.get(getFieldKey("parameter:".concat(id, ":value"), operationId))) === null || _a === void 0 ? void 0 : _a.code,
                        defaultValue: value,
                        returnType: {
                            type: "text"
                        }
                    });
                }
                : undefined}/>
            </div>
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                Cancel
              </react_1.Button>
              <Form_1.Submit isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                Save
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.VStack>
        </form_1.ValidatedForm>) : (<div className="flex flex-1 justify-between items-center w-full">
          <react_1.HStack spacing={4} className="w-1/2">
            <react_1.HStack spacing={4} className="flex-1">
              <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                <lu_1.LuActivity className={(0, react_1.cn)("size-4", isConfigured && "text-emerald-500")}/>
              </div>
              <react_1.VStack spacing={0}>
                <span className="text-sm font-medium">{key}</span>
              </react_1.VStack>
              {isConfigured ? (<react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <div className="flex flex-col items-center justify-center gap-1 text-emerald-500">
                      <lu_1.LuSquareFunction aria-label={t(templateObject_47 || (templateObject_47 = __makeTemplateObject(["Configured"], ["Configured"])))} className="size-4 "/>
                      <span className="text-xxs font-mono uppercase">
                        Configured
                      </span>
                    </div>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    <p className="text-foreground text-sm">
                      This value is configured
                    </p>
                  </react_1.TooltipContent>
                </react_1.Tooltip>) : (<span className="text-base text-muted-foreground text-right">
                  {value}
                </span>)}
            </react_1.HStack>
          </react_1.HStack>
          <div className="flex items-center justify-end gap-2">
            <react_1.HStack spacing={2}>
              <span className="text-xs text-muted-foreground">
                {isUpdated ? "Updated" : "Created"} {formatRelativeTime(date)}
              </span>
              <components_1.EmployeeAvatar employeeId={person} withName={false}/>
            </react_1.HStack>
            {!isDisabled && (<react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_48 || (templateObject_48 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                    Edit
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem destructive onClick={deleteModalDisclosure.onOpen}>
                    Delete
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>)}
          </div>
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={methodBindings.urls.deleteMethodOperationParameter(id)} isOpen={deleteModalDisclosure.isOpen} name={key} text={"Are you sure you want to delete the ".concat(key, " parameter from this operation? This cannot be undone.")} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function ToolsForm(_a) {
    var methodBindings = _a.methodBindings, operationId = _a.operationId, isDisabled = _a.isDisabled, tools = _a.tools, temporaryItems = _a.temporaryItems;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
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
      {!isDisabled && (<div className="p-6 border rounded-lg bg-card">
          <form_1.ValidatedForm action={methodBindings.urls.newMethodOperationTool} method="post" validator={shared_1.operationToolValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
                id: undefined,
                toolId: "",
                quantity: 1,
                operationId: operationId
            }} className="w-full">
            <Form_1.Hidden name="operationId"/>
            <react_1.VStack spacing={4}>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <Form_1.Tool name="toolId" label={t(templateObject_49 || (templateObject_49 = __makeTemplateObject(["Tool"], ["Tool"])))} autoFocus={tools.length === 0}/>
                <Form_1.Number name="quantity" label={t(templateObject_50 || (templateObject_50 = __makeTemplateObject(["Quantity"], ["Quantity"])))}/>
              </div>

              <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                Save Tool
              </Form_1.Submit>
            </react_1.VStack>
          </form_1.ValidatedForm>
        </div>)}

      {tools.length > 0 && (<div className="border rounded-lg">
          {__spreadArray([], tools, true).sort(function (a, b) { var _a, _b; return String((_a = a.id) !== null && _a !== void 0 ? _a : "").localeCompare(String((_b = b.id) !== null && _b !== void 0 ? _b : "")); })
                .map(function (t, index) { return (<ToolsListItem key={t.id} methodBindings={methodBindings} tool={t} operationId={operationId} className={index === tools.length - 1 ? "border-none" : ""} isDisabled={isDisabled}/>); })}
        </div>)}
      {tools.length === 0 && isDisabled && (<div className="flex flex-1 py-24 justify-between items-center w-full">
          <components_1.Empty />
        </div>)}
    </div>);
}
function ToolsListItem(_a) {
    var methodBindings = _a.methodBindings, _b = _a.tool, toolId = _b.toolId, quantity = _b.quantity, id = _b.id, updatedBy = _b.updatedBy, updatedAt = _b.updatedAt, createdBy = _b.createdBy, createdAt = _b.createdAt, operationId = _a.operationId, className = _a.className, _c = _a.isDisabled, isDisabled = _c === void 0 ? false : _c;
    var t = (0, macro_1.useLingui)().t;
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var disclosure = (0, react_1.useDisclosure)();
    var deleteModalDisclosure = (0, react_1.useDisclosure)();
    var submitted = (0, react_2.useRef)(false);
    var fetcher = (0, react_router_1.useFetcher)();
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
      {disclosure.isOpen ? (<form_1.ValidatedForm action={methodBindings.urls.methodOperationTool(id)} method="post" validator={shared_1.operationToolValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
                disclosure.onClose();
            }} defaultValues={{
                id: id,
                toolId: toolId !== null && toolId !== void 0 ? toolId : "",
                quantity: quantity !== null && quantity !== void 0 ? quantity : 1,
                operationId: operationId
            }} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Form_1.Tool name="toolId" label={t(templateObject_51 || (templateObject_51 = __makeTemplateObject(["Tool"], ["Tool"])))} autoFocus/>
              <Form_1.Number name="quantity" label={t(templateObject_52 || (templateObject_52 = __makeTemplateObject(["Quantity"], ["Quantity"])))}/>
            </div>
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                Cancel
              </react_1.Button>
              <Form_1.Submit isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                Save
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
                {isUpdated ? "Updated" : "Created"} {formatRelativeTime(date)}
              </span>
              <components_1.EmployeeAvatar employeeId={person} withName={false}/>
            </react_1.HStack>
            {!isDisabled && (<react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_53 || (templateObject_53 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                    Edit
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem destructive onClick={deleteModalDisclosure.onOpen}>
                    Delete
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>)}
          </div>
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={methodBindings.urls.deleteMethodOperationTool(id)} isOpen={deleteModalDisclosure.isOpen} name={tool.readableIdWithRevision} text={"Are you sure you want to delete ".concat(tool.readableIdWithRevision, " from this operation? This cannot be undone.")} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function makeItems(operations, tags, styleProcessLabel) {
    return operations.map(function (operation) {
        return makeItem(operation, tags, styleProcessLabel);
    });
}
function makeItem(operation, tags, styleProcessLabel) {
    var _a, _b, _c, _d;
    return {
        id: operation.id,
        title: (<react_1.VStack spacing={0}>
        <h3 className="font-semibold truncate cursor-pointer">
          {styleProcessLabel(operation.description, (0, styleMethod_service_1.isStyleCuttingOperation)({ tags: (_a = operation.tags) !== null && _a !== void 0 ? _a : [] }))}
        </h3>
        {(0, operationType_1.isOutsideOperationType)(operation.operationType) ? (<SupplierProcess_1.SupplierProcessPreview processId={operation.processId} supplierProcessId={operation.operationSupplierProcessId}/>) : null}
      </react_1.VStack>),
        checked: false,
        order: operation.operationOrder,
        details: (<react_1.HStack spacing={1}>
        {(0, operationType_1.isOutsideOperationType)(operation.operationType) ? (<OutsideOperationBadge_1.OutsideOperationBadge />) : (<>
            {((_b = operation === null || operation === void 0 ? void 0 : operation.setupTime) !== null && _b !== void 0 ? _b : 0) > 0 && (<react_1.Badge variant="secondary">
                <components_1.TimeTypeIcon type="Setup" className="h-3 w-3 mr-1"/>
                {operation.setupTime} {operation.setupUnit}
              </react_1.Badge>)}
            {((_c = operation === null || operation === void 0 ? void 0 : operation.laborTime) !== null && _c !== void 0 ? _c : 0) > 0 && (<react_1.Badge variant="secondary">
                <components_1.TimeTypeIcon type="Labor" className="h-3 w-3 mr-1"/>
                {operation.laborTime} {operation.laborUnit}
              </react_1.Badge>)}
            {((_d = operation === null || operation === void 0 ? void 0 : operation.machineTime) !== null && _d !== void 0 ? _d : 0) > 0 && (<react_1.Badge variant="secondary">
                <components_1.TimeTypeIcon type="Machine" className="h-3 w-3 mr-1"/>
                {operation.machineTime} {operation.machineUnit}
              </react_1.Badge>)}
          </>)}
      </react_1.HStack>),
        data: operation
    };
}
function usePendingOperations(methodBindings) {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        var _a, _b;
        return ((_b = (fetcher.formAction === methodBindings.urls.newMethodOperation ||
            ((_a = fetcher.formAction) === null || _a === void 0 ? void 0 : _a.includes("/methods/operation/")))) !== null && _b !== void 0 ? _b : false);
    })
        .reduce(function (acc, fetcher) {
        var formData = fetcher.formData;
        var operation = items_models_1.methodOperationValidator.safeParse(Object.fromEntries(formData));
        if (operation.success) {
            return __spreadArray(__spreadArray([], acc, true), [operation.data], false);
        }
        return acc;
    }, []);
}
function getFieldKey(field, operationId) {
    return "".concat(field, ":").concat(operationId);
}
function MethodOperationTags(_a) {
    var _b;
    var operation = _a.operation, availableTags = _a.availableTags;
    var onUpdateTags = (0, useTags_1.useTags)({
        id: operation.id,
        table: "methodOperation"
    }).onUpdateTags;
    return (<form_1.ValidatedForm defaultValues={{
            tags: (_b = operation.tags) !== null && _b !== void 0 ? _b : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })}>
      <Form_1.Tags availableTags={availableTags} label="" name="tags" table="operation" inline maxPreview={3} onChange={onUpdateTags}/>
    </form_1.ValidatedForm>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45, templateObject_46, templateObject_47, templateObject_48, templateObject_49, templateObject_50, templateObject_51, templateObject_52, templateObject_53;
