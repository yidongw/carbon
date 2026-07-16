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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var invoicing_1 = require("~/modules/invoicing");
var items_1 = require("~/modules/items");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var PurchaseInvoiceLineForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
    var initialValues = _a.initialValues, type = _a.type, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var items = (0, stores_1.useItems)()[0];
    var _23 = (0, hooks_1.useUser)(), company = _23.company, defaults = _23.defaults;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("invoiceId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseInvoice(invoiceId));
    var isEditable = ["Draft"].includes((_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : "");
    var _24 = (0, react_2.useState)(initialValues.invoiceLineType), itemType = _24[0], setItemType = _24[1];
    var _25 = (0, react_2.useState)((_d = defaults.locationId) !== null && _d !== void 0 ? _d : ""), locationId = _25[0], setLocationId = _25[1];
    var _26 = (0, react_2.useState)({
        itemId: (_e = initialValues.itemId) !== null && _e !== void 0 ? _e : "",
        description: (_f = initialValues.description) !== null && _f !== void 0 ? _f : "",
        quantity: (_g = initialValues.quantity) !== null && _g !== void 0 ? _g : 1,
        supplierUnitPrice: (_h = initialValues.supplierUnitPrice) !== null && _h !== void 0 ? _h : 0,
        supplierShippingCost: (_j = initialValues.supplierShippingCost) !== null && _j !== void 0 ? _j : 0,
        purchaseUom: (_k = initialValues.purchaseUnitOfMeasureCode) !== null && _k !== void 0 ? _k : "",
        inventoryUom: (_l = initialValues.inventoryUnitOfMeasureCode) !== null && _l !== void 0 ? _l : "",
        conversionFactor: (_m = initialValues.conversionFactor) !== null && _m !== void 0 ? _m : 1,
        storageUnitId: (_o = initialValues.storageUnitId) !== null && _o !== void 0 ? _o : "",
        minimumOrderQuantity: undefined,
        taxAmount: (_p = initialValues.supplierTaxAmount) !== null && _p !== void 0 ? _p : 0,
        taxPercent: (_q = initialValues.taxPercent) !== null && _q !== void 0 ? _q : 0,
        priceBreaks: [],
        fallbackUnitPrice: (_r = initialValues.supplierUnitPrice) !== null && _r !== void 0 ? _r : 0
    }), itemData = _26[0], setItemData = _26[1];
    // update tax amount when quantity or unit price changes
    (0, react_2.useEffect)(function () {
        var subtotal = itemData.supplierUnitPrice * itemData.quantity +
            itemData.supplierShippingCost;
        if (itemData.taxPercent !== 0) {
            setItemData(function (d) { return (__assign(__assign({}, d), { taxAmount: subtotal * itemData.taxPercent })); });
        }
    }, [
        itemData.supplierUnitPrice,
        itemData.quantity,
        itemData.supplierShippingCost,
        itemData.taxPercent
    ]);
    var isEditing = initialValues.id !== undefined;
    var isGLAccount = initialValues.invoiceLineType === "G/L Account";
    var isFixedAsset = initialValues.invoiceLineType === "Fixed Asset";
    var _27 = (0, react_2.useState)(isFixedAsset ? "asset" : isGLAccount ? "gl-account" : "item"), activeTab = _27[0], setActiveTab = _27[1];
    var _28 = (0, react_2.useState)([]), assetOptions = _28[0], setAssetOptions = _28[1];
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
    var costsDisclosure = (0, react_1.useDisclosure)();
    var indirectCostsDisclosure = (0, react_1.useDisclosure)();
    var _29 = (0, react_2.useState)({
        accountId: (_s = initialValues.accountId) !== null && _s !== void 0 ? _s : "",
        assetId: (_t = initialValues.assetId) !== null && _t !== void 0 ? _t : "",
        costCenterId: (_u = initialValues.costCenterId) !== null && _u !== void 0 ? _u : "",
        description: (_v = initialValues.description) !== null && _v !== void 0 ? _v : "",
        quantity: (_w = initialValues.quantity) !== null && _w !== void 0 ? _w : 1,
        requiredDate: (_x = initialValues.requiredDate) !== null && _x !== void 0 ? _x : null,
        supplierUnitPrice: (_y = initialValues.supplierUnitPrice) !== null && _y !== void 0 ? _y : 0,
        supplierShippingCost: (_z = initialValues.supplierShippingCost) !== null && _z !== void 0 ? _z : 0,
        taxAmount: (_0 = initialValues.supplierTaxAmount) !== null && _0 !== void 0 ? _0 : 0,
        taxPercent: (_1 = initialValues.taxPercent) !== null && _1 !== void 0 ? _1 : 0
    }), indirectData = _29[0], setIndirectData = _29[1];
    (0, react_2.useEffect)(function () {
        var subtotal = indirectData.supplierUnitPrice * indirectData.quantity +
            indirectData.supplierShippingCost;
        if (indirectData.taxPercent !== 0) {
            setIndirectData(function (d) { return (__assign(__assign({}, d), { taxAmount: subtotal * indirectData.taxPercent })); });
        }
    }, [
        indirectData.supplierUnitPrice,
        indirectData.quantity,
        indirectData.supplierShippingCost,
        indirectData.taxPercent
    ]);
    // Load price breaks
    (0, react_1.useMount)(function () {
        var _a;
        if (!isEditing || !initialValues.itemId)
            return;
        var supplierId = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _a === void 0 ? void 0 : _a.supplierId;
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
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var onTypeChange = function (t) {
        if (t === itemType)
            return;
        setItemType(t);
        setItemData({
            itemId: "",
            description: "",
            quantity: 1,
            supplierUnitPrice: 0,
            supplierShippingCost: 0,
            inventoryUom: "",
            purchaseUom: "",
            conversionFactor: 1,
            storageUnitId: "",
            minimumOrderQuantity: undefined,
            taxAmount: 0,
            taxPercent: 0,
            priceBreaks: [],
            fallbackUnitPrice: 0
        });
    };
    var onItemChange = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, item, supplierPart, inventory, itemCost, itemReplenishment, exchangeRate, initialQty, baseFallback, breaks, _c, resolvedPrice;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        return __generator(this, function (_5) {
            switch (_5.label) {
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
                            .eq("supplierId", routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice.supplierId)
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
                    _b = _5.sent(), item = _b[0], supplierPart = _b[1], inventory = _b[2];
                    itemCost = (_e = (_d = item === null || item === void 0 ? void 0 : item.data) === null || _d === void 0 ? void 0 : _d.itemCost) === null || _e === void 0 ? void 0 : _e[0];
                    itemReplenishment = (_f = item === null || item === void 0 ? void 0 : item.data) === null || _f === void 0 ? void 0 : _f.itemReplenishment;
                    exchangeRate = (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _g === void 0 ? void 0 : _g.exchangeRate) !== null && _h !== void 0 ? _h : 1;
                    initialQty = (_k = (_j = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _j === void 0 ? void 0 : _j.minimumOrderQuantity) !== null && _k !== void 0 ? _k : 1;
                    baseFallback = ((_o = (_m = (_l = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _l === void 0 ? void 0 : _l.unitPrice) !== null && _m !== void 0 ? _m : itemCost === null || itemCost === void 0 ? void 0 : itemCost.unitCost) !== null && _o !== void 0 ? _o : 0) /
                        exchangeRate;
                    if (!((_p = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _p === void 0 ? void 0 : _p.id)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, items_1.getSupplierPartPriceBreaks)(carbon, supplierPart.data.id)];
                case 3:
                    _c = _5.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = [];
                    _5.label = 5;
                case 5:
                    breaks = _c;
                    resolvedPrice = (0, shared_1.resolveSupplierPrice)(breaks, initialQty, baseFallback, exchangeRate);
                    setItemData({
                        itemId: itemId,
                        description: (_r = (_q = item.data) === null || _q === void 0 ? void 0 : _q.name) !== null && _r !== void 0 ? _r : "",
                        quantity: initialQty,
                        supplierUnitPrice: resolvedPrice,
                        supplierShippingCost: 0,
                        purchaseUom: (_w = (_u = (_t = (_s = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _s === void 0 ? void 0 : _s.supplierUnitOfMeasureCode) !== null && _t !== void 0 ? _t : itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.purchasingUnitOfMeasureCode) !== null && _u !== void 0 ? _u : (_v = item.data) === null || _v === void 0 ? void 0 : _v.unitOfMeasureCode) !== null && _w !== void 0 ? _w : "EA",
                        inventoryUom: (_y = (_x = item.data) === null || _x === void 0 ? void 0 : _x.unitOfMeasureCode) !== null && _y !== void 0 ? _y : "EA",
                        conversionFactor: (_1 = (_0 = (_z = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _z === void 0 ? void 0 : _z.conversionFactor) !== null && _0 !== void 0 ? _0 : itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.conversionFactor) !== null && _1 !== void 0 ? _1 : 1,
                        storageUnitId: (_3 = (_2 = inventory.data) === null || _2 === void 0 ? void 0 : _2.defaultStorageUnitId) !== null && _3 !== void 0 ? _3 : null,
                        taxAmount: 0,
                        taxPercent: 0,
                        priceBreaks: breaks,
                        fallbackUnitPrice: baseFallback
                    });
                    if ((_4 = item.data) === null || _4 === void 0 ? void 0 : _4.type) {
                        setItemType(item.data.type);
                    }
                    return [3 /*break*/, 7];
                case 6: throw new Error("Invalid invoice line type: ".concat(itemType, " is not implemented"));
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
    return (<react_1.Tabs value={activeTab} onValueChange={function (v) { return setActiveTab(v); }} className="w-full">
      <react_1.ModalCardProvider type={type}>
        <react_1.ModalCard onClose={onClose} defaultCollapsed={false} isCollapsible={isEditing}>
          <react_1.ModalCardContent size="xxlarge">
            <form_1.ValidatedForm defaultValues={initialValues} validator={invoicing_1.purchaseInvoiceLineValidator} method="post" action={isEditing
            ? path_1.path.to.purchaseInvoiceLine(invoiceId, initialValues.id)
            : path_1.path.to.newPurchaseInvoiceLine(invoiceId)} className="w-full" isDisabled={!isEditable} onSubmit={function () {
            if (type === "modal")
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
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
                    : ((_2 = (0, utils_1.getItemReadableId)(items, itemData === null || itemData === void 0 ? void 0 : itemData.itemId)) !== null && _2 !== void 0 ? _2 : "...")
            : "New Purchase Invoice Line"}
                  </react_1.ModalCardTitle>
                  <react_1.ModalCardDescription>
                    {isEditing ? (<div className="flex flex-col items-start gap-1">
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
                            {initialValues === null || initialValues === void 0 ? void 0 : initialValues.quantity}
                          </react_1.Badge>
                          <react_1.Badge variant="green">
                            {currencyFormatter.format(((_3 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.supplierUnitPrice) !== null && _3 !== void 0 ? _3 : 0) +
                ((_4 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.supplierShippingCost) !== null && _4 !== void 0 ? _4 : 0))}{" "}
                            {initialValues === null || initialValues === void 0 ? void 0 : initialValues.purchaseUnitOfMeasureCode}
                          </react_1.Badge>
                          {((_5 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) !== null && _5 !== void 0 ? _5 : 0) > 0 ? (<react_1.Badge variant="red">
                              {percentFormatter.format((_6 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) !== null && _6 !== void 0 ? _6 : 0)}{" "}
                              Tax
                            </react_1.Badge>) : null}
                        </div>
                      </div>) : ("A purchase invoice line contains invoice details for a particular item")}
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
                <Form_1.Hidden name="invoiceId"/>
                <Form_1.Hidden name="exchangeRate" value={(_8 = (_7 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _7 === void 0 ? void 0 : _7.exchangeRate) !== null && _8 !== void 0 ? _8 : 1}/>

                <react_1.TabsContent value="item">
                  <Form_1.Hidden name="invoiceLineType" value={itemType}/>
                  {activeTab === "item" && (<Form_1.Hidden name="description" value={itemData.description}/>)}
                  <Form_1.Hidden name="inventoryUnitOfMeasureCode" value={itemData === null || itemData === void 0 ? void 0 : itemData.inventoryUom}/>
                  <react_1.VStack>
                    <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                      <Form_1.Item name="itemId" label={itemType} 
    // @ts-ignore
    type={itemType} locationId={locationId} replenishmentSystem="Buy" onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }} onTypeChange={onTypeChange}/>

                      <react_1.FormControl className="col-span-2">
                        <react_1.FormLabel isOptional>
                          <macro_1.Trans>Description</macro_1.Trans>
                        </react_1.FormLabel>
                        <react_1.Input value={itemData.description} onChange={function (e) {
            return setItemData(function (d) { return (__assign(__assign({}, d), { description: e.target.value })); });
        }}/>
                      </react_1.FormControl>

                      {[
            "Item",
            "Part",
            "Material",
            "Tool",
            "Consumable",
            "Service",
            "Fixture"
        ].includes(itemType) && (<>
                          <Form_1.NumberControlled minValue={itemData.minimumOrderQuantity} name="quantity" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={itemData.quantity} onChange={function (value) {
                var _a, _b;
                var exchangeRate = (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _a === void 0 ? void 0 : _a.exchangeRate) !== null && _b !== void 0 ? _b : 1;
                setItemData(function (d) { return (__assign(__assign({}, d), { quantity: value, supplierUnitPrice: (0, shared_1.resolveSupplierPrice)(d.priceBreaks, value, d.fallbackUnitPrice, exchangeRate) })); });
            }}/>

                          <Form_1.UnitOfMeasure name="purchaseUnitOfMeasureCode" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} value={itemData.purchaseUom} onChange={function (newValue) {
                if (newValue) {
                    setItemData(function (d) { return (__assign(__assign({}, d), { purchaseUom: newValue === null || newValue === void 0 ? void 0 : newValue.value })); });
                }
            }}/>
                          <Form_1.ConversionFactor name="conversionFactor" purchasingCode={itemData.purchaseUom} inventoryCode={itemData.inventoryUom} value={itemData.conversionFactor} onChange={function (value) {
                setItemData(function (d) { return (__assign(__assign({}, d), { conversionFactor: value })); });
            }}/>

                          <Form_1.NumberControlled name="supplierUnitPrice" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier Unit Price"], ["Supplier Unit Price"])))} value={itemData.supplierUnitPrice} formatOptions={{
                style: "currency",
                currency: (_10 = (_9 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _9 === void 0 ? void 0 : _9.currencyCode) !== null && _10 !== void 0 ? _10 : company.baseCurrencyCode
            }} onChange={function (value) {
                return setItemData(function (d) { return (__assign(__assign({}, d), { supplierUnitPrice: value })); });
            }}/>

                          <Form_1.Location name="locationId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Delivery Location"], ["Delivery Location"])))} value={locationId} onChange={onLocationChange}/>
                          <Form_1.StorageUnit name="storageUnitId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} locationId={locationId} value={(_11 = itemData.storageUnitId) !== null && _11 !== void 0 ? _11 : undefined} onChange={function (newValue) {
                if (newValue) {
                    setItemData(function (d) { return (__assign(__assign({}, d), { storageUnitId: newValue === null || newValue === void 0 ? void 0 : newValue.id })); });
                }
            }}/>
                        </>)}
                      <Form_1.CustomFormFields table="purchaseInvoiceLine"/>
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
            ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Collapse Costs"], ["Collapse Costs"]))) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Expand Costs"], ["Expand Costs"])))} variant="ghost" size="md" onClick={function (e) {
            e.stopPropagation();
            costsDisclosure.onToggle();
        }} className={"transition-transform ".concat(costsDisclosure.isOpen ? "rotate-90" : "")}/>
                        </react_1.HStack>
                      </react_1.HStack>
                      <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(costsDisclosure.isOpen ? "" : "hidden")}>
                        <Form_1.NumberControlled name="supplierShippingCost" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Shipping"], ["Shipping"])))} value={itemData.supplierShippingCost} minValue={0} formatOptions={{
            style: "currency",
            currency: (_13 = (_12 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _12 === void 0 ? void 0 : _12.currencyCode) !== null && _13 !== void 0 ? _13 : company.baseCurrencyCode
        }} onChange={function (value) {
            return setItemData(function (d) { return (__assign(__assign({}, d), { supplierShippingCost: value })); });
        }}/>
                        <Form_1.NumberControlled name="supplierTaxAmount" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Tax Amount"], ["Tax Amount"])))} value={itemData.taxAmount} formatOptions={{
            style: "currency",
            currency: (_15 = (_14 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _14 === void 0 ? void 0 : _14.currencyCode) !== null && _15 !== void 0 ? _15 : company.baseCurrencyCode
        }} onChange={function (value) {
            var subtotal = itemData.supplierUnitPrice * itemData.quantity +
                itemData.supplierShippingCost;
            setItemData(function (d) { return (__assign(__assign({}, d), { taxAmount: value, taxPercent: subtotal > 0 ? value / subtotal : 0 })); });
        }}/>
                        <Form_1.NumberControlled name="taxPercent" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} value={itemData.taxPercent} minValue={0} maxValue={1} step={0.0001} formatOptions={{
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }} onChange={function (value) {
            var subtotal = itemData.supplierUnitPrice * itemData.quantity +
                itemData.supplierShippingCost;
            setItemData(function (d) { return (__assign(__assign({}, d), { taxPercent: value, taxAmount: subtotal * value })); });
        }}/>
                      </div>
                    </div>
                  </react_1.VStack>
                </react_1.TabsContent>

                {(activeTab === "gl-account" || activeTab === "asset") && (<>
                    <Form_1.Hidden name="invoiceLineType" value={activeTab === "asset" ? "Fixed Asset" : "G/L Account"}/>

                    <react_1.VStack>
                      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                        {activeTab === "gl-account" ? (<>
                            <Form_1.Account name="accountId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["GL Account"], ["GL Account"])))} classes={["Expense"]} isOptional={false}/>
                            <Form_1.CostCenter name="costCenterId" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Cost Center"], ["Cost Center"])))} isOptional/>
                          </>) : (<>
                            <form_1.Combobox name="assetId" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Fixed Asset"], ["Fixed Asset"])))} isOptional={false} options={assetOptions} value={indirectData.assetId} onChange={function (selected) {
                    setIndirectData(function (d) {
                        var _a;
                        return (__assign(__assign({}, d), { assetId: (_a = selected === null || selected === void 0 ? void 0 : selected.value) !== null && _a !== void 0 ? _a : "" }));
                    });
                    var asset = assetOptions.find(function (o) { return o.value === (selected === null || selected === void 0 ? void 0 : selected.value); });
                    if ((asset === null || asset === void 0 ? void 0 : asset.locationId) && !locationId) {
                        setLocationId(asset.locationId);
                    }
                }}/>
                            <Form_1.Location name="locationId" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Location"], ["Location"])))} value={locationId} onChange={function (newLocation) {
                    var _a;
                    setLocationId((_a = newLocation === null || newLocation === void 0 ? void 0 : newLocation.value) !== null && _a !== void 0 ? _a : "");
                }}/>
                          </>)}
                        <form_1.InputControlled className={activeTab === "asset" ? "col-span-1" : "col-span-3"} label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Description"], ["Description"])))} name="description" value={indirectData.description} isOptional={false} onChange={function (newValue) {
                return setIndirectData(function (d) { return (__assign(__assign({}, d), { description: newValue })); });
            }}/>
                        <form_1.DatePicker name="requiredDate" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Required Date"], ["Required Date"])))} value={(_16 = indirectData.requiredDate) !== null && _16 !== void 0 ? _16 : undefined} onChange={function (date) {
                setIndirectData(function (d) { return (__assign(__assign({}, d), { requiredDate: date })); });
            }}/>
                        <Form_1.NumberControlled name="quantity" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Quantity"], ["Quantity"])))} isOptional={false} isDisabled={activeTab === "asset"} value={activeTab === "asset" ? 1 : indirectData.quantity} onChange={function (value) {
                return setIndirectData(function (d) { return (__assign(__assign({}, d), { quantity: value })); });
            }}/>
                        <Form_1.NumberControlled name="supplierUnitPrice" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Unit Price"], ["Unit Price"])))} isOptional={false} value={indirectData.supplierUnitPrice} formatOptions={{
                style: "currency",
                currency: (_18 = (_17 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _17 === void 0 ? void 0 : _17.currencyCode) !== null && _18 !== void 0 ? _18 : company.baseCurrencyCode
            }} onChange={function (value) {
                return setIndirectData(function (d) { return (__assign(__assign({}, d), { supplierUnitPrice: value })); });
            }}/>
                        <Form_1.CustomFormFields table="purchaseInvoiceLine"/>
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
                ? t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Collapse Costs"], ["Collapse Costs"]))) : t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Expand Costs"], ["Expand Costs"])))} variant="ghost" size="md" onClick={function (e) {
                e.stopPropagation();
                indirectCostsDisclosure.onToggle();
            }} className={"transition-transform ".concat(indirectCostsDisclosure.isOpen ? "rotate-90" : "")}/>
                          </react_1.HStack>
                        </react_1.HStack>
                        <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(indirectCostsDisclosure.isOpen ? "" : "hidden")}>
                          <Form_1.NumberControlled name="supplierShippingCost" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Shipping"], ["Shipping"])))} minValue={0} value={indirectData.supplierShippingCost} formatOptions={{
                style: "currency",
                currency: (_20 = (_19 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _19 === void 0 ? void 0 : _19.currencyCode) !== null && _20 !== void 0 ? _20 : company.baseCurrencyCode
            }} onChange={function (value) {
                return setIndirectData(function (d) { return (__assign(__assign({}, d), { supplierShippingCost: value })); });
            }}/>
                          <Form_1.NumberControlled name="supplierTaxAmount" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Tax Amount"], ["Tax Amount"])))} value={indirectData.taxAmount} formatOptions={{
                style: "currency",
                currency: (_22 = (_21 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _21 === void 0 ? void 0 : _21.currencyCode) !== null && _22 !== void 0 ? _22 : company.baseCurrencyCode
            }} onChange={function (value) {
                var subtotal = indirectData.supplierUnitPrice *
                    indirectData.quantity +
                    indirectData.supplierShippingCost;
                setIndirectData(function (d) { return (__assign(__assign({}, d), { taxAmount: value, taxPercent: subtotal > 0 ? value / subtotal : 0 })); });
            }}/>
                          <Form_1.NumberControlled name="taxPercent" label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} value={indirectData.taxPercent} minValue={0} maxValue={1} step={0.0001} formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }} onChange={function (value) {
                var subtotal = indirectData.supplierUnitPrice *
                    indirectData.quantity +
                    indirectData.supplierShippingCost;
                setIndirectData(function (d) { return (__assign(__assign({}, d), { taxPercent: value, taxAmount: subtotal * value })); });
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
    </react_1.Tabs>);
};
exports.default = PurchaseInvoiceLineForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23;
