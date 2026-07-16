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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var utils_1 = require("@carbon/utils");
var TreeView_1 = require("~/components/TreeView");
var items_1 = require("~/modules/items");
var bom_1 = require("~/utils/bom");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, itemId, makeMethodResult, makeMethodId, methodTree, methods, makeMethodIds, itemIds, _d, methodOperations, workCentersResult, lotSizesResult, lotSizesByItemId, workCenters, operationsByMakeMethodId, bomOperationsByKey, _i, _e, _f, key, ops, computedCosts, rootNode, unitCost, updateResult;
        var _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "parts"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId) {
                        return [2 /*return*/, { success: false, message: "Item ID is required" }];
                    }
                    return [4 /*yield*/, client
                            .from("activeMakeMethods")
                            .select("id")
                            .eq("itemId", itemId)
                            .maybeSingle()];
                case 2:
                    makeMethodResult = _k.sent();
                    if (makeMethodResult.error || !makeMethodResult.data) {
                        return [2 /*return*/, { success: false, message: "No make method found for this item" }];
                    }
                    makeMethodId = makeMethodResult.data.id;
                    if (!makeMethodId) {
                        return [2 /*return*/, { success: false, message: "No make method found for this item" }];
                    }
                    return [4 /*yield*/, (0, items_1.getMethodTree)(client, makeMethodId)];
                case 3:
                    methodTree = _k.sent();
                    if (methodTree.error) {
                        return [2 /*return*/, { success: false, message: "Failed to load method tree" }];
                    }
                    methods = methodTree.data.length > 0 ? (0, TreeView_1.flattenTree)(methodTree.data[0]) : [];
                    if (methods.length === 0) {
                        return [2 /*return*/, { success: false, message: "No methods found in the method tree" }];
                    }
                    makeMethodIds = (0, utils_1.pluckUnique)(methods, function (m) { return m.data.makeMethodId; });
                    itemIds = (0, utils_1.pluckUnique)(methods, function (m) { return m.data.itemId; });
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("methodOperation")
                                .select("*, ...process(processName:name), ...workCenter(workCenterName:name, laborRate, machineRate, overheadRate)")
                                .in("makeMethodId", makeMethodIds)
                                .eq("companyId", companyId),
                            client
                                .from("workCenters")
                                .select("id, active, laborRate, machineRate, overheadRate, processes")
                                .eq("companyId", companyId),
                            client
                                .from("itemReplenishment")
                                .select("itemId, lotSize")
                                .in("itemId", itemIds)
                        ])];
                case 4:
                    _d = _k.sent(), methodOperations = _d[0], workCentersResult = _d[1], lotSizesResult = _d[2];
                    lotSizesByItemId = new Map(((_g = lotSizesResult.data) !== null && _g !== void 0 ? _g : []).map(function (r) { var _a; return [r.itemId, (_a = r.lotSize) !== null && _a !== void 0 ? _a : 1]; }));
                    workCenters = ((_h = workCentersResult.data) !== null && _h !== void 0 ? _h : []).map(function (wc) {
                        var _a;
                        return ({
                            id: wc.id,
                            active: (_a = wc.active) !== null && _a !== void 0 ? _a : false,
                            laborRate: wc.laborRate,
                            machineRate: wc.machineRate,
                            overheadRate: wc.overheadRate,
                            processes: wc.processes
                        });
                    });
                    operationsByMakeMethodId = {};
                    if (methodOperations.data) {
                        operationsByMakeMethodId = methodOperations.data.reduce(function (acc, operation) {
                            acc[operation.makeMethodId] = __spreadArray(__spreadArray([], (acc[operation.makeMethodId] || []), true), [
                                operation
                            ], false);
                            return acc;
                        }, {});
                    }
                    bomOperationsByKey = {};
                    for (_i = 0, _e = Object.entries(operationsByMakeMethodId); _i < _e.length; _i++) {
                        _f = _e[_i], key = _f[0], ops = _f[1];
                        // @ts-expect-error TS2322 - TODO: fix type
                        bomOperationsByKey[key] = ops.map(function (op) {
                            var rates = (0, bom_1.resolveOperationRates)(op.workCenterId, op.processId, op.laborRate, op.machineRate, op.overheadRate, workCenters);
                            return __assign({ operationType: op.operationType, setupTime: op.setupTime, setupUnit: op.setupUnit, laborTime: op.laborTime, laborUnit: op.laborUnit, machineTime: op.machineTime, machineUnit: op.machineUnit, operationUnitCost: op.operationUnitCost, operationMinimumCost: op.operationMinimumCost }, rates);
                        });
                    }
                    computedCosts = (0, bom_1.calculateMadePartCosts)(methods, bomOperationsByKey, function (node) { return node.data.materialMakeMethodId; }, lotSizesByItemId);
                    rootNode = methods[0];
                    unitCost = (_j = computedCosts.get(rootNode.id)) !== null && _j !== void 0 ? _j : 0;
                    return [4 /*yield*/, client
                            .from("itemCost")
                            .update({ unitCost: unitCost, updatedBy: userId })
                            .eq("itemId", itemId)];
                case 5:
                    updateResult = _k.sent();
                    if (updateResult.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to update item cost"
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Unit cost updated to ".concat(unitCost.toFixed(2))
                        }];
            }
        });
    });
}
