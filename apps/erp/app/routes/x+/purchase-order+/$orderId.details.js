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
exports.default = PurchaseOrderBasicRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var purchasing_1 = require("~/modules/purchasing");
var PurchaseOrder_1 = require("~/modules/purchasing/ui/PurchaseOrder");
var SupplierInteraction_1 = require("~/modules/purchasing/ui/SupplierInteraction");
var SupplierInteractionState_1 = require("~/modules/purchasing/ui/SupplierInteraction/SupplierInteractionState");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, orderId, _c, purchaseOrder, purchaseOrderPayment, _d, _e;
        var _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing"
                    })];
                case 1:
                    client = (_k.sent()).client;
                    orderId = params.orderId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_1.getPurchaseOrder)(client, orderId),
                            (0, purchasing_1.getPurchaseOrderPayment)(client, orderId)
                        ])];
                case 2:
                    _c = _k.sent(), purchaseOrder = _c[0], purchaseOrderPayment = _c[1];
                    if (!purchaseOrderPayment.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.purchaseOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseOrderPayment.error, "Failed to load purchase order payment"))];
                case 3: throw _d.apply(void 0, _e.concat([_k.sent()]));
                case 4: return [2 /*return*/, {
                        purchaseOrderPayment: purchaseOrderPayment.data,
                        internalNotes: ((_g = (_f = purchaseOrder.data) === null || _f === void 0 ? void 0 : _f.internalNotes) !== null && _g !== void 0 ? _g : {}),
                        externalNotes: ((_j = (_h = purchaseOrder.data) === null || _h === void 0 ? void 0 : _h.externalNotes) !== null && _j !== void 0 ? _j : {})
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var orderId, viewClient, purchaseOrder, _c, _d, isLocked, _e, client, companyGroupId, userId, formData, validation, result, _f, _g, _h, _j;
        var _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    orderId = params.orderId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "purchasing"
                        })];
                case 1:
                    viewClient = (_l.sent()).client;
                    return [4 /*yield*/, (0, purchasing_1.getPurchaseOrder)(viewClient, orderId)];
                case 2:
                    purchaseOrder = _l.sent();
                    if (!purchaseOrder.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseOrder.error, "Failed to load purchase order"))];
                case 3: throw _c.apply(void 0, _d.concat([_l.sent()]));
                case 4:
                    isLocked = (0, purchasing_1.isPurchaseOrderLocked)((_k = purchaseOrder.data) === null || _k === void 0 ? void 0 : _k.status);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, __assign({}, (isLocked ? { delete: "purchasing" } : { update: "purchasing" })))];
                case 5:
                    _e = _l.sent(), client = _e.client, companyGroupId = _e.companyGroupId, userId = _e.userId;
                    // If locked, block all edits (no header changes allowed on locked POs)
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: isLocked,
                            redirectTo: path_1.path.to.purchaseOrder(orderId),
                            message: "Cannot modify a finalized purchase order. To make changes, please cancel this PO and create a new one."
                        })];
                case 6:
                    // If locked, block all edits (no header changes allowed on locked POs)
                    _l.sent();
                    return [4 /*yield*/, request.formData()];
                case 7:
                    formData = _l.sent();
                    return [4 /*yield*/, (0, form_1.validator)(purchasing_1.purchaseOrderValidator).validate(formData)];
                case 8:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, purchasing_1.updatePurchaseOrder)(client, {
                            id: orderId,
                            status: validation.data.status,
                            supplierId: validation.data.supplierId,
                            currencyCode: validation.data.currencyCode,
                            orderDate: validation.data.orderDate,
                            supplierContactId: validation.data.supplierContactId || null,
                            supplierLocationId: validation.data.supplierLocationId || null,
                            supplierReference: validation.data.supplierReference,
                            purchaseOrderType: validation.data.purchaseOrderType,
                            notes: validation.data.notes,
                            customFields: (0, form_2.setCustomFields)(formData),
                            updatedBy: userId
                        }, companyGroupId)];
                case 9:
                    result = _l.sent();
                    if (!result.error) return [3 /*break*/, 11];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update purchase order"))];
                case 10: throw _f.apply(void 0, _g.concat([_l.sent()]));
                case 11:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated purchase order"))];
                case 12: throw _h.apply(void 0, _j.concat([_l.sent()]));
            }
        });
    });
}
function PurchaseOrderBasicRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19;
    var t = (0, macro_1.useLingui)().t;
    var _20 = (0, react_router_1.useLoaderData)(), purchaseOrderPayment = _20.purchaseOrderPayment, internalNotes = _20.internalNotes, externalNotes = _20.externalNotes;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    var orderData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseOrder(orderId));
    if (!orderData)
        throw new Error("Could not find order data");
    var deliveryFormRef = (0, react_1.useRef)(null);
    var handleEditShippingCost = function () {
        var _a;
        (_a = deliveryFormRef.current) === null || _a === void 0 ? void 0 : _a.focusShippingCost();
    };
    var initialValues = __assign({ id: (_b = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "", purchaseOrderId: (_d = (_c = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _c === void 0 ? void 0 : _c.purchaseOrderId) !== null && _d !== void 0 ? _d : "", supplierId: (_f = (_e = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _e === void 0 ? void 0 : _e.supplierId) !== null && _f !== void 0 ? _f : "", supplierContactId: (_h = (_g = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _g === void 0 ? void 0 : _g.supplierContactId) !== null && _h !== void 0 ? _h : "", supplierLocationId: (_k = (_j = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _j === void 0 ? void 0 : _j.supplierLocationId) !== null && _k !== void 0 ? _k : "", supplierReference: (_m = (_l = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _l === void 0 ? void 0 : _l.supplierReference) !== null && _m !== void 0 ? _m : "", orderDate: (_p = (_o = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _o === void 0 ? void 0 : _o.orderDate) !== null && _p !== void 0 ? _p : "", type: "Purchase", status: (_r = (_q = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _q === void 0 ? void 0 : _q.status) !== null && _r !== void 0 ? _r : "Draft", receiptRequestedDate: (_t = (_s = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _s === void 0 ? void 0 : _s.receiptRequestedDate) !== null && _t !== void 0 ? _t : "", receiptPromisedDate: (_v = (_u = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _u === void 0 ? void 0 : _u.receiptPromisedDate) !== null && _v !== void 0 ? _v : "", currencyCode: (_x = (_w = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _w === void 0 ? void 0 : _w.currencyCode) !== null && _x !== void 0 ? _x : "" }, (0, form_2.getCustomFields)((_y = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrder) === null || _y === void 0 ? void 0 : _y.customFields));
    var delivery = orderData === null || orderData === void 0 ? void 0 : orderData.purchaseOrderDelivery;
    var deliveryInitialValues = __assign({ id: (_z = delivery === null || delivery === void 0 ? void 0 : delivery.id) !== null && _z !== void 0 ? _z : orderId, locationId: (_0 = delivery === null || delivery === void 0 ? void 0 : delivery.locationId) !== null && _0 !== void 0 ? _0 : "", supplierShippingCost: (_1 = delivery === null || delivery === void 0 ? void 0 : delivery.supplierShippingCost) !== null && _1 !== void 0 ? _1 : 0, shippingMethodId: (_2 = delivery === null || delivery === void 0 ? void 0 : delivery.shippingMethodId) !== null && _2 !== void 0 ? _2 : "", shippingTermId: (_3 = delivery === null || delivery === void 0 ? void 0 : delivery.shippingTermId) !== null && _3 !== void 0 ? _3 : "", trackingNumber: (_4 = delivery === null || delivery === void 0 ? void 0 : delivery.trackingNumber) !== null && _4 !== void 0 ? _4 : "", receiptRequestedDate: (_5 = delivery === null || delivery === void 0 ? void 0 : delivery.receiptRequestedDate) !== null && _5 !== void 0 ? _5 : "", receiptPromisedDate: (_6 = delivery === null || delivery === void 0 ? void 0 : delivery.receiptPromisedDate) !== null && _6 !== void 0 ? _6 : "", deliveryDate: (_7 = delivery === null || delivery === void 0 ? void 0 : delivery.deliveryDate) !== null && _7 !== void 0 ? _7 : "", notes: (_8 = delivery === null || delivery === void 0 ? void 0 : delivery.notes) !== null && _8 !== void 0 ? _8 : "", dropShipment: (_9 = delivery === null || delivery === void 0 ? void 0 : delivery.dropShipment) !== null && _9 !== void 0 ? _9 : false, customerId: (_10 = delivery === null || delivery === void 0 ? void 0 : delivery.customerId) !== null && _10 !== void 0 ? _10 : "", customerLocationId: (_11 = delivery === null || delivery === void 0 ? void 0 : delivery.customerLocationId) !== null && _11 !== void 0 ? _11 : "", incoterm: (_12 = delivery === null || delivery === void 0 ? void 0 : delivery.incoterm) !== null && _12 !== void 0 ? _12 : undefined, incotermLocation: (_13 = delivery === null || delivery === void 0 ? void 0 : delivery.incotermLocation) !== null && _13 !== void 0 ? _13 : "" }, (0, form_2.getCustomFields)(delivery === null || delivery === void 0 ? void 0 : delivery.customFields));
    var paymentInitialValues = __assign({ id: (_14 = purchaseOrderPayment === null || purchaseOrderPayment === void 0 ? void 0 : purchaseOrderPayment.id) !== null && _14 !== void 0 ? _14 : orderId, invoiceSupplierId: (_15 = purchaseOrderPayment === null || purchaseOrderPayment === void 0 ? void 0 : purchaseOrderPayment.invoiceSupplierId) !== null && _15 !== void 0 ? _15 : "", invoiceSupplierLocationId: (_16 = purchaseOrderPayment === null || purchaseOrderPayment === void 0 ? void 0 : purchaseOrderPayment.invoiceSupplierLocationId) !== null && _16 !== void 0 ? _16 : undefined, invoiceSupplierContactId: (_17 = purchaseOrderPayment === null || purchaseOrderPayment === void 0 ? void 0 : purchaseOrderPayment.invoiceSupplierContactId) !== null && _17 !== void 0 ? _17 : undefined, paymentTermId: (_18 = purchaseOrderPayment === null || purchaseOrderPayment === void 0 ? void 0 : purchaseOrderPayment.paymentTermId) !== null && _18 !== void 0 ? _18 : undefined, paymentComplete: (_19 = purchaseOrderPayment === null || purchaseOrderPayment === void 0 ? void 0 : purchaseOrderPayment.paymentComplete) !== null && _19 !== void 0 ? _19 : undefined }, (0, form_2.getCustomFields)(purchaseOrderPayment === null || purchaseOrderPayment === void 0 ? void 0 : purchaseOrderPayment.customFields));
    var company = (0, hooks_1.useUser)().company;
    return (<>
      <SupplierInteractionState_1.default interaction={orderData.interaction}/>
      <PurchaseOrder_1.PurchaseOrderSummary onEditShippingCost={handleEditShippingCost}/>
      <SupplierInteraction_1.SupplierInteractionNotes key={"notes-".concat(initialValues.id)} id={orderData.purchaseOrder.id} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} table="purchaseOrder" internalNotes={internalNotes} externalNotes={externalNotes}/>
      <components_1.DeferredFiles key={"documents-".concat(orderId)} resolve={orderData.files}>
        {function (resolvedFiles) { return (<SupplierInteraction_1.SupplierInteractionDocuments attachments={resolvedFiles} id={orderId} interactionId={orderData.purchaseOrder.supplierInteractionId} type="Purchase Order"/>); }}
      </components_1.DeferredFiles>
      <PurchaseOrder_1.PurchaseOrderDeliveryForm key={"delivery-".concat(orderId)} ref={deliveryFormRef} initialValues={deliveryInitialValues} currencyCode={initialValues.currencyCode || company.baseCurrencyCode} defaultCollapsed={false}/>

      <PurchaseOrder_1.PurchaseOrderPaymentForm key={"payment-".concat(orderId)} initialValues={paymentInitialValues}/>
    </>);
}
var templateObject_1;
