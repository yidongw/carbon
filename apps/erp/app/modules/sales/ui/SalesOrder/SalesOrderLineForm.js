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
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var inventory_service_1 = require("~/modules/inventory/inventory.service");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var PriceTracePopover_1 = require("../Pricing/PriceTracePopover");
var DeleteSalesOrderLine_1 = require("./DeleteSalesOrderLine");
var SalesOrderLineForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    var initialValues = _a.initialValues, type = _a.type, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("orderId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesOrder(orderId));
    var isLocked = (0, sales_models_1.isSalesOrderLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _b === void 0 ? void 0 : _b.status);
    var isEditable = !isLocked;
    var baseCurrency = (_c = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _c !== void 0 ? _c : "USD";
    var _13 = (0, react_2.useState)(initialValues.salesOrderLineType), lineType = _13[0], setLineType = _13[1];
    var _14 = (0, react_2.useState)((_d = initialValues.locationId) !== null && _d !== void 0 ? _d : ""), locationId = _14[0], setLocationId = _14[1];
    var _15 = (0, react_2.useState)((_e = initialValues.saleQuantity) !== null && _e !== void 0 ? _e : 1), saleQuantity = _15[0], setSaleQuantity = _15[1];
    var _16 = (0, react_2.useState)(false), isPriceResolving = _16[0], setIsPriceResolving = _16[1];
    var _17 = (0, react_2.useState)({
        itemId: (_f = initialValues.itemId) !== null && _f !== void 0 ? _f : "",
        description: (_g = initialValues.description) !== null && _g !== void 0 ? _g : "",
        methodType: (_h = initialValues.methodType) !== null && _h !== void 0 ? _h : "",
        unitPrice: (_j = initialValues.unitPrice) !== null && _j !== void 0 ? _j : 0,
        uom: (_k = initialValues.unitOfMeasureCode) !== null && _k !== void 0 ? _k : "",
        storageUnitId: (_l = initialValues.storageUnitId) !== null && _l !== void 0 ? _l : "",
        modelUploadId: (_m = initialValues.modelUploadId) !== null && _m !== void 0 ? _m : null,
        priceListId: (_o = initialValues.priceListId) !== null && _o !== void 0 ? _o : null,
        priceListName: null,
        priceTrace: (_p = initialValues.priceTrace) !== null && _p !== void 0 ? _p : null
    }), itemData = _17[0], setItemData = _17[1];
    var isEditing = initialValues.id !== undefined;
    var isFixedAsset = initialValues.salesOrderLineType === "Fixed Asset";
    var _18 = (0, react_2.useState)(isFixedAsset ? "asset" : "item"), activeTab = _18[0], setActiveTab = _18[1];
    var _19 = (0, react_2.useState)([]), assetOptions = _19[0], setAssetOptions = _19[1];
    var _20 = (0, react_2.useState)({
        assetId: (_q = initialValues.assetId) !== null && _q !== void 0 ? _q : "",
        description: (_r = initialValues.description) !== null && _r !== void 0 ? _r : "",
        saleQuantity: (_s = initialValues.saleQuantity) !== null && _s !== void 0 ? _s : 1,
        unitPrice: (_t = initialValues.unitPrice) !== null && _t !== void 0 ? _t : 0,
        taxPercent: (_u = initialValues.taxPercent) !== null && _u !== void 0 ? _u : 0,
        shippingCost: (_v = initialValues.shippingCost) !== null && _v !== void 0 ? _v : 0,
        addOnCost: (_w = initialValues.addOnCost) !== null && _w !== void 0 ? _w : 0,
        nonTaxableAddOnCost: (_x = initialValues.nonTaxableAddOnCost) !== null && _x !== void 0 ? _x : 0
    }), assetData = _20[0], setAssetData = _20[1];
    (0, react_1.useMount)(function () {
        if (!carbon || !company.id)
            return;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var assets, options, current;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, carbon
                            .from("fixedAsset")
                            .select("id, fixedAssetId, name")
                            .eq("companyId", company.id)
                            .in("status", ["Active", "Fully Depreciated"])
                            .order("fixedAssetId")];
                    case 1:
                        assets = _b.sent();
                        options = ((_a = assets.data) !== null && _a !== void 0 ? _a : []).map(function (a) { return ({
                            value: a.id,
                            label: "".concat(a.fixedAssetId, " \u2014 ").concat(a.name)
                        }); });
                        if (!(initialValues.assetId &&
                            !options.some(function (o) { return o.value === initialValues.assetId; }))) return [3 /*break*/, 3];
                        return [4 /*yield*/, carbon
                                .from("fixedAsset")
                                .select("id, fixedAssetId, name")
                                .eq("id", initialValues.assetId)
                                .single()];
                    case 2:
                        current = _b.sent();
                        if (current.data) {
                            options.unshift({
                                value: current.data.id,
                                label: "".concat(current.data.fixedAssetId, " \u2014 ").concat(current.data.name)
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
    var pricingRuleId = initialValues
        .priceListId;
    (0, react_2.useEffect)(function () {
        if (!pricingRuleId || !carbon)
            return;
        carbon
            .from("pricingRule")
            .select("name")
            .eq("id", pricingRuleId)
            .single()
            .then(function (_a) {
            var data = _a.data;
            if (data === null || data === void 0 ? void 0 : data.name) {
                setItemData(function (d) { return (__assign(__assign({}, d), { priceListName: data.name })); });
            }
        });
    }, [pricingRuleId, carbon]);
    var onTypeChange = function (t) {
        // @ts-ignore
        setLineType(t);
        setItemData({
            itemId: "",
            description: "",
            unitPrice: 0,
            methodType: "",
            uom: "EA",
            storageUnitId: "",
            modelUploadId: null,
            priceListId: null,
            priceListName: null,
            priceTrace: null
        });
    };
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var resolvePrice = (0, react_2.useCallback)(function (itemId, quantity) { return __awaiter(void 0, void 0, void 0, function () {
        var customerId, response, result, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    customerId = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _b === void 0 ? void 0 : _b.customerId;
                    if (!customerId)
                        return [2 /*return*/, null];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch(path_1.path.to.api.salesResolvePrice, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ customerId: customerId, itemId: itemId, quantity: quantity })
                        })];
                case 2:
                    response = _d.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _d.sent();
                    return [2 /*return*/, {
                            finalPrice: result.finalPrice,
                            priceListId: null,
                            priceListName: "Pricing Rules",
                            trace: (_c = result.trace) !== null && _c !== void 0 ? _c : null
                        }];
                case 4: return [3 /*break*/, 6];
                case 5:
                    _a = _d.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, null];
            }
        });
    }); }, [(_y = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _y === void 0 ? void 0 : _y.customerId]);
    var debouncedQuantityResolve = (0, react_1.useDebounce)(function (qty) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!itemData.itemId) {
                        setIsPriceResolving(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, resolvePrice(itemData.itemId, qty)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        setItemData(function (d) { return (__assign(__assign({}, d), { unitPrice: result.finalPrice, priceListId: result.priceListId, priceListName: result.priceListName, priceTrace: result.trace })); });
                    }
                    setIsPriceResolving(false);
                    return [2 /*return*/];
            }
        });
    }); }, 400);
    var onQuantityChange = function (qty) {
        setSaleQuantity(qty);
        setIsPriceResolving(true);
        debouncedQuantityResolve(qty);
    };
    var onChange = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, item, price, defaultStorageUnitId, _b, resolvedPrice, priceListId, result;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    if (!itemId)
                        return [2 /*return*/];
                    if (!carbon || !company.id)
                        return [2 /*return*/];
                    setIsPriceResolving(true);
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("item")
                                .select("name, readableIdWithRevision, defaultMethodType, unitOfMeasureCode, modelUploadId")
                                .eq("id", itemId)
                                .eq("companyId", company.id)
                                .single(),
                            carbon
                                .from("itemUnitSalePrice")
                                .select("unitSalePrice")
                                .eq("itemId", itemId)
                                .eq("companyId", company.id)
                                .maybeSingle()
                        ])];
                case 1:
                    _a = _q.sent(), item = _a[0], price = _a[1];
                    if (!locationId) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, inventory_service_1.getDefaultStorageUnitForJob)(carbon, itemId, locationId, company.id)];
                case 2:
                    _b = _q.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _b = null;
                    _q.label = 4;
                case 4:
                    defaultStorageUnitId = _b;
                    resolvedPrice = (_d = (_c = price.data) === null || _c === void 0 ? void 0 : _c.unitSalePrice) !== null && _d !== void 0 ? _d : 0;
                    priceListId = null;
                    return [4 /*yield*/, resolvePrice(itemId, saleQuantity)];
                case 5:
                    result = _q.sent();
                    if (result) {
                        resolvedPrice = result.finalPrice;
                        priceListId = result.priceListId;
                    }
                    setItemData({
                        itemId: itemId,
                        description: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : "",
                        methodType: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.defaultMethodType) !== null && _h !== void 0 ? _h : "",
                        unitPrice: resolvedPrice,
                        uom: (_k = (_j = item.data) === null || _j === void 0 ? void 0 : _j.unitOfMeasureCode) !== null && _k !== void 0 ? _k : "EA",
                        storageUnitId: defaultStorageUnitId !== null && defaultStorageUnitId !== void 0 ? defaultStorageUnitId : "",
                        modelUploadId: (_m = (_l = item.data) === null || _l === void 0 ? void 0 : _l.modelUploadId) !== null && _m !== void 0 ? _m : null,
                        priceListId: priceListId,
                        priceListName: (_o = result === null || result === void 0 ? void 0 : result.priceListName) !== null && _o !== void 0 ? _o : null,
                        priceTrace: (_p = result === null || result === void 0 ? void 0 : result.trace) !== null && _p !== void 0 ? _p : null
                    });
                    setIsPriceResolving(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var onLocationChange = function (newLocation) { return __awaiter(void 0, void 0, void 0, function () {
        var defaultStorageUnitId;
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
                    return [4 /*yield*/, (0, inventory_service_1.getDefaultStorageUnitForJob)(carbon, itemData.itemId, newLocation.value, company.id)];
                case 1:
                    defaultStorageUnitId = _a.sent();
                    setItemData(function (d) { return (__assign(__assign({}, d), { storageUnitId: defaultStorageUnitId !== null && defaultStorageUnitId !== void 0 ? defaultStorageUnitId : "" })); });
                    return [2 /*return*/];
            }
        });
    }); };
    var costsDisclosure = (0, react_1.useDisclosure)();
    var assetCostsDisclosure = (0, react_1.useDisclosure)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var items = (0, stores_1.useItems)()[0];
    return (<>
      <react_1.Tabs value={activeTab} onValueChange={function (v) { return setActiveTab(v); }} className="w-full">
        <react_1.ModalCardProvider type={type}>
          <react_1.ModalCard onClose={onClose} isCollapsible={isEditing} defaultCollapsed={false}>
            <react_1.ModalCardContent size="xxlarge">
              <form_1.ValidatedForm defaultValues={initialValues} validator={sales_models_1.salesOrderLineValidator} method="post" action={isEditing
            ? path_1.path.to.salesOrderLine(orderId, initialValues.id)
            : path_1.path.to.newSalesOrderLine(orderId)} className="w-full" isDisabled={isEditing && isLocked} onSubmit={function () {
            if (type === "modal")
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
                <react_1.HStack className={(0, react_1.cn)("w-full justify-between items-start", type === "modal" && "pr-16")}>
                  <react_1.ModalCardHeader className="flex flex-1">
                    <react_1.ModalCardTitle className={(0, react_1.cn)(isEditing &&
            !isFixedAsset &&
            !(itemData === null || itemData === void 0 ? void 0 : itemData.itemId) &&
            "text-muted-foreground")}>
                      {isEditing
            ? isFixedAsset
                ? initialValues.assetReadableId || "Fixed Asset"
                : (0, utils_1.getItemReadableId)(items, itemData === null || itemData === void 0 ? void 0 : itemData.itemId) || "..."
            : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["New Sales Order Line"], ["New Sales Order Line"])))}
                    </react_1.ModalCardTitle>
                    <react_1.ModalCardDescription>
                      {isEditing ? (<div className="flex flex-col items-start gap-1">
                          <span>
                            {isFixedAsset
                ? initialValues.assetName || assetData.description
                : itemData === null || itemData === void 0 ? void 0 : itemData.description}
                          </span>
                          <div className="flex items-center gap-2">
                            <react_1.Badge variant="outline" className="flex items-center gap-2">
                              {initialValues === null || initialValues === void 0 ? void 0 : initialValues.saleQuantity}
                              {!isFixedAsset && (<components_1.MethodIcon type={itemData.methodType}/>)}
                            </react_1.Badge>
                            <react_1.Badge variant="green">
                              {currencyFormatter.format((_z = initialValues === null || initialValues === void 0 ? void 0 : initialValues.unitPrice) !== null && _z !== void 0 ? _z : 0)}{" "}
                              {initialValues === null || initialValues === void 0 ? void 0 : initialValues.unitOfMeasureCode}
                            </react_1.Badge>
                            {(initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) > 0 ? (<react_1.Badge variant="red">
                                {percentFormatter.format(initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent)}{" "}
                                <macro_1.Trans>Tax</macro_1.Trans>
                              </react_1.Badge>) : null}
                          </div>
                        </div>) : (<macro_1.Trans>
                          A sales order line contains order details for a
                          particular item
                        </macro_1.Trans>)}
                    </react_1.ModalCardDescription>
                  </react_1.ModalCardHeader>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {!isEditing && (<react_1.TabsList>
                        <react_1.TabsTrigger value="item">
                          <lu_1.LuBox className="mr-1"/>
                          <macro_1.Trans>Item</macro_1.Trans>
                        </react_1.TabsTrigger>
                        <react_1.TabsTrigger value="asset">
                          <lu_1.LuLandmark className="mr-1"/>
                          <macro_1.Trans>Asset</macro_1.Trans>
                        </react_1.TabsTrigger>
                      </react_1.TabsList>)}
                    {isEditing &&
            permissions.can("update", "sales") &&
            !isLocked && (<react_1.CardAction>
                          <react_1.DropdownMenu>
                            <react_1.DropdownMenuTrigger asChild>
                              <react_1.IconButton icon={<bs_1.BsThreeDotsVertical />} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More"], ["More"])))} variant="ghost"/>
                            </react_1.DropdownMenuTrigger>
                            <react_1.DropdownMenuContent align="end">
                              <react_1.DropdownMenuItem destructive onClick={deleteDisclosure.onOpen}>
                                <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                                <macro_1.Trans>Delete Line</macro_1.Trans>
                              </react_1.DropdownMenuItem>
                            </react_1.DropdownMenuContent>
                          </react_1.DropdownMenu>
                        </react_1.CardAction>)}
                  </div>
                </react_1.HStack>
                <react_1.ModalCardBody>
                  <Form_1.Hidden name="id"/>
                  <Form_1.Hidden name="salesOrderId"/>

                  <react_1.TabsContent value="item">
                    {!isEditing && (<Form_1.Hidden name="description" value={(_0 = itemData === null || itemData === void 0 ? void 0 : itemData.description) !== null && _0 !== void 0 ? _0 : ""}/>)}
                    <Form_1.Hidden name="modelUploadId" value={(_1 = itemData === null || itemData === void 0 ? void 0 : itemData.modelUploadId) !== null && _1 !== void 0 ? _1 : undefined}/>
                    <Form_1.Hidden name="priceListId" value={(_2 = itemData === null || itemData === void 0 ? void 0 : itemData.priceListId) !== null && _2 !== void 0 ? _2 : undefined}/>
                    <Form_1.Hidden name="priceTrace" value={(itemData === null || itemData === void 0 ? void 0 : itemData.priceTrace)
            ? JSON.stringify(itemData.priceTrace)
            : undefined}/>
                    <Form_1.Hidden name="unitOfMeasureCode" value={itemData.uom}/>
                    <react_1.VStack>
                      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                        <Form_1.Item name="itemId" label={lineType} type={lineType} typeFieldName="salesOrderLineType" value={itemData.itemId} locationId={locationId} onChange={function (value) {
            onChange(value === null || value === void 0 ? void 0 : value.value);
        }} onTypeChange={onTypeChange}/>

                        {isEditing && (<Form_1.InputControlled name="description" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Short Description"], ["Short Description"])))} onChange={function (value) {
                setItemData(function (d) { return (__assign(__assign({}, d), { description: value })); });
            }} value={itemData.description}/>)}

                        {lineType !== "Comment" && (<>
                            <Form_1.SelectControlled name="methodType" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Method"], ["Method"])))} options={(_3 = shared_1.methodType.map(function (m) { return ({
                label: (<span className="flex items-center gap-2">
                                      <components_1.MethodIcon type={m}/>
                                      {m}
                                    </span>),
                value: m
            }); })) !== null && _3 !== void 0 ? _3 : []} value={itemData.methodType} onChange={function (newValue) {
                if (newValue)
                    setItemData(function (d) { return (__assign(__assign({}, d), { methodType: newValue === null || newValue === void 0 ? void 0 : newValue.value })); });
            }}/>
                            <Form_1.NumberControlled name="saleQuantity" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={saleQuantity} onChange={onQuantityChange}/>
                            <div className="flex flex-col gap-y-2 w-full">
                              <div className="flex items-center justify-between min-h-[16px]">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Unit Price
                                </span>
                                <PriceTracePopover_1.PriceTracePopover trace={itemData.priceTrace} currencyCode={baseCurrency}/>
                              </div>
                              <Form_1.NumberControlled name="unitPrice" value={itemData.unitPrice} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (value) {
                return setItemData(function (d) { return (__assign(__assign({}, d), { unitPrice: value })); });
            }}/>
                            </div>
                            <Form_1.DatePicker name="promisedDate" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Promised Date"], ["Promised Date"])))}/>
                            {[
                "Part",
                "Material",
                "Service",
                "Tool",
                "Consumable"
            ].includes(lineType) && (<Form_1.Location name="locationId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Shipping Location"], ["Shipping Location"])))} onChange={onLocationChange}/>)}
                            {[
                "Part",
                "Material",
                "Tool",
                "Fixture",
                "Consumable"
            ].includes(lineType) && (<Form_1.StorageUnit name="storageUnitId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} locationId={locationId} itemId={itemData.itemId} value={(_4 = itemData.storageUnitId) !== null && _4 !== void 0 ? _4 : undefined} onChange={function (newValue) {
                    if (newValue) {
                        setItemData(function (d) { return (__assign(__assign({}, d), { storageUnitId: newValue === null || newValue === void 0 ? void 0 : newValue.id })); });
                    }
                }}/>)}
                          </>)}
                        <Form_1.CustomFormFields table="salesOrderLine"/>
                      </div>

                      {lineType !== "Comment" && (<div className="w-full">
                          <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 mt-4">
                            <react_1.HStack className="w-full justify-between cursor-pointer" onClick={costsDisclosure.onToggle}>
                              <react_1.Label>
                                <macro_1.Trans>Tax &amp; Additional Costs</macro_1.Trans>
                              </react_1.Label>
                              <react_1.HStack>
                                {((_5 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) !== null && _5 !== void 0 ? _5 : 0) > 0 && (<react_1.Badge variant="red">
                                    {percentFormatter.format((_6 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) !== null && _6 !== void 0 ? _6 : 0)}{" "}
                                    <macro_1.Trans>Tax</macro_1.Trans>
                                  </react_1.Badge>)}
                                {((_7 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.shippingCost) !== null && _7 !== void 0 ? _7 : 0) > 0 && (<react_1.Badge variant="secondary" className="flex items-center gap-1">
                                    <lu_1.LuTruck />
                                    <span>
                                      {currencyFormatter.format((_8 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.shippingCost) !== null && _8 !== void 0 ? _8 : 0)}
                                    </span>
                                  </react_1.Badge>)}
                                {((_9 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.addOnCost) !== null && _9 !== void 0 ? _9 : 0) > 0 ||
                (((_10 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.nonTaxableAddOnCost) !== null && _10 !== void 0 ? _10 : 0) >
                    0 && (<react_1.Badge variant="secondary" className="flex items-center gap-1">
                                      <lu_1.LuPlus />
                                      <span>
                                        {currencyFormatter.format(((_11 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.addOnCost) !== null && _11 !== void 0 ? _11 : 0) +
                        ((_12 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.nonTaxableAddOnCost) !== null && _12 !== void 0 ? _12 : 0))}{" "}
                                        <macro_1.Trans>Add-On</macro_1.Trans>
                                      </span>
                                    </react_1.Badge>))}

                                <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={costsDisclosure.isOpen
                ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Collapse Costs"], ["Collapse Costs"]))) : t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Expand Costs"], ["Expand Costs"])))} variant="ghost" size="md" onClick={function (e) {
                e.stopPropagation();
                costsDisclosure.onToggle();
            }} className={"transition-transform ".concat(costsDisclosure.isOpen ? "rotate-90" : "")}/>
                              </react_1.HStack>
                            </react_1.HStack>
                            <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(costsDisclosure.isOpen ? "" : "hidden")}>
                              <Form_1.Number name="taxPercent" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} minValue={0} maxValue={1} step={0.0001} formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }}/>
                              <Form_1.Number name="shippingCost" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Shipping Cost"], ["Shipping Cost"])))} minValue={0} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }}/>
                              <Form_1.Number name="addOnCost" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Add-On Cost"], ["Add-On Cost"])))} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }}/>
                              <Form_1.Number name="nonTaxableAddOnCost" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Non-Taxable Add-On Cost"], ["Non-Taxable Add-On Cost"])))} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }}/>
                            </div>
                          </div>
                        </div>)}
                    </react_1.VStack>
                  </react_1.TabsContent>

                  {activeTab === "asset" && (<>
                      <Form_1.Hidden name="salesOrderLineType" value="Fixed Asset"/>
                      <Form_1.Hidden name="description" value={assetData.description}/>
                      <react_1.VStack>
                        <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                          <form_1.Combobox name="assetId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Fixed Asset"], ["Fixed Asset"])))} isOptional={false} options={assetOptions} value={assetData.assetId} onChange={function (selected) {
                setAssetData(function (d) {
                    var _a;
                    return (__assign(__assign({}, d), { assetId: (_a = selected === null || selected === void 0 ? void 0 : selected.value) !== null && _a !== void 0 ? _a : "" }));
                });
            }}/>
                          <Form_1.Location name="locationId" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Shipping Location"], ["Shipping Location"])))} onChange={onLocationChange}/>
                          <react_1.FormControl>
                            <react_1.FormLabel>
                              <macro_1.Trans>Description</macro_1.Trans>
                            </react_1.FormLabel>
                            <react_1.Input value={assetData.description} onChange={function (e) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { description: e.target.value })); });
            }}/>
                          </react_1.FormControl>
                          <Form_1.DatePicker name="promisedDate" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Promised Date"], ["Promised Date"])))}/>
                          <Form_1.NumberControlled name="saleQuantity" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Quantity"], ["Quantity"])))} isOptional={false} isDisabled value={1} onChange={function () { return undefined; }}/>
                          <Form_1.NumberControlled name="unitPrice" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Unit Price"], ["Unit Price"])))} isOptional={false} value={assetData.unitPrice} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { unitPrice: value })); });
            }}/>
                          <Form_1.CustomFormFields table="salesOrderLine"/>
                        </div>

                        <div className="h-4"/>

                        <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4">
                          <react_1.HStack className="w-full justify-between cursor-pointer" onClick={assetCostsDisclosure.onToggle}>
                            <react_1.Label>
                              <macro_1.Trans>Tax &amp; Additional Costs</macro_1.Trans>
                            </react_1.Label>
                            <react_1.HStack>
                              {assetData.taxPercent > 0 && (<react_1.Badge variant="red">
                                  {percentFormatter.format(assetData.taxPercent)}{" "}
                                  <macro_1.Trans>Tax</macro_1.Trans>
                                </react_1.Badge>)}
                              {assetData.shippingCost > 0 && (<react_1.Badge variant="secondary" className="flex items-center gap-1">
                                  <lu_1.LuTruck />
                                  <span>
                                    {currencyFormatter.format(assetData.shippingCost)}
                                  </span>
                                </react_1.Badge>)}
                              <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={assetCostsDisclosure.isOpen
                ? t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Collapse Costs"], ["Collapse Costs"]))) : t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Expand Costs"], ["Expand Costs"])))} variant="ghost" size="md" onClick={function (e) {
                e.stopPropagation();
                assetCostsDisclosure.onToggle();
            }} className={"transition-transform ".concat(assetCostsDisclosure.isOpen ? "rotate-90" : "")}/>
                            </react_1.HStack>
                          </react_1.HStack>
                          <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(assetCostsDisclosure.isOpen ? "" : "hidden")}>
                            <Form_1.NumberControlled name="taxPercent" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} value={assetData.taxPercent} minValue={0} maxValue={1} step={0.0001} formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { taxPercent: value })); });
            }}/>
                            <Form_1.NumberControlled name="shippingCost" label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Shipping Cost"], ["Shipping Cost"])))} value={assetData.shippingCost} minValue={0} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { shippingCost: value })); });
            }}/>
                            <Form_1.NumberControlled name="addOnCost" label={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Add-On Cost"], ["Add-On Cost"])))} value={assetData.addOnCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { addOnCost: value })); });
            }}/>
                            <Form_1.NumberControlled name="nonTaxableAddOnCost" label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Non-Taxable Add-On Cost"], ["Non-Taxable Add-On Cost"])))} value={assetData.nonTaxableAddOnCost} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { nonTaxableAddOnCost: value })); });
            }}/>
                          </div>
                        </div>
                      </react_1.VStack>
                    </>)}
                </react_1.ModalCardBody>
                <react_1.ModalCardFooter>
                  <Form_1.Submit isDisabled={isPriceResolving ||
            !isEditable ||
            (isEditing
                ? !permissions.can("update", "sales")
                : !permissions.can("create", "sales"))}>
                    <macro_1.Trans>Save</macro_1.Trans>
                  </Form_1.Submit>
                </react_1.ModalCardFooter>
              </form_1.ValidatedForm>
            </react_1.ModalCardContent>
          </react_1.ModalCard>
        </react_1.ModalCardProvider>
      </react_1.Tabs>
      {isEditing && deleteDisclosure.isOpen && (<DeleteSalesOrderLine_1.default line={initialValues} onCancel={deleteDisclosure.onClose}/>)}
    </>);
};
exports.default = SalesOrderLineForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25;
