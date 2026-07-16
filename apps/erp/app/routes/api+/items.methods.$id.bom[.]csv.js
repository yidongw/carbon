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
var utils_1 = require("@carbon/utils");
var TreeView_1 = require("~/components/TreeView");
var items_1 = require("~/modules/items");
var bom_1 = require("~/utils/bom");
var duration_1 = require("~/utils/duration");
var bomHeaders = [
    "ID",
    "Item ID",
    "Description",
    "Quantity",
    "Total",
    "Unit Cost",
    "Total Cost",
    "UOM",
    "Method Type",
    "Item Type",
    "Level",
    "Version"
];
var operationHeaders = [
    "Operation",
    "Process",
    "Work Center",
    "Operation Type",
    "Setup Time",
    "Setup Unit",
    "Labor Time",
    "Labor Unit",
    "Machine Time",
    "Machine Unit",
    "Total Duration x 1 (ms)",
    "Total Duration x 100 (ms)",
    "Total Duration x 1000 (ms)"
];
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, withOperations, headers, methodTree, fileName, methods, makeMethodIds, itemIds, _d, methodOperations, workCentersResult, lotSizesResult, lotSizesByItemId, workCenters, operationsByMakeMethodId, bomOperationsByKey, _i, _e, _f, key, ops, computedCosts, bomIds, csv;
        var _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    withOperations = request.url.includes("withOperations=true");
                    headers = (withOperations
                        ? __spreadArray(__spreadArray([], bomHeaders, true), operationHeaders, true).join(",")
                        : bomHeaders.join(",")) + "\n";
                    if (!id) {
                        return [2 /*return*/, new Response(headers, {
                                headers: {
                                    "Content-Type": "text/csv",
                                    "Content-Disposition": "attachment; filename=bom.csv"
                                }
                            })];
                    }
                    return [4 /*yield*/, (0, items_1.getMethodTree)(client, id)];
                case 2:
                    methodTree = _j.sent();
                    if (methodTree.error) {
                        return [2 /*return*/, new Response(headers, {
                                headers: {
                                    "Content-Type": "text/csv",
                                    "Content-Disposition": "attachment; filename=bom.csv"
                                }
                            })];
                    }
                    fileName = "".concat(methodTree.data[0].data.itemReadableId, "-bom.csv");
                    methods = (methodTree.data.length > 0 ? (0, TreeView_1.flattenTree)(methodTree.data[0]) : []);
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
                case 3:
                    _d = _j.sent(), methodOperations = _d[0], workCentersResult = _d[1], lotSizesResult = _d[2];
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
                    bomIds = (0, bom_1.generateBomIds)(methods);
                    csv = headers;
                    methods.forEach(function (node, index) {
                        var _a, _b, _c;
                        var total = (0, bom_1.calculateTotalQuantity)(node, methods);
                        var unitCost = (_b = (_a = computedCosts.get(node.id)) !== null && _a !== void 0 ? _a : node.data.unitCost) !== null && _b !== void 0 ? _b : 0;
                        var totalCost = total * unitCost;
                        csv += "".concat(bomIds[index], ",").concat(node.data.itemReadableId, ",\"").concat((_c = node.data.description) === null || _c === void 0 ? void 0 : _c.replace(/"/g, '""'), "\",").concat(node.data.quantity, ",").concat(total, ",").concat(unitCost, ",").concat(totalCost, ",").concat(node.data.unitOfMeasureCode, ",").concat(node.data.methodType, ",").concat(node.data.itemType, ",").concat(node.level, ",").concat(node.data.version || "", "\n");
                        if (withOperations) {
                            var operations = operationsByMakeMethodId[node.data.materialMakeMethodId];
                            if (operations) {
                                operations.forEach(function (operation) {
                                    var _a;
                                    var op1 = (0, duration_1.makeDurations)(__assign(__assign({}, operation), { operationQuantity: total }));
                                    var op100 = (0, duration_1.makeDurations)(__assign(__assign({}, operation), { operationQuantity: total * 100 }));
                                    var op1000 = (0, duration_1.makeDurations)(__assign(__assign({}, operation), { operationQuantity: total * 1000 }));
                                    csv += Array(bomHeaders.length).fill(",").join("");
                                    csv += "".concat(operation.description, ",").concat(operation.processName, ",").concat((_a = operation.workCenterName) !== null && _a !== void 0 ? _a : "", ",").concat(operation.operationType, ",").concat(operation.setupTime, ",").concat(operation.setupUnit, ",").concat(operation.laborTime, ",").concat(operation.laborUnit, ",").concat(operation.machineTime, ",").concat(operation.machineUnit, ",").concat(op1.duration, ",").concat(op100.duration, ",").concat(op1000.duration, "\n");
                                });
                            }
                        }
                    });
                    return [2 /*return*/, new Response(csv, {
                            headers: {
                                "Content-Type": "text/csv",
                                "Content-Disposition": "attachment; filename=".concat(fileName)
                            }
                        })];
            }
        });
    });
}
