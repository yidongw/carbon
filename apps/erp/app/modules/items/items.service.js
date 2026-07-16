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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateMethodVersion = activateMethodVersion;
exports.copyItem = copyItem;
exports.copyMakeMethod = copyMakeMethod;
exports.createRevision = createRevision;
exports.deleteConfigurationParameter = deleteConfigurationParameter;
exports.deleteConfigurationRule = deleteConfigurationRule;
exports.deleteItemCustomerPart = deleteItemCustomerPart;
exports.deleteConfigurationParameterGroup = deleteConfigurationParameterGroup;
exports.deleteItem = deleteItem;
exports.deleteItemPostingGroup = deleteItemPostingGroup;
exports.deleteMaterialDimension = deleteMaterialDimension;
exports.deleteMaterialFinish = deleteMaterialFinish;
exports.deleteMaterialForm = deleteMaterialForm;
exports.deleteMaterialGrade = deleteMaterialGrade;
exports.deleteStyleColor = deleteStyleColor;
exports.deleteStyleSize = deleteStyleSize;
exports.deleteMaterialSubstance = deleteMaterialSubstance;
exports.deleteMethodMaterial = deleteMethodMaterial;
exports.assertMethodOperationIsDraft = assertMethodOperationIsDraft;
exports.deleteMethodOperation = deleteMethodOperation;
exports.deleteMethodOperationStep = deleteMethodOperationStep;
exports.deleteMethodOperationParameter = deleteMethodOperationParameter;
exports.deleteMethodOperationTool = deleteMethodOperationTool;
exports.deleteUnitOfMeasure = deleteUnitOfMeasure;
exports.getConfigurationParameters = getConfigurationParameters;
exports.getConfigurationRules = getConfigurationRules;
exports.getConsumable = getConsumable;
exports.getConsumables = getConsumables;
exports.getConsumablesList = getConsumablesList;
exports.getItem = getItem;
exports.getItemCost = getItemCost;
exports.getItemCostHistory = getItemCostHistory;
exports.getItemCustomerPart = getItemCustomerPart;
exports.getItemCustomerParts = getItemCustomerParts;
exports.getItemDemand = getItemDemand;
exports.getDemandForecastSources = getDemandForecastSources;
exports.getItemFiles = getItemFiles;
exports.getItemPostingGroup = getItemPostingGroup;
exports.getItemPostingGroups = getItemPostingGroups;
exports.getItemPostingGroupsList = getItemPostingGroupsList;
exports.getItemManufacturing = getItemManufacturing;
exports.getItemPlanning = getItemPlanning;
exports.getItemQuantities = getItemQuantities;
exports.getItemReplenishment = getItemReplenishment;
exports.getItemStorageUnitQuantities = getItemStorageUnitQuantities;
exports.getItemSupply = getItemSupply;
exports.getItemUnitSalePrice = getItemUnitSalePrice;
exports.getJobMaterialUsageForItem = getJobMaterialUsageForItem;
exports.getMaterialUsedIn = getMaterialUsedIn;
exports.getMakeMethods = getMakeMethods;
exports.getMakeMethodById = getMakeMethodById;
exports.getMaterial = getMaterial;
exports.getMaterials = getMaterials;
exports.getMaterialsList = getMaterialsList;
exports.getMaterialDimension = getMaterialDimension;
exports.getMaterialDimensions = getMaterialDimensions;
exports.getMaterialDimensionList = getMaterialDimensionList;
exports.getMaterialFinish = getMaterialFinish;
exports.getMaterialFinishes = getMaterialFinishes;
exports.getMaterialFinishList = getMaterialFinishList;
exports.getMaterialForm = getMaterialForm;
exports.getMaterialForms = getMaterialForms;
exports.getMaterialFormsList = getMaterialFormsList;
exports.getMaterialGrades = getMaterialGrades;
exports.getMaterialGrade = getMaterialGrade;
exports.getMaterialGradeList = getMaterialGradeList;
exports.getMaterialSubstance = getMaterialSubstance;
exports.getMaterialSubstances = getMaterialSubstances;
exports.getMaterialSubstancesList = getMaterialSubstancesList;
exports.getMethodMaterial = getMethodMaterial;
exports.getMethodMaterials = getMethodMaterials;
exports.getMethodMaterialsByMakeMethod = getMethodMaterialsByMakeMethod;
exports.getMethodOperations = getMethodOperations;
exports.getMethodOperationsByMakeMethodId = getMethodOperationsByMakeMethodId;
exports.getMethodTree = getMethodTree;
exports.getMethodTreeArray = getMethodTreeArray;
exports.getOpenJobMaterials = getOpenJobMaterials;
exports.getOpenProductionOrders = getOpenProductionOrders;
exports.getOpenPurchaseOrderLines = getOpenPurchaseOrderLines;
exports.getOpenSalesOrderLines = getOpenSalesOrderLines;
exports.getPart = getPart;
exports.getStyle = getStyle;
exports.getParts = getParts;
exports.getStyles = getStyles;
exports.getStyleColor = getStyleColor;
exports.getStyleColors = getStyleColors;
exports.getStyleColorList = getStyleColorList;
exports.seedStyleReference = seedStyleReference;
exports.getStyleSize = getStyleSize;
exports.getStyleSizes = getStyleSizes;
exports.getStyleSizeList = getStyleSizeList;
exports.getPartsList = getPartsList;
exports.getStylesList = getStylesList;
exports.getPartUsedIn = getPartUsedIn;
exports.getPickMethod = getPickMethod;
exports.getPickMethods = getPickMethods;
exports.getServices = getServices;
exports.getService = getService;
exports.getServicesList = getServicesList;
exports.getSupplierParts = getSupplierParts;
exports.getTool = getTool;
exports.getTools = getTools;
exports.getToolsList = getToolsList;
exports.getUnitOfMeasure = getUnitOfMeasure;
exports.getUnitOfMeasures = getUnitOfMeasures;
exports.getUnitOfMeasuresList = getUnitOfMeasuresList;
exports.updateConfigurationParameterGroupOrder = updateConfigurationParameterGroupOrder;
exports.updateDefaultRevision = updateDefaultRevision;
exports.updateConfigurationParameterOrder = updateConfigurationParameterOrder;
exports.updateItemCost = updateItemCost;
exports.updateMaterialOrder = updateMaterialOrder;
exports.updateOperationOrder = updateOperationOrder;
exports.updateRevision = updateRevision;
exports.syncStyleConfigurationParameters = syncStyleConfigurationParameters;
exports.upsertConfigurationParameter = upsertConfigurationParameter;
exports.upsertConfigurationParameterGroup = upsertConfigurationParameterGroup;
exports.upsertConfigurationRule = upsertConfigurationRule;
exports.upsertItemDefaultPickMethod = upsertItemDefaultPickMethod;
exports.getRecipeProcessIdsForItem = getRecipeProcessIdsForItem;
exports.getItemShelfLife = getItemShelfLife;
exports.getBomHasShelfLifeManagedInput = getBomHasShelfLifeManagedInput;
exports.upsertItemShelfLife = upsertItemShelfLife;
exports.upsertPickMethodWithShelfLife = upsertPickMethodWithShelfLife;
exports.cascadeItemTrackingType = cascadeItemTrackingType;
exports.updateItemMethodAndSourcing = updateItemMethodAndSourcing;
exports.upsertConsumable = upsertConsumable;
exports.upsertPart = upsertPart;
exports.upsertStyle = upsertStyle;
exports.updateItem = updateItem;
exports.upsertItemCost = upsertItemCost;
exports.upsertPickMethod = upsertPickMethod;
exports.upsertItemManufacturing = upsertItemManufacturing;
exports.upsertItemPlanning = upsertItemPlanning;
exports.upsertItemPurchasing = upsertItemPurchasing;
exports.upsertItemPostingGroup = upsertItemPostingGroup;
exports.upsertSupplierPart = upsertSupplierPart;
exports.upsertItemCustomerPart = upsertItemCustomerPart;
exports.upsertItemUnitSalePrice = upsertItemUnitSalePrice;
exports.upsertMakeMethodVersion = upsertMakeMethodVersion;
exports.upsertMethodMaterial = upsertMethodMaterial;
exports.upsertMethodOperation = upsertMethodOperation;
exports.upsertMethodOperationStep = upsertMethodOperationStep;
exports.upsertMethodOperationParameter = upsertMethodOperationParameter;
exports.upsertMethodOperationTool = upsertMethodOperationTool;
exports.upsertMaterial = upsertMaterial;
exports.upsertMaterialDimension = upsertMaterialDimension;
exports.upsertMaterialFinish = upsertMaterialFinish;
exports.upsertStyleColor = upsertStyleColor;
exports.upsertStyleSize = upsertStyleSize;
exports.upsertMaterialForm = upsertMaterialForm;
exports.upsertMaterialGrade = upsertMaterialGrade;
exports.deleteMaterialType = deleteMaterialType;
exports.getMaterialTypes = getMaterialTypes;
exports.getMaterialType = getMaterialType;
exports.getMaterialTypeList = getMaterialTypeList;
exports.upsertMaterialType = upsertMaterialType;
exports.upsertMaterialSubstance = upsertMaterialSubstance;
exports.upsertService = upsertService;
exports.upsertUnitOfMeasure = upsertUnitOfMeasure;
exports.upsertTool = upsertTool;
exports.getSupplierPriceBreaksForItems = getSupplierPriceBreaksForItems;
exports.lookupBuyPrice = lookupBuyPrice;
exports.getSupplierPartPriceBreaks = getSupplierPartPriceBreaks;
var database_1 = require("@carbon/database");
var style_reference_1 = require("@carbon/database/style-reference");
var date_1 = require("@internationalized/date");
var nanoid_1 = require("nanoid");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var shared_1 = require("../shared");
var items_models_1 = require("./items.models");
var styleMethod_service_1 = require("./styleMethod.service");
function activateMethodVersion(client, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("convert", {
                    body: __assign({ type: "methodVersionToActive" }, payload)
                })];
        });
    });
}
function copyItem(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("get-method", {
                    body: {
                        type: "itemToItem",
                        sourceId: args.sourceId,
                        targetId: args.targetId,
                        companyId: args.companyId,
                        userId: args.userId,
                        parts: {
                            billOfMaterial: args.billOfMaterial,
                            billOfProcess: args.billOfProcess,
                            parameters: args.parameters,
                            tools: args.tools,
                            steps: args.steps,
                            workInstructions: args.workInstructions
                        }
                    }
                })];
        });
    });
}
function copyMakeMethod(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("get-method", {
                    body: {
                        type: "makeMethodToMakeMethod",
                        sourceId: args.sourceId,
                        targetId: args.targetId,
                        companyId: args.companyId,
                        userId: args.userId,
                        parts: {
                            billOfMaterial: args.billOfMaterial,
                            billOfProcess: args.billOfProcess,
                            parameters: args.parameters,
                            tools: args.tools,
                            steps: args.steps,
                            workInstructions: args.workInstructions
                        }
                    }
                })];
        });
    });
}
function createRevision(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var item, revision, createdBy, itemInsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    item = args.item, revision = args.revision, createdBy = args.createdBy;
                    return [4 /*yield*/, client
                            .from("item")
                            .insert({
                            readableId: item.readableId,
                            revision: revision,
                            name: item.name,
                            type: item.type,
                            replenishmentSystem: item.replenishmentSystem,
                            defaultMethodType: item.defaultMethodType,
                            itemTrackingType: item.itemTrackingType,
                            unitOfMeasureCode: item.unitOfMeasureCode,
                            active: true,
                            modelUploadId: item.modelUploadId,
                            companyId: item.companyId,
                            createdBy: createdBy
                        })
                            .select("id")
                            .single()];
                case 1:
                    itemInsert = _a.sent();
                    if (itemInsert.error) {
                        return [2 /*return*/, itemInsert];
                    }
                    if (!(item.replenishmentSystem !== "Buy")) return [3 /*break*/, 3];
                    return [4 /*yield*/, client.functions.invoke("get-method", {
                            body: {
                                type: "itemToItem",
                                sourceId: item.id,
                                targetId: itemInsert.data.id,
                                companyId: item.companyId,
                                userId: createdBy
                            }
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, itemInsert];
            }
        });
    });
}
function deleteConfigurationParameter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("configurationParameter").delete().eq("id", id)];
        });
    });
}
function deleteConfigurationRule(client, field, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("configurationRule")
                    .delete()
                    .eq("field", field)
                    .eq("itemId", itemId)];
        });
    });
}
function deleteItemCustomerPart(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerPartToItem")
                    .delete()
                    .eq("id", id)
                    .eq("companyId", companyId)];
        });
    });
}
function deleteConfigurationParameterGroup(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var parameters, ungrouped;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("configurationParameter")
                        .select("id")
                        .eq("configurationParameterGroupId", id)];
                case 1:
                    parameters = (_a.sent()).data;
                    if (!(parameters && parameters.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("configurationParameterGroup")
                            .select("id")
                            .eq("isUngrouped", true)
                            .single()];
                case 2:
                    ungrouped = (_a.sent()).data;
                    if (!ungrouped) return [3 /*break*/, 4];
                    // Update all parameters to use the ungrouped group
                    return [4 /*yield*/, client
                            .from("configurationParameter")
                            .update({ configurationParameterGroupId: ungrouped.id })
                            .eq("configurationParameterGroupId", id)];
                case 3:
                    // Update all parameters to use the ungrouped group
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, client.from("configurationParameterGroup").delete().eq("id", id)];
            }
        });
    });
}
function deleteItem(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("item").delete().eq("id", id)];
        });
    });
}
function deleteItemPostingGroup(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("itemPostingGroup").delete().eq("id", id)];
        });
    });
}
function deleteMaterialDimension(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialDimension").delete().eq("id", id)];
        });
    });
}
function deleteMaterialFinish(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialFinish").delete().eq("id", id)];
        });
    });
}
function deleteMaterialForm(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialForm").delete().eq("id", id)];
        });
    });
}
function deleteMaterialGrade(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialGrade").delete().eq("id", id)];
        });
    });
}
function deleteStyleColor(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            return [2 /*return*/, styleClient.from("styleColor").delete().eq("id", id)];
        });
    });
}
function deleteStyleSize(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            return [2 /*return*/, styleClient.from("styleSize").delete().eq("id", id)];
        });
    });
}
function deleteMaterialSubstance(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialSubstance").delete().eq("id", id)];
        });
    });
}
function deleteMethodMaterial(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("methodMaterial").delete().eq("id", id)];
        });
    });
}
function assertMethodOperationIsDraft(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("methodOperation")
                        .select("makeMethodId, makeMethod!inner(status)")
                        .eq("id", operationId)
                        .single()];
                case 1:
                    result = _a.sent();
                    if (result.error || !result.data) {
                        throw new Error("Failed to find method operation");
                    }
                    status = result.data.makeMethod.status;
                    if (status !== "Draft") {
                        throw new Error("Cannot modify steps on a method version with status \"".concat(status, "\". Only Draft versions can be modified."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function deleteMethodOperation(client, methodOperationId) {
    return __awaiter(this, void 0, void 0, function () {
        var operation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("methodOperation")
                        .select("id, tags, customFields")
                        .eq("id", methodOperationId)
                        .single()];
                case 1:
                    operation = _a.sent();
                    if (operation.error)
                        return [2 /*return*/, operation];
                    if ((0, styleMethod_service_1.isStyleSystemOwnedOperation)(operation.data)) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "System-owned Style cutting operations cannot be deleted from the bill of process."
                                }
                            }];
                    }
                    return [2 /*return*/, client.from("methodOperation").delete().eq("id", methodOperationId)];
            }
        });
    });
}
function deleteMethodOperationStep(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("methodOperationStep").delete().eq("id", id)];
        });
    });
}
function deleteMethodOperationParameter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("methodOperationParameter").delete().eq("id", id)];
        });
    });
}
function deleteMethodOperationTool(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("methodOperationTool").delete().eq("id", id)];
        });
    });
}
function deleteUnitOfMeasure(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("unitOfMeasure").delete().eq("id", id)];
        });
    });
}
function getConfigurationParameters(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, parameters, groups;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        // Order by sortOrder so the derived "primary" parameter (the first
                        // list-typed param, used to build job/quote quantity columns) is
                        // deterministic and follows the user-defined order rather than the
                        // arbitrary order PostgREST returns without an explicit sort.
                        client
                            .from("configurationParameter")
                            .select("*")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .order("sortOrder", { ascending: true })
                            .order("createdAt", { ascending: true }),
                        client
                            .from("configurationParameterGroup")
                            .select("*")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .order("sortOrder", { ascending: true })
                    ])];
                case 1:
                    _a = _d.sent(), parameters = _a[0], groups = _a[1];
                    if (parameters.error) {
                        console.error(parameters.error);
                        return [2 /*return*/, { groups: [], parameters: [] }];
                    }
                    if (groups.error) {
                        console.error(groups.error);
                        return [2 /*return*/, { groups: [], parameters: [] }];
                    }
                    return [2 /*return*/, { groups: (_b = groups.data) !== null && _b !== void 0 ? _b : [], parameters: (_c = parameters.data) !== null && _c !== void 0 ? _c : [] }];
            }
        });
    });
}
function getConfigurationRules(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("configurationRule")
                        .select("*")
                        .eq("itemId", itemId)
                        .eq("companyId", companyId)];
                case 1:
                    result = _b.sent();
                    if (result.error) {
                        console.error(result.error);
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, (_a = result.data) !== null && _a !== void 0 ? _a : []];
            }
        });
    });
}
function getConsumable(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .rpc("get_consumable_details", {
                    item_id: itemId
                })
                    .single()];
        });
    });
}
function getConsumables(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("consumables")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("readableIdWithRevision.ilike.%".concat(args.search, "%,name.ilike.%").concat(args.search, "%,description.ilike.%").concat(args.search, "%,supplierIds.ilike.%").concat(args.search, "%"));
            }
            if (args.supplierId) {
                query = query.contains("supplierIds", [args.supplierId]);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "readableIdWithRevision", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getConsumablesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "item", "id, name, readableIdWithRevision", function (query) {
                    return query
                        .eq("type", "Consumable")
                        .eq("companyId", companyId)
                        .eq("active", true)
                        .order("name");
                })];
        });
    });
}
function getItem(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("item").select("*").eq("id", id).single()];
        });
    });
}
function getItemCost(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemCost")
                    .select("*, ...item(readableIdWithRevision)")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getItemCostHistory(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var dateOneYearAgo;
        return __generator(this, function (_a) {
            dateOneYearAgo = (0, date_1.today)((0, date_1.getLocalTimeZone)())
                .subtract({ years: 1 })
                .toString();
            return [2 /*return*/, client
                    .from("costLedger")
                    .select("*")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)
                    .gte("postingDate", dateOneYearAgo)
                    .order("postingDate", { ascending: false })];
        });
    });
}
function getItemCustomerPart(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerPartToItem")
                    .select("*, customer(id, name)")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getItemCustomerParts(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerPartToItem")
                    .select("*, customer(id, name)")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)];
        });
    });
}
function getItemDemand(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var _c, actuals, forecasts;
        var _d, _e;
        var itemId = _b.itemId, locationId = _b.locationId, periods = _b.periods, companyId = _b.companyId;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("demandActual")
                            .select("*")
                            .eq("itemId", itemId)
                            .eq("locationId", locationId)
                            .eq("companyId", companyId)
                            .in("periodId", periods),
                        client
                            .from("demandForecast")
                            .select("*")
                            .eq("itemId", itemId)
                            .eq("locationId", locationId)
                            .eq("companyId", companyId)
                            .in("periodId", periods)
                            .order("periodId")
                    ])];
                case 1:
                    _c = _f.sent(), actuals = _c[0], forecasts = _c[1];
                    return [2 /*return*/, {
                            actuals: (_d = actuals.data) !== null && _d !== void 0 ? _d : [],
                            forecasts: (_e = forecasts.data) !== null && _e !== void 0 ? _e : []
                        }];
            }
        });
    });
}
function getDemandForecastSources(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var result;
        var _c;
        var itemId = _b.itemId, locationId = _b.locationId, periods = _b.periods, companyId = _b.companyId;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("demandForecastSource")
                        .select("\n        itemId,\n        locationId,\n        periodId,\n        sourceType,\n        quantity,\n        jobId,\n        salesOrderLineId,\n        demandProjectionId,\n        parentItemId,\n        parentItem:item!demandForecastSource_parentItemId_fkey(id, readableId, name),\n        job:job!demandForecastSource_jobId_fkey(id, jobId, dueDate, status),\n        salesOrderLine:salesOrderLine!demandForecastSource_salesOrderLineId_fkey(\n          id,\n          salesOrderId,\n          promisedDate,\n          salesOrder:salesOrder(id, salesOrderId)\n        ),\n        demandProjection:demandProjection!demandForecastSource_demandProjectionId_fkey(\n          id,\n          forecastQuantity,\n          forecastMethod,\n          confidence,\n          notes,\n          period(startDate),\n          createdBy,\n          createdAt\n        )\n      ")
                        .eq("itemId", itemId)
                        .eq("locationId", locationId)
                        .eq("companyId", companyId)
                        .in("periodId", periods)];
                case 1:
                    result = _d.sent();
                    return [2 /*return*/, {
                            data: (_c = result.data) !== null && _c !== void 0 ? _c : [],
                            error: result.error
                        }];
            }
        });
    });
}
function getItemFiles(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.storage
                        .from("private")
                        .list("".concat(companyId, "/parts/").concat(itemId))];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.data || []];
            }
        });
    });
}
function getItemPostingGroup(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("itemPostingGroup").select("*").eq("id", id).single()];
        });
    });
}
function getItemPostingGroups(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("itemPostingGroup")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getItemPostingGroupsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemPostingGroup")
                    .select("id, name", { count: "exact" })
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getItemManufacturing(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemReplenishment")
                    .select("*")
                    .eq("itemId", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getItemPlanning(client, itemId, companyId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemPlanning")
                    .select("*")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)
                    .eq("locationId", locationId)
                    .maybeSingle()];
        });
    });
}
function getItemQuantities(client, itemId, companyId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .rpc("get_inventory_quantities", {
                    location_id: locationId,
                    company_id: companyId
                })
                    .eq("id", itemId)
                    .maybeSingle()];
        });
    });
}
function getItemReplenishment(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemReplenishment")
                    .select("*")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getItemStorageUnitQuantities(client, itemId, companyId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_item_quantities_by_tracking_id", {
                    item_id: itemId,
                    company_id: companyId,
                    location_id: locationId
                })];
        });
    });
}
function getItemSupply(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var _c, actuals, forecasts;
        var _d, _e;
        var itemId = _b.itemId, locationId = _b.locationId, periods = _b.periods, companyId = _b.companyId;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("supplyActual")
                            .select("*")
                            .eq("itemId", itemId)
                            .eq("locationId", locationId)
                            .eq("companyId", companyId)
                            .in("periodId", periods)
                            .order("periodId"),
                        client
                            .from("supplyForecast")
                            .select("*")
                            .eq("itemId", itemId)
                            .eq("locationId", locationId)
                            .eq("companyId", companyId)
                            .in("periodId", periods)
                            .order("periodId")
                    ])];
                case 1:
                    _c = _f.sent(), actuals = _c[0], forecasts = _c[1];
                    return [2 /*return*/, {
                            actuals: (_d = actuals.data) !== null && _d !== void 0 ? _d : [],
                            forecasts: (_e = forecasts.data) !== null && _e !== void 0 ? _e : []
                        }];
            }
        });
    });
}
function getItemUnitSalePrice(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemUnitSalePrice")
                    .select("*")
                    .eq("itemId", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getJobMaterialUsageForItem(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var _c, materials, jobs, byMaterialId, _i, _d, row, byJobId, _e, _f, row;
        var _g, _h, _j, _k;
        var itemId = _b.itemId, companyId = _b.companyId;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("jobMaterial")
                            .select("id, estimatedQuantity")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId),
                        client
                            .from("job")
                            .select("id, quantity")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                    ])];
                case 1:
                    _c = _l.sent(), materials = _c[0], jobs = _c[1];
                    byMaterialId = {};
                    for (_i = 0, _d = (_g = materials.data) !== null && _g !== void 0 ? _g : []; _i < _d.length; _i++) {
                        row = _d[_i];
                        if (row.id)
                            byMaterialId[row.id] = (_h = row.estimatedQuantity) !== null && _h !== void 0 ? _h : 0;
                    }
                    byJobId = {};
                    for (_e = 0, _f = (_j = jobs.data) !== null && _j !== void 0 ? _j : []; _e < _f.length; _e++) {
                        row = _f[_e];
                        if (row.id)
                            byJobId[row.id] = (_k = row.quantity) !== null && _k !== void 0 ? _k : 0;
                    }
                    return [2 /*return*/, { byMaterialId: byMaterialId, byJobId: byJobId }];
            }
        });
    });
}
function getMaterialUsedIn(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, issues, jobMaterials, maintenanceDispatchItems, methodMaterials, purchaseOrderLines, receiptLines, quoteMaterials, salesOrderLines, shipmentLines, supplierQuotes, jobMaterialUsage;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("nonConformanceItem")
                            .select("id, ...nonConformance(documentReadableId:nonConformanceId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("jobMaterial")
                            .select("id, methodType, ...job(documentReadableId:jobId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("maintenanceDispatchItem")
                            .select("id, ...maintenanceDispatch!maintenanceDispatchId(documentReadableId:maintenanceDispatchId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("methodMaterial")
                            .select("id, methodType, ...makeMethod!makeMethodId(documentId:id, version, ...item(documentReadableId:readableIdWithRevision, documentParentId:id, itemType:type))")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("purchaseOrderLine")
                            .select("id, ...purchaseOrder(documentReadableId:purchaseOrderId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("receiptLine")
                            .select("id, ...receipt(documentReadableId:receiptId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId),
                        client
                            .from("quoteMaterial")
                            .select("id, methodType, documentParentId:quoteId, documentId:quoteLineId, ...quoteLine(...item(documentReadableId:readableIdWithRevision))")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("salesOrderLine")
                            .select("id, methodType, ...salesOrder(documentReadableId:salesOrderId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("shipmentLine")
                            .select("id, ...shipment(documentReadableId:shipmentId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("supplierQuoteLine")
                            .select("id, ...supplierQuote(documentReadableId:supplierQuoteId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100),
                        getJobMaterialUsageForItem(client, { itemId: itemId, companyId: companyId })
                    ])];
                case 1:
                    _a = _m.sent(), issues = _a[0], jobMaterials = _a[1], maintenanceDispatchItems = _a[2], methodMaterials = _a[3], purchaseOrderLines = _a[4], receiptLines = _a[5], quoteMaterials = _a[6], salesOrderLines = _a[7], shipmentLines = _a[8], supplierQuotes = _a[9], jobMaterialUsage = _a[10];
                    return [2 /*return*/, {
                            issues: (_b = issues.data) !== null && _b !== void 0 ? _b : [],
                            jobMaterials: (_c = jobMaterials.data) !== null && _c !== void 0 ? _c : [],
                            maintenanceDispatchItems: (_d = maintenanceDispatchItems.data) !== null && _d !== void 0 ? _d : [],
                            methodMaterials: (_e = methodMaterials.data) !== null && _e !== void 0 ? _e : [],
                            purchaseOrderLines: (_f = purchaseOrderLines.data) !== null && _f !== void 0 ? _f : [],
                            receiptLines: (_g = receiptLines.data) !== null && _g !== void 0 ? _g : [],
                            quoteMaterials: (_h = quoteMaterials.data) !== null && _h !== void 0 ? _h : [],
                            salesOrderLines: (_j = salesOrderLines.data) !== null && _j !== void 0 ? _j : [],
                            shipmentLines: (_k = shipmentLines.data) !== null && _k !== void 0 ? _k : [],
                            supplierQuotes: (_l = supplierQuotes.data) !== null && _l !== void 0 ? _l : [],
                            jobMaterialUsage: jobMaterialUsage
                        }];
            }
        });
    });
}
function getMakeMethods(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("makeMethod")
                    .select("*")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)];
        });
    });
}
function getMakeMethodById(client, makeMethodId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("makeMethod")
                    .select("*")
                    .eq("id", makeMethodId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getMaterial(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .rpc("get_material_details", {
                    item_id: itemId
                })
                    .single()];
        });
    });
}
function getMaterials(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("materials")
                .select("*", {
                count: "exact"
            })
                .or("companyId.eq.".concat(companyId, ",companyId.is.null"));
            if (args.search) {
                query = query.or("readableIdWithRevision.ilike.%".concat(args.search, "%,name.ilike.%").concat(args.search, "%,description.ilike.%").concat(args.search, "%,supplierIds.ilike.%").concat(args.search, "%"));
            }
            if (args.supplierId) {
                query = query.contains("supplierIds", [args.supplierId]);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "readableIdWithRevision", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getMaterialsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "item", "id, name, readableIdWithRevision", function (query) {
                    return query
                        .eq("type", "Material")
                        .or("companyId.eq.".concat(companyId, ",companyId.is.null"))
                        .eq("active", true)
                        .order("name");
                })];
        });
    });
}
function getMaterialDimension(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialDimension").select("*").eq("id", id).single()];
        });
    });
}
function getMaterialDimensions(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        var _a;
        return __generator(this, function (_b) {
            query = client
                .from("materialDimensions")
                .select("*", {
                count: "exact"
            })
                .eq("isMetric", (_a = args === null || args === void 0 ? void 0 : args.isMetric) !== null && _a !== void 0 ? _a : false)
                .or("companyId.eq.".concat(companyId, ",companyId.is.null"));
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "formName", ascending: true },
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaterialDimensionList(client, materialFormId, isMetric, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("materialDimension")
                    .select("*")
                    .eq("materialFormId", materialFormId)
                    .eq("isMetric", isMetric)
                    .or("companyId.eq.".concat(companyId, ",companyId.is.null"))];
        });
    });
}
function getMaterialFinish(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialFinish").select("*").eq("id", id).single()];
        });
    });
}
function getMaterialFinishes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("materialFinishes")
                .select("*", {
                count: "exact"
            })
                .or("companyId.eq.".concat(companyId, ",companyId.is.null"));
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "substanceName", ascending: true },
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaterialFinishList(client, materialSubstanceId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("materialFinish")
                    .select("*")
                    .eq("materialSubstanceId", materialSubstanceId)
                    .or("companyId.eq.".concat(companyId, ",companyId.is.null"))];
        });
    });
}
function getMaterialForm(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialForm").select("*").eq("id", id).single()];
        });
    });
}
function getMaterialForms(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("materialForm")
                .select("*", {
                count: "exact"
            })
                .or("companyId.eq.".concat(companyId, ",companyId.is.null"));
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaterialFormsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("materialForm")
                    .select("id, name, code, companyId")
                    .or("companyId.eq.".concat(companyId, ",companyId.is.null"))
                    .order("name")];
        });
    });
}
function getMaterialGrades(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("materialGrades")
                .select("*", {
                count: "exact"
            })
                .or("companyId.eq.".concat(companyId, ",companyId.is.null"));
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "substanceName", ascending: true },
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaterialGrade(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialGrade").select("*").eq("id", id).single()];
        });
    });
}
function getMaterialGradeList(client, materialSubstanceId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("materialGrade")
                    .select("*")
                    .eq("materialSubstanceId", materialSubstanceId)
                    .or("companyId.eq.".concat(companyId, ",companyId.is.null"))];
        });
    });
}
function getMaterialSubstance(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialSubstance").select("*").eq("id", id).single()];
        });
    });
}
function getMaterialSubstances(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("materialSubstance")
                .select("*", {
                count: "exact"
            })
                .or("companyId.eq.".concat(companyId, ",companyId.is.null"));
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaterialSubstancesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("materialSubstance")
                    .select("id, name, code, companyId")
                    .or("companyId.eq.".concat(companyId, ",companyId.is.null"))
                    .order("name")];
        });
    });
}
function getMethodMaterial(client, materialId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("methodMaterial")
                    .select("*, item(name)")
                    .eq("id", materialId)
                    .single()];
        });
    });
}
function getMethodMaterials(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("methodMaterial")
                .select("*, item(name, readableIdWithRevision), makeMethod!makeMethodId(item(id, type, name, readableIdWithRevision))", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("item.readableIdWithRevision", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, []);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMethodMaterialsByMakeMethod(client, makeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("methodMaterial")
                    .select("*, item(name, itemTrackingType, replenishmentSystem, defaultMethodType, sourcingType)")
                    .eq("makeMethodId", makeMethodId)
                    .order("order", { ascending: true })];
        });
    });
}
function getMethodOperations(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("methodOperation")
                .select("*, makeMethod!makeMethodId(item(id, type, name, readableIdWithRevision))", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("description", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "order", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMethodOperationsByMakeMethodId(client, makeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("methodOperation")
                    .select("*, methodOperationTool(*), methodOperationParameter(*), methodOperationStep(*)")
                    .eq("makeMethodId", makeMethodId)
                    .order("order", { ascending: true })];
        });
    });
}
function getMethodTree(client, makeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        var items, tree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMethodTreeArray(client, makeMethodId)];
                case 1:
                    items = _a.sent();
                    if (items.error)
                        return [2 /*return*/, items];
                    tree = getMethodTreeArrayToTree(items.data);
                    return [2 /*return*/, {
                            data: tree,
                            error: null
                        }];
            }
        });
    });
}
function getMethodTreeArray(client, makeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_method_tree", {
                    uid: makeMethodId
                })];
        });
    });
}
function getMethodTreeArrayToTree(items) {
    function traverseAndRenameIds(node) {
        var clone = structuredClone(node);
        clone.id = (0, nanoid_1.nanoid)();
        clone.children = clone.children.map(function (n) { return traverseAndRenameIds(n); });
        return clone;
    }
    var rootItems = [];
    var lookup = {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var itemId = item.methodMaterialId;
        var parentId = item.parentMaterialId;
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            // @ts-ignore
            lookup[itemId] = { id: itemId, children: [] };
        }
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        lookup[itemId]["data"] = item;
        var treeItem = lookup[itemId];
        if (parentId === null || parentId === undefined) {
            rootItems.push(treeItem);
        }
        else {
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                // @ts-ignore
                lookup[parentId] = { id: parentId, children: [] };
            }
            // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
            lookup[parentId]["children"].push(treeItem);
        }
    }
    return rootItems.map(function (item) { return traverseAndRenameIds(item); });
}
function getOpenJobMaterials(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var itemId = _b.itemId, companyId = _b.companyId, locationId = _b.locationId;
        return __generator(this, function (_c) {
            return [2 /*return*/, client
                    .from("openJobMaterialLines")
                    .select("id, parentMaterialId, jobMakeMethodId, jobId, quantity:quantityToIssue, documentReadableId:jobReadableId, documentId:jobId, dueDate")
                    .eq("itemId", itemId)
                    .eq("locationId", locationId)
                    .eq("companyId", companyId)];
        });
    });
}
function getOpenProductionOrders(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var itemId = _b.itemId, companyId = _b.companyId, locationId = _b.locationId;
        return __generator(this, function (_c) {
            return [2 /*return*/, client
                    .from("openProductionOrders")
                    .select("id, quantity:quantityToReceive, documentReadableId:jobId, documentId:id, dueDate")
                    .eq("itemId", itemId)
                    .eq("locationId", locationId)
                    .eq("companyId", companyId)];
        });
    });
}
function getOpenPurchaseOrderLines(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var itemId = _b.itemId, companyId = _b.companyId, locationId = _b.locationId;
        return __generator(this, function (_c) {
            return [2 /*return*/, client
                    .from("openPurchaseOrderLines")
                    .select("id, quantity:quantityToReceive, dueDate:promisedDate, ...purchaseOrder(documentReadableId:purchaseOrderId, documentId:id)")
                    .eq("itemId", itemId)
                    .eq("locationId", locationId)
                    .eq("companyId", companyId)];
        });
    });
}
function getOpenSalesOrderLines(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var itemId = _b.itemId, companyId = _b.companyId, locationId = _b.locationId;
        return __generator(this, function (_c) {
            return [2 /*return*/, client
                    .from("openSalesOrderLines")
                    .select("id, quantity:quantityToSend, dueDate:promisedDate, ...salesOrder(documentReadableId:salesOrderId, documentId:id)")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)
                    .eq("locationId", locationId)];
        });
    });
}
function getPart(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .rpc("get_part_details", {
                    item_id: itemId
                })
                    .single()];
        });
    });
}
function getStyle(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            return [2 /*return*/, styleClient
                    .from("styles")
                    .select("*")
                    .eq("id", itemId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getParts(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("parts")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("readableIdWithRevision.ilike.%".concat(args.search, "%,name.ilike.%").concat(args.search, "%,description.ilike.%").concat(args.search, "%,supplierIds.ilike.%").concat(args.search, "%"));
            }
            if (args.supplierId) {
                query = query.contains("supplierIds", [args.supplierId]);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "readableIdWithRevision", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getStyles(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient, query;
        return __generator(this, function (_a) {
            styleClient = client;
            query = styleClient
                .from("styles")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("readableIdWithRevision.ilike.%".concat(args.search, "%,name.ilike.%").concat(args.search, "%,description.ilike.%").concat(args.search, "%,colorCode.ilike.%").concat(args.search, "%,colorName.ilike.%").concat(args.search, "%"));
            }
            return [2 /*return*/, (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "readableIdWithRevision", ascending: true }
                ])];
        });
    });
}
function getStyleColor(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            return [2 /*return*/, styleClient.from("styleColor").select("*").eq("id", id).single()];
        });
    });
}
function getStyleColors(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient, query;
        return __generator(this, function (_a) {
            styleClient = client;
            query = styleClient
                .from("styleColor")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("colorCode.ilike.%".concat(args.search, "%,colorName.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "colorCode", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getStyleColorList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            return [2 /*return*/, styleClient
                    .from("styleColor")
                    .select("id, colorCode, colorName, companyId")
                    .eq("companyId", companyId)
                    .order("colorCode")];
        });
    });
}
/**
 * Seeds the standard apparel colors + sizes for a freshly created company, with
 * names localized to the company's language. Idempotent — re-running skips rows
 * whose (code, companyId) already exists. Called from company onboarding.
 */
