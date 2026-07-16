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
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var methods_ts_1 = require("../lib/methods.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = npm_zod__3_24_1_1.z.object({
    type: npm_zod__3_24_1_1.z.enum(["jobMakeMethodRequirements", "jobRequirements"]),
    id: npm_zod__3_24_1_1.z.string(),
    companyId: npm_zod__3_24_1_1.z.string(),
    userId: npm_zod__3_24_1_1.z.string(),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, _a, type, id, companyId, userId, client, _b, jobMakeMethodId, jobMakeMethod, parentQuantity_1, jobMaterial, job, jobMethodTrees, jobMethodTree_1, jobId, _c, job_1, jobMakeMethod, jobMethodTrees, jobMethodTree_2, err_1;
    var _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _j.sent();
                _j.label = 2;
            case 2:
                _j.trys.push([2, 18, , 19]);
                _a = payloadValidator.parse(payload), type = _a.type, id = _a.id, companyId = _a.companyId, userId = _a.userId;
                console.log({
                    function: "recalculate",
                    type: type,
                    id: id,
                    companyId: companyId,
                    userId: userId,
                });
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId, userId, { update: "production" })];
            case 3:
                client = _j.sent();
                _b = type;
                switch (_b) {
                    case "jobMakeMethodRequirements": return [3 /*break*/, 4];
                    case "jobRequirements": return [3 /*break*/, 12];
                }
                return [3 /*break*/, 16];
            case 4:
                jobMakeMethodId = id;
                return [4 /*yield*/, Promise.all([
                        client
                            .from("jobMakeMethod")
                            .select("*")
                            .eq("id", jobMakeMethodId)
                            .single(),
                    ])];
            case 5:
                jobMakeMethod = (_j.sent())[0];
                if (jobMakeMethod.error) {
                    throw new Error("Failed to get job makeMethod: ".concat(jobMakeMethod.error.message));
                }
                parentQuantity_1 = 1;
                if (!jobMakeMethod.data.parentMaterialId) return [3 /*break*/, 7];
                return [4 /*yield*/, client
                        .from("jobMaterial")
                        .select("*")
                        .eq("id", jobMakeMethod.data.parentMaterialId)
                        .single()];
            case 6:
                jobMaterial = _j.sent();
                if (((_d = jobMaterial.data) === null || _d === void 0 ? void 0 : _d.methodType) !== "Make to Order") {
                    return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                            headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                            status: 200,
                        })];
                }
                if (jobMaterial.error) {
                    throw new Error("Failed to get job material: ".concat(jobMaterial.error.message));
                }
                if (!jobMaterial.data) {
                    throw new Error("Job material not found for id: ".concat(jobMakeMethod.data.parentMaterialId));
                }
                if (jobMaterial.data.methodType !== "Make to Order") {
                    console.log("Job material ".concat(jobMakeMethod.data.parentMaterialId, " is not a 'Make' type. Skipping recalculation."));
                    return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                            headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                            status: 200,
                        })];
                }
                parentQuantity_1 =
                    (_e = jobMaterial.data.estimatedQuantity) !== null && _e !== void 0 ? _e : jobMaterial.data.quantity;
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, client
                    .from("job")
                    .select("*")
                    .eq("id", jobMakeMethod.data.jobId)
                    .single()];
            case 8:
                job = _j.sent();
                if (job.error) {
                    throw new Error("Failed to get job: ".concat(job.error.message));
                }
                parentQuantity_1 = (_f = job.data.productionQuantity) !== null && _f !== void 0 ? _f : 1;
                _j.label = 9;
            case 9: return [4 /*yield*/, (0, methods_ts_1.getJobMethodTree)(client, jobMakeMethod.data.id, jobMakeMethod.data.parentMaterialId)];
            case 10:
                jobMethodTrees = _j.sent();
                if (jobMethodTrees.error) {
                    throw new Error("Failed to get method tree: ".concat(jobMethodTrees.error.message));
                }
                jobMethodTree_1 = (_g = jobMethodTrees.data) === null || _g === void 0 ? void 0 : _g[0];
                if (!jobMethodTree_1) {
                    throw new Error("Method tree not found");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, updateJobQuantities(trx, jobMethodTree_1, parentQuantity_1)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 11:
                _j.sent();
                return [3 /*break*/, 17];
            case 12:
                jobId = id;
                return [4 /*yield*/, Promise.all([
                        client.from("job").select("*").eq("id", jobId).single(),
                        client
                            .from("jobMakeMethod")
                            .select("*")
                            .eq("jobId", jobId)
                            .is("parentMaterialId", null)
                            .single(),
                    ])];
            case 13:
                _c = _j.sent(), job_1 = _c[0], jobMakeMethod = _c[1];
                if (jobMakeMethod.error) {
                    throw new Error("Failed to get job make method: ".concat(jobMakeMethod.error.message));
                }
                return [4 /*yield*/, Promise.all([
                        (0, methods_ts_1.getJobMethodTree)(client, jobMakeMethod.data.id),
                    ])];
            case 14:
                jobMethodTrees = (_j.sent())[0];
                if (jobMethodTrees.error) {
                    throw new Error("Failed to get method tree: ".concat(jobMethodTrees.error.message));
                }
                jobMethodTree_2 = (_h = jobMethodTrees.data) === null || _h === void 0 ? void 0 : _h[0];
                if (!jobMethodTree_2) {
                    throw new Error("Method tree not found");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: 
                                // Use job.quantity as the root's target quantity (not productionQuantity)
                                // The item's scrap percentage will be applied within updateJobQuantities
                                return [4 /*yield*/, updateJobQuantities(trx, jobMethodTree_2, (_b = (_a = job_1.data) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 1)];
                                case 1:
                                    // Use job.quantity as the root's target quantity (not productionQuantity)
                                    // The item's scrap percentage will be applied within updateJobQuantities
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 15:
                _j.sent();
                return [3 /*break*/, 17];
            case 16: throw new Error("Invalid type  ".concat(type));
            case 17: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 18:
                err_1 = _j.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 19: return [2 /*return*/];
        }
    });
}); });
var updateJobQuantities = function (trx_1, tree_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([trx_1, tree_1], args_1, true), void 0, function (trx, tree, parentEstimatedQuantity) {
        var targetQuantity, scrapPercentage, jobMaterial, itemReplenishment, scrapQuantity, totalWithScrap, estimatedQuantity, jobMakeMethod, _a, _b, child;
        var _c;
        if (parentEstimatedQuantity === void 0) { parentEstimatedQuantity = 1; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    targetQuantity = tree.data.isRoot
                        ? parentEstimatedQuantity
                        : tree.data.quantity * parentEstimatedQuantity;
                    scrapPercentage = 0;
                    if (!(tree.data.methodType === "Make to Order")) return [3 /*break*/, 4];
                    return [4 /*yield*/, trx
                            .selectFrom("jobMaterial")
                            .select("itemScrapPercentage")
                            .where("id", "=", tree.id)
                            .executeTakeFirst()];
                case 1:
                    jobMaterial = _d.sent();
                    if (!((jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.itemScrapPercentage) != null &&
                        jobMaterial.itemScrapPercentage > 0)) return [3 /*break*/, 2];
                    scrapPercentage = Number(jobMaterial.itemScrapPercentage);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, trx
                        .selectFrom("itemReplenishment")
                        .select("scrapPercentage")
                        .where("itemId", "=", tree.data.itemId)
                        .executeTakeFirst()];
                case 3:
                    itemReplenishment = _d.sent();
                    scrapPercentage = Number((_c = itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.scrapPercentage) !== null && _c !== void 0 ? _c : 0);
                    _d.label = 4;
                case 4:
                    scrapQuantity = tree.data.methodType === "Make to Order" ? targetQuantity * scrapPercentage : 0;
                    totalWithScrap = Math.ceil(targetQuantity + scrapQuantity);
                    estimatedQuantity = tree.data.methodType === "Make to Order" ? targetQuantity : totalWithScrap;
                    // Update jobMaterial with scrap and estimated quantities
                    return [4 /*yield*/, trx
                            .updateTable("jobMaterial")
                            .set({
                            scrapQuantity: scrapQuantity,
                            estimatedQuantity: estimatedQuantity,
                        })
                            .where("id", "=", tree.id)
                            .execute()];
                case 5:
                    // Update jobMaterial with scrap and estimated quantities
                    _d.sent();
                    if (!tree.data.jobMaterialMakeMethodId) return [3 /*break*/, 8];
                    return [4 /*yield*/, Promise.all([
                            trx
                                .selectFrom("jobMakeMethod")
                                .select(["trackedEntityId", "requiresSerialTracking"])
                                .where("id", "=", tree.data.jobMaterialMakeMethodId)
                                .executeTakeFirst(),
                            trx
                                .updateTable("jobMakeMethod")
                                .set({ quantityPerParent: tree.data.quantity })
                                .where("id", "=", tree.data.jobMaterialMakeMethodId)
                                .execute(),
                            trx
                                .updateTable("jobOperation")
                                .set({
                                targetQuantity: targetQuantity,
                                operationQuantity: totalWithScrap,
                            })
                                .where("jobMakeMethodId", "=", tree.data.jobMaterialMakeMethodId)
                                .where("reworkId", "is", null)
                                .execute(),
                        ])];
                case 6:
                    jobMakeMethod = (_d.sent())[0];
                    if (!(jobMakeMethod === null || jobMakeMethod === void 0 ? void 0 : jobMakeMethod.trackedEntityId)) return [3 /*break*/, 8];
                    return [4 /*yield*/, trx
                            .updateTable("trackedEntity")
                            .set({
                            quantity: jobMakeMethod.requiresSerialTracking ? 1 : totalWithScrap,
                        })
                            .where("id", "=", jobMakeMethod.trackedEntityId)
                            .execute()];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8:
                    if (!tree.children) return [3 /*break*/, 12];
                    _a = 0, _b = tree.children;
                    _d.label = 9;
                case 9:
                    if (!(_a < _b.length)) return [3 /*break*/, 12];
                    child = _b[_a];
                    return [4 /*yield*/, updateJobQuantities(trx, child, totalWithScrap)];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11:
                    _a++;
                    return [3 /*break*/, 9];
                case 12: return [2 /*return*/];
            }
        });
    });
};
