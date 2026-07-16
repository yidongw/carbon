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
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
function getSupplierInteractionIcon(state) {
    switch (state) {
        case "RFQ":
            return ri_1.RiProgress2Line;
        case "Quote":
            return ri_1.RiProgress4Line;
        case "Order":
            return ri_1.RiProgress8Line;
        case "Invoice":
            return lu_1.LuCreditCard;
        default:
            return lu_1.LuCircle;
    }
}
var states = ["RFQ", "Quote", "Order", "Invoice"];
var SupplierInteractionState = function (_a) {
    var _b, _c, _d;
    var interaction = _a.interaction, currentRfq = _a.currentRfq, _e = _a.linkedQuotes, linkedQuotes = _e === void 0 ? [] : _e, _f = _a.siblingQuotes, siblingQuotes = _f === void 0 ? [] : _f;
    var t = (0, macro_1.useLingui)().t;
    var pathname = (0, react_1.useOptimisticLocation)().pathname;
    var navigate = (0, react_router_1.useNavigate)();
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var stateLabels = {
        RFQ: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["RFQ"], ["RFQ"]))),
        Quote: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Quote"], ["Quote"]))),
        Order: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Order"], ["Order"]))),
        Invoice: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Invoice"], ["Invoice"])))
    };
    // Determine if we're in "RFQ mode" (viewing from purchasing RFQ) or "interaction mode" (viewing from quote/order)
    var isRfqMode = currentRfq !== undefined && currentRfq !== null;
    // Get RFQ: currentRfq for RFQ mode, interaction.purchasingRfq for interaction mode
    var rfqs = isRfqMode
        ? [currentRfq]
        : (interaction === null || interaction === void 0 ? void 0 : interaction.purchasingRfq)
            ? [interaction.purchasingRfq]
            : [];
    var hasRfqs = rfqs.length > 0;
    // Combine quote sources:
    // - RFQ mode: use linkedQuotes (quotes linked to current RFQ)
    // - Quote mode (siblingQuotes provided): combine current quote with siblings
    // - Order mode: use interaction.supplierQuotes (shows parent quote)
    var interactionQuotes = (_c = (_b = interaction === null || interaction === void 0 ? void 0 : interaction.supplierQuotes) === null || _b === void 0 ? void 0 : _b.map(function (q) {
        var _a, _b, _c, _d;
        return ({
            id: q.id,
            supplierQuoteId: (_a = q.supplierQuoteId) !== null && _a !== void 0 ? _a : undefined,
            revisionId: (_b = q.revisionId) !== null && _b !== void 0 ? _b : undefined,
            status: (_c = q.status) !== null && _c !== void 0 ? _c : undefined,
            supplierId: (_d = q.supplierId) !== null && _d !== void 0 ? _d : undefined
        });
    })) !== null && _c !== void 0 ? _c : [];
    var quotes = isRfqMode
        ? linkedQuotes
        : siblingQuotes.length > 0
            ? __spreadArray(__spreadArray([], interactionQuotes, true), siblingQuotes, true) : interactionQuotes;
    var hasQuotes = quotes.length > 0;
    // Orders and invoices only from interaction
    var orders = (_d = interaction === null || interaction === void 0 ? void 0 : interaction.purchaseOrders) !== null && _d !== void 0 ? _d : [];
    var hasOrders = orders.length > 0;
    //   const invoices = interaction?.purchaseInvoices ?? [];
    // Determine which states to show
    var statesToShow = hasRfqs ? ["RFQ", "Quote", "Order"] : ["Quote", "Order"];
    return (<react_1.Menubar>
      {states
            .filter(function (state) { return statesToShow.includes(state); })
            .map(function (state) {
            var _a, _b, _c;
            var Icon = getSupplierInteractionIcon(state);
            // RFQ State
            if (state === "RFQ" && hasRfqs) {
                var rfqItems = rfqs.map(function (rfq) { return ({
                    id: rfq.id,
                    label: rfq.rfqId ? rfq.rfqId : "RFQ ".concat(rfq.id),
                    path: path_1.path.to.purchasingRfqDetails(rfq.id)
                }); });
                var firstPath_1 = (_a = rfqItems[0]) === null || _a === void 0 ? void 0 : _a.path;
                var hasMultiple = rfqItems.length > 1;
                var isCurrent = rfqItems.some(function (item) {
                    return pathname.includes(path_1.path.to.purchasingRfq(item.id));
                });
                if (hasMultiple) {
                    return (<react_1.SplitButton key={state} leftIcon={<Icon className={(0, react_1.cn)(isCurrent && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>} variant="ghost" onClick={function () { return navigate(firstPath_1); }} dropdownItems={rfqItems.map(function (item) { return ({
                            label: item.label,
                            onClick: function () { return navigate(item.path); }
                        }); })}>
                  {stateLabels.RFQ}
                </react_1.SplitButton>);
                }
                else {
                    return (<react_1.Button key={state} leftIcon={<Icon className={(0, react_1.cn)(isCurrent && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>} variant="ghost" asChild>
                  <react_router_1.Link to={firstPath_1}>{stateLabels.RFQ}</react_router_1.Link>
                </react_1.Button>);
                }
            }
            // Quote State
            if (state === "Quote" && hasQuotes) {
                var quoteItems_1 = quotes
                    .map(function (quote) {
                    var _a, _b, _c;
                    var supplierName = (_b = ("supplier" in quote ? (_a = quote.supplier) === null || _a === void 0 ? void 0 : _a.name : undefined)) !== null && _b !== void 0 ? _b : (_c = suppliers.find(function (s) { return s.id === quote.supplierId; })) === null || _c === void 0 ? void 0 : _c.name;
                    return {
                        id: quote.id,
                        label: supplierName
                            ? "".concat(supplierName).concat(quote.supplierQuoteId
                                ? " (".concat(quote.supplierQuoteId).concat(quote.revisionId && quote.revisionId > 0
                                    ? "-".concat(quote.revisionId)
                                    : "", ")")
                                : "")
                            : quote.supplierQuoteId
                                ? "".concat(quote.supplierQuoteId).concat(quote.revisionId && quote.revisionId > 0
                                    ? "-".concat(quote.revisionId)
                                    : "")
                                : "Quote ".concat(quote.id),
                        path: path_1.path.to.supplierQuoteDetails(quote.id)
                    };
                })
                    .sort(function (a, b) { return a.label.localeCompare(b.label); });
                var hasMultiple = quoteItems_1.length > 1;
                var currentItem = quoteItems_1.find(function (item) {
                    return pathname.includes(item.path);
                });
                var isCurrent = !!currentItem;
                if (hasMultiple) {
                    return (<react_1.DropdownMenu key={state}>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.Button leftIcon={<Icon className={(0, react_1.cn)(isCurrent && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>} rightIcon={<lu_1.LuChevronDown className="h-3 w-3"/>} variant="ghost">
                      {stateLabels.Quote}
                    </react_1.Button>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent>
                    <react_1.DropdownMenuRadioGroup value={currentItem === null || currentItem === void 0 ? void 0 : currentItem.id} onValueChange={function (id) {
                            var item = quoteItems_1.find(function (q) { return q.id === id; });
                            if (item)
                                navigate(item.path);
                        }}>
                      {quoteItems_1.map(function (item) { return (<react_1.DropdownMenuRadioItem key={item.id} value={item.id}>
                          {item.label}
                        </react_1.DropdownMenuRadioItem>); })}
                    </react_1.DropdownMenuRadioGroup>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>);
                }
                else {
                    return (<react_1.Button key={state} leftIcon={<Icon className={(0, react_1.cn)(isCurrent && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>} variant="ghost" asChild>
                  <react_router_1.Link to={(_b = quoteItems_1[0]) === null || _b === void 0 ? void 0 : _b.path}>{stateLabels.Quote}</react_router_1.Link>
                </react_1.Button>);
                }
            }
            // Order State
            if (state === "Order" && hasOrders) {
                var orderItems = orders.map(function (order) { return ({
                    id: order.id,
                    label: order.purchaseOrderId
                        ? "".concat(order.purchaseOrderId).concat(order.revisionId && order.revisionId > 0
                            ? "-".concat(order.revisionId)
                            : "")
                        : "Order ".concat(order.id),
                    path: path_1.path.to.purchaseOrderDetails(order.id)
                }); });
                var firstPath_2 = (_c = orderItems[0]) === null || _c === void 0 ? void 0 : _c.path;
                var hasMultiple = orderItems.length > 1;
                var isCurrent = orderItems.some(function (item) {
                    return pathname.includes(item.path);
                });
                if (hasMultiple) {
                    return (<react_1.SplitButton key={state} leftIcon={<Icon className={(0, react_1.cn)(isCurrent && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>} variant="ghost" onClick={function () { return navigate(firstPath_2); }} dropdownItems={orderItems.map(function (item) { return ({
                            label: item.label,
                            onClick: function () { return navigate(item.path); }
                        }); })}>
                  {stateLabels.Order}
                </react_1.SplitButton>);
                }
                else {
                    return (<react_1.Button key={state} leftIcon={<Icon className={(0, react_1.cn)(isCurrent && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>} variant="ghost" asChild>
                  <react_router_1.Link to={firstPath_2}>{stateLabels.Order}</react_router_1.Link>
                </react_1.Button>);
                }
            }
            // Disabled states
            return (<react_1.Button key={state} variant="ghost" isDisabled leftIcon={<Icon className="opacity-50"/>}>
              {stateLabels[state]}
            </react_1.Button>);
        })}
    </react_1.Menubar>);
};
exports.default = SupplierInteractionState;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