function seedStyleReference(client, companyId, userId, language) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient, _a, colors, sizes;
        return __generator(this, function (_b) {
            styleClient = client;
            _a = (0, style_reference_1.styleReferenceRows)(language), colors = _a.colors, sizes = _a.sizes;
            return [2 /*return*/, Promise.all([
                    styleClient.from("styleColor").upsert(colors.map(function (c) { return (__assign(__assign({}, c), { companyId: companyId, createdBy: userId })); }), { onConflict: "colorCode,companyId", ignoreDuplicates: true }),
                    styleClient.from("styleSize").upsert(sizes.map(function (s) { return (__assign(__assign({}, s), { companyId: companyId, createdBy: userId })); }), { onConflict: "sizeCode,companyId", ignoreDuplicates: true })
                ])];
        });
    });
}
function getStyleSize(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            return [2 /*return*/, styleClient.from("styleSize").select("*").eq("id", id).single()];
        });
    });
}
function getStyleSizes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient, query;
        return __generator(this, function (_a) {
            styleClient = client;
            query = styleClient
                .from("styleSize")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("sizeCode.ilike.%".concat(args.search, "%,sizeName.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "sizeCode", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getStyleSizeList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            return [2 /*return*/, styleClient
                    .from("styleSize")
                    .select("id, sizeCode, sizeName, companyId")
                    .eq("companyId", companyId)
                    .order("sizeCode")];
        });
    });
}
function getPartsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "item", "id, name, readableIdWithRevision", function (query) {
                    return query
                        .eq("type", "Part")
                        .eq("companyId", companyId)
                        .eq("active", true)
                        .order("name");
                })];
        });
    });
}
function getStylesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "item", "id, name, readableIdWithRevision", function (query) {
                    return query
                        .eq("type", "Style")
                        .eq("companyId", companyId)
                        .eq("active", true)
                        .order("name");
                })];
        });
    });
}
function getPartUsedIn(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, issues, jobMaterials, jobs, maintenanceDispatchItems, methodMaterials, purchaseOrderLines, receiptLines, quoteLines, quoteMaterials, salesOrderLines, shipmentLines, supplierQuotes, jobMaterialUsage;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("nonConformanceItem")
                            .select("id, ...nonConformance(documentReadableId:nonConformanceId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("jobMaterial")
                            .select("id, methodType, ...job(documentReadableId:jobId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("job")
                            .select("id, documentReadableId:jobId")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("maintenanceDispatchItem")
                            .select("id, ...maintenanceDispatch!maintenanceDispatchId(documentReadableId:maintenanceDispatchId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("methodMaterial")
                            .select("id, methodType, ...makeMethod!makeMethodId(documentId:id, version, ...item(documentReadableId:readableIdWithRevision, documentParentId:id, itemType:type))")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("purchaseOrderLine")
                            .select("id, ...purchaseOrder(documentReadableId:purchaseOrderId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("receiptLine")
                            .select("id, ...receipt(documentReadableId:receiptId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("quoteLine")
                            .select("id, methodType, ...quote(documentReadableId:quoteId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100),
                        client
                            .from("quoteMaterial")
                            .select("id, methodType, documentParentId:quoteId, documentId:quoteLineId, ...quoteLine(...item(documentReadableId:readableIdWithRevision))")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("salesOrderLine")
                            .select("id, methodType, ...salesOrder(documentReadableId:salesOrderId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("shipmentLine")
                            .select("id, ...shipment(documentReadableId:shipmentId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100)
                            .order("createdAt", { ascending: false }),
                        client
                            .from("supplierQuoteLine")
                            .select("id, ...supplierQuote(documentReadableId:supplierQuoteId, documentId:id)")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .limit(100),
                        getJobMaterialUsageForItem(client, { itemId: itemId, companyId: companyId })
                    ])];
                case 1:
                    _a = _p.sent(), issues = _a[0], jobMaterials = _a[1], jobs = _a[2], maintenanceDispatchItems = _a[3], methodMaterials = _a[4], purchaseOrderLines = _a[5], receiptLines = _a[6], quoteLines = _a[7], quoteMaterials = _a[8], salesOrderLines = _a[9], shipmentLines = _a[10], supplierQuotes = _a[11], jobMaterialUsage = _a[12];
                    return [2 /*return*/, {
                            issues: (_b = issues.data) !== null && _b !== void 0 ? _b : [],
                            jobMaterials: (_c = jobMaterials.data) !== null && _c !== void 0 ? _c : [],
                            jobs: (_d = jobs.data) !== null && _d !== void 0 ? _d : [],
                            maintenanceDispatchItems: (_e = maintenanceDispatchItems.data) !== null && _e !== void 0 ? _e : [],
                            methodMaterials: (_f = methodMaterials.data) !== null && _f !== void 0 ? _f : [],
                            purchaseOrderLines: (_g = purchaseOrderLines.data) !== null && _g !== void 0 ? _g : [],
                            receiptLines: (_h = receiptLines.data) !== null && _h !== void 0 ? _h : [],
                            quoteLines: (_j = quoteLines.data) !== null && _j !== void 0 ? _j : [],
                            quoteMaterials: (_k = quoteMaterials.data) !== null && _k !== void 0 ? _k : [],
                            salesOrderLines: (_l = salesOrderLines.data) !== null && _l !== void 0 ? _l : [],
                            shipmentLines: (_m = shipmentLines.data) !== null && _m !== void 0 ? _m : [],
                            supplierQuotes: (_o = supplierQuotes.data) !== null && _o !== void 0 ? _o : [],
                            jobMaterialUsage: jobMaterialUsage
                        }];
            }
        });
    });
}
function getPickMethod(client, itemId, companyId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickMethod")
                    .select("*")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)
                    .eq("locationId", locationId)
                    .maybeSingle()];
        });
    });
}
function getPickMethods(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickMethod")
                    .select("*")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)];
        });
    });
}
function getServices(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("service")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("readableIdWithRevision.ilike.%".concat(args.search, "%,name.ilike.%").concat(args.search, "%,description.ilike.%").concat(args.search, "%"));
            }
            if (args.type) {
                query = query.eq("serviceType", args.type);
            }
            if (args.group) {
                query = query.eq("itemPostingGroupId", args.group);
            }
            if (args.supplierId) {
                query = query.contains("supplierIds", [args.supplierId]);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "readableIdWithRevision", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getService(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("service")
                    .select("*")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getServicesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "item", "id, name", function (query) {
                    return query
                        .eq("type", "Service")
                        .eq("companyId", companyId)
                        .eq("active", true)
                        .order("name");
                })];
        });
    });
}
function getSupplierParts(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierPart")
                    .select("*")
                    .eq("active", true)
                    .eq("itemId", id)
                    .eq("companyId", companyId)];
        });
    });
}
function getTool(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .rpc("get_tool_details", {
                    item_id: itemId
                })
                    .single()];
        });
    });
}
function getTools(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("tools")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("readableIdWithRevision.ilike.%".concat(args.search, "%,name.ilike.%").concat(args.search, "%,description.ilike.%").concat(args.search, "%,supplierIds.ilike.%").concat(args.search, "%"));
            }
            if (args.supplierId) {
                query = query.contains("supplierIds", [args.supplierId]);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "readableIdWithRevision", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getToolsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "item", "id, name, readableIdWithRevision", function (query) {
                    return query
                        .eq("type", "Tool")
                        .eq("companyId", companyId)
                        .eq("active", true)
                        .order("name");
                })];
        });
    });
}
function getUnitOfMeasure(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("unitOfMeasure")
                    .select("*")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getUnitOfMeasures(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("unitOfMeasure")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,code.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getUnitOfMeasuresList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("unitOfMeasure")
                    .select("name, code")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function updateConfigurationParameterGroupOrder(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("configurationParameterGroup")
                    .update((0, supabase_1.sanitize)(data))
                    .eq("id", data.id)];
        });
    });
}
function updateDefaultRevision(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, item, makeMethod, _b, readableId, type, companyId, relatedItems, itemIds;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("item")
                            .select("id,readableId, readableIdWithRevision, type, companyId")
                            .eq("id", data.id)
                            .single(),
                        client
                            .from("activeMakeMethods")
                            .select("id, version")
                            .eq("itemId", data.id)
                            .maybeSingle()
                    ])];
                case 1:
                    _a = _f.sent(), item = _a[0], makeMethod = _a[1];
                    if (item.error)
                        return [2 /*return*/, item];
                    _b = item.data, readableId = _b.readableId, type = _b.type, companyId = _b.companyId;
                    if (!companyId)
                        return [2 /*return*/, item];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id")
                            .eq("readableId", readableId)
                            .eq("type", type)
                            .eq("companyId", companyId)];
                case 2:
                    relatedItems = _f.sent();
                    itemIds = (_d = (_c = relatedItems.data) === null || _c === void 0 ? void 0 : _c.map(function (item) { return item.id; })) !== null && _d !== void 0 ? _d : [];
                    return [2 /*return*/, client
                            .from("methodMaterial")
                            .update({
                            itemId: item.data.id,
                            materialMakeMethodId: (_e = makeMethod.data) === null || _e === void 0 ? void 0 : _e.id
                        })
                            .in("itemId", itemIds)];
            }
        });
    });
}
function updateConfigurationParameterOrder(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("configurationParameter")
                    .update((0, supabase_1.sanitize)(data))
                    .eq("id", data.id)];
        });
    });
}
function updateItemCost(client, itemId, cost) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemCost")
                    .update(__assign(__assign({}, cost), { costIsAdjusted: true, updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("itemId", itemId)
                    .single()];
        });
    });
}
function updateMaterialOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, order = _a.order, updatedBy = _a.updatedBy;
                return client.from("methodMaterial").update({ order: order, updatedBy: updatedBy }).eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateOperationOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var operationClient, updatedOperations, makeMethodIds, methodOperations, updatesById, operationsByMethod, _i, _a, operation, makeMethodId, nextOperation, operations, violatesStyleCuttingOrder, updatePromises;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (updates.length === 0)
                        return [2 /*return*/, []];
                    operationClient = client;
                    return [4 /*yield*/, operationClient
                            .from("methodOperation")
                            .select("id, makeMethodId, order, tags, customFields")
                            .in("id", updates.map(function (_a) {
                            var id = _a.id;
                            return id;
                        }))];
                case 1:
                    updatedOperations = _f.sent();
                    if (updatedOperations.error)
                        return [2 /*return*/, [updatedOperations]];
                    makeMethodIds = Array.from(new Set(((_b = updatedOperations.data) !== null && _b !== void 0 ? _b : [])
                        .map(function (operation) {
                        return operation.makeMethodId;
                    })
                        .filter(Boolean)));
                    if (!(makeMethodIds.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, operationClient
                            .from("methodOperation")
                            .select("id, makeMethodId, order, tags, customFields")
                            .in("makeMethodId", makeMethodIds)];
                case 2:
                    methodOperations = _f.sent();
                    if (methodOperations.error)
                        return [2 /*return*/, [methodOperations]];
                    updatesById = new Map(updates.map(function (update) { return [update.id, update.order]; }));
                    operationsByMethod = new Map();
                    for (_i = 0, _a = (_c = methodOperations.data) !== null && _c !== void 0 ? _c : []; _i < _a.length; _i++) {
                        operation = _a[_i];
                        makeMethodId = operation.makeMethodId;
                        if (!makeMethodId)
                            continue;
                        nextOperation = updatesById.has(operation.id)
                            ? __assign(__assign({}, operation), { order: (_d = updatesById.get(operation.id)) !== null && _d !== void 0 ? _d : operation.order }) : operation;
                        operations = (_e = operationsByMethod.get(makeMethodId)) !== null && _e !== void 0 ? _e : [];
                        operations.push(nextOperation);
                        operationsByMethod.set(makeMethodId, operations);
                    }
                    violatesStyleCuttingOrder = Array.from(operationsByMethod.values()).some(function (operations) { return !(0, styleMethod_service_1.isStyleCuttingOperationFirst)(operations); });
                    if (violatesStyleCuttingOrder) {
                        return [2 /*return*/, [
                                {
                                    data: null,
                                    error: {
                                        message: "System-owned Style cutting operations must remain the first process in the bill of process."
                                    },
                                    count: null,
                                    status: 400,
                                    statusText: "Bad Request"
                                }
                            ]];
                    }
                    _f.label = 3;
                case 3:
                    updatePromises = updates.map(function (_a) {
                        var id = _a.id, order = _a.order, updatedBy = _a.updatedBy;
                        return client.from("methodOperation").update({ order: order, updatedBy: updatedBy }).eq("id", id);
                    });
                    return [2 /*return*/, Promise.all(updatePromises)];
            }
        });
    });
}
function updateRevision(client, revision) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("item")
                    .update(__assign(__assign({}, revision), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", revision.id)];
        });
    });
}
/**
 * Keep a Style item's "Color" and "Size" list configuration parameters in sync
 * with the colors/sizes assigned to the style. This turns a Style into a normal
 * configured item so color/size flow through the existing config machinery
 * (job-creation config modal, production-quantity config table).
 */
