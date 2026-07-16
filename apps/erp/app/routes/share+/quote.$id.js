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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.ErrorMessage = exports.meta = void 0;
exports.loader = loader;
exports.default = ExternalQuote;
var client_server_1 = require("@carbon/auth/client.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var framer_motion_1 = require("framer-motion");
var motion_number_1 = require("motion-number");
var react_2 = require("react");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var accounting_1 = require("~/modules/accounting");
var inventory_1 = require("~/modules/inventory");
var sales_1 = require("~/modules/sales");
var QuoteStatus_1 = require("~/modules/sales/ui/Quotes/QuoteStatus");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Digital Quote" }];
};
exports.meta = meta;
var QuoteState;
(function (QuoteState) {
    QuoteState[QuoteState["Valid"] = 0] = "Valid";
    QuoteState[QuoteState["Expired"] = 1] = "Expired";
    QuoteState[QuoteState["NotFound"] = 2] = "NotFound";
})(QuoteState || (QuoteState = {}));
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, serviceRole, quote, _c, company, companySettings, quoteLines, quoteLinePrices, customerDetails, quotePayment, quoteShipment, paymentTerms, terms, shippingMethods, opportunity, salesOrderLines, thumbnailPaths, thumbnails, _d;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        var params = _b.params, request = _b.request;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    id = params.id;
                    if (!id) {
                        return [2 /*return*/, {
                                state: QuoteState.NotFound,
                                data: null
                            }];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, sales_1.getQuoteByExternalId)(serviceRole, id)];
                case 1:
                    quote = _v.sent();
                    if (quote.error) {
                        return [2 /*return*/, {
                                state: QuoteState.NotFound,
                                data: null
                            }];
                    }
                    if (quote.data.expirationDate &&
                        new Date(quote.data.expirationDate) < new Date() &&
                        quote.data.status === "Sent") {
                        return [2 /*return*/, {
                                state: QuoteState.Expired,
                                data: null
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(serviceRole, quote.data.companyId),
                            (0, settings_1.getCompanySettings)(serviceRole, quote.data.companyId),
                            (0, sales_1.getQuoteLines)(serviceRole, quote.data.id),
                            (0, sales_1.getQuoteLinePricesByQuoteId)(serviceRole, quote.data.id),
                            (0, sales_1.getQuoteCustomerDetails)(serviceRole, quote.data.id),
                            (0, sales_1.getQuotePayment)(serviceRole, quote.data.id),
                            (0, sales_1.getQuoteShipment)(serviceRole, quote.data.id),
                            (0, accounting_1.getPaymentTermsList)(serviceRole, quote.data.companyId),
                            (0, sales_1.getSalesTerms)(serviceRole, quote.data.companyId),
                            (0, inventory_1.getShippingMethodsList)(serviceRole, quote.data.companyId),
                            (0, sales_1.getOpportunity)(serviceRole, quote.data.opportunityId)
                        ])];
                case 2:
                    _c = _v.sent(), company = _c[0], companySettings = _c[1], quoteLines = _c[2], quoteLinePrices = _c[3], customerDetails = _c[4], quotePayment = _c[5], quoteShipment = _c[6], paymentTerms = _c[7], terms = _c[8], shippingMethods = _c[9], opportunity = _c[10];
                    salesOrderLines = null;
                    if (!(((_f = (_e = opportunity.data) === null || _e === void 0 ? void 0 : _e.salesOrders) === null || _f === void 0 ? void 0 : _f.length) &&
                        ((_g = opportunity.data.salesOrders[0]) === null || _g === void 0 ? void 0 : _g.id))) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, sales_1.getSalesOrderLines)(serviceRole, opportunity.data.salesOrders[0].id)];
                case 3:
                    salesOrderLines = _v.sent();
                    _v.label = 4;
                case 4:
                    thumbnailPaths = (_h = quoteLines.data) === null || _h === void 0 ? void 0 : _h.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            acc[line.id] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    if (!thumbnailPaths) return [3 /*break*/, 6];
                    return [4 /*yield*/, Promise.all(Object.entries(thumbnailPaths).map(function (_a) {
                            var id = _a[0], path = _a[1];
                            if (!path) {
                                return null;
                            }
                            return (0, shared_1.getBase64ImageFromSupabase)(serviceRole, path).then(function (data) { return ({
                                id: id,
                                data: data
                            }); });
                        }))];
                case 5:
                    _d = _v.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _d = [];
                    _v.label = 7;
                case 7:
                    thumbnails = (_k = (_j = (_d)) === null || _j === void 0 ? void 0 : _j.reduce(function (acc, thumbnail) {
                        if (thumbnail) {
                            acc[thumbnail.id] = thumbnail.data;
                        }
                        return acc;
                    }, {})) !== null && _k !== void 0 ? _k : {};
                    return [2 /*return*/, {
                            state: QuoteState.Valid,
                            data: {
                                quote: quote.data,
                                company: company.data,
                                companySettings: companySettings.data,
                                quoteLines: (_m = (_l = quoteLines.data) === null || _l === void 0 ? void 0 : _l.map(function (_a) {
                                    var internalNotes = _a.internalNotes, line = __rest(_a, ["internalNotes"]);
                                    return (__assign({}, line));
                                })) !== null && _m !== void 0 ? _m : [],
                                thumbnails: thumbnails,
                                quoteLinePrices: quoteLinePrices.data,
                                customerDetails: customerDetails.data,
                                quotePayment: quotePayment.data,
                                quoteShipment: quoteShipment.data,
                                paymentTerm: (_p = (_o = paymentTerms.data) === null || _o === void 0 ? void 0 : _o.find(function (term) { var _a; return term.id === ((_a = quotePayment.data) === null || _a === void 0 ? void 0 : _a.paymentTermId); })) === null || _p === void 0 ? void 0 : _p.name,
                                terms: (_r = (_q = terms.data) === null || _q === void 0 ? void 0 : _q.salesTerms) !== null && _r !== void 0 ? _r : "",
                                shippingMethod: (_t = (_s = shippingMethods.data) === null || _s === void 0 ? void 0 : _s.find(function (method) { var _a; return method.id === ((_a = quoteShipment.data) === null || _a === void 0 ? void 0 : _a.shippingMethodId); })) === null || _t === void 0 ? void 0 : _t.name,
                                salesOrderLines: (_u = salesOrderLines === null || salesOrderLines === void 0 ? void 0 : salesOrderLines.data) !== null && _u !== void 0 ? _u : null
                            }
                        }];
            }
        });
    });
}
var Header = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var company = _a.company, quote = _a.quote, customer = _a.customer, locale = _a.locale;
    return (<div className="flex justify-between">
    <div className="flex items-center space-x-4 tracking-tight">
      <div>
        <react_1.CardTitle className="text-3xl">{(_b = company === null || company === void 0 ? void 0 : company.name) !== null && _b !== void 0 ? _b : ""}</react_1.CardTitle>
        {(quote === null || quote === void 0 ? void 0 : quote.quoteId) && (<p className="text-lg text-muted-foreground">{quote.quoteId}</p>)}
        {(quote === null || quote === void 0 ? void 0 : quote.expirationDate) && (<p className="text-lg text-muted-foreground">
            <macro_1.Trans>Expires</macro_1.Trans>{" "}
            {(0, utils_1.formatDate)(quote.expirationDate, undefined, locale)}
          </p>)}
      </div>
    </div>
    <div className="flex flex-col gap-2 items-end justify-start">
      <p className="text-xl font-medium">{(_c = customer === null || customer === void 0 ? void 0 : customer.customerName) !== null && _c !== void 0 ? _c : ""}</p>
      {(customer === null || customer === void 0 ? void 0 : customer.contactName) && (<p className="text-base text-muted-foreground">
          {(_d = customer.contactName) !== null && _d !== void 0 ? _d : ""}
        </p>)}
      {(customer === null || customer === void 0 ? void 0 : customer.customerAddressLine1) && (<div className="text-right">
          <p className="text-xs text-muted-foreground">
            {customer.customerAddressLine1}
          </p>

          {(customer === null || customer === void 0 ? void 0 : customer.customerAddressLine2) && (<p className="text-xs text-muted-foreground">
              {customer.customerAddressLine2}
            </p>)}
          <p className="text-xs text-muted-foreground">
            {(0, utils_1.formatCityStatePostalCode)((_e = customer === null || customer === void 0 ? void 0 : customer.customerCity) !== null && _e !== void 0 ? _e : "", (_f = customer === null || customer === void 0 ? void 0 : customer.customerStateProvince) !== null && _f !== void 0 ? _f : "", (_g = customer === null || customer === void 0 ? void 0 : customer.customerPostalCode) !== null && _g !== void 0 ? _g : "")}
          </p>
          <p className="text-xs text-muted-foreground">
            {(_h = customer === null || customer === void 0 ? void 0 : customer.customerCountryName) !== null && _h !== void 0 ? _h : ""}
          </p>
        </div>)}
    </div>
  </div>);
};
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
    var currencyCode = _a.currencyCode, formatter = _a.formatter, locale = _a.locale, selectedLines = _a.selectedLines, setSelectedLines = _a.setSelectedLines;
    var _b = (0, react_router_1.useLoaderData)().data, company = _b.company, quote = _b.quote, quoteLines = _b.quoteLines, quoteLinePrices = _b.quoteLinePrices, thumbnails = _b.thumbnails;
    var _c = (0, react_2.useState)(function () {
        if (!Array.isArray(quoteLines) || quoteLines.length === 0) {
            return [];
        }
        if (["Ordered", "Partial", "Expired", "Cancelled"].includes(quote.status)) {
            return [];
        }
        return quoteLines.filter(function (line) { return !!line.id; }).map(function (line) { return line.id; });
    }), openItems = _c[0], setOpenItems = _c[1];
    var pricingByLine = (0, react_2.useMemo)(function () {
        var _a;
        return (_a = quoteLines === null || quoteLines === void 0 ? void 0 : quoteLines.reduce(function (acc, line) {
            var _a;
            if (!line.id) {
                return acc;
            }
            acc[line.id] =
                (_a = quoteLinePrices === null || quoteLinePrices === void 0 ? void 0 : quoteLinePrices.filter(function (p) { return p.quoteLineId === line.id; }).sort(function (a, b) { return a.quantity - b.quantity; })) !== null && _a !== void 0 ? _a : [];
            return acc;
        }, {})) !== null && _a !== void 0 ? _a : {};
    }, [quoteLines, quoteLinePrices]);
    var toggleOpen = function (id) {
        setOpenItems(function (prev) {
            return prev.includes(id) ? prev.filter(function (item) { return item !== id; }) : __spreadArray(__spreadArray([], prev, true), [id], false);
        });
    };
    var shouldConvertCurrency = quote.currencyCode !== (company === null || company === void 0 ? void 0 : company.baseCurrencyCode);
    return (<react_1.VStack spacing={8} className="w-full">
      {quoteLines === null || quoteLines === void 0 ? void 0 : quoteLines.map(function (line) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
            var prices = quoteLinePrices === null || quoteLinePrices === void 0 ? void 0 : quoteLinePrices.filter(function (price) { return price.quoteLineId === line.id; }).sort(function (a, b) { return a.quantity - b.quantity; });
            if (!line || !prices || !line.id) {
                return null;
            }
            return (<framer_motion_1.motion.div key={line.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-input py-6 w-full">
            <react_1.HStack spacing={4} className="items-start">
              {thumbnails[line.id] ? (<img alt={line.itemReadableId} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(_a = thumbnails[line.id]) !== null && _a !== void 0 ? _a : undefined}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0} className="w-full">
                <div className="flex flex-col cursor-pointer w-full" onClick={function () { return toggleOpen(line.id); }}>
                  <div className="flex items-center gap-x-4 justify-between flex-grow">
                    <react_1.Heading>{line.itemReadableId}</react_1.Heading>
                    <react_1.HStack spacing={4}>
                      <motion_number_1.default className="font-bold text-xl" value={((_c = (_b = selectedLines[line.id]) === null || _b === void 0 ? void 0 : _b.convertedNetUnitPrice) !== null && _c !== void 0 ? _c : 0) *
                    ((_e = (_d = selectedLines[line.id]) === null || _d === void 0 ? void 0 : _d.quantity) !== null && _e !== void 0 ? _e : 0) +
                    ((_g = (_f = selectedLines[line.id]) === null || _f === void 0 ? void 0 : _f.convertedAddOn) !== null && _g !== void 0 ? _g : 0) +
                    ((_j = (_h = selectedLines[line.id]) === null || _h === void 0 ? void 0 : _h.convertedShippingCost) !== null && _j !== void 0 ? _j : 0) +
                    (((_l = (_k = selectedLines[line.id]) === null || _k === void 0 ? void 0 : _k.convertedNetUnitPrice) !== null && _l !== void 0 ? _l : 0) *
                        ((_o = (_m = selectedLines[line.id]) === null || _m === void 0 ? void 0 : _m.quantity) !== null && _o !== void 0 ? _o : 0) +
                        ((_q = (_p = selectedLines[line.id]) === null || _p === void 0 ? void 0 : _p.convertedTaxableAddOn) !== null && _q !== void 0 ? _q : 0) +
                        ((_s = (_r = selectedLines[line.id]) === null || _r === void 0 ? void 0 : _r.convertedShippingCost) !== null && _s !== void 0 ? _s : 0)) *
                        ((_u = (_t = selectedLines[line.id]) === null || _t === void 0 ? void 0 : _t.taxPercent) !== null && _u !== void 0 ? _u : 0)} format={{
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
                  {Object.keys((_v = line.externalNotes) !== null && _v !== void 0 ? _v : {}).length > 0 && (<div className="prose dark:prose-invert mt-2 text-muted-foreground" dangerouslySetInnerHTML={{
                        __html: (0, react_1.generateHTML)(line.externalNotes)
                    }}/>)}
                </div>
              </react_1.VStack>
            </react_1.HStack>

            <framer_motion_1.motion.div initial="collapsed" animate={openItems.includes(line.id) ? "open" : "collapsed"} variants={{
                    open: { opacity: 1, height: "auto", marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                }} transition={{ duration: 0.3 }} className="w-full overflow-hidden">
              <LinePricingOptions formatter={formatter} line={line} options={pricingByLine[line.id]} quoteCurrency={(_w = quote.currencyCode) !== null && _w !== void 0 ? _w : "USD"} quoteExchangeRate={(_x = quote.exchangeRate) !== null && _x !== void 0 ? _x : 1} shouldConvertCurrency={shouldConvertCurrency} locale={locale} selectedLine={selectedLines[line.id]} setSelectedLines={setSelectedLines} onDeselect={function (lineId) {
                    return setOpenItems(function (prev) { return prev.filter(function (item) { return item !== lineId; }); });
                }}/>
            </framer_motion_1.motion.div>
          </framer_motion_1.motion.div>);
        })}
    </react_1.VStack>);
};
var LinePricingOptions = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var line = _a.line, options = _a.options, quoteCurrency = _a.quoteCurrency, shouldConvertCurrency = _a.shouldConvertCurrency, quoteExchangeRate = _a.quoteExchangeRate, locale = _a.locale, formatter = _a.formatter, selectedLine = _a.selectedLine, setSelectedLines = _a.setSelectedLines, onDeselect = _a.onDeselect;
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var _s = (0, react_router_1.useLoaderData)().data, quote = _s.quote, salesOrderLines = _s.salesOrderLines;
    var hasSalesOrder = Array.isArray(salesOrderLines) && salesOrderLines.length > 0;
    var _t = (0, react_2.useState)((_c = (_b = selectedLine === null || selectedLine === void 0 ? void 0 : selectedLine.quantity) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : null), selectedValue = _t[0], setSelectedValue = _t[1];
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
    var unitPriceformatter = (0, react_2.useMemo)(function () {
        var _a, _b;
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: (_a = quote.currencyCode) !== null && _a !== void 0 ? _a : "USD",
            maximumFractionDigits: (_b = line.unitPricePrecision) !== null && _b !== void 0 ? _b : 2
        });
    }, [locale, quote.currencyCode, line.unitPricePrecision]);
    var hasAnyDiscount = options.some(function (option) { return option.discountPercent > 0; });
    var hasAnyShipping = options.some(function (option) { var _a; return ((_a = option.convertedShippingCost) !== null && _a !== void 0 ? _a : 0) > 0; });
    var hasAnyFees = options.some(function (option) { var _a; return ((_a = convertedAdditionalChargesByQuantity[option.quantity]) !== null && _a !== void 0 ? _a : 0) > 0; });
    return (<react_1.VStack spacing={4}>
      <react_1.RadioGroup className="w-full" value={selectedValue !== null && selectedValue !== void 0 ? selectedValue : undefined} disabled={["Ordered", "Partial", "Expired", "Cancelled"].includes(quote.status)} onValueChange={function (value) {
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
              {hasAnyDiscount && (<react_1.Th>
                  <macro_1.Trans>Discount</macro_1.Trans>
                </react_1.Th>)}
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
                <react_1.Td colSpan={5 +
                (hasAnyDiscount ? 1 : 0) +
                (hasAnyShipping ? 1 : 0) +
                (hasAnyFees ? 1 : 0)} className="text-center py-8">
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
                        {unitPriceformatter.format((_b = option.convertedUnitPrice) !== null && _b !== void 0 ? _b : 0)}
                      </react_1.Td>
                      {hasAnyDiscount && (<react_1.Td>
                          {option.discountPercent > 0
                        ? percentFormatter.format(option.discountPercent)
                        : "-"}
                        </react_1.Td>)}
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
                  <motion_number_1.default value={((_j = selectedLine.convertedUnitPrice) !== null && _j !== void 0 ? _j : 0) *
                selectedLine.quantity} format={{ style: "currency", currency: quoteCurrency }} locales={locale}/>
                </react_1.Td>
              </react_1.Tr>

              {selectedLine.discountPercent > 0 && (<react_1.Tr key="discount" className="border-b border-border">
                  <react_1.Td>
                    Discount (
                    {percentFormatter.format(selectedLine.discountPercent)})
                  </react_1.Td>
                  <react_1.Td className="text-right">
                    -
                    <motion_number_1.default value={((_k = selectedLine.convertedUnitPrice) !== null && _k !== void 0 ? _k : 0) *
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
                  <motion_number_1.default value={((_l = selectedLine.convertedNetUnitPrice) !== null && _l !== void 0 ? _l : 0) *
                selectedLine.quantity +
                selectedLine.convertedAddOn +
                selectedLine.convertedShippingCost} format={{
                style: "currency",
                currency: quoteCurrency
            }} locales={locale}/>
                </react_1.Td>
              </react_1.Tr>

              <react_1.Tr key="tax" className="border-b border-border">
                <react_1.Td>
                  <macro_1.Trans>Tax</macro_1.Trans> (
                  {percentFormatter.format(selectedLine.taxPercent)})
                </react_1.Td>
                <react_1.Td className="text-right">
                  <motion_number_1.default value={(((_m = selectedLine.convertedNetUnitPrice) !== null && _m !== void 0 ? _m : 0) *
                selectedLine.quantity +
                ((_o = selectedLine.convertedTaxableAddOn) !== null && _o !== void 0 ? _o : 0) +
                selectedLine.convertedShippingCost) *
                selectedLine.taxPercent} format={{
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
                  <motion_number_1.default value={((_p = selectedLine.convertedNetUnitPrice) !== null && _p !== void 0 ? _p : 0) *
                selectedLine.quantity +
                selectedLine.convertedAddOn +
                selectedLine.convertedShippingCost +
                (((_q = selectedLine.convertedNetUnitPrice) !== null && _q !== void 0 ? _q : 0) *
                    selectedLine.quantity +
                    ((_r = selectedLine.convertedTaxableAddOn) !== null && _r !== void 0 ? _r : 0) +
                    selectedLine.convertedShippingCost) *
                    selectedLine.taxPercent} format={{
                style: "currency",
                currency: quoteCurrency
            }} locales={locale}/>
                </react_1.Td>
              </react_1.Tr>
            </react_1.Tbody>
          </react_1.Table>
        </div>)}
      {selectedLine.quantity !== 0 && !hasSalesOrder && (<react_1.HStack spacing={2} className="w-full justify-end items-center">
          <react_1.Button variant="secondary" leftIcon={<lu_1.LuCircleX />} onClick={function () {
                setSelectedValue("0");
                setSelectedLines(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = deselectedLine, _a)));
                });
                if (line.id) {
                    onDeselect === null || onDeselect === void 0 ? void 0 : onDeselect(line.id);
                }
            }}>
            <macro_1.Trans>Remove</macro_1.Trans>
          </react_1.Button>
        </react_1.HStack>)}
    </react_1.VStack>);
};
var Quote = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var data = _a.data;
    var company = data.company, companySettings = data.companySettings, customerDetails = data.customerDetails, paymentTerm = data.paymentTerm, quote = data.quote, quoteLines = data.quoteLines, quoteLinePrices = data.quoteLinePrices, quoteShipment = data.quoteShipment, salesOrderLines = data.salesOrderLines, shippingMethod = data.shippingMethod, terms = data.terms;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, react_2.useMemo)(function () {
        var _a;
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: (_a = quote.currencyCode) !== null && _a !== void 0 ? _a : "USD"
        });
    }, [locale, quote.currencyCode]);
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find external quote id");
    var confirmQuoteModal = (0, react_1.useDisclosure)();
    var rejectQuoteModal = (0, react_1.useDisclosure)();
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    var mode = (0, react_1.useMode)();
    var logo = mode === "dark" ? company === null || company === void 0 ? void 0 : company.logoDark : company === null || company === void 0 ? void 0 : company.logoLight;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && submitted.current) {
            confirmQuoteModal.onClose();
            rejectQuoteModal.onClose();
            submitted.current = false;
        }
    }, [fetcher.state]);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(fetcher.data.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message, (_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success]);
    var _p = (0, react_2.useState)(function () {
        var _a;
        return ((_a = quoteLines === null || quoteLines === void 0 ? void 0 : quoteLines.reduce(function (acc, line) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            var salesOrderLine = salesOrderLines === null || salesOrderLines === void 0 ? void 0 : salesOrderLines.find(function (salesOrderLine) { return salesOrderLine.id === line.id; });
            if (Array.isArray(salesOrderLines) &&
                salesOrderLines.length > 0 &&
                !salesOrderLine) {
                acc[line.id] = deselectedLine;
                return acc;
            }
            var price = salesOrderLine
                ? quoteLinePrices === null || quoteLinePrices === void 0 ? void 0 : quoteLinePrices.find(function (price) {
                    return price.quoteLineId === salesOrderLine.id &&
                        price.quantity === salesOrderLine.saleQuantity;
                })
                : quoteLinePrices === null || quoteLinePrices === void 0 ? void 0 : quoteLinePrices.find(function (price) {
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
            var additionalChargesByQuantity = (_b = (_a = line.quantity) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, quantity) {
                var _a;
                var charges = Object.values((_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {}).reduce(function (chargeAcc, charge) {
                    var _a, _b;
                    var amount = (_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0;
                    return chargeAcc + amount;
                }, 0);
                acc[quantity] = charges;
                return acc;
            }, {})) !== null && _b !== void 0 ? _b : {};
            var convertedAdditionalChargesByQuantity = (_c = Object.entries(additionalChargesByQuantity).reduce(function (acc, _a) {
                var _b;
                var quantity = _a[0], amount = _a[1];
                acc[Number(quantity)] =
                    amount * ((_b = quote.exchangeRate) !== null && _b !== void 0 ? _b : 1);
                return acc;
            }, {})) !== null && _c !== void 0 ? _c : {};
            var taxableAdditionalChargesByQuantity = (_e = (_d = line.quantity) === null || _d === void 0 ? void 0 : _d.reduce(function (acc, quantity) {
                var _a;
                var charges = Object.values((_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {}).reduce(function (chargeAcc, charge) {
                    var _a, _b;
                    if (charge.taxable === false)
                        return chargeAcc;
                    var amount = (_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0;
                    return chargeAcc + amount;
                }, 0);
                acc[quantity] = charges;
                return acc;
            }, {})) !== null && _e !== void 0 ? _e : {};
            var convertedTaxableAdditionalChargesByQuantity = (_f = Object.entries(taxableAdditionalChargesByQuantity).reduce(function (acc, _a) {
                var _b;
                var quantity = _a[0], amount = _a[1];
                acc[Number(quantity)] =
                    amount * ((_b = quote.exchangeRate) !== null && _b !== void 0 ? _b : 1);
                return acc;
            }, {})) !== null && _f !== void 0 ? _f : {};
            acc[line.id] = {
                quantity: (_g = price.quantity) !== null && _g !== void 0 ? _g : 0,
                netUnitPrice: (_h = price.netUnitPrice) !== null && _h !== void 0 ? _h : 0,
                convertedNetUnitPrice: (_j = price.convertedNetUnitPrice) !== null && _j !== void 0 ? _j : 0,
                addOn: additionalChargesByQuantity[price.quantity] || 0,
                convertedAddOn: convertedAdditionalChargesByQuantity[price.quantity] || 0,
                taxableAddOn: taxableAdditionalChargesByQuantity[price.quantity] || 0,
                convertedTaxableAddOn: convertedTaxableAdditionalChargesByQuantity[price.quantity] || 0,
                leadTime: price.leadTime,
                shippingCost: (_k = price.shippingCost) !== null && _k !== void 0 ? _k : 0,
                convertedShippingCost: (_l = price.convertedShippingCost) !== null && _l !== void 0 ? _l : 0,
                taxPercent: (_m = line.taxPercent) !== null && _m !== void 0 ? _m : 0,
                discountPercent: (_o = price.discountPercent) !== null && _o !== void 0 ? _o : 0,
                unitPrice: (_p = price.unitPrice) !== null && _p !== void 0 ? _p : 0,
                convertedUnitPrice: (_q = price.convertedUnitPrice) !== null && _q !== void 0 ? _q : 0
            };
            return acc;
        }, {})) !== null && _a !== void 0 ? _a : {});
    }), selectedLines = _p[0], setSelectedLines = _p[1];
    var subtotal = Object.values(selectedLines).reduce(function (acc, line) {
        return (acc +
            line.convertedNetUnitPrice * line.quantity +
            line.convertedAddOn +
            line.convertedShippingCost);
    }, 0);
    var totalDiscount = Object.values(selectedLines).reduce(function (acc, line) {
        var _a, _b;
        return (acc +
            ((_a = line.convertedUnitPrice) !== null && _a !== void 0 ? _a : 0) *
                line.quantity *
                ((_b = line.discountPercent) !== null && _b !== void 0 ? _b : 0));
    }, 0);
    var tax = Object.values(selectedLines).reduce(function (acc, line) {
        var _a, _b;
        return (acc +
            (line.convertedNetUnitPrice * line.quantity +
                ((_a = line.convertedTaxableAddOn) !== null && _a !== void 0 ? _a : 0) +
                line.convertedShippingCost) *
                ((_b = line.taxPercent) !== null && _b !== void 0 ? _b : 0));
    }, 0);
    var convertedShippingCost = ((_d = quote.exchangeRate) !== null && _d !== void 0 ? _d : 1) * ((_e = quoteShipment === null || quoteShipment === void 0 ? void 0 : quoteShipment.shippingCost) !== null && _e !== void 0 ? _e : 0);
    var total = subtotal + tax + convertedShippingCost;
    var termsHTML = (0, react_1.generateHTML)(terms);
    var _q = (0, react_2.useState)(null), file = _q[0], setFile = _q[1];
    var onDrop = function (acceptedFiles) {
        setFile(acceptedFiles[0]);
    };
    var _r = (0, react_dropzone_1.useDropzone)({
        onDrop: onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        maxSize: 25 * 1024 * 1024 // 25MB limit
    }), getRootProps = _r.getRootProps, getInputProps = _r.getInputProps, isDragActive = _r.isDragActive;
    return (<react_1.VStack spacing={8} className="w-full items-center p-2 md:p-8">
      {logo && (<img src={logo} alt={(_f = company === null || company === void 0 ? void 0 : company.name) !== null && _f !== void 0 ? _f : ""} className="w-auto mx-auto max-w-5xl"/>)}
      <react_1.Card className="w-full max-w-5xl mx-auto">
        <react_1.CardHeader>
          <div className="w-full text-center">
            {!["Sent", "Lost"].includes(quote.status) && (<QuoteStatus_1.default status={quote.status}/>)}
            {(quote === null || quote === void 0 ? void 0 : quote.status) === "Lost" && <react_1.Badge variant="red">Rejected</react_1.Badge>}
          </div>

          <Header company={company} quote={quote} customer={customerDetails} locale={locale}/>
        </react_1.CardHeader>
        <react_1.CardContent>
          <LineItems currencyCode={(_g = quote.currencyCode) !== null && _g !== void 0 ? _g : "USD"} locale={locale} formatter={formatter} selectedLines={selectedLines} setSelectedLines={setSelectedLines}/>

          {Object.keys((_h = quote === null || quote === void 0 ? void 0 : quote.externalNotes) !== null && _h !== void 0 ? _h : {}).length > 0 && (<div className="mt-6 mb-2">
              <react_1.Heading size="h4" className="mb-2">
                <macro_1.Trans>Notes</macro_1.Trans>
              </react_1.Heading>
              <div className="prose dark:prose-invert text-muted-foreground" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(quote.externalNotes)
            }}/>
            </div>)}

          <react_1.VStack spacing={2} className="mt-8">
            {shippingMethod && (<react_1.HStack className="justify-between text-sm text-muted-foreground w-full">
                <react_1.HStack spacing={2}>
                  <lu_1.LuTruck className="w-5 h-5"/>
                  <span>
                    <macro_1.Trans>Shipping Method</macro_1.Trans>:
                  </span>
                </react_1.HStack>
                <span className="text-foreground font-bold">
                  {shippingMethod}
                </span>
              </react_1.HStack>)}
            {paymentTerm && (<react_1.HStack className="justify-between text-sm text-muted-foreground w-full">
                <react_1.HStack spacing={2}>
                  <lu_1.LuCreditCard className="w-5 h-5"/>
                  <span>
                    <macro_1.Trans>Payment Term</macro_1.Trans>:
                  </span>
                </react_1.HStack>
                <span className="text-foreground font-bold">{paymentTerm}</span>
              </react_1.HStack>)}
            {(shippingMethod || paymentTerm) && <react_1.Separator />}
            <react_1.HStack className="justify-between text-base w-full">
              <span>
                <macro_1.Trans>Subtotal</macro_1.Trans>:
              </span>
              <motion_number_1.default value={subtotal + totalDiscount} format={{
            style: "currency",
            currency: (_j = quote.currencyCode) !== null && _j !== void 0 ? _j : "USD"
        }} locales={locale}/>
            </react_1.HStack>
            {totalDiscount > 0 && (<react_1.HStack className="justify-between text-base w-full">
                <span>Discount:</span>
                <span className="text-muted-foreground">
                  -
                  <motion_number_1.default value={totalDiscount} format={{
                style: "currency",
                currency: (_k = quote.currencyCode) !== null && _k !== void 0 ? _k : "USD"
            }} locales={locale}/>
                </span>
              </react_1.HStack>)}
            <react_1.HStack className="justify-between text-base w-full">
              <span>
                <macro_1.Trans>Tax</macro_1.Trans>:
              </span>
              <motion_number_1.default value={tax} format={{
            style: "currency",
            currency: (_l = quote.currencyCode) !== null && _l !== void 0 ? _l : "USD"
        }} locales={locale}/>
            </react_1.HStack>
            {convertedShippingCost > 0 && (<react_1.HStack className="justify-between text-base w-full">
                <span>
                  <macro_1.Trans>Shipping</macro_1.Trans>:
                </span>
                <motion_number_1.default value={convertedShippingCost} format={{
                style: "currency",
                currency: (_m = quote.currencyCode) !== null && _m !== void 0 ? _m : "USD"
            }} locales={locale}/>
              </react_1.HStack>)}
            <react_1.Separator className="my-2"/>
            <react_1.HStack className="justify-between text-xl font-bold w-full">
              <span>
                <macro_1.Trans>Total</macro_1.Trans>:
              </span>
              <motion_number_1.default value={total} format={{
            style: "currency",
            currency: (_o = quote.currencyCode) !== null && _o !== void 0 ? _o : "USD"
        }} locales={locale}/>
            </react_1.HStack>
          </react_1.VStack>
          <div className="flex flex-col gap-2">
            {(companySettings === null || companySettings === void 0 ? void 0 : companySettings.digitalQuoteEnabled) &&
            (quote === null || quote === void 0 ? void 0 : quote.status) === "Sent" && (<>
                  <react_1.Button onClick={confirmQuoteModal.onOpen} size="lg" variant="primary" isDisabled={total === 0} className="w-full mt-8 text-lg">
                    <macro_1.Trans>Accept Quote</macro_1.Trans>
                  </react_1.Button>
                  <react_1.Button onClick={rejectQuoteModal.onOpen} size="lg" variant="link">
                    <macro_1.Trans>Reject Quote</macro_1.Trans>
                  </react_1.Button>
                </>)}
          </div>
        </react_1.CardContent>
      </react_1.Card>
      {termsHTML && (<div className="prose dark:prose-invert text-muted-foreground max-w-5xl mx-auto" dangerouslySetInnerHTML={{
                __html: termsHTML
            }}/>)}
      {confirmQuoteModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    confirmQuoteModal.onClose();
            }}>
          <react_1.ModalOverlay />
          <react_1.ModalContent>
            <form_1.ValidatedForm action={path_1.path.to.api.digitalQuote(id)} validator={sales_1.externalQuoteValidator} method="post" fetcher={fetcher} onSubmit={function () {
                submitted.current = true;
            }} encType="multipart/form-data">
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Accept Quote</macro_1.Trans>
                </react_1.ModalTitle>
                <react_1.ModalDescription>
                  <macro_1.Trans>
                    Are you sure you want to accept quote {quote.quoteId} for{" "}
                    {formatter.format(total)}?
                  </macro_1.Trans>
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                {!(companySettings === null || companySettings === void 0 ? void 0 : companySettings.digitalQuoteIncludesPurchaseOrders) && (<input type="hidden" name="file"/>)}
                <input type="hidden" name="type" value="accept"/>
                <div className="space-y-4 py-4">
                  <form_1.Input name="digitalQuoteAcceptedBy" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Please enter your name"], ["Please enter your name"])))}/>
                  <form_1.Input name="digitalQuoteAcceptedByEmail" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Please enter your email address"], ["Please enter your email address"])))}/>
                  {(companySettings === null || companySettings === void 0 ? void 0 : companySettings.digitalQuoteIncludesPurchaseOrders) && (<div {...getRootProps()} className={(0, react_1.cn)("w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer", isDragActive ? "border-primary" : "border-muted")}>
                      <input name="file" {...getInputProps()}/>
                      {file ? (<>
                          <p>{file.name}</p>
                          <react_1.Button variant="secondary" size="sm" onClick={function () { return setFile(null); }}>
                            <macro_1.Trans>Change</macro_1.Trans>
                          </react_1.Button>
                        </>) : (<>
                          <p>
                            <macro_1.Trans>
                              Drag and drop a Purchase Order PDF here, or click
                              to select a file
                            </macro_1.Trans>
                          </p>
                          <lu_1.LuUpload className="mx-auto mt-4 h-12 w-12 text-muted-foreground"/>
                        </>)}
                    </div>)}
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" onClick={confirmQuoteModal.onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <input type="hidden" name="selectedLines" value={JSON.stringify(selectedLines)}/>

                <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit">
                  <macro_1.Trans>Yes, Accept</macro_1.Trans>
                </react_1.Button>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}

      {rejectQuoteModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    rejectQuoteModal.onClose();
            }}>
          <react_1.ModalOverlay />
          <react_1.ModalContent>
            <form_1.ValidatedForm action={path_1.path.to.api.digitalQuote(id)} validator={sales_1.externalQuoteValidator} method="post" fetcher={fetcher} onSubmit={function () {
                submitted.current = true;
            }}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Reject Quote</macro_1.Trans>
                </react_1.ModalTitle>
                <react_1.ModalDescription>
                  <macro_1.Trans>Are you sure you want to reject this quote?</macro_1.Trans>
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <input type="hidden" name="type" value="reject"/>
                <div className="space-y-4 py-4">
                  <form_1.Input name="digitalQuoteRejectedBy" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Please enter your name"], ["Please enter your name"])))}/>
                  <form_1.Input name="digitalQuoteRejectedByEmail" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Please enter your email address"], ["Please enter your email address"])))}/>
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" onClick={rejectQuoteModal.onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>

                <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} variant="destructive" type="submit">
                  <macro_1.Trans>Yes, Reject</macro_1.Trans>
                </react_1.Button>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </react_1.VStack>);
};
var ErrorMessage = function (_a) {
    var title = _a.title, message = _a.message;
    var containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };
    var itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };
    return (<framer_motion_1.motion.div className="flex min-h-screen flex-col items-center justify-center p-4 text-center" initial="hidden" animate="visible" variants={containerVariants}>
      <framer_motion_1.motion.div className="w-full max-w-md space-y-8" variants={containerVariants}>
        <framer_motion_1.motion.div className="relative mx-auto h-24 w-24" variants={itemVariants}>
          <svg className="absolute inset-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <framer_motion_1.motion.circle cx="50" cy="50" r="45" stroke="hsl(var(--muted))" strokeWidth="10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}/>
            <framer_motion_1.motion.path d="M50 5 A45 45 0 0 1 95 50" stroke="hsl(var(--primary))" strokeWidth="10" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{
            duration: 2,
            ease: "easeInOut"
        }}/>
          </svg>
          <framer_motion_1.motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 10
        }}>
            <span className="text-2xl font-bold text-muted-foreground">!</span>
          </framer_motion_1.motion.div>
        </framer_motion_1.motion.div>
        <framer_motion_1.motion.h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" variants={itemVariants}>
          {title}
        </framer_motion_1.motion.h1>
        <framer_motion_1.motion.p className="text-lg text-muted-foreground" variants={itemVariants}>
          {message}
        </framer_motion_1.motion.p>
      </framer_motion_1.motion.div>
    </framer_motion_1.motion.div>);
};
exports.ErrorMessage = ErrorMessage;
function ExternalQuote() {
    var _a = (0, react_router_1.useLoaderData)(), state = _a.state, data = _a.data;
    var t = (0, macro_1.useLingui)().t;
    switch (state) {
        case QuoteState.Valid:
            if (data) {
                return <Quote data={data}/>;
            }
            return (<exports.ErrorMessage title={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quote not found"], ["Quote not found"])))} message={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Oops! The link you're trying to access is not valid."], ["Oops! The link you're trying to access is not valid."])))}/>);
        case QuoteState.Expired:
            return (<exports.ErrorMessage title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Quote expired"], ["Quote expired"])))} message={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Oops! The link you're trying to access has expired or is no longer valid."], ["Oops! The link you're trying to access has expired or is no longer valid."])))}/>);
        case QuoteState.NotFound:
            return (<exports.ErrorMessage title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Quote not found"], ["Quote not found"])))} message={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Oops! The link you're trying to access is not valid."], ["Oops! The link you're trying to access is not valid."])))}/>);
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
