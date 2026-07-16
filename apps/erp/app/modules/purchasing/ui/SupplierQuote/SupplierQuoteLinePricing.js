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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Enumerable_1 = require("~/components/Enumerable");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var SupplierQuoteLinePricing = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var line = _a.line, pricesByQuantity = _a.pricesByQuantity, _o = _a.exchangeRate, exchangeRate = _o === void 0 ? 1 : _o;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var quantities = (_b = line.quantity) !== null && _b !== void 0 ? _b : [1];
    var _p = (0, react_router_1.useParams)(), id = _p.id, lineId = _p.lineId;
    if (!id)
        throw new Error("Could not find id");
    if (!lineId)
        throw new Error("Could not find lineId");
    // Consolidated state for all editable fields
    var _q = (0, react_2.useState)({
        prices: pricesByQuantity
    }), editableFields = _q[0], setEditableFields = _q[1];
    (0, react_2.useEffect)(function () {
        setEditableFields(function (prev) { return (__assign(__assign({}, prev), { prices: pricesByQuantity })); });
    }, [pricesByQuantity]);
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.supplierQuote(id));
    var isEditable = permissions.can("update", "purchasing") &&
        ["Draft"].includes((_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : "");
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _r = (0, hooks_1.useUser)(), userId = _r.id, company = _r.company;
    var baseCurrency = (_e = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _e !== void 0 ? _e : "USD";
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var presentationCurrencyFormatter = (0, hooks_1.useCurrencyFormatter)({
        currency: (_g = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _f === void 0 ? void 0 : _f.currencyCode) !== null && _g !== void 0 ? _g : baseCurrency
    });
    var onUpdatePrice = (0, react_2.useCallback)(function (key, quantity, value) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPrice, oldPrices, newPrices, update, insert;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    hasPrice = !!editableFields.prices[quantity];
                    oldPrices = __assign({}, editableFields.prices);
                    newPrices = __assign({}, oldPrices);
                    if (!hasPrice) {
                        newPrices[quantity] = {
                            supplierQuoteId: id,
                            supplierQuoteLineId: lineId,
                            quantity: quantity,
                            leadTime: 0,
                            exchangeRate: exchangeRate !== null && exchangeRate !== void 0 ? exchangeRate : 1,
                            supplierUnitPrice: 0,
                            supplierShippingCost: 0,
                            supplierTaxAmount: 0,
                            createdBy: userId
                        };
                    }
                    newPrices[quantity] = __assign(__assign({}, newPrices[quantity]), (_a = {}, _a[key] = value, _a));
                    setEditableFields(function (prev) { return (__assign(__assign({}, prev), { prices: newPrices })); });
                    if (!hasPrice) return [3 /*break*/, 2];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("supplierQuoteLinePrice").update((_b = {},
                            _b[key] = value,
                            _b.supplierQuoteLineId = lineId,
                            _b.quantity = quantity,
                            _b)).eq("supplierQuoteLineId", lineId).eq("quantity", quantity))];
                case 1:
                    update = _c.sent();
                    if (update === null || update === void 0 ? void 0 : update.error) {
                        console.error(update.error);
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to update supplier quote line"], ["Failed to update supplier quote line"]))));
                    }
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("supplierQuoteLinePrice").insert(__assign(__assign({}, newPrices[quantity]), { supplierQuoteLineId: lineId, quantity: quantity })))];
                case 3:
                    insert = _c.sent();
                    if (insert === null || insert === void 0 ? void 0 : insert.error) {
                        console.error(insert.error);
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to insert supplier quote line"], ["Failed to insert supplier quote line"]))));
                    }
                    _c.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [editableFields.prices, id, lineId, exchangeRate, userId, carbon, t]);
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Prices</macro_1.Trans>
        </react_1.CardTitle>
      </react_1.CardHeader>

      <react_1.CardContent>
        <react_1.Table>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th className="w-[300px]"/>
              {quantities.map(function (quantity) { return (<react_1.Th key={quantity.toString()}>{quantity}</react_1.Th>); })}
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            <react_1.Tr>
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Lead Time</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity) {
            var _a, _b;
            var leadTime = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.leadTime) !== null && _b !== void 0 ? _b : 0;
            return (<react_1.Td key={quantity.toString()} className="group-hover:bg-muted/50">
                    <react_1.NumberField value={leadTime} formatOptions={{
                    style: "unit",
                    unit: "day",
                    unitDisplay: "long"
                }} minValue={0} onChange={function (value) {
                    if (Number.isFinite(value) && value !== leadTime) {
                        onUpdatePrice("leadTime", quantity, value);
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>

            <react_1.Tr>
              <react_1.Td className="border-r border-border">
                <react_1.HStack className="w-full justify-between ">
                  <span>Supplier Unit Price</span>

                  <Enumerable_1.Enumerable value={(_j = (_h = unitOfMeasures.find(function (uom) { return uom.value === line.purchaseUnitOfMeasureCode; })) === null || _h === void 0 ? void 0 : _h.label) !== null && _j !== void 0 ? _j : null}/>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity) {
            var _a, _b, _c, _d;
            var price = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.supplierUnitPrice) !== null && _b !== void 0 ? _b : 0;
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.NumberField value={price} formatOptions={{
                    style: "currency",
                    currency: (_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.currencyCode) !== null && _d !== void 0 ? _d : baseCurrency
                }} minValue={0} onChange={function (value) {
                    if (Number.isFinite(value) && value !== price) {
                        onUpdatePrice("supplierUnitPrice", quantity, value);
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>

            <react_1.Tr className="[&>td]:bg-muted/60">
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Unit Price</span>
                  <Enumerable_1.Enumerable value={(_l = (_k = unitOfMeasures.find(function (uom) { return uom.value === line.inventoryUnitOfMeasureCode; })) === null || _k === void 0 ? void 0 : _k.label) !== null && _l !== void 0 ? _l : null}/>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity, index) {
            var _a, _b, _c;
            var price = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.unitPrice) !== null && _b !== void 0 ? _b : 0;
            return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                    <react_1.VStack spacing={0}>
                      <span>
                        {formatter.format(price / ((_c = line.conversionFactor) !== null && _c !== void 0 ? _c : 1))}
                      </span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>

            <react_1.Tr>
              <react_1.Td className="border-r border-border">
                <react_1.HStack className="w-full justify-between ">
                  <span>Shipping Cost</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity) {
            var _a, _b, _c, _d;
            var shippingCost = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.supplierShippingCost) !== null && _b !== void 0 ? _b : 0;
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.NumberField value={shippingCost} formatOptions={{
                    style: "currency",
                    currency: (_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.currencyCode) !== null && _d !== void 0 ? _d : baseCurrency
                }} minValue={0} onChange={function (value) {
                    if (Number.isFinite(value) && value !== shippingCost) {
                        onUpdatePrice("supplierShippingCost", quantity, value);
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>

            <react_1.Tr>
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Tax Amount</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity, index) {
            var _a, _b, _c, _d;
            var taxAmount = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.supplierTaxAmount) !== null && _b !== void 0 ? _b : 0;
            return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                    <react_1.NumberField value={taxAmount} formatOptions={{
                    style: "currency",
                    currency: (_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.currencyCode) !== null && _d !== void 0 ? _d : baseCurrency
                }} minValue={0} onChange={function (value) {
                    if (Number.isFinite(value) && value !== taxAmount) {
                        onUpdatePrice("supplierTaxAmount", quantity, value);
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            <react_1.Tr className="font-bold [&>td]:bg-muted/60">
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Supplier Total Price</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity, index) {
            var _a, _b, _c, _d, _e, _f;
            var subtotal = ((_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.supplierUnitPrice) !== null && _b !== void 0 ? _b : 0) *
                quantity +
                ((_d = (_c = editableFields.prices[quantity]) === null || _c === void 0 ? void 0 : _c.supplierShippingCost) !== null && _d !== void 0 ? _d : 0);
            var tax = (_f = (_e = editableFields.prices[quantity]) === null || _e === void 0 ? void 0 : _e.supplierTaxAmount) !== null && _f !== void 0 ? _f : 0;
            var price = subtotal + tax;
            return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                    <react_1.VStack spacing={0}>
                      <span>{presentationCurrencyFormatter.format(price)}</span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            {((_m = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _m === void 0 ? void 0 : _m.currencyCode) !== baseCurrency && (<>
                <react_1.Tr className="[&>td]:bg-muted/60">
                  <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                    <react_1.HStack className="w-full justify-between ">
                      <span>Exchange Rate</span>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantities.map(function (quantity, index) {
                var _a, _b, _c;
                var rate = (_c = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.exchangeRate) !== null && _b !== void 0 ? _b : exchangeRate) !== null && _c !== void 0 ? _c : 1;
                return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                        <react_1.VStack spacing={0}>
                          <span>{rate !== null && rate !== void 0 ? rate : 1}</span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                <react_1.Tr className="font-bold [&>td]:bg-muted/60">
                  <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                    <react_1.HStack className="w-full justify-between ">
                      <span>Total Price</span>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantities.map(function (quantity, index) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                var subtotal = (((_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.supplierUnitPrice) !== null && _b !== void 0 ? _b : 0) *
                    quantity +
                    ((_d = (_c = editableFields.prices[quantity]) === null || _c === void 0 ? void 0 : _c.supplierShippingCost) !== null && _d !== void 0 ? _d : 0)) /
                    ((_f = (_e = editableFields.prices[quantity]) === null || _e === void 0 ? void 0 : _e.exchangeRate) !== null && _f !== void 0 ? _f : 1);
                var tax = ((_h = (_g = editableFields.prices[quantity]) === null || _g === void 0 ? void 0 : _g.supplierTaxAmount) !== null && _h !== void 0 ? _h : 0) /
                    ((_k = (_j = editableFields.prices[quantity]) === null || _j === void 0 ? void 0 : _j.exchangeRate) !== null && _k !== void 0 ? _k : 1);
                var price = subtotal + tax;
                return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                        <react_1.VStack spacing={0}>
                          <span>{formatter.format(price)}</span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
              </>)}
          </react_1.Tbody>
        </react_1.Table>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = SupplierQuoteLinePricing;
var templateObject_1, templateObject_2;