function syncStyleConfigurationParameters(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, colors, sizes, colorCodes, sizeCodes, existing, paramByKey, hasAnyParam, _i, _b, _c, key, label, options;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        args.styleColorIds.length > 0
                            ? client
                                .from("styleColor")
                                .select("colorCode")
                                .in("id", args.styleColorIds)
                            : Promise.resolve({ data: [], error: null }),
                        args.styleSizeIds.length > 0
                            ? client.from("styleSize").select("sizeCode").in("id", args.styleSizeIds)
                            : Promise.resolve({ data: [], error: null })
                    ])];
                case 1:
                    _a = _g.sent(), colors = _a[0], sizes = _a[1];
                    colorCodes = ((_d = colors.data) !== null && _d !== void 0 ? _d : [])
                        .map(function (c) { return c.colorCode; })
                        .filter(Boolean);
                    sizeCodes = ((_e = sizes.data) !== null && _e !== void 0 ? _e : []).map(function (s) { return s.sizeCode; }).filter(Boolean);
                    return [4 /*yield*/, client
                            .from("configurationParameter")
                            .select("id, key")
                            .eq("itemId", args.itemId)
                            .eq("companyId", args.companyId)
                            .in("key", ["color", "size"])];
                case 2:
                    existing = _g.sent();
                    paramByKey = new Map(((_f = existing.data) !== null && _f !== void 0 ? _f : []).map(function (p) { return [p.key, p.id]; }));
                    hasAnyParam = false;
                    _i = 0, _b = [
                        ["color", "Color", colorCodes],
                        ["size", "Size", sizeCodes]
                    ];
                    _g.label = 3;
                case 3:
                    if (!(_i < _b.length)) return [3 /*break*/, 6];
                    _c = _b[_i], key = _c[0], label = _c[1], options = _c[2];
                    if (options.length === 0)
                        return [3 /*break*/, 5]; // list params require options
                    hasAnyParam = true;
                    return [4 /*yield*/, upsertConfigurationParameter(client, {
                            id: paramByKey.get(key),
                            itemId: args.itemId,
                            key: key,
                            label: label,
                            dataType: "list",
                            listOptions: options,
                            companyId: args.companyId,
                            userId: args.userId
                        })];
                case 4:
                    _g.sent();
                    _g.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: 
                // Size is the primary dimension for garments: its options must become the
                // config-table quantity columns (with Color as the row descriptor). "Primary"
                // is derived as the first list param by sortOrder, so pin Size below Color.
                return [4 /*yield*/, client
                        .from("configurationParameter")
                        .update({ sortOrder: 0 })
                        .eq("itemId", args.itemId)
                        .eq("companyId", args.companyId)
                        .eq("key", "size")];
                case 7:
                    // Size is the primary dimension for garments: its options must become the
                    // config-table quantity columns (with Color as the row descriptor). "Primary"
                    // is derived as the first list param by sortOrder, so pin Size below Color.
                    _g.sent();
                    return [4 /*yield*/, client
                            .from("configurationParameter")
                            .update({ sortOrder: 1 })
                            .eq("itemId", args.itemId)
                            .eq("companyId", args.companyId)
                            .eq("key", "color")];
                case 8:
                    _g.sent();
                    if (!hasAnyParam) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("itemReplenishment")
                            .update({ requiresConfiguration: true })
                            .eq("itemId", args.itemId)
                            .eq("companyId", args.companyId)];
                case 9:
                    _g.sent();
                    _g.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
