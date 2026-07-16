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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
exports.getRatesFromSupplierProcesses = exports.getRatesFromWorkCenters = void 0;
exports.getJobMethodTree = getJobMethodTree;
exports.getJobMethodTreeArray = getJobMethodTreeArray;
exports.traverseJobMethod = traverseJobMethod;
exports.getQuoteMethodTree = getQuoteMethodTree;
exports.getQuoteMethodTreeArray = getQuoteMethodTreeArray;
exports.traverseQuoteMethod = traverseQuoteMethod;
exports.calculateQuoteLinePrices = calculateQuoteLinePrices;
function getJobMethodTree(client_1, methodId_1) {
    return __awaiter(this, arguments, void 0, function (client, methodId, parentMaterialId) {
        var items, tree;
        if (parentMaterialId === void 0) { parentMaterialId = null; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getJobMethodTreeArray(client, methodId)];
                case 1:
                    items = _a.sent();
                    if (items.error)
                        return [2 /*return*/, items];
                    tree = getJobMethodTreeArrayToTree(items.data, parentMaterialId);
                    return [2 /*return*/, {
                            data: tree,
                            error: null,
                        }];
            }
        });
    });
}
function getJobMethodTreeArray(client, methodId) {
    return client.rpc("get_job_methods_by_method_id", {
        mid: methodId,
    });
}
function getJobMethodTreeArrayToTree(items, parentMaterialId) {
    // function traverseAndRenameIds(node: JobMethodTreeItem) {
    //   const clone = structuredClone(node);
    //   clone.id = `node-${Math.random().toString(16).slice(2)}`;
    //   clone.children = clone.children.map((n) => traverseAndRenameIds(n));
    //   return clone;
    // }
    if (parentMaterialId === void 0) { parentMaterialId = null; }
    var rootItems = [];
    var lookup = {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var itemId = item.methodMaterialId;
        var parentId = item.parentMaterialId;
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            // @ts-ignore - we don't add data here
            lookup[itemId] = { id: itemId, children: [] };
        }
        lookup[itemId]["data"] = item;
        var treeItem = lookup[itemId];
        if (parentId === parentMaterialId || parentId === undefined) {
            rootItems.push(treeItem);
        }
        else {
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                // @ts-ignore - we don't add data here
                lookup[parentId] = { id: parentId, children: [] };
            }
            lookup[parentId]["children"].push(treeItem);
        }
    }
    return rootItems;
}
function traverseJobMethod(node, callback) {
    callback(node);
    if (node.children) {
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            traverseJobMethod(child, callback);
        }
    }
}
function getQuoteMethodTree(client_1, methodId_1) {
    return __awaiter(this, arguments, void 0, function (client, methodId, parentMaterialId) {
        var items, tree;
        if (parentMaterialId === void 0) { parentMaterialId = null; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getQuoteMethodTreeArray(client, methodId)];
                case 1:
                    items = _a.sent();
                    if (items.error)
                        return [2 /*return*/, items];
                    tree = getQuoteMethodTreeArrayToTree(items.data, parentMaterialId);
                    return [2 /*return*/, {
                            data: tree,
                            error: null,
                        }];
            }
        });
    });
}
function getQuoteMethodTreeArray(client, methodId) {
    return client.rpc("get_quote_methods_by_method_id", {
        mid: methodId,
    });
}
function getQuoteMethodTreeArrayToTree(items, parentMaterialId) {
    if (parentMaterialId === void 0) { parentMaterialId = null; }
    var rootItems = [];
    var lookup = {};
    for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
        var item = items_2[_i];
        var itemId = item.methodMaterialId;
        var parentId = item.parentMaterialId;
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            lookup[itemId] = { id: itemId, children: [], data: item };
        }
        else {
            lookup[itemId].data = item;
        }
        var treeItem = lookup[itemId];
        if (parentId === parentMaterialId || parentId === undefined) {
            rootItems.push(treeItem);
        }
        else {
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                lookup[parentId] = {
                    id: parentId,
                    children: [],
                    data: {},
                };
            }
            lookup[parentId].children.push(treeItem);
        }
    }
    return rootItems;
}
function traverseQuoteMethod(node, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, child, e_1_1;
        var _d, e_1, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, callback(node)];
                case 1:
                    _g.sent();
                    if (!node.children) return [3 /*break*/, 14];
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 8, 9, 14]);
                    _a = true, _b = __asyncValues(node.children);
                    _g.label = 3;
                case 3: return [4 /*yield*/, _b.next()];
                case 4:
                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 7];
                    _f = _c.value;
                    _a = false;
                    child = _f;
                    return [4 /*yield*/, traverseQuoteMethod(child, callback)];
                case 5:
                    _g.sent();
                    _g.label = 6;
                case 6:
                    _a = true;
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _g.trys.push([9, , 12, 13]);
                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _e.call(_b)];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
