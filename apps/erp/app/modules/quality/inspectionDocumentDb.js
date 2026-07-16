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
exports.inspectionDb = inspectionDb;
exports.listInspectionFeatures = listInspectionFeatures;
exports.listBalloons = listBalloons;
exports.mapBalloonIdsToFeatureIdsForDocument = mapBalloonIdsToFeatureIdsForDocument;
function inspectionDb(client) {
    return client;
}
function listInspectionFeatures(client, inspectionDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, inspectionDb(client)
                        .from("inspectionFeature")
                        .select("*")
                        .eq("inspectionDocumentId", inspectionDocumentId)
                        .order("createdAt", { ascending: true })];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, {
                            data: ((_a = result.data) !== null && _a !== void 0 ? _a : []),
                            error: result.error
                        }];
            }
        });
    });
}
function listBalloons(client, inspectionDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, inspectionDb(client)
                        .from("balloon")
                        .select("*")
                        .eq("inspectionDocumentId", inspectionDocumentId)
                        .order("createdAt", { ascending: true })];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, {
                            data: ((_a = result.data) !== null && _a !== void 0 ? _a : []),
                            error: result.error
                        }];
            }
        });
    });
}
/** Maps persisted balloon ids to inspectionFeature ids for legacy save payloads. */
function mapBalloonIdsToFeatureIdsForDocument(client, inspectionDocumentId, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var unique, mapped, _i, unique_1, id, balloonsResult, _a, _b, balloon, featuresResult, _c, _d, row;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    unique = __spreadArray([], new Set(ids.filter(function (id) { return id.length > 0; })), true);
                    mapped = new Map();
                    for (_i = 0, unique_1 = unique; _i < unique_1.length; _i++) {
                        id = unique_1[_i];
                        mapped.set(id, id);
                    }
                    return [4 /*yield*/, listBalloons(client, inspectionDocumentId)];
                case 1:
                    balloonsResult = _g.sent();
                    for (_a = 0, _b = (_e = balloonsResult.data) !== null && _e !== void 0 ? _e : []; _a < _b.length; _a++) {
                        balloon = _b[_a];
                        if (mapped.has(balloon.id)) {
                            mapped.set(balloon.id, balloon.inspectionFeatureId);
                        }
                    }
                    return [4 /*yield*/, listInspectionFeatures(client, inspectionDocumentId)];
                case 2:
                    featuresResult = _g.sent();
                    for (_c = 0, _d = (_f = featuresResult.data) !== null && _f !== void 0 ? _f : []; _c < _d.length; _c++) {
                        row = _d[_c];
                        if (mapped.has(row.id)) {
                            mapped.set(row.id, row.id);
                        }
                    }
                    return [2 /*return*/, mapped];
            }
        });
    });
}
