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
exports.postTransactionFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var client_1 = require("../../client");
exports.postTransactionFunction = client_1.inngest.createFunction({ id: "post-transactions", retries: 3 }, { event: "carbon/post-transaction" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole, payload, result;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                payload = event.data;
                return [4 /*yield*/, step.run("post-transaction", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var result, _a, postReceipt, postPurchaseInvoice, companySettings, priceUpdate, postShipment;
                        var _b, _c, _d, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    console.info("Post transaction ".concat(payload.type, " for ").concat(payload.documentId));
                                    _a = payload.type;
                                    switch (_a) {
                                        case "receipt": return [3 /*break*/, 1];
                                        case "purchase-invoice": return [3 /*break*/, 3];
                                        case "shipment": return [3 /*break*/, 8];
                                    }
                                    return [3 /*break*/, 10];
                                case 1:
                                    console.info("Posting receipt ".concat(payload.documentId));
                                    console.info(payload);
                                    return [4 /*yield*/, serviceRole.functions.invoke("post-receipt", {
                                            body: {
                                                receiptId: payload.documentId,
                                                userId: payload.userId,
                                                companyId: payload.companyId
                                            }
                                        })];
                                case 2:
                                    postReceipt = _g.sent();
                                    result = {
                                        success: postReceipt.error === null,
                                        message: (_b = postReceipt.error) === null || _b === void 0 ? void 0 : _b.message
                                    };
                                    return [3 /*break*/, 11];
                                case 3:
                                    console.info("Posting purchase invoice ".concat(payload.documentId));
                                    console.info(payload);
                                    return [4 /*yield*/, serviceRole.functions.invoke("post-purchase-invoice", {
                                            body: {
                                                invoiceId: payload.documentId,
                                                userId: payload.userId,
                                                companyId: payload.companyId
                                            }
                                        })];
                                case 4:
                                    postPurchaseInvoice = _g.sent();
                                    result = {
                                        success: postPurchaseInvoice.error === null,
                                        message: (_c = postPurchaseInvoice.error) === null || _c === void 0 ? void 0 : _c.message
                                    };
                                    if (!result.success) return [3 /*break*/, 7];
                                    return [4 /*yield*/, serviceRole
                                            .from("companySettings")
                                            .select("purchasePriceUpdateTiming")
                                            .eq("id", payload.companyId)
                                            .single()];
                                case 5:
                                    companySettings = _g.sent();
                                    if (!(!((_d = companySettings.data) === null || _d === void 0 ? void 0 : _d.purchasePriceUpdateTiming) ||
                                        companySettings.data.purchasePriceUpdateTiming ===
                                            "Purchase Invoice Post")) return [3 /*break*/, 7];
                                    console.info("Updating pricing from invoice ".concat(payload.documentId));
                                    return [4 /*yield*/, serviceRole.functions.invoke("update-purchased-prices", {
                                            body: {
                                                invoiceId: payload.documentId,
                                                companyId: payload.companyId,
                                                userId: payload.userId,
                                                source: "purchaseInvoice"
                                            }
                                        })];
                                case 6:
                                    priceUpdate = _g.sent();
                                    result = {
                                        success: priceUpdate.error === null,
                                        message: (_e = priceUpdate.error) === null || _e === void 0 ? void 0 : _e.message
                                    };
                                    _g.label = 7;
                                case 7: return [3 /*break*/, 11];
                                case 8:
                                    console.info("Posting shipment ".concat(payload.documentId));
                                    console.info(payload);
                                    return [4 /*yield*/, serviceRole.functions.invoke("post-shipment", {
                                            body: {
                                                shipmentId: payload.documentId,
                                                userId: payload.userId,
                                                companyId: payload.companyId
                                            }
                                        })];
                                case 9:
                                    postShipment = _g.sent();
                                    result = {
                                        success: postShipment.error === null,
                                        message: (_f = postShipment.error) === null || _f === void 0 ? void 0 : _f.message
                                    };
                                    return [3 /*break*/, 11];
                                case 10:
                                    result = {
                                        success: false,
                                        message: "Invalid posting type: ".concat(payload.type)
                                    };
                                    return [3 /*break*/, 11];
                                case 11:
                                    if (result.success) {
                                        console.info("Success ".concat(payload.documentId));
                                    }
                                    else {
                                        console.error("Admin action ".concat(payload.type, " failed for ").concat(payload.documentId, ": ").concat(result.message));
                                    }
                                    return [2 /*return*/, result];
                            }
                        });
                    }); })];
            case 1:
                result = _c.sent();
                return [2 /*return*/, result];
        }
    });
}); });
