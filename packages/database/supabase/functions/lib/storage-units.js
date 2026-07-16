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
exports.getStorageUnitId = getStorageUnitId;
exports.getStorageUnitWithHighestQuantity = getStorageUnitWithHighestQuantity;
exports.updatePickMethodDefaultStorageUnitIfNeeded = updatePickMethodDefaultStorageUnitIfNeeded;
function getStorageUnitId(trx, itemId, locationId, storageUnitId) {
    return __awaiter(this, void 0, void 0, function () {
        var pickMethod, storageUnitWithHighestQuantity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (storageUnitId)
                        return [2 /*return*/, storageUnitId];
                    return [4 /*yield*/, trx
                            .selectFrom("pickMethod")
                            .where("itemId", "=", itemId)
                            .where("locationId", "=", locationId)
                            .select("defaultStorageUnitId")
                            .executeTakeFirst()];
                case 1:
                    pickMethod = _a.sent();
                    if (pickMethod === null || pickMethod === void 0 ? void 0 : pickMethod.defaultStorageUnitId)
                        return [2 /*return*/, pickMethod.defaultStorageUnitId];
                    return [4 /*yield*/, getStorageUnitWithHighestQuantity(trx, itemId, locationId)];
                case 2:
                    storageUnitWithHighestQuantity = _a.sent();
                    return [2 /*return*/, storageUnitWithHighestQuantity !== null && storageUnitWithHighestQuantity !== void 0 ? storageUnitWithHighestQuantity : undefined];
            }
        });
    });
}
// Utility function to get the storage unit with the highest quantity
function getStorageUnitWithHighestQuantity(trx, itemId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        var storageUnitWithHighestQuantity;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, trx
                        .selectFrom("itemLedger")
                        .where("itemId", "=", itemId)
                        .where("locationId", "=", locationId)
                        .where("storageUnitId", "is not", null)
                        .groupBy("storageUnitId")
                        .select(["storageUnitId", function (eb) { return eb.fn.sum("quantity").as("totalQuantity"); }])
                        .having(function (eb) { return eb.fn.sum("quantity"); }, ">", 0)
                        .orderBy("totalQuantity", "desc")
                        .executeTakeFirst()];
                case 1:
                    storageUnitWithHighestQuantity = _b.sent();
                    return [2 /*return*/, (_a = storageUnitWithHighestQuantity === null || storageUnitWithHighestQuantity === void 0 ? void 0 : storageUnitWithHighestQuantity.storageUnitId) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
// Utility function to update pickMethod defaultStorageUnitId if this is the only non-null storage unit
function updatePickMethodDefaultStorageUnitIfNeeded(trx, itemId, locationId, storageUnitId, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var otherStorageUnits, existingPickMethod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Only proceed if storageUnitId and locationId are not null
                    if (!storageUnitId || !locationId)
                        return [2 /*return*/];
                    return [4 /*yield*/, trx
                            .selectFrom("itemLedger")
                            .where("itemId", "=", itemId)
                            .where("locationId", "=", locationId)
                            .where("storageUnitId", "is not", null)
                            .where("storageUnitId", "!=", storageUnitId)
                            .select("storageUnitId")
                            .executeTakeFirst()];
                case 1:
                    otherStorageUnits = _a.sent();
                    if (!!otherStorageUnits) return [3 /*break*/, 6];
                    return [4 /*yield*/, trx
                            .selectFrom("pickMethod")
                            .where("itemId", "=", itemId)
                            .where("locationId", "=", locationId)
                            .select("defaultStorageUnitId")
                            .executeTakeFirst()];
                case 2:
                    existingPickMethod = _a.sent();
                    if (!existingPickMethod) return [3 /*break*/, 4];
                    // Update existing pickMethod
                    return [4 /*yield*/, trx
                            .updateTable("pickMethod")
                            .set({
                            defaultStorageUnitId: storageUnitId,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString(),
                        })
                            .where("itemId", "=", itemId)
                            .where("locationId", "=", locationId)
                            .execute()];
                case 3:
                    // Update existing pickMethod
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: 
                // Insert new pickMethod
                return [4 /*yield*/, trx
                        .insertInto("pickMethod")
                        .values({
                        itemId: itemId,
                        locationId: locationId,
                        defaultStorageUnitId: storageUnitId,
                        companyId: companyId,
                        createdBy: userId,
                        createdAt: new Date().toISOString(),
                    })
                        .execute()];
                case 5:
                    // Insert new pickMethod
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
