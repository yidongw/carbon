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
var sales_1 = require("~/modules/sales");
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
    "Machine Unit"
];
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, withOperations, quote, fileName, methodTrees, methodTree, flattenedMethods, makeMethodIds, quoteOperations, operationsByMakeMethodId, bomOperationsByKey, _i, _d, _e, key, ops, batchSizesByItemId, rootQuoteNode, firstQuantity, computedCosts, bomIds, headers, csv;
        var _f, _g, _h, _j, _k, _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    withOperations = request.url.includes("withOperations=true");
                    if (!id) {
                        return [2 /*return*/, new Response(bomHeaders.join(",") + "\n", {
                                headers: {
                                    "Content-Type": "text/csv",
                                    "Content-Disposition": "attachment; filename=bom.csv"
                                }
                            })];
                    }
                    return [4 /*yield*/, client
                            .from("quoteLines")
                            .select("quoteId, quantity, itemReadableId")
                            .eq("id", id)
                            .single()];
                case 2:
                    quote = _m.sent();
                    fileName = "".concat((_f = quote.data) === null || _f === void 0 ? void 0 : _f.itemReadableId, "-bom.csv");
                    if (quote.error) {
                        return [2 /*return*/, new Response(bomHeaders.join(",") + "\n", {
                                headers: {
                                    "Content-Type": "text/csv",
                                    "Content-Disposition": "attachment; filename=".concat(fileName)
                                }
                            })];
                    }
                    if (!((_g = quote.data) === null || _g === void 0 ? void 0 : _g.quoteId)) {
                        throw new Error("Failed to fetch quote");
                    }
                    return [4 /*yield*/, (0, sales_1.getQuoteMethodTrees)(client, (_h = quote.data) === null || _h === void 0 ? void 0 : _h.quoteId)];
                case 3:
                    methodTrees = _m.sent();
                    if (methodTrees.error) {
                        return [2 /*return*/, new Response(bomHeaders.join(",") + "\n", {
                                headers: {
                                    "Content-Type": "text/csv",
                                    "Content-Disposition": "attachment; filename=bom.csv"
                                }
                            })];
                    }
                    methodTree = methodTrees.data.find(function (m) { return m.data.quoteLineId === id; });
                    flattenedMethods = methodTree ? (0, TreeView_1.flattenTree)(methodTree) : [];
                    makeMethodIds = __spreadArray([], new Set(flattenedMethods.map(function (method) { return method.data.quoteMakeMethodId; })), true);
                    return [4 /*yield*/, client
                            .from("quoteOperation")
                            .select("*, ...process(processName:name), ...workCenter(workCenterName:name)")
                            .in("quoteMakeMethodId", makeMethodIds)
                            .eq("companyId", companyId)];
                case 4:
                    quoteOperations = _m.sent();
                    operationsByMakeMethodId = {};
                    if (quoteOperations.data) {
                        operationsByMakeMethodId = quoteOperations.data.reduce(function (acc, operation) {
                            var _a, _b;
                            acc[(_a = operation.quoteMakeMethodId) !== null && _a !== void 0 ? _a : ""] = __spreadArray(__spreadArray([], (acc[(_b = operation.quoteMakeMethodId) !== null && _b !== void 0 ? _b : ""] || []), true), [
                                operation
                            ], false);
                            return acc;
                        }, {});
                    }
                    bomOperationsByKey = {};
                    for (_i = 0, _d = Object.entries(operationsByMakeMethodId); _i < _d.length; _i++) {
                        _e = _d[_i], key = _e[0], ops = _e[1];
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
                    batchSizesByItemId = new Map();
                    rootQuoteNode = flattenedMethods[0];
                    firstQuantity = (_k = (_j = quote.data) === null || _j === void 0 ? void 0 : _j.quantity) === null || _k === void 0 ? void 0 : _k[0];
                    if (rootQuoteNode && firstQuantity && firstQuantity > 1) {
                        batchSizesByItemId.set(rootQuoteNode.data.itemId, firstQuantity);
                    }
                    computedCosts = (0, bom_1.calculateMadePartCosts)(flattenedMethods, bomOperationsByKey, function (node) { return node.data.quoteMaterialMakeMethodId; }, batchSizesByItemId);
                    bomIds = (0, bom_1.generateBomIds)(flattenedMethods);
                    headers = bomHeaders.join(",");
                    if (withOperations) {
                        headers += "," + operationHeaders.join(",");
                        // Add duration column for each quantity
                        if ((_l = quote.data) === null || _l === void 0 ? void 0 : _l.quantity) {
                            quote.data.quantity.forEach(function (qty) {
                                headers += ",Total Duration x ".concat(qty, " (ms)");
                            });
                        }
                    }
                    headers += "\n";
                    csv = headers;
                    flattenedMethods.forEach(function (node, index) {
                        var _a, _b, _c;
                        var total = (0, bom_1.calculateTotalQuantity)(node, flattenedMethods);
                        var unitCost = (_b = (_a = computedCosts.get(node.id)) !== null && _a !== void 0 ? _a : node.data.unitCost) !== null && _b !== void 0 ? _b : 0;
                        var totalCost = total * unitCost;
                        csv += "".concat(bomIds[index], ",").concat(node.data.itemReadableId, ",\"").concat((_c = node.data.description) === null || _c === void 0 ? void 0 : _c.replace(/"/g, '""'), "\",").concat(node.data.quantity, ",").concat(total, ",").concat(unitCost, ",").concat(totalCost, ",").concat(node.data.methodType, ",").concat(node.data.itemType, ",").concat(node.level, ",").concat(node.data.version || "", "\n");
                        if (withOperations) {
                            var operations = operationsByMakeMethodId[node.data.quoteMaterialMakeMethodId];
                            if (operations) {
                                operations.forEach(function (operation) {
                                    var _a, _b, _c, _d;
                                    var durations = ((_b = (_a = quote.data) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : [])
                                        .map(function (quantity) {
                                        var duration = (0, duration_1.makeDurations)(__assign(__assign({}, operation), { operationQuantity: quantity }));
                                        return [quantity, duration.duration];
                                    })
                                        .reduce(function (acc, _a) {
                                        var quantity = _a[0], duration = _a[1];
                                        acc["totalDuration".concat(quantity)] = duration;
                                        return acc;
                                    }, {});
                                    csv += Array(bomHeaders.length).fill(",").join("");
                                    csv += "".concat(operation.description, ",").concat(operation.processName, ",").concat((_c = operation.workCenterName) !== null && _c !== void 0 ? _c : "", ",").concat(operation.operationType, ",").concat(operation.setupTime, ",").concat(operation.setupUnit, ",").concat(operation.laborTime, ",").concat(operation.laborUnit, ",").concat(operation.machineTime, ",").concat(operation.machineUnit);
                                    // Add duration values for each quantity
                                    if ((_d = quote.data) === null || _d === void 0 ? void 0 : _d.quantity) {
                                        quote.data.quantity.forEach(function (qty) {
                                            csv += ",".concat(durations["totalDuration".concat(qty)] || 0);
                                        });
                                    }
                                    csv += "\n";
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
