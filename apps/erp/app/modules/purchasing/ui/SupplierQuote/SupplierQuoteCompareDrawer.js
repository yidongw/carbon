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
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var path_1 = require("~/utils/path");
var SupplierQuoteCompareDrawer = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var isOpen = _a.isOpen, onClose = _a.onClose, purchasingRfqId = _a.purchasingRfqId;
    var t = (0, macro_1.useLingui)().t;
    var _l = (0, react_2.useState)("compare"), step = _l[0], setStep = _l[1];
    var _m = (0, react_2.useState)(null), selectedQuoteId = _m[0], setSelectedQuoteId = _m[1];
    var _o = (0, react_2.useState)(null), selectedQuantityTier = _o[0], setSelectedQuantityTier = _o[1];
    var _p = (0, react_2.useState)({}), selectedLines = _p[0], setSelectedLines = _p[1];
    var fetcher = (0, react_router_1.useFetcher)();
    var navigation = (0, react_router_1.useNavigation)();
    var isSubmitting = navigation.state !== "idle";
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var formatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({ currency: baseCurrency });
    // Load comparison data when drawer opens
    (0, react_2.useEffect)(function () {
        if (isOpen &&
            purchasingRfqId &&
            fetcher.state === "idle" &&
            !fetcher.data) {
            fetcher.load(path_1.path.to.purchasingRfqCompare(purchasingRfqId));
        }
    }, [isOpen, purchasingRfqId, fetcher]);
    // Reset state when drawer closes
    (0, react_2.useEffect)(function () {
        if (!isOpen) {
            setStep("compare");
            setSelectedQuoteId(null);
            setSelectedQuantityTier(null);
            setSelectedLines({});
        }
    }, [isOpen]);
    var quotes = (_d = (_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.quotes) !== null && _d !== void 0 ? _d : [];
    var lines = (_f = (_e = fetcher.data) === null || _e === void 0 ? void 0 : _e.lines) !== null && _f !== void 0 ? _f : [];
    var prices = (_h = (_g = fetcher.data) === null || _g === void 0 ? void 0 : _g.prices) !== null && _h !== void 0 ? _h : [];
    // Calculate submission stats for header
    var totalQuotes = quotes.length;
    var submittedQuotes = quotes.filter(function (q) { return q.status === "Active"; }).length;
    // Get all unique quantity tiers across all quotes
    var quantityTiers = (0, react_2.useMemo)(function () {
        var tiers = new Set();
        for (var _i = 0, prices_1 = prices; _i < prices_1.length; _i++) {
            var price = prices_1[_i];
            tiers.add(price.quantity);
        }
        return Array.from(tiers).sort(function (a, b) { return a - b; });
    }, [prices]);
    // Set default quantity tier to first available
    (0, react_2.useEffect)(function () {
        if (quantityTiers.length > 0 && selectedQuantityTier === null) {
            setSelectedQuantityTier(quantityTiers[0]);
        }
    }, [quantityTiers, selectedQuantityTier]);
    var selectedQuote = (0, react_2.useMemo)(function () { return quotes.find(function (q) { return q.id === selectedQuoteId; }); }, [quotes, selectedQuoteId]);
    var selectedQuoteLines = (0, react_2.useMemo)(function () { return lines.filter(function (l) { return l.supplierQuoteId === selectedQuoteId; }); }, [lines, selectedQuoteId]);
    var selectedQuotePrices = (0, react_2.useMemo)(function () { return prices.filter(function (p) { return p.supplierQuoteId === selectedQuoteId; }); }, [prices, selectedQuoteId]);
    var handleQuoteSelect = function (quoteId) {
        setSelectedQuoteId(quoteId);
    };
    var handleProceedToSelectItems = function () {
        if (selectedQuoteId) {
            setStep("select-items");
        }
    };
    var handleBackToCompare = function () {
        setStep("compare");
        setSelectedLines({});
    };
    // Calculate order total from selected line items
    var orderTotal = (0, react_2.useMemo)(function () {
        var total = 0;
        for (var _i = 0, _a = Object.values(selectedLines); _i < _a.length; _i++) {
            var pricing = _a[_i];
            total +=
                pricing.supplierUnitPrice * pricing.quantity +
                    pricing.supplierShippingCost +
                    pricing.supplierTaxAmount;
        }
        return total;
    }, [selectedLines]);
    var isLoading = fetcher.state === "loading";
    return (<react_1.Drawer open={isOpen} onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.DrawerContent size="xl">
        <react_1.DrawerHeader>
          <react_1.HStack className="w-full justify-between">
            <react_1.HStack>
              {step === "select-items" && (<react_1.Button variant="ghost" size="sm" leftIcon={<lu_1.LuArrowLeft />} onClick={handleBackToCompare}>
                  <macro_1.Trans>Back</macro_1.Trans>
                </react_1.Button>)}
              <react_1.VStack spacing={0} className="items-start">
                <react_1.DrawerTitle>
                  {step === "compare"
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Compare Supplier Quotes"], ["Compare Supplier Quotes"]))) : "Create Order from ".concat((_k = (_j = selectedQuote === null || selectedQuote === void 0 ? void 0 : selectedQuote.supplier) === null || _j === void 0 ? void 0 : _j.name) !== null && _k !== void 0 ? _k : selectedQuote === null || selectedQuote === void 0 ? void 0 : selectedQuote.supplierQuoteId)}
                </react_1.DrawerTitle>
                {step === "compare" && totalQuotes > 0 && (<span className="text-sm text-muted-foreground">
                    {submittedQuotes} out of {totalQuotes} submitted
                  </span>)}
              </react_1.VStack>
            </react_1.HStack>

            {/* Quantity tier selector in Step 1 */}
            {step === "compare" && quantityTiers.length > 1 && (<react_1.HStack>
                <span className="text-sm text-muted-foreground">
                  <macro_1.Trans>Compare at quantity:</macro_1.Trans>
                </span>
                <react_1.Select value={String(selectedQuantityTier !== null && selectedQuantityTier !== void 0 ? selectedQuantityTier : "")} onValueChange={function (value) {
                return setSelectedQuantityTier(Number(value));
            }}>
                  <react_1.SelectTrigger className="w-[120px]">
                    <react_1.SelectValue />
                  </react_1.SelectTrigger>
                  <react_1.SelectContent>
                    {quantityTiers.map(function (qty) { return (<react_1.SelectItem key={qty} value={String(qty)}>
                        {qty}
                      </react_1.SelectItem>); })}
                  </react_1.SelectContent>
                </react_1.Select>
              </react_1.HStack>)}
          </react_1.HStack>
        </react_1.DrawerHeader>

        <react_1.DrawerBody>
          {isLoading ? (<div className="flex w-full h-full items-center justify-center">
              <react_1.Spinner className="h-10 w-10"/>
            </div>) : quotes.length === 0 ? (<div className="flex w-full h-full items-center justify-center">
              <react_1.VStack spacing={2} className="text-center">
                <react_1.Heading size="h4">
                  <macro_1.Trans>No Active Quotes</macro_1.Trans>
                </react_1.Heading>
                <p className="text-muted-foreground">
                  <macro_1.Trans>
                    There are no active supplier quotes to compare for this RFQ.
                  </macro_1.Trans>
                </p>
              </react_1.VStack>
            </div>) : step === "compare" ? (<ComparisonView quotes={quotes} lines={lines} prices={prices} selectedQuoteId={selectedQuoteId} selectedQuantityTier={selectedQuantityTier} onQuoteSelect={handleQuoteSelect} formatter={formatter}/>) : (<LineSelectionView quote={selectedQuote} lines={selectedQuoteLines} prices={selectedQuotePrices} selectedLines={selectedLines} setSelectedLines={setSelectedLines} formatter={formatter}/>)}
        </react_1.DrawerBody>

        <react_1.DrawerFooter>
          <react_1.HStack className="w-full justify-between">
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>

            {step === "compare" ? (<react_1.Button onClick={handleProceedToSelectItems} isDisabled={!selectedQuoteId}>
                Select Items →
              </react_1.Button>) : (<react_router_1.Form action={path_1.path.to.convertSupplierQuoteToOrder(selectedQuoteId)} method="post">
                <input type="hidden" name="selectedLines" value={JSON.stringify(selectedLines)}/>
                <react_1.Button type="submit" isDisabled={isSubmitting || Object.keys(selectedLines).length === 0} isLoading={isSubmitting}>
                  Create Order ({formatter.format(orderTotal)})
                </react_1.Button>
              </react_router_1.Form>)}
          </react_1.HStack>
        </react_1.DrawerFooter>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = SupplierQuoteCompareDrawer;
var ComparisonView = function (_a) {
    var quotes = _a.quotes, lines = _a.lines, prices = _a.prices, selectedQuoteId = _a.selectedQuoteId, selectedQuantityTier = _a.selectedQuantityTier, onQuoteSelect = _a.onQuoteSelect, formatter = _a.formatter;
    // Group lines and prices by quote, filtered by selected quantity tier
    var quoteData = (0, react_2.useMemo)(function () {
        return quotes.map(function (quote) {
            var _a, _b, _c;
            var quoteLines = lines.filter(function (l) { return l.supplierQuoteId === quote.id; });
            var quotePrices = prices.filter(function (p) { return p.supplierQuoteId === quote.id; });
            // Calculate quote total for selected quantity tier
            var total = 0;
            var minLeadTime = Infinity;
            var maxLeadTime = 0;
            var hasMatchingTier = false;
            var _loop_1 = function (line) {
                // Find price matching selected quantity tier, or closest available
                var linePrices = quotePrices.filter(function (p) { return p.supplierQuoteLineId === line.id; });
                var matchingPrice = selectedQuantityTier
                    ? linePrices.find(function (p) { return p.quantity === selectedQuantityTier; })
                    : linePrices[0];
                if (matchingPrice) {
                    hasMatchingTier = true;
                    total +=
                        ((_a = matchingPrice.supplierUnitPrice) !== null && _a !== void 0 ? _a : 0) * matchingPrice.quantity +
                            ((_b = matchingPrice.supplierShippingCost) !== null && _b !== void 0 ? _b : 0) +
                            ((_c = matchingPrice.supplierTaxAmount) !== null && _c !== void 0 ? _c : 0);
                    if (matchingPrice.leadTime !== null &&
                        matchingPrice.leadTime !== undefined) {
                        minLeadTime = Math.min(minLeadTime, matchingPrice.leadTime);
                        maxLeadTime = Math.max(maxLeadTime, matchingPrice.leadTime);
                    }
                }
            };
            for (var _i = 0, quoteLines_1 = quoteLines; _i < quoteLines_1.length; _i++) {
                var line = quoteLines_1[_i];
                _loop_1(line);
            }
            return {
                quote: quote,
                lines: quoteLines,
                prices: quotePrices,
                total: total,
                hasMatchingTier: hasMatchingTier,
                leadTimeRange: minLeadTime === Infinity
                    ? null
                    : minLeadTime === maxLeadTime
                        ? "".concat(minLeadTime, " ").concat((0, utils_1.pluralize)(minLeadTime, "day"))
                        : "".concat(minLeadTime, "-").concat(maxLeadTime, " days")
            };
        });
    }, [quotes, lines, prices, selectedQuantityTier]);
    // Find best total for highlighting
    var bestTotal = (0, react_2.useMemo)(function () {
        var totals = quoteData
            .filter(function (q) { return q.hasMatchingTier; })
            .map(function (q) { return q.total; })
            .filter(function (t) { return t > 0; });
        return totals.length > 0 ? Math.min.apply(Math, totals) : null;
    }, [quoteData]);
    // Get unique items across all quotes for the comparison matrix
    var uniqueItems = (0, react_2.useMemo)(function () {
        var _a;
        var itemMap = new Map();
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.itemReadableId && !itemMap.has(line.itemReadableId)) {
                itemMap.set(line.itemReadableId, {
                    itemReadableId: line.itemReadableId,
                    description: (_a = line.description) !== null && _a !== void 0 ? _a : ""
                });
            }
        }
        return Array.from(itemMap.values());
    }, [lines]);
    return (<react_1.ScrollArea className="h-[calc(100dvh-180px)]">
      <react_1.VStack spacing={8}>
        {/* Quote Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          <react_1.RadioGroup value={selectedQuoteId !== null && selectedQuoteId !== void 0 ? selectedQuoteId : ""} onValueChange={onQuoteSelect} className="contents">
            {quoteData.map(function (_a) {
            var _b, _c;
            var quote = _a.quote, total = _a.total, leadTimeRange = _a.leadTimeRange, hasMatchingTier = _a.hasMatchingTier;
            return (<label key={quote.id} htmlFor={"quote-".concat(quote.id)} className={(0, react_1.cn)("relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all", selectedQuoteId === quote.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50", !hasMatchingTier && "opacity-50")}>
                  <div className="absolute top-3 right-3">
                    <react_1.RadioGroupItem value={quote.id} id={"quote-".concat(quote.id)}/>
                  </div>

                  <react_1.VStack spacing={2} className="items-start">
                    <div>
                      <react_1.Heading size="h4">
                        {(_c = (_b = quote.supplier) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "Unknown Supplier"}
                      </react_1.Heading>
                      <span className="text-sm text-muted-foreground">
                        {quote.supplierQuoteId}
                      </span>
                    </div>

                    <react_1.Badge variant="secondary">{quote.status}</react_1.Badge>

                    <div className="w-full pt-2 border-t space-y-1">
                      <react_1.HStack className="justify-between">
                        <span className="text-sm text-muted-foreground">
                          <macro_1.Trans>Total:</macro_1.Trans>
                        </span>
                        <react_1.HStack spacing={1}>
                          {total === bestTotal && total > 0 && (<lu_1.LuStar className="h-4 w-4 text-yellow-500 fill-yellow-500"/>)}
                          <span className={(0, react_1.cn)("font-semibold", total === bestTotal &&
                    total > 0 &&
                    "text-green-600")}>
                            {hasMatchingTier ? formatter.format(total) : "N/A"}
                          </span>
                        </react_1.HStack>
                      </react_1.HStack>

                      {leadTimeRange && (<react_1.HStack className="justify-between">
                          <span className="text-sm text-muted-foreground">
                            <macro_1.Trans>Lead Time:</macro_1.Trans>
                          </span>
                          <span className="text-sm">{leadTimeRange}</span>
                        </react_1.HStack>)}

                      {!hasMatchingTier && (<span className="text-xs text-amber-600">
                          <macro_1.Trans>No pricing for selected quantity</macro_1.Trans>
                        </span>)}
                    </div>
                  </react_1.VStack>
                </label>);
        })}
          </react_1.RadioGroup>
        </div>

        {/* Line Item Comparison Matrix */}
        {uniqueItems.length > 0 && (<react_1.VStack spacing={2} className="w-full">
            <react_1.Heading size="h4" className="self-start">
              <macro_1.Trans>Line Item Comparison</macro_1.Trans>
            </react_1.Heading>

            <div className="w-full overflow-x-auto border border-border rounded-md">
              <react_1.Table>
                <react_1.Thead>
                  <react_1.Tr>
                    <react_1.Th className="min-w-[150px]">
                      <macro_1.Trans>Item</macro_1.Trans>
                    </react_1.Th>
                    {quotes.map(function (quote) {
                var _a, _b;
                return (<react_1.Th key={quote.id} className="min-w-[180px] text-center">
                        {(_b = (_a = quote.supplier) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Unknown"}
                      </react_1.Th>);
            })}
                  </react_1.Tr>
                </react_1.Thead>
                <react_1.Tbody>
                  {uniqueItems.map(function (item) {
                // Find best price for this item at selected quantity tier
                var itemPrices = quotes.map(function (quote) {
                    var _a;
                    var quoteLine = lines.find(function (l) {
                        return l.supplierQuoteId === quote.id &&
                            l.itemReadableId === item.itemReadableId;
                    });
                    if (!quoteLine)
                        return null;
                    var linePrices = prices.filter(function (p) { return p.supplierQuoteLineId === quoteLine.id; });
                    var matchingPrice = selectedQuantityTier
                        ? linePrices.find(function (p) { return p.quantity === selectedQuantityTier; })
                        : linePrices[0];
                    return (_a = matchingPrice === null || matchingPrice === void 0 ? void 0 : matchingPrice.supplierUnitPrice) !== null && _a !== void 0 ? _a : null;
                });
                var validPrices = itemPrices.filter(function (p) { return p !== null && p > 0; });
                var bestPrice = validPrices.length > 0 ? Math.min.apply(Math, validPrices) : null;
                return (<react_1.Tr key={item.itemReadableId}>
                        <react_1.Td>
                          <react_1.VStack spacing={0} className="items-start">
                            <span className="font-medium">
                              {item.itemReadableId}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                              {item.description}
                            </span>
                          </react_1.VStack>
                        </react_1.Td>
                        {quotes.map(function (quote) {
                        var _a, _b, _c;
                        var quoteLine = lines.find(function (l) {
                            return l.supplierQuoteId === quote.id &&
                                l.itemReadableId === item.itemReadableId;
                        });
                        if (!quoteLine) {
                            return (<react_1.Td key={quote.id} className="text-center">
                                <span className="text-muted-foreground">—</span>
                              </react_1.Td>);
                        }
                        var linePrices = prices.filter(function (p) { return p.supplierQuoteLineId === quoteLine.id; });
                        var linePrice = selectedQuantityTier
                            ? linePrices.find(function (p) { return p.quantity === selectedQuantityTier; })
                            : linePrices[0];
                        if (!linePrice) {
                            return (<react_1.Td key={quote.id} className="text-center">
                                <span className="text-muted-foreground text-xs">
                                  N/A
                                </span>
                              </react_1.Td>);
                        }
                        var isBest = linePrice.supplierUnitPrice === bestPrice &&
                            bestPrice !== null;
                        return (<react_1.Td key={quote.id} className="text-center">
                              <react_1.VStack spacing={0}>
                                <react_1.HStack spacing={1} className="justify-center">
                                  {isBest && (<lu_1.LuStar className="h-3 w-3 text-yellow-500 fill-yellow-500"/>)}
                                  <span className={(0, react_1.cn)("font-medium", isBest && "text-green-600")}>
                                    {formatter.format((_a = linePrice.supplierUnitPrice) !== null && _a !== void 0 ? _a : 0)}
                                    /ea
                                  </span>
                                </react_1.HStack>
                                <span className="text-xs text-muted-foreground">
                                  {(_b = linePrice.leadTime) !== null && _b !== void 0 ? _b : 0}{" "}
                                  {(0, utils_1.pluralize)((_c = linePrice.leadTime) !== null && _c !== void 0 ? _c : 0, "day")}
                                </span>
                              </react_1.VStack>
                            </react_1.Td>);
                    })}
                      </react_1.Tr>);
            })}
                </react_1.Tbody>
              </react_1.Table>
            </div>
          </react_1.VStack>)}
      </react_1.VStack>
    </react_1.ScrollArea>);
};
var LineSelectionView = function (_a) {
    var lines = _a.lines, prices = _a.prices, selectedLines = _a.selectedLines, setSelectedLines = _a.setSelectedLines, formatter = _a.formatter;
    var pricingByLine = (0, react_2.useMemo)(function () {
        return lines.reduce(function (acc, line) {
            acc[line.id] = prices.filter(function (p) { return p.supplierQuoteLineId === line.id; });
            return acc;
        }, {});
    }, [lines, prices]);
    return (<react_1.ScrollArea className="h-[calc(100dvh-180px)]">
      <react_1.VStack spacing={8}>
        {lines.map(function (line) {
            var _a;
            return (<react_1.VStack key={line.id}>
            <react_1.HStack spacing={2} className="items-start">
              {line.thumbnailPath ? (<img alt={line.itemReadableId} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(0, path_1.getPrivateUrl)(line.thumbnailPath)}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0}>
                <react_1.Heading>{line.itemReadableId}</react_1.Heading>
                <span className="text-muted-foreground text-base truncate">
                  {line.description}
                </span>
              </react_1.VStack>
            </react_1.HStack>

            <LinePricingOptions line={line} options={(_a = pricingByLine[line.id]) !== null && _a !== void 0 ? _a : []} formatter={formatter} selectedLines={selectedLines} setSelectedLines={setSelectedLines}/>
          </react_1.VStack>);
        })}
      </react_1.VStack>
    </react_1.ScrollArea>);
};
var LinePricingOptions = function (_a) {
    var _b, _c, _d;
    var line = _a.line, options = _a.options, formatter = _a.formatter, selectedLines = _a.selectedLines, setSelectedLines = _a.setSelectedLines;
    var selectedValue = (_d = (_c = (_b = selectedLines[line.id]) === null || _b === void 0 ? void 0 : _b.quantity) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "";
    return (<react_1.RadioGroup className="w-full" value={selectedValue} onValueChange={function (value) {
            var selectedOption = options.find(function (opt) { return opt.quantity.toString() === value; });
            if (selectedOption) {
                setSelectedLines(function (prev) {
                    var _a;
                    var _b, _c, _d, _e, _f, _g;
                    return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = {
                        quantity: selectedOption.quantity,
                        unitPrice: (_b = selectedOption.unitPrice) !== null && _b !== void 0 ? _b : 0,
                        supplierUnitPrice: (_c = selectedOption.supplierUnitPrice) !== null && _c !== void 0 ? _c : 0,
                        supplierShippingCost: (_d = selectedOption.supplierShippingCost) !== null && _d !== void 0 ? _d : 0,
                        shippingCost: (_e = selectedOption.shippingCost) !== null && _e !== void 0 ? _e : 0,
                        leadTime: (_f = selectedOption.leadTime) !== null && _f !== void 0 ? _f : 0,
                        supplierTaxAmount: (_g = selectedOption.supplierTaxAmount) !== null && _g !== void 0 ? _g : 0
                    }, _a)));
                });
            }
        }}>
      <div className="w-full border border-border rounded-md overflow-hidden">
        <react_1.Table className=" w-full ">
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
                <react_1.Td colSpan={7} className="text-center py-8">
                  <macro_1.Trans>No pricing options found</macro_1.Trans>
                </react_1.Td>
              </react_1.Tr>) : (options.map(function (option) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return (<react_1.Tr key={option.quantity}>
                  <react_1.Td>
                    <react_1.RadioGroupItem value={option.quantity.toString()} id={"".concat(line.id, ":").concat(option.quantity.toString())}/>
                    <label htmlFor={"".concat(line.id, ":").concat(option.quantity.toString())} className="sr-only">
                      {option.quantity}
                    </label>
                  </react_1.Td>
                  <react_1.Td>{option.quantity}</react_1.Td>
                  <react_1.Td>{formatter.format((_a = option.supplierUnitPrice) !== null && _a !== void 0 ? _a : 0)}</react_1.Td>
                  <react_1.Td>{formatter.format((_b = option.supplierShippingCost) !== null && _b !== void 0 ? _b : 0)}</react_1.Td>
                  <react_1.Td>
                    {(_c = option.leadTime) !== null && _c !== void 0 ? _c : 0}{" "}
                    {(0, utils_1.pluralize)((_d = option.leadTime) !== null && _d !== void 0 ? _d : 0, "day")}
                  </react_1.Td>
                  <react_1.Td>{formatter.format((_e = option.supplierTaxAmount) !== null && _e !== void 0 ? _e : 0)}</react_1.Td>
                  <react_1.Td>
                    {formatter.format(((_f = option.supplierUnitPrice) !== null && _f !== void 0 ? _f : 0) * option.quantity +
                    ((_g = option.supplierShippingCost) !== null && _g !== void 0 ? _g : 0) +
                    ((_h = option.supplierTaxAmount) !== null && _h !== void 0 ? _h : 0))}
                  </react_1.Td>
                </react_1.Tr>);
        }))}
          </react_1.Tbody>
        </react_1.Table>
      </div>
    </react_1.RadioGroup>);
};
var templateObject_1;