function upsertConfigurationParameter(client, configurationParameter) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, data, ungroupedGroupId, existingGroups, ungroupedGroup, maxSortOrder, ungroupedGroupInsert;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    userId = configurationParameter.userId, data = __rest(configurationParameter, ["userId"]);
                    if (configurationParameter.id) {
                        return [2 /*return*/, client
                                .from("configurationParameter")
                                .update((0, supabase_1.sanitize)(__assign(__assign({}, data), { updatedBy: userId, updatedAt: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString() })))
                                .eq("id", configurationParameter.id)];
                    }
                    ungroupedGroupId = null;
                    return [4 /*yield*/, client
                            .from("configurationParameterGroup")
                            .select("id, isUngrouped, sortOrder")
                            .eq("itemId", data.itemId)];
                case 1:
                    existingGroups = _e.sent();
                    ungroupedGroup = (_a = existingGroups.data) === null || _a === void 0 ? void 0 : _a.find(function (group) { return group.isUngrouped; });
                    if (!ungroupedGroup) return [3 /*break*/, 2];
                    ungroupedGroupId = ungroupedGroup.id;
                    return [3 /*break*/, 4];
                case 2:
                    maxSortOrder = (_c = (_b = existingGroups.data) === null || _b === void 0 ? void 0 : _b.reduce(function (max, group) { var _a; return Math.max(max, (_a = group.sortOrder) !== null && _a !== void 0 ? _a : 1); }, 1)) !== null && _c !== void 0 ? _c : 0;
                    return [4 /*yield*/, client
                            .from("configurationParameterGroup")
                            .insert({
                            itemId: data.itemId,
                            name: "Ungrouped",
                            isUngrouped: true,
                            sortOrder: maxSortOrder + 1,
                            companyId: data.companyId
                        })
                            .select("id")
                            .single()];
                case 3:
                    ungroupedGroupInsert = _e.sent();
                    if (ungroupedGroupInsert.error)
                        return [2 /*return*/, ungroupedGroupInsert];
                    ungroupedGroupId = ungroupedGroupInsert.data.id;
                    _e.label = 4;
                case 4: return [2 /*return*/, client.from("configurationParameter").insert(__assign(__assign({}, data), { key: (_d = data.key) !== null && _d !== void 0 ? _d : "", createdBy: userId, configurationParameterGroupId: ungroupedGroupId }))];
            }
        });
    });
}
function upsertConfigurationParameterGroup(client, configurationParameterGroup) {
    return __awaiter(this, void 0, void 0, function () {
        var itemId, data, existingGroups, maxSortOrder;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    itemId = configurationParameterGroup.itemId, data = __rest(configurationParameterGroup, ["itemId"]);
                    if (configurationParameterGroup.id) {
                        return [2 /*return*/, client
                                .from("configurationParameterGroup")
                                .update({
                                name: data.name
                            })
                                .eq("id", configurationParameterGroup.id)];
                    }
                    return [4 /*yield*/, client
                            .from("configurationParameterGroup")
                            .select("id, isUngrouped, sortOrder")
                            .eq("itemId", itemId)];
                case 1:
                    existingGroups = _c.sent();
                    maxSortOrder = (_b = (_a = existingGroups.data) === null || _a === void 0 ? void 0 : _a.reduce(function (max, group) { var _a; return Math.max(max, (_a = group.sortOrder) !== null && _a !== void 0 ? _a : 1); }, 1)) !== null && _b !== void 0 ? _b : 0;
                    return [2 /*return*/, client.from("configurationParameterGroup").insert(__assign(__assign({}, data), { itemId: itemId, name: data.name, sortOrder: maxSortOrder + 1 }))];
            }
        });
    });
}
function upsertConfigurationRule(client, configurationRule) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("configurationRule").upsert(configurationRule, {
                    onConflict: "itemId,field"
                })];
        });
    });
}
/**
 * Persist (or clear) the per-item shelf-life policy. Shelf life lives on the
 * "itemShelfLife" table, keyed by itemId. Absence of a row = not managed.
 *
 * Three-way mode handling so this helper can be called from any upsert path
 * safely, including forms that don't surface the shelf-life fields:
 *   - mode undefined         -> no-op. The caller's form didn't opine on
 *                               shelf life; leave whatever row exists alone.
 *   - mode 'NotManaged'      -> explicit opt-out. DELETE any existing row.
 *   - mode 'Fixed Duration' or
 *     'Calculated'           -> UPSERT, clearing fields that don't apply to
 *                               the selected mode so stale values never leak
 *                               between modes.
 *
 * Callers on an item INSERT path should pass companyId so the helper can
 * seed a fresh row without a round-trip; on an UPDATE path where we know
 * the row already exists, companyId is optional.
 */
/**
 * Persist the user's "default storage unit" pick from the item form as a
 * row in the "pickMethod" table. Items are company-wide in Carbon;
 * per-location stocking facts live on pickMethod keyed by
 * (itemId, locationId). Writing the form pick here (rather than as
 * columns on "item") respects that boundary and lets a single item
 * accumulate multiple location defaults over time.
 *
 * The locationId for the pickMethod row is derived from the chosen
 * storageUnit (every storageUnit belongs to exactly one location), so
 * the caller only needs to pass the storageUnitId. This keeps the item
 * form to a single "Default Storage Unit" field - the location is
 * implicit.
 *
 * Semantics:
 *   - storageUnitId undefined -> no-op. Forms that don't surface this
 *     field (e.g. the manufacturing sub-form) can share an action
 *     without accidentally creating or clobbering a pickMethod row.
 *   - storageUnitId set -> UPSERT on (itemId, storageUnit.locationId).
 *     Existing defaultStorageUnit for that location is overwritten with
 *     the new pick.
 */
function upsertItemDefaultPickMethod(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var storageUnit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!args.storageUnitId) {
                        return [2 /*return*/, { data: null, error: null }];
                    }
                    return [4 /*yield*/, client
                            .from("storageUnit")
                            .select("locationId, companyId")
                            .eq("id", args.storageUnitId)
                            .single()];
                case 1:
                    storageUnit = _a.sent();
                    if (storageUnit.error || !storageUnit.data)
                        return [2 /*return*/, storageUnit];
                    return [2 /*return*/, client.from("pickMethod").upsert({
                            itemId: args.itemId,
                            locationId: storageUnit.data.locationId,
                            defaultStorageUnitId: args.storageUnitId,
                            companyId: storageUnit.data.companyId,
                            createdBy: args.userId,
                            updatedBy: args.userId,
                            updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString()
                        }, { onConflict: "itemId,locationId" })];
            }
        });
    });
}
/**
 * Return the distinct processIds referenced by methodOperation rows on the
 * item's active makeMethod. Used to scope the shelf-life trigger-process
 * picker to processes the recipe will actually run, so users can't pick a
 * process the trigger never matches against (the set-shelf-life helper short-circuits
 * on processId mismatch). Empty array when the item has no active recipe.
 */
function getRecipeProcessIdsForItem(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var makeMethod, operations, ids;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("activeMakeMethods")
                        .select("id")
                        .eq("itemId", itemId)
                        .maybeSingle()];
                case 1:
                    makeMethod = _d.sent();
                    if (makeMethod.error || !((_a = makeMethod.data) === null || _a === void 0 ? void 0 : _a.id)) {
                        return [2 /*return*/, { data: [], error: (_b = makeMethod.error) !== null && _b !== void 0 ? _b : null }];
                    }
                    return [4 /*yield*/, client
                            .from("methodOperation")
                            .select("processId")
                            .eq("makeMethodId", makeMethod.data.id)];
                case 2:
                    operations = _d.sent();
                    if (operations.error) {
                        return [2 /*return*/, { data: [], error: operations.error }];
                    }
                    ids = Array.from(new Set(((_c = operations.data) !== null && _c !== void 0 ? _c : [])
                        .map(function (o) { return o.processId; })
                        .filter(function (id) { return !!id; })));
                    return [2 /*return*/, { data: ids, error: null }];
            }
        });
    });
}
/**
 * Fetch the shelf-life policy for an item. Returns `data: null` (without
 * an error) when the item has no row, since absence = "not managed" and
 * that's a valid state we don't want to treat as an error path.
 */
function getItemShelfLife(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemShelfLife")
                    .select("mode, days, triggerProcessId, triggerTiming, calculateFromBom")
                    .eq("itemId", itemId)
                    .maybeSingle()];
        });
    });
}
/**
 * Returns true when the item's active make-method has at least one BOM
 * input with a managed shelf-life policy. Used to surface a warning when
 * the user picks a BOM-driven shelf-life mode (Calculated, or Fixed
 * Duration with calculateFromBom) but no input would actually contribute
 * an expiry date.
 *
 * Returns false when there is no make-method, no materials, or every
 * material has shelf-life NotManaged. Errors are coerced to false — this
 * is a UI hint, not a correctness gate.
 */
