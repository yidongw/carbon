"use strict";
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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var framer_motion_1 = require("framer-motion");
var motion_number_1 = require("motion-number");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var deselectedLine = {
    addOn: 0,
    convertedAddOn: 0,
    taxableAddOn: 0,
    convertedTaxableAddOn: 0,
    netUnitPrice: 0,
    convertedNetUnitPrice: 0,
    quantity: 0,
    leadTime: 0,
    shippingCost: 0,
    convertedShippingCost: 0,
    taxPercent: 0,
    discountPercent: 0,
    unitPrice: 0,
    convertedUnitPrice: 0
};
var LineItems = function (_a) {
    var _b;
    var currencyCode = _a.currencyCode, formatter = _a.formatter, locale = _a.locale, selectedLines = _a.selectedLines, setSelectedLines = _a.setSelectedLines;
    var company = (0, hooks_1.useUser)().company;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quote id");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var _c = (0, react_2.useState)([]), openItems = _c[0], setOpenItems = _c[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        Object.entries(selectedLines).forEach(function (_a) {
            var lineId = _a[0], line = _a[1];
            if (line.quantity === 0 && openItems.includes(lineId)) {
                setOpenItems(function (prev) { return prev.filter(function (item) { return item !== lineId; }); });
            }
        });
    }, [selectedLines]);
    var pricingByLine = (0, react_2.useMemo)(function () {
        var _a, _b;
        return (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, line) {
            var _a, _b;
            if (!line.id) {
                return acc;
            }
            acc[line.id] =
                (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.prices) === null || _a === void 0 ? void 0 : _a.filter(function (p) { return p.quoteLineId === line.id; }).sort(function (a, b) { return a.quantity - b.quantity; })) !== null && _b !== void 0 ? _b : [];
            return acc;
        }, {})) !== null && _b !== void 0 ? _b : {};
    }, [routeData === null || routeData === void 0 ? void 0 : routeData.lines, routeData === null || routeData === void 0 ? void 0 : routeData.prices]);
    var toggleOpen = function (id) {
        setOpenItems(function (prev) {
            return prev.includes(id) ? prev.filter(function (item) { return item !== id; }) : __spreadArray(__spreadArray([], prev, true), [id], false);
        });
    };
    var shouldConvertCurrency = (routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== (company === null || company === void 0 ? void 0 : company.baseCurrencyCode);
    return (<react_1.VStack spacing={8} className="w-full overflow-hidden tracking-tight">
      {(_b = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _b === void 0 ? void 0 : _b.map(function (line) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            var prices = pricingByLine[line.id];
            if (!line || !prices || !line.id) {
                return null;
            }
            var selectedLine = selectedLines[line.id] || deselectedLine;
            return (<framer_motion_1.motion.div key={line.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-input py-6 w-full">
            <react_1.HStack spacing={4} className="items-start">
              {line.thumbnailPath ? (<img alt={line.itemReadableId} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(0, path_1.getPrivateUrl)(line.thumbnailPath)}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0} className="w-full">
                <div className="flex flex-col cursor-pointer w-full" onClick={function () { return toggleOpen(line.id); }}>
                  <div className="flex items-center gap-x-4 justify-between flex-grow">
                    <react_1.HStack spacing={2} className="min-w-0 flex-shrink">
                      <react_1.Heading className="truncate">
                        {line.itemReadableId}
                      </react_1.Heading>
                      <react_1.Button asChild variant="link" size="sm" className="text-muted-foreground flex-shrink-0">
                        <react_router_1.Link to={path_1.path.to.quoteLine(quoteId, line.id)}>
                          <macro_1.Trans>Edit</macro_1.Trans>
                        </react_router_1.Link>
                      </react_1.Button>
                    </react_1.HStack>
                    <react_1.HStack spacing={4}>
                      <motion_number_1.default className="font-bold text-xl" value={((_a = selectedLine.convertedNetUnitPrice) !== null && _a !== void 0 ? _a : 0) *
                    ((_b = selectedLine.quantity) !== null && _b !== void 0 ? _b : 0) +
                    ((_c = selectedLine.convertedAddOn) !== null && _c !== void 0 ? _c : 0) +
                    ((_d = selectedLine.convertedShippingCost) !== null && _d !== void 0 ? _d : 0) +
                    (((_e = selectedLine.convertedNetUnitPrice) !== null && _e !== void 0 ? _e : 0) *
                        ((_f = selectedLine.quantity) !== null && _f !== void 0 ? _f : 0) +
                        ((_g = selectedLine.convertedTaxableAddOn) !== null && _g !== void 0 ? _g : 0) +
                        ((_h = selectedLine.convertedShippingCost) !== null && _h !== void 0 ? _h : 0)) *
                        ((_j = selectedLine.taxPercent) !== null && _j !== void 0 ? _j : 0)} format={{
                    style: "currency",
                    currency: currencyCode
                }} locales={locale}/>
                      <framer_motion_1.motion.div animate={{
                    rotate: openItems.includes(line.id) ? 90 : 0
                }} transition={{ duration: 0.3 }}>
                        <lu_1.LuChevronRight size={24}/>
                      </framer_motion_1.motion.div>
                    </react_1.HStack>
                  </div>
                  <span className="text-muted-foreground text-base truncate">
                    {line.description}
                  </span>
                </div>
              </react_1.VStack>
            </react_1.HStack>

            <framer_motion_1.motion.div initial="collapsed" animate={openItems.includes(line.id) ? "open" : "collapsed"} variants={{
                    open: { opacity: 1, height: "auto", marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                }} transition={{ duration: 0.3 }} className="w-full overflow-hidden">
              <LinePricingOptions formatter={formatter} line={line} options={pricingByLine[line.id]} quoteCurrency={(_k = routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== null && _k !== void 0 ? _k : "USD"} quoteExchangeRate={(_l = routeData === null || routeData === void 0 ? void 0 : routeData.quote.exchangeRate) !== null && _l !== void 0 ? _l : 1} shouldConvertCurrency={shouldConvertCurrency} locale={locale} selectedLine={selectedLine} setSelectedLines={setSelectedLines}/>
            </framer_motion_1.motion.div>
          </framer_motion_1.motion.div>);
        })}
    </react_1.VStack>);
};
var LinePricingOptions = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    var line = _a.line, options = _a.options, quoteCurrency = _a.quoteCurrency, shouldConvertCurrency = _a.shouldConvertCurrency, quoteExchangeRate = _a.quoteExchangeRate, locale = _a.locale, formatter = _a.formatter, selectedLine = _a.selectedLine, setSelectedLines = _a.setSelectedLines;
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quote id");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var _1 = (0, react_2.useState)((_c = (_b = selectedLine === null || selectedLine === void 0 ? void 0 : selectedLine.quantity) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : null), selectedValue = _1[0], setSelectedValue = _1[1];
    var additionalChargesByQuantity = (_e = (_d = line.quantity) === null || _d === void 0 ? void 0 : _d.reduce(function (acc, quantity) {
        var _a;
        var charges = Object.values((_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {}).reduce(function (chargeAcc, charge) {
            var _a;
            var amount = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity];
            return chargeAcc + amount;
        }, 0);
        acc[quantity] = charges;
        return acc;
    }, { 0: 0 })) !== null && _e !== void 0 ? _e : {};
    var convertedAdditionalChargesByQuantity = Object.entries(additionalChargesByQuantity).reduce(function (acc, _a) {
        var quantity = _a[0], amount = _a[1];
        acc[Number(quantity)] = amount * quoteExchangeRate;
        return acc;
    }, { 0: 0 });
    var taxableAdditionalChargesByQuantity = (_g = (_f = line.quantity) === null || _f === void 0 ? void 0 : _f.reduce(function (acc, quantity) {
        var _a;
        var charges = Object.values((_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {}).reduce(function (chargeAcc, charge) {
            var _a;
            if (charge.taxable === false)
                return chargeAcc;
            var amount = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity];
            return chargeAcc + amount;
        }, 0);
        acc[quantity] = charges;
        return acc;
    }, { 0: 0 })) !== null && _g !== void 0 ? _g : {};
    var convertedTaxableAdditionalChargesByQuantity = Object.entries(taxableAdditionalChargesByQuantity).reduce(function (acc, _a) {
        var quantity = _a[0], amount = _a[1];
        acc[Number(quantity)] = amount * quoteExchangeRate;
        return acc;
    }, { 0: 0 });
    var additionalCharges = [];
    if (selectedLine.convertedShippingCost) {
        additionalCharges.push({
            name: "Shipping",
            amount: selectedLine.convertedShippingCost
        });
    }
    Object.entries((_h = line.additionalCharges) !== null && _h !== void 0 ? _h : {}).forEach(function (_a) {
        var _b;
        var name = _a[0], charge = _a[1];
        additionalCharges.push({
            name: charge.description,
            amount: ((_b = charge.amounts) === null || _b === void 0 ? void 0 : _b[selectedLine.quantity]) * quoteExchangeRate
        });
    });
    var hasAnyShipping = options.some(function (option) { var _a; return ((_a = option.convertedShippingCost) !== null && _a !== void 0 ? _a : 0) > 0; });
    var hasAnyFees = options.some(function (option) { var _a; return ((_a = convertedAdditionalChargesByQuantity[option.quantity]) !== null && _a !== void 0 ? _a : 0) > 0; });
    return (<react_1.VStack spacing={4}>
      <react_1.RadioGroup className="w-full" value={selectedValue !== null && selectedValue !== void 0 ? selectedValue : undefined} disabled={["Ordered", "Partial", "Expired", "Cancelled"].includes((_j = routeData === null || routeData === void 0 ? void 0 : routeData.quote.status) !== null && _j !== void 0 ? _j : "")} onValueChange={function (value) {
            var selectedOption = value === "0"
                ? deselectedLine
                : options.find(function (opt) { return opt.quantity.toString() === value; });
            if (selectedOption) {
                setSelectedLines(function (prev) {
                    var _a;
                    var _b, _c, _d, _e, _f, _g, _h, _j;
                    return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = {
                        quantity: selectedOption.quantity,
                        netUnitPrice: (_b = selectedOption.netUnitPrice) !== null && _b !== void 0 ? _b : 0,
                        convertedNetUnitPrice: (_c = selectedOption.convertedNetUnitPrice) !== null && _c !== void 0 ? _c : 0,
                        addOn: additionalChargesByQuantity[selectedOption.quantity] || 0,
                        convertedAddOn: convertedAdditionalChargesByQuantity[selectedOption.quantity] || 0,
                        taxableAddOn: taxableAdditionalChargesByQuantity[selectedOption.quantity] ||
                            0,
                        convertedTaxableAddOn: convertedTaxableAdditionalChargesByQuantity[selectedOption.quantity] || 0,
                        leadTime: selectedOption.leadTime,
                        shippingCost: (_d = selectedOption.shippingCost) !== null && _d !== void 0 ? _d : 0,
                        convertedShippingCost: (_e = selectedOption.convertedShippingCost) !== null && _e !== void 0 ? _e : 0,
                        taxPercent: (_f = line.taxPercent) !== null && _f !== void 0 ? _f : 0,
                        discountPercent: (_g = selectedOption.discountPercent) !== null && _g !== void 0 ? _g : 0,
                        unitPrice: (_h = selectedOption.unitPrice) !== null && _h !== void 0 ? _h : 0,
                        convertedUnitPrice: (_j = selectedOption.convertedUnitPrice) !== null && _j !== void 0 ? _j : 0
                    }, _a)));
                });
                setSelectedValue(value);
            }
        }}>
        <react_1.Table>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th />
              <react_1.Th>
                <macro_1.Trans>Quantity</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Unit Price</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Discount</macro_1.Trans>
              </react_1.Th>
              {hasAnyShipping && (<react_1.Th>
                  <macro_1.Trans>Shipping</macro_1.Trans>
                </react_1.Th>)}
              {hasAnyFees && (<react_1.Th>
                  <macro_1.Trans>Fees</macro_1.Trans>
                </react_1.Th>)}
              <react_1.Th>
                <macro_1.Trans>Lead Time</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Subtotal</macro_1.Trans>
              </react_1.Th>
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            {!Array.isArray(options) || options.length === 0 ? (<react_1.Tr>
                <react_1.Td colSpan={5 + (hasAnyShipping ? 1 : 0) + (hasAnyFees ? 1 : 0)} className="text-center py-8">
                  <macro_1.Trans>No pricing options found</macro_1.Trans>
                </react_1.Td>
              </react_1.Tr>) : (options.map(function (option, index) {
            var _a, _b, _c, _d, _e, _f, _g;
            return (((_a = line === null || line === void 0 ? void 0 : line.quantity) === null || _a === void 0 ? void 0 : _a.includes(option.quantity)) ||
                option.quantity === 0) && (<react_1.Tr key={index}>
                      <react_1.Td>
                        <react_1.RadioGroupItem value={option.quantity.toString()} id={"".concat(line.id, ":").concat(option.quantity.toString())}/>
                        <label htmlFor={"".concat(line.id, ":").concat(option.quantity.toString())} className="sr-only">
                          {option.quantity}
                        </label>
                      </react_1.Td>
                      <react_1.Td>{option.quantity}</react_1.Td>
                      <react_1.Td>
                        {formatter.format((_b = option.convertedUnitPrice) !== null && _b !== void 0 ? _b : 0)}
                      </react_1.Td>
                      <react_1.Td>
                        {option.discountPercent > 0
                    ? percentFormatter.format(option.discountPercent)
                    : "-"}
                      </react_1.Td>
                      {hasAnyShipping && (<react_1.Td>
                          {((_c = option.convertedShippingCost) !== null && _c !== void 0 ? _c : 0) > 0
                        ? formatter.format((_d = option.convertedShippingCost) !== null && _d !== void 0 ? _d : 0)
                        : "-"}
                        </react_1.Td>)}
                      {hasAnyFees && (<react_1.Td>
                          {((_e = convertedAdditionalChargesByQuantity[option.quantity]) !== null && _e !== void 0 ? _e : 0) > 0
                        ? formatter.format(convertedAdditionalChargesByQuantity[option.quantity])
                        : "-"}
                        </react_1.Td>)}
                      <react_1.Td>
                        {new Intl.NumberFormat(locale, {
                    style: "unit",
                    unit: "day"
                }).format(option.leadTime)}
                      </react_1.Td>
                      <react_1.Td>
                        {formatter.format(((_f = option.convertedNetUnitPrice) !== null && _f !== void 0 ? _f : 0) *
                    option.quantity +
                    convertedAdditionalChargesByQuantity[option.quantity] +
                    ((_g = option.convertedShippingCost) !== null && _g !== void 0 ? _g : 0))}
                      </react_1.Td>
                    </react_1.Tr>);
        }))}
          </react_1.Tbody>
        </react_1.Table>
      </react_1.RadioGroup>

      {selectedLine.quantity !== 0 && (<div className="w-full">
          <react_1.Table>
            <react_1.Tbody>
              <react_1.Tr key="extended-price" className="border-b border-border">
                <react_1.Td>
                  <macro_1.Trans>Extended Price</macro_1.Trans>
                </react_1.Td>
                <react_1.Td className="text-right">
                  <motion_number_1.default value={((_k = selectedLine.convertedUnitPrice) !== null && _k !== void 0 ? _k : 0) *
                selectedLine.quantity} format={{ style: "currency", currency: quoteCurrency }} locales={locale}/>
                </react_1.Td>
              </react_1.Tr>

              {selectedLine.discountPercent > 0 && (<react_1.Tr key="discount" className="border-b border-border">
                  <react_1.Td>
                    <macro_1.Trans>
                      Discount (
                      {percentFormatter.format(selectedLine.discountPercent)})
                    </macro_1.Trans>
                  </react_1.Td>
                  <react_1.Td className="text-right">
                    -
                    <motion_number_1.default value={((_l = selectedLine.convertedUnitPrice) !== null && _l !== void 0 ? _l : 0) *
                    selectedLine.quantity *
                    selectedLine.discountPercent} format={{ style: "currency", currency: quoteCurrency }} locales={locale}/>
                  </react_1.Td>
                </react_1.Tr>)}

              {additionalCharges.length > 0 &&
                additionalCharges.map(function (charge) { return (<react_1.Tr key={charge.name} className={additionalCharges[additionalCharges.length - 1] === charge
                        ? "border-b border-border"
                        : ""}>
                    <react_1.Td>{charge.name}</react_1.Td>
                    <react_1.Td className="text-right">
                      <motion_number_1.default value={charge.amount} format={{ style: "currency", currency: quoteCurrency }} locales={locale}/>
                    </react_1.Td>
                  </react_1.Tr>); })}

              <react_1.Tr key="subtotal">
                <react_1.Td>
                  <macro_1.Trans>Subtotal</macro_1.Trans>
                </react_1.Td>
                <react_1.Td className="text-right">
                  <motion_number_1.default value={((_m = selectedLine.convertedNetUnitPrice) !== null && _m !== void 0 ? _m : 0) *
                selectedLine.quantity +
                ((_o = selectedLine.convertedAddOn) !== null && _o !== void 0 ? _o : 0) +
                ((_p = selectedLine.convertedShippingCost) !== null && _p !== void 0 ? _p : 0)} format={{
                style: "currency",
                currency: quoteCurrency
            }} locales={locale}/>
                </react_1.Td>
              </react_1.Tr>

              <react_1.Tr key="tax" className="border-b border-border">
                <react_1.Td>
                  <macro_1.Trans>
                    Tax ({percentFormatter.format(selectedLine.taxPercent)})
                  </macro_1.Trans>
                </react_1.Td>
                <react_1.Td className="text-right">
                  <motion_number_1.default value={(((_q = selectedLine.convertedNetUnitPrice) !== null && _q !== void 0 ? _q : 0) *
                selectedLine.quantity +
                ((_r = selectedLine.convertedTaxableAddOn) !== null && _r !== void 0 ? _r : 0) +
                ((_s = selectedLine.convertedShippingCost) !== null && _s !== void 0 ? _s : 0)) *
                ((_t = selectedLine.taxPercent) !== null && _t !== void 0 ? _t : 0)} format={{
                style: "currency",
                currency: quoteCurrency
            }} locales={locale}/>
                </react_1.Td>
              </react_1.Tr>

              <react_1.Tr key="total" className="font-bold">
                <react_1.Td>
                  <macro_1.Trans>Total</macro_1.Trans>
                </react_1.Td>
                <react_1.Td className="text-right">
                  <motion_number_1.default value={((_u = selectedLine.convertedNetUnitPrice) !== null && _u !== void 0 ? _u : 0) *
                selectedLine.quantity +
                ((_v = selectedLine.convertedAddOn) !== null && _v !== void 0 ? _v : 0) +
                ((_w = selectedLine.convertedShippingCost) !== null && _w !== void 0 ? _w : 0) +
                (((_x = selectedLine.convertedNetUnitPrice) !== null && _x !== void 0 ? _x : 0) *
                    selectedLine.quantity +
                    ((_y = selectedLine.convertedTaxableAddOn) !== null && _y !== void 0 ? _y : 0) +
                    ((_z = selectedLine.convertedShippingCost) !== null && _z !== void 0 ? _z : 0)) *
                    ((_0 = selectedLine.taxPercent) !== null && _0 !== void 0 ? _0 : 0)} format={{
                style: "currency",
                currency: quoteCurrency
            }} locales={locale}/>
                </react_1.Td>
              </react_1.Tr>
            </react_1.Tbody>
          </react_1.Table>
        </div>)}
    </react_1.VStack>);
};
var QuoteSummary = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var onEditShippingCost = _a.onEditShippingCost;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quote id");
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var isEditable = !(0, sales_models_1.isQuoteLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.status);
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, react_2.useMemo)(function () {
        var _a;
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: (_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== null && _a !== void 0 ? _a : "USD"
        });
    }, [locale, routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode]);
    var _t = (0, react_2.useState)(function () {
        var _a, _b;
        return ((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, line) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            var salesOrderLine = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrderLines) === null || _a === void 0 ? void 0 : _a.find(function (salesOrderLine) { return salesOrderLine.id === line.id; });
            if (Array.isArray(routeData === null || routeData === void 0 ? void 0 : routeData.salesOrderLines) &&
                (routeData === null || routeData === void 0 ? void 0 : routeData.salesOrderLines.length) > 0 &&
                !salesOrderLine) {
                acc[line.id] = deselectedLine;
                return acc;
            }
            var price = salesOrderLine
                ? (_b = routeData === null || routeData === void 0 ? void 0 : routeData.prices) === null || _b === void 0 ? void 0 : _b.find(function (price) {
                    return price.quoteLineId === salesOrderLine.id &&
                        price.quantity === salesOrderLine.saleQuantity;
                })
                : (_c = routeData === null || routeData === void 0 ? void 0 : routeData.prices) === null || _c === void 0 ? void 0 : _c.find(function (price) {
                    var _a;
                    return price.quoteLineId === line.id &&
                        ((_a = line.quantity) === null || _a === void 0 ? void 0 : _a.includes(price.quantity));
                });
            if (!line.id) {
                return acc;
            }
            if (!price) {
                acc[line.id] = deselectedLine;
                return acc;
            }
            var additionalChargesByQuantity = (_e = (_d = line.quantity) === null || _d === void 0 ? void 0 : _d.reduce(function (acc, quantity) {
                var _a;
                var charges = Object.values((_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {}).reduce(function (chargeAcc, charge) {
                    var _a;
                    var amount = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity];
                    return chargeAcc + amount;
                }, 0);
                acc[quantity] = charges;
                return acc;
            }, {})) !== null && _e !== void 0 ? _e : {};
            var convertedAdditionalChargesByQuantity = (_f = Object.entries(additionalChargesByQuantity).reduce(function (acc, _a) {
                var _b;
                var quantity = _a[0], amount = _a[1];
                acc[Number(quantity)] =
                    amount * ((_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote.exchangeRate) !== null && _b !== void 0 ? _b : 1);
                return acc;
            }, {})) !== null && _f !== void 0 ? _f : {};
            var taxableAdditionalChargesByQuantity = (_h = (_g = line.quantity) === null || _g === void 0 ? void 0 : _g.reduce(function (acc, quantity) {
                var _a;
                var charges = Object.values((_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {}).reduce(function (chargeAcc, charge) {
                    var _a;
                    if (charge.taxable === false)
                        return chargeAcc;
                    var amount = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity];
                    return chargeAcc + amount;
                }, 0);
                acc[quantity] = charges;
                return acc;
            }, {})) !== null && _h !== void 0 ? _h : {};
            var convertedTaxableAdditionalChargesByQuantity = (_j = Object.entries(taxableAdditionalChargesByQuantity).reduce(function (acc, _a) {
                var _b;
                var quantity = _a[0], amount = _a[1];
                acc[Number(quantity)] =
                    amount * ((_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote.exchangeRate) !== null && _b !== void 0 ? _b : 1);
                return acc;
            }, {})) !== null && _j !== void 0 ? _j : {};
            acc[line.id] = {
                quantity: (_k = price.quantity) !== null && _k !== void 0 ? _k : 0,
                netUnitPrice: (_l = price.netUnitPrice) !== null && _l !== void 0 ? _l : 0,
                convertedNetUnitPrice: (_m = price.convertedNetUnitPrice) !== null && _m !== void 0 ? _m : 0,
                addOn: additionalChargesByQuantity[price.quantity] || 0,
                convertedAddOn: convertedAdditionalChargesByQuantity[price.quantity] || 0,
                taxableAddOn: taxableAdditionalChargesByQuantity[price.quantity] || 0,
                convertedTaxableAddOn: convertedTaxableAdditionalChargesByQuantity[price.quantity] || 0,
                leadTime: price.leadTime,
                shippingCost: (_o = price.shippingCost) !== null && _o !== void 0 ? _o : 0,
                convertedShippingCost: (_p = price.convertedShippingCost) !== null && _p !== void 0 ? _p : 0,
                taxPercent: (_q = line.taxPercent) !== null && _q !== void 0 ? _q : 0,
                discountPercent: (_r = price.discountPercent) !== null && _r !== void 0 ? _r : 0,
                unitPrice: (_s = price.unitPrice) !== null && _s !== void 0 ? _s : 0,
                convertedUnitPrice: (_t = price.convertedUnitPrice) !== null && _t !== void 0 ? _t : 0
            };
            return acc;
        }, {})) !== null && _b !== void 0 ? _b : {});
    }), selectedLines = _t[0], setSelectedLines = _t[1];
    var subtotal = Object.values(selectedLines).reduce(function (acc, line) {
        var _a, _b, _c;
        return (acc +
            ((_a = line.convertedNetUnitPrice) !== null && _a !== void 0 ? _a : 0) * line.quantity +
            ((_b = line.convertedAddOn) !== null && _b !== void 0 ? _b : 0) +
            ((_c = line.convertedShippingCost) !== null && _c !== void 0 ? _c : 0));
    }, 0);
    var totalDiscount = Object.values(selectedLines).reduce(function (acc, line) {
        var _a, _b;
        return (acc +
            ((_a = line.convertedUnitPrice) !== null && _a !== void 0 ? _a : 0) *
                line.quantity *
                ((_b = line.discountPercent) !== null && _b !== void 0 ? _b : 0));
    }, 0);
    var tax = Object.values(selectedLines).reduce(function (acc, line) {
        var _a, _b, _c, _d;
        return (acc +
            (((_a = line.convertedNetUnitPrice) !== null && _a !== void 0 ? _a : 0) * line.quantity +
                ((_b = line.convertedTaxableAddOn) !== null && _b !== void 0 ? _b : 0) +
                ((_c = line.convertedShippingCost) !== null && _c !== void 0 ? _c : 0)) *
                ((_d = line.taxPercent) !== null && _d !== void 0 ? _d : 0));
    }, 0);
    var convertedShippingCost = ((_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote.exchangeRate) !== null && _c !== void 0 ? _c : 1) *
        ((_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _d === void 0 ? void 0 : _d.shippingCost) !== null && _e !== void 0 ? _e : 0);
    var total = subtotal + tax + convertedShippingCost;
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.HStack className="justify-between items-center w-full">
          <div className="flex flex-col gap-1">
            <react_1.CardTitle className="flex items-center gap-0">
              <span>{routeData === null || routeData === void 0 ? void 0 : routeData.quote.quoteId}</span>
              {((_f = routeData === null || routeData === void 0 ? void 0 : routeData.quote.revisionId) !== null && _f !== void 0 ? _f : 0) > 0 && (<span className="text-muted-foreground">
                  -{routeData === null || routeData === void 0 ? void 0 : routeData.quote.revisionId}
                </span>)}
            </react_1.CardTitle>

            <react_1.CardDescription>
              <macro_1.Trans>Quote</macro_1.Trans>
            </react_1.CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <components_1.CustomerAvatar customerId={(_g = routeData === null || routeData === void 0 ? void 0 : routeData.quote.customerId) !== null && _g !== void 0 ? _g : null}/>
            {((_h = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _h === void 0 ? void 0 : _h.expirationDate) && (<span className="text-muted-foreground text-sm">
                <macro_1.Trans>
                  Expires {formatDate(routeData === null || routeData === void 0 ? void 0 : routeData.quote.expirationDate)}
                </macro_1.Trans>
              </span>)}
          </div>
        </react_1.HStack>
      </react_1.CardHeader>
      <react_1.CardContent>
        <LineItems currencyCode={(_j = routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== null && _j !== void 0 ? _j : "USD"} locale={locale} formatter={formatter} selectedLines={selectedLines} setSelectedLines={setSelectedLines}/>

        <react_1.VStack spacing={2} className="mt-8">
          <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
            <span>
              <macro_1.Trans>Subtotal:</macro_1.Trans>
            </span>
            <motion_number_1.default value={subtotal + totalDiscount} format={{
            style: "currency",
            currency: (_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _k === void 0 ? void 0 : _k.currencyCode) !== null && _l !== void 0 ? _l : "USD"
        }} locales={locale}/>
          </react_1.HStack>
          {totalDiscount > 0 && (<react_1.HStack className="justify-between text-base text-muted-foreground w-full">
              <span>
                <macro_1.Trans>Discount:</macro_1.Trans>
              </span>
              <span className="text-muted-foreground">
                -
                <motion_number_1.default value={totalDiscount} format={{
                style: "currency",
                currency: (_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _m === void 0 ? void 0 : _m.currencyCode) !== null && _o !== void 0 ? _o : "USD"
            }} locales={locale}/>
              </span>
            </react_1.HStack>)}
          <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
            <span>
              <macro_1.Trans>Tax:</macro_1.Trans>
            </span>
            <motion_number_1.default value={tax} format={{
            style: "currency",
            currency: (_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _p === void 0 ? void 0 : _p.currencyCode) !== null && _q !== void 0 ? _q : "USD"
        }} locales={locale}/>
          </react_1.HStack>
          <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
            {convertedShippingCost > 0 ? (<>
                <react_1.VStack spacing={0}>
                  <span>
                    <macro_1.Trans>Shipping:</macro_1.Trans>
                  </span>
                  <react_1.Button variant="link" size="sm" className="text-muted-foreground" onClick={onEditShippingCost}>
                    <macro_1.Trans>Edit Shipping</macro_1.Trans>
                  </react_1.Button>
                </react_1.VStack>
                <motion_number_1.default value={convertedShippingCost} format={{
                style: "currency",
                currency: (_r = routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== null && _r !== void 0 ? _r : "USD"
            }} locales={locale}/>
              </>) : isEditable ? (<react_1.Button variant="link" size="sm" className="text-muted-foreground" onClick={onEditShippingCost}>
                <macro_1.Trans>Add Shipping</macro_1.Trans>
              </react_1.Button>) : null}
          </react_1.HStack>
          <react_1.HStack className="justify-between text-xl font-bold w-full">
            <span>
              <macro_1.Trans>Total:</macro_1.Trans>
            </span>
            <motion_number_1.default value={total} format={{
            style: "currency",
            currency: (_s = routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== null && _s !== void 0 ? _s : "USD"
        }} locales={locale}/>
          </react_1.HStack>
        </react_1.VStack>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = QuoteSummary;
