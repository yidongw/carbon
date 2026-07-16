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
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var QuoteMaterialForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var initialValues = _a.initialValues, operations = _a.operations;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var location = (0, react_router_1.useLocation)();
    var _k = (0, react_router_1.useParams)(), quoteId = _k.quoteId, lineId = _k.lineId, materialId = _k.materialId;
    if (!quoteId)
        throw new Error("quoteId not found");
    if (!lineId)
        throw new Error("lineId not found");
    if (!materialId)
        throw new Error("materialId not found");
    var _l = (0, react_2.useState)(initialValues.itemType), itemType = _l[0], setItemType = _l[1];
    var _m = (0, react_2.useState)({
        itemId: (_b = initialValues.itemId) !== null && _b !== void 0 ? _b : "",
        methodType: (_c = initialValues.methodType) !== null && _c !== void 0 ? _c : "Pull from Inventory",
        description: (_d = initialValues.description) !== null && _d !== void 0 ? _d : "",
        unitCost: (_e = initialValues.unitCost) !== null && _e !== void 0 ? _e : 0,
        unitOfMeasureCode: (_f = initialValues.unitOfMeasureCode) !== null && _f !== void 0 ? _f : "EA",
        quantity: (_g = initialValues.quantity) !== null && _g !== void 0 ? _g : 1,
        itemReplenishmentSystem: (_j = (_h = initialValues.item) === null || _h === void 0 ? void 0 : _h.replenishmentSystem) !== null && _j !== void 0 ? _j : "Buy"
    }), itemData = _m[0], setItemData = _m[1];
    var onTypeChange = function (value) {
        if (value === itemType)
            return;
        setItemType(value);
        setItemData({
            itemId: "",
            methodType: "",
            quantity: 1,
            description: "",
            unitCost: 0,
            unitOfMeasureCode: "EA",
            itemReplenishmentSystem: "Buy"
        });
    };
    var lookupBuyPrice = (0, react_2.useCallback)(function (itemId, qty, fallbackCost) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, items_1.lookupBuyPrice)(carbon, itemId, qty, fallbackCost)];
        });
    }); }, [carbon]);
    var onItemChange = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, item, itemCost, unitCost, isBuyPart;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("item")
                                .select("name, readableIdWithRevision, unitOfMeasureCode, defaultMethodType, replenishmentSystem")
                                .eq("id", itemId)
                                .single(),
                            carbon.from("itemCost").select("unitCost").eq("itemId", itemId).single()
                        ])];
                case 1:
                    _a = _f.sent(), item = _a[0], itemCost = _a[1];
                    if (item.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to load item details"], ["Failed to load item details"]))));
                        return [2 /*return*/];
                    }
                    unitCost = (_c = (_b = itemCost.data) === null || _b === void 0 ? void 0 : _b.unitCost) !== null && _c !== void 0 ? _c : 0;
                    isBuyPart = ((_d = item.data) === null || _d === void 0 ? void 0 : _d.defaultMethodType) === "Purchase to Order";
                    if (!isBuyPart) return [3 /*break*/, 3];
                    return [4 /*yield*/, lookupBuyPrice(itemId, (_e = itemData.quantity) !== null && _e !== void 0 ? _e : 1, unitCost)];
                case 2:
                    unitCost = _f.sent();
                    _f.label = 3;
                case 3:
                    setItemData(function (d) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        return (__assign(__assign({}, d), { itemId: itemId, description: (_b = (_a = item.data) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", unitCost: unitCost, unitOfMeasureCode: (_d = (_c = item.data) === null || _c === void 0 ? void 0 : _c.unitOfMeasureCode) !== null && _d !== void 0 ? _d : "EA", methodType: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.defaultMethodType) !== null && _f !== void 0 ? _f : "Purchase to Order", itemReplenishmentSystem: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.replenishmentSystem) !== null && _h !== void 0 ? _h : "Buy" }));
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var onQuantityChange = (0, react_2.useCallback)(function (newQty) { return __awaiter(void 0, void 0, void 0, function () {
        var itemCost, fallbackCost, unitCost;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setItemData(function (d) { return (__assign(__assign({}, d), { quantity: newQty })); });
                    if (itemData.methodType !== "Purchase to Order" || !itemData.itemId)
                        return [2 /*return*/];
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("itemCost")
                            .select("unitCost")
                            .eq("itemId", itemData.itemId)
                            .single()];
                case 1:
                    itemCost = _c.sent();
                    fallbackCost = (_b = (_a = itemCost.data) === null || _a === void 0 ? void 0 : _a.unitCost) !== null && _b !== void 0 ? _b : 0;
                    return [4 /*yield*/, lookupBuyPrice(itemData.itemId, newQty, fallbackCost)];
                case 2:
                    unitCost = _c.sent();
                    setItemData(function (d) { return (__assign(__assign({}, d), { unitCost: unitCost })); });
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, itemData.methodType, itemData.itemId, lookupBuyPrice]);
    var _o = (0, hooks_1.useUrlParams)(), setSearchParams = _o[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a;
        var newPath = path_1.path.to.quoteLineMakeMethod(quoteId, lineId, initialValues.quoteMaterialMakeMethodId);
        setSearchParams({ materialId: (_a = initialValues.id) !== null && _a !== void 0 ? _a : null });
        navigate(newPath);
    }, [
        fetcher.data,
        initialValues,
        initialValues.id,
        initialValues.methodType,
        initialValues.quoteMaterialMakeMethodId,
        lineId,
        location.pathname,
        navigate,
        quoteId
    ]);
    var items = (0, stores_1.useItems)()[0];
    var itemReadableId = (0, utils_1.getItemReadableId)(items, itemData.itemId);
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" action={path_1.path.to.quoteMaterial(quoteId, lineId, initialValues === null || initialValues === void 0 ? void 0 : initialValues.id)} defaultValues={initialValues} fetcher={fetcher} validator={sales_models_1.quoteMaterialValidator}>
        <react_1.CardHeader>
          <react_1.CardTitle className="line-clamp-2">{itemData.description}</react_1.CardTitle>
          <react_1.CardDescription className="flex items-center gap-2">
            {itemReadableId} <react_1.Copy text={itemReadableId !== null && itemReadableId !== void 0 ? itemReadableId : ""}/>
          </react_1.CardDescription>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="quoteMakeMethodId"/>

          {itemData.methodType === "Make to Order" && (<Form_1.Hidden name="unitCost" value={itemData.unitCost}/>)}
          <Form_1.Hidden name="order"/>
          <react_1.VStack className="pt-4">
            <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
              <Form_1.Item name="itemId" label={itemType} type={itemType} includeInactive onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }} onTypeChange={onTypeChange}/>
              <Form_1.InputControlled name="description" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Description"], ["Description"])))} value={itemData.description} onChange={function (newValue) {
            setItemData(function (d) { return (__assign(__assign({}, d), { description: newValue })); });
        }}/>
              <Form_1.Select name="quoteOperationId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Operation"], ["Operation"])))} isClearable options={operations.map(function (o) { return ({
            value: o.id,
            label: o.description
        }); })}/>

              <Form_1.DefaultMethodType name="methodType" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Method Type"], ["Method Type"])))} value={itemData.methodType} replenishmentSystem={itemData.itemReplenishmentSystem}/>
              <Form_1.NumberControlled name="quantity" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity per Parent"], ["Quantity per Parent"])))} value={itemData.quantity} onChange={onQuantityChange}/>
              <Form_1.UnitOfMeasure name="unitOfMeasureCode" value={itemData.unitOfMeasureCode} onChange={function (newValue) {
            return setItemData(function (d) {
                var _a;
                return (__assign(__assign({}, d), { unitOfMeasureCode: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "EA" }));
            });
        }}/>
              {itemData.methodType !== "Make to Order" && (<Form_1.NumberControlled name="unitCost" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} value={itemData.unitCost} minValue={0}/>)}
            </div>
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!permissions.can("update", "sales")}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = QuoteMaterialForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
