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
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var framer_motion_1 = require("framer-motion");
var motion_number_1 = require("motion-number");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var JobStatus_1 = require("~/modules/production/ui/Jobs/JobStatus");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var SalesOrderLineJobs_1 = require("./SalesOrderLineJobs");
var SalesOrderSummary = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19;
    var onEditShippingCost = _a.onEditShippingCost;
    var t = (0, macro_1.useLingui)().t;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesOrder(orderId));
    var salesOrderToJobsModal = (0, react_1.useDisclosure)();
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, react_2.useMemo)(function () {
        var _a, _b;
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _a === void 0 ? void 0 : _a.currencyCode) !== null && _b !== void 0 ? _b : "USD"
        });
    }, [locale, (_b = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _b === void 0 ? void 0 : _b.currencyCode]);
    var isEditable = !(0, sales_models_1.isSalesOrderLocked)((_c = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _c === void 0 ? void 0 : _c.status);
    // Calculate totals
    var subtotal = (_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _d === void 0 ? void 0 : _d.reduce(function (acc, line) {
        var _a, _b, _c, _d, _e;
        var lineTotal = ((_a = line.convertedUnitPrice) !== null && _a !== void 0 ? _a : 0) * ((_b = line.saleQuantity) !== null && _b !== void 0 ? _b : 0);
        var addOns = ((_c = line.convertedAddOnCost) !== null && _c !== void 0 ? _c : 0) +
            ((_d = line.convertedNonTaxableAddOnCost) !== null && _d !== void 0 ? _d : 0) +
            ((_e = line.convertedShippingCost) !== null && _e !== void 0 ? _e : 0);
        return acc + lineTotal + addOns;
    }, 0)) !== null && _e !== void 0 ? _e : 0;
    var tax = (_g = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _f === void 0 ? void 0 : _f.reduce(function (acc, line) {
        var _a, _b, _c, _d, _e;
        var lineTotal = ((_a = line.convertedUnitPrice) !== null && _a !== void 0 ? _a : 0) * ((_b = line.saleQuantity) !== null && _b !== void 0 ? _b : 0);
        var taxableAddOns = ((_c = line.convertedAddOnCost) !== null && _c !== void 0 ? _c : 0) + ((_d = line.convertedShippingCost) !== null && _d !== void 0 ? _d : 0);
        return acc + (lineTotal + taxableAddOns) * ((_e = line.taxPercent) !== null && _e !== void 0 ? _e : 0);
    }, 0)) !== null && _g !== void 0 ? _g : 0;
    var convertedShippingCost = ((_j = (_h = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _h === void 0 ? void 0 : _h.exchangeRate) !== null && _j !== void 0 ? _j : 1) *
        ((_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _k === void 0 ? void 0 : _k.shippingCost) !== null && _l !== void 0 ? _l : 0);
    var total = subtotal + tax + convertedShippingCost;
    var permissions = (0, hooks_1.usePermissions)();
    // Check if there are any lines with "Make" method type that would require jobs
    var hasMakeItems = (_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _m === void 0 ? void 0 : _m.some(function (line) { return line.methodType === "Make to Order"; })) !== null && _o !== void 0 ? _o : false;
    return (<>
      {["To Ship and Invoice", "To Ship"].includes((_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _p === void 0 ? void 0 : _p.status) !== null && _q !== void 0 ? _q : "") &&
            permissions.can("create", "production") &&
            permissions.is("employee") &&
            !((_r = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _r === void 0 ? void 0 : _r.jobs) &&
            hasMakeItems && (<react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex flex-row gap-2">
                <lu_1.LuTriangleAlert /> <macro_1.Trans>Jobs Required</macro_1.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_1.Trans>
                  This sales order has lines that require jobs to be created
                </macro_1.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardFooter>
              <react_1.Button variant="primary" onClick={salesOrderToJobsModal.onOpen}>
                <macro_1.Trans>Create Jobs</macro_1.Trans>
              </react_1.Button>
            </react_1.CardFooter>
            {salesOrderToJobsModal.isOpen && (<Modals_1.Confirm title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Convert Lines to Jobs"], ["Convert Lines to Jobs"])))} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to create jobs for this sales order? This will create jobs for all lines that don't already have jobs."], ["Are you sure you want to create jobs for this sales order? This will create jobs for all lines that don't already have jobs."])))} confirmText={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Create Jobs"], ["Create Jobs"])))} onCancel={salesOrderToJobsModal.onClose} onSubmit={salesOrderToJobsModal.onClose} action={path_1.path.to.salesOrderLinesToJobs(orderId)}/>)}
          </react_1.Card>)}
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.HStack className="justify-between items-center">
            <div className="flex flex-col gap-1">
              <react_1.CardTitle>{routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder.salesOrderId}</react_1.CardTitle>
              <react_1.CardDescription>
                <macro_1.Trans>Sales Order</macro_1.Trans>
              </react_1.CardDescription>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <components_1.CustomerAvatar customerId={(_s = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder.customerId) !== null && _s !== void 0 ? _s : null}/>
              {((_t = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _t === void 0 ? void 0 : _t.orderDate) && (<span className="text-muted-foreground text-sm">
                  <macro_1.Trans>Ordered</macro_1.Trans>{" "}
                  {formatDate(routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder.orderDate)}
                </span>)}
              {((_u = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _u === void 0 ? void 0 : _u.digitalQuoteAcceptedBy) && (<span className="text-muted-foreground text-sm flex flex-row items-center gap-x-1">
                  <macro_1.Trans>via Digital Quote</macro_1.Trans>
                  <react_1.Tooltip>
                    <react_1.TooltipTrigger>
                      <lu_1.LuInfo className="size-4"/>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>
                      <div className="flex flex-col gap-y-0">
                        <span>{(_v = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _v === void 0 ? void 0 : _v.digitalQuoteAcceptedBy}</span>
                        <span>
                          {(_w = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _w === void 0 ? void 0 : _w.digitalQuoteAcceptedByEmail}
                        </span>
                      </div>
                    </react_1.TooltipContent>
                  </react_1.Tooltip>
                </span>)}
            </div>
          </react_1.HStack>
        </react_1.CardHeader>
        <react_1.CardContent>
          <LineItems salesOrder={routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder} currencyCode={(_y = (_x = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _x === void 0 ? void 0 : _x.currencyCode) !== null && _y !== void 0 ? _y : "USD"} locale={locale} formatter={formatter} lines={(_z = routeData === null || routeData === void 0 ? void 0 : routeData.lines) !== null && _z !== void 0 ? _z : []}/>

          <react_1.VStack spacing={2} className="mt-8">
            <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
              <span>
                <macro_1.Trans>Subtotal:</macro_1.Trans>
              </span>
              <motion_number_1.default value={subtotal} format={{
            style: "currency",
            currency: (_1 = (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _0 === void 0 ? void 0 : _0.currencyCode) !== null && _1 !== void 0 ? _1 : "USD"
        }} locales={locale}/>
            </react_1.HStack>
            <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
              <span>
                <macro_1.Trans>Tax:</macro_1.Trans>
              </span>
              <motion_number_1.default value={tax} format={{
            style: "currency",
            currency: (_3 = (_2 = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _2 === void 0 ? void 0 : _2.currencyCode) !== null && _3 !== void 0 ? _3 : "USD"
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
                currency: (_4 = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder.currencyCode) !== null && _4 !== void 0 ? _4 : "USD"
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
            currency: (_6 = (_5 = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _5 === void 0 ? void 0 : _5.currencyCode) !== null && _6 !== void 0 ? _6 : "USD"
        }} locales={locale}/>
            </react_1.HStack>
            <div className="h-px bg-border my-2 w-full"/>
            <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
              <span>
                <macro_1.Trans>Invoiced Amount:</macro_1.Trans>
              </span>
              <motion_number_1.default value={(_8 = (_7 = routeData === null || routeData === void 0 ? void 0 : routeData.invoiceSummary) === null || _7 === void 0 ? void 0 : _7.invoicedAmount) !== null && _8 !== void 0 ? _8 : 0} format={{
            style: "currency",
            currency: (_10 = (_9 = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _9 === void 0 ? void 0 : _9.currencyCode) !== null && _10 !== void 0 ? _10 : "USD"
        }} locales={locale}/>
            </react_1.HStack>
            <react_1.HStack className="justify-between text-base text-muted-foreground w-full">
              <span>
                <macro_1.Trans>Paid Amount:</macro_1.Trans>
              </span>
              <motion_number_1.default value={(_12 = (_11 = routeData === null || routeData === void 0 ? void 0 : routeData.invoiceSummary) === null || _11 === void 0 ? void 0 : _11.paidAmount) !== null && _12 !== void 0 ? _12 : 0} format={{
            style: "currency",
            currency: (_14 = (_13 = routeData === null || routeData === void 0 ? void 0 : routeData.salesOrder) === null || _13 === void 0 ? void 0 : _13.currencyCode) !== null && _14 !== void 0 ? _14 : "USD"
        }} locales={locale}/>
            </react_1.HStack>
            {((_16 = (_15 = routeData === null || routeData === void 0 ? void 0 : routeData.invoiceSummary) === null || _15 === void 0 ? void 0 : _15.currencyMismatchCount) !== null && _16 !== void 0 ? _16 : 0) > 0 && (<span className="text-xs text-muted-foreground">
                <macro_1.Trans>
                  Excludes {(_17 = routeData === null || routeData === void 0 ? void 0 : routeData.invoiceSummary) === null || _17 === void 0 ? void 0 : _17.currencyMismatchCount}{" "}
                  invoice
                  {((_19 = (_18 = routeData === null || routeData === void 0 ? void 0 : routeData.invoiceSummary) === null || _18 === void 0 ? void 0 : _18.currencyMismatchCount) !== null && _19 !== void 0 ? _19 : 0) > 1
                ? "s"
                : ""}{" "}
                  in a different currency.
                </macro_1.Trans>
              </span>)}
          </react_1.VStack>
        </react_1.CardContent>
      </react_1.Card>
    </>);
};
function LineItems(_a) {
    var currencyCode = _a.currencyCode, locale = _a.locale, formatter = _a.formatter, lines = _a.lines, salesOrder = _a.salesOrder;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var _b = (0, react_2.useState)([]), openItems = _b[0], setOpenItems = _b[1];
    var todaysDate = (0, react_2.useMemo)(function () { return (0, date_1.today)((0, date_1.getLocalTimeZone)()); }, []);
    var toggleOpen = function (id) {
        setOpenItems(function (prev) { var _a; return prev.includes(id) ? (_a = prev.filter) === null || _a === void 0 ? void 0 : _a.call(prev, function (item) { return item !== id; }) : __spreadArray(__spreadArray([], prev, true), [id], false); });
    };
    return (<react_1.VStack spacing={8} className="w-full overflow-hidden">
      {lines.map(function (line) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
            if (!line.id)
                return null;
            var isMade = line.methodType === "Make to Order";
            var _10 = (0, utils_1.getSalesOrderJobStatus)(
            // @ts-expect-error TS2345 - TODO: fix type
            salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.jobs, line), jobLabel = _10.jobLabel, jobVariant = _10.jobVariant, jobs = _10.jobs;
            return (<framer_motion_1.motion.div key={line.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-input py-6 w-full">
            <react_1.HStack spacing={4} className="items-start">
              {line.thumbnailPath ? (<img alt={line.itemReadableId} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(0, path_1.getPrivateUrl)(line.thumbnailPath)}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0} className="w-full">
                <div className="flex flex-col cursor-pointer w-full" onClick={function () { return toggleOpen(line.id); }}>
                  <div className="flex items-center justify-between w-full">
                    <react_1.VStack spacing={0} className="flex-shrink-0 min-w-0 w-auto">
                      <react_1.HStack spacing={2} className="flex min-w-0 flex-shrink-0">
                        <react_1.Heading className="truncate">
                          {line.salesOrderLineType === "Fixed Asset"
                    ? line.assetReadableId || "Fixed Asset"
                    : line.itemReadableId}
                        </react_1.Heading>
                        <react_1.Button asChild variant="link" size="sm" className="text-muted-foreground flex-shrink-0">
                          <react_router_1.Link to={path_1.path.to.salesOrderLine(orderId, line.id)}>
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
                        <motion_number_1.default className="font-bold text-xl whitespace-nowrap" value={(((_a = line === null || line === void 0 ? void 0 : line.convertedUnitPrice) !== null && _a !== void 0 ? _a : 0) *
                    ((_b = line === null || line === void 0 ? void 0 : line.saleQuantity) !== null && _b !== void 0 ? _b : 0) +
                    ((_c = line === null || line === void 0 ? void 0 : line.convertedAddOnCost) !== null && _c !== void 0 ? _c : 0) +
                    ((_d = line === null || line === void 0 ? void 0 : line.convertedShippingCost) !== null && _d !== void 0 ? _d : 0)) *
                    (1 + ((_e = line === null || line === void 0 ? void 0 : line.taxPercent) !== null && _e !== void 0 ? _e : 0)) +
                    ((_f = line === null || line === void 0 ? void 0 : line.convertedNonTaxableAddOnCost) !== null && _f !== void 0 ? _f : 0)} format={{
                    style: "currency",
                    currency: currencyCode
                }} locales={locale}/>
                        <framer_motion_1.motion.div animate={{
                    rotate: openItems.includes(line.id) ? 90 : 0
                }} transition={{ duration: 0.3 }}>
                          <lu_1.LuChevronRight size={24}/>
                        </framer_motion_1.motion.div>
                      </react_1.HStack>
                      <div className="flex items-center gap-2">
                        <react_1.Badge variant="outline" className="flex items-center gap-2">
                          {line.saleQuantity}
                          {line.salesOrderLineType !== "Fixed Asset" && (<components_1.MethodIcon type={(_g = line.methodType) !== null && _g !== void 0 ? _g : "Pull from Inventory"}/>)}
                        </react_1.Badge>
                        <react_1.Badge variant="green">
                          {formatter.format((_h = line.unitPrice) !== null && _h !== void 0 ? _h : 0)}{" "}
                          {line.unitOfMeasureCode}
                        </react_1.Badge>
                        {((_j = line.taxPercent) !== null && _j !== void 0 ? _j : 0) > 0 ? (<react_1.Badge variant="red">
                            <macro_1.Trans>
                              {percentFormatter.format((_k = line.taxPercent) !== null && _k !== void 0 ? _k : 0)}{" "}
                              Tax
                            </macro_1.Trans>
                          </react_1.Badge>) : null}
                      </div>
                    </react_1.VStack>
                  </div>

                  {isMade && (<div className="mt-2 flex flex-row items-end gap-x-2">
                      <react_1.Badge variant={jobVariant}>{jobLabel}</react_1.Badge>
                      {jobs.length > 0 && (<react_1.Tooltip>
                          <react_1.TooltipTrigger>
                            <react_1.Badge variant="secondary">
                              {jobs.length} <macro_1.Trans>Jobs</macro_1.Trans>
                              <lu_1.LuEllipsisVertical className="w-3 h-3 ml-2"/>
                            </react_1.Badge>
                          </react_1.TooltipTrigger>
                          <react_1.TooltipContent>
                            <div className="flex flex-col w-full gap-4 text-sm">
                              {jobs.map(function (job) {
                            var _a;
                            return (<div key={job.id} className="flex items-center justify-between gap-2">
                                  <components_1.Hyperlink to={path_1.path.to.jobDetails(job.id)} className="flex items-center justify-start gap-1 min-w-[200px]">
                                    {job.jobId}
                                  </components_1.Hyperlink>
                                  <react_1.HStack spacing={1}>
                                    <JobStatus_1.default status={job.status}/>
                                    {[
                                    "Draft",
                                    "Planned",
                                    "In Progress",
                                    "Ready",
                                    "Paused"
                                ].includes((_a = job.status) !== null && _a !== void 0 ? _a : "") && (<>
                                        {job.dueDate &&
                                        (0, date_1.isSameDay)((0, date_1.parseDate)(job.dueDate), todaysDate) && <JobStatus_1.default status="Due Today"/>}
                                        {job.dueDate &&
                                        (0, date_1.parseDate)(job.dueDate) <
                                            todaysDate && (<JobStatus_1.default status="Overdue"/>)}
                                      </>)}
                                  </react_1.HStack>
                                </div>);
                        })}
                            </div>
                          </react_1.TooltipContent>
                        </react_1.Tooltip>)}
                    </div>)}
                </div>
              </react_1.VStack>
            </react_1.HStack>

            <framer_motion_1.motion.div initial="collapsed" animate={openItems.includes(line.id) ? "open" : "collapsed"} variants={{
                    open: { opacity: 1, height: "auto", marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                }} transition={{ duration: 0.3 }} className="w-full overflow-hidden">
              <div className="flex flex-col gap-y-4 w-full">
                <react_1.Table>
                  <react_1.Tbody>
                    <react_1.Tr>
                      <react_1.Td>
                        <macro_1.Trans>Quantity</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">{line.saleQuantity}</react_1.Td>
                    </react_1.Tr>
                    <react_1.Tr>
                      <react_1.Td>
                        <macro_1.Trans>Unit Price</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <motion_number_1.default value={(_l = line.convertedUnitPrice) !== null && _l !== void 0 ? _l : 0} format={{ style: "currency", currency: currencyCode }} locales={locale}/>
                      </react_1.Td>
                    </react_1.Tr>
                    <react_1.Tr className="border-b border-border">
                      <react_1.Td>
                        <macro_1.Trans>Extended Price</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <motion_number_1.default value={((_m = line.convertedUnitPrice) !== null && _m !== void 0 ? _m : 0) *
                    ((_o = line.saleQuantity) !== null && _o !== void 0 ? _o : 0)} format={{ style: "currency", currency: currencyCode }} locales={locale}/>
                      </react_1.Td>
                    </react_1.Tr>

                    {Number((_p = line.addOnCost) !== null && _p !== void 0 ? _p : 0) > 0 && (<react_1.Tr>
                        <react_1.Td>
                          <macro_1.Trans>Additional Charges</macro_1.Trans>
                        </react_1.Td>
                        <react_1.Td className="text-right">
                          <motion_number_1.default value={(_q = line.addOnCost) !== null && _q !== void 0 ? _q : 0} format={{
                        style: "currency",
                        currency: currencyCode
                    }} locales={locale}/>
                        </react_1.Td>
                      </react_1.Tr>)}

                    {Number((_r = line.nonTaxableAddOnCost) !== null && _r !== void 0 ? _r : 0) > 0 && (<react_1.Tr>
                        <react_1.Td>
                          <macro_1.Trans>Non-Taxable Charges</macro_1.Trans>
                        </react_1.Td>
                        <react_1.Td className="text-right">
                          <motion_number_1.default value={(_s = line.nonTaxableAddOnCost) !== null && _s !== void 0 ? _s : 0} format={{
                        style: "currency",
                        currency: currencyCode
                    }} locales={locale}/>
                        </react_1.Td>
                      </react_1.Tr>)}

                    <react_1.Tr key="subtotal">
                      <react_1.Td>
                        <macro_1.Trans>Subtotal</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <motion_number_1.default value={((_t = line.convertedUnitPrice) !== null && _t !== void 0 ? _t : 0) *
                    ((_u = line.saleQuantity) !== null && _u !== void 0 ? _u : 0) +
                    ((_v = line.convertedAddOnCost) !== null && _v !== void 0 ? _v : 0) +
                    ((_w = line.convertedNonTaxableAddOnCost) !== null && _w !== void 0 ? _w : 0) +
                    ((_x = line.convertedShippingCost) !== null && _x !== void 0 ? _x : 0)} format={{
                    style: "currency",
                    currency: currencyCode
                }} locales={locale}/>
                      </react_1.Td>
                    </react_1.Tr>

                    <react_1.Tr key="tax" className="border-b border-border">
                      <react_1.Td>
                        <macro_1.Trans>
                          Tax ({percentFormatter.format((_y = line.taxPercent) !== null && _y !== void 0 ? _y : 0)})
                        </macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <motion_number_1.default value={(((_z = line.convertedUnitPrice) !== null && _z !== void 0 ? _z : 0) *
                    ((_0 = line.saleQuantity) !== null && _0 !== void 0 ? _0 : 0) +
                    ((_1 = line.convertedAddOnCost) !== null && _1 !== void 0 ? _1 : 0) +
                    ((_2 = line.convertedShippingCost) !== null && _2 !== void 0 ? _2 : 0)) *
                    ((_3 = line.taxPercent) !== null && _3 !== void 0 ? _3 : 0)} format={{
                    style: "currency",
                    currency: currencyCode
                }} locales={locale}/>
                      </react_1.Td>
                    </react_1.Tr>

                    <react_1.Tr key="total" className="font-bold">
                      <react_1.Td>
                        <macro_1.Trans>Total</macro_1.Trans>
                      </react_1.Td>
                      <react_1.Td className="text-right">
                        <motion_number_1.default value={(((_4 = line.convertedUnitPrice) !== null && _4 !== void 0 ? _4 : 0) *
                    ((_5 = line.saleQuantity) !== null && _5 !== void 0 ? _5 : 0) +
                    ((_6 = line.convertedAddOnCost) !== null && _6 !== void 0 ? _6 : 0) +
                    ((_7 = line.convertedShippingCost) !== null && _7 !== void 0 ? _7 : 0)) *
                    (1 + ((_8 = line.taxPercent) !== null && _8 !== void 0 ? _8 : 0)) +
                    ((_9 = line.convertedNonTaxableAddOnCost) !== null && _9 !== void 0 ? _9 : 0)} format={{
                    style: "currency",
                    currency: currencyCode
                }} locales={locale}/>
                      </react_1.Td>
                    </react_1.Tr>
                  </react_1.Tbody>
                </react_1.Table>

                {isMade && jobs.length > 0 && (<div className="border rounded-lg">
                    {jobs
                        .sort(function (a, b) { var _a, _b; return ((_a = a.jobId) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.jobId) !== null && _b !== void 0 ? _b : ""); })
                        .map(function (job, index) { return (<div key={job.id} className={(0, react_1.cn)("border-b p-6", index === jobs.length - 1 && "border-b-0")}>
                          {/* @ts-expect-error TS2739 */}
                          <SalesOrderLineJobs_1.SalesOrderJobItem job={job}/>
                        </div>); })}
                  </div>)}
              </div>
            </framer_motion_1.motion.div>
          </framer_motion_1.motion.div>);
        })}
    </react_1.VStack>);
}
exports.default = SalesOrderSummary;
var templateObject_1, templateObject_2, templateObject_3;
