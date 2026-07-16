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
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var invoicing_1 = require("~/modules/invoicing");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var invoicing_models_1 = require("../../invoicing.models");
var SalesInvoiceLineForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
    var initialValues = _a.initialValues, type = _a.type, _18 = _a.isSalesOrderLine, isSalesOrderLine = _18 === void 0 ? false : _18, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _19 = (0, hooks_1.useUser)(), company = _19.company, defaults = _19.defaults;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("invoiceId not found");
    var items = (0, stores_1.useItems)()[0];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesInvoice(invoiceId));
    var isLocked = (0, invoicing_models_1.isSalesInvoiceLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _b === void 0 ? void 0 : _b.status);
    var isEditable = !isLocked;
    var _20 = (0, react_2.useState)(initialValues.invoiceLineType), itemType = _20[0], setItemType = _20[1];
    var _21 = (0, react_2.useState)((_c = defaults.locationId) !== null && _c !== void 0 ? _c : ""), locationId = _21[0], setLocationId = _21[1];
    var _22 = (0, react_2.useState)({
        itemId: (_d = initialValues.itemId) !== null && _d !== void 0 ? _d : "",
        methodType: (_e = initialValues.methodType) !== null && _e !== void 0 ? _e : "",
        description: (_f = initialValues.description) !== null && _f !== void 0 ? _f : "",
        quantity: (_g = initialValues.quantity) !== null && _g !== void 0 ? _g : 1,
        unitPrice: (_h = initialValues.unitPrice) !== null && _h !== void 0 ? _h : 0,
        shippingCost: (_j = initialValues.shippingCost) !== null && _j !== void 0 ? _j : 0,
        unitOfMeasureCode: (_k = initialValues.unitOfMeasureCode) !== null && _k !== void 0 ? _k : "",
        storageUnitId: (_l = initialValues.storageUnitId) !== null && _l !== void 0 ? _l : "",
        taxAmount: (((_m = initialValues.unitPrice) !== null && _m !== void 0 ? _m : 0) * ((_o = initialValues.quantity) !== null && _o !== void 0 ? _o : 1) +
            ((_p = initialValues.shippingCost) !== null && _p !== void 0 ? _p : 0)) *
            ((_q = initialValues.taxPercent) !== null && _q !== void 0 ? _q : 0),
        taxPercent: (_r = initialValues.taxPercent) !== null && _r !== void 0 ? _r : 0
    }), itemData = _22[0], setItemData = _22[1];
    // update tax amount when quantity or unit price changes
    (0, react_2.useEffect)(function () {
        var subtotal = itemData.unitPrice * itemData.quantity + itemData.shippingCost;
        if (itemData.taxPercent !== 0) {
            setItemData(function (d) { return (__assign(__assign({}, d), { taxAmount: subtotal * itemData.taxPercent })); });
        }
    }, [
        itemData.unitPrice,
        itemData.quantity,
        itemData.shippingCost,
        itemData.taxPercent
    ]);
    var isFixedAsset = initialValues.invoiceLineType === "Fixed Asset";
    var _23 = (0, react_2.useState)(isFixedAsset ? "asset" : "item"), activeTab = _23[0], setActiveTab = _23[1];
    var _24 = (0, react_2.useState)([]), assetOptions = _24[0], setAssetOptions = _24[1];
    var _25 = (0, react_2.useState)({
        assetId: (_s = initialValues.assetId) !== null && _s !== void 0 ? _s : "",
        description: (_t = initialValues.description) !== null && _t !== void 0 ? _t : "",
        quantity: (_u = initialValues.quantity) !== null && _u !== void 0 ? _u : 1,
        unitPrice: (_v = initialValues.unitPrice) !== null && _v !== void 0 ? _v : 0,
        taxPercent: (_w = initialValues.taxPercent) !== null && _w !== void 0 ? _w : 0,
        taxAmount: 0,
        shippingCost: (_x = initialValues.shippingCost) !== null && _x !== void 0 ? _x : 0,
        addOnCost: (_y = initialValues.addOnCost) !== null && _y !== void 0 ? _y : 0,
        nonTaxableAddOnCost: (_z = initialValues.nonTaxableAddOnCost) !== null && _z !== void 0 ? _z : 0
    }), assetData = _25[0], setAssetData = _25[1];
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
    var costsDisclosure = (0, react_1.useDisclosure)();
    var assetCostsDisclosure = (0, react_1.useDisclosure)();
    var isEditing = initialValues.id !== undefined;
    var hasInvalidMethodType = itemData.methodType === "Make to Order" && !isSalesOrderLine;
    var isDisabled = !isEditable
        ? true
        : hasInvalidMethodType
            ? true
            : isEditing
                ? !permissions.can("update", "purchasing")
                : !permissions.can("create", "purchasing");
    var onTypeChange = function (t) {
        if (t === itemType)
            return;
        setItemType(t);
        setItemData({
            itemId: "",
            methodType: "",
            description: "",
            quantity: 1,
            unitPrice: 0,
            shippingCost: 0,
            unitOfMeasureCode: "",
            storageUnitId: "",
            taxAmount: 0,
            taxPercent: 0
        });
    };
    var onItemChange = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, item_1, inventory_1, itemCost_1, trackingType, errorMessage;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
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
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, Promise.all([
                        carbon
                            .from("item")
                            .select("name, readableIdWithRevision, type, unitOfMeasureCode, defaultMethodType, itemTrackingType, itemCost(unitCost)")
                            .eq("id", itemId)
                            .eq("companyId", company.id)
                            .single(),
                        carbon
                            .from("pickMethod")
                            .select("defaultStorageUnitId")
                            .eq("itemId", itemId)
                            .eq("companyId", company.id)
                            .eq("locationId", locationId)
                            .maybeSingle()
                    ])];
                case 2:
                    _b = _g.sent(), item_1 = _b[0], inventory_1 = _b[1];
                    itemCost_1 = (_d = (_c = item_1 === null || item_1 === void 0 ? void 0 : item_1.data) === null || _c === void 0 ? void 0 : _c.itemCost) === null || _d === void 0 ? void 0 : _d[0];
                    trackingType = (_e = item_1 === null || item_1 === void 0 ? void 0 : item_1.data) === null || _e === void 0 ? void 0 : _e.itemTrackingType;
                    // Check if item requires a sales order (excluding Make items which can be changed to Pick)
                    if (trackingType === "Batch" || trackingType === "Serial") {
                        errorMessage = trackingType === "Batch"
                            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Batch items require a sales order"], ["Batch items require a sales order"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Serial items require a sales order"], ["Serial items require a sales order"])));
                        react_1.toast.error(errorMessage);
                        setItemData({
                            itemId: "",
                            methodType: "",
                            description: "",
                            quantity: 1,
                            unitPrice: 0,
                            shippingCost: 0,
                            unitOfMeasureCode: "",
                            storageUnitId: "",
                            taxAmount: 0,
                            taxPercent: 0
                        });
                        return [2 /*return*/];
                    }
                    setItemData(function (prev) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                        return (__assign(__assign({}, prev), { itemId: itemId, description: (_b = (_a = item_1.data) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", methodType: (_d = (_c = item_1.data) === null || _c === void 0 ? void 0 : _c.defaultMethodType) !== null && _d !== void 0 ? _d : "", unitPrice: ((_e = itemCost_1 === null || itemCost_1 === void 0 ? void 0 : itemCost_1.unitCost) !== null && _e !== void 0 ? _e : 0) /
                                ((_g = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _f === void 0 ? void 0 : _f.exchangeRate) !== null && _g !== void 0 ? _g : 1), shippingCost: 0, unitOfMeasureCode: (_j = (_h = item_1.data) === null || _h === void 0 ? void 0 : _h.unitOfMeasureCode) !== null && _j !== void 0 ? _j : "EA", storageUnitId: (_l = (_k = inventory_1.data) === null || _k === void 0 ? void 0 : _k.defaultStorageUnitId) !== null && _l !== void 0 ? _l : null, taxAmount: 0, taxPercent: 0 }));
                    });
                    if ((_f = item_1.data) === null || _f === void 0 ? void 0 : _f.type) {
                        setItemType(item_1.data.type);
                    }
                    return [3 /*break*/, 4];
                case 3: throw new Error("Invalid invoice line type: ".concat(itemType, " is not implemented"));
                case 4: return [2 /*return*/];
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
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var invoiceCurrency = (_1 = (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _0 === void 0 ? void 0 : _0.currencyCode) !== null && _1 !== void 0 ? _1 : company.baseCurrencyCode;
    return (<react_1.Tabs value={activeTab} onValueChange={function (v) { return setActiveTab(v); }} className="w-full">
      <react_1.ModalCardProvider type={type}>
        <react_1.ModalCard onClose={onClose} isCollapsible={isEditing} defaultCollapsed={false}>
          <react_1.ModalCardContent size="xxlarge">
            <form_1.ValidatedForm defaultValues={initialValues} validator={invoicing_1.salesInvoiceLineValidator} method="post" action={isEditing
            ? path_1.path.to.salesInvoiceLine(invoiceId, initialValues.id)
            : path_1.path.to.newSalesInvoiceLine(invoiceId)} className="w-full" isDisabled={isEditing && isLocked} onSubmit={function () {
            if (type === "modal")
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
              <react_1.HStack className={(0, react_1.cn)("w-full justify-between items-start", type === "modal" && "pr-16")}>
                <react_1.ModalCardHeader className="flex flex-1">
                  <react_1.ModalCardTitle className={(0, react_1.cn)(isEditing &&
            !isFixedAsset &&
            !(itemData === null || itemData === void 0 ? void 0 : itemData.itemId) &&
            "text-muted-foreground")}>
                    {isEditing ? (isFixedAsset ? (initialValues.assetReadableId || "Fixed Asset") : (((_2 = (0, utils_1.getItemReadableId)(items, itemData === null || itemData === void 0 ? void 0 : itemData.itemId)) !== null && _2 !== void 0 ? _2 : "..."))) : (<macro_1.Trans>New Sales Invoice Line</macro_1.Trans>)}
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
                            {initialValues === null || initialValues === void 0 ? void 0 : initialValues.quantity}{" "}
                            {!isFixedAsset && (<components_1.MethodIcon type={itemData.methodType}/>)}
                          </react_1.Badge>
                          <react_1.Badge variant="green">
                            {currencyFormatter.format((_3 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.unitPrice) !== null && _3 !== void 0 ? _3 : 0)}{" "}
                            {initialValues === null || initialValues === void 0 ? void 0 : initialValues.unitOfMeasureCode}
                          </react_1.Badge>
                          {((_4 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) !== null && _4 !== void 0 ? _4 : 0) > 0 ? (<react_1.Badge variant="red">
                              {percentFormatter.format((_5 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) !== null && _5 !== void 0 ? _5 : 0)}{" "}
                              {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Tax"], ["Tax"])))}
                            </react_1.Badge>) : null}
                        </div>
                      </div>) : (t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["A sales invoice line contains invoice details for a particular item"], ["A sales invoice line contains invoice details for a particular item"]))))}
                  </react_1.ModalCardDescription>
                </react_1.ModalCardHeader>
                <div className="flex-shrink-0">
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
                </div>
              </react_1.HStack>
              <react_1.ModalCardBody>
                <Form_1.Hidden name="id"/>
                <Form_1.Hidden name="invoiceId"/>
                <Form_1.Hidden name="exchangeRate" value={(_7 = (_6 = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _6 === void 0 ? void 0 : _6.exchangeRate) !== null && _7 !== void 0 ? _7 : 1}/>

                <react_1.TabsContent value="item">
                  <Form_1.Hidden name="invoiceLineType" value={itemType}/>
                  <Form_1.Hidden name="description" value={itemData.description}/>
                  <Form_1.Hidden name="unitOfMeasureCode" value={itemData === null || itemData === void 0 ? void 0 : itemData.unitOfMeasureCode}/>

                  <react_1.VStack>
                    {hasInvalidMethodType && (<react_1.Alert variant="destructive" className="mb-4">
                        <lu_1.LuCircleAlert className="w-4 h-4"/>
                        <react_1.AlertTitle>
                          <macro_1.Trans>
                            Make items cannot be invoiced directly. Change
                            method to Pick to continue.
                          </macro_1.Trans>
                        </react_1.AlertTitle>
                      </react_1.Alert>)}
                    <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                      <Form_1.Item name="itemId" label={itemType} 
    // @ts-ignore
    type={itemType} locationId={locationId} onChange={function (value) {
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
                          <div className="space-y-2">
                            <Form_1.SelectControlled name="methodType" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Method"], ["Method"])))} options={(_8 = shared_1.methodType.map(function (m) { return ({
                label: (<span className="flex items-center gap-2">
                                      <components_1.MethodIcon type={m}/>
                                      {m}
                                    </span>),
                value: m
            }); })) !== null && _8 !== void 0 ? _8 : []} value={itemData.methodType} onChange={function (newValue) {
                if (newValue)
                    setItemData(function (d) { return (__assign(__assign({}, d), { methodType: newValue === null || newValue === void 0 ? void 0 : newValue.value })); });
            }}/>
                          </div>

                          <Form_1.NumberControlled name="quantity" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={itemData.quantity} onChange={function (value) {
                setItemData(function (d) { return (__assign(__assign({}, d), { quantity: value })); });
            }}/>

                          <Form_1.NumberControlled name="unitPrice" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Unit Price"], ["Unit Price"])))} value={itemData.unitPrice} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }} onChange={function (value) {
                return setItemData(function (d) { return (__assign(__assign({}, d), { unitPrice: value })); });
            }}/>
                          <Form_1.Location name="locationId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Shipping Location"], ["Shipping Location"])))} value={locationId} onChange={onLocationChange}/>
                          <Form_1.StorageUnit name="storageUnitId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} locationId={locationId} value={(_9 = itemData.storageUnitId) !== null && _9 !== void 0 ? _9 : undefined} onChange={function (newValue) {
                if (newValue) {
                    setItemData(function (d) { return (__assign(__assign({}, d), { storageUnitId: newValue === null || newValue === void 0 ? void 0 : newValue.id })); });
                }
            }}/>
                        </>)}
                      <Form_1.CustomFormFields table="salesInvoiceLine"/>
                    </div>

                    {[
            "Item",
            "Part",
            "Material",
            "Tool",
            "Consumable",
            "Service",
            "Fixture"
        ].includes(itemType) && (<div className="w-full">
                        <div className="w-full border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 mt-4">
                          <react_1.HStack className="w-full justify-between cursor-pointer" onClick={costsDisclosure.onToggle}>
                            <react_1.Label>
                              <macro_1.Trans>Tax & Additional Costs</macro_1.Trans>
                            </react_1.Label>
                            <react_1.HStack>
                              {((_10 = itemData.taxPercent) !== null && _10 !== void 0 ? _10 : 0) > 0 && (<react_1.Badge variant="red">
                                  {percentFormatter.format((_11 = itemData.taxPercent) !== null && _11 !== void 0 ? _11 : 0)}{" "}
                                  <macro_1.Trans>Tax</macro_1.Trans>
                                </react_1.Badge>)}
                              {((_12 = itemData.shippingCost) !== null && _12 !== void 0 ? _12 : 0) > 0 && (<react_1.Badge variant="secondary" className="flex items-center gap-1">
                                  <lu_1.LuTruck />
                                  <span>
                                    {currencyFormatter.format((_13 = itemData.shippingCost) !== null && _13 !== void 0 ? _13 : 0)}
                                  </span>
                                </react_1.Badge>)}
                              {((_14 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.addOnCost) !== null && _14 !== void 0 ? _14 : 0) > 0 ||
                (((_15 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.nonTaxableAddOnCost) !== null && _15 !== void 0 ? _15 : 0) >
                    0 && (<react_1.Badge variant="secondary" className="flex items-center gap-1">
                                    <lu_1.LuPlus />
                                    <span>
                                      {currencyFormatter.format(((_16 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.addOnCost) !== null && _16 !== void 0 ? _16 : 0) +
                        ((_17 = initialValues === null || initialValues === void 0 ? void 0 : initialValues.nonTaxableAddOnCost) !== null && _17 !== void 0 ? _17 : 0))}{" "}
                                      <macro_1.Trans>Add-On</macro_1.Trans>
                                    </span>
                                  </react_1.Badge>))}

                              <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={costsDisclosure.isOpen
                ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Collapse Costs"], ["Collapse Costs"]))) : t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Expand Costs"], ["Expand Costs"])))} variant="ghost" size="md" onClick={function (e) {
                e.stopPropagation();
                costsDisclosure.onToggle();
            }} className={"transition-transform ".concat(costsDisclosure.isOpen ? "rotate-90" : "")}/>
                            </react_1.HStack>
                          </react_1.HStack>
                          <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(costsDisclosure.isOpen ? "" : "hidden")}>
                            <Form_1.NumberControlled name="taxPercent" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} value={itemData.taxPercent} minValue={0} maxValue={1} step={0.0001} formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }} onChange={function (value) {
                var subtotal = itemData.unitPrice * itemData.quantity +
                    itemData.shippingCost;
                setItemData(function (d) { return (__assign(__assign({}, d), { taxPercent: value, taxAmount: subtotal * value })); });
            }}/>
                            <Form_1.NumberControlled name="taxAmount" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Tax Amount"], ["Tax Amount"])))} value={itemData.taxAmount} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }} onChange={function (value) {
                var subtotal = itemData.unitPrice * itemData.quantity +
                    itemData.shippingCost;
                setItemData(function (d) { return (__assign(__assign({}, d), { taxAmount: value, taxPercent: subtotal > 0 ? value / subtotal : 0 })); });
            }}/>
                            <Form_1.NumberControlled name="shippingCost" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Shipping Cost"], ["Shipping Cost"])))} value={itemData.shippingCost} minValue={0} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }} onChange={function (value) {
                return setItemData(function (d) { return (__assign(__assign({}, d), { shippingCost: value })); });
            }}/>
                            <Form_1.Number name="addOnCost" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Add-On Cost"], ["Add-On Cost"])))} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }}/>
                            <Form_1.Number name="nonTaxableAddOnCost" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Non-Taxable Add-On Cost"], ["Non-Taxable Add-On Cost"])))} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }}/>
                          </div>
                        </div>
                      </div>)}
                  </react_1.VStack>
                </react_1.TabsContent>

                {activeTab === "asset" && (<>
                    <Form_1.Hidden name="invoiceLineType" value="Fixed Asset"/>
                    <Form_1.Hidden name="description" value={assetData.description}/>
                    <react_1.VStack>
                      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                        <form_1.Combobox name="assetId" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Fixed Asset"], ["Fixed Asset"])))} isOptional={false} options={assetOptions} value={assetData.assetId} onChange={function (selected) {
                setAssetData(function (d) {
                    var _a;
                    return (__assign(__assign({}, d), { assetId: (_a = selected === null || selected === void 0 ? void 0 : selected.value) !== null && _a !== void 0 ? _a : "" }));
                });
            }}/>
                        <Form_1.Location name="locationId" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Shipping Location"], ["Shipping Location"])))} value={locationId} onChange={onLocationChange}/>
                        <react_1.FormControl>
                          <react_1.FormLabel>
                            <macro_1.Trans>Description</macro_1.Trans>
                          </react_1.FormLabel>
                          <react_1.Input value={assetData.description} onChange={function (e) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { description: e.target.value })); });
            }}/>
                        </react_1.FormControl>
                        <Form_1.NumberControlled name="quantity" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Quantity"], ["Quantity"])))} isOptional={false} isDisabled value={1} onChange={function () { return undefined; }}/>
                        <Form_1.NumberControlled name="unitPrice" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Unit Price"], ["Unit Price"])))} isOptional={false} value={assetData.unitPrice} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { unitPrice: value })); });
            }}/>
                        <Form_1.CustomFormFields table="salesInvoiceLine"/>
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
                            <react_1.IconButton icon={<lu_1.LuChevronRight />} aria-label={assetCostsDisclosure.isOpen
                ? t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Collapse Costs"], ["Collapse Costs"]))) : t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Expand Costs"], ["Expand Costs"])))} variant="ghost" size="md" onClick={function (e) {
                e.stopPropagation();
                assetCostsDisclosure.onToggle();
            }} className={"transition-transform ".concat(assetCostsDisclosure.isOpen ? "rotate-90" : "")}/>
                          </react_1.HStack>
                        </react_1.HStack>
                        <div className={"grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3 pb-4 ".concat(assetCostsDisclosure.isOpen ? "" : "hidden")}>
                          <Form_1.NumberControlled name="taxPercent" label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} value={assetData.taxPercent} minValue={0} maxValue={1} step={0.0001} formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { taxPercent: value })); });
            }}/>
                          <Form_1.NumberControlled name="shippingCost" label={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Shipping Cost"], ["Shipping Cost"])))} value={assetData.shippingCost} minValue={0} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { shippingCost: value })); });
            }}/>
                          <Form_1.NumberControlled name="addOnCost" label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Add-On Cost"], ["Add-On Cost"])))} value={assetData.addOnCost} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { addOnCost: value })); });
            }}/>
                          <Form_1.NumberControlled name="nonTaxableAddOnCost" label={t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Non-Taxable Add-On Cost"], ["Non-Taxable Add-On Cost"])))} value={assetData.nonTaxableAddOnCost} formatOptions={{
                style: "currency",
                currency: invoiceCurrency
            }} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { nonTaxableAddOnCost: value })); });
            }}/>
                        </div>
                      </div>
                    </react_1.VStack>
                  </>)}
              </react_1.ModalCardBody>
              <react_1.ModalCardFooter>
                <Form_1.Submit isDisabled={isDisabled} withBlocker={false}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
              </react_1.ModalCardFooter>
            </form_1.ValidatedForm>
          </react_1.ModalCardContent>
        </react_1.ModalCard>
      </react_1.ModalCardProvider>
    </react_1.Tabs>);
};
exports.default = SalesInvoiceLineForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26;
