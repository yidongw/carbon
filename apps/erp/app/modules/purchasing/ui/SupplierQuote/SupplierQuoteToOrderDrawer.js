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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Account_1 = require("~/components/Form/Account");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var path_1 = require("~/utils/path");
var SupplierQuoteToOrderDrawer = function (_a) {
    var _b, _c;
    var isOpen = _a.isOpen, quote = _a.quote, lines = _a.lines, pricing = _a.pricing, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var step = (0, react_2.useState)(0)[0];
    var _d = (0, react_2.useState)({}), selectedLines = _d[0], setSelectedLines = _d[1];
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var titles = [t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select Quantities"], ["Select Quantities"])))];
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var quoteCurrency = (_c = quote.currencyCode) !== null && _c !== void 0 ? _c : baseCurrency;
    var formatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({ currency: baseCurrency });
    var presentationCurrencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: quoteCurrency
    });
    var renderStep = function () {
        switch (step) {
            case 0:
                return (<react_1.HStack className="h-full w-full">
            <react_1.ScrollArea className="h-[calc(100dvh-145px)] flex-grow w-full">
              <LinePricingForm quote={quote} lines={lines} pricing={pricing} formatter={formatter} presentationCurrencyFormatter={presentationCurrencyFormatter} setSelectedLines={setSelectedLines}/>
            </react_1.ScrollArea>
          </react_1.HStack>);
            default:
                return null;
        }
    };
    var navigation = (0, react_router_1.useNavigation)();
    var isSubmitting = navigation.state !== "idle";
    return (<react_1.Drawer open={isOpen} onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.DrawerContent size="full">
        <input type="hidden" name="id" value={quote.id}/>

        <react_1.DrawerHeader>
          <react_1.DrawerTitle>{titles[step]}</react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody>{renderStep()}</react_1.DrawerBody>
        <react_1.DrawerFooter>
          <react_router_1.Form action={path_1.path.to.convertSupplierQuoteToOrder(quote.id)} method="post">
            <react_1.Button type="submit" isDisabled={isSubmitting} isLoading={isSubmitting}>
              Convert
            </react_1.Button>
            <input type="hidden" name="selectedLines" value={JSON.stringify(selectedLines)}/>
          </react_router_1.Form>
        </react_1.DrawerFooter>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = SupplierQuoteToOrderDrawer;
var LinePricingForm = function (_a) {
    var _b, _c, _d;
    var quote = _a.quote, lines = _a.lines, pricing = _a.pricing, formatter = _a.formatter, presentationCurrencyFormatter = _a.presentationCurrencyFormatter, setSelectedLines = _a.setSelectedLines;
    var accounts = (0, Account_1.useAccounts)();
    var pricingByLine = (0, react_2.useMemo)(function () {
        return lines.reduce(function (acc, line) {
            acc[line.id] = pricing.filter(function (p) { return p.supplierQuoteLineId === line.id; });
            return acc;
        }, {});
    }, [lines, pricing]);
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var quoteCurrency = (_c = quote.currencyCode) !== null && _c !== void 0 ? _c : baseCurrency;
    var shouldConvertCurrency = quoteCurrency !== baseCurrency;
    var quoteExchangeRate = (_d = quote.exchangeRate) !== null && _d !== void 0 ? _d : 1;
    return (<react_1.VStack spacing={8}>
      {lines.map(function (line) {
            var _a, _b;
            var isGlAccount = line.supplierQuoteLineType === "G/L Account";
            var lineHeading = isGlAccount
                ? line.description || "Indirect Expense"
                : line.itemReadableId;
            return (<react_1.VStack key={line.id}>
            <react_1.HStack spacing={2} className="items-start">
              {line.thumbnailPath ? (<img alt={lineHeading} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(0, path_1.getPrivateUrl)(line.thumbnailPath)}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0}>
                <react_1.Heading>{lineHeading}</react_1.Heading>
                <span className="text-muted-foreground text-base truncate">
                  {isGlAccount
                    ? ((_b = (_a = accounts.find(function (a) { return a.id === line.accountId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "G/L Account")
                    : line.description}
                </span>
              </react_1.VStack>
            </react_1.HStack>
            <LinePricingOptions line={line} options={pricingByLine[line.id]} quoteCurrency={quoteCurrency} shouldConvertCurrency={shouldConvertCurrency} quoteExchangeRate={quoteExchangeRate} formatter={formatter} presentationCurrencyFormatter={presentationCurrencyFormatter} setSelectedLines={setSelectedLines}/>
          </react_1.VStack>);
        })}
    </react_1.VStack>);
};
var LinePricingOptions = function (_a) {
    var line = _a.line, options = _a.options, quoteCurrency = _a.quoteCurrency, quoteExchangeRate = _a.quoteExchangeRate, presentationCurrencyFormatter = _a.presentationCurrencyFormatter, setSelectedLines = _a.setSelectedLines;
    var _b = (0, react_2.useState)(""), selectedValue = _b[0], setSelectedValue = _b[1];
    var _c = (0, react_2.useState)(false), showOverride = _c[0], setShowOverride = _c[1];
    var _d = (0, react_2.useState)({
        quantity: 1,
        leadTime: 0,
        unitPrice: 0,
        supplierUnitPrice: 0,
        supplierShippingCost: 0,
        shippingCost: 0,
        supplierTaxAmount: 0
    }), overridePricing = _d[0], setOverridePricing = _d[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (selectedValue === "custom") {
            setSelectedLines(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = {
                    quantity: overridePricing.quantity,
                    unitPrice: overridePricing.unitPrice,
                    supplierUnitPrice: overridePricing.supplierUnitPrice,
                    supplierShippingCost: overridePricing.supplierShippingCost,
                    shippingCost: overridePricing.shippingCost,
                    leadTime: overridePricing.leadTime,
                    supplierTaxAmount: overridePricing.supplierTaxAmount
                }, _a)));
            });
        }
    }, [
        line.id,
        overridePricing,
        selectedValue,
        setSelectedLines,
        quoteExchangeRate
    ]);
    return (<react_1.VStack spacing={2}>
      <react_1.RadioGroup className="w-full" value={selectedValue} onValueChange={function (value) {
            var selectedOption = value === "custom"
                ? overridePricing
                : options.find(function (opt) { return opt.quantity.toString() === value; });
            if (selectedOption) {
                setSelectedLines(function (prev) {
                    var _a;
                    var _b, _c, _d, _e, _f;
                    return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = {
                        quantity: selectedOption.quantity,
                        unitPrice: (_b = selectedOption.unitPrice) !== null && _b !== void 0 ? _b : 0,
                        supplierUnitPrice: (_c = selectedOption.supplierUnitPrice) !== null && _c !== void 0 ? _c : 0,
                        supplierShippingCost: (_d = selectedOption.supplierShippingCost) !== null && _d !== void 0 ? _d : 0,
                        shippingCost: (_e = selectedOption.shippingCost) !== null && _e !== void 0 ? _e : 0,
                        leadTime: selectedOption.leadTime,
                        supplierTaxAmount: (_f = selectedOption.supplierTaxAmount) !== null && _f !== void 0 ? _f : 0
                    }, _a)));
                });
                setSelectedValue(value);
            }
        }}>
        <react_1.Table>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th></react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Quantity</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Unit Price</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Shipping</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Lead Time</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Tax</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Total Price</macro_1.Trans>
              </react_1.Th>
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            {!Array.isArray(options) || options.length === 0 ? (<react_1.Tr>
                <react_1.Td colSpan={6} className="text-center py-8">
                  <macro_1.Trans>No pricing options found</macro_1.Trans>
                </react_1.Td>
              </react_1.Tr>) : (options.map(function (option, index) {
            var _a, _b, _c, _d, _e, _f, _g;
            return ((_a = line === null || line === void 0 ? void 0 : line.quantity) === null || _a === void 0 ? void 0 : _a.includes(option.quantity)) && (<react_1.Tr key={index}>
                      <react_1.Td>
                        <react_1.RadioGroupItem value={option.quantity.toString()} id={"".concat(line.id, ":").concat(option.quantity.toString())}/>
                        <label htmlFor={"".concat(line.id, ":").concat(option.quantity.toString())} className="sr-only">
                          {option.quantity}
                        </label>
                      </react_1.Td>
                      <react_1.Td>{option.quantity}</react_1.Td>
                      <react_1.Td>
                        {presentationCurrencyFormatter.format((_b = option.supplierUnitPrice) !== null && _b !== void 0 ? _b : 0)}
                      </react_1.Td>
                      <react_1.Td>
                        {presentationCurrencyFormatter.format((_c = option.supplierShippingCost) !== null && _c !== void 0 ? _c : 0)}
                      </react_1.Td>
                      <react_1.Td>
                        {option.leadTime} {(0, utils_1.pluralize)(option.leadTime, "day")}
                      </react_1.Td>
                      <react_1.Td>
                        {presentationCurrencyFormatter.format((_d = option.supplierTaxAmount) !== null && _d !== void 0 ? _d : 0)}
                      </react_1.Td>
                      <react_1.Td>
                        {presentationCurrencyFormatter.format(((_e = option.supplierUnitPrice) !== null && _e !== void 0 ? _e : 0) * option.quantity +
                    ((_f = option.supplierShippingCost) !== null && _f !== void 0 ? _f : 0) +
                    ((_g = option.supplierTaxAmount) !== null && _g !== void 0 ? _g : 0))}
                      </react_1.Td>
                    </react_1.Tr>);
        }))}
            {showOverride && (<react_1.Tr>
                <react_1.Td>
                  <react_1.RadioGroupItem value="custom" id={"".concat(line.id, ":custom")}/>
                  <label htmlFor={"".concat(line.id, ":custom")} className="sr-only"></label>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" value={overridePricing.quantity} onChange={function (quantity) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { quantity: quantity })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" value={overridePricing.supplierUnitPrice} formatOptions={{
                style: "currency",
                currency: quoteCurrency
            }} onChange={function (unitPrice) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { supplierUnitPrice: unitPrice, unitPrice: unitPrice * quoteExchangeRate })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" value={overridePricing.supplierShippingCost} formatOptions={{
                style: "currency",
                currency: quoteCurrency
            }} onChange={function (shippingCost) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { shippingCost: shippingCost * quoteExchangeRate, supplierShippingCost: shippingCost })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>

                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" formatOptions={{
                style: "unit",
                unit: "day",
                unitDisplay: "long"
            }} value={overridePricing.leadTime} onChange={function (leadTime) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { leadTime: leadTime })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" value={overridePricing.supplierTaxAmount} formatOptions={{
                style: "currency",
                currency: quoteCurrency
            }} onChange={function (taxAmount) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { supplierTaxAmount: taxAmount })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  {presentationCurrencyFormatter.format(overridePricing.supplierUnitPrice *
                overridePricing.quantity +
                overridePricing.supplierShippingCost +
                overridePricing.supplierTaxAmount)}
                </react_1.Td>
              </react_1.Tr>)}
          </react_1.Tbody>
        </react_1.Table>
      </react_1.RadioGroup>
      {!showOverride && (<react_1.Button variant="secondary" onClick={function () {
                setShowOverride(true);
                setSelectedValue("custom");
            }}>
          Add Adjustment
        </react_1.Button>)}
    </react_1.VStack>);
};
var templateObject_1;
