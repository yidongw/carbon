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
exports.action = action;
exports.default = PurchaseInvoiceRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var invoicing_1 = require("~/modules/invoicing");
// import PurchaseInvoiceExplorer from "~/modules/invoicing/ui/PurchaseInvoice/PurchaseInvoiceExplorer";
var PurchaseInvoiceProperties_1 = require("~/modules/invoicing/ui/PurchaseInvoice/PurchaseInvoiceProperties");
var purchasing_service_1 = require("~/modules/purchasing/purchasing.service");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Invoices"], ["Invoices"]))),
    to: path_1.path.to.purchaseInvoices
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, invoiceId, _d, purchaseInvoice, purchaseInvoiceLines, purchaseInvoiceDelivery, _e, _f, _g, supplier, interaction, files;
        var _h, _j, _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "invoicing"
                    })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId;
                    invoiceId = params.invoiceId;
                    if (!invoiceId)
                        throw new Error("Could not find invoiceId");
                    return [4 /*yield*/, Promise.all([
                            (0, invoicing_1.getPurchaseInvoice)(client, invoiceId),
                            (0, invoicing_1.getPurchaseInvoiceLines)(client, invoiceId),
                            (0, invoicing_1.getPurchaseInvoiceDelivery)(client, invoiceId)
                        ])];
                case 2:
                    _d = _l.sent(), purchaseInvoice = _d[0], purchaseInvoiceLines = _d[1], purchaseInvoiceDelivery = _d[2];
                    if (!purchaseInvoice.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.purchaseInvoices];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseInvoice.error, "Failed to load purchase invoice"))];
                case 3: throw _e.apply(void 0, _f.concat([_l.sent()]));
                case 4: return [4 /*yield*/, Promise.all([
                        ((_h = purchaseInvoice.data) === null || _h === void 0 ? void 0 : _h.supplierId)
                            ? (0, purchasing_service_1.getSupplier)(client, purchaseInvoice.data.supplierId)
                            : null,
                        (0, purchasing_service_1.getSupplierInteraction)(client, purchaseInvoice.data.supplierInteractionId),
                        (0, purchasing_service_1.getSupplierInteractionDocuments)(client, companyId, purchaseInvoice.data.supplierInteractionId)
                    ])];
                case 5:
                    _g = _l.sent(), supplier = _g[0], interaction = _g[1], files = _g[2];
                    return [2 /*return*/, {
                            purchaseInvoice: purchaseInvoice.data,
                            purchaseInvoiceLines: (_j = purchaseInvoiceLines.data) !== null && _j !== void 0 ? _j : [],
                            purchaseInvoiceDelivery: purchaseInvoiceDelivery.data,
                            files: files,
                            interaction: interaction.data,
                            supplier: (_k = supplier === null || supplier === void 0 ? void 0 : supplier.data) !== null && _k !== void 0 ? _k : null
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c;
        var request = _b.request;
        return __generator(this, function (_d) {
            throw (0, react_router_1.redirect)((_c = request.headers.get("Referer")) !== null && _c !== void 0 ? _c : new URL(request.url).pathname);
        });
    });
}
function PurchaseInvoiceRoute() {
    var params = (0, react_router_1.useParams)();
    var invoiceId = params.invoiceId;
    if (!invoiceId)
        throw new Error("Could not find invoiceId");
    return (<Layout_1.PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <invoicing_1.PurchaseInvoiceHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels 
    // explorer={<PurchaseInvoiceExplorer />}
    content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <react_1.VStack spacing={2} className="p-2">
                    <react_router_1.Outlet />
                  </react_1.VStack>
                </div>} properties={<PurchaseInvoiceProperties_1.default key={invoiceId}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1;
