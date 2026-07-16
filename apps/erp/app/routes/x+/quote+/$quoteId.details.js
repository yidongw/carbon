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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = QuoteDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var sales_1 = require("~/modules/sales");
var Opportunity_1 = require("~/modules/sales/ui/Opportunity");
var Quotes_1 = require("~/modules/sales/ui/Quotes");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, quoteId, quote, _c, _d;
        var _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    client = (_j.sent()).client;
                    quoteId = params.quoteId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    return [4 /*yield*/, (0, sales_1.getQuote)(client, quoteId)];
                case 2:
                    quote = _j.sent();
                    if (!quote.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.quotes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quote.error, "Failed to load quote"))];
                case 3: throw _c.apply(void 0, _d.concat([_j.sent()]));
                case 4: return [2 /*return*/, {
                        internalNotes: ((_f = (_e = quote.data) === null || _e === void 0 ? void 0 : _e.internalNotes) !== null && _f !== void 0 ? _f : {}),
                        externalNotes: ((_h = (_g = quote.data) === null || _g === void 0 ? void 0 : _g.externalNotes) !== null && _h !== void 0 ? _h : {})
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyGroupId, userId, id, viewClient, quote, formData, validation, result, _d, _e, _f, _g;
        var _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    id = params.quoteId;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "sales"
                        })];
                case 2:
                    viewClient = (_j.sent()).client;
                    return [4 /*yield*/, (0, sales_1.getQuote)(viewClient, id)];
                case 3:
                    quote = _j.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, sales_1.isQuoteLocked)((_h = quote.data) === null || _h === void 0 ? void 0 : _h.status),
                            redirectTo: path_1.path.to.quote(id),
                            message: "Cannot modify a locked quote. Reopen it first."
                        })];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.quoteValidator).validate(formData)];
                case 6:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, sales_1.updateQuote)(client, {
                            id: id,
                            status: validation.data.status,
                            currencyCode: validation.data.currencyCode,
                            expirationDate: validation.data.expirationDate || null,
                            customerId: validation.data.customerId,
                            customerContactId: validation.data.customerContactId || null,
                            customerLocationId: validation.data.customerLocationId || null,
                            customerEngineeringContactId: validation.data.customerEngineeringContactId || null,
                            customerReference: validation.data.customerReference || null,
                            salesPersonId: validation.data.salesPersonId || null,
                            estimatorId: validation.data.estimatorId || null,
                            locationId: validation.data.locationId,
                            dueDate: validation.data.dueDate || null,
                            digitalQuoteAcceptedBy: validation.data.digitalQuoteAcceptedBy || null,
                            digitalQuoteAcceptedByEmail: validation.data.digitalQuoteAcceptedByEmail || null,
                            notes: validation.data.notes,
                            customFields: (0, form_2.setCustomFields)(formData),
                            updatedBy: userId
                        }, companyGroupId)];
                case 7:
                    result = _j.sent();
                    if (!result.error) return [3 /*break*/, 9];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.quote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update quote"))];
                case 8: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 9:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.quote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated quote"))];
                case 10: throw _f.apply(void 0, _g.concat([_j.sent()]));
            }
        });
    });
}
function QuoteDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23;
    var t = (0, macro_1.useLingui)().t;
    var _24 = (0, react_router_1.useLoaderData)(), internalNotes = _24.internalNotes, externalNotes = _24.externalNotes;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    var quoteData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    if (!quoteData)
        throw new Error("Could not find quote data");
    var shipmentFormRef = (0, react_1.useRef)(null);
    var handleEditShippingCost = function () {
        var _a;
        (_a = shipmentFormRef.current) === null || _a === void 0 ? void 0 : _a.focusShippingCost();
    };
    var initialValues = {
        id: (_b = (_a = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "",
        customerId: (_d = (_c = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _c === void 0 ? void 0 : _c.customerId) !== null && _d !== void 0 ? _d : "",
        customerLocationId: (_f = (_e = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _e === void 0 ? void 0 : _e.customerLocationId) !== null && _f !== void 0 ? _f : "",
        customerContactId: (_h = (_g = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _g === void 0 ? void 0 : _g.customerContactId) !== null && _h !== void 0 ? _h : "",
        customerReference: (_k = (_j = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _j === void 0 ? void 0 : _j.customerReference) !== null && _k !== void 0 ? _k : "",
        dueDate: (_m = (_l = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _l === void 0 ? void 0 : _l.dueDate) !== null && _m !== void 0 ? _m : "",
        estimatorId: (_p = (_o = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _o === void 0 ? void 0 : _o.estimatorId) !== null && _p !== void 0 ? _p : "",
        expirationDate: (_r = (_q = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _q === void 0 ? void 0 : _q.expirationDate) !== null && _r !== void 0 ? _r : "",
        locationId: (_t = (_s = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _s === void 0 ? void 0 : _s.locationId) !== null && _t !== void 0 ? _t : "",
        quoteId: (_v = (_u = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _u === void 0 ? void 0 : _u.quoteId) !== null && _v !== void 0 ? _v : "",
        salesPersonId: (_x = (_w = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _w === void 0 ? void 0 : _w.salesPersonId) !== null && _x !== void 0 ? _x : "",
        status: (_z = (_y = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _y === void 0 ? void 0 : _y.status) !== null && _z !== void 0 ? _z : "Draft",
        currencyCode: (_1 = (_0 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _0 === void 0 ? void 0 : _0.currencyCode) !== null && _1 !== void 0 ? _1 : undefined,
        exchangeRate: (_3 = (_2 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _2 === void 0 ? void 0 : _2.exchangeRate) !== null && _3 !== void 0 ? _3 : undefined,
        exchangeRateUpdatedAt: (_5 = (_4 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _4 === void 0 ? void 0 : _4.exchangeRateUpdatedAt) !== null && _5 !== void 0 ? _5 : ""
    };
    var shipmentInitialValues = {
        id: quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment.id,
        locationId: (_7 = (_6 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _6 === void 0 ? void 0 : _6.locationId) !== null && _7 !== void 0 ? _7 : "",
        shippingMethodId: (_9 = (_8 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _8 === void 0 ? void 0 : _8.shippingMethodId) !== null && _9 !== void 0 ? _9 : "",
        shippingTermId: (_11 = (_10 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _10 === void 0 ? void 0 : _10.shippingTermId) !== null && _11 !== void 0 ? _11 : "",
        receiptRequestedDate: (_13 = (_12 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _12 === void 0 ? void 0 : _12.receiptRequestedDate) !== null && _13 !== void 0 ? _13 : "",
        shippingCost: (_15 = (_14 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _14 === void 0 ? void 0 : _14.shippingCost) !== null && _15 !== void 0 ? _15 : 0,
        incoterm: (_17 = (_16 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _16 === void 0 ? void 0 : _16.incoterm) !== null && _17 !== void 0 ? _17 : undefined,
        incotermLocation: (_19 = (_18 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _18 === void 0 ? void 0 : _18.incotermLocation) !== null && _19 !== void 0 ? _19 : ""
    };
    var paymentInitialValues = __assign(__assign({}, quoteData === null || quoteData === void 0 ? void 0 : quoteData.payment), { invoiceCustomerId: (_20 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.payment.invoiceCustomerId) !== null && _20 !== void 0 ? _20 : "", invoiceCustomerLocationId: (_21 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.payment.invoiceCustomerLocationId) !== null && _21 !== void 0 ? _21 : "", invoiceCustomerContactId: (_22 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.payment.invoiceCustomerContactId) !== null && _22 !== void 0 ? _22 : "", paymentTermId: (_23 = quoteData === null || quoteData === void 0 ? void 0 : quoteData.payment.paymentTermId) !== null && _23 !== void 0 ? _23 : "" });
    return (<>
      <Opportunity_1.OpportunityState key={"state-".concat(initialValues.id)} opportunity={quoteData === null || quoteData === void 0 ? void 0 : quoteData.opportunity}/>
      <Quotes_1.QuoteSummary key={quoteId} onEditShippingCost={handleEditShippingCost}/>
      <Opportunity_1.OpportunityNotes key={"notes-".concat(initialValues.id)} id={quoteData.quote.id} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} table="quote" internalNotes={internalNotes} externalNotes={externalNotes}/>
      <components_1.DeferredFiles key={"documents-".concat(quoteId)} resolve={quoteData.files}>
        {function (resolvedFiles) { return (<Opportunity_1.OpportunityDocuments opportunity={quoteData.opportunity} attachments={resolvedFiles} id={quoteId} type="Quote"/>); }}
      </components_1.DeferredFiles>
      <Quotes_1.QuotePaymentForm key={"payment-".concat(initialValues.id)} initialValues={paymentInitialValues}/>
      <Quotes_1.QuoteShipmentForm key={"shipment-".concat(initialValues.id)} ref={shipmentFormRef} initialValues={shipmentInitialValues}/>
    </>);
}
var templateObject_1;
