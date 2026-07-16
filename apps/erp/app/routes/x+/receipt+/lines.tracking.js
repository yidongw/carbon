"use strict";
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
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var react_router_1 = require("react-router");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, formData, itemId, receiptLineId, receiptId, trackingType, batchNumber, quantity, properties, passedTrackedEntityId, trackedEntityId, _d, existing, batchQueryError, propertiesJson, serviceRole, error, serialNumber, index, expiryDate, _e, existingEntityWithIndex, indexQueryError, attributes, hasReceiptLineIndex, receiptLineMatches, indexMatches, serviceRole, error;
        var _f;
        var request = _b.request, context = _b.context;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "inventory"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _g.sent();
                    itemId = formData.get("itemId");
                    receiptLineId = formData.get("receiptLineId");
                    receiptId = formData.get("receiptId");
                    trackingType = formData.get("trackingType");
                    if (!(trackingType === "batch")) return [3 /*break*/, 7];
                    batchNumber = formData.get("batchNumber");
                    quantity = Number(formData.get("quantity"));
                    properties = formData.get("properties");
                    passedTrackedEntityId = formData.get("trackedEntityId");
                    trackedEntityId = passedTrackedEntityId !== null && passedTrackedEntityId !== void 0 ? passedTrackedEntityId : undefined;
                    if (!!trackedEntityId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id")
                            .eq("attributes ->> Receipt Line", receiptLineId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 3:
                    _d = _g.sent(), existing = _d.data, batchQueryError = _d.error;
                    if (batchQueryError) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to query batch number" }, { status: 500 })];
                    }
                    trackedEntityId = existing === null || existing === void 0 ? void 0 : existing.id;
                    _g.label = 4;
                case 4:
                    propertiesJson = {};
                    try {
                        propertiesJson = properties ? JSON.parse(properties) : {};
                    }
                    catch (error) {
                        console.error(error);
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 5:
                    serviceRole = _g.sent();
                    return [4 /*yield*/, serviceRole.rpc("update_receipt_line_batch_tracking", {
                            p_tracked_entity_id: trackedEntityId,
                            p_receipt_line_id: receiptLineId,
                            p_receipt_id: receiptId,
                            p_batch_number: batchNumber,
                            p_quantity: quantity,
                            p_properties: propertiesJson
                        })];
                case 6:
                    error = (_g.sent()).error;
                    if (error) {
                        console.error(error);
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to update tracking" }, { status: 500 })];
                    }
                    return [3 /*break*/, 11];
                case 7:
                    if (!(trackingType === "serial")) return [3 /*break*/, 11];
                    serialNumber = formData.get("serialNumber");
                    index = Number(formData.get("index"));
                    expiryDate = formData.get("expiryDate");
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .eq("sourceDocumentId", itemId)
                            .eq("readableId", serialNumber)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 8:
                    _e = _g.sent(), existingEntityWithIndex = _e.data, indexQueryError = _e.error;
                    if (indexQueryError) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to check serial number index" }, { status: 500 })];
                    }
                    // If the serial number exists but for a different receipt line or index, return an error
                    // Only check entities that are serial tracking (have Receipt Line Index attribute)
                    if (existingEntityWithIndex) {
                        attributes = existingEntityWithIndex.attributes;
                        hasReceiptLineIndex = "Receipt Line Index" in attributes;
                        receiptLineMatches = attributes["Receipt Line"] === receiptLineId;
                        indexMatches = attributes["Receipt Line Index"] === index;
                        console.log("Serial number check:", {
                            serialNumber: serialNumber,
                            existingEntityId: existingEntityWithIndex.id,
                            hasReceiptLineIndex: hasReceiptLineIndex,
                            existingReceiptLine: attributes["Receipt Line"],
                            currentReceiptLine: receiptLineId,
                            receiptLineMatches: receiptLineMatches,
                            existingIndex: attributes["Receipt Line Index"],
                            currentIndex: index,
                            indexMatches: indexMatches
                        });
                        if (hasReceiptLineIndex && (!receiptLineMatches || !indexMatches)) {
                            return [2 /*return*/, (0, react_router_1.data)({
                                    error: "Serial number is already used for a different item or position"
                                }, { status: 400 })];
                        }
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 9:
                    serviceRole = _g.sent();
                    return [4 /*yield*/, serviceRole.rpc("update_receipt_line_serial_tracking", {
                            p_tracked_entity_id: existingEntityWithIndex === null || existingEntityWithIndex === void 0 ? void 0 : existingEntityWithIndex.id,
                            p_receipt_line_id: receiptLineId,
                            p_receipt_id: receiptId,
                            p_serial_number: serialNumber,
                            p_index: index,
                            p_expiry_date: expiryDate || undefined
                        })];
                case 10:
                    error = (_g.sent()).error;
                    if (error) {
                        console.error(error);
                        // Check if error is due to unique constraint violation
                        if ((_f = error.message) === null || _f === void 0 ? void 0 : _f.includes("duplicate key value")) {
                            return [2 /*return*/, (0, react_router_1.data)({ error: "Serial number already exists for this item" }, { status: 400 })];
                        }
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to update tracking" }, { status: 500 })];
                    }
                    _g.label = 11;
                case 11: return [2 /*return*/, { success: true }];
            }
        });
    });
}
