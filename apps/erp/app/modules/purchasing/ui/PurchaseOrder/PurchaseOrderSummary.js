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
var purchasing_models_1 = require("../../purchasing.models");
var LineItems = function (_a) {
    var currencyCode = _a.currencyCode, presentationCurrencyFormatter = _a.presentationCurrencyFormatter, formatter = _a.formatter, locale = _a.locale, lines = _a.lines, shouldConvertCurrency = _a.shouldConvertCurrency;
    var items = (0, stores_1.useItems)()[0];
    var accounts = (0, Account_1.useAccounts)();
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var t = (0, macro_1.useLingui)().t;
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var _b = (0, react_2.useState)([]), openItems = _b[0], setOpenItems = _b[1];
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var toggleOpen = function (id) {
        setOpenItems(function (prev) {
            return prev.includes(id) ? prev.filter(function (item) { return item !== id; }) : __spreadArray(__spreadArray([], prev, true), [id], false);
        });
    };
    return (<react_1.VStack spacing={8} className="w-full overflow-hidden">
      {lines.map(function (line) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
            if (!line.id)
                return null;
            var isGlAccount = line.purchaseOrderLineType === "G/L Account";
            var isFixedAsset = line.purchaseOrderLineType === "Fixed Asset";
            var isIndirect = isGlAccount || isFixedAsset;
            var itemReadableId = isGlAccount
                ? line.description || t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Indirect Expense"], ["Indirect Expense"])))
                : isFixedAsset
                    ? line.assetReadableId || t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Fixed Asset"], ["Fixed Asset"])))
                    : (0, utils_1.getItemReadableId)(items, line.itemId);
            var lineTotal = ((_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0) * ((_b = line.purchaseQuantity) !== null && _b !== void 0 ? _b : 0);
            var supplierLineTotal = ((_c = line.supplierUnitPrice) !== null && _c !== void 0 ? _c : 0) * ((_d = line.purchaseQuantity) !== null && _d !== void 0 ? _d : 0);
            var total = lineTotal + ((_e = line.taxAmount) !== null && _e !== void 0 ? _e : 0) + ((_f = line.shippingCost) !== null && _f !== void 0 ? _f : 0);
            var supplierTotal = supplierLineTotal +
                ((_g = line.supplierTaxAmount) !== null && _g !== void 0 ? _g : 0) +
                ((_h = line.supplierShippingCost) !== null && _h !== void 0 ? _h : 0);
            return (<framer_motion_1.motion.div key={line.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-input py-6 w-full">
            <react_1.HStack spacing={4} className="items-start">
              {line.thumbnailPath ? (<img alt={itemReadableId} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(0, path_1.getPrivateUrl)(line.thumbnailPath)}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0} className="w-full">
                <div className="flex flex-col cursor-pointer w-full" onClick={function () { return toggleOpen(line.id); }}>
                  <div className="flex items-center justify-between w-full">
                    <react_1.VStack spacing={0} className="flex-shrink-0 min-w-0 w-auto">
                      <react_1.HStack spacing={2} className="flex min-w-0 flex-shrink-0">
                        <react_1.Heading className="truncate">{itemReadableId}</react_1.Heading>
                        <react_1.Button asChild variant="link" size="sm" className="text-muted-foreground flex-shrink-0">
                          <react_router_1.Link to={path_1.path.to.purchaseOrderLine(orderId, line.id)}>
                            <macro_1.Trans>Edit</macro_1.Trans>
                          </react_router_1.Link>
                        </react_1.Button>
                      </react_1.HStack>
                      <span className="text-muted-foreground text-base truncate">
                        {isGlAccount
                    ? ((_k = (_j = accounts.find(function (a) { return a.id === line.accountId; })) === null || _j === void 0 ? void 0 : _j.name) !== null && _k !== void 0 ? _k : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Indirect Expense"], ["Indirect Expense"]))))
                    : isFixedAsset
                        ? line.description || t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Fixed Asset"], ["Fixed Asset"])))
                        : line.description}
                      </span>
                    </react_1.VStack>
                    <react_1.VStack spacing={2} className="flex-shrink-0 items-end w-auto">
                      <react_1.HStack spacing={4}>
                        <react_1.VStack spacing={0}>
                          <span className="font-bold text-xl whitespace-nowrap">
                            {formatter.format(total)}
                          </span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-sm">
                              {presentationCurrencyFormatter.format(supplierTotal)}
                            </span>)}
                        </react_1.VStack>
                        <framer_motion_1.motion.div animate={{
                    rotate: openItems.includes(line.id) ? 90 : 0
                }} transition={{ duration: 0.3 }}>
                          <lu_1.LuChevronRight size={24}/>
                        </framer_motion_1.motion.div>
                      </react_1.HStack>
                      <div className="flex items-center gap-2">
                        {!isIndirect && (<react_1.Badge variant="outline" className="flex items-center gap-2">
                            {line.purchaseQuantity}
                            <components_1.MethodIcon 
                // @ts-ignore
                type={(_l = line.methodType) !== null && _l !== void 0 ? _l : "Pull from Inventory"}/>
                          </react_1.Badge>)}
                        <react_1.Badge variant="green">
                          {formatter.format((_m = line.unitPrice) !== null && _m !== void 0 ? _m : 0)}{" "}
                          {(_o = unitOfMeasures.find(function (uom) {
                    return uom.value === line.purchaseUnitOfMeasureCode;
                })) === null || _o === void 0 ? void 0 : _o.label}
                        </react_1.Badge>
                        {((_p = line.taxPercent) !== null && _p !== void 0 ? _p : 0) > 0 ? (<react_1.Badge variant="red">
                            {percentFormatter.format((_q = line.taxPercent) !== null && _q !== void 0 ? _q : 0)} Tax
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
                            {line.purchaseQuantity}{" "}
                            {(_r = unitOfMeasures.find(function (uom) {
                    return uom.value === line.purchaseUnitOfMeasureCode;
                })) === null || _r === void 0 ? void 0 : _r.label}
                          </span>
                          {line.conversionFactor !== 1 && (<span className="text-muted-foreground text-xs">
                              {((_s = line.purchaseQuantity) !== null && _s !== void 0 ? _s : 0) *
                        ((_t = line.conversionFactor) !== null && _t !== void 0 ? _t : 1)}{" "}
                              {(_u = unitOfMeasures.find(function (uom) {
                        return uom.value ===
                            line.inventoryUnitOfMeasureCode;
                    })) === null || _u === void 0 ? void 0 : _u.label}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>
                    <react_1.Tr>
                      <react_1.Td>
                        <macro_1.Trans>Unit Price</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>{formatter.format((_v = line.unitPrice) !== null && _v !== void 0 ? _v : 0)}</span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format((_w = line.supplierUnitPrice) !== null && _w !== void 0 ? _w : 0)}
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
                          <span>{formatter.format(lineTotal)}</span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(supplierLineTotal)}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>

                    <react_1.Tr key="tax">
                      <react_1.Td>
                        <macro_1.Trans>
                          Tax ({percentFormatter.format((_x = line.taxPercent) !== null && _x !== void 0 ? _x : 0)})
                        </macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>{formatter.format((_y = line.taxAmount) !== null && _y !== void 0 ? _y : 0)}</span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format((_z = line.supplierTaxAmount) !== null && _z !== void 0 ? _z : 0)}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                    </react_1.Tr>

                    <react_1.Tr key="shipping" className="border-b border-border">
                      <react_1.Td>
                        <macro_1.Trans>Shipping</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <react_1.VStack spacing={0}>
                          <span>
                            {formatter.format((_0 = line.shippingCost) !== null && _0 !== void 0 ? _0 : 0)}
                          </span>
                          {shouldConvertCurrency && (<span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format((_1 = line.supplierShippingCost) !== null && _1 !== void 0 ? _1 : 0)}
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
                              {presentationCurrencyFormatter.format(supplierTotal)}
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
var PurchaseOrderSummary = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    var onEditShippingCost = _a.onEditShippingCost;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var company = (0, hooks_1.useUser)().company;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseOrder(orderId));
    var isEditable = !(0, purchasing_models_1.isPurchaseOrderLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _b === void 0 ? void 0 : _b.status);
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var presentationCurrencyFormatter = (0, hooks_1.useCurrencyFormatter)({
        currency: (_e = (_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _c === void 0 ? void 0 : _c.currencyCode) !== null && _d !== void 0 ? _d : company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _e !== void 0 ? _e : "USD"
    });
    var shouldConvertCurrency = ((_f = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _f === void 0 ? void 0 : _f.currencyCode) !== (company === null || company === void 0 ? void 0 : company.baseCurrencyCode);
    // Calculate totals
    var subtotal = (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _g === void 0 ? void 0 : _g.reduce(function (acc, line) {
        var _a, _b, _c;
        var lineTotal = ((_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0) * ((_b = line.purchaseQuantity) !== null && _b !== void 0 ? _b : 0) +
            ((_c = line.shippingCost) !== null && _c !== void 0 ? _c : 0);
        return acc + lineTotal;
    }, 0)) !== null && _h !== void 0 ? _h : 0;
    var supplierSubtotal = (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _j === void 0 ? void 0 : _j.reduce(function (acc, line) {
        var _a, _b, _c;
        var lineTotal = ((_a = line.supplierUnitPrice) !== null && _a !== void 0 ? _a : 0) * ((_b = line.purchaseQuantity) !== null && _b !== void 0 ? _b : 0) +
            ((_c = line.supplierShippingCost) !== null && _c !== void 0 ? _c : 0);
        return acc + lineTotal;
    }, 0)) !== null && _k !== void 0 ? _k : 0;
    var tax = (_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _l === void 0 ? void 0 : _l.reduce(function (acc, line) {
        var _a;
        return acc + ((_a = line.taxAmount) !== null && _a !== void 0 ? _a : 0);
    }, 0)) !== null && _m !== void 0 ? _m : 0;
    var supplierTax = (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _o === void 0 ? void 0 : _o.reduce(function (acc, line) {
        var _a;
        return acc + ((_a = line.supplierTaxAmount) !== null && _a !== void 0 ? _a : 0);
    }, 0)) !== null && _p !== void 0 ? _p : 0;
    var shippingCost = ((_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrderDelivery) === null || _q === void 0 ? void 0 : _q.supplierShippingCost) !== null && _r !== void 0 ? _r : 0) *
        ((_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _s === void 0 ? void 0 : _s.exchangeRate) !== null && _t !== void 0 ? _t : 1);
    var supplierShippingCost = (_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrderDelivery) === null || _u === void 0 ? void 0 : _u.supplierShippingCost) !== null && _v !== void 0 ? _v : 0;
    var total = subtotal + tax + shippingCost;
    var supplierTotal = supplierSubtotal + supplierTax + supplierShippingCost;
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.HStack className="justify-between items-center">
          <div className="flex flex-col gap-1">
            <react_1.CardTitle>{routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder.purchaseOrderId}</react_1.CardTitle>
            <react_1.CardDescription>
              <macro_1.Trans>Purchase Order</macro_1.Trans>
            </react_1.CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <components_1.SupplierAvatar supplierId={(_w = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder.supplierId) !== null && _w !== void 0 ? _w : null}/>
            {((_x = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _x === void 0 ? void 0 : _x.orderDate) && (<span className="text-muted-foreground text-sm">
                <macro_1.Trans>
                  Ordered {formatDate(routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder.orderDate)}
                </macro_1.Trans>
              </span>)}
          </div>
        </react_1.HStack>
      </react_1.CardHeader>
      <react_1.CardContent>
        <LineItems currencyCode={(_y = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _y !== void 0 ? _y : "USD"} presentationCurrencyFormatter={presentationCurrencyFormatter} formatter={formatter} locale={locale} lines={(_z = routeData === null || routeData === void 0 ? void 0 : routeData.lines) !== null && _z !== void 0 ? _z : []} shouldConvertCurrency={shouldConvertCurrency}/>

        <react_1.VStack spacing={2} className="mt-8">
          <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
            <span>
              <macro_1.Trans>Subtotal:</macro_1.Trans>
            </span>
            <react_1.VStack spacing={0} className="items-end">
              <span>{formatter.format(subtotal)}</span>
              {shouldConvertCurrency && (<span className="text-sm">
                  {presentationCurrencyFormatter.format(supplierSubtotal)}
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
                  {presentationCurrencyFormatter.format(supplierTax)}
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
                      {presentationCurrencyFormatter.format(supplierShippingCost)}
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
                  {presentationCurrencyFormatter.format(supplierTotal)}
                </span>)}
            </react_1.VStack>
          </react_1.HStack>
        </react_1.VStack>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = PurchaseOrderSummary;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