function getBomHasShelfLifeManagedInput(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var makeMethods, active, materials, inputItemIds, managed;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, getMakeMethods(client, itemId, companyId)];
                case 1:
                    makeMethods = _f.sent();
                    if (makeMethods.error || !((_a = makeMethods.data) === null || _a === void 0 ? void 0 : _a.length))
                        return [2 /*return*/, false];
                    active = (_b = makeMethods.data.find(function (m) { return m.status === "Active"; })) !== null && _b !== void 0 ? _b : makeMethods.data[0];
                    return [4 /*yield*/, getMethodMaterialsByMakeMethod(client, active.id)];
                case 2:
                    materials = _f.sent();
                    inputItemIds = ((_c = materials.data) !== null && _c !== void 0 ? _c : [])
                        .map(function (m) { return m.itemId; })
                        .filter(function (id) { return !!id; });
                    if (inputItemIds.length === 0)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, client
                            .from("itemShelfLife")
                            .select("itemId")
                            .in("itemId", inputItemIds)
                            .limit(1)];
                case 3:
                    managed = _f.sent();
                    return [2 /*return*/, !managed.error && ((_e = (_d = managed.data) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) > 0];
            }
        });
    });
}
function upsertItemShelfLife(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var days, triggerProcessId, triggerTiming, calculateFromBom, recipe, existing, companyId, itemRow;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (args.mode === undefined) {
                        return [2 /*return*/, { data: null, error: null }];
                    }
                    if (args.mode === "NotManaged") {
                        return [2 /*return*/, client.from("itemShelfLife").delete().eq("itemId", args.itemId)];
                    }
                    days = args.mode === "Fixed Duration" ? ((_a = args.days) !== null && _a !== void 0 ? _a : null) : null;
                    triggerProcessId = args.mode === "Fixed Duration" ? ((_b = args.triggerProcessId) !== null && _b !== void 0 ? _b : null) : null;
                    triggerTiming = triggerProcessId
                        ? ((_c = args.triggerTiming) !== null && _c !== void 0 ? _c : "After")
                        : "After";
                    calculateFromBom = args.mode === "Fixed Duration" ? ((_d = args.calculateFromBom) !== null && _d !== void 0 ? _d : false) : false;
                    if (!triggerProcessId) return [3 /*break*/, 2];
                    return [4 /*yield*/, getRecipeProcessIdsForItem(client, args.itemId)];
                case 1:
                    recipe = _f.sent();
                    if (recipe.error) {
                        return [2 /*return*/, { data: null, error: recipe.error }];
                    }
                    if (!recipe.data.includes(triggerProcessId)) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Shelf-life trigger process must be one of the operations on this item's recipe",
                                    details: "",
                                    hint: "",
                                    code: "shelf_life_trigger_process_not_in_recipe"
                                }
                            }];
                    }
                    _f.label = 2;
                case 2: return [4 /*yield*/, client
                        .from("itemShelfLife")
                        .select("itemId")
                        .eq("itemId", args.itemId)
                        .maybeSingle()];
                case 3:
                    existing = _f.sent();
                    if (existing.error)
                        return [2 /*return*/, existing];
                    if (existing.data) {
                        return [2 /*return*/, client
                                .from("itemShelfLife")
                                .update({
                                mode: args.mode,
                                days: days,
                                triggerProcessId: triggerProcessId,
                                triggerTiming: triggerTiming,
                                calculateFromBom: calculateFromBom,
                                updatedBy: args.userId,
                                updatedAt: new Date().toISOString()
                            })
                                .eq("itemId", args.itemId)];
                    }
                    companyId = args.companyId;
                    if (!!companyId) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("companyId")
                            .eq("id", args.itemId)
                            .single()];
                case 4:
                    itemRow = _f.sent();
                    if (itemRow.error || !itemRow.data)
                        return [2 /*return*/, itemRow];
                    companyId = (_e = itemRow.data.companyId) !== null && _e !== void 0 ? _e : undefined;
                    _f.label = 5;
                case 5: return [2 /*return*/, client.from("itemShelfLife").insert({
                        itemId: args.itemId,
                        mode: args.mode,
                        days: days,
                        triggerProcessId: triggerProcessId,
                        triggerTiming: triggerTiming,
                        calculateFromBom: calculateFromBom,
                        companyId: companyId,
                        createdBy: args.userId
                    })];
            }
        });
    });
}
/**
 * Atomic counterpart to {@link upsertPickMethod} + {@link upsertItemShelfLife}.
 *
 * The inventory form card submits pickMethod fields and shelf-life fields in
 * the same POST (see pickMethodWithShelfLifeValidator). Writing them through
 * two independent Supabase calls means a failure between the two leaves a
 * partial update committed. This helper runs both writes inside a single
 * Postgres transaction via Kysely.
 */
