"use strict";
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
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var invoicing_models_1 = require("../../invoicing.models");
var LineItems = function (_a) {
    var currencyCode = _a.currencyCode, presentationCurrencyFormatter = _a.presentationCurrencyFormatter, formatter = _a.formatter, locale = _a.locale, salesInvoiceLines = _a.salesInvoiceLines, shouldConvertCurrency = _a.shouldConvertCurrency;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("Could not find invoiceId");
    var items = (0, stores_1.useItems)()[0];
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var _b = (0, react_2.useState)([]), openItems = _b[0], setOpenItems = _b[1];
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var toggleOpen = function (id) {
        setOpenItems(function (prev) {
            return prev.includes(id) ? prev.filter(function (item) { return item !== id; }) : __spreadArray(__spreadArray([], prev, true), [id], false);
        });
    };
    return (<react_1.VStack spacing={8} className="w-full overflow-hidden">
      {salesInvoiceLines.map(function (line) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
            if (!line.id)
                return null;
            var itemReadableId = line.invoiceLineType === "Fixed Asset"
                ? line.assetReadableId || "Fixed Asset"
                : (0, utils_1.getItemReadableId)(items, line.itemId);
            var lineSubtotal = ((_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0) * ((_b = line.quantity) !== null && _b !== void 0 ? _b : 0);
            var customerSubtotal = ((_c = line.convertedUnitPrice) !== null && _c !== void 0 ? _c : 0) * ((_d = line.quantity) !== null && _d !== void 0 ? _d : 0);
            var total = (lineSubtotal + ((_e = line.addOnCost) !== null && _e !== void 0 ? _e : 0) + ((_f = line.shippingCost) !== null && _f !== void 0 ? _f : 0)) *
                (1 + ((_g = line.taxPercent) !== null && _g !== void 0 ? _g : 0)) +
                ((_h = line.nonTaxableAddOnCost) !== null && _h !== void 0 ? _h : 0);
            var customerTotal = (customerSubtotal +
                ((_j = line.convertedAddOnCost) !== null && _j !== void 0 ? _j : 0) +
                ((_k = line.convertedShippingCost) !== null && _k !== void 0 ? _k : 0)) *
                (1 + ((_l = line.taxPercent) !== null && _l !== void 0 ? _l : 0)) +
                ((_m = line.convertedNonTaxableAddOnCost) !== null && _m !== void 0 ? _m : 0);
            var lineTaxAmount = ((_o = line.taxPercent) !== null && _o !== void 0 ? _o : 0) *
                (lineSubtotal + ((_p = line.addOnCost) !== null && _p !== void 0 ? _p : 0) + ((_q = line.shippingCost) !== null && _q !== void 0 ? _q : 0));
            var customerLineTaxAmount = ((_r = line.taxPercent) !== null && _r !== void 0 ? _r : 0) *
                (customerSubtotal +
                    ((_s = line.convertedAddOnCost) !== null && _s !== void 0 ? _s : 0) +
                    ((_t = line.convertedShippingCost) !== null && _t !== void 0 ? _t : 0));
            return (<framer_motion_1.motion.div key={line.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-input py-6 w-full">
            <react_1.HStack spacing={4} className="items-start">
              {line.thumbnailPath ? (<img alt={itemReadableId !== null && itemReadableId !== void 0 ? itemReadableId : ""} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(0, path_1.getPrivateUrl)(line.thumbnailPath)}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0} className="w-full">
                <div className="flex flex-col cursor-pointer w-full" onClick={function () { return toggleOpen(line.id); }}>
                  <div className="flex items-center justify-between w-full">
                    <react_1.VStack spacing={0} className="flex-shrink-0 min-w-0 w-auto">
                      <react_1.HStack spacing={2} className="flex min-w-0 flex-shrink-0">
                        <react_1.Heading className="truncate">{itemReadableId}</react_1.Heading>
                        <react_1.Button asChild variant="link" size="sm" className="text-muted-foreground flex-shrink-0">
                          <react_router_1.Link to={path_1.path.to.salesInvoiceLine(invoiceId, line.id)}>
                            <macro_1.Trans>Edit</macro_1.Trans>
                          </react_router_1.Link>
                        </react_1.Button>
                      </react_1.HStack>
                      <span className="text-muted-foreground text-base truncate">
                        {line.description}
                      </span>
                    </react_1.VStack>
                    <react_1.VStack spacing={2} className="flex-shrink-0 items-end w-auto">
                      <react_1.HStack spacing={4}>
                        <react_1.VStack spacing={0}>
                          <span className="font-bold text-xl whitespace-nowrap">
                            {formatter.format(total)}
                          </span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-sm">
                              {presentationCurrencyFormatter.format(customerTotal)}
                            </span>)}
                        </react_1.VStack>
                        <framer_motion_1.motion.div animate={{
                    rotate: openItems.includes(line.id) ? 90 : 0
                }} transition={{ duration: 0.3 }}>
                          <lu_1.LuChevronRight size={24}/>
                        </framer_motion_1.motion.div>
                      </react_1.HStack>
                      <div className="flex items-center gap-2">
                        <react_1.Badge variant="outline" className="flex items-center gap-2">
                          {line.quantity}
                          {line.invoiceLineType !== "Fixed Asset" && (<components_1.MethodIcon type={(_u = line.methodType) !== null && _u !== void 0 ? _u : "Pull from Inventory"}/>)}
                        </react_1.Badge>
                        <react_1.Badge variant="green">
                          {formatter.format((_v = line.unitPrice) !== null && _v !== void 0 ? _v : 0)}{" "}
                          {(_w = unitOfMeasures.find(function (uom) { return uom.value === line.unitOfMeasureCode; })) === null || _w === void 0 ? void 0 : _w.label}
                        </react_1.Badge>
                        {((_x = line.taxPercent) !== null && _x !== void 0 ? _x : 0) > 0 ? (<react_1.Badge variant="red">
                            <macro_1.Trans>
                              {percentFormatter.format((_y = line.taxPercent) !== null && _y !== void 0 ? _y : 0)}{" "}
                              Tax
                            </macro_1.Trans>
                          </react_1.Badge>) : null}
                      </div>
                    </react_1.VStack>
                  </div>
                </div>
              </react_1.VStack>
            </react_1.HStack>

            <framer_motion_1.motion.div initial="collapsed" animate={openItems.includes(line.id) ? "open" : "collapsed"} variants={{
                    open: { opacity: 1, height: "auto", marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                }} transition={{ duration: 0.3 }} className="w-full overflow-hidden">
              <div className="w-full">
                <react_1.Table>
                  <react_1.Tbody>
                    <react_1.Tr>
                      <react_1.Td>
                        <macro_1.Trans>Quantity</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>
                            {line.quantity}{" "}
                            {(_z = unitOfMeasures.find(function (uom) { return uom.value === line.unitOfMeasureCode; })) === null || _z === void 0 ? void 0 : _z.label}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>
                    <react_1.Tr>
                      <react_1.Td>
                        <macro_1.Trans>Unit Price</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>{formatter.format((_0 = line.unitPrice) !== null && _0 !== void 0 ? _0 : 0)}</span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format((_1 = line.convertedUnitPrice) !== null && _1 !== void 0 ? _1 : 0)}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>
                    <react_1.Tr>
                      <react_1.Td>
                        <macro_1.Trans>Shipping Cost</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>
                            {formatter.format((_2 = line.shippingCost) !== null && _2 !== void 0 ? _2 : 0)}
                          </span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format((_3 = line.convertedShippingCost) !== null && _3 !== void 0 ? _3 : 0)}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>
                    <react_1.Tr className="border-b border-border">
                      <react_1.Td>
                        <macro_1.Trans>Extended Price</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>{formatter.format(lineSubtotal)}</span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(customerSubtotal)}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>

                    <react_1.Tr key="tax" className="border-b border-border">
                      <react_1.Td>
                        <macro_1.Trans>
                          Tax ({percentFormatter.format((_4 = line.taxPercent) !== null && _4 !== void 0 ? _4 : 0)})
                        </macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>{formatter.format(lineTaxAmount)}</span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(customerLineTaxAmount)}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>

                    <react_1.Tr key="total" className="font-bold">
                      <react_1.Td>
                        <macro_1.Trans>Total</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>{formatter.format(total)}</span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(customerTotal)}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>
                  </react_1.Tbody>
                </react_1.Table>
              </div>
            </framer_motion_1.motion.div>
          </framer_motion_1.motion.div>);
        })}
    </react_1.VStack>);
};
var SalesInvoiceSummary = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    var onEditShippingCost = _a.onEditShippingCost;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("Could not find invoiceId");
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesInvoice(invoiceId));
    var locale = (0, i18n_1.useLocale)().locale;
    var company = (0, hooks_1.useUser)().company;
    var shouldConvertCurrency = ((_b = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _b === void 0 ? void 0 : _b.currencyCode) !== (company === null || company === void 0 ? void 0 : company.baseCurrencyCode);
    var formatter = (0, hooks_1.useCurrencyFormatter)({
        currency: (_c = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _c !== void 0 ? _c : "USD"
    });
    var presentationCurrencyFormatter = (0, hooks_1.useCurrencyFormatter)({
        currency: (_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _d === void 0 ? void 0 : _d.currencyCode) !== null && _e !== void 0 ? _e : "USD"
    });
    var isEditable = !(0, invoicing_models_1.isSalesInvoiceLocked)((_f = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _f === void 0 ? void 0 : _f.status);
    // Calculate totals
    var subtotal = (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoiceLines) === null || _g === void 0 ? void 0 : _g.reduce(function (acc, line) {
        var _a, _b, _c, _d, _e;
        var lineSubtotal = ((_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0) * ((_b = line.quantity) !== null && _b !== void 0 ? _b : 0) +
            ((_c = line.shippingCost) !== null && _c !== void 0 ? _c : 0) +
            ((_d = line.addOnCost) !== null && _d !== void 0 ? _d : 0) +
            ((_e = line.nonTaxableAddOnCost) !== null && _e !== void 0 ? _e : 0);
        return acc + lineSubtotal;
    }, 0)) !== null && _h !== void 0 ? _h : 0;
    var customerSubtotal = (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoiceLines) === null || _j === void 0 ? void 0 : _j.reduce(function (acc, line) {
        var _a, _b, _c, _d, _e;
        var lineSubtotal = ((_a = line.convertedUnitPrice) !== null && _a !== void 0 ? _a : 0) * ((_b = line.quantity) !== null && _b !== void 0 ? _b : 0) +
            ((_c = line.convertedShippingCost) !== null && _c !== void 0 ? _c : 0) +
            ((_d = line.convertedAddOnCost) !== null && _d !== void 0 ? _d : 0) +
            ((_e = line.convertedNonTaxableAddOnCost) !== null && _e !== void 0 ? _e : 0);
        return acc + lineSubtotal;
    }, 0)) !== null && _k !== void 0 ? _k : 0;
    var tax = (_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoiceLines) === null || _l === void 0 ? void 0 : _l.reduce(function (acc, line) {
        var _a, _b, _c, _d, _e;
        var lineTaxAmount = ((_a = line.taxPercent) !== null && _a !== void 0 ? _a : 0) *
            (((_b = line.unitPrice) !== null && _b !== void 0 ? _b : 0) * ((_c = line.quantity) !== null && _c !== void 0 ? _c : 0) +
                ((_d = line.shippingCost) !== null && _d !== void 0 ? _d : 0) +
                ((_e = line.addOnCost) !== null && _e !== void 0 ? _e : 0));
        return acc + lineTaxAmount;
    }, 0)) !== null && _m !== void 0 ? _m : 0;
    var customerTax = (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoiceLines) === null || _o === void 0 ? void 0 : _o.reduce(function (acc, line) {
        var _a, _b, _c, _d, _e;
        var lineTaxAmount = ((_a = line.taxPercent) !== null && _a !== void 0 ? _a : 0) *
            (((_b = line.convertedUnitPrice) !== null && _b !== void 0 ? _b : 0) * ((_c = line.quantity) !== null && _c !== void 0 ? _c : 0) +
                ((_d = line.convertedShippingCost) !== null && _d !== void 0 ? _d : 0) +
                ((_e = line.convertedAddOnCost) !== null && _e !== void 0 ? _e : 0));
        return acc + lineTaxAmount;
    }, 0)) !== null && _p !== void 0 ? _p : 0;
    var shippingCost = ((_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoiceShipment) === null || _q === void 0 ? void 0 : _q.shippingCost) !== null && _r !== void 0 ? _r : 0) *
        ((_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _s === void 0 ? void 0 : _s.exchangeRate) !== null && _t !== void 0 ? _t : 1);
    var customerShippingCost = ((_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoiceShipment) === null || _u === void 0 ? void 0 : _u.shippingCost) !== null && _v !== void 0 ? _v : 0) *
        ((_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _w === void 0 ? void 0 : _w.exchangeRate) !== null && _x !== void 0 ? _x : 1);
    var total = subtotal + tax + shippingCost;
    var customerTotal = customerSubtotal + customerTax + customerShippingCost;
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.HStack className="justify-between items-center">
          <div className="flex flex-col gap-1">
            <react_1.CardTitle>{routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice.invoiceId}</react_1.CardTitle>
            <react_1.CardDescription>
              <macro_1.Trans>Sales Invoice</macro_1.Trans>
            </react_1.CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <components_1.CustomerAvatar customerId={(_y = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice.customerId) !== null && _y !== void 0 ? _y : null}/>
            {((_z = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _z === void 0 ? void 0 : _z.dateDue) && (<span className="text-muted-foreground text-sm">
                <macro_1.Trans>Due {formatDate(routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice.dateDue)}</macro_1.Trans>
              </span>)}
          </div>
        </react_1.HStack>
      </react_1.CardHeader>
      <react_1.CardContent>
        <LineItems currencyCode={(_0 = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _0 !== void 0 ? _0 : "USD"} presentationCurrencyFormatter={presentationCurrencyFormatter} formatter={formatter} locale={locale} salesInvoiceLines={(_1 = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoiceLines) !== null && _1 !== void 0 ? _1 : []} shouldConvertCurrency={shouldConvertCurrency}/>

        <react_1.VStack spacing={2} className="mt-8">
          <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
            <span>
              <macro_1.Trans>Subtotal:</macro_1.Trans>
            </span>
            <react_1.VStack spacing={0} className="items-end">
              <span>{formatter.format(subtotal)}</span>
              {shouldConvertCurrency && (<span className="text-sm">
                  {presentationCurrencyFormatter.format(customerSubtotal)}
                </span>)}
            </react_1.VStack>
          </react_1.HStack>

          <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
            <span>
              <macro_1.Trans>Tax:</macro_1.Trans>
            </span>
            <react_1.VStack spacing={0} className="items-end">
              <span>{formatter.format(tax)}</span>
              {shouldConvertCurrency && (<span className="text-sm">
                  {presentationCurrencyFormatter.format(customerTax)}
                </span>)}
            </react_1.VStack>
          </react_1.HStack>

          <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
            {shippingCost > 0 ? (<>
                <react_1.VStack spacing={0}>
                  <span>
                    <macro_1.Trans>Shipping:</macro_1.Trans>
                  </span>
                  {isEditable && (<react_1.Button variant="link" size="sm" className="text-muted-foreground" onClick={onEditShippingCost}>
                      <macro_1.Trans>Edit Shipping</macro_1.Trans>
                    </react_1.Button>)}
                </react_1.VStack>
                <react_1.VStack spacing={0} className="items-end">
                  <span>{formatter.format(shippingCost)}</span>
                  {shouldConvertCurrency && (<span className="text-sm">
                      {presentationCurrencyFormatter.format(customerShippingCost)}
                    </span>)}
                </react_1.VStack>
              </>) : isEditable ? (<react_1.Button variant="link" size="sm" className="text-muted-foreground" onClick={onEditShippingCost}>
                <macro_1.Trans>Add Shipping</macro_1.Trans>
              </react_1.Button>) : null}
          </react_1.HStack>

          <react_1.HStack className="justify-between text-xl font-bold w-full">
            <span>
              <macro_1.Trans>Total:</macro_1.Trans>
            </span>
            <react_1.VStack spacing={0} className="items-end">
              <span>{formatter.format(total)}</span>
              {shouldConvertCurrency && (<span className="text-sm">
                  {presentationCurrencyFormatter.format(customerTotal)}
                </span>)}
            </react_1.VStack>
          </react_1.HStack>
        </react_1.VStack>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = SalesInvoiceSummary;
