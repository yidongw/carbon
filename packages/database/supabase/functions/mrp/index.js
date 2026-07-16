"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var date_1 = require("npm:@internationalized/date");
var database_ts_1 = require("../lib/database.ts");
var mrp_engine_ts_1 = require("../lib/mrp-engine.ts");
var npm_kysely_1 = require("npm:kysely");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var WEEKS_TO_FORECAST = 18 * 4;
var payloadValidator = npm_zod__3_24_1_1.default.discriminatedUnion("type", [
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("company"),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("location"),
        id: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("item"),
        id: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("job"),
        id: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("purchaseOrder"),
        id: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("salesOrder"),
        id: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
]);
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, parsedPayload, type, companyId, userId, today, ranges, periods, client, locations, _a, salesOrderLines, jobMaterialLines, productionLines, purchaseOrderLines, demandProjections, _b, allItems, allReplenishments, replenishmentSystemByItem, _i, allItems_1, item, leadTimeByItem, _c, allReplenishments_1, rep, inventoryRows, baseInventoryByLocationItem, _d, inventoryRows_1, row, activeMethodsResult, methodIdByItem, _e, _f, m, allMethodIds, allMaterials, materialsByMethodId, _g, allMaterials_1, mat, existing, bomByItem, _h, methodIdByItem_1, _j, itemId, methodId, materials, children, _k, materials_1, mat, jobSupplyByLocationPeriodItem, _l, _m, line, dueDate, period, periodKey, poSupplyByLocationPeriodItem, _o, _p, line, dueDate, period, periodKey, grossDemand, salesDemandByKey, jobMaterialDemandByKey, topLevelContributors, _q, _r, projection, netDemand, periodKey, plannedProduction, key, projectionId, contributors, _s, _t, line, promiseDate, period, key, actualKey, contributors, _u, _v, line, dueDate, requiredDate, period, key, actualKey, contributors, jobAndPoSupplyByLocationPeriodItem, _w, poSupplyByLocationPeriodItem_1, _x, key, qty, _y, bomDerivedDemand, demandContributors, demandForecastMap, demandForecastSourceInserts, _z, bomDerivedDemand_1, _0, key, qty, _1, locationId, periodId, itemId, forecastKey, existing, contributors, _2, contributors_1, c, demandActualsMap, supplyActualsMap, _3, _4, existingDemandActuals, demandActualsError, _5, existingSupplyActuals, supplyActualsError, _6, existingDemandActuals_1, existing, key, _7, salesDemandByKey_1, _8, key, quantity, _9, jobMaterialDemandByKey_1, _10, key, quantity, _11, existingSupplyActuals_1, existing, key, _12, jobSupplyByLocationPeriodItem_1, _13, key, quantity, _14, locationId, periodId, itemId, actualKey, _15, poSupplyByLocationPeriodItem_2, _16, key, quantity, _17, locationId, periodId, itemId, actualKey, demandForecastUpserts, demandActualUpserts, supplyActualUpserts, BATCH_SIZE, i, batch, i, batch, i, batch, i, batch, err_1, err_2;
    var _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50;
    return __generator(this, function (_51) {
        switch (_51.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _51.sent();
                parsedPayload = payloadValidator.parse(payload);
                type = parsedPayload.type, companyId = parsedPayload.companyId, userId = parsedPayload.userId;
                console.log({ function: "mrp", type: type, companyId: companyId, userId: userId });
                today = (0, date_1.today)((0, date_1.getLocalTimeZone)());
                ranges = getStartAndEndDates(today, "Week");
                return [4 /*yield*/, getOrCreateDemandPeriods(db, ranges, "Week")];
            case 2:
                periods = _51.sent();
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId, userId, { update: "production" })];
            case 3:
                client = _51.sent();
                return [4 /*yield*/, client
                        .from("location")
                        .select("*")
                        .eq("companyId", companyId)];
            case 4:
                locations = _51.sent();
                if (locations.error)
                    throw locations.error;
                _51.label = 5;
            case 5:
                _51.trys.push([5, 35, , 36]);
                return [4 /*yield*/, Promise.all([
                        client.from("openSalesOrderLines").select("*").eq("companyId", companyId),
                        client
                            .from("openJobMaterialLines")
                            .select("*")
                            .eq("companyId", companyId),
                        client
                            .from("openProductionOrders")
                            .select("*")
                            .eq("companyId", companyId),
                        client
                            .from("openPurchaseOrderLines")
                            .select("*")
                            .eq("companyId", companyId),
                        client
                            .from("demandProjection")
                            .select("*")
                            .eq("companyId", companyId)
                            .in("periodId", periods.map(function (p) { var _a; return (_a = p.id) !== null && _a !== void 0 ? _a : ""; }).filter(Boolean)),
                    ])];
            case 6:
                _a = _51.sent(), salesOrderLines = _a[0], jobMaterialLines = _a[1], productionLines = _a[2], purchaseOrderLines = _a[3], demandProjections = _a[4];
                if (salesOrderLines.error)
                    throw new Error("Failed to load sales order lines");
                if (jobMaterialLines.error)
                    throw new Error("Failed to load job material lines");
                if (productionLines.error)
                    throw new Error("Failed to load production orders");
                if (purchaseOrderLines.error)
                    throw new Error("Failed to load purchase order lines");
                if (demandProjections.error)
                    throw new Error("Failed to load demand projections");
                return [4 /*yield*/, Promise.all([
                        db
                            .selectFrom("item")
                            .select(["id", "replenishmentSystem"])
                            .where("companyId", "=", companyId)
                            .execute(),
                        db
                            .selectFrom("itemReplenishment")
                            .select(["itemId", "leadTime"])
                            .where("companyId", "=", companyId)
                            .execute(),
                    ])];
            case 7:
                _b = _51.sent(), allItems = _b[0], allReplenishments = _b[1];
                replenishmentSystemByItem = new Map();
                for (_i = 0, allItems_1 = allItems; _i < allItems_1.length; _i++) {
                    item = allItems_1[_i];
                    replenishmentSystemByItem.set(item.id, item.replenishmentSystem);
                }
                leadTimeByItem = new Map();
                for (_c = 0, allReplenishments_1 = allReplenishments; _c < allReplenishments_1.length; _c++) {
                    rep = allReplenishments_1[_c];
                    leadTimeByItem.set(rep.itemId, (_18 = rep.leadTime) !== null && _18 !== void 0 ? _18 : 7);
                }
                return [4 /*yield*/, db
                        .selectFrom("itemLedger")
                        .select(["itemId", "locationId"])
                        .select((0, npm_kysely_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SUM(\"quantity\")"], ["SUM(\"quantity\")"]))).as("quantityOnHand"))
                        .where("companyId", "=", companyId)
                        .groupBy(["itemId", "locationId"])
                        .execute()];
            case 8:
                inventoryRows = _51.sent();
                baseInventoryByLocationItem = new Map();
                for (_d = 0, inventoryRows_1 = inventoryRows; _d < inventoryRows_1.length; _d++) {
                    row = inventoryRows_1[_d];
                    if (row.itemId && row.locationId) {
                        baseInventoryByLocationItem.set("".concat(row.locationId, "-").concat(row.itemId), Number(row.quantityOnHand) || 0);
                    }
                }
                return [4 /*yield*/, client
                        .from("activeMakeMethods")
                        .select("id, itemId")
                        .eq("companyId", companyId)];
            case 9:
                activeMethodsResult = _51.sent();
                if (activeMethodsResult.error)
                    throw activeMethodsResult.error;
                methodIdByItem = new Map();
                for (_e = 0, _f = activeMethodsResult.data; _e < _f.length; _e++) {
                    m = _f[_e];
                    if (m.id && m.itemId) {
                        methodIdByItem.set(m.itemId, m.id);
                    }
                }
                allMethodIds = Array.from(methodIdByItem.values());
                allMaterials = [];
                if (!(allMethodIds.length > 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, db
                        .selectFrom("methodMaterial")
                        .select([
                        "id",
                        "makeMethodId",
                        "materialMakeMethodId",
                        "itemId",
                        "quantity",
                        "methodType",
                    ])
                        .where("companyId", "=", companyId)
                        .where("makeMethodId", "in", allMethodIds)
                        .execute()];
            case 10:
                allMaterials = (_51.sent());
                _51.label = 11;
            case 11:
                materialsByMethodId = new Map();
                for (_g = 0, allMaterials_1 = allMaterials; _g < allMaterials_1.length; _g++) {
                    mat = allMaterials_1[_g];
                    existing = (_19 = materialsByMethodId.get(mat.makeMethodId)) !== null && _19 !== void 0 ? _19 : [];
                    existing.push(mat);
                    materialsByMethodId.set(mat.makeMethodId, existing);
                }
                bomByItem = new Map();
                for (_h = 0, methodIdByItem_1 = methodIdByItem; _h < methodIdByItem_1.length; _h++) {
                    _j = methodIdByItem_1[_h], itemId = _j[0], methodId = _j[1];
                    materials = (_20 = materialsByMethodId.get(methodId)) !== null && _20 !== void 0 ? _20 : [];
                    children = [];
                    for (_k = 0, materials_1 = materials; _k < materials_1.length; _k++) {
                        mat = materials_1[_k];
                        children.push({
                            itemId: mat.itemId,
                            quantity: Number(mat.quantity) || 1,
                            methodType: mat.methodType,
                        });
                    }
                    if (children.length > 0) {
                        bomByItem.set(itemId, children);
                    }
                }
                jobSupplyByLocationPeriodItem = new Map();
                for (_l = 0, _m = productionLines.data; _l < _m.length; _l++) {
                    line = _m[_l];
                    if (!line.itemId || !line.quantityToReceive)
                        continue;
                    dueDate = line.dueDate
                        ? (0, date_1.parseDate)(line.dueDate)
                        : line.deadlineType === "No Deadline"
                            ? today.add({ days: 30 })
                            : today;
                    period = findPeriod(dueDate, today, periods);
                    if (!period)
                        continue;
                    periodKey = "".concat((_21 = line.locationId) !== null && _21 !== void 0 ? _21 : "", "-").concat((_22 = period.id) !== null && _22 !== void 0 ? _22 : "", "-").concat(line.itemId);
                    jobSupplyByLocationPeriodItem.set(periodKey, ((_23 = jobSupplyByLocationPeriodItem.get(periodKey)) !== null && _23 !== void 0 ? _23 : 0) + line.quantityToReceive);
                }
                poSupplyByLocationPeriodItem = new Map();
                for (_o = 0, _p = purchaseOrderLines.data; _o < _p.length; _o++) {
                    line = _p[_o];
                    if (!line.itemId || !line.quantityToReceive)
                        continue;
                    dueDate = line.promisedDate
                        ? (0, date_1.parseDate)(line.promisedDate)
                        : line.orderDate
                            ? (0, date_1.parseDate)(line.orderDate).add({ days: (_24 = line.leadTime) !== null && _24 !== void 0 ? _24 : 7 })
                            : today.add({ days: (_25 = line.leadTime) !== null && _25 !== void 0 ? _25 : 7 });
                    period = findPeriod(dueDate, today, periods);
                    if (!period)
                        continue;
                    periodKey = "".concat((_26 = line.locationId) !== null && _26 !== void 0 ? _26 : "", "-").concat((_27 = period.id) !== null && _27 !== void 0 ? _27 : "", "-").concat(line.itemId);
                    poSupplyByLocationPeriodItem.set(periodKey, ((_28 = poSupplyByLocationPeriodItem.get(periodKey)) !== null && _28 !== void 0 ? _28 : 0) + line.quantityToReceive);
                }
                grossDemand = new Map();
                salesDemandByKey = new Map();
                jobMaterialDemandByKey = new Map();
                topLevelContributors = new Map();
                // Demand projections (netted against production supply)
                for (_q = 0, _r = demandProjections.data; _q < _r.length; _q++) {
                    projection = _r[_q];
                    if (!projection.itemId || !projection.forecastQuantity)
                        continue;
                    netDemand = projection.forecastQuantity;
                    periodKey = "".concat((_29 = projection.locationId) !== null && _29 !== void 0 ? _29 : "", "-").concat(projection.periodId, "-").concat(projection.itemId);
                    plannedProduction = (_30 = jobSupplyByLocationPeriodItem.get(periodKey)) !== null && _30 !== void 0 ? _30 : 0;
                    netDemand = Math.max(0, projection.forecastQuantity - plannedProduction);
                    if (netDemand > 0) {
                        key = "".concat((_31 = projection.locationId) !== null && _31 !== void 0 ? _31 : "", "-").concat(projection.periodId, "-").concat(projection.itemId);
                        grossDemand.set(key, ((_32 = grossDemand.get(key)) !== null && _32 !== void 0 ? _32 : 0) + netDemand);
                        projectionId = projection.id;
                        if (projectionId && projection.itemId) {
                            contributors = (_33 = topLevelContributors.get(key)) !== null && _33 !== void 0 ? _33 : [];
                            contributors.push({
                                sourceType: "Demand Projection",
                                demandProjectionId: projectionId,
                                parentItemId: projection.itemId,
                                quantity: netDemand,
                            });
                            topLevelContributors.set(key, contributors);
                        }
                    }
                }
                // Sales order lines
                for (_s = 0, _t = salesOrderLines.data; _s < _t.length; _s++) {
                    line = _t[_s];
                    if (!line.itemId || !line.quantityToSend)
                        continue;
                    promiseDate = line.promisedDate
                        ? (0, date_1.parseDate)(line.promisedDate)
                        : today;
                    period = findPeriod(promiseDate, today, periods);
                    if (!period)
                        continue;
                    key = "".concat((_34 = line.locationId) !== null && _34 !== void 0 ? _34 : "", "-").concat((_35 = period.id) !== null && _35 !== void 0 ? _35 : "", "-").concat(line.itemId);
                    grossDemand.set(key, ((_36 = grossDemand.get(key)) !== null && _36 !== void 0 ? _36 : 0) + line.quantityToSend);
                    actualKey = "".concat(line.itemId, "-").concat((_37 = line.locationId) !== null && _37 !== void 0 ? _37 : "", "-").concat((_38 = period.id) !== null && _38 !== void 0 ? _38 : "", "-Sales Order");
                    salesDemandByKey.set(actualKey, ((_39 = salesDemandByKey.get(actualKey)) !== null && _39 !== void 0 ? _39 : 0) + line.quantityToSend);
                    if (line.id && line.itemId) {
                        contributors = (_40 = topLevelContributors.get(key)) !== null && _40 !== void 0 ? _40 : [];
                        contributors.push({
                            sourceType: "Sales Order",
                            salesOrderLineId: line.id,
                            parentItemId: line.itemId,
                            quantity: line.quantityToSend,
                        });
                        topLevelContributors.set(key, contributors);
                    }
                }
                // Job material lines
                for (_u = 0, _v = jobMaterialLines.data; _u < _v.length; _u++) {
                    line = _v[_u];
                    if (!line.itemId || !line.quantityToIssue)
                        continue;
                    dueDate = line.dueDate ? (0, date_1.parseDate)(line.dueDate) : today;
                    requiredDate = dueDate.add({ days: -((_41 = line.leadTime) !== null && _41 !== void 0 ? _41 : 7) });
                    period = findPeriod(requiredDate, today, periods);
                    if (!period)
                        continue;
                    key = "".concat((_42 = line.locationId) !== null && _42 !== void 0 ? _42 : "", "-").concat((_43 = period.id) !== null && _43 !== void 0 ? _43 : "", "-").concat(line.itemId);
                    grossDemand.set(key, ((_44 = grossDemand.get(key)) !== null && _44 !== void 0 ? _44 : 0) + line.quantityToIssue);
                    actualKey = "".concat(line.itemId, "-").concat((_45 = line.locationId) !== null && _45 !== void 0 ? _45 : "", "-").concat((_46 = period.id) !== null && _46 !== void 0 ? _46 : "", "-Job Material");
                    jobMaterialDemandByKey.set(actualKey, ((_47 = jobMaterialDemandByKey.get(actualKey)) !== null && _47 !== void 0 ? _47 : 0) + line.quantityToIssue);
                    if (line.jobId && line.itemId) {
                        contributors = (_48 = topLevelContributors.get(key)) !== null && _48 !== void 0 ? _48 : [];
                        contributors.push({
                            sourceType: "Job Material",
                            jobId: line.jobId,
                            parentItemId: line.itemId,
                            quantity: line.quantityToIssue,
                        });
                        topLevelContributors.set(key, contributors);
                    }
                }
                jobAndPoSupplyByLocationPeriodItem = new Map(jobSupplyByLocationPeriodItem);
                for (_w = 0, poSupplyByLocationPeriodItem_1 = poSupplyByLocationPeriodItem; _w < poSupplyByLocationPeriodItem_1.length; _w++) {
                    _x = poSupplyByLocationPeriodItem_1[_w], key = _x[0], qty = _x[1];
                    jobAndPoSupplyByLocationPeriodItem.set(key, ((_49 = jobAndPoSupplyByLocationPeriodItem.get(key)) !== null && _49 !== void 0 ? _49 : 0) + qty);
                }
                _y = (0, mrp_engine_ts_1.explodeBom)({
                    grossDemand: grossDemand,
                    bomByItem: bomByItem,
                    replenishmentSystemByItem: replenishmentSystemByItem,
                    leadTimeByItem: leadTimeByItem,
                    periods: periods.map(function (p) { var _a; return ({ id: (_a = p.id) !== null && _a !== void 0 ? _a : "" }); }),
                    onHandByLocationItem: new Map(baseInventoryByLocationItem),
                    jobSupplyByLocationPeriodItem: jobAndPoSupplyByLocationPeriodItem,
                    topLevelContributors: topLevelContributors,
                }), bomDerivedDemand = _y.bomDerivedDemand, demandContributors = _y.demandContributors;
                demandForecastMap = new Map();
                demandForecastSourceInserts = [];
                for (_z = 0, bomDerivedDemand_1 = bomDerivedDemand; _z < bomDerivedDemand_1.length; _z++) {
                    _0 = bomDerivedDemand_1[_z], key = _0[0], qty = _0[1];
                    if (qty <= 0)
                        continue;
                    _1 = (0, mrp_engine_ts_1.splitKey)(key), locationId = _1[0], periodId = _1[1], itemId = _1[2];
                    forecastKey = "".concat(itemId, "-").concat(locationId, "-").concat(periodId);
                    existing = demandForecastMap.get(forecastKey);
                    if (existing) {
                        existing.forecastQuantity = Number(existing.forecastQuantity) + qty;
                    }
                    else {
                        demandForecastMap.set(forecastKey, {
                            itemId: itemId,
                            locationId: locationId,
                            periodId: periodId,
                            forecastQuantity: qty,
                            forecastMethod: "mrp",
                            companyId: companyId,
                            createdBy: userId,
                            updatedBy: userId,
                        });
                    }
                    contributors = (_50 = demandContributors.get(key)) !== null && _50 !== void 0 ? _50 : [];
                    for (_2 = 0, contributors_1 = contributors; _2 < contributors_1.length; _2++) {
                        c = contributors_1[_2];
                        if (c.quantity <= 0)
                            continue;
                        if (c.sourceType === "Job Material") {
                            demandForecastSourceInserts.push({
                                itemId: itemId,
                                locationId: locationId,
                                periodId: periodId,
                                sourceType: "Job Material",
                                jobId: c.jobId,
                                salesOrderLineId: null,
                                demandProjectionId: null,
                                parentItemId: c.parentItemId,
                                quantity: c.quantity,
                                companyId: companyId,
                            });
                        }
                        else if (c.sourceType === "Sales Order") {
                            demandForecastSourceInserts.push({
                                itemId: itemId,
                                locationId: locationId,
                                periodId: periodId,
                                sourceType: "Sales Order",
                                jobId: null,
                                salesOrderLineId: c.salesOrderLineId,
                                demandProjectionId: null,
                                parentItemId: c.parentItemId,
                                quantity: c.quantity,
                                companyId: companyId,
                            });
                        }
                        else {
                            // sourceType === "Demand Projection"
                            demandForecastSourceInserts.push({
                                itemId: itemId,
                                locationId: locationId,
                                periodId: periodId,
                                sourceType: "Demand Projection",
                                jobId: null,
                                salesOrderLineId: null,
                                demandProjectionId: c.demandProjectionId,
                                parentItemId: c.parentItemId,
                                quantity: c.quantity,
                                companyId: companyId,
                            });
                        }
                    }
                }
                demandActualsMap = new Map();
                supplyActualsMap = new Map();
                return [4 /*yield*/, Promise.all([
                        client
                            .from("demandActual")
                            .select("*")
                            .eq("companyId", companyId)
                            .in("periodId", periods.map(function (p) { var _a; return (_a = p.id) !== null && _a !== void 0 ? _a : ""; })),
                        client
                            .from("supplyActual")
                            .select("*")
                            .eq("companyId", companyId)
                            .in("periodId", periods.map(function (p) { var _a; return (_a = p.id) !== null && _a !== void 0 ? _a : ""; }).filter(Boolean)),
                    ])];
            case 12:
                _3 = _51.sent(), _4 = _3[0], existingDemandActuals = _4.data, demandActualsError = _4.error, _5 = _3[1], existingSupplyActuals = _5.data, supplyActualsError = _5.error;
                if (demandActualsError)
                    throw demandActualsError;
                if (supplyActualsError)
                    throw supplyActualsError;
                // Zero out existing demand actuals (they'll be overwritten if still relevant)
                if (existingDemandActuals) {
                    for (_6 = 0, existingDemandActuals_1 = existingDemandActuals; _6 < existingDemandActuals_1.length; _6++) {
                        existing = existingDemandActuals_1[_6];
                        key = "".concat(existing.itemId, "-").concat(existing.locationId, "-").concat(existing.periodId, "-").concat(existing.sourceType);
                        demandActualsMap.set(key, {
                            itemId: existing.itemId,
                            locationId: existing.locationId,
                            periodId: existing.periodId,
                            actualQuantity: 0,
                            sourceType: existing.sourceType,
                            companyId: companyId,
                            createdBy: userId,
                            updatedBy: userId,
                        });
                    }
                }
                // Sales order demand actuals
                for (_7 = 0, salesDemandByKey_1 = salesDemandByKey; _7 < salesDemandByKey_1.length; _7++) {
                    _8 = salesDemandByKey_1[_7], key = _8[0], quantity = _8[1];
                    if (quantity > 0) {
                        demandActualsMap.set(key, {
                            itemId: key.split("-")[0],
                            locationId: key.split("-")[1],
                            periodId: key.split("-")[2],
                            actualQuantity: quantity,
                            sourceType: "Sales Order",
                            companyId: companyId,
                            createdBy: userId,
                            updatedBy: userId,
                        });
                    }
                }
                // Job material demand actuals
                for (_9 = 0, jobMaterialDemandByKey_1 = jobMaterialDemandByKey; _9 < jobMaterialDemandByKey_1.length; _9++) {
                    _10 = jobMaterialDemandByKey_1[_9], key = _10[0], quantity = _10[1];
                    if (quantity > 0) {
                        demandActualsMap.set(key, {
                            itemId: key.split("-")[0],
                            locationId: key.split("-")[1],
                            periodId: key.split("-")[2],
                            actualQuantity: quantity,
                            sourceType: "Job Material",
                            companyId: companyId,
                            createdBy: userId,
                            updatedBy: userId,
                        });
                    }
                }
                // Zero out existing supply actuals
                if (existingSupplyActuals) {
                    for (_11 = 0, existingSupplyActuals_1 = existingSupplyActuals; _11 < existingSupplyActuals_1.length; _11++) {
                        existing = existingSupplyActuals_1[_11];
                        key = "".concat(existing.itemId, "-").concat(existing.locationId, "-").concat(existing.periodId, "-").concat(existing.sourceType);
                        supplyActualsMap.set(key, {
                            itemId: existing.itemId,
                            locationId: existing.locationId,
                            periodId: existing.periodId,
                            actualQuantity: 0,
                            sourceType: existing.sourceType,
                            companyId: companyId,
                            createdBy: userId,
                            updatedBy: userId,
                        });
                    }
                }
                // Production order supply actuals
                for (_12 = 0, jobSupplyByLocationPeriodItem_1 = jobSupplyByLocationPeriodItem; _12 < jobSupplyByLocationPeriodItem_1.length; _12++) {
                    _13 = jobSupplyByLocationPeriodItem_1[_12], key = _13[0], quantity = _13[1];
                    if (quantity > 0) {
                        _14 = key.split("-"), locationId = _14[0], periodId = _14[1], itemId = _14[2];
                        actualKey = "".concat(itemId, "-").concat(locationId, "-").concat(periodId, "-Production Order");
                        supplyActualsMap.set(actualKey, {
                            itemId: itemId,
                            locationId: locationId,
                            periodId: periodId,
                            actualQuantity: quantity,
                            sourceType: "Production Order",
                            companyId: companyId,
                            createdBy: userId,
                            updatedBy: userId,
                        });
                    }
                }
                // Purchase order supply actuals
                for (_15 = 0, poSupplyByLocationPeriodItem_2 = poSupplyByLocationPeriodItem; _15 < poSupplyByLocationPeriodItem_2.length; _15++) {
                    _16 = poSupplyByLocationPeriodItem_2[_15], key = _16[0], quantity = _16[1];
                    if (quantity > 0) {
                        _17 = key.split("-"), locationId = _17[0], periodId = _17[1], itemId = _17[2];
                        actualKey = "".concat(itemId, "-").concat(locationId, "-").concat(periodId, "-Purchase Order");
                        supplyActualsMap.set(actualKey, {
                            itemId: itemId,
                            locationId: locationId,
                            periodId: periodId,
                            actualQuantity: quantity,
                            sourceType: "Purchase Order",
                            companyId: companyId,
                            createdBy: userId,
                            updatedBy: userId,
                        });
                    }
                }
                demandForecastUpserts = Array.from(demandForecastMap.values());
                demandActualUpserts = Array.from(demandActualsMap.values());
                supplyActualUpserts = Array.from(supplyActualsMap.values());
                BATCH_SIZE = 500;
                _51.label = 13;
            case 13:
                _51.trys.push([13, 33, , 34]);
                // Delete existing MRP forecasts
                return [4 /*yield*/, db
                        .deleteFrom("demandForecast")
                        .where("companyId", "=", companyId)
                        .where("forecastMethod", "=", "mrp")
                        .execute()];
            case 14:
                // Delete existing MRP forecasts
                _51.sent();
                // Delete existing MRP forecast source rows. The demandForecast delete
                // above removes the parent rows; this removes their attribution rows.
                // demandForecastSource only ever holds MRP-derived rows.
                return [4 /*yield*/, db
                        .deleteFrom("demandForecastSource")
                        .where("companyId", "=", companyId)
                        .execute()];
            case 15:
                // Delete existing MRP forecast source rows. The demandForecast delete
                // above removes the parent rows; this removes their attribution rows.
                // demandForecastSource only ever holds MRP-derived rows.
                _51.sent();
                return [4 /*yield*/, db
                        .deleteFrom("supplyForecast")
                        .where("locationId", "in", locations.data.map(function (l) { return l.id; }))
                        .where("companyId", "=", companyId)
                        .execute()];
            case 16:
                _51.sent();
                i = 0;
                _51.label = 17;
            case 17:
                if (!(i < demandForecastUpserts.length)) return [3 /*break*/, 20];
                batch = demandForecastUpserts.slice(i, i + BATCH_SIZE);
                return [4 /*yield*/, db
                        .insertInto("demandForecast")
                        .values(batch)
                        .onConflict(function (oc) {
                        return oc.columns(["itemId", "locationId", "periodId"]).doUpdateSet({
                            forecastQuantity: function (eb) { return eb.ref("excluded.forecastQuantity"); },
                            forecastMethod: function (eb) { return eb.ref("excluded.forecastMethod"); },
                            updatedAt: new Date().toISOString(),
                            updatedBy: userId,
                        });
                    })
                        .execute()];
            case 18:
                _51.sent();
                _51.label = 19;
            case 19:
                i += BATCH_SIZE;
                return [3 /*break*/, 17];
            case 20:
                i = 0;
                _51.label = 21;
            case 21:
                if (!(i < demandForecastSourceInserts.length)) return [3 /*break*/, 24];
                batch = demandForecastSourceInserts.slice(i, i + BATCH_SIZE);
                return [4 /*yield*/, db
                        .insertInto("demandForecastSource")
                        .values(batch)
                        .execute()];
            case 22:
                _51.sent();
                _51.label = 23;
            case 23:
                i += BATCH_SIZE;
                return [3 /*break*/, 21];
            case 24:
                i = 0;
                _51.label = 25;
            case 25:
                if (!(i < demandActualUpserts.length)) return [3 /*break*/, 28];
                batch = demandActualUpserts.slice(i, i + BATCH_SIZE);
                return [4 /*yield*/, db
                        .insertInto("demandActual")
                        .values(batch)
                        .onConflict(function (oc) {
                        return oc
                            .columns(["itemId", "locationId", "periodId", "sourceType"])
                            .doUpdateSet({
                            actualQuantity: function (eb) { return eb.ref("excluded.actualQuantity"); },
                            updatedAt: new Date().toISOString(),
                            updatedBy: userId,
                        });
                    })
                        .execute()];
            case 26:
                _51.sent();
                _51.label = 27;
            case 27:
                i += BATCH_SIZE;
                return [3 /*break*/, 25];
            case 28:
                i = 0;
                _51.label = 29;
            case 29:
                if (!(i < supplyActualUpserts.length)) return [3 /*break*/, 32];
                batch = supplyActualUpserts.slice(i, i + BATCH_SIZE);
                return [4 /*yield*/, db
                        .insertInto("supplyActual")
                        .values(batch)
                        .onConflict(function (oc) {
                        return oc
                            .columns(["itemId", "locationId", "periodId", "sourceType"])
                            .doUpdateSet({
                            actualQuantity: function (eb) { return eb.ref("excluded.actualQuantity"); },
                            updatedAt: new Date().toISOString(),
                            updatedBy: userId,
                        });
                    })
                        .execute()];
            case 30:
                _51.sent();
                _51.label = 31;
            case 31:
                i += BATCH_SIZE;
                return [3 /*break*/, 29];
            case 32: return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 201,
                })];
            case 33:
                err_1 = _51.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 34: return [3 /*break*/, 36];
            case 35:
                err_2 = _51.sent();
                console.error(err_2);
                return [2 /*return*/, new Response(JSON.stringify(err_2), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 36: return [2 /*return*/];
        }
    });
}); });
// ──────────────────────────────────────────────────────────────
// Helper functions
// ──────────────────────────────────────────────────────────────
function findPeriod(date, today, periods) {
    if (date.compare(today) < 0) {
        return periods[0];
    }
    return periods.find(function (p) { var _a, _b; return ((_a = p.startDate) === null || _a === void 0 ? void 0 : _a.compare(date)) <= 0 && ((_b = p.endDate) === null || _b === void 0 ? void 0 : _b.compare(date)) >= 0; });
}
function getStartAndEndDates(today, groupBy) {
    var periods = [];
    var start = (0, date_1.startOfWeek)(today, "en-US");
    var end = start.add({ weeks: WEEKS_TO_FORECAST });
    switch (groupBy) {
        case "Week": {
            var currentStart = start;
            while (currentStart.compare(end) < 0) {
                var periodEnd = currentStart.add({ days: 6 });
                periods.push({
                    startDate: currentStart.toString(),
                    endDate: periodEnd.toString(),
                });
                currentStart = periodEnd.add({ days: 1 });
            }
            return periods;
        }
        case "Month":
            throw new Error("Not implemented");
        case "Day":
            throw new Error("Not implemented");
        default:
            throw new Error("Invalid groupBy");
    }
}
function getOrCreateDemandPeriods(db, periods, periodType) {
    return __awaiter(this, void 0, void 0, function () {
        var existingPeriods, existingPeriodMap, periodsToCreate, created;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db
                        .selectFrom("period")
                        .selectAll()
                        .where("startDate", "in", periods.map(function (p) { return p.startDate; }))
                        .where("periodType", "=", periodType)
                        .execute()];
                case 1:
                    existingPeriods = _a.sent();
                    if (existingPeriods.length === periods.length) {
                        return [2 /*return*/, existingPeriods.map(function (p) { return ({
                                id: p.id,
                                // @ts-ignore - we are getting Date objects here
                                startDate: (0, date_1.parseDate)(p.startDate.toISOString().split("T")[0]),
                                // @ts-ignore - we are getting Date objects here
                                endDate: (0, date_1.parseDate)(p.endDate.toISOString().split("T")[0]),
                                periodType: p.periodType,
                                createdAt: p.createdAt,
                            }); })];
                    }
                    existingPeriodMap = new Map(
                    // @ts-ignore - we are getting Date objects here
                    existingPeriods.map(function (p) { return [p.startDate.toISOString().split("T")[0], p]; }));
                    periodsToCreate = periods.filter(function (period) { return !existingPeriodMap.has(period.startDate); });
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .insertInto("period")
                                            .values(periodsToCreate.map(function (period) { return ({
                                            startDate: period.startDate,
                                            endDate: period.endDate,
                                            periodType: periodType,
                                            createdAt: new Date().toISOString(),
                                        }); }))
                                            .returningAll()
                                            .execute()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2:
                    created = _a.sent();
                    return [2 /*return*/, __spreadArray(__spreadArray([], existingPeriods, true), created, true).map(function (p) { return ({
                            id: p.id,
                            // @ts-ignore - we are getting Date objects here
                            startDate: (0, date_1.parseDate)(p.startDate.toISOString().split("T")[0]),
                            // @ts-ignore - we are getting Date objects here
                            endDate: (0, date_1.parseDate)(p.endDate.toISOString().split("T")[0]),
                            periodType: p.periodType,
                            createdAt: p.createdAt,
                        }); })];
            }
        });
    });
}
var templateObject_1;
