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
exports.loader = loader;
exports.action = action;
exports.default = DeleteSalesInvoiceLineRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var invoicing_1 = require("~/modules/invoicing");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, lineId, invoiceId, invoice, salesInvoiceLine, _c, _d;
        var _e;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        delete: "invoicing"
                    })];
                case 1:
                    client = (_f.sent()).client;
                    lineId = params.lineId, invoiceId = params.invoiceId;
                    if (!lineId)
                        throw (0, auth_1.notFound)("lineId not found");
                    if (!invoiceId)
                        throw (0, auth_1.notFound)("invoiceId not found");
                    return [4 /*yield*/, (0, invoicing_1.getSalesInvoice)(client, invoiceId)];
                case 2:
                    invoice = _f.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, invoicing_1.isSalesInvoiceLocked)((_e = invoice.data) === null || _e === void 0 ? void 0 : _e.status),
                            redirectTo: path_1.path.to.salesInvoiceDetails(invoiceId),
                            message: "Cannot delete lines on a locked sales invoice."
                        })];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, (0, invoicing_1.getSalesInvoiceLine)(client, lineId)];
                case 4:
                    salesInvoiceLine = _f.sent();
                    if (!salesInvoiceLine.error) return [3 /*break*/, 6];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.salesInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(salesInvoiceLine.error, "Failed to get sales invoice line"))];
                case 5: throw _c.apply(void 0, _d.concat([_f.sent()]));
                case 6: return [2 /*return*/, { salesInvoiceLine: salesInvoiceLine.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, lineId, invoiceId, invoice, deleteTypeError, _c, _d, _e, _f;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        delete: "invoicing"
                    })];
                case 1:
                    client = (_h.sent()).client;
                    lineId = params.lineId, invoiceId = params.invoiceId;
                    if (!lineId)
                        throw (0, auth_1.notFound)("Could not find lineId");
                    if (!invoiceId)
                        throw (0, auth_1.notFound)("Could not find invoiceId");
                    return [4 /*yield*/, (0, invoicing_1.getSalesInvoice)(client, invoiceId)];
                case 2:
                    invoice = _h.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, invoicing_1.isSalesInvoiceLocked)((_g = invoice.data) === null || _g === void 0 ? void 0 : _g.status),
                            redirectTo: path_1.path.to.salesInvoiceDetails(invoiceId),
                            message: "Cannot delete lines on a locked sales invoice."
                        })];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, (0, invoicing_1.deleteSalesInvoiceLine)(client, lineId)];
                case 4:
                    deleteTypeError = (_h.sent()).error;
                    if (!deleteTypeError) return [3 /*break*/, 6];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.salesInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(deleteTypeError, "Failed to delete sales invoice line"))];
                case 5: throw _c.apply(void 0, _d.concat([_h.sent()]));
                case 6:
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.salesInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully deleted sales invoice line"))];
                case 7: throw _e.apply(void 0, _f.concat([_h.sent()]));
            }
        });
    });
}
function DeleteSalesInvoiceLineRoute() {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_router_1.useParams)(), lineId = _c.lineId, invoiceId = _c.invoiceId;
    var salesInvoiceLine = (0, react_router_1.useLoaderData)().salesInvoiceLine;
    var navigate = (0, react_router_1.useNavigate)();
    if (!salesInvoiceLine)
        return null;
    if (!lineId)
        throw (0, auth_1.notFound)("Could not find lineId");
    if (!invoiceId)
        throw (0, auth_1.notFound)("Could not find invoiceId");
    var onCancel = function () { return navigate(path_1.path.to.salesInvoiceDetails(invoiceId)); };
    return (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSalesInvoiceLine(invoiceId, lineId)} name={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Sales Invoice Line"], ["Sales Invoice Line"])))} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete the sales invoice line for ", " ", "? This cannot be undone."], ["Are you sure you want to delete the sales invoice line for ", " ", "? This cannot be undone."])), (_a = salesInvoiceLine.quantity) !== null && _a !== void 0 ? _a : 0, (_b = salesInvoiceLine.description) !== null && _b !== void 0 ? _b : "")} onCancel={onCancel}/>);
}
var templateObject_1, templateObject_2;
