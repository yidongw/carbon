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
exports.calculateCOGS = calculateCOGS;
function calculateCOGS(trx_1, _a) {
    return __awaiter(this, arguments, void 0, function (trx, _b) {
        var itemCost, costingMethod, _c, standardCost, unitCost, orderDirection, layers, remainingToConsume, totalCost, layersConsumed, _i, layers_1, layer, layerRemaining, layerUnitCost, quantityFromLayer, costFromLayer, fallbackUnitCost, effectiveUnitCost;
        var _d, _e, _f;
        var itemId = _b.itemId, quantity = _b.quantity, companyId = _b.companyId;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, trx
                        .selectFrom("itemCost")
                        .selectAll()
                        .where("itemId", "=", itemId)
                        .where("companyId", "=", companyId)
                        .executeTakeFirstOrThrow()];
                case 1:
                    itemCost = _g.sent();
                    costingMethod = itemCost.costingMethod;
                    _c = costingMethod;
                    switch (_c) {
                        case "Standard": return [3 /*break*/, 2];
                        case "Average": return [3 /*break*/, 3];
                        case "FIFO": return [3 /*break*/, 4];
                        case "LIFO": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 10];
                case 2:
                    {
                        standardCost = Number((_d = itemCost.standardCost) !== null && _d !== void 0 ? _d : 0);
                        return [2 /*return*/, {
                                unitCost: standardCost,
                                totalCost: standardCost * quantity,
                                layersConsumed: [],
                            }];
                    }
                    _g.label = 3;
                case 3:
                    {
                        unitCost = Number((_e = itemCost.unitCost) !== null && _e !== void 0 ? _e : 0);
                        return [2 /*return*/, {
                                unitCost: unitCost,
                                totalCost: unitCost * quantity,
                                layersConsumed: [],
                            }];
                    }
                    _g.label = 4;
                case 4:
                    orderDirection = costingMethod === "FIFO" ? "asc" : "desc";
                    return [4 /*yield*/, trx
                            .selectFrom("costLedger")
                            .selectAll()
                            .where("itemId", "=", itemId)
                            .where("companyId", "=", companyId)
                            .where("remainingQuantity", ">", 0)
                            .orderBy("postingDate", orderDirection)
                            .orderBy("createdAt", orderDirection)
                            .execute()];
                case 5:
                    layers = _g.sent();
                    remainingToConsume = quantity;
                    totalCost = 0;
                    layersConsumed = [];
                    _i = 0, layers_1 = layers;
                    _g.label = 6;
                case 6:
                    if (!(_i < layers_1.length)) return [3 /*break*/, 9];
                    layer = layers_1[_i];
                    if (remainingToConsume <= 0)
                        return [3 /*break*/, 9];
                    layerRemaining = Number(layer.remainingQuantity);
                    layerUnitCost = Number(layer.quantity) > 0
                        ? Number(layer.cost) / Number(layer.quantity)
                        : 0;
                    quantityFromLayer = Math.min(remainingToConsume, layerRemaining);
                    costFromLayer = quantityFromLayer * layerUnitCost;
                    totalCost += costFromLayer;
                    remainingToConsume -= quantityFromLayer;
                    layersConsumed.push({
                        costLedgerId: layer.id,
                        quantityConsumed: quantityFromLayer,
                        unitCost: layerUnitCost,
                    });
                    return [4 /*yield*/, trx
                            .updateTable("costLedger")
                            .set({
                            remainingQuantity: layerRemaining - quantityFromLayer,
                        })
                            .where("id", "=", layer.id)
                            .execute()];
                case 7:
                    _g.sent();
                    _g.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    // Fallback: insufficient layers (negative inventory scenario)
                    if (remainingToConsume > 0) {
                        fallbackUnitCost = Number((_f = itemCost.unitCost) !== null && _f !== void 0 ? _f : 0);
                        totalCost += remainingToConsume * fallbackUnitCost;
                    }
                    effectiveUnitCost = quantity > 0 ? totalCost / quantity : 0;
                    return [2 /*return*/, {
                            unitCost: effectiveUnitCost,
                            totalCost: totalCost,
                            layersConsumed: layersConsumed,
                        }];
                case 10: throw new Error("Unsupported costing method: ".concat(costingMethod));
            }
        });
    });
}
