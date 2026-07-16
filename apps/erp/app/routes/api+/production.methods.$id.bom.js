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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var TreeView_1 = require("~/components/TreeView");
var production_1 = require("~/modules/production");
var bom_1 = require("~/utils/bom");
var duration_1 = require("~/utils/duration");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, withOperations, methodTree, methods, makeMethodIds, rootNode, jobId, _d, methodOperations, jobResult, batchSizesByItemId, operationsByMakeMethodId, bomOperationsByKey, _i, _e, _f, key, ops, computedCosts, bomIds, result;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    withOperations = request.url.includes("withOperations=true");
                    if (!id) {
                        return [2 /*return*/, { data: [], error: null }];
                    }
                    return [4 /*yield*/, (0, production_1.getJobMethodTree)(client, id)];
                case 2:
                    methodTree = _h.sent();
                    if (methodTree.error) {
                        return [2 /*return*/, { data: [], error: methodTree.error }];
                    }
                    methods = (methodTree.data.length > 0 ? (0, TreeView_1.flattenTree)(methodTree.data[0]) : []);
                    makeMethodIds = __spreadArray([], new Set(methods.map(function (method) { return method.data.jobMakeMethodId; })), true);
                    rootNode = methods[0];
                    jobId = rootNode === null || rootNode === void 0 ? void 0 : rootNode.data.jobId;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("jobOperation")
                                .select("*, ...process(processName:name), ...workCenter(workCenterName:name)")
                                .in("jobMakeMethodId", makeMethodIds)
                                .eq("companyId", companyId),
                            jobId
                                ? client.from("job").select("quantity").eq("id", jobId).single()
                                : null
                        ])];
                case 3:
                    _d = _h.sent(), methodOperations = _d[0], jobResult = _d[1];
                    batchSizesByItemId = new Map();
                    if (rootNode && ((_g = jobResult === null || jobResult === void 0 ? void 0 : jobResult.data) === null || _g === void 0 ? void 0 : _g.quantity)) {
                        batchSizesByItemId.set(rootNode.data.itemId, jobResult.data.quantity);
                    }
                    operationsByMakeMethodId = {};
                    if (methodOperations.data) {
                        operationsByMakeMethodId = methodOperations.data.reduce(function (acc, operation) {
                            var _a, _b;
                            acc[(_a = operation.jobMakeMethodId) !== null && _a !== void 0 ? _a : ""] = __spreadArray(__spreadArray([], (acc[(_b = operation.jobMakeMethodId) !== null && _b !== void 0 ? _b : ""] || []), true), [
                                operation
                            ], false);
                            return acc;
                        }, {});
                    }
                    bomOperationsByKey = {};
                    for (_i = 0, _e = Object.entries(operationsByMakeMethodId); _i < _e.length; _i++) {
                        _f = _e[_i], key = _f[0], ops = _f[1];
                        bomOperationsByKey[key] = ops.map(function (op) {
                            var _a, _b, _c;
                            return ({
                                operationType: op.operationType,
                                setupTime: op.setupTime,
                                setupUnit: op.setupUnit,
                                laborTime: op.laborTime,
                                laborUnit: op.laborUnit,
                                machineTime: op.machineTime,
                                machineUnit: op.machineUnit,
                                operationUnitCost: op.operationUnitCost,
                                operationMinimumCost: op.operationMinimumCost,
                                laborRate: (_a = op.laborRate) !== null && _a !== void 0 ? _a : 0,
                                machineRate: (_b = op.machineRate) !== null && _b !== void 0 ? _b : 0,
                                overheadRate: (_c = op.overheadRate) !== null && _c !== void 0 ? _c : 0
                            });
                        });
                    }
                    computedCosts = (0, bom_1.calculateMadePartCosts)(methods, bomOperationsByKey, function (node) { return node.data.jobMaterialMakeMethodId; }, batchSizesByItemId);
                    bomIds = (0, bom_1.generateBomIds)(methods);
                    result = methods.map(function (node, index) {
                        var _a, _b;
                        var total = (0, bom_1.calculateTotalQuantity)(node, methods);
                        var unitCost = (_b = (_a = computedCosts.get(node.id)) !== null && _a !== void 0 ? _a : node.data.unitCost) !== null && _b !== void 0 ? _b : 0;
                        var totalCost = total * unitCost;
                        var bomItem = {
                            id: bomIds[index],
                            itemId: node.data.itemReadableId,
                            description: node.data.description,
                            quantity: node.data.quantity,
                            total: total,
                            unitCost: unitCost,
                            totalCost: totalCost,
                            methodType: node.data.methodType,
                            itemType: node.data.itemType,
                            level: node.level,
                            version: node.data.version || null
                        };
                        if (!withOperations) {
                            return bomItem;
                        }
                        var operations = operationsByMakeMethodId[node.data.jobMaterialMakeMethodId];
                        if (!operations) {
                            return __assign(__assign({}, bomItem), { operations: [] });
                        }
                        return __assign(__assign({}, bomItem), { operations: operations.map(function (operation) {
                                var op1 = (0, duration_1.makeDurations)(__assign(__assign({}, operation), { operationQuantity: total }));
                                var op100 = (0, duration_1.makeDurations)(__assign(__assign({}, operation), { operationQuantity: total * 100 }));
                                var op1000 = (0, duration_1.makeDurations)(__assign(__assign({}, operation), { operationQuantity: total * 1000 }));
                                return {
                                    description: operation.description,
                                    process: operation.processName,
                                    workCenter: operation.workCenterName,
                                    operationType: operation.operationType,
                                    setupTime: operation.setupTime,
                                    setupUnit: operation.setupUnit,
                                    laborTime: operation.laborTime,
                                    laborUnit: operation.laborUnit,
                                    machineTime: operation.machineTime,
                                    machineUnit: operation.machineUnit,
                                    totalDurationX1: op1.duration,
                                    totalDurationX100: op100.duration,
                                    totalDurationX1000: op1000.duration
                                };
                            }) });
                    });
                    return [2 /*return*/, { data: result, error: null }];
            }
        });
    });
}
