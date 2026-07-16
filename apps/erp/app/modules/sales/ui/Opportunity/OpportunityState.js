"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function getOpportunityStarted(opportunity, state) {
    switch (state) {
        case "RFQ":
            return opportunity.salesRfqs.length > 0;
        case "Quote":
            return opportunity.quotes.length > 0;
        case "Order":
            return opportunity.salesOrders.length > 0;
    }
}
function getOpportunityCompleted(opportunity, state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    switch (state) {
        case "RFQ":
            return (((_b = (_a = opportunity.salesRfqs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.completedDate) &&
                ((_d = (_c = opportunity.salesRfqs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.completedDate) !== null);
        case "Quote":
            return (((_f = (_e = opportunity.quotes) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.completedDate) &&
                ((_h = (_g = opportunity.quotes) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.completedDate) !== null);
        case "Order":
            return (((_k = (_j = opportunity.salesOrders) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.completedDate) &&
                ((_m = (_l = opportunity.salesOrders) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.completedDate) !== null);
    }
}
function getOpportunityIcon(state) {
    switch (state) {
        case "RFQ":
            return ri_1.RiProgress2Line;
        case "Quote":
            return ri_1.RiProgress4Line;
        case "Order":
            return ri_1.RiProgress8Line;
        default:
            return lu_1.LuCircle;
    }
}
function getPath(opportunity, state) {
    var _a, _b, _c, _d, _e, _f;
    switch (state) {
        case "RFQ":
            return path_1.path.to.salesRfqDetails((_b = (_a = opportunity.salesRfqs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id);
        case "Quote":
            return path_1.path.to.quoteDetails((_d = (_c = opportunity.quotes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.id);
        case "Order":
            return path_1.path.to.salesOrderDetails((_f = (_e = opportunity.salesOrders) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.id);
    }
}
function getIsCurrent(opportunity, pathname, state) {
    switch (state) {
        case "RFQ":
            return opportunity.salesRfqs.some(function (rfq) {
                return pathname.includes(path_1.path.to.salesRfqDetails(rfq.id));
            });
        case "Quote":
            return opportunity.quotes.some(function (quote) {
                return pathname.includes(path_1.path.to.quoteDetails(quote.id));
            });
        case "Order":
            return opportunity.salesOrders.some(function (order) {
                return pathname.includes(path_1.path.to.salesOrderDetails(order.id));
            });
        default:
            return false;
    }
}
function getItems(opportunity, state) {
    switch (state) {
        case "RFQ":
            return opportunity.salesRfqs.map(function (rfq) { return ({
                id: rfq.id,
                label: rfq.rfqId
                    ? "".concat(rfq.rfqId).concat(rfq.revisionId && rfq.revisionId > 0 ? "-".concat(rfq.revisionId) : "")
                    : "RFQ ".concat(rfq.id),
                path: path_1.path.to.salesRfqDetails(rfq.id)
            }); });
        case "Quote":
            return opportunity.quotes.map(function (quote) { return ({
                id: quote.id,
                label: quote.quoteId
                    ? "".concat(quote.quoteId).concat(quote.revisionId && quote.revisionId > 0
                        ? "-".concat(quote.revisionId)
                        : "")
                    : "Quote ".concat(quote.id),
                path: path_1.path.to.quoteDetails(quote.id)
            }); });
        case "Order":
            return opportunity.salesOrders.map(function (order) { return ({
                id: order.id,
                label: order.salesOrderId
                    ? "".concat(order.salesOrderId).concat(order.revisionId && order.revisionId > 0
                        ? "-".concat(order.revisionId)
                        : "")
                    : "Order ".concat(order.id),
                path: path_1.path.to.salesOrderDetails(order.id)
            }); });
        default:
            return [];
    }
}
var states = ["RFQ", "Quote", "Order"];
var OpportunityState = function (_a) {
    var opportunity = _a.opportunity;
    var t = (0, macro_1.useLingui)().t;
    var pathname = (0, react_1.useOptimisticLocation)().pathname;
    var navigate = (0, react_router_1.useNavigate)();
    var stateLabels = {
        RFQ: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["RFQ"], ["RFQ"]))),
        Quote: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Quote"], ["Quote"]))),
        Order: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Order"], ["Order"])))
    };
    return (<react_1.Menubar>
      {states.map(function (state, index) {
            var isStarted = getOpportunityStarted(opportunity, state);
            var isCompleted = getOpportunityCompleted(opportunity, state);
            var isCurrent = getIsCurrent(opportunity, pathname, state);
            var Icon = getOpportunityIcon(state);
            var to = getPath(opportunity, state);
            var items = getItems(opportunity, state);
            var hasMultipleItems = items.length > 1;
            if (isStarted && to) {
                if (hasMultipleItems) {
                    var Icon_1 = getOpportunityIcon(state);
                    return (<react_1.SplitButton key={state} leftIcon={<Icon_1 className={(0, react_1.cn)(isCurrent && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>} variant="ghost" onClick={function () { return navigate(to); }} dropdownItems={items.map(function (item) { return ({
                            label: item.label,
                            onClick: function () { return navigate(item.path); }
                        }); })}>
                {stateLabels[state]}
              </react_1.SplitButton>);
                }
                else {
                    return (<react_1.Button key={state} leftIcon={<Icon className={(0, react_1.cn)(isCurrent && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>} variant="ghost" asChild>
                <react_router_1.Link to={to}>{stateLabels[state]}</react_router_1.Link>
              </react_1.Button>);
                }
            }
            else {
                return (<react_1.Button key={state} variant="ghost" isDisabled leftIcon={<Icon className={(0, react_1.cn)(isCompleted && "text-emerald-500", !isCurrent && "opacity-80 hover:opacity-100")}/>}>
              {stateLabels[state]}
            </react_1.Button>);
            }
        })}
    </react_1.Menubar>);
};
exports.default = OpportunityState;
var templateObject_1, templateObject_2, templateObject_3;
