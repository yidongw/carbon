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
var framer_motion_1 = require("framer-motion");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var SupplierProcess_1 = require("~/components/Form/SupplierProcess");
var UnitHint_1 = require("~/components/Form/UnitHint");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var Icons_1 = require("~/components/Icons");
var Modals_1 = require("~/components/Modals");
var SortableList_1 = require("~/components/SortableList");
var hooks_1 = require("~/hooks");
var operationType_1 = require("~/modules/production/operationType");
var OutsideOperationBadge_1 = require("~/modules/production/ui/OutsideOperationBadge");
var operationBop_1 = require("~/modules/production/ui/operationBop");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
function makeItems(operations, tags) {
    return operations.map(function (operation) { return makeItem(operation, tags); });
}
function makeItem(operation, tags) {
    var _a, _b, _c;
    return {
        id: operation.id,
        title: (<react_1.VStack spacing={0}>
        <h3 className="font-semibold truncate cursor-pointer">
          {operation.description}
        </h3>
        {(0, operationType_1.isOutsideOperationType)(operation.operationType) ? (<SupplierProcess_1.SupplierProcessPreview processId={operation.processId} supplierProcessId={operation.operationSupplierProcessId}/>) : null}
      </react_1.VStack>),
        checked: false,
        order: operation.operationOrder,
        details: (<react_1.HStack spacing={1}>
        {(0, operationType_1.isOutsideOperationType)(operation.operationType) ? (<OutsideOperationBadge_1.OutsideOperationBadge />) : (<>
            {((_a = operation === null || operation === void 0 ? void 0 : operation.setupTime) !== null && _a !== void 0 ? _a : 0) > 0 && (<react_1.Badge variant="secondary" className="tabular-nums">
                <components_1.TimeTypeIcon type="Setup" className="h-3 w-3 mr-1"/>
                {operation.setupTime} {operation.setupUnit}
              </react_1.Badge>)}
            {((_b = operation === null || operation === void 0 ? void 0 : operation.laborTime) !== null && _b !== void 0 ? _b : 0) > 0 && (<react_1.Badge variant="secondary" className="tabular-nums">
                <components_1.TimeTypeIcon type="Labor" className="h-3 w-3 mr-1"/>
                {operation.laborTime} {operation.laborUnit}
              </react_1.Badge>)}

            {((_c = operation === null || operation === void 0 ? void 0 : operation.machineTime) !== null && _c !== void 0 ? _c : 0) > 0 && (<react_1.Badge variant="secondary" className="tabular-nums">
                <components_1.TimeTypeIcon type="Machine" className="h-3 w-3 mr-1"/>
                {operation.machineTime} {operation.machineUnit}
              </react_1.Badge>)}
          </>)}
      </react_1.HStack>),
        data: operation
    };
}
var initialOperation = {
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
    setupTime: 0,
    setupUnit: "Total Minutes",
    tags: [],
    workCenterId: "",
    workInstruction: {}
};
var usePendingOperations = function () {
    var _a = (0, react_router_1.useParams)(), quoteId = _a.quoteId, lineId = _a.lineId;
    if (!quoteId || !lineId)
        throw new Error("quoteId or lineId not found");
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        var _a, _b;
        return ((_b = (fetcher.formAction === path_1.path.to.newQuoteOperation(quoteId, lineId) ||
            ((_a = fetcher.formAction) === null || _a === void 0 ? void 0 : _a.includes("/quote/methods/".concat(quoteId, "/").concat(lineId, "/operation"))))) !== null && _b !== void 0 ? _b : false);
    })
        .reduce(function (acc, fetcher) {
        var formData = fetcher.formData;
        var operation = sales_models_1.quoteOperationValidator.safeParse(Object.fromEntries(formData));
        if (operation.success) {
            return __spreadArray(__spreadArray([], acc, true), [operation.data], false);
        }
        return acc;
    }, []);
};
var QuoteBillOfProcess = function (_a) {
    var _b;
    var quoteMakeMethodId = _a.quoteMakeMethodId, materials = _a.materials, initialOperations = _a.operations, tags = _a.tags;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var deleteOperationFetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var _c = (0, hooks_1.useUser)(), userId = _c.id, companyId = _c.company.id;
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
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("quoteId not found");
    var quoteData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var isDisabled = ((_b = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _b === void 0 ? void 0 : _b.status) !== "Draft";
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
    var t = (0, macro_1.useLingui)().t;
    var operationsById = new Map();
    // Add initial operations to map
    initialOperations.forEach(function (operation) {
        if (!operation.id)
            return;
        operationsById.set(operation.id, operation);
    });
    var pendingOperations = usePendingOperations();
    // Replace existing operations with pending ones
    pendingOperations.forEach(function (pendingOperation) {
        if (!pendingOperation.id) {
            operationsById.set("temporary", __assign(__assign({}, pendingOperation), { workInstruction: {}, quoteOperationTool: [], tags: [] }));
        }
        else {
            operationsById.set(pendingOperation.id, __assign(__assign({}, operationsById.get(pendingOperation.id)), pendingOperation));
        }
    });
    // Add temporary items
    Object.entries(temporaryItems).forEach(function (_a) {
        var id = _a[0], operation = _a[1];
        operationsById.set(id, __assign(__assign({}, operation), { quoteOperationTool: [] }));
    });
    var operations = Array.from(operationsById.values()).sort(function (a, b) { var _a, _b; return ((_a = orderState[a.id]) !== null && _a !== void 0 ? _a : a.order) - ((_b = orderState[b.id]) !== null && _b !== void 0 ? _b : b.order); });
    var items = makeItems(operations, tags).map(function (item) {
        var _a;
        return (__assign(__assign({}, item), { checked: (_a = checkedState[item.id]) !== null && _a !== void 0 ? _a : false }));
    });
    var onUpdateWorkInstruction = (0, react_1.useDebounce)(function (content) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(selectedItemId !== null && !temporaryItems[selectedItemId])) return [3 /*break*/, 2];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("quoteOperation").update({
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
                    fileName = "".concat(companyId, "/opportunity-line/").concat(selectedItemId, "/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file, { upsert: true }))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    var onToggleItem = function (id) {
        if (!permissions.can("update", "parts"))
            return;
        setCheckedState(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[id] = !prev[id], _a)));
        });
    };
    // we create a temporary item and append it to the list
    var onAddItem = function () {
        var operationId = (0, nanoid_1.nanoid)();
        var newOrder = 1;
        if (operations.length) {
            newOrder = Math.max.apply(Math, operations.map(function (op) { return op.order; })) + 1;
        }
        var newOperation = __assign(__assign({}, initialOperation), { id: operationId, order: newOrder, quoteMakeMethodId: quoteMakeMethodId });
        setTemporaryItems(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[operationId] = newOperation, _a)));
        });
        setSelectedItemId(operationId);
    };
    var onRemoveItem = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var operation;
        return __generator(this, function (_a) {
            if (!permissions.can("update", "sales"))
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
                    action: path_1.path.to.quoteOperationsDelete
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
        if (!permissions.can("update", "sales") || isDisabled)
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
            action: path_1.path.to.quoteOperationsOrder
        });
    }, 1000, true);
    var onCloseOnDrag = function () {
        setCheckedState({});
    };
    var _j = (0, react_2.useState)(1), tabChangeRerender = _j[0], setTabChangeRerender = _j[1];
    var renderListItem = function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var item = _a.item, items = _a.items, order = _a.order, onToggleItem = _a.onToggleItem, onRemoveItem = _a.onRemoveItem;
        var isOpen = item.id === selectedItemId;
        var tools = (_c = (_b = initialOperations.find(function (o) { return o.id === item.id; })) === null || _b === void 0 ? void 0 : _b.quoteOperationTool) !== null && _c !== void 0 ? _c : [];
        var parameters = (_e = (_d = initialOperations.find(function (o) { return o.id === item.id; })) === null || _d === void 0 ? void 0 : _d.quoteOperationParameter) !== null && _e !== void 0 ? _e : [];
        var steps = (_g = (_f = initialOperations.find(function (o) { return o.id === item.id; })) === null || _f === void 0 ? void 0 : _f.quoteOperationStep) !== null && _g !== void 0 ? _g : [];
        var hasProcedure = !!item.data.procedureId;
        var tabs = [
            {
                id: 0,
                label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Details"], ["Details"]))),
                content: (<div className="flex w-full flex-col pr-2 py-2">
            <framer_motion_1.motion.div initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.75,
                        delay: 0.15
                    }}>
              <OperationForm item={item} isDisabled={isDisabled} workInstruction={(_h = workInstructions[item.id]) !== null && _h !== void 0 ? _h : {}} setWorkInstructions={setWorkInstructions} setSelectedItemId={setSelectedItemId} setTemporaryItems={setTemporaryItems} temporaryItems={temporaryItems} onSubmit={function () {
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
                disabled: item.id in temporaryItems ||
                    hasProcedure ||
                    (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>
              <macro_1.Trans>Instructions</macro_1.Trans>
            </span>
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
                content: (<div className="flex flex-col">
            <div>
              {permissions.can("update", "parts") ? (<Editor_1.Editor initialValue={(_j = workInstructions[item.id]) !== null && _j !== void 0 ? _j : {}} onUpload={onUploadImage} onChange={function (content) {
                            if (!permissions.can("update", "sales"))
                                return;
                            setWorkInstructions(function (prev) {
                                var _a;
                                return (__assign(__assign({}, prev), (_a = {}, _a[item.id] = content, _a)));
                            });
                            onUpdateWorkInstruction(content);
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
            <span>
              <macro_1.Trans>Parameters</macro_1.Trans>
            </span>
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
            <ParametersForm parameters={parameters} operationId={item.id} isDisabled={selectedItemId === null || !!temporaryItems[selectedItemId]} temporaryItems={temporaryItems}/>
          </div>)
            },
            {
                id: 3,
                disabled: item.id in temporaryItems ||
                    hasProcedure ||
                    (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>
              <macro_1.Trans>Steps</macro_1.Trans>
            </span>
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
            <AttributesForm steps={steps} operationId={item.id} isDisabled={selectedItemId === null || !!temporaryItems[selectedItemId]} temporaryItems={temporaryItems} itemMentions={itemMentions}/>
          </div>)
            },
            {
                id: 4,
                disabled: item.id in temporaryItems ||
                    (0, operationType_1.disablesOutsideBopDetailTabs)(item.data.operationType),
                label: (<span className="flex items-center gap-2">
            <span>
              <macro_1.Trans>Tools</macro_1.Trans>
            </span>
            {tools.length > 0 && <react_1.Count count={tools.length}/>}
          </span>),
                content: (<div className="flex w-full flex-col py-4">
            <ToolsForm tools={tools} operationId={item.id} isDisabled={selectedItemId === null || !!temporaryItems[selectedItemId]} temporaryItems={temporaryItems}/>
          </div>)
            }
        ];
        return (<SortableList_1.SortableListItem item={item} items={items} order={order} key={item.id} isExpanded={isOpen} onSelectItem={setSelectedItemId} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} handleDrag={onCloseOnDrag} className="my-2 " renderExtra={function (item) { return (<div key={"".concat(isOpen)}>
            <framer_motion_1.motion.button layout onClick={isOpen
                    ? function () {
                        setSelectedItemId(null);
                    }
                    : function () {
                        setSelectedItemId(item.id);
                    }} key="collapse" className={(0, react_1.cn)("absolute right-3 top-3 z-10")}>
              {isOpen ? (<framer_motion_1.motion.span initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 1, filter: "blur(0px)" }} transition={{
                        type: "spring",
                        duration: 1.95
                    }}>
                  <lu_1.LuX className="h-5 w-5 text-foreground"/>
                </framer_motion_1.motion.span>) : (<framer_motion_1.motion.span initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 1, filter: "blur(0px)" }} transition={{
                        type: "spring",
                        duration: 0.95
                    }}>
                  <lu_1.LuSettings2 className="stroke-1 h-5 w-5 text-foreground/80  hover:stroke-primary/70 "/>
                </framer_motion_1.motion.span>)}
            </framer_motion_1.motion.button>

            <framer_motion_1.LayoutGroup id={"".concat(item.id)}>
              <framer_motion_1.AnimatePresence mode="popLayout">
                {isOpen ? (<framer_motion_1.motion.div className="flex w-full flex-col ">
                    <div className=" w-full p-2">
                      <framer_motion_1.motion.div initial={{
                        y: 0,
                        opacity: 0,
                        filter: "blur(4px)"
                    }} animate={{
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)"
                    }} transition={{
                        type: "spring",
                        duration: 0.15
                    }} layout className="w-full ">
                        <components_1.DirectionAwareTabs className="mr-auto" tabs={tabs} onChange={function () {
                        return setTabChangeRerender(tabChangeRerender + 1);
                    }}/>
                      </framer_motion_1.motion.div>
                    </div>
                  </framer_motion_1.motion.div>) : null}
              </framer_motion_1.AnimatePresence>
            </framer_motion_1.LayoutGroup>
          </div>); }}/>);
    };
    return (<react_1.Card>
      <react_1.HStack className="justify-between">
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Bill of Process</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>

        <react_1.CardAction>
          <react_1.Button ref={addOperationButtonRef} variant="secondary" isDisabled={!permissions.can("update", "sales") ||
            selectedItemId !== null ||
            isDisabled} onClick={onAddItem} className="transition-transform active:scale-[0.96]">
            <macro_1.Trans>Add Operation</macro_1.Trans>
          </react_1.Button>
        </react_1.CardAction>
      </react_1.HStack>
      <react_1.CardContent>
        <SortableList_1.SortableList items={items} onReorder={onReorder} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} renderItem={renderListItem}/>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = QuoteBillOfProcess;
