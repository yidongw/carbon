"use strict";
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
exports.action = action;
exports.default = NewPurchaseInvoiceLineRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var invoicing_1 = require("~/modules/invoicing");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var invoiceId, viewClient, purchaseInvoice, _c, _d, _e, client, companyId, userId, formData, validation, _f, id, d, createPurchaseInvoiceLine, _g, _h;
        var _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    invoiceId = params.invoiceId;
                    if (!invoiceId)
                        throw new Error("Could not find invoiceId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "invoicing"
                        })];
                case 1:
                    viewClient = (_k.sent()).client;
                    return [4 /*yield*/, (0, invoicing_1.getPurchaseInvoice)(viewClient, invoiceId)];
                case 2:
                    purchaseInvoice = _k.sent();
                    if (!purchaseInvoice.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.purchaseInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseInvoice.error, "Failed to load purchase invoice"))];
                case 3: throw _c.apply(void 0, _d.concat([_k.sent()]));
                case 4: return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                        request: request,
                        isLocked: (0, invoicing_1.isPurchaseInvoiceLocked)((_j = purchaseInvoice.data) === null || _j === void 0 ? void 0 : _j.status),
                        redirectTo: path_1.path.to.purchaseInvoiceDetails(invoiceId),
                        message: "Cannot modify a confirmed purchase invoice."
                    })];
                case 5:
                    _k.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "invoicing"
                        })];
                case 6:
                    _e = _k.sent(), client = _e.client, companyId = _e.companyId, userId = _e.userId;
                    return [4 /*yield*/, request.formData()];
                case 7:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(invoicing_1.purchaseInvoiceLineValidator).validate(formData)];
                case 8:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, id = _f.id, d = __rest(_f, ["id"]);
                    return [4 /*yield*/, (0, invoicing_1.upsertPurchaseInvoiceLine)(client, __assign(__assign({}, d), { companyId: companyId, createdBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 9:
                    createPurchaseInvoiceLine = _k.sent();
                    if (!createPurchaseInvoiceLine.error) return [3 /*break*/, 11];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.purchaseInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createPurchaseInvoiceLine.error, "Failed to create purchase invoice line."))];
                case 10: throw _g.apply(void 0, _h.concat([_k.sent()]));
                case 11: throw (0, react_router_1.redirect)(path_1.path.to.purchaseInvoiceDetails(invoiceId));
            }
        });
    });
}
function NewPurchaseInvoiceLineRoute() {
    var _a, _b, _c, _d, _e;
    var defaults = (0, hooks_1.useUser)().defaults;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("Could not find purchase invoice id");
    var purchaseInvoiceData = (0, react_1.useRouteData)(path_1.path.to.purchaseInvoice(invoiceId));
    if (!invoiceId)
        throw new Error("Could not find purchase invoice id");
    var initialValues = {
        invoiceId: invoiceId,
        invoiceLineType: "Item",
        purchaseQuantity: 1,
        locationId: (_c = (_b = (_a = purchaseInvoiceData === null || purchaseInvoiceData === void 0 ? void 0 : purchaseInvoiceData.purchaseInvoice) === null || _a === void 0 ? void 0 : _a.locationId) !== null && _b !== void 0 ? _b : defaults.locationId) !== null && _c !== void 0 ? _c : "",
        supplierUnitPrice: 0,
        supplierShippingCost: 0,
        supplierTaxAmount: 0,
        exchangeRate: (_e = (_d = purchaseInvoiceData === null || purchaseInvoiceData === void 0 ? void 0 : purchaseInvoiceData.purchaseInvoice) === null || _d === void 0 ? void 0 : _d.exchangeRate) !== null && _e !== void 0 ? _e : 1
    };
    return <invoicing_1.PurchaseInvoiceLineForm initialValues={initialValues}/>;
}
