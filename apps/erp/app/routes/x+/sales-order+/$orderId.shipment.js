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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var orderId, viewClient, salesOrder, _c, client, userId, formData, validation, updateSalesOrderShipment, _d, _e, _f, _g;
        var _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    orderId = params.orderId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "sales"
                        })];
                case 1:
                    viewClient = (_j.sent()).client;
                    return [4 /*yield*/, (0, sales_1.getSalesOrder)(viewClient, orderId)];
                case 2:
                    salesOrder = _j.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, sales_1.isSalesOrderLocked)((_h = salesOrder.data) === null || _h === void 0 ? void 0 : _h.status),
                            redirectTo: path_1.path.to.salesOrderDetails(orderId),
                            message: "Cannot modify a locked sales order. Reopen it first."
                        })];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 4:
                    _c = _j.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.salesOrderShipmentValidator).validate(formData)];
                case 6:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, sales_1.upsertSalesOrderShipment)(client, __assign(__assign({}, validation.data), { id: orderId, updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 7:
                    updateSalesOrderShipment = _j.sent();
                    if (!updateSalesOrderShipment.error) return [3 /*break*/, 9];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.salesOrderDetails(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateSalesOrderShipment.error, "Failed to update sales order shipment"))];
                case 8: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 9:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.salesOrderDetails(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated sales order shipment"))];
                case 10: throw _f.apply(void 0, _g.concat([_j.sent()]));
            }
        });
    });
}
