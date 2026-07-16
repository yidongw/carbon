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
var database_ts_1 = require("../lib/database.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var utils_ts_1 = require("../lib/utils.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var onShapeDataValidator = npm_zod__3_24_1_1.default.object({
    index: npm_zod__3_24_1_1.default.string(),
    id: npm_zod__3_24_1_1.default.string().optional(),
    readableId: npm_zod__3_24_1_1.default.string().optional(),
    revision: npm_zod__3_24_1_1.default.string().optional(),
    name: npm_zod__3_24_1_1.default.string(),
    quantity: npm_zod__3_24_1_1.default.number(),
    replenishmentSystem: npm_zod__3_24_1_1.default.enum(["Make", "Buy", "Buy and Make"]),
    defaultMethodType: npm_zod__3_24_1_1.default.enum(["Make to Order", "Purchase to Order", "Pull from Inventory"]),
    data: npm_zod__3_24_1_1.default.record(npm_zod__3_24_1_1.default.string(), npm_zod__3_24_1_1.default.any()),
});
var payloadValidator = npm_zod__3_24_1_1.default.discriminatedUnion("type", [
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("onshape"),
        makeMethodId: npm_zod__3_24_1_1.default.string(),
        data: onShapeDataValidator.array(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
]);
function copyMakeMethodOperations(trx, sourceMakeMethodId, targetMakeMethodId, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var sourceOperations, _loop_1, _i, sourceOperations_1, operation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trx
                        .selectFrom("methodOperation")
                        .selectAll()
                        .where("makeMethodId", "=", sourceMakeMethodId)
                        .where("companyId", "=", companyId)
                        .execute()];
                case 1:
                    sourceOperations = _a.sent();
                    if (sourceOperations.length === 0)
                        return [2 /*return*/];
                    _loop_1 = function (operation) {
                        var oldOpId, _createdAt, _updatedAt, _updatedBy, opData, newOperation, tools, parameters, steps;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    oldOpId = operation.id, _createdAt = operation.createdAt, _updatedAt = operation.updatedAt, _updatedBy = operation.updatedBy, opData = __rest(operation, ["id", "createdAt", "updatedAt", "updatedBy"]);
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperation")
                                            .values(__assign(__assign({}, opData), { makeMethodId: targetMakeMethodId, createdBy: userId }))
                                            .returning(["id"])
                                            .executeTakeFirst()];
                                case 1:
                                    newOperation = _b.sent();
                                    if (!newOperation)
                                        return [2 /*return*/, "continue"];
                                    return [4 /*yield*/, trx
                                            .selectFrom("methodOperationTool")
                                            .selectAll()
                                            .where("operationId", "=", oldOpId)
                                            .execute()];
                                case 2:
                                    tools = _b.sent();
                                    if (!(tools.length > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperationTool")
                                            .values(tools.map(function (_a) {
                                            var _id = _a.id, _createdAt = _a.createdAt, _updatedAt = _a.updatedAt, _updatedBy = _a.updatedBy, tool = __rest(_a, ["id", "createdAt", "updatedAt", "updatedBy"]);
                                            return (__assign(__assign({}, tool), { operationId: newOperation.id, createdBy: userId }));
                                        }))
                                            .execute()];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4: return [4 /*yield*/, trx
                                        .selectFrom("methodOperationParameter")
                                        .selectAll()
                                        .where("operationId", "=", oldOpId)
                                        .execute()];
                                case 5:
                                    parameters = _b.sent();
                                    if (!(parameters.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperationParameter")
                                            .values(parameters.map(function (_a) {
                                            var _id = _a.id, _createdAt = _a.createdAt, _updatedAt = _a.updatedAt, _updatedBy = _a.updatedBy, param = __rest(_a, ["id", "createdAt", "updatedAt", "updatedBy"]);
                                            return (__assign(__assign({}, param), { operationId: newOperation.id, createdBy: userId }));
                                        }))
                                            .execute()];
                                case 6:
                                    _b.sent();
                                    _b.label = 7;
                                case 7: return [4 /*yield*/, trx
                                        .selectFrom("methodOperationStep")
                                        .selectAll()
                                        .where("operationId", "=", oldOpId)
                                        .execute()];
                                case 8:
                                    steps = _b.sent();
                                    if (!(steps.length > 0)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, trx
                                            .insertInto("methodOperationStep")
                                            .values(steps.map(function (_a) {
                                            var _id = _a.id, _createdAt = _a.createdAt, _updatedAt = _a.updatedAt, _updatedBy = _a.updatedBy, step = __rest(_a, ["id", "createdAt", "updatedAt", "updatedBy"]);
                                            return (__assign(__assign({}, step), { operationId: newOperation.id, createdBy: userId }));
                                        }))
                                            .execute()];
                                case 9:
                                    _b.sent();
                                    _b.label = 10;
                                case 10: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, sourceOperations_1 = sourceOperations;
                    _a.label = 2;
                case 2:
                    if (!(_i < sourceOperations_1.length)) return [3 /*break*/, 5];
                    operation = sourceOperations_1[_i];
                    return [5 /*yield**/, _loop_1(operation)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, _a, type, companyId, userId, _b, makeMethodId, data, client, topLevelMakeMethod, activeMakeMethodId_1, topLevelSourceMakeMethodId_1, existingDraft, allVersions, maxVersion, newVersion, newTopLevelMakeMethod, existingItemIds, _c, existingMakeMethods, existingItems, existingMakeMethodsByItemId_1, existingItemsByItemId_1, sortedData, buildTree, tree_1, err_1;
    var _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _o.sent();
                _a = payloadValidator.parse(payload), type = _a.type, companyId = _a.companyId, userId = _a.userId;
                _b = type;
                switch (_b) {
                    case "onshape": return [3 /*break*/, 2];
                }
                return [3 /*break*/, 15];
            case 2:
                makeMethodId = payload.makeMethodId, data = payload.data;
                console.log({
                    function: "sync",
                    type: type,
                    makeMethodId: makeMethodId,
                    data: data,
                    companyId: companyId,
                    userId: userId,
                });
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId, userId, { update: "resources" })];
            case 3:
                client = _o.sent();
                return [4 /*yield*/, client
                        .from("makeMethod")
                        .select("id, itemId, version, status")
                        .eq("id", makeMethodId)
                        .single()];
            case 4:
                topLevelMakeMethod = _o.sent();
                activeMakeMethodId_1 = makeMethodId;
                topLevelSourceMakeMethodId_1 = null;
                if (!(((_d = topLevelMakeMethod.data) === null || _d === void 0 ? void 0 : _d.status) === "Active")) return [3 /*break*/, 9];
                return [4 /*yield*/, client
                        .from("makeMethod")
                        .select("id, version")
                        .eq("itemId", topLevelMakeMethod.data.itemId)
                        .eq("status", "Draft")
                        .eq("companyId", companyId)
                        .order("version", { ascending: false })
                        .limit(1)
                        .maybeSingle()];
            case 5:
                existingDraft = _o.sent();
                if (!existingDraft.data) return [3 /*break*/, 6];
                // Use the existing Draft
                activeMakeMethodId_1 = existingDraft.data.id;
                return [3 /*break*/, 9];
            case 6: return [4 /*yield*/, client
                    .from("makeMethod")
                    .select("version")
                    .eq("itemId", topLevelMakeMethod.data.itemId)
                    .eq("companyId", companyId)
                    .order("version", { ascending: false })
                    .limit(1)
                    .maybeSingle()];
            case 7:
                allVersions = _o.sent();
                maxVersion = Number((_f = (_e = allVersions.data) === null || _e === void 0 ? void 0 : _e.version) !== null && _f !== void 0 ? _f : 0);
                newVersion = maxVersion + 1;
                console.log({
                    function: "sync",
                    action: "creating_top_level_draft",
                    itemId: topLevelMakeMethod.data.itemId,
                    maxVersion: maxVersion,
                    newVersion: newVersion,
                });
                return [4 /*yield*/, client
                        .from("makeMethod")
                        .insert({
                        itemId: topLevelMakeMethod.data.itemId,
                        version: newVersion,
                        status: "Draft",
                        companyId: companyId,
                        createdBy: userId,
                    })
                        .select("id")
                        .single()];
            case 8:
                newTopLevelMakeMethod = _o.sent();
                if (newTopLevelMakeMethod.data) {
                    activeMakeMethodId_1 = newTopLevelMakeMethod.data.id;
                    topLevelSourceMakeMethodId_1 = makeMethodId;
                }
                _o.label = 9;
            case 9:
                existingItemIds = new Set(data.map(function (item) { return item.id; }).filter(Boolean));
                return [4 /*yield*/, Promise.all([
                        client
                            .from("activeMakeMethods")
                            .select("id, itemId, version, status")
                            .eq("companyId", companyId)
                            .in("itemId", Array.from(existingItemIds)),
                        client
                            .from("item")
                            .select("id, readableId, readableIdWithRevision, unitOfMeasureCode, type, revision")
                            .eq("companyId", companyId)
                            .in("id", Array.from(existingItemIds)),
                    ])];
            case 10:
                _c = _o.sent(), existingMakeMethods = _c[0], existingItems = _c[1];
                console.log({
                    function: "sync",
                    action: "fetched_active_make_methods",
                    count: (_h = (_g = existingMakeMethods.data) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0,
                    data: existingMakeMethods.data,
                });
                existingMakeMethodsByItemId_1 = new Map((_k = (_j = existingMakeMethods.data) === null || _j === void 0 ? void 0 : _j.map(function (makeMethod) { return [
                    makeMethod.itemId,
                    {
                        id: makeMethod.id,
                        itemId: makeMethod.itemId,
                        version: Number(makeMethod.version),
                        status: makeMethod.status,
                    },
                ]; })) !== null && _k !== void 0 ? _k : []);
                existingItemsByItemId_1 = new Map((_m = (_l = existingItems.data) === null || _l === void 0 ? void 0 : _l.map(function (item) { return [item.id, item]; })) !== null && _m !== void 0 ? _m : []);
                _o.label = 11;
            case 11:
                _o.trys.push([11, 13, , 14]);
                sortedData = __spreadArray([], data, true).sort(function (a, b) {
                    var aIndices = a.index.toString().split(".");
                    var bIndices = b.index.toString().split(".");
                    // Compare each level of the index
                    for (var i = 0; i < Math.min(aIndices.length, bIndices.length); i++) {
                        var aVal = parseInt(aIndices[i]);
                        var bVal = parseInt(bIndices[i]);
                        if (aVal !== bVal) {
                            return aVal - bVal;
                        }
                    }
                    // If one index is a prefix of the other, the shorter one comes first
                    return aIndices.length - bIndices.length;
                });
                buildTree = function (d) {
                    var result = [];
                    var nodeMap = new Map();
                    d.forEach(function (item) {
                        var indexStr = item.index.toString();
                        var node = {
                            data: item,
                            children: [],
                            level: indexStr.split(".").length,
                        };
                        nodeMap.set(indexStr, node);
                        // Find parent node
                        var lastDotIndex = indexStr.lastIndexOf(".");
                        if (lastDotIndex === -1) {
                            // This is a root node
                            result.push(node);
                        }
                        else {
                            // This is a child node
                            var parentIndex = indexStr.substring(0, lastDotIndex);
                            var parentNode = nodeMap.get(parentIndex);
                            if (parentNode) {
                                parentNode.children.push(node);
                            }
                        }
                    });
                    return result;
                };
                tree_1 = buildTree(sortedData);
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        function traverseTree(node, parentMakeMethodId, index) {
                            return __awaiter(this, void 0, void 0, function () {
                                var data, children, id, readableId, revision, name, quantity, replenishmentSystem, defaultMethodType, partId, externalPartId, isMade, itemId, item, materialMakeMethodId, existingMakeMethod, existingDraft, makeMethodInfo, maxVersionRow, maxVersion, newVersion, newMakeMethod, newMakeMethodInfo, triggerCreatedMakeMethod, makeMethodInfo, newMakeMethod, makeMethodInfo, _a, children_1, children_1_1, child, childIndex, e_2_1;
                                var _b, e_2, _c, _d;
                                var _e, _f, _g, _h, _j;
                                return __generator(this, function (_k) {
                                    switch (_k.label) {
                                        case 0:
                                            data = node.data, children = node.children;
                                            id = data.id, readableId = data.readableId, revision = data.revision, name = data.name, quantity = data.quantity, replenishmentSystem = data.replenishmentSystem, defaultMethodType = data.defaultMethodType;
                                            partId = readableId || name;
                                            if (!partId)
                                                return [2 /*return*/];
                                            externalPartId = (0, utils_ts_1.getReadableIdWithRevision)(partId, revision);
                                            isMade = children.length > 0;
                                            itemId = id;
                                            if (!itemId) return [3 /*break*/, 4];
                                            // Update existing item
                                            return [4 /*yield*/, trx
                                                    .updateTable("item")
                                                    .set({
                                                    updatedBy: userId,
                                                    updatedAt: new Date().toISOString(),
                                                })
                                                    .where("id", "=", itemId)
                                                    .execute()];
                                        case 1:
                                            // Update existing item
                                            _k.sent();
                                            return [4 /*yield*/, trx
                                                    .deleteFrom("externalIntegrationMapping")
                                                    .where("entityType", "=", "item")
                                                    .where("entityId", "=", itemId)
                                                    .where("integration", "=", "onshapeData")
                                                    .execute()];
                                        case 2:
                                            _k.sent();
                                            return [4 /*yield*/, trx
                                                    .insertInto("externalIntegrationMapping")
                                                    .values({
                                                    entityType: "item",
                                                    entityId: itemId,
                                                    integration: "onshapeData",
                                                    externalId: externalPartId,
                                                    metadata: data.data,
                                                    companyId: companyId,
                                                    allowDuplicateExternalId: false,
                                                })
                                                    .onConflict(function (oc) {
                                                    return oc
                                                        .columns([
                                                        "integration",
                                                        "externalId",
                                                        "entityType",
                                                        "companyId",
                                                    ])
                                                        .where("allowDuplicateExternalId", "=", false)
                                                        .doUpdateSet({
                                                        entityId: itemId,
                                                        metadata: data.data,
                                                        updatedAt: new Date().toISOString(),
                                                    });
                                                })
                                                    .execute()];
                                        case 3:
                                            _k.sent();
                                            return [3 /*break*/, 9];
                                        case 4:
                                            // Check if we've already created this part in this transaction
                                            itemId = newlyCreatedItemsByPartId.get(partId);
                                            if (!!itemId) return [3 /*break*/, 9];
                                            return [4 /*yield*/, trx
                                                    .insertInto("item")
                                                    .values({
                                                    readableId: partId,
                                                    revision: revision !== null && revision !== void 0 ? revision : "0",
                                                    name: name,
                                                    type: "Part",
                                                    unitOfMeasureCode: "EA",
                                                    itemTrackingType: "Inventory",
                                                    replenishmentSystem: replenishmentSystem,
                                                    defaultMethodType: defaultMethodType,
                                                    companyId: companyId,
                                                    createdBy: userId,
                                                })
                                                    .returning(["id"])
                                                    .executeTakeFirst()];
                                        case 5:
                                            item = _k.sent();
                                            itemId = item === null || item === void 0 ? void 0 : item.id;
                                            if (!itemId) return [3 /*break*/, 7];
                                            return [4 /*yield*/, trx
                                                    .insertInto("externalIntegrationMapping")
                                                    .values({
                                                    entityType: "item",
                                                    entityId: itemId,
                                                    integration: "onshapeData",
                                                    externalId: externalPartId,
                                                    metadata: data.data,
                                                    companyId: companyId,
                                                    allowDuplicateExternalId: false,
                                                })
                                                    .onConflict(function (oc) {
                                                    return oc
                                                        .columns([
                                                        "integration",
                                                        "externalId",
                                                        "entityType",
                                                        "companyId",
                                                    ])
                                                        .where("allowDuplicateExternalId", "=", false)
                                                        .doUpdateSet({
                                                        entityId: itemId,
                                                        metadata: data.data,
                                                        updatedAt: new Date().toISOString(),
                                                    });
                                                })
                                                    .execute()];
                                        case 6:
                                            _k.sent();
                                            _k.label = 7;
                                        case 7: return [4 /*yield*/, trx
                                                .insertInto("part")
                                                .values({
                                                id: partId,
                                                companyId: companyId,
                                                createdBy: userId,
                                            })
                                                .onConflict(function (oc) {
                                                return oc.columns(["id", "companyId"]).doUpdateSet({
                                                    updatedBy: userId,
                                                    updatedAt: new Date().toISOString(),
                                                });
                                            })
                                                .execute()];
                                        case 8:
                                            _k.sent();
                                            // Store the newly created item to avoid duplicate inserts
                                            if (itemId) {
                                                newlyCreatedItemsByPartId.set(partId, itemId);
                                                // Also update our existing items map for later reference
                                                existingItemsByItemId_1.set(itemId, {
                                                    id: itemId,
                                                    readableId: partId,
                                                    readableIdWithRevision: (0, utils_ts_1.getReadableIdWithRevision)(partId, revision),
                                                    revision: revision !== null && revision !== void 0 ? revision : "0",
                                                    unitOfMeasureCode: "EA",
                                                    type: "Part",
                                                });
                                            }
                                            _k.label = 9;
                                        case 9:
                                            if (!itemId)
                                                throw new Error("Failed to create item");
                                            existingMakeMethod = existingMakeMethodsByItemId_1.get(itemId) ||
                                                newlyCreatedMakeMethodsByItemId.get(itemId);
                                            console.log({
                                                function: "sync",
                                                action: "processing_item",
                                                itemId: itemId,
                                                partId: partId,
                                                isMade: isMade,
                                                defaultMethodType: defaultMethodType,
                                                existingMakeMethod: existingMakeMethod !== null && existingMakeMethod !== void 0 ? existingMakeMethod : null,
                                            });
                                            if (!(defaultMethodType === "Make to Order" || isMade)) return [3 /*break*/, 21];
                                            if (!existingMakeMethod) return [3 /*break*/, 17];
                                            if (!(existingMakeMethod.status === "Draft")) return [3 /*break*/, 10];
                                            // Draft - use existing make method directly
                                            materialMakeMethodId = existingMakeMethod.id;
                                            return [3 /*break*/, 16];
                                        case 10: return [4 /*yield*/, trx
                                                .selectFrom("makeMethod")
                                                .select(["id", "version"])
                                                .where("itemId", "=", itemId)
                                                .where("status", "=", "Draft")
                                                .where("companyId", "=", companyId)
                                                .orderBy("version", "desc")
                                                .executeTakeFirst()];
                                        case 11:
                                            existingDraft = _k.sent();
                                            console.log({
                                                function: "sync",
                                                action: "check_existing_draft",
                                                itemId: itemId,
                                                companyId: companyId,
                                                existingDraft: existingDraft !== null && existingDraft !== void 0 ? existingDraft : null,
                                            });
                                            if (!existingDraft) return [3 /*break*/, 12];
                                            // Use the existing Draft
                                            materialMakeMethodId = existingDraft.id;
                                            makeMethodInfo = {
                                                id: existingDraft.id,
                                                itemId: itemId,
                                                version: Number(existingDraft.version),
                                                status: "Draft",
                                            };
                                            newlyCreatedMakeMethodsByItemId.set(itemId, makeMethodInfo);
                                            existingMakeMethodsByItemId_1.set(itemId, makeMethodInfo);
                                            return [3 /*break*/, 16];
                                        case 12: return [4 /*yield*/, trx
                                                .selectFrom("makeMethod")
                                                .select(["version"])
                                                .where("itemId", "=", itemId)
                                                .where("companyId", "=", companyId)
                                                .orderBy("version", "desc")
                                                .executeTakeFirst()];
                                        case 13:
                                            maxVersionRow = _k.sent();
                                            maxVersion = Number((_e = maxVersionRow === null || maxVersionRow === void 0 ? void 0 : maxVersionRow.version) !== null && _e !== void 0 ? _e : 0);
                                            newVersion = maxVersion + 1;
                                            console.log({
                                                function: "sync",
                                                action: "creating_child_draft",
                                                itemId: itemId,
                                                companyId: companyId,
                                                maxVersionRow: maxVersionRow !== null && maxVersionRow !== void 0 ? maxVersionRow : null,
                                                maxVersion: maxVersion,
                                                newVersion: newVersion,
                                            });
                                            return [4 /*yield*/, trx
                                                    .insertInto("makeMethod")
                                                    .values({
                                                    itemId: itemId,
                                                    version: newVersion,
                                                    status: "Draft",
                                                    companyId: companyId,
                                                    createdBy: userId,
                                                })
                                                    .returning(["id"])
                                                    .executeTakeFirst()];
                                        case 14:
                                            newMakeMethod = _k.sent();
                                            if (!newMakeMethod) return [3 /*break*/, 16];
                                            materialMakeMethodId = newMakeMethod.id;
                                            // Copy operations from active version to new draft
                                            return [4 /*yield*/, copyMakeMethodOperations(trx, existingMakeMethod.id, newMakeMethod.id, companyId, userId)];
                                        case 15:
                                            // Copy operations from active version to new draft
                                            _k.sent();
                                            newMakeMethodInfo = {
                                                id: newMakeMethod.id,
                                                itemId: itemId,
                                                version: newVersion,
                                                status: "Draft",
                                            };
                                            newlyCreatedMakeMethodsByItemId.set(itemId, newMakeMethodInfo);
                                            existingMakeMethodsByItemId_1.set(itemId, newMakeMethodInfo);
                                            _k.label = 16;
                                        case 16: return [3 /*break*/, 21];
                                        case 17: return [4 /*yield*/, trx
                                                .selectFrom("makeMethod")
                                                .select(["id", "version", "status"])
                                                .where("itemId", "=", itemId)
                                                .executeTakeFirst()];
                                        case 18:
                                            triggerCreatedMakeMethod = _k.sent();
                                            if (!triggerCreatedMakeMethod) return [3 /*break*/, 19];
                                            materialMakeMethodId = triggerCreatedMakeMethod.id;
                                            makeMethodInfo = {
                                                id: triggerCreatedMakeMethod.id,
                                                itemId: itemId,
                                                version: Number(triggerCreatedMakeMethod.version),
                                                status: triggerCreatedMakeMethod.status,
                                            };
                                            newlyCreatedMakeMethodsByItemId.set(itemId, makeMethodInfo);
                                            existingMakeMethodsByItemId_1.set(itemId, makeMethodInfo);
                                            return [3 /*break*/, 21];
                                        case 19: return [4 /*yield*/, trx
                                                .insertInto("makeMethod")
                                                .values({
                                                itemId: itemId,
                                                companyId: companyId,
                                                createdBy: userId,
                                            })
                                                .returning(["id"])
                                                .executeTakeFirst()];
                                        case 20:
                                            newMakeMethod = _k.sent();
                                            materialMakeMethodId = newMakeMethod === null || newMakeMethod === void 0 ? void 0 : newMakeMethod.id;
                                            if (materialMakeMethodId) {
                                                makeMethodInfo = {
                                                    id: materialMakeMethodId,
                                                    itemId: itemId,
                                                    version: 1,
                                                    status: "Draft",
                                                };
                                                newlyCreatedMakeMethodsByItemId.set(itemId, makeMethodInfo);
                                                existingMakeMethodsByItemId_1.set(itemId, makeMethodInfo);
                                            }
                                            _k.label = 21;
                                        case 21: return [4 /*yield*/, trx
                                                .insertInto("methodMaterial")
                                                .values({
                                                itemId: itemId,
                                                quantity: quantity !== null && quantity !== void 0 ? quantity : 1,
                                                makeMethodId: parentMakeMethodId,
                                                materialMakeMethodId: materialMakeMethodId,
                                                methodType: defaultMethodType,
                                                order: index,
                                                itemType: (_g = (_f = existingItemsByItemId_1.get(itemId)) === null || _f === void 0 ? void 0 : _f.type) !== null && _g !== void 0 ? _g : "Part",
                                                unitOfMeasureCode: (_j = (_h = existingItemsByItemId_1.get(itemId)) === null || _h === void 0 ? void 0 : _h.unitOfMeasureCode) !== null && _j !== void 0 ? _j : "EA",
                                                companyId: companyId,
                                                createdBy: userId,
                                            })
                                                .execute()];
                                        case 22:
                                            _k.sent();
                                            if (!materialMakeMethodId) return [3 /*break*/, 36];
                                            return [4 /*yield*/, trx
                                                    .deleteFrom("methodMaterial")
                                                    .where("makeMethodId", "=", materialMakeMethodId)
                                                    .execute()];
                                        case 23:
                                            _k.sent();
                                            _k.label = 24;
                                        case 24:
                                            _k.trys.push([24, 30, 31, 36]);
                                            _a = true, children_1 = __asyncValues(children);
                                            _k.label = 25;
                                        case 25: return [4 /*yield*/, children_1.next()];
                                        case 26:
                                            if (!(children_1_1 = _k.sent(), _b = children_1_1.done, !_b)) return [3 /*break*/, 29];
                                            _d = children_1_1.value;
                                            _a = false;
                                            child = _d;
                                            childIndex = children.indexOf(child);
                                            return [4 /*yield*/, traverseTree(child, materialMakeMethodId, childIndex)];
                                        case 27:
                                            _k.sent();
                                            _k.label = 28;
                                        case 28:
                                            _a = true;
                                            return [3 /*break*/, 25];
                                        case 29: return [3 /*break*/, 36];
                                        case 30:
                                            e_2_1 = _k.sent();
                                            e_2 = { error: e_2_1 };
                                            return [3 /*break*/, 36];
                                        case 31:
                                            _k.trys.push([31, , 34, 35]);
                                            if (!(!_a && !_b && (_c = children_1.return))) return [3 /*break*/, 33];
                                            return [4 /*yield*/, _c.call(children_1)];
                                        case 32:
                                            _k.sent();
                                            _k.label = 33;
                                        case 33: return [3 /*break*/, 35];
                                        case 34:
                                            if (e_2) throw e_2.error;
                                            return [7 /*endfinally*/];
                                        case 35: return [7 /*endfinally*/];
                                        case 36: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                        var newlyCreatedItemsByPartId, newlyCreatedMakeMethodsByItemId, index, _a, tree_2, tree_2_1, node, e_1_1;
                        var _b, e_1, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    if (!topLevelSourceMakeMethodId_1) return [3 /*break*/, 2];
                                    return [4 /*yield*/, copyMakeMethodOperations(trx, topLevelSourceMakeMethodId_1, activeMakeMethodId_1, companyId, userId)];
                                case 1:
                                    _e.sent();
                                    _e.label = 2;
                                case 2: return [4 /*yield*/, trx
                                        .deleteFrom("methodMaterial")
                                        .where("makeMethodId", "=", activeMakeMethodId_1)
                                        .execute()];
                                case 3:
                                    _e.sent();
                                    newlyCreatedItemsByPartId = new Map();
                                    newlyCreatedMakeMethodsByItemId = new Map();
                                    index = 0;
                                    _e.label = 4;
                                case 4:
                                    _e.trys.push([4, 10, 11, 16]);
                                    _a = true, tree_2 = __asyncValues(tree_1);
                                    _e.label = 5;
                                case 5: return [4 /*yield*/, tree_2.next()];
                                case 6:
                                    if (!(tree_2_1 = _e.sent(), _b = tree_2_1.done, !_b)) return [3 /*break*/, 9];
                                    _d = tree_2_1.value;
                                    _a = false;
                                    node = _d;
                                    return [4 /*yield*/, traverseTree(node, activeMakeMethodId_1, index)];
                                case 7:
                                    _e.sent();
                                    index++;
                                    _e.label = 8;
                                case 8:
                                    _a = true;
                                    return [3 /*break*/, 5];
                                case 9: return [3 /*break*/, 16];
                                case 10:
                                    e_1_1 = _e.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 16];
                                case 11:
                                    _e.trys.push([11, , 14, 15]);
                                    if (!(!_a && !_b && (_c = tree_2.return))) return [3 /*break*/, 13];
                                    return [4 /*yield*/, _c.call(tree_2)];
                                case 12:
                                    _e.sent();
                                    _e.label = 13;
                                case 13: return [3 /*break*/, 15];
                                case 14:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 15: return [7 /*endfinally*/];
                                case 16: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 12:
                _o.sent();
                return [3 /*break*/, 14];
            case 13:
                err_1 = _o.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 14: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                    makeMethodId: activeMakeMethodId_1,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 15: return [2 /*return*/];
        }
    });
}); });
