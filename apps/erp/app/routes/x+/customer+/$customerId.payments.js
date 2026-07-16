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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = CustomerPaymentRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var Customer_1 = require("~/modules/sales/ui/Customer");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, customerId, customerPayment, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    customerId = params.customerId;
                    if (!customerId)
                        throw new Error("Could not find customerId");
                    return [4 /*yield*/, (0, sales_1.getCustomerPayment)(client, customerId)];
                case 2:
                    customerPayment = _e.sent();
                    if (!(customerPayment.error || !customerPayment.data)) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.customer(customerId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(customerPayment.error, "Failed to load customer payment terms"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, {
                        customerPayment: customerPayment.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, customerId, validation, _d, _e, update, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, userId = _c.userId;
                    customerId = params.customerId;
                    if (!customerId)
                        throw new Error("Could not find customerId");
                    _e = (_d = (0, form_1.validator)(sales_1.customerPaymentValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_k.sent()])];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, sales_1.updateCustomerPayment)(client, __assign(__assign({}, validation.data), { customerId: customerId, updatedBy: userId }))];
                case 4:
                    update = _k.sent();
                    if (!update.error) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.customer(customerId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update customer payment terms"))];
                case 5: throw _f.apply(void 0, _g.concat([_k.sent()]));
                case 6:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.customerPayment(customerId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated customer payment terms"))];
                case 7: throw _h.apply(void 0, _j.concat([_k.sent()]));
            }
        });
    });
}
function CustomerPaymentRoute() {
    var _a, _b, _c, _d, _e;
    var customerPayment = (0, react_router_1.useLoaderData)().customerPayment;
    var initialValues = {
        customerId: (_a = customerPayment === null || customerPayment === void 0 ? void 0 : customerPayment.customerId) !== null && _a !== void 0 ? _a : "",
        invoiceCustomerId: (_b = customerPayment === null || customerPayment === void 0 ? void 0 : customerPayment.invoiceCustomerId) !== null && _b !== void 0 ? _b : "",
        invoiceCustomerContactId: (_c = customerPayment === null || customerPayment === void 0 ? void 0 : customerPayment.invoiceCustomerContactId) !== null && _c !== void 0 ? _c : "",
        invoiceCustomerLocationId: (_d = customerPayment === null || customerPayment === void 0 ? void 0 : customerPayment.invoiceCustomerLocationId) !== null && _d !== void 0 ? _d : "",
        paymentTermId: (_e = customerPayment === null || customerPayment === void 0 ? void 0 : customerPayment.paymentTermId) !== null && _e !== void 0 ? _e : ""
    };
    return <Customer_1.CustomerPaymentForm initialValues={initialValues}/>;
}
