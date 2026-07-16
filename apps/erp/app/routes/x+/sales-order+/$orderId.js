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
exports.default = SalesOrderRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var sales_1 = require("~/modules/sales");
var SalesOrder_1 = require("~/modules/sales/ui/SalesOrder");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Orders"], ["Orders"]))),
    to: path_1.path.to.salesOrders,
    module: "sales"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, orderId, _d, salesOrder, lines, _e, _f, opportunity, _g, _h, serviceRole, _j, quote, customer, companySettings, invoiceLines, _k, _l, invoiceIds, invoicedAmount, paidAmount, currencyMismatchCount, invoices, _m, _o, orderCurrency, _i, _p, invoice, invoiceTotal, invoiceCurrency, defaultCc;
        var _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_6) {
            switch (_6.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales",
                        bypassRls: true
                    })];
                case 1:
                    _c = _6.sent(), client = _c.client, companyId = _c.companyId;
                    orderId = params.orderId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    return [4 /*yield*/, Promise.all([
                            (0, sales_1.getSalesOrder)(client, orderId),
                            (0, sales_1.getSalesOrderLines)(client, orderId)
                        ])];
                case 2:
                    _d = _6.sent(), salesOrder = _d[0], lines = _d[1];
                    if (!salesOrder.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.items];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(salesOrder.error, "Failed to load salesOrder"))];
                case 3: throw _e.apply(void 0, _f.concat([_6.sent()]));
                case 4:
                    if (companyId !== ((_q = salesOrder.data) === null || _q === void 0 ? void 0 : _q.companyId)) {
                        throw (0, react_router_1.redirect)(path_1.path.to.salesOrders);
                    }
                    return [4 /*yield*/, (0, sales_1.getOrCreateOpportunityForSalesOrder)(client, {
                            id: salesOrder.data.id,
                            companyId: salesOrder.data.companyId,
                            customerId: salesOrder.data.customerId,
                            opportunityId: (_r = salesOrder.data.opportunityId) !== null && _r !== void 0 ? _r : null
                        })];
                case 5:
                    opportunity = _6.sent();
                    if (!opportunity.error) return [3 /*break*/, 7];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.salesOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(opportunity.error, "Failed to load sales order opportunity"))];
                case 6: throw _g.apply(void 0, _h.concat([_6.sent()]));
                case 7:
                    if (!opportunity.data)
                        throw new Error("Failed to get opportunity record");
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, Promise.all([
                            ((_s = opportunity.data.quotes[0]) === null || _s === void 0 ? void 0 : _s.id)
                                ? (0, sales_1.getQuote)(client, opportunity.data.quotes[0].id)
                                : Promise.resolve(null),
                            ((_t = salesOrder.data) === null || _t === void 0 ? void 0 : _t.customerId)
                                ? (0, sales_1.getCustomer)(client, salesOrder.data.customerId)
                                : Promise.resolve(null),
                            (0, settings_1.getCompanySettings)(serviceRole, companyId),
                            (0, sales_1.getSalesOrderInvoiceLines)(client, orderId)
                        ])];
                case 8:
                    _j = _6.sent(), quote = _j[0], customer = _j[1], companySettings = _j[2], invoiceLines = _j[3];
                    if (!invoiceLines.error) return [3 /*break*/, 10];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.salesOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(invoiceLines.error, "Failed to load linked sales invoices"))];
                case 9: throw _k.apply(void 0, _l.concat([_6.sent()]));
                case 10:
                    invoiceIds = Array.from(new Set(((_u = invoiceLines.data) !== null && _u !== void 0 ? _u : []).map(function (line) { return line.invoiceId; }).filter(Boolean)));
                    invoicedAmount = 0;
                    paidAmount = 0;
                    currencyMismatchCount = 0;
                    if (!(invoiceIds.length > 0)) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, sales_1.getSalesOrderInvoicesByIds)(client, invoiceIds)];
                case 11:
                    invoices = _6.sent();
                    if (!invoices.error) return [3 /*break*/, 13];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.salesOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(invoices.error, "Failed to load sales invoice totals"))];
                case 12: throw _m.apply(void 0, _o.concat([_6.sent()]));
                case 13:
                    orderCurrency = (_v = salesOrder.data) === null || _v === void 0 ? void 0 : _v.currencyCode;
                    for (_i = 0, _p = (_w = invoices.data) !== null && _w !== void 0 ? _w : []; _i < _p.length; _i++) {
                        invoice = _p[_i];
                        invoiceTotal = (_x = invoice.invoiceTotal) !== null && _x !== void 0 ? _x : 0;
                        invoiceCurrency = invoice.currencyCode;
                        // Avoid mixing currencies in the same displayed number.
                        if (orderCurrency &&
                            invoiceCurrency &&
                            invoiceCurrency !== orderCurrency) {
                            currencyMismatchCount += 1;
                            continue;
                        }
                        invoicedAmount += invoiceTotal;
                        if (invoice.status === "Paid") {
                            paidAmount += invoiceTotal;
                        }
                    }
                    _6.label = 14;
                case 14:
                    defaultCc = ((_z = (_y = customer === null || customer === void 0 ? void 0 : customer.data) === null || _y === void 0 ? void 0 : _y.defaultCc) === null || _z === void 0 ? void 0 : _z.length)
                        ? customer.data.defaultCc
                        : ((_1 = (_0 = companySettings.data) === null || _0 === void 0 ? void 0 : _0.defaultCustomerCc) !== null && _1 !== void 0 ? _1 : []);
                    return [2 /*return*/, {
                            salesOrder: salesOrder.data,
                            lines: (_2 = lines.data) !== null && _2 !== void 0 ? _2 : [],
                            files: (0, sales_1.getOpportunityDocuments)(client, companyId, opportunity.data.id),
                            relatedItems: (0, sales_1.getSalesOrderRelatedItems)(client, orderId, opportunity.data.id),
                            opportunity: opportunity.data,
                            customer: (_3 = customer === null || customer === void 0 ? void 0 : customer.data) !== null && _3 !== void 0 ? _3 : null,
                            quote: (_4 = quote === null || quote === void 0 ? void 0 : quote.data) !== null && _4 !== void 0 ? _4 : null,
                            invoiceSummary: {
                                invoicedAmount: invoicedAmount,
                                paidAmount: paidAmount,
                                currencyMismatchCount: currencyMismatchCount
                            },
                            originatedFromQuote: !!((_5 = opportunity.data.quotes[0]) === null || _5 === void 0 ? void 0 : _5.id),
                            defaultCc: defaultCc
                        }];
            }
        });
    });
}
function SalesOrderRoute() {
    var params = (0, react_router_1.useParams)();
    var orderId = params.orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    return (<Layout_1.PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <SalesOrder_1.SalesOrderHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels 
    // explorer={<SalesOrderExplorer />}
    content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <react_1.VStack spacing={2} className="p-2">
                    <react_router_1.Outlet />
                  </react_1.VStack>
                </div>} properties={<SalesOrder_1.SalesOrderProperties key={orderId}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1;
