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
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var SortableList_1 = require("~/components/SortableList");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
function makeItems(items, materials, orderState, checkedState) {
    return materials.map(function (material) {
        var _a, _b;
        var order = material.id
            ? ((_a = orderState[material.id]) !== null && _a !== void 0 ? _a : material.order)
            : material.order;
        var checked = material.id ? ((_b = checkedState[material.id]) !== null && _b !== void 0 ? _b : false) : false;
        return makeItem(items, material, order, checked);
    });
}
function makeItem(items, material, order, checked) {
    var itemReadableId = (0, utils_1.getItemReadableId)(items, material.itemId);
    return {
        id: material.id,
        title: (<react_1.VStack spacing={0} className="py-1 cursor-pointer">
        <div className="flex items-center gap-2 group">
          <h3 className="font-semibold truncate">{itemReadableId !== null && itemReadableId !== void 0 ? itemReadableId : ""}</h3>
          {material.itemId && material.itemType && (<react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)(material.itemType, material.itemId)} onClick={function (e) { return e.stopPropagation(); }}>
              <lu_1.LuExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100"/>
            </react_router_1.Link>)}
        </div>
        {(material === null || material === void 0 ? void 0 : material.description) && (<span className="text-xs text-muted-foreground">
            {material.description}{" "}
          </span>)}
      </react_1.VStack>),
        checked: checked,
        details: (<react_1.HStack spacing={2}>
        {material.requiresBatchTracking ? (<react_1.Tooltip>
            <react_1.TooltipTrigger>
              <react_1.Badge variant="secondary">
                <components_1.TrackingTypeIcon type="Batch"/>
              </react_1.Badge>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <macro_1.Trans>Batch Tracking</macro_1.Trans>
            </react_1.TooltipContent>
          </react_1.Tooltip>) : material.requiresSerialTracking ? (<react_1.Tooltip>
            <react_1.TooltipTrigger>
              <react_1.Badge variant="secondary">
                <components_1.TrackingTypeIcon type="Serial"/>
              </react_1.Badge>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <macro_1.Trans>Serial Tracking</macro_1.Trans>
            </react_1.TooltipContent>
          </react_1.Tooltip>) : null}

        <react_1.Tooltip>
          <react_1.TooltipTrigger>
            <react_1.Badge variant="secondary">
              <components_1.MethodIcon type={material.methodType} isKit={material.kit}/>
            </react_1.Badge>
          </react_1.TooltipTrigger>
          <react_1.TooltipContent>
            {material.methodType === "Purchase to Order" ? (<macro_1.Trans>Purchase to Order</macro_1.Trans>) : material.methodType === "Pull from Inventory" ? (<macro_1.Trans>Pull from Inventory</macro_1.Trans>) : (<macro_1.Trans>Make to Order</macro_1.Trans>)}
          </react_1.TooltipContent>
        </react_1.Tooltip>
        <react_1.Badge variant="secondary">{material.quantity}</react_1.Badge>

        <react_1.Tooltip>
          <react_1.TooltipTrigger>
            <react_1.Badge variant="secondary">
              <components_1.MethodItemTypeIcon type={material.itemType}/>
            </react_1.Badge>
          </react_1.TooltipTrigger>
          <react_1.TooltipContent>
            {material.itemType === "Consumable" ? (<macro_1.Trans>Consumable</macro_1.Trans>) : material.itemType === "Material" ? (<macro_1.Trans>Material</macro_1.Trans>) : (<macro_1.Trans>Part</macro_1.Trans>)}
          </react_1.TooltipContent>
        </react_1.Tooltip>
      </react_1.HStack>),
        data: __assign(__assign({}, material), { order: order })
    };
}
var initialMethodMaterial = {
    itemId: "",
    // @ts-ignore
    itemType: "Item",
    methodType: "Purchase to Order",
    description: "",
    quantity: 1,
    unitCost: 0,
    unitOfMeasureCode: "EA"
};
var usePendingMaterials = function () {
    var jobId = (0, react_router_1.useParams)().jobId;
    if (!jobId)
        throw new Error("jobId not found");
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        var _a, _b;
        return ((_b = (fetcher.formAction === path_1.path.to.newJobMaterial(jobId) ||
            ((_a = fetcher.formAction) === null || _a === void 0 ? void 0 : _a.includes("/job/".concat(jobId, "/material"))))) !== null && _b !== void 0 ? _b : false);
    })
        .reduce(function (acc, fetcher) {
        var formData = fetcher.formData;
        var material = production_models_1.jobMaterialValidator.safeParse(Object.fromEntries(formData));
        if (material.success) {
            return __spreadArray(__spreadArray([], acc, true), [material.data], false);
        }
        return acc;
    }, []);
};
var JobBillOfMaterial = function (_a) {
    var _b, _c;
    var jobMakeMethodId = _a.jobMakeMethodId, initialMaterials = _a.materials, operations = _a.operations;
    var jobId = (0, react_router_1.useParams)().jobId;
    if (!jobId)
        throw new Error("jobId not found");
    var fetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var addItemButtonRef = (0, react_2.useRef)(null);
    var _d = (0, react_2.useState)(null), selectedItemId = _d[0], setSelectedItemId = _d[1];
    var _e = (0, react_2.useState)({}), temporaryItems = _e[0], setTemporaryItems = _e[1];
    var _f = (0, react_2.useState)({}), checkedState = _f[0], setCheckedState = _f[1];
    var _g = (0, react_2.useState)(function () {
        return initialMaterials.reduce(function (acc, material) {
            acc[material.id] = material.order;
            return acc;
        }, {});
    }), orderState = _g[0], setOrderState = _g[1];
    var materialsById = new Map();
    initialMaterials.forEach(function (material) {
        if (!material.id)
            return;
        materialsById.set(material.id, material);
    });
    var pendingMaterials = usePendingMaterials();
    pendingMaterials.forEach(function (pendingMaterial) {
        if (!pendingMaterial.id) {
            materialsById.set("temporary", __assign(__assign({}, pendingMaterial), { description: "", requiresBatchTracking: false, requiresSerialTracking: false }));
        }
        else {
            materialsById.set(pendingMaterial.id, __assign(__assign({}, materialsById.get(pendingMaterial.id)), pendingMaterial));
        }
    });
    Object.entries(temporaryItems).forEach(function (_a) {
        var id = _a[0], material = _a[1];
        materialsById.set(id, material);
    });
    var storeItems = (0, stores_1.useItems)()[0];
    var items = makeItems(storeItems, Array.from(materialsById.values()), orderState, checkedState).sort(function (a, b) { return a.data.order - b.data.order; });
    var jobData = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    var isDisabled = ["Completed", "Cancelled"].includes((_c = (_b = jobData === null || jobData === void 0 ? void 0 : jobData.job) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : "");
    var onToggleItem = function (id) {
        if (!permissions.can("update", "production") || isDisabled)
            return;
        setCheckedState(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[id] = !prev[id], _a)));
        });
    };
    var onAddItem = function () {
        if (!permissions.can("update", "production") || isDisabled)
            return;
        var materialId = (0, nanoid_1.nanoid)();
        setSelectedItemId(materialId);
        setSearchParams({ materialId: materialId });
        var newOrder = 1;
        if (items.length) {
            newOrder = Math.max.apply(Math, items.map(function (item) { return item.data.order; })) + 1;
        }
        var newMaterial = __assign(__assign({}, initialMethodMaterial), { id: materialId, order: newOrder, jobMakeMethodId: jobMakeMethodId });
        setTemporaryItems(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[materialId] = newMaterial, _a)));
        });
        setOrderState(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[materialId] = newOrder, _a)));
        });
    };
    var onRemoveItem = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!permissions.can("update", "production") || isDisabled)
                return [2 /*return*/];
            // Check if this is a temporary item (exists in temporaryItems state)
            if (temporaryItems[id]) {
                setTemporaryItems(function (prev) {
                    var _a = prev, _b = id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                    return rest;
                });
            }
            else {
                fetcher.submit(new FormData(), {
                    method: "post",
                    action: path_1.path.to.deleteJobMaterial(jobId, id)
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
        var newOrderState = items.reduce(function (acc, item, index) {
            acc[item.id] = index + 1;
            return acc;
        }, {});
        setOrderState(newOrderState);
        var updates = Object.entries(newOrderState).reduce(function (acc, _a) {
            var id = _a[0], order = _a[1];
            if (!temporaryItems[id]) {
                acc[id] = order;
            }
            return acc;
        }, {});
        if (Object.keys(updates).length > 0) {
            updateSortOrder(updates);
        }
    };
    var updateSortOrder = (0, react_1.useDebounce)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.jobMaterialsOrder
        });
    }, 1000, true);
    var onCloseOnDrag = (0, react_2.useCallback)(function () {
        setCheckedState(function (prev) {
            var newState = __assign({}, prev);
            var changed = false;
            items.forEach(function (item) {
                if (item.checked) {
                    newState[item.id] = false;
                    changed = true;
                }
            });
            return changed ? newState : prev;
        });
    }, [items]);
    var _h = (0, hooks_1.useUrlParams)(), searchParams = _h[0], setSearchParams = _h[1];
    var selectedMaterialId = searchParams.get("materialId");
    var onSelectItem = function (id) {
        setSearchParams({ materialId: id });
        setSelectedItemId(id);
    };
    var renderListItem = function (_a) {
        var item = _a.item, items = _a.items, order = _a.order, onToggleItem = _a.onToggleItem, onRemoveItem = _a.onRemoveItem;
        var isOpen = item.id === selectedItemId;
        return (<SortableList_1.SortableListItem item={item} items={items} order={order} key={item.id} isExpanded={isOpen} isHighlighted={item.id === selectedMaterialId} onSelectItem={onSelectItem} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} handleDrag={onCloseOnDrag} className="my-2 " renderExtra={function (item) { return (<div key={"".concat(isOpen)}>
            <framer_motion_1.motion.button layout onClick={isOpen
                    ? function () {
                        if (temporaryItems[item.id]) {
                            setTemporaryItems(function (prev) {
                                var _a = prev, _b = item.id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                                return rest;
                            });
                            setOrderState(function (prev) {
                                var _a;
                                var order = prev[item.id];
                                var _b = prev, _c = item.id, _ = _b[_c], rest = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
                                return __assign(__assign({}, rest), (_a = {}, _a[item.id] = order, _a));
                            });
                        }
                        onSelectItem(null);
                    }
                    : function () {
                        onSelectItem(item.id);
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
                  <lu_1.LuSettings2 className="stroke-1 mt-3.5 h-5 w-5 text-foreground/80  hover:stroke-primary/70 "/>
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
                        <framer_motion_1.motion.div initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.75,
                        delay: 0.15
                    }}>
                          <MaterialForm item={item} isDisabled={isDisabled} job={jobData === null || jobData === void 0 ? void 0 : jobData.job} setSelectedItemId={setSelectedItemId} jobOperations={operations} temporaryItems={temporaryItems} setTemporaryItems={setTemporaryItems} orderState={orderState} setOrderState={setOrderState} onSubmit={function () {
                        var _a;
                        setSelectedItemId(null);
                        (_a = addItemButtonRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center"
                        });
                    }}/>
                        </framer_motion_1.motion.div>
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
            <macro_1.Trans>Bill of Material</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>

        <react_1.CardAction>
          <react_1.Button ref={addItemButtonRef} variant="secondary" isDisabled={isDisabled || !permissions.can("update", "production")} onClick={onAddItem}>
            <macro_1.Trans>Add Item</macro_1.Trans>
          </react_1.Button>
        </react_1.CardAction>
      </react_1.HStack>
      <react_1.CardContent>
        <SortableList_1.SortableList items={items} onReorder={onReorder} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} renderItem={renderListItem}/>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = JobBillOfMaterial;
function MaterialForm(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    var item = _a.item, isDisabled = _a.isDisabled, job = _a.job, jobOperations = _a.jobOperations, temporaryItems = _a.temporaryItems, orderState = _a.orderState, setSelectedItemId = _a.setSelectedItemId, setTemporaryItems = _a.setTemporaryItems, setOrderState = _a.setOrderState, onSubmit = _a.onSubmit;
    var jobId = (0, react_router_1.useParams)().jobId;
    var t = (0, macro_1.useLingui)().t;
    if (!jobId)
        throw new Error("jobId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    var carbon = (0, auth_1.useCarbon)().carbon;
    var methodMaterialFetcher = (0, react_router_1.useFetcher)();
    var params = (0, react_router_1.useParams)();
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    (0, react_2.useEffect)(function () {
        var _a;
        // Remove from temporary items after successful submission
        if (methodMaterialFetcher.data && methodMaterialFetcher.data.id) {
            // Clear temporary item after successful save
            setTemporaryItems(function (prev) {
                var _a = prev, _b = item.id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return rest;
            });
            if ((_a = methodMaterialFetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
                react_1.toast.success(methodMaterialFetcher.data.message);
            }
            onSubmit();
        }
    }, [item.id, methodMaterialFetcher.data, setTemporaryItems, onSubmit]);
    var _z = (0, react_2.useState)(item.data.itemType), itemType = _z[0], setItemType = _z[1];
    var _0 = (0, react_2.useState)({
        itemId: (_c = item.data.itemId) !== null && _c !== void 0 ? _c : "",
        methodType: (_d = item.data.methodType) !== null && _d !== void 0 ? _d : "Pull from Inventory",
        description: (_e = item.data.description) !== null && _e !== void 0 ? _e : "",
        jobOperationId: (_f = item.data.jobOperationId) !== null && _f !== void 0 ? _f : "",
        unitCost: (_g = item.data.unitCost) !== null && _g !== void 0 ? _g : 0,
        unitOfMeasureCode: (_h = item.data.unitOfMeasureCode) !== null && _h !== void 0 ? _h : "EA",
        quantity: (_j = item.data.quantity) !== null && _j !== void 0 ? _j : 1,
        kit: (_k = item.data.kit) !== null && _k !== void 0 ? _k : false,
        requiresBatchTracking: (_l = item.data.requiresBatchTracking) !== null && _l !== void 0 ? _l : false,
        requiresSerialTracking: (_m = item.data.requiresSerialTracking) !== null && _m !== void 0 ? _m : false,
        storageUnitId: (_o = item.data.storageUnitId) !== null && _o !== void 0 ? _o : undefined,
        itemReplenishmentSystem: (_q = (_p = item.data.item) === null || _p === void 0 ? void 0 : _p.replenishmentSystem) !== null && _q !== void 0 ? _q : "Buy"
    }), itemData = _0[0], setItemData = _0[1];
    var onTypeChange = function (value) {
        if (value === itemType)
            return;
        setItemType(value);
        setItemData({
            itemId: "",
            methodType: "",
            quantity: 1,
            unitCost: 0,
            description: "",
            unitOfMeasureCode: "EA",
            jobOperationId: "",
            kit: false,
            requiresBatchTracking: false,
            requiresSerialTracking: false,
            storageUnitId: "",
            itemReplenishmentSystem: "Buy"
        });
    };
    var onItemChange = function (itemId) { return __awaiter(_this, void 0, void 0, function () {
        var _a, item, itemCost, pickMethod;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    if (itemId === params.itemId) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["An item cannot be added to itself."], ["An item cannot be added to itself."]))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("item")
                                .select("name, readableIdWithRevision, type, unitOfMeasureCode, defaultMethodType, itemTrackingType, replenishmentSystem")
                                .eq("id", itemId)
                                .eq("companyId", company.id)
                                .single(),
                            carbon.from("itemCost").select("unitCost").eq("itemId", itemId).single(),
                            carbon
                                .from("pickMethod")
                                .select("defaultStorageUnitId")
                                .eq("itemId", itemId)
                                .eq("companyId", company.id)
                                .eq("locationId", locationId)
                                .maybeSingle()
                        ])];
                case 1:
                    _a = _c.sent(), item = _a[0], itemCost = _a[1], pickMethod = _a[2];
                    if (item.error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to load item details"], ["Failed to load item details"]))));
                        return [2 /*return*/];
                    }
                    setItemData(function (d) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                        return (__assign(__assign({}, d), { itemId: itemId, description: (_b = (_a = item.data) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", unitCost: (_d = (_c = itemCost.data) === null || _c === void 0 ? void 0 : _c.unitCost) !== null && _d !== void 0 ? _d : 0, unitOfMeasureCode: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.unitOfMeasureCode) !== null && _f !== void 0 ? _f : "EA", methodType: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.defaultMethodType) !== null && _h !== void 0 ? _h : "Pull from Inventory", requiresBatchTracking: ((_j = item.data) === null || _j === void 0 ? void 0 : _j.itemTrackingType) === items_1.ItemTrackingType.Batch, requiresSerialTracking: ((_k = item.data) === null || _k === void 0 ? void 0 : _k.itemTrackingType) === items_1.ItemTrackingType.Serial, storageUnitId: (_m = (_l = pickMethod.data) === null || _l === void 0 ? void 0 : _l.defaultStorageUnitId) !== null && _m !== void 0 ? _m : "", itemReplenishmentSystem: (_p = (_o = item.data) === null || _o === void 0 ? void 0 : _o.replenishmentSystem) !== null && _p !== void 0 ? _p : "Buy" }));
                    });
                    if ((_b = item.data) === null || _b === void 0 ? void 0 : _b.type) {
                        setItemType(item.data.type);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var sourceDisclosure = (0, react_1.useDisclosure)();
    var isReleased = !["Draft", "Planned"].includes((_r = job === null || job === void 0 ? void 0 : job.status) !== null && _r !== void 0 ? _r : "") &&
        (jobOperations === null || jobOperations === void 0 ? void 0 : jobOperations.length) > 0;
    var backflushDisclosure = (0, react_1.useDisclosure)({
        defaultIsOpen: isReleased
    });
    var locationId = (_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _s === void 0 ? void 0 : _s.locationId) !== null && _t !== void 0 ? _t : undefined;
    var storageUnits = (0, StorageUnit_1.useStorageUnits)(locationId);
    var isTracked = itemData.requiresBatchTracking || itemData.requiresSerialTracking;
    return (<form_1.ValidatedForm action={temporaryItems[item.id]
            ? path_1.path.to.newJobMaterial(jobId)
            : path_1.path.to.jobMaterial(jobId, item.id)} method="post" defaultValues={item.data} validator={["Draft", "Planned"].includes((_u = job === null || job === void 0 ? void 0 : job.status) !== null && _u !== void 0 ? _u : "") ||
            (jobOperations === null || jobOperations === void 0 ? void 0 : jobOperations.length) === 0
            ? production_models_1.jobMaterialValidator
            : production_models_1.jobMaterialValidatorForReleasedJob} className="w-full flex flex-col gap-y-4" fetcher={methodMaterialFetcher}>
      <div>
        <Form_1.Hidden name="id"/>
        <Form_1.Hidden name="jobMakeMethodId"/>
        <Form_1.Hidden name="kit" value={itemData.kit.toString()}/>
        <Form_1.Hidden name="order"/>
        <Form_1.Hidden name="requiresBatchTracking" value={itemData.requiresBatchTracking.toString()}/>
        <Form_1.Hidden name="requiresSerialTracking" value={itemData.requiresSerialTracking.toString()}/>
        {itemData.methodType === "Make to Order" && (<Form_1.Hidden name="unitCost" value={itemData.unitCost}/>)}
      </div>

      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
        <Form_1.Item blacklist={[params.itemId]} isReadOnly={isDisabled} name="itemId" label={itemType} includeInactive locationId={locationId} validItemTypes={["Consumable", "Material", "Part"]} type={itemType} onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }} onTypeChange={onTypeChange}/>

        <Form_1.Number name="quantity" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quantity"], ["Quantity"])))}/>
        <Form_1.UnitOfMeasure name="unitOfMeasureCode" value={itemData.unitOfMeasureCode} onChange={function (newValue) {
            return setItemData(function (d) {
                var _a;
                return (__assign(__assign({}, d), { unitOfMeasureCode: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "EA" }));
            });
        }}/>
        <Form_1.InputControlled name="description" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Description"], ["Description"])))} value={itemData.description} onChange={function (newValue) {
            setItemData(function (d) { return (__assign(__assign({}, d), { description: newValue })); });
        }} className="col-span-2"/>
        {itemData.methodType !== "Make to Order" && (<Form_1.NumberControlled name="unitCost" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} value={itemData.unitCost} minValue={0} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }}/>)}
      </div>

      <div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
        <react_1.HStack className="w-full justify-between cursor-pointer" onClick={sourceDisclosure.onToggle}>
          <react_1.HStack>
            {itemData.methodType === "Make to Order" ? (<>
                <lu_1.LuGitPullRequestCreate />
                <react_1.Label>
                  <macro_1.Trans>Finish To</macro_1.Trans>
                </react_1.Label>
              </>) : (<>
                <lu_1.LuGitPullRequest />
                <react_1.Label>
                  <macro_1.Trans>Pull From</macro_1.Trans>
                </react_1.Label>
              </>)}
          </react_1.HStack>
          <react_1.HStack>
            <react_1.Badge variant="secondary">
              <components_1.MethodIcon type={itemData.methodType} className="size-3 mr-1"/>
              {itemData.methodType === "Purchase to Order"
            ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : itemData.methodType === "Pull from Inventory"
            ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Make to Order"], ["Make to Order"])))}
            </react_1.Badge>
            <lu_1.LuArrowLeft className={(0, react_1.cn)(itemData.methodType !== "Pull from Inventory"
            ? "rotate-180"
            : "")}/>
            <react_1.Badge variant="secondary">
              <lu_1.LuGitPullRequest className="size-3 mr-1"/>
              {(_x = (_w = (_v = storageUnits.options) === null || _v === void 0 ? void 0 : _v.find(function (s) { return s.value === itemData.storageUnitId; })) === null || _w === void 0 ? void 0 : _w.label) !== null && _x !== void 0 ? _x : (itemData.methodType === "Make to Order"
            ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["WIP"], ["WIP"]))) : t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Default Storage Unit"], ["Default Storage Unit"]))))}
            </react_1.Badge>
            <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={sourceDisclosure.isOpen ? "Collapse Source" : "Expand Source"} variant="ghost" onClick={function (e) {
            e.stopPropagation();
            sourceDisclosure.onToggle();
        }} className={"transition-transform ".concat(sourceDisclosure.isOpen ? "rotate-90" : "")}/>
          </react_1.HStack>
        </react_1.HStack>
        <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(sourceDisclosure.isOpen ? "" : "hidden")}>
          <Form_1.DefaultMethodType name="methodType" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Method Type"], ["Method Type"])))} value={itemData.methodType} onChange={function (value) {
            setItemData(function (d) { return (__assign(__assign({}, d), { methodType: value === null || value === void 0 ? void 0 : value.value })); });
        }} replenishmentSystem={itemData.itemReplenishmentSystem}/>
          <Form_1.StorageUnit name="storageUnitId" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} value={itemData.storageUnitId} onChange={function (value) {
            setItemData(function (d) {
                var _a;
                return (__assign(__assign({}, d), { storageUnitId: (_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : "" }));
            });
        }} locationId={locationId} itemId={itemData.itemId}/>
        </div>
      </div>

      <div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
        <react_1.HStack className="w-full justify-between cursor-pointer" onClick={backflushDisclosure.onToggle}>
          <react_1.HStack>
            <lu_1.LuGitPullRequestCreateArrow />
            <react_1.Label>
              {isTracked ? <macro_1.Trans>Operation</macro_1.Trans> : <macro_1.Trans>Backflush</macro_1.Trans>}
            </react_1.Label>
          </react_1.HStack>
          <react_1.HStack>
            <react_1.Badge variant={jobOperations.length > 0 ? "secondary" : "destructive"}>
              <lu_1.LuCog className="size-3 mr-1"/>
              {itemData.jobOperationId
            ? ((_y = jobOperations.find(function (o) { return o.id === itemData.jobOperationId; })) === null || _y === void 0 ? void 0 : _y.description) || t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Selected Operation"], ["Selected Operation"])))
            : t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["First Operation"], ["First Operation"])))}
            </react_1.Badge>
            <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={backflushDisclosure.isOpen
            ? "Collapse Operation"
            : "Expand Operation"} variant="ghost" size="md" onClick={function (e) {
            e.stopPropagation();
            backflushDisclosure.onToggle();
        }} className={"transition-transform ".concat(backflushDisclosure.isOpen ? "rotate-90" : "")}/>
          </react_1.HStack>
        </react_1.HStack>
        <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(backflushDisclosure.isOpen ? "" : "hidden")}>
          <Form_1.Select name="jobOperationId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Operation"], ["Operation"])))} isClearable options={jobOperations.map(function (o) { return ({
            value: o.id,
            label: o.description
        }); })} onChange={function (newValue) {
            setItemData(function (d) { return (__assign(__assign({}, d), { jobOperationId: newValue === null || newValue === void 0 ? void 0 : newValue.value })); });
        }}/>
        </div>
      </div>

      <framer_motion_1.motion.div className="flex flex-1 items-center justify-end w-full pt-2" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
            type: "spring",
            bounce: 0,
            duration: 0.55
        }}>
        <framer_motion_1.motion.div layout className="flex items-center justify-between gap-2 w-full">
          {itemData.methodType === "Make to Order" ? (<react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.Button leftIcon={<components_1.MethodIcon type={"Make to Order"} isKit={itemData.kit}/>} variant="secondary" size="sm" rightIcon={<lu_1.LuChevronDown />}>
                  {itemData.kit ? t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Kit"], ["Kit"]))) : t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Subassembly"], ["Subassembly"])))}
                </react_1.Button>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuRadioGroup value={itemData.kit ? "Kit" : "Subassembly"} onValueChange={function (value) {
                setItemData(function (d) { return (__assign(__assign({}, d), { kit: value === "Kit" })); });
            }}>
                  <react_1.DropdownMenuRadioItem value="Subassembly">
                    <macro_1.Trans>Subassembly</macro_1.Trans>
                  </react_1.DropdownMenuRadioItem>
                  <react_1.DropdownMenuRadioItem value="Kit">
                    <macro_1.Trans>Kit</macro_1.Trans>
                  </react_1.DropdownMenuRadioItem>
                </react_1.DropdownMenuRadioGroup>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>) : (<div />)}

          <Form_1.Submit isDisabled={isDisabled || methodMaterialFetcher.state !== "idle"} isLoading={methodMaterialFetcher.state === "submitting"}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </framer_motion_1.motion.div>
      </framer_motion_1.motion.div>
    </form_1.ValidatedForm>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
