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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = TemplateDetailsRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var items_1 = require("~/modules/items");
var Item_1 = require("~/modules/items/ui/Item");
var Parts_1 = require("~/modules/items/ui/Parts");
var shared_1 = require("~/modules/shared");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, templateId, url, requestedMethodId, makeMethods, makeMethod, fullMethod, _d, methodMaterials, methodOperations, tags, configParams, configRules, materialItemIds, materialItems, _e, materialItemById, configurationRulesForUi, methodOperationsForUi;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts",
                        bypassRls: true
                    })];
                case 1:
                    _c = _w.sent(), client = _c.client, companyId = _c.companyId;
                    templateId = params.templateId;
                    if (!templateId)
                        throw new Error("Could not find templateId");
                    url = new URL(request.url);
                    requestedMethodId = url.searchParams.get("methodId");
                    return [4 /*yield*/, (0, items_1.getTemplateMakeMethods)(client, templateId, companyId)];
                case 2:
                    makeMethods = _w.sent();
                    makeMethod = requestedMethodId
                        ? ((_j = (_g = (_f = makeMethods.data) === null || _f === void 0 ? void 0 : _f.find(function (m) { return m.id === requestedMethodId; })) !== null && _g !== void 0 ? _g : (_h = makeMethods.data) === null || _h === void 0 ? void 0 : _h.find(function (m) { return m.status === "Draft"; })) !== null && _j !== void 0 ? _j : (_k = makeMethods.data) === null || _k === void 0 ? void 0 : _k[0])
                        : ((_m = (_l = makeMethods.data) === null || _l === void 0 ? void 0 : _l.find(function (m) { return m.status === "Draft"; })) !== null && _m !== void 0 ? _m : (_o = makeMethods.data) === null || _o === void 0 ? void 0 : _o[0]);
                    if (!makeMethod) {
                        return [2 /*return*/, {
                                methodData: null,
                                tags: []
                            }];
                    }
                    return [4 /*yield*/, (0, items_1.getTemplateMakeMethodById)(client, makeMethod.id, companyId)];
                case 3:
                    fullMethod = _w.sent();
                    if (fullMethod.error || !fullMethod.data) {
                        return [2 /*return*/, { methodData: null, tags: [] }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, items_1.getTemplateMethodMaterialsByMakeMethod)(client, fullMethod.data.id),
                            (0, items_1.getTemplateMethodOperationsByMakeMethodId)(client, fullMethod.data.id),
                            (0, shared_1.getTagsList)(client, companyId, "operation"),
                            (0, items_1.getTemplateConfigurationParameters)(client, templateId, companyId),
                            (0, items_1.getTemplateConfigurationRules)(client, templateId, companyId)
                        ])];
                case 4:
                    _d = _w.sent(), methodMaterials = _d[0], methodOperations = _d[1], tags = _d[2], configParams = _d[3], configRules = _d[4];
                    materialItemIds = Array.from(new Set(((_p = methodMaterials.data) !== null && _p !== void 0 ? _p : []).map(function (m) { return m.itemId; }).filter(Boolean)));
                    if (!(materialItemIds.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id, name, itemTrackingType, replenishmentSystem")
                            .in("id", materialItemIds)];
                case 5:
                    _e = _w.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _e = {
                        data: []
                    };
                    _w.label = 7;
                case 7:
                    materialItems = _e;
                    materialItemById = new Map(((_q = materialItems.data) !== null && _q !== void 0 ? _q : []).map(function (item) { return [item.id, item]; }));
                    configurationRulesForUi = configRules.map(function (r) { return (__assign(__assign({}, r), { itemId: templateId })); });
                    methodOperationsForUi = (_s = (_r = methodOperations.data) === null || _r === void 0 ? void 0 : _r.map(function (operation) {
                        var _a, _b, _c;
                        var mapped = (0, items_1.mapTemplateMethodOperationForBillOfProcess)(operation);
                        return __assign(__assign({}, mapped), { workCenterId: (_a = mapped.workCenterId) !== null && _a !== void 0 ? _a : undefined, operationSupplierProcessId: (_b = mapped.operationSupplierProcessId) !== null && _b !== void 0 ? _b : undefined, workInstruction: mapped.workInstruction, tags: ((_c = mapped.tags) !== null && _c !== void 0 ? _c : []) });
                    })) !== null && _s !== void 0 ? _s : [];
                    return [2 /*return*/, {
                            methodData: {
                                makeMethod: fullMethod.data,
                                methodMaterials: ((_u = (_t = methodMaterials.data) === null || _t === void 0 ? void 0 : _t.map(function (m) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                    return (__assign(__assign({}, m), { makeMethodId: m.templateMakeMethodId, description: (_b = (_a = materialItemById.get(m.itemId)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", methodType: m.methodType, itemType: m.itemType, storageUnitIds: ((_c = m.storageUnitIds) !== null && _c !== void 0 ? _c : {}), methodOperationId: (_d = m.methodOperationId) !== null && _d !== void 0 ? _d : undefined, item: {
                                            name: (_f = (_e = materialItemById.get(m.itemId)) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : "",
                                            itemTrackingType: (_h = (_g = materialItemById.get(m.itemId)) === null || _g === void 0 ? void 0 : _g.itemTrackingType) !== null && _h !== void 0 ? _h : "Inventory",
                                            replenishmentSystem: (_k = (_j = materialItemById.get(m.itemId)) === null || _j === void 0 ? void 0 : _j.replenishmentSystem) !== null && _k !== void 0 ? _k : null
                                        } }));
                                })) !== null && _u !== void 0 ? _u : []),
                                methodOperations: methodOperationsForUi,
                                configurationParametersAndGroups: {
                                    groups: configParams.groups,
                                    parameters: (0, items_1.mapTemplateConfigurationParametersForForm)(configParams.parameters)
                                },
                                configurationRules: configurationRulesForUi
                            },
                            tags: (_v = tags.data) !== null && _v !== void 0 ? _v : []
                        }];
            }
        });
    });
}
function TemplateDetailsRoute() {
    var _a, _b, _c;
    var templateId = (0, react_router_1.useParams)().templateId;
    if (!templateId)
        throw new Error("Could not find templateId");
    var _d = (0, react_router_1.useLoaderData)(), methodData = _d.methodData, tags = _d.tags;
    if (!methodData) {
        return null;
    }
    var bindings = (0, items_1.templateConfigurationParametersBindings)(templateId);
    var methodBindings = (0, items_1.templateMethodBindings)();
    var configurationRuleBindings = (0, items_1.templateConfigurationRuleBindings)(templateId);
    return (<react_1.VStack spacing={2} className="p-2">
      <Parts_1.ConfigurationParametersForm key={"options:".concat(templateId)} bindings={bindings} parameters={methodData.configurationParametersAndGroups.parameters} groups={methodData.configurationParametersAndGroups.groups}/>
      <Item_1.BillOfMaterial key={"bom:".concat(templateId)} methodBindings={methodBindings} makeMethod={methodData.makeMethod} materials={(_a = methodData.methodMaterials) !== null && _a !== void 0 ? _a : []} operations={methodData.methodOperations} configurable configurationRules={methodData.configurationRules} parameters={methodData.configurationParametersAndGroups.parameters} configurationRuleBindings={configurationRuleBindings}/>
      <Item_1.BillOfProcess key={"bop:".concat(templateId)} methodBindings={methodBindings} makeMethod={methodData.makeMethod} operations={(_b = methodData.methodOperations) !== null && _b !== void 0 ? _b : []} configurable materials={(_c = methodData.methodMaterials) !== null && _c !== void 0 ? _c : []} configurationRules={methodData.configurationRules} parameters={methodData.configurationParametersAndGroups.parameters} tags={tags} configurationRuleBindings={configurationRuleBindings}/>
    </react_1.VStack>);
}
