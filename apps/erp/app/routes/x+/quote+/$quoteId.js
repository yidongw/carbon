"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.loader = loader;
exports.default = QuoteRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var accounting_1 = require("~/modules/accounting");
var items_1 = require("~/modules/items");
var sales_1 = require("~/modules/sales");
var Quotes_1 = require("~/modules/sales/ui/Quotes");
var QuoteExplorer_1 = require("~/modules/sales/ui/Quotes/QuoteExplorer");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quotes"], ["Quotes"]))),
    to: path_1.path.to.quotes,
    module: "sales"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function collectBuyItems(tree) {
            var _a;
            if (tree.data.methodType === "Purchase to Order" && tree.data.itemId) {
                buyItemIds.add(tree.data.itemId);
            }
            (_a = tree.children) === null || _a === void 0 ? void 0 : _a.forEach(collectBuyItems);
        }
        var _c, client, companyId, companyGroupId, quoteId, quote, _d, _e, opportunity, _f, _g, _h, customer, shipment, payment, lines, prices, methods, opportunityDocuments, companySettings, _j, _k, _l, _m, exchangeRate, presentationCurrency, salesOrderLines, defaultCc, methodTrees, buyItemIds, _i, _o, line, supplierPriceMap;
        var _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_7) {
            switch (_7.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales",
                        bypassRls: true
                    })];
                case 1:
                    _c = _7.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId;
                    quoteId = params.quoteId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    return [4 /*yield*/, (0, sales_1.getQuote)(client, quoteId)];
                case 2:
                    quote = _7.sent();
                    if (!quote.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.quotes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quote.error, "Failed to load quote"))];
                case 3: throw _d.apply(void 0, _e.concat([_7.sent()]));
                case 4:
                    if (companyId !== ((_p = quote.data) === null || _p === void 0 ? void 0 : _p.companyId)) {
                        throw (0, react_router_1.redirect)(path_1.path.to.quotes);
                    }
                    return [4 /*yield*/, (0, sales_1.getOrCreateOpportunityForRecord)(client, {
                            id: quote.data.id,
                            companyId: quote.data.companyId,
                            customerId: quote.data.customerId,
                            opportunityId: (_q = quote.data.opportunityId) !== null && _q !== void 0 ? _q : null,
                            table: "quote"
                        })];
                case 5:
                    opportunity = _7.sent();
                    if (!opportunity.error) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.quotes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(opportunity.error, "Failed to load quote opportunity"))];
                case 6: throw _f.apply(void 0, _g.concat([_7.sent()]));
                case 7:
                    if (!opportunity.data)
                        throw new Error("Failed to get opportunity record");
                    return [4 /*yield*/, Promise.all([
                            (0, sales_1.getCustomer)(client, (_s = (_r = quote.data) === null || _r === void 0 ? void 0 : _r.customerId) !== null && _s !== void 0 ? _s : ""),
                            (0, sales_1.getQuoteShipment)(client, quoteId),
                            (0, sales_1.getQuotePayment)(client, quoteId),
                            (0, sales_1.getQuoteLines)(client, quoteId),
                            (0, sales_1.getQuoteLinePricesByQuoteId)(client, quoteId),
                            (0, sales_1.getQuoteMethodTrees)(client, quoteId),
                            (0, sales_1.getOpportunityDocuments)(client, companyId, opportunity.data.id),
                            (0, settings_1.getCompanySettings)(client, companyId)
                        ])];
                case 8:
                    _h = _7.sent(), customer = _h[0], shipment = _h[1], payment = _h[2], lines = _h[3], prices = _h[4], methods = _h[5], opportunityDocuments = _h[6], companySettings = _h[7];
                    if (!shipment.error) return [3 /*break*/, 10];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.quotes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(shipment.error, "Failed to load quote shipment"))];
                case 9: throw _j.apply(void 0, _k.concat([_7.sent()]));
                case 10:
                    if (!payment.error) return [3 /*break*/, 12];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.quotes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(payment.error, "Failed to load quote payment"))];
                case 11: throw _l.apply(void 0, _m.concat([_7.sent()]));
                case 12:
                    exchangeRate = 1;
                    if (!((_t = quote.data) === null || _t === void 0 ? void 0 : _t.currencyCode)) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, quote.data.currencyCode)];
                case 13:
                    presentationCurrency = _7.sent();
                    if ((_u = presentationCurrency.data) === null || _u === void 0 ? void 0 : _u.exchangeRate) {
                        exchangeRate = presentationCurrency.data.exchangeRate;
                    }
                    _7.label = 14;
                case 14:
                    salesOrderLines = null;
                    if (!(((_v = opportunity.data) === null || _v === void 0 ? void 0 : _v.salesOrders.length) &&
                        ((_w = opportunity.data.salesOrders[0]) === null || _w === void 0 ? void 0 : _w.id))) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, sales_1.getSalesOrderLines)(client, (_x = opportunity.data.salesOrders[0]) === null || _x === void 0 ? void 0 : _x.id)];
                case 15:
                    salesOrderLines = _7.sent();
                    _7.label = 16;
                case 16:
                    defaultCc = 
                    // @ts-expect-error TS18048 - TODO: fix type
                    ((_z = (_y = customer.data) === null || _y === void 0 ? void 0 : _y.defaultCc) === null || _z === void 0 ? void 0 : _z.length) > 0
                        ? // @ts-expect-error TS18047 - TODO: fix type
                            customer.data.defaultCc
                        : ((_1 = (_0 = companySettings.data) === null || _0 === void 0 ? void 0 : _0.defaultCustomerCc) !== null && _1 !== void 0 ? _1 : []);
                    methodTrees = (_2 = methods.data) !== null && _2 !== void 0 ? _2 : [];
                    buyItemIds = new Set();
                    methodTrees.forEach(collectBuyItems);
                    // Also include top-level Buy lines (non-Make lines)
                    for (_i = 0, _o = (_3 = lines.data) !== null && _3 !== void 0 ? _3 : []; _i < _o.length; _i++) {
                        line = _o[_i];
                        if (line.methodType === "Purchase to Order" && line.itemId) {
                            buyItemIds.add(line.itemId);
                        }
                    }
                    return [4 /*yield*/, (0, items_1.getSupplierPriceBreaksForItems)(client, Array.from(buyItemIds))];
                case 17:
                    supplierPriceMap = _7.sent();
                    return [2 /*return*/, {
                            quote: quote.data,
                            customer: customer.data,
                            lines: (_4 = lines.data) !== null && _4 !== void 0 ? _4 : [],
                            methods: methodTrees,
                            files: opportunityDocuments,
                            prices: (_5 = prices.data) !== null && _5 !== void 0 ? _5 : [],
                            shipment: shipment.data,
                            payment: payment.data,
                            opportunity: opportunity.data,
                            exchangeRate: exchangeRate,
                            salesOrderLines: (_6 = salesOrderLines === null || salesOrderLines === void 0 ? void 0 : salesOrderLines.data) !== null && _6 !== void 0 ? _6 : null,
                            defaultCc: defaultCc,
                            supplierPriceMap: supplierPriceMap
                        }];
            }
        });
    });
}
function QuoteRoute() {
    var params = (0, react_router_1.useParams)();
    var quoteId = params.quoteId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    var methods = (0, react_router_1.useLoaderData)().methods;
    var submit = (0, react_router_1.useSubmit)();
    var pendingItems = (0, QuoteExplorer_1.useOptimisticDocumentDrag)();
    var handleDrop = function (document, targetId) {
        var _a;
        if (pendingItems.find(function (item) { return item.itemId === "pending-".concat(document.id); }))
            return;
        var formData = new FormData();
        var payload = {
            id: document.id,
            name: document.name,
            size: ((_a = document.metadata) === null || _a === void 0 ? void 0 : _a.size) || 0,
            path: document.path,
            lineId: targetId.startsWith("quote-line-")
                ? targetId.replace("quote-line-", "")
                : undefined
        };
        formData.append("payload", JSON.stringify(payload));
        submit(formData, {
            method: "post",
            action: path_1.path.to.quoteDrag(quoteId),
            navigate: false,
            fetcherKey: "quote-drag:".concat(document.name)
        });
    };
    var handleDragEnd = function (event) {
        var _a;
        var over = event.over, active = event.active;
        if (over && ((_a = active.data.current) === null || _a === void 0 ? void 0 : _a.type) === "opportunityDocument") {
            handleDrop(active.data.current, over.id);
        }
    };
    return (<Layout_1.PanelProvider key={quoteId}>
      <core_1.DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full ">
          <Quotes_1.QuoteHeader />
          <div className="flex flex-1 min-h-0 overflow-hidden w-full">
            <div className="flex flex-1 min-h-0 h-full overflow-hidden">
              <Layout_1.ResizablePanels explorer={<Quotes_1.QuoteExplorer methods={methods}/>} content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                    <react_1.VStack spacing={2} className="p-2">
                      <react_router_1.Outlet />
                    </react_1.VStack>
                  </div>} properties={<Quotes_1.QuoteProperties key={quoteId}/>}/>
            </div>
          </div>
        </div>
      </core_1.DndContext>
    </Layout_1.PanelProvider>);
}
var templateObject_1;
