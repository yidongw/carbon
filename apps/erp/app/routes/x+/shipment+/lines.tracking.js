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
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, formData, shipmentLineId, shipmentId, trackingType, trackedEntityId, trackedEntityResponse, _d, _e, trackedEntity, _f, _g, serviceRole, existingAttributes, newAttributes, quantity, _h, _j, index, staleQuery, index, staleResponse, updateResponse, _k, _l;
        var request = _b.request;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "inventory"
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _m.sent();
                    shipmentLineId = formData.get("shipmentLineId");
                    shipmentId = formData.get("shipmentId");
                    trackingType = formData.get("trackingType");
                    trackedEntityId = formData.get("trackedEntityId");
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .eq("id", trackedEntityId)
                            .eq("companyId", companyId)
                            .single()];
                case 3:
                    trackedEntityResponse = _m.sent();
                    if (!trackedEntityResponse.error) return [3 /*break*/, 5];
                    _d = react_router_1.data;
                    _e = [{ success: false, error: trackedEntityResponse.error.message }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(trackedEntityResponse.error, trackedEntityResponse.error.message))];
                case 4: return [2 /*return*/, _d.apply(void 0, _e.concat([_m.sent()]))];
                case 5:
                    trackedEntity = trackedEntityResponse.data;
                    if (!(trackedEntity.status !== "Available")) return [3 /*break*/, 7];
                    _f = react_router_1.data;
                    _g = [{
                            success: false,
                            error: "Tracked entity is not available. Current status: ".concat(trackedEntity.status)
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Tracked entity is not available. Current status: ".concat(trackedEntity.status)))];
                case 6: return [2 /*return*/, _f.apply(void 0, _g.concat([_m.sent()]))];
                case 7: return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 8:
                    serviceRole = _m.sent();
                    existingAttributes = trackedEntity.attributes || {};
                    newAttributes = __assign({}, existingAttributes);
                    if (!(trackingType === "batch")) return [3 /*break*/, 11];
                    quantity = Number(formData.get("quantity"));
                    if (!(trackedEntity.quantity < quantity)) return [3 /*break*/, 10];
                    _h = react_router_1.data;
                    _j = [{ success: false, error: "Batch has insufficient quantity" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Batch has insufficient quantity"))];
                case 9: return [2 /*return*/, _h.apply(void 0, _j.concat([_m.sent()]))];
                case 10:
                    // Add batch-specific attributes
                    newAttributes = __assign(__assign({}, newAttributes), { "Shipment Line": shipmentLineId, Shipment: shipmentId });
                    return [3 /*break*/, 12];
                case 11:
                    if (trackingType === "serial") {
                        index = Number(formData.get("index"));
                        // Add serial-specific attributes
                        newAttributes = __assign(__assign({}, newAttributes), { "Shipment Line": shipmentLineId, Shipment: shipmentId, "Shipment Line Index": index });
                    }
                    _m.label = 12;
                case 12:
                    staleQuery = serviceRole
                        .from("trackedEntity")
                        .select("id, attributes")
                        .eq("companyId", companyId)
                        .eq("attributes ->> Shipment Line", shipmentLineId)
                        .neq("id", trackedEntityId);
                    if (trackingType === "serial") {
                        index = Number(formData.get("index"));
                        staleQuery = staleQuery.eq("attributes ->> Shipment Line Index", String(index));
                    }
                    return [4 /*yield*/, staleQuery];
                case 13:
                    staleResponse = _m.sent();
                    if (!(staleResponse.data && staleResponse.data.length > 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, Promise.all(staleResponse.data.map(function (stale) {
                            var _a;
                            var cleaned = __assign({}, ((_a = stale.attributes) !== null && _a !== void 0 ? _a : {}));
                            delete cleaned["Shipment Line"];
                            delete cleaned.Shipment;
                            delete cleaned["Shipment Line Index"];
                            return serviceRole
                                .from("trackedEntity")
                                .update({ attributes: cleaned })
                                .eq("id", stale.id);
                        }))];
                case 14:
                    _m.sent();
                    _m.label = 15;
                case 15: return [4 /*yield*/, serviceRole
                        .from("trackedEntity")
                        .update({
                        attributes: newAttributes
                    })
                        .eq("id", trackedEntityId)
                        .eq("status", "Available")];
                case 16:
                    updateResponse = _m.sent();
                    if (!updateResponse.error) return [3 /*break*/, 18];
                    _k = react_router_1.data;
                    _l = [{ success: false, error: updateResponse.error.message }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateResponse.error, updateResponse.error.message))];
                case 17: return [2 /*return*/, _k.apply(void 0, _l.concat([_m.sent()]))];
                case 18: return [2 /*return*/, { success: true }];
            }
        });
    });
}
