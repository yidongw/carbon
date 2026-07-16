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
exports.default = ShipmentDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var Shipments_1 = require("~/modules/inventory/ui/Shipments");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, validation, _d, id, d, currentShipment, _e, _f, shipmentDataHasChanged, serviceRole, _g, salesOrderShipment, _h, _j, purchaseOrderShipment, _k, _l, warehouseTransferShipment, _m, _o, updateShipment, _p, _q, _r, _s;
        var request = _b.request;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "inventory"
                        })];
                case 1:
                    _c = _t.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _t.sent();
                    return [4 /*yield*/, (0, form_1.validator)(inventory_1.shipmentValidator).validate(formData)];
                case 3:
                    validation = _t.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    if (!id)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, inventory_1.getShipment)(client, id)];
                case 4:
                    currentShipment = _t.sent();
                    if (!currentShipment.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(currentShipment.error, "Failed to load shipment"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_t.sent()]))];
                case 6:
                    shipmentDataHasChanged = currentShipment.data.sourceDocument !== d.sourceDocument ||
                        currentShipment.data.sourceDocumentId !== d.sourceDocumentId ||
                        currentShipment.data.locationId !== d.locationId;
                    if (!shipmentDataHasChanged) return [3 /*break*/, 21];
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    _g = d.sourceDocument;
                    switch (_g) {
                        case "Sales Order": return [3 /*break*/, 7];
                        case "Purchase Order": return [3 /*break*/, 11];
                        case "Outbound Transfer": return [3 /*break*/, 15];
                    }
                    return [3 /*break*/, 19];
                case 7: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "shipmentFromSalesOrder",
                            companyId: companyId,
                            locationId: d.locationId,
                            salesOrderId: d.sourceDocumentId,
                            shipmentId: id,
                            userId: userId
                        }
                    })];
                case 8:
                    salesOrderShipment = _t.sent();
                    if (!(!salesOrderShipment.data || salesOrderShipment.error)) return [3 /*break*/, 10];
                    console.error(salesOrderShipment.error);
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.shipment(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(salesOrderShipment.error, "Failed to create shipment"))];
                case 9: throw _h.apply(void 0, _j.concat([_t.sent()]));
                case 10: return [3 /*break*/, 20];
                case 11: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "shipmentFromPurchaseOrder",
                            companyId: companyId,
                            locationId: d.locationId,
                            purchaseOrderId: d.sourceDocumentId,
                            shipmentId: id,
                            userId: userId
                        }
                    })];
                case 12:
                    purchaseOrderShipment = _t.sent();
                    if (!(!purchaseOrderShipment.data || purchaseOrderShipment.error)) return [3 /*break*/, 14];
                    console.error(purchaseOrderShipment.error);
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.shipment(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseOrderShipment.error, "Failed to create shipment"))];
                case 13: throw _k.apply(void 0, _l.concat([_t.sent()]));
                case 14: return [3 /*break*/, 20];
                case 15: return [4 /*yield*/, serviceRole.functions.invoke("create", {
                        body: {
                            type: "shipmentFromWarehouseTransfer",
                            companyId: companyId,
                            warehouseTransferId: d.sourceDocumentId,
                            shipmentId: id,
                            userId: userId
                        }
                    })];
                case 16:
                    warehouseTransferShipment = _t.sent();
                    if (!(!warehouseTransferShipment.data ||
                        warehouseTransferShipment.error)) return [3 /*break*/, 18];
                    console.error(warehouseTransferShipment.error);
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.shipment(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(warehouseTransferShipment.error, "Failed to create shipment"))];
                case 17: throw _m.apply(void 0, _o.concat([_t.sent()]));
                case 18: return [3 /*break*/, 20];
                case 19: throw new Error("Unsupported source document: ".concat(d.sourceDocument));
                case 20: return [3 /*break*/, 24];
                case 21: return [4 /*yield*/, (0, inventory_1.upsertShipment)(client, __assign(__assign({ id: id }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 22:
                    updateShipment = _t.sent();
                    if (!updateShipment.error) return [3 /*break*/, 24];
                    _p = react_router_1.data;
                    _q = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateShipment.error, "Failed to update shipment"))];
                case 23: return [2 /*return*/, _p.apply(void 0, _q.concat([_t.sent()]))];
                case 24:
                    _r = react_router_1.redirect;
                    _s = [path_1.path.to.shipment(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated shipment"))];
                case 25: throw _r.apply(void 0, _s.concat([_t.sent()]));
            }
        });
    });
}
function ShipmentDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g;
    var shipmentId = (0, react_router_1.useParams)().shipmentId;
    if (!shipmentId)
        throw new Error("Could not find shipmentId");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.shipment(shipmentId));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.shipment))
        throw new Error("Could not find shipment in routeData");
    var initialValues = __assign(__assign(__assign({}, routeData.shipment), { shipmentId: (_a = routeData.shipment.shipmentId) !== null && _a !== void 0 ? _a : undefined, trackingNumber: (_b = routeData.shipment.trackingNumber) !== null && _b !== void 0 ? _b : undefined, shippingMethodId: (_c = routeData.shipment.shippingMethodId) !== null && _c !== void 0 ? _c : undefined, sourceDocument: ((_d = routeData.shipment.sourceDocument) !== null && _d !== void 0 ? _d : "Sales Order"), sourceDocumentId: (_e = routeData.shipment.sourceDocumentId) !== null && _e !== void 0 ? _e : undefined, sourceDocumentReadableId: (_f = routeData.shipment.sourceDocumentReadableId) !== null && _f !== void 0 ? _f : undefined, locationId: (_g = routeData.shipment.locationId) !== null && _g !== void 0 ? _g : undefined }), (0, form_2.getCustomFields)(routeData.shipment.customFields));
    return (<>
      <Shipments_1.ShipmentForm key={initialValues.sourceDocumentId} 
    // @ts-ignore
    initialValues={initialValues} status={routeData.shipment.status} shipmentLines={routeData.shipmentLines}/>

      <Shipments_1.ShipmentLines />

      <Shipments_1.ShipmentNotes key={"notes-".concat(initialValues.id)} id={shipmentId} internalNotes={routeData.shipment.internalNotes} externalNotes={routeData.shipment.externalNotes}/>
    </>);
}
