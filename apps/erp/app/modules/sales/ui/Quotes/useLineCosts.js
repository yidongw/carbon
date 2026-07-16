"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLineCosts = useLineCosts;
var react_1 = require("react");
var react_router_1 = require("react-router");
var shared_1 = require("~/modules/shared");
var defaultEffects = {
    consumableCost: [],
    laborCost: [],
    laborHours: [],
    machineCost: [],
    machineHours: [],
    materialCost: [],
    outsideCost: [],
    overheadCost: [],
    partCost: [],
    serviceCost: [],
    setupHours: [],
    toolCost: []
};
function useLineCosts(_a) {
    var originalMethodTree = _a.methodTree, operations = _a.operations, line = _a.line, _b = _a.supplierPriceMap, supplierPriceMap = _b === void 0 ? {} : _b;
    var _c = (0, react_router_1.useParams)(), quoteId = _c.quoteId, lineId = _c.lineId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    if (!lineId)
        throw new Error("Could not find lineId");
    // TODO: instead of walking the tree twice (once for the quantities/operations and once for the effects)
    // we could do it all in one pass
    var methodTree = (0, react_1.useMemo)(function () {
        if (!originalMethodTree || !originalMethodTree.id) {
            return undefined;
        }
        var tree = structuredClone(originalMethodTree);
        function traverseTree(tree, parentQuantity) {
            // multiply quantity by parent quantity
            tree.data.quantity = tree.data.quantity * parentQuantity;
            tree.data.operations = operations.filter(function (o) { return o.quoteMakeMethodId === tree.data.quoteMaterialMakeMethodId; });
            if (tree.children) {
                for (var _i = 0, _a = tree.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    traverseTree(child, tree.data.quantity);
                }
            }
        }
        traverseTree(tree, 1);
        return tree;
    }, [operations, originalMethodTree]);
    var costEffects = (0, react_1.useMemo)(function () {
        var _a, _b;
        var effects = structuredClone(defaultEffects);
        function pushBuyCostEffect(itemId, itemType, quantity, unitCost, supplierPriceMap) {
            var costFn = function (outerQty) {
                var requestedQty = quantity * outerQty;
                var resolved = (0, shared_1.lookupBuyPriceFromMap)(itemId, requestedQty, supplierPriceMap, unitCost);
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
                default:
                    break;
            }
        }
        function walkTree(tree) {
            var _a;
            var data = tree.data;
            if (data.methodType === "Purchase to Order") {
                pushBuyCostEffect(data.itemId, data.itemType, data.quantity, data.unitCost, supplierPriceMap);
            }
            else if (data.methodType === "Pull from Inventory") {
                // Pick items use static average cost
                var costFn = function (quantity) {
                    return data.unitCost * data.quantity * quantity;
                };
                switch (data.itemType) {
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
                    default:
                        break;
                }
            }
            (_a = data.operations) === null || _a === void 0 ? void 0 : _a.forEach(function (operation) {
                if (operation.operationType === "Inside") {
                    if (operation.setupTime) {
                        // normalize production standard to hours
                        var hoursPerUnit_1 = 0;
                        var fixedHours_1 = 0;
                        switch (operation.setupUnit) {
                            case "Total Hours":
                                fixedHours_1 = operation.setupTime;
                                break;
                            case "Total Minutes":
                                fixedHours_1 = operation.setupTime / 60;
                                break;
                            case "Hours/Piece":
                                hoursPerUnit_1 = operation.setupTime;
                                break;
                            case "Hours/100 Pieces":
                                hoursPerUnit_1 = operation.setupTime / 100;
                                break;
                            case "Hours/1000 Pieces":
                                hoursPerUnit_1 = operation.setupTime / 1000;
                                break;
                            case "Minutes/Piece":
                                hoursPerUnit_1 = operation.setupTime / 60;
                                break;
                            case "Minutes/100 Pieces":
                                hoursPerUnit_1 = operation.setupTime / 100 / 60;
                                break;
                            case "Minutes/1000 Pieces":
                                hoursPerUnit_1 = operation.setupTime / 1000 / 60;
                                break;
                            case "Pieces/Hour":
                                hoursPerUnit_1 = 1 / operation.setupTime;
                                break;
                            case "Pieces/Minute":
                                hoursPerUnit_1 = 1 / (operation.setupTime / 60);
                                break;
                            case "Seconds/Piece":
                                hoursPerUnit_1 = operation.setupTime / 3600;
                                break;
                            default:
                                break;
                        }
                        effects.setupHours.push(function (quantity) {
                            return hoursPerUnit_1 * quantity * data.quantity + fixedHours_1;
                        });
                        effects.laborCost.push(function (quantity) {
                            var _a, _b;
                            return (hoursPerUnit_1 *
                                quantity *
                                data.quantity *
                                ((_a = operation.laborRate) !== null && _a !== void 0 ? _a : 0) +
                                fixedHours_1 * ((_b = operation.laborRate) !== null && _b !== void 0 ? _b : 0));
                        });
                        effects.overheadCost.push(function (quantity) {
                            var _a, _b;
                            return (hoursPerUnit_1 *
                                quantity *
                                data.quantity *
                                ((_a = operation.overheadRate) !== null && _a !== void 0 ? _a : 0) +
                                fixedHours_1 * ((_b = operation.overheadRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    var laborFixedHours_1 = 0;
                    var laborHoursPerUnit_1 = 0;
                    var machineFixedHours_1 = 0;
                    var machineHoursPerUnit_1 = 0;
                    if (operation.laborTime) {
                        // normalize production standard to hours
                        switch (operation.laborUnit) {
                            case "Total Hours":
                                laborFixedHours_1 = operation.laborTime;
                                break;
                            case "Total Minutes":
                                laborFixedHours_1 = operation.laborTime / 60;
                                break;
                            case "Hours/Piece":
                                laborHoursPerUnit_1 = operation.laborTime;
                                break;
                            case "Hours/100 Pieces":
                                laborHoursPerUnit_1 = operation.laborTime / 100;
                                break;
                            case "Hours/1000 Pieces":
                                laborHoursPerUnit_1 = operation.laborTime / 1000;
                                break;
                            case "Minutes/Piece":
                                laborHoursPerUnit_1 = operation.laborTime / 60;
                                break;
                            case "Minutes/100 Pieces":
                                laborHoursPerUnit_1 = operation.laborTime / 100 / 60;
                                break;
                            case "Minutes/1000 Pieces":
                                laborHoursPerUnit_1 = operation.laborTime / 1000 / 60;
                                break;
                            case "Pieces/Hour":
                                laborHoursPerUnit_1 = 1 / operation.laborTime;
                                break;
                            case "Pieces/Minute":
                                laborHoursPerUnit_1 = 1 / (operation.laborTime / 60);
                                break;
                            case "Seconds/Piece":
                                laborHoursPerUnit_1 = operation.laborTime / 3600;
                                break;
                            default:
                                break;
                        }
                        effects.laborHours.push(function (quantity) {
                            return (laborHoursPerUnit_1 * quantity * data.quantity + laborFixedHours_1);
                        });
                        effects.laborCost.push(function (quantity) {
                            var _a, _b;
                            return (laborHoursPerUnit_1 *
                                quantity *
                                data.quantity *
                                ((_a = operation.laborRate) !== null && _a !== void 0 ? _a : 0) +
                                laborFixedHours_1 * ((_b = operation.laborRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    if (operation.machineTime) {
                        // normalize production standard to hours
                        switch (operation.machineUnit) {
                            case "Total Hours":
                                machineFixedHours_1 = operation.machineTime;
                                break;
                            case "Total Minutes":
                                machineFixedHours_1 = operation.machineTime / 60;
                                break;
                            case "Hours/Piece":
                                machineHoursPerUnit_1 = operation.machineTime;
                                break;
                            case "Hours/100 Pieces":
                                machineHoursPerUnit_1 = operation.machineTime / 100;
                                break;
                            case "Hours/1000 Pieces":
                                machineHoursPerUnit_1 = operation.machineTime / 1000;
                                break;
                            case "Minutes/Piece":
                                machineHoursPerUnit_1 = operation.machineTime / 60;
                                break;
                            case "Minutes/100 Pieces":
                                machineHoursPerUnit_1 = operation.machineTime / 100 / 60;
                                break;
                            case "Minutes/1000 Pieces":
                                machineHoursPerUnit_1 = operation.machineTime / 1000 / 60;
                                break;
                            case "Pieces/Hour":
                                machineHoursPerUnit_1 = 1 / operation.machineTime;
                                break;
                            case "Pieces/Minute":
                                machineHoursPerUnit_1 = 1 / (operation.machineTime / 60);
                                break;
                            case "Seconds/Piece":
                                machineHoursPerUnit_1 = operation.machineTime / 3600;
                                break;
                            default:
                                break;
                        }
                        effects.machineHours.push(function (quantity) {
                            return (machineHoursPerUnit_1 * quantity * data.quantity +
                                machineFixedHours_1);
                        });
                        effects.machineCost.push(function (quantity) {
                            var _a, _b;
                            return (machineHoursPerUnit_1 *
                                quantity *
                                data.quantity *
                                ((_a = operation.machineRate) !== null && _a !== void 0 ? _a : 0) +
                                machineFixedHours_1 * ((_b = operation.machineRate) !== null && _b !== void 0 ? _b : 0));
                        });
                    }
                    var hoursPerUnit_2 = Math.max(laborHoursPerUnit_1, machineHoursPerUnit_1);
                    var fixedHours_2 = Math.max(laborFixedHours_1, machineFixedHours_1);
                    effects.overheadCost.push(function (quantity) {
                        var _a, _b;
                        if (hoursPerUnit_2 * quantity * data.quantity > fixedHours_2) {
                            return (hoursPerUnit_2 *
                                quantity *
                                data.quantity *
                                ((_a = operation.overheadRate) !== null && _a !== void 0 ? _a : 0));
                        }
                        else {
                            return fixedHours_2 * ((_b = operation.overheadRate) !== null && _b !== void 0 ? _b : 0);
                        }
                    });
                }
                else if (operation.operationType === "Outside") {
                    effects.outsideCost.push(function (quantity) {
                        var unitCost = operation.operationUnitCost * data.quantity * quantity;
                        return Math.max(operation.operationMinimumCost, unitCost);
                    });
                }
            });
            if (tree.children) {
                for (var _i = 0, _b = tree.children; _i < _b.length; _i++) {
                    var child = _b[_i];
                    walkTree(child);
                }
            }
        }
        if (methodTree && line.methodType === "Make to Order") {
            walkTree(methodTree);
        }
        else if (line.methodType === "Purchase to Order") {
            pushBuyCostEffect((_a = line.itemId) !== null && _a !== void 0 ? _a : "", "Material", 1, (_b = line.unitCost) !== null && _b !== void 0 ? _b : 0, supplierPriceMap);
        }
        else {
            effects.materialCost.push(function (quantity) { var _a; return ((_a = line.unitCost) !== null && _a !== void 0 ? _a : 0) * quantity; });
        }
        return effects;
    }, [
        methodTree,
        line.methodType,
        line.unitCost,
        line.itemId,
        supplierPriceMap
    ]);
    var getCosts = (0, react_1.useCallback)(function (quantity) {
        var materialCost = costEffects.materialCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var partCost = costEffects.partCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var toolCost = costEffects.toolCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var consumableCost = costEffects.consumableCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var serviceCost = costEffects.serviceCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var laborCost = costEffects.laborCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var overheadCost = costEffects.overheadCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var outsideCost = costEffects.outsideCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var setupHours = costEffects.setupHours.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var laborHours = costEffects.laborHours.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var machineCost = costEffects.machineCost.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        var machineHours = costEffects.machineHours.reduce(function (acc, effect) { return acc + effect(quantity); }, 0);
        return {
            consumableCost: consumableCost,
            laborCost: laborCost,
            laborHours: laborHours,
            machineCost: machineCost,
            machineHours: machineHours,
            materialCost: materialCost,
            outsideCost: outsideCost,
            overheadCost: overheadCost,
            partCost: partCost,
            serviceCost: serviceCost,
            setupHours: setupHours,
            toolCost: toolCost
        };
    }, [costEffects]);
    return getCosts;
}
