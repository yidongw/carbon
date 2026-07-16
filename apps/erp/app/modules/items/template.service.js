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
exports.insertTemplate = insertTemplate;
exports.getTemplate = getTemplate;
exports.getTemplatesList = getTemplatesList;
exports.deleteTemplate = deleteTemplate;
exports.getTemplateConfigurationParameters = getTemplateConfigurationParameters;
exports.mapTemplateConfigurationParametersForForm = mapTemplateConfigurationParametersForForm;
exports.getTemplateConfigurationRules = getTemplateConfigurationRules;
exports.upsertTemplateConfigurationParameter = upsertTemplateConfigurationParameter;
exports.upsertTemplateConfigurationParameterGroup = upsertTemplateConfigurationParameterGroup;
exports.deleteTemplateConfigurationParameter = deleteTemplateConfigurationParameter;
exports.deleteTemplateConfigurationParameterGroup = deleteTemplateConfigurationParameterGroup;
exports.updateTemplateConfigurationParameterGroupOrder = updateTemplateConfigurationParameterGroupOrder;
exports.updateTemplateConfigurationParameterOrder = updateTemplateConfigurationParameterOrder;
exports.upsertTemplateConfigurationRule = upsertTemplateConfigurationRule;
exports.deleteTemplateConfigurationRule = deleteTemplateConfigurationRule;
exports.getTemplateMakeMethods = getTemplateMakeMethods;
exports.getTemplateMakeMethodById = getTemplateMakeMethodById;
exports.getTemplateMethodMaterialsByMakeMethod = getTemplateMethodMaterialsByMakeMethod;
exports.getTemplateMethodOperationsByMakeMethodId = getTemplateMethodOperationsByMakeMethodId;
exports.upsertTemplateMethodMaterial = upsertTemplateMethodMaterial;
exports.deleteTemplateMethodMaterial = deleteTemplateMethodMaterial;
exports.updateTemplateMaterialOrder = updateTemplateMaterialOrder;
exports.upsertTemplateMethodOperation = upsertTemplateMethodOperation;
exports.deleteTemplateMethodOperation = deleteTemplateMethodOperation;
exports.updateTemplateOperationOrder = updateTemplateOperationOrder;
exports.assertTemplateMethodOperationIsDraft = assertTemplateMethodOperationIsDraft;
exports.upsertTemplateMethodOperationStep = upsertTemplateMethodOperationStep;
exports.deleteTemplateMethodOperationStep = deleteTemplateMethodOperationStep;
exports.upsertTemplateMethodOperationParameter = upsertTemplateMethodOperationParameter;
exports.deleteTemplateMethodOperationParameter = deleteTemplateMethodOperationParameter;
exports.upsertTemplateMethodOperationTool = upsertTemplateMethodOperationTool;
exports.deleteTemplateMethodOperationTool = deleteTemplateMethodOperationTool;
exports.updateTemplateMethodOperationStepOrder = updateTemplateMethodOperationStepOrder;
exports.applyTemplateToItem = applyTemplateToItem;
exports.mapTemplateMethodOperationForBillOfProcess = mapTemplateMethodOperationForBillOfProcess;
var date_1 = require("@internationalized/date");
var supabase_1 = require("~/utils/supabase");
function resolveTemplateMethodMaterialStorageUnitIds(client, args) {
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
function insertTemplate(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var templateRow, methodRow;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("template")
                        .insert({
                        name: args.name,
                        description: (_a = args.description) !== null && _a !== void 0 ? _a : null,
                        companyId: args.companyId,
                        createdBy: args.createdBy
                    })
                        .select("id")
                        .single()];
                case 1:
                    templateRow = _b.sent();
                    if (templateRow.error || !templateRow.data)
                        return [2 /*return*/, templateRow];
                    return [4 /*yield*/, client
                            .from("templateMakeMethod")
                            .insert({
                            templateId: templateRow.data.id,
                            companyId: args.companyId,
                            createdBy: args.createdBy,
                            status: "Draft",
                            version: 1
                        })
                            .select("id")
                            .single()];
                case 2:
                    methodRow = _b.sent();
                    if (methodRow.error)
                        return [2 /*return*/, methodRow];
                    return [2 /*return*/, templateRow];
            }
        });
    });
}
function getTemplate(client, templateId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("template")
                    .select("*")
                    .eq("id", templateId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getTemplatesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("template")
                    .select("id, name, description, updatedAt")
                    .eq("companyId", companyId)
                    .order("name", { ascending: true })];
        });
    });
}
function deleteTemplate(client, templateId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("template")
                    .delete()
                    .eq("id", templateId)
                    .eq("companyId", companyId)];
        });
    });
}
function getTemplateConfigurationParameters(client, templateId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, parameters, groups;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("templateConfigurationParameter")
                            .select("*")
                            .eq("templateId", templateId)
                            .eq("companyId", companyId),
                        client
                            .from("templateConfigurationParameterGroup")
                            .select("*")
                            .eq("templateId", templateId)
                            .eq("companyId", companyId)
                    ])];
                case 1:
                    _a = _d.sent(), parameters = _a[0], groups = _a[1];
                    if (parameters.error || groups.error) {
                        return [2 /*return*/, { groups: [], parameters: [] }];
                    }
                    return [2 /*return*/, {
                            groups: (_b = groups.data) !== null && _b !== void 0 ? _b : [],
                            parameters: (_c = parameters.data) !== null && _c !== void 0 ? _c : []
                        }];
            }
        });
    });
}
function mapTemplateConfigurationParametersForForm(parameters) {
    return parameters.map(function (p) { return ({
        id: p.id,
        companyId: p.companyId,
        configurationParameterGroupId: p.templateConfigurationParameterGroupId,
        createdAt: p.createdAt,
        createdBy: p.createdBy,
        dataType: p.dataType,
        itemId: p.templateId,
        key: p.key,
        label: p.label,
        listOptions: p.listOptions,
        materialFormFilterId: p.materialFormFilterId,
        sortOrder: p.sortOrder,
        updatedAt: p.updatedAt,
        updatedBy: p.updatedBy
    }); });
}
function getTemplateConfigurationRules(client, templateId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("templateConfigurationRule")
                        .select("*")
                        .eq("templateId", templateId)
                        .eq("companyId", companyId)];
                case 1:
                    result = _b.sent();
                    if (result.error)
                        return [2 /*return*/, []];
                    return [2 /*return*/, (_a = result.data) !== null && _a !== void 0 ? _a : []];
            }
        });
    });
}
function upsertTemplateConfigurationParameter(client, configurationParameter) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, data, configurationParameterGroupId, updateFields, ungroupedGroupId, existingGroups, ungroupedGroup, maxSortOrder, ungroupedGroupInsert;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    userId = configurationParameter.userId, data = __rest(configurationParameter, ["userId"]);
                    if (configurationParameter.id) {
                        configurationParameterGroupId = data.configurationParameterGroupId, updateFields = __rest(data, ["configurationParameterGroupId"]);
                        return [2 /*return*/, client
                                .from("templateConfigurationParameter")
                                .update((0, supabase_1.sanitize)(__assign(__assign({}, updateFields), { templateConfigurationParameterGroupId: configurationParameterGroupId !== null && configurationParameterGroupId !== void 0 ? configurationParameterGroupId : null, updatedBy: userId, updatedAt: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString() })))
                                .eq("id", configurationParameter.id)];
                    }
                    ungroupedGroupId = null;
                    return [4 /*yield*/, client
                            .from("templateConfigurationParameterGroup")
                            .select("id, isUngrouped, sortOrder")
                            .eq("templateId", data.templateId)];
                case 1:
                    existingGroups = _f.sent();
                    ungroupedGroup = (_a = existingGroups.data) === null || _a === void 0 ? void 0 : _a.find(function (group) { return group.isUngrouped; });
                    if (!ungroupedGroup) return [3 /*break*/, 2];
                    ungroupedGroupId = ungroupedGroup.id;
                    return [3 /*break*/, 4];
                case 2:
                    maxSortOrder = (_c = (_b = existingGroups.data) === null || _b === void 0 ? void 0 : _b.reduce(function (max, group) { var _a; return Math.max(max, (_a = group.sortOrder) !== null && _a !== void 0 ? _a : 1); }, 1)) !== null && _c !== void 0 ? _c : 0;
                    return [4 /*yield*/, client
                            .from("templateConfigurationParameterGroup")
                            .insert({
                            templateId: data.templateId,
                            name: "Ungrouped",
                            isUngrouped: true,
                            sortOrder: maxSortOrder + 1,
                            companyId: data.companyId
                        })
                            .select("id")
                            .single()];
                case 3:
                    ungroupedGroupInsert = _f.sent();
                    if (ungroupedGroupInsert.error)
                        return [2 /*return*/, ungroupedGroupInsert];
                    ungroupedGroupId = ungroupedGroupInsert.data.id;
                    _f.label = 4;
                case 4: return [2 /*return*/, client.from("templateConfigurationParameter").insert({
                        templateId: data.templateId,
                        key: (_d = data.key) !== null && _d !== void 0 ? _d : "",
                        label: data.label,
                        dataType: data.dataType,
                        sortOrder: 1,
                        listOptions: data.dataType === "list" ? ((_e = data.listOptions) !== null && _e !== void 0 ? _e : []) : null,
                        companyId: data.companyId,
                        createdBy: userId,
                        templateConfigurationParameterGroupId: ungroupedGroupId,
                        materialFormFilterId: data.materialFormFilterId || null
                    })];
            }
        });
    });
}
function upsertTemplateConfigurationParameterGroup(client, configurationParameterGroup) {
    return __awaiter(this, void 0, void 0, function () {
        var templateId, data, existingGroups, maxSortOrder;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    templateId = configurationParameterGroup.templateId, data = __rest(configurationParameterGroup, ["templateId"]);
                    if (configurationParameterGroup.id) {
                        return [2 /*return*/, client
                                .from("templateConfigurationParameterGroup")
                                .update({
                                name: data.name
                            })
                                .eq("id", configurationParameterGroup.id)];
                    }
                    return [4 /*yield*/, client
                            .from("templateConfigurationParameterGroup")
                            .select("id, isUngrouped, sortOrder")
                            .eq("templateId", templateId)];
                case 1:
                    existingGroups = _c.sent();
                    maxSortOrder = (_b = (_a = existingGroups.data) === null || _a === void 0 ? void 0 : _a.reduce(function (max, group) { var _a; return Math.max(max, (_a = group.sortOrder) !== null && _a !== void 0 ? _a : 1); }, 1)) !== null && _b !== void 0 ? _b : 0;
                    return [2 /*return*/, client.from("templateConfigurationParameterGroup").insert(__assign(__assign({}, data), { templateId: templateId, name: data.name, sortOrder: maxSortOrder + 1, companyId: configurationParameterGroup.companyId }))];
            }
        });
    });
}
function deleteTemplateConfigurationParameter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("templateConfigurationParameter").delete().eq("id", id)];
        });
    });
}
function deleteTemplateConfigurationParameterGroup(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var groupMeta, parameters, ungrouped;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("templateConfigurationParameterGroup")
                        .select("templateId")
                        .eq("id", id)
                        .single()];
                case 1:
                    groupMeta = _b.sent();
                    return [4 /*yield*/, client
                            .from("templateConfigurationParameter")
                            .select("id")
                            .eq("templateConfigurationParameterGroupId", id)];
                case 2:
                    parameters = (_b.sent()).data;
                    if (!(parameters && parameters.length > 0 && ((_a = groupMeta.data) === null || _a === void 0 ? void 0 : _a.templateId))) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("templateConfigurationParameterGroup")
                            .select("id")
                            .eq("isUngrouped", true)
                            .eq("templateId", groupMeta.data.templateId)
                            .single()];
                case 3:
                    ungrouped = (_b.sent()).data;
                    if (!ungrouped) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("templateConfigurationParameter")
                            .update({ templateConfigurationParameterGroupId: ungrouped.id })
                            .eq("templateConfigurationParameterGroupId", id)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [2 /*return*/, client
                        .from("templateConfigurationParameterGroup")
                        .delete()
                        .eq("id", id)];
            }
        });
    });
}
function updateTemplateConfigurationParameterGroupOrder(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("templateConfigurationParameterGroup")
                    .update((0, supabase_1.sanitize)(data))
                    .eq("id", data.id)];
        });
    });
}
function updateTemplateConfigurationParameterOrder(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("templateConfigurationParameter")
                    .update((0, supabase_1.sanitize)(__assign(__assign({}, data), { templateConfigurationParameterGroupId: data.configurationParameterGroupId })))
                    .eq("id", data.id)];
        });
    });
}
function upsertTemplateConfigurationRule(client, configurationRule) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("templateConfigurationRule").upsert(__assign(__assign({}, configurationRule), { updatedAt: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString() }), { onConflict: "templateId,field" })];
        });
    });
}
function deleteTemplateConfigurationRule(client, field, templateId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("templateConfigurationRule")
                    .delete()
                    .eq("field", field)
                    .eq("templateId", templateId)];
        });
    });
}
function getTemplateMakeMethods(client, templateId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("templateMakeMethod")
                    .select("*")
                    .eq("templateId", templateId)
                    .eq("companyId", companyId)];
        });
    });
}
function getTemplateMakeMethodById(client, makeMethodId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("templateMakeMethod")
                    .select("*")
                    .eq("id", makeMethodId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getTemplateMethodMaterialsByMakeMethod(client, templateMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("templateMethodMaterial")
                    .select("*")
                    .eq("templateMakeMethodId", templateMakeMethodId)
                    .order("order", { ascending: true })];
        });
    });
}
function getTemplateMethodOperationsByMakeMethodId(client, templateMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("templateMethodOperation")
                    .select("*, templateMethodOperationTool(*), templateMethodOperationParameter(*), templateMethodOperationStep(*)")
                    .eq("templateMakeMethodId", templateMakeMethodId)
                    .order("order", { ascending: true })];
        });
    });
}
function upsertTemplateMethodMaterial(client, methodMaterial) {
    return __awaiter(this, void 0, void 0, function () {
        var materialMakeMethodId, makeMethod, seededStorageUnitIds, makeMethodId, rest_1, _makeMethodId, rest;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    materialMakeMethodId = null;
                    if (!(methodMaterial.methodType === "Make to Order")) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("activeMakeMethods")
                            .select("id, version")
                            .eq("itemId", methodMaterial.itemId)
                            .single()];
                case 1:
                    makeMethod = _c.sent();
                    if (makeMethod.error)
                        return [2 /*return*/, makeMethod];
                    materialMakeMethodId = (_b = (_a = makeMethod.data) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
                    _c.label = 2;
                case 2:
                    if (!("createdBy" in methodMaterial)) return [3 /*break*/, 4];
                    return [4 /*yield*/, resolveTemplateMethodMaterialStorageUnitIds(client, {
                            itemId: methodMaterial.itemId,
                            current: methodMaterial.storageUnitIds
                        })];
                case 3:
                    seededStorageUnitIds = _c.sent();
                    makeMethodId = methodMaterial.makeMethodId, rest_1 = __rest(methodMaterial, ["makeMethodId"]);
                    return [2 /*return*/, client
                            .from("templateMethodMaterial")
                            .insert([
                            __assign(__assign({}, rest_1), { templateMakeMethodId: makeMethodId, itemId: methodMaterial.itemId, storageUnitIds: seededStorageUnitIds, materialMakeMethodId: materialMakeMethodId, scrapQuantity: 0 })
                        ])
                            .select("id")
                            .single()];
                case 4:
                    _makeMethodId = methodMaterial.makeMethodId, rest = __rest(methodMaterial, ["makeMethodId"]);
                    return [2 /*return*/, client
                            .from("templateMethodMaterial")
                            .update((0, supabase_1.sanitize)(__assign(__assign({}, rest), { materialMakeMethodId: materialMakeMethodId })))
                            .eq("id", methodMaterial.id)
                            .select("id")
                            .single()];
            }
        });
    });
}
function deleteTemplateMethodMaterial(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("templateMethodMaterial").delete().eq("id", id)];
        });
    });
}
function updateTemplateMaterialOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, order = _a.order, updatedBy = _a.updatedBy;
                return client
                    .from("templateMethodMaterial")
                    .update({ order: order, updatedBy: updatedBy })
                    .eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function upsertTemplateMethodOperation(client, methodOperation) {
    return __awaiter(this, void 0, void 0, function () {
        var toRow;
        return __generator(this, function (_a) {
            toRow = function (row) {
                var makeMethodId = row.makeMethodId, rest = __rest(row, ["makeMethodId"]);
                return __assign(__assign({}, rest), { templateMakeMethodId: makeMethodId });
            };
            if ("createdBy" in methodOperation && !("updatedBy" in methodOperation)) {
                return [2 /*return*/, client
                        .from("templateMethodOperation")
                        .insert([
                        toRow(__assign({}, methodOperation))
                    ])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("templateMethodOperation")
                    .update((0, supabase_1.sanitize)(toRow(__assign({}, methodOperation))))
                    .eq("id", methodOperation.id)
                    .select("id")
                    .single()];
        });
    });
}
function deleteTemplateMethodOperation(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("templateMethodOperation").delete().eq("id", id)];
        });
    });
}
function updateTemplateOperationOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, order = _a.order, updatedBy = _a.updatedBy;
                return client
                    .from("templateMethodOperation")
                    .update({ order: order, updatedBy: updatedBy })
                    .eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function assertTemplateMethodOperationIsDraft(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        var op, mm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("templateMethodOperation")
                        .select("templateMakeMethodId")
                        .eq("id", operationId)
                        .single()];
                case 1:
                    op = _a.sent();
                    if (op.error || !op.data) {
                        throw new Error("Failed to find template method operation");
                    }
                    return [4 /*yield*/, client
                            .from("templateMakeMethod")
                            .select("status")
                            .eq("id", op.data.templateMakeMethodId)
                            .single()];
                case 2:
                    mm = _a.sent();
                    if (mm.error || !mm.data) {
                        throw new Error("Failed to find template make method");
                    }
                    if (mm.data.status !== "Draft") {
                        throw new Error("Cannot modify steps on a method version with status \"".concat(mm.data.status, "\". Only Draft versions can be modified."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function upsertTemplateMethodOperationStep(client, methodOperationStep) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in methodOperationStep) {
                return [2 /*return*/, client
                        .from("templateMethodOperationStep")
                        .insert(methodOperationStep)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("templateMethodOperationStep")
                    .update((0, supabase_1.sanitize)(methodOperationStep))
                    .eq("id", methodOperationStep.id)
                    .select("id")
                    .single()];
        });
    });
}
function deleteTemplateMethodOperationStep(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("templateMethodOperationStep").delete().eq("id", id)];
        });
    });
}
function upsertTemplateMethodOperationParameter(client, methodOperationParameter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in methodOperationParameter) {
                return [2 /*return*/, client
                        .from("templateMethodOperationParameter")
                        .insert(methodOperationParameter)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("templateMethodOperationParameter")
                    .update((0, supabase_1.sanitize)(methodOperationParameter))
                    .eq("id", methodOperationParameter.id)
                    .select("id")
                    .single()];
        });
    });
}
function deleteTemplateMethodOperationParameter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("templateMethodOperationParameter").delete().eq("id", id)];
        });
    });
}
function upsertTemplateMethodOperationTool(client, methodOperationTool) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in methodOperationTool) {
                return [2 /*return*/, client
                        .from("templateMethodOperationTool")
                        .insert(methodOperationTool)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("templateMethodOperationTool")
                    .update((0, supabase_1.sanitize)(methodOperationTool))
                    .eq("id", methodOperationTool.id)
                    .select("id")
                    .single()];
        });
    });
}
function deleteTemplateMethodOperationTool(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("templateMethodOperationTool").delete().eq("id", id)];
        });
    });
}
function updateTemplateMethodOperationStepOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client
                    .from("templateMethodOperationStep")
                    .update({ sortOrder: sortOrder, updatedBy: updatedBy })
                    .eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function applyTemplateToItem(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var templateId, itemId, companyId, userId, _a, paramGroups, params, rules, templateMakeMethod, itemRow, groupIdMap, groupInsert_1, templateMakeMethodId, _b, materials, operations, itemMakeMethod, targetMakeMethodId, _loop_1, _i, _c, op;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    templateId = args.templateId, itemId = args.itemId, companyId = args.companyId, userId = args.userId;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("templateConfigurationParameterGroup")
                                .select("*")
                                .eq("templateId", templateId)
                                .eq("companyId", companyId),
                            client
                                .from("templateConfigurationParameter")
                                .select("*")
                                .eq("templateId", templateId)
                                .eq("companyId", companyId),
                            client
                                .from("templateConfigurationRule")
                                .select("*")
                                .eq("templateId", templateId)
                                .eq("companyId", companyId),
                            client
                                .from("templateMakeMethod")
                                .select("id")
                                .eq("templateId", templateId)
                                .eq("companyId", companyId)
                                .single(),
                            client.from("item").select("readableId").eq("id", itemId).single()
                        ])];
                case 1:
                    _a = _h.sent(), paramGroups = _a[0], params = _a[1], rules = _a[2], templateMakeMethod = _a[3], itemRow = _a[4];
                    if (!((_d = itemRow.data) === null || _d === void 0 ? void 0 : _d.readableId)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("part")
                            .update({ templateId: templateId })
                            .eq("id", itemRow.data.readableId)
                            .eq("companyId", companyId)];
                case 2:
                    _h.sent();
                    _h.label = 3;
                case 3:
                    groupIdMap = {};
                    if (!(paramGroups.data && paramGroups.data.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("configurationParameterGroup")
                            .insert(paramGroups.data.map(function (_a) {
                            var _id = _a.id, _tid = _a.templateId, group = __rest(_a, ["id", "templateId"]);
                            return (__assign(__assign({}, group), { itemId: itemId }));
                        }))
                            .select("id")];
                case 4:
                    groupInsert_1 = _h.sent();
                    if (!groupInsert_1.error && groupInsert_1.data) {
                        paramGroups.data.forEach(function (oldGroup, i) {
                            if (groupInsert_1.data[i]) {
                                groupIdMap[oldGroup.id] = groupInsert_1.data[i].id;
                            }
                        });
                    }
                    _h.label = 5;
                case 5:
                    if (!(params.data && params.data.length > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, client.from("configurationParameter").insert(params.data.map(function (_a) {
                            var _b;
                            var _id = _a.id, _tid = _a.templateId, templateConfigurationParameterGroupId = _a.templateConfigurationParameterGroupId, param = __rest(_a, ["id", "templateId", "templateConfigurationParameterGroupId"]);
                            return (__assign(__assign({}, param), { itemId: itemId, configurationParameterGroupId: templateConfigurationParameterGroupId
                                    ? ((_b = groupIdMap[templateConfigurationParameterGroupId]) !== null && _b !== void 0 ? _b : null)
                                    : null }));
                        }))];
                case 6:
                    _h.sent();
                    // Auto-enable "configured for manufacturing" when template has config params
                    return [4 /*yield*/, client
                            .from("itemReplenishment")
                            .update({ requiresConfiguration: true })
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)];
                case 7:
                    // Auto-enable "configured for manufacturing" when template has config params
                    _h.sent();
                    _h.label = 8;
                case 8:
                    if (!(rules.data && rules.data.length > 0)) return [3 /*break*/, 10];
                    return [4 /*yield*/, client.from("configurationRule").insert(rules.data.map(function (_a) {
                            var _tid = _a.templateId, rule = __rest(_a, ["templateId"]);
                            return (__assign(__assign({}, rule), { itemId: itemId }));
                        }))];
                case 9:
                    _h.sent();
                    _h.label = 10;
                case 10:
                    // Copy make method operations and materials
                    if (!((_e = templateMakeMethod.data) === null || _e === void 0 ? void 0 : _e.id))
                        return [2 /*return*/];
                    templateMakeMethodId = templateMakeMethod.data.id;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("templateMethodMaterial")
                                .select("*")
                                .eq("templateMakeMethodId", templateMakeMethodId)
                                .order("order", { ascending: true }),
                            client
                                .from("templateMethodOperation")
                                .select("*, templateMethodOperationTool(*), templateMethodOperationParameter(*), templateMethodOperationStep(*)")
                                .eq("templateMakeMethodId", templateMakeMethodId)
                                .order("order", { ascending: true }),
                            client
                                .from("activeMakeMethods")
                                .select("id")
                                .eq("itemId", itemId)
                                .eq("companyId", companyId)
                                .single()
                        ])];
                case 11:
                    _b = _h.sent(), materials = _b[0], operations = _b[1], itemMakeMethod = _b[2];
                    if (!((_f = itemMakeMethod.data) === null || _f === void 0 ? void 0 : _f.id))
                        return [2 /*return*/];
                    targetMakeMethodId = itemMakeMethod.data.id;
                    if (!(materials.data && materials.data.length > 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, client.from("methodMaterial").insert(materials.data.map(function (_a) {
                            var _id = _a.id, _tmid = _a.templateMakeMethodId, _pq = _a.productionQuantity, material = __rest(_a, ["id", "templateMakeMethodId", "productionQuantity"]);
                            return (__assign(__assign({}, material), { makeMethodId: targetMakeMethodId, methodOperationId: null, createdBy: userId }));
                        }))];
                case 12:
                    _h.sent();
                    _h.label = 13;
                case 13:
                    if (!operations.data || operations.data.length === 0)
                        return [2 /*return*/];
                    _loop_1 = function (op) {
                        var _id, _tmid, templateMethodOperationTool, templateMethodOperationParameter, templateMethodOperationStep, operationFields, newOperation, newOperationId;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    _id = op.id, _tmid = op.templateMakeMethodId, templateMethodOperationTool = op.templateMethodOperationTool, templateMethodOperationParameter = op.templateMethodOperationParameter, templateMethodOperationStep = op.templateMethodOperationStep, operationFields = __rest(op, ["id", "templateMakeMethodId", "templateMethodOperationTool", "templateMethodOperationParameter", "templateMethodOperationStep"]);
                                    return [4 /*yield*/, client
                                            .from("methodOperation")
                                            .insert(__assign(__assign({}, operationFields), { makeMethodId: targetMakeMethodId, createdBy: userId }))
                                            .select("id")
                                            .single()];
                                case 1:
                                    newOperation = _j.sent();
                                    if (newOperation.error || !((_g = newOperation.data) === null || _g === void 0 ? void 0 : _g.id))
                                        return [2 /*return*/, "continue"];
                                    newOperationId = newOperation.data.id;
                                    if (!(Array.isArray(templateMethodOperationTool) &&
                                        templateMethodOperationTool.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, client.from("methodOperationTool").insert(templateMethodOperationTool.map(function (_a) {
                                            var _id = _a.id, _opId = _a.operationId, _ua = _a.updatedAt, tool = __rest(_a, ["id", "operationId", "updatedAt"]);
                                            return (__assign(__assign({}, tool), { operationId: newOperationId, companyId: companyId, createdBy: userId }));
                                        }))];
                                case 2:
                                    _j.sent();
                                    _j.label = 3;
                                case 3:
                                    if (!(Array.isArray(templateMethodOperationParameter) &&
                                        templateMethodOperationParameter.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, client.from("methodOperationParameter").insert(templateMethodOperationParameter.map(function (_a) {
                                            var _id = _a.id, _opId = _a.operationId, param = __rest(_a, ["id", "operationId"]);
                                            return (__assign(__assign({}, param), { operationId: newOperationId, companyId: companyId, createdBy: userId }));
                                        }))];
                                case 4:
                                    _j.sent();
                                    _j.label = 5;
                                case 5:
                                    if (!(Array.isArray(templateMethodOperationStep) &&
                                        templateMethodOperationStep.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, client.from("methodOperationStep").insert(templateMethodOperationStep.map(function (_a) {
                                            var _id = _a.id, _opId = _a.operationId, step = __rest(_a, ["id", "operationId"]);
                                            return (__assign(__assign({}, step), { operationId: newOperationId, companyId: companyId, createdBy: userId }));
                                        }))];
                                case 6:
                                    _j.sent();
                                    _j.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _c = operations.data;
                    _h.label = 14;
                case 14:
                    if (!(_i < _c.length)) return [3 /*break*/, 17];
                    op = _c[_i];
                    return [5 /*yield**/, _loop_1(op)];
                case 15:
                    _h.sent();
                    _h.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function mapTemplateMethodOperationForBillOfProcess(op) {
    var templateMakeMethodId = op.templateMakeMethodId, templateMethodOperationTool = op.templateMethodOperationTool, templateMethodOperationParameter = op.templateMethodOperationParameter, templateMethodOperationStep = op.templateMethodOperationStep, rest = __rest(op, ["templateMakeMethodId", "templateMethodOperationTool", "templateMethodOperationParameter", "templateMethodOperationStep"]);
    return __assign(__assign({}, rest), { makeMethodId: templateMakeMethodId, methodOperationTool: templateMethodOperationTool !== null && templateMethodOperationTool !== void 0 ? templateMethodOperationTool : [], methodOperationParameter: templateMethodOperationParameter !== null && templateMethodOperationParameter !== void 0 ? templateMethodOperationParameter : [], methodOperationStep: templateMethodOperationStep !== null && templateMethodOperationStep !== void 0 ? templateMethodOperationStep : [] });
}
