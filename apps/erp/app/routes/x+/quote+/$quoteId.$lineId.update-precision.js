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
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, quoteId, lineId, formData, precision, updatePrecision, prices, roundedPrices, updatePrices;
        var _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 1:
                    client = (_e.sent()).client;
                    quoteId = params.quoteId, lineId = params.lineId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _e.sent();
                    precision = Number((_c = formData.get("precision")) !== null && _c !== void 0 ? _c : 2);
                    return [4 /*yield*/, (0, sales_1.updateQuoteLinePrecision)(client, lineId, precision)];
                case 3:
                    updatePrecision = _e.sent();
                    if (updatePrecision.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ data: null, error: updatePrecision.error.message }, { status: 400 })];
                    }
                    return [4 /*yield*/, client
                            .from("quoteLinePrice")
                            .select("*")
                            .eq("quoteLineId", lineId)];
                case 4:
                    prices = _e.sent();
                    if (!prices.data) return [3 /*break*/, 6];
                    roundedPrices = (_d = prices.data) === null || _d === void 0 ? void 0 : _d.map(function (price) { return ({
                        quoteLineId: price.quoteLineId,
                        unitPrice: Number(price.unitPrice.toFixed(precision)),
                        leadTime: price.leadTime,
                        discountPercent: price.discountPercent,
                        quantity: price.quantity,
                        createdBy: price.createdBy
                    }); });
                    return [4 /*yield*/, (0, sales_1.upsertQuoteLinePrices)(client, quoteId, lineId, roundedPrices)];
                case 5:
                    updatePrices = _e.sent();
                    if (updatePrices.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ data: null, error: updatePrices.error.message }, { status: 400 })];
                    }
                    _e.label = 6;
                case 6: return [2 /*return*/, { data: null, error: null }];
            }
        });
    });
}
