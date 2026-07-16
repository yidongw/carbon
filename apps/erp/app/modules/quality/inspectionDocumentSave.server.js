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
exports.isTempInspectionId = isTempInspectionId;
exports.translateLegacyInspectionSavePayload = translateLegacyInspectionSavePayload;
exports.mergeInspectionFeaturesPayload = mergeInspectionFeaturesPayload;
exports.mergeInspectionBalloonsPayload = mergeInspectionBalloonsPayload;
exports.resolveInspectionFeaturePayloadIds = resolveInspectionFeaturePayloadIds;
var inspectionDocumentDb_1 = require("./inspectionDocumentDb");
function isTempInspectionId(id) {
    return id.startsWith("temp-");
}
/** Maps legacy anchors + metadata balloons save shape to features + geometry balloons. */
function translateLegacyInspectionSavePayload(anchors, balloons) {
    var anchorByTempId = new Map(anchors.create.map(function (a) { return [a.tempId, a]; }));
    var featuresCreate = balloons.create.map(function (b) {
        var _a, _b, _c, _d, _e, _f;
        var anchor = anchorByTempId.get(b.tempBalloonAnchorId);
        return {
            tempId: b.tempBalloonAnchorId,
            pageNumber: (_a = anchor === null || anchor === void 0 ? void 0 : anchor.pageNumber) !== null && _a !== void 0 ? _a : 1,
            label: b.label,
            description: (_b = b.description) !== null && _b !== void 0 ? _b : null,
            nominalValue: (_c = b.nominalValue) !== null && _c !== void 0 ? _c : null,
            tolerancePlus: (_d = b.tolerancePlus) !== null && _d !== void 0 ? _d : null,
            toleranceMinus: (_e = b.toleranceMinus) !== null && _e !== void 0 ? _e : null,
            unit: (_f = b.unit) !== null && _f !== void 0 ? _f : null
        };
    });
    var _loop_1 = function (anchor) {
        if (featuresCreate.some(function (f) { return f.tempId === anchor.tempId; }))
            return "continue";
        featuresCreate.push({
            tempId: anchor.tempId,
            pageNumber: anchor.pageNumber,
            label: "0",
            description: null,
            nominalValue: null,
            tolerancePlus: null,
            toleranceMinus: null,
            unit: null
        });
    };
    for (var _i = 0, _a = anchors.create; _i < _a.length; _i++) {
        var anchor = _a[_i];
        _loop_1(anchor);
    }
    var balloonsCreate = balloons.create.map(function (b) {
        var _a, _b, _c, _d, _e;
        var anchor = anchorByTempId.get(b.tempBalloonAnchorId);
        return {
            tempInspectionFeatureId: b.tempBalloonAnchorId,
            tempBalloonAnchorId: b.tempBalloonAnchorId,
            pageNumber: (_a = anchor === null || anchor === void 0 ? void 0 : anchor.pageNumber) !== null && _a !== void 0 ? _a : 1,
            regionX: (_b = anchor === null || anchor === void 0 ? void 0 : anchor.xCoordinate) !== null && _b !== void 0 ? _b : 0,
            regionY: (_c = anchor === null || anchor === void 0 ? void 0 : anchor.yCoordinate) !== null && _c !== void 0 ? _c : 0,
            regionWidth: (_d = anchor === null || anchor === void 0 ? void 0 : anchor.width) !== null && _d !== void 0 ? _d : 0.1,
            regionHeight: (_e = anchor === null || anchor === void 0 ? void 0 : anchor.height) !== null && _e !== void 0 ? _e : 0.1,
            xCoordinate: b.xCoordinate,
            yCoordinate: b.yCoordinate
        };
    });
    var _loop_2 = function (anchor) {
        if (balloons.create.some(function (b) { return b.tempBalloonAnchorId === anchor.tempId; })) {
            return "continue";
        }
        balloonsCreate.push({
            tempInspectionFeatureId: anchor.tempId,
            tempBalloonAnchorId: anchor.tempId,
            pageNumber: anchor.pageNumber,
            regionX: anchor.xCoordinate,
            regionY: anchor.yCoordinate,
            regionWidth: anchor.width,
            regionHeight: anchor.height,
            xCoordinate: Math.min(1 - 0.04, Math.max(0, anchor.xCoordinate + anchor.width + 0.02)),
            yCoordinate: Math.min(1 - 0.04, Math.max(0, anchor.yCoordinate))
        });
    };
    for (var _b = 0, _c = anchors.create; _b < _c.length; _b++) {
        var anchor = _c[_b];
        _loop_2(anchor);
    }
    var featuresUpdate = balloons.update.map(function (b) {
        var _a, _b, _c, _d, _e;
        return ({
            id: b.id,
            label: b.label,
            description: (_a = b.description) !== null && _a !== void 0 ? _a : null,
            nominalValue: (_b = b.nominalValue) !== null && _b !== void 0 ? _b : null,
            tolerancePlus: (_c = b.tolerancePlus) !== null && _c !== void 0 ? _c : null,
            toleranceMinus: (_d = b.toleranceMinus) !== null && _d !== void 0 ? _d : null,
            unit: (_e = b.unit) !== null && _e !== void 0 ? _e : null
        });
    });
    var balloonsUpdate = __spreadArray(__spreadArray([], anchors.update.map(function (a) { return ({
        id: a.id,
        pageNumber: a.pageNumber,
        regionX: a.xCoordinate,
        regionY: a.yCoordinate,
        regionWidth: a.width,
        regionHeight: a.height
    }); }), true), balloons.update.map(function (b) { return ({
        id: b.id,
        xCoordinate: b.xCoordinate,
        yCoordinate: b.yCoordinate
    }); }), true);
    var mergedBalloonUpdates = new Map();
    for (var _d = 0, balloonsUpdate_1 = balloonsUpdate; _d < balloonsUpdate_1.length; _d++) {
        var item = balloonsUpdate_1[_d];
        var existing = mergedBalloonUpdates.get(item.id);
        mergedBalloonUpdates.set(item.id, __assign(__assign({}, existing), item));
    }
    return {
        features: {
            create: featuresCreate,
            update: featuresUpdate,
            delete: __spreadArray([], new Set(__spreadArray(__spreadArray([], balloons.delete, true), anchors.delete, true)), true)
        },
        balloons: {
            create: balloonsCreate,
            update: __spreadArray([], mergedBalloonUpdates.values(), true),
            delete: []
        }
    };
}
function mergeInspectionFeaturesPayload(base, extra) {
    return {
        create: __spreadArray(__spreadArray([], base.create, true), extra.create, true),
        update: __spreadArray(__spreadArray([], base.update, true), extra.update, true),
        delete: __spreadArray([], new Set(__spreadArray(__spreadArray([], base.delete, true), extra.delete, true)), true)
    };
}
function mergeInspectionBalloonsPayload(base, extra) {
    return {
        create: __spreadArray(__spreadArray([], base.create, true), extra.create, true),
        update: __spreadArray(__spreadArray([], base.update, true), extra.update, true),
        delete: __spreadArray([], new Set(__spreadArray(__spreadArray([], base.delete, true), extra.delete, true)), true)
    };
}
function resolveInspectionFeaturePayloadIds(client, inspectionDocumentId, features) {
    return __awaiter(this, void 0, void 0, function () {
        var ids, idMap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ids = __spreadArray(__spreadArray([], features.update.map(function (row) { return row.id; }), true), features.delete, true).filter(function (rowId) { return !isTempInspectionId(rowId); });
                    if (ids.length === 0) {
                        return [2 /*return*/, features];
                    }
                    return [4 /*yield*/, (0, inspectionDocumentDb_1.mapBalloonIdsToFeatureIdsForDocument)(client, inspectionDocumentId, ids)];
                case 1:
                    idMap = _a.sent();
                    return [2 /*return*/, {
                            create: features.create,
                            update: features.update.map(function (row) {
                                var _a;
                                return (__assign(__assign({}, row), { id: (_a = idMap.get(row.id)) !== null && _a !== void 0 ? _a : row.id }));
                            }),
                            delete: __spreadArray([], new Set(features.delete.map(function (rowId) { var _a; return (_a = idMap.get(rowId)) !== null && _a !== void 0 ? _a : rowId; })), true)
                        }];
            }
        });
    });
}
