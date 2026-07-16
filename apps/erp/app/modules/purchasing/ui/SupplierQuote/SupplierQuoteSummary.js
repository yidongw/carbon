"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Account_1 = require("~/components/Form/Account");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var LineItems = function (_a) {
    var _b, _c;
    var currencyCode = _a.currencyCode, formatter = _a.formatter, locale = _a.locale;
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var accounts = (0, Account_1.useAccounts)();
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find quote id");
    var items = (0, stores_1.useItems)()[0];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.supplierQuote(id));
    var _d = (0, react_2.useState)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.lines.map(function (line) { return line.id; })) !== null && _b !== void 0 ? _b : []), openItems = _d[0], setOpenItems = _d[1];
    var pricingByLine = (0, react_2.useMemo)(function () {
        var _a, _b;
        return (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, line) {
            var _a, _b;
            if (!line.id) {
                return acc;
            }
            acc[line.id] =
                (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.prices) === null || _a === void 0 ? void 0 : _a.filter(function (p) { return p.supplierQuoteLineId === line.id; })) !== null && _b !== void 0 ? _b : [];
            return acc;
        }, {})) !== null && _b !== void 0 ? _b : {};
    }, [routeData === null || routeData === void 0 ? void 0 : routeData.lines, routeData === null || routeData === void 0 ? void 0 : routeData.prices]);
    var toggleOpen = function (id) {
        setOpenItems(function (prev) {
            return prev.includes(id) ? prev.filter(function (item) { return item !== id; }) : __spreadArray(__spreadArray([], prev, true), [id], false);
        });
    };
    var shouldConvertCurrency = (routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== (company === null || company === void 0 ? void 0 : company.baseCurrencyCode);
    return (<react_1.VStack spacing={8} className="w-full overflow-hidden">
      {(_c = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _c === void 0 ? void 0 : _c.map(function (line) {
            var _a, _b, _c, _d;
            var prices = pricingByLine[line.id];
            var isGlAccount = line.supplierQuoteLineType === "G/L Account";
            var itemReadableId = isGlAccount
                ? line.description || t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Indirect Expense"], ["Indirect Expense"])))
                : (0, utils_1.getItemReadableId)(items, line.itemId);
            if (!line || !prices || !line.id) {
                return null;
            }
            return (<framer_motion_1.motion.div key={line.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="py-6 w-full">
            <react_1.HStack spacing={4} className="items-start">
              {line.thumbnailPath ? (<img alt={itemReadableId} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(0, path_1.getPrivateUrl)(line.thumbnailPath)}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0} className="w-full">
                <div className="flex flex-col cursor-pointer w-full" onClick={function () { return toggleOpen(line.id); }}>
                  <div className="flex items-center gap-x-4 justify-between flex-grow">
                    <react_1.HStack spacing={2} className="min-w-0 flex-shrink">
                      <react_1.Heading className="truncate">{itemReadableId}</react_1.Heading>
                      <react_1.Button asChild variant="link" size="sm" className="text-muted-foreground flex-shrink-0">
                        <react_router_1.Link to={path_1.path.to.supplierQuoteLine(id, line.id)}>
                          <macro_1.Trans>Edit</macro_1.Trans>
                        </react_router_1.Link>
                      </react_1.Button>
                    </react_1.HStack>
                    <react_1.HStack spacing={4}>
                      <framer_motion_1.motion.div animate={{
                    rotate: openItems.includes(line.id) ? 90 : 0
                }} transition={{ duration: 0.3 }}>
                        <lu_1.LuChevronRight size={24}/>
                      </framer_motion_1.motion.div>
                    </react_1.HStack>
                  </div>
                  <span className="text-muted-foreground text-base truncate">
                    {isGlAccount
                    ? ((_b = (_a = accounts.find(function (a) { return a.id === line.accountId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "G/L Account")
                    : line.description}
                  </span>
                </div>
              </react_1.VStack>
            </react_1.HStack>

            <framer_motion_1.motion.div initial="collapsed" animate={openItems.includes(line.id) ? "open" : "collapsed"} variants={{
                    open: { opacity: 1, height: "auto", marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                }} transition={{ duration: 0.3 }} className="w-full overflow-hidden">
              <LinePricingOptions formatter={formatter} line={line} options={pricingByLine[line.id]} quoteCurrency={(_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== null && _c !== void 0 ? _c : "USD"} quoteExchangeRate={(_d = routeData === null || routeData === void 0 ? void 0 : routeData.quote.exchangeRate) !== null && _d !== void 0 ? _d : 1} shouldConvertCurrency={shouldConvertCurrency} locale={locale}/>
            </framer_motion_1.motion.div>
          </framer_motion_1.motion.div>);
        })}
    </react_1.VStack>);
};
var LinePricingOptions = function (_a) {
    var line = _a.line, options = _a.options, locale = _a.locale, formatter = _a.formatter;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find quote id");
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    return (<react_1.VStack spacing={4} className="w-full">
      <react_1.Table>
        <react_1.Thead>
          <react_1.Tr>
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
              <macro_1.Trans>Tax</macro_1.Trans>
            </react_1.Th>
            <react_1.Th>
              <macro_1.Trans>Lead Time</macro_1.Trans>
            </react_1.Th>

            <react_1.Th className="text-right">
              <macro_1.Trans>Total</macro_1.Trans>
            </react_1.Th>
          </react_1.Tr>
        </react_1.Thead>
        <react_1.Tbody>
          {!Array.isArray(options) || options.length === 0 ? (<react_1.Tr>
              <react_1.Td colSpan={6} className="text-center py-8">
                <macro_1.Trans>No pricing options found</macro_1.Trans>
              </react_1.Td>
            </react_1.Tr>) : (options.map(function (option, index) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return (((_a = line === null || line === void 0 ? void 0 : line.quantity) === null || _a === void 0 ? void 0 : _a.includes(option.quantity)) ||
                option.quantity === 0) && (<react_1.Tr key={index}>
                    <react_1.Td>
                      <div className="flex items-center gap-x-2 justify-between">
                        <react_1.VStack spacing={0}>
                          <span>
                            {option.quantity}{" "}
                            {(_b = unitOfMeasures.find(function (uom) {
                    return uom.value === line.purchaseUnitOfMeasureCode;
                })) === null || _b === void 0 ? void 0 : _b.label}
                          </span>
                          {line.conversionFactor !== 1 && (<span className="text-muted-foreground text-xs">
                              {option.quantity * ((_c = line.conversionFactor) !== null && _c !== void 0 ? _c : 1)}{" "}
                              {(_d = unitOfMeasures.find(function (uom) {
                        return uom.value ===
                            line.inventoryUnitOfMeasureCode;
                    })) === null || _d === void 0 ? void 0 : _d.label}
                            </span>)}
                        </react_1.VStack>
                      </div>
                    </react_1.Td>
                    <react_1.Td>
                      <react_1.VStack spacing={0}>
                        <span>{formatter.format((_e = option.unitPrice) !== null && _e !== void 0 ? _e : 0)}</span>
                        {line.conversionFactor !== 1 && (<span className="text-muted-foreground text-xs">
                            {formatter.format(((_f = option.unitPrice) !== null && _f !== void 0 ? _f : 0) /
                        ((_g = line.conversionFactor) !== null && _g !== void 0 ? _g : 1))}
                          </span>)}
                      </react_1.VStack>
                    </react_1.Td>

                    <react_1.Td>{formatter.format((_h = option.shippingCost) !== null && _h !== void 0 ? _h : 0)}</react_1.Td>
                    <react_1.Td>{formatter.format((_j = option.taxAmount) !== null && _j !== void 0 ? _j : 0)}</react_1.Td>

                    <react_1.Td>
                      {new Intl.NumberFormat(locale, {
                    style: "unit",
                    unit: "day"
                }).format(option.leadTime)}
                    </react_1.Td>

                    <react_1.Td className="text-right">
                      {formatter.format(((_k = option.unitPrice) !== null && _k !== void 0 ? _k : 0) * option.quantity +
                    ((_l = option.shippingCost) !== null && _l !== void 0 ? _l : 0) +
                    ((_m = option.supplierTaxAmount) !== null && _m !== void 0 ? _m : 0))}
                    </react_1.Td>
                  </react_1.Tr>);
        }))}
        </react_1.Tbody>
      </react_1.Table>
    </react_1.VStack>);
};
var SupplierQuoteSummary = function () {
    var _a, _b, _c;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find quote id");
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.supplierQuote(id));
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.HStack className="justify-between items-center">
          <div className="flex flex-col gap-1">
            <react_1.CardTitle>{routeData === null || routeData === void 0 ? void 0 : routeData.quote.supplierQuoteId}</react_1.CardTitle>
            <react_1.CardDescription>
              <macro_1.Trans>Supplier Quote</macro_1.Trans>
            </react_1.CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <components_1.SupplierAvatar supplierId={(_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote.supplierId) !== null && _a !== void 0 ? _a : null}/>
            {((_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.expirationDate) && (<span className="text-muted-foreground text-sm">
                <macro_1.Trans>
                  Expires {formatDate(routeData === null || routeData === void 0 ? void 0 : routeData.quote.expirationDate)}
                </macro_1.Trans>
              </span>)}
          </div>
        </react_1.HStack>
      </react_1.CardHeader>
      <react_1.CardContent>
        <LineItems currencyCode={(_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote.currencyCode) !== null && _c !== void 0 ? _c : "USD"} locale={locale} formatter={formatter}/>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = SupplierQuoteSummary;
var templateObject_1;
