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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMethodTree = getMethodTree;
exports.getMethodTreeArray = getMethodTreeArray;
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var mod_ts_1 = require("https://deno.land/x/nanoid@v3.0.0/mod.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var date_1 = require("npm:@internationalized/date");
var headers_ts_1 = require("../lib/headers.ts");
var methods_ts_1 = require("../lib/methods.ts");
var sandbox_ee_ts_1 = require("../lib/sandbox.ee.ts");
var storage_units_ts_1 = require("../lib/storage-units.ts");
var tiptap_ts_1 = require("../shared/tiptap.ts");
var get_next_sequence_ts_1 = require("../shared/get-next-sequence.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var partsValidator = npm_zod__3_24_1_1.z.object({
    billOfMaterial: npm_zod__3_24_1_1.z.boolean().default(true),
    billOfProcess: npm_zod__3_24_1_1.z.boolean().default(true),
    parameters: npm_zod__3_24_1_1.z.boolean().default(true),
    tools: npm_zod__3_24_1_1.z.boolean().default(true),
    steps: npm_zod__3_24_1_1.z.boolean().default(true),
    workInstructions: npm_zod__3_24_1_1.z.boolean().default(true),
}).default({});
var payloadValidator = npm_zod__3_24_1_1.z.object({
    type: npm_zod__3_24_1_1.z.enum([
        "itemToItem",
        "itemToJob",
        "itemToJobMakeMethod",
        "itemToQuoteLine",
        "itemToQuoteMakeMethod",
        "jobMakeMethodToItem",
        "jobToItem",
        "makeMethodToMakeMethod",
        "procedureToOperation",
        "quoteLineToItem",
        "quoteLineToJob",
        "quoteLineToQuoteLine",
        "quoteMakeMethodToItem",
        "quoteToQuote",
    ]),
    sourceId: npm_zod__3_24_1_1.z.string(),
    targetId: npm_zod__3_24_1_1.z.string(),
    companyId: npm_zod__3_24_1_1.z.string(),
    userId: npm_zod__3_24_1_1.z.string(),
    configuration: npm_zod__3_24_1_1.z.record(npm_zod__3_24_1_1.z.unknown()).optional(),
    parts: partsValidator,
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, _a, type, sourceId, targetId, companyId_1, userId_1, configuration_1, parts_1, client_1, _b, _c, sourceMakeMethod, targetMakeMethod_1, targetItemReplenishment, _d, sourceMaterials_1, sourceOperations_1, jobId_1, itemId_1, isConfigured_1, _e, makeMethod_1, jobMakeMethod_1, workCenters, supplierProcesses, job_1, hydratedConfiguration_1, _f, methodTrees, configurationRules, methodTree_1, getLaborAndOverheadRates_1, getOutsideOperationRates_1, configurationCodeByField_1, jobMakeMethodId_1, itemId_2, isConfigured, _g, makeMethod_2, jobMakeMethod_2, workCenters, supplierProcesses, hydratedConfiguration, parentEstimatedQuantity_1, parentMaterial, rootJob, _h, job_2, methodTrees, configurationRules, methodTree_2, getLaborAndOverheadRates_2, getOutsideOperationRates_2, configurationCodeByField, _j, quoteId_1, quoteLineId_1, itemId_3, isConfigured_2, _k, makeMethod_3, quoteMakeMethod_1, workCenters, supplierProcesses, configurationRules, quote, configurationCodeByField_2, quoteLocationId_1, inserted, hydratedConfiguration_2, methodTrees, methodTree_3, getLaborAndOverheadRates_3, getOutsideOperationRates_3, quoteMakeMethodId_1, itemId_4, isConfigured, _l, makeMethod_4, quoteMakeMethod_2, workCenters, supplierProcesses, hydratedConfiguration_3, _m, methodTrees, configurationRules, methodTree_4, getLaborAndOverheadRates_4, getOutsideOperationRates_4, configurationCodeByField_3, jobMakeMethodId, makeMethodId, _o, makeMethod_5, jobMakeMethod_3, itemId_5, _p, job_3, jobOperations_1, itemReplenishment, jobMethodTrees, jobMethodTree_1, madeItemIds_1, makeMethods, makeMethodByItemId_1, jobId, makeMethodId, _q, makeMethod_6, jobMakeMethod_4, jobOperations_2, job_4, itemId_6, _r, jobMethodTrees, itemReplenishment, jobMethodTree_2, madeItemIds_2, makeMethods, makeMethodByItemId_2, _s, sourceMakeMethod, targetMakeMethod_2, _t, sourceMaterials_2, sourceOperations_2, procedureId_1, operationId_1, _u, procedure_1, operation, existingSteps_1, _v, quoteId, quoteLineId, makeMethodId, _w, makeMethod_7, quoteMakeMethod_3, quoteOperations_1, itemId_7, _x, quote_1, quoteMethodTrees, itemReplenishment, quoteMethodTree_1, madeItemIds_3, makeMethods, makeMethodByItemId_3, quoteMakeMethodId, makeMethodId, _y, makeMethod_8, quoteMakeMethod_4, itemId_8, _z, quoteOperations_2, itemReplenishment, quoteMethodTrees, quoteMethodTree_2, madeItemIds_4, makeMethods, makeMethodByItemId_4, jobId_2, _0, quoteId, quoteLineId, _1, job_5, jobMakeMethod_5, quoteMakeMethod_5, quoteMaterials, quoteOperations_3, quoteMethodTrees, quoteMethodTree_3, quoteMaterialIdToJobMaterialId_1, quoteMakeMethodIdToJobMakeMethodId_1, quoteMakeMethodIdToQuantities_1, _2, sourceQuoteLineId, _3, targetQuoteId_1, targetQuoteLineId_1, _4, targetQuoteMakeMethod_1, sourceQuoteMakeMethod_1, sourceQuoteMaterials, sourceQuoteOperations_1, quoteMethodTrees, quoteMethodTree_4, quoteMaterialIdToQuoteMaterialId_1, quoteMakeMethodIdToQuoteMakeMethodId_1, sourceQuoteId, asRevision_1, newQuoteId_1, oldLineToNewLineMap_1, _5, sourceQuote_1, sourceQuotePayment_1, sourceQuoteShipment_1, sourceQuoteLines_1, sourceQuoteLinePricing_1, err_1;
    var _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41;
    return __generator(this, function (_42) {
        switch (_42.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _42.sent();
                _42.label = 2;
            case 2:
                _42.trys.push([2, 81, , 82]);
                _a = payloadValidator.parse(payload), type = _a.type, sourceId = _a.sourceId, targetId = _a.targetId, companyId_1 = _a.companyId, userId_1 = _a.userId, configuration_1 = _a.configuration, parts_1 = _a.parts;
                console.log({
                    function: "get-method",
                    type: type,
                    sourceId: sourceId,
                    targetId: targetId,
                    companyId: companyId_1,
                    userId: userId_1,
                    parts: parts_1,
                    configuration: configuration_1,
                });
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { update: "production" })];
            case 3:
                client_1 = _42.sent();
                _b = type;
                switch (_b) {
                    case "itemToItem": return [3 /*break*/, 4];
                    case "itemToJob": return [3 /*break*/, 8];
                    case "itemToJobMakeMethod": return [3 /*break*/, 13];
                    case "itemToQuoteLine": return [3 /*break*/, 22];
                    case "itemToQuoteMakeMethod": return [3 /*break*/, 30];
                    case "jobMakeMethodToItem": return [3 /*break*/, 35];
                    case "jobToItem": return [3 /*break*/, 41];
                    case "makeMethodToMakeMethod": return [3 /*break*/, 46];
                    case "procedureToOperation": return [3 /*break*/, 50];
                    case "quoteLineToItem": return [3 /*break*/, 53];
                    case "quoteMakeMethodToItem": return [3 /*break*/, 59];
                    case "quoteLineToJob": return [3 /*break*/, 65];
                    case "quoteLineToQuoteLine": return [3 /*break*/, 69];
                    case "quoteToQuote": return [3 /*break*/, 74];
                }
                return [3 /*break*/, 79];
            case 4: return [4 /*yield*/, Promise.all([
                    client_1
                        .from("activeMakeMethods")
                        .select("*")
                        .eq("itemId", sourceId)
                        .eq("companyId", companyId_1)
                        .single(),
                    client_1
                        .from("activeMakeMethods")
                        .select("*")
                        .eq("itemId", targetId)
                        .eq("companyId", companyId_1)
                        .single(),
                    client_1
                        .from("itemReplenishment")
                        .select("*")
                        .eq("itemId", targetId)
                        .eq("companyId", companyId_1)
                        .single(),
                ])];
            case 5:
                _c = _42.sent(), sourceMakeMethod = _c[0], targetMakeMethod_1 = _c[1], targetItemReplenishment = _c[2];
                if (sourceMakeMethod.error || targetMakeMethod_1.error) {
                    throw new Error("Failed to get make methods");
                }
                if (targetItemReplenishment.error) {
                    throw new Error("Failed to get target item replenishment");
                }
                if ((_6 = targetItemReplenishment.data) === null || _6 === void 0 ? void 0 : _6.requiresConfiguration) {
                    throw new Error("Cannot override method of configured item");
                }
                if (sourceMakeMethod.data.id === null ||
                    targetMakeMethod_1.data.id === null) {
                    throw new Error("Failed to get make methods");
                }
                return [4 /*yield*/, Promise.all([
                        parts_1.billOfMaterial
                            ? client_1
                                .from("methodMaterial")
                                .select("*")
                                .eq("makeMethodId", sourceMakeMethod.data.id)
                                .eq("companyId", companyId_1)
                            : Promise.resolve({ data: [], error: null }),
                        parts_1.billOfProcess
                            ? client_1
                                .from("methodOperation")
                                .select("*, methodOperationTool(*), methodOperationParameter(*), methodOperationStep(*)")
                                .eq("makeMethodId", sourceMakeMethod.data.id)
                                .eq("companyId", companyId_1)
                            : Promise.resolve({ data: [], error: null }),
                    ])];
            case 6:
                _d = _42.sent(), sourceMaterials_1 = _d[0], sourceOperations_1 = _d[1];
                if (sourceMaterials_1.error || sourceOperations_1.error) {
                    throw new Error("Failed to get source materials or operations");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var operationIds, _loop_1, _a, _b, _c, e_1_1;
                        var _d, e_1, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0: 
                                // Delete existing materials and operations from target method
                                return [4 /*yield*/, Promise.all([
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("methodMaterial")
                                                .where("makeMethodId", "=", targetMakeMethod_1.data.id)
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfProcess
                                            ? trx
                                                .deleteFrom("methodOperation")
                                                .where("makeMethodId", "=", targetMakeMethod_1.data.id)
                                                .execute()
                                            : Promise.resolve(),
                                    ])];
                                case 1:
                                    // Delete existing materials and operations from target method
                                    _g.sent();
                                    if (!(parts_1.billOfMaterial && sourceMaterials_1.data && sourceMaterials_1.data.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodMaterial")
                                            .values(sourceMaterials_1.data.map(function (material) { return (__assign(__assign({}, material), { productionQuantity: undefined, id: undefined, makeMethodId: targetMakeMethod_1.data.id, createdBy: userId_1 })); }))
                                            .execute()];
                                case 2:
                                    _g.sent();
                                    _g.label = 3;
                                case 3:
                                    if (!(parts_1.billOfProcess && sourceOperations_1.data && sourceOperations_1.data.length > 0)) return [3 /*break*/, 17];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperation")
                                            .values(sourceOperations_1.data.map(function (_a) {
                                            var _tools = _a.methodOperationTool, _parameters = _a.methodOperationParameter, _attributes = _a.methodOperationStep, operation = __rest(_a, ["methodOperationTool", "methodOperationParameter", "methodOperationStep"]);
                                            var insert = __assign(__assign({}, operation), { id: undefined, makeMethodId: targetMakeMethod_1.data.id, createdBy: userId_1 });
                                            if (!parts_1.workInstructions) {
                                                insert.workInstruction = {};
                                            }
                                            return insert;
                                        }))
                                            .returning(["id"])
                                            .execute()];
                                case 4:
                                    operationIds = _g.sent();
                                    _g.label = 5;
                                case 5:
                                    _g.trys.push([5, 11, 12, 17]);
                                    _loop_1 = function () {
                                        var index, operation, methodOperationTool, methodOperationParameter, methodOperationStep, procedureId, operationId;
                                        return __generator(this, function (_h) {
                                            switch (_h.label) {
                                                case 0:
                                                    _f = _c.value;
                                                    _a = false;
                                                    index = _f[0], operation = _f[1];
                                                    methodOperationTool = operation.methodOperationTool, methodOperationParameter = operation.methodOperationParameter, methodOperationStep = operation.methodOperationStep, procedureId = operation.procedureId;
                                                    operationId = operationIds[index].id;
                                                    if (!(parts_1.tools &&
                                                        operationId &&
                                                        Array.isArray(methodOperationTool) &&
                                                        methodOperationTool.length > 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationTool")
                                                            .values(methodOperationTool.map(function (tool) { return ({
                                                            toolId: tool.toolId,
                                                            quantity: tool.quantity,
                                                            operationId: operationId,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 1:
                                                    _h.sent();
                                                    _h.label = 2;
                                                case 2:
                                                    if (!!procedureId) return [3 /*break*/, 6];
                                                    if (!(parts_1.parameters &&
                                                        Array.isArray(methodOperationParameter) &&
                                                        methodOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationParameter")
                                                            .values(methodOperationParameter.map(function (param) { return ({
                                                            operationId: operationId,
                                                            key: param.key,
                                                            value: param.value,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 3:
                                                    _h.sent();
                                                    _h.label = 4;
                                                case 4:
                                                    if (!(parts_1.steps &&
                                                        Array.isArray(methodOperationStep) &&
                                                        methodOperationStep.length > 0)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationStep")
                                                            .values(methodOperationStep.map(function (_a) {
                                                            var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                            return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                        }))
                                                            .execute()];
                                                case 5:
                                                    _h.sent();
                                                    _h.label = 6;
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a = true, _b = __asyncValues(sourceOperations_1.data.entries());
                                    _g.label = 6;
                                case 6: return [4 /*yield*/, _b.next()];
                                case 7:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 10];
                                    return [5 /*yield**/, _loop_1()];
                                case 8:
                                    _g.sent();
                                    _g.label = 9;
                                case 9:
                                    _a = true;
                                    return [3 /*break*/, 6];
                                case 10: return [3 /*break*/, 17];
                                case 11:
                                    e_1_1 = _g.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 17];
                                case 12:
                                    _g.trys.push([12, , 15, 16]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 14];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 13:
                                    _g.sent();
                                    _g.label = 14;
                                case 14: return [3 /*break*/, 16];
                                case 15:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 16: return [7 /*endfinally*/];
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 7:
                _42.sent();
                return [3 /*break*/, 80];
            case 8:
                jobId_1 = targetId;
                if (!jobId_1) {
                    throw new Error("Invalid targetId");
                }
                itemId_1 = sourceId;
                isConfigured_1 = !!configuration_1;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("activeMakeMethods")
                            .select("*")
                            .eq("itemId", itemId_1)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("jobMakeMethod")
                            .select("*")
                            .eq("jobId", jobId_1)
                            .is("parentMaterialId", null)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1.from("workCenters").select("*").eq("companyId", companyId_1),
                        client_1
                            .from("supplierProcess")
                            .select("*")
                            .eq("companyId", companyId_1),
                        client_1
                            .from("job")
                            .select("locationId, quantity")
                            .eq("id", jobId_1)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 9:
                _e = _42.sent(), makeMethod_1 = _e[0], jobMakeMethod_1 = _e[1], workCenters = _e[2], supplierProcesses = _e[3], job_1 = _e[4];
                if (makeMethod_1.error) {
                    throw new Error("Failed to get make method");
                }
                if (jobMakeMethod_1.error) {
                    throw new Error("Failed to get job make method");
                }
                if (workCenters.error) {
                    throw new Error("Failed to get related work centers");
                }
                if (job_1.error) {
                    throw new Error("Failed to get job");
                }
                return [4 /*yield*/, hydrateConfiguration(client_1, configuration_1, itemId_1, companyId_1)];
            case 10:
                hydratedConfiguration_1 = _42.sent();
                return [4 /*yield*/, Promise.all([
                        getMethodTree(client_1, makeMethod_1.data.id),
                        isConfigured_1
                            ? client_1
                                .from("configurationRule")
                                .select("*")
                                .eq("itemId", itemId_1)
                                .eq("companyId", companyId_1)
                            : Promise.resolve({ data: [] }),
                    ])];
            case 11:
                _f = _42.sent(), methodTrees = _f[0], configurationRules = _f[1];
                if (methodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                methodTree_1 = (_7 = methodTrees.data) === null || _7 === void 0 ? void 0 : _7[0];
                if (!methodTree_1)
                    throw new Error("Method tree not found");
                getLaborAndOverheadRates_1 = (0, methods_ts_1.getRatesFromWorkCenters)(workCenters === null || workCenters === void 0 ? void 0 : workCenters.data);
                getOutsideOperationRates_1 = (0, methods_ts_1.getRatesFromSupplierProcesses)(supplierProcesses === null || supplierProcesses === void 0 ? void 0 : supplierProcesses.data);
                configurationCodeByField_1 = (_8 = configurationRules.data) === null || _8 === void 0 ? void 0 : _8.reduce(function (acc, rule) {
                    acc[rule.field] = rule.code;
                    return acc;
                }, {});
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        function getConfiguredValue(_a) {
                            return __awaiter(this, arguments, void 0, function (_b) {
                                var fieldKey, mod, result, err_2;
                                var id = _b.id, field = _b.field, defaultValue = _b.defaultValue;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!configurationCodeByField_1)
                                                return [2 /*return*/, defaultValue];
                                            fieldKey = getFieldKey(field, id);
                                            if (!(configurationCodeByField_1 === null || configurationCodeByField_1 === void 0 ? void 0 : configurationCodeByField_1[fieldKey])) return [3 /*break*/, 5];
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 4, , 5]);
                                            return [4 /*yield*/, (0, sandbox_ee_ts_1.importTypeScript)(configurationCodeByField_1[fieldKey])];
                                        case 2:
                                            mod = _c.sent();
                                            return [4 /*yield*/, mod.configure(hydratedConfiguration_1)];
                                        case 3:
                                            result = _c.sent();
                                            return [2 /*return*/, (result !== null && result !== void 0 ? result : defaultValue)];
                                        case 4:
                                            err_2 = _c.sent();
                                            console.error(err_2);
                                            return [2 /*return*/, defaultValue];
                                        case 5: return [2 /*return*/, defaultValue];
                                    }
                                });
                            });
                        }
                        // traverse method tree and create:
                        // - jobMakeMethod
                        // - jobMakeMethodOperation
                        // - jobMakeMethodMaterial
                        function traverseMethod(node, parentJobMakeMethodId, parentEstimatedQuantity) {
                            return __awaiter(this, void 0, void 0, function () {
                                var targetQuantity, nodeItemReplenishment, nodeScrapPercentage, nodeScrapQuantity, totalWithScrap, estimatedQuantity, operationQuantity, totalQuantityForChildren, nodeLevelConfigurationKey, methodOperationsToJobOperations, relatedOperations, jobOperationsInserts_1, _a, _b, _c, op, _d, processId, procedureId, workCenterId, description, setupTime, setupUnit, laborTime, laborUnit, machineTime, machineUnit, operationOrder, operationType, e_2_1, bopConfigurationKey, bopConfiguration, mod, operationIds_1, _loop_2, _i, _e, _f, index, operation, locationId_1, mapMethodMaterialToJobMaterial, jobMaterialResults, validJobMaterialIndices, materialsWithConfiguredFields_1, configuredChildren, bomConfigurationKey, bomConfiguration, mod, madeMaterials, pickedOrBoughtMaterials, madeChildren, madeMaterialsWithIds, _g, _h, _j, index, child, materialId, newMakeMethodId, updateResult, material, childTotalForCascade;
                                var _this = this;
                                var _k, e_2, _l, _m;
                                var _o, _p, _q, _r, _s, _t, _u, _v, _w;
                                return __generator(this, function (_x) {
                                    switch (_x.label) {
                                        case 0:
                                            console.log("[traverseMethod]", {
                                                isRoot: node.data.isRoot,
                                                itemId: node.data.itemId,
                                                methodType: node.data.methodType,
                                                materialMakeMethodId: node.data.materialMakeMethodId,
                                                childCount: node.children.length,
                                                childMethodTypes: node.children.map(function (c) { return ({
                                                    itemId: c.data.itemId,
                                                    methodType: c.data.methodType,
                                                }); }),
                                                parentJobMakeMethodId: parentJobMakeMethodId,
                                            });
                                            targetQuantity = node.data.isRoot
                                                ? parentEstimatedQuantity
                                                : parentEstimatedQuantity * ((_o = node.data.quantity) !== null && _o !== void 0 ? _o : 1);
                                            return [4 /*yield*/, trx
                                                    .selectFrom("itemReplenishment")
                                                    .select("scrapPercentage")
                                                    .where("itemId", "=", node.data.itemId)
                                                    .executeTakeFirst()];
                                        case 1:
                                            nodeItemReplenishment = _x.sent();
                                            nodeScrapPercentage = Number((_p = nodeItemReplenishment === null || nodeItemReplenishment === void 0 ? void 0 : nodeItemReplenishment.scrapPercentage) !== null && _p !== void 0 ? _p : 0);
                                            nodeScrapQuantity = targetQuantity * nodeScrapPercentage;
                                            totalWithScrap = Math.ceil(targetQuantity + nodeScrapQuantity);
                                            estimatedQuantity = node.data.methodType === "Make to Order" ? targetQuantity : totalWithScrap;
                                            operationQuantity = totalWithScrap;
                                            totalQuantityForChildren = totalWithScrap;
                                            nodeLevelConfigurationKey = "".concat(node.data.materialMakeMethodId, ":").concat(node.data.isRoot ? "undefined" : node.data.methodMaterialId);
                                            methodOperationsToJobOperations = {};
                                            if (!(!node.data.isRoot || parts_1.billOfProcess)) return [3 /*break*/, 24];
                                            return [4 /*yield*/, client_1
                                                    .from("methodOperation")
                                                    .select("*, methodOperationTool(*), methodOperationParameter(*), methodOperationStep(*)")
                                                    .eq("makeMethodId", node.data.materialMakeMethodId)];
                                        case 2:
                                            relatedOperations = _x.sent();
                                            jobOperationsInserts_1 = [];
                                            _x.label = 3;
                                        case 3:
                                            _x.trys.push([3, 9, 10, 15]);
                                            _a = true, _b = __asyncValues((_q = relatedOperations === null || relatedOperations === void 0 ? void 0 : relatedOperations.data) !== null && _q !== void 0 ? _q : []);
                                            _x.label = 4;
                                        case 4: return [4 /*yield*/, _b.next()];
                                        case 5:
                                            if (!(_c = _x.sent(), _k = _c.done, !_k)) return [3 /*break*/, 8];
                                            _m = _c.value;
                                            _a = false;
                                            op = _m;
                                            return [4 /*yield*/, Promise.all([
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "processId",
                                                        defaultValue: op.processId,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "procedureId",
                                                        defaultValue: op.procedureId,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "workCenterId",
                                                        defaultValue: op.workCenterId,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "description",
                                                        defaultValue: op.description,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "setupTime",
                                                        defaultValue: op.setupTime,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "setupUnit",
                                                        defaultValue: op.setupUnit,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "laborTime",
                                                        defaultValue: op.laborTime,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "laborUnit",
                                                        defaultValue: op.laborUnit,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "machineTime",
                                                        defaultValue: op.machineTime,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "machineUnit",
                                                        defaultValue: op.machineUnit,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "operationOrder",
                                                        defaultValue: op.operationOrder,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "operationType",
                                                        defaultValue: op.operationType,
                                                    }),
                                                ])];
                                        case 6:
                                            _d = _x.sent(), processId = _d[0], procedureId = _d[1], workCenterId = _d[2], description = _d[3], setupTime = _d[4], setupUnit = _d[5], laborTime = _d[6], laborUnit = _d[7], machineTime = _d[8], machineUnit = _d[9], operationOrder = _d[10], operationType = _d[11];
                                            if (processId === "")
                                                return [3 /*break*/, 7];
                                            jobOperationsInserts_1.push(__assign(__assign(__assign(__assign({ jobId: jobId_1, jobMakeMethodId: parentJobMakeMethodId, processId: processId, procedureId: procedureId, workCenterId: workCenterId, description: description, setupTime: setupTime, setupUnit: setupUnit, laborTime: laborTime, laborUnit: laborUnit, machineTime: machineTime, machineUnit: machineUnit }, getLaborAndOverheadRates_1(processId, op.workCenterId)), { order: op.order, operationOrder: operationOrder, operationType: operationType, operationSupplierProcessId: op.operationSupplierProcessId }), getOutsideOperationRates_1(processId, op.operationSupplierProcessId)), { workInstruction: (!node.data.isRoot || parts_1.workInstructions) ? op.workInstruction : {}, targetQuantity: targetQuantity, operationQuantity: operationQuantity, companyId: companyId_1, createdBy: userId_1, customFields: {} }));
                                            _x.label = 7;
                                        case 7:
                                            _a = true;
                                            return [3 /*break*/, 4];
                                        case 8: return [3 /*break*/, 15];
                                        case 9:
                                            e_2_1 = _x.sent();
                                            e_2 = { error: e_2_1 };
                                            return [3 /*break*/, 15];
                                        case 10:
                                            _x.trys.push([10, , 13, 14]);
                                            if (!(!_a && !_k && (_l = _b.return))) return [3 /*break*/, 12];
                                            return [4 /*yield*/, _l.call(_b)];
                                        case 11:
                                            _x.sent();
                                            _x.label = 12;
                                        case 12: return [3 /*break*/, 14];
                                        case 13:
                                            if (e_2) throw e_2.error;
                                            return [7 /*endfinally*/];
                                        case 14: return [7 /*endfinally*/];
                                        case 15:
                                            bopConfigurationKey = "billOfProcess:".concat(nodeLevelConfigurationKey);
                                            bopConfiguration = null;
                                            if (!(configurationCodeByField_1 === null || configurationCodeByField_1 === void 0 ? void 0 : configurationCodeByField_1[bopConfigurationKey])) return [3 /*break*/, 18];
                                            return [4 /*yield*/, (0, sandbox_ee_ts_1.importTypeScript)(configurationCodeByField_1[bopConfigurationKey])];
                                        case 16:
                                            mod = _x.sent();
                                            return [4 /*yield*/, mod.configure(hydratedConfiguration_1)];
                                        case 17:
                                            bopConfiguration = _x.sent();
                                            _x.label = 18;
                                        case 18:
                                            if (bopConfiguration) {
                                                // @ts-expect-error - we can't assign undefined to materialsWithConfiguredFields but we filter them in the next step
                                                jobOperationsInserts_1 = bopConfiguration
                                                    .map(function (description, index) {
                                                    var operation = jobOperationsInserts_1.find(function (operation) { return operation.description === description; });
                                                    if (operation) {
                                                        return __assign(__assign({}, operation), { order: index + 1 });
                                                    }
                                                })
                                                    .filter(Boolean);
                                            }
                                            if (!((jobOperationsInserts_1 === null || jobOperationsInserts_1 === void 0 ? void 0 : jobOperationsInserts_1.length) > 0)) return [3 /*break*/, 24];
                                            return [4 /*yield*/, trx
                                                    .insertInto("jobOperation")
                                                    .values(jobOperationsInserts_1)
                                                    .returning(["id"])
                                                    .execute()];
                                        case 19:
                                            operationIds_1 = _x.sent();
                                            _loop_2 = function (index, operation) {
                                                var operationId, methodOperationTool, methodOperationParameter, methodOperationStep, procedureId, parameters, attributes;
                                                return __generator(this, function (_y) {
                                                    switch (_y.label) {
                                                        case 0:
                                                            operationId = operationIds_1[index].id;
                                                            if (!operationId) return [3 /*break*/, 10];
                                                            methodOperationTool = operation.methodOperationTool, methodOperationParameter = operation.methodOperationParameter, methodOperationStep = operation.methodOperationStep, procedureId = operation.procedureId;
                                                            if (!((!node.data.isRoot || parts_1.tools) &&
                                                                Array.isArray(methodOperationTool) &&
                                                                methodOperationTool.length > 0)) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("jobOperationTool")
                                                                    .values(methodOperationTool.map(function (tool) { return ({
                                                                    toolId: tool.toolId,
                                                                    quantity: tool.quantity,
                                                                    operationId: operationId,
                                                                    companyId: companyId_1,
                                                                    createdBy: userId_1,
                                                                }); }))
                                                                    .execute()];
                                                        case 1:
                                                            _y.sent();
                                                            _y.label = 2;
                                                        case 2:
                                                            if (!procedureId) return [3 /*break*/, 4];
                                                            return [4 /*yield*/, insertProcedureDataForJobOperation(trx, client_1, {
                                                                    operationId: operationId,
                                                                    procedureId: procedureId,
                                                                    companyId: companyId_1,
                                                                    userId: userId_1,
                                                                })];
                                                        case 3:
                                                            _y.sent();
                                                            return [3 /*break*/, 10];
                                                        case 4:
                                                            if (!((!node.data.isRoot || parts_1.parameters) &&
                                                                Array.isArray(methodOperationParameter) &&
                                                                methodOperationParameter.length > 0)) return [3 /*break*/, 7];
                                                            return [4 /*yield*/, Promise.all(methodOperationParameter.map(function (param) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _a;
                                                                    return __generator(this, function (_b) {
                                                                        switch (_b.label) {
                                                                            case 0:
                                                                                _a = {
                                                                                    operationId: operationId,
                                                                                    key: param.key
                                                                                };
                                                                                return [4 /*yield*/, getConfiguredValue({
                                                                                        id: operation.id,
                                                                                        field: "parameter:".concat(param.id, ":value"),
                                                                                        defaultValue: param.value,
                                                                                    })];
                                                                            case 1: return [2 /*return*/, (_a.value = _b.sent(),
                                                                                    _a.companyId = companyId_1,
                                                                                    _a.createdBy = userId_1,
                                                                                    _a)];
                                                                        }
                                                                    });
                                                                }); }))];
                                                        case 5:
                                                            parameters = _y.sent();
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("jobOperationParameter")
                                                                    .values(parameters)
                                                                    .execute()];
                                                        case 6:
                                                            _y.sent();
                                                            _y.label = 7;
                                                        case 7:
                                                            if (!((!node.data.isRoot || parts_1.steps) &&
                                                                Array.isArray(methodOperationStep) &&
                                                                methodOperationStep.length > 0)) return [3 /*break*/, 10];
                                                            return [4 /*yield*/, Promise.all(methodOperationStep.map(function (_a) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _b;
                                                                    var _c;
                                                                    var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                                    return __generator(this, function (_d) {
                                                                        switch (_d.label) {
                                                                            case 0:
                                                                                _b = [__assign({}, attribute)];
                                                                                _c = { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId };
                                                                                return [4 /*yield*/, getConfiguredValue({
                                                                                        id: operation.id,
                                                                                        field: "attribute:".concat(_id, ":minValue"),
                                                                                        defaultValue: attribute.minValue,
                                                                                    })];
                                                                            case 1:
                                                                                _c.minValue = _d.sent();
                                                                                return [4 /*yield*/, getConfiguredValue({
                                                                                        id: operation.id,
                                                                                        field: "attribute:".concat(_id, ":maxValue"),
                                                                                        defaultValue: attribute.maxValue,
                                                                                    })];
                                                                            case 2: return [2 /*return*/, (__assign.apply(void 0, _b.concat([(_c.maxValue = _d.sent(), _c.companyId = companyId_1, _c.createdBy = userId_1, _c)])))];
                                                                        }
                                                                    });
                                                                }); }))];
                                                        case 8:
                                                            attributes = _y.sent();
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("jobOperationStep")
                                                                    .values(attributes)
                                                                    .execute()];
                                                        case 9:
                                                            _y.sent();
                                                            _y.label = 10;
                                                        case 10: return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, _e = ((_r = relatedOperations.data) !== null && _r !== void 0 ? _r : []).entries();
                                            _x.label = 20;
                                        case 20:
                                            if (!(_i < _e.length)) return [3 /*break*/, 23];
                                            _f = _e[_i], index = _f[0], operation = _f[1];
                                            return [5 /*yield**/, _loop_2(index, operation)];
                                        case 21:
                                            _x.sent();
                                            _x.label = 22;
                                        case 22:
                                            _i++;
                                            return [3 /*break*/, 20];
                                        case 23:
                                            methodOperationsToJobOperations =
                                                (_t = (_s = relatedOperations.data) === null || _s === void 0 ? void 0 : _s.reduce(function (acc, op, index) {
                                                    if (operationIds_1[index].id) {
                                                        acc[op.id] = operationIds_1[index].id;
                                                    }
                                                    return acc;
                                                }, {})) !== null && _t !== void 0 ? _t : {};
                                            _x.label = 24;
                                        case 24:
                                            if (!parts_1.billOfMaterial) return [3 /*break*/, 36];
                                            locationId_1 = (_u = job_1.data) === null || _u === void 0 ? void 0 : _u.locationId;
                                            mapMethodMaterialToJobMaterial = function (child) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, itemId, description, quantity, methodType, unitOfMeasureCode, itemType, unitCost, requiresSerialTracking, requiresBatchTracking, item, itemReplenishment, itemScrapPercentage, childTargetQuantity, childScrapQuantity, childTotalWithScrap, childEstimatedQuantity, _b;
                                                var _c;
                                                var _d, _e, _f, _g;
                                                return __generator(this, function (_h) {
                                                    switch (_h.label) {
                                                        case 0: return [4 /*yield*/, Promise.all([
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "itemId",
                                                                    defaultValue: child.data.itemId,
                                                                }),
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "description",
                                                                    defaultValue: child.data.description,
                                                                }),
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "quantity",
                                                                    defaultValue: child.data.quantity,
                                                                }),
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "methodType",
                                                                    defaultValue: child.data.methodType,
                                                                }),
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "unitOfMeasureCode",
                                                                    defaultValue: child.data.unitOfMeasureCode,
                                                                }),
                                                            ])];
                                                        case 1:
                                                            _a = _h.sent(), itemId = _a[0], description = _a[1], quantity = _a[2], methodType = _a[3], unitOfMeasureCode = _a[4];
                                                            if (itemId === "")
                                                                return [2 /*return*/, null];
                                                            itemType = child.data.itemType;
                                                            unitCost = child.data.unitCost;
                                                            requiresSerialTracking = child.data.itemTrackingType === "Serial";
                                                            requiresBatchTracking = child.data.itemTrackingType === "Batch";
                                                            if (!(itemId !== child.data.itemId)) return [3 /*break*/, 3];
                                                            return [4 /*yield*/, client_1
                                                                    .from("item")
                                                                    .select("readableId, readableIdWithRevision, type, name, itemTrackingType, itemCost(unitCost)")
                                                                    .eq("id", itemId)
                                                                    .eq("companyId", companyId_1)
                                                                    .single()];
                                                        case 2:
                                                            item = _h.sent();
                                                            if (item.data) {
                                                                itemType = item.data.type;
                                                                unitCost =
                                                                    (_e = (_d = item.data.itemCost[0]) === null || _d === void 0 ? void 0 : _d.unitCost) !== null && _e !== void 0 ? _e : child.data.unitCost;
                                                                if (description === child.data.description) {
                                                                    description = item.data.name;
                                                                }
                                                                requiresSerialTracking =
                                                                    item.data.itemTrackingType === "Serial";
                                                                requiresBatchTracking =
                                                                    item.data.itemTrackingType === "Batch";
                                                            }
                                                            else {
                                                                itemId = child.data.itemId;
                                                            }
                                                            _h.label = 3;
                                                        case 3: return [4 /*yield*/, trx
                                                                .selectFrom("itemReplenishment")
                                                                .select("scrapPercentage")
                                                                .where("itemId", "=", itemId)
                                                                .executeTakeFirst()];
                                                        case 4:
                                                            itemReplenishment = _h.sent();
                                                            itemScrapPercentage = Number((_f = itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.scrapPercentage) !== null && _f !== void 0 ? _f : 0);
                                                            childTargetQuantity = totalQuantityForChildren * quantity;
                                                            childScrapQuantity = childTargetQuantity * itemScrapPercentage;
                                                            childTotalWithScrap = Math.ceil(childTargetQuantity + childScrapQuantity);
                                                            childEstimatedQuantity = methodType === "Make to Order" ? childTargetQuantity : childTotalWithScrap;
                                                            _c = {
                                                                jobId: jobId_1,
                                                                jobMakeMethodId: parentJobMakeMethodId,
                                                                jobOperationId: methodOperationsToJobOperations[child.data.operationId],
                                                                itemId: itemId,
                                                                itemType: itemType,
                                                                kit: child.data.kit,
                                                                methodType: methodType,
                                                                order: child.data.order,
                                                                description: description,
                                                                quantity: quantity,
                                                                scrapQuantity: childScrapQuantity,
                                                                estimatedQuantity: childEstimatedQuantity
                                                            };
                                                            if (!locationId_1) return [3 /*break*/, 6];
                                                            return [4 /*yield*/, (0, storage_units_ts_1.getStorageUnitId)(trx, child.data.itemId, locationId_1, 
                                                                // @ts-ignore
                                                                (_g = child.data.storageUnitIds) === null || _g === void 0 ? void 0 : _g[locationId_1])];
                                                        case 5:
                                                            _b = _h.sent();
                                                            return [3 /*break*/, 7];
                                                        case 6:
                                                            _b = undefined;
                                                            _h.label = 7;
                                                        case 7: return [2 /*return*/, (_c.storageUnitId = _b,
                                                                _c.requiresSerialTracking = requiresSerialTracking,
                                                                _c.requiresBatchTracking = requiresBatchTracking,
                                                                _c.unitOfMeasureCode = unitOfMeasureCode,
                                                                _c.unitCost = unitCost !== null && unitCost !== void 0 ? unitCost : 0,
                                                                _c.itemScrapPercentage = itemScrapPercentage,
                                                                _c.companyId = companyId_1,
                                                                _c.createdBy = userId_1,
                                                                _c.customFields = {},
                                                                _c)];
                                                    }
                                                });
                                            }); };
                                            return [4 /*yield*/, Promise.all(node.children.map(mapMethodMaterialToJobMaterial))];
                                        case 25:
                                            jobMaterialResults = _x.sent();
                                            validJobMaterialIndices = jobMaterialResults.reduce(function (acc, m, i) {
                                                if (m !== null)
                                                    acc.push(i);
                                                return acc;
                                            }, []);
                                            materialsWithConfiguredFields_1 = jobMaterialResults.filter(function (m) { return m !== null; });
                                            configuredChildren = validJobMaterialIndices.map(function (i) { return node.children[i]; });
                                            bomConfigurationKey = "billOfMaterial:".concat(nodeLevelConfigurationKey);
                                            bomConfiguration = null;
                                            if (!(configurationCodeByField_1 === null || configurationCodeByField_1 === void 0 ? void 0 : configurationCodeByField_1[bomConfigurationKey])) return [3 /*break*/, 28];
                                            return [4 /*yield*/, (0, sandbox_ee_ts_1.importTypeScript)(configurationCodeByField_1[bomConfigurationKey])];
                                        case 26:
                                            mod = _x.sent();
                                            return [4 /*yield*/, mod.configure(hydratedConfiguration_1)];
                                        case 27:
                                            bomConfiguration = _x.sent();
                                            _x.label = 28;
                                        case 28:
                                            if (bomConfiguration) {
                                                // @ts-expect-error - we can't assign undefined to materialsWithConfiguredFields but we filter them in the next step
                                                materialsWithConfiguredFields_1 = bomConfiguration
                                                    .map(function (readableIdWithRevision, index) {
                                                    var material = materialsWithConfiguredFields_1.find(function (material) { return material.itemId === itemId_1; });
                                                    if (material) {
                                                        return __assign(__assign({}, material), { order: index + 1 });
                                                    }
                                                })
                                                    .filter(Boolean);
                                            }
                                            madeMaterials = materialsWithConfiguredFields_1.filter(function (material) { return material.methodType === "Make to Order"; });
                                            pickedOrBoughtMaterials = materialsWithConfiguredFields_1.filter(function (material) { return material.methodType !== "Make to Order"; });
                                            madeChildren = configuredChildren.filter(function (child) { return child.data.methodType === "Make to Order"; });
                                            console.log("[traverseMethod] materials", {
                                                totalChildren: materialsWithConfiguredFields_1.length,
                                                madeMaterialsCount: madeMaterials.length,
                                                madeChildrenCount: madeChildren.length,
                                                pickedOrBoughtCount: pickedOrBoughtMaterials.length,
                                            });
                                            if (!(madeMaterials.length > 0)) return [3 /*break*/, 34];
                                            madeMaterialsWithIds = madeMaterials.map(function (m) { return (__assign(__assign({}, m), { id: (0, mod_ts_1.nanoid)() })); });
                                            return [4 /*yield*/, trx
                                                    .insertInto("jobMaterial")
                                                    .values(madeMaterialsWithIds)
                                                    .execute()];
                                        case 29:
                                            _x.sent();
                                            _g = 0, _h = madeChildren.entries();
                                            _x.label = 30;
                                        case 30:
                                            if (!(_g < _h.length)) return [3 /*break*/, 34];
                                            _j = _h[_g], index = _j[0], child = _j[1];
                                            materialId = madeMaterialsWithIds[index].id;
                                            newMakeMethodId = (0, mod_ts_1.nanoid)();
                                            return [4 /*yield*/, trx
                                                    .updateTable("jobMakeMethod")
                                                    .set({ id: newMakeMethodId })
                                                    .where("parentMaterialId", "=", materialId)
                                                    .execute()];
                                        case 31:
                                            updateResult = _x.sent();
                                            console.log("[traverseMethod] processing made child", {
                                                index: index,
                                                materialId: materialId,
                                                newMakeMethodId: newMakeMethodId,
                                                childItemId: child.data.itemId,
                                                parentItemId: itemId_1,
                                                willRecurse: child.data.itemId !== itemId_1,
                                                updateResult: updateResult,
                                            });
                                            material = madeMaterials[index];
                                            childTotalForCascade = ((_v = material === null || material === void 0 ? void 0 : material.estimatedQuantity) !== null && _v !== void 0 ? _v : 0) +
                                                ((_w = material === null || material === void 0 ? void 0 : material.scrapQuantity) !== null && _w !== void 0 ? _w : 0);
                                            if (!(child.data.itemId !== itemId_1)) return [3 /*break*/, 33];
                                            return [4 /*yield*/, traverseMethod(child, newMakeMethodId, childTotalForCascade || 1)];
                                        case 32:
                                            _x.sent();
                                            _x.label = 33;
                                        case 33:
                                            _g++;
                                            return [3 /*break*/, 30];
                                        case 34:
                                            if (!(pickedOrBoughtMaterials.length > 0)) return [3 /*break*/, 36];
                                            return [4 /*yield*/, trx
                                                    .insertInto("jobMaterial")
                                                    .values(pickedOrBoughtMaterials)
                                                    .execute()];
                                        case 35:
                                            _x.sent();
                                            _x.label = 36;
                                        case 36: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                        function logTree(node, depth) {
                            if (depth === void 0) { depth = 0; }
                            console.log("  ".repeat(depth) + "[tree] ".concat(node.data.itemId, " (").concat(node.data.methodType, ", isRoot=").concat(node.data.isRoot, ", children=").concat(node.children.length, ")"));
                            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                                var child = _a[_i];
                                logTree(child, depth + 1);
                            }
                        }
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!isConfigured_1) return [3 /*break*/, 2];
                                    return [4 /*yield*/, trx.updateTable("job")
                                            .set({
                                            configuration: JSON.stringify(configuration_1),
                                            updatedAt: new Date().toISOString(),
                                            updatedBy: userId_1,
                                        })
                                            .where("id", "=", jobId_1)
                                            .execute()];
                                case 1:
                                    _d.sent();
                                    _d.label = 2;
                                case 2: 
                                // Delete existing jobMakeMethod, jobMakeMethodOperation, jobMakeMethodMaterial
                                return [4 /*yield*/, Promise.all([
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("jobMakeMethod")
                                                .where(function (eb) {
                                                return eb.and([
                                                    eb("jobId", "=", jobId_1),
                                                    eb("parentMaterialId", "is not", null),
                                                ]);
                                            })
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfMaterial
                                            ? trx.deleteFrom("jobMaterial").where("jobId", "=", jobId_1).execute()
                                            : Promise.resolve(),
                                        // Prevent cascade deletion of materials when only replacing operations
                                        !parts_1.billOfMaterial && parts_1.billOfProcess
                                            ? trx.updateTable("jobMaterial")
                                                .set({ jobOperationId: null })
                                                .where("jobId", "=", jobId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfProcess
                                            ? trx.deleteFrom("jobOperation").where("jobId", "=", jobId_1).execute()
                                            : Promise.resolve(),
                                        trx
                                            .updateTable("jobMakeMethod")
                                            .set({ version: (_a = makeMethod_1.data.version) !== null && _a !== void 0 ? _a : 1 })
                                            .where("id", "=", jobMakeMethod_1.data.id)
                                            .execute(),
                                    ])];
                                case 3:
                                    // Delete existing jobMakeMethod, jobMakeMethodOperation, jobMakeMethodMaterial
                                    _d.sent();
                                    logTree(methodTree_1);
                                    // Start traversal with job quantity as the root's target/parent estimated quantity
                                    return [4 /*yield*/, traverseMethod(methodTree_1, jobMakeMethod_1.data.id, (_c = (_b = job_1.data) === null || _b === void 0 ? void 0 : _b.quantity) !== null && _c !== void 0 ? _c : 1)];
                                case 4:
                                    // Start traversal with job quantity as the root's target/parent estimated quantity
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 12:
                _42.sent();
                return [3 /*break*/, 80];
            case 13:
                jobMakeMethodId_1 = targetId;
                if (!jobMakeMethodId_1) {
                    throw new Error("Invalid targetId");
                }
                itemId_2 = sourceId;
                isConfigured = !!configuration_1;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("activeMakeMethods")
                            .select("*")
                            .eq("itemId", itemId_2)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("jobMakeMethod")
                            .select("*")
                            .eq("id", jobMakeMethodId_1)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1.from("workCenters").select("*").eq("companyId", companyId_1),
                        client_1
                            .from("supplierProcess")
                            .select("*")
                            .eq("companyId", companyId_1),
                    ])];
            case 14:
                _g = _42.sent(), makeMethod_2 = _g[0], jobMakeMethod_2 = _g[1], workCenters = _g[2], supplierProcesses = _g[3];
                if (makeMethod_2.error) {
                    throw new Error("Failed to get make method");
                }
                if (jobMakeMethod_2.error || !jobMakeMethod_2.data) {
                    throw new Error("Failed to get job make method");
                }
                return [4 /*yield*/, hydrateConfiguration(client_1, configuration_1, itemId_2, companyId_1)];
            case 15:
                hydratedConfiguration = _42.sent();
                parentEstimatedQuantity_1 = 1;
                if (!jobMakeMethod_2.data.parentMaterialId) return [3 /*break*/, 17];
                return [4 /*yield*/, client_1
                        .from("jobMaterial")
                        .select("estimatedQuantity")
                        .eq("id", jobMakeMethod_2.data.parentMaterialId)
                        .single()];
            case 16:
                parentMaterial = _42.sent();
                parentEstimatedQuantity_1 =
                    (_10 = (_9 = parentMaterial.data) === null || _9 === void 0 ? void 0 : _9.estimatedQuantity) !== null && _10 !== void 0 ? _10 : 1;
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, client_1
                    .from("job")
                    .select("quantity")
                    .eq("id", jobMakeMethod_2.data.jobId)
                    .single()];
            case 18:
                rootJob = _42.sent();
                parentEstimatedQuantity_1 = (_12 = (_11 = rootJob.data) === null || _11 === void 0 ? void 0 : _11.quantity) !== null && _12 !== void 0 ? _12 : 1;
                _42.label = 19;
            case 19: return [4 /*yield*/, Promise.all([
                    client_1
                        .from("job")
                        .select("locationId")
                        .eq("id", jobMakeMethod_2.data.jobId)
                        .eq("companyId", companyId_1)
                        .single(),
                    getMethodTree(client_1, makeMethod_2.data.id),
                    isConfigured
                        ? client_1
                            .from("configurationRule")
                            .select("*")
                            .eq("itemId", itemId_2)
                            .eq("companyId", companyId_1)
                        : Promise.resolve({ data: [] }),
                ])];
            case 20:
                _h = _42.sent(), job_2 = _h[0], methodTrees = _h[1], configurationRules = _h[2];
                if (methodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                methodTree_2 = (_13 = methodTrees.data) === null || _13 === void 0 ? void 0 : _13[0];
                if (!methodTree_2)
                    throw new Error("Method tree not found");
                getLaborAndOverheadRates_2 = (0, methods_ts_1.getRatesFromWorkCenters)(workCenters === null || workCenters === void 0 ? void 0 : workCenters.data);
                getOutsideOperationRates_2 = (0, methods_ts_1.getRatesFromSupplierProcesses)(supplierProcesses === null || supplierProcesses === void 0 ? void 0 : supplierProcesses.data);
                configurationCodeByField = (_14 = configurationRules.data) === null || _14 === void 0 ? void 0 : _14.reduce(function (acc, rule) {
                    acc[rule.field] = rule.code;
                    return acc;
                }, {});
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        // traverse method tree and create:
                        // - jobMakeMethod
                        // - jobMakeMethodOperation
                        // - jobMakeMethodMaterial
                        function traverseMethod(node, parentJobMakeMethodId, nodeParentEstimatedQuantity) {
                            return __awaiter(this, void 0, void 0, function () {
                                var targetQuantity, nodeItemReplenishment, nodeScrapPercentage, nodeScrapQuantity, totalWithScrap, estimatedQuantity, operationQuantity, totalQuantityForChildren, relatedOperations, jobOperationsInserts, methodOperationsToJobOperations, operationIds_2, _loop_3, _i, _a, _b, index, operation, mapMethodMaterialToJobMaterial, madeMaterials, pickedOrBoughtMaterials, _c, _d, _e, child, material, e_3_1, madeMaterialsWithIds, madeChildren, _f, _g, _h, index, child, materialId, newMakeMethodId, material, childTotalForCascade;
                                var _this = this;
                                var _j, e_3, _k, _l;
                                var _m, _o, _p, _q, _r, _s, _t, _u, _v;
                                return __generator(this, function (_w) {
                                    switch (_w.label) {
                                        case 0:
                                            targetQuantity = node.data.isRoot
                                                ? nodeParentEstimatedQuantity
                                                : nodeParentEstimatedQuantity * ((_m = node.data.quantity) !== null && _m !== void 0 ? _m : 1);
                                            return [4 /*yield*/, trx
                                                    .selectFrom("itemReplenishment")
                                                    .select("scrapPercentage")
                                                    .where("itemId", "=", node.data.itemId)
                                                    .executeTakeFirst()];
                                        case 1:
                                            nodeItemReplenishment = _w.sent();
                                            nodeScrapPercentage = Number((_o = nodeItemReplenishment === null || nodeItemReplenishment === void 0 ? void 0 : nodeItemReplenishment.scrapPercentage) !== null && _o !== void 0 ? _o : 0);
                                            nodeScrapQuantity = targetQuantity * nodeScrapPercentage;
                                            totalWithScrap = Math.ceil(targetQuantity + nodeScrapQuantity);
                                            estimatedQuantity = node.data.methodType === "Make to Order" ? targetQuantity : totalWithScrap;
                                            operationQuantity = totalWithScrap;
                                            totalQuantityForChildren = totalWithScrap;
                                            return [4 /*yield*/, client_1
                                                    .from("methodOperation")
                                                    .select("*, methodOperationTool(*), methodOperationParameter(*), methodOperationStep(*)")
                                                    .eq("makeMethodId", node.data.materialMakeMethodId)];
                                        case 2:
                                            relatedOperations = _w.sent();
                                            jobOperationsInserts = (_q = (_p = relatedOperations === null || relatedOperations === void 0 ? void 0 : relatedOperations.data) === null || _p === void 0 ? void 0 : _p.map(function (op) {
                                                var _a, _b, _c;
                                                return (__assign(__assign(__assign(__assign({ jobId: (_a = jobMakeMethod_2.data) === null || _a === void 0 ? void 0 : _a.jobId, jobMakeMethodId: parentJobMakeMethodId, processId: op.processId, procedureId: op.procedureId, workCenterId: op.workCenterId, description: op.description, setupTime: op.setupTime, setupUnit: op.setupUnit, laborTime: op.laborTime, laborUnit: op.laborUnit, machineTime: op.machineTime, machineUnit: op.machineUnit }, getLaborAndOverheadRates_2(op.processId, op.workCenterId)), { order: op.order, operationOrder: op.operationOrder, operationType: op.operationType, operationUnitCost: (_b = op.operationUnitCost) !== null && _b !== void 0 ? _b : 0, operationSupplierProcessId: op.operationSupplierProcessId }), getOutsideOperationRates_2(op.processId, op.operationSupplierProcessId)), { tags: (_c = op.tags) !== null && _c !== void 0 ? _c : [], workInstruction: parts_1.workInstructions ? op.workInstruction : {}, targetQuantity: targetQuantity, operationQuantity: operationQuantity, companyId: companyId_1, createdBy: userId_1, customFields: {} }));
                                            })) !== null && _q !== void 0 ? _q : [];
                                            methodOperationsToJobOperations = {};
                                            if (!parts_1.billOfProcess) return [3 /*break*/, 8];
                                            if (!((jobOperationsInserts === null || jobOperationsInserts === void 0 ? void 0 : jobOperationsInserts.length) > 0)) return [3 /*break*/, 8];
                                            return [4 /*yield*/, trx
                                                    .insertInto("jobOperation")
                                                    .values(jobOperationsInserts)
                                                    .returning(["id"])
                                                    .execute()];
                                        case 3:
                                            operationIds_2 = _w.sent();
                                            _loop_3 = function (index, operation) {
                                                var operationId, methodOperationTool, methodOperationParameter, methodOperationStep, procedureId;
                                                return __generator(this, function (_x) {
                                                    switch (_x.label) {
                                                        case 0:
                                                            operationId = operationIds_2[index].id;
                                                            if (!operationId) return [3 /*break*/, 8];
                                                            methodOperationTool = operation.methodOperationTool, methodOperationParameter = operation.methodOperationParameter, methodOperationStep = operation.methodOperationStep, procedureId = operation.procedureId;
                                                            if (!(parts_1.tools &&
                                                                Array.isArray(methodOperationTool) &&
                                                                methodOperationTool.length > 0)) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("jobOperationTool")
                                                                    .values(methodOperationTool.map(function (tool) { return ({
                                                                    toolId: tool.toolId,
                                                                    quantity: tool.quantity,
                                                                    operationId: operationId,
                                                                    companyId: companyId_1,
                                                                    createdBy: userId_1,
                                                                }); }))
                                                                    .execute()];
                                                        case 1:
                                                            _x.sent();
                                                            _x.label = 2;
                                                        case 2:
                                                            if (!procedureId) return [3 /*break*/, 4];
                                                            return [4 /*yield*/, insertProcedureDataForJobOperation(trx, client_1, {
                                                                    operationId: operationId,
                                                                    procedureId: procedureId,
                                                                    companyId: companyId_1,
                                                                    userId: userId_1,
                                                                })];
                                                        case 3:
                                                            _x.sent();
                                                            return [3 /*break*/, 8];
                                                        case 4:
                                                            if (!(parts_1.parameters &&
                                                                Array.isArray(methodOperationParameter) &&
                                                                methodOperationParameter.length > 0)) return [3 /*break*/, 6];
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("jobOperationParameter")
                                                                    .values(methodOperationParameter.map(function (param) { return ({
                                                                    operationId: operationId,
                                                                    key: param.key,
                                                                    value: param.value,
                                                                    companyId: companyId_1,
                                                                    createdBy: userId_1,
                                                                }); }))
                                                                    .execute()];
                                                        case 5:
                                                            _x.sent();
                                                            _x.label = 6;
                                                        case 6:
                                                            if (!(parts_1.steps &&
                                                                Array.isArray(methodOperationStep) &&
                                                                methodOperationStep.length > 0)) return [3 /*break*/, 8];
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("jobOperationStep")
                                                                    .values(methodOperationStep.map(function (_a) {
                                                                    var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                                    return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                                }))
                                                                    .execute()];
                                                        case 7:
                                                            _x.sent();
                                                            _x.label = 8;
                                                        case 8: return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, _a = ((_r = relatedOperations.data) !== null && _r !== void 0 ? _r : []).entries();
                                            _w.label = 4;
                                        case 4:
                                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                                            _b = _a[_i], index = _b[0], operation = _b[1];
                                            return [5 /*yield**/, _loop_3(index, operation)];
                                        case 5:
                                            _w.sent();
                                            _w.label = 6;
                                        case 6:
                                            _i++;
                                            return [3 /*break*/, 4];
                                        case 7:
                                            methodOperationsToJobOperations =
                                                (_t = (_s = relatedOperations.data) === null || _s === void 0 ? void 0 : _s.reduce(function (acc, op, index) {
                                                    if (operationIds_2[index].id) {
                                                        acc[op.id] = operationIds_2[index].id;
                                                    }
                                                    return acc;
                                                }, {})) !== null && _t !== void 0 ? _t : {};
                                            _w.label = 8;
                                        case 8:
                                            if (!parts_1.billOfMaterial) return [3 /*break*/, 29];
                                            mapMethodMaterialToJobMaterial = function (child) { return __awaiter(_this, void 0, void 0, function () {
                                                var itemReplenishment, itemScrapPercentage, childTargetQuantity, childScrapQuantity, childTotalWithScrap, childEstimatedQuantity;
                                                var _a;
                                                var _b, _c, _d, _e, _f, _g, _h;
                                                return __generator(this, function (_j) {
                                                    switch (_j.label) {
                                                        case 0: return [4 /*yield*/, trx
                                                                .selectFrom("itemReplenishment")
                                                                .select("scrapPercentage")
                                                                .where("itemId", "=", child.data.itemId)
                                                                .executeTakeFirst()];
                                                        case 1:
                                                            itemReplenishment = _j.sent();
                                                            itemScrapPercentage = Number((_b = itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.scrapPercentage) !== null && _b !== void 0 ? _b : 0);
                                                            childTargetQuantity = totalQuantityForChildren * ((_c = child.data.quantity) !== null && _c !== void 0 ? _c : 1);
                                                            childScrapQuantity = childTargetQuantity * itemScrapPercentage;
                                                            childTotalWithScrap = Math.ceil(childTargetQuantity + childScrapQuantity);
                                                            childEstimatedQuantity = child.data.methodType === "Make to Order"
                                                                ? childTargetQuantity
                                                                : childTotalWithScrap;
                                                            _a = {
                                                                jobId: (_d = jobMakeMethod_2.data) === null || _d === void 0 ? void 0 : _d.jobId,
                                                                jobMakeMethodId: parentJobMakeMethodId,
                                                                jobOperationId: methodOperationsToJobOperations[child.data.operationId],
                                                                itemId: child.data.itemId,
                                                                kit: child.data.kit,
                                                                itemType: child.data.itemType,
                                                                methodType: child.data.methodType,
                                                                order: child.data.order,
                                                                description: child.data.description,
                                                                quantity: child.data.quantity,
                                                                scrapQuantity: childScrapQuantity,
                                                                estimatedQuantity: childEstimatedQuantity,
                                                                requiresBatchTracking: child.data.itemTrackingType === "Batch",
                                                                requiresSerialTracking: child.data.itemTrackingType === "Serial",
                                                                unitOfMeasureCode: child.data.unitOfMeasureCode,
                                                                unitCost: child.data.unitCost,
                                                                itemScrapPercentage: itemScrapPercentage
                                                            };
                                                            return [4 /*yield*/, (0, storage_units_ts_1.getStorageUnitId)(trx, child.data.itemId, (_f = (_e = job_2.data) === null || _e === void 0 ? void 0 : _e.locationId) !== null && _f !== void 0 ? _f : "", 
                                                                // @ts-ignore: storageUnitIds is a dynamic field
                                                                (_h = (_g = child.data.storageUnitIds) === null || _g === void 0 ? void 0 : _g[job_2.data.locationId]) !== null && _h !== void 0 ? _h : undefined)];
                                                        case 2: return [2 /*return*/, (_a.storageUnitId = _j.sent(),
                                                                _a.companyId = companyId_1,
                                                                _a.createdBy = userId_1,
                                                                _a.customFields = {},
                                                                _a)];
                                                    }
                                                });
                                            }); };
                                            madeMaterials = [];
                                            pickedOrBoughtMaterials = [];
                                            _w.label = 9;
                                        case 9:
                                            _w.trys.push([9, 15, 16, 21]);
                                            _c = true, _d = __asyncValues(node.children);
                                            _w.label = 10;
                                        case 10: return [4 /*yield*/, _d.next()];
                                        case 11:
                                            if (!(_e = _w.sent(), _j = _e.done, !_j)) return [3 /*break*/, 14];
                                            _l = _e.value;
                                            _c = false;
                                            child = _l;
                                            return [4 /*yield*/, mapMethodMaterialToJobMaterial(child)];
                                        case 12:
                                            material = _w.sent();
                                            if (child.data.methodType === "Make to Order") {
                                                madeMaterials.push(material);
                                            }
                                            else {
                                                pickedOrBoughtMaterials.push(material);
                                            }
                                            _w.label = 13;
                                        case 13:
                                            _c = true;
                                            return [3 /*break*/, 10];
                                        case 14: return [3 /*break*/, 21];
                                        case 15:
                                            e_3_1 = _w.sent();
                                            e_3 = { error: e_3_1 };
                                            return [3 /*break*/, 21];
                                        case 16:
                                            _w.trys.push([16, , 19, 20]);
                                            if (!(!_c && !_j && (_k = _d.return))) return [3 /*break*/, 18];
                                            return [4 /*yield*/, _k.call(_d)];
                                        case 17:
                                            _w.sent();
                                            _w.label = 18;
                                        case 18: return [3 /*break*/, 20];
                                        case 19:
                                            if (e_3) throw e_3.error;
                                            return [7 /*endfinally*/];
                                        case 20: return [7 /*endfinally*/];
                                        case 21:
                                            if (!(madeMaterials.length > 0)) return [3 /*break*/, 27];
                                            madeMaterialsWithIds = madeMaterials.map(function (m) { return (__assign(__assign({}, m), { id: (0, mod_ts_1.nanoid)() })); });
                                            return [4 /*yield*/, trx
                                                    .insertInto("jobMaterial")
                                                    .values(madeMaterialsWithIds)
                                                    .execute()];
                                        case 22:
                                            _w.sent();
                                            madeChildren = node.children.filter(function (child) { return child.data.methodType === "Make to Order"; });
                                            _f = 0, _g = madeChildren.entries();
                                            _w.label = 23;
                                        case 23:
                                            if (!(_f < _g.length)) return [3 /*break*/, 27];
                                            _h = _g[_f], index = _h[0], child = _h[1];
                                            materialId = madeMaterialsWithIds[index].id;
                                            newMakeMethodId = (0, mod_ts_1.nanoid)();
                                            return [4 /*yield*/, trx
                                                    .updateTable("jobMakeMethod")
                                                    .set({ id: newMakeMethodId })
                                                    .where("parentMaterialId", "=", materialId)
                                                    .execute()];
                                        case 24:
                                            _w.sent();
                                            material = madeMaterials[index];
                                            childTotalForCascade = ((_u = material === null || material === void 0 ? void 0 : material.estimatedQuantity) !== null && _u !== void 0 ? _u : 0) +
                                                ((_v = material === null || material === void 0 ? void 0 : material.scrapQuantity) !== null && _v !== void 0 ? _v : 0);
                                            if (!(child.data.itemId !== itemId_2)) return [3 /*break*/, 26];
                                            return [4 /*yield*/, traverseMethod(child, newMakeMethodId, childTotalForCascade || 1)];
                                        case 25:
                                            _w.sent();
                                            _w.label = 26;
                                        case 26:
                                            _f++;
                                            return [3 /*break*/, 23];
                                        case 27:
                                            if (!(pickedOrBoughtMaterials.length > 0)) return [3 /*break*/, 29];
                                            return [4 /*yield*/, trx
                                                    .insertInto("jobMaterial")
                                                    .values(pickedOrBoughtMaterials)
                                                    .execute()];
                                        case 28:
                                            _w.sent();
                                            _w.label = 29;
                                        case 29: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: 
                                // Delete existing jobMakeMethodOperation, jobMakeMethodMaterial
                                return [4 /*yield*/, Promise.all([
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("jobMaterial")
                                                .where("jobMakeMethodId", "=", jobMakeMethodId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        // Prevent cascade deletion of materials when only replacing operations
                                        !parts_1.billOfMaterial && parts_1.billOfProcess
                                            ? trx.updateTable("jobMaterial")
                                                .set({ jobOperationId: null })
                                                .where("jobMakeMethodId", "=", jobMakeMethodId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfProcess
                                            ? trx
                                                .deleteFrom("jobOperation")
                                                .where("jobMakeMethodId", "=", jobMakeMethodId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        trx
                                            .updateTable("jobMakeMethod")
                                            .set({ version: (_a = makeMethod_2.data.version) !== null && _a !== void 0 ? _a : 1 })
                                            .where("id", "=", jobMakeMethodId_1)
                                            .execute(),
                                    ])];
                                case 1:
                                    // Delete existing jobMakeMethodOperation, jobMakeMethodMaterial
                                    _b.sent();
                                    // Start traversal with the parent's estimated quantity
                                    return [4 /*yield*/, traverseMethod(methodTree_2, jobMakeMethod_2.data.id, parentEstimatedQuantity_1)];
                                case 2:
                                    // Start traversal with the parent's estimated quantity
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 21:
                _42.sent();
                return [3 /*break*/, 80];
            case 22:
                _j = targetId.split(":"), quoteId_1 = _j[0], quoteLineId_1 = _j[1];
                if (!quoteId_1 || !quoteLineId_1) {
                    throw new Error("Invalid targetId");
                }
                itemId_3 = sourceId;
                isConfigured_2 = !!configuration_1;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("activeMakeMethods")
                            .select("*")
                            .eq("itemId", itemId_3)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteMakeMethod")
                            .select("*")
                            .eq("quoteLineId", quoteLineId_1)
                            .is("parentMaterialId", null)
                            .eq("companyId", companyId_1)
                            .maybeSingle(),
                        client_1.from("workCenters").select("*").eq("companyId", companyId_1),
                        client_1.from("supplierProcess").select("*").eq("companyId", companyId_1),
                        isConfigured_2
                            ? client_1
                                .from("configurationRule")
                                .select("field, code")
                                .eq("itemId", itemId_3)
                                .eq("companyId", companyId_1)
                            : Promise.resolve({ data: null, error: null }),
                        client_1
                            .from("quote")
                            .select("locationId")
                            .eq("id", quoteId_1)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 23:
                _k = _42.sent(), makeMethod_3 = _k[0], quoteMakeMethod_1 = _k[1], workCenters = _k[2], supplierProcesses = _k[3], configurationRules = _k[4], quote = _k[5];
                configurationCodeByField_2 = (_15 = configurationRules === null || configurationRules === void 0 ? void 0 : configurationRules.data) === null || _15 === void 0 ? void 0 : _15.reduce(function (acc, rule) {
                    acc[rule.field] = rule.code;
                    return acc;
                }, {});
                quoteLocationId_1 = (_16 = quote.data) === null || _16 === void 0 ? void 0 : _16.locationId;
                if (makeMethod_3.error) {
                    throw new Error("Failed to get make method");
                }
                if (quoteMakeMethod_1.error) {
                    throw new Error("Failed to get quote make method");
                }
                if (!!quoteMakeMethod_1.data) return [3 /*break*/, 25];
                return [4 /*yield*/, client_1
                        .from("quoteMakeMethod")
                        .insert({
                        quoteId: quoteId_1,
                        quoteLineId: quoteLineId_1,
                        itemId: itemId_3,
                        companyId: companyId_1,
                        createdBy: userId_1,
                    })
                        .select("*")
                        .single()];
            case 24:
                inserted = _42.sent();
                if (inserted.error || !inserted.data) {
                    throw new Error("Failed to create quote make method");
                }
                quoteMakeMethod_1.data = inserted.data;
                _42.label = 25;
            case 25:
                if (workCenters.error) {
                    throw new Error("Failed to get related work centers");
                }
                return [4 /*yield*/, hydrateConfiguration(client_1, configuration_1, itemId_3, companyId_1)];
            case 26:
                hydratedConfiguration_2 = _42.sent();
                return [4 /*yield*/, Promise.all([
                        getMethodTree(client_1, makeMethod_3.data.id),
                    ])];
            case 27:
                methodTrees = (_42.sent())[0];
                if (methodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                methodTree_3 = (_17 = methodTrees.data) === null || _17 === void 0 ? void 0 : _17[0];
                if (!methodTree_3)
                    throw new Error("Method tree not found");
                getLaborAndOverheadRates_3 = (0, methods_ts_1.getRatesFromWorkCenters)(workCenters === null || workCenters === void 0 ? void 0 : workCenters.data);
                getOutsideOperationRates_3 = (0, methods_ts_1.getRatesFromSupplierProcesses)(supplierProcesses === null || supplierProcesses === void 0 ? void 0 : supplierProcesses.data);
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        function getConfiguredValue(_a) {
                            return __awaiter(this, arguments, void 0, function (_b) {
                                var fieldKey, code, mod, result, err_3;
                                var id = _b.id, field = _b.field, defaultValue = _b.defaultValue;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!configurationCodeByField_2)
                                                return [2 /*return*/, defaultValue];
                                            fieldKey = getFieldKey(field, id);
                                            if (!configurationCodeByField_2[fieldKey]) return [3 /*break*/, 5];
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 4, , 5]);
                                            code = configurationCodeByField_2[fieldKey];
                                            return [4 /*yield*/, (0, sandbox_ee_ts_1.importTypeScript)(code)];
                                        case 2:
                                            mod = _c.sent();
                                            return [4 /*yield*/, mod.configure(hydratedConfiguration_2)];
                                        case 3:
                                            result = _c.sent();
                                            return [2 /*return*/, (result !== null && result !== void 0 ? result : defaultValue)];
                                        case 4:
                                            err_3 = _c.sent();
                                            console.error(err_3);
                                            return [2 /*return*/, defaultValue];
                                        case 5: return [2 /*return*/, defaultValue];
                                    }
                                });
                            });
                        }
                        // traverse method tree and create:
                        // - quoteMakeMethod
                        // - quoteMakeMethodOperation
                        // - quoteMakeMethodMaterial
                        function traverseMethod(node, parentQuoteMakeMethodId) {
                            return __awaiter(this, void 0, void 0, function () {
                                var methodOperationsToQuoteOperations, nodeLevelConfigurationKey, relatedOperations, quoteOperationsInserts_1, _a, _b, _c, op, _d, processId, procedureId, workCenterId, description, setupTime, setupUnit, laborTime, laborUnit, machineTime, machineUnit, operationOrder, operationType, operationRates, e_4_1, bopConfigurationKey, bopConfiguration, mod, operationIds_3, _loop_4, _i, _e, _f, index, operation, mapMethodMaterialToQuoteMaterial, quoteMaterialResults, validQuoteMaterialIndices, materialsWithConfiguredFields_2, configuredChildren, bomConfigurationKey, bomConfiguration, mod, madeMaterials, pickedOrBoughtMaterials, madeChildren, madeMaterialsWithIds, _g, _h, _j, index, child, materialId, newMakeMethodId, updateResult;
                                var _this = this;
                                var _k, e_4, _l, _m;
                                var _o, _p, _q, _r, _s, _t, _u;
                                return __generator(this, function (_v) {
                                    switch (_v.label) {
                                        case 0:
                                            console.log("[traverseMethod]", {
                                                isRoot: node.data.isRoot,
                                                itemId: node.data.itemId,
                                                methodType: node.data.methodType,
                                                materialMakeMethodId: node.data.materialMakeMethodId,
                                                childCount: node.children.length,
                                                childMethodTypes: node.children.map(function (c) { return ({
                                                    itemId: c.data.itemId,
                                                    methodType: c.data.methodType,
                                                }); }),
                                                parentQuoteMakeMethodId: parentQuoteMakeMethodId,
                                            });
                                            methodOperationsToQuoteOperations = {};
                                            nodeLevelConfigurationKey = "".concat(node.data.materialMakeMethodId, ":").concat(node.data.isRoot ? "undefined" : node.data.methodMaterialId);
                                            if (!(!node.data.isRoot || parts_1.billOfProcess)) return [3 /*break*/, 23];
                                            return [4 /*yield*/, client_1
                                                    .from("methodOperation")
                                                    .select("*, methodOperationTool(*), methodOperationParameter(*), methodOperationStep(*)")
                                                    .eq("makeMethodId", node.data.materialMakeMethodId)];
                                        case 1:
                                            relatedOperations = _v.sent();
                                            quoteOperationsInserts_1 = [];
                                            _v.label = 2;
                                        case 2:
                                            _v.trys.push([2, 8, 9, 14]);
                                            _a = true, _b = __asyncValues((_o = relatedOperations === null || relatedOperations === void 0 ? void 0 : relatedOperations.data) !== null && _o !== void 0 ? _o : []);
                                            _v.label = 3;
                                        case 3: return [4 /*yield*/, _b.next()];
                                        case 4:
                                            if (!(_c = _v.sent(), _k = _c.done, !_k)) return [3 /*break*/, 7];
                                            _m = _c.value;
                                            _a = false;
                                            op = _m;
                                            return [4 /*yield*/, Promise.all([
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "processId",
                                                        defaultValue: op.processId,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "procedureId",
                                                        defaultValue: op.procedureId,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "workCenterId",
                                                        defaultValue: op.workCenterId,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "description",
                                                        defaultValue: op.description,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "setupTime",
                                                        defaultValue: op.setupTime,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "setupUnit",
                                                        defaultValue: op.setupUnit,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "laborTime",
                                                        defaultValue: op.laborTime,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "laborUnit",
                                                        defaultValue: op.laborUnit,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "machineTime",
                                                        defaultValue: op.machineTime,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "machineUnit",
                                                        defaultValue: op.machineUnit,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "operationOrder",
                                                        defaultValue: op.operationOrder,
                                                    }),
                                                    getConfiguredValue({
                                                        id: op.id,
                                                        field: "operationType",
                                                        defaultValue: op.operationType,
                                                    }),
                                                ])];
                                        case 5:
                                            _d = _v.sent(), processId = _d[0], procedureId = _d[1], workCenterId = _d[2], description = _d[3], setupTime = _d[4], setupUnit = _d[5], laborTime = _d[6], laborUnit = _d[7], machineTime = _d[8], machineUnit = _d[9], operationOrder = _d[10], operationType = _d[11];
                                            if (processId === "")
                                                return [3 /*break*/, 6];
                                            operationRates = getLaborAndOverheadRates_3(processId, op.workCenterId);
                                            console.log(__assign({ processId: processId }, operationRates));
                                            quoteOperationsInserts_1.push(__assign(__assign(__assign(__assign({ quoteId: quoteId_1, quoteLineId: quoteLineId_1, quoteMakeMethodId: parentQuoteMakeMethodId, processId: processId, procedureId: procedureId, workCenterId: workCenterId, description: description, setupTime: setupTime, setupUnit: setupUnit, laborTime: laborTime, laborUnit: laborUnit, machineTime: machineTime, machineUnit: machineUnit }, getLaborAndOverheadRates_3(processId, op.workCenterId)), { order: op.order, operationOrder: operationOrder, operationType: operationType, operationSupplierProcessId: op.operationSupplierProcessId, operationUnitCost: (_p = op.operationUnitCost) !== null && _p !== void 0 ? _p : 0 }), getOutsideOperationRates_3(processId, op.operationSupplierProcessId)), { operationMinimumCost: (_q = op.operationMinimumCost) !== null && _q !== void 0 ? _q : 0, tags: (_r = op.tags) !== null && _r !== void 0 ? _r : [], workInstruction: (!node.data.isRoot || parts_1.workInstructions) ? op.workInstruction : {}, companyId: companyId_1, createdBy: userId_1, customFields: {} }));
                                            _v.label = 6;
                                        case 6:
                                            _a = true;
                                            return [3 /*break*/, 3];
                                        case 7: return [3 /*break*/, 14];
                                        case 8:
                                            e_4_1 = _v.sent();
                                            e_4 = { error: e_4_1 };
                                            return [3 /*break*/, 14];
                                        case 9:
                                            _v.trys.push([9, , 12, 13]);
                                            if (!(!_a && !_k && (_l = _b.return))) return [3 /*break*/, 11];
                                            return [4 /*yield*/, _l.call(_b)];
                                        case 10:
                                            _v.sent();
                                            _v.label = 11;
                                        case 11: return [3 /*break*/, 13];
                                        case 12:
                                            if (e_4) throw e_4.error;
                                            return [7 /*endfinally*/];
                                        case 13: return [7 /*endfinally*/];
                                        case 14:
                                            bopConfigurationKey = "billOfProcess:".concat(nodeLevelConfigurationKey);
                                            bopConfiguration = null;
                                            if (!(configurationCodeByField_2 === null || configurationCodeByField_2 === void 0 ? void 0 : configurationCodeByField_2[bopConfigurationKey])) return [3 /*break*/, 17];
                                            return [4 /*yield*/, (0, sandbox_ee_ts_1.importTypeScript)(configurationCodeByField_2[bopConfigurationKey])];
                                        case 15:
                                            mod = _v.sent();
                                            return [4 /*yield*/, mod.configure(hydratedConfiguration_2)];
                                        case 16:
                                            bopConfiguration = _v.sent();
                                            _v.label = 17;
                                        case 17:
                                            if (bopConfiguration) {
                                                // @ts-expect-error - we can't assign undefined to materialsWithConfiguredFields but we filter them in the next step
                                                quoteOperationsInserts_1 = bopConfiguration
                                                    .map(function (description, index) {
                                                    var operation = quoteOperationsInserts_1.find(function (operation) { return operation.description === description; });
                                                    if (operation) {
                                                        return __assign(__assign({}, operation), { order: index + 1 });
                                                    }
                                                })
                                                    .filter(Boolean);
                                            }
                                            if (!((quoteOperationsInserts_1 === null || quoteOperationsInserts_1 === void 0 ? void 0 : quoteOperationsInserts_1.length) > 0)) return [3 /*break*/, 23];
                                            return [4 /*yield*/, trx
                                                    .insertInto("quoteOperation")
                                                    .values(quoteOperationsInserts_1)
                                                    .returning(["id"])
                                                    .execute()];
                                        case 18:
                                            operationIds_3 = _v.sent();
                                            _loop_4 = function (index, operation) {
                                                var operationId, methodOperationTool, methodOperationParameter, methodOperationStep, procedureId, parameters, attributes;
                                                return __generator(this, function (_w) {
                                                    switch (_w.label) {
                                                        case 0:
                                                            operationId = operationIds_3[index].id;
                                                            if (!operationId) return [3 /*break*/, 8];
                                                            methodOperationTool = operation.methodOperationTool, methodOperationParameter = operation.methodOperationParameter, methodOperationStep = operation.methodOperationStep, procedureId = operation.procedureId;
                                                            if (!((!node.data.isRoot || parts_1.tools) &&
                                                                Array.isArray(methodOperationTool) &&
                                                                methodOperationTool.length > 0)) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("quoteOperationTool")
                                                                    .values(methodOperationTool.map(function (tool) { return ({
                                                                    toolId: tool.toolId,
                                                                    quantity: tool.quantity,
                                                                    operationId: operationId,
                                                                    companyId: companyId_1,
                                                                    createdBy: userId_1,
                                                                }); }))
                                                                    .execute()];
                                                        case 1:
                                                            _w.sent();
                                                            _w.label = 2;
                                                        case 2:
                                                            if (!!procedureId) return [3 /*break*/, 8];
                                                            if (!((!node.data.isRoot || parts_1.parameters) &&
                                                                Array.isArray(methodOperationParameter) &&
                                                                methodOperationParameter.length > 0)) return [3 /*break*/, 5];
                                                            return [4 /*yield*/, Promise.all(methodOperationParameter.map(function (param) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _a;
                                                                    return __generator(this, function (_b) {
                                                                        switch (_b.label) {
                                                                            case 0:
                                                                                _a = {
                                                                                    operationId: operationId,
                                                                                    key: param.key
                                                                                };
                                                                                return [4 /*yield*/, getConfiguredValue({
                                                                                        id: operation.id,
                                                                                        field: "parameter:".concat(param.id, ":value"),
                                                                                        defaultValue: param.value,
                                                                                    })];
                                                                            case 1: return [2 /*return*/, (_a.value = _b.sent(),
                                                                                    _a.companyId = companyId_1,
                                                                                    _a.createdBy = userId_1,
                                                                                    _a)];
                                                                        }
                                                                    });
                                                                }); }))];
                                                        case 3:
                                                            parameters = _w.sent();
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("quoteOperationParameter")
                                                                    .values(parameters)
                                                                    .execute()];
                                                        case 4:
                                                            _w.sent();
                                                            _w.label = 5;
                                                        case 5:
                                                            if (!((!node.data.isRoot || parts_1.steps) &&
                                                                Array.isArray(methodOperationStep) &&
                                                                methodOperationStep.length > 0)) return [3 /*break*/, 8];
                                                            return [4 /*yield*/, Promise.all(methodOperationStep.map(function (_a) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var _b;
                                                                    var _c;
                                                                    var id = _a.id, attribute = __rest(_a, ["id"]);
                                                                    return __generator(this, function (_d) {
                                                                        switch (_d.label) {
                                                                            case 0:
                                                                                _b = [__assign({}, attribute)];
                                                                                _c = { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId };
                                                                                return [4 /*yield*/, getConfiguredValue({
                                                                                        id: operation.id,
                                                                                        field: "attribute:".concat(id, ":minValue"),
                                                                                        defaultValue: attribute.minValue,
                                                                                    })];
                                                                            case 1:
                                                                                _c.minValue = _d.sent();
                                                                                return [4 /*yield*/, getConfiguredValue({
                                                                                        id: operation.id,
                                                                                        field: "attribute:".concat(id, ":maxValue"),
                                                                                        defaultValue: attribute.maxValue,
                                                                                    })];
                                                                            case 2: return [2 /*return*/, (__assign.apply(void 0, _b.concat([(_c.maxValue = _d.sent(), _c.companyId = companyId_1, _c.createdBy = userId_1, _c)])))];
                                                                        }
                                                                    });
                                                                }); }))];
                                                        case 6:
                                                            attributes = _w.sent();
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("quoteOperationStep")
                                                                    .values(attributes)
                                                                    .execute()];
                                                        case 7:
                                                            _w.sent();
                                                            _w.label = 8;
                                                        case 8: return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, _e = ((_s = relatedOperations.data) !== null && _s !== void 0 ? _s : []).entries();
                                            _v.label = 19;
                                        case 19:
                                            if (!(_i < _e.length)) return [3 /*break*/, 22];
                                            _f = _e[_i], index = _f[0], operation = _f[1];
                                            return [5 /*yield**/, _loop_4(index, operation)];
                                        case 20:
                                            _v.sent();
                                            _v.label = 21;
                                        case 21:
                                            _i++;
                                            return [3 /*break*/, 19];
                                        case 22:
                                            methodOperationsToQuoteOperations =
                                                (_u = (_t = relatedOperations.data) === null || _t === void 0 ? void 0 : _t.reduce(function (acc, op, index) {
                                                    if (operationIds_3[index].id) {
                                                        acc[op.id] = operationIds_3[index].id;
                                                    }
                                                    return acc;
                                                }, {})) !== null && _u !== void 0 ? _u : {};
                                            _v.label = 23;
                                        case 23:
                                            if (!parts_1.billOfMaterial) return [3 /*break*/, 35];
                                            mapMethodMaterialToQuoteMaterial = function (child) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, itemId, description, quantity, methodType, unitOfMeasureCode, itemType, unitCost, item;
                                                var _b, _c, _d;
                                                return __generator(this, function (_e) {
                                                    switch (_e.label) {
                                                        case 0: return [4 /*yield*/, Promise.all([
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "itemId",
                                                                    defaultValue: child.data.itemId,
                                                                }),
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "description",
                                                                    defaultValue: child.data.description,
                                                                }),
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "quantity",
                                                                    defaultValue: child.data.quantity,
                                                                }),
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "methodType",
                                                                    defaultValue: child.data.methodType,
                                                                }),
                                                                getConfiguredValue({
                                                                    id: child.data.methodMaterialId,
                                                                    field: "unitOfMeasureCode",
                                                                    defaultValue: child.data.unitOfMeasureCode,
                                                                }),
                                                            ])];
                                                        case 1:
                                                            _a = _e.sent(), itemId = _a[0], description = _a[1], quantity = _a[2], methodType = _a[3], unitOfMeasureCode = _a[4];
                                                            if (itemId === "")
                                                                return [2 /*return*/, null];
                                                            itemType = child.data.itemType;
                                                            unitCost = child.data.unitCost;
                                                            if (!(itemId !== child.data.itemId)) return [3 /*break*/, 3];
                                                            return [4 /*yield*/, client_1
                                                                    .from("item")
                                                                    .select("readableIdWithRevision, readableId, type, name, itemCost(unitCost)")
                                                                    .eq("id", itemId)
                                                                    .eq("companyId", companyId_1)
                                                                    .single()];
                                                        case 2:
                                                            item = _e.sent();
                                                            if (item.data) {
                                                                itemType = item.data.type;
                                                                unitCost =
                                                                    (_c = (_b = item.data.itemCost[0]) === null || _b === void 0 ? void 0 : _b.unitCost) !== null && _c !== void 0 ? _c : child.data.unitCost;
                                                                if (description === child.data.description) {
                                                                    description = item.data.name;
                                                                }
                                                            }
                                                            else {
                                                                itemId = child.data.itemId;
                                                            }
                                                            _e.label = 3;
                                                        case 3: return [2 /*return*/, {
                                                                quoteId: quoteId_1,
                                                                quoteLineId: quoteLineId_1,
                                                                quoteMakeMethodId: parentQuoteMakeMethodId,
                                                                quoteOperationId: methodOperationsToQuoteOperations[child.data.operationId],
                                                                order: child.data.order,
                                                                itemId: itemId,
                                                                itemType: itemType,
                                                                kit: child.data.kit,
                                                                methodType: methodType,
                                                                description: description,
                                                                quantity: quantity,
                                                                storageUnitId: quoteLocationId_1
                                                                    ? // @ts-ignore: storageUnitIds is a dynamic object with location keys
                                                                        ((_d = child.data.storageUnitIds) === null || _d === void 0 ? void 0 : _d[quoteLocationId_1]) || null
                                                                    : null,
                                                                unitOfMeasureCode: unitOfMeasureCode,
                                                                unitCost: unitCost !== null && unitCost !== void 0 ? unitCost : 0,
                                                                companyId: companyId_1,
                                                                createdBy: userId_1,
                                                                customFields: {},
                                                            }];
                                                    }
                                                });
                                            }); };
                                            return [4 /*yield*/, Promise.all(node.children.map(mapMethodMaterialToQuoteMaterial))];
                                        case 24:
                                            quoteMaterialResults = _v.sent();
                                            validQuoteMaterialIndices = quoteMaterialResults.reduce(function (acc, m, i) {
                                                if (m !== null)
                                                    acc.push(i);
                                                return acc;
                                            }, []);
                                            materialsWithConfiguredFields_2 = quoteMaterialResults.filter(function (m) { return m !== null; });
                                            configuredChildren = validQuoteMaterialIndices.map(function (i) { return node.children[i]; });
                                            bomConfigurationKey = "billOfMaterial:".concat(nodeLevelConfigurationKey);
                                            bomConfiguration = null;
                                            if (!(configurationCodeByField_2 === null || configurationCodeByField_2 === void 0 ? void 0 : configurationCodeByField_2[bomConfigurationKey])) return [3 /*break*/, 27];
                                            return [4 /*yield*/, (0, sandbox_ee_ts_1.importTypeScript)(configurationCodeByField_2[bomConfigurationKey])];
                                        case 25:
                                            mod = _v.sent();
                                            return [4 /*yield*/, mod.configure(hydratedConfiguration_2)];
                                        case 26:
                                            bomConfiguration = _v.sent();
                                            _v.label = 27;
                                        case 27:
                                            if (bomConfiguration) {
                                                // @ts-expect-error - we can't assign undefined to materialsWithConfiguredFields but we filter them in the next step
                                                materialsWithConfiguredFields_2 = bomConfiguration
                                                    .map(function (readableIdWithRevision, index) {
                                                    var material = materialsWithConfiguredFields_2.find(function (material) { return material.itemId === itemId_3; });
                                                    if (material) {
                                                        return __assign(__assign({}, material), { order: index + 1 });
                                                    }
                                                })
                                                    .filter(Boolean);
                                            }
                                            madeMaterials = materialsWithConfiguredFields_2.filter(function (material) { return material.methodType === "Make to Order"; });
                                            pickedOrBoughtMaterials = materialsWithConfiguredFields_2.filter(function (material) { return material.methodType !== "Make to Order"; });
                                            madeChildren = configuredChildren.filter(function (child) { return child.data.methodType === "Make to Order"; });
                                            console.log("[traverseMethod] materials", {
                                                totalChildren: materialsWithConfiguredFields_2.length,
                                                madeMaterialsCount: madeMaterials.length,
                                                madeChildrenCount: madeChildren.length,
                                                pickedOrBoughtCount: pickedOrBoughtMaterials.length,
                                            });
                                            if (!(madeMaterials.length > 0)) return [3 /*break*/, 33];
                                            madeMaterialsWithIds = madeMaterials.map(function (m) { return (__assign(__assign({}, m), { id: (0, mod_ts_1.nanoid)() })); });
                                            return [4 /*yield*/, trx
                                                    .insertInto("quoteMaterial")
                                                    .values(madeMaterialsWithIds)
                                                    .execute()];
                                        case 28:
                                            _v.sent();
                                            _g = 0, _h = madeChildren.entries();
                                            _v.label = 29;
                                        case 29:
                                            if (!(_g < _h.length)) return [3 /*break*/, 33];
                                            _j = _h[_g], index = _j[0], child = _j[1];
                                            materialId = madeMaterialsWithIds[index].id;
                                            newMakeMethodId = (0, mod_ts_1.nanoid)();
                                            return [4 /*yield*/, trx
                                                    .updateTable("quoteMakeMethod")
                                                    .set({ id: newMakeMethodId })
                                                    .where("parentMaterialId", "=", materialId)
                                                    .execute()];
                                        case 30:
                                            updateResult = _v.sent();
                                            console.log("[traverseMethod] processing made child", {
                                                index: index,
                                                materialId: materialId,
                                                newMakeMethodId: newMakeMethodId,
                                                childItemId: child.data.itemId,
                                                parentItemId: itemId_3,
                                                willRecurse: child.data.itemId !== itemId_3,
                                                updateResult: updateResult,
                                            });
                                            if (!(child.data.itemId !== itemId_3)) return [3 /*break*/, 32];
                                            return [4 /*yield*/, traverseMethod(child, newMakeMethodId)];
                                        case 31:
                                            _v.sent();
                                            _v.label = 32;
                                        case 32:
                                            _g++;
                                            return [3 /*break*/, 29];
                                        case 33:
                                            if (!(pickedOrBoughtMaterials.length > 0)) return [3 /*break*/, 35];
                                            return [4 /*yield*/, trx
                                                    .insertInto("quoteMaterial")
                                                    .values(pickedOrBoughtMaterials)
                                                    .execute()];
                                        case 34:
                                            _v.sent();
                                            _v.label = 35;
                                        case 35: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                        function logTree(node, depth) {
                            if (depth === void 0) { depth = 0; }
                            console.log("  ".repeat(depth) + "[tree] ".concat(node.data.itemId, " (").concat(node.data.methodType, ", isRoot=").concat(node.data.isRoot, ", children=").concat(node.children.length, ")"));
                            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                                var child = _a[_i];
                                logTree(child, depth + 1);
                            }
                        }
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!isConfigured_2) return [3 /*break*/, 2];
                                    return [4 /*yield*/, trx.updateTable("quoteLine")
                                            .set({
                                            configuration: JSON.stringify(configuration_1),
                                            updatedAt: new Date().toISOString(),
                                            updatedBy: userId_1,
                                        })
                                            .where("id", "=", quoteLineId_1)
                                            .execute()];
                                case 1:
                                    _b.sent();
                                    _b.label = 2;
                                case 2: 
                                // Delete existing quoteMakeMethod, quoteMakeMethodOperation, quoteMakeMethodMaterial
                                return [4 /*yield*/, Promise.all([
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("quoteMakeMethod")
                                                .where(function (eb) {
                                                return eb.and([
                                                    eb("quoteLineId", "=", quoteLineId_1),
                                                    eb("parentMaterialId", "is not", null),
                                                ]);
                                            })
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("quoteMaterial")
                                                .where("quoteLineId", "=", quoteLineId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        // Prevent cascade deletion of materials when only replacing operations
                                        !parts_1.billOfMaterial && parts_1.billOfProcess
                                            ? trx.updateTable("quoteMaterial")
                                                .set({ quoteOperationId: null })
                                                .where("quoteLineId", "=", quoteLineId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfProcess
                                            ? trx
                                                .deleteFrom("quoteOperation")
                                                .where("quoteLineId", "=", quoteLineId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        trx
                                            .updateTable("quoteMakeMethod")
                                            .set({ version: (_a = makeMethod_3.data.version) !== null && _a !== void 0 ? _a : 1 })
                                            .where("id", "=", quoteMakeMethod_1.data.id)
                                            .execute(),
                                    ])];
                                case 3:
                                    // Delete existing quoteMakeMethod, quoteMakeMethodOperation, quoteMakeMethodMaterial
                                    _b.sent();
                                    logTree(methodTree_3);
                                    return [4 /*yield*/, traverseMethod(methodTree_3, quoteMakeMethod_1.data.id)];
                                case 4:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 28:
                _42.sent();
                return [4 /*yield*/, (0, methods_ts_1.calculateQuoteLinePrices)(client_1, quoteId_1, quoteLineId_1, companyId_1, userId_1)];
            case 29:
                _42.sent();
                return [3 /*break*/, 80];
            case 30:
                quoteMakeMethodId_1 = targetId;
                if (!quoteMakeMethodId_1) {
                    throw new Error("Invalid targetId");
                }
                itemId_4 = sourceId;
                isConfigured = !!configuration_1;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("activeMakeMethods")
                            .select("*")
                            .eq("itemId", itemId_4)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteMakeMethod")
                            .select("*")
                            .eq("id", quoteMakeMethodId_1)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1.from("workCenters").select("*").eq("companyId", companyId_1),
                        client_1
                            .from("supplierProcess")
                            .select("*")
                            .eq("companyId", companyId_1),
                    ])];
            case 31:
                _l = _42.sent(), makeMethod_4 = _l[0], quoteMakeMethod_2 = _l[1], workCenters = _l[2], supplierProcesses = _l[3];
                if (makeMethod_4.error) {
                    throw new Error("Failed to get make method");
                }
                if (quoteMakeMethod_2.error || !quoteMakeMethod_2.data) {
                    throw new Error("Failed to get quote make method");
                }
                return [4 /*yield*/, hydrateConfiguration(client_1, configuration_1, itemId_4, companyId_1)];
            case 32:
                hydratedConfiguration_3 = _42.sent();
                return [4 /*yield*/, Promise.all([
                        getMethodTree(client_1, makeMethod_4.data.id),
                        isConfigured
                            ? client_1
                                .from("configurationRule")
                                .select("*")
                                .eq("itemId", itemId_4)
                                .eq("companyId", companyId_1)
                            : Promise.resolve({ data: [] }),
                    ])];
            case 33:
                _m = _42.sent(), methodTrees = _m[0], configurationRules = _m[1];
                if (methodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                methodTree_4 = (_18 = methodTrees.data) === null || _18 === void 0 ? void 0 : _18[0];
                if (!methodTree_4)
                    throw new Error("Method tree not found");
                getLaborAndOverheadRates_4 = (0, methods_ts_1.getRatesFromWorkCenters)(workCenters === null || workCenters === void 0 ? void 0 : workCenters.data);
                getOutsideOperationRates_4 = (0, methods_ts_1.getRatesFromSupplierProcesses)(supplierProcesses === null || supplierProcesses === void 0 ? void 0 : supplierProcesses.data);
                configurationCodeByField_3 = (_19 = configurationRules.data) === null || _19 === void 0 ? void 0 : _19.reduce(function (acc, rule) {
                    acc[rule.field] = rule.code;
                    return acc;
                }, {});
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        function getFieldKey(field, id) {
                            return "".concat(field, ":").concat(id);
                        }
                        function getConfiguredValue(_a) {
                            return __awaiter(this, arguments, void 0, function (_b) {
                                var fieldKey, mod, result, err_4;
                                var id = _b.id, field = _b.field, defaultValue = _b.defaultValue;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!configurationCodeByField_3)
                                                return [2 /*return*/, defaultValue];
                                            fieldKey = getFieldKey(field, id);
                                            if (!(configurationCodeByField_3 === null || configurationCodeByField_3 === void 0 ? void 0 : configurationCodeByField_3[fieldKey])) return [3 /*break*/, 5];
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 4, , 5]);
                                            return [4 /*yield*/, (0, sandbox_ee_ts_1.importTypeScript)(configurationCodeByField_3[fieldKey])];
                                        case 2:
                                            mod = _c.sent();
                                            return [4 /*yield*/, mod.configure(hydratedConfiguration_3)];
                                        case 3:
                                            result = _c.sent();
                                            return [2 /*return*/, (result !== null && result !== void 0 ? result : defaultValue)];
                                        case 4:
                                            err_4 = _c.sent();
                                            console.error(err_4);
                                            return [2 /*return*/, defaultValue];
                                        case 5: return [2 /*return*/, defaultValue];
                                    }
                                });
                            });
                        }
                        // traverse method tree and create:
                        // - quoteMakeMethod
                        // - quoteMakeMethodOperation
                        // - quoteMakeMethodMaterial
                        function traverseMethod(node, parentQuoteMakeMethodId) {
                            return __awaiter(this, void 0, void 0, function () {
                                var relatedOperations, quoteOperationInserts, methodOperationsToQuoteOperations, operationIds_4, _loop_5, _i, _a, _b, index, operation, mapMethodMaterialToQuoteMaterial, madeChildren, unmadeChildren, madeMaterials, pickedOrBoughtMaterials, madeMaterialsWithIds, _c, _d, _e, index, child, materialId, newMakeMethodId;
                                var _f, _g, _h, _j, _k;
                                return __generator(this, function (_l) {
                                    switch (_l.label) {
                                        case 0: return [4 /*yield*/, client_1
                                                .from("methodOperation")
                                                .select("*, methodOperationTool(*), methodOperationParameter(*), methodOperationStep(*)")
                                                .eq("makeMethodId", node.data.materialMakeMethodId)];
                                        case 1:
                                            relatedOperations = _l.sent();
                                            quoteOperationInserts = (_g = (_f = relatedOperations === null || relatedOperations === void 0 ? void 0 : relatedOperations.data) === null || _f === void 0 ? void 0 : _f.map(function (op) {
                                                var _a, _b, _c, _d;
                                                return (__assign(__assign(__assign(__assign({ quoteId: (_a = quoteMakeMethod_2.data) === null || _a === void 0 ? void 0 : _a.quoteId, quoteLineId: (_b = quoteMakeMethod_2.data) === null || _b === void 0 ? void 0 : _b.quoteLineId, quoteMakeMethodId: parentQuoteMakeMethodId, processId: op.processId, procedureId: op.procedureId, workCenterId: op.workCenterId, description: op.description, setupTime: op.setupTime, setupUnit: op.setupUnit, laborTime: op.laborTime, laborUnit: op.laborUnit, machineTime: op.machineTime, machineUnit: op.machineUnit }, getLaborAndOverheadRates_4(op.processId, op.workCenterId)), { order: op.order, operationOrder: op.operationOrder, operationType: op.operationType, operationUnitCost: (_c = op.operationUnitCost) !== null && _c !== void 0 ? _c : 0, operationSupplierProcessId: op.operationSupplierProcessId }), getOutsideOperationRates_4(op.processId, op.operationSupplierProcessId)), { tags: (_d = op.tags) !== null && _d !== void 0 ? _d : [], workInstruction: parts_1.workInstructions ? op.workInstruction : {}, companyId: companyId_1, createdBy: userId_1, customFields: {} }));
                                            })) !== null && _g !== void 0 ? _g : [];
                                            methodOperationsToQuoteOperations = {};
                                            if (!parts_1.billOfProcess) return [3 /*break*/, 7];
                                            if (!((quoteOperationInserts === null || quoteOperationInserts === void 0 ? void 0 : quoteOperationInserts.length) > 0)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, trx
                                                    .insertInto("quoteOperation")
                                                    .values(quoteOperationInserts)
                                                    .returning(["id"])
                                                    .execute()];
                                        case 2:
                                            operationIds_4 = _l.sent();
                                            _loop_5 = function (index, operation) {
                                                var operationId, methodOperationTool, methodOperationParameter, methodOperationStep, procedureId;
                                                return __generator(this, function (_m) {
                                                    switch (_m.label) {
                                                        case 0:
                                                            operationId = operationIds_4[index].id;
                                                            if (!operationId) return [3 /*break*/, 6];
                                                            methodOperationTool = operation.methodOperationTool, methodOperationParameter = operation.methodOperationParameter, methodOperationStep = operation.methodOperationStep, procedureId = operation.procedureId;
                                                            if (!(parts_1.tools &&
                                                                Array.isArray(methodOperationTool) &&
                                                                methodOperationTool.length > 0)) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("quoteOperationTool")
                                                                    .values(methodOperationTool.map(function (tool) { return ({
                                                                    toolId: tool.toolId,
                                                                    quantity: tool.quantity,
                                                                    operationId: operationId,
                                                                    companyId: companyId_1,
                                                                    createdBy: userId_1,
                                                                }); }))
                                                                    .execute()];
                                                        case 1:
                                                            _m.sent();
                                                            _m.label = 2;
                                                        case 2:
                                                            if (!!procedureId) return [3 /*break*/, 6];
                                                            if (!(parts_1.parameters &&
                                                                Array.isArray(methodOperationParameter) &&
                                                                methodOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("quoteOperationParameter")
                                                                    .values(methodOperationParameter.map(function (param) { return ({
                                                                    operationId: operationId,
                                                                    key: param.key,
                                                                    value: param.value,
                                                                    companyId: companyId_1,
                                                                    createdBy: userId_1,
                                                                }); }))
                                                                    .execute()];
                                                        case 3:
                                                            _m.sent();
                                                            _m.label = 4;
                                                        case 4:
                                                            if (!(parts_1.steps &&
                                                                Array.isArray(methodOperationStep) &&
                                                                methodOperationStep.length > 0)) return [3 /*break*/, 6];
                                                            return [4 /*yield*/, trx
                                                                    .insertInto("quoteOperationStep")
                                                                    .values(methodOperationStep.map(function (_a) {
                                                                    var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                                    return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                                }))
                                                                    .execute()];
                                                        case 5:
                                                            _m.sent();
                                                            _m.label = 6;
                                                        case 6: return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, _a = ((_h = relatedOperations.data) !== null && _h !== void 0 ? _h : []).entries();
                                            _l.label = 3;
                                        case 3:
                                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                                            _b = _a[_i], index = _b[0], operation = _b[1];
                                            return [5 /*yield**/, _loop_5(index, operation)];
                                        case 4:
                                            _l.sent();
                                            _l.label = 5;
                                        case 5:
                                            _i++;
                                            return [3 /*break*/, 3];
                                        case 6:
                                            methodOperationsToQuoteOperations =
                                                (_k = (_j = relatedOperations.data) === null || _j === void 0 ? void 0 : _j.reduce(function (acc, op, index) {
                                                    if (operationIds_4[index].id) {
                                                        acc[op.id] = operationIds_4[index].id;
                                                    }
                                                    return acc;
                                                }, {})) !== null && _k !== void 0 ? _k : {};
                                            _l.label = 7;
                                        case 7:
                                            if (!parts_1.billOfMaterial) return [3 /*break*/, 15];
                                            mapMethodMaterialToQuoteMaterial = function (child) {
                                                var _a, _b, _c;
                                                return ({
                                                    quoteId: (_a = quoteMakeMethod_2.data) === null || _a === void 0 ? void 0 : _a.quoteId,
                                                    quoteLineId: (_b = quoteMakeMethod_2.data) === null || _b === void 0 ? void 0 : _b.quoteLineId,
                                                    quoteMakeMethodId: parentQuoteMakeMethodId,
                                                    quoteOperationId: methodOperationsToQuoteOperations[child.data.operationId],
                                                    itemId: child.data.itemId,
                                                    itemType: child.data.itemType,
                                                    kit: child.data.kit,
                                                    methodType: child.data.methodType,
                                                    order: child.data.order,
                                                    description: child.data.description,
                                                    quantity: child.data.quantity,
                                                    storageUnitId: child.data.storageUnitId || null, // @ts-ignore: storageUnitId field exists in database but types may not be updated
                                                    unitOfMeasureCode: child.data.unitOfMeasureCode,
                                                    unitCost: (_c = child.data.unitCost) !== null && _c !== void 0 ? _c : 0,
                                                    companyId: companyId_1,
                                                    createdBy: userId_1,
                                                    customFields: {},
                                                });
                                            };
                                            madeChildren = node.children.filter(function (child) { return child.data.methodType === "Make to Order"; });
                                            unmadeChildren = node.children.filter(function (child) { return child.data.methodType !== "Make to Order"; });
                                            madeMaterials = madeChildren.map(mapMethodMaterialToQuoteMaterial);
                                            pickedOrBoughtMaterials = unmadeChildren.map(mapMethodMaterialToQuoteMaterial);
                                            if (!(madeMaterials.length > 0)) return [3 /*break*/, 13];
                                            madeMaterialsWithIds = madeMaterials.map(function (m) { return (__assign(__assign({}, m), { id: (0, mod_ts_1.nanoid)() })); });
                                            return [4 /*yield*/, trx
                                                    .insertInto("quoteMaterial")
                                                    .values(madeMaterialsWithIds)
                                                    .execute()];
                                        case 8:
                                            _l.sent();
                                            _c = 0, _d = madeChildren.entries();
                                            _l.label = 9;
                                        case 9:
                                            if (!(_c < _d.length)) return [3 /*break*/, 13];
                                            _e = _d[_c], index = _e[0], child = _e[1];
                                            materialId = madeMaterialsWithIds[index].id;
                                            newMakeMethodId = (0, mod_ts_1.nanoid)();
                                            return [4 /*yield*/, trx
                                                    .updateTable("quoteMakeMethod")
                                                    .set({ id: newMakeMethodId })
                                                    .where("parentMaterialId", "=", materialId)
                                                    .execute()];
                                        case 10:
                                            _l.sent();
                                            if (!(child.data.itemId !== itemId_4)) return [3 /*break*/, 12];
                                            return [4 /*yield*/, traverseMethod(child, newMakeMethodId)];
                                        case 11:
                                            _l.sent();
                                            _l.label = 12;
                                        case 12:
                                            _c++;
                                            return [3 /*break*/, 9];
                                        case 13:
                                            if (!(pickedOrBoughtMaterials.length > 0)) return [3 /*break*/, 15];
                                            return [4 /*yield*/, trx
                                                    .insertInto("quoteMaterial")
                                                    .values(pickedOrBoughtMaterials)
                                                    .execute()];
                                        case 14:
                                            _l.sent();
                                            _l.label = 15;
                                        case 15: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: 
                                // Delete existing quoteMakeMethodOperation, quoteMakeMethodMaterial
                                return [4 /*yield*/, Promise.all([
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("quoteMaterial")
                                                .where("quoteMakeMethodId", "=", quoteMakeMethodId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        // Prevent cascade deletion of materials when only replacing operations
                                        !parts_1.billOfMaterial && parts_1.billOfProcess
                                            ? trx.updateTable("quoteMaterial")
                                                .set({ quoteOperationId: null })
                                                .where("quoteMakeMethodId", "=", quoteMakeMethodId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfProcess
                                            ? trx
                                                .deleteFrom("quoteOperation")
                                                .where("quoteMakeMethodId", "=", quoteMakeMethodId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        trx
                                            .updateTable("quoteMakeMethod")
                                            .set({ version: (_a = makeMethod_4.data.version) !== null && _a !== void 0 ? _a : 1 })
                                            .where("id", "=", quoteMakeMethodId_1)
                                            .execute(),
                                    ])];
                                case 1:
                                    // Delete existing quoteMakeMethodOperation, quoteMakeMethodMaterial
                                    _b.sent();
                                    return [4 /*yield*/, traverseMethod(methodTree_4, quoteMakeMethod_2.data.id)];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 34:
                _42.sent();
                return [3 /*break*/, 80];
            case 35:
                jobMakeMethodId = sourceId;
                makeMethodId = targetId;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("makeMethod")
                            .select("*")
                            .eq("id", makeMethodId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("jobMakeMethod")
                            .select("*")
                            .eq("id", jobMakeMethodId)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 36:
                _o = _42.sent(), makeMethod_5 = _o[0], jobMakeMethod_3 = _o[1];
                if (makeMethod_5.error) {
                    throw new Error("Failed to get make method");
                }
                if (jobMakeMethod_3.error) {
                    throw new Error("Failed to get job make method");
                }
                itemId_5 = (_20 = makeMethod_5.data) === null || _20 === void 0 ? void 0 : _20.itemId;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("job")
                            .select("locationId")
                            .eq("id", jobMakeMethod_3.data.jobId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("jobOperationsWithMakeMethods")
                            .select("*, jobOperationTool(*), jobOperationParameter(*), jobOperationStep(*)")
                            .eq("jobId", jobMakeMethod_3.data.jobId)
                            .eq("companyId", companyId_1),
                        client_1
                            .from("itemReplenishment")
                            .select("*")
                            .eq("itemId", itemId_5)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 37:
                _p = _42.sent(), job_3 = _p[0], jobOperations_1 = _p[1], itemReplenishment = _p[2];
                if (jobOperations_1.error) {
                    throw new Error("Failed to get job operations");
                }
                if (itemReplenishment.error) {
                    throw new Error("Failed to get item replenishment");
                }
                if ((_21 = itemReplenishment.data) === null || _21 === void 0 ? void 0 : _21.requiresConfiguration) {
                    throw new Error("Cannot override method of configured item");
                }
                return [4 /*yield*/, Promise.all([
                        (0, methods_ts_1.getJobMethodTree)(client_1, jobMakeMethodId, jobMakeMethod_3.data.parentMaterialId),
                    ])];
            case 38:
                jobMethodTrees = (_42.sent())[0];
                if (jobMethodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                if (jobMethodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                jobMethodTree_1 = (_22 = jobMethodTrees.data) === null || _22 === void 0 ? void 0 : _22[0];
                if (!jobMethodTree_1)
                    throw new Error("Job method tree not found");
                madeItemIds_1 = [];
                (0, methods_ts_1.traverseJobMethod)(jobMethodTree_1, function (node) {
                    if (node.data.itemId && node.data.methodType === "Make to Order") {
                        madeItemIds_1.push(node.data.itemId);
                    }
                });
                return [4 /*yield*/, client_1
                        .from("makeMethod")
                        .select("*")
                        .in("itemId", madeItemIds_1)];
            case 39:
                makeMethods = _42.sent();
                if (makeMethods.error) {
                    throw new Error("Failed to get make methods");
                }
                makeMethodByItemId_1 = {};
                (_23 = makeMethods.data) === null || _23 === void 0 ? void 0 : _23.forEach(function (m) {
                    makeMethodByItemId_1[m.itemId] = m.id;
                });
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var makeMethodsToDelete, materialInserts, operationInserts, operationIds, _loop_6, _i, _a, _b, index, operation;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    makeMethodsToDelete = [];
                                    materialInserts = [];
                                    operationInserts = [];
                                    (0, methods_ts_1.traverseJobMethod)(jobMethodTree_1, function (node) {
                                        if (node.data.itemId && node.data.methodType === "Make to Order") {
                                            makeMethodsToDelete.push(makeMethodByItemId_1[node.data.itemId]);
                                        }
                                        node.children.forEach(function (child) {
                                            var _a;
                                            var _b;
                                            materialInserts.push({
                                                makeMethodId: makeMethodByItemId_1[node.data.itemId],
                                                materialMakeMethodId: makeMethodByItemId_1[child.data.itemId],
                                                itemId: child.data.itemId,
                                                itemType: child.data.itemType,
                                                kit: child.data.kit,
                                                methodType: child.data.methodType,
                                                order: child.data.order,
                                                quantity: child.data.quantity,
                                                unitOfMeasureCode: child.data.unitOfMeasureCode,
                                                storageUnitIds: ((_b = job_3.data) === null || _b === void 0 ? void 0 : _b.locationId)
                                                    ? (_a = {},
                                                        _a[job_3.data.locationId] = child.data.storageUnitId || null,
                                                        _a) : {},
                                                companyId: companyId_1,
                                                createdBy: userId_1,
                                                customFields: {},
                                            });
                                        });
                                    });
                                    if (!(makeMethodsToDelete.length > 0)) return [3 /*break*/, 2];
                                    makeMethodsToDelete = makeMethodsToDelete.map(function (mm) {
                                        return mm === makeMethodByItemId_1[jobMakeMethod_3.data.itemId]
                                            ? makeMethod_5.data.id
                                            : mm;
                                    });
                                    return [4 /*yield*/, Promise.all([
                                            parts_1.billOfMaterial
                                                ? trx
                                                    .deleteFrom("methodMaterial")
                                                    .where("makeMethodId", "in", makeMethodsToDelete)
                                                    .execute()
                                                : Promise.resolve(),
                                            parts_1.billOfProcess
                                                ? trx
                                                    .deleteFrom("methodOperation")
                                                    .where("makeMethodId", "in", makeMethodsToDelete)
                                                    .execute()
                                                : Promise.resolve(),
                                        ])];
                                case 1:
                                    _e.sent();
                                    _e.label = 2;
                                case 2:
                                    if (!(parts_1.billOfMaterial && materialInserts.length > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodMaterial")
                                            .values(materialInserts.map(function (insert) { return (__assign(__assign({}, insert), { productionQuantity: undefined, makeMethodId: insert.makeMethodId ===
                                                makeMethodByItemId_1[jobMakeMethod_3.data.itemId]
                                                ? makeMethod_5.data.id
                                                : insert.makeMethodId, itemId: insert.itemId === jobMakeMethod_3.data.itemId
                                                ? itemId_5
                                                : insert.itemId })); }))
                                            .execute()];
                                case 3:
                                    _e.sent();
                                    _e.label = 4;
                                case 4:
                                    if (!parts_1.billOfProcess) return [3 /*break*/, 9];
                                    (_c = jobOperations_1.data) === null || _c === void 0 ? void 0 : _c.forEach(function (op) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                                        operationInserts.push({
                                            makeMethodId: op.makeMethodId,
                                            processId: op.processId,
                                            procedureId: op.procedureId,
                                            workCenterId: op.workCenterId,
                                            description: (_a = op.description) !== null && _a !== void 0 ? _a : "",
                                            setupTime: (_b = op.setupTime) !== null && _b !== void 0 ? _b : 0,
                                            setupUnit: (_c = op.setupUnit) !== null && _c !== void 0 ? _c : "Total Minutes",
                                            laborTime: (_d = op.laborTime) !== null && _d !== void 0 ? _d : 0,
                                            laborUnit: (_e = op.laborUnit) !== null && _e !== void 0 ? _e : "Minutes/Piece",
                                            machineTime: (_f = op.machineTime) !== null && _f !== void 0 ? _f : 0,
                                            machineUnit: (_g = op.machineUnit) !== null && _g !== void 0 ? _g : "Minutes/Piece",
                                            order: (_h = op.order) !== null && _h !== void 0 ? _h : 1,
                                            operationOrder: (_j = op.operationOrder) !== null && _j !== void 0 ? _j : "After Previous",
                                            operationType: (_k = op.operationType) !== null && _k !== void 0 ? _k : "Inside",
                                            operationMinimumCost: (_l = op.operationMinimumCost) !== null && _l !== void 0 ? _l : 0,
                                            operationLeadTime: (_m = op.operationLeadTime) !== null && _m !== void 0 ? _m : 0,
                                            operationUnitCost: (_o = op.operationUnitCost) !== null && _o !== void 0 ? _o : 0,
                                            tags: (_p = op.tags) !== null && _p !== void 0 ? _p : [],
                                            workInstruction: parts_1.workInstructions ? op.workInstruction : {},
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            customFields: {},
                                        });
                                    });
                                    if (!(operationInserts.length > 0)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperation")
                                            .values(operationInserts.map(function (insert) { return (__assign(__assign({}, insert), { makeMethodId: insert.makeMethodId ===
                                                makeMethodByItemId_1[jobMakeMethod_3.data.itemId]
                                                ? makeMethod_5.data.id
                                                : insert.makeMethodId })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 5:
                                    operationIds = _e.sent();
                                    _loop_6 = function (index, operation) {
                                        var operationId, jobOperationTool, jobOperationParameter, jobOperationStep, procedureId;
                                        return __generator(this, function (_f) {
                                            switch (_f.label) {
                                                case 0:
                                                    operationId = operationIds[index].id;
                                                    if (!operationId) return [3 /*break*/, 6];
                                                    jobOperationTool = operation.jobOperationTool, jobOperationParameter = operation.jobOperationParameter, jobOperationStep = operation.jobOperationStep, procedureId = operation.procedureId;
                                                    if (!(parts_1.tools &&
                                                        Array.isArray(jobOperationTool) &&
                                                        jobOperationTool.length > 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationTool")
                                                            .values(jobOperationTool.map(function (tool) { return ({
                                                            toolId: tool.toolId,
                                                            quantity: tool.quantity,
                                                            operationId: operationId,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 1:
                                                    _f.sent();
                                                    _f.label = 2;
                                                case 2:
                                                    if (!!procedureId) return [3 /*break*/, 6];
                                                    if (!(parts_1.parameters &&
                                                        Array.isArray(jobOperationParameter) &&
                                                        jobOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationParameter")
                                                            .values(jobOperationParameter.map(function (param) { return ({
                                                            operationId: operationId,
                                                            key: param.key,
                                                            value: param.value,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 3:
                                                    _f.sent();
                                                    _f.label = 4;
                                                case 4:
                                                    if (!(parts_1.steps &&
                                                        Array.isArray(jobOperationStep) &&
                                                        jobOperationStep.length > 0)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("jobOperationStep")
                                                            .values(jobOperationStep.map(function (_a) {
                                                            var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                            return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                        }))
                                                            .execute()];
                                                case 5:
                                                    _f.sent();
                                                    _f.label = 6;
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = ((_d = jobOperations_1.data) !== null && _d !== void 0 ? _d : []).entries();
                                    _e.label = 6;
                                case 6:
                                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                                    _b = _a[_i], index = _b[0], operation = _b[1];
                                    return [5 /*yield**/, _loop_6(index, operation)];
                                case 7:
                                    _e.sent();
                                    _e.label = 8;
                                case 8:
                                    _i++;
                                    return [3 /*break*/, 6];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 40:
                _42.sent();
                return [3 /*break*/, 80];
            case 41:
                jobId = sourceId;
                if (!jobId) {
                    throw new Error("Invalid sourceId");
                }
                makeMethodId = targetId;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("makeMethod")
                            .select("*")
                            .eq("id", makeMethodId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("jobMakeMethod")
                            .select("*")
                            .eq("jobId", jobId)
                            .is("parentMaterialId", null)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("jobOperationsWithMakeMethods")
                            .select("*, jobOperationTool(*), jobOperationParameter(*), jobOperationStep(*)")
                            .eq("jobId", jobId)
                            .eq("companyId", companyId_1),
                        client_1
                            .from("job")
                            .select("locationId")
                            .eq("id", jobId)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 42:
                _q = _42.sent(), makeMethod_6 = _q[0], jobMakeMethod_4 = _q[1], jobOperations_2 = _q[2], job_4 = _q[3];
                if (makeMethod_6.error) {
                    throw new Error("Failed to get make method");
                }
                if (jobMakeMethod_4.error) {
                    throw new Error("Failed to get job make method");
                }
                if (jobOperations_2.error) {
                    throw new Error("Failed to get job operations");
                }
                itemId_6 = (_24 = makeMethod_6.data) === null || _24 === void 0 ? void 0 : _24.itemId;
                return [4 /*yield*/, Promise.all([
                        (0, methods_ts_1.getJobMethodTree)(client_1, jobMakeMethod_4.data.id),
                        client_1
                            .from("itemReplenishment")
                            .select("*")
                            .eq("itemId", itemId_6)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 43:
                _r = _42.sent(), jobMethodTrees = _r[0], itemReplenishment = _r[1];
                if (itemReplenishment.error) {
                    throw new Error("Failed to get item replenishment");
                }
                if ((_25 = itemReplenishment.data) === null || _25 === void 0 ? void 0 : _25.requiresConfiguration) {
                    throw new Error("Cannot override method of configured item");
                }
                if (jobMethodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                jobMethodTree_2 = (_26 = jobMethodTrees.data) === null || _26 === void 0 ? void 0 : _26[0];
                if (!jobMethodTree_2)
                    throw new Error("Method tree not found");
                madeItemIds_2 = [];
                (0, methods_ts_1.traverseJobMethod)(jobMethodTree_2, function (node) {
                    if (node.data.itemId && node.data.methodType === "Make to Order") {
                        madeItemIds_2.push(node.data.itemId);
                    }
                });
                return [4 /*yield*/, client_1
                        .from("activeMakeMethods")
                        .select("*")
                        .in("itemId", madeItemIds_2)
                        .eq("companyId", companyId_1)];
            case 44:
                makeMethods = _42.sent();
                if (makeMethods.error) {
                    throw new Error("Failed to get make methods");
                }
                makeMethodByItemId_2 = {};
                (_27 = makeMethods.data) === null || _27 === void 0 ? void 0 : _27.forEach(function (m) {
                    if (m.itemId) {
                        // @ts-expect-error - itemId is not null
                        makeMethodByItemId_2[m.itemId] = m.id;
                    }
                });
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var makeMethodsToDelete, materialInserts, operationInserts, operationIds, _loop_7, _i, _a, _b, index, operation;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    makeMethodsToDelete = [];
                                    materialInserts = [];
                                    operationInserts = [];
                                    (0, methods_ts_1.traverseJobMethod)(jobMethodTree_2, function (node) {
                                        if (node.data.itemId && node.data.methodType === "Make to Order") {
                                            makeMethodsToDelete.push(makeMethodByItemId_2[node.data.itemId]);
                                        }
                                        node.children.forEach(function (child) {
                                            var _a;
                                            var _b;
                                            materialInserts.push({
                                                makeMethodId: makeMethodByItemId_2[node.data.itemId],
                                                materialMakeMethodId: makeMethodByItemId_2[child.data.itemId],
                                                itemId: child.data.itemId,
                                                itemType: child.data.itemType,
                                                kit: child.data.kit,
                                                methodType: child.data.methodType,
                                                order: child.data.order,
                                                quantity: child.data.quantity,
                                                unitOfMeasureCode: child.data.unitOfMeasureCode,
                                                storageUnitIds: ((_b = job_4.data) === null || _b === void 0 ? void 0 : _b.locationId)
                                                    ? (_a = {},
                                                        _a[job_4.data.locationId] = child.data.storageUnitId || null,
                                                        _a) : {},
                                                companyId: companyId_1,
                                                createdBy: userId_1,
                                                customFields: {},
                                            });
                                        });
                                    });
                                    if (!(makeMethodsToDelete.length > 0)) return [3 /*break*/, 2];
                                    makeMethodsToDelete = makeMethodsToDelete.map(function (mm) {
                                        return mm === makeMethodByItemId_2[jobMakeMethod_4.data.itemId]
                                            ? makeMethod_6.data.id
                                            : mm;
                                    });
                                    return [4 /*yield*/, Promise.all([
                                            parts_1.billOfMaterial
                                                ? trx
                                                    .deleteFrom("methodMaterial")
                                                    .where("makeMethodId", "in", makeMethodsToDelete)
                                                    .execute()
                                                : Promise.resolve(),
                                            parts_1.billOfProcess
                                                ? trx
                                                    .deleteFrom("methodOperation")
                                                    .where("makeMethodId", "in", makeMethodsToDelete)
                                                    .execute()
                                                : Promise.resolve(),
                                        ])];
                                case 1:
                                    _e.sent();
                                    _e.label = 2;
                                case 2:
                                    if (!(parts_1.billOfMaterial && materialInserts.length > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodMaterial")
                                            .values(materialInserts.map(function (insert) { return (__assign(__assign({}, insert), { productionQuantity: undefined, makeMethodId: insert.makeMethodId ===
                                                makeMethodByItemId_2[jobMakeMethod_4.data.itemId]
                                                ? makeMethod_6.data.id
                                                : insert.makeMethodId, itemId: insert.itemId === jobMakeMethod_4.data.itemId
                                                ? itemId_6
                                                : insert.itemId })); }))
                                            .execute()];
                                case 3:
                                    _e.sent();
                                    _e.label = 4;
                                case 4:
                                    if (!parts_1.billOfProcess) return [3 /*break*/, 9];
                                    (_c = jobOperations_2.data) === null || _c === void 0 ? void 0 : _c.forEach(function (op) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                                        operationInserts.push({
                                            makeMethodId: op.makeMethodId,
                                            processId: op.processId,
                                            procedureId: op.procedureId,
                                            // workCenterId: op.workCenterId,
                                            description: (_a = op.description) !== null && _a !== void 0 ? _a : "",
                                            setupTime: (_b = op.setupTime) !== null && _b !== void 0 ? _b : 0,
                                            setupUnit: (_c = op.setupUnit) !== null && _c !== void 0 ? _c : "Total Minutes",
                                            laborTime: (_d = op.laborTime) !== null && _d !== void 0 ? _d : 0,
                                            laborUnit: (_e = op.laborUnit) !== null && _e !== void 0 ? _e : "Minutes/Piece",
                                            machineTime: (_f = op.machineTime) !== null && _f !== void 0 ? _f : 0,
                                            machineUnit: (_g = op.machineUnit) !== null && _g !== void 0 ? _g : "Minutes/Piece",
                                            order: (_h = op.order) !== null && _h !== void 0 ? _h : 1,
                                            operationOrder: (_j = op.operationOrder) !== null && _j !== void 0 ? _j : "After Previous",
                                            operationType: (_k = op.operationType) !== null && _k !== void 0 ? _k : "Inside",
                                            operationMinimumCost: (_l = op.operationMinimumCost) !== null && _l !== void 0 ? _l : 0,
                                            operationLeadTime: (_m = op.operationLeadTime) !== null && _m !== void 0 ? _m : 0,
                                            operationUnitCost: (_o = op.operationUnitCost) !== null && _o !== void 0 ? _o : 0,
                                            operationSupplierProcessId: op.operationSupplierProcessId,
                                            tags: (_p = op.tags) !== null && _p !== void 0 ? _p : [],
                                            workInstruction: parts_1.workInstructions ? op.workInstruction : {},
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            customFields: {},
                                        });
                                    });
                                    if (!(operationInserts.length > 0)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperation")
                                            .values(operationInserts.map(function (insert) { return (__assign(__assign({}, insert), { makeMethodId: insert.makeMethodId ===
                                                makeMethodByItemId_2[jobMakeMethod_4.data.itemId]
                                                ? makeMethod_6.data.id
                                                : insert.makeMethodId })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 5:
                                    operationIds = _e.sent();
                                    _loop_7 = function (index, operation) {
                                        var operationId, jobOperationTool, jobOperationParameter, jobOperationStep, procedureId;
                                        return __generator(this, function (_f) {
                                            switch (_f.label) {
                                                case 0:
                                                    operationId = operationIds[index].id;
                                                    if (!operationId) return [3 /*break*/, 6];
                                                    jobOperationTool = operation.jobOperationTool, jobOperationParameter = operation.jobOperationParameter, jobOperationStep = operation.jobOperationStep, procedureId = operation.procedureId;
                                                    if (!(parts_1.tools &&
                                                        Array.isArray(jobOperationTool) &&
                                                        jobOperationTool.length > 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationTool")
                                                            .values(jobOperationTool.map(function (tool) { return ({
                                                            toolId: tool.toolId,
                                                            quantity: tool.quantity,
                                                            operationId: operationId,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 1:
                                                    _f.sent();
                                                    _f.label = 2;
                                                case 2:
                                                    if (!!procedureId) return [3 /*break*/, 6];
                                                    if (!(parts_1.parameters &&
                                                        Array.isArray(jobOperationParameter) &&
                                                        jobOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationParameter")
                                                            .values(jobOperationParameter.map(function (param) { return ({
                                                            operationId: operationId,
                                                            key: param.key,
                                                            value: param.value,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 3:
                                                    _f.sent();
                                                    _f.label = 4;
                                                case 4:
                                                    if (!(parts_1.steps &&
                                                        Array.isArray(jobOperationStep) &&
                                                        jobOperationStep.length > 0)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationStep")
                                                            .values(jobOperationStep.map(function (step) { return ({
                                                            operationId: operationId,
                                                            name: step.name,
                                                            type: step.type,
                                                            description: (0, tiptap_ts_1.toTiptapDoc)(step.description),
                                                            required: step.required,
                                                            sortOrder: step.sortOrder,
                                                            unitOfMeasureCode: step.unitOfMeasureCode,
                                                            minValue: step.minValue,
                                                            maxValue: step.maxValue,
                                                            listValues: step.listValues,
                                                            fileTypes: step.fileTypes,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 5:
                                                    _f.sent();
                                                    _f.label = 6;
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = ((_d = jobOperations_2.data) !== null && _d !== void 0 ? _d : []).entries();
                                    _e.label = 6;
                                case 6:
                                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                                    _b = _a[_i], index = _b[0], operation = _b[1];
                                    return [5 /*yield**/, _loop_7(index, operation)];
                                case 7:
                                    _e.sent();
                                    _e.label = 8;
                                case 8:
                                    _i++;
                                    return [3 /*break*/, 6];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 45:
                _42.sent();
                return [3 /*break*/, 80];
            case 46: return [4 /*yield*/, Promise.all([
                    client_1
                        .from("makeMethod")
                        .select("*")
                        .eq("id", sourceId)
                        .eq("companyId", companyId_1)
                        .single(),
                    client_1
                        .from("makeMethod")
                        .select("*")
                        .eq("id", targetId)
                        .eq("companyId", companyId_1)
                        .single(),
                ])];
            case 47:
                _s = _42.sent(), sourceMakeMethod = _s[0], targetMakeMethod_2 = _s[1];
                if (sourceMakeMethod.error || targetMakeMethod_2.error) {
                    throw new Error("Failed to get make methods");
                }
                return [4 /*yield*/, Promise.all([
                        parts_1.billOfMaterial
                            ? client_1
                                .from("methodMaterial")
                                .select("*")
                                .eq("makeMethodId", sourceMakeMethod.data.id)
                                .eq("companyId", companyId_1)
                            : Promise.resolve({ data: [], error: null }),
                        parts_1.billOfProcess
                            ? client_1
                                .from("methodOperation")
                                .select("*, methodOperationTool(*), methodOperationParameter(*), methodOperationStep(*)")
                                .eq("makeMethodId", sourceMakeMethod.data.id)
                                .eq("companyId", companyId_1)
                            : Promise.resolve({ data: [], error: null }),
                    ])];
            case 48:
                _t = _42.sent(), sourceMaterials_2 = _t[0], sourceOperations_2 = _t[1];
                if (sourceMaterials_2.error || sourceOperations_2.error) {
                    throw new Error("Failed to get source materials or operations");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var operationIds, _loop_8, _a, _b, _c, e_5_1;
                        var _d, e_5, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0: 
                                // Delete existing materials and operations from target method
                                return [4 /*yield*/, Promise.all([
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("methodMaterial")
                                                .where("makeMethodId", "=", targetMakeMethod_2.data.id)
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfProcess
                                            ? trx
                                                .deleteFrom("methodOperation")
                                                .where("makeMethodId", "=", targetMakeMethod_2.data.id)
                                                .execute()
                                            : Promise.resolve(),
                                    ])];
                                case 1:
                                    // Delete existing materials and operations from target method
                                    _g.sent();
                                    if (!(parts_1.billOfMaterial && sourceMaterials_2.data && sourceMaterials_2.data.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodMaterial")
                                            .values(sourceMaterials_2.data.map(function (material) { return (__assign(__assign({}, material), { productionQuantity: undefined, id: undefined, makeMethodId: targetMakeMethod_2.data.id, createdBy: userId_1 })); }))
                                            .execute()];
                                case 2:
                                    _g.sent();
                                    _g.label = 3;
                                case 3:
                                    if (!(parts_1.billOfProcess && sourceOperations_2.data && sourceOperations_2.data.length > 0)) return [3 /*break*/, 17];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperation")
                                            .values(sourceOperations_2.data.map(function (_a) {
                                            var _tools = _a.methodOperationTool, _parameters = _a.methodOperationParameter, _attributes = _a.methodOperationStep, operation = __rest(_a, ["methodOperationTool", "methodOperationParameter", "methodOperationStep"]);
                                            var insert = __assign(__assign({}, operation), { id: undefined, makeMethodId: targetMakeMethod_2.data.id, createdBy: userId_1 });
                                            if (!parts_1.workInstructions) {
                                                insert.workInstruction = {};
                                            }
                                            return insert;
                                        }))
                                            .returning(["id"])
                                            .execute()];
                                case 4:
                                    operationIds = _g.sent();
                                    _g.label = 5;
                                case 5:
                                    _g.trys.push([5, 11, 12, 17]);
                                    _loop_8 = function () {
                                        var index, operation, methodOperationTool, methodOperationParameter, methodOperationStep, procedureId, operationId;
                                        return __generator(this, function (_h) {
                                            switch (_h.label) {
                                                case 0:
                                                    _f = _c.value;
                                                    _a = false;
                                                    index = _f[0], operation = _f[1];
                                                    methodOperationTool = operation.methodOperationTool, methodOperationParameter = operation.methodOperationParameter, methodOperationStep = operation.methodOperationStep, procedureId = operation.procedureId;
                                                    operationId = operationIds[index].id;
                                                    if (!(parts_1.tools &&
                                                        operationId &&
                                                        Array.isArray(methodOperationTool) &&
                                                        methodOperationTool.length > 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationTool")
                                                            .values(methodOperationTool.map(function (tool) { return ({
                                                            toolId: tool.toolId,
                                                            quantity: tool.quantity,
                                                            operationId: operationId,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 1:
                                                    _h.sent();
                                                    _h.label = 2;
                                                case 2:
                                                    if (!!procedureId) return [3 /*break*/, 6];
                                                    if (!(parts_1.parameters &&
                                                        Array.isArray(methodOperationParameter) &&
                                                        methodOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationParameter")
                                                            .values(methodOperationParameter.map(function (param) { return ({
                                                            operationId: operationId,
                                                            key: param.key,
                                                            value: param.value,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 3:
                                                    _h.sent();
                                                    _h.label = 4;
                                                case 4:
                                                    if (!(parts_1.steps &&
                                                        Array.isArray(methodOperationStep) &&
                                                        methodOperationStep.length > 0)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationStep")
                                                            .values(methodOperationStep.map(function (_a) {
                                                            var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                            return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                        }))
                                                            .execute()];
                                                case 5:
                                                    _h.sent();
                                                    _h.label = 6;
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a = true, _b = __asyncValues(sourceOperations_2.data.entries());
                                    _g.label = 6;
                                case 6: return [4 /*yield*/, _b.next()];
                                case 7:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 10];
                                    return [5 /*yield**/, _loop_8()];
                                case 8:
                                    _g.sent();
                                    _g.label = 9;
                                case 9:
                                    _a = true;
                                    return [3 /*break*/, 6];
                                case 10: return [3 /*break*/, 17];
                                case 11:
                                    e_5_1 = _g.sent();
                                    e_5 = { error: e_5_1 };
                                    return [3 /*break*/, 17];
                                case 12:
                                    _g.trys.push([12, , 15, 16]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 14];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 13:
                                    _g.sent();
                                    _g.label = 14;
                                case 14: return [3 /*break*/, 16];
                                case 15:
                                    if (e_5) throw e_5.error;
                                    return [7 /*endfinally*/];
                                case 16: return [7 /*endfinally*/];
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 49:
                _42.sent();
                return [3 /*break*/, 80];
            case 50:
                procedureId_1 = sourceId;
                operationId_1 = targetId;
                if (!procedureId_1) {
                    throw new Error("Invalid sourceId");
                }
                if (!operationId_1) {
                    throw new Error("Invalid targetId");
                }
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("procedure")
                            .select("*, procedureStep(*), procedureParameter(*)")
                            .eq("id", procedureId_1)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("jobOperation")
                            .select("*, jobOperationStep(*)")
                            .eq("id", operationId_1)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 51:
                _u = _42.sent(), procedure_1 = _u[0], operation = _u[1];
                if (procedure_1.error) {
                    throw new Error("Failed to get procedure");
                }
                if (operation.error) {
                    throw new Error("Failed to get operation");
                }
                existingSteps_1 = (_29 = (_28 = operation.data) === null || _28 === void 0 ? void 0 : _28.jobOperationStep) !== null && _29 !== void 0 ? _29 : [];
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _loop_9, _i, existingSteps_2, existingStep, newSteps;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_9 = function (existingStep) {
                                        var matchingProcedureStep;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    matchingProcedureStep = procedure_1.data.procedureStep.find(function (pa) {
                                                        return pa.name === existingStep.name && pa.type === existingStep.type;
                                                    });
                                                    if (!matchingProcedureStep) return [3 /*break*/, 2];
                                                    // Update matching attribute
                                                    return [4 /*yield*/, trx
                                                            .updateTable("jobOperationStep")
                                                            .set({
                                                            description: matchingProcedureStep.description,
                                                            minValue: matchingProcedureStep.minValue,
                                                            maxValue: matchingProcedureStep.maxValue,
                                                            updatedAt: new Date().toISOString(),
                                                            updatedBy: userId_1,
                                                        })
                                                            .where("id", "=", existingStep.id)
                                                            .execute()];
                                                case 1:
                                                    // Update matching attribute
                                                    _b.sent();
                                                    return [3 /*break*/, 4];
                                                case 2: 
                                                // Delete non-matching attribute
                                                return [4 /*yield*/, trx
                                                        .deleteFrom("jobOperationStep")
                                                        .where("id", "=", existingStep.id)
                                                        .execute()];
                                                case 3:
                                                    // Delete non-matching attribute
                                                    _b.sent();
                                                    _b.label = 4;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, existingSteps_2 = existingSteps_1;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < existingSteps_2.length)) return [3 /*break*/, 4];
                                    existingStep = existingSteps_2[_i];
                                    return [5 /*yield**/, _loop_9(existingStep)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: 
                                // Delete all existing parameters
                                return [4 /*yield*/, trx
                                        .deleteFrom("jobOperationParameter")
                                        .where("operationId", "=", operationId_1)
                                        .execute()];
                                case 5:
                                    // Delete all existing parameters
                                    _a.sent();
                                    newSteps = procedure_1.data.procedureStep.filter(function (pa) {
                                        return !existingSteps_1.some(function (ea) { return ea.name === pa.name && ea.type === pa.type; });
                                    });
                                    if (!(newSteps.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto("jobOperationStep")
                                            .values(newSteps.map(function (attr) { return ({
                                            operationId: operationId_1,
                                            name: attr.name,
                                            type: attr.type,
                                            description: (0, tiptap_ts_1.toTiptapDoc)(attr.description),
                                            minValue: attr.minValue,
                                            maxValue: attr.maxValue,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            updatedBy: userId_1,
                                        }); }))
                                            .execute()];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7:
                                    if (!(procedure_1.data.procedureParameter.length > 0)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, trx
                                            .insertInto("jobOperationParameter")
                                            .values(procedure_1.data.procedureParameter.map(function (param) { return ({
                                            operationId: operationId_1,
                                            companyId: companyId_1,
                                            key: param.key,
                                            value: param.value,
                                            createdBy: userId_1,
                                            updatedBy: userId_1,
                                        }); }))
                                            .execute()];
                                case 8:
                                    _a.sent();
                                    _a.label = 9;
                                case 9: 
                                // update work instruction
                                return [4 /*yield*/, trx
                                        .updateTable("jobOperation")
                                        .set({
                                        workInstruction: procedure_1.data.content,
                                        procedureId: procedureId_1,
                                    })
                                        .where("id", "=", operationId_1)
                                        .execute()];
                                case 10:
                                    // update work instruction
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 52:
                _42.sent();
                return [3 /*break*/, 80];
            case 53:
                _v = sourceId.split(":"), quoteId = _v[0], quoteLineId = _v[1];
                if (!quoteId || !quoteLineId) {
                    throw new Error("Invalid sourceId");
                }
                makeMethodId = targetId;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("makeMethod")
                            .select("*")
                            .eq("id", makeMethodId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteMakeMethod")
                            .select("*")
                            .eq("quoteLineId", quoteLineId)
                            .is("parentMaterialId", null)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteOperationsWithMakeMethods")
                            .select("*, quoteOperationTool(*), quoteOperationParameter(*), quoteOperationStep(*)")
                            .eq("quoteLineId", quoteLineId)
                            .eq("companyId", companyId_1),
                    ])];
            case 54:
                _w = _42.sent(), makeMethod_7 = _w[0], quoteMakeMethod_3 = _w[1], quoteOperations_1 = _w[2];
                if (makeMethod_7.error) {
                    throw new Error("Failed to get make method");
                }
                if (quoteMakeMethod_3.error) {
                    throw new Error("Failed to get quote make method");
                }
                if (quoteOperations_1.error) {
                    throw new Error("Failed to get quote operations");
                }
                itemId_7 = (_30 = makeMethod_7.data) === null || _30 === void 0 ? void 0 : _30.itemId;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("quote")
                            .select("locationId")
                            .eq("id", quoteId)
                            .eq("companyId", companyId_1)
                            .single(),
                        (0, methods_ts_1.getQuoteMethodTree)(client_1, quoteMakeMethod_3.data.id),
                        client_1
                            .from("itemReplenishment")
                            .select("*")
                            .eq("itemId", itemId_7)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 55:
                _x = _42.sent(), quote_1 = _x[0], quoteMethodTrees = _x[1], itemReplenishment = _x[2];
                if (quoteMethodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                if (itemReplenishment.error) {
                    throw new Error("Failed to get item replenishment");
                }
                if ((_31 = itemReplenishment.data) === null || _31 === void 0 ? void 0 : _31.requiresConfiguration) {
                    throw new Error("Cannot override method of configured item");
                }
                quoteMethodTree_1 = (_32 = quoteMethodTrees
                    .data) === null || _32 === void 0 ? void 0 : _32[0];
                if (!quoteMethodTree_1)
                    throw new Error("Method tree not found");
                madeItemIds_3 = [];
                return [4 /*yield*/, (0, methods_ts_1.traverseQuoteMethod)(quoteMethodTree_1, function (node) {
                        if (node.data.itemId && node.data.methodType === "Make to Order") {
                            madeItemIds_3.push(node.data.itemId);
                        }
                    })];
            case 56:
                _42.sent();
                return [4 /*yield*/, client_1
                        .from("activeMakeMethods")
                        .select("*")
                        .in("itemId", madeItemIds_3)
                        .eq("companyId", companyId_1)];
            case 57:
                makeMethods = _42.sent();
                if (makeMethods.error) {
                    throw new Error("Failed to get make methods");
                }
                makeMethodByItemId_3 = {};
                (_33 = makeMethods.data) === null || _33 === void 0 ? void 0 : _33.forEach(function (m) {
                    if (m.itemId) {
                        // @ts-expect-error - itemId is not null
                        makeMethodByItemId_3[m.itemId] = m.id;
                    }
                });
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var makeMethodsToDelete, materialInserts, operationInserts, operationIds, _loop_10, _i, _a, _b, index, operation;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    makeMethodsToDelete = [];
                                    materialInserts = [];
                                    operationInserts = [];
                                    return [4 /*yield*/, (0, methods_ts_1.traverseQuoteMethod)(quoteMethodTree_1, function (node) {
                                            if (node.data.itemId && node.data.methodType === "Make to Order") {
                                                makeMethodsToDelete.push(makeMethodByItemId_3[node.data.itemId]);
                                            }
                                            node.children.forEach(function (child) {
                                                var _a;
                                                var _b;
                                                materialInserts.push({
                                                    makeMethodId: makeMethodByItemId_3[node.data.itemId],
                                                    materialMakeMethodId: makeMethodByItemId_3[child.data.itemId],
                                                    itemId: child.data.itemId,
                                                    itemType: child.data.itemType,
                                                    kit: child.data.kit,
                                                    methodType: child.data.methodType,
                                                    order: child.data.order,
                                                    quantity: child.data.quantity,
                                                    storageUnitIds: ((_b = quote_1.data) === null || _b === void 0 ? void 0 : _b.locationId)
                                                        ? // @ts-ignore: storageUnitIds is a dynamic object with location keys
                                                         (_a = {}, _a[quote_1.data.locationId] = child.data.storageUnitId || null, _a) : {},
                                                    unitOfMeasureCode: child.data.unitOfMeasureCode,
                                                    companyId: companyId_1,
                                                    createdBy: userId_1,
                                                    customFields: {},
                                                });
                                            });
                                        })];
                                case 1:
                                    _e.sent();
                                    if (!(makeMethodsToDelete.length > 0)) return [3 /*break*/, 3];
                                    makeMethodsToDelete = makeMethodsToDelete.map(function (mm) {
                                        return mm === makeMethodByItemId_3[quoteMakeMethod_3.data.itemId]
                                            ? makeMethod_7.data.id
                                            : mm;
                                    });
                                    return [4 /*yield*/, Promise.all([
                                            parts_1.billOfMaterial
                                                ? trx
                                                    .deleteFrom("methodMaterial")
                                                    .where("makeMethodId", "in", makeMethodsToDelete)
                                                    .execute()
                                                : Promise.resolve(),
                                            parts_1.billOfProcess
                                                ? trx
                                                    .deleteFrom("methodOperation")
                                                    .where("makeMethodId", "in", makeMethodsToDelete)
                                                    .execute()
                                                : Promise.resolve(),
                                        ])];
                                case 2:
                                    _e.sent();
                                    _e.label = 3;
                                case 3:
                                    if (!(parts_1.billOfMaterial && materialInserts.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodMaterial")
                                            .values(materialInserts.map(function (insert) { return (__assign(__assign({}, insert), { productionQuantity: undefined, makeMethodId: insert.makeMethodId ===
                                                makeMethodByItemId_3[quoteMakeMethod_3.data.itemId]
                                                ? makeMethod_7.data.id
                                                : insert.makeMethodId, itemId: insert.itemId === quoteMakeMethod_3.data.itemId
                                                ? itemId_7
                                                : insert.itemId })); }))
                                            .execute()];
                                case 4:
                                    _e.sent();
                                    _e.label = 5;
                                case 5:
                                    if (!parts_1.billOfProcess) return [3 /*break*/, 10];
                                    (_c = quoteOperations_1.data) === null || _c === void 0 ? void 0 : _c.forEach(function (op) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                                        operationInserts.push({
                                            makeMethodId: op.makeMethodId,
                                            processId: op.processId,
                                            procedureId: op.procedureId,
                                            workCenterId: op.workCenterId,
                                            description: (_a = op.description) !== null && _a !== void 0 ? _a : "",
                                            setupTime: (_b = op.setupTime) !== null && _b !== void 0 ? _b : 0,
                                            setupUnit: (_c = op.setupUnit) !== null && _c !== void 0 ? _c : "Total Minutes",
                                            laborTime: (_d = op.laborTime) !== null && _d !== void 0 ? _d : 0,
                                            laborUnit: (_e = op.laborUnit) !== null && _e !== void 0 ? _e : "Minutes/Piece",
                                            machineTime: (_f = op.machineTime) !== null && _f !== void 0 ? _f : 0,
                                            machineUnit: (_g = op.machineUnit) !== null && _g !== void 0 ? _g : "Minutes/Piece",
                                            order: (_h = op.order) !== null && _h !== void 0 ? _h : 1,
                                            operationOrder: (_j = op.operationOrder) !== null && _j !== void 0 ? _j : "After Previous",
                                            operationType: (_k = op.operationType) !== null && _k !== void 0 ? _k : "Inside",
                                            operationMinimumCost: (_l = op.operationMinimumCost) !== null && _l !== void 0 ? _l : 0,
                                            operationLeadTime: (_m = op.operationLeadTime) !== null && _m !== void 0 ? _m : 0,
                                            operationUnitCost: (_o = op.operationUnitCost) !== null && _o !== void 0 ? _o : 0,
                                            tags: (_p = op.tags) !== null && _p !== void 0 ? _p : [],
                                            workInstruction: parts_1.workInstructions ? op.workInstruction : {},
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            customFields: {},
                                        });
                                    });
                                    if (!(operationInserts.length > 0)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperation")
                                            .values(operationInserts.map(function (insert) { return (__assign(__assign({}, insert), { makeMethodId: insert.makeMethodId ===
                                                makeMethodByItemId_3[quoteMakeMethod_3.data.itemId]
                                                ? makeMethod_7.data.id
                                                : insert.makeMethodId })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 6:
                                    operationIds = _e.sent();
                                    _loop_10 = function (index, operation) {
                                        var operationId, quoteOperationTool, quoteOperationParameter, quoteOperationStep, procedureId;
                                        return __generator(this, function (_f) {
                                            switch (_f.label) {
                                                case 0:
                                                    operationId = operationIds[index].id;
                                                    if (!operationId) return [3 /*break*/, 6];
                                                    quoteOperationTool = operation.quoteOperationTool, quoteOperationParameter = operation.quoteOperationParameter, quoteOperationStep = operation.quoteOperationStep, procedureId = operation.procedureId;
                                                    if (!(parts_1.tools &&
                                                        Array.isArray(quoteOperationTool) &&
                                                        quoteOperationTool.length > 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationTool")
                                                            .values(quoteOperationTool.map(function (tool) { return ({
                                                            toolId: tool.toolId,
                                                            quantity: tool.quantity,
                                                            operationId: operationId,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 1:
                                                    _f.sent();
                                                    _f.label = 2;
                                                case 2:
                                                    if (!!procedureId) return [3 /*break*/, 6];
                                                    if (!(parts_1.parameters &&
                                                        Array.isArray(quoteOperationParameter) &&
                                                        quoteOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationParameter")
                                                            .values(quoteOperationParameter.map(function (param) { return ({
                                                            operationId: operationId,
                                                            key: param.key,
                                                            value: param.value,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 3:
                                                    _f.sent();
                                                    _f.label = 4;
                                                case 4:
                                                    if (!(parts_1.steps &&
                                                        Array.isArray(quoteOperationStep) &&
                                                        quoteOperationStep.length > 0)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationStep")
                                                            .values(quoteOperationStep.map(function (_a) {
                                                            var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                            return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                        }))
                                                            .execute()];
                                                case 5:
                                                    _f.sent();
                                                    _f.label = 6;
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = ((_d = quoteOperations_1.data) !== null && _d !== void 0 ? _d : []).entries();
                                    _e.label = 7;
                                case 7:
                                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                                    _b = _a[_i], index = _b[0], operation = _b[1];
                                    return [5 /*yield**/, _loop_10(index, operation)];
                                case 8:
                                    _e.sent();
                                    _e.label = 9;
                                case 9:
                                    _i++;
                                    return [3 /*break*/, 7];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 58:
                _42.sent();
                return [3 /*break*/, 80];
            case 59:
                quoteMakeMethodId = sourceId;
                makeMethodId = targetId;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("makeMethod")
                            .select("*")
                            .eq("id", makeMethodId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteMakeMethod")
                            .select("*")
                            .eq("id", quoteMakeMethodId)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 60:
                _y = _42.sent(), makeMethod_8 = _y[0], quoteMakeMethod_4 = _y[1];
                if (makeMethod_8.error) {
                    throw new Error("Failed to get make method");
                }
                if (quoteMakeMethod_4.error) {
                    throw new Error("Failed to get quote make method");
                }
                itemId_8 = (_34 = makeMethod_8.data) === null || _34 === void 0 ? void 0 : _34.itemId;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("quoteOperationsWithMakeMethods")
                            .select("*, quoteOperationTool(*), quoteOperationParameter(*), quoteOperationStep(*)")
                            .eq("quoteLineId", quoteMakeMethod_4.data.quoteLineId)
                            .eq("companyId", companyId_1),
                        client_1
                            .from("itemReplenishment")
                            .select("*")
                            .eq("itemId", itemId_8)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 61:
                _z = _42.sent(), quoteOperations_2 = _z[0], itemReplenishment = _z[1];
                if (quoteOperations_2.error) {
                    throw new Error("Failed to get quote operations");
                }
                if (itemReplenishment.error) {
                    throw new Error("Failed to get item replenishment");
                }
                if ((_35 = itemReplenishment.data) === null || _35 === void 0 ? void 0 : _35.requiresConfiguration) {
                    throw new Error("Cannot override method of configured item");
                }
                return [4 /*yield*/, Promise.all([
                        (0, methods_ts_1.getQuoteMethodTree)(client_1, quoteMakeMethodId, quoteMakeMethod_4.data.parentMaterialId),
                    ])];
            case 62:
                quoteMethodTrees = (_42.sent())[0];
                if (quoteMethodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                if (quoteMethodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                quoteMethodTree_2 = (_36 = quoteMethodTrees
                    .data) === null || _36 === void 0 ? void 0 : _36[0];
                if (!quoteMethodTree_2)
                    throw new Error("Job method tree not found");
                madeItemIds_4 = [];
                (0, methods_ts_1.traverseQuoteMethod)(quoteMethodTree_2, function (node) {
                    if (node.data.itemId && node.data.methodType === "Make to Order") {
                        madeItemIds_4.push(node.data.itemId);
                    }
                });
                return [4 /*yield*/, client_1
                        .from("activeMakeMethods")
                        .select("*")
                        .in("itemId", madeItemIds_4)
                        .eq("companyId", companyId_1)];
            case 63:
                makeMethods = _42.sent();
                if (makeMethods.error) {
                    throw new Error("Failed to get make methods");
                }
                makeMethodByItemId_4 = {};
                (_37 = makeMethods.data) === null || _37 === void 0 ? void 0 : _37.forEach(function (m) {
                    if (m.itemId) {
                        // @ts-expect-error - itemId is not null
                        makeMethodByItemId_4[m.itemId] = m.id;
                    }
                });
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var makeMethodsToDelete, materialInserts, operationInserts, operationIds, _loop_11, _i, _a, _b, index, operation;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    makeMethodsToDelete = [];
                                    materialInserts = [];
                                    operationInserts = [];
                                    return [4 /*yield*/, (0, methods_ts_1.traverseQuoteMethod)(quoteMethodTree_2, function (node) {
                                            if (node.data.itemId && node.data.methodType === "Make to Order") {
                                                makeMethodsToDelete.push(makeMethodByItemId_4[node.data.itemId]);
                                            }
                                            node.children.forEach(function (child) {
                                                materialInserts.push({
                                                    makeMethodId: makeMethodByItemId_4[node.data.itemId],
                                                    materialMakeMethodId: makeMethodByItemId_4[child.data.itemId],
                                                    itemId: child.data.itemId,
                                                    kit: child.data.kit,
                                                    itemType: child.data.itemType,
                                                    methodType: child.data.methodType,
                                                    order: child.data.order,
                                                    quantity: child.data.quantity,
                                                    unitOfMeasureCode: child.data.unitOfMeasureCode,
                                                    companyId: companyId_1,
                                                    createdBy: userId_1,
                                                    customFields: {},
                                                });
                                            });
                                        })];
                                case 1:
                                    _e.sent();
                                    if (!(makeMethodsToDelete.length > 0)) return [3 /*break*/, 3];
                                    makeMethodsToDelete = makeMethodsToDelete.map(function (mm) {
                                        return mm === makeMethodByItemId_4[quoteMakeMethod_4.data.itemId]
                                            ? makeMethod_8.data.id
                                            : mm;
                                    });
                                    return [4 /*yield*/, Promise.all([
                                            parts_1.billOfMaterial
                                                ? trx
                                                    .deleteFrom("methodMaterial")
                                                    .where("makeMethodId", "in", makeMethodsToDelete)
                                                    .execute()
                                                : Promise.resolve(),
                                            parts_1.billOfProcess
                                                ? trx
                                                    .deleteFrom("methodOperation")
                                                    .where("makeMethodId", "in", makeMethodsToDelete)
                                                    .execute()
                                                : Promise.resolve(),
                                        ])];
                                case 2:
                                    _e.sent();
                                    _e.label = 3;
                                case 3:
                                    if (!(parts_1.billOfMaterial && materialInserts.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodMaterial")
                                            .values(materialInserts.map(function (insert) { return (__assign(__assign({}, insert), { productionQuantity: undefined, makeMethodId: insert.makeMethodId ===
                                                makeMethodByItemId_4[quoteMakeMethod_4.data.itemId]
                                                ? makeMethod_8.data.id
                                                : insert.makeMethodId, itemId: insert.itemId === quoteMakeMethod_4.data.itemId
                                                ? itemId_8
                                                : insert.itemId })); }))
                                            .execute()];
                                case 4:
                                    _e.sent();
                                    _e.label = 5;
                                case 5:
                                    if (!parts_1.billOfProcess) return [3 /*break*/, 10];
                                    (_c = quoteOperations_2.data) === null || _c === void 0 ? void 0 : _c.forEach(function (op) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                                        operationInserts.push({
                                            makeMethodId: op.makeMethodId,
                                            processId: op.processId,
                                            procedureId: op.procedureId,
                                            workCenterId: op.workCenterId,
                                            description: (_a = op.description) !== null && _a !== void 0 ? _a : "",
                                            setupTime: (_b = op.setupTime) !== null && _b !== void 0 ? _b : 0,
                                            setupUnit: (_c = op.setupUnit) !== null && _c !== void 0 ? _c : "Total Minutes",
                                            laborTime: (_d = op.laborTime) !== null && _d !== void 0 ? _d : 0,
                                            laborUnit: (_e = op.laborUnit) !== null && _e !== void 0 ? _e : "Minutes/Piece",
                                            machineTime: (_f = op.machineTime) !== null && _f !== void 0 ? _f : 0,
                                            machineUnit: (_g = op.machineUnit) !== null && _g !== void 0 ? _g : "Minutes/Piece",
                                            order: (_h = op.order) !== null && _h !== void 0 ? _h : 1,
                                            operationOrder: (_j = op.operationOrder) !== null && _j !== void 0 ? _j : "After Previous",
                                            operationType: (_k = op.operationType) !== null && _k !== void 0 ? _k : "Inside",
                                            operationMinimumCost: (_l = op.operationMinimumCost) !== null && _l !== void 0 ? _l : 0,
                                            operationLeadTime: (_m = op.operationLeadTime) !== null && _m !== void 0 ? _m : 0,
                                            operationUnitCost: (_o = op.operationUnitCost) !== null && _o !== void 0 ? _o : 0,
                                            tags: (_p = op.tags) !== null && _p !== void 0 ? _p : [],
                                            workInstruction: parts_1.workInstructions ? op.workInstruction : {},
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            customFields: {},
                                        });
                                    });
                                    if (!(operationInserts.length > 0)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperation")
                                            .values(operationInserts.map(function (insert) { return (__assign(__assign({}, insert), { makeMethodId: insert.makeMethodId ===
                                                makeMethodByItemId_4[quoteMakeMethod_4.data.itemId]
                                                ? makeMethod_8.data.id
                                                : insert.makeMethodId })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 6:
                                    operationIds = _e.sent();
                                    _loop_11 = function (index, operation) {
                                        var operationId, quoteOperationTool, quoteOperationParameter, quoteOperationStep, procedureId;
                                        return __generator(this, function (_f) {
                                            switch (_f.label) {
                                                case 0:
                                                    operationId = operationIds[index].id;
                                                    if (!operationId) return [3 /*break*/, 6];
                                                    quoteOperationTool = operation.quoteOperationTool, quoteOperationParameter = operation.quoteOperationParameter, quoteOperationStep = operation.quoteOperationStep, procedureId = operation.procedureId;
                                                    if (!(parts_1.tools &&
                                                        Array.isArray(quoteOperationTool) &&
                                                        quoteOperationTool.length > 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationTool")
                                                            .values(quoteOperationTool.map(function (tool) { return ({
                                                            toolId: tool.toolId,
                                                            quantity: tool.quantity,
                                                            operationId: operationId,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 1:
                                                    _f.sent();
                                                    _f.label = 2;
                                                case 2:
                                                    if (!!procedureId) return [3 /*break*/, 6];
                                                    if (!(parts_1.parameters &&
                                                        Array.isArray(quoteOperationParameter) &&
                                                        quoteOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationParameter")
                                                            .values(quoteOperationParameter.map(function (param) { return ({
                                                            operationId: operationId,
                                                            key: param.key,
                                                            value: param.value,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 3:
                                                    _f.sent();
                                                    _f.label = 4;
                                                case 4:
                                                    if (!(parts_1.steps &&
                                                        Array.isArray(quoteOperationStep) &&
                                                        quoteOperationStep.length > 0)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("methodOperationStep")
                                                            .values(quoteOperationStep.map(function (_a) {
                                                            var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                            return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                        }))
                                                            .execute()];
                                                case 5:
                                                    _f.sent();
                                                    _f.label = 6;
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = ((_d = quoteOperations_2.data) !== null && _d !== void 0 ? _d : []).entries();
                                    _e.label = 7;
                                case 7:
                                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                                    _b = _a[_i], index = _b[0], operation = _b[1];
                                    return [5 /*yield**/, _loop_11(index, operation)];
                                case 8:
                                    _e.sent();
                                    _e.label = 9;
                                case 9:
                                    _i++;
                                    return [3 /*break*/, 7];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 64:
                _42.sent();
                return [3 /*break*/, 80];
            case 65:
                jobId_2 = targetId;
                if (!jobId_2) {
                    throw new Error("Invalid targetId");
                }
                _0 = sourceId.split(":"), quoteId = _0[0], quoteLineId = _0[1];
                if (!quoteId || !quoteLineId) {
                    throw new Error("Invalid sourceId");
                }
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("job")
                            .select("locationId, quantity")
                            .eq("id", jobId_2)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("jobMakeMethod")
                            .select("*")
                            .eq("jobId", jobId_2)
                            .is("parentMaterialId", null)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteMakeMethod")
                            .select("*")
                            .is("parentMaterialId", null)
                            .eq("quoteLineId", quoteLineId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteMaterial")
                            .select("*")
                            .eq("quoteLineId", quoteLineId)
                            .eq("companyId", companyId_1),
                        client_1
                            .from("quoteOperation")
                            .select("*, quoteOperationTool(*), quoteOperationParameter(*), quoteOperationStep(*)")
                            .eq("quoteLineId", quoteLineId)
                            .eq("companyId", companyId_1),
                    ])];
            case 66:
                _1 = _42.sent(), job_5 = _1[0], jobMakeMethod_5 = _1[1], quoteMakeMethod_5 = _1[2], quoteMaterials = _1[3], quoteOperations_3 = _1[4];
                if (job_5.error) {
                    throw new Error("Failed to get job");
                }
                if (jobMakeMethod_5.error || !jobMakeMethod_5.data) {
                    throw new Error("Failed to get job make method");
                }
                if (quoteMakeMethod_5.error ||
                    quoteMaterials.error ||
                    quoteOperations_3.error) {
                    if (quoteMakeMethod_5.error) {
                        console.log("quoteMakeMethodError");
                        console.log(quoteMakeMethod_5.error);
                    }
                    if (quoteMaterials.error) {
                        console.log(quoteMaterials.error);
                    }
                    if (quoteOperations_3.error) {
                        console.log(quoteOperations_3.error);
                    }
                    throw new Error("Failed to fetch quote data");
                }
                return [4 /*yield*/, Promise.all([
                        (0, methods_ts_1.getQuoteMethodTree)(client_1, quoteMakeMethod_5.data.id),
                    ])];
            case 67:
                quoteMethodTrees = (_42.sent())[0];
                if (quoteMethodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                quoteMethodTree_3 = (_38 = quoteMethodTrees
                    .data) === null || _38 === void 0 ? void 0 : _38[0];
                if (!quoteMethodTree_3)
                    throw new Error("Method tree not found");
                quoteMaterialIdToJobMaterialId_1 = {};
                quoteMakeMethodIdToJobMakeMethodId_1 = {};
                quoteMakeMethodIdToQuantities_1 = {};
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var jobOperationInserts, operationIds, _loop_12, _i, _a, _b, index, operation;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: 
                                // Delete existing jobMakeMethods, jobMaterials, and jobOperations for this job
                                return [4 /*yield*/, Promise.all([
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("jobMakeMethod")
                                                .where(function (eb) {
                                                return eb.and([
                                                    eb("jobId", "=", jobId_2),
                                                    eb("parentMaterialId", "is not", null),
                                                ]);
                                            })
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfMaterial
                                            ? trx.deleteFrom("jobMaterial").where("jobId", "=", jobId_2).execute()
                                            : Promise.resolve(),
                                        // Prevent cascade deletion of materials when only replacing operations
                                        !parts_1.billOfMaterial && parts_1.billOfProcess
                                            ? trx.updateTable("jobMaterial")
                                                .set({ jobOperationId: null })
                                                .where("jobId", "=", jobId_2)
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfProcess
                                            ? trx.deleteFrom("jobOperation").where("jobId", "=", jobId_2).execute()
                                            : Promise.resolve(),
                                    ])];
                                case 1:
                                    // Delete existing jobMakeMethods, jobMaterials, and jobOperations for this job
                                    _d.sent();
                                    return [4 /*yield*/, (0, methods_ts_1.traverseQuoteMethod)(quoteMethodTree_3, function (node) { return __awaiter(void 0, void 0, void 0, function () {
                                            var jobMaterialInserts, jobMakeMethodInserts, nodeTotalForChildren, rootItemReplenishment, rootScrapPercentage, rootTarget, rootScrapQuantity, rootTotalWithScrap, rootEstimatedQuantity, parentQuoteMakeMethodId, parentQuantities, _a, _b, _c, child, newMaterialId, itemReplenishment, itemScrapPercentage, childTargetQuantity, childScrapQuantity, childTotalWithScrap, childEstimatedQuantity, _d, _e, newMakeMethodId, e_6_1, _f, jobMakeMethodInserts_1, jobMakeMethodInserts_1_1, insert, e_7_1;
                                            var _g;
                                            var _h, e_6, _j, _k, _l, e_7, _m, _o;
                                            var _p, _q, _r, _s, _t, _u;
                                            return __generator(this, function (_v) {
                                                switch (_v.label) {
                                                    case 0:
                                                        jobMaterialInserts = [];
                                                        jobMakeMethodInserts = [];
                                                        if (!node.data.isRoot) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, trx
                                                                .selectFrom("itemReplenishment")
                                                                .select("scrapPercentage")
                                                                .where("itemId", "=", node.data.itemId)
                                                                .executeTakeFirst()];
                                                    case 1:
                                                        rootItemReplenishment = _v.sent();
                                                        rootScrapPercentage = Number((_p = rootItemReplenishment === null || rootItemReplenishment === void 0 ? void 0 : rootItemReplenishment.scrapPercentage) !== null && _p !== void 0 ? _p : 0);
                                                        rootTarget = (_r = (_q = job_5.data) === null || _q === void 0 ? void 0 : _q.quantity) !== null && _r !== void 0 ? _r : 1;
                                                        rootScrapQuantity = node.data.methodType === "Make to Order"
                                                            ? rootTarget * rootScrapPercentage
                                                            : 0;
                                                        rootTotalWithScrap = Math.ceil(rootTarget + rootScrapQuantity);
                                                        rootEstimatedQuantity = node.data.methodType === "Make to Order"
                                                            ? rootTarget
                                                            : rootTotalWithScrap;
                                                        nodeTotalForChildren = rootTotalWithScrap;
                                                        // Store root quantities
                                                        quoteMakeMethodIdToQuantities_1[quoteMakeMethod_5.data.id] = {
                                                            targetQuantity: rootTarget,
                                                            estimatedQuantity: rootEstimatedQuantity,
                                                            totalWithScrap: rootTotalWithScrap,
                                                        };
                                                        return [3 /*break*/, 3];
                                                    case 2:
                                                        parentQuoteMakeMethodId = node.data.quoteMaterialMakeMethodId;
                                                        parentQuantities = quoteMakeMethodIdToQuantities_1[parentQuoteMakeMethodId !== null && parentQuoteMakeMethodId !== void 0 ? parentQuoteMakeMethodId : ""];
                                                        // Children receive parent's total (estimated + scrap) for cascade
                                                        nodeTotalForChildren = (_s = parentQuantities === null || parentQuantities === void 0 ? void 0 : parentQuantities.totalWithScrap) !== null && _s !== void 0 ? _s : 1;
                                                        _v.label = 3;
                                                    case 3:
                                                        _v.trys.push([3, 10, 11, 16]);
                                                        _a = true, _b = __asyncValues(node.children);
                                                        _v.label = 4;
                                                    case 4: return [4 /*yield*/, _b.next()];
                                                    case 5:
                                                        if (!(_c = _v.sent(), _h = _c.done, !_h)) return [3 /*break*/, 9];
                                                        _k = _c.value;
                                                        _a = false;
                                                        child = _k;
                                                        newMaterialId = (0, mod_ts_1.nanoid)();
                                                        quoteMaterialIdToJobMaterialId_1[child.id] = newMaterialId;
                                                        return [4 /*yield*/, trx
                                                                .selectFrom("itemReplenishment")
                                                                .select("scrapPercentage")
                                                                .where("itemId", "=", child.data.itemId)
                                                                .executeTakeFirst()];
                                                    case 6:
                                                        itemReplenishment = _v.sent();
                                                        itemScrapPercentage = Number((_t = itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.scrapPercentage) !== null && _t !== void 0 ? _t : 0);
                                                        childTargetQuantity = nodeTotalForChildren * ((_u = child.data.quantity) !== null && _u !== void 0 ? _u : 1);
                                                        childScrapQuantity = child.data.methodType === "Make to Order"
                                                            ? childTargetQuantity * itemScrapPercentage
                                                            : 0;
                                                        childTotalWithScrap = Math.ceil(childTargetQuantity + childScrapQuantity);
                                                        childEstimatedQuantity = child.data.methodType === "Make to Order"
                                                            ? childTargetQuantity
                                                            : childTotalWithScrap;
                                                        // Store quantities for this child's make method (if it has one)
                                                        if (child.data.quoteMaterialMakeMethodId) {
                                                            quoteMakeMethodIdToQuantities_1[child.data.quoteMaterialMakeMethodId] = {
                                                                targetQuantity: childTargetQuantity,
                                                                estimatedQuantity: childEstimatedQuantity,
                                                                totalWithScrap: childTotalWithScrap,
                                                            };
                                                        }
                                                        _e = (_d = jobMaterialInserts).push;
                                                        _g = {
                                                            id: newMaterialId,
                                                            jobId: jobId_2,
                                                            itemId: child.data.itemId,
                                                            itemType: child.data.itemType,
                                                            kit: child.data.kit,
                                                            methodType: child.data.methodType,
                                                            order: child.data.order,
                                                            description: child.data.description,
                                                            jobMakeMethodId: child.data.quoteMakeMethodId === quoteMakeMethod_5.data.id
                                                                ? jobMakeMethod_5.data.id
                                                                : quoteMakeMethodIdToJobMakeMethodId_1[child.data.quoteMakeMethodId],
                                                            quantity: child.data.quantity,
                                                            scrapQuantity: childScrapQuantity,
                                                            estimatedQuantity: childEstimatedQuantity,
                                                            itemScrapPercentage: itemScrapPercentage
                                                        };
                                                        return [4 /*yield*/, (0, storage_units_ts_1.getStorageUnitId)(trx, child.data.itemId, job_5.data.locationId, child.data.storageUnitId)];
                                                    case 7:
                                                        _e.apply(_d, [(_g.storageUnitId = _v.sent(),
                                                                _g.requiresBatchTracking = child.data.itemTrackingType === "Batch",
                                                                _g.requiresSerialTracking = child.data.itemTrackingType === "Serial",
                                                                _g.unitOfMeasureCode = child.data.unitOfMeasureCode,
                                                                _g.companyId = companyId_1,
                                                                _g.createdBy = userId_1,
                                                                _g.customFields = {},
                                                                _g)]);
                                                        if (child.data.quoteMaterialMakeMethodId) {
                                                            newMakeMethodId = (0, mod_ts_1.nanoid)();
                                                            quoteMakeMethodIdToJobMakeMethodId_1[child.data.quoteMaterialMakeMethodId] = newMakeMethodId;
                                                            jobMakeMethodInserts.push({
                                                                id: newMakeMethodId,
                                                                jobId: jobId_2,
                                                                parentMaterialId: quoteMaterialIdToJobMaterialId_1[child.id],
                                                                itemId: child.data.itemId,
                                                                quantityPerParent: child.data.quantity,
                                                                companyId: companyId_1,
                                                                createdBy: userId_1,
                                                            });
                                                        }
                                                        _v.label = 8;
                                                    case 8:
                                                        _a = true;
                                                        return [3 /*break*/, 4];
                                                    case 9: return [3 /*break*/, 16];
                                                    case 10:
                                                        e_6_1 = _v.sent();
                                                        e_6 = { error: e_6_1 };
                                                        return [3 /*break*/, 16];
                                                    case 11:
                                                        _v.trys.push([11, , 14, 15]);
                                                        if (!(!_a && !_h && (_j = _b.return))) return [3 /*break*/, 13];
                                                        return [4 /*yield*/, _j.call(_b)];
                                                    case 12:
                                                        _v.sent();
                                                        _v.label = 13;
                                                    case 13: return [3 /*break*/, 15];
                                                    case 14:
                                                        if (e_6) throw e_6.error;
                                                        return [7 /*endfinally*/];
                                                    case 15: return [7 /*endfinally*/];
                                                    case 16:
                                                        if (!(parts_1.billOfMaterial && jobMaterialInserts.length > 0)) return [3 /*break*/, 18];
                                                        return [4 /*yield*/, trx
                                                                .insertInto("jobMaterial")
                                                                .values(jobMaterialInserts)
                                                                .execute()];
                                                    case 17:
                                                        _v.sent();
                                                        _v.label = 18;
                                                    case 18:
                                                        if (!(parts_1.billOfMaterial && jobMakeMethodInserts.length > 0)) return [3 /*break*/, 31];
                                                        _v.label = 19;
                                                    case 19:
                                                        _v.trys.push([19, 25, 26, 31]);
                                                        _f = true, jobMakeMethodInserts_1 = __asyncValues(jobMakeMethodInserts);
                                                        _v.label = 20;
                                                    case 20: return [4 /*yield*/, jobMakeMethodInserts_1.next()];
                                                    case 21:
                                                        if (!(jobMakeMethodInserts_1_1 = _v.sent(), _l = jobMakeMethodInserts_1_1.done, !_l)) return [3 /*break*/, 24];
                                                        _o = jobMakeMethodInserts_1_1.value;
                                                        _f = false;
                                                        insert = _o;
                                                        return [4 /*yield*/, trx
                                                                .updateTable("jobMakeMethod")
                                                                .set({
                                                                id: insert.id,
                                                                quantityPerParent: insert.quantityPerParent,
                                                            })
                                                                .where("jobId", "=", jobId_2)
                                                                .where("parentMaterialId", "=", insert.parentMaterialId)
                                                                .execute()];
                                                    case 22:
                                                        _v.sent();
                                                        _v.label = 23;
                                                    case 23:
                                                        _f = true;
                                                        return [3 /*break*/, 20];
                                                    case 24: return [3 /*break*/, 31];
                                                    case 25:
                                                        e_7_1 = _v.sent();
                                                        e_7 = { error: e_7_1 };
                                                        return [3 /*break*/, 31];
                                                    case 26:
                                                        _v.trys.push([26, , 29, 30]);
                                                        if (!(!_f && !_l && (_m = jobMakeMethodInserts_1.return))) return [3 /*break*/, 28];
                                                        return [4 /*yield*/, _m.call(jobMakeMethodInserts_1)];
                                                    case 27:
                                                        _v.sent();
                                                        _v.label = 28;
                                                    case 28: return [3 /*break*/, 30];
                                                    case 29:
                                                        if (e_7) throw e_7.error;
                                                        return [7 /*endfinally*/];
                                                    case 30: return [7 /*endfinally*/];
                                                    case 31: return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 2:
                                    _d.sent();
                                    if (!parts_1.billOfProcess) return [3 /*break*/, 7];
                                    jobOperationInserts = quoteOperations_3.data.map(function (op) {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        // Get quantities for this operation's make method
                                        var opQuantities = quoteMakeMethodIdToQuantities_1[(_a = op.quoteMakeMethodId) !== null && _a !== void 0 ? _a : ""];
                                        return {
                                            jobId: jobId_2,
                                            jobMakeMethodId: op.quoteMakeMethodId === quoteMakeMethod_5.data.id
                                                ? jobMakeMethod_5.data.id
                                                : quoteMakeMethodIdToJobMakeMethodId_1[op.quoteMakeMethodId],
                                            processId: op.processId,
                                            procedureId: op.procedureId,
                                            workCenterId: op.workCenterId,
                                            description: op.description,
                                            setupTime: op.setupTime,
                                            setupUnit: op.setupUnit,
                                            laborTime: op.laborTime,
                                            laborUnit: op.laborUnit,
                                            machineTime: op.machineTime,
                                            machineUnit: op.machineUnit,
                                            order: op.order,
                                            operationOrder: op.operationOrder,
                                            operationType: op.operationType,
                                            operationSupplierProcessId: op.operationSupplierProcessId,
                                            operationMinimumCost: (_b = op.operationMinimumCost) !== null && _b !== void 0 ? _b : 0,
                                            operationLeadTime: (_c = op.operationLeadTime) !== null && _c !== void 0 ? _c : 0,
                                            operationUnitCost: (_d = op.operationUnitCost) !== null && _d !== void 0 ? _d : 0,
                                            tags: (_e = op.tags) !== null && _e !== void 0 ? _e : [],
                                            workInstruction: parts_1.workInstructions ? op.workInstruction : {},
                                            targetQuantity: (_f = opQuantities === null || opQuantities === void 0 ? void 0 : opQuantities.targetQuantity) !== null && _f !== void 0 ? _f : 0,
                                            operationQuantity: (_g = opQuantities === null || opQuantities === void 0 ? void 0 : opQuantities.totalWithScrap) !== null && _g !== void 0 ? _g : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            customFields: {},
                                        };
                                    });
                                    if (!(jobOperationInserts.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto("jobOperation")
                                            .values(jobOperationInserts)
                                            .returning(["id"])
                                            .execute()];
                                case 3:
                                    operationIds = _d.sent();
                                    _loop_12 = function (index, operation) {
                                        var operationId, quoteOperationTool, quoteOperationParameter, quoteOperationStep, procedureId;
                                        return __generator(this, function (_e) {
                                            switch (_e.label) {
                                                case 0:
                                                    operationId = operationIds[index].id;
                                                    if (!operationId) return [3 /*break*/, 8];
                                                    quoteOperationTool = operation.quoteOperationTool, quoteOperationParameter = operation.quoteOperationParameter, quoteOperationStep = operation.quoteOperationStep, procedureId = operation.procedureId;
                                                    if (!(parts_1.tools &&
                                                        Array.isArray(quoteOperationTool) &&
                                                        quoteOperationTool.length > 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("jobOperationTool")
                                                            .values(quoteOperationTool.map(function (tool) { return ({
                                                            toolId: tool.toolId,
                                                            quantity: tool.quantity,
                                                            operationId: operationId,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 1:
                                                    _e.sent();
                                                    _e.label = 2;
                                                case 2:
                                                    if (!procedureId) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, insertProcedureDataForJobOperation(trx, client_1, {
                                                            operationId: operationId,
                                                            procedureId: procedureId,
                                                            companyId: companyId_1,
                                                            userId: userId_1,
                                                        })];
                                                case 3:
                                                    _e.sent();
                                                    return [3 /*break*/, 8];
                                                case 4:
                                                    if (!(parts_1.parameters &&
                                                        Array.isArray(quoteOperationParameter) &&
                                                        quoteOperationParameter.length > 0)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("jobOperationParameter")
                                                            .values(quoteOperationParameter.map(function (param) { return ({
                                                            operationId: operationId,
                                                            key: param.key,
                                                            value: param.value,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 5:
                                                    _e.sent();
                                                    _e.label = 6;
                                                case 6:
                                                    if (!(parts_1.steps &&
                                                        Array.isArray(quoteOperationStep) &&
                                                        quoteOperationStep.length > 0)) return [3 /*break*/, 8];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("jobOperationStep")
                                                            .values(quoteOperationStep.map(function (_a) {
                                                            var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                            return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                        }))
                                                            .execute()];
                                                case 7:
                                                    _e.sent();
                                                    _e.label = 8;
                                                case 8: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = ((_c = quoteOperations_3.data) !== null && _c !== void 0 ? _c : []).entries();
                                    _d.label = 4;
                                case 4:
                                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                                    _b = _a[_i], index = _b[0], operation = _b[1];
                                    return [5 /*yield**/, _loop_12(index, operation)];
                                case 5:
                                    _d.sent();
                                    _d.label = 6;
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 4];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 68:
                _42.sent();
                return [3 /*break*/, 80];
            case 69:
                _2 = sourceId.split(":"), sourceQuoteLineId = _2[1];
                _3 = targetId.split(":"), targetQuoteId_1 = _3[0], targetQuoteLineId_1 = _3[1];
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("quoteMakeMethod")
                            .select("*")
                            .eq("quoteLineId", targetQuoteLineId_1)
                            .is("parentMaterialId", null)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteMakeMethod")
                            .select("*")
                            .is("parentMaterialId", null)
                            .eq("quoteLineId", sourceQuoteLineId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteMaterial")
                            .select("*")
                            .eq("quoteLineId", sourceQuoteLineId)
                            .eq("companyId", companyId_1),
                        client_1
                            .from("quoteOperation")
                            .select("*, quoteOperationTool(*), quoteOperationParameter(*), quoteOperationStep(*)")
                            .eq("quoteLineId", sourceQuoteLineId)
                            .eq("companyId", companyId_1),
                    ])];
            case 70:
                _4 = _42.sent(), targetQuoteMakeMethod_1 = _4[0], sourceQuoteMakeMethod_1 = _4[1], sourceQuoteMaterials = _4[2], sourceQuoteOperations_1 = _4[3];
                if (targetQuoteMakeMethod_1.error || !targetQuoteMakeMethod_1.data) {
                    console.error(targetQuoteMakeMethod_1.error);
                    throw new Error("Failed to get target quote make method");
                }
                if (sourceQuoteMakeMethod_1.error ||
                    sourceQuoteMaterials.error ||
                    sourceQuoteOperations_1.error) {
                    throw new Error("Failed to source quote data");
                }
                return [4 /*yield*/, Promise.all([
                        (0, methods_ts_1.getQuoteMethodTree)(client_1, sourceQuoteMakeMethod_1.data.id),
                    ])];
            case 71:
                quoteMethodTrees = (_42.sent())[0];
                if (quoteMethodTrees.error) {
                    throw new Error("Failed to get method tree");
                }
                quoteMethodTree_4 = (_39 = quoteMethodTrees
                    .data) === null || _39 === void 0 ? void 0 : _39[0];
                if (!quoteMethodTree_4)
                    throw new Error("Method tree not found");
                quoteMaterialIdToQuoteMaterialId_1 = {};
                quoteMakeMethodIdToQuoteMakeMethodId_1 = {};
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var quoteOperationInserts, operationIds, _loop_13, _i, _a, _b, index, operation;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: 
                                // Delete existing quoteMakeMethods, quoteMaterials, and quoteOperations for this quote line
                                return [4 /*yield*/, Promise.all([
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("quoteMakeMethod")
                                                .where(function (eb) {
                                                return eb.and([
                                                    eb("quoteLineId", "=", targetQuoteLineId_1),
                                                    eb("parentMaterialId", "is not", null),
                                                ]);
                                            })
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfMaterial
                                            ? trx
                                                .deleteFrom("quoteMaterial")
                                                .where("quoteLineId", "=", targetQuoteLineId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        // Prevent cascade deletion of materials when only replacing operations
                                        !parts_1.billOfMaterial && parts_1.billOfProcess
                                            ? trx.updateTable("quoteMaterial")
                                                .set({ quoteOperationId: null })
                                                .where("quoteLineId", "=", targetQuoteLineId_1)
                                                .execute()
                                            : Promise.resolve(),
                                        parts_1.billOfProcess
                                            ? trx
                                                .deleteFrom("quoteOperation")
                                                .where("quoteLineId", "=", targetQuoteLineId_1)
                                                .execute()
                                            : Promise.resolve(),
                                    ])];
                                case 1:
                                    // Delete existing quoteMakeMethods, quoteMaterials, and quoteOperations for this quote line
                                    _d.sent();
                                    return [4 /*yield*/, (0, methods_ts_1.traverseQuoteMethod)(quoteMethodTree_4, function (node) { return __awaiter(void 0, void 0, void 0, function () {
                                            var quoteMaterialInserts, quoteMakeMethodInserts, _a, _b, _c, child, newMaterialId, newMakeMethodId, e_8_1, _d, quoteMakeMethodInserts_1, quoteMakeMethodInserts_1_1, insert, e_9_1;
                                            var _e, e_8, _f, _g, _h, e_9, _j, _k;
                                            return __generator(this, function (_l) {
                                                switch (_l.label) {
                                                    case 0:
                                                        quoteMaterialInserts = [];
                                                        quoteMakeMethodInserts = [];
                                                        _l.label = 1;
                                                    case 1:
                                                        _l.trys.push([1, 6, 7, 12]);
                                                        _a = true, _b = __asyncValues(node.children);
                                                        _l.label = 2;
                                                    case 2: return [4 /*yield*/, _b.next()];
                                                    case 3:
                                                        if (!(_c = _l.sent(), _e = _c.done, !_e)) return [3 /*break*/, 5];
                                                        _g = _c.value;
                                                        _a = false;
                                                        child = _g;
                                                        newMaterialId = (0, mod_ts_1.nanoid)();
                                                        quoteMaterialIdToQuoteMaterialId_1[child.id] = newMaterialId;
                                                        quoteMaterialInserts.push({
                                                            id: newMaterialId,
                                                            quoteId: targetQuoteId_1,
                                                            quoteLineId: targetQuoteLineId_1,
                                                            itemId: child.data.itemId,
                                                            kit: child.data.kit,
                                                            itemType: child.data.itemType,
                                                            methodType: child.data.methodType,
                                                            order: child.data.order,
                                                            description: child.data.description,
                                                            quoteMakeMethodId: child.data.quoteMakeMethodId ===
                                                                sourceQuoteMakeMethod_1.data.id
                                                                ? targetQuoteMakeMethod_1.data.id
                                                                : quoteMakeMethodIdToQuoteMakeMethodId_1[child.data.quoteMakeMethodId],
                                                            quantity: child.data.quantity,
                                                            storageUnitId: child.data.storageUnitId,
                                                            unitOfMeasureCode: child.data.unitOfMeasureCode,
                                                            unitCost: child.data.unitCost, // TODO: get unit cost
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                            customFields: {},
                                                        });
                                                        if (child.data.quoteMaterialMakeMethodId) {
                                                            newMakeMethodId = (0, mod_ts_1.nanoid)();
                                                            quoteMakeMethodIdToQuoteMakeMethodId_1[child.data.quoteMaterialMakeMethodId] = newMakeMethodId;
                                                            quoteMakeMethodInserts.push({
                                                                id: newMakeMethodId,
                                                                quoteId: targetQuoteId_1,
                                                                quoteLineId: targetQuoteLineId_1,
                                                                parentMaterialId: quoteMaterialIdToQuoteMaterialId_1[child.id],
                                                                itemId: child.data.itemId,
                                                                quantityPerParent: child.data.quantity,
                                                                companyId: companyId_1,
                                                                createdBy: userId_1,
                                                            });
                                                        }
                                                        _l.label = 4;
                                                    case 4:
                                                        _a = true;
                                                        return [3 /*break*/, 2];
                                                    case 5: return [3 /*break*/, 12];
                                                    case 6:
                                                        e_8_1 = _l.sent();
                                                        e_8 = { error: e_8_1 };
                                                        return [3 /*break*/, 12];
                                                    case 7:
                                                        _l.trys.push([7, , 10, 11]);
                                                        if (!(!_a && !_e && (_f = _b.return))) return [3 /*break*/, 9];
                                                        return [4 /*yield*/, _f.call(_b)];
                                                    case 8:
                                                        _l.sent();
                                                        _l.label = 9;
                                                    case 9: return [3 /*break*/, 11];
                                                    case 10:
                                                        if (e_8) throw e_8.error;
                                                        return [7 /*endfinally*/];
                                                    case 11: return [7 /*endfinally*/];
                                                    case 12:
                                                        if (!(parts_1.billOfMaterial && quoteMaterialInserts.length > 0)) return [3 /*break*/, 14];
                                                        return [4 /*yield*/, trx
                                                                .insertInto("quoteMaterial")
                                                                .values(quoteMaterialInserts)
                                                                .execute()];
                                                    case 13:
                                                        _l.sent();
                                                        _l.label = 14;
                                                    case 14:
                                                        if (!(parts_1.billOfMaterial && quoteMakeMethodInserts.length > 0)) return [3 /*break*/, 27];
                                                        _l.label = 15;
                                                    case 15:
                                                        _l.trys.push([15, 21, 22, 27]);
                                                        _d = true, quoteMakeMethodInserts_1 = __asyncValues(quoteMakeMethodInserts);
                                                        _l.label = 16;
                                                    case 16: return [4 /*yield*/, quoteMakeMethodInserts_1.next()];
                                                    case 17:
                                                        if (!(quoteMakeMethodInserts_1_1 = _l.sent(), _h = quoteMakeMethodInserts_1_1.done, !_h)) return [3 /*break*/, 20];
                                                        _k = quoteMakeMethodInserts_1_1.value;
                                                        _d = false;
                                                        insert = _k;
                                                        return [4 /*yield*/, trx
                                                                .updateTable("quoteMakeMethod")
                                                                .set({
                                                                id: insert.id,
                                                                quantityPerParent: insert.quantityPerParent,
                                                            })
                                                                .where("quoteLineId", "=", targetQuoteLineId_1)
                                                                .where("parentMaterialId", "=", insert.parentMaterialId)
                                                                .execute()];
                                                    case 18:
                                                        _l.sent();
                                                        _l.label = 19;
                                                    case 19:
                                                        _d = true;
                                                        return [3 /*break*/, 16];
                                                    case 20: return [3 /*break*/, 27];
                                                    case 21:
                                                        e_9_1 = _l.sent();
                                                        e_9 = { error: e_9_1 };
                                                        return [3 /*break*/, 27];
                                                    case 22:
                                                        _l.trys.push([22, , 25, 26]);
                                                        if (!(!_d && !_h && (_j = quoteMakeMethodInserts_1.return))) return [3 /*break*/, 24];
                                                        return [4 /*yield*/, _j.call(quoteMakeMethodInserts_1)];
                                                    case 23:
                                                        _l.sent();
                                                        _l.label = 24;
                                                    case 24: return [3 /*break*/, 26];
                                                    case 25:
                                                        if (e_9) throw e_9.error;
                                                        return [7 /*endfinally*/];
                                                    case 26: return [7 /*endfinally*/];
                                                    case 27: return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 2:
                                    _d.sent();
                                    if (!parts_1.billOfProcess) return [3 /*break*/, 7];
                                    quoteOperationInserts = sourceQuoteOperations_1.data.map(function (op) {
                                        var _a, _b, _c, _d;
                                        return ({
                                            quoteId: targetQuoteId_1,
                                            quoteLineId: targetQuoteLineId_1,
                                            quoteMakeMethodId: op.quoteMakeMethodId === sourceQuoteMakeMethod_1.data.id
                                                ? targetQuoteMakeMethod_1.data.id
                                                : quoteMakeMethodIdToQuoteMakeMethodId_1[op.quoteMakeMethodId],
                                            processId: op.processId,
                                            procedureId: op.procedureId,
                                            workCenterId: op.workCenterId,
                                            description: op.description,
                                            setupTime: op.setupTime,
                                            setupUnit: op.setupUnit,
                                            laborTime: op.laborTime,
                                            laborUnit: op.laborUnit,
                                            laborRate: op.laborRate,
                                            machineTime: op.machineTime,
                                            machineUnit: op.machineUnit,
                                            machineRate: op.machineRate,
                                            order: op.order,
                                            operationOrder: op.operationOrder,
                                            operationType: op.operationType,
                                            operationSupplierProcessId: op.operationSupplierProcessId,
                                            operationMinimumCost: (_a = op.operationMinimumCost) !== null && _a !== void 0 ? _a : 0,
                                            operationLeadTime: (_b = op.operationLeadTime) !== null && _b !== void 0 ? _b : 0,
                                            operationUnitCost: (_c = op.operationUnitCost) !== null && _c !== void 0 ? _c : 0,
                                            overheadRate: op.overheadRate,
                                            tags: (_d = op.tags) !== null && _d !== void 0 ? _d : [],
                                            workInstruction: parts_1.workInstructions ? op.workInstruction : {},
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            customFields: {},
                                        });
                                    });
                                    if (!(quoteOperationInserts.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto("quoteOperation")
                                            .values(quoteOperationInserts)
                                            .returning(["id"])
                                            .execute()];
                                case 3:
                                    operationIds = _d.sent();
                                    _loop_13 = function (index, operation) {
                                        var operationId, quoteOperationTool, quoteOperationParameter, quoteOperationStep;
                                        return __generator(this, function (_e) {
                                            switch (_e.label) {
                                                case 0:
                                                    operationId = operationIds[index].id;
                                                    if (!operationId) return [3 /*break*/, 6];
                                                    quoteOperationTool = operation.quoteOperationTool, quoteOperationParameter = operation.quoteOperationParameter, quoteOperationStep = operation.quoteOperationStep;
                                                    if (!(parts_1.tools &&
                                                        Array.isArray(quoteOperationTool) &&
                                                        quoteOperationTool.length > 0)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("quoteOperationTool")
                                                            .values(quoteOperationTool.map(function (tool) { return ({
                                                            toolId: tool.toolId,
                                                            quantity: tool.quantity,
                                                            operationId: operationId,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 1:
                                                    _e.sent();
                                                    _e.label = 2;
                                                case 2:
                                                    if (!(parts_1.parameters &&
                                                        Array.isArray(quoteOperationParameter) &&
                                                        quoteOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("quoteOperationParameter")
                                                            .values(quoteOperationParameter.map(function (param) { return ({
                                                            operationId: operationId,
                                                            key: param.key,
                                                            value: param.value,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                        }); }))
                                                            .execute()];
                                                case 3:
                                                    _e.sent();
                                                    _e.label = 4;
                                                case 4:
                                                    if (!(parts_1.steps &&
                                                        Array.isArray(quoteOperationStep) &&
                                                        quoteOperationStep.length > 0)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("quoteOperationStep")
                                                            .values(quoteOperationStep.map(function (_a) {
                                                            var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                            return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                        }))
                                                            .execute()];
                                                case 5:
                                                    _e.sent();
                                                    _e.label = 6;
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = ((_c = sourceQuoteOperations_1.data) !== null && _c !== void 0 ? _c : []).entries();
                                    _d.label = 4;
                                case 4:
                                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                                    _b = _a[_i], index = _b[0], operation = _b[1];
                                    return [5 /*yield**/, _loop_13(index, operation)];
                                case 5:
                                    _d.sent();
                                    _d.label = 6;
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 4];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 72:
                _42.sent();
                return [4 /*yield*/, (0, methods_ts_1.calculateQuoteLinePrices)(client_1, targetQuoteId_1, targetQuoteLineId_1, companyId_1, userId_1)];
            case 73:
                _42.sent();
                return [3 /*break*/, 80];
            case 74:
                sourceQuoteId = sourceId;
                asRevision_1 = !!targetId;
                newQuoteId_1 = "";
                oldLineToNewLineMap_1 = {};
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("quote")
                            .select("*")
                            .eq("id", sourceQuoteId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quotePayment")
                            .select("*")
                            .eq("id", sourceQuoteId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteShipment")
                            .select("*")
                            .eq("id", sourceQuoteId)
                            .eq("companyId", companyId_1)
                            .single(),
                        client_1
                            .from("quoteLine")
                            .select("*")
                            .eq("quoteId", sourceQuoteId)
                            .eq("companyId", companyId_1),
                    ])];
            case 75:
                _5 = _42.sent(), sourceQuote_1 = _5[0], sourceQuotePayment_1 = _5[1], sourceQuoteShipment_1 = _5[2], sourceQuoteLines_1 = _5[3];
                if (sourceQuote_1.error) {
                    throw new Error("Failed to get source quote");
                }
                if (sourceQuotePayment_1.error) {
                    throw new Error("Failed to get source quote payment");
                }
                if (sourceQuoteShipment_1.error) {
                    throw new Error("Failed to get source quote shipment");
                }
                return [4 /*yield*/, client_1
                        .from("quoteLinePrice")
                        .select("*")
                        .in("quoteLineId", (_41 = (_40 = sourceQuoteLines_1.data) === null || _40 === void 0 ? void 0 : _40.map(function (l) { return l.id; })) !== null && _41 !== void 0 ? _41 : [])];
            case 76:
                sourceQuoteLinePricing_1 = _42.sent();
                if (sourceQuoteLinePricing_1.error) {
                    throw new Error("Failed to get source quote line pricing");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var quoteId, revisionId, externalLinkId, opportunityId, opportunity, quote, _loop_14, _a, _b, _c, e_10_1;
                        var _d, e_10, _e, _f;
                        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
                        return __generator(this, function (_10) {
                            switch (_10.label) {
                                case 0:
                                    revisionId = 0;
                                    if (!asRevision_1) return [3 /*break*/, 2];
                                    quoteId = (_h = (_g = sourceQuote_1.data) === null || _g === void 0 ? void 0 : _g.quoteId) !== null && _h !== void 0 ? _h : "";
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextRevisionSequence)(trx, "quote", "quoteId", quoteId, companyId_1)];
                                case 1:
                                    revisionId = _10.sent();
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "quote", companyId_1)];
                                case 3:
                                    quoteId = _10.sent();
                                    _10.label = 4;
                                case 4: return [4 /*yield*/, trx
                                        .insertInto("externalLink")
                                        .values({
                                        documentId: quoteId,
                                        documentType: "Quote",
                                        companyId: companyId_1,
                                    })
                                        .returning(["id"])
                                        .executeTakeFirstOrThrow()];
                                case 5:
                                    externalLinkId = _10.sent();
                                    opportunityId = undefined;
                                    if (!asRevision_1) return [3 /*break*/, 6];
                                    opportunityId = (_k = (_j = sourceQuote_1.data) === null || _j === void 0 ? void 0 : _j.opportunityId) !== null && _k !== void 0 ? _k : undefined;
                                    return [3 /*break*/, 8];
                                case 6: return [4 /*yield*/, trx
                                        .insertInto("opportunity")
                                        .values({
                                        companyId: companyId_1,
                                        customerId: (_l = sourceQuote_1.data) === null || _l === void 0 ? void 0 : _l.customerId,
                                    })
                                        .returning(["id"])
                                        .executeTakeFirstOrThrow()];
                                case 7:
                                    opportunity = _10.sent();
                                    opportunityId = opportunity.id;
                                    _10.label = 8;
                                case 8: return [4 /*yield*/, trx
                                        .insertInto("quote")
                                        .values([
                                        {
                                            quoteId: quoteId,
                                            revisionId: revisionId,
                                            customerId: (_m = sourceQuote_1.data) === null || _m === void 0 ? void 0 : _m.customerId,
                                            customerContactId: (_o = sourceQuote_1.data) === null || _o === void 0 ? void 0 : _o.customerContactId,
                                            customerLocationId: (_p = sourceQuote_1.data) === null || _p === void 0 ? void 0 : _p.customerLocationId,
                                            customerReference: (_q = sourceQuote_1.data) === null || _q === void 0 ? void 0 : _q.customerReference,
                                            locationId: (_r = sourceQuote_1.data) === null || _r === void 0 ? void 0 : _r.locationId,
                                            expirationDate: (0, date_1.toCalendarDate)((0, date_1.now)((0, date_1.getLocalTimeZone)()).add({ days: 30 })).toString(),
                                            salesPersonId: (_t = (_s = sourceQuote_1.data) === null || _s === void 0 ? void 0 : _s.salesPersonId) !== null && _t !== void 0 ? _t : userId_1,
                                            status: "Draft",
                                            externalNotes: (_u = sourceQuote_1.data) === null || _u === void 0 ? void 0 : _u.externalNotes,
                                            internalNotes: (_v = sourceQuote_1.data) === null || _v === void 0 ? void 0 : _v.internalNotes,
                                            currencyCode: (_w = sourceQuote_1.data) === null || _w === void 0 ? void 0 : _w.currencyCode,
                                            exchangeRate: (_x = sourceQuote_1.data) === null || _x === void 0 ? void 0 : _x.exchangeRate,
                                            exchangeRateUpdatedAt: new Date().toISOString(),
                                            externalLinkId: externalLinkId.id,
                                            opportunityId: opportunityId,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        },
                                    ])
                                        .returning(["id"])
                                        .executeTakeFirstOrThrow()];
                                case 9:
                                    quote = _10.sent();
                                    if (!quote.id) {
                                        throw new Error("Failed to insert quote");
                                    }
                                    newQuoteId_1 = quote.id;
                                    // Insert quotePayment
                                    return [4 /*yield*/, trx
                                            .insertInto("quotePayment")
                                            .values({
                                            id: quote.id,
                                            invoiceCustomerId: (_y = sourceQuotePayment_1.data) === null || _y === void 0 ? void 0 : _y.invoiceCustomerId,
                                            invoiceCustomerContactId: (_z = sourceQuotePayment_1.data) === null || _z === void 0 ? void 0 : _z.invoiceCustomerContactId,
                                            invoiceCustomerLocationId: (_0 = sourceQuotePayment_1.data) === null || _0 === void 0 ? void 0 : _0.invoiceCustomerLocationId,
                                            paymentTermId: (_1 = sourceQuotePayment_1.data) === null || _1 === void 0 ? void 0 : _1.paymentTermId,
                                            companyId: companyId_1,
                                            updatedBy: userId_1,
                                        })
                                            .execute()];
                                case 10:
                                    // Insert quotePayment
                                    _10.sent();
                                    // Insert quoteShipment
                                    return [4 /*yield*/, trx
                                            .insertInto("quoteShipment")
                                            .values({
                                            id: quote.id,
                                            locationId: (_2 = sourceQuoteShipment_1.data) === null || _2 === void 0 ? void 0 : _2.locationId,
                                            shippingMethodId: (_3 = sourceQuoteShipment_1.data) === null || _3 === void 0 ? void 0 : _3.shippingMethodId,
                                            shippingTermId: (_4 = sourceQuoteShipment_1.data) === null || _4 === void 0 ? void 0 : _4.shippingTermId,
                                            shippingCost: (_5 = sourceQuoteShipment_1.data) === null || _5 === void 0 ? void 0 : _5.shippingCost,
                                            receiptRequestedDate: (_6 = sourceQuoteShipment_1.data) === null || _6 === void 0 ? void 0 : _6.receiptRequestedDate,
                                            companyId: companyId_1,
                                            updatedBy: userId_1,
                                        })
                                            .execute()];
                                case 11:
                                    // Insert quoteShipment
                                    _10.sent();
                                    _10.label = 12;
                                case 12:
                                    _10.trys.push([12, 18, 19, 24]);
                                    _loop_14 = function () {
                                        var _11, id, line, newLine, sourceQuotePricingForLine;
                                        return __generator(this, function (_12) {
                                            switch (_12.label) {
                                                case 0:
                                                    _f = _c.value;
                                                    _a = false;
                                                    _11 = _f;
                                                    id = _11.id, line = __rest(_11, ["id"]);
                                                    return [4 /*yield*/, trx
                                                            .insertInto("quoteLine")
                                                            .values(__assign(__assign({}, line), { quoteId: quote.id, companyId: companyId_1 }))
                                                            .returning(["id"])
                                                            .executeTakeFirstOrThrow()];
                                                case 1:
                                                    newLine = _12.sent();
                                                    if (!newLine.id) {
                                                        throw new Error("Failed to insert quote line");
                                                    }
                                                    if (line.methodType === "Make to Order") {
                                                        // we only need further processing on make lines
                                                        oldLineToNewLineMap_1[id] = newLine.id;
                                                    }
                                                    sourceQuotePricingForLine = (_9 = (_8 = sourceQuoteLinePricing_1.data) === null || _8 === void 0 ? void 0 : _8.filter(function (l) { return l.quoteLineId === id; })) !== null && _9 !== void 0 ? _9 : [];
                                                    if (!(sourceQuotePricingForLine.length > 0)) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("quoteLinePrice")
                                                            .values(sourceQuotePricingForLine.map(function (l) {
                                                            var _a, _b, _c, _d, _e, _f;
                                                            return ({
                                                                quoteId: newQuoteId_1,
                                                                quoteLineId: newLine.id,
                                                                leadTime: (_a = l.leadTime) !== null && _a !== void 0 ? _a : 0,
                                                                discountPercent: (_b = l.discountPercent) !== null && _b !== void 0 ? _b : 0,
                                                                quantity: (_c = l.quantity) !== null && _c !== void 0 ? _c : 0,
                                                                unitPrice: (_d = l.unitPrice) !== null && _d !== void 0 ? _d : 0,
                                                                shippingCost: (_e = l.shippingCost) !== null && _e !== void 0 ? _e : 0,
                                                                exchangeRate: (_f = l.exchangeRate) !== null && _f !== void 0 ? _f : 0,
                                                                createdBy: userId_1,
                                                            });
                                                        }))
                                                            .execute()];
                                                case 2:
                                                    _12.sent();
                                                    _12.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a = true, _b = __asyncValues((_7 = sourceQuoteLines_1.data) !== null && _7 !== void 0 ? _7 : []);
                                    _10.label = 13;
                                case 13: return [4 /*yield*/, _b.next()];
                                case 14:
                                    if (!(_c = _10.sent(), _d = _c.done, !_d)) return [3 /*break*/, 17];
                                    return [5 /*yield**/, _loop_14()];
                                case 15:
                                    _10.sent();
                                    _10.label = 16;
                                case 16:
                                    _a = true;
                                    return [3 /*break*/, 13];
                                case 17: return [3 /*break*/, 24];
                                case 18:
                                    e_10_1 = _10.sent();
                                    e_10 = { error: e_10_1 };
                                    return [3 /*break*/, 24];
                                case 19:
                                    _10.trys.push([19, , 22, 23]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 21];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 20:
                                    _10.sent();
                                    _10.label = 21;
                                case 21: return [3 /*break*/, 23];
                                case 22:
                                    if (e_10) throw e_10.error;
                                    return [7 /*endfinally*/];
                                case 23: return [7 /*endfinally*/];
                                case 24: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 77:
                _42.sent();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _loop_15, _a, _b, _c, e_11_1;
                        var _d, e_11, _e, _f;
                        var _g, _h;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    _j.trys.push([0, 6, 7, 12]);
                                    _loop_15 = function () {
                                        var oldLineId, newLineId, _k, targetQuoteMakeMethod, sourceQuoteMakeMethod, sourceQuoteMaterials, sourceQuoteOperations, quoteMethodTrees, quoteMethodTree, quoteMaterialIdToQuoteMaterialId, quoteMakeMethodIdToQuoteMakeMethodId, quoteOperationInserts, operationIds, _loop_16, _i, _l, _m, index, operation;
                                        return __generator(this, function (_o) {
                                            switch (_o.label) {
                                                case 0:
                                                    _f = _c.value;
                                                    _a = false;
                                                    oldLineId = _f[0], newLineId = _f[1];
                                                    return [4 /*yield*/, Promise.all([
                                                            client_1
                                                                .from("quoteMakeMethod")
                                                                .select("*")
                                                                .is("parentMaterialId", null)
                                                                .eq("quoteLineId", newLineId)
                                                                .eq("companyId", companyId_1)
                                                                .single(),
                                                            client_1
                                                                .from("quoteMakeMethod")
                                                                .select("*")
                                                                .is("parentMaterialId", null)
                                                                .eq("quoteLineId", oldLineId)
                                                                .eq("companyId", companyId_1)
                                                                .single(),
                                                            client_1
                                                                .from("quoteMaterial")
                                                                .select("*")
                                                                .eq("quoteLineId", oldLineId)
                                                                .eq("companyId", companyId_1),
                                                            client_1
                                                                .from("quoteOperation")
                                                                .select("*, quoteOperationTool(*), quoteOperationParameter(*), quoteOperationStep(*)")
                                                                .eq("quoteLineId", oldLineId)
                                                                .eq("companyId", companyId_1),
                                                        ])];
                                                case 1:
                                                    _k = _o.sent(), targetQuoteMakeMethod = _k[0], sourceQuoteMakeMethod = _k[1], sourceQuoteMaterials = _k[2], sourceQuoteOperations = _k[3];
                                                    if (targetQuoteMakeMethod.error) {
                                                        console.error(targetQuoteMakeMethod.error);
                                                        throw new Error("Failed to get target quote make method");
                                                    }
                                                    if (sourceQuoteMakeMethod.error ||
                                                        sourceQuoteMaterials.error ||
                                                        sourceQuoteOperations.error) {
                                                        throw new Error("Failed to source quote data");
                                                    }
                                                    return [4 /*yield*/, Promise.all([
                                                            (0, methods_ts_1.getQuoteMethodTree)(client_1, sourceQuoteMakeMethod.data.id),
                                                        ])];
                                                case 2:
                                                    quoteMethodTrees = (_o.sent())[0];
                                                    if (quoteMethodTrees.error) {
                                                        throw new Error("Failed to get method tree");
                                                    }
                                                    quoteMethodTree = (_g = quoteMethodTrees
                                                        .data) === null || _g === void 0 ? void 0 : _g[0];
                                                    if (!quoteMethodTree)
                                                        throw new Error("Method tree not found");
                                                    quoteMaterialIdToQuoteMaterialId = {};
                                                    quoteMakeMethodIdToQuoteMakeMethodId = {};
                                                    return [4 /*yield*/, (0, methods_ts_1.traverseQuoteMethod)(quoteMethodTree, function (node) { return __awaiter(void 0, void 0, void 0, function () {
                                                            var quoteMaterialInserts, quoteMakeMethodInserts, _a, _b, _c, child, newMaterialId, newMakeMethodId, e_12_1, _d, quoteMakeMethodInserts_2, quoteMakeMethodInserts_2_1, insert, e_13_1;
                                                            var _e, e_12, _f, _g, _h, e_13, _j, _k;
                                                            return __generator(this, function (_l) {
                                                                switch (_l.label) {
                                                                    case 0:
                                                                        quoteMaterialInserts = [];
                                                                        quoteMakeMethodInserts = [];
                                                                        _l.label = 1;
                                                                    case 1:
                                                                        _l.trys.push([1, 6, 7, 12]);
                                                                        _a = true, _b = __asyncValues(node.children);
                                                                        _l.label = 2;
                                                                    case 2: return [4 /*yield*/, _b.next()];
                                                                    case 3:
                                                                        if (!(_c = _l.sent(), _e = _c.done, !_e)) return [3 /*break*/, 5];
                                                                        _g = _c.value;
                                                                        _a = false;
                                                                        child = _g;
                                                                        newMaterialId = (0, mod_ts_1.nanoid)();
                                                                        quoteMaterialIdToQuoteMaterialId[child.id] = newMaterialId;
                                                                        quoteMaterialInserts.push({
                                                                            id: newMaterialId,
                                                                            quoteId: newQuoteId_1,
                                                                            quoteLineId: newLineId,
                                                                            itemId: child.data.itemId,
                                                                            kit: child.data.kit,
                                                                            itemType: child.data.itemType,
                                                                            methodType: child.data.methodType,
                                                                            order: child.data.order,
                                                                            description: child.data.description,
                                                                            quoteMakeMethodId: child.data.quoteMakeMethodId ===
                                                                                sourceQuoteMakeMethod.data.id
                                                                                ? targetQuoteMakeMethod.data.id
                                                                                : quoteMakeMethodIdToQuoteMakeMethodId[child.data.quoteMakeMethodId],
                                                                            quantity: child.data.quantity,
                                                                            storageUnitId: child.data.storageUnitId,
                                                                            unitCost: child.data.unitCost, // TODO: get unit cost
                                                                            unitOfMeasureCode: child.data.unitOfMeasureCode,
                                                                            companyId: companyId_1,
                                                                            createdBy: userId_1,
                                                                            customFields: {},
                                                                        });
                                                                        if (child.data.quoteMaterialMakeMethodId) {
                                                                            newMakeMethodId = (0, mod_ts_1.nanoid)();
                                                                            quoteMakeMethodIdToQuoteMakeMethodId[child.data.quoteMaterialMakeMethodId] = newMakeMethodId;
                                                                            quoteMakeMethodInserts.push({
                                                                                id: newMakeMethodId,
                                                                                quoteId: newQuoteId_1,
                                                                                quoteLineId: newLineId,
                                                                                parentMaterialId: quoteMaterialIdToQuoteMaterialId[child.id],
                                                                                itemId: child.data.itemId,
                                                                                quantityPerParent: child.data.quantity,
                                                                                companyId: companyId_1,
                                                                                createdBy: userId_1,
                                                                            });
                                                                        }
                                                                        _l.label = 4;
                                                                    case 4:
                                                                        _a = true;
                                                                        return [3 /*break*/, 2];
                                                                    case 5: return [3 /*break*/, 12];
                                                                    case 6:
                                                                        e_12_1 = _l.sent();
                                                                        e_12 = { error: e_12_1 };
                                                                        return [3 /*break*/, 12];
                                                                    case 7:
                                                                        _l.trys.push([7, , 10, 11]);
                                                                        if (!(!_a && !_e && (_f = _b.return))) return [3 /*break*/, 9];
                                                                        return [4 /*yield*/, _f.call(_b)];
                                                                    case 8:
                                                                        _l.sent();
                                                                        _l.label = 9;
                                                                    case 9: return [3 /*break*/, 11];
                                                                    case 10:
                                                                        if (e_12) throw e_12.error;
                                                                        return [7 /*endfinally*/];
                                                                    case 11: return [7 /*endfinally*/];
                                                                    case 12:
                                                                        if (!(quoteMaterialInserts.length > 0)) return [3 /*break*/, 14];
                                                                        return [4 /*yield*/, trx
                                                                                .insertInto("quoteMaterial")
                                                                                .values(quoteMaterialInserts)
                                                                                .execute()];
                                                                    case 13:
                                                                        _l.sent();
                                                                        _l.label = 14;
                                                                    case 14:
                                                                        if (!(quoteMakeMethodInserts.length > 0)) return [3 /*break*/, 27];
                                                                        _l.label = 15;
                                                                    case 15:
                                                                        _l.trys.push([15, 21, 22, 27]);
                                                                        _d = true, quoteMakeMethodInserts_2 = __asyncValues(quoteMakeMethodInserts);
                                                                        _l.label = 16;
                                                                    case 16: return [4 /*yield*/, quoteMakeMethodInserts_2.next()];
                                                                    case 17:
                                                                        if (!(quoteMakeMethodInserts_2_1 = _l.sent(), _h = quoteMakeMethodInserts_2_1.done, !_h)) return [3 /*break*/, 20];
                                                                        _k = quoteMakeMethodInserts_2_1.value;
                                                                        _d = false;
                                                                        insert = _k;
                                                                        return [4 /*yield*/, trx
                                                                                .updateTable("quoteMakeMethod")
                                                                                .set({
                                                                                id: insert.id,
                                                                                quantityPerParent: insert.quantityPerParent,
                                                                            })
                                                                                .where("quoteLineId", "=", newLineId)
                                                                                .where("parentMaterialId", "=", insert.parentMaterialId)
                                                                                .execute()];
                                                                    case 18:
                                                                        _l.sent();
                                                                        _l.label = 19;
                                                                    case 19:
                                                                        _d = true;
                                                                        return [3 /*break*/, 16];
                                                                    case 20: return [3 /*break*/, 27];
                                                                    case 21:
                                                                        e_13_1 = _l.sent();
                                                                        e_13 = { error: e_13_1 };
                                                                        return [3 /*break*/, 27];
                                                                    case 22:
                                                                        _l.trys.push([22, , 25, 26]);
                                                                        if (!(!_d && !_h && (_j = quoteMakeMethodInserts_2.return))) return [3 /*break*/, 24];
                                                                        return [4 /*yield*/, _j.call(quoteMakeMethodInserts_2)];
                                                                    case 23:
                                                                        _l.sent();
                                                                        _l.label = 24;
                                                                    case 24: return [3 /*break*/, 26];
                                                                    case 25:
                                                                        if (e_13) throw e_13.error;
                                                                        return [7 /*endfinally*/];
                                                                    case 26: return [7 /*endfinally*/];
                                                                    case 27: return [2 /*return*/];
                                                                }
                                                            });
                                                        }); })];
                                                case 3:
                                                    _o.sent();
                                                    quoteOperationInserts = sourceQuoteOperations.data.map(function (op) {
                                                        var _a, _b, _c, _d;
                                                        return ({
                                                            quoteId: newQuoteId_1,
                                                            quoteLineId: newLineId,
                                                            quoteMakeMethodId: op.quoteMakeMethodId === sourceQuoteMakeMethod.data.id
                                                                ? targetQuoteMakeMethod.data.id
                                                                : quoteMakeMethodIdToQuoteMakeMethodId[op.quoteMakeMethodId],
                                                            processId: op.processId,
                                                            procedureId: op.procedureId,
                                                            workCenterId: op.workCenterId,
                                                            description: op.description,
                                                            setupTime: op.setupTime,
                                                            setupUnit: op.setupUnit,
                                                            laborTime: op.laborTime,
                                                            laborUnit: op.laborUnit,
                                                            laborRate: op.laborRate,
                                                            machineTime: op.machineTime,
                                                            machineUnit: op.machineUnit,
                                                            machineRate: op.machineRate,
                                                            order: op.order,
                                                            operationOrder: op.operationOrder,
                                                            operationType: op.operationType,
                                                            operationSupplierProcessId: op.operationSupplierProcessId,
                                                            operationMinimumCost: (_a = op.operationMinimumCost) !== null && _a !== void 0 ? _a : 0,
                                                            operationLeadTime: (_b = op.operationLeadTime) !== null && _b !== void 0 ? _b : 0,
                                                            operationUnitCost: (_c = op.operationUnitCost) !== null && _c !== void 0 ? _c : 0,
                                                            overheadRate: op.overheadRate,
                                                            tags: (_d = op.tags) !== null && _d !== void 0 ? _d : [],
                                                            workInstruction: op.workInstruction,
                                                            companyId: companyId_1,
                                                            createdBy: userId_1,
                                                            customFields: {},
                                                        });
                                                    });
                                                    if (!(quoteOperationInserts.length > 0)) return [3 /*break*/, 8];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("quoteOperation")
                                                            .values(quoteOperationInserts)
                                                            .returning(["id"])
                                                            .execute()];
                                                case 4:
                                                    operationIds = _o.sent();
                                                    _loop_16 = function (index, operation) {
                                                        var operationId, quoteOperationTool, quoteOperationParameter, quoteOperationStep;
                                                        return __generator(this, function (_p) {
                                                            switch (_p.label) {
                                                                case 0:
                                                                    operationId = operationIds[index].id;
                                                                    if (!operationId) return [3 /*break*/, 6];
                                                                    quoteOperationTool = operation.quoteOperationTool, quoteOperationParameter = operation.quoteOperationParameter, quoteOperationStep = operation.quoteOperationStep;
                                                                    if (!(Array.isArray(quoteOperationTool) &&
                                                                        quoteOperationTool.length > 0)) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, trx
                                                                            .insertInto("quoteOperationTool")
                                                                            .values(quoteOperationTool.map(function (tool) { return ({
                                                                            toolId: tool.toolId,
                                                                            quantity: tool.quantity,
                                                                            operationId: operationId,
                                                                            companyId: companyId_1,
                                                                            createdBy: userId_1,
                                                                        }); }))
                                                                            .execute()];
                                                                case 1:
                                                                    _p.sent();
                                                                    _p.label = 2;
                                                                case 2:
                                                                    if (!(Array.isArray(quoteOperationParameter) &&
                                                                        quoteOperationParameter.length > 0)) return [3 /*break*/, 4];
                                                                    return [4 /*yield*/, trx
                                                                            .insertInto("quoteOperationParameter")
                                                                            .values(quoteOperationParameter.map(function (param) { return ({
                                                                            operationId: operationId,
                                                                            key: param.key,
                                                                            value: param.value,
                                                                            companyId: companyId_1,
                                                                            createdBy: userId_1,
                                                                        }); }))
                                                                            .execute()];
                                                                case 3:
                                                                    _p.sent();
                                                                    _p.label = 4;
                                                                case 4:
                                                                    if (!(Array.isArray(quoteOperationStep) &&
                                                                        quoteOperationStep.length > 0)) return [3 /*break*/, 6];
                                                                    return [4 /*yield*/, trx
                                                                            .insertInto("quoteOperationStep")
                                                                            .values(quoteOperationStep.map(function (_a) {
                                                                            var _id = _a.id, attribute = __rest(_a, ["id"]);
                                                                            return (__assign(__assign({}, attribute), { description: (0, tiptap_ts_1.toTiptapDoc)(attribute.description), operationId: operationId, companyId: companyId_1, createdBy: userId_1 }));
                                                                        }))
                                                                            .execute()];
                                                                case 5:
                                                                    _p.sent();
                                                                    _p.label = 6;
                                                                case 6: return [2 /*return*/];
                                                            }
                                                        });
                                                    };
                                                    _i = 0, _l = ((_h = sourceQuoteOperations.data) !== null && _h !== void 0 ? _h : []).entries();
                                                    _o.label = 5;
                                                case 5:
                                                    if (!(_i < _l.length)) return [3 /*break*/, 8];
                                                    _m = _l[_i], index = _m[0], operation = _m[1];
                                                    return [5 /*yield**/, _loop_16(index, operation)];
                                                case 6:
                                                    _o.sent();
                                                    _o.label = 7;
                                                case 7:
                                                    _i++;
                                                    return [3 /*break*/, 5];
                                                case 8: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a = true, _b = __asyncValues(Object.entries(oldLineToNewLineMap_1));
                                    _j.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _j.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                    return [5 /*yield**/, _loop_15()];
                                case 3:
                                    _j.sent();
                                    _j.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_11_1 = _j.sent();
                                    e_11 = { error: e_11_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _j.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 8:
                                    _j.sent();
                                    _j.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_11) throw e_11.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 78:
                _42.sent();
                if (newQuoteId_1) {
                    return [2 /*return*/, new Response(JSON.stringify({
                            success: true,
                            newQuoteId: newQuoteId_1,
                        }), {
                            headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                            status: 200,
                        })];
                }
                return [3 /*break*/, 80];
            case 79: throw new Error("Invalid type  ".concat(type));
            case 80: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 81:
                err_1 = _42.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 82: return [2 /*return*/];
        }
    });
}); });
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
                            error: null,
                        }];
            }
        });
    });
}
function getMethodTreeArray(client, makeMethodId) {
    return client.rpc("get_method_tree", {
        uid: makeMethodId,
    });
}
function getMethodTreeArrayToTree(items) {
    function traverseAndRenameIds(node) {
        var clone = structuredClone(node);
        clone.id = (0, mod_ts_1.nanoid)(20);
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
            // @ts-ignore - we add data on the next line
            lookup[itemId] = { id: itemId, children: [] };
        }
        lookup[itemId]["data"] = item;
        var treeItem = lookup[itemId];
        if (parentId === null || parentId === undefined) {
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
    return rootItems.map(function (item) { return traverseAndRenameIds(item); });
}
function getFieldKey(field, id) {
    return "".concat(field, ":").concat(id);
}
function insertProcedureDataForJobOperation(trx, client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var operationId, procedureId, companyId, userId, procedure, attributes, parameters;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    operationId = args.operationId, procedureId = args.procedureId, companyId = args.companyId, userId = args.userId;
                    return [4 /*yield*/, client
                            .from("procedure")
                            .select("*, procedureStep(*), procedureParameter(*)")
                            .eq("id", procedureId)
                            .eq("companyId", companyId)
                            .single()];
                case 1:
                    procedure = _g.sent();
                    if (procedure.error)
                        return [2 /*return*/];
                    attributes = (_b = (_a = procedure.data) === null || _a === void 0 ? void 0 : _a.procedureStep) !== null && _b !== void 0 ? _b : [];
                    parameters = (_d = (_c = procedure.data) === null || _c === void 0 ? void 0 : _c.procedureParameter) !== null && _d !== void 0 ? _d : [];
                    if (!(attributes.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, trx
                            .insertInto("jobOperationStep")
                            .values(attributes.map(function (attr) {
                            var _id = attr.id, _procedureId = attr.procedureId, _createdAt = attr.createdAt, rest = __rest(attr, ["id", "procedureId", "createdAt"]);
                            return __assign(__assign({}, rest), { description: (0, tiptap_ts_1.toTiptapDoc)(rest.description), operationId: operationId, companyId: companyId, createdBy: userId });
                        }))
                            .execute()];
                case 2:
                    _g.sent();
                    _g.label = 3;
                case 3:
                    if (!(parameters.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, trx
                            .insertInto("jobOperationParameter")
                            .values(parameters.map(function (param) {
                            var _id = param.id, _procedureId = param.procedureId, _createdAt = param.createdAt, rest = __rest(param, ["id", "procedureId", "createdAt"]);
                            return __assign(__assign({}, rest), { operationId: operationId, companyId: companyId, createdBy: userId });
                        }))
                            .execute()];
                case 4:
                    _g.sent();
                    _g.label = 5;
                case 5: return [4 /*yield*/, trx
                        .updateTable("jobOperation")
                        .set({
                        workInstruction: (_f = (_e = procedure === null || procedure === void 0 ? void 0 : procedure.data) === null || _e === void 0 ? void 0 : _e.content) !== null && _f !== void 0 ? _f : {},
                    })
                        .where("id", "=", operationId)
                        .execute()];
                case 6:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function hydrateConfiguration(client, configuration, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var materialParams, materialKeys_1, entries, itemIds, items, itemIdToMaterialId, materialIds, materials, materialsByMaterialId, transformed, _i, entries_1, _a, key, value, itemId_9, materialId, material, err_5;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    _q.trys.push([0, 4, , 5]);
                    if (!configuration || !itemId || Object.keys(configuration).length === 0) {
                        return [2 /*return*/, configuration];
                    }
                    return [4 /*yield*/, client
                            .from("configurationParameter")
                            .select("key")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .eq("dataType", "material")];
                case 1:
                    materialParams = _q.sent();
                    if (materialParams.error)
                        return [2 /*return*/, configuration];
                    materialKeys_1 = new Set(((_b = materialParams.data) !== null && _b !== void 0 ? _b : []).map(function (p) { return p.key; }));
                    if (materialKeys_1.size === 0)
                        return [2 /*return*/, configuration];
                    entries = Object.entries(configuration).filter(function (_a) {
                        var key = _a[0], value = _a[1];
                        return materialKeys_1.has(key) && typeof value === "string" && value;
                    });
                    if (entries.length === 0)
                        return [2 /*return*/, configuration];
                    itemIds = entries.map(function (_a) {
                        var value = _a[1];
                        return value;
                    });
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id, readableId")
                            .in("id", itemIds)
                            .eq("companyId", companyId)];
                case 2:
                    items = _q.sent();
                    if (items.error)
                        return [2 /*return*/, configuration];
                    itemIdToMaterialId = new Map((_d = (_c = items.data) === null || _c === void 0 ? void 0 : _c.map(function (i) { return [i.id, i.readableId]; })) !== null && _d !== void 0 ? _d : []);
                    materialIds = (_f = (_e = items.data) === null || _e === void 0 ? void 0 : _e.map(function (i) { return i.readableId; })) !== null && _f !== void 0 ? _f : [];
                    return [4 /*yield*/, client
                            .from("material")
                            .select("id, materialFormId, materialSubstanceId, materialTypeId, dimensionId, finishId, gradeId")
                            .in("id", materialIds)
                            .eq("companyId", companyId)];
                case 3:
                    materials = _q.sent();
                    if (materials.error)
                        return [2 /*return*/, configuration];
                    materialsByMaterialId = new Map((_h = (_g = materials.data) === null || _g === void 0 ? void 0 : _g.map(function (m) { return [m.id, m]; })) !== null && _h !== void 0 ? _h : []);
                    transformed = __assign({}, configuration);
                    for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        _a = entries_1[_i], key = _a[0], value = _a[1];
                        itemId_9 = value;
                        materialId = itemIdToMaterialId.get(itemId_9);
                        if (materialId) {
                            material = materialsByMaterialId.get(materialId);
                            if (material) {
                                transformed[key] = {
                                    id: itemId_9,
                                    materialFormId: (_j = material.materialFormId) !== null && _j !== void 0 ? _j : null,
                                    materialSubstanceId: (_k = material.materialSubstanceId) !== null && _k !== void 0 ? _k : null,
                                    materialTypeId: (_l = material.materialTypeId) !== null && _l !== void 0 ? _l : null,
                                    dimensionId: (_m = material.dimensionId) !== null && _m !== void 0 ? _m : null,
                                    finishId: (_o = material.finishId) !== null && _o !== void 0 ? _o : null,
                                    gradeId: (_p = material.gradeId) !== null && _p !== void 0 ? _p : null,
                                };
                            }
                        }
                    }
                    return [2 /*return*/, transformed];
                case 4:
                    err_5 = _q.sent();
                    console.error(err_5);
                    return [2 /*return*/, configuration];
                case 5: return [2 /*return*/];
            }
        });
    });
}
