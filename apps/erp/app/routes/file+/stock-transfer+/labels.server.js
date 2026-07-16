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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockTransferLabelItems = getStockTransferLabelItems;
function getStockTransferLabelItems(client, companyId, stockTransferId, lineId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, lines, entityIds, trackedEntities, itemIds, items, trackingTypeByItemId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = client
                        .from("stockTransferLine")
                        .select("id, trackedEntityId")
                        .eq("stockTransferId", stockTransferId)
                        .not("trackedEntityId", "is", null);
                    if (lineId) {
                        query = query.eq("id", lineId);
                    }
                    return [4 /*yield*/, query];
                case 1:
                    lines = (_b.sent()).data;
                    entityIds = __spreadArray([], new Set((lines !== null && lines !== void 0 ? lines : [])
                        .map(function (l) { return l.trackedEntityId; })
                        .filter(function (id) { return !!id; })), true);
                    if (entityIds.length === 0)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .in("id", entityIds)
                            .eq("companyId", companyId)];
                case 2:
                    trackedEntities = (_b.sent()).data;
                    itemIds = __spreadArray([], new Set((trackedEntities !== null && trackedEntities !== void 0 ? trackedEntities : [])
                        .map(function (e) { return e.sourceDocumentId; })
                        .filter(function (id) { return !!id; })), true);
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id, itemTrackingType")
                            .in("id", itemIds)];
                case 3:
                    items = (_b.sent()).data;
                    trackingTypeByItemId = new Map((_a = items === null || items === void 0 ? void 0 : items.map(function (i) { return [i.id, i.itemTrackingType]; })) !== null && _a !== void 0 ? _a : []);
                    return [2 /*return*/, (trackedEntities !== null && trackedEntities !== void 0 ? trackedEntities : [])
                            .map(function (entity) {
                            var _a, _b, _c, _d;
                            return ({
                                itemId: (_a = entity.sourceDocumentReadableId) !== null && _a !== void 0 ? _a : "",
                                revision: "0",
                                number: (_b = entity.readableId) !== null && _b !== void 0 ? _b : "",
                                trackedEntityId: entity.id,
                                quantity: entity.quantity,
                                trackingType: (_d = trackingTypeByItemId.get((_c = entity.sourceDocumentId) !== null && _c !== void 0 ? _c : "")) !== null && _d !== void 0 ? _d : (entity.quantity > 1 ? "Batch" : "Serial")
                            });
                        })
                            .sort(function (a, b) {
                            if (a.itemId === b.itemId) {
                                return a.number.localeCompare(b.number);
                            }
                            return a.itemId.localeCompare(b.itemId);
                        })];
            }
        });
    });
}