function upsertPickMethodWithShelfLife(db, args) {
    return __awaiter(this, void 0, void 0, function () {
        var updatedAt;
        var _this = this;
        return __generator(this, function (_a) {
            updatedAt = (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString();
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, mode, days, triggerProcessId, triggerTiming, calculateFromBom, normalizedDays, normalizedTriggerProcess, normalizedTriggerTiming, normalizedCalcFromBom, recipeProcessIds, allowed, existing, itemRow;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, trx
                                    .updateTable("pickMethod")
                                    .set(__assign(__assign({ defaultStorageUnitId: (_b = args.defaultStorageUnitId) !== null && _b !== void 0 ? _b : null }, (args.sortMethod ? { sortMethod: args.sortMethod } : {})), { customFields: (_c = args.customFields) !== null && _c !== void 0 ? _c : null, updatedBy: args.userId, updatedAt: updatedAt }))
                                    .where("itemId", "=", args.itemId)
                                    .where("locationId", "=", args.locationId)
                                    .execute()];
                            case 1:
                                _d.sent();
                                _a = args.shelfLife, mode = _a.mode, days = _a.days, triggerProcessId = _a.triggerProcessId, triggerTiming = _a.triggerTiming, calculateFromBom = _a.calculateFromBom;
                                // mode undefined = caller didn't surface the field; leave any existing
                                // row alone (matches upsertItemShelfLife semantics).
                                if (mode === undefined)
                                    return [2 /*return*/];
                                if (!(mode === "NotManaged")) return [3 /*break*/, 3];
                                return [4 /*yield*/, trx
                                        .deleteFrom("itemShelfLife")
                                        .where("itemId", "=", args.itemId)
                                        .execute()];
                            case 2:
                                _d.sent();
                                return [2 /*return*/];
                            case 3:
                                normalizedDays = mode === "Fixed Duration" ? (days !== null && days !== void 0 ? days : null) : null;
                                normalizedTriggerProcess = mode === "Fixed Duration" ? (triggerProcessId !== null && triggerProcessId !== void 0 ? triggerProcessId : null) : null;
                                normalizedTriggerTiming = normalizedTriggerProcess
                                    ? (triggerTiming !== null && triggerTiming !== void 0 ? triggerTiming : "After")
                                    : "After";
                                normalizedCalcFromBom = mode === "Fixed Duration" ? (calculateFromBom !== null && calculateFromBom !== void 0 ? calculateFromBom : false) : false;
                                if (!normalizedTriggerProcess) return [3 /*break*/, 5];
                                return [4 /*yield*/, trx
                                        .selectFrom("methodOperation as mo")
                                        .innerJoin("activeMakeMethods as amm", "amm.id", "mo.makeMethodId")
                                        .select("mo.processId")
                                        .where("amm.itemId", "=", args.itemId)
                                        .where("mo.processId", "is not", null)
                                        .execute()];
                            case 4:
                                recipeProcessIds = _d.sent();
                                allowed = new Set(recipeProcessIds
                                    .map(function (r) { return r.processId; })
                                    .filter(function (id) { return !!id; }));
                                if (!allowed.has(normalizedTriggerProcess)) {
                                    throw new Error("Shelf-life trigger process must be one of the operations on this item's recipe");
                                }
                                _d.label = 5;
                            case 5: return [4 /*yield*/, trx
                                    .selectFrom("itemShelfLife")
                                    .select("itemId")
                                    .where("itemId", "=", args.itemId)
                                    .executeTakeFirst()];
                            case 6:
                                existing = _d.sent();
                                if (!existing) return [3 /*break*/, 8];
                                return [4 /*yield*/, trx
                                        .updateTable("itemShelfLife")
                                        .set({
                                        mode: mode,
                                        days: normalizedDays,
                                        triggerProcessId: normalizedTriggerProcess,
                                        triggerTiming: normalizedTriggerTiming,
                                        calculateFromBom: normalizedCalcFromBom,
                                        updatedBy: args.userId,
                                        updatedAt: updatedAt
                                    })
                                        .where("itemId", "=", args.itemId)
                                        .execute()];
                            case 7:
                                _d.sent();
                                return [2 /*return*/];
                            case 8: return [4 /*yield*/, trx
                                    .selectFrom("item")
                                    .select("companyId")
                                    .where("id", "=", args.itemId)
                                    .executeTakeFirstOrThrow()];
                            case 9:
                                itemRow = _d.sent();
                                if (!itemRow.companyId) {
                                    throw new Error("Item ".concat(args.itemId, " has no companyId"));
                                }
                                return [4 /*yield*/, trx
                                        .insertInto("itemShelfLife")
                                        .values({
                                        itemId: args.itemId,
                                        mode: mode,
                                        days: normalizedDays,
                                        triggerProcessId: normalizedTriggerProcess,
                                        triggerTiming: normalizedTriggerTiming,
                                        calculateFromBom: normalizedCalcFromBom,
                                        companyId: itemRow.companyId,
                                        createdBy: args.userId
                                    })
                                        .execute()];
                            case 10:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
/**
 * Cascades a change to item.itemTrackingType onto the snapshot columns
 * `requiresSerialTracking` and `requiresBatchTracking` on child rows that
 * belong to OPEN parents (jobs, receipts, shipments, stock transfers).
 *
 * Without this, snapshot flags drift from the live item value and leave the
 * UI reading stale (often sticky-true) tracking flags after an item is
 * flipped back to Inventory / Non-Inventory.
 */
function cascadeItemTrackingType(db, args) {
    return __awaiter(this, void 0, void 0, function () {
        var requiresSerialTracking, requiresBatchTracking, updatedAt;
        var _this = this;
        return __generator(this, function (_a) {
            if (args.itemIds.length === 0)
                return [2 /*return*/];
            requiresSerialTracking = args.newType === items_models_1.ItemTrackingType.Serial;
            requiresBatchTracking = args.newType === items_models_1.ItemTrackingType.Batch;
            updatedAt = (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString();
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, trx
                                    .updateTable("jobMakeMethod")
                                    .set({
                                    requiresSerialTracking: requiresSerialTracking,
                                    requiresBatchTracking: requiresBatchTracking,
                                    updatedBy: args.userId,
                                    updatedAt: updatedAt
                                })
                                    .where("itemId", "in", args.itemIds)
                                    .where("companyId", "=", args.companyId)
                                    .where(function (eb) {
                                    return eb("jobId", "in", eb
                                        .selectFrom("job")
                                        .select("id")
                                        .where("companyId", "=", args.companyId)
                                        .where("status", "in", ["Draft", "Planned"]));
                                })
                                    .execute()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, trx
                                        .updateTable("jobMaterial")
                                        .set({
                                        requiresSerialTracking: requiresSerialTracking,
                                        requiresBatchTracking: requiresBatchTracking,
                                        updatedBy: args.userId,
                                        updatedAt: updatedAt
                                    })
                                        .where("itemId", "in", args.itemIds)
                                        .where("companyId", "=", args.companyId)
                                        .where(function (eb) {
                                        return eb("jobId", "in", eb
                                            .selectFrom("job")
                                            .select("id")
                                            .where("companyId", "=", args.companyId)
                                            .where("status", "in", ["Draft", "Planned"]));
                                    })
                                        .execute()];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, trx
                                        .updateTable("receiptLine")
                                        .set({
                                        requiresSerialTracking: requiresSerialTracking,
                                        requiresBatchTracking: requiresBatchTracking,
                                        updatedBy: args.userId,
                                        updatedAt: updatedAt
                                    })
                                        .where("itemId", "in", args.itemIds)
                                        .where("companyId", "=", args.companyId)
                                        .where(function (eb) {
                                        return eb("receiptId", "in", eb
                                            .selectFrom("receipt")
                                            .select("id")
                                            .where("companyId", "=", args.companyId)
                                            .where("status", "=", "Draft"));
                                    })
                                        .execute()];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, trx
                                        .updateTable("shipmentLine")
                                        .set({
                                        requiresSerialTracking: requiresSerialTracking,
                                        requiresBatchTracking: requiresBatchTracking,
                                        updatedBy: args.userId,
                                        updatedAt: updatedAt
                                    })
                                        .where("itemId", "in", args.itemIds)
                                        .where("companyId", "=", args.companyId)
                                        .where(function (eb) {
                                        return eb("shipmentId", "in", eb
                                            .selectFrom("shipment")
                                            .select("id")
                                            .where("companyId", "=", args.companyId)
                                            .where("status", "=", "Draft"));
                                    })
                                        .execute()];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, trx
                                        .updateTable("stockTransferLine")
                                        .set({
                                        requiresSerialTracking: requiresSerialTracking,
                                        requiresBatchTracking: requiresBatchTracking,
                                        updatedBy: args.userId,
                                        updatedAt: updatedAt
                                    })
                                        .where("itemId", "in", args.itemIds)
                                        .where("companyId", "=", args.companyId)
                                        .where(function (eb) {
                                        return eb("stockTransferId", "in", eb
                                            .selectFrom("stockTransfer")
                                            .select("id")
                                            .where("companyId", "=", args.companyId)
                                            .where("status", "=", "Draft"));
                                    })
                                        .execute()];
                            case 5:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
/**
 * Updates item-level method/sourcing columns and mirrors the change down to
 * every methodMaterial that references the item — in a single transaction, so
 * the item and its mirrors can never be left half-applied.
 *
 * sourcingType and defaultMethodType are item-level properties; method
 * materials are read-only mirrors. Only mirrors on Draft make methods are
 * touched — Active and Archived methods are frozen.
 */
function updateItemMethodAndSourcing(db, args) {
    return __awaiter(this, void 0, void 0, function () {
        var updatedAt;
        var _this = this;
        return __generator(this, function (_a) {
            if (args.itemIds.length === 0)
                return [2 /*return*/];
            updatedAt = (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString();
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, trx
                                    .updateTable("item")
                                    .set(__assign(__assign({}, args.itemUpdate), { updatedBy: args.userId, updatedAt: updatedAt }))
                                    .where("id", "in", args.itemIds)
                                    .where("companyId", "=", args.companyId)
                                    .execute()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, cascadeSourcingAndMethodTypeToMethodMaterials(trx, {
                                        itemIds: args.itemIds,
                                        companyId: args.companyId,
                                        userId: args.userId,
                                        newSourcingType: args.cascade.sourcingType,
                                        newMethodType: args.cascade.methodType
                                    })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
/**
 * Mirrors an item's sourcingType/methodType onto every methodMaterial that
 * references it. Operates on a caller-supplied transaction so it composes with
 * the item update above. Only method materials on Draft make methods are
 * touched.
 */
function cascadeSourcingAndMethodTypeToMethodMaterials(trx, args) {
    return __awaiter(this, void 0, void 0, function () {
        var updatedAt, onDraftMakeMethod, baseSet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (args.itemIds.length === 0)
                        return [2 /*return*/];
                    if (!args.newSourcingType && !args.newMethodType)
                        return [2 /*return*/];
                    updatedAt = (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString();
                    onDraftMakeMethod = function (eb) {
                        return eb("makeMethodId", "in", eb
                            .selectFrom("makeMethod")
                            .select("id")
                            .where("companyId", "=", args.companyId)
                            .where("status", "=", "Draft"));
                    };
                    baseSet = {
                        updatedBy: args.userId,
                        updatedAt: updatedAt
                    };
                    if (args.newSourcingType)
                        baseSet.sourcingType = args.newSourcingType;
                    return [4 /*yield*/, trx
                            .updateTable("methodMaterial")
                            .set(function (eb) { return (__assign(__assign({}, baseSet), (args.newMethodType === "Make to Order"
                            ? {
                                methodType: "Make to Order",
                                // materialMakeMethodId points at the component item's active make
                                // method (mirrors upsertMethodMaterial). Resolved with a correlated
                                // subquery so a single statement covers every item; null when the
                                // component has no active make method.
                                materialMakeMethodId: eb
                                    .selectFrom("activeMakeMethods")
                                    .select("id")
                                    .whereRef("activeMakeMethods.itemId", "=", "methodMaterial.itemId")
                                    .where("activeMakeMethods.companyId", "=", args.companyId)
                                    .limit(1)
                            }
                            : args.newMethodType
                                ? { methodType: args.newMethodType, materialMakeMethodId: null }
                                : {}))); })
                            .where("itemId", "in", args.itemIds)
                            .where("companyId", "=", args.companyId)
                            .where(onDraftMakeMethod)
                            .execute()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function upsertConsumable(client, consumable) {
    return __awaiter(this, void 0, void 0, function () {
        var itemInsert, itemId, _a, consumableInsert, itemCostUpdate, pickMethod_1, shelfLife_1, newConsumable, itemUpdate, consumableUpdate, _b, updateItem, updateConsumable, pickMethod, shelfLife;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!("createdBy" in consumable)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("item")
                            .insert({
                            readableId: consumable.id,
                            name: consumable.name,
                            description: consumable.description,
                            type: "Consumable",
                            replenishmentSystem: consumable.replenishmentSystem,
                            defaultMethodType: consumable.defaultMethodType,
                            itemTrackingType: consumable.itemTrackingType,
                            unitOfMeasureCode: consumable.unitOfMeasureCode,
                            active: true,
                            thumbnailPath: consumable.thumbnailPath,
                            companyId: consumable.companyId,
                            createdBy: consumable.createdBy
                        })
                            .select("id")
                            .single()];
                case 1:
                    itemInsert = _d.sent();
                    if (itemInsert.error)
                        return [2 /*return*/, itemInsert];
                    itemId = (_c = itemInsert.data) === null || _c === void 0 ? void 0 : _c.id;
                    return [4 /*yield*/, Promise.all([
                            client.from("consumable").upsert({
                                id: consumable.id,
                                companyId: consumable.companyId,
                                createdBy: consumable.createdBy,
                                customFields: consumable.customFields
                            }),
                            client
                                .from("itemCost")
                                .update((0, supabase_1.sanitize)({
                                itemPostingGroupId: consumable.postingGroupId,
                                unitCost: consumable.unitCost
                            }))
                                .eq("itemId", itemId)
                        ])];
                case 2:
                    _a = _d.sent(), consumableInsert = _a[0], itemCostUpdate = _a[1];
                    if (consumableInsert.error)
                        return [2 /*return*/, consumableInsert];
                    if (itemCostUpdate.error)
                        return [2 /*return*/, itemCostUpdate];
                    if (!itemId) return [3 /*break*/, 5];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: itemId,
                            userId: consumable.createdBy,
                            storageUnitId: consumable.defaultStorageUnitId
                        })];
                case 3:
                    pickMethod_1 = _d.sent();
                    if (pickMethod_1.error)
                        return [2 /*return*/, pickMethod_1];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: itemId,
                            userId: consumable.createdBy,
                            companyId: consumable.companyId,
                            mode: consumable.shelfLifeMode,
                            days: consumable.shelfLifeDays,
                            triggerProcessId: consumable.shelfLifeTriggerProcessId,
                            triggerTiming: consumable.shelfLifeTriggerTiming,
                            calculateFromBom: consumable.shelfLifeCalculateFromBom
                        })];
                case 4:
                    shelfLife_1 = _d.sent();
                    if (shelfLife_1.error)
                        return [2 /*return*/, shelfLife_1];
                    _d.label = 5;
                case 5: return [4 /*yield*/, client
                        .from("consumables")
                        .select("id")
                        .eq("readableId", consumable.id)
                        .eq("companyId", consumable.companyId)
                        .single()];
                case 6:
                    newConsumable = _d.sent();
                    return [2 /*return*/, newConsumable];
                case 7:
                    itemUpdate = {
                        id: consumable.id,
                        name: consumable.name,
                        description: consumable.description,
                        replenishmentSystem: consumable.replenishmentSystem,
                        defaultMethodType: consumable.defaultMethodType,
                        itemTrackingType: consumable.itemTrackingType,
                        unitOfMeasureCode: consumable.unitOfMeasureCode,
                        active: true
                    };
                    consumableUpdate = {
                        customFields: consumable.customFields
                    };
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(itemUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", consumable.id),
                            client
                                .from("consumable")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(consumableUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", consumable.id)
                        ])];
                case 8:
                    _b = _d.sent(), updateItem = _b[0], updateConsumable = _b[1];
                    if (updateItem.error)
                        return [2 /*return*/, updateItem];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: consumable.id,
                            userId: consumable.updatedBy,
                            storageUnitId: consumable.defaultStorageUnitId
                        })];
                case 9:
                    pickMethod = _d.sent();
                    if (pickMethod.error)
                        return [2 /*return*/, pickMethod];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: consumable.id,
                            userId: consumable.updatedBy,
                            mode: consumable.shelfLifeMode,
                            days: consumable.shelfLifeDays,
                            triggerProcessId: consumable.shelfLifeTriggerProcessId,
                            triggerTiming: consumable.shelfLifeTriggerTiming,
                            calculateFromBom: consumable.shelfLifeCalculateFromBom
                        })];
                case 10:
                    shelfLife = _d.sent();
                    if (shelfLife.error)
                        return [2 /*return*/, shelfLife];
                    return [2 /*return*/, updateConsumable];
            }
        });
    });
}
function upsertPart(client, part) {
    return __awaiter(this, void 0, void 0, function () {
        var itemInsert, itemId, _a, partInsert, itemCostUpdate, itemReplenishmentInsert, pickMethod_2, shelfLife_2, newPart, itemUpdate, partUpdate, _b, updateItem, updatePart, pickMethod, shelfLife;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!("createdBy" in part)) return [3 /*break*/, 9];
                    return [4 /*yield*/, client
                            .from("item")
                            .insert({
                            readableId: part.id,
                            revision: (_c = part.revision) !== null && _c !== void 0 ? _c : "0",
                            name: part.name,
                            description: part.description,
                            type: "Part",
                            replenishmentSystem: part.replenishmentSystem,
                            defaultMethodType: part.defaultMethodType,
                            itemTrackingType: part.itemTrackingType,
                            unitOfMeasureCode: part.unitOfMeasureCode,
                            active: true,
                            modelUploadId: part.modelUploadId,
                            thumbnailPath: part.thumbnailPath,
                            companyId: part.companyId,
                            createdBy: part.createdBy
                        })
                            .select("id")
                            .single()];
                case 1:
                    itemInsert = _e.sent();
                    if (itemInsert.error)
                        return [2 /*return*/, itemInsert];
                    itemId = (_d = itemInsert.data) === null || _d === void 0 ? void 0 : _d.id;
                    return [4 /*yield*/, Promise.all([
                            client.from("part").upsert({
                                id: part.id,
                                companyId: part.companyId,
                                createdBy: part.createdBy,
                                customFields: part.customFields
                            }),
                            client
                                .from("itemCost")
                                .update((0, supabase_1.sanitize)({
                                itemPostingGroupId: part.postingGroupId,
                                unitCost: part.replenishmentSystem !== "Make" ? part.unitCost : undefined
                            }))
                                .eq("itemId", itemId)
                        ])];
                case 2:
                    _a = _e.sent(), partInsert = _a[0], itemCostUpdate = _a[1];
                    if (partInsert.error)
                        return [2 /*return*/, partInsert];
                    if (itemCostUpdate.error) {
                        console.error(itemCostUpdate.error);
                    }
                    if (!(part.replenishmentSystem !== "Buy")) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("itemReplenishment")
                            .update({ lotSize: part.lotSize })
                            .eq("itemId", itemId)];
                case 3:
                    itemReplenishmentInsert = _e.sent();
                    if (itemReplenishmentInsert.error)
                        return [2 /*return*/, itemReplenishmentInsert];
                    _e.label = 4;
                case 4:
                    if (!itemId) return [3 /*break*/, 7];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: itemId,
                            userId: part.createdBy,
                            storageUnitId: part.defaultStorageUnitId
                        })];
                case 5:
                    pickMethod_2 = _e.sent();
                    if (pickMethod_2.error)
                        return [2 /*return*/, pickMethod_2];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: itemId,
                            userId: part.createdBy,
                            companyId: part.companyId,
                            mode: part.shelfLifeMode,
                            days: part.shelfLifeDays,
                            triggerProcessId: part.shelfLifeTriggerProcessId,
                            triggerTiming: part.shelfLifeTriggerTiming,
                            calculateFromBom: part.shelfLifeCalculateFromBom
                        })];
                case 6:
                    shelfLife_2 = _e.sent();
                    if (shelfLife_2.error)
                        return [2 /*return*/, shelfLife_2];
                    _e.label = 7;
                case 7: return [4 /*yield*/, client
                        .from("parts")
                        .select("id")
                        .eq("readableId", part.id)
                        .eq("companyId", part.companyId)
                        .single()];
                case 8:
                    newPart = _e.sent();
                    return [2 /*return*/, newPart];
                case 9:
                    itemUpdate = {
                        id: part.id,
                        name: part.name,
                        description: part.description,
                        replenishmentSystem: part.replenishmentSystem,
                        defaultMethodType: part.defaultMethodType,
                        itemTrackingType: part.itemTrackingType,
                        unitOfMeasureCode: part.unitOfMeasureCode,
                        active: true
                    };
                    partUpdate = {
                        customFields: part.customFields
                    };
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(itemUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", part.id),
                            client
                                .from("part")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(partUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", part.id)
                        ])];
                case 10:
                    _b = _e.sent(), updateItem = _b[0], updatePart = _b[1];
                    if (updateItem.error)
                        return [2 /*return*/, updateItem];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: part.id,
                            userId: part.updatedBy,
                            storageUnitId: part.defaultStorageUnitId
                        })];
                case 11:
                    pickMethod = _e.sent();
                    if (pickMethod.error)
                        return [2 /*return*/, pickMethod];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: part.id,
                            userId: part.updatedBy,
                            mode: part.shelfLifeMode,
                            days: part.shelfLifeDays,
                            triggerProcessId: part.shelfLifeTriggerProcessId,
                            triggerTiming: part.shelfLifeTriggerTiming,
                            calculateFromBom: part.shelfLifeCalculateFromBom
                        })];
                case 12:
                    shelfLife = _e.sent();
                    if (shelfLife.error)
                        return [2 /*return*/, shelfLife];
                    return [2 /*return*/, updatePart];
            }
        });
    });
}
function upsertStyle(client, style) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient, itemInsert, itemId, _a, styleInsert, itemCostUpdate_1, itemReplenishmentInsert, pickMethod_3, shelfLife_3, styleMethod_1, newStyle, itemUpdate, styleUpdate, _b, updateItem, updateStyle, _c, pickMethod, shelfLife, styleCompany, styleMethod, itemReplenishmentUpdate, itemCostUpdate;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    styleClient = client;
                    if (!("createdBy" in style)) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("item")
                            .insert({
                            readableId: style.id,
                            revision: (_d = style.revision) !== null && _d !== void 0 ? _d : "0",
                            name: style.name,
                            description: style.description,
                            type: "Style",
                            replenishmentSystem: style.replenishmentSystem,
                            defaultMethodType: style.defaultMethodType,
                            itemTrackingType: style.itemTrackingType,
                            unitOfMeasureCode: style.unitOfMeasureCode,
                            active: true,
                            modelUploadId: style.modelUploadId,
                            thumbnailPath: style.thumbnailPath,
                            companyId: style.companyId,
                            createdBy: style.createdBy
                        })
                            .select("id")
                            .single()];
                case 1:
                    itemInsert = _f.sent();
                    if (itemInsert.error)
                        return [2 /*return*/, itemInsert];
                    itemId = (_e = itemInsert.data) === null || _e === void 0 ? void 0 : _e.id;
                    return [4 /*yield*/, Promise.all([
                            styleClient.from("style").upsert({
                                id: style.id,
                                itemId: itemId,
                                companyId: style.companyId,
                                createdBy: style.createdBy,
                                customFields: style.customFields
                            }),
                            client
                                .from("itemCost")
                                .update((0, supabase_1.sanitize)({
                                itemPostingGroupId: style.postingGroupId,
                                unitCost: style.replenishmentSystem !== "Make" ? style.unitCost : undefined
                            }))
                                .eq("itemId", itemId)
                        ])];
                case 2:
                    _a = _f.sent(), styleInsert = _a[0], itemCostUpdate_1 = _a[1];
                    if (styleInsert.error)
                        return [2 /*return*/, styleInsert];
                    if (itemCostUpdate_1.error) {
                        console.error(itemCostUpdate_1.error);
                    }
                    if (!(style.replenishmentSystem !== "Buy")) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("itemReplenishment")
                            .update({ lotSize: style.lotSize })
                            .eq("itemId", itemId)];
                case 3:
                    itemReplenishmentInsert = _f.sent();
                    if (itemReplenishmentInsert.error)
                        return [2 /*return*/, itemReplenishmentInsert];
                    _f.label = 4;
                case 4:
                    if (!itemId) return [3 /*break*/, 8];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: itemId,
                            userId: style.createdBy,
                            storageUnitId: style.defaultStorageUnitId
                        })];
                case 5:
                    pickMethod_3 = _f.sent();
                    if (pickMethod_3.error)
                        return [2 /*return*/, pickMethod_3];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: itemId,
                            userId: style.createdBy,
                            companyId: style.companyId,
                            mode: style.shelfLifeMode,
                            days: style.shelfLifeDays,
                            triggerProcessId: style.shelfLifeTriggerProcessId,
                            triggerTiming: style.shelfLifeTriggerTiming,
                            calculateFromBom: style.shelfLifeCalculateFromBom
                        })];
                case 6:
                    shelfLife_3 = _f.sent();
                    if (shelfLife_3.error)
                        return [2 /*return*/, shelfLife_3];
                    return [4 /*yield*/, (0, styleMethod_service_1.ensureStyleMethodScaffold)(client, {
                            itemId: itemId,
                            companyId: style.companyId,
                            userId: style.createdBy
                        })];
                case 7:
                    styleMethod_1 = _f.sent();
                    if (styleMethod_1.error)
                        return [2 /*return*/, styleMethod_1];
                    _f.label = 8;
                case 8: return [4 /*yield*/, styleClient
                        .from("styles")
                        .select("id")
                        .eq("readableId", style.id)
                        .eq("companyId", style.companyId)
                        .single()];
                case 9:
                    newStyle = _f.sent();
                    return [2 /*return*/, newStyle];
                case 10:
                    itemUpdate = {
                        id: style.id,
                        name: style.name,
                        description: style.description,
                        replenishmentSystem: style.replenishmentSystem,
                        defaultMethodType: style.defaultMethodType,
                        itemTrackingType: style.itemTrackingType,
                        unitOfMeasureCode: style.unitOfMeasureCode,
                        active: true,
                        modelUploadId: style.modelUploadId,
                        thumbnailPath: style.thumbnailPath
                    };
                    styleUpdate = {
                        customFields: style.customFields
                    };
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(itemUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", style.id),
                            styleClient
                                .from("style")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(styleUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", style.id)
                        ])];
                case 11:
                    _b = _f.sent(), updateItem = _b[0], updateStyle = _b[1];
                    if (updateItem.error)
                        return [2 /*return*/, updateItem];
                    return [4 /*yield*/, Promise.all([
                            upsertItemDefaultPickMethod(client, {
                                itemId: style.id,
                                userId: style.updatedBy,
                                storageUnitId: style.defaultStorageUnitId
                            }),
                            upsertItemShelfLife(client, {
                                itemId: style.id,
                                userId: style.updatedBy,
                                mode: style.shelfLifeMode,
                                days: style.shelfLifeDays,
                                triggerProcessId: style.shelfLifeTriggerProcessId,
                                triggerTiming: style.shelfLifeTriggerTiming,
                                calculateFromBom: style.shelfLifeCalculateFromBom
                            })
                        ])];
                case 12:
                    _c = _f.sent(), pickMethod = _c[0], shelfLife = _c[1];
                    if (pickMethod.error)
                        return [2 /*return*/, pickMethod];
                    if (shelfLife.error)
                        return [2 /*return*/, shelfLife];
                    return [4 /*yield*/, styleClient
                            .from("item")
                            .select("companyId")
                            .eq("id", style.id)
                            .single()];
                case 13:
                    styleCompany = _f.sent();
                    if (styleCompany.error)
                        return [2 /*return*/, styleCompany];
                    return [4 /*yield*/, (0, styleMethod_service_1.ensureStyleMethodScaffold)(client, {
                            itemId: style.id,
                            companyId: styleCompany.data.companyId,
                            userId: style.updatedBy
                        })];
                case 14:
                    styleMethod = _f.sent();
                    if (styleMethod.error)
                        return [2 /*return*/, styleMethod];
                    if (!(style.replenishmentSystem !== "Buy")) return [3 /*break*/, 16];
                    return [4 /*yield*/, client
                            .from("itemReplenishment")
                            .update({ lotSize: style.lotSize })
                            .eq("itemId", style.id)];
                case 15:
                    itemReplenishmentUpdate = _f.sent();
                    if (itemReplenishmentUpdate.error)
                        return [2 /*return*/, itemReplenishmentUpdate];
                    _f.label = 16;
                case 16: return [4 /*yield*/, client
                        .from("itemCost")
                        .update((0, supabase_1.sanitize)({
                        itemPostingGroupId: style.postingGroupId,
                        unitCost: style.replenishmentSystem !== "Make" ? style.unitCost : undefined
                    }))
                        .eq("itemId", style.id)];
                case 17:
                    itemCostUpdate = _f.sent();
                    if (itemCostUpdate.error) {
                        console.error(itemCostUpdate.error);
                    }
                    return [2 /*return*/, updateStyle];
            }
        });
    });
}
function updateItem(client, item) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("item")
                    .update((0, supabase_1.sanitize)(item))
                    .eq("id", item.id)
                    .eq("companyId", item.companyId)];
        });
    });
}
function upsertItemCost(client, itemCost) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemCost")
                    .update((0, supabase_1.sanitize)(itemCost))
                    .eq("itemId", itemCost.itemId)];
        });
    });
}
function upsertPickMethod(client, pickMethod) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in pickMethod) {
                return [2 /*return*/, client.from("pickMethod").upsert(pickMethod, {
                        onConflict: "itemId,locationId"
                    })];
            }
            return [2 /*return*/, client
                    .from("pickMethod")
                    .update((0, supabase_1.sanitize)(pickMethod))
                    .eq("itemId", pickMethod.itemId)
                    .eq("locationId", pickMethod.locationId)];
        });
    });
}
function upsertItemManufacturing(client, partManufacturing) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemReplenishment")
                    .update((0, supabase_1.sanitize)(partManufacturing))
                    .eq("itemId", partManufacturing.itemId)];
        });
    });
}
function upsertItemPlanning(client, partPlanning) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in partPlanning) {
                return [2 /*return*/, client.from("itemPlanning").insert(partPlanning)];
            }
            return [2 /*return*/, client
                    .from("itemPlanning")
                    .update((0, supabase_1.sanitize)(partPlanning))
                    .eq("itemId", partPlanning.itemId)
                    .eq("locationId", partPlanning.locationId)];
        });
    });
}
function upsertItemPurchasing(client, itemPurchasing) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemReplenishment")
                    .update((0, supabase_1.sanitize)(itemPurchasing))
                    .eq("itemId", itemPurchasing.itemId)];
        });
    });
}
function upsertItemPostingGroup(client, itemPostingGroup) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in itemPostingGroup) {
                return [2 /*return*/, client
                        .from("itemPostingGroup")
                        .insert([itemPostingGroup])
                        .select("*")
                        .single()];
            }
            return [2 /*return*/, (client
                    .from("itemPostingGroup")
                    .update((0, supabase_1.sanitize)(itemPostingGroup))
                    // @ts-ignore
                    .eq("id", itemPostingGroup.id)
                    .select("id")
                    .single())];
        });
    });
}
function upsertSupplierPart(client, supplierPart) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in supplierPart) {
                return [2 /*return*/, client
                        .from("supplierPart")
                        .insert([supplierPart])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("supplierPart")
                    .update((0, supabase_1.sanitize)(supplierPart))
                    .eq("id", supplierPart.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertItemCustomerPart(client, customerPart) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in customerPart) {
                return [2 /*return*/, client
                        .from("customerPartToItem")
                        .update((0, supabase_1.sanitize)(customerPart))
                        .eq("id", customerPart.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("customerPartToItem")
                    .insert([customerPart])
                    .select("id")
                    .single()];
        });
    });
}
function upsertItemUnitSalePrice(client, itemUnitSalePrice) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemUnitSalePrice")
                    .update((0, supabase_1.sanitize)(itemUnitSalePrice))
                    .eq("itemId", itemUnitSalePrice.itemId)];
        });
    });
}
function upsertMakeMethodVersion(client, makeMethodVersion) {
    return __awaiter(this, void 0, void 0, function () {
        var currentMakeMethod, _a, id, version, data, insert;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("makeMethod")
                        .select("*")
                        .eq("id", makeMethodVersion.copyFromId)
                        .eq("companyId", makeMethodVersion.companyId)
                        .single()];
                case 1:
                    currentMakeMethod = _b.sent();
                    if (currentMakeMethod.error)
                        return [2 /*return*/, currentMakeMethod];
                    _a = currentMakeMethod.data, id = _a.id, version = _a.version, data = __rest(_a, ["id", "version"]);
                    return [4 /*yield*/, client
                            .from("makeMethod")
                            .insert(__assign(__assign({}, data), { status: "Draft", version: makeMethodVersion.version, createdBy: makeMethodVersion.createdBy }))
                            .select("id, ...item(itemId:id, type)")
                            .single()];
                case 2:
                    insert = _b.sent();
                    if (insert.error)
                        return [2 /*return*/, insert];
                    if (!makeMethodVersion.activeVersionId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("makeMethod")
                            .update({ status: "Active" })
                            .eq("id", makeMethodVersion.activeVersionId)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/, insert];
            }
        });
    });
}
/**
 * On BoM material add, seed `methodMaterial.storageUnitIds` with every
 * (locationId -> defaultStorageUnitId) pair configured for the child item
 * in "pickMethod". Values set by the caller win so downstream BoMs
 * constructed with explicit picks are untouched.
 *
 * The JSONB is modelled as Record<locationId, storageUnitId>. Reading all
 * pickMethods (rather than a single "default") matches Carbon's model
 * where an item can be stocked across multiple locations, each with its
 * own preferred bin.
 */
