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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = PurchaseInvoiceBasicRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var invoicing_1 = require("~/modules/invoicing");
var PurchaseInvoice_1 = require("~/modules/invoicing/ui/PurchaseInvoice");
var SupplierInteraction_1 = require("~/modules/purchasing/ui/SupplierInteraction");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, invoiceId, invoice, _c, _d;
        var _e, _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "invoicing"
                    })];
                case 1:
                    client = (_g.sent()).client;
                    invoiceId = params.invoiceId;
                    if (!invoiceId)
                        throw new Error("Could not find invoiceId");
                    return [4 /*yield*/, (0, invoicing_1.getPurchaseInvoice)(client, invoiceId)];
                case 2:
                    invoice = _g.sent();
                    if (!invoice.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.purchaseInvoices];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(invoice.error, "Failed to load purchase invoice"))];
                case 3: throw _c.apply(void 0, _d.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        internalNotes: ((_f = (_e = invoice.data) === null || _e === void 0 ? void 0 : _e.internalNotes) !== null && _f !== void 0 ? _f : {})
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, viewClient, purchaseInvoice, _c, _d, _e, client, userId, formData, validation, _f, invoiceId, d, result, _g, _h, _j, _k;
        var _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    id = params.invoiceId;
                    if (!id)
                        throw new Error("Could not find invoiceId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "invoicing"
                        })];
                case 1:
                    viewClient = (_m.sent()).client;
                    return [4 /*yield*/, (0, invoicing_1.getPurchaseInvoice)(viewClient, id)];
                case 2:
                    purchaseInvoice = _m.sent();
                    if (!purchaseInvoice.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.purchaseInvoice(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseInvoice.error, "Failed to load purchase invoice"))];
                case 3: throw _c.apply(void 0, _d.concat([_m.sent()]));
                case 4: return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                        request: request,
                        isLocked: (0, invoicing_1.isPurchaseInvoiceLocked)((_l = purchaseInvoice.data) === null || _l === void 0 ? void 0 : _l.status),
                        redirectTo: path_1.path.to.purchaseInvoice(id),
                        message: "Cannot modify a confirmed purchase invoice."
                    })];
                case 5:
                    _m.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "invoicing"
                        })];
                case 6:
                    _e = _m.sent(), client = _e.client, userId = _e.userId;
                    return [4 /*yield*/, request.formData()];
                case 7:
                    formData = _m.sent();
                    return [4 /*yield*/, (0, form_1.validator)(invoicing_1.purchaseInvoiceValidator).validate(formData)];
                case 8:
                    validation = _m.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, invoiceId = _f.invoiceId, d = __rest(_f, ["invoiceId"]);
                    if (!invoiceId)
                        throw new Error("Could not find invoiceId");
                    return [4 /*yield*/, (0, invoicing_1.updatePurchaseInvoice)(client, {
                            id: id,
                            invoiceId: invoiceId,
                            supplierId: d.supplierId,
                            supplierReference: d.supplierReference || null,
                            paymentTermId: d.paymentTermId || null,
                            currencyCode: d.currencyCode,
                            locationId: d.locationId,
                            invoiceSupplierId: d.invoiceSupplierId || null,
                            invoiceSupplierContactId: d.invoiceSupplierContactId || null,
                            invoiceSupplierLocationId: d.invoiceSupplierLocationId || null,
                            dateIssued: d.dateIssued || null,
                            dateDue: d.dateDue || null,
                            exchangeRate: d.exchangeRate,
                            exchangeRateUpdatedAt: d.exchangeRateUpdatedAt,
                            customFields: (0, form_2.setCustomFields)(formData),
                            updatedBy: userId
                        })];
                case 9:
                    result = _m.sent();
                    if (!result.error) return [3 /*break*/, 11];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.purchaseInvoice(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update purchase invoice"))];
                case 10: throw _g.apply(void 0, _h.concat([_m.sent()]));
                case 11:
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.purchaseInvoice(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated purchase invoice"))];
                case 12: throw _j.apply(void 0, _k.concat([_m.sent()]));
            }
        });
    });
}
function PurchaseInvoiceBasicRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var t = (0, macro_1.useLingui)().t;
    var internalNotes = (0, react_router_1.useLoaderData)().internalNotes;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("invoiceId not found");
    var invoiceData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseInvoice(invoiceId));
    if (!(invoiceData === null || invoiceData === void 0 ? void 0 : invoiceData.purchaseInvoice))
        throw new Error("purchaseInvoice not found");
    var purchaseInvoice = invoiceData.purchaseInvoice, purchaseInvoiceDelivery = invoiceData.purchaseInvoiceDelivery;
    if (!invoiceData)
        throw new Error("Could not find invoice data");
    var deliveryFormRef = (0, react_1.useRef)(null);
    var handleEditShippingCost = function () {
        var _a;
        (_a = deliveryFormRef.current) === null || _a === void 0 ? void 0 : _a.focusShippingCost();
    };
    var initialValues = __assign({ id: (_a = purchaseInvoice.id) !== null && _a !== void 0 ? _a : "", invoiceId: (_b = purchaseInvoice.invoiceId) !== null && _b !== void 0 ? _b : "", supplierId: (_c = purchaseInvoice.supplierId) !== null && _c !== void 0 ? _c : "", supplierReference: (_d = purchaseInvoice.supplierReference) !== null && _d !== void 0 ? _d : "", invoiceSupplierId: (_e = purchaseInvoice.invoiceSupplierId) !== null && _e !== void 0 ? _e : "", paymentTermId: (_f = purchaseInvoice.paymentTermId) !== null && _f !== void 0 ? _f : "", currencyCode: (_g = purchaseInvoice.currencyCode) !== null && _g !== void 0 ? _g : "", dateIssued: (_h = purchaseInvoice.dateIssued) !== null && _h !== void 0 ? _h : "", dateDue: (_j = purchaseInvoice.dateDue) !== null && _j !== void 0 ? _j : "", status: (_k = purchaseInvoice.status) !== null && _k !== void 0 ? _k : "Draft" }, (0, form_2.getCustomFields)(purchaseInvoice.customFields));
    var deliveryInitialValues = __assign({ id: purchaseInvoiceDelivery.id, locationId: (_l = purchaseInvoiceDelivery.locationId) !== null && _l !== void 0 ? _l : "", supplierShippingCost: (_m = purchaseInvoiceDelivery.supplierShippingCost) !== null && _m !== void 0 ? _m : 0, shippingMethodId: (_o = purchaseInvoiceDelivery.shippingMethodId) !== null && _o !== void 0 ? _o : "", shippingTermId: (_p = purchaseInvoiceDelivery.shippingTermId) !== null && _p !== void 0 ? _p : "", incoterm: (_q = purchaseInvoiceDelivery.incoterm) !== null && _q !== void 0 ? _q : undefined, incotermLocation: (_r = purchaseInvoiceDelivery.incotermLocation) !== null && _r !== void 0 ? _r : "" }, (0, form_2.getCustomFields)(purchaseInvoiceDelivery.customFields));
    var company = (0, hooks_1.useUser)().company;
    return (<jsx_runtime_1.Fragment key={invoiceId}>
      <invoicing_1.PurchaseInvoiceSummary onEditShippingCost={handleEditShippingCost}/>
      <SupplierInteraction_1.SupplierInteractionNotes key={"notes-".concat(initialValues.id)} id={invoiceId} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} table="purchaseInvoice" internalNotes={internalNotes}/>
      <components_1.DeferredFiles key={"documents-".concat(invoiceId)} resolve={invoiceData.files}>
        {function (resolvedFiles) { return (<SupplierInteraction_1.SupplierInteractionDocuments interactionId={invoiceData.interaction.id} attachments={resolvedFiles} id={invoiceId} type="Purchase Invoice"/>); }}
      </components_1.DeferredFiles>
      <PurchaseInvoice_1.PurchaseInvoiceDeliveryForm key={"delivery-".concat(invoiceId)} ref={deliveryFormRef} initialValues={deliveryInitialValues} currencyCode={initialValues.currencyCode || company.baseCurrencyCode} defaultCollapsed={false}/>
    </jsx_runtime_1.Fragment>);
}
var templateObject_1;
