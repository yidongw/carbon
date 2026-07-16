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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shipments"], ["Shipments"]))),
    to: path_1.path.to.shipments
};
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, sourceDocument, sourceDocumentId, defaults, serviceRole, _d, salesOrderShipment, _e, _f, purchaseOrderShipment, _g, _h, warehouseTransferShipment, _j, _k, defaultShipment, _l, _m;
        var _o, _p, _q, _r, _s;
        var request = _b.request;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "inventory"
                    })];
                case 1:
                    _c = _t.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _t.sent();
                    sourceDocument = (_o = formData.get("sourceDocument")) !== null && _o !== void 0 ? _o : undefined;
                    sourceDocumentId = (_p = formData.get("sourceDocumentId")) !== null && _p !== void 0 ? _p : "";
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 3:
                    defaults = _t.sent();
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    _d = sourceDocument;
                    switch (_d) {
                        case "Sales Order": return [3 /*break*/, 4];
                        case "Purchase Order": return [3 /*break*/, 8];
                        case "Outbound Transfer": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 16];
                case 4: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "shipmentFromSalesOrder",
                            companyId: companyId,
                            locationId: (_q = defaults.data) === null || _q === void 0 ? void 0 : _q.locationId,
                            salesOrderId: sourceDocumentId,
                            shipmentId: undefined,
                            userId: userId
                        }
                    })];
                case 5:
                    salesOrderShipment = _t.sent();
                    if (!(!salesOrderShipment.data || salesOrderShipment.error)) return [3 /*break*/, 7];
                    console.error(salesOrderShipment.error);
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.salesOrder(sourceDocumentId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(salesOrderShipment.error, "Failed to create shipment"))];
                case 6: throw _e.apply(void 0, _f.concat([_t.sent()]));
                case 7: throw (0, react_router_1.redirect)(path_1.path.to.shipmentDetails(salesOrderShipment.data.id));
                case 8: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "shipmentFromPurchaseOrder",
                            companyId: companyId,
                            locationId: (_r = defaults.data) === null || _r === void 0 ? void 0 : _r.locationId,
                            purchaseOrderId: sourceDocumentId,
                            shipmentId: undefined,
                            userId: userId
                        }
                    })];
                case 9:
                    purchaseOrderShipment = _t.sent();
                    if (!(!purchaseOrderShipment.data || purchaseOrderShipment.error)) return [3 /*break*/, 11];
                    console.error(purchaseOrderShipment.error);
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.purchaseOrder(sourceDocumentId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseOrderShipment.error, "Failed to create shipment"))];
                case 10: throw _g.apply(void 0, _h.concat([_t.sent()]));
                case 11: throw (0, react_router_1.redirect)(path_1.path.to.shipmentDetails(purchaseOrderShipment.data.id));
                case 12: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "shipmentFromWarehouseTransfer",
                            companyId: companyId,
                            warehouseTransferId: sourceDocumentId,
                            shipmentId: undefined,
                            userId: userId
                        }
                    })];
                case 13:
                    warehouseTransferShipment = _t.sent();
                    if (!(!warehouseTransferShipment.data || warehouseTransferShipment.error)) return [3 /*break*/, 15];
                    console.error(warehouseTransferShipment.error);
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.warehouseTransferDetails(sourceDocumentId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(warehouseTransferShipment.error, "Failed to create shipment"))];
                case 14: throw _j.apply(void 0, _k.concat([_t.sent()]));
                case 15: throw (0, react_router_1.redirect)(path_1.path.to.shipmentDetails(warehouseTransferShipment.data.id));
                case 16: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "shipmentDefault",
                            companyId: companyId,
                            locationId: (_s = defaults.data) === null || _s === void 0 ? void 0 : _s.locationId,
                            userId: userId
                        }
                    })];
                case 17:
                    defaultShipment = _t.sent();
                    if (!(!defaultShipment.data || defaultShipment.error)) return [3 /*break*/, 19];
                    console.error(defaultShipment.error);
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.shipments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(auth_1.error, "Failed to create shipment"))];
                case 18: throw _l.apply(void 0, _m.concat([_t.sent()]));
                case 19: throw (0, react_router_1.redirect)(path_1.path.to.shipmentDetails(defaultShipment.data.id));
            }
        });
    });
}
var templateObject_1;
