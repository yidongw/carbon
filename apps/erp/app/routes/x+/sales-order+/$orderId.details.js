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
exports.default = SalesOrderDetailsRoute;
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
var SalesOrder_1 = require("~/modules/sales/ui/SalesOrder");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, orderId, _c, order, payment, shipment, _d, _e, _f, _g, _h, _j;
        var _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    client = (_p.sent()).client;
                    orderId = params.orderId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    return [4 /*yield*/, Promise.all([
                            (0, sales_1.getSalesOrder)(client, orderId),
                            (0, sales_1.getSalesOrderPayment)(client, orderId),
                            (0, sales_1.getSalesOrderShipment)(client, orderId)
                        ])];
                case 2:
                    _c = _p.sent(), order = _c[0], payment = _c[1], shipment = _c[2];
                    if (!(order.error || !order.data)) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.salesOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(order.error, "Failed to load order"))];
                case 3: throw _d.apply(void 0, _e.concat([_p.sent()]));
                case 4:
                    if (!payment.error) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.salesOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(payment.error, "Failed to load order payment"))];
                case 5: throw _f.apply(void 0, _g.concat([_p.sent()]));
                case 6:
                    if (!shipment.error) return [3 /*break*/, 8];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.salesOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(shipment.error, "Failed to load order shipment"))];
                case 7: throw _h.apply(void 0, _j.concat([_p.sent()]));
                case 8: return [2 /*return*/, {
                        orderId: orderId,
                        internalNotes: ((_l = (_k = order.data) === null || _k === void 0 ? void 0 : _k.internalNotes) !== null && _l !== void 0 ? _l : {}),
                        externalNotes: ((_o = (_m = order.data) === null || _m === void 0 ? void 0 : _m.externalNotes) !== null && _o !== void 0 ? _o : {}),
                        payment: payment.data,
                        shipment: shipment.data,
                        salesOrder: order.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var viewClient, id, salesOrder, _c, _d, _e, client, companyGroupId, userId, formData, validation, result, _f, _g, _h, _j;
        var _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "sales"
                        })];
                case 1:
                    viewClient = (_l.sent()).client;
                    id = params.orderId;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, sales_1.getSalesOrder)(viewClient, id)];
                case 2:
                    salesOrder = _l.sent();
                    if (!salesOrder.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.salesOrder(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(salesOrder.error, "Failed to load sales order"))];
                case 3: throw _c.apply(void 0, _d.concat([_l.sent()]));
                case 4: return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                        request: request,
                        isLocked: (0, sales_1.isSalesOrderLocked)((_k = salesOrder.data) === null || _k === void 0 ? void 0 : _k.status),
                        redirectTo: path_1.path.to.salesOrder(id),
                        message: "Cannot modify a locked sales order. Reopen it first."
                    })];
                case 5:
                    _l.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 6:
                    _e = _l.sent(), client = _e.client, companyGroupId = _e.companyGroupId, userId = _e.userId;
                    return [4 /*yield*/, request.formData()];
                case 7:
                    formData = _l.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.salesOrderValidator).validate(formData)];
                case 8:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, sales_1.updateSalesOrder)(client, {
                            id: id,
                            status: validation.data.status,
                            currencyCode: validation.data.currencyCode,
                            orderDate: validation.data.orderDate,
                            customerId: validation.data.customerId,
                            customerContactId: validation.data.customerContactId || null,
                            customerLocationId: validation.data.customerLocationId || null,
                            notes: validation.data.notes,
                            customFields: (0, form_2.setCustomFields)(formData),
                            updatedBy: userId
                        }, companyGroupId)];
                case 9:
                    result = _l.sent();
                    if (!result.error) return [3 /*break*/, 11];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.salesOrder(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update order"))];
                case 10: throw _f.apply(void 0, _g.concat([_l.sent()]));
                case 11:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.salesOrder(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated order"))];
                case 12: throw _h.apply(void 0, _j.concat([_l.sent()]));
            }
        });
    });
}
function SalesOrderDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    var t = (0, macro_1.useLingui)().t;
    var _3 = (0, react_router_1.useLoaderData)(), internalNotes = _3.internalNotes, externalNotes = _3.externalNotes, payment = _3.payment, shipment = _3.shipment, salesOrder = _3.salesOrder, orderId = _3.orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var orderData = (0, hooks_1.useRouteData)(path_1.path.to.salesOrder(orderId));
    if (!orderData)
        throw new Error("Could not find order data");
    var shipmentFormRef = (0, react_1.useRef)(null);
    var handleEditShippingCost = function () {
        var _a;
        (_a = shipmentFormRef.current) === null || _a === void 0 ? void 0 : _a.focusShippingCost();
    };
    var shipmentInitialValues = __assign({ id: orderId, locationId: (_b = (_a = shipment === null || shipment === void 0 ? void 0 : shipment.locationId) !== null && _a !== void 0 ? _a : salesOrder.locationId) !== null && _b !== void 0 ? _b : "", shippingMethodId: (_c = shipment === null || shipment === void 0 ? void 0 : shipment.shippingMethodId) !== null && _c !== void 0 ? _c : "", shippingTermId: (_d = shipment === null || shipment === void 0 ? void 0 : shipment.shippingTermId) !== null && _d !== void 0 ? _d : "", trackingNumber: (_e = shipment === null || shipment === void 0 ? void 0 : shipment.trackingNumber) !== null && _e !== void 0 ? _e : "", receiptRequestedDate: (_g = (_f = shipment === null || shipment === void 0 ? void 0 : shipment.receiptRequestedDate) !== null && _f !== void 0 ? _f : salesOrder.receiptRequestedDate) !== null && _g !== void 0 ? _g : "", receiptPromisedDate: (_j = (_h = shipment === null || shipment === void 0 ? void 0 : shipment.receiptPromisedDate) !== null && _h !== void 0 ? _h : salesOrder.receiptPromisedDate) !== null && _j !== void 0 ? _j : "", deliveryDate: (_k = shipment === null || shipment === void 0 ? void 0 : shipment.deliveryDate) !== null && _k !== void 0 ? _k : "", notes: (_l = shipment === null || shipment === void 0 ? void 0 : shipment.notes) !== null && _l !== void 0 ? _l : "", dropShipment: (_m = shipment === null || shipment === void 0 ? void 0 : shipment.dropShipment) !== null && _m !== void 0 ? _m : false, customerId: (_p = (_o = shipment === null || shipment === void 0 ? void 0 : shipment.customerId) !== null && _o !== void 0 ? _o : salesOrder.customerId) !== null && _p !== void 0 ? _p : "", customerLocationId: (_r = (_q = shipment === null || shipment === void 0 ? void 0 : shipment.customerLocationId) !== null && _q !== void 0 ? _q : salesOrder.customerLocationId) !== null && _r !== void 0 ? _r : "", shippingCost: (_s = shipment === null || shipment === void 0 ? void 0 : shipment.shippingCost) !== null && _s !== void 0 ? _s : 0, incoterm: (_t = shipment === null || shipment === void 0 ? void 0 : shipment.incoterm) !== null && _t !== void 0 ? _t : undefined, incotermLocation: (_u = shipment === null || shipment === void 0 ? void 0 : shipment.incotermLocation) !== null && _u !== void 0 ? _u : "" }, (0, form_2.getCustomFields)(shipment === null || shipment === void 0 ? void 0 : shipment.customFields));
    var paymentInitialValues = __assign({ id: orderId, invoiceCustomerId: (_w = (_v = payment === null || payment === void 0 ? void 0 : payment.invoiceCustomerId) !== null && _v !== void 0 ? _v : salesOrder.customerId) !== null && _w !== void 0 ? _w : "", invoiceCustomerLocationId: (_y = (_x = payment === null || payment === void 0 ? void 0 : payment.invoiceCustomerLocationId) !== null && _x !== void 0 ? _x : salesOrder.customerLocationId) !== null && _y !== void 0 ? _y : "", invoiceCustomerContactId: (_0 = (_z = payment === null || payment === void 0 ? void 0 : payment.invoiceCustomerContactId) !== null && _z !== void 0 ? _z : salesOrder.customerContactId) !== null && _0 !== void 0 ? _0 : "", paymentTermId: (_1 = payment === null || payment === void 0 ? void 0 : payment.paymentTermId) !== null && _1 !== void 0 ? _1 : "", paymentComplete: (_2 = payment === null || payment === void 0 ? void 0 : payment.paymentComplete) !== null && _2 !== void 0 ? _2 : false }, (0, form_2.getCustomFields)(payment === null || payment === void 0 ? void 0 : payment.customFields));
    return (<>
      <Opportunity_1.OpportunityState key={"state-".concat(orderId)} opportunity={orderData === null || orderData === void 0 ? void 0 : orderData.opportunity}/>
      <SalesOrder_1.SalesOrderSummary onEditShippingCost={handleEditShippingCost}/>

      <Opportunity_1.OpportunityNotes key={"notes-".concat(orderId)} id={orderData.salesOrder.id} table="salesOrder" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} internalNotes={internalNotes} externalNotes={externalNotes}/>
      <components_1.DeferredFiles key={"documents-".concat(orderId)} resolve={orderData.files}>
        {function (resolvedFiles) { return (<Opportunity_1.OpportunityDocuments opportunity={orderData.opportunity} attachments={resolvedFiles} id={orderId} type="Sales Order"/>); }}
      </components_1.DeferredFiles>

      <SalesOrder_1.SalesOrderShipmentForm key={"shipment-".concat(orderId)} ref={shipmentFormRef} initialValues={shipmentInitialValues}/>

      <SalesOrder_1.SalesOrderPaymentForm key={"payment-".concat(orderId)} initialValues={paymentInitialValues}/>
    </>);
}
var templateObject_1;
