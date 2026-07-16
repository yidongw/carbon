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
exports.getCachedPrinterConfig = getCachedPrinterConfig;
exports.invalidatePrinterCache = invalidatePrinterCache;
var kv_1 = require("@carbon/kv");
var assignments_1 = require("./assignments");
var CACHE_TTL_SECONDS = 3600;
var KEY_PREFIX = "printing";
function buildCacheKey(companyId, locationId, context, contextId) {
    var suffix = context === "workCenter" && contextId ? "wc:".concat(contextId) : context;
    return "".concat(KEY_PREFIX, ":").concat(companyId, ":").concat(locationId, ":").concat(suffix);
}
function getCachedPrinterConfig(client, companyId, locationId, context, contextId) {
    return __awaiter(this, void 0, void 0, function () {
        var key, cached, _a, config, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    key = buildCacheKey(companyId, locationId, context, contextId);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, kv_1.redis.get(key)];
                case 2:
                    cached = _c.sent();
                    if (cached && typeof cached === "string") {
                        return [2 /*return*/, JSON.parse(cached)];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, resolvePrinterConfig(client, companyId, locationId, context, contextId)];
                case 5:
                    config = _c.sent();
                    if (!config) return [3 /*break*/, 9];
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, kv_1.redis.set(key, JSON.stringify(config), "EX", CACHE_TTL_SECONDS)];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _c.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, config];
            }
        });
    });
}
function resolvePrinterConfig(client, companyId, locationId, context, contextId) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, printing, assignment, _a, printerRouteId, autoPrint, route;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("companySettings")
                        .select("printing")
                        .eq("id", companyId)
                        .single()];
                case 1:
                    settings = (_c.sent()).data;
                    printing = settings === null || settings === void 0 ? void 0 : settings.printing;
                    assignment = (_b = printing === null || printing === void 0 ? void 0 : printing.assignments) === null || _b === void 0 ? void 0 : _b[locationId];
                    if (!assignment)
                        return [2 /*return*/, null];
                    _a = (0, assignments_1.resolveContextAssignment)(assignment, context, contextId), printerRouteId = _a.printerRouteId, autoPrint = _a.autoPrint;
                    if (!printerRouteId) {
                        return [2 /*return*/, {
                                printerRouteId: null,
                                printerUrl: "",
                                format: "zpl",
                                mediaSizeId: null,
                                templateId: null,
                                autoPrint: autoPrint
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("printerRoute")
                            .select("id, format, mediaSizeId, printerUrl, apiKey, templateId")
                            .eq("id", printerRouteId)
                            .eq("companyId", companyId)
                            .single()];
                case 2:
                    route = (_c.sent()).data;
                    if (!route) {
                        return [2 /*return*/, {
                                printerRouteId: printerRouteId,
                                printerUrl: "",
                                format: "zpl",
                                mediaSizeId: null,
                                templateId: null,
                                autoPrint: autoPrint
                            }];
                    }
                    return [2 /*return*/, {
                            printerRouteId: route.id,
                            printerUrl: route.printerUrl,
                            format: route.format,
                            mediaSizeId: route.mediaSizeId,
                            templateId: route.templateId,
                            autoPrint: autoPrint
                        }];
            }
        });
    });
}
function invalidatePrinterCache(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, pipeline, _i, keys_1, key, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, kv_1.redis.keys("".concat(KEY_PREFIX, ":").concat(companyId, ":*"))];
                case 1:
                    keys = _b.sent();
                    if (!(keys.length > 0)) return [3 /*break*/, 3];
                    pipeline = kv_1.redis.pipeline();
                    for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        key = keys_1[_i];
                        pipeline.del(key);
                    }
                    return [4 /*yield*/, pipeline.exec()];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
