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
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var jobs_1 = require("@carbon/jobs");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, id, viewClient, transfer, formData, lineId, pickedQuantity, locationId, trackedEntityId, _d, _e, stockTransferLine, _f, _g, type, _h, _j, _k, transferResult, functionError, _l, _m, e_1, _o, _p;
        var _q;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "inventory"
                        })];
                case 1:
                    _c = _r.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "inventory"
                        })];
                case 2:
                    viewClient = (_r.sent()).client;
                    return [4 /*yield*/, (0, inventory_1.getStockTransfer)(viewClient, id)];
                case 3:
                    transfer = _r.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: ((_q = transfer.data) === null || _q === void 0 ? void 0 : _q.status) === "Completed",
                            redirectTo: path_1.path.to.stockTransfer(id),
                            message: "Cannot pick from a completed stock transfer."
                        })];
                case 4:
                    _r.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _r.sent();
                    lineId = formData.get("id");
                    pickedQuantity = parseInt(formData.get("quantity"), 10);
                    locationId = formData.get("locationId");
                    trackedEntityId = formData.get("trackedEntityId");
                    if (!(!lineId || !Number.isFinite(pickedQuantity))) return [3 /*break*/, 7];
                    _d = react_router_1.data;
                    _e = [{
                            success: false
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Invalid form data", "Invalid form data"))];
                case 6: return [2 /*return*/, _d.apply(void 0, _e.concat([_r.sent()]))];
                case 7: return [4 /*yield*/, client
                        .from("stockTransferLine")
                        .select("*")
                        .eq("id", lineId)
                        .single()];
                case 8:
                    stockTransferLine = _r.sent();
                    if (!!stockTransferLine.data) return [3 /*break*/, 10];
                    _f = react_router_1.data;
                    _g = [{
                            success: false
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Stock transfer line not found", "Stock transfer line not found"))];
                case 9: return [2 /*return*/, _f.apply(void 0, _g.concat([_r.sent()]))];
                case 10:
                    type = "inventory";
                    if (pickedQuantity === 0) {
                        if (stockTransferLine.data.requiresSerialTracking) {
                            type = "unpickSerial";
                        }
                        else if (stockTransferLine.data.requiresBatchTracking) {
                            type = "unpickBatch";
                        }
                        else {
                            type = "unpickInventory";
                        }
                    }
                    if (!(!trackedEntityId &&
                        (stockTransferLine.data.requiresSerialTracking ||
                            stockTransferLine.data.requiresBatchTracking))) return [3 /*break*/, 12];
                    _h = react_router_1.data;
                    _j = [{
                            success: false
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Tracked entity not found", "Tracked entity not found"))];
                case 11: return [2 /*return*/, _h.apply(void 0, _j.concat([_r.sent()]))];
                case 12: return [4 /*yield*/, client.functions.invoke("post-stock-transfer", {
                        body: JSON.stringify({
                            type: type,
                            stockTransferId: stockTransferLine.data.stockTransferId,
                            stockTransferLineId: lineId,
                            quantity: pickedQuantity,
                            locationId: locationId,
                            trackedEntityId: trackedEntityId,
                            userId: userId,
                            companyId: companyId
                        })
                    })];
                case 13:
                    _k = _r.sent(), transferResult = _k.data, functionError = _k.error;
                    if (!functionError) return [3 /*break*/, 15];
                    _l = react_router_1.data;
                    _m = [{
                            success: false
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(functionError.message || "Failed to pick line", "Failed to pick line"))];
                case 14: return [2 /*return*/, _l.apply(void 0, _m.concat([_r.sent()]))];
                case 15:
                    if (!(transferResult === null || transferResult === void 0 ? void 0 : transferResult.splitEntityId)) return [3 /*break*/, 21];
                    _r.label = 16;
                case 16:
                    _r.trys.push([16, 20, , 21]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Split",
                            sourceDocumentId: transferResult.splitEntityId,
                            companyId: companyId,
                            userId: userId,
                            locationId: locationId || undefined
                        })];
                case 17:
                    _r.sent();
                    if (!trackedEntityId) return [3 /*break*/, 19];
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Entity",
                            sourceDocumentId: trackedEntityId,
                            companyId: companyId,
                            userId: userId,
                            locationId: locationId || undefined
                        })];
                case 18:
                    _r.sent();
                    _r.label = 19;
                case 19: return [3 /*break*/, 21];
                case 20:
                    e_1 = _r.sent();
                    console.error("Auto-print for split entity failed:", e_1);
                    return [3 /*break*/, 21];
                case 21:
                    _o = react_router_1.data;
                    _p = [{
                            success: true
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("".concat(pickedQuantity, " ").concat(pickedQuantity === 1 ? "item" : "items", " marked as picked")))];
                case 22: return [2 /*return*/, _o.apply(void 0, _p.concat([_r.sent()]))];
            }
        });
    });
}
