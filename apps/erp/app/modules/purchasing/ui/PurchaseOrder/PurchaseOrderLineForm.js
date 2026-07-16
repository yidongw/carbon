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
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var purchasing_1 = require("~/modules/purchasing");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var DeletePurchaseOrderLine_1 = require("./DeletePurchaseOrderLine");
var PurchaseOrderLineForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34;
    var initialValues = _a.initialValues, type = _a.type, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var items = (0, stores_1.useItems)()[0];
    var company = (0, hooks_1.useUser)().company;
    var orderId = (0, react_router_1.useParams)().orderId;
    var fetcher = (0, react_router_1.useFetcher)();
    if (!orderId)
        throw new Error("orderId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseOrder(orderId));
    var isOutsideProcessing = ((_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _b === void 0 ? void 0 : _b.purchaseOrderType) === "Outside Processing";
    var isLocked = (0, purchasing_1.isPurchaseOrderLocked)((_c = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _c === void 0 ? void 0 : _c.status);
    var _35 = (0, react_2.useState)(initialValues.purchaseOrderLineType), itemType = _35[0], setItemType = _35[1];
    var _36 = (0, react_2.useState)(initialValues.locationId), locationId = _36[0], setLocationId = _36[1];
    var _37 = (0, react_2.useState)({
        itemId: (_d = initialValues.itemId) !== null && _d !== void 0 ? _d : "",
        conversionFactor: (_e = initialValues.conversionFactor) !== null && _e !== void 0 ? _e : 1,
        description: (_f = initialValues.description) !== null && _f !== void 0 ? _f : "",
        fallbackUnitPrice: (_g = initialValues.supplierUnitPrice) !== null && _g !== void 0 ? _g : 0,
        inventoryUom: (_h = initialValues.inventoryUnitOfMeasureCode) !== null && _h !== void 0 ? _h : "",
        minimumOrderQuantity: undefined,
        purchaseQuantity: (_j = initialValues.purchaseQuantity) !== null && _j !== void 0 ? _j : 1,
        purchaseUom: (_k = initialValues.purchaseUnitOfMeasureCode) !== null && _k !== void 0 ? _k : "",
        priceBreaks: [],
        requiredDate: (_l = initialValues === null || initialValues === void 0 ? void 0 : initialValues.requiredDate) !== null && _l !== void 0 ? _l : null,
        storageUnitId: (_m = initialValues.storageUnitId) !== null && _m !== void 0 ? _m : "",
        supplierPartId: (_o = initialValues.supplierPartId) !== null && _o !== void 0 ? _o : "",
        supplierShippingCost: (_p = initialValues.supplierShippingCost) !== null && _p !== void 0 ? _p : 0,
        supplierTaxAmount: (_q = initialValues.supplierTaxAmount) !== null && _q !== void 0 ? _q : 0,
        supplierUnitPrice: (_r = initialValues.supplierUnitPrice) !== null && _r !== void 0 ? _r : 0,
        taxPercent: ((_s = initialValues.supplierUnitPrice) !== null && _s !== void 0 ? _s : 0) *
            ((_t = initialValues.purchaseQuantity) !== null && _t !== void 0 ? _t : 1) +
            ((_u = initialValues.supplierShippingCost) !== null && _u !== void 0 ? _u : 0) >
            0
            ? ((_v = initialValues.supplierTaxAmount) !== null && _v !== void 0 ? _v : 0) /
                (((_w = initialValues.supplierUnitPrice) !== null && _w !== void 0 ? _w : 0) *
                    ((_x = initialValues.purchaseQuantity) !== null && _x !== void 0 ? _x : 1) +
                    ((_y = initialValues.supplierShippingCost) !== null && _y !== void 0 ? _y : 0))
            : 0
    }), itemData = _37[0], setItemData = _37[1];
    // update tax amount when quantity or unit price changes
    (0, react_2.useEffect)(function () {
        var subtotal = itemData.supplierUnitPrice * itemData.purchaseQuantity +
            itemData.supplierShippingCost;
        if (itemData.taxPercent !== 0) {
            setItemData(function (d) { return (__assign(__assign({}, d), { supplierTaxAmount: subtotal * itemData.taxPercent })); });
        }
    }, [
        itemData.supplierUnitPrice,
        itemData.purchaseQuantity,
        itemData.supplierShippingCost,
        itemData.taxPercent
    ]);
    var isEditing = initialValues.id !== undefined;
    var isGLAccount = initialValues.purchaseOrderLineType === "G/L Account";
    var isFixedAsset = initialValues.purchaseOrderLineType === "Fixed Asset";
    var _38 = (0, react_2.useState)(isFixedAsset ? "asset" : isGLAccount ? "gl-account" : "item"), activeTab = _38[0], setActiveTab = _38[1];
    var _39 = (0, react_2.useState)({
        accountId: (_z = initialValues.accountId) !== null && _z !== void 0 ? _z : "",
        assetId: (_0 = initialValues.assetId) !== null && _0 !== void 0 ? _0 : "",
        costCenterId: (_1 = initialValues.costCenterId) !== null && _1 !== void 0 ? _1 : "",
        description: (_2 = initialValues.description) !== null && _2 !== void 0 ? _2 : "",
        purchaseQuantity: (_3 = initialValues.purchaseQuantity) !== null && _3 !== void 0 ? _3 : 1,
        requiredDate: (_4 = initialValues.requiredDate) !== null && _4 !== void 0 ? _4 : null,
        supplierUnitPrice: (_5 = initialValues.supplierUnitPrice) !== null && _5 !== void 0 ? _5 : 0,
        supplierShippingCost: (_6 = initialValues.supplierShippingCost) !== null && _6 !== void 0 ? _6 : 0,
        supplierTaxAmount: (_7 = initialValues.supplierTaxAmount) !== null && _7 !== void 0 ? _7 : 0,
        taxPercent: ((_8 = initialValues.supplierUnitPrice) !== null && _8 !== void 0 ? _8 : 0) *
            ((_9 = initialValues.purchaseQuantity) !== null && _9 !== void 0 ? _9 : 1) +
            ((_10 = initialValues.supplierShippingCost) !== null && _10 !== void 0 ? _10 : 0) >
            0
            ? ((_11 = initialValues.supplierTaxAmount) !== null && _11 !== void 0 ? _11 : 0) /
                (((_12 = initialValues.supplierUnitPrice) !== null && _12 !== void 0 ? _12 : 0) *
                    ((_13 = initialValues.purchaseQuantity) !== null && _13 !== void 0 ? _13 : 1) +
                    ((_14 = initialValues.supplierShippingCost) !== null && _14 !== void 0 ? _14 : 0))
            : 0
    }), indirectData = _39[0], setIndirectData = _39[1];
    (0, react_2.useEffect)(function () {
        var subtotal = indirectData.supplierUnitPrice * indirectData.purchaseQuantity +
            indirectData.supplierShippingCost;
        if (indirectData.taxPercent !== 0) {
            setIndirectData(function (d) { return (__assign(__assign({}, d), { supplierTaxAmount: subtotal * indirectData.taxPercent })); });
        }
    }, [
        indirectData.supplierUnitPrice,
        indirectData.purchaseQuantity,
        indirectData.supplierShippingCost,
        indirectData.taxPercent
    ]);
    var costsDisclosure = (0, react_1.useDisclosure)();
    var indirectCostsDisclosure = (0, react_1.useDisclosure)();
    var _40 = (0, react_2.useState)([]), assetOptions = _40[0], setAssetOptions = _40[1];
    (0, react_1.useMount)(function () {
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var assets, options, current;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, carbon
                            .from("fixedAsset")
                            .select("id, fixedAssetId, name, locationId")
                            .eq("companyId", company.id)
                            .eq("status", "Draft")
                            .order("fixedAssetId")];
                    case 1:
                        assets = _b.sent();
                        options = ((_a = assets.data) !== null && _a !== void 0 ? _a : []).map(function (a) { return ({
                            value: a.id,
                            label: "".concat(a.fixedAssetId, " \u2014 ").concat(a.name),
                            locationId: a.locationId
                        }); });
                        if (!(initialValues.assetId &&
                            !options.some(function (o) { return o.value === initialValues.assetId; }))) return [3 /*break*/, 3];
                        return [4 /*yield*/, carbon
                                .from("fixedAsset")
                                .select("id, fixedAssetId, name, locationId")
                                .eq("id", initialValues.assetId)
                                .single()];
                    case 2:
                        current = _b.sent();
                        if (current.data) {
                            options.unshift({
                                value: current.data.id,
                                label: "".concat(current.data.fixedAssetId, " \u2014 ").concat(current.data.name),
                                locationId: current.data.locationId
                            });
                        }
                        _b.label = 3;
                    case 3:
                        setAssetOptions(options);
                        return [2 /*return*/];
                }
            });
        }); })();
    });
    // Load price breaks on mount when editing so quantity changes resolve correctly
    (0, react_1.useMount)(function () {
        var _a;
        if (!isEditing || !initialValues.itemId)
            return;
        var supplierId = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _a === void 0 ? void 0 : _a.supplierId;
        if (!supplierId)
            return;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var supplierPart, breaks_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, carbon
                            .from("supplierPart")
                            .select("id")
                            .eq("itemId", initialValues.itemId)
                            .eq("companyId", company.id)
                            .eq("supplierId", supplierId)
                            .maybeSingle()];
                    case 1:
                        supplierPart = _b.sent();
                        if (!((_a = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _a === void 0 ? void 0 : _a.id)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, items_1.getSupplierPartPriceBreaks)(carbon, supplierPart.data.id)];
                    case 2:
                        breaks_1 = _b.sent();
                        setItemData(function (d) { return (__assign(__assign({}, d), { priceBreaks: breaks_1 })); });
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    });
    var isDisabled = isEditing
        ? !permissions.can("update", "purchasing")
        : !permissions.can("create", "purchasing");
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var onTypeChange = function (t) {
        if (t === itemType)
            return;
        setItemType(t);
        setItemData({
            itemId: "",
            conversionFactor: 1,
            description: "",
            fallbackUnitPrice: 0,
            inventoryUom: "",
            minimumOrderQuantity: undefined,
            priceBreaks: [],
            purchaseQuantity: 1,
            purchaseUom: "",
            requiredDate: null,
            storageUnitId: "",
            supplierPartId: "",
            supplierShippingCost: 0,
            supplierTaxAmount: 0,
            supplierUnitPrice: 0,
            taxPercent: 0
        });
    };
    var onItemChange = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, item, supplierPart, inventory, itemCost, itemReplenishment, exchangeRate, initialQty, leadTime, baseFallback, breaks, _c, resolvedPrice;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
        return __generator(this, function (_10) {
            switch (_10.label) {
                case 0:
                    if (!carbon)
                        throw new Error("Carbon client not found");
                    _a = itemType;
                    switch (_a) {
                        case "Item": return [3 /*break*/, 1];
                        case "Consumable": return [3 /*break*/, 1];
                        case "Material": return [3 /*break*/, 1];
                        case "Part": return [3 /*break*/, 1];
                        case "Tool": return [3 /*break*/, 1];
                        case "Service": return [3 /*break*/, 1];
                        case "Fixture": return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 6];
                case 1: return [4 /*yield*/, Promise.all([
                        carbon
                            .from("item")
                            .select("name, readableIdWithRevision, type, unitOfMeasureCode, itemCost(unitCost), itemReplenishment(purchasingUnitOfMeasureCode, conversionFactor, leadTime)")
                            .eq("id", itemId)
                            .eq("companyId", company.id)
                            .single(),
                        carbon
                            .from("supplierPart")
                            .select("*")
                            .eq("itemId", itemId)
                            .eq("companyId", company.id)
                            .eq("supplierId", routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder.supplierId)
                            .maybeSingle(),
                        carbon
                            .from("pickMethod")
                            .select("defaultStorageUnitId")
                            .eq("itemId", itemId)
                            .eq("companyId", company.id)
                            .eq("locationId", locationId)
                            .maybeSingle()
                    ])];
                case 2:
                    _b = _10.sent(), item = _b[0], supplierPart = _b[1], inventory = _b[2];
                    itemCost = (_e = (_d = item === null || item === void 0 ? void 0 : item.data) === null || _d === void 0 ? void 0 : _d.itemCost) === null || _e === void 0 ? void 0 : _e[0];
                    itemReplenishment = (_f = item === null || item === void 0 ? void 0 : item.data) === null || _f === void 0 ? void 0 : _f.itemReplenishment;
                    exchangeRate = (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _g === void 0 ? void 0 : _g.exchangeRate) !== null && _h !== void 0 ? _h : 1;
                    initialQty = (_k = (_j = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _j === void 0 ? void 0 : _j.minimumOrderQuantity) !== null && _k !== void 0 ? _k : 1;
                    leadTime = (_o = (_m = (_l = item === null || item === void 0 ? void 0 : item.data) === null || _l === void 0 ? void 0 : _l.itemReplenishment) === null || _m === void 0 ? void 0 : _m.leadTime) !== null && _o !== void 0 ? _o : 0;
                    baseFallback = ((_r = (_q = (_p = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _p === void 0 ? void 0 : _p.unitPrice) !== null && _q !== void 0 ? _q : itemCost === null || itemCost === void 0 ? void 0 : itemCost.unitCost) !== null && _r !== void 0 ? _r : 0) /
                        exchangeRate;
                    if (!((_s = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _s === void 0 ? void 0 : _s.id)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, items_1.getSupplierPartPriceBreaks)(carbon, supplierPart.data.id)];
                case 3:
                    _c = _10.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = [];
                    _10.label = 5;
                case 5:
                    breaks = _c;
                    resolvedPrice = (0, shared_1.resolveSupplierPrice)(breaks, initialQty, baseFallback, exchangeRate);
                    setItemData({
                        itemId: itemId,
                        description: (_u = (_t = item.data) === null || _t === void 0 ? void 0 : _t.name) !== null && _u !== void 0 ? _u : "",
                        purchaseQuantity: initialQty,
                        supplierUnitPrice: resolvedPrice,
                        supplierShippingCost: 0,
                        purchaseUom: (_z = (_x = (_w = (_v = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _v === void 0 ? void 0 : _v.supplierUnitOfMeasureCode) !== null && _w !== void 0 ? _w : itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.purchasingUnitOfMeasureCode) !== null && _x !== void 0 ? _x : (_y = item.data) === null || _y === void 0 ? void 0 : _y.unitOfMeasureCode) !== null && _z !== void 0 ? _z : "EA",
                        inventoryUom: (_1 = (_0 = item.data) === null || _0 === void 0 ? void 0 : _0.unitOfMeasureCode) !== null && _1 !== void 0 ? _1 : "EA",
                        conversionFactor: (_4 = (_3 = (_2 = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _2 === void 0 ? void 0 : _2.conversionFactor) !== null && _3 !== void 0 ? _3 : itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.conversionFactor) !== null && _4 !== void 0 ? _4 : 1,
                        requiredDate: leadTime === 0
                            ? null
                            : (0, date_1.today)((0, date_1.getLocalTimeZone)()).add({ days: leadTime }).toString(),
                        storageUnitId: (_6 = (_5 = inventory.data) === null || _5 === void 0 ? void 0 : _5.defaultStorageUnitId) !== null && _6 !== void 0 ? _6 : null,
                        supplierPartId: (_8 = (_7 = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _7 === void 0 ? void 0 : _7.supplierPartId) !== null && _8 !== void 0 ? _8 : "",
                        supplierTaxAmount: 0,
                        taxPercent: 0,
                        priceBreaks: breaks,
                        fallbackUnitPrice: baseFallback
                    });
                    if ((_9 = item.data) === null || _9 === void 0 ? void 0 : _9.type) {
                        setItemType(item.data.type);
                    }
                    return [3 /*break*/, 7];
                case 6: throw new Error("Invalid purchase order line type: ".concat(itemType, " is not implemented"));
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var onLocationChange = function (newLocation) { return __awaiter(void 0, void 0, void 0, function () {
        var storageUnit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        throw new Error("carbon is not defined");
                    if (typeof (newLocation === null || newLocation === void 0 ? void 0 : newLocation.value) !== "string")
                        throw new Error("locationId is not a string");
                    setLocationId(newLocation.value);
                    if (!itemData.itemId)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("pickMethod")
                            .select("defaultStorageUnitId")
                            .eq("itemId", itemData.itemId)
                            .eq("companyId", company.id)
                            .eq("locationId", newLocation.value)
                            .maybeSingle()];
                case 1:
                    storageUnit = _a.sent();
                    setItemData(function (d) {
                        var _a, _b;
                        return (__assign(__assign({}, d), { storageUnitId: (_b = (_a = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.data) === null || _a === void 0 ? void 0 : _a.defaultStorageUnitId) !== null && _b !== void 0 ? _b : "" }));
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    return (<>
      <react_1.Tabs value={activeTab} onValueChange={function (v) {
            return setActiveTab(v);
        }} className="w-full">
        <react_1.ModalCardProvider type={type}>
          <react_1.ModalCard onClose={onClose} defaultCollapsed={false} isCollapsible={isEditing}>
            <react_1.ModalCardContent size="xxlarge">
              <form_1.ValidatedForm defaultValues={initialValues} validator={purchasing_1.purchaseOrderLineValidator} method="post" action={isEditing
            ? path_1.path.to.purchaseOrderLine(orderId, initialValues.id)
            : path_1.path.to.newPurchaseOrderLine(orderId)} className="w-full" fetcher={fetcher} isDisabled={isLocked} onSuccess={type === "modal" ? onClose : undefined}>
                <react_1.HStack className={(0, react_1.cn)("w-full justify-between items-start", type === "modal" && "pr-16")}>
                  <react_1.ModalCardHeader className="flex flex-1">
                    <react_1.ModalCardTitle className={(0, react_1.cn)(isEditing &&
            !isGLAccount &&
            !isFixedAsset &&
            !(itemData === null || itemData === void 0 ? void 0 : itemData.itemId) &&
            "text-muted-foreground")}>
                      {isEditing
            ? isFixedAsset
                ? initialValues.assetReadableId || "Fixed Asset"
                : isGLAccount
                    ? indirectData.description || "G/L Account"
                    : (0, utils_1.getItemReadableId)(items, itemData === null || itemData === void 0 ? void 0 : itemData.itemId) ||
                        "..."
            : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["New Purchase Order Line"], ["New Purchase Order Line"])))}
                    </react_1.ModalCardTitle>
                    <react_1.ModalCardDescription>
                      {isOutsideProcessing ? (<react_1.Badge variant="default">Outside Processing</react_1.Badge>) : isEditing ? (<div className="flex flex-col items-start gap-1">
                          <span>
                            {isFixedAsset
                ? initialValues.assetName ||
                    indirectData.description
                : isGLAccount
                    ? "G/L Account"
                    : itemData === null || itemData === void 0 ? void 0 : itemData.description}
                          </span>
                          <div className="flex items-center gap-2">
                            <react_1.Badge variant="outline">
                              {initialValues === null || initialValues === void 0 ? void 0 : initialValues.purchaseQuantity}
                            </react_1.Badge>
                            <react_1.Badge variant="green">
                              {currencyFormatter.format(((_15 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.supplierUnitPrice) !== null && _15 !== void 0 ? _15 : 0) +
                ((_16 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.supplierShippingCost) !== null && _16 !== void 0 ? _16 : 0))}{" "}
                              {initialValues === null || initialValues === void 0 ? void 0 : initialValues.purchaseUnitOfMeasureCode}
                            </react_1.Badge>
                            {/* @ts-expect-error TS2339 */}
                            {(initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) > 0 ? (<react_1.Badge variant="red">
                                {percentFormatter.format(
                /* @ts-expect-error TS2339 */
                (_17 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) !== null && _17 !== void 0 ? _17 : 0)}{" "}
                                Tax
                              </react_1.Badge>) : null}
                          </div>
                        </div>) : (<macro_1.Trans>
                          A purchase order line contains order details for a
                          particular item
                        </macro_1.Trans>)}
                    </react_1.ModalCardDescription>
                  </react_1.ModalCardHeader>
                  <div className="flex-shrink-0">
                    {!isEditing && (<react_1.TabsList>
                        <react_1.TabsTrigger value="item">
                          <lu_1.LuBox className="mr-1"/>
                          <macro_1.Trans>Item</macro_1.Trans>
                        </react_1.TabsTrigger>
                        <react_1.TabsTrigger value="gl-account">
                          <lu_1.LuReceipt className="mr-1"/>
                          <macro_1.Trans>GL Account</macro_1.Trans>
                        </react_1.TabsTrigger>
                        <react_1.TabsTrigger value="asset">
                          <lu_1.LuLandmark className="mr-1"/>
                          <macro_1.Trans>Asset</macro_1.Trans>
                        </react_1.TabsTrigger>
                      </react_1.TabsList>)}
                  </div>
                </react_1.HStack>
                <react_1.ModalCardBody>
                  <Form_1.Hidden name="id"/>
                  <Form_1.Hidden name="purchaseOrderId"/>
                  <Form_1.Hidden name="exchangeRate" value={(_19 = (_18 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _18 === void 0 ? void 0 : _18.exchangeRate) !== null && _19 !== void 0 ? _19 : 1}/>

                  <react_1.TabsContent value="item">
                    <Form_1.Hidden name="purchaseOrderLineType" value={itemType}/>
                    <Form_1.Hidden name="inventoryUnitOfMeasureCode" value={itemData === null || itemData === void 0 ? void 0 : itemData.inventoryUom}/>
                    <react_1.VStack>
                      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                        <Form_1.Item name="itemId" label={itemType} type={itemType} locationId={locationId} replenishmentSystem={isOutsideProcessing ? undefined : "Buy"} onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }} onTypeChange={onTypeChange}/>

                        <form_1.InputControlled label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Description"], ["Description"])))} name="description" value={itemData.description} isOptional={false}/>

                        <form_1.InputControlled name="supplierPartId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier Part Number"], ["Supplier Part Number"])))} value={itemData.supplierPartId} onChange={function (value) {
            return setItemData(function (d) { return (__assign(__assign({}, d), { supplierPartId: value })); });
        }}/>

                        {isOutsideProcessing && (<JobOperationSelect jobId={initialValues.jobId}/>)}

                        <form_1.DatePicker name="requiredDate" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Required Date"], ["Required Date"])))} value={(_20 = itemData === null || itemData === void 0 ? void 0 : itemData.requiredDate) !== null && _20 !== void 0 ? _20 : undefined} onChange={function (date) {
            setItemData(function (d) { return (__assign(__assign({}, d), { requiredDate: date })); });
        }}/>

                        <Form_1.NumberControlled minValue={itemData.minimumOrderQuantity} name="purchaseQuantity" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={itemData.purchaseQuantity} onChange={function (value) {
            var _a, _b;
            var exchangeRate = (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _a === void 0 ? void 0 : _a.exchangeRate) !== null && _b !== void 0 ? _b : 1;
            setItemData(function (d) { return (__assign(__assign({}, d), { purchaseQuantity: value, supplierUnitPrice: (0, shared_1.resolveSupplierPrice)(d.priceBreaks, value, d.fallbackUnitPrice, exchangeRate) })); });
        }}/>

                        {[
            "Item",
            "Part",
            "Material",
            "Consumable",
            "Tool",
            "Service",
            "Fixture"
        ].includes(itemType) && (<>
                            <Form_1.UnitOfMeasure name="purchaseUnitOfMeasureCode" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} value={itemData.purchaseUom} onChange={function (newValue) {
                if (newValue) {
                    setItemData(function (d) { return (__assign(__assign({}, d), { purchaseUom: newValue === null || newValue === void 0 ? void 0 : newValue.value })); });
                }
            }}/>
                            <Form_1.ConversionFactor name="conversionFactor" purchasingCode={itemData.purchaseUom} inventoryCode={itemData.inventoryUom} value={itemData.conversionFactor} onChange={function (value) {
                setItemData(function (d) { return (__assign(__assign({}, d), { conversionFactor: value })); });
            }}/>
                          </>)}
                        <Form_1.NumberControlled name="supplierUnitPrice" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Unit Price"], ["Unit Price"])))} value={itemData.supplierUnitPrice} formatOptions={{
            style: "currency",
            currency: (_22 = (_21 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _21 === void 0 ? void 0 : _21.currencyCode) !== null && _22 !== void 0 ? _22 : company.baseCurrencyCode
        }} onChange={function (value) {
            return setItemData(function (d) { return (__assign(__assign({}, d), { supplierUnitPrice: value })); });
        }}/>
                        {[
            "Item",
            "Part",
            "Service",
            "Material",
            "Tool",
            "Consumable",
            "Fixture"
        ].includes(itemType) &&
            !isOutsideProcessing && (<Form_1.Location name="locationId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Delivery Location"], ["Delivery Location"])))} value={locationId} onChange={onLocationChange}/>)}
                        {[
            "Item",
            "Part",
            "Service",
            "Material",
            "Tool",
            "Consumable",
            "Fixture"
        ].includes(itemType) &&
            !isOutsideProcessing && (<Form_1.StorageUnit name="storageUnitId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} locationId={locationId} value={(_23 = itemData.storageUnitId) !== null && _23 !== void 0 ? _23 : undefined} onChange={function (newValue) {
                if (newValue) {
                    setItemData(function (d) { return (__assign(__assign({}, d), { storageUnitId: newValue === null || newValue === void 0 ? void 0 : newValue.id })); });
                }
            }}/>)}

                        <Form_1.CustomFormFields table="purchaseOrderLine"/>
                      </div>

                      <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 mt-4">
                        <react_1.HStack className="w-full justify-between cursor-pointer" onClick={costsDisclosure.onToggle}>
                          <react_1.Label>
                            <macro_1.Trans>Tax &amp; Shipping</macro_1.Trans>
                          </react_1.Label>
                          <react_1.HStack>
                            {itemData.taxPercent > 0 && (<react_1.Badge variant="red">
                                {percentFormatter.format(itemData.taxPercent)}{" "}
                                <macro_1.Trans>Tax</macro_1.Trans>
                              </react_1.Badge>)}
                            {itemData.supplierShippingCost > 0 && (<react_1.Badge variant="secondary">
                                {currencyFormatter.format(itemData.supplierShippingCost)}
                              </react_1.Badge>)}
                            <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={costsDisclosure.isOpen
            ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Collapse Costs"], ["Collapse Costs"]))) : t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Expand Costs"], ["Expand Costs"])))} variant="ghost" size="md" onClick={function (e) {
            e.stopPropagation();
            costsDisclosure.onToggle();
        }} className={"transition-transform ".concat(costsDisclosure.isOpen ? "rotate-90" : "")}/>
                          </react_1.HStack>
                        </react_1.HStack>
                        <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(costsDisclosure.isOpen ? "" : "hidden")}>
                          <Form_1.NumberControlled name="supplierShippingCost" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Shipping"], ["Shipping"])))} minValue={0} value={itemData.supplierShippingCost} formatOptions={{
            style: "currency",
            currency: (_25 = (_24 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _24 === void 0 ? void 0 : _24.currencyCode) !== null && _25 !== void 0 ? _25 : company.baseCurrencyCode
        }} onChange={function (value) {
            return setItemData(function (d) { return (__assign(__assign({}, d), { supplierShippingCost: value })); });
        }}/>
                          <Form_1.NumberControlled name="supplierTaxAmount" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Tax Amount"], ["Tax Amount"])))} value={itemData.supplierTaxAmount} formatOptions={{
            style: "currency",
            currency: (_27 = (_26 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _26 === void 0 ? void 0 : _26.currencyCode) !== null && _27 !== void 0 ? _27 : company.baseCurrencyCode
        }} onChange={function (value) {
            var subtotal = itemData.supplierUnitPrice *
                itemData.purchaseQuantity +
                itemData.supplierShippingCost;
            setItemData(function (d) { return (__assign(__assign({}, d), { supplierTaxAmount: value, taxPercent: subtotal > 0 ? value / subtotal : 0 })); });
        }}/>
                          <Form_1.NumberControlled name="taxPercent" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} value={itemData.taxPercent} minValue={0} maxValue={1} step={0.0001} formatOptions={{
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }} onChange={function (value) {
            var subtotal = itemData.supplierUnitPrice *
                itemData.purchaseQuantity +
                itemData.supplierShippingCost;
            setItemData(function (d) { return (__assign(__assign({}, d), { taxPercent: value, supplierTaxAmount: subtotal * value })); });
        }}/>
                        </div>
                      </div>
                    </react_1.VStack>
                  </react_1.TabsContent>

                  {(activeTab === "gl-account" || activeTab === "asset") && (<>
                      <Form_1.Hidden name="purchaseOrderLineType" value={activeTab === "asset" ? "Fixed Asset" : "G/L Account"}/>
                      <Form_1.Hidden name="description" value={indirectData.description}/>
                      <react_1.VStack>
                        <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                          {activeTab === "gl-account" ? (<>
                              <Form_1.Account name="accountId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["GL Account"], ["GL Account"])))} classes={["Expense"]} isOptional={false}/>
                              <Form_1.CostCenter name="costCenterId" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Cost Center"], ["Cost Center"])))} isOptional/>
                            </>) : (<>
                              <form_1.Combobox name="assetId" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Fixed Asset"], ["Fixed Asset"])))} isOptional={false} options={assetOptions} value={indirectData.assetId} onChange={function (selected) {
                    setIndirectData(function (d) {
                        var _a;
                        return (__assign(__assign({}, d), { assetId: (_a = selected === null || selected === void 0 ? void 0 : selected.value) !== null && _a !== void 0 ? _a : "" }));
                    });
                    var asset = assetOptions.find(function (o) { return o.value === (selected === null || selected === void 0 ? void 0 : selected.value); });
                    if ((asset === null || asset === void 0 ? void 0 : asset.locationId) && !locationId) {
                        setLocationId(asset.locationId);
                    }
                }}/>
                              <Form_1.Location name="locationId" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Location"], ["Location"])))} value={locationId} onChange={function (newLocation) {
                    var _a;
                    setLocationId((_a = newLocation === null || newLocation === void 0 ? void 0 : newLocation.value) !== null && _a !== void 0 ? _a : "");
                }}/>
                            </>)}
                          <react_1.FormControl className={activeTab === "asset"
                ? "col-span-1"
                : "col-span-3"}>
                            <react_1.FormLabel>
                              <macro_1.Trans>Description</macro_1.Trans>
                            </react_1.FormLabel>
                            <react_1.Input value={indirectData.description} onChange={function (e) {
                return setIndirectData(function (d) { return (__assign(__assign({}, d), { description: e.target.value })); });
            }}/>
                          </react_1.FormControl>
                          <form_1.DatePicker name="requiredDate" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Required Date"], ["Required Date"])))} value={(_28 = indirectData.requiredDate) !== null && _28 !== void 0 ? _28 : undefined} onChange={function (date) {
                setIndirectData(function (d) { return (__assign(__assign({}, d), { requiredDate: date })); });
            }}/>
                          <Form_1.NumberControlled name="purchaseQuantity" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Quantity"], ["Quantity"])))} isOptional={false} isDisabled={activeTab === "asset"} value={activeTab === "asset"
                ? 1
                : indirectData.purchaseQuantity} onChange={function (value) {
                return setIndirectData(function (d) { return (__assign(__assign({}, d), { purchaseQuantity: value })); });
            }}/>
                          <Form_1.NumberControlled name="supplierUnitPrice" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Unit Price"], ["Unit Price"])))} isOptional={false} value={indirectData.supplierUnitPrice} formatOptions={{
                style: "currency",
                currency: (_30 = (_29 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _29 === void 0 ? void 0 : _29.currencyCode) !== null && _30 !== void 0 ? _30 : company.baseCurrencyCode
            }} onChange={function (value) {
                return setIndirectData(function (d) { return (__assign(__assign({}, d), { supplierUnitPrice: value })); });
            }}/>
                          <Form_1.CustomFormFields table="purchaseOrderLine"/>
                        </div>

                        <div className="h-4"/>

                        <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4">
                          <react_1.HStack className="w-full justify-between cursor-pointer" onClick={indirectCostsDisclosure.onToggle}>
                            <react_1.Label>
                              <macro_1.Trans>Tax &amp; Shipping</macro_1.Trans>
                            </react_1.Label>
                            <react_1.HStack>
                              {indirectData.taxPercent > 0 && (<react_1.Badge variant="red">
                                  {percentFormatter.format(indirectData.taxPercent)}{" "}
                                  <macro_1.Trans>Tax</macro_1.Trans>
                                </react_1.Badge>)}
                              {indirectData.supplierShippingCost > 0 && (<react_1.Badge variant="secondary">
                                  {currencyFormatter.format(indirectData.supplierShippingCost)}
                                </react_1.Badge>)}
                              <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={indirectCostsDisclosure.isOpen
                ? t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Collapse Costs"], ["Collapse Costs"]))) : t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Expand Costs"], ["Expand Costs"])))} variant="ghost" size="md" onClick={function (e) {
                e.stopPropagation();
                indirectCostsDisclosure.onToggle();
            }} className={"transition-transform ".concat(indirectCostsDisclosure.isOpen ? "rotate-90" : "")}/>
                            </react_1.HStack>
                          </react_1.HStack>
                          <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(indirectCostsDisclosure.isOpen ? "" : "hidden")}>
                            <Form_1.NumberControlled name="supplierShippingCost" label={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Shipping"], ["Shipping"])))} minValue={0} value={indirectData.supplierShippingCost} formatOptions={{
                style: "currency",
                currency: (_32 = (_31 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _31 === void 0 ? void 0 : _31.currencyCode) !== null && _32 !== void 0 ? _32 : company.baseCurrencyCode
            }} onChange={function (value) {
                return setIndirectData(function (d) { return (__assign(__assign({}, d), { supplierShippingCost: value })); });
            }}/>
                            <Form_1.NumberControlled name="supplierTaxAmount" label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Tax Amount"], ["Tax Amount"])))} value={indirectData.supplierTaxAmount} formatOptions={{
                style: "currency",
                currency: (_34 = (_33 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _33 === void 0 ? void 0 : _33.currencyCode) !== null && _34 !== void 0 ? _34 : company.baseCurrencyCode
            }} onChange={function (value) {
                var subtotal = indirectData.supplierUnitPrice *
                    indirectData.purchaseQuantity +
                    indirectData.supplierShippingCost;
                setIndirectData(function (d) { return (__assign(__assign({}, d), { supplierTaxAmount: value, taxPercent: subtotal > 0 ? value / subtotal : 0 })); });
            }}/>
                            <Form_1.NumberControlled name="taxPercent" label={t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} value={indirectData.taxPercent} minValue={0} maxValue={1} step={0.0001} formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }} onChange={function (value) {
                var subtotal = indirectData.supplierUnitPrice *
                    indirectData.purchaseQuantity +
                    indirectData.supplierShippingCost;
                setIndirectData(function (d) { return (__assign(__assign({}, d), { taxPercent: value, supplierTaxAmount: subtotal * value })); });
            }}/>
                          </div>
                        </div>
                      </react_1.VStack>
                    </>)}
                </react_1.ModalCardBody>
                <react_1.ModalCardFooter>
                  <react_1.HStack className="justify-end gap-2">
                    {onClose && (<react_1.Button variant="ghost" onClick={onClose}>
                        <macro_1.Trans>Cancel</macro_1.Trans>
                      </react_1.Button>)}
                    <Form_1.Submit isDisabled={isDisabled} withBlocker={false}>
                      <macro_1.Trans>Save</macro_1.Trans>
                    </Form_1.Submit>
                  </react_1.HStack>
                </react_1.ModalCardFooter>
              </form_1.ValidatedForm>
            </react_1.ModalCardContent>
          </react_1.ModalCard>
        </react_1.ModalCardProvider>
      </react_1.Tabs>
      {isEditing && deleteDisclosure.isOpen && (<DeletePurchaseOrderLine_1.default line={initialValues} onCancel={deleteDisclosure.onClose}/>)}
    </>);
};
exports.default = PurchaseOrderLineForm;
function JobOperationSelect(initialValues) {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)((_a = initialValues.jobId) !== null && _a !== void 0 ? _a : null), jobId = _b[0], setJobId = _b[1];
    var jobsFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        jobsFetcher.load(path_1.path.to.api.jobs);
    });
    var jobOptions = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = jobsFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = jobsFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: c.jobId
            }); })
            : [];
    }, [jobsFetcher.data]);
    var jobOperationFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (jobId) {
            jobOperationFetcher.load(path_1.path.to.api.outsideOperations(jobId));
        }
    }, [jobId]);
    var jobOperationOptions = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return ((_c = (_b = (_a = jobOperationFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (c) { return ({
            value: c.id,
            label: c.description
        }); })) !== null && _c !== void 0 ? _c : []);
    }, [jobOperationFetcher.data]);
    return (<>
      <form_1.Combobox name="jobId" label={t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Job"], ["Job"])))} options={jobOptions} onChange={function (value) {
            if (value) {
                setJobId(value.value);
            }
        }}/>
      <form_1.Combobox name="jobOperationId" label={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Operation"], ["Operation"])))} options={jobOperationOptions}/>
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28;
