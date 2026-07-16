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
exports.default = SupplierQuoteRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var accounting_1 = require("~/modules/accounting");
var purchasing_1 = require("~/modules/purchasing");
var SupplierQuote_1 = require("~/modules/purchasing/ui/SupplierQuote");
var SupplierQuoteExplorer_1 = require("~/modules/purchasing/ui/SupplierQuote/SupplierQuoteExplorer");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Supplier Quotes"], ["Supplier Quotes"]))),
    to: path_1.path.to.supplierQuotes,
    module: "purchasing"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, companyGroupId, id, serviceRole, _d, quote, lines, prices, siblingQuotes, _e, _f, _g, supplierInteraction, presentationCurrency, supplier, companySettings, _h, _j, exchangeRate, siblingQuotesData, defaultCc;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing"
                    })];
                case 1:
                    _c = _w.sent(), companyId = _c.companyId, companyGroupId = _c.companyGroupId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _w.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_1.getSupplierQuote)(serviceRole, id),
                            (0, purchasing_1.getSupplierQuoteLines)(serviceRole, id),
                            (0, purchasing_1.getSupplierQuoteLinePricesByQuoteId)(serviceRole, id),
                            (0, purchasing_1.getSiblingQuotesForQuote)(serviceRole, id)
                        ])];
                case 3:
                    _d = _w.sent(), quote = _d[0], lines = _d[1], prices = _d[2], siblingQuotes = _d[3];
                    if (!quote.error) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.supplierQuotes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quote.error, "Failed to load quote"))];
                case 4: throw _e.apply(void 0, _f.concat([_w.sent()]));
                case 5: return [4 /*yield*/, Promise.all([
                        (0, purchasing_1.getSupplierInteraction)(serviceRole, quote.data.supplierInteractionId),
                        (0, accounting_1.getCurrencyByCode)(serviceRole, companyGroupId, quote.data.currencyCode),
                        (0, purchasing_1.getSupplier)(serviceRole, quote.data.supplierId),
                        (0, settings_1.getCompanySettings)(serviceRole, companyId)
                    ])];
                case 6:
                    _g = _w.sent(), supplierInteraction = _g[0], presentationCurrency = _g[1], supplier = _g[2], companySettings = _g[3];
                    if (!supplierInteraction.error) return [3 /*break*/, 8];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.supplierQuotes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(supplierInteraction.error, "Failed to load supplier interaction record"))];
                case 7: throw _h.apply(void 0, _j.concat([_w.sent()]));
                case 8:
                    exchangeRate = 1;
                    if (((_k = quote.data) === null || _k === void 0 ? void 0 : _k.currencyCode) && ((_l = presentationCurrency.data) === null || _l === void 0 ? void 0 : _l.exchangeRate)) {
                        exchangeRate = presentationCurrency.data.exchangeRate;
                    }
                    siblingQuotesData = (_o = (_m = siblingQuotes.data) === null || _m === void 0 ? void 0 : _m.map(function (link) { return link.supplierQuote; }).filter(Boolean).filter(function (quote, index, self) {
                        return self.findIndex(function (q) { return (q === null || q === void 0 ? void 0 : q.id) === (quote === null || quote === void 0 ? void 0 : quote.id); }) === index;
                    })) !== null && _o !== void 0 ? _o : [];
                    defaultCc = 
                    // @ts-expect-error TS18048 - TODO: fix type
                    ((_q = (_p = supplier.data) === null || _p === void 0 ? void 0 : _p.defaultCc) === null || _q === void 0 ? void 0 : _q.length) > 0
                        ? // @ts-expect-error TS18047 - TODO: fix type
                            supplier.data.defaultCc
                        : ((_s = (_r = companySettings.data) === null || _r === void 0 ? void 0 : _r.defaultSupplierCc) !== null && _s !== void 0 ? _s : []);
                    return [2 /*return*/, {
                            quote: quote.data,
                            lines: (_t = lines.data) !== null && _t !== void 0 ? _t : [],
                            prices: (_u = prices.data) !== null && _u !== void 0 ? _u : [],
                            files: (0, purchasing_1.getSupplierInteractionDocuments)(serviceRole, companyId, quote.data.supplierInteractionId),
                            interaction: supplierInteraction.data,
                            exchangeRate: exchangeRate,
                            siblingQuotes: siblingQuotesData,
                            defaultCc: defaultCc,
                            supplier: (_v = supplier === null || supplier === void 0 ? void 0 : supplier.data) !== null && _v !== void 0 ? _v : null
                        }];
            }
        });
    });
}
function SupplierQuoteRoute() {
    var params = (0, react_router_1.useParams)();
    var id = params.id;
    if (!id)
        throw new Error("Could not find id");
    return (<Layout_1.PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <SupplierQuote_1.SupplierQuoteHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels explorer={<SupplierQuoteExplorer_1.default />} content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <react_1.VStack spacing={2} className="p-2">
                    <react_router_1.Outlet />
                  </react_1.VStack>
                </div>} properties={<SupplierQuote_1.SupplierQuoteProperties key={id}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1;
