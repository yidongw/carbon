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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var Carousel_1 = require("@carbon/react/Carousel");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var customers_1 = require("~/stores/customers");
var path_1 = require("~/utils/path");
var QuoteLinePricingHistory = function (_a) {
    var baseCurrency = _a.baseCurrency, relatedSalesOrderLines = _a.relatedSalesOrderLines, historicalQuoteLinePrices = _a.historicalQuoteLinePrices;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var historicalQuoteLines = historicalQuoteLinePrices.reduce(function (acc, linePrice) {
        if (!acc[linePrice.id]) {
            acc[linePrice.id] = __assign(__assign({}, linePrice), { quantities: {} });
        }
        if (linePrice.qty && linePrice.unitPrice) {
            acc[linePrice.id].quantities[linePrice.qty] = linePrice.unitPrice;
        }
        return acc;
    }, {});
    var orderLineCount = relatedSalesOrderLines.length;
    var quoteLineCount = Object.keys(historicalQuoteLines).length;
    var hasOrderLines = orderLineCount > 0;
    var hasQuoteLines = quoteLineCount > 0;
    var hasBothTypes = hasOrderLines && hasQuoteLines;
    // Default to the tab that has items
    var defaultTab = hasOrderLines ? "salesOrderLines" : "quoteLines";
    var customers = (0, customers_1.useCustomers)()[0];
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>History</macro_1.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          {orderLineCount > 0 || quoteLineCount > 0 ? (<span className="text-sm text-muted-foreground">
              {orderLineCount > 0 &&
                "".concat(orderLineCount, " order").concat(orderLineCount !== 1 ? "s" : "")}
              {orderLineCount > 0 && quoteLineCount > 0 && " and "}
              {quoteLineCount > 0 &&
                "".concat(quoteLineCount, " quote").concat(quoteLineCount !== 1 ? "s" : "")}
            </span>) : (<span className="text-sm text-muted-foreground">
              No pricing history available
            </span>)}
        </react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        <div className="w-full">
          <react_1.Tabs defaultValue={defaultTab} className="w-full">
            {hasBothTypes && (<react_1.TabsList className="mb-4">
                <react_1.TabsTrigger value="salesOrderLines">
                  <macro_1.Trans>Orders</macro_1.Trans>
                </react_1.TabsTrigger>
                <react_1.TabsTrigger value="quoteLines">
                  <macro_1.Trans>Quotes</macro_1.Trans>
                </react_1.TabsTrigger>
              </react_1.TabsList>)}
            <react_1.TabsContent value="salesOrderLines">
              <div className="flex overflow-x-auto space-x-4 pb-4 w-full">
                {!hasOrderLines && <components_1.Empty className="py-6"/>}
                {hasOrderLines && (<Carousel_1.Carousel className="w-full">
                    <Carousel_1.CarouselContent className="-ml-4">
                      {relatedSalesOrderLines.map(function (line) {
                var _a, _b;
                return (<Carousel_1.CarouselItem key={line.id} className="pl-4 basis-full lg:basis-1/2">
                          <react_1.Card className="w-full p-0 bg-gradient-to-b from-card to-card via-card dark:from-card dark:to-card dark:via-card">
                            <react_1.CardContent className="p-4">
                              <react_1.HStack className="flex justify-between">
                                <div className="flex flex-col gap-1">
                                  <react_router_1.Link to={path_1.path.to.salesOrderLine(line.salesOrderId, line.id)} className="text-sm font-medium hover:underline">
                                    {line.salesOrderReadableId}
                                  </react_router_1.Link>
                                  <span className="text-sm text-muted-foreground">
                                    {(_a = customers.find(function (customer) {
                        return customer.id === line.customerId;
                    })) === null || _a === void 0 ? void 0 : _a.name}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(line.orderDate)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {line.itemReadableId}
                                  </span>
                                </div>
                              </react_1.HStack>
                              <div className="my-4">
                                <react_1.Table>
                                  <react_1.Thead>
                                    <react_1.Tr className="border-b border-border">
                                      <react_1.Th>
                                        <span className="font-medium">
                                          Quantity
                                        </span>
                                      </react_1.Th>
                                      <react_1.Th>
                                        <span className="font-medium">
                                          Price
                                        </span>
                                      </react_1.Th>
                                    </react_1.Tr>
                                  </react_1.Thead>
                                  <react_1.Tbody>
                                    <react_1.Tr>
                                      <react_1.Td>{line.saleQuantity}</react_1.Td>
                                      <react_1.Td>
                                        {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: baseCurrency
                    }).format((_b = line.unitPrice) !== null && _b !== void 0 ? _b : 0)}
                                      </react_1.Td>
                                    </react_1.Tr>
                                  </react_1.Tbody>
                                </react_1.Table>
                              </div>
                            </react_1.CardContent>
                          </react_1.Card>
                        </Carousel_1.CarouselItem>);
            })}
                    </Carousel_1.CarouselContent>
                    {orderLineCount > 1 && (<div className="flex justify-between mt-4">
                        <Carousel_1.CarouselPrevious />
                        <Carousel_1.CarouselNext />
                      </div>)}
                  </Carousel_1.Carousel>)}
              </div>
            </react_1.TabsContent>
            <react_1.TabsContent value="quoteLines">
              <div className="flex overflow-x-auto space-x-4 pb-4 w-full">
                {!hasQuoteLines && <components_1.Empty className="py-6"/>}
                {hasQuoteLines && (<Carousel_1.Carousel className="w-full">
                    <Carousel_1.CarouselContent className="-ml-4">
                      {Object.values(historicalQuoteLines).map(function (line) {
                var _a;
                return (<Carousel_1.CarouselItem key={line.id} className="pl-4 basis-full lg:basis-1/2">
                          <react_1.Card className="w-full p-0 bg-gradient-to-b from-card to-card via-card dark:from-card dark:to-card dark:via-card">
                            <react_1.CardContent className="p-4">
                              <div className="flex flex-col gap-4">
                                <react_1.HStack className="flex justify-between">
                                  <div className="flex flex-col gap-1">
                                    <react_router_1.Link to={path_1.path.to.quoteLine(line.quoteId, line.id)} className="text-sm font-medium hover:underline">
                                      {line.quoteReadableId}
                                    </react_router_1.Link>

                                    <span className="text-sm text-muted-foreground">
                                      {(_a = customers.find(function (customer) {
                        return customer.id === line.customerId;
                    })) === null || _a === void 0 ? void 0 : _a.name}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1 items-end">
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(line.quoteCreatedAt)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {line.itemReadableId}
                                    </span>
                                  </div>
                                </react_1.HStack>
                              </div>

                              <div className="my-4">
                                <react_1.Table>
                                  <react_1.Thead>
                                    <react_1.Tr>
                                      <react_1.Th>
                                        <span className="font-medium">
                                          Quantity
                                        </span>
                                      </react_1.Th>
                                      <react_1.Th>
                                        <span className="font-medium">
                                          Price
                                        </span>
                                      </react_1.Th>
                                    </react_1.Tr>
                                  </react_1.Thead>
                                  <react_1.Tbody>
                                    {Object.entries(line.quantities).map(function (_a) {
                        var quantity = _a[0], price = _a[1];
                        return (<react_1.Tr key={quantity}>
                                          <react_1.Td>{quantity}</react_1.Td>
                                          <react_1.Td>
                                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: baseCurrency
                            }).format(price)}
                                          </react_1.Td>
                                        </react_1.Tr>);
                    })}
                                  </react_1.Tbody>
                                </react_1.Table>
                              </div>
                            </react_1.CardContent>
                          </react_1.Card>
                        </Carousel_1.CarouselItem>);
            })}
                    </Carousel_1.CarouselContent>
                    {quoteLineCount > 1 && (<div className="flex justify-between mt-4">
                        <Carousel_1.CarouselPrevious />
                        <Carousel_1.CarouselNext />
                      </div>)}
                  </Carousel_1.Carousel>)}
              </div>
            </react_1.TabsContent>
          </react_1.Tabs>
        </div>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = QuoteLinePricingHistory;