function resolveMethodMaterialStorageUnitIds(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var current, pickMethods, _i, _a, row;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    current = __assign({}, ((_b = args.current) !== null && _b !== void 0 ? _b : {}));
                    if (!args.itemId)
                        return [2 /*return*/, current];
                    return [4 /*yield*/, client
                            .from("pickMethod")
                            .select("locationId, defaultStorageUnitId")
                            .eq("itemId", args.itemId)];
                case 1:
                    pickMethods = _d.sent();
                    for (_i = 0, _a = (_c = pickMethods.data) !== null && _c !== void 0 ? _c : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        if (row.locationId &&
                            row.defaultStorageUnitId &&
                            !current[row.locationId]) {
                            current[row.locationId] = row.defaultStorageUnitId;
                        }
                    }
                    return [2 /*return*/, current];
            }
        });
    });
}
function upsertMethodMaterial(client, methodMaterial) {
    return __awaiter(this, void 0, void 0, function () {
        var item, materialMakeMethodId, makeMethod, seededStorageUnitIds;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!methodMaterial.itemId) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("defaultMethodType, sourcingType")
                            .eq("id", methodMaterial.itemId)
                            .single()];
                case 1:
                    item = _c.sent();
                    if (item.error)
                        return [2 /*return*/, item];
                    methodMaterial.methodType =
                        (_a = item.data.defaultMethodType) !== null && _a !== void 0 ? _a : methodMaterial.methodType;
                    methodMaterial.sourcingType = item.data.sourcingType;
                    _c.label = 2;
                case 2:
                    materialMakeMethodId = null;
                    if (!(methodMaterial.methodType === "Make to Order")) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("activeMakeMethods")
                            .select("id, version")
                            .eq("itemId", methodMaterial.itemId)
                            .single()];
                case 3:
                    makeMethod = _c.sent();
                    if (makeMethod.error)
                        return [2 /*return*/, makeMethod];
                    materialMakeMethodId = (_b = makeMethod.data) === null || _b === void 0 ? void 0 : _b.id;
                    _c.label = 4;
                case 4:
                    if (!("createdBy" in methodMaterial)) return [3 /*break*/, 6];
                    return [4 /*yield*/, resolveMethodMaterialStorageUnitIds(client, {
                            itemId: methodMaterial.itemId,
                            current: methodMaterial.storageUnitIds
                        })];
                case 5:
                    seededStorageUnitIds = _c.sent();
                    return [2 /*return*/, client
                            .from("methodMaterial")
                            .insert([
                            __assign(__assign({}, methodMaterial), { itemId: methodMaterial.itemId, storageUnitIds: seededStorageUnitIds, materialMakeMethodId: materialMakeMethodId })
                        ])
                            .select("id")
                            .single()];
                case 6: return [2 /*return*/, client
                        .from("methodMaterial")
                        .update((0, supabase_1.sanitize)(__assign(__assign({}, methodMaterial), { materialMakeMethodId: materialMakeMethodId })))
                        .eq("id", methodMaterial.id)
                        .select("id")
                        .single()];
            }
        });
    });
}
function upsertMethodOperation(client, methodOperation) {
    return __awaiter(this, void 0, void 0, function () {
        var currentOperation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ("createdBy" in methodOperation) {
                        return [2 /*return*/, client
                                .from("methodOperation")
                                .insert([methodOperation])
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("methodOperation")
                            .select("id, tags, customFields")
                            .eq("id", methodOperation.id)
                            .single()];
                case 1:
                    currentOperation = _a.sent();
                    if (currentOperation.error)
                        return [2 /*return*/, currentOperation];
                    if ((0, styleMethod_service_1.isStyleSystemOwnedOperation)(currentOperation.data)) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "System-owned Style cutting operations cannot be edited from the bill of process."
                                }
                            }];
                    }
                    return [2 /*return*/, client
                            .from("methodOperation")
                            .update((0, supabase_1.sanitize)(methodOperation))
                            .eq("id", methodOperation.id)
                            .select("id")
                            .single()];
            }
        });
    });
}
function upsertMethodOperationStep(client, methodOperationStep) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in methodOperationStep) {
                return [2 /*return*/, client
                        .from("methodOperationStep")
                        .insert(methodOperationStep)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("methodOperationStep")
                    .update((0, supabase_1.sanitize)(methodOperationStep))
                    .eq("id", methodOperationStep.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertMethodOperationParameter(client, methodOperationParameter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in methodOperationParameter) {
                return [2 /*return*/, client
                        .from("methodOperationParameter")
                        .insert(methodOperationParameter)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("methodOperationParameter")
                    .update((0, supabase_1.sanitize)(methodOperationParameter))
                    .eq("id", methodOperationParameter.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertMethodOperationTool(client, methodOperationTool) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in methodOperationTool) {
                return [2 /*return*/, client
                        .from("methodOperationTool")
                        .insert(methodOperationTool)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("methodOperationTool")
                    .update((0, supabase_1.sanitize)(methodOperationTool))
                    .eq("id", methodOperationTool.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertMaterial(client, material) {
    return __awaiter(this, void 0, void 0, function () {
        var newItemIds, itemInserts, hasErrors, firstError, _i, itemInserts_1, insert, itemCostUpdate, itemInsert, itemId, itemCostUpdate, _a, newItemIds_1, itemId, pickMethod_4, shelfLife_4, materialInsert, newMaterial, itemUpdate, materialUpdate, _b, updateItem, updateMaterial, pickMethod, shelfLife;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!("createdBy" in material)) return [3 /*break*/, 14];
                    newItemIds = [];
                    if (!material.sizes) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all(material.sizes.map(function (size) {
                            return client
                                .from("item")
                                .insert({
                                readableId: material.id,
                                name: material.name,
                                description: material.description,
                                type: "Material",
                                replenishmentSystem: material.replenishmentSystem,
                                defaultMethodType: material.defaultMethodType,
                                itemTrackingType: material.itemTrackingType,
                                unitOfMeasureCode: material.unitOfMeasureCode,
                                active: true,
                                thumbnailPath: material.thumbnailPath,
                                revision: size,
                                companyId: material.companyId,
                                createdBy: material.createdBy
                            })
                                .select("id")
                                .single();
                        }))];
                case 1:
                    itemInserts = _g.sent();
                    hasErrors = itemInserts.some(function (insert) { return insert.error; });
                    if (hasErrors) {
                        firstError = itemInserts.find(function (insert) { return insert.error; });
                        return [2 /*return*/, firstError];
                    }
                    for (_i = 0, itemInserts_1 = itemInserts; _i < itemInserts_1.length; _i++) {
                        insert = itemInserts_1[_i];
                        if ((_c = insert.data) === null || _c === void 0 ? void 0 : _c.id)
                            newItemIds.push(insert.data.id);
                    }
                    return [4 /*yield*/, Promise.all(itemInserts.map(function (insert) {
                            var _a, _b;
                            return client
                                .from("itemCost")
                                .update((0, supabase_1.sanitize)({
                                itemPostingGroupId: material.postingGroupId,
                                unitCost: material.unitCost
                            }))
                                .eq("itemId", (_b = (_a = insert.data) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "");
                        }))];
                case 2:
                    itemCostUpdate = _g.sent();
                    if (itemCostUpdate.some(function (update) { return update.error; })) {
                        console.error(itemCostUpdate.find(function (update) { return update.error; }));
                    }
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, client
                        .from("item")
                        .insert({
                        readableId: material.id,
                        name: material.name,
                        description: material.description,
                        type: "Material",
                        replenishmentSystem: material.replenishmentSystem,
                        defaultMethodType: material.defaultMethodType,
                        itemTrackingType: material.itemTrackingType,
                        unitOfMeasureCode: material.unitOfMeasureCode,
                        active: true,
                        thumbnailPath: material.thumbnailPath,
                        companyId: material.companyId,
                        createdBy: material.createdBy
                    })
                        .select("id")
                        .single()];
                case 4:
                    itemInsert = _g.sent();
                    if (itemInsert.error)
                        return [2 /*return*/, itemInsert];
                    itemId = (_d = itemInsert.data) === null || _d === void 0 ? void 0 : _d.id;
                    if (itemId)
                        newItemIds.push(itemId);
                    return [4 /*yield*/, client
                            .from("itemCost")
                            .update((0, supabase_1.sanitize)({
                            itemPostingGroupId: material.postingGroupId,
                            unitCost: material.unitCost
                        }))
                            .eq("itemId", itemId)];
                case 5:
                    itemCostUpdate = _g.sent();
                    if (itemCostUpdate.error) {
                        console.error(itemCostUpdate.error);
                    }
                    _g.label = 6;
                case 6:
                    _a = 0, newItemIds_1 = newItemIds;
                    _g.label = 7;
                case 7:
                    if (!(_a < newItemIds_1.length)) return [3 /*break*/, 11];
                    itemId = newItemIds_1[_a];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: itemId,
                            userId: material.createdBy,
                            storageUnitId: material.defaultStorageUnitId
                        })];
                case 8:
                    pickMethod_4 = _g.sent();
                    if (pickMethod_4.error)
                        return [2 /*return*/, pickMethod_4];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: itemId,
                            userId: material.createdBy,
                            companyId: material.companyId,
                            mode: material.shelfLifeMode,
                            days: material.shelfLifeDays,
                            triggerProcessId: material.shelfLifeTriggerProcessId,
                            triggerTiming: material.shelfLifeTriggerTiming,
                            calculateFromBom: material.shelfLifeCalculateFromBom
                        })];
                case 9:
                    shelfLife_4 = _g.sent();
                    if (shelfLife_4.error)
                        return [2 /*return*/, shelfLife_4];
                    _g.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 7];
                case 11: return [4 /*yield*/, client.from("material").upsert({
                        id: material.id,
                        materialFormId: material.materialFormId,
                        materialSubstanceId: material.materialSubstanceId,
                        finishId: material.finishId,
                        gradeId: material.gradeId,
                        dimensionId: material.dimensionId,
                        materialTypeId: material.materialTypeId,
                        companyId: material.companyId,
                        createdBy: material.createdBy,
                        customFields: material.customFields
                    })];
                case 12:
                    materialInsert = _g.sent();
                    if (materialInsert.error)
                        return [2 /*return*/, materialInsert];
                    return [4 /*yield*/, client
                            .from("materials")
                            .select("*")
                            .eq("readableId", material.id)
                            .eq("companyId", material.companyId)];
                case 13:
                    newMaterial = _g.sent();
                    return [2 /*return*/, {
                            data: (_f = (_e = newMaterial.data) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : null,
                            error: newMaterial.error
                        }];
                case 14:
                    itemUpdate = {
                        id: material.id,
                        name: material.name,
                        description: material.description,
                        replenishmentSystem: material.replenishmentSystem,
                        defaultMethodType: material.defaultMethodType,
                        itemTrackingType: material.itemTrackingType,
                        unitOfMeasureCode: material.unitOfMeasureCode,
                        active: true
                    };
                    materialUpdate = {
                        materialFormId: material.materialFormId,
                        materialSubstanceId: material.materialSubstanceId,
                        finishId: material.finishId,
                        gradeId: material.gradeId,
                        dimensionId: material.dimensionId,
                        materialTypeId: material.materialTypeId,
                        customFields: material.customFields
                    };
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(itemUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", material.id),
                            client
                                .from("material")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(materialUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", material.id)
                        ])];
                case 15:
                    _b = _g.sent(), updateItem = _b[0], updateMaterial = _b[1];
                    if (updateItem.error)
                        return [2 /*return*/, updateItem];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: material.id,
                            userId: material.updatedBy,
                            storageUnitId: material.defaultStorageUnitId
                        })];
                case 16:
                    pickMethod = _g.sent();
                    if (pickMethod.error)
                        return [2 /*return*/, pickMethod];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: material.id,
                            userId: material.updatedBy,
                            mode: material.shelfLifeMode,
                            days: material.shelfLifeDays,
                            triggerProcessId: material.shelfLifeTriggerProcessId,
                            triggerTiming: material.shelfLifeTriggerTiming,
                            calculateFromBom: material.shelfLifeCalculateFromBom
                        })];
                case 17:
                    shelfLife = _g.sent();
                    if (shelfLife.error)
                        return [2 /*return*/, shelfLife];
                    return [2 /*return*/, updateMaterial];
            }
        });
    });
}
function upsertMaterialDimension(client, materialDimension) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in materialDimension) {
                return [2 /*return*/, (client
                        .from("materialDimension")
                        .update((0, supabase_1.sanitize)(materialDimension))
                        // @ts-ignore
                        .eq("id", materialDimension.id)
                        .select("id")
                        .single())];
            }
            return [2 /*return*/, client
                    .from("materialDimension")
                    .insert([materialDimension])
                    .select("*")
                    .single()];
        });
    });
}
function upsertMaterialFinish(client, materialFinish) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in materialFinish) {
                return [2 /*return*/, (client
                        .from("materialFinish")
                        .update((0, supabase_1.sanitize)(materialFinish))
                        // @ts-ignore
                        .eq("id", materialFinish.id)
                        .select("id")
                        .single())];
            }
            return [2 /*return*/, client
                    .from("materialFinish")
                    .insert([materialFinish])
                    .select("*")
                    .single()];
        });
    });
}
function upsertStyleColor(client, styleColor) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            if ("id" in styleColor) {
                return [2 /*return*/, styleClient
                        .from("styleColor")
                        .update((0, supabase_1.sanitize)(__assign(__assign({}, styleColor), { updatedAt: new Date().toISOString() })))
                        .eq("id", styleColor.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, styleClient
                    .from("styleColor")
                    .insert([styleColor])
                    .select("*")
                    .single()];
        });
    });
}
function upsertStyleSize(client, styleSize) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient;
        return __generator(this, function (_a) {
            styleClient = client;
            if ("id" in styleSize) {
                return [2 /*return*/, styleClient
                        .from("styleSize")
                        .update((0, supabase_1.sanitize)(__assign(__assign({}, styleSize), { updatedAt: new Date().toISOString() })))
                        .eq("id", styleSize.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, styleClient.from("styleSize").insert([styleSize]).select("*").single()];
        });
    });
}
function upsertMaterialForm(client, materialForm) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in materialForm) {
                return [2 /*return*/, client
                        .from("materialForm")
                        .insert([materialForm])
                        .select("*")
                        .single()];
            }
            return [2 /*return*/, (client
                    .from("materialForm")
                    .update((0, supabase_1.sanitize)(materialForm))
                    // @ts-ignore
                    .eq("id", materialForm.id)
                    .select("id")
                    .single())];
        });
    });
}
function upsertMaterialGrade(client, materialGrade) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in materialGrade) {
                return [2 /*return*/, (client
                        .from("materialGrade")
                        .update((0, supabase_1.sanitize)(materialGrade))
                        // @ts-ignore
                        .eq("id", materialGrade.id)
                        .select("id")
                        .single())];
            }
            return [2 /*return*/, client
                    .from("materialGrade")
                    .insert([materialGrade])
                    .select("*")
                    .single()];
        });
    });
}
function deleteMaterialType(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialType").delete().eq("id", id)];
        });
    });
}
function getMaterialTypes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("materialTypes")
                .select("*", { count: "exact" })
                .or("companyId.eq.".concat(companyId, ",companyId.is.null"));
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args !== null && args !== void 0 ? args : {});
            return [2 /*return*/, query];
        });
    });
}
function getMaterialType(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("materialType").select("*").eq("id", id).single()];
        });
    });
}
function getMaterialTypeList(client, materialSubstanceId, materialFormId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("materialType")
                    .select("*")
                    .eq("materialSubstanceId", materialSubstanceId)
                    .eq("materialFormId", materialFormId)
                    .or("companyId.eq.".concat(companyId, ",companyId.is.null"))];
        });
    });
}
function upsertMaterialType(client, materialType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in materialType) {
                return [2 /*return*/, (client
                        .from("materialType")
                        .update((0, supabase_1.sanitize)(materialType))
                        // @ts-ignore
                        .eq("id", materialType.id)
                        .select("id")
                        .single())];
            }
            return [2 /*return*/, client
                    .from("materialType")
                    .insert([materialType])
                    .select("*")
                    .single()];
        });
    });
}
function upsertMaterialSubstance(client, materialSubstance) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in materialSubstance) {
                return [2 /*return*/, client
                        .from("materialSubstance")
                        .insert([materialSubstance])
                        .select("*")
                        .single()];
            }
            return [2 /*return*/, (client
                    .from("materialSubstance")
                    .update((0, supabase_1.sanitize)(materialSubstance))
                    // @ts-ignore
                    .eq("id", materialSubstance.id)
                    .select("id")
                    .single())];
        });
    });
}
function upsertService(client, service) {
    return __awaiter(this, void 0, void 0, function () {
        var itemInsert, itemId, serviceInsert, costUpdate, newService, itemUpdate, serviceUpdate, _a, updateItem, updateService;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!("createdBy" in service)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("item")
                            .insert({
                            readableId: service.id,
                            name: service.name,
                            type: "Service",
                            replenishmentSystem: service.serviceType === "External" ? "Buy" : "Make",
                            defaultMethodType: service.serviceType === "External"
                                ? "Purchase to Order"
                                : "Make to Order",
                            itemTrackingType: service.itemTrackingType,
                            unitOfMeasureCode: "EA",
                            active: true,
                            companyId: service.companyId,
                            createdBy: service.createdBy
                        })
                            .select("id")
                            .single()];
                case 1:
                    itemInsert = _c.sent();
                    if (itemInsert.error)
                        return [2 /*return*/, itemInsert];
                    itemId = (_b = itemInsert.data) === null || _b === void 0 ? void 0 : _b.id;
                    return [4 /*yield*/, client
                            .from("service")
                            .insert({
                            id: service.id,
                            serviceType: service.serviceType,
                            companyId: service.companyId,
                            createdBy: service.createdBy,
                            customFields: service.customFields
                        })
                            .select("*")
                            .single()];
                case 2:
                    serviceInsert = _c.sent();
                    if (serviceInsert.error)
                        return [2 /*return*/, serviceInsert];
                    return [4 /*yield*/, client
                            .from("itemCost")
                            .update({ unitCost: service.unitCost })
                            .eq("itemId", itemId)
                            .select("*")
                            .single()];
                case 3:
                    costUpdate = _c.sent();
                    if (costUpdate.error)
                        return [2 /*return*/, costUpdate];
                    return [4 /*yield*/, client
                            .from("service")
                            .select("*")
                            .eq("readableId", service.id)
                            .single()];
                case 4:
                    newService = _c.sent();
                    return [2 /*return*/, newService];
                case 5:
                    itemUpdate = {
                        id: service.id,
                        name: service.name,
                        description: service.description,
                        replenishmentSystem: service.serviceType === "External" ? "Buy" : "Make",
                        defaultMethodType: service.serviceType === "External"
                            ? "Purchase to Order"
                            : "Make to Order",
                        itemTrackingType: service.itemTrackingType,
                        unitOfMeasureCode: null,
                        active: true
                    };
                    serviceUpdate = {
                        serviceType: service.serviceType
                    };
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(itemUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", service.id),
                            client
                                .from("service")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(serviceUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("itemId", service.id)
                        ])];
                case 6:
                    _a = _c.sent(), updateItem = _a[0], updateService = _a[1];
                    if (updateItem.error)
                        return [2 /*return*/, updateItem];
                    return [2 /*return*/, updateService];
            }
        });
    });
}
function upsertUnitOfMeasure(client, unitOfMeasure) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in unitOfMeasure) {
                return [2 /*return*/, client
                        .from("unitOfMeasure")
                        .update((0, supabase_1.sanitize)(unitOfMeasure))
                        .eq("id", unitOfMeasure.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("unitOfMeasure")
                    .insert([unitOfMeasure])
                    .select("id")
                    .single()];
        });
    });
}
function upsertTool(client, tool) {
    return __awaiter(this, void 0, void 0, function () {
        var itemInsert, itemId, _a, toolInsert, itemCostUpdate, pickMethod_5, shelfLife_5, newTool, itemUpdate, toolUpdate, _b, updateItem, updateTool, pickMethod, shelfLife;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!("createdBy" in tool)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("item")
                            .insert({
                            readableId: tool.id,
                            revision: (_c = tool.revision) !== null && _c !== void 0 ? _c : "0",
                            name: tool.name,
                            description: tool.description,
                            type: "Tool",
                            replenishmentSystem: tool.replenishmentSystem,
                            defaultMethodType: tool.defaultMethodType,
                            itemTrackingType: tool.itemTrackingType,
                            unitOfMeasureCode: tool.unitOfMeasureCode,
                            active: true,
                            modelUploadId: tool.modelUploadId,
                            thumbnailPath: tool.thumbnailPath,
                            companyId: tool.companyId,
                            createdBy: tool.createdBy
                        })
                            .select("id")
                            .single()];
                case 1:
                    itemInsert = _e.sent();
                    if (itemInsert.error)
                        return [2 /*return*/, itemInsert];
                    itemId = (_d = itemInsert.data) === null || _d === void 0 ? void 0 : _d.id;
                    return [4 /*yield*/, Promise.all([
                            client.from("tool").upsert({
                                id: tool.id,
                                companyId: tool.companyId,
                                createdBy: tool.createdBy,
                                customFields: tool.customFields
                            }),
                            client
                                .from("itemCost")
                                .update((0, supabase_1.sanitize)({
                                itemPostingGroupId: tool.postingGroupId,
                                unitCost: tool.unitCost
                            }))
                                .eq("itemId", itemId)
                        ])];
                case 2:
                    _a = _e.sent(), toolInsert = _a[0], itemCostUpdate = _a[1];
                    if (toolInsert.error)
                        return [2 /*return*/, toolInsert];
                    if (itemCostUpdate.error)
                        return [2 /*return*/, itemCostUpdate];
                    if (!itemId) return [3 /*break*/, 5];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: itemId,
                            userId: tool.createdBy,
                            storageUnitId: tool.defaultStorageUnitId
                        })];
                case 3:
                    pickMethod_5 = _e.sent();
                    if (pickMethod_5.error)
                        return [2 /*return*/, pickMethod_5];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: itemId,
                            userId: tool.createdBy,
                            companyId: tool.companyId,
                            mode: tool.shelfLifeMode,
                            days: tool.shelfLifeDays,
                            triggerProcessId: tool.shelfLifeTriggerProcessId,
                            triggerTiming: tool.shelfLifeTriggerTiming,
                            calculateFromBom: tool.shelfLifeCalculateFromBom
                        })];
                case 4:
                    shelfLife_5 = _e.sent();
                    if (shelfLife_5.error)
                        return [2 /*return*/, shelfLife_5];
                    _e.label = 5;
                case 5: return [4 /*yield*/, client
                        .from("tools")
                        .select("*")
                        .eq("readableId", tool.id)
                        .eq("companyId", tool.companyId)
                        .single()];
                case 6:
                    newTool = _e.sent();
                    return [2 /*return*/, newTool];
                case 7:
                    itemUpdate = {
                        id: tool.id,
                        name: tool.name,
                        description: tool.description,
                        replenishmentSystem: tool.replenishmentSystem,
                        defaultMethodType: tool.defaultMethodType,
                        itemTrackingType: tool.itemTrackingType,
                        unitOfMeasureCode: tool.unitOfMeasureCode,
                        active: true
                    };
                    toolUpdate = {
                        customFields: tool.customFields
                    };
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(itemUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", tool.id),
                            client
                                .from("tool")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(toolUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", tool.id)
                        ])];
                case 8:
                    _b = _e.sent(), updateItem = _b[0], updateTool = _b[1];
                    if (updateItem.error)
                        return [2 /*return*/, updateItem];
                    return [4 /*yield*/, upsertItemDefaultPickMethod(client, {
                            itemId: tool.id,
                            userId: tool.updatedBy,
                            storageUnitId: tool.defaultStorageUnitId
                        })];
                case 9:
                    pickMethod = _e.sent();
                    if (pickMethod.error)
                        return [2 /*return*/, pickMethod];
                    return [4 /*yield*/, upsertItemShelfLife(client, {
                            itemId: tool.id,
                            userId: tool.updatedBy,
                            mode: tool.shelfLifeMode,
                            days: tool.shelfLifeDays,
                            triggerProcessId: tool.shelfLifeTriggerProcessId,
                            triggerTiming: tool.shelfLifeTriggerTiming,
                            calculateFromBom: tool.shelfLifeCalculateFromBom
                        })];
                case 10:
                    shelfLife = _e.sent();
                    if (shelfLife.error)
                        return [2 /*return*/, shelfLife];
                    return [2 /*return*/, updateTool];
            }
        });
    });
}
/**
 * Batch pre-fetch supplier price breaks for multiple items.
 * Builds a SupplierPriceMap keyed by itemId, pooling price break
 * tiers from ALL suppliers for each item.
 *
 * Used by the quote loader to pre-load pricing data for BOM costing.
 */
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
                    // Initialize entries with fallback prices
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
                    // Add price breaks
                    for (_d = 0, _e = (_g = prices.data) !== null && _g !== void 0 ? _g : []; _d < _e.length; _d++) {
                        price = _e[_d];
                        itemId = spToItem.get(price.supplierPartId);
                        if (itemId && result[itemId]) {
                            result[itemId].priceBreaks.push({
                                quantity: price.quantity,
                                unitPrice: price.unitPrice
                            });
                        }
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * Async price lookup across ALL suppliers for an item.
 * Delegates to getSupplierPriceBreaksForItems + lookupBuyPriceFromMap.
 *
 * Used in quote creation where the specific supplier isn't known.
 */
function lookupBuyPrice(client, itemId, qty, fallbackCost) {
    return __awaiter(this, void 0, void 0, function () {
        var map;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSupplierPriceBreaksForItems(client, [itemId])];
                case 1:
                    map = _a.sent();
                    return [2 /*return*/, (0, shared_1.lookupBuyPriceFromMap)(itemId, qty, map, fallbackCost)];
            }
        });
    });
}
/**
 * Fetch price breaks array for a specific supplier part.
 * Used by PO and Invoice forms to cache breaks in state.
 */
function getSupplierPartPriceBreaks(client, supplierPartId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("supplierPartPrice")
                        .select("quantity, unitPrice")
                        .eq("supplierPartId", supplierPartId)
                        .order("quantity", { ascending: true })];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, ((_a = result.data) !== null && _a !== void 0 ? _a : []).map(function (pb) { return ({
                            quantity: pb.quantity,
                            unitPrice: pb.unitPrice
                        }); })];
            }
        });
    });
}