var getRatesFromWorkCenters = function (workCenters) {
    return function (processId, workCenterId) {
        var _a, _b, _c;
        if (!workCenters) {
            return {
                laborRate: 0,
                machineRate: 0,
                overheadRate: 0,
            };
        }
        if (workCenterId) {
            var workCenter = workCenters === null || workCenters === void 0 ? void 0 : workCenters.find(function (wc) { return wc.id === workCenterId && wc.active; });
            if (workCenter) {
                return {
                    laborRate: (_a = workCenter.laborRate) !== null && _a !== void 0 ? _a : 0,
                    machineRate: (_b = workCenter.machineRate) !== null && _b !== void 0 ? _b : 0,
                    overheadRate: (_c = workCenter.overheadRate) !== null && _c !== void 0 ? _c : 0,
                };
            }
        }
        var relatedWorkCenters = workCenters.filter(function (wc) {
            var _a;
            var processes = (_a = wc.processes) !== null && _a !== void 0 ? _a : [];
            return wc.active && processes.some(function (p) { return p === processId; });
        });
        if (relatedWorkCenters.length > 0) {
            var laborRate = relatedWorkCenters.reduce(function (acc, workCenter) {
                var _a;
                return (acc += (_a = workCenter.laborRate) !== null && _a !== void 0 ? _a : 0);
            }, 0) / relatedWorkCenters.length;
            var machineRate = relatedWorkCenters.reduce(function (acc, workCenter) {
                var _a;
                return (acc += (_a = workCenter.machineRate) !== null && _a !== void 0 ? _a : 0);
            }, 0) / relatedWorkCenters.length;
            var overheadRate = relatedWorkCenters.reduce(function (acc, workCenter) {
                var _a;
                return (acc += (_a = workCenter.overheadRate) !== null && _a !== void 0 ? _a : 0);
            }, 0) / relatedWorkCenters.length;
            return {
                laborRate: laborRate,
                machineRate: machineRate,
                overheadRate: overheadRate,
            };
        }
        return {
            laborRate: 0,
            machineRate: 0,
            overheadRate: 0,
        };
    };
};
exports.getRatesFromWorkCenters = getRatesFromWorkCenters;
var getRatesFromSupplierProcesses = function (processes) {
    return function (processId, supplierProcessId) {
        if (!processes) {
            return {
                operationMinimumCost: 0,
                operationLeadTime: 0,
            };
        }
        if (supplierProcessId) {
            var supplierProcess = processes === null || processes === void 0 ? void 0 : processes.find(function (sp) { return sp.id === supplierProcessId; });
            if (supplierProcess) {
                return {
                    operationMinimumCost: supplierProcess.minimumCost,
                    operationLeadTime: supplierProcess.leadTime,
                };
            }
        }
        var relatedProcesses = processes.filter(function (p) { return p.processId === processId; });
        if (relatedProcesses.length > 0) {
            var operationMinimumCost = relatedProcesses.reduce(function (acc, process) {
                var _a;
                return (acc += (_a = process.minimumCost) !== null && _a !== void 0 ? _a : 0);
            }, 0) / relatedProcesses.length;
            var operationLeadTime = relatedProcesses.reduce(function (acc, process) {
                var _a;
                return (acc += (_a = process.leadTime) !== null && _a !== void 0 ? _a : 0);
            }, 0) / relatedProcesses.length;
            return {
                operationMinimumCost: operationMinimumCost,
                operationLeadTime: operationLeadTime,
            };
        }
        return {
            operationMinimumCost: 0,
            operationLeadTime: 0,
        };
    };
};
exports.getRatesFromSupplierProcesses = getRatesFromSupplierProcesses;
var costCategoryKeys = [
    "materialCost",
    "partCost",
    "toolCost",
    "consumableCost",
    "serviceCost",
    "laborCost",
    "machineCost",
    "overheadCost",
    "outsideCost",
];
function getSupplierPriceBreaksForItems(client, itemIds) {
    return __awaiter(this, void 0, void 0, function () {
        var supplierParts, supplierPartIds, prices, spToItem, _i, _a, sp, result, _b, _c, sp, current, _d, _e, price, itemId;
        var _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!itemIds.length)
                        return [2 /*return*/, {}];
                    return [4 /*yield*/, client
                            .from("supplierPart")
                            .select("id, itemId, unitPrice")
                            .in("itemId", itemIds)];
                case 1:
                    supplierParts = _h.sent();
                    if (!((_f = supplierParts.data) === null || _f === void 0 ? void 0 : _f.length))
                        return [2 /*return*/, {}];
                    supplierPartIds = supplierParts.data.map(function (sp) { return sp.id; });
                    return [4 /*yield*/, client
                            .from("supplierPartPrice")
                            .select("supplierPartId, quantity, unitPrice")
                            .in("supplierPartId", supplierPartIds)
                            .order("quantity", { ascending: true })];
                case 2:
                    prices = _h.sent();
                    spToItem = new Map();
                    for (_i = 0, _a = supplierParts.data; _i < _a.length; _i++) {
                        sp = _a[_i];
                        spToItem.set(sp.id, sp.itemId);
                    }
                    result = {};
                    for (_b = 0, _c = supplierParts.data; _b < _c.length; _b++) {
                        sp = _c[_b];
                        if (!result[sp.itemId]) {
                            result[sp.itemId] = { priceBreaks: [], fallbackUnitPrice: null };
                        }
                        current = result[sp.itemId].fallbackUnitPrice;
                        if (sp.unitPrice != null && (current === null || sp.unitPrice < current)) {
                            result[sp.itemId].fallbackUnitPrice = sp.unitPrice;
                        }
                    }
                    for (_d = 0, _e = (_g = prices.data) !== null && _g !== void 0 ? _g : []; _d < _e.length; _d++) {
                        price = _e[_d];
                        itemId = spToItem.get(price.supplierPartId);
                        if (itemId && result[itemId]) {
                            result[itemId].priceBreaks.push({
                                quantity: price.quantity,
                                unitPrice: price.unitPrice,
                            });
                        }
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function lookupPriceFromBreaks(priceBreaks, requestedQty, fallbackPrice) {
    var eligible = priceBreaks.filter(function (pb) { return pb.quantity <= requestedQty; });
    if (eligible.length) {
        return eligible.reduce(function (best, pb) {
            return pb.quantity > best.quantity ? pb : best;
        }).unitPrice;
    }
    return fallbackPrice;
}
function lookupBuyPriceFromMap(itemId, requestedQty, priceMap, fallbackCost) {
    var _a;
    var entry = priceMap[itemId];
    if (!entry)
        return fallbackCost;
    return lookupPriceFromBreaks(entry.priceBreaks, requestedQty, (_a = entry.fallbackUnitPrice) !== null && _a !== void 0 ? _a : fallbackCost);
}
function normalizeTimeToHours(time, unit) {
    var fixedHours = 0;
    var hoursPerUnit = 0;
    switch (unit) {
        case "Total Hours":
            fixedHours = time;
            break;
        case "Total Minutes":
            fixedHours = time / 60;
            break;
        case "Hours/Piece":
            hoursPerUnit = time;
            break;
        case "Hours/100 Pieces":
            hoursPerUnit = time / 100;
            break;
        case "Hours/1000 Pieces":
            hoursPerUnit = time / 1000;
            break;
        case "Minutes/Piece":
            hoursPerUnit = time / 60;
            break;
        case "Minutes/100 Pieces":
            hoursPerUnit = time / 100 / 60;
            break;
        case "Minutes/1000 Pieces":
            hoursPerUnit = time / 1000 / 60;
            break;
        case "Pieces/Hour":
            hoursPerUnit = 1 / time;
            break;
        case "Pieces/Minute":
            hoursPerUnit = 1 / (time / 60);
            break;
        case "Seconds/Piece":
            hoursPerUnit = time / 3600;
            break;
    }
    return { fixedHours: fixedHours, hoursPerUnit: hoursPerUnit };
}
function calculateQuoteLinePrices(client, quoteId, quoteLineId, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        function buildEnhancedTree(node, parentQuantity) {
            var qty = node.data.quantity * parentQuantity;
            var nodeOps = operations.filter(function (o) { return o.quoteMakeMethodId === node.data.quoteMaterialMakeMethodId; });
            return {
                itemId: node.data.itemId,
                itemType: node.data.itemType,
                methodType: node.data.methodType,
                quantity: qty,
                unitCost: node.data.unitCost,
                quoteMaterialMakeMethodId: node.data.quoteMaterialMakeMethodId,
                operations: nodeOps,
                children: node.children.map(function (c) { return buildEnhancedTree(c, qty); }),
            };
        }
        function pushBuyCostEffect(itemId, itemType, quantity, unitCost) {
            var costFn = function (outerQty) {
                var requestedQty = quantity * outerQty;
                var resolved = lookupBuyPriceFromMap(itemId, requestedQty, priceMap, unitCost);
                return resolved * requestedQty;
            };
            switch (itemType) {
                case "Material":
                    effects.materialCost.push(costFn);
                    break;
                case "Part":
                    effects.partCost.push(costFn);
                    break;
                case "Tool":
                    effects.toolCost.push(costFn);
                    break;
                case "Consumable":
                    effects.consumableCost.push(costFn);
                    break;
                case "Service":
                    effects.serviceCost.push(costFn);
                    break;
            }
        }
        function walkTree(node) {
            if (node.methodType === "Purchase to Order") {
                pushBuyCostEffect(node.itemId, node.itemType, node.quantity, node.unitCost);
            }
            else if (node.methodType === "Pull from Inventory") {
                var costFn = function (quantity) {
                    return node.unitCost * node.quantity * quantity;
                };
                switch (node.itemType) {
                    case "Material":
                        effects.materialCost.push(costFn);
                        break;
                    case "Part":
                        effects.partCost.push(costFn);
                        break;
                    case "Tool":
                        effects.toolCost.push(costFn);
                        break;
                    case "Consumable":
                        effects.consumableCost.push(costFn);
                        break;
                    case "Service":
                        effects.serviceCost.push(costFn);
                        break;
                }
            }
            var _loop_1 = function (operation) {
                if (operation.operationType === "Inside") {
                    if (operation.setupTime) {
                        var _d = normalizeTimeToHours(operation.setupTime, operation.setupUnit), fixedHours_1 = _d.fixedHours, hoursPerUnit_1 = _d.hoursPerUnit;
                        effects.laborCost.push(function (quantity) {
                            var _a, _b;
                            return (hoursPerUnit_1 * quantity * node.quantity * ((_a = operation.laborRate) !== null && _a !== void 0 ? _a : 0) +
                                fixedHours_1 * ((_b = operation.laborRate) !== null && _b !== void 0 ? _b : 0));
                        });
                        effects.overheadCost.push(function (quantity) {
                            var _a, _b;
                            return (hoursPerUnit_1 *
                                quantity *
                                node.quantity *
                                ((_a = operation.overheadRate) !== null && _a !== void 0 ? _a : 0) +
                                fixedHours_1 * ((_b = operation.overheadRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    var laborFixedHours_1 = 0;
                    var laborHoursPerUnit_1 = 0;
                    var machineFixedHours_1 = 0;
                    var machineHoursPerUnit_1 = 0;
                    if (operation.laborTime) {
                        var normalized = normalizeTimeToHours(operation.laborTime, operation.laborUnit);
                        laborFixedHours_1 = normalized.fixedHours;
                        laborHoursPerUnit_1 = normalized.hoursPerUnit;
                        effects.laborCost.push(function (quantity) {
                            var _a, _b;
                            return (laborHoursPerUnit_1 *
                                quantity *
                                node.quantity *
                                ((_a = operation.laborRate) !== null && _a !== void 0 ? _a : 0) +
                                laborFixedHours_1 * ((_b = operation.laborRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    if (operation.machineTime) {
                        var normalized = normalizeTimeToHours(operation.machineTime, operation.machineUnit);
                        machineFixedHours_1 = normalized.fixedHours;
                        machineHoursPerUnit_1 = normalized.hoursPerUnit;
                        effects.machineCost.push(function (quantity) {
                            var _a, _b;
                            return (machineHoursPerUnit_1 *
                                quantity *
                                node.quantity *
                                ((_a = operation.machineRate) !== null && _a !== void 0 ? _a : 0) +
                                machineFixedHours_1 * ((_b = operation.machineRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    var hoursPerUnit_2 = Math.max(laborHoursPerUnit_1, machineHoursPerUnit_1);
                    var fixedHours_2 = Math.max(laborFixedHours_1, machineFixedHours_1);
                    effects.overheadCost.push(function (quantity) {
                        var _a, _b;
                        if (hoursPerUnit_2 * quantity * node.quantity > fixedHours_2) {
                            return (hoursPerUnit_2 *
                                quantity *
                                node.quantity *
                                ((_a = operation.overheadRate) !== null && _a !== void 0 ? _a : 0));
                        }
                        else {
                            return fixedHours_2 * ((_b = operation.overheadRate) !== null && _b !== void 0 ? _b : 0);
                        }
                    });
                }
                else if (operation.operationType === "Outside") {
                    effects.outsideCost.push(function (quantity) {
                        var unitCost = operation.operationUnitCost * node.quantity * quantity;
                        return Math.max(operation.operationMinimumCost, unitCost);
                    });
                }
            };
            for (var _i = 0, _a = node.operations; _i < _a.length; _i++) {
                var operation = _a[_i];
                _loop_1(operation);
            }
            for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
                var child = _c[_b];
                walkTree(child);
            }
        }
        var _a, quoteLineResult, settingsResult, quoteResult, operationsResult, quoteLine, quantities, exchangeRate, precision, operations, rawMarkups, defaultMarkups, _i, _b, _c, key, value, buyMaterials, buyItemIds, priceMap, _d, _e, mat, price, rootMethod, tree, effects, _f, _g, root, enhanced, priceRows, insertResult;
        var _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("quoteLine")
                            .select("quantity, methodType, unitPricePrecision")
                            .eq("id", quoteLineId)
                            .single(),
                        client
                            .from("companySettings")
                            .select("quoteLineCategoryMarkups")
                            .eq("id", companyId)
                            .single(),
                        client.from("quote").select("exchangeRate").eq("id", quoteId).single(),
                        client
                            .from("quoteOperation")
                            .select("*")
                            .eq("quoteLineId", quoteLineId),
                    ])];
                case 1:
                    _a = _q.sent(), quoteLineResult = _a[0], settingsResult = _a[1], quoteResult = _a[2], operationsResult = _a[3];
                    if (quoteLineResult.error)
                        throw new Error("Failed to get quote line");
                    if (settingsResult.error)
                        throw new Error("Failed to get company settings");
                    if (quoteResult.error)
                        throw new Error("Failed to get quote");
                    quoteLine = quoteLineResult.data;
                    quantities = (_h = quoteLine.quantity) !== null && _h !== void 0 ? _h : [1];
                    exchangeRate = (_j = quoteResult.data.exchangeRate) !== null && _j !== void 0 ? _j : 1;
                    precision = (_k = quoteLine.unitPricePrecision) !== null && _k !== void 0 ? _k : 2;
                    operations = (_l = operationsResult.data) !== null && _l !== void 0 ? _l : [];
                    rawMarkups = (_m = settingsResult.data.quoteLineCategoryMarkups) !== null && _m !== void 0 ? _m : {};
                    defaultMarkups = {};
                    for (_i = 0, _b = Object.entries(rawMarkups); _i < _b.length; _i++) {
                        _c = _b[_i], key = _c[0], value = _c[1];
                        defaultMarkups[key] = value * 100;
                    }
                    return [4 /*yield*/, client
                            .from("quoteMaterial")
                            .select("id, itemId, unitCost")
                            .eq("quoteLineId", quoteLineId)
                            .eq("methodType", "Purchase to Order")];
                case 2:
                    buyMaterials = _q.sent();
                    buyItemIds = __spreadArray([], new Set(((_o = buyMaterials.data) !== null && _o !== void 0 ? _o : []).map(function (m) { return m.itemId; })), true);
                    return [4 /*yield*/, getSupplierPriceBreaksForItems(client, buyItemIds)];
                case 3:
                    priceMap = _q.sent();
                    _d = 0, _e = (_p = buyMaterials.data) !== null && _p !== void 0 ? _p : [];
                    _q.label = 4;
                case 4:
                    if (!(_d < _e.length)) return [3 /*break*/, 7];
                    mat = _e[_d];
                    price = lookupBuyPriceFromMap(mat.itemId, 1, priceMap, mat.unitCost);
                    if (!(price !== mat.unitCost)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("quoteMaterial")
                            .update({ unitCost: price })
                            .eq("id", mat.id)];
                case 5:
                    _q.sent();
                    _q.label = 6;
                case 6:
                    _d++;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, client
                        .from("quoteMakeMethod")
                        .select("id")
                        .eq("quoteLineId", quoteLineId)
                        .is("parentMaterialId", null)
                        .single()];
                case 8:
                    rootMethod = _q.sent();
                    if (rootMethod.error)
                        throw new Error("Failed to get root make method");
                    return [4 /*yield*/, getQuoteMethodTree(client, rootMethod.data.id)];
                case 9:
                    tree = _q.sent();
                    if (tree.error)
                        throw new Error("Failed to get quote method tree");
                    effects = {
                        materialCost: [],
                        partCost: [],
                        toolCost: [],
                        consumableCost: [],
                        serviceCost: [],
                        laborCost: [],
                        machineCost: [],
                        overheadCost: [],
                        outsideCost: [],
                    };
                    // Build enhanced trees and walk them
                    for (_f = 0, _g = tree.data; _f < _g.length; _f++) {
                        root = _g[_f];
                        enhanced = buildEnhancedTree(root, 1);
                        walkTree(enhanced);
                    }
                    priceRows = quantities.map(function (qty) {
                        var categoryCosts = {
                            materialCost: 0,
                            partCost: 0,
                            toolCost: 0,
                            consumableCost: 0,
                            serviceCost: 0,
                            laborCost: 0,
                            machineCost: 0,
                            overheadCost: 0,
                            outsideCost: 0,
                        };
                        for (var _i = 0, costCategoryKeys_1 = costCategoryKeys; _i < costCategoryKeys_1.length; _i++) {
                            var key = costCategoryKeys_1[_i];
                            categoryCosts[key] = effects[key].reduce(function (acc, effect) { return acc + effect(qty); }, 0);
                            // Convert to per-unit cost
                            if (qty > 0) {
                                categoryCosts[key] = categoryCosts[key] / qty;
                            }
                        }
                        // Apply markups
                        var unitPrice = costCategoryKeys.reduce(function (sum, key) {
                            var _a, _b;
                            var cost = (_a = categoryCosts[key]) !== null && _a !== void 0 ? _a : 0;
                            var markup = (_b = defaultMarkups[key]) !== null && _b !== void 0 ? _b : 0;
                            return sum + cost * (1 + markup / 100);
                        }, 0);
                        var roundedUnitPrice = Number(unitPrice.toFixed(precision));
                        return {
                            quoteId: quoteId,
                            quoteLineId: quoteLineId,
                            quantity: qty,
                            unitPrice: roundedUnitPrice,
                            categoryMarkups: defaultMarkups,
                            exchangeRate: exchangeRate,
                            createdBy: userId,
                            leadTime: 0,
                            discountPercent: 0,
                        };
                    });
                    // 7. Delete existing and insert quoteLinePrice rows
                    return [4 /*yield*/, client.from("quoteLinePrice").delete().eq("quoteLineId", quoteLineId)];
                case 10:
                    // 7. Delete existing and insert quoteLinePrice rows
                    _q.sent();
                    return [4 /*yield*/, client.from("quoteLinePrice").insert(priceRows)];
                case 11:
                    insertResult = _q.sent();
                    if (insertResult.error)
                        throw new Error("Failed to insert quote line prices");
                    return [2 /*return*/];
            }
        });
    });
}