function AttributesForm(_a) {
    var _this = this;
    var operationId = _a.operationId, isDisabled = _a.isDisabled, steps = _a.steps, temporaryItems = _a.temporaryItems, itemMentions = _a.itemMentions;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)("Task"), type = _b[0], setType = _b[1];
    var _c = (0, react_2.useState)([]), numericControls = _c[0], setNumericControls = _c[1];
    // Initialize sort order state based on existing steps
    var _d = (0, react_2.useState)(function () {
        return __spreadArray([], steps, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); })
            .map(function (step) { return step.id || ""; });
    }), sortOrder = _d[0], setSortOrder = _d[1];
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
            action: path_1.path.to.quoteOperationStepOrder(operationId)
        });
    }, 1000, true);
    var _e = (0, react_2.useState)({}), description = _e[0], setDescription = _e[1];
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
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    var typeOptions = (0, react_2.useMemo)(function () {
        return shared_1.procedureStepType.map(function (type) { return ({
            label: (<react_1.HStack>
            <Icons_1.ProcedureStepTypeIcon type={type} className="mr-2"/>
            {type}
          </react_1.HStack>),
            value: type
        }); });
    }, []);
    if (isDisabled && temporaryItems[operationId]) {
        return (<react_1.Alert className="max-w-[420px] mx-auto my-8">
        <lu_1.LuTriangleAlert />
        <react_1.AlertTitle>
          <macro_1.Trans>Cannot add steps to unsaved operation</macro_1.Trans>
        </react_1.AlertTitle>
        <react_1.AlertDescription>
          Please save the operation before adding steps.
        </react_1.AlertDescription>
      </react_1.Alert>);
    }
    return (<react_1.Loading className="flex flex-col gap-6" isLoading={fetcher.state !== "idle"}>
      <div className="p-6 border rounded-lg bg-card mb-6">
        <form_1.ValidatedForm action={path_1.path.to.newQuoteOperationStep} method="post" validator={shared_1.operationStepValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
            id: undefined,
            name: "",
            description: "",
            type: "Task",
            unitOfMeasureCode: "",
            minValue: 0,
            maxValue: 0,
            listValues: [],
            sortOrder: steps.reduce(function (acc, a) { var _a; return Math.max(acc, (_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0) + 1,
            operationId: operationId
        }} onSubmit={function () {
            setType("Value");
            setDescription([]);
        }} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <Form_1.Hidden name="sortOrder"/>
          <Form_1.Hidden name="description" value={JSON.stringify(description)}/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Form_1.SelectControlled name="type" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Type"], ["Type"])))} options={typeOptions} value={type} onChange={function (option) {
            if (option) {
                setType(option.value);
            }
        }}/>
              <form_1.Input name="name" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Name"], ["Name"])))}/>
            </div>

            <react_1.VStack spacing={2} className="w-full col-span-2">
              <react_1.Label>Description</react_1.Label>
              <Editor_1.Editor initialValue={description} onUpload={onUploadImage} onChange={function (value) {
            setDescription(value);
        }} mentions={[{ char: "@", items: itemMentions }]} className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"/>
            </react_1.VStack>

            {type === "Measurement" && (<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <UnitOfMeasure_1.default name="unitOfMeasureCode" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>

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

                {numericControls.includes("min") && (<Form_1.Number name="minValue" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Minimum"], ["Minimum"])))} formatOptions={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 10
                }}/>)}
                {numericControls.includes("max") && (<Form_1.Number name="maxValue" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Maximum"], ["Maximum"])))} formatOptions={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 10
                }}/>)}
              </div>)}
            {type === "List" && (<Form_1.Array name="listValues" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}

            <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"} className="transition-transform active:scale-[0.96]">
              Save Step
            </Form_1.Submit>
          </react_1.VStack>
        </form_1.ValidatedForm>
      </div>

      {steps.length > 0 && (<div className="border bg-card rounded-lg">
          <framer_motion_1.Reorder.Group axis="y" values={sortOrder} onReorder={onReorder} className="w-full">
            {sortOrder.map(function (stepId) {
                var step = steps.find(function (s) { return s.id === stepId; });
                if (!step)
                    return null;
                var index = sortOrder.indexOf(stepId);
                return (<DraggableStepItem key={stepId} stepId={stepId} isDisabled={isDisabled}>
                  {function (dragControls) { return (<AttributesListItem attribute={step} operationId={operationId} typeOptions={typeOptions} isDisabled={isDisabled} dragControls={dragControls} itemMentions={itemMentions} className={index === sortOrder.length - 1 ? "border-none" : ""}/>); }}
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
function AttributesListItem(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var attribute = _a.attribute, operationId = _a.operationId, typeOptions = _a.typeOptions, _f = _a.isDisabled, isDisabled = _f === void 0 ? false : _f, dragControls = _a.dragControls, itemMentions = _a.itemMentions, className = _a.className;
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
                        react_1.toast.error("Failed to upload image");
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
      {disclosure.isOpen ? (<form_1.ValidatedForm action={path_1.path.to.quoteOperationStep(id)} method="post" validator={shared_1.operationStepValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
                disclosure.onClose();
                setType("Task");
                setDescription({});
            }} defaultValues={__assign(__assign({}, attribute), { operationId: operationId })} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <Form_1.Hidden name="description" value={JSON.stringify(description)}/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Form_1.SelectControlled name="type" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Type"], ["Type"])))} options={typeOptions} onChange={function (option) {
                if (option) {
                    setType(option.value);
                }
            }}/>
              <form_1.Input name="name" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Name"], ["Name"])))}/>
            </div>

            <react_1.VStack spacing={2} className="w-full col-span-2">
              <react_1.Label>Description</react_1.Label>
              <Editor_1.Editor initialValue={description} onUpload={onUploadImage} onChange={function (value) {
                setDescription(value);
            }} mentions={[{ char: "@", items: itemMentions }]} className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"/>
            </react_1.VStack>

            {type === "Measurement" && (<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <UnitOfMeasure_1.default name="unitOfMeasureCode" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>

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

                {numericControls.includes("min") && (<Form_1.Number name="minValue" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Minimum"], ["Minimum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }}/>)}
                {numericControls.includes("max") && (<Form_1.Number name="maxValue" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Maximum"], ["Maximum"])))} formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 10
                    }}/>)}
              </div>)}
            {type === "List" && (<Form_1.Array name="listValues" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}
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
            <react_1.IconButton aria-label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost" disabled={isDisabled} className="cursor-grab active:cursor-grabbing" onPointerDown={function (e) {
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
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                  Edit
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem destructive onClick={deleteModalDisclosure.onOpen}>
                  Delete
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </div>
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteQuoteOperationStep(id)} isOpen={deleteModalDisclosure.isOpen} name={name} text={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Are you sure you want to delete the ", " attribute from this operation? This cannot be undone."], ["Are you sure you want to delete the ", " attribute from this operation? This cannot be undone."])), name)} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function ParametersForm(_a) {
    var operationId = _a.operationId, isDisabled = _a.isDisabled, parameters = _a.parameters, temporaryItems = _a.temporaryItems;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    if (isDisabled && temporaryItems[operationId]) {
        return (<react_1.Alert className="max-w-[420px] mx-auto my-8">
        <lu_1.LuTriangleAlert />
        <react_1.AlertTitle>
          <macro_1.Trans>Cannot add parameters to unsaved operation</macro_1.Trans>
        </react_1.AlertTitle>
        <react_1.AlertDescription>
          Please save the operation before adding parameters.
        </react_1.AlertDescription>
      </react_1.Alert>);
    }
    return (<div className="flex flex-col gap-6">
      <div className="p-6 border rounded-lg bg-card">
        <form_1.ValidatedForm action={path_1.path.to.newQuoteOperationParameter} method="post" validator={shared_1.operationParameterValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
            id: undefined,
            key: "",
            value: "",
            operationId: operationId
        }} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <form_1.Input name="key" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Key"], ["Key"])))} autoFocus={parameters.length === 0}/>
              <form_1.Input name="value" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Value"], ["Value"])))}/>
            </div>
            <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"} className="transition-transform active:scale-[0.96]">
              Add Parameter
            </Form_1.Submit>
          </react_1.VStack>
        </form_1.ValidatedForm>
      </div>

      {parameters.length > 0 && (<div className="border bg-card rounded-lg">
          {__spreadArray([], parameters, true).sort(function (a, b) { var _a, _b; return String((_a = a.id) !== null && _a !== void 0 ? _a : "").localeCompare(String((_b = b.id) !== null && _b !== void 0 ? _b : "")); })
                .map(function (p, index) { return (<ParametersListItem key={p.id} parameter={p} operationId={operationId} className={index === parameters.length - 1 ? "border-none" : ""}/>); })}
        </div>)}
    </div>);
}
function ParametersListItem(_a) {
    var _b = _a.parameter, key = _b.key, value = _b.value, id = _b.id, updatedBy = _b.updatedBy, updatedAt = _b.updatedAt, createdBy = _b.createdBy, createdAt = _b.createdAt, operationId = _a.operationId, className = _a.className;
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
    return (<div className={(0, react_1.cn)("border-b p-6", className)}>
      {disclosure.isOpen ? (<form_1.ValidatedForm action={path_1.path.to.quoteOperationParameter(id)} method="post" validator={shared_1.operationParameterValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
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
              <form_1.Input name="key" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Key"], ["Key"])))}/>
              <form_1.Input name="value" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Value"], ["Value"])))}/>
            </div>
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                Cancel
              </react_1.Button>
              <Form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                Save
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
              <span className="text-base text-muted-foreground text-right">
                {value}
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
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                  Edit
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem destructive onClick={deleteModalDisclosure.onOpen}>
                  Delete
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </div>
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteQuoteOperationParameter(id)} isOpen={deleteModalDisclosure.isOpen} name={key} text={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Are you sure you want to delete the ", " parameter from this operation? This cannot be undone."], ["Are you sure you want to delete the ", " parameter from this operation? This cannot be undone."])), key)} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function OperationForm(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var item = _a.item, isDisabled = _a.isDisabled, workInstruction = _a.workInstruction, setWorkInstructions = _a.setWorkInstructions, setTemporaryItems = _a.setTemporaryItems, setSelectedItemId = _a.setSelectedItemId, temporaryItems = _a.temporaryItems, onSubmit = _a.onSubmit;
    var t = (0, macro_1.useLingui)().t;
    var operationOrderOptions = (0, react_2.useMemo)(function () { return [
        { value: "After Previous", label: <macro_1.Trans>After Previous</macro_1.Trans> },
        { value: "With Previous", label: <macro_1.Trans>With Previous</macro_1.Trans> }
    ]; }, []);
    var operationTypeOptions = (0, operationBop_1.useOperationTypeSelectOptions)();
    var _v = (0, react_router_1.useParams)(), quoteId = _v.quoteId, lineId = _v.lineId;
    var company = (0, hooks_1.useUser)().company;
    if (!quoteId)
        throw new Error("quoteId not found");
    if (!lineId)
        throw new Error("lineId not found");
    var fetcher = (0, react_router_1.useFetcher)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.data && fetcher.data.id) {
            // Clear temporary item after successful save
            setTemporaryItems(function (prev) {
                var _a = prev, _b = item.id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return rest;
            });
            if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
                react_1.toast.success(fetcher.data.message);
            }
            onSubmit();
        }
    }, [item.id, fetcher.data, setTemporaryItems, onSubmit]);
    var _w = (0, react_2.useState)({
        description: (_c = item.data.description) !== null && _c !== void 0 ? _c : "",
        laborRate: (_d = item.data.laborRate) !== null && _d !== void 0 ? _d : 0,
        laborTime: (_e = item.data.laborTime) !== null && _e !== void 0 ? _e : 0,
        laborUnit: (_f = item.data.laborUnit) !== null && _f !== void 0 ? _f : "Hours/Piece",
        laborUnitHint: (0, UnitHint_1.getUnitHint)(item.data.laborUnit),
        machineRate: (_g = item.data.machineRate) !== null && _g !== void 0 ? _g : 0,
        machineTime: (_h = item.data.machineTime) !== null && _h !== void 0 ? _h : 0,
        machineUnit: (_j = item.data.machineUnit) !== null && _j !== void 0 ? _j : "Hours/Piece",
        machineUnitHint: (0, UnitHint_1.getUnitHint)(item.data.machineUnit),
        operationMinimumCost: (_k = item.data.operationMinimumCost) !== null && _k !== void 0 ? _k : 0,
        operationLeadTime: (_l = item.data.operationLeadTime) !== null && _l !== void 0 ? _l : 0,
        operationType: (_m = item.data.operationType) !== null && _m !== void 0 ? _m : "Inside",
        operationUnitCost: (_o = item.data.operationUnitCost) !== null && _o !== void 0 ? _o : 0,
        insideUnitCost: (_p = item.data.insideUnitCost) !== null && _p !== void 0 ? _p : 0,
        overheadRate: (_q = item.data.overheadRate) !== null && _q !== void 0 ? _q : 0,
        processId: (_r = item.data.processId) !== null && _r !== void 0 ? _r : "",
        procedureId: (_s = item.data.procedureId) !== null && _s !== void 0 ? _s : "",
        setupTime: (_t = item.data.setupTime) !== null && _t !== void 0 ? _t : 0,
        setupUnit: (_u = item.data.setupUnit) !== null && _u !== void 0 ? _u : "Total Minutes",
        setupUnitHint: (0, UnitHint_1.getUnitHint)(item.data.setupUnit)
    }), processData = _w[0], setProcessData = _w[1];
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
                        return (__assign(__assign({}, p), { processId: processId, procedureId: "", description: (_b = (_a = process.data) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", laborUnit: (_d = (_c = process.data) === null || _c === void 0 ? void 0 : _c.defaultStandardFactor) !== null && _d !== void 0 ? _d : "Hours/Piece", laborUnitHint: (0, UnitHint_1.getUnitHint)((_e = process.data) === null || _e === void 0 ? void 0 : _e.defaultStandardFactor), laborRate: activeWorkCenters.length
                                ? activeWorkCenters.reduce(function (acc, workCenter) {
                                    var _a, _b;
                                    return (acc += (_b = (_a = workCenter.workCenter) === null || _a === void 0 ? void 0 : _a.laborRate) !== null && _b !== void 0 ? _b : 0);
                                }, 0) / activeWorkCenters.length
                                : p.laborRate, machineUnit: (_g = (_f = process.data) === null || _f === void 0 ? void 0 : _f.defaultStandardFactor) !== null && _g !== void 0 ? _g : "Hours/Piece", machineUnitHint: (0, UnitHint_1.getUnitHint)((_h = process.data) === null || _h === void 0 ? void 0 : _h.defaultStandardFactor), machineRate: activeWorkCenters.length
                                ? activeWorkCenters.reduce(function (acc, workCenter) {
                                    var _a, _b;
                                    return (acc += (_b = (_a = workCenter.workCenter) === null || _a === void 0 ? void 0 : _a.machineRate) !== null && _b !== void 0 ? _b : 0);
                                }, 0) / activeWorkCenters.length
                                : p.machineRate, overheadRate: activeWorkCenters.length
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
                                : p.operationLeadTime, operationType: operationType }));
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
                        return (__assign(__assign({}, d), { operationMinimumCost: (_a = data === null || data === void 0 ? void 0 : data.minimumCost) !== null && _a !== void 0 ? _a : 0, operationUnitCost: (_b = data === null || data === void 0 ? void 0 : data.unitCost) !== null && _b !== void 0 ? _b : 0, operationLeadTime: (_c = data === null || data === void 0 ? void 0 : data.leadTime) !== null && _c !== void 0 ? _c : 0 }));
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    return (<form_1.ValidatedForm action={temporaryItems[item.id]
            ? path_1.path.to.newQuoteOperation(quoteId, lineId)
            : path_1.path.to.quoteOperation(quoteId, lineId, item.id)} method="post" defaultValues={item.data} validator={sales_models_1.quoteOperationValidator} className="w-full flex flex-col gap-y-4" fetcher={fetcher}>
      <div>
        <Form_1.Hidden name="id"/>
        <Form_1.Hidden name="quoteMakeMethodId"/>
        <Form_1.Hidden name="order"/>
      </div>
      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
        <Form_1.Process name="processId" label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Process"], ["Process"])))} onChange={function (value) {
            onProcessChange(value === null || value === void 0 ? void 0 : value.value);
        }}/>
        <Form_1.Select name="operationOrder" label={t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Operation Order"], ["Operation Order"])))} placeholder={t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Operation Order"], ["Operation Order"])))} options={operationOrderOptions}/>
        <Form_1.SelectControlled name="operationType" label={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Operation Type"], ["Operation Type"])))} placeholder={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Operation Type"], ["Operation Type"])))} options={operationTypeOptions} value={processData.operationType} onChange={function (value) {
            var operationType = value === null || value === void 0 ? void 0 : value.value;
            var useSupplierRouting = (0, operationType_1.showsSupplierRoutingFields)(operationType);
            setProcessData(function (d) { return (__assign(__assign(__assign({}, d), { setupUnit: "Total Minutes", laborUnit: "Minutes/Piece", machineUnit: "Minutes/Piece", operationType: operationType }), (useSupplierRouting
                ? {}
                : {
                    operationMinimumCost: 0,
                    operationUnitCost: 0,
                    operationLeadTime: 0
                }))); });
        }}/>

        <Form_1.InputControlled name="description" label={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Description"], ["Description"])))} value={processData.description} onChange={function (newValue) {
            setProcessData(function (d) { return (__assign(__assign({}, d), { description: newValue })); });
        }} className="col-span-2"/>

        {(0, operationType_1.isInsideOperationType)(processData.operationType) ? (<>
            <Form_1.WorkCenter name="workCenterId" label={t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Work Center"], ["Work Center"])))} isOptional processId={processData.processId} onChange={function (value) {
                var _a;
                onWorkCenterChange((_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
            }}/>
            <Form_1.NumberControlled name="laborRate" label={t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Labor Rate"], ["Labor Rate"])))} minValue={0} value={processData.laborRate} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { laborRate: newValue })); });
            }}/>
            <Form_1.NumberControlled name="machineRate" label={t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Machine Rate"], ["Machine Rate"])))} minValue={0} value={processData.machineRate} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { machineRate: newValue })); });
            }}/>
            <Form_1.NumberControlled name="overheadRate" label={t(templateObject_34 || (templateObject_34 = __makeTemplateObject(["Overhead Rate"], ["Overhead Rate"])))} minValue={0} value={processData.overheadRate} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { overheadRate: newValue })); });
            }}/>
            <Form_1.NumberControlled name="insideUnitCost" label={t(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Unit rate"], ["Unit rate"])))} minValue={0} value={processData.insideUnitCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { insideUnitCost: newValue !== null && newValue !== void 0 ? newValue : 0 })); });
            }}/>
          </>) : null}
        {(0, operationType_1.showsSupplierRoutingFields)(processData.operationType) ? (<>
            <Form_1.SupplierProcess name="operationSupplierProcessId" label={t(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Supplier"], ["Supplier"])))} processId={processData.processId} isOptional={false} onChange={function (value) {
                if (value) {
                    onSupplierProcessChange(value === null || value === void 0 ? void 0 : value.value);
                }
            }}/>
            <Form_1.NumberControlled name="operationMinimumCost" label={t(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Minimum Cost"], ["Minimum Cost"])))} isOptional={false} minValue={0} value={processData.operationMinimumCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationMinimumCost: newValue })); });
            }}/>
            <Form_1.NumberControlled name="operationUnitCost" label={t(templateObject_38 || (templateObject_38 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} isOptional={false} minValue={0} value={processData.operationUnitCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationUnitCost: newValue })); });
            }}/>
            <Form_1.NumberControlled name="operationLeadTime" label={t(templateObject_39 || (templateObject_39 = __makeTemplateObject(["Lead Time"], ["Lead Time"])))} isOptional={false} minValue={0} value={processData.operationLeadTime} onChange={function (newValue) {
                return setProcessData(function (d) { return (__assign(__assign({}, d), { operationLeadTime: newValue })); });
            }}/>
          </>) : (<>
            <Form_1.Hidden name="operationSupplierProcessId" value=""/>
            <Form_1.Hidden name="operationMinimumCost" value={0}/>
            <Form_1.Hidden name="operationUnitCost" value={0}/>
            <Form_1.Hidden name="operationLeadTime" value={0}/>
          </>)}
      </div>

      {(0, operationType_1.isInsideOperationType)(processData.operationType) ? (<operationBop_1.MethodOperationInsideDetailTabs processData={processData} setProcessData={setProcessData} fieldKey={function () { return ""; }} rulesByField={new Map()}/>) : null}
      <framer_motion_1.motion.div className="flex w-full items-center justify-end p-2" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
            type: "spring",
            bounce: 0,
            duration: 0.55
        }}>
        <framer_motion_1.motion.div layout className="ml-auto mr-1 pt-2">
          <Form_1.Submit isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state === "submitting"}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </framer_motion_1.motion.div>
      </framer_motion_1.motion.div>
    </form_1.ValidatedForm>);
}
function ToolsListItem(_a) {
    var _b = _a.tool, toolId = _b.toolId, quantity = _b.quantity, id = _b.id, updatedBy = _b.updatedBy, updatedAt = _b.updatedAt, createdBy = _b.createdBy, createdAt = _b.createdAt, operationId = _a.operationId, className = _a.className;
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
      {disclosure.isOpen ? (<form_1.ValidatedForm action={path_1.path.to.quoteOperationTool(id)} method="post" validator={shared_1.operationToolValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
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
              <Form_1.Tool name="toolId" label={t(templateObject_40 || (templateObject_40 = __makeTemplateObject(["Tool"], ["Tool"])))} autoFocus/>
              <Form_1.Number name="quantity" label={t(templateObject_41 || (templateObject_41 = __makeTemplateObject(["Quantity"], ["Quantity"])))}/>
            </div>
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                Cancel
              </react_1.Button>
              <Form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
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
            <react_1.DropdownMenu>
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
            </react_1.DropdownMenu>
          </div>
        </div>)}
      {deleteModalDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteQuoteOperationTool(id)} isOpen={deleteModalDisclosure.isOpen} name={tool.readableIdWithRevision} text={t(templateObject_43 || (templateObject_43 = __makeTemplateObject(["Are you sure you want to delete ", " from this operation? This cannot be undone."], ["Are you sure you want to delete ", " from this operation? This cannot be undone."])), tool.readableIdWithRevision)} onCancel={function () {
                deleteModalDisclosure.onClose();
            }} onSubmit={function () {
                deleteModalDisclosure.onClose();
            }}/>)}
    </div>);
}
function ToolsForm(_a) {
    var operationId = _a.operationId, isDisabled = _a.isDisabled, tools = _a.tools, temporaryItems = _a.temporaryItems;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    if (isDisabled && temporaryItems[operationId]) {
        return (<react_1.Alert className="max-w-[420px] mx-auto my-8">
        <lu_1.LuTriangleAlert />
        <react_1.AlertTitle>
          <macro_1.Trans>Cannot add tools to unsaved operation</macro_1.Trans>
        </react_1.AlertTitle>
        <react_1.AlertDescription>
          Please save the operation before adding tools.
        </react_1.AlertDescription>
      </react_1.Alert>);
    }
    return (<div className="flex flex-col gap-6">
      <div className="p-6 border rounded-lg bg-card">
        <form_1.ValidatedForm action={path_1.path.to.newQuoteOperationTool} method="post" validator={shared_1.operationToolValidator} fetcher={fetcher} resetAfterSubmit defaultValues={{
            id: undefined,
            toolId: "",
            quantity: 1,
            operationId: operationId
        }} className="w-full">
          <Form_1.Hidden name="operationId"/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Form_1.Tool name="toolId" label={t(templateObject_44 || (templateObject_44 = __makeTemplateObject(["Tool"], ["Tool"])))} autoFocus/>
              <Form_1.Number name="quantity" label={t(templateObject_45 || (templateObject_45 = __makeTemplateObject(["Quantity"], ["Quantity"])))}/>
            </div>

            <Form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
              Save Tool
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45;
