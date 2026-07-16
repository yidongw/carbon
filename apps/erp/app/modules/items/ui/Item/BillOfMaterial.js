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
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var ConfigurationEditor_1 = require("~/components/Configurator/ConfigurationEditor");
var Form_1 = require("~/components/Form");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var SortableList_1 = require("~/components/SortableList");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var items_models_1 = require("../../items.models");
var ItemForm_1 = require("./ItemForm");
var initialMethodMaterial = {
    itemId: "",
    // @ts-expect-error
    itemType: "Item",
    methodType: "Purchase to Order",
    sourcingType: "Specified",
    description: "",
    quantity: 1,
    unitOfMeasureCode: "EA",
    storageUnitIds: {}
};
var BillOfMaterial = function (_a) {
    var _b;
    var methodBindings = _a.methodBindings, _c = _a.configurable, configurable = _c === void 0 ? false : _c, configurationRules = _a.configurationRules, makeMethod = _a.makeMethod, initialMaterials = _a.materials, operations = _a.operations, parameters = _a.parameters, replenishmentSystem = _a.replenishmentSystem, configurationRuleBindings = _a.configurationRuleBindings;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var isReadOnly = permissions.can("update", "parts") === false ||
        makeMethod.status !== "Draft";
    var addItemButtonRef = (0, react_2.useRef)(null);
    var items = (0, stores_1.useItems)()[0];
    var fetcher = (0, react_router_1.useFetcher)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var makeMethodId = makeMethod.id;
    var materialId = searchParams.get("materialId");
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
    // Add initial materials to map
    initialMaterials.forEach(function (material) {
        if (!material.id)
            return;
        materialsById.set(material.id, material);
    });
    var pendingMaterials = usePendingMaterials(methodBindings);
    // Replace existing materials with pending ones
    pendingMaterials.forEach(function (pendingMaterial) {
        var _a, _b;
        if (!pendingMaterial.id) {
            materialsById.set("temporary", __assign(__assign({}, pendingMaterial), { description: "", item: {
                    name: "",
                    itemTrackingType: "Inventory",
                    replenishmentSystem: "Buy and Make",
                    defaultMethodType: (_a = pendingMaterial.methodType) !== null && _a !== void 0 ? _a : "Pull from Inventory",
                    sourcingType: (_b = pendingMaterial.sourcingType) !== null && _b !== void 0 ? _b : "Specified"
                } }));
        }
        else {
            materialsById.set(pendingMaterial.id, __assign(__assign({}, materialsById.get(pendingMaterial.id)), pendingMaterial));
        }
    });
    // Add temporary items
    Object.entries(temporaryItems).forEach(function (_a) {
        var id = _a[0], material = _a[1];
        materialsById.set(id, material);
    });
    var rulesByField = new Map((_b = configurationRules === null || configurationRules === void 0 ? void 0 : configurationRules.map(function (rule) { return [rule.field, rule]; })) !== null && _b !== void 0 ? _b : []);
    var materials = makeItems(items, Array.from(materialsById.values()), orderState, checkedState, rulesByField, replenishmentSystem).sort(function (a, b) { return a.data.order - b.data.order; });
    var onToggleItem = function (id) {
        if (isReadOnly)
            return;
        setCheckedState(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[id] = !prev[id], _a)));
        });
    };
    var onAddItem = function () {
        if (isReadOnly)
            return;
        var materialId = (0, nanoid_1.nanoid)();
        setSelectedItemId(materialId);
        setSearchParams({ materialId: materialId });
        var newOrder = 1;
        if (materials.length) {
            newOrder = Math.max.apply(Math, materials.map(function (item) { return item.data.order; })) + 1;
        }
        var newMaterial = __assign(__assign({}, initialMethodMaterial), { id: materialId, order: newOrder, makeMethodId: makeMethodId });
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
            if (isReadOnly)
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
                    action: methodBindings.urls.deleteMethodMaterial(id)
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
    var updateSortOrder = (0, react_1.useThrottle)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        fetcher.submit(formData, {
            method: "post",
            action: methodBindings.urls.methodMaterialsOrder
        });
    }, 1000);
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
        // Only send non-temporary items to the server
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
    var onCloseOnDrag = (0, react_2.useCallback)(function () {
        setCheckedState(function (prev) {
            var newState = __assign({}, prev);
            var changed = false;
            materials.forEach(function (material) {
                if (material.checked) {
                    newState[material.id] = false;
                    changed = true;
                }
            });
            return changed ? newState : prev;
        });
    }, [materials]);
    var _h = (0, hooks_1.useUrlParams)(), setSearchParams = _h[1];
    var renderListItem = function (_a) {
        var item = _a.item, items = _a.items, order = _a.order, onToggleItem = _a.onToggleItem, onRemoveItem = _a.onRemoveItem;
        var isOpen = item.id === selectedItemId;
        var onSelectItem = function (id) {
            setSearchParams({ materialId: id });
            setSelectedItemId(id);
        };
        return (<SortableList_1.SortableListItem isReadOnly={isReadOnly} item={item} items={items} order={order} key={item.id} isExpanded={isOpen} isHighlighted={item.id === materialId} onSelectItem={onSelectItem} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} handleDrag={onCloseOnDrag} className="my-2 " renderExtra={function (item) { return (<div key={"".concat(isOpen)}>
            <framer_motion_1.motion.button layout onClick={isOpen
                    ? function () {
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
                  <lu_1.LuSettings2 className="stroke-1 h-5 w-5 text-foreground/80 hover:stroke-primary/70"/>
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
                          <MaterialForm methodBindings={methodBindings} configurable={configurable} isReadOnly={isReadOnly} item={item} methodOperations={operations} orderState={orderState} temporaryItems={temporaryItems} rulesByField={rulesByField} onConfigure={onConfigure} replenishmentSystem={replenishmentSystem} setOrderState={setOrderState} setSelectedItemId={setSelectedItemId} setTemporaryItems={setTemporaryItems} onSubmit={function () {
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
    var configuratorDisclosure = (0, react_1.useDisclosure)();
    var _j = (0, react_2.useState)(null), configuration = _j[0], setConfiguration = _j[1];
    var onConfigure = function (configuration) {
        (0, react_dom_1.flushSync)(function () {
            setConfiguration(configuration);
        });
        configuratorDisclosure.onOpen();
    };
    return (<react_1.Card>
      <react_1.HStack className="justify-between">
        <react_1.CardHeader>
          <react_1.CardTitle className="flex flex-row items-center gap-2">
            <macro_1.Trans>Bill of Material</macro_1.Trans> {isReadOnly && <lu_1.LuLock />}
          </react_1.CardTitle>
        </react_1.CardHeader>

        <react_1.CardAction>
          <div className="flex items-center gap-2">
            <react_1.Button ref={addItemButtonRef} variant="secondary" isDisabled={isReadOnly} onClick={onAddItem}>
              <macro_1.Trans>Add Item</macro_1.Trans>
            </react_1.Button>
            {configurable && materials.length > 0 && (<react_1.IconButton icon={<lu_1.LuSquareFunction />} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Configure"], ["Configure"])))} variant="ghost" className={(0, react_1.cn)(rulesByField.has("billOfMaterial:".concat(makeMethodId, ":").concat(materialId)) && "text-emerald-500 hover:text-emerald-500")} onClick={function () {
                var _a;
                return onConfigure({
                    label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Bill of Material"], ["Bill of Material"]))),
                    field: "billOfMaterial:".concat(makeMethodId, ":").concat(materialId),
                    code: (_a = rulesByField.get("billOfMaterial:".concat(makeMethodId, ":").concat(materialId))) === null || _a === void 0 ? void 0 : _a.code,
                    returnType: {
                        type: "list",
                        listOptions: materials
                            .map(function (m) { var _a; return (_a = (0, utils_1.getItemReadableId)(items, m.data.itemId)) !== null && _a !== void 0 ? _a : ""; })
                            .filter(function (i) { return !!i; })
                    }
                });
            }}/>)}
          </div>
        </react_1.CardAction>
      </react_1.HStack>
      <react_1.CardContent>
        <SortableList_1.SortableList isReadOnly={isReadOnly} items={materials} onReorder={onReorder} onToggleItem={onToggleItem} onRemoveItem={onRemoveItem} renderItem={renderListItem}/>
      </react_1.CardContent>
      {configuratorDisclosure.isOpen && configuration && (<ConfigurationEditor_1.ConfigurationEditor configuration={configuration} open={configuratorDisclosure.isOpen} parameters={parameters !== null && parameters !== void 0 ? parameters : []} onClose={configuratorDisclosure.onClose} configurationRuleBindings={configurationRuleBindings}/>)}
    </react_1.Card>);
};
exports.default = BillOfMaterial;
function MaterialForm(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    var methodBindings = _a.methodBindings, configurable = _a.configurable, isReadOnly = _a.isReadOnly, item = _a.item, methodOperations = _a.methodOperations, temporaryItems = _a.temporaryItems, rulesByField = _a.rulesByField, onConfigure = _a.onConfigure, replenishmentSystem = _a.replenishmentSystem, setOrderState = _a.setOrderState, setSelectedItemId = _a.setSelectedItemId, setTemporaryItems = _a.setTemporaryItems, onSubmit = _a.onSubmit;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var methodMaterialFetcher = (0, react_router_1.useFetcher)();
    var _w = (0, hooks_1.useUser)(), company = _w.company, defaults = _w.defaults;
    var _x = (0, react_2.useState)((_b = defaults.locationId) !== null && _b !== void 0 ? _b : undefined), locationId = _x[0], setLocationId = _x[1];
    var storageUnits = (0, StorageUnit_1.useStorageUnits)(locationId);
    (0, react_2.useEffect)(function () {
        if (defaults.locationId) {
            setLocationId(defaults.locationId);
        }
    }, [defaults.locationId]);
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var sourceDisclosure = (0, react_1.useDisclosure)({
        defaultIsOpen: true
    });
    var sourcingDisclosure = (0, react_1.useDisclosure)();
    var backflushDisclosure = (0, react_1.useDisclosure)();
    (0, react_2.useEffect)(function () {
        // Remove from temporary items after successful submission
        if (methodMaterialFetcher.data && methodMaterialFetcher.data.id) {
            // Clear temporary item after successful save
            setTemporaryItems(function (prev) {
                var _a = prev, _b = item.id, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return rest;
            });
            if (methodMaterialFetcher.data.success) {
                react_1.toast.success(methodMaterialFetcher.data.message);
            }
            onSubmit();
        }
    }, [item.id, methodMaterialFetcher.data, setTemporaryItems, onSubmit]);
    var _y = (0, react_2.useState)(item.data.itemType), itemType = _y[0], setItemType = _y[1];
    var _z = (0, react_2.useState)({
        itemId: (_c = item.data.itemId) !== null && _c !== void 0 ? _c : "",
        methodType: (_d = item.data.methodType) !== null && _d !== void 0 ? _d : "Pull from Inventory",
        sourcingType: (_e = item.data.sourcingType) !== null && _e !== void 0 ? _e : "Specified",
        description: (_f = item.data.description) !== null && _f !== void 0 ? _f : "",
        unitOfMeasureCode: (_g = item.data.unitOfMeasureCode) !== null && _g !== void 0 ? _g : "EA",
        methodOperationId: (_h = item.data.methodOperationId) !== null && _h !== void 0 ? _h : undefined,
        quantity: (_j = item.data.quantity) !== null && _j !== void 0 ? _j : 1,
        kit: (_k = item.data.kit) !== null && _k !== void 0 ? _k : false,
        storageUnitIds: (_l = item.data.storageUnitIds) !== null && _l !== void 0 ? _l : {},
        requiresBatchTracking: ((_m = item.data.item) === null || _m === void 0 ? void 0 : _m.itemTrackingType) === "Batch",
        requiresSerialTracking: ((_o = item.data.item) === null || _o === void 0 ? void 0 : _o.itemTrackingType) === "Serial",
        itemReplenishmentSystem: (_r = (_q = (_p = item.data.item) === null || _p === void 0 ? void 0 : _p.replenishmentSystem) !== null && _q !== void 0 ? _q : replenishmentSystem) !== null && _r !== void 0 ? _r : "Buy"
    }), itemData = _z[0], setItemData = _z[1];
    var onTypeChange = function (value) {
        if (value === itemType)
            return;
        setItemType(value);
        setItemData({
            itemId: "",
            methodType: "",
            sourcingType: "Specified",
            quantity: 1,
            description: "",
            unitOfMeasureCode: "EA",
            kit: false,
            storageUnitIds: {},
            methodOperationId: undefined,
            requiresBatchTracking: false,
            requiresSerialTracking: false,
            itemReplenishmentSystem: replenishmentSystem !== null && replenishmentSystem !== void 0 ? replenishmentSystem : "Buy"
        });
    };
    var onItemChange = function (itemId) { return __awaiter(_this, void 0, void 0, function () {
        var item;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    if (methodBindings.bomItemBlacklistId &&
                        itemId === methodBindings.bomItemBlacklistId) {
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["An item cannot be added to itself."], ["An item cannot be added to itself."]))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, carbon
                            .from("item")
                            .select("name, readableIdWithRevision, type, unitOfMeasureCode, defaultMethodType, sourcingType, replenishmentSystem, itemTrackingType")
                            .eq("id", itemId)
                            .eq("companyId", company.id)
                            .single()];
                case 1:
                    item = _b.sent();
                    if (item.error) {
                        react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Failed to load item details"], ["Failed to load item details"]))));
                        return [2 /*return*/];
                    }
                    // Method type and sourcing are item-level properties; mirror them here so
                    // the read-only display matches the item the moment it's selected.
                    setItemData(function (d) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        return (__assign(__assign({}, d), { itemId: itemId, description: (_b = (_a = item.data) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", unitOfMeasureCode: (_d = (_c = item.data) === null || _c === void 0 ? void 0 : _c.unitOfMeasureCode) !== null && _d !== void 0 ? _d : "EA", methodType: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.defaultMethodType) !== null && _f !== void 0 ? _f : "Pull from Inventory", sourcingType: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.sourcingType) !== null && _h !== void 0 ? _h : "Specified", kit: false, requiresBatchTracking: ((_j = item.data) === null || _j === void 0 ? void 0 : _j.itemTrackingType) === "Batch", requiresSerialTracking: ((_k = item.data) === null || _k === void 0 ? void 0 : _k.itemTrackingType) === "Serial", itemReplenishmentSystem: (_m = (_l = item.data) === null || _l === void 0 ? void 0 : _l.replenishmentSystem) !== null && _m !== void 0 ? _m : "Buy" }));
                    });
                    if ((_a = item.data) === null || _a === void 0 ? void 0 : _a.type) {
                        setItemType(item.data.type);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var key = function (field) { return getFieldKey(field, item.id); };
    var isTracked = itemData.requiresBatchTracking || itemData.requiresSerialTracking;
    return (<form_1.ValidatedForm action={temporaryItems[item.id]
            ? methodBindings.urls.newMethodMaterial
            : methodBindings.urls.methodMaterial(item.id)} method="post" defaultValues={__assign({}, item.data)} validator={items_models_1.methodMaterialValidator} className="w-full flex flex-col gap-y-4" fetcher={methodMaterialFetcher}>
      <div>
        <Form_1.Hidden name="id"/>
        <Form_1.Hidden name="makeMethodId"/>
        <Form_1.Hidden name="order"/>
        <Form_1.Hidden name="kit" value={itemData.kit.toString()}/>
        <Form_1.Hidden name="storageUnitIds" value={JSON.stringify(itemData.storageUnitIds)}/>
        {/* methodType and sourcingType are item-level properties; the fields
            above are read-only mirrors. They're still submitted to satisfy
            methodMaterialValidator, but upsertMethodMaterial re-derives both
            from the component item, so the submitted values are display-only —
            don't treat them as the source of truth. */}
        {itemData.itemReplenishmentSystem !== "Buy and Make" && (<Form_1.Hidden name="sourcingType" value={itemData.sourcingType}/>)}
      </div>

      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
        <Form_1.Item blacklist={methodBindings.bomItemBlacklistId
            ? [methodBindings.bomItemBlacklistId]
            : []} name="itemId" label={itemType} includeInactive type={itemType} validItemTypes={["Consumable", "Material", "Part"]} isConfigured={rulesByField.has(key("itemId"))} onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }} onConfigure={configurable && !temporaryItems[item.id]
            ? function () {
                var _a;
                return onConfigure({
                    label: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Part"], ["Part"]))),
                    field: key("itemId"),
                    code: (_a = rulesByField.get(key("itemId"))) === null || _a === void 0 ? void 0 : _a.code,
                    defaultValue: itemData.itemId,
                    returnType: {
                        type: "text",
                        helperText: "the unique item identifier of the item (not the part number). you can get the item id from the key icon in the properties panel."
                    }
                });
            }
            : undefined} onTypeChange={onTypeChange}/>
        <Form_1.Number name="quantity" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Quantity"], ["Quantity"])))} isConfigured={rulesByField.has(key("quantity"))} onConfigure={configurable && !temporaryItems[item.id]
            ? function () {
                var _a;
                return onConfigure({
                    label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
                    field: key("quantity"),
                    code: (_a = rulesByField.get(key("quantity"))) === null || _a === void 0 ? void 0 : _a.code,
                    defaultValue: itemData.quantity,
                    returnType: { type: "numeric" }
                });
            }
            : undefined}/>
        <Form_1.UnitOfMeasure name="unitOfMeasureCode" value={itemData.unitOfMeasureCode} onChange={function (newValue) {
            return setItemData(function (d) {
                var _a;
                return (__assign(__assign({}, d), { unitOfMeasureCode: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "EA" }));
            });
        }} isReadOnly={true} isConfigured={rulesByField.has(key("unitOfMeasureCode"))} onConfigure={configurable && !temporaryItems[item.id]
            ? function () {
                var _a;
                return onConfigure({
                    label: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"]))),
                    field: key("unitOfMeasureCode"),
                    code: (_a = rulesByField.get(key("unitOfMeasureCode"))) === null || _a === void 0 ? void 0 : _a.code,
                    defaultValue: itemData.unitOfMeasureCode,
                    returnType: {
                        type: "enum",
                        listOptions: unitOfMeasures.map(function (u) { return u.value; })
                    }
                });
            }
            : undefined}/>
      </div>
      {itemData.itemReplenishmentSystem === "Buy and Make" && (<div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
          <react_1.HStack className="w-full justify-between cursor-pointer" onClick={sourcingDisclosure.onToggle}>
            <react_1.HStack>
              <lu_1.LuTruck className="text-foreground"/>
              <react_1.Label>Sourcing</react_1.Label>
            </react_1.HStack>
            <react_1.HStack>
              <react_1.Badge variant="secondary">
                <components_1.SourcingTypeIcon type={itemData.sourcingType} className="size-3 mr-1"/>
                {itemData.sourcingType}
              </react_1.Badge>
              <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={sourcingDisclosure.isOpen
                ? "Collapse Sourcing"
                : "Expand Sourcing"} variant="ghost" size="md" onClick={function (e) {
                e.stopPropagation();
                sourcingDisclosure.onToggle();
            }} className={"transition-transform ".concat(sourcingDisclosure.isOpen ? "rotate-90" : "")}/>
            </react_1.HStack>
          </react_1.HStack>
          <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(sourcingDisclosure.isOpen ? "" : "hidden")}>
            {/* Read-only: sourcing is set at the item level (Properties
                sidebar) and mirrored here. */}
            <Form_1.Select name="sourcingType" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Sourcing Type"], ["Sourcing Type"])))} value={itemData.sourcingType} isReadOnly options={shared_1.sourcingType.map(function (s) { return ({
                value: s,
                label: (<span className="flex items-center gap-2">
                    <components_1.SourcingTypeIcon type={s}/>
                    {s}
                  </span>)
            }); })}/>
          </div>
        </div>)}

      <div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
        <react_1.HStack className="w-full justify-between cursor-pointer" onClick={sourceDisclosure.onToggle}>
          <react_1.HStack>
            {itemData.methodType === "Make to Order" ? (<>
                <lu_1.LuGitPullRequestCreate />
                <react_1.Label>Finish To</react_1.Label>
              </>) : (<>
                <lu_1.LuGitPullRequest />
                <react_1.Label>Pull From</react_1.Label>
              </>)}
          </react_1.HStack>
          <react_1.HStack>
            <react_1.Badge variant="secondary">
              <components_1.MethodIcon type={itemData.methodType} className="size-3 mr-1"/>
              {itemData.methodType === "Purchase to Order"
            ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : itemData.methodType === "Pull from Inventory"
            ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Make to Order"], ["Make to Order"])))}
            </react_1.Badge>
            <lu_1.LuArrowLeft className={(0, react_1.cn)(itemData.methodType !== "Pull from Inventory"
            ? "rotate-180"
            : "")}/>
            <react_1.Badge variant="secondary">
              <lu_1.LuGitPullRequest className="size-3 mr-1"/>
              {(_u = (_t = (_s = storageUnits.options) === null || _s === void 0 ? void 0 : _s.find(function (s) { return s.value === itemData.storageUnitIds[locationId !== null && locationId !== void 0 ? locationId : ""]; })) === null || _t === void 0 ? void 0 : _t.label) !== null && _u !== void 0 ? _u : (itemData.methodType === "Make to Order"
            ? "WIP"
            : "Default Storage Unit")}
            </react_1.Badge>
            <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={sourceDisclosure.isOpen ? "Collapse Source" : "Expand Source"} variant="ghost" onClick={function (e) {
            e.stopPropagation();
            sourceDisclosure.onToggle();
        }} className={"transition-transform ".concat(sourceDisclosure.isOpen ? "rotate-90" : "")}/>
          </react_1.HStack>
        </react_1.HStack>
        <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(sourceDisclosure.isOpen ? "" : "hidden")}>
          {/* Read-only: method type is the item's default method type
            (Properties sidebar) and mirrored here. */}
          <Form_1.DefaultMethodType name="methodType" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Method Type"], ["Method Type"])))} value={itemData.methodType} isReadOnly isConfigured={rulesByField.has(key("methodType"))} onConfigure={configurable && !temporaryItems[item.id]
            ? function () {
                var _a;
                return onConfigure({
                    label: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Method Type"], ["Method Type"]))),
                    field: key("methodType"),
                    code: (_a = rulesByField.get(key("methodType"))) === null || _a === void 0 ? void 0 : _a.code,
                    defaultValue: itemData.methodType,
                    returnType: {
                        type: "enum",
                        listOptions: shared_1.methodType
                    }
                });
            }
            : undefined} replenishmentSystem={itemData.itemReplenishmentSystem}/>
          <Form_1.Location name="locationId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Location"], ["Location"])))} value={locationId} onChange={function (value) {
            setLocationId(value === null || value === void 0 ? void 0 : value.value);
        }}/>
          <Form_1.StorageUnit name="storageUnitId" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} value={itemData.storageUnitIds[locationId !== null && locationId !== void 0 ? locationId : ""]} locationId={locationId} onChange={function (value) {
            setItemData(function (d) {
                var _a;
                var _b;
                return (__assign(__assign({}, d), { storageUnitIds: __assign(__assign({}, d.storageUnitIds), (_a = {}, _a[locationId !== null && locationId !== void 0 ? locationId : ""] = (_b = value === null || value === void 0 ? void 0 : value.id) !== null && _b !== void 0 ? _b : "", _a)) }));
            });
        }} isOptional/>
        </div>
      </div>

      <div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
        <react_1.HStack className="w-full justify-between cursor-pointer" onClick={backflushDisclosure.onToggle}>
          <react_1.HStack>
            <lu_1.LuGitPullRequestCreateArrow />
            <react_1.Label>{isTracked ? t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Operation"], ["Operation"]))) : t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Backflush"], ["Backflush"])))}</react_1.Label>
          </react_1.HStack>
          <react_1.HStack>
            <react_1.Badge variant={methodOperations.length > 0 ? "secondary" : "destructive"}>
              <lu_1.LuCog className="size-3 mr-1"/>
              {itemData.methodOperationId
            ? ((_v = methodOperations.find(function (o) { return o.id === itemData.methodOperationId; })) === null || _v === void 0 ? void 0 : _v.description) || "Selected Operation"
            : "First Operation"}
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
          <Form_1.Select name="methodOperationId" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Operation"], ["Operation"])))} isOptional options={methodOperations.map(function (o) { return ({
            value: o.id,
            label: o.description
        }); })} onChange={function (value) {
            setItemData(function (d) { return (__assign(__assign({}, d), { methodOperationId: value === null || value === void 0 ? void 0 : value.value })); });
        }}/>
        </div>
      </div>

      <framer_motion_1.motion.div className="flex flex-1 items-center justify-end w-full" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{
            type: "spring",
            bounce: 0,
            duration: 0.55
        }}>
        <framer_motion_1.motion.div layout className="flex items-center justify-between gap-2 w-full">
          {itemData.methodType === "Make to Order" ? (<react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.Button leftIcon={<components_1.MethodIcon type={"Make to Order"} isKit={itemData.kit}/>} variant="secondary" size="sm" rightIcon={<lu_1.LuChevronDown />}>
                  {itemData.kit ? t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Kit"], ["Kit"]))) : t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Subassembly"], ["Subassembly"])))}
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

          <div className="flex items-center gap-2">
            <Form_1.Submit isDisabled={isReadOnly || methodMaterialFetcher.state !== "idle"} isLoading={methodMaterialFetcher.state === "submitting"}>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.Submit>
          </div>
        </framer_motion_1.motion.div>
      </framer_motion_1.motion.div>
    </form_1.ValidatedForm>);
}
function makeItems(items, materials, orderState, checkedState, rulesByField, replenishmentSystem) {
    return materials.map(function (material) {
        var _a, _b;
        var order = material.id
            ? ((_a = orderState[material.id]) !== null && _a !== void 0 ? _a : material.order)
            : material.order;
        var checked = material.id ? ((_b = checkedState[material.id]) !== null && _b !== void 0 ? _b : false) : false;
        return makeItem(items, material, order, checked, rulesByField, replenishmentSystem);
    });
}
function materialHasRules(materialId, rulesByField) {
    if (!rulesByField)
        return false;
    var fields = ["itemId", "quantity", "unitOfMeasureCode", "methodType"];
    return fields.some(function (field) {
        return rulesByField.has(getFieldKey(field, materialId));
    });
}
function makeItem(items, material, order, checked, rulesByField, replenishmentSystem) {
    var _a, _b, _c, _d, _e;
    var hasRules = material.id
        ? materialHasRules(material.id, rulesByField)
        : false;
    return {
        id: material.id,
        title: (<react_1.VStack spacing={0} className="py-1 cursor-pointer">
        <div className="flex items-center gap-2 group">
          <h3 className="font-semibold truncate">
            {(_a = (0, utils_1.getItemReadableId)(items, material.itemId)) !== null && _a !== void 0 ? _a : ""}
          </h3>
          {hasRules && (<lu_1.LuSquareFunction className="h-3.5 w-3.5 text-emerald-500 shrink-0"/>)}
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
        {["Batch", "Serial"].includes((_c = (_b = material.item) === null || _b === void 0 ? void 0 : _b.itemTrackingType) !== null && _c !== void 0 ? _c : "") && (<react_1.Tooltip>
            <react_1.TooltipTrigger>
              <react_1.Badge variant="secondary">
                <components_1.TrackingTypeIcon type={(_e = (_d = material.item) === null || _d === void 0 ? void 0 : _d.itemTrackingType) !== null && _e !== void 0 ? _e : ""}/>
              </react_1.Badge>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              {material.item.itemTrackingType === "Inventory" ? (<macro_1.Trans>Inventory Tracking</macro_1.Trans>) : material.item.itemTrackingType === "Non-Inventory" ? (<macro_1.Trans>Non-Inventory Tracking</macro_1.Trans>) : material.item.itemTrackingType === "Serial" ? (<macro_1.Trans>Serial Tracking</macro_1.Trans>) : (<macro_1.Trans>Batch Tracking</macro_1.Trans>)}
            </react_1.TooltipContent>
          </react_1.Tooltip>)}

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

        {replenishmentSystem === "Buy and Make" && (<react_1.Tooltip>
            <react_1.TooltipTrigger>
              <react_1.Badge variant="secondary">
                <components_1.SourcingTypeIcon type={material.sourcingType}/>
              </react_1.Badge>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>{material.sourcingType}</react_1.TooltipContent>
          </react_1.Tooltip>)}

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
function getFieldKey(field, itemId) {
    return "".concat(field, ":").concat(itemId);
}
var usePendingMaterials = function (methodBindings) {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        var _a, _b;
        return ((_b = (fetcher.formAction === methodBindings.urls.newMethodMaterial ||
            ((_a = fetcher.formAction) === null || _a === void 0 ? void 0 : _a.includes("/methods/material/")))) !== null && _b !== void 0 ? _b : false);
    })
        .reduce(function (acc, fetcher) {
        var formData = fetcher.formData;
        var material = items_models_1.methodMaterialValidator.safeParse(Object.fromEntries(formData));
        if (material.success) {
            return __spreadArray(__spreadArray([], acc, true), [material.data], false);
        }
        return acc;
    }, []);
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21;
